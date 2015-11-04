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
    $( "#paragraphs" ).append( "<p>New paragraph</p>" );
});

// Fade out all paragraphs
$( "#hideParagraph" ).click(function() {
    $( "#paragraphs" ).fadeOut( "slow", function() {

    });
});

// Hide all input elements
$( "#hideInputs" ).click(function() {
    $( "input" ).hide();
});

// Show Datepicker
$( "#datepicker" ).datepicker();


// Show jQuery-UI-Dialog
$( document ).ready(function() {
    $( "#dialog" ).dialog();
});
