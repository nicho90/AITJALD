"use strict";
var popup,
	comparing = false,
	//TODO: populationType is hardcoded. Should be dynamic
	populationType = 'main',

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
        'Light': L.mapbox.tileLayer('mapbox.light')
    }).addTo(map);

	//assigning map click function
	map.on('click', function (e) {
		if(!comparing) {
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
				console.log(feature)
				$('#chart_1').html('loading');
				// every other layer should be styled as default
				// TODO: if comparing is active - more than one layer have do be styled 'clicked style'
				if (!comparing) {
					sparqlHTTPConnection.getDataForFeature(feature,function (featureData){
						changeHighcharts.setDiagram({
							type: populationType,
							administrativeLvl: feature.properties.administrativeLvl,
							features: [featureData]
						})
					});

					for (var i = 0; i < selectedFeatures.length; i++) {
						channelStyle(selectedFeatures[i].layer)
					}
					selectedFeatures = [];
					selectedFeatures.push({layer:layer,feature:feature});
				}
				else {
					var featureArrayForHC = [];
					selectedFeatures.push({layer:layer,feature:feature});
					for (var i = 0; i < selectedFeatures.length; i++) {
						featureArrayForHC.push(selectedFeatures[i].feature)
					}
					// change the highCharts diagram
					changeHighcharts.setDiagram({
						type: populationType,
						administrativeLvl: feature.properties.administrativeLvl,
						features: featureArrayForHC
					})
				}
				layer.setStyle(clickedStyle());

			},
			mousemove: mousemove,
			mouseout: mouseout
		})

	}
	// assigning function to buttons in the top left corner of the map
	// corresponding layer should be displayed others should not be visible
	// change also the colors for the buttons
	$('#level_1').click(function () {
		cityLayerGroup.clearLayers();
		districtLayerGroup.clearLayers();
		cityDistrictLayerGroup.clearLayers();
		cityLayerGroup.addLayer(cityFeatureGroup);
		$('#level_1').removeClass('btn btn-default').addClass('btn btn-primary');
		$('#level_2').removeClass('btn btn-primary').addClass('btn btn-default');
		$('#level_3').removeClass('btn btn-primary').addClass('btn btn-default');
	});
	$('#level_2').click(function () {
		cityLayerGroup.clearLayers();
		districtLayerGroup.clearLayers();
		cityDistrictLayerGroup.clearLayers();
		districtLayerGroup.addLayer(districtFeatureGroup);
		$('#level_1').removeClass('btn btn-primary').addClass('btn btn-default');
		$('#level_2').removeClass('btn btn-default').addClass('btn btn-primary');
		$('#level_3').removeClass('btn btn-primary').addClass('btn btn-default');
	});
	$('#level_3').click(function () {
		cityLayerGroup.clearLayers();
		districtLayerGroup.clearLayers();
		cityDistrictLayerGroup.clearLayers();
		cityDistrictLayerGroup.addLayer(cityDistrictFeatureGroup);
		$('#level_1').removeClass('btn btn-primary').addClass('btn btn-default');
		$('#level_2').removeClass('btn btn-primary').addClass('btn btn-default');
		$('#level_3').removeClass('btn btn-default').addClass('btn btn-primary');
	});
	var closeTooltip;

	function mousemove(e) {
		// react to the mouse movement only if the timeslider is not moving
		if (!timeSliderMovement) {
			var layer = e.target;
			popup.setLatLng(e.latlng);
				if (layer.feature.displayInformation != undefined) {
					var currentPopupInformation = parseInt(layer.feature.displayInformation[selectedYear].population / layer.feature.properties.area);
					//console.log(density)
					popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' +
							currentPopupInformation + ' ' + language[getCookieObject().language].map.legend.title.mainPopulation);
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

	function mouseout(e) {

		// react to the mouse out movement only if the timeslider is not moving
		if (!timeSliderMovement) {
			var layer = e.target;
			// check through every checked layer
			if (selectedFeatures.length === 0) {
				channelStyle(layer,false);
			}
			else {
				if (!comparing) {
					for (var i = 0; i < selectedFeatures.length; i++) {
						// if the layer for 'mouseout event' is not in selectedFeatures Array reset the style to densitys
						if (layer !== selectedFeatures[i].layer) {
							channelStyle(layer,false);
						}
					}
				}

			}

			closeTooltip = window.setTimeout(function() {
				map.closePopup();
			}, 100);
		}
	}
	connectToPopulationTypeDropdownToLoadData(function(result) {
		populationType = result;
		var featureGroups = [cityFeatureGroup,districtFeatureGroup,cityDistrictFeatureGroup];
		changeStyleForAllLayersAccordingToYear(featureGroups, true)
	});

});
function defualtStyle() {
	return {
		weight: 2,
		opacity: 0.3,
		color: 'black',
		fillOpacity: 0.7,
		fillColor: 'blue'
	};
}

// TODO: At the moment hardcoded - there could be a slider for the different years
var selectedYear = "2014";

/**
 * source of function: https://www.mapbox.com/mapbox.js/example/v1.0.0/choropleth/
 * @returns {string} html string for the legend div on the map
 */
function getLegendHTML() {
	var grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<li><span class="swatch" style="background:' + getColor(from + 1) + '"></span> ' +
			from + (to ? '&ndash;' + to : '+')) + '</li>';
	}

	return '<span>' + language[getCookieObject().language].map.legend.title.mainPopulation + '</span><ul>' + labels.join('') + '</ul>';
}

/*
* function to change the style of every layer in the map corresponding to the selected year on the slider
* @param featureGroups {Array} contains all feature group layers of the map, which style have to be changed
* */
function changeStyleForAllLayersAccordingToYear(featureGroups, newCategorie) {
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
					if (!featureInSelectedFeatures) {
						channelStyle(featureGroups[i]._layers[layer]._layers[featureId],newCategorie);
					}
				}
			}
		}
	//}
}

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
			container.innerHTML =
				'<div id="yearSlider"></div>';

			return container;
		}
	});
	map.addControl(new MyControl());
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
		$( "#yearSlider" ).slider({
				value: yearValueArray[yearValueArray.length-1],
				min: yearValueArray[0],
				max: yearValueArray[yearValueArray.length-1],
				step: 1,
				slide: function(event,ui) {
					selectedYear = ui.value.toString();
					changeStyleForAllLayersAccordingToYear(featureGroups,false);
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
	});
}

function setStyleForNoSelectedFeatures() {
	// if a user clicks on the map and not on a feature, no feature should be visualized as visible
	// TODO: Highcharts should be empty now
	// TODO:

		for (var i = 0; i < selectedFeatures.length; i++) {
			// if the layer for 'mouseout event' is not in selectedFeatures Array reset the style to densitys
			selectedFeatures[i].layer.setStyle(channelStyle(selectedFeatures[i].layer),false);
		}
}