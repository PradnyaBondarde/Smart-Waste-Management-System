

// const admin = require("firebase-admin"); 
// const axios = require("axios");
// const TelegramBot = require("node-telegram-bot-api");
// const dotenv = require("dotenv");

// dotenv.config();

// // Firebase Admin SDK Setup
// const serviceAccount = require("./firebase-admin-sdk.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
// });

// // Telegram Bot Setup
// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// // Firebase References
// const db = admin.database();
// const binsRef = db.ref("bins");
// const driversRef = db.ref("drivers");

// // Store drivers data in memory (live updates)
// let driversData = {};

// // Listen for driver updates in real-time
// driversRef.on("value", (snapshot) => {
//   driversData = snapshot.val() || {};
//   console.log("🔄 Drivers Data Updated:", driversData);
// });

// // Function to send a Telegram message
// async function sendTelegramMessage(chatId, message) {
//   try {
//     const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//       chat_id: chatId,
//       text: message,
//     });
//     console.log(`✅ Message sent to driver (${chatId}):`, response.data);
//   } catch (error) {
//     console.error("❌ Telegram Error:", error.response?.data || error.message);
//   }
// }

// // Function to monitor bins and notify the correct driver
// function monitorBins() {
//   binsRef.on("value", (snapshot) => {
//     const bins = snapshot.val();
//     if (!bins) return;

//     Object.keys(bins).forEach((binKey) => {
//       const bin = bins[binKey];
//       if (!bin.status || isNaN(bin.status)) return; // Skip if status is empty

//       const binWard = bin.ward;

//       // Get the latest driver for the ward
//       const assignedDriver = Object.values(driversData).find(
//         (driver) => driver.ward === binWard
//       );

//       if (!assignedDriver) {
//         console.log(`⚠️ No driver found for ${binWard}`);
//         return;
//       }

//       const chatId = assignedDriver.chatId;

//       if (bin.status >= 80 && bin.status < 90) {
//         sendTelegramMessage(
//           chatId,
//           `⚠️ Warning: Bin at ${bin.location} in ${binWard} is ${bin.status}% full. Get ready for collection.`
//         );
//       } else if (bin.status >= 90) {
//         sendTelegramMessage(
//           chatId,
//           `🚨 Alert: Bin at ${bin.location} in ${binWard} is ${bin.status}% full. Please collect it.`
//         );

//         // Request driver's live location
//         sendTelegramMessage(
//           chatId,
//           "📍 Please send your live location by clicking the 📍 icon in Telegram."
//         );
//       }
//     });
//   });
// }

// // Handle Driver Location Updates
// bot.on("location", async (msg) => {
//   const chatId = msg.chat.id;
//   const { latitude, longitude } = msg.location;

//   console.log(`📍 Received Location: Lat=${latitude}, Long=${longitude} from ${chatId}`);

//   try {
//     const snapshot = await driversRef.once("value");
//     let driverFound = false;
//     let driverData = null;
    
//     snapshot.forEach((childSnapshot) => {
//       const driver = childSnapshot.val();
//       if (driver.chatId == chatId) {
//         driverFound = true;
//         childSnapshot.ref.update({ latitude, longitude });
//         driverData = driver;
//       }
//     });

//     if (driverFound) {
//       bot.sendMessage(chatId, "✅ Location updated successfully!");
//       if (driverData) {
//         sendOptimizedRoute(driverData.ward, chatId);
//       }
//     } else {
//       bot.sendMessage(chatId, "⚠️ You are not registered as a driver!");
//     }
//   } catch (error) {
//     console.error("❌ Error updating location:", error);
//     bot.sendMessage(chatId, "❌ Error updating your location. Please try again.");
//   }
// });

// // Function to generate optimized Google Maps route
// async function sendOptimizedRoute(ward, chatId) {
//   try {
//     const binsSnapshot = await binsRef.once("value");
//     const bins = binsSnapshot.val();
//     if (!bins) return;

//     const locations = Object.values(bins)
//       .filter(bin => bin.ward === ward && bin.status >= 70)
//       .map(bin => `${bin.latitude},${bin.longitude}`);

//     if (locations.length === 0) {
//       sendTelegramMessage(chatId, "✅ No bins require collection in your ward.");
//       return;
//     }

//     const googleMapsURL = `https://www.google.com/maps/dir/${locations.join("/")}`;
//     sendTelegramMessage(chatId, `📍 Optimized Route for Collection: ${googleMapsURL}`);
//   } catch (error) {
//     console.error("❌ Error fetching optimized route:", error);
//     sendTelegramMessage(chatId, "❌ Error generating route. Please try again.");
//   }
// }

