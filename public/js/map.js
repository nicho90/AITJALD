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
	var cityFeatureGroup = L.featureGroup().setStyle(defaultStyle()),
			districtFeatureGroup = L.featureGroup().setStyle(defaultStyle()),
			cityDistrictFeatureGroup = L.featureGroup().setStyle(defaultStyle());

	var cityLayerGroup = L.layerGroup([cityFeatureGroup]).addTo(map),
			districtLayerGroup = L.layerGroup().addTo(map),
			cityDistrictLayerGroup = L.layerGroup().addTo(map);

	// create the geometry query to get the geometries to add them to the feature groups
	var geometryQuery = "PREFIX geo:<" + GEOPREFIX + '> PREFIX dbp:<' + DBPPREFIX + "> " +
			"SELECT ?a ?d ?c " +
			"WHERE {GRAPH <http://course.introlinkeddata.org/G2> {" +
			"?a geo:hasGeometry ?b." +
			"?b geo:asWKT ?c." +
			"?a a ?d." +
			"FILTER(?d = dbp:City || ?d = dbp:District || ?d = dbp:CityDistrict)}}";
	//create the the data object needet for 'sparqlPOSTRequest' function
	var data = {
		query: geometryQuery,
		display:"json",
		output:"json"
	};


	sparqlPOSTRequest(data, function(result){
		for(var i=0; i < result.length; i++) {
			var wktString = result[i].c.value;
			// parse the WKT geometrie to a geoJSON object
			var geoJSONgeometry = Terraformer.WKT.parse(wktString);

			var adminType = result[i].d.value;
			adminType = adminType.replace(DBPPREFIX,'');
			// create the geo
			var geoJSON = {
				geometry: geoJSONgeometry,
				type: 'Feature',
				properties: {
					name: result[i].a.value.replace(LODCOMPREFIX, ''),
					// TODO: do we need this?
					administrativeLvl: adminType
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
	var diagramType = 'hasMainPopulation';
	/*
	 * Function to assign click function etc to the layer/feature
	 */
	function onEachFeature(feature, layer) {
		layer.on({
			click: function(){
				// every other layer should be styled as default
				// TODO: if comparing is active - more than one layer have do be styled 'clicked style'
				for (var i = 0; i < selectedFeatures.length; i++) {
					selectedFeatures[i].setStyle(defaultStyle())
				}
				selectedFeatures = [];
				selectedFeatures.push(layer);
				layer.setStyle(clickedStyle());
				// change the highCharts diagram
				changeHighcharts.setDiagram({
					type: diagramType,
					features: [feature.properties.name]
				})
			}
		})
	}
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
* style function for the geometries
* */
function defaultStyle(feature) {
	return {
		fillColor: 'blue',
		color: 'blue'
	}
}
function clickedStyle(feature) {
	return {
		fillColor: 'red',
		color: 'red'
	}
}