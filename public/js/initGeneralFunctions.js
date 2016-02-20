/**
 * General functions for:
 * - language setup
 * - button-click-events
 * - information-panel (RDF-data)
 **/

$( document ).ready(function() {

    // CHECK FONT/EMOJI-SUPPORT FOR FLAGS
    var font = (function () {
        var test_string = 'mmmmmmmmmwwwwwww';
        var test_font = '"Comic Sans MS"';
        var notInstalledWidth = 0;
        var testbed = null;
        var guid = 0;

        return {
            setup : function () {
                if ($('#fontInstalledTest').length) return;
                $('head').append('<' + 'style> #fontInstalledTest, #fontTestBed { position: absolute; left: -9999px; top: 0; visibility: hidden; } #fontInstalledTest { font-size: 50px!important; font-family: ' + test_font + ';}</' + 'style>');
                $('body').append('<div id="fontTestBed"></div>').append('<span id="fontInstalledTest" class="fonttest">' + test_string + '</span>');
                testbed = $('#fontTestBed');
                notInstalledWidth = $('#fontInstalledTest').width();
            },
            isInstalled : function(font) {
                guid++;
                var style = '<' + 'style id="fonttestStyle"> #fonttest' + guid + ' { font-size: 50px!important; font-family: ' + font + ', ' + test_font + '; } <' + '/style>';
                $('head').find('#fonttestStyle').remove().end().append(style);
                testbed.empty().append('<span id="fonttest' + guid + '" class="fonttest">' + test_string + '</span>');
                return (testbed.find('span').width() != notInstalledWidth);
            }
        };
    })();

    font.setup();
    var emoji_1 = font.isInstalled('Apple Color Emoji');
    var emoji_2 = font.isInstalled('Segoe UI Emoji');
    var emoji_3 = font.isInstalled('NotoColorEmoji');
    var emoji_4 = font.isInstalled('Android Emoji');
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if(is_chrome){
        $('#en_US').html('<span class="flag-icon flag-icon-gb"></span>');
        $('#de_DE').html('<span class="flag-icon flag-icon-de"></span>');
    } else {
        if(emoji_1 || emoji_2 || emoji_3 || emoji_4) {
            $('#en_US').html('&#x1F1FA;&#x1F1F8;');
            $('#de_DE').html('&#x1F1E9;&#x1F1EA;');
        } else {
            $('#en_US').html('<span class="flag-icon flag-icon-gb"></span>');
            $('#de_DE').html('<span class="flag-icon flag-icon-de"></span>');
        }
    }
});


// INIT
var addStatus = false;


// CHANGE-LANGUAGE-BUTTONS
$('#germanLanguageSwitcher').click(function(){
    if (getCookieObject().language !== 'de') {
        document.cookie = 'language = de';
        location.reload();
    }
});
$('#englishLanguageSwitcher').click(function(){
    if (getCookieObject().language !== 'en') {
        document.cookie = 'language = en';
        location.reload();
    }
});


// LANGUAGE SWITCHER
switch (getCookieObject().language) {
    case 'de':
        $('#germanLanguageSwitcher').addClass('active');
        break;
    case 'en':
        $('#englishLanguageSwitcher').addClass('active');
        break;
    default:
        break;
}

//
function connectToPopulationTypeDropdownToLoadData(callback) {
    $('#populationTypeDropdown').change(function() {
        if (selectedFeatures.length != 0) {
            // fill highcharts with loading icon
            $('#chart').html('<br><center><i class="fa fa-spinner fa-pulse"></i></center>');
        }
        $('#populationTypeDropdown').parent().nextAll().remove();
        var newPopulationType = this.value;
        // according to the population type, change the icon for the dropdown
        if (newPopulationType == 'male' || newPopulationType == 'female' || newPopulationType == 'gender') {
            var htmlString ='';
            switch (newPopulationType) {
                case 'male':
                    $('#chart2').remove();
                    htmlString += '<br><i class="fa fa-male" id="genderIcon"></i>&nbsp;&nbsp;';
                    break;
                case 'female':
                    $('#chart2').remove();
                    htmlString += '<br><i class="fa fa-female" id="genderIcon"></i>&nbsp;&nbsp;';
                    break;
                case 'gender':
                    htmlString += '<br><i class="fa fa-binoculars" id="genderIcon"></i>&nbsp;&nbsp;';
                    break;
                default:
                    break;
            }
            //initialize the html element for the population type dropdown
            htmlString += '<div class="ageGroupDropdown">' + language[getCookieObject().language].map.panel.highCharts.title.agePopulation.description +'&nbsp;&nbsp;</div>';
            htmlString +=  '<div class="ageGroupDropdown">'+
                '<select class="form-control" id="ageGroupDropdown">'+
                '<option id="ageGroupDropdown0" value="all">' + language[getCookieObject().language].map.panel.highCharts.title.agePopulation.all + '</option>';
            selectedAgeGroup = 'all';
            var options = {
                type: 'distinctAgeGroups'
            };
            var data = {
                query: sparqlHTTPConnection.createSparqlQuery(options),
                display: "json",
                output: "json"
            };
            sparqlHTTPConnection.sparqlPOSTRequest(data, function (result) {
                for (var i = 0; i < result.length; i++) {
                    var yearString = result[i].agegroup.value;
                    htmlString += '<option id="ageGroupDropdown' + i+1 + '" value="' + yearString + '">' + yearString + '</option>';
                }
                htmlString += '</select></div>';
                $('.populationDropdown').parent().append(htmlString);
                callback(newPopulationType);
                $('#yearSlider').empty().slider('destroy').html(language[getCookieObject().language].genderal.loadingInformation).css('width','150px');
            });
        }
        else {
            $('#chart2').remove();
            callback(newPopulationType);
            // destroy the html fpr the year slider and fill it with the current data
            $('#yearSlider').empty().slider('destroy').html(language[getCookieObject().language].genderal.loadingInformation).css('width','150px');
        }
    });
};

