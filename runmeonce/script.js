var firebaseRef = new Firebase("https://treetup.firebaseio.com");
var treesRef = firebaseRef.child("trees");
var geoFire = new GeoFire(firebaseRef.child("_geofire"));
firebaseRef.remove();
console.log(streettrees.trees.length);
for (var i = 0; i < streettrees.trees.length; i++) {
    var OBJECTID = streettrees.trees[i].properties.OBJECTID.toString();
    var TREETYPE = streettrees.trees[i].properties.COM_NAME;
    var ADDRESS = streettrees.trees[i].properties.ADDRESS;
    treesRef.child(OBJECTID).set({
        type: TREETYPE,
        score: 0,
        address: ADDRESS,
        images: new Array(),
        flags: new Array()
    })
    geoFire.set(OBJECTID, streettrees.trees[i].geometry.coordinates);
}
console.log(i);
console.log("done")
