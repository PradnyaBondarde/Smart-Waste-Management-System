window.initMap = function () {
    console.log("Google Maps API loaded");

    let map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.7128, lng: -74.0060 }, // Example location
        zoom: 12,
    });

    // Use AdvancedMarkerElement instead of Marker
    new google.maps.marker.AdvancedMarkerElement({
        position: { lat: 40.7128, lng: -74.0060 },
        map: map,
        title: "Example Location",
    });

    firebase.database().ref("bins").on("value", (snapshot) => {
        let binsToCollect = [];
        
        snapshot.forEach((binSnapshot) => {
            let binData = binSnapshot.val();
            if (binData.fillLevel >= 70) {  // Collect bins >= 70% full
                binsToCollect.push({ lat: binData.lat, lng: binData.lng });
            }
        });
    
        if (binsToCollect.length > 0) {
            sendRouteToDriver("+919482443929", binsToCollect);
        }
    });
};