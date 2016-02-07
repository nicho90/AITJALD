/**
 * Styles for features on map:
 * - Highlighting clicked/selected features
 * - Colorizing features based on population density
 **/

'use strict'

/**
 * Function to channel the style for the corresponding layers
 * this function loads the population for the features after they are created to enable the density visualisation
 * @param feature {object} the feature which is loaded to the layer
 * @param layer {object} the corresponding layer responsible for the feature
 **/
function channelStyle(layer,newCategorie,selected) {
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
    if (data.query) {
        switch (populationType) {
            case 'main':
            case 'entitled':
                if (newCategorie) {
                    switch (layer.feature.properties.administrativeLvl) {
                        case 'CityDistrict':
                            layer.feature.displayInformation = {};
                            sparqlHTTPConnection.sparqlPOSTRequest(data, function (result) {
                                if (result.length != 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        var year = result[i].year.value;
                                        var population = parseInt(result[i].population.value);
                                        var density = population / layer.feature.properties.area;
                                        layer.feature.displayInformation[year] = {
                                            color: getDensitiyColor(density),
                                            population: population
                                        };
                                    }
                                }
                                else {
                                    console.log('no data available')
                                }
                                if (layer.feature.displayInformation[selectedYear] != undefined) {
                                    var population = layer.feature.displayInformation[selectedYear].population;
                                    layer.setStyle(densityStyle(population, layer.feature.properties.area));
                                    if (selected) {
                                        layer.setStyle(clickedStyle())
                                    }
                                }
                            });
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
                                                    population: 0
                                                };
                                            }
                                            layer.feature.displayInformation[yearValue].population += parseInt(result[i].population.value);
                                        }
                                        for (var year in layer.feature.displayInformation) {
                                            var density = layer.feature.displayInformation[year].population / layer.feature.properties.area;
                                            layer.feature.displayInformation[year].color = getDensitiyColor(density);
                                        }
                                    }
                                    else {
                                        console.log('no data available')
                                    }
                                    var population = layer.feature.displayInformation[selectedYear].population;
                                    layer.setStyle(densityStyle(population, layer.feature.properties.area));
                                    if (selected) {
                                        layer.setStyle(clickedStyle())
                                    }
                                });
                            }
                            else {
                                var population = layer.feature.displayInformation[selectedYear].population;
                                layer.setStyle(densityStyle(population, layer.feature.properties.area));
                            }

                            break;
                        default:
                            console.log('error in channel Style')
                    }
                }
                else {
                    if (layer.feature.displayInformation[selectedYear] != undefined) {
                        var population = layer.feature.displayInformation[selectedYear].population;
                        layer.setStyle(densityStyle(population, layer.feature.properties.area));
                    }
                }
                break;
            case 'female':
            case 'male':
            case 'gender':
                if (newCategorie) {
                    switch (layer.feature.properties.administrativeLvl) {
                        case 'CityDistrict':
                            layer.feature.displayInformation = {};
                            sparqlHTTPConnection.sparqlPOSTRequest(data, function (result) {
                                if(result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        if (layer.feature.displayInformation[result[i].year.value] == undefined) {
                                            layer.feature.displayInformation[result[i].year.value] = {
                                                population: result[i].entitledPopulationValue.value
                                            };
                                        }
                                        layer.feature.displayInformation[result[i].year.value][result[i].agegroup.value] = {
                                            value:parseInt(result[i].value.value)
                                        };
                                        if (layer.feature.displayInformation[result[i].year.value].all == undefined) {
                                            layer.feature.displayInformation[result[i].year.value].all = {
                                                value: 0
                                            };
                                        }
                                        layer.feature.displayInformation[result[i].year.value].all.value += parseInt(result[i].value.value);
                                    }
                                }
                                else {
                                    console.log('No data Available for the feature ' + layer.feature.properties.name);
                                }
                                if (layer.feature.displayInformation[selectedYear] != undefined) {
                                    var population = layer.feature.displayInformation[selectedYear].population;
                                    layer.setStyle(procentStyle(population, layer.feature.displayInformation[selectedYear][selectedAgeGroup].value));
                                    if (selected) {
                                        layer.setStyle(clickedStyle())
                                    }
                                }
                            });
                            break;
                        case 'District':
                        case 'City':
                            layer.feature.displayInformation = {};
                            sparqlHTTPConnection.sparqlPOSTRequest(data, function (result) {

                                //console.log(result);
                                // adding the population values for each year to each corresponding feature
                                if (result.length != 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        var yearValue = result[i].year.value;
                                        if (layer.feature.displayInformation[yearValue] == undefined) {
                                            layer.feature.displayInformation[yearValue] = {
                                                population: 0,
                                                tmpPopulation: {}
                                            };
                                        }
                                        if (layer.feature.displayInformation[yearValue].tmpPopulation[result[i].feature.value] == undefined) {
                                            layer.feature.displayInformation[yearValue].tmpPopulation[result[i].feature.value] = parseInt(result[i].entitledPopulationValue.value);
                                        }
                                        if (layer.feature.displayInformation[yearValue][result[i].agegroup.value] == undefined) {
                                            layer.feature.displayInformation[yearValue][result[i].agegroup.value] = {
                                                value: 0
                                            };
                                        }
                                        layer.feature.displayInformation[yearValue][result[i].agegroup.value].value += parseInt(result[i].value.value);

                                        if (layer.feature.displayInformation[result[i].year.value].all == undefined) {
                                            layer.feature.displayInformation[result[i].year.value].all = {
                                                value: 0
                                            };
                                        }
                                        layer.feature.displayInformation[result[i].year.value].all.value += parseInt(result[i].value.value);
                                    }
                                    for (var year in layer.feature.displayInformation) {
                                        for (var feature in layer.feature.displayInformation[year].tmpPopulation) {
                                            layer.feature.displayInformation[year].population += layer.feature.displayInformation[year].tmpPopulation[feature];
                                        }
                                        delete layer.feature.displayInformation[year].tmpPopulation;
                                    }
                                    for (var year in layer.feature.displayInformation) {
                                        var percent = layer.feature.displayInformation[year].population / layer.feature.properties.area;
                                        layer.feature.displayInformation[year].color = getPercentColor(percent);
                                    }
                                }
                                else {
                                    console.log('no data available')
                                }
                                if (layer.feature.displayInformation[selectedYear] != undefined) {
                                    var population = layer.feature.displayInformation[selectedYear].population;
                                    layer.setStyle(procentStyle(population, layer.feature.displayInformation[selectedYear][selectedAgeGroup].value));
                                    if (selected) {
                                        layer.setStyle(clickedStyle())
                                    }
                                }
                            });
                            break;
                        default:
                            console.log('error in channel Style')
                    }
                }
                else {
                    if (layer.feature.displayInformation[selectedYear] != undefined) {
                        var population = layer.feature.displayInformation[selectedYear].population;
                        layer.setStyle(procentStyle(population, layer.feature.displayInformation[selectedYear][selectedAgeGroup].value));
                    }
                }
                break;
            default:
                break;
        }

    }
    else {
        console.error('The SPARQL query could not be created');
    }
}

