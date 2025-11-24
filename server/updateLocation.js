// require('dotenv').config();
// const TelegramBot = require('node-telegram-bot-api');
// const admin = require("firebase-admin");
// const serviceAccount = require("./firebase-admin-sdk.json");

// // Initialize Firebase
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://smartwm-e1984-default-rtdb.firebaseio.com"
// });

// // Replace with your bot token
// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, "📍 Send your live location by clicking the 📍 icon.");
// });

// bot.on('location', async (msg) => {
//     const chatId = msg.chat.id;
//     const { latitude, longitude } = msg.location;
    
//     // Store in Firebase
//     await admin.database().ref(`drivers/${chatId}`).set({
//         latitude, longitude, name: msg.chat.first_name
//     });

//     bot.sendMessage(chatId, "✅ Location updated successfully!");
// });

// console.log("🚀 Telegram Bot is running...");

const TelegramBot = require("node-telegram-bot-api");
const admin = require("firebase-admin");

// Initialize Firebase
const serviceAccount = require("./firebase-admin-sdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smartwm-e1984-default-rtdb.firebaseio.com"
});

// Initialize Telegram Bot
const bot = new TelegramBot("TELEGRAM-BOT-KEY", { polling: true });

bot.on("location", async (msg) => {
  const chatId = msg.chat.id;
  const latitude = msg.location.latitude;
  const longitude = msg.location.longitude;

  console.log(`📍 Received Location: Lat=${latitude}, Long=${longitude} from ${chatId}`);

  // Update Firebase database
  try {
    const driversRef = admin.database().ref("drivers");
    const snapshot = await driversRef.once("value");
    let driverFound = false;

    snapshot.forEach((childSnapshot) => {
      const driver = childSnapshot.val();
      if (driver.chatId == chatId) {
        driverFound = true;
        childSnapshot.ref.update({ latitude, longitude });
      }
    });

    if (driverFound) {
      bot.sendMessage(chatId, "✅ Location updated successfully!");
    } else {
      bot.sendMessage(chatId, "⚠️ You are not registered as a driver!");
    }
  } catch (error) {
    console.error("❌ Error updating location:", error);
    bot.sendMessage(chatId, "❌ Error updating your location. Please try again.");
  }
});

console.log("🚀 Telegram Bot is running...");
