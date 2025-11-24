import admin from "firebase-admin";
import { readFile } from "fs/promises";

// Load Firebase service account JSON (Use absolute path)
const serviceAccount = JSON.parse(
  await readFile("D:/hack/swm/smartwm-e1984-firebase-adminsdk-fbsvc-340de23f4b.json", "utf8")
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smartwm-e1984-default-rtdb.firebaseio.com" // Replace with your actual database URL
});

const db = admin.database();
const driversRef = db.ref("/drivers");

// Fetch existing drivers
driversRef.once("value", (snapshot) => {
  const oldDrivers = snapshot.val();
  const newDrivers = {};

  if (oldDrivers) {
    Object.keys(oldDrivers).forEach((key) => {
      const driver = oldDrivers[key];

      if (driver.driver_id) {
        newDrivers[driver.driver_id] = {
          age: driver.age || "",
          chatId: driver.chatId || "",
          contact: driver.contact || driver.phone || "",
          dateofjoin: driver.dateofjoin || "",
          driver_id: driver.driver_id,
          latitude: driver.latitude || "",
          longitude: driver.longitude || "",
          name: driver.name || driver.driverName || "",
          ward: driver.ward || "",
        };
      }
    });

    // Update Firebase with the new structure
    driversRef.set(newDrivers)
      .then(() => console.log("✅ Drivers updated successfully!"))
      .catch((error) => console.error("❌ Error updating drivers:", error));
  }
});
