var reference = new Firebase("https://treetup.firebaseio.com/");
var geoFire = new GeoFire(reference);
geoFire.set("cigi", [43.463735, -80.525707]).then(function() {
  console.log("Provided key has been added to GeoFire");
}, function(error) {
  console.log("Error: " + error);
});
