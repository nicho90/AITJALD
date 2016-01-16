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


