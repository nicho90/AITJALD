"use strict";
var popup,
	comparingStatus = false,
	//TODO: populationType is hardcoded. Should be dynamic through a cookie (last selected population type)
	populationType = 'main',
	selectedAgeGroup = '',
	selectedYear = '',

	// when the timeslider is moved by the user the popups should not be shown
	// this variable helps to identify if the slider is moving by the user
	timeSliderMovement = false,
	selectedFeatures = [];

// MAP
$( document ).ready(function() {
	// assinging the accesstoken for the mapbox library
    L.mapbox.accessToken = getMapboxAccessToken();
	//create the map
    var map = L.mapbox.map('map').setView([51.961298, 7.625849], 11);
	//creating the layer control to switch between different baselayers
    L.control.layers({
        'Streets': L.mapbox.tileLayer('mapbox.streets').addTo(map),
        'Satellite': L.mapbox.tileLayer('mapbox.satellite'),
        'Light': L.mapbox.tileLayer('mapbox.light'),
        'Dark': L.mapbox.tileLayer('mapbox.dark')
    }).addTo(map);

	// INIT
	setDiv('compareButton','map.compareButton.comparison');
	appendDiv('compareButton', 'map.layerButton.city');

	//assigning map click function
	map.on('click', function (e) {
		if(!comparingStatus) {
			setStyleForNoSelectedFeatures();
		}
	});

	// creating the feature Groups for the geometries for different layers
	var cityFeatureGroup = L.featureGroup(),
			districtFeatureGroup = L.featureGroup(),
			cityDistrictFeatureGroup = L.featureGroup();

	var cityLayerGroup = L.layerGroup([cityFeatureGroup]).addTo(map),
			districtLayerGroup = L.layerGroup().addTo(map),
			cityDistrictLayerGroup = L.layerGroup().addTo(map);

	//create the the data object needet for 'sparqlPOSTRequest' function
	var data = {
		query: sparqlHTTPConnection.createSparqlQuery({type: 'geometryQuery'}), // create the geometry query to get the geometries to add them to the feature groups
		display:"json",
		output:"json"
	};


	// create custom slider control
	createSliderControl(map,[cityFeatureGroup,districtFeatureGroup,cityDistrictFeatureGroup]);
	map.legendControl.addLegend(getLegendHTML());

	popup = new L.Popup({ autoPan: false });
	sparqlHTTPConnection.sparqlPOSTRequest(data, function(result){
		for(var i=0; i < result.length; i++) {
			var wktString = result[i].wkt.value;
			// parse the WKT geometrie to a geoJSON object
			var geoJSONgeometry = Terraformer.WKT.parse(wktString);

			var adminType = result[i].type.value;
			adminType = adminType.replace(DBPPREFIX,'');
			// create the geo
			var geoJSON = {
				geometry: geoJSONgeometry,
				type: 'Feature',
				id: result[i].feature.value.replace(LODCOMPREFIX, ''),
				properties: {
					name: result[i].name.value.replace(LODCOMPREFIX, ''),
					lodcomName: result[i].feature.value.replace(LODCOMPREFIX, ''),
					// TODO: do we need this?
					administrativeLvl: adminType,
					// area comes in square meters create as square kilometers
					area: parseFloat(result[i].area.value)/1000000
				}
			};

			// adding the geoJSON to the responsible feature group
			switch(adminType) {
				case 'City':
					cityFeatureGroup.addLayer(L.geoJson(geoJSON,{
						onEachFeature: onEachFeature
					}));
					break;
				case 'District':
					districtFeatureGroup.addLayer(L.geoJson(geoJSON,{
						onEachFeature: onEachFeature
					}));
					break;
				case 'CityDistrict':
					cityDistrictFeatureGroup.addLayer(L.geoJson(geoJSON,{
						onEachFeature: onEachFeature
					}));
					break;
				default:
					console.log('something went wrong. The administrative connection could not be mapped')
			}
		}
	});

	function getMap() {
		return map;
	}
	// TODO: these variables have to dynamic. For testing now hardcoded
	/*
	 * Function to assign click function etc to the layer/feature
	 */
	function onEachFeature(feature, layer) {

		//layer.setStyle();
		channelStyle(layer,true);
		layer.on({
			click: function(){
				layer.bringToFront();

				// every other layer should be styled as default
				// TODO: if comparing is active - more than one layer have do be styled 'clicked style'
				if (!comparingStatus) {

					// UPDATE HIGHCHARTS-PANEL
					$('#chart').html('<br><center><i class="fa fa-spinner fa-pulse"></i></center>');
					sparqlHTTPConnection.getDataForFeature(feature, function (featureData){
						changeHighcharts.setDiagram({
							type: populationType,
							administrativeLvl: feature.properties.administrativeLvl,
							features: [featureData]
						})
					});

					// UPDATE INFO-PANEL
					sparqlHTTPConnection.getDataForPanel(feature, function (panelData){
						setGeneralInformation(feature, panelData);
					});

					for (var i = 0; i < selectedFeatures.length; i++) {
						channelStyle(selectedFeatures[i].layer,false);
					}
					selectedFeatures = [];
					selectedFeatures.push({layer:layer,feature:feature});
				}
				else {
					if (addStatus) {
						var featureInSelecetedGroupHelper = false;
						for (var i = 0; i < selectedFeatures.length; i++) {
							if (layer == selectedFeatures[i].layer) {
								featureInSelecetedGroupHelper = true;
							}
						}
						if (!featureInSelecetedGroupHelper) {
							$('#chart').html('<br><center><i class="fa fa-spinner fa-pulse"></i></center>');
							var featureArrayForHC = [],
									counterHelper = 0;
							selectedFeatures.push({layer:layer,feature:feature});
							for (var i = 0; i < selectedFeatures.length; i++) {
								sparqlHTTPConnection.getDataForFeature(selectedFeatures[i].feature, function (featureData){
									counterHelper +=1;
									featureArrayForHC.push(featureData);
									if (counterHelper == selectedFeatures.length) {
										changeHighcharts.setDiagram({
											type: populationType,
											administrativeLvl: feature.properties.administrativeLvl,
											features: featureArrayForHC
										})
									}

								});
							}
						}
					}
					else {
						var featureInSelecetedGroupHelper = false;
						for (var i = 0; i < selectedFeatures.length; i++) {
							if (layer == selectedFeatures[i].layer) {
								featureInSelecetedGroupHelper = true;
								//delete selectedFeatures[i];
								selectedFeatures.splice(i,1)
							}
						}
						if (featureInSelecetedGroupHelper) {
							$('#chart').html('<br><center><i class="fa fa-spinner fa-pulse"></i></center>');
							var featureArrayForHC = [],
									counterHelper = 0;
							for (var i = 0; i < selectedFeatures.length; i++) {
								sparqlHTTPConnection.getDataForFeature(selectedFeatures[i].feature, function (featureData){
									counterHelper +=1;
									featureArrayForHC.push(featureData);
									if (counterHelper == selectedFeatures.length) {
										changeHighcharts.setDiagram({
											type: populationType,
											administrativeLvl: feature.properties.administrativeLvl,
											features: featureArrayForHC
										})
									}

								});
							}
						}
					}
				}
				layer.setStyle(clickedStyle());
			},
			mousemove: mousemove,
			mouseout: mouseout
		});
	};
	// assigning function to buttons in the top left corner of the map
	// corresponding layer should be displayed others should not be visible
	// change also the colors for the buttons
	$('#level_1_button').click(function () {
		$('#chart2').remove();
		changeHighcharts.emptyHighCharts();
		setStyleForNoSelectedFeatures();
		selectedFeatures = [];
		cityLayerGroup.clearLayers();
		districtLayerGroup.clearLayers();
		cityDistrictLayerGroup.clearLayers();
		cityLayerGroup.addLayer(cityFeatureGroup);
		setButtonStyle('#level_1_button', 'btn-default', 'btn-primary');
		setButtonStyle('#level_2_button', 'btn-primary', 'btn-default');
		setButtonStyle('#level_3_button', 'btn-primary', 'btn-default');
		setDiv('compareButton','map.compareButton.comparison');
		appendDiv('compareButton', 'map.layerButton.city');
	});
	$('#level_2_button').click(function () {
		$('#chart2').remove();
		changeHighcharts.emptyHighCharts();
		setStyleForNoSelectedFeatures();
		selectedFeatures = [];
		cityLayerGroup.clearLayers();
		districtLayerGroup.clearLayers();
		cityDistrictLayerGroup.clearLayers();
		districtLayerGroup.addLayer(districtFeatureGroup);
		setButtonStyle('#level_1_button', 'btn-primary', 'btn-default');
		setButtonStyle('#level_2_button', 'btn-default', 'btn-primary');
		setButtonStyle('#level_3_button', 'btn-primary', 'btn-default');
		setDiv('compareButton','map.compareButton.comparison');
		appendDiv('compareButton', 'map.layerButton.district');
	});
	$('#level_3_button').click(function () {
		$('#chart2').remove();
		changeHighcharts.emptyHighCharts();
		setStyleForNoSelectedFeatures();
		selectedFeatures = [];
		cityLayerGroup.clearLayers();
		districtLayerGroup.clearLayers();
		cityDistrictLayerGroup.clearLayers();
		cityDistrictLayerGroup.addLayer(cityDistrictFeatureGroup);
		setButtonStyle('#level_1_button', 'btn-primary', 'btn-default');
		setButtonStyle('#level_2_button', 'btn-primary', 'btn-default');
		setButtonStyle('#level_3_button', 'btn-default', 'btn-primary');
		setDiv('compareButton','map.compareButton.comparison');
		appendDiv('compareButton', 'map.layerButton.cityDistrict');
	});

	var closeTooltip;

	function mousemove(e) {
		// react to the mouse movement only if the timeslider is not moving
		if (!timeSliderMovement) {

			var layer = e.target;
			if(layer.feature.displayInformation[selectedYear] != undefined) {
				popup.setLatLng(e.latlng);
				if (layer.feature.displayInformation != undefined) {
					if (populationType == 'main' || populationType == 'entitled') {
						var currentPopupInformation = parseInt(layer.feature.displayInformation[selectedYear].population / layer.feature.properties.area);
						//console.log(density)
						popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' +
								currentPopupInformation + ' ' + language[getCookieObject().language].map.legend.title.mainPopulation);
					}
					else {
						var currentPopupInformation = ((layer.feature.displayInformation[selectedYear][selectedAgeGroup].value / layer.feature.displayInformation[selectedYear].population)*100).toFixed(2);
						//console.log(density)
						popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' +
								currentPopupInformation + ' ' + language[getCookieObject().language].map.legend.title.percentPopulation);
					}
				}
				else {
					popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' +
							'No data available');
				}

				if (!popup._map) {
					popup.openOn(map);
				}
				window.clearTimeout(closeTooltip);

				var featureIsInSelectedFeatures = false;
				for (var i = 0; i < selectedFeatures.length; i++) {
					if(selectedFeatures[i].layer == layer) {
						featureIsInSelectedFeatures = true;
					}
				}
				// highlight feature
				if(!featureIsInSelectedFeatures) {
					layer.setStyle({
						weight: 1,
						opacity: 1,
						fillOpacity: 0.9
					});
				}
			}
		}
	};

	function mouseout(e) {

		// react to the mouse out movement only if the timeslider is not moving
		if (!timeSliderMovement) {
			var layer = e.target;
			// check through every checked layer
			if (selectedFeatures.length === 0) {
				channelStyle(layer,false);
			}
			else {
				var selectedFeatueHelper = false;
				for (var i = 0; i < selectedFeatures.length; i++) {
					// if the layer for 'mouseout event' is not in selectedFeatures Array reset the style to densitys
					if (layer == selectedFeatures[i].layer) {
						selectedFeatueHelper = true;
					}
				}
				if (!selectedFeatueHelper) {
					channelStyle(layer,false);
				}
			}

			closeTooltip = window.setTimeout(function() {
				map.closePopup();
			}, 100);
		}
	};

	connectToPopulationTypeDropdownToLoadData(function(result) {
		//$( "#yearSlider").slider('destroy');
		var featureGroups = [cityFeatureGroup,districtFeatureGroup,cityDistrictFeatureGroup];
		populationType = result;
		var counterHelper = 0,
				featureArrayForHC = [];
		console.log(selectedFeatures.length)
		for (var i = 0; i < selectedFeatures.length; i++) {
			sparqlHTTPConnection.getDataForFeature(selectedFeatures[i].feature, function (featureData){
				console.log(featureData)
				counterHelper +=1;
				featureArrayForHC.push(featureData);
				if (counterHelper == selectedFeatures.length) {
					changeHighcharts.setDiagram({
						type: populationType,
						administrativeLvl: selectedFeatures[counterHelper-1].feature.properties.administrativeLvl,
						features: featureArrayForHC
					})
				}

			});
		}
		changeStyleForAllLayers(featureGroups, true);
		changeYearSliderControl(map,featureGroups);
		if (result == 'male' || result == 'female' || result == 'gender') {
			connectAgeDropdownToMap(featureGroups);
		}
		changeLegend();
	});

});


