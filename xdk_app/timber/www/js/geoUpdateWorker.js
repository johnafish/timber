var latitude, longitude;
setInterval(function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        latitude = 43.477480;
        longitude = -80.544317;
        console.log("Error with geolocating.");
    }
}, 10000);
function showPosition(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}