/** Style functions for the geometries
 *
 **/
function densityStyle(people, area) {
    var density = people/area;

    return {
        weight: 2,
        opacity: 0.3,
        color: 'black',
        fillOpacity: 0.7,
        fillColor: getDensitiyColor(density)
    };
}

/** Function to calculate the color for the different population density
 * @param feature {object} the feature that contains information about the area in square kilometer and total population
 **/
function getDensitiyColor(density) {

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
};

/** Function to calculate the style for the different population density
 * @param peopleSum {number} total number of people
 * @param people {number} number of the people in this area (city / district / city district)
 */
function procentStyle(peopleSum, people) {
    var procent = (parseInt(people)/parseInt(peopleSum))*100;
    return {
        weight: 2,
        opacity: 0.3,
        color: 'black',
        fillOpacity: 0.7,
        fillColor: getPercentColor(procent)
    };
};

/** Function to provide the html-color for the different population densitiess
 * @param percent {number} - the calculated percentage for a feature
 */
function getPercentColor(percent) {
    if (percent != null) {
        //var density = feature.properties.population[populationType][selectedYear]/feature.properties.area;
        return percent > 75 ? '#8c2d04' :
            percent > 50  ? '#cc4c02' :
                percent > 25  ? '#ec7014' :
                    percent > 20  ? '#fe9929' :
                        percent > 15   ? '#fec44f' :
                            percent > 10   ? '#fee391' :
                                percent > 5   ? '#fff7bc' :
                                    '#ffffe5';
    }
    else {
        return '#dddddd'
    }
};

/** Function for clicked feature style
 * Border the selected area will be highlighted red
 **/
function clickedStyle() {
    return {
        color: 'red',
        weight: 3,
        opacity: 1
    }
};
