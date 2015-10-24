var fireBaseReference = new Firebase("https://treetup.firebaseio.com");
var treeReference = fireBaseReference.child("trees");
var geoFire = new GeoFire(fireBaseReference.child("_geofire"));

var treesInQuery = new Array();
var latitude = -80.5256895;
var longitude = 43.4633228;
var numtrees = 0;

var queryRadius = 0.5;

var watchPosition = navigator.geolocation.getCurrentPosition(function(position) {
  latitude = position.coords.longitude;
  longitude = position.coords.latitude;
  console.log(latitude+","+longitude);
});

var treeQuery = geoFire.query({
    center: [latitude,longitude],
    radius: queryRadius
});

treeQuery.on("key_entered", function(key,location,distance){
    treesInQuery.push(key);
    treeReference.child(treesInQuery[treesInQuery.length-1]).on("value", function(snapshot) {
      console.log(snapshot.val());
    });
});