/**
 * source of function: https://www.mapbox.com/mapbox.js/example/v1.0.0/choropleth/
 * @returns {string} html string for the legend div on the map
 */
function getLegendHTML() {
	if (populationType == 'main' || populationType == 'entitled') {
		var grades = [0, 10, 20, 50, 100, 200, 500, 1000],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
					'<li><span class="swatch" style="background:' + getDensitiyColor(from + 1) + '"></span> ' +
					from + (to ? '&ndash;' + to : '+')) + '</li>';
		}

		return '<span>' + language[getCookieObject().language].map.legend.title.mainPopulation + '</span><ul>' + labels.join('') + '</ul>';
	}
	else {
		var grades = [0, 5, 10, 15, 20, 25, 50, 75],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
					'<li><span class="swatch" style="background:' + getPercentColor(from + 1) + '"></span> ' +
					from + (to ? '&ndash;' + to + ' &#37;' : ' &#37; +')) + '</li>';
		}

		return '<span>' + language[getCookieObject().language].map.legend.title.percentPopulation + '</span><ul>' + labels.join('') + '</ul>';
	}
}
function changeLegend(){
	$('.map-legend').empty();
	$('.map-legend').html(getLegendHTML());
}

/*
* function to change the style of every layer in the map corresponding to the selected year on the slider
* @param featureGroups {Array} contains all feature group layers of the map, which style have to be changed
* */
function changeStyleForAllLayers(featureGroups, newCategorie) {
	//if (!timeSliderMovement) {
		// iterate through each layer group
		for (var i = 0; i < featureGroups.length; i++) {
			// in each feature layer group there is a layer group - iterate through it
			for (var layer in featureGroups[i]._layers) {
				// in each layer group there are one feature
				for (var featureId in featureGroups[i]._layers[layer]._layers) {
					var feature = featureGroups[i]._layers[layer]._layers[featureId].feature;
					// change the style of the layer group according to the feature in it
					var featureInSelectedFeatures = false;
					for (var j = 0; j < selectedFeatures.length; j++) {
						if (selectedFeatures[j].feature == feature) {
							featureInSelectedFeatures = true
						}
					}
					//if (!featureInSelectedFeatures || newCategorie) {
						channelStyle(featureGroups[i]._layers[layer]._layers[featureId],newCategorie,featureInSelectedFeatures);
					//}
				}
			}
		}
	//}
};

