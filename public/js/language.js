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
            "heading": 'More information'
        },
        "about": {
            "heading": '<h1>About us</h1>'
        },
        "help": {
            "heading": '<h1>Help</h1>',
            "sub-heading": '<h3>- User manual- </h3>',
            'cookie': {
                "title":'<h3>3. Privacy</h3>',
                "more": "More info",
                "cookie-content": "This application saves cookies. These cookies are saving the preferred language of the user. No personal data will be saved."
            }
        },
        "license": {
            "heading": '<h1>Licenses</h1>',
            'software': '<h3>1. Software</h3>',
            'framework': '<h5>Used Frameworks:</h5>',
            'data': '<h3>2. Open Data</h3>',
            'cookie': '<h3>2. Privacy</h3>',
            'cc': '<div class="row"><div class="col-sm-2"><a href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"></a></div><div class="col-sm-10"><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/Dataset" property="dct:title" rel="dct:type">This <b>Linked Data Application</b></span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">Guiying Du, Nicholas Schiestel, Pawan Thapa, André Wieghardt</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.</div></div><br><br>',
            'frameworks': '<ul>' +
                '<li>JQuery (<a href="https://github.com/jquery/jquery/blob/master/LICENSE.txt" target="_blank">License</a>)</li>' +
                '<li>JQuery-UI (<a href="https://github.com/jquery/jquery-ui/blob/master/LICENSE.txt" target="_blank">License</a>)</li>' +
                '<li>Leaflet (<a href="https://github.com/Leaflet/Leaflet/blob/master/LICENSE" target="_blank">License</a>)</li>' +
                '<li>Bootstrap (<a href="https://github.com/twbs/bootstrap/blob/master/LICENSE" target="_blank">License</a>)</li>' +
                '<li>Mapbox (<a href="https://github.com/mapbox/mapbox.js/blob/mb-pages/LICENSE.md" target="_blank">License</a>)</li>' +
                '<li>Highcharts (<a href="https://github.com/highcharts/highcharts/blob/master/license.txt" target="_blank">License</a>)</li>' +
                '<li>Font-Awesome (<a href="https://github.com/FortAwesome/Font-Awesome" target="_blank">License</a>)</li>' +
                '<li>Flag-Icon (<a href="https://github.com/lipis/flag-icon-css/blob/master/LICENSE" target="_blank">License</a>)</li>' +
                '<li>Terraformer (<a href="https://github.com/Esri/Terraformer/blob/master/LICENSE" target="_blank">License</a>)</li>' +
                '<li>Terraformer-WKT-Parser (<a href="https://github.com/Esri/terraformer-wkt-parser/blob/master/LICENSE" target="_blank">License</a>)</li>' +
                '<li>Cookieconsent2 (<a href="https://github.com/silktide/cookieconsent2/blob/master/licence" target="_blank">License</a>)</li></ul>',
            'opendata': 'This application visualizes Open Data about the population of Münster and its city districts, which were published by the <b>Amt für Stadtentwicklung, Stadtplanung, Verkehrsplanung</b> (<a href="http://www.stadt-muenster.de/stadtentwicklung/zahlen-daten-fakten.html">http://www.stadt-muenster.de/stadtentwicklung/zahlen-daten-fakten.html</a>).<br>The dataset, which was used for this application can be found <a  href="http://www.stadt-muenster.de/fileadmin//user_upload/stadt-muenster/61_stadtentwicklung/pdf/sms/SMS_Bevoelkerung_2014.pdf"  target="_blank">here</a>. The terms of use for this dataset can be found <a href="http://www.stadt-muenster.de/fileadmin/user_upload/stadt-muenster/61_stadtentwicklung/pdf/zahlen/MS_Statistikdaten_Nutzungsbedingungen.pdf">here</a>.',
            "cookie-content": "This application will create cookies. These cookies are saving the preferred language of the user. No personal data will be saved."

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
            "heading": 'Mehr Informationen'
        },
        "about": {
            "heading": '<h1>Über uns</h1>'
        },
        "help": {
            "heading": '<h1>Hilfe</h1>',
            "sub-heading": '<h3>- Benutzerhandbuch - </h3>',
            'cookie': {
                "title":'<h3>3. Privatsphäre</h3>',
                "more": "Mehr Informationen",
                "cookie-content": "Diese Webanwendung speichert Cookies. Diese Cookies speichern die bevorzugte Sprache des Nutzers. Keine personenbezogenen Daten werden gespeichert"
            }
        },
        "license": {
            "heading": '<h1>Lizenzen</h1>',
            'software': '<h3>1. Software</h3>',
            'framework': '<h5>Verwendete Frameworks:</h5>',
            'data': '<h3>2. Open Data</h3>',
            'cc': '<div class="row"><div class="col-sm-2"><a href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"></a></div><div class="col-sm-10"><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/Dataset" property="dct:title" rel="dct:type">Diese <b>Linked Data Application</b></span> von <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">Guiying Du, Nicholas Schiestel, Pawan Thapa, André Wieghardt</span> ist lizensiert unter der <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 internationalen Lizenz</a>.</div></div><br><br>',
            'frameworks': '<ul>' +
                '<li>JQuery (<a href="https://github.com/jquery/jquery/blob/master/LICENSE.txt" target="_blank">Lizenz</a>)</li>' +
                '<li>JQuery-UI (<a href="https://github.com/jquery/jquery-ui/blob/master/LICENSE.txt" target="_blank">Lizenz</a>)</li>' +
                '<li>Leaflet (<a href="https://github.com/Leaflet/Leaflet/blob/master/LICENSE" target="_blank">Lizenz</a>)</li>' +
                '<li>Bootstrap (<a href="https://github.com/twbs/bootstrap/blob/master/LICENSE" target="_blank">Lizenz</a>)</li>' +
                '<li>Mapbox (<a href="https://github.com/mapbox/mapbox.js/blob/mb-pages/LICENSE.md" target="_blank">Lizenz</a>)</li>' +
                '<li>Highcharts (<a href="https://github.com/highcharts/highcharts/blob/master/license.txt" target="_blank">Lizenz</a>)</li>' +
                '<li>Font-Awesome (<a href="https://github.com/FortAwesome/Font-Awesome" target="_blank">License</a>)</li>' +
                '<li>Flag-Icon (<a href="https://github.com/lipis/flag-icon-css/blob/master/LICENSE" target="_blank">Lizenz</a>)</li>' +
                '<li>Terraformer (<a href="https://github.com/Esri/Terraformer/blob/master/LICENSE" target="_blank">Lizenz</a>)</li>' +
                '<li>Terraformer-WKT-Parser (<a href="https://github.com/Esri/terraformer-wkt-parser/blob/master/LICENSE" target="_blank">Lizenz</a>)</li>' +
                '<li>Cookieconsent2 (<a href="https://github.com/silktide/cookieconsent2/blob/master/licence" target="_blank">Lizenz</a>)</li></ul>',
            'opendata': 'Diese Applikation visualisiert <i>Open Data</i> über die Bevölkerung der Stadt Münster und ihrer Stadtteile. Die Daten wurden vom <b>Amt für Stadtentwicklung, Stadtplanung, Verkehrsplanung</b> (<a href="http://www.stadt-muenster.de/stadtentwicklung/zahlen-daten-fakten.html">http://www.stadt-muenster.de/stadtentwicklung/zahlen-daten-fakten.html</a>) veröffentlicht.<br>Der Datensatz, welcher für diese Applikation verwendet wurde, kann <a  href="http://www.stadt-muenster.de/fileadmin//user_upload/stadt-muenster/61_stadtentwicklung/pdf/sms/SMS_Bevoelkerung_2014.pdf" target="_blank">hier</a> nachgeschlagen werden. Die Nutzungsbedingungen für diesen Datensatz können <a href="http://www.stadt-muenster.de/fileadmin/user_upload/stadt-muenster/61_stadtentwicklung/pdf/zahlen/MS_Statistikdaten_Nutzungsbedingungen.pdf">hier</a> nachgeschlagen werden.'
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
