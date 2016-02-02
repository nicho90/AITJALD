/**
 * Created by André on 24.01.2016.
 */


$( document ).ready(function() {

    // CHECK FONT/EMOJI-SUPPORT FOR FLAGS
    var font = (function () {
        var test_string = 'mmmmmmmmmwwwwwww';
        var test_font = '"Comic Sans MS"';
        var notInstalledWidth = 0;
        var testbed = null;
        var guid = 0;

        return {
            // must be called when the dom is ready
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
        $('#en_US').html('<span class="flag-icon flag-icon-us"></span>');
        $('#de_DE').html('<span class="flag-icon flag-icon-de"></span>');
    } else {
        if(emoji_1 || emoji_2 || emoji_3 || emoji_4) {
            $('#en_US').html('&#x1F1FA;&#x1F1F8;');
            $('#de_DE').html('&#x1F1E9;&#x1F1EA;');
        } else {
            $('#en_US').html('<span class="flag-icon flag-icon-us"></span>');
            $('#de_DE').html('<span class="flag-icon flag-icon-de"></span>');
        }
    }
});

var addStatus = false;

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

function connectToPopulationTypeDropdownToLoadData(callback) {
    $('#populationTypeDropdown').change(function() {
        $('#chart').html('<br><center><i class="fa fa-spinner fa-pulse"></i></center>');
        $('#populationTypeDropdown').parent().nextAll().remove();
        var newPopulationType = this.value;
        if (newPopulationType == 'male' || newPopulationType == 'female' || newPopulationType == 'gender') {
            var htmlString ='';
            switch (newPopulationType) {
                case 'male':
                    $('#chart2').remove();
                    htmlString += '</br><i class="fa fa-male" id="genderIcon"></i>&nbsp;&nbsp;';
                    break;
                case 'female':
                    $('#chart2').remove();
                    htmlString += '</br><i class="fa fa-female" id="genderIcon"></i>&nbsp;&nbsp;';
                    break;
                case 'gender':
                    htmlString += '</br><i class="fa fa-binoculars" id="genderIcon"></i>&nbsp;&nbsp;';
                    break;
                default:
                    break;
            }
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
            $('#yearSlider').empty().slider('destroy').html(language[getCookieObject().language].genderal.loadingInformation).css('width','150px');
        }
    })

}

function connectAgeDropdownToMap(featureGroups) {
    $('#ageGroupDropdown').change(function(){
        selectedAgeGroup = this.value;
        changeStyleForAllLayers(featureGroups,true);

        changeHighcharts.setDiagram()
    })
}


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
    } else {
        comparingStatus = true;
        toogleCompareAddRemoveBottons(comparingStatus);
    }
});

// TOGGLE ADD-REMOVE-BUTTONS BASED ON COMPARISON BUTTON
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
