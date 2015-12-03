//Firebase setup
var fireBaseReference = new Firebase("https://treetup.firebaseio.com");
var treeReference = fireBaseReference.child("trees");
var geoFire = new GeoFire(fireBaseReference.child("_geofire"));

//Tree variables
var treesInQuery = new Array();
var queryRadius = 0.3;
var numtrees = 0;
var treeGeo;

//User variables
var latitude = -80.5256895;
var longitude = 43.4633228;

//Geolocation variables
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

//Closest tree variables
var lastKey;
var closestKey;
var markers = {};

//Map variables
var map;

//Every position update, determine which markers to show and which tree is closest
var watchPosition = navigator.geolocation.watchPosition(function(position) {
    //Phone latitude and longitude
    latitude = position.coords.longitude;
    longitude = position.coords.latitude;
    var person = {lat: longitude, lng: latitude}
    if (markers['person'] != undefined) {
        removeTree('person');
    }
    createPerson(person);

    //Determine closest marker to the person marker
    var closestDistance = Infinity;
    for (var i in markers) {
        if(i=='person'){
            continue;
        } else{
            var dist = distanceBetween(markers[i].getPosition().lat(), markers[i].getPosition().lng(), longitude, latitude, "K");
            if (dist < closestDistance) {
                closestDistance = dist;
                closestKey = i;
            }
        }
    }

    //Display a popup of the closest tree, if it's within 10m
    if(closestDistance<0.01){
        lastKey = closestKey;
        treeReference.child(closestKey).once("value", function(snapshot) {
            var closestTree = snapshot.val();
            showPopUp(closestKey, closestTree.type, closestTree.address);
        });
    } else {
        closePopUp();
        closestDistance = Infinity;
        closestKey = null;
    }
}, function error(err){
    console.log("There was an error: "+err));
}, options);

//Determine which trees are in the desired radius
var treeQuery = geoFire.query({
    center: [latitude,longitude],
    radius: queryRadius
});

//Display trees entering radius in real time and destroy those leaving
treeQuery.on("key_entered", function(key,location,distance){
    treeReference.child(key).on("value", function(snapshot) {
        tree = snapshot.val();
        fireBaseReference.child("_geofire").child(key).on("value", function(snap) {
            treeGeo = snap.val();
            createTree(treeGeo, key);
        })
    })
});
treeQuery.on("key_exited", function(key,location,distance){
    removeTree(key);
});

//Create the blue user marker at the desired latitude and longitude
function createPerson(position) {
    var marker = new google.maps.Marker({
      icon: "js/user.png",
      position: new google.maps.LatLng(position.lat, position.lng),
      optimized: true,
      map: map
    });
  markers['person'] = marker;

}

//Create the green tree marker at the right location
function createTree(tree, treeID) {
	var marker = new google.maps.Marker({
	icon: "js/tree.png",
	position: new google.maps.LatLng(tree.l[1], tree.l[0]),
	optimized: true,
	map: map
	});
	markers[treeID] = marker;
	marker.addListener('click', function(){
  		viewTree(treeID);
  })
}

//Remove a tree marker
function removeTree(treeID) {
	markers[treeID].setMap(null);
}

//Remove all markers from the map
function removeMarkers() {
    for (var i in markers) {
        markers[i].setMap(null);
    }
}
//Determine the distance between two latitude and longitude points
function distanceBetween(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * lon1/180
	var radlon2 = Math.PI * lon2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

//Initialize the map
function initMap() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
		});
		zoomAmount = 17;
	} else {

		latitude = 43.477480;
		longitude = -80.544317;
		zoomAmount = 11;
	}
	map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(longitude, latitude),
		scrollwheel: false,
		zoom: zoomAmount
	});
}

//Create a properly formatted link to the treetup site
function createLink(treeID, d) {
	meetingTime = d.getTime();
	var linkString = 'http://timberapp.ml/treetup.php?time='+Math.floor((meetingTime/1000))+'&tree='+treeID;
    return linkString;
}

//Vote for a tree (up or down)
function vote(delta, treeID) {
	var currScore
	treeReference.child(treeID.toString()).child('score').on('value', function(snapshot){
		currScore = snapshot.val();
	})
	currScore += delta;
	treeReference.child(treeID.toString()).child('score').set(currScore);
}