//
function connectAgeDropdownToMap(featureGroups) {
    $('#ageGroupDropdown').change(function(){
        selectedAgeGroup = this.value;
        changeStyleForAllLayers(featureGroups,true);
        changeHighcharts.setDiagram();
    })
};

// COMPARE-BUTTON
function connectCompareButtonToMap (featureGroups) {
    $('#compare_button').click(function () {
        if(comparingStatus){
            comparingStatus = false;
            toogleCompareAddRemoveBottons(comparingStatus);
            for (var i = 0; i < selectedFeatures.length-1; i++) {
                channelStyle(selectedFeatures[i].layer,false,densityStyle)
            }
            selectedFeatures = selectedFeatures.slice(selectedFeatures.length-1,selectedFeatures.length);
            sparqlHTTPConnection.getDataForFeature(selectedFeatures[0].feature, function (featureData){
                changeHighcharts.setDiagram({
                    type: populationType,
                    administrativeLvl: selectedFeatures[0].feature.properties.administrativeLvl,
                    features: [featureData]
                })
            });

            changeStyleForAllLayers(featureGroups, true);
        } else {
            comparingStatus = true;
            toogleCompareAddRemoveBottons(comparingStatus);

            changeStyleForAllLayers(featureGroups, true);
        }
    });
}

// TOGGLE ADD-REMOVE-FEATURES-BUTTON BASED ON THE COMPARE-BUTTON STATUS
function toogleCompareAddRemoveBottons(status) {
    if(status) {
        setButtonStyle('#compare_button', 'btn-default', 'btn-primary');
        $('#compare_add_button').show();
        $('#compare_remove_button').show();
        setButtonStyle('#compare_add_button', 'btn-default', 'btn-success');
        addStatus = true;
    } else {
        setButtonStyle('#compare_button', 'btn-primary', 'btn-default');
        setButtonStyle('#compare_add_button', 'btn-success', 'btn-default');
        setButtonStyle('#compare_remove_button', 'btn-danger', 'btn-default');
        $('#compare_add_button').hide();
        $('#compare_remove_button').hide();
        addStatus = false;
    }
};

// HIGHLIGHT COMPARE-ADD-BUTTON
$('#compare_add_button').click(function () {
    addStatus = true;
    setButtonStyle('#compare_add_button', 'btn-default', 'btn-success');
    setButtonStyle('#compare_remove_button', 'btn-danger', 'btn-default');
});

// HIGHLIGHT COMPARE-REMOVE-BUTTON
$('#compare_remove_button').click(function () {
    addStatus = false;
    setButtonStyle('#compare_add_button', 'btn-success', 'btn-default');
    setButtonStyle('#compare_remove_button', 'btn-default', 'btn-danger');
});

// CHANGE BUTTON STYLE
function setButtonStyle(buttonId, removeClass, addClass){
    $(buttonId).removeClass(removeClass).addClass(addClass);
};

