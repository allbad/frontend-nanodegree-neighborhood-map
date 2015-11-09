'use strict';

ko.bindingHandlers.addressAutocomplete = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor(),
            allBindings = allBindingsAccessor();

        var options = {
            types: ['geocode'],
            componentRestrictions: {
                country: "uk"
            }
        };
        ko.utils.extend(options, allBindings.autocompleteOptions);

        var autocomplete = new google.maps.places.Autocomplete(element, options);

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var result = autocomplete.getPlace(); // Get search input result
            // Does the result contain a formatted address?
            if (!result.formatted_address) {
                alert("Can't find location"); // alert the user
                return
            } else {
                bounds = new google.maps.LatLngBounds(); // Reset the bounds object
                for (var i = 0; i < vm.businessList().length; i++) {
                    vm.businessList()[i].marker.setMap(null); // remove the map marker for each location
                }
                vm.businessList.removeAll(); // clear the businessList observable array
                vm.location(result.formatted_address); // update the location observable
            }
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        ko.bindingHandlers.value.update(element, valueAccessor);

    }
};

ko.bindingHandlers.typeahead = {
    init: function (element, valueAccessor, bindingAccessor) {
        var substringMatcher = function (strs) {
            return function findMatches(q, cb) {
                var matches, substrRegex;

                // an array that will be populated with substring matches
                matches = [];

                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');

                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strs, function (i, str) {
                    console.log(str);
                    if (substrRegex.test(str)) {
                        // the typeahead jQuery plugin expects suggestions to a
                        // JavaScript object, refer to typeahead docs for more info
                        matches.push(str);
                    }
                });

                cb(matches);
            };
        };
        var $e = $(element),
            options = valueAccessor();

        // passing in `null` for the `options` arguments will result in the default
        // options being used
        $e.typeahead({
            highlight: true,
            minLength: 2
        }, {
            source: substringMatcher(options.source())
        }).on('typeahead:selected', function (el, datum) {
            console.dir(datum);
        }).on('typeahead:autocompleted', function (el, datum) {
            console.dir(datum);
        });

    }
};

var MyModel = function() {
	var self = this;

    self.preventDefault = function(e) {
        return false;
    }

	self.location = ko.observable("Victoria Park Rd, London E9 7HD, UK");
    
    self.businessList = ko.observableArray([]);
    
    // Add a marker to the map and push to the array
    self.createMarker = function(selection, position) { 
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
        selection.marker = marker;

        bounds.extend(position);

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
                      '<p>' + snippet + '<span><a target="_blank" href="' + url + '"> more</a></span></p>' +
                    '</div>' +
                    '<div class="iw-bottom-gradient"></div>' +
                  '</div>';

                google.maps.event.addListener(marker, 'click', function() {
                    toggleBounce();
                    window.setTimeout(function() {
                        toggleBounce();
                    }, 2100);
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
    
    self.filter = ko.observable('');
    
    self.filterBusinessList = ko.dependentObservable(function(){
        var filter = self.filter().toLowerCase();

        // Is the filter null, defined, or empty?
        if (filter === null || filter === undefined || filter === ''){
        // For each location object
        for (var i = 0; i < self.businessList().length; i++) {
                // Does the marker already exist?
                if (self.businessList()[i].marker) {
                    self.businessList()[i].marker.setVisible(true); // show the marker
                }
            }
            return self.businessList(); // return all locations
        } else {
            // For each location object
            for (var i = 0; i < self.businessList().length; i++) {
                // Does the location category contain the search term?
                if (self.businessList()[i].categories[0][0].toLowerCase().indexOf(self.filter().toLowerCase()) === -1) {
                    self.businessList()[i].marker.setVisible(false); // hide the marker
                } else {
                    self.businessList()[i].marker.setVisible(true); // show the marker
                }
            }

            // return businesses which contain the search term
            return ko.utils.arrayFilter(self.businessList(), function(business){
                return business.categories[0][0].toLowerCase().indexOf(self.filter().toLowerCase()) >= 0;
            });
        }
    });

	initializeMap();
 
	self.newLocation = ko.computed(function() {
        if (self.location() != '') {
            requestLocation(self.location());
        }
    });

	//Pan to marker when list item clicked
    self.businessListItem = function(clickedBusiness) {
        google.maps.event.trigger(clickedBusiness.marker, 'click');
        map.panTo(clickedBusiness.marker.position);
    };
    
    // get location data using Google Map Place Service
	function requestLocation(location) {
        var request = {
			query: location
		};
		var service = new google.maps.places.PlacesService(map);
		service.textSearch(request, locationCallback);
	}

	// this is the callback function from calling the Place Service
	function locationCallback(location, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			getNeighborhoodInformation(location[0]);
		} else {
			console.log("Can't find valid location in Google Maps");
		}
	}

	function getNeighborhoodInformation(locationDetail) {
		//var lat = locationDetail.geometry.location.lat();
		//var lng = locationDetail.geometry.location.lng();
		//var name  = locationDetail.name;
		//console.log(locationDetail.formatted_address);
        var newLocation = locationDetail.formatted_address;

		var auth = {

				consumerKey : "9jEzbDg-39uVCnlMZmh5Lg",
				consumerSecret : "NYyE61bAsnrM35pe2HjjnKuw6jQ",
				accessToken : "oTvzMg8BSJwUO7n7Zmi-Euf-t7igOUVw",

				accessTokenSecret : "q_mrmjbkSmtkYlFu9RBXqBLUe_k",
				serviceProvider : {
					signatureMethod : "HMAC-SHA1"
				}
			};
			var accessor = {
				consumerSecret : auth.consumerSecret,
				tokenSecret : auth.accessTokenSecret
			};
			var parameters = [];
			parameters.push(['callback', 'cb']);
			parameters.push(['location', newLocation]);
			parameters.push(['radius_filter', 650]);
			parameters.push(['oauth_consumer_key', auth.consumerKey]);
			parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
			parameters.push(['oauth_token', auth.accessToken]);
			parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
			var message = {
				'action' : 'http://api.yelp.com/v2/search',
				'method' : 'GET',
				'parameters' : parameters
			};
			OAuth.setTimestampAndNonce(message);
			OAuth.SignatureMethod.sign(message, accessor);

			var parameterMap = OAuth.getParameterMap(message.parameters);
			parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
			
			//Ajax query
            $.ajax({
				'url' : message.action,
				'data' : parameterMap,
				'cache' : true,
				'dataType' : 'jsonp',
                'timeout' : 5000,
				'jsonpCallback' : 'cb',
				'success' : function(data, textStats, XMLHttpRequest) {
                    self.businessList(data.businesses);
                    for (var i in self.businessList()) {
                        var business = self.businessList()[i];
                        var loc = business.location.coordinate;
                        var position = new google.maps.LatLng(loc.latitude, loc.longitude);
                        self.createMarker(business,position);
                        map.fitBounds(bounds);
                    }
                },
                error: function (parsedjson, textStatus, errorThrown) {
                    console.log("parsedJson: " + JSON.stringify(parsedjson));
                    alert('Error: Timeout getting Yelp data');
                }
            });
        };
    
};

var vm;
$(function() {
    vm = new MyModel(); // Assign MyModel object to a variable
    ko.applyBindings(vm); // Apply bindings to vm variable
});