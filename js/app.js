var map;
var lauriston = new google.maps.LatLng(51.5380286, -0.0449686);
var startLocation = lauriston;
var iconBase = "img/";
var mapMarkers = [];
var infowindow;
var mapBounds;
var bounds = new google.maps.LatLngBounds();


function initializeMap() {
    
    var mapOptions = {
        //zoom: 17,
        
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

    

    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    
    infowindow = new google.maps.InfoWindow();

    var center;
    function calculateCenter() {
        center = map.getCenter();
    }
    google.maps.event.addDomListener(map, 'idle', function() {
        //map.fitBounds(mapBounds);
        calculateCenter();
    });
    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(center);
      //map.fitBounds(mapBounds);
    });

    
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