// SET GENERAL INFORMATION PANEL
function setGeneralInformation(feature, data){

    $('#general').html(
        '<div class="panel panel-default">' +
            '<div class="panel-heading">' +
                '<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp;&nbsp;<a href="#" data-toggle="collapse" data-target="#generalDiv">' + language[getCookieObject().language].info.heading + '</a></h3>' +
            '</div>' +
            '<div class="table-responsive collapse" id="generalDiv">' +
                '<table class="table table-striped" id="generalTable"><thead><th>Subject</th><th>Predicate</th><th>Object</th></thead><tbody></tbody></table>' +
            '</div>' +
        '</div>'
    );

    var subject = '<span class="label label-primary">' + feature.properties.lodcomName + '</span>';

    for(var i=0; i<data.length;i++) {

        var write = true;
        var predicate = data[i].predicate.value;
        var object = data[i].object;

        // RDF-PREDICATES
        if(predicate == (GEOSPARQLPREFIX + "sfContains")) {
            predicate = '<a href="' + GEOSPARQLPREFIX + 'sfContains" target="_blank">gn:sfContains</a>';
        } else if (predicate == (GEOSPARQLPREFIX + "sfWithin")) {
            predicate = '<a href="' + GEOSPARQLPREFIX + 'sfWithin" target="_blank">geo:sfWithin</a>';
        } else if(predicate == (GEOPREFIX + "wgs84_pos#lon")) {
            predicate = '<a href="' + GEOPREFIX + '#wgs84_poslon" target="_blank">geo:wgs84_poslon</a>';
        } else if(predicate == (GEOPREFIX + "wgs84_pos#lat")) {
            predicate = '<a href="' + GEOPREFIX + 'wgs84_poslat" target="_blank">geo:wgs84_poslat</a>';
        } else if(predicate == (GNPREFIX + "wikipediaArticle")) {
            predicate = '<a href="' + GNPREFIX + 'wikipediaArticle" target="_blank">gn:wikipediaArticle</a>';
        } else if(predicate == (GNPREFIX + "countryCode")) {
            predicate = '<a href="' + GNPREFIX + 'countryCode" target="_blank">gn:countryCode</a>';
        } else if(predicate == (GNPREFIX + "alternateName")) {
            predicate = '<a href="' + GNPREFIX + 'alternateName" target="_blank">gn:alternateName</a>';
        } else if(predicate == (GNPREFIX + "name")) {
            predicate = '<a href="' + GNPREFIX + 'name" target="_blank">gn:Name</a>';
        } else if (predicate == (GNPREFIX + "parentFeature")) {
            predicate = '<a href="' + GNPREFIX + 'parentFeature" target="_blank">gn:parentFeature</a>';
        } else if (predicate == (OWLPREFIX + "sameAs")) {
            predicate = '<a href="' + OWLPREFIX + 'sameAs" target="_blank">owl:sameAs</a>';
        } else if(predicate == "type") {
            predicate = '<a href="' + RDFPREFIX + 'type" target="_blank">rdf:type</a>';
        } else {
            write = false;
        }

        // RDF-OBJECTS
        if(object.type == "literal" || object.type == "typed-literal") {
            if(object.value.includes("http://") || object.value.includes("https://")){
                object = '<a href="' + object.value + '" target="_blank">' + object.value + '</a>';
            }
            else {
                var lang = object['xml:lang'];
                if(lang) {
                    if(lang == "en"){
                        object = '<kbd>' + object.value + '</kbd> <span class="flag-icon flag-icon-gb"></span>';
                    } else if(lang == "de") {
                        object = '<kbd>' + object.value + '</kbd> <span class="flag-icon flag-icon-de"></span>';
                    } else {
                        object = '<kbd>' + object.value + '</kbd>';
                    }
                } else {
                    object = '<kbd>' + object.value + '</kbd>';
                }
            }
        } else if(object.type == "uri"){
            if(object.value == (GNPREFIX + "Feature")) {
                object = '<a href="' + GNPREFIX + 'Feature" target="_blank">gn:Feature</a>';
            } else if(object.value ==  (DBPPREFIX + "City")) {
                object = '<a href="' + DBPPREFIX + 'District" target="_blank">dbp:City</a>';
            } else if(object.value == (DBPPREFIX + "District")) {
                object = '<a href="' + DBPPREFIX + 'District" target="_blank">dbp:District</a>';
            } else if(object.value == (DBPPREFIX + "CityDistrict")) {
                object = '<a href="' + DBPPREFIX + 'CityDistrict" target="_blank">dbp:CityDistrict</a>';
            } else if(object.value.includes(LODCOMPREFIX)){
                object = '<span class="label label-default">' + object.value.replace(LODCOMPREFIX, "") + '</span>';
            }
        } else {
            object = object.value;
        }

        var row = '<tr><td>' + subject + '</td><td>' + predicate + '</td><td>' + object + '</td></tr>';
        if(write){
            $('#generalTable tbody').append(row);
        }
    }
};

// RESET GENERAL INFORMATION PANEL
function resetGeneralInformation(){
    $('#general').html('');
};
