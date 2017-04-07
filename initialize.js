var map;
var infoWindow;

var request;
var service;
var markers = [];

function initialize(){
  // set starting point as LatLng object at RGU coordinates
  var startingPoint = new google.maps.LatLng(57.1184156, -2.1497771);
  // create a map obj starting from start point with a certain zoom, and bind it to the placeHolder div
  map = new google.maps.Map(document.getElementById('placeHolderMaps'), {
    center: startingPoint,
    zoom: 12
  });

  // initialize the request from starting point, a radius of results and restaurant as a type
  request = {
    location: startingPoint,
    radius : 1500,
    type: ['restaurant']
  };

  //initialize infoWindow as a InfoWindow object (baloon on top of the place marker)
  infoWindow = new google.maps.InfoWindow();

  // Nearby Search Request as Places API
  // PlacesService as service
  service = new google.maps.places.PlacesService(map);
  // nearbySearch method of PlaceService return an array of PlaceResult object
  service.nearbySearch(request, callback);

  // additional function to move the center of the research depending on where we rightclick on the map
  google.maps.event.addListener(map, 'rightclick', function(event){
    map.setCenter(event.latLng);
    clearResults(markers);
    var request = {
      location: event.latLng,
      radius : 1500,
      type: ['restaurant']
    };
    service.nearbySearch(request, callback);
  })

}

// handle the call back
function callback(results, status) {
  if(status == google.maps.places.PlacesServiceStatus.OK){
    for(var i = 0; i < results.length; i++){
      //push into the markers array a new created marker from the results of the callback
      markers.push(createMarker(results[i]));
    }
  }
}

//create a marker starting from a single
function createMarker(place){
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function(){
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
  return marker;
}

function clearResults(markers){
  for(var m in markers){
    markers[m].setMap(null);
  }
  markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);
