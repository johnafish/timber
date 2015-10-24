var map, test;
function initMap() {
	// var latitude, longitude;
	// /*if (navigator.geolocation) {
	// 	console.log('success');
	// 	latitude, longitude = navigator.geolocation.getCurrentPosition(locationSuccess, console.log('err'));
	// } else { */
	// 	latitude = 43.477480;
	// 	longitude = -80.544317;
	// 	zoomAmount = 11;
	// //}
	// console.log(latitude, longitude);
	// map = new google.maps.Map(document.getElementById('map'), {
	// 	center: formatCoords(latitude, longitude),
	// 	scrollwheel: false,
	// 	zoom: zoomAmount
	// });

	// 

	var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
var mapOptions = {
  zoom: 4,
  center: myLatlng
}
map = new google.maps.Map(document.getElementById("map"), mapOptions);

var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!"
});

// To add the marker to the map, call setMap();
marker.setMap(map);

}

function formatCoords(latitude, longitude) {
	return {lat: latitude, lng: longitude};
}

function locationSuccess(pos) {
	return pos.latitude, pos.longitude;
}

function addMarker(lat, lng, name) {
	// var marker = new google.maps.Marker({
	// 	map: map,
	// 	position: new google.maps.LatLng(lat,lng),
	// 	title: name
	// });

	test = new google.maps.Marker({
	position: new google.maps.LatLng(lat,lng),
    title:"Hello World!"
});
	test.setMap(map);
}

function hideMarker(marker) {
	marker.setMap(null);
}