// // Start Monitoring
// console.log("🚀 Server is running and monitoring bin levels...");
// monitorBins();

















// // //working code

// const admin = require("firebase-admin"); 
// const axios = require("axios");
// const TelegramBot = require("node-telegram-bot-api");
// const dotenv = require("dotenv");

// dotenv.config();

// // Firebase Admin SDK Setup
// const serviceAccount = require("./firebase-admin-sdk.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
// });

// // Telegram Bot Setup
// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// // Firebase References
// const db = admin.database();
// const binsRef = db.ref("bins");
// const driversRef = db.ref("drivers");

// // Store drivers data in memory (live updates)
// let driversData = {};

// // Listen for driver updates in real-time
// driversRef.on("value", (snapshot) => {
//   driversData = snapshot.val() || {};
//   console.log("🔄 Drivers Data Updated:", driversData);
// });

// // Function to send a Telegram message
// async function sendTelegramMessage(chatId, message) {
//   try {
//     await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//       chat_id: chatId,
//       text: message,
//       parse_mode: "Markdown",
//     });
//     console.log(`✅ Message sent to driver (${chatId})`);
//   } catch (error) {
//     console.error("❌ Telegram Error:", error.response?.data || error.message);
//   }
// }

// // Function to monitor bins and notify drivers
// function monitorBins() {
//   binsRef.on("value", (snapshot) => {
//     const bins = snapshot.val();
//     if (!bins) return;

//     Object.keys(bins).forEach((binKey) => {
//       const bin = bins[binKey];
//       if (!bin.status || isNaN(bin.status)) return;

//       const binWard = bin.ward;
//       const assignedDriver = Object.values(driversData).find(driver => driver.ward === binWard);

//       if (!assignedDriver) {
//         console.log(`⚠️ No driver found for ${binWard}`);
//         return;
//       }

//       const chatId = assignedDriver.chatId;

//       if (bin.status >= 80 && bin.status < 90) {
//         sendTelegramMessage(
//           chatId,
//           `⚠️ *Warning!*\n📍 *Bin Location:* ${bin.location} in *${binWard}*\n🟡 *Fill Level:* ${bin.status}%\n🚛 Get ready for collection.`
//         );
//       } else if (bin.status >= 90) {
//         sendTelegramMessage(
//           chatId,
//           `🚨 *Urgent Alert!*\n📍 *Bin Location:* ${bin.location} in *${binWard}*\n🔴 *Fill Level:* ${bin.status}%\n⚠️ Immediate collection required!`
//         );

//         // Request driver's live location
//         sendTelegramMessage(
//           chatId,
//           "📍 *Please send your live location* by clicking the 📍 icon in Telegram."
//         );
//       }
//     });
//   });
// }

// // Handle Driver Location Updates
// bot.on("location", async (msg) => {
//   const chatId = msg.chat.id;
//   const { latitude, longitude } = msg.location;

//   console.log(`📍 Received Location: Lat=${latitude}, Long=${longitude} from ${chatId}`);

//   try {
//     const snapshot = await driversRef.once("value");
//     let driverFound = false;
//     let driverData = null;
    
//     snapshot.forEach((childSnapshot) => {
//       const driver = childSnapshot.val();
//       if (driver.chatId == chatId) {
//         driverFound = true;
//         childSnapshot.ref.update({ latitude, longitude });
//         driverData = driver;
//       }
//     });

//     if (driverFound) {
//       bot.sendMessage(chatId, "✅ *Location updated successfully!*");
//       if (driverData) {
//         sendOptimizedRoute(driverData.ward, chatId);
//       }
//     } else {
//       bot.sendMessage(chatId, "⚠️ You are *not registered* as a driver!");
//     }
//   } catch (error) {
//     console.error("❌ Error updating location:", error);
//     bot.sendMessage(chatId, "❌ Error updating your location. Please try again.");
//   }
// });


// // Function to generate optimized Google Maps route starting from the driver’s location
// async function sendOptimizedRoute(ward, chatId) {
//     try {
//       const binsSnapshot = await binsRef.once("value");
//       const bins = binsSnapshot.val();
//       if (!bins) return;
  
//       // Get the driver's current location
//       const driver = Object.values(driversData).find(driver => driver.chatId == chatId);
//       if (!driver || !driver.latitude || !driver.longitude) {
//         sendTelegramMessage(chatId, "⚠️ Please share your live location first!");
//         return;
//       }
  
//       const driverLocation = `${driver.latitude},${driver.longitude}`;
  
