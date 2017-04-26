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
  });
  //optional alternative map style
  //map.setMapTypeId(google.maps.MapTypeId.HYBRID);

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

  // initialize searchBox
  var input = document.getElementById('searchBox');
  var searchBox = new google.maps.places.SearchBox(input);
  //grasshopper
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // connect the range of results to the present bounds of the map
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  //start of searchBox autocompletition
  //
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    /**/
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };


      // generate a marker for the new position
      /*
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));*/

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      console.log(place);
      console.log(bounds);
      newPosition = new google.maps.LatLng((bounds.b.b + bounds.b.f)/2), ((bounds.b.b + bounds.b.f)/2));
      console.log(newPosition)
    });
    map.fitBounds(bounds);
  }); /* end */

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

      }

//google.maps.event.addDomListener(window, 'load', initMap);
