"use strict"

//
$( document ).ready(function() {

    // Show Dialog
    $( "#dialog" ).dialog();

    // Load Leaflet-Map
    var map = L.map('map').setView([51.961298, 7.625849], 13);

    /*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);*/

    L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: getMapboxAccessToken(),
    }).addTo(map);

    L.marker([51.963572, 7.613130])
    .addTo(map)
    .bindPopup('Schloss')
    .openPopup();

    function onEachFeature(feature, layer) {
			var popupContent = "<p>I started out as a GeoJSON " +
					feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

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
		}).addTo(map);

});