//       // Filter bins that need collection (≥70% full)
//       const binsToCollect = Object.values(bins)
//         .filter(bin => bin.ward === ward && bin.status >= 70)
//         .map(bin => `${bin.latitude},${bin.longitude}`);
  
//       if (binsToCollect.length === 0) {
//         sendTelegramMessage(chatId, "✅ No bins require collection in your ward.");
//         return;
//       }
  
//       // Approximate coordinates for the Indi Road Dumping Site
//       const dumpingYard = "16.90,75.71";
  
//       // Construct Google Maps URL for navigation
//       const waypoints = binsToCollect.length > 0 ? `&waypoints=${binsToCollect.join("|")}` : "";
//       const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${driverLocation}&destination=${dumpingYard}${waypoints}&travelmode=driving`;
  
//       sendTelegramMessage(chatId, `📍 *Optimized Collection Route:*\n[Click here to start navigation](${googleMapsURL})`);
//     } catch (error) {
//       console.error("❌ Error fetching optimized route:", error);
//       sendTelegramMessage(chatId, "❌ Error generating route. Please try again.");
//     }
//   }
// // Start Monitoring
// console.log("🚀 Server is running and monitoring bin levels...");
// monitorBins();















import fs from 'fs';
import admin from 'firebase-admin';
import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

// Firebase Admin SDK Setup
const serviceAccount = JSON.parse(fs.readFileSync('./firebase-admin-sdk.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Telegram Bot Setup
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Firebase References
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
async function sendTelegramMessage(chatId, message) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
    console.log(`✅ Message sent to driver (${chatId})`);
  } catch (error) {
    console.error("❌ Telegram Error:", error.response?.data || error.message);
  }
}

// // Function to monitor bins and notify drivers
// function monitorBins() {
//   binsRef.on("value", (snapshot) => {
//     const bins = snapshot.val();
//     if (!bins) return;

//     Object.keys(bins).forEach((binKey) => {
//       const bin = bins[binKey];
//       if (!bin.status || isNaN(bin.status)) return;

//       const binWard = bin.ward;
//       const assignedDriver = Object.values(driversData).find(driver => driver.ward === binWard);

//       if (!assignedDriver) {
//         console.log(`⚠️ No driver found for ${binWard}`);
//         return;
//       }

//       const chatId = assignedDriver.chatId;

//       if (bin.status >= 80 && bin.status < 90) {
//         sendTelegramMessage(
//           chatId,
//           `⚠️ *Warning!*\n📍 *Bin Location:* ${bin.location} in *${binWard}*\n🟡 *Fill Level:* ${bin.status}%\n🚛 Get ready for collection.`
//         );
//       } else if (bin.status >= 90) {
//         sendTelegramMessage(
//           chatId,
//           `🚨 *Urgent Alert!*\n📍 *Bin Location:* ${bin.location} in *${binWard}*\n🔴 *Fill Level:* ${bin.status}%\n⚠️ Immediate collection required!`
//         );

//         // Request driver's live location
//         sendTelegramMessage(
//           chatId,
//           "📍 *Please send your live location* by clicking the 📍 icon in Telegram."
//         );
//       }
//     });
//   });
// }


function monitorBins() {
  let binStatusCache = {}; // Initialize it before using

  binsRef.on("value", (snapshot) => {
    const bins = snapshot.val();
    if (!bins) return;

    Object.keys(bins).forEach((binKey) => {
      const bin = bins[binKey];
      if (!bin.status || isNaN(bin.status)) return;

      if (
        binStatusCache[binKey] &&
        binStatusCache[binKey].status === bin.status
      ) {
        return; // If the status is the same as the last recorded one, ignore for now
      }

      binStatusCache[binKey] = { status: bin.status, timestamp: Date.now() };

      setTimeout(() => {
        if (
          binStatusCache[binKey] &&
          binStatusCache[binKey].status === bin.status &&
          Date.now() - binStatusCache[binKey].timestamp >= 5000
        ) {
          notifyDriver(binKey, bin);
        }
      }, 5000);
    });
  });
}

function notifyDriver(binKey, bin) {
  const binWard = bin.ward;
  const assignedDriver = Object.values(driversData).find(driver => driver.ward === binWard);

  if (!assignedDriver) {
    console.log(`⚠️ No driver found for ${binWard}`);
    return;
  }

  const chatId = assignedDriver.chatId;

  if (bin.status >= 80 && bin.status < 90) {
    sendTelegramMessage(
      chatId,
      `⚠️ *Warning!*
📍 *Bin Location:* ${bin.location} in *${binWard}*
🟡 *Fill Level:* ${bin.status}%
🚛 Get ready for collection.`
    );
  } else if (bin.status >= 90) {
    sendTelegramMessage(
      chatId,
      `🚨 *Urgent Alert!*
📍 *Bin Location:* ${bin.location} in *${binWard}*
🔴 *Fill Level:* ${bin.status}%
⚠️ Immediate collection required!`
    );

    sendTelegramMessage(
      chatId,
      "📍 *Please send your live location* by clicking the 📍 icon in Telegram."
    );
  }
}

