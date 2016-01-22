/**
 * Created by Andre on 12.01.2016.
 */
/*
 * Function to run the sparql POST reguest to the server
 * @param data {object} data for the POST body. It should contain the query, display and output parameter
 * @param callback {function} the callback function
 */
var sparqlPOSTRequest = function(data, callback){
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
};
// create a sql Query depending on the administrative level
var createSparqlQuery = function(options) {
    switch (options.type) {
        case 'hasMainPopulation':
            switch (options.administrativeLvl) {
                case 'CityDistrict':

                    // create the SPAQL query to get the population of the citydistrict
                    var queryString = "PREFIX lodcom:<" + LODCOMPREFIX + "> " +
                        "SELECT ?a ?year ?value " +
                        "WHERE { GRAPH <http://course.introlinkeddata.org/G2> {" +
                        "FILTER(?a = lodcom:" + options.features[0] + ")." +
                        "?a lodcom:hasMainPopulation ?b. " +
                        "?b lodcom:year ?year. " +
                        "?b lodcom:value ?value}}" +
                        "ORDER BY ?year";
                    return queryString;
                break;
                case 'District':
                    /* create the SPARQL query to get the population for every citydistrict within the district
                    * later the result will be added together*/
                    var queryString = 'PREFIX lodcom: <' + LODCOMPREFIX + '>' +
                    'PREFIX gn:<' + GNPREFIX + '>' +
                    'SELECT ?feature ?year ?value ' +
                        'WHERE {' +
                        'GRAPH <http://course.introlinkeddata.org/G2> {' +
                        '?feature gn:parentFeature lodcom:' + options.features[0] + '.' +
                        '?feature lodcom:hasMainPopulation ?mainPopulation.' +
                        '?mainPopulation lodcom:year ?year.' +
                        '?mainPopulation lodcom:value ?value}}';
                    return queryString;
                    break;
                case 'City':
                    /* create the SPARQL query to get the population for every citydistrict within the district
                     * within the city
                     * later the result will be added together*/
                    var queryString = 'PREFIX lodcom: <' + LODCOMPREFIX + '>' +
                        'PREFIX gn:<' + GNPREFIX + '>' +
                        'SELECT ?feature ?year ?value ' +
                        'WHERE {' +
                        'GRAPH <http://course.introlinkeddata.org/G2> {' +
                        '?feature gn:parentFeature lodcom:' + options.features[0] + '.' +
                        '?cdFature gn:parentFeature ?feature.'+
                        '?cdFature lodcom:hasMainPopulation ?mainPopulation.' +
                        '?mainPopulation lodcom:year ?year.' +
                        '?mainPopulation lodcom:value ?value}}';
                    return queryString;
                    break;
                default:
                    console.log('Admin lvl error')
            }
            // TODO in 'options.features', there could be more than one. there have to be a iteration

            break;
        default:
            console.log('Something went wrong. the definition of the digram type might be false')
    }
};

