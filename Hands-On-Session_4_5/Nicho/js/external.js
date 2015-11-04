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

// Disable submit button
$( "#submitButton" ).attr("disabled","disabled");

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

// Show Dialog
$( document ).ready(function() {
    $( "#dialog" ).dialog();
});
