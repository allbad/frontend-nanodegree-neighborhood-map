'success' : function(data, textStats, XMLHttpRequest) {
					var articles = data.businesses
                    self.businessList(data.businesses);
                    for (var i in self.businessList()) {
                        console.log(self.businessList()[i].name);
                        
                        self.addCategory(self.businessList()[i].categories[0][0]);
                        var position = new google.maps.LatLng(self.businessList()[i].location.coordinate.latitude, 
                                               self.businessList()[i].location.coordinate.longitude);
                        createMarker(self.businessList()[i],position);
                    };
                    self.businessCategories.push(self.businessList()[i].categories[0][0]);

                    console.log(self.businessCategories());
                    console.log(self.uniqueCategories());
                    console.log(self.businessList()[0].name);
                }


//within self.displaylist
                function filteringMarkersBy(keyword) {
    for (var i in venueMarkers) {
      if (venueMarkers[i].marker.map === null) {
        venueMarkers[i].marker.setMap(map);
      }
      if (venueMarkers[i].name.indexOf(keyword) === -1 &&
        venueMarkers[i].category.indexOf(keyword) === -1) {
        venueMarkers[i].marker.setMap(null);
      }
    }