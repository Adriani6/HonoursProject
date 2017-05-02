portal.controller("mapController", function($scope, Map, Geo, $uibModalStack, $uibModal, $rootScope)
{
	var attractions = [];
	var attractions_backup = [];

	$scope.states = [
	{
		city: "Aberdeen",
		coords:
		{
			y: 57.149651,
			x: -2.099075
		}
	}];
	$scope.selectedAttractionsText = 0;
	$scope.selectedAttractionsCounter = 0

	$scope.$on('filter', function(event, type, cb)
	{

		if(type == 'efficient')
		{
			Map.sortRoutes(function(data)
			{
				var orderedList = [];

				while(data.length > 0)
				{
					var toPush = data[0];

					for(var i = 0; i < attractions.length; i++)
					{
						if(attractions[i].markerID == toPush.id)
						{
							if(toPush.distance != undefined)
							{
								//attractions[i].distance = (1000 * toPush.distance.toFixed(2));
								if(toPush.distance > 1)
								{
									attractions[i].distance = toPush.distance.toFixed(2) + "km";
								}
								else
									attractions[i].distance = (1000 * toPush.distance.toFixed(2)) + "m";
							}
								
							console.log(toPush, attractions[i])
							orderedList.push(attractions[i]);
							data.splice(0, 1);
						}
					}
				}
				cb(orderedList);
			});
			/*
			Map.filter.efficient(function(data)
			{
				var orderedList = [];

				while(data.length > 0)
				{
					var toPush = data[0];

					for(var i = 0; i < attractions.length; i++)
					{
						if(attractions[i].markerID == toPush)
						{
							orderedList.push(attractions[i]);
							data.splice(0, 1);
						}
					}
				}

				cb(orderedList);
			});*/
			
		}
	});


	$scope.$on('showOnMap', function(event, attraction)
	{
		Map.centerMap(attraction.geo.location.lat, attraction.geo.location.lng)
		$scope.selectAttraction(attraction)
		Map.setZoom(18);
		$uibModalStack.dismissAll();
	});

	$scope.$on('SelectAttraction', function(event, attraction)
	{
		$scope.selectAttraction(attraction);
	});

	$scope.searchCity = function()
	{
		$scope.results = [];
		$scope.enteredCity = myForm.enteredCity.value;

		for (var i = 0; i < $scope.states.length; i++)
		{
			console.log($scope.states[i].city)
			if ($scope.states[i].city.toLowerCase().match(myForm.enteredCity.value.toLowerCase()))
				$scope.results.push($scope.states[i])
		}
		// var a = $scope.states.includes(myForm.enteredCity.value);
		//console.log(a)
	}

	$scope.openItinerary = function()
	{
		$uibModal.open(
		{
			animation: true,
			ariaLabelledBy: 'modal-title-top',
			ariaDescribedBy: 'modal-body-top',
			templateUrl: 'itinerary.html',
			size: 'lg',
			controller: function($scope, $rootScope) {
				$scope.itineraryItems = attractions;
				$scope.isLoading = false;

				$scope.savePlanner = function()
				{
					var scopeItinerary = $scope.itineraryItems;
					
					$uibModal.open(
					{
						animation: true,
						ariaLabelledBy: 'modal-title-top',
						ariaDescribedBy: 'modal-body-top',
						templateUrl: 'saveJourney.html',
						size: 'md',
						controller: function($scope) {
							$scope.save = function()
							{
								var places = [];
								for(var i = 0; i < scopeItinerary.length; i++)
								{
									places.push({marker: scopeItinerary[i].markerID, id: scopeItinerary[i]._id, distance: scopeItinerary[i].distance});
								}
								console.log(places);
								
								$scope.journey.places = places;
								Map.savePlannedJourney($scope.journey, function(r)
								{
									$uibModalStack.dismissAll();
									if(r.route_id)
									{
										$uibModal.open(
										{
											animation: true,
											ariaLabelledBy: 'modal-title-top',
											ariaDescribedBy: 'modal-body-top',
											templateUrl: 'success_route_generation.html',
											size: 'lg',
											controller: function($scope, $rootScope)
											{
												$scope.route_code = r.route_id;
											}
										});
									}
									else
									{
										$rootScope.$broadcast("pushAlert", {type : "warning", title : "Error" , message: "Couldn't save the route."});
									}
									
									//Close all Modals on Success too.
									console.log(r)
								})
							}
						}
					})
				}

				$scope.sort = function()
				{
					$scope.isLoading = true;
					$rootScope.$broadcast("filter", "efficient", function(s)
					{
						console.log("S", s)
						$scope.itineraryItems = s;

						for(var i = 0; i < $scope.itineraryItems.length; i++)
						{
							if($scope.itineraryItems.length - 1 != i || i == 0)
							{
								var loc = $scope.itineraryItems[i].geo.location;
								var nextLoc = $scope.itineraryItems[i + 1].geo.location;

								/*var wgs84Sphere= new ol.Sphere(6378137);
								var dis = wgs84Sphere.haversineDistance([loc.lat, loc.lng], [nextLoc.lat, nextLoc.lng]); 

								var output;
								if (dis > 1000) {
									output = (Math.round(dis / 1000 * 100) / 100) +
									' ' + 'km';
								} else {
									output = (Math.round(dis * 100) / 100) +
									' ' + 'm';
								}
								
								$scope.itineraryItems[i].distanceToNext = output;

								console.log($scope.itineraryItems[i].distanceToNext)*/
							}

						}
						$scope.isLoading = false;
					});
					//console.log(t);
				}
			}
		})
	}

	$scope.goBack = function()
	{
		$scope.activeJustified = $scope.activeJustified - 1;
	}

	$scope.loadMap = function()
	{
		Map.loadMap(function() {

		});

		$scope.centerMap = function(x, y)
		{
			Map.centerMap(x, y)
			Map.setZoom(11);

			$scope.activeJustified = 1;
		}

		$scope.test = function()
		{
			alert("Hallo")
		}

		$scope.selectAttraction = function(attraction)
		{
			if (attraction.selected == undefined)
			{
				attraction.selected = true;

				attractions.push(attraction);

				Map.addMarker(attraction.name, attraction.geo.location.lat, attraction.geo.location.lng, function(id)
				{
					attraction.markerID = id;

					$scope.selectedAttractionsCounter++;

					if (typeof $scope.selectedAttractionsText !== 'string')
					{
						if ($scope.selectedAttractionsCounter > 9)
							$scope.selectedAttractionsText = "9+";
						else
							$scope.selectedAttractionsText++;
					}
				});
			}
			else
			{
				delete attraction.selected;
				for(var i = 0; i < attractions.length; i++)
				{
					if(attractions[i].markerID == attraction.markerID)
					{
						attractions.splice(i, 1);
					}
				}

				Map.removeMarker(attraction.markerID)
				$scope.selectedAttractionsCounter--;
				if (typeof $scope.selectedAttractionsText === 'string')
				{
					if ($scope.selectedAttractionsCounter == 9)
					{
						$scope.selectedAttractionsText = 9;
					}
				}

				if ($scope.selectedAttractionsCounter < 9)
				{
					$scope.selectedAttractionsText--;
				}
			}
		}

		//Obfuscated
		$scope.getLocation = function()
		{
			return $scope.states;
			/*Geo.getLocations(loc, function(res)
			{
			  console.log(res)
			  return res;
			})*/
		}
	}
})