/**
 * function to create the slider control for the different years
 * @param map {Object} this is needed to enable and disable the dragging of the map
 * @param featureGroups {Array} which contains every feature group layer of the map
 */

function createSliderControl(map,featureGroups) {
	var MyControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},
		onAdd: function () {
			// create the control container with a particular class name
			var container = L.DomUtil.create('div', 'leaflet-year-slider-control');
			container.innerHTML = '<div id="yearSlider"></div>';
			return container;
		}
	});
	map.addControl(new MyControl());
	changeYearSliderControl(map,featureGroups);

};
function changeYearSliderControl(map,featureGroups){
	var options = {
		type: 'distinctPopulation',
		populationType: populationType
	};

	var data = {
		query: sparqlHTTPConnection.createSparqlQuery(options),
		display: "json",
		output: "json"
	};
	var yearValueArray = [];
	sparqlHTTPConnection.sparqlPOSTRequest(data, function (result) {
		for (var i = 0; i < result.length; i++) {
			yearValueArray.push(parseInt(result[i].year.value));
		}
		$('#yearSlider').empty()
		$( "#yearSlider").slider({
			min: yearValueArray[0],
			max: yearValueArray[yearValueArray.length-1],
			value: yearValueArray[yearValueArray.length-1],
			slide: function(event,ui) {
				selectedYear = ui.value.toString();
				changeStyleForAllLayers(featureGroups,false);
			},
			// disable the dragging function of map. Otherwise the map would be dragged together with the slider
			start: function() {
				timeSliderMovement = true;
				map.dragging.disable()
			},
			// after sliding, enable the dragging function of the map
			stop: function() {
				timeSliderMovement = false;
				map.dragging.enable()
			}
		})
		.each(function() {
			// adding labels for every step in the slider
			//getting the values from the step
			var opt = $(this).data()['ui-slider'].options;
			// Get the number of possible values
			var values = opt.max - opt.min;
			// Position the labels
			for (var i = 0; i <= values; i++) {
				// Create a new element and position it with percentages
				var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/values*100-3) + '%');
				// Add the element inside #slider
				$("#yearSlider").append(el);
			}
		});
		if (yearValueArray.length == 1) {
			$('#yearSlider').css('width', '10px');
			/*$('#yearSlider').css('position', 'relative')
			$('.ui-slider-handle').css('position', 'absolute')
			$('.ui-slider-handle').css('height', '1.2em')
			$('.ui-slider-handle').css('width', '1.2em')*/
		}
		else {
			$('#yearSlider').css('width', '300px');
			/*$('#yearSlider').css('position', 'relative')
			$('.ui-slider-handle').css('position', 'absolute')
			$('.ui-slider-handle').css('height', '1.2em')
			$('.ui-slider-handle').css('width', '1.2em')*/
		}
		selectedYear = yearValueArray[yearValueArray.length-1];
		//$('#yearSlider').slider('refresh')
	});
}



function setStyleForNoSelectedFeatures() {
	// if a user clicks on the map and not on a feature, no feature should be visualized as visible
	// TODO: Highcharts should be empty now

	for (var i = 0; i < selectedFeatures.length; i++) {
		// if the layer for 'mouseout event' is not in selectedFeatures Array reset the style to densitys
		selectedFeatures[i].layer.setStyle(channelStyle(selectedFeatures[i].layer),false);
	}
};
