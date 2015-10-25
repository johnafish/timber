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
var watchPosition = navigator.geolocation.watchPosition(function(position) {
  latitude = position.coords.longitude;
  longitude = position.coords.latitude;
  var treeQuery = geoFire.query({
      center: [latitude,longitude],
      radius: queryRadius
  });
  var person = {lat: longitude, lng: latitude}
  createPerson(person);
  map.setCenter(person);

  treeQuery.on("key_entered", function(key,location,distance){
  	if (treesInQuery.indexOf(key) === -1) {
  	    treesInQuery.push(key);
  	}

      treeReference.child(key).on("value", function(snapshot) {
      	tree = snapshot.val();
      	fireBaseReference.child("_geofire").child(key).on("value", function(snap) {
      		treeGeo = snap.val();
      		treeLong = treeGeo.l[0];
      		treeLat = treeGeo.l[1];
      		createTree(treeGeo);
      	})
      })
  });
}, function error(err){
    console.log("error");
}, options);




var trees = {};
var treeGeo, tree, treeLong, treeLat;

function createPerson(position) {
    var marker = new google.maps.Marker({
    //   icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Person_icon_BLACK-01.svg/2000px-Person_icon_BLACK-01.svg.png",
      position: new google.maps.LatLng(position.lat, position.lng),
      optimized: true,
      map: map
    });
    return marker;
}

function createTree(tree) {
  var marker = new google.maps.Marker({
    icon: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
    position: new google.maps.LatLng(tree.l[1], tree.l[0]),
    optimized: true,
    map: map
  });
}
