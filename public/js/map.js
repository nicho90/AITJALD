"use strict";

// MAP
$( document ).ready(function() {
	var selectedFeatures = [];
	// assinging the accesstoken for the mapbox library
    L.mapbox.accessToken = getMapboxAccessToken();
	//create the map
    var map = L.mapbox.map('map').setView([51.961298, 7.625849], 12);

	//creating the layer control to switch between different baselayers
    L.control.layers({
        'Streets': L.mapbox.tileLayer('mapbox.streets').addTo(map),
        'Satellite': L.mapbox.tileLayer('mapbox.satellite'),
        'Light': L.mapbox.tileLayer('mapbox.light')
    }).addTo(map);

	// creating the feature Groups for the geometries for different layers
	var cityFeatureGroup = L.featureGroup(),
			districtFeatureGroup = L.featureGroup(),
			cityDistrictFeatureGroup = L.featureGroup();

	var cityLayerGroup = L.layerGroup([cityFeatureGroup]).addTo(map),
			districtLayerGroup = L.layerGroup().addTo(map),
			cityDistrictLayerGroup = L.layerGroup().addTo(map);

	// create the geometry query to get the geometries to add them to the feature groups
	var geometryQuery = 'PREFIX geo:<' + GEOPREFIX + '> PREFIX dbp:<' + DBPPREFIX + '> ' +
			'PREFIX gn:<' + GNPREFIX + '> ' +
			'SELECT ?a ?type ?area ?wkt ' +
			'WHERE {GRAPH <http://course.introlinkeddata.org/G2> {' +
            '?a geo:hasGeometry ?b.' +
			'?b dbp:area ?area.' +
			'?b geo:asWKT ?wkt.' +
			'?a a ?type.' +
			'FILTER(?type = dbp:City || ?type = dbp:District || ?type = dbp:CityDistrict)}}';
	//create the the data object needet for 'sparqlPOSTRequest' function
	var data = {
		query: geometryQuery,
		display:"json",
		output:"json"
	};


	sparqlPOSTRequest(data, function(result){
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
				properties: {
					name: result[i].a.value.replace(LODCOMPREFIX, ''),
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
					})).setStyle(densityStyle(geoJSON));
					break;
				case 'District':
					districtFeatureGroup.addLayer(L.geoJson(geoJSON,{
						onEachFeature: onEachFeature
					})).setStyle(densityStyle(geoJSON));
					break;
				case 'CityDistrict':
					cityDistrictFeatureGroup.addLayer(L.geoJson(geoJSON,{
						onEachFeature: onEachFeature
					})).setStyle(densityStyle(geoJSON));
					break;
				default:
					console.log('something went wrong. The administrative connection could not be mapped')
			}
		}
	});

	// TODO: these variables have to dynamic. For testing now hardcoded
	var diagramType = 'hasMainPopulation';
	/*
	 * Function to assign click function etc to the layer/feature
	 */
	function onEachFeature(feature, layer) {
		channelStyle(feature,layer);
		layer.on({
			click: function(){
				//console.log(feature);
				// every other layer should be styled as default
				// TODO: if comparing is active - more than one layer have do be styled 'clicked style'
				for (var i = 0; i < selectedFeatures.length; i++) {
					selectedFeatures[i].layer.setStyle(densityStyle(selectedFeatures[i].feature))
				}
                layer.bringToFront();
				selectedFeatures = [];
				selectedFeatures.push({layer:layer,feature:feature});
				layer.setStyle(clickedStyle());
				// change the highCharts diagram
				changeHighcharts.setDiagram({
					type: diagramType,
					administrativeLvl: feature.properties.administrativeLvl,
					features: [feature]
				})
			}
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
});

/*
* function to channel the style for the corresponding layers
* this function loads the population for the features after they are created to enable the density visualisation
* @param feature {object} the feature which is loaded to the layer
* @param layer {object} the corresponding layer responsible for the feature*/
function channelStyle(feature,layer) {
	// init the options for the HTTP POST request
	var options = {
		type: 'hasMainPopulation',
		administrativeLvl: feature.properties.administrativeLvl,
		features: [feature.properties.name]
	};

	var data = {
		query: createSparqlQuery(options),
		display: "json",
		output: "json"
	};
	switch (feature.properties.administrativeLvl) {
		case 'CityDistrict':

			sparqlPOSTRequest(data, function (result) {
				// adding the population values for each year to each corresponding feature
				if (result.length != 0) {s
					feature.properties.population = {};
					for (var i = 0; i < result.length; i++) {
						feature.properties.population[result[i].year.value] = parseInt(result[i].value.value);
					}
				}
				else {
					console.log('no data available')
				}
				layer.setStyle(densityStyle(feature));

			});
			break;
		case 'District':
		case 'City':
			sparqlPOSTRequest(data, function (result) {
				// adding the population values for each year to each corresponding feature
				if (result.length != 0) {
					feature.properties.population = {};
					for (var i = 0; i < result.length; i++) {
						if (feature.properties.population[result[i].year.value] == undefined) {
							feature.properties.population[result[i].year.value] = parseInt(result[i].value.value);
						}
						else {
							feature.properties.population[result[i].year.value] += parseInt(result[i].value.value);
						}
					}
				}
				else {
					console.log('no data available')
				}
				layer.setStyle(densityStyle(feature));

			});
			break;
		default:
			console.log('error in channel Style')
	}
}
// TODO: At the moment hardcoded - there could be a slider for the different years
var selectedYear = "2014";


/*
* style functions for the geometries
* */
function densityStyle(feature) {
	//console.log(feature)
	return {
		weight: 2,
		opacity: 0.3,
		color: 'black',
		fillOpacity: 0.7,
		fillColor: getColor(feature)
	};
}
function clickedStyle() {
	return {
		fillColor: 'red',
		color: 'red'
	}
}
/*function to calculate the color for the different population density
* @param feature {object} the feature that contains information about the area in square kilometer and total population*/
function getColor(feature) {
	if (feature.properties.population != undefined) {
		var density = feature.properties.population[selectedYear]/feature.properties.area;
		return density > 1000 ? '#8c2d04' :
				density > 500  ? '#cc4c02' :
						density > 200  ? '#ec7014' :
								density > 100  ? '#fe9929' :
										density > 50   ? '#fec44f' :
												density > 20   ? '#fee391' :
														density > 10   ? '#fff7bc' :
																'#ffffe5';
	}
	else {
		return '#dddddd'
	}

}