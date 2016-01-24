/**
 * Created by André on 24.01.2016.
 */
var language = {
    "en": {
        "main": {
            "title": "JavaScript and Linked Data"
        },
        "navbar": {
            "home": "Home",
            "map": "Map",
            "about": "About",
            "license": "License"
        },
        "index": {
            "content" :'<h1>Introduction into JavaScript and Linked data.</h1>' +
            '<p class="lead">The purpose of this web application is to visualize open data of the city of Münster.</p>'
        },
        "map": {
            "layerButton": {
                "city": "City",
                "district": "Districts",
                "cityDistrict": "Citydistricts"
            },
            "panel": {
                "highCharts": {
                    "title": {
                        "mainPopulation": "Main population",
                        "agePopulation": {
                            "female": "Female population by age",
                            "male": "Male population by age",
                            "both": "Population by age"
                        },
                        "entitledPopulation": "Population entitled to live in Münster",
                    }
                }
            },
            "legend": {
                "title": {
                    "mainPopulation": "People per squarekilometre"
                }
            }
        },
        "about": {
            "content": '<h1>About</h1>' +
                    '<p class="lead">...</p>'
        },
        "license": {
            "content": '<h1>License</h1>' +
            '<p class="lead">...</p>'
        }
    },
    "de": {
        "main": {
            "title": "JavaScript und Linked Data"
        },
        "navbar": {
            "home": "Start",
            "map": "Karte",
            "about": "Über",
            "license": "Lizenz"
        },
        "index": {
            "content" :'<h1>Einführung in JavaScrupt und Linked Data.</h1>' +
            '<p class="lead">Das Ziel dieser Web Appliaction ist es Open Data aus Münster zu visualisieren.</p>'
        },
        "map": {
            "layerButton": {
                "city": "Stadt",
                "district": "Stadtbezirke",
                "cityDistrict": "Stadtteile"
            },
            "panel": {
                "highCharts": {
                    "title": {
                        "mainPopulation": "Bevölkerung mit Hauptwohnsitz",
                        "agePopulation": {
                            "female": "Weibliche Bevölkerung nach Alter",
                            "male": "Männliche Bevölkerung nach Alter",
                            "both": "Bevölkerung nach Alter"
                        },
                        "entitledPopulation": "Wohnberechtigte Bevölkerung"
                    }
                }
            },
            "legend": {
                "title": {
                    "mainPopulation": "Bevölkerung pro Quadratkilometer"
                }
            }
        },
        "about": {
            "content": '<h1>Über</h1>' +
                    '<p class="lead">...</p>'
        },
        "license": {
            "content": '<h1>Lizenz</h1>' +
                    '<p class="lead">...</p>'
        }
    }
};

if (!document.cookie) {
    document.cookie = 'language = en'
}
function getCookieObject() {
    var cookieArray = document.cookie.split(';');
    var cookieJSON = {};
    for (var i = 0; i < cookieArray.length; i++) {
        var splittedArray = cookieArray[i].split('=');
        cookieJSON[splittedArray[0].replace(' ','')] = splittedArray[1].replace(' ','');
    }
    return cookieJSON
}

function setDiv(div, input) {
    document.getElementById(div).innerHTML = readLanguageJSON(input);
}
function appendDiv(div, input) {
    document.getElementById(div).innerHTML = document.getElementById(div).innerHTML + '' + readLanguageJSON(input);
}
function readLanguageJSON(input) {
    var inputArray = input.split('.');
    var object = language[getCookieObject().language];
    for (var i = 0; i < inputArray.length; i++) {
        object = object[inputArray[i]];
    }

    return object;
}