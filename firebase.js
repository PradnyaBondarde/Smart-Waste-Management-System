import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

export { db, ref, onValue };

