/**
 * Created by André on 24.01.2016.
 */
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