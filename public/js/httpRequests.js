/**
 * Created by Andre on 12.01.2016.
 */
/*
 * Function to run the sparql POST reguest to the server
 * @param data {object} data for the POST body. It should contain the query, display and output parameter
 * @param callback {function} the callback function
 */


var sparqlHTTPConnection = {
    sparqlPOSTRequest: function (data, callback){
        $.ajax({
            type: "POST",
            url: "http://giv-lodumdata.uni-muenster.de:8282/parliament/sparql",
            contentType: "application/x-www-form-urlencoded",
            data: data,
            success: function(result){
                callback(result.results.bindings)
            },
            dataType: "json"
        })
    },
    createSparqlQuery: function(options) {
        var queryString = '';
        switch (options.type) {
            case 'geometryQuery':
                var geometryQuery = 'PREFIX geo:<' + GEOPREFIX + '> PREFIX dbp:<' + DBPPREFIX + '> ' +
                        'PREFIX gn:<' + GNPREFIX + '> ' +
                        'SELECT ?feature ?type ?area ?wkt ?name ' +
                        'WHERE {GRAPH <http://course.introlinkeddata.org/G2> {' +
                        '?feature geo:hasGeometry ?b.' +
                        '?feature gn:name ?name.' +
                        '?b dbp:area ?area.' +
                        '?b geo:asWKT ?wkt.' +
                        '?feature a ?type.' +
                        'FILTER(?type = dbp:City || ?type = dbp:District || ?type = dbp:CityDistrict)}}';
                return geometryQuery;
                break;
            case 'main':
            case 'entitled':
                var populationTypeFilter = '';
                if (options.type == 'main') {
                    populationTypeFilter = "?feature lodcom:hasMainPopulation ?b.";
                }
                else {
                    populationTypeFilter = "?feature lodcom:hasEntitledPopulation ?b."
                }
                switch (options.feature.properties.administrativeLvl) {
                    case 'CityDistrict':

                        // create the SPAQL query to get the population of the citydistrict
                        queryString = 'PREFIX lodcom: <' + LODCOMPREFIX + '>' +
                            'SELECT ?feature ?population ?year ' +
                            'WHERE {' +
                            'GRAPH <http://course.introlinkeddata.org/G2> {' +
                            'FILTER (?feature = lodcom:' + options.feature.properties.lodcomName + ').' +
                            populationTypeFilter +
                            '?b lodcom:year ?year.' +
                            '?b lodcom:value ?population}}';
                        return queryString;
                        break;
                    case 'District':
                        /* create the SPARQL query to get the population for every citydistrict within the district
                         * later the result will be added together*/
                        queryString = 'PREFIX lodcom: <' + LODCOMPREFIX + '>' +
                            'PREFIX gn:<' + GNPREFIX + '>' +
                            'SELECT ?feature ?year ?population ' +
                            'WHERE {' +
                            'GRAPH <http://course.introlinkeddata.org/G2> {' +
                            '?feature gn:parentFeature lodcom:' + options.feature.properties.lodcomName + '.' +
                            populationTypeFilter +
                            '?b lodcom:year ?year.' +
                            '?b lodcom:value ?population}}';
                        return queryString;
                        break;
                    case 'City':
                        /* create the SPARQL query to get the population for every citydistrict within the district
                         * within the city
                         * later the result will be added together*/
                        queryString = 'PREFIX lodcom: <' + LODCOMPREFIX + '>' +
                            'PREFIX gn:<' + GNPREFIX + '>' +
                            'SELECT ?feature ?year ?population ' +
                            'WHERE {' +
                            'GRAPH <http://course.introlinkeddata.org/G2> {' +
                            '?pFeature gn:parentFeature lodcom:' + options.feature.properties.lodcomName + '.' +
                            '?feature gn:parentFeature ?pFeature.'+
                            populationTypeFilter +
                            '?b lodcom:year ?year.' +
                            '?b lodcom:value ?population}}';
                        return queryString;
                        break;
                    default:
                        console.log('Admin lvl error')
                }
                // TODO in 'options.features', there could be more than one. there have to be a iteration

                break;
            // get all possible year values from the database

            case 'female':
            case 'male':
            case 'gender':
                var genderFilter = '';
                if (options.type == 'female') {
                    genderFilter = 'FILTER (?gender = "female").'
                }
                else if (options.type == 'male'){
                    genderFilter = 'FILTER (?gender = "male").'
                }
                else {
                    genderFilter = ''
                }
                switch (options.feature.properties.administrativeLvl) {
                    case 'CityDistrict':
                        queryString = "PREFIX lodcom:<" + LODCOMPREFIX + "> " +
                            "SELECT ?feature ?year ?gender ?value ?agegroup ?entitledPopulationValue " +
                            "WHERE { GRAPH <http://course.introlinkeddata.org/G2> {" +
                            "FILTER(?feature = lodcom:" + options.feature.properties.lodcomName + ")." +
                            "?feature lodcom:hasGenderedPopulation ?genderedPopulation." +
                            "?feature lodcom:hasEntitledPopulation ?entitledPopulation."+
                            "?entitledPopulation lodcom:year ?entYear." +
                            "?entitledPopulation lodcom:value ?entitledPopulationValue." +
                            "?genderedPopulation lodcom:year ?year." +
                            "?genderedPopulation lodcom:value ?value." +
                            "?genderedPopulation lodcom:gender ?gender." +
                            "?genderedPopulation lodcom:agegroup ?agegroup." +
                            genderFilter +
                            "FILTER (?entYear = ?year)." +
                            "}}ORDER BY ?year ?agegroup";
                        return queryString;
                        break;
                    case 'District':
                        queryString = "PREFIX lodcom:<" + LODCOMPREFIX + "> " +
                            'PREFIX gn:<' + GNPREFIX + '>' +
                            "SELECT ?feature ?year ?gender ?value ?agegroup ?entitledPopulationValue " +
                            "WHERE { GRAPH <http://course.introlinkeddata.org/G2> {" +
                            "?feature gn:parentFeature ?parentFeature." +
                            "FILTER(?parentFeature = lodcom:" + options.feature.properties.lodcomName + ")." +
                            "?feature lodcom:hasGenderedPopulation ?genderedPopulation." +
                            "?feature lodcom:hasEntitledPopulation ?entitledPopulation."+
                            "?entitledPopulation lodcom:year ?entYear." +
                            "?entitledPopulation lodcom:value ?entitledPopulationValue." +
                            "?genderedPopulation lodcom:year ?year." +
                            "?genderedPopulation lodcom:value ?value." +
                            "?genderedPopulation lodcom:gender ?gender." +
                            "?genderedPopulation lodcom:agegroup ?agegroup." +
                            genderFilter +
                            "FILTER (?entYear = ?year)." +
                            "}}ORDER BY ?year ?agegroup";
                        return queryString;
                        break;
                    case 'City':
                        queryString = "PREFIX lodcom:<" + LODCOMPREFIX + "> " +
                            'PREFIX gn:<' + GNPREFIX + '>' +
                            "SELECT ?feature ?year ?gender ?value ?agegroup ?entitledPopulationValue " +
                            "WHERE { GRAPH <http://course.introlinkeddata.org/G2> {" +
                            "?parentFeature gn:parentFeature ?parent2Feature." +
                            "?feature gn:parentFeature ?parentFeature." +
                            "FILTER(?parent2Feature = lodcom:" + options.feature.properties.lodcomName + ")." +
                            "?feature lodcom:hasGenderedPopulation ?genderedPopulation." +
                            "?feature lodcom:hasEntitledPopulation ?entitledPopulation."+
                            "?entitledPopulation lodcom:year ?entYear." +
                            "?entitledPopulation lodcom:value ?entitledPopulationValue." +
                            "?genderedPopulation lodcom:year ?year." +
                            "?genderedPopulation lodcom:value ?value." +
                            "?genderedPopulation lodcom:gender ?gender." +
                            "?genderedPopulation lodcom:agegroup ?agegroup." +
                            genderFilter +
                            "FILTER (?entYear = ?year)." +
                            "}}ORDER BY ?year ?agegroup";
                        return queryString;
                        break;
                    default:
                }
                break;
            case 'distinctPopulation':
                var populationTypeFilter = '';
                switch (options.populationType) {
                    // get all possible year values from the database from the lodcom:hasMainPopulation relation
                    case 'main':
                        populationTypeFilter = "?feature lodcom:hasMainPopulation ?b.";
                        break;
                    case 'entitled':
                        populationTypeFilter = "?feature lodcom:hasEntitledPopulation ?b.";
                        break;
                    case 'gender':
                    case 'male':
                    case 'female':
                        populationTypeFilter = "?feature lodcom:hasGenderedPopulation ?b.";
                        break;
                    default:
                        console.log('Population type error');
                        break;
                }
                queryString = 'PREFIX lodcom: <' + LODCOMPREFIX + '>' +
                    'SELECT DISTINCT ?year ' +
                    'WHERE {' +
                    'GRAPH <http://course.introlinkeddata.org/G2> {' +
                    populationTypeFilter +
                    '?b lodcom:year ?year.}}' +
                    'ORDER BY ?year';
                return queryString;
                break;
            case 'distinctAgeGroups':
                queryString = 'PREFIX lodcom: <'+ LODCOMPREFIX + '>' +
                    'SELECT DISTINCT ?agegroup ' +
                    'WHERE {' +
                        'GRAPH <http://course.introlinkeddata.org/G2> {' +
                        '?feature lodcom:hasGenderedPopulation ?pop.' +
                        '?pop lodcom:agegroup ?agegroup.}}' +
                    'ORDER BY ?agegroup';
                return queryString;
                break;
            default:
                console.log('Something went wrong. the definition of the type might be false')
        }
    },
    getDataForFeature: function(feature, callback) {
        var options = {
            type: populationType,
            feature: feature
        };

        var data = {
            query: this.createSparqlQuery(options),
            display: "json",
            output: "json"
        };
        this.sparqlPOSTRequest(data, function (result) {
            var output = {
                name: feature.properties.name
            };
            if (result.length != 0) {
                switch (populationType) {
                    case 'main':
                    case 'entitled':
                        switch (feature.properties.administrativeLvl) {
                            case 'CityDistrict':
                                for (var i = 0; i < result.length; i++) {
                                    var year = result[i].year.value;
                                    if(output.population === undefined) {
                                        output.population = {}
                                    }
                                    output.population[year] = parseInt(result[i].population.value);
                                }

                                callback(output);
                                break;
                            case 'District':
                            case 'City':
                                output.population = {};
                                for (var i = 0; i < result.length; i++) {
                                    var year = result[i].year.value;
                                    if (output.population[year] === undefined) {
                                        output.population[year] = parseInt(result[i].population.value);
                                    }
                                    else {
                                        output.population[year] += parseInt(result[i].population.value);
                                    }
                                }
                                callback(output);
                                break;
                            default:
                                break;
                        }
                        break;
                    case 'male':
                    case 'female':
                        switch (feature.properties.administrativeLvl) {
                            case 'CityDistrict':
                                console.log(result);
                                for (var i = 0; i < result.length; i++) {
                                    if(output.population === undefined) {
                                        output.population = {}
                                    }
                                    if (output.population[result[i].year.value] == undefined) {
                                        output.population[result[i].year.value] = {};
                                    }
                                    output.population[result[i].year.value][result[i].agegroup.value] = parseInt(result[i].value.value);
                                }
                                callback(output);
                                /*for (var i = 0; i < result.length; i++) {
                                    var year = result[i].year.value;
                                    if(output.population === undefined) {
                                        output.population = {}
                                    }
                                    output.population[year] = parseInt(result[i].population.value);
                                }

                                callback(output);*/
                                break;
                            case 'District':
                            case 'City':
                                output.population = {};
                                for (var i = 0; i < result.length; i++) {
                                    var year = result[i].year.value;
                                    if (output.population[year] === undefined) {
                                        output.population[year] = parseInt(result[i].population.value);
                                    }
                                    else {
                                        output.population[year] += parseInt(result[i].population.value);
                                    }
                                }
                                callback(output);
                                break;
                            default:
                                break;
                        }
                        break;
                    case 'gender':
                        switch (feature.properties.administrativeLvl) {
                            case 'CityDistrict':
                                for (var i = 0; i < result.length; i++) {
                                    if(output.population === undefined) {
                                        output.population = {}
                                    }
                                    if (output.population[result[i].gender.value] == undefined) {
                                        output.population[result[i].gender.value] = []
                                    }
                                    if (output.population[result[i].gender.value][result[i].year.value] == undefined) {
                                        output.population[result[i].gender.value][result[i].year.value] = {};
                                    }
                                    if (output.population[result[i].gender.value][result[i].year.value][result[i].agegroup.value] == undefined) {
                                        output.population[result[i].gender.value][result[i].year.value][result[i].agegroup.value] = 0;
                                    }
                                    output.population[result[i].gender.value][result[i].year.value][result[i].agegroup.value] += parseInt(result[i].value.value);
                                }
                                console.log(output);
                                callback(output);
                                break;
                            case 'District':
                            case 'City':
                                console.log(result);
                                var tmpTest = 0;
                                for (var i = 0; i < result.length; i++) {
                                    if(output.population === undefined) {
                                        output.population = {}
                                    }
                                    if (output.population[result[i].gender.value] == undefined) {
                                        output.population[result[i].gender.value] = []
                                    }
                                    if (output.population[result[i].gender.value][result[i].year.value] == undefined) {
                                        output.population[result[i].gender.value][result[i].year.value] = {};
                                    }
                                    if (output.population[result[i].gender.value][result[i].year.value][result[i].agegroup.value] == undefined) {
                                        output.population[result[i].gender.value][result[i].year.value][result[i].agegroup.value] = 0;
                                    }
                                    output.population[result[i].gender.value][result[i].year.value][result[i].agegroup.value] += parseInt(result[i].value.value);
                                    tmpTest += parseInt(result[i].value.value);
                                }
                                console.log(output);
                                callback(output);
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                }
            }
            else {
                return 'no Data available'
            }
        })
    }
};