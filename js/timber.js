var fireBaseReference = new Firebase("https://treetup.firebaseio.com");
var treeReference = fireBaseReference.child("trees");
var geoFire = new GeoFire(fireBaseReference.child("_geofire"));

var treesInQuery = new Array();
var latitude = -80.5256895;
var longitude = 43.4633228;
var numtrees = 0;

var queryRadius = 0.3;
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

var lastKey;
var closestDistance = queryRadius+3;
var closestKey;

var markers = {};

var watchPosition = navigator.geolocation.watchPosition(function(position) {
  latitude = position.coords.longitude;
  longitude = position.coords.latitude;
  var treeQuery = geoFire.query({
      center: [latitude,longitude],
      radius: queryRadius
  });

  var person = {lat: longitude, lng: latitude}
  removeMarkers();
  createPerson(person);
  map.setCenter(person);

  treeQuery.on("key_entered", function(key,location,distance){
      currentDistance = distanceBetween(longitude, latitude, location[1], location[0], "K")
      if(currentDistance<closestDistance){
          closestDistance=currentDistance;
          closestKey = key;
      }
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

  if(closestDistance<0.01 && closestKey!=lastKey){
      lastKey = closestKey;
      showNearbyTree(closestKey);
  }
}, function error(err){
    console.log("error");
}, options);

var treeGeo;

function showNearbyTree(key){
    treeReference.child(key).once("value", function(snapshot) {
        alert(snapshot.val());
    });
}

function createPerson(position) {
    var marker = new google.maps.Marker({
    //   icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Person_icon_BLACK-01.svg/2000px-Person_icon_BLACK-01.svg.png",
      position: new google.maps.LatLng(position.lat, position.lng),
      optimized: true,
      map: map
    });
  markers['person'] = marker;

}

function createTree(tree, treeID) {
	var marker = new google.maps.Marker({
	icon: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
	position: new google.maps.LatLng(tree.l[1], tree.l[0]),
	optimized: true,
	map: map
	});
	markers[treeID] = marker;
	marker.addListener('click', function(){
  		//createLink(treeID, new Date());
  		vote(1, treeID);
  })
}

function removeTree(treeID) {
	markers[treeID].setMap(null);
}

function removeMarkers() {
    for (var i in markers) {
        markers[i].setMap(null);
    }
}
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
var map;
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

function createLink(treeID, d) {
	meetingTime = d.getTime();
	var linkString = 'http://timberapp.ml/treetup.php?time='+Math.floor((meetingTime/1000))+'&tree='+treeID;
    return linkString;
}

function vote(delta, treeID) {
	var currScore
	treeReference.child(treeID.toString()).child('score').on('value', function(snapshot){
		currScore = snapshot.val();
	})
	currScore += delta;
	treeReference.child(treeID.toString()).child('score').set(currScore);
}
