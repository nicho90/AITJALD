/**
 * Created by Andre on 11.12.2015.
 */
var map = L.map('map').setView([51.962502, 7.624782], 13);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);