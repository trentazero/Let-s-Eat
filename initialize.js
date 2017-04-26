var map, infoWindow;
var request;
var service;
var markers = [];
var currPosition;

function initMap(){
  // set starting point as LatLng object at Melbourne if it won't autoload the current position
  currPosition = new google.maps.LatLng(-37.8182574, 144.9658713);
  // create a map obj starting from start point with a certain zoom, and bind it to the placeHolder div, need the [0] to return the HTML Dom and not the JQuery object itself
  map = new google.maps.Map($('#placeHolderMaps')[0], {
    // could have set it directly with {lat: -34.397, lng: 150.644}
    center: currPosition,
    zoom: 13
    mapTypeId: HYBRID
  });

  //initialize infoWindow as a InfoWindow object (baloon on top of the place marker)
  infoWindow = new google.maps.InfoWindow();

  //try to set the starting position to the user current one
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      currPosition = new  google.maps.LatLng(position.coords.latitude, position.coords.longitude );
      map.setCenter(currPosition);
      request = createRequest(currPosition);
      // nearbySearch method of PlaceService return an array of PlaceResult object dependind on the request
      service.nearbySearch(request, callback);
    }, function(){
      handleLocationError(true, infoWindow);
      });
  } else {
    handleLocationError(true, infoWindow);
  }

  // Nearby Search Request as Places API
  // initialize service as PlacesService on the map
  service = new google.maps.places.PlacesService(map);

  // additional function to move the center of the research depending on where we rightclick on the map
  google.maps.event.addListener(map, 'rightclick', function(event){
    currPosition = event.latLng;
    map.setCenter(currPosition);
    clearResults(markers);
    search();
    /*
    var request = createRequest(event.latLng);
    service.nearbySearch(request, callback);*/
  })

}

// helper method to reduce repetition creating a request
function createRequest(LatLng){
  // initialize the request from starting point, a radius of results and restaurant as a type
  return {location: LatLng, radius: 1500, type : ['restaurant']};
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

//create a marker starting from a single place
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

function handleLocationError(browserHasGeolocation, infoWindow) {
      var defaultPos = new google.maps.LatLng(-37.8182574, 144.9658713);
      map.setCenter(defaultPos);
      service.nearbySearch(createRequest(defaultPos), callback);
      /*  infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map); */
      }

//google.maps.event.addDomListener(window, 'load', initMap);
