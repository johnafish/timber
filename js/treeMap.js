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

function addMarker(lat, lng, name) {
	var marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(lat,lng),
		title: name
	});
}

function hideMarker(marker) {
	marker.setMap(null);
}

function createMarker() {
	
}