<?php
$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$treeID = $_GET["tree"];
$time = $_GET["time"];
?>
<html>
<head>
    <title>Let's Treetup!</title>
    <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,300' rel='stylesheet' type='text/css'>
    <link href="style.css" rel="stylesheet" type="text/css">
</head>
<body>
<header>
    <h1>LET'S <span>TREE</span>TUP</h1>
</header>
    <h2 id="when"></h2>
    <div id="map"></div>
<script src="https://cdn.firebase.com/js/client/2.2.5/firebase.js"></script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDSvB66Bvb1NwyMblo_HtvhgIzbY_T9_Q4&callback=initMap"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>

<script>
var tree = "<?php echo $treeID; ?>";
var time = parseInt("<?php echo $time; ?>");
var fireBaseReference = new Firebase("https://treetup.firebaseio.com");
var geoFire = fireBaseReference.child("_geofire");
var treeLatLong = {lat:43.4633228 , lng: -80.5256895};


var d = new Date(0);
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
d.setUTCSeconds(time);
var hours = d.getHours();
var minutes = d.getMinutes();
var amPm;
if (hours>=12){
    amPm = "pm";
} else {
    amPm = "am";
}

if(hours>12) {
    hours = hours - 12;
}
if (hours==0){
    hours = 12
}

if (minutes<10){
    minutes = "0"+minutes;
}
var dateString = "at "+hours+":"+minutes+amPm+" on "+months[d.getMonth()]+" "+d.getDate();
document.getElementById("when").innerHTML = dateString;
var latitude,longitude;
var userPosition;
function setPosition() {
    if (navigator.geolocation){
        var location = navigator.geolocation.getCurrentPosition(function(position) {
          setLatLong(position.coords.latitude,position.coords.longitude);
        });
        initMap();
    }
}


function initMap(){
    var place = {lat:43.4617098 , lng: -80.5097937};

    var map = new google.maps.Map(document.getElementById('map'), {
        center: place,
        scrollwheel: false,
        zoom: 18
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var you = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            map.setCenter(you);
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
            });
            geoFire.child(tree).on("value", function(snapshot) {
            	var tree = snapshot.val();
                treeLatLong = {lat: tree.l[1], lng: tree.l[0]};
                var request = {
                    destination: treeLatLong,
                    origin: you,
                    travelMode: google.maps.TravelMode.DRIVING
                };

                var directionsService = new google.maps.DirectionsService();
                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                    }
                });
            });
            });

    }


}


</script>
</body>
</html>
