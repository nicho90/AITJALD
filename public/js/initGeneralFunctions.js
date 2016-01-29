/**
 * Created by André on 24.01.2016.
 */

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
        callback(this.value)
    })

}

// TOGGLE COMPARING-BUTTON-GROUP ON MAP BASED ON ADMIN-TYPE
function toggleCompareButton(status){
    if(status){
        $('.compare-buttons').show();
        toogleCompareAddRemoveBottons(false);
    } else {
        $('.compare-buttons').hide();
        toogleCompareAddRemoveBottons(false);
    }
};

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
