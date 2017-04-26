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
  clearResults(markers);
  var str = "";
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
      var iconBase = "https://letseat.azurewebsites.net/img/";
      var icons = {
        burger: iconBase + "Burger.png",
        chinese: iconBase + "Chinese.png",
        indian: iconBase + "Indian.png",
        italian: iconBase + "Italian.png",
        pizza: iconBase + "Pizza.png",
        sushi: iconBase + "Sushi.png",
        uk: iconBase + "UK.png"
      };

      service.textSearch(request, callback);
    }
  });






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
