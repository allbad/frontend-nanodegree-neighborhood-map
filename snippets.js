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