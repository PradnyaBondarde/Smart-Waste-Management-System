// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, get, update, child } from "firebase/database";
// import cron from 'node-cron';

// // Firebase Configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBPWNvZyLG6V1b8WfrqOOY7f3pulRSpNuU",
//     authDomain: "smartwm-e1984.firebaseapp.com",
//     databaseURL: "https://smartwm-e1984-default-rtdb.firebaseio.com",
//     projectId: "smartwm-e1984",
//     storageBucket: "smartwm-e1984.appspot.com",
//     messagingSenderId: "339518167826",
//     appId: "1:339518167826:web:4fa186c8b60e798a7af1cb"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// // Function to check attendance and mark absent or present
// async function checkAndMarkAttendance() {
//     console.log("📡 Checking attendance...");

//     // Reference to drivers and attendance
//     const driversRef = ref(db, "drivers");
//     const driversAttendanceRef = ref(db, "drivers_attendance");

//     // Get list of all drivers
//     const snapshot = await get(driversRef);
//     const driversData = snapshot.val();

//     if (!driversData) {
//         console.error("🔥 Error: No driver data found!");
//         return;
//     }

//     // Loop through each driver in the drivers collection
//     for (const driverId in driversData) {
//         const driver = driversData[driverId];

//         // Reference to the driver's attendance record
//         const driverAttendanceRef = child(driversAttendanceRef, driverId);

//         // Get the driver's attendance record
//         const attendanceSnapshot = await get(driverAttendanceRef);
//         const attendanceData = attendanceSnapshot.val();

//         // If attendance data exists for the day, check if they scanned the QR code
//         if (attendanceData) {
//             const scanTime = attendanceData.timestamp; // The timestamp when the driver scanned the QR code

//             if (scanTime) {
//                 const scanDate = new Date(scanTime);
//                 const currentTime = new Date();
//                 const isBefore630AM = (scanDate.getHours() < 6 || (scanDate.getHours() === 6 && scanDate.getMinutes() <= 30));

//                 // If scanned before 6:30 AM, mark as Present
//                 if (isBefore630AM) {
//                     console.log(`✅ Driver ${driverId} scanned before 6:30 AM. Marked as Present.`);
//                     await update(driverAttendanceRef, {
//                         dstatus: "Present",
//                     });
//                 } else {
//                     // If scanned after 6:30 AM or not scanned at all, mark as Absent
//                     console.log(`❌ Driver ${driverId} scanned late or not at all. Marked as Absent.`);
//                     await update(driverAttendanceRef, {
//                         dstatus: "Absent",
//                     });
//                 }
//             } else {
//                 // If no scan, mark as Absent
//                 console.log(`❌ Driver ${driverId} did not scan the QR code. Marked as Absent.`);
//                 await update(driverAttendanceRef, {
//                     dstatus: "Absent",
//                 });
//             }
//         } else {
//             console.log(`❌ No attendance record found for driver ${driverId}. Marked as Absent.`);
//             await update(driverAttendanceRef, {
//                 dstatus: "Absent",
//             });
//         }
//     }
// }

// // Schedule the function to run at 6:30 AM every day
// cron.schedule('30 6 * * *', () => {
//     checkAndMarkAttendance();
// });

// // Optional: You can run this manually for testing
// checkAndMarkAttendance();















import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, child, push } from "firebase/database";
import cron from 'node-cron';

const firebaseConfig = {
    apiKey: "AIzaSyBPWNvZyLG6V1b8WfrqOOY7f3pulRSpNuU",
    authDomain: "smartwm-e1984.firebaseapp.com",
    databaseURL: "https://smartwm-e1984-default-rtdb.firebaseio.com",
    projectId: "smartwm-e1984",
    storageBucket: "smartwm-e1984.appspot.com",
    messagingSenderId: "339518167826",
    appId: "1:339518167826:web:4fa186c8b60e798a7af1cb"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function checkAndMarkAttendance() {
    console.log("📡 Checking attendance...");

    const driversRef = ref(db, "drivers");
    const driversAttendanceRef = ref(db, "drivers_attendance");
    const notificationsRef = ref(db, "notifications"); // Notifications DB

    const snapshot = await get(driversRef);
    const driversData = snapshot.val();

    if (!driversData) {
        console.error("🔥 Error: No driver data found!");
        return;
    }

    for (const driverId in driversData) {
        const driver = driversData[driverId];
        const driverAttendanceRef = child(driversAttendanceRef, driverId);
        const attendanceSnapshot = await get(driverAttendanceRef);
        const attendanceData = attendanceSnapshot.val();

        if (attendanceData) {
            const scanTime = attendanceData.timestamp;

            if (scanTime) {
                const scanDate = new Date(scanTime);
                const isBefore630AM = (scanDate.getHours() < 6 || (scanDate.getHours() === 6 && scanDate.getMinutes() <= 30));

                if (isBefore630AM) {
                    console.log(`✅ Driver ${driverId} scanned before 6:30 AM. Marked as Present.`);
                    await update(driverAttendanceRef, { dstatus: "Present" });
                } else {
                    console.log(`❌ Driver ${driverId} scanned late or not at all. Marked as Absent.`);
                    await update(driverAttendanceRef, { dstatus: "Absent" });

                    // Push Notification to Firebase
                    await push(notificationsRef, {
                        driverId: driverId,
                        message: `Driver ${driver.name} is Absent`,
                        timestamp: Date.now()
                    });
                }
            } else {
                console.log(`❌ Driver ${driverId} did not scan the QR code. Marked as Absent.`);
                await update(driverAttendanceRef, { dstatus: "Absent" });

                // Push Notification to Firebase
                await push(notificationsRef, {
                    driverId: driverId,
                    message: `Driver ${driver.name} is Absent`,
                    timestamp: Date.now()
                });
            }
        } else {
            console.log(`❌ No attendance record found for driver ${driverId}. Marked as Absent.`);
            await update(driverAttendanceRef, { dstatus: "Absent" });

            // Push Notification to Firebase
            await push(notificationsRef, {
                driverId: driverId,
                message: `Driver ${driver.name} is Absent`,
                timestamp: Date.now()
            });
        }
    }
}

// Schedule to run at 6:30 AM
cron.schedule('30 6 * * *', () => {
    checkAndMarkAttendance();
});

// Run once for testing
checkAndMarkAttendance();