// Handle Driver Location Updates
bot.on("location", async (msg) => {
  const chatId = msg.chat.id;
  const { latitude, longitude } = msg.location;

  console.log(`📍 Received Location: Lat=${latitude}, Long=${longitude} from ${chatId}`);

  try {
    const snapshot = await driversRef.once("value");
    let driverFound = false;
    let driverData = null;
    
    snapshot.forEach((childSnapshot) => {
      const driver = childSnapshot.val();
      if (driver.chatId == chatId) {
        driverFound = true;
        childSnapshot.ref.update({ latitude, longitude });
        driverData = driver;
      }
    });

    if (driverFound) {
      bot.sendMessage(chatId, "✅ *Location updated successfully!*");
      if (driverData) {
        sendOptimizedRoute(driverData.ward, chatId);
      }
    } else {
      bot.sendMessage(chatId, "⚠️ You are *not registered* as a driver!");
    }
  } catch (error) {
    console.error("❌ Error updating location:", error);
    bot.sendMessage(chatId, "❌ Error updating your location. Please try again.");
  }
});

// Helper function to split an array into chunks of a specified size
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
  }
  return result;
}

// Function to generate optimized Google Maps route starting from the driver’s location
async function sendOptimizedRoute(ward, chatId) {
  try {
      const binsSnapshot = await binsRef.once("value");
      const bins = binsSnapshot.val();
      if (!bins) return;

      // Get the driver's current location
      const driver = Object.values(driversData).find(driver => driver.chatId == chatId);
      if (!driver || !driver.latitude || !driver.longitude) {
          sendTelegramMessage(chatId, "⚠️ Please share your live location first!");
          return;
      }

      const driverLocation = `${driver.latitude},${driver.longitude}`;

      // Filter bins that need collection (≥70% full)
      const binsToCollect = Object.values(bins)
          .filter(bin => bin.ward === ward && bin.status >= 70)
          .map(bin => ({
              bin_id: bin.bin_id,  // Use `bin_id` as the identifier for each bin
              location: bin.location,
              latitude: bin.latitude,
              longitude: bin.longitude,
              status: bin.status
          }));

      if (binsToCollect.length === 0) {
          sendTelegramMessage(chatId, "✅ No bins require collection in your ward.");
          return;
      }

      // Approximate coordinates for the Indi Road Dumping Site
      const dumpingYard = "16.90,75.71";

      // Construct Google Maps URL for navigation
      const waypoints = binsToCollect.length > 0 ? `&waypoints=${binsToCollect.map(bin => `${bin.latitude},${bin.longitude}`).join("|")}` : "";
      const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${driverLocation}&destination=${dumpingYard}${waypoints}&travelmode=driving`;

      // Send Google Maps link to driver
      sendTelegramMessage(chatId, `📍 *Optimized Collection Route:*\n[Click here to start navigation](${googleMapsURL})`);

      // Create inline buttons for each bin
      const binButtons = binsToCollect.map(bin => ({
          text: `Mark ${bin.bin_id} as Collected`,
          callback_data: `mark_collected_${bin.bin_id}`  // Correct bin_id in callback data
      }));

      // Send inline buttons for each bin
      bot.sendMessage(chatId, "Please mark the bins as collected by pressing the corresponding button below:", {
          reply_markup: {
              inline_keyboard: [
                  ...chunkArray(binButtons, 2) // Chunk the array into smaller parts
              ]
          }
      });
  } catch (error) {
      console.error("❌ Error fetching optimized route:", error);
      sendTelegramMessage(chatId, "❌ Error generating route. Please try again.");
  }
}


bot.on("callback_query", async (query) => {
  const { data, message, from } = query;
  const chatId = from.id;

  if (data.startsWith("mark_collected_")) {
      const binKey = data.split("_")[2]; // Get bin key like 'bin_1'
      console.log(`Received binKey: ${binKey}`);

      if (!binKey) {
          bot.sendMessage(chatId, "❌ Invalid bin ID. Please try again.");
          return;
      }

      try {
          const binRef = binsRef.child(binKey);
          const binSnapshot = await binRef.once("value");

          if (!binSnapshot.exists()) {
              bot.sendMessage(chatId, "❌ The bin does not exist. Please try again.");
              return;
          }

          const binData = binSnapshot.val();
          const fillPercentage = binData.status || 100; // Default to 100 if missing

          // 🛑 Prevent collection if bin is not empty
          if (fillPercentage >= 5) {
              bot.sendMessage(chatId, `⚠️ Bin ${binData.bin_id} at ${binData.location} is still ${fillPercentage}% full. Please empty it before marking it as collected.`);
              return;
          }

          // ✅ Update collection status
          await binRef.update({
              collection_status: "collected",
              collected_at: new Date().toISOString(),
              collected_by: chatId
          });

          // 🗑️ Remove button for this bin after collection
          let inlineKeyboard = message.reply_markup.inline_keyboard.filter(row =>
              row.some(button => !button.callback_data.includes(`mark_collected_${binKey}`))
          );

          bot.editMessageReplyMarkup(
              { inline_keyboard: inlineKeyboard },
              { chat_id: chatId, message_id: message.message_id }
          );

          bot.sendMessage(chatId, `✅ Bin ${binData.bin_id} at ${binData.location} has been marked as collected!`);

      } catch (error) {
          console.error("❌ Error marking bin as collected:", error);
          bot.sendMessage(chatId, "❌ Error marking the bin as collected. Please try again.");
      }
  }
});

// Start Monitoring
console.log("🚀 Server is running and monitoring bin levels...");
monitorBins();




















// // Function to handle the bin collection button click event
// bot.on("callback_query", async (query) => {
//   const { data, message, from } = query;
//   const chatId = from.id;

//   if (data.startsWith("mark_collected_")) {
//       const binId = data.split("_")[2]; 
//       console.log(`Received binId: ${binId}`); // Extract the bin_id from the callback data

//       if (!binId) {
//           bot.sendMessage(chatId, "❌ Invalid bin ID. Please try again.");
//           return;
//       }

//       try {
//           // Correctly access the bin using the `bin_` prefix in the database
//           const binRef = binsRef.child(`${binId}`);  // Ensure this matches the actual database structure
//           const binSnapshot = await binRef.once("value");

//           if (!binSnapshot.exists()) {
//               bot.sendMessage(chatId, "❌ The bin does not exist. Please try again.");
//               return;
//           }

//           // Update the bin's collection status in Firebase
//           await binRef.update({
//               collection_status: "collected",
//               collected_at: new Date().toISOString(),
//               collected_by: chatId
//           });

//           // Send confirmation message to the driver
//           bot.sendMessage(chatId, `✅ Bin ${binId} has been marked as collected!`);

//           // Optionally, you can remove the button after marking it as collected.
//           bot.editMessageReplyMarkup(
//               { inline_keyboard: [] },
//               { chat_id: chatId, message_id: message.message_id }
//           );

//       } catch (error) {
//           console.error("❌ Error marking bin as collected:", error);
//           bot.sendMessage(chatId, "❌ Error marking the bin as collected. Please try again.");
//       }
//   }
// });





// bot.on("callback_query", async (query) => {
//   const { data, message, from } = query;
//   const chatId = from.id;

//   if (data.startsWith("mark_collected_")) {
//       const binId = data.split("_")[2]; 
//       console.log(`Received binId: ${binId}`); 

//       if (!binId) {
//           bot.sendMessage(chatId, "❌ Invalid bin ID. Please try again.");
//           return;
//       }

//       try {
//           const binRef = binsRef.child(`${binId}`);
//           const binSnapshot = await binRef.once("value");

//           if (!binSnapshot.exists()) {
//               bot.sendMessage(chatId, "❌ The bin does not exist. Please try again.");
//               return;
//           }

//           // Update collection status
//           await binRef.update({
//               collection_status: "collected",
//               collected_at: new Date().toISOString(),
//               collected_by: chatId
//           });

//           // Modify only the button for this specific bin
//           let inlineKeyboard = message.reply_markup.inline_keyboard.filter(row =>
//               row.some(button => !button.callback_data.includes(`mark_collected_${binId}`))
//           );

//           bot.editMessageReplyMarkup(
//               { inline_keyboard: inlineKeyboard },
//               { chat_id: chatId, message_id: message.message_id }
//           );

//           bot.sendMessage(chatId, `✅ Bin ${binId} has been marked as collected!`);

//       } catch (error) {
//           console.error("❌ Error marking bin as collected:", error);
//           bot.sendMessage(chatId, "❌ Error marking the bin as collected. Please try again.");
//       }
//   }
// });


