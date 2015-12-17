"use strict"

// MAP
$( document ).ready(function() {

    L.mapbox.accessToken = getMapboxAccessToken();
    var map = L.mapbox.map('map').setView([51.961298, 7.625849], 13);

    L.control.layers({
        'Streets': L.mapbox.tileLayer('mapbox.streets').addTo(map),
        'Satellite': L.mapbox.tileLayer('mapbox.satellite'),
        'Light': L.mapbox.tileLayer('mapbox.light')
    }).addTo(map);

    // Add Feature Layer
    /*L.mapbox.featureLayer({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
              51.963572,
              7.613130
            ]
        },
        properties: {
            'title': 'Schloss',
            'description': 'Schoss',
            'marker-size': 'large',
            'marker-color': '#BE9A6B',
            'marker-symbol': 'bus'
        }
    }).addTo(map);*/

    /*function onEachFeature(feature, layer) {
			var popupContent = "";

			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}

			layer.bindPopup(popupContent);
		};

    L.geoJson(getGeoJSON(), {

			filter: function (feature, layer) {
				if (feature.properties) {
					// If the property "underConstruction" exists and is true, return false (don't render features under construction)
					return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
				}
				return false;
			},

			onEachFeature: onEachFeature
		}).addTo(map);*/


        var featureLayer = L.mapbox.featureLayer()
        .loadURL('/features/features.geojson')
        .addTo(map);

});
