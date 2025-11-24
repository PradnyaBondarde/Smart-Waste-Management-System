# Smart Waste Management System (Clean Upload)
# Smart Waste Management System ♻️

An IoT-inspired web application that monitors bin fill levels, raises alerts, and helps coordinators plan waste collection efficiently.  
This project won **Epicthon 2.0 (National Hackathon)**

> 🔐 Note: This is a **clean upload**; all Firebase keys have been removed. Add your own configuration before running locally.

---

## 🚀 Objective
To develop an intelligent waste management solution that improves efficiency in waste collection by providing real-time bin-level data and location-based routing.

---

## ⚙️ Hardware Components
- NodeMCU (ESP8266)
- Ultrasonic Sensors (HC-SR04)
- Breadboard & Jumper Wires
- Power Supply
- Wi-Fi Connectivity

---

## 💻 Software Requirements
- Arduino IDE
- Firebase Real-Time Database
- Google Maps API
- HTML, CSS, JavaScript (Frontend)
- Tinkercad (for circuit simulation)

---

## 🧠 Working Principle
1. Ultrasonic sensors measure the fill level of garbage bins.
2. NodeMCU processes the sensor data and sends it to Firebase in real time.
3. When a bin exceeds **80% capacity**, an alert is triggered.
4. Google Maps API displays the bin locations and helps optimize collection routes.
5. The web dashboard shows all bins, statuses, and driver information.

---

## 🧩 System Architecture
+-------------------+ +-------------------+
| Ultrasonic | | Google Maps |
| Sensors | | API |
+---------+---------+ +---------+---------+
| |
v v
+---------+---------+ +-----------+-----------+
| NodeMCU (ESP8266) | ---> | Firebase Real-Time DB |
+---------+---------+ +-----------+-----------+
|
v
+---------+---------+
| Web Dashboard |
| (HTML/CSS/JS) |
+-------------------+
## 🗂️ Project Structure
Smart-Waste-Management-System/
├─ icons/ # App icons/assets
├─ server/ # Optional backend folder
├─ index.html # Landing page
├─ homepage.html # Public home
├─ login.html # Login page
├─ signupAndLoginBoth.html # Combined login/signup
├─ dashboard.html # Main dashboard
├─ dashboardmain.html # Admin dashboard
├─ drivermanagement.html # Driver management
├─ AdddriverTolist.html # Add driver form
├─ notification.html # Alerts & notifications
├─ complaintes.html # Complaints module
├─ bin.html # Bin status page
├─ firebase.js # Firebase config file
├─ database.js # Database logic
├─ script.js # Main client-side logic
├─ style.css # Styling
└─ README.md # Project documentation  


## 🧰 Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend (Cloud):** Firebase (Auth + Database)  
- **Optional API:** Google Maps API  

---

## 🚀 Getting Started
1. **Clone the Repository**
   ```bash
   git clone https://github.com/PradnyaBondarde/Smart-Waste-Management-System.git
   cd Smart-Waste-Management-System

2.**Configure Firebase**

Create a new Firebase project → Web App.
Enable Authentication (Email/Password) and Realtime Database.
Paste your Firebase config into firebase.js:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  databaseURL: "https://YOUR_APP.firebaseio.com",
  projectId: "YOUR_APP",
  storageBucket: "YOUR_APP.appspot.com",
  messagingSenderId: "XXXXXX",
  appId: "1:XXXXXX:web:XXXXXX"
};
firebase.initializeApp(firebaseConfig);
**
3.**Run Locally**

Use VS Code Live Server 

4.**Data Model Example**
/bins
  /<binId>
    level: 75
    lat: 12.97
    lng: 77.59
    status: "FULL"

/alerts
  /<alertId>
    binId: <binId>
    triggeredAt: 1715172000
    resolved: false

/drivers
  /<driverId>
    name: "Driver A"
    phone: "9XXXXXXXXX"
    assignedBins: [<binId>]



This repository is a cleaned copy for upload — service account keys were removed before committing.
