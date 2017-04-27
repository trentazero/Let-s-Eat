function search(){
  var value = $("#who").val();
  if(value == 1){
     //Broke
     broke();
  }
  else if(value == 2){
    // Loaded
    loaded();
  } else if(value == 3){
    // Picky
    picky();
  } else {
    undefinedChoice();
  }
}

function broke(){
  request = {
    location: currPosition,
    radius: 1500,
    type : ['restaurant'],
    //cheap stuff
    maxPriceLevel: 2
  }
  clearResults(markers);
  service.nearbySearch(request, callback);
}

function loaded(){
  request = {
    location: currPosition,
    radius: 1500,
    type : ['restaurant'],
    //expensive or very expensive
    minPriceLevel: 3
  }
  clearResults(markers);
  service.nearbySearch(request, callback);
}

function picky(){
  var iconBase = "https://letseat.azurewebsites.net/img/";
  var icons = {
    burger: iconBase + "Burger.png",
    chinese: iconBase + "Chinese.png",
    indian: iconBase + "Indian.png",
    italian: iconBase + "Italian.png",
    pizza: iconBase + "Pizza.png",
    sushi: iconBase + "Sushi.png",
    british: iconBase + "UK.png"
  };

  var str = "";
  clearResults(markers);
  //for each .kind checked add name to the search string
  $('.kind:checkbox:checked').each(function() {
    if(this.checked){
      str = this.name;
      request = {
        query: str,
        location: currPosition,
        radius: 1500,
        type : ['restaurant']
      }

      service.textSearch(request, pickyCallback);

    }
  });

  //nested functions
  function pickyCallback(results, status) {
    markers = [];
    if(status == google.maps.places.PlacesServiceStatus.OK){
      for(var i = 0; i < results.length; i++){
        //push into the markers array a new created marker from the results of the callback
        markers.push(createPickyMarker(results[i]));
      }
      console.log(markers);
      markers = [];
      results = [];
    }
  }

  function createPickyMarker(place){
    var ristoImage = {
    url: icons[str],
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(30, 22),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 20)
  };
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      icon: ristoImage,
      position: place.geometry.location
    });
    console.log(icons[str]);

    google.maps.event.addListener(marker, 'click', function(){
      infoWindow.setContent(place.name);
      infoWindow.open(map, this);
    });
    return marker;
  }






}

// hide/show effect on the select/option div for kind of cuisine
$("#who").change(function(){
  if($("select option:selected").val() == 3){
    $(".cuisine").show("slow", "swing");
  }else{
    $(".cuisine").hide("slow", "swing");
  }
});

function undefinedChoice(){
  request = {
    location: currPosition,
    radius: 1500,
    type : ['restaurant']
  }
  clearResults(markers);
  service.nearbySearch(request, callback);
}
