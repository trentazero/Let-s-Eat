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
  var str = "";
  $('.kind:checkbox:checked').each(function() {
    if(this.checked){
      str += this.name + " ";
    }
  });
  request = {
    query: str,
    location: currPosition,
    radius: 1500,
    type : ['restaurant']
  }
  clearResults(markers);
  service.textSearch(request, callback);
}

$(".cuisine").change(function(){
  console.log("I work");
  if($("select option:selected").val() == 3){
    $(".kind").hide();
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
