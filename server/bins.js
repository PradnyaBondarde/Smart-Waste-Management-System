import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('D:/hack/swm/smartwm-e1984-firebase-adminsdk-fbsvc-340de23f4b.json')));

// Initialize Firebase with the service account and database URL
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://smartwm-e1984-default-rtdb.firebaseio.com' // Replace with your Firebase Realtime Database URL
});

const db = admin.database();
// Your Firebase-related operations go here


// Step 1: Fetch the existing bins data
async function fetchBins() {
  const binsRef = db.ref('bins');  // Path to your bins in Realtime Database
  const snapshot = await binsRef.once('value');
  
  // Check if there is data in the 'bins' node
  if (!snapshot.exists()) {
    console.log('No bins data found');
    return;
  }

  // Step 2: Transform the structure to use bin_id as the key
  const binsData = snapshot.val();
  const newBinsStructure = {};

  Object.keys(binsData).forEach(binKey => {
    const bin = binsData[binKey];
    const binId = bin.bin_id;

    // Use bin_id as the key in the new structure
    newBinsStructure[binId] = bin;
  });

  // Step 3: Update the Firebase Realtime Database with the new structure
  await db.ref('bins').set(newBinsStructure);

  console.log('Database structure updated successfully!');
}

// Run the function to update the database
fetchBins().catch(console.error);
