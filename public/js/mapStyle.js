/**
 * Created by Andre on 27.01.2016.
 */
/*
 * function to channel the style for the corresponding layers
 * this function loads the population for the features after they are created to enable the density visualisation
 * @param feature {object} the feature which is loaded to the layer
 * @param layer {object} the corresponding layer responsible for the feature*/
function channelStyle(layer,newCategorie,style) {
    // init the options for the HTTP POST request
    var options = {
        type: populationType,
        feature: layer.feature
    };
    var data = {
        query: sparqlHTTPConnection.createSparqlQuery(options),
        display: "json",
        output: "json"
    };
    switch (populationType) {
        case 'main':
        case 'entitled':

            switch (layer.feature.properties.administrativeLvl) {
                case 'CityDistrict':
                    if (newCategorie) {
                        layer.feature.displayInformation = {};
                        sparqlHTTPConnection.sparqlPOSTRequest(data, function (result) {
                            if (result.length != 0) {
                                for (var i = 0; i < result.length; i++) {
                                    var year = result[i].year.value;
                                    var population = parseInt(result[i].population.value);
                                    var density = population/layer.feature.properties.area;
                                    layer.feature.displayInformation[year] = {
                                        color:getColor(density),
                                        population: population
                                    };
                                }
                            }
                            else {
                                console.log('no data available')
                            }
                            if (layer.feature.displayInformation[selectedYear] != undefined) {
                                var population = layer.feature.displayInformation[selectedYear].population;
                                layer.setStyle(style(population, layer.feature.properties.area));
                            }
                        });
                    }
                    else {
                        if (layer.feature.displayInformation[selectedYear] != undefined) {
                            var population = layer.feature.displayInformation[selectedYear].population;
                            layer.setStyle(style(population, layer.feature.properties.area));
                        }
                    }

                    break;
                case 'District':
                case 'City':
                    if (newCategorie) {
                        layer.feature.displayInformation = {};
                        sparqlHTTPConnection.sparqlPOSTRequest(data, function (result) {
                            // adding the population values for each year to each corresponding feature
                            if (result.length != 0) {
                                for (var i = 0; i < result.length; i++) {
                                    var yearValue = result[i].year.value;
                                    if (layer.feature.displayInformation[yearValue] == undefined) {
                                        layer.feature.displayInformation[yearValue] = {
                                            population: parseInt(result[i].population.value)
                                        };
                                    }
                                    else {
                                        layer.feature.displayInformation[yearValue].population += parseInt(result[i].population.value);
                                    }
                                }
                                for (var year in layer.feature.displayInformation) {
                                    var density = layer.feature.displayInformation[year].population / layer.feature.properties.area;
                                    layer.feature.displayInformation[year].color = getColor(density);
                                }
                            }
                            else {
                                console.log('no data available')
                            }
                            var population = layer.feature.displayInformation[selectedYear].population;
                            layer.setStyle(style(population, layer.feature.properties.area));
                        });
                    }
                    else {
                        var population = layer.feature.displayInformation[selectedYear].population;
                        layer.setStyle(style(population, layer.feature.properties.area));
                    }

                    break;
                default:
                    console.log('error in channel Style')
            }
            break;
        case 'female':
            break;
        case 'male':
            break;
        case 'gender':
            break;
        default:
            break;
    }
}

/*
 * style functions for the geometries
 * */
function densityStyle(people, area) {
    var density = people/area;

    return {
        weight: 2,
        opacity: 0.3,
        color: 'black',
        fillOpacity: 0.7,
        fillColor: getColor(density)
    };
}

/*function to calculate the color for the different population density
 * @param feature {object} the feature that contains information about the area in square kilometer and total population*/
function getColor(density) {

    if (density != null) {
        //var density = feature.properties.population[populationType][selectedYear]/feature.properties.area;
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


function clickedStyle() {
    return {
        color: 'red',
        weight: 3,
        opacity: 1
    }
}
