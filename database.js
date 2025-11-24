// database.js
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { db } from "./firebase.js"; // Import Firebase config

// Fetch bin locations (only bins >= 70% full)
export function getBinLocations(callback) {
    const binsRef = ref(db, "bins");
    onValue(binsRef, (snapshot) => {
        const bins = snapshot.val();
        if (!bins) return;

        const binLocations = Object.entries(bins)
            .filter(([_, bin]) => bin.status >= 70) // Filter bins that are >= 70% full
            .map(([id, bin]) => ({ id, lat: bin.latitude, lng: bin.longitude, location: bin.location, fill: bin.status }));

        callback(binLocations);
    });
}

// Fetch driver location
export function getDriverLocation(callback) {
    const driverRef = ref(db, "driver");
    onValue(driverRef, (snapshot) => {
        const driver = snapshot.val();
        if (driver) callback({ lat: driver.latitude, lng: driver.longitude, chatId: driver.chatId });
    });
}
