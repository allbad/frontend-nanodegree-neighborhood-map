var map;
var lauriston = new google.maps.LatLng(51.5380286, -0.0449686);
var startLocation = lauriston;
var iconBase = "img/";
var mapMarkers = [];
var infowindow;
var bounds;

function initializeMap() {
    var mapOptions = {
        zoom: 17,
        center: lauriston,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        disableDoubleClickZoom: true,
        mapTypeControl: false,
        scaleControl: true,
        scrollwheel: true,
        panControl: false,
        streetViewControl: false,
        draggable : true,
        overviewMapControl: true,
        overviewMapControlOptions: {
            opened: false,
        },
        styles: lightStyle,
    };
    
    //bounds = new google.maps.LatLngBounds();

    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    
    infowindow = new google.maps.InfoWindow();

    var center;
    function calculateCenter() {
        center = map.getCenter();
    }
    google.maps.event.addDomListener(map, 'idle', function() {
      calculateCenter();
    });
    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(center);
    });

    
}

// Add a marker to the map and push to the array
function createMarker(selection, position) { 
    
    var name = selection.name;
    var snippet = selection.snippet_text;
    var category = selection.categories[0][0];
    var image = selection.image_url;
    var address = selection.location.display_address;
    var phone = selection.display_phone;
    var url = selection.url;
    var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: name,
        animation: google.maps.Animation.DROP,
        icon: iconBase + 'yelp-icon32.png'
    });

    
    
    //bounds.extend(position);

    mapMarkers.push(marker);

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    var contentString = '<div id="iw-container">' +
                    '<div class="iw-title">' + name + '</div>' +
                    '<div class="iw-content">' +
                      '<div class="iw-subTitle">' + category + '</div>' +
                      '<img src="'+ image + '" alt="' + name + '" height="115" width="83">' +
                      '<p>' + snippet + '<span><a href="' + url + '"> more</a></span></p>' +
                    '</div>' +
                    '<div class="iw-bottom-gradient"></div>' +
                  '</div>';
    
        google.maps.event.addListener(marker, 'click', function() {
            toggleBounce();
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
    
    google.maps.event.addListener(map, 'click', function() {
			marker.setAnimation(null);
            infowindow.close();
    });

    google.maps.event.addListener(infowindow, 'closeclick', function() {
        marker.setAnimation(null);
    });
}


//Hide markers from the map
function hideMarkers() {
  for (var i = 0; i < mapMarkers.length; i++) {
    mapMarkers[i].setMap(null);
  }
}

//Remove markers from the map and and clear the array
function deleteMarkers() {
  hideMarkers();
  mapMarkers = [];
}

//Map-canvas in container-fluid fix
$(window).resize(function () {
    var h = $(window).height();
    $('#map-canvas').css('height', (h));
}).resize();
    

//Menu Toggle Script
$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

