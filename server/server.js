

const admin = require("firebase-admin");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// Firebase Admin SDK Setup
const serviceAccount = require("./firebase-admin-sdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Telegram Bot Setup
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Reference to Firebase Database
const db = admin.database();
const binsRef = db.ref("bins");
const driversRef = db.ref("drivers");

// Store drivers data in memory (live updates)
let driversData = {};

// Listen for driver updates in real-time
driversRef.on("value", (snapshot) => {
  driversData = snapshot.val() || {};
  console.log("🔄 Drivers Data Updated:", driversData);
});

// Function to send a Telegram message
function sendTelegramMessage(chatId, message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  axios
    .post(url, {
      chat_id: chatId,
      text: message,
    })
    .then((response) => {
      console.log(`✅ Message sent to driver (${chatId}):`, response.data);
    })
    .catch((error) => {
      console.error("❌ Telegram Error:", error.response.data);
    });
}

// Function to monitor bins and notify the correct driver
function monitorBins() {
  binsRef.on("value", (snapshot) => {
    const bins = snapshot.val();
    if (!bins) return;

    Object.keys(bins).forEach((binKey) => {
      const bin = bins[binKey];
      if (!bin.status || isNaN(bin.status)) return; // Skip if status is empty

      const binWard = bin.ward;

      // Get the latest driver for the ward
      const assignedDriver = Object.values(driversData).find(
        (driver) => driver.ward === binWard
      );

      if (!assignedDriver) {
        console.log(`⚠️ No driver found for ${binWard}`);
        return;
      }

      const chatId = assignedDriver.chatId;

      if (bin.status >= 80 && bin.status < 90) {
        sendTelegramMessage(
          chatId,
          `⚠️ Warning: Bin at ${bin.location} in ${binWard} is ${bin.status}% full. Get ready for collection.`
        );
      } else if (bin.status >= 90) {
        sendTelegramMessage(
          chatId,
          `🚨 Alert: Bin at ${bin.location} in ${binWard} is ${bin.status}% full. Please collect it.`
        );
      }
    });
  });
}

// Start Monitoring
console.log("🚀 Server is running and monitoring bin levels...");
monitorBins();
