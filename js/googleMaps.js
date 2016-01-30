var placemarkers=[];
var finalEntities= [];
var refresh_onlyMap=0;
var map,myLocation;
var infoWindow;
var service;
var markers=[];
var done=0;
var resultsLimit;
var countPlaces=0;
var mapEntities = {};

function zoomTobest(map,marker){
    
    map.setZoom(17);
    map.panTo(marker.position);
}


function localizeBest(){
    
    refresh_onlyMap  =  1;    
    initialize();
}

function loadMap(){
    refresh_onlyMap = 0;
    initialize();    
}


function initialize()
{
  var location = new google.maps.LatLng(19.3202176, -99.224016);
  map = new google.maps.Map(document.getElementById('map'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: location,
                scrollwheel: false,
                zoom: 15
                });
   infoWindow = new google.maps.InfoWindow();
   if(navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function (place) {
           myLocation = new google.maps.LatLng(place.coords.latitude, place.coords.longitude);
           service = new google.maps.places.PlacesService(map);

           var marker = new google.maps.Marker({
               map: map,
               position: myLocation

           });
           map.setZoom(14);
           map.panTo(myLocation);
           google.maps.event.addListenerOnce(map, 'idle', performSearch);
       });
   }
    else{
       //code when user does not accept location access
   }
}

function performSearch() {
  var request = {
    bounds: map.getBounds(),
    location : myLocation,
    types: ['bank'],
    radius : 25000
  };
  service.nearbySearch(request, callback);
}


function callback(results, status) {

    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
    }

    (results.length<=20)  ? resultsLimit= results.length : resultsLimit = 20;

    for (var i = 0, result; result = results[i]; i++) {

        addMarker(result);
        saveResult(result);
        if(i==resultsLimit) break; //restrict to 20 places
    }
    saveEntitiesToLS(); //by this time we use need names of places not details
    initCalculator();


    for (var i = 0, result; result = results[i]; i++) {
        getPlaceInfo(result);
        if (i == resultsLimit) break;
    }
}

function getPlaceInfo(place){

    service.getDetails({
        placeId: place.place_id
    }, function(result, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            saveResult(result);
            countPlaces++;
            if(countPlaces==resultsLimit ){
                saveEntitiesToLS();
                countPlaces=0;
            }
        }
        else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            setTimeout(function (){
                getPlaceInfo(place);
            },200);
        }
    });
}

function saveResult(result){

    fe = {};
    fe.id = result.place_id;
    fe.name = result.name;
    fe.address = result.formatted_address;
    fe.phone= result.formatted_phone;
    fe.website = result.website;
    mapEntities[result.place_id]=fe;
}



function saveEntitiesToLS(){
    finalEntities.length=0;
    for(var placeId in mapEntities){
        finalEntities.push(mapEntities[placeId])
    }
    localStorage['financial_entities'] = JSON.stringify(finalEntities);
}

function getFormatedContent(place){
    
    var content ='<div><strong>' + place.name + '</strong><br>' +
                  place.formatted_address + '<br>Tel&#233fono: ' +
                  place.formatted_phone_number + '<br>P&#225gina Web: <a target="_blank" style="color: blue;" href="' + 
                  place.website + '">' + place.website + '</a> <br><button type="button" onclick="location.href=&#39#contact&#39;"                              class="btn  btn-default" aria-label="Left Align"><i class="fa fa-envelope"> Contactar</i></button></div>'
    
    return content;
}

function addMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: 'http://i.imgur.com/KWzGggP.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(15, 15)
    }
  });
  
  markers[place.place_id]=marker;
    
  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      infoWindow.setContent(getFormatedContent(result));
      infoWindow.open(map, marker);
         
    });
  });
}