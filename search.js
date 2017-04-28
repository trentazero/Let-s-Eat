

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

var clickMeAgain = true;

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
  var searchString = "";
  var resultsHandler = [];
  var maxResults = 20;
  var numOfChoice = 0;
  clearResults(markers);
  //for each .kind checked add name to the search string
  $('.kind:checkbox:checked').each(function() {
    numOfChoice++;
    if(this.checked){
      searchString = this.name;
      request = {
        query: searchString,
        location: currPosition,
        radius: 1500,
        type : ['restaurant']
      }

      resultsHandler.push(icons[searchString]);
      service.textSearch(request, pickyCallback);

    }
  });
  maxResults /= numOfChoice;
  //nested functions
  function pickyCallback(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK){
      for(var i = 0; i < (results.length < maxResults ? results.length : maxResults); i++){
        //push into the markers array a new created marker from the results of the callback
        markers.push(createPickyMarker(results[i]));
      }
      resultsHandler.shift();
    }
    console.log(results);
  }

  function createPickyMarker(place){
    var ristoImage = {
    url: resultsHandler[0],
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

    google.maps.event.addListener(marker, 'click', function(){
      infoWindow.setContent(place.name);
      infoWindow.open(map, this);
    });
    return marker;
  }
  if(clickMeAgain){
  $("#searchButtom").prop('value', 'Click me Baby one more time!');
  clickMeAgain = false;
}
else{
  $("#searchButtom").prop('value', 'Search!');
  clickMeAgain = true;
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

$(".kind").attr('checked', false);

function undefinedChoice(){
  request = {
    location: currPosition,
    radius: 1500,
    type : ['restaurant']
  }
  clearResults(markers);
  service.nearbySearch(request, callback);
}
