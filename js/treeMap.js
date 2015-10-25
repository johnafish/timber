var map, latitude, longitude;

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

function hideMarker(marker) {
	marker.setMap(null);
}

//Edit to add image.
function createMarker(treeID) {
	var marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(trees[treeID][0], trees[treeID][1]),
		title: 
	});
}