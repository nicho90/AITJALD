"use strict"

// EVENT HANDLERS

// Check all checkboxes
$( "#checkboxes" ).click(function() {
    $( "input[type=checkbox]" ).prop('checked', true);

    // Find checkboxes by their IDs
    /*$( "#inputCheckbox1" ).prop('checked', true);
    $( "#inputCheckbox2" ).prop('checked', true);
    $( "#inputCheckbox3" ).prop('checked', true);
    $( "#inputCheckbox4" ).prop('checked', true);*/
});

// Submit button
$( "#submitButton" ).on('click', function () {
  $( "#alertMessage" ).fadeIn();
  $( "#alertMessage" ).fadeOut( 2000 );
});


// Add paragraph
$( "#addParagraph" ).click(function() {
    $( "#newParagraph" ).html( 'Location on GoogleMaps: <a href="https://www.google.de/maps/?Münster" target="_blank">view here</a>' );
});

// Fade out all paragraphs
$( "#hideParagraph" ).click(function() {
    $( "#paragraphs" ).fadeOut(5000, function() {

    });
});

// Hide all input elements
$( "#hideInputs" ).click(function() {
    $( "input" ).hide();
});

// Show Datepicker
$( "#datepicker" ).datepicker();

$( "#alertMessage" ).hide();

$( "#openModal" ).click(function() {
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').focus()
    });
});
