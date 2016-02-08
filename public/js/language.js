/**
 * Language-Schema:
 * - english support
 * - german support
 * Language-Functions:
 * - browser-cookies-support
 * - set/add content to div-element
 * - language-provider
 **/

var language = {
    "en": {
        "main": {
            "title": "JavaScript and Linked Data"
        },
        "navbar": {
            "home": "Home",
            "map": "Map",
            "help": "Help",
            "about": "About us",
            "license": "License",
            "language": {
                "title": 'Change language &nbsp;<span class="caret"></span>',
                "english": '<b>English</b>',
                "german": 'German (Deutsch)'
            },
        },
        "index": {
            "heading" :'<h1>Introduction into JavaScript and Linked data</h1>',
            "sub-heading_1": '<h3>- Institute for Geoinformatics -</h3>',
            "sub-heading_2": '<h4>Muenster</h4>',
            "sub-heading_3": '<h5>Winter term 2015\/16</h5>',
            "content": '<br><p class="lead">The purpose of this web application is to visualize open data of the city of Münster.</p>'
        },
        "map": {
            "layerButton": {
                "city": "Cities",
                "district": "Districts",
                "cityDistrict": "Citydistricts"
            },
            "compareButton": {
                "comparison": '<i class="fa fa-balance-scale"></i>&nbsp;&nbsp;Compare '
            },
            "panel": {
                "highCharts": {
                    "title": {
                        "mainPopulation": "Main population",
                        "agePopulation": {
                            "female": "Female population by age",
                            "male": "Male population by age",
                            "both": "Population by age",
                            "all": "All",
                            "description": "Age group"
                        },
                        "entitledPopulation": "Population entitled to live in Münster",
                    },
                    "gender": {
                        "female": "Women",
                        "male": "Man"
                    },
                    "yAxis": "Population",
                    "empty": "Please select a feature on the map to display information."
                },
                "general": {
                    "loading": "Loading data"
                },
                "error": {
                    "dataMissing" : "No data available"
                }
            },
            "legend": {
                "title": {
                    "mainPopulation": "People per squarekilometre",
                    "percentPopulation": "Percent of the population"
                }
            }
        },
        "info": {
            "heading": 'Information about Feature'
        },
        "about": {
            "heading": '<h1>About us</h1>'
        },
        "help": {
            "heading": '<h1>Help</h1>',
            "sub-heading": '<h3>- User manual- </h3>'
        },
        "license": {
            "heading": '<h1>Licenses</h1>',
            'software': '<h3>1. Software</h3>',
            'data': '<h3>2. Open Data</h3>',
            'mit': '<b>The MIT License (MIT)</b><br><br> Copyright (c) 2016 André Wieghardt, Nicholas Schiestel, Guiying Du, Pawan Thapa' + '<p> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>' + '<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>' + '<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>',
            'opendata': '<b>n/a</b><br><br>'
        },
        "genderal":{
            "loadingInformation": "Loading information"
        }
    },
    "de": {
        "main": {
            "title": "JavaScript und Linked Data"
        },
        "navbar": {
            "home": "Start",
            "map": "Karte",
            "help": "Hilfe",
            "about": "Über uns",
            "license": "Lizenz",
            "language": {
                "title": 'Sprache ändern &nbsp;<span class="caret"></span>',
                "english": 'Englisch (English)',
                "german": '<b>Deutsch</b> (German)'
            },
        },
        "index": {
            "heading" :'<h1>Einführung in JavaScript und Linked Data</h1>',
            "sub-heading_1": '<h3>- Institute for Geoinformatik -</h3>',
            "sub-heading_2": '<h4>Münster</h4>',
            "sub-heading_3": '<h5>Wintersemester 2015\/16</h5>',
            "content": '<br><p class="lead">Das Ziel dieser Web Appliaction ist es Open Data aus Münster zu visualisieren.</p>'
        },
        "map": {
            "layerButton": {
                "city": "Städte",
                "district": "Stadtbezirke",
                "cityDistrict": "Stadtteile"
            },
            "compareButton": {
                "comparison": '<i class="fa fa-balance-scale"></i>&nbsp;&nbsp;Vergleiche '
            },
            "panel": {
                "highCharts": {
                    "title": {
                        "mainPopulation": "Bevölkerung mit Hauptwohnsitz",
                        "agePopulation": {
                            "female": "Weibliche Bevölkerung nach Alter",
                            "male": "Männliche Bevölkerung nach Alter",
                            "both": "Bevölkerung nach Alter",
                            "all": "Alle",
                            "description": "Altersgruppe"
                        },
                        "entitledPopulation": "Wohnberechtigte Bevölkerung"
                    },
                    "gender": {
                        "female": "Frauen",
                        "male": "Männer"
                    },
                    "yAxis": "Einwohner",
                    "empty": "Bitte wähle ein Objekt auf der Karte aus um Daten anzeigen zu lassen."
                },
                "general": {
                    "loading": "Lade Daten"
                },
                "error": {
                    "dataMissing" : "Keine Daten vorhanden"
                }
            },
            "legend": {
                "title": {
                    "mainPopulation": "Einwohner pro Quadratkilometer",
                    "percentPopulation": "Prozent der gesamt Einwohner"
                }
            }
        },
        "info": {
            "heading": 'Informationen über Feature'
        },
        "about": {
            "heading": '<h1>Über uns</h1>'
        },
        "help": {
            "heading": '<h1>Hilfe</h1>',
            "sub-heading": '<h3>- Benutzerhandbuch - </h3>'
        },
        "license": {
            "heading": '<h1>Lizenzen</h1>',
            'software': '<h3>1. Software</h3>',
            'data': '<h3>2. Open Data</h3>',
            'mit': '<b>The MIT License (MIT)</b><br><br> Copyright (c) 2016 André Wieghardt, Nicholas Schiestel, Guiying Du, Pawan Thapa' + '<p> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>' + '<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>' + '<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>',
            'opendata': '<b>n/a</b><br><br>'
        },
        "genderal":{
            "loadingInformation": "Lade Informationen"
        }
    }
};

if (!document.cookie) {
    document.cookie = getStandardLanguage();
}

// SET LANGUAGE BASED ON BROWSER-COOKIE
function getCookieObject() {
    var cookieArray = document.cookie.split(';');
    var cookieJSON = {};
    for (var i = 0; i < cookieArray.length; i++) {
        var splittedArray = cookieArray[i].split('=');
        cookieJSON[splittedArray[0].replace(' ','')] = splittedArray[1].replace(' ','');
    }
    return cookieJSON;
}

// SET LANGUAGE-BASED-CONTENT TO DIV-ELEMENT
function setDiv(div, input) {
    document.getElementById(div).innerHTML = readLanguageJSON(input);
}

// ADD LANGUAGE-BASED-CONTENT TO DIV-ELEMENT
function appendDiv(div, input) {
    document.getElementById(div).innerHTML = document.getElementById(div).innerHTML + '' + readLanguageJSON(input);
}

// LANGUAGE PROVIDER
function readLanguageJSON(input) {
    var inputArray = input.split('.');
    var object = language[getCookieObject().language];
    for (var i = 0; i < inputArray.length; i++) {
        object = object[inputArray[i]];
    }
    return object;
}