portal.directive('myDirective', function()
{
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel)
		{
			scope.$watch(function()
			{
				return ngModel.$modelValue;
			}, function(newValue)
			{
				console.log(newValue);
			});
		}
	};
});

portal.directive('rightClick', function($document, $uibModal, Attraction)
{
	document.oncontextmenu = function(e)
	{
		if (e.target.hasAttribute('right-click'))
		{
			return false;
		}
	};
	return function(scope, el, attrs)
	{
		el.bind('contextmenu', function(e)
		{
			$uibModal.open(
			{
				animation: true,
				ariaLabelledBy: 'modal-title-top',
				ariaDescribedBy: 'modal-body-top',
				templateUrl: 'showAttrDetails.html',
				size: 'lg',
				controller: function($scope, $rootScope)
				{
					$scope.attraction = scope.attraction;

					$scope.selectAttraction = function(att)
					{
						$rootScope.$broadcast("SelectAttraction", att);
					}

					$scope.showOnMap = function(att)
					{
						$rootScope.$broadcast('showOnMap', att);
					}

					$scope.writeReview = function(attraction)
					{
						$uibModal.open(
						{
							animation: true,
							ariaLabelledBy: 'modal-title-top',
							ariaDescribedBy: 'modal-body-top',
							templateUrl: 'writeReview.html',
							size: 'md',
							controller: function($scope) {

							}
						})
					}

					$scope.showReviews = function(attraction)
					{
						$uibModal.open(
						{
							animation: true,
							ariaLabelledBy: 'modal-title-top',
							ariaDescribedBy: 'modal-body-top',
							templateUrl: 'reviews.html',
							size: 'md',
							controller: function($scope, Reviews, Profile)
							{
								$scope.reviews = [];
								$scope.bigCurrentPage = 1;
								Reviews.fetch(attraction.attraction['_id'], function(reviews)
								{


									for (var i = 0; i < reviews.length; i++)
									{
										//console.log(reviews[i])
										mergeReview(reviews[i])
									}
								})
								//console.log(attraction.attraction)
								function mergeReview(rev)
								{
									Profile.getProfileData(rev.poster, function(data)
									{
										console.log(rev)
										$scope.reviews.push(
										{
											message: rev.review,
											poster: data.firstname + " " + data.surname,
											rating: rev.rating,
											posterID: rev.poster
										})
									})
								}
							}
						})
					}

					$scope.report = function(attraction)
					{
						console.log(attraction)
						$uibModal.open(
						{
							animation: true,
							ariaLabelledBy: 'modal-title-top',
							ariaDescribedBy: 'modal-body-top',
							templateUrl: 'reportWindow.html',
							size: 'sm',
							controller: function($scope, $uibModalStack, $rootScope, Requests)
							{
								$scope.reportType = {};
								console.log(attraction)
								$scope.report = function()
								{
									$uibModalStack.dismissAll()
									var doc = {reporting : []};
									for(var key in $scope.reportType)
									{
										doc.reporting.push(key.split(/(?=[A-Z])/).join(" "));
									}

									doc.attraction = attraction.attraction._id;
									$rootScope.$root.$broadcast('pushAlert', {type : "success", title : "Report Created" , message: "Admin will shortly review your report. Thanks."})
									Requests.createReport(doc, function(re)
									{
										console.log(re)
									})
								}
							}
						})
					}

					$scope.selectBucketPrompt = function(a)
					{
						var attraction = a;

						$uibModal.open(
						{
							animation: true,
							ariaLabelledBy: 'modal-title-top',
							ariaDescribedBy: 'modal-body-top',
							templateUrl: 'selectBucket.html',
							size: 'md',
							controller: function($scope, Profile, $rootScope, $uibModalStack) {
								$scope.baskets = [];
								$scope.selected  = undefined;
								$scope.selectedName = "Nothing Selected";

								Profile.getBuckets(function(b)
								{
									$scope.baskets = b;
								})

								$scope.selectBasket = function(basket)
								{
									$scope.selectedName = basket.name;
									$scope.selected = basket;
								}

								$scope.save = function()
								{
									if($scope.selected)
									{
										var data = {};
										data.attraction = attraction._id;
										data.bucket = $scope.selected._id;
										Profile.addToBucket(data, function(resp)
										{
											$uibModalStack.dismissAll();
											$scope.$root.$broadcast('pushAlert', {type : "success", title : "Bucket Updated" , message: resp})
											
										})
									}
									else
									{
										//Emit Please select basket
										alert("Please select basket first.")
									}
								}
							}
						})
					}

					$scope.alertRating = function(r) {

					}
				}
			});
		});
	}
});