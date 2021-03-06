/**
 * Created by liliya on 26/02/2015.
 * IMPORTANT NOTE: In Google Chrome, xml files are blocked from accessing local XSLT files if they are in the same directory
 * CSS files can be accessed from HTML however. Full detail of the issue is documented via the link below:
 * http://stackoverflow.com/questions/4558160/xsl-not-working-in-google-chrome
 * Use the DCS web page set up to access for Chrome, or run with --allow-file-access-from-files with varying degrees of success
 */
var results = null;

// Method to retrieve the XML from the file location
function getXML(urlName) {
    var xhr = $.ajax({
        url: urlName,
        datatype: "xml",
        async: false
    });
    return xhr.responseXML;
}
/* Part 2a
 The appropriate file will be loaded based on a user selection from a drop down
 The default value is set to men(in alphabetical order)
 */
function chooseCategory() {
    if ($('#category')[0].value === "men") {
        results = getXML("wimbledon-men-2013.xml");
    } else {
        results = getXML("wimbledon-women-2013.xml");
    }
}

/* Part 2b (2c, 2d, 2e)
 Main function which calls all other functions
 This function has the logic to look up a player depending on their name or a sub string of it
 If no player is specified, the full set of results will be returned
 The overall approach followed to produce the results used dynamic modification of the xsl created in part 1
 The xsl was created with a blank when tag at match level
 User selections are used to build up a string which is then passed to the test attribute of the when tag
 */
function findResults() {
    var styleSheet = getXML("results-style.xsl");   //load the stylesheet
    var testQueryString = "";
    chooseCategory();    //load the data file
    var playerName = document.getElementById('player').value;

    //Case to deal with empty player text field
    if (playerName === "") {
        testQueryString = filterResultsByRound(testQueryString);
        testQueryString = filterResultsByNumberSets(testQueryString);
        styleSheet = sortResultsByRound(styleSheet);
        if (testQueryString === "") {
            styleSheet = sortResultsByRound(styleSheet);
        }
        else {
            $(styleSheet).find("xsl\\:when, when").first().attr("test", testQueryString);
        }
        loadAndDisplay(results, styleSheet);
        return;
    }
    //Case to deal with full name specified with equals match case
    if ($('#match_case')[0].value === "equals") {
        testQueryString += ".//name = '" + playerName + "'";
        testQueryString = filterResultsByRound(testQueryString);
        testQueryString = filterResultsByNumberSets(testQueryString);
        styleSheet = sortResultsByRound(styleSheet);
        $(styleSheet).find("xsl\\:when, when").first().attr("test", testQueryString);
        loadAndDisplay(results, styleSheet);

        // console.log(styleSheet);
    }
    //Case to deal with partial match with contains match case
    else if ($('#match_case')[0].value === "contains") {
        testQueryString += ".//name[contains(., '" + playerName + "'" + ")]";
        testQueryString = filterResultsByRound(testQueryString);
        testQueryString = filterResultsByNumberSets(testQueryString);
        styleSheet = sortResultsByRound(styleSheet);
        $(styleSheet).find("xsl\\:when, when").first().attr("test", testQueryString);
        loadAndDisplay(results, styleSheet);
    }
    else {
        window.alert("Not working");
    }
}
/* Part 2c
 This function looks up the number of sets selected and the filtering criteria - eq, gt, lt
 The outcome is a string which is appended to the overall testCondition that will be fed into the stylesheet
 */
function filterResultsByNumberSets(xString) {
    var numberSets = document.getElementById('sets').value;
    var radioButtons = document.getElementsByName('group1');
    var radioVal = '';
    for (var i = 0, len = radioButtons.length; i < len; i++) {
        if (radioButtons[i].checked) {
            radioVal = radioButtons[i].value;
            break;
        }
    }
    if (radioVal === "equals") {
        if (xString === "") {
            xString += "count(.//set) =" + numberSets*2;
        }
        else {
            xString += " and " + "count(.//set) =" + numberSets*2;
        }
    }
    else if (radioVal === "greater than") {
        if (xString === "") {
            xString += "count(.//set)> " + numberSets*2;
        }
        else {
            xString += " and " + "count(.//set) >" + numberSets*2;
        }
    }
    else if (radioButtons === "less than") {
        if (xString === "") {
            xString += "count(.//set) <" + numberSets*2;
        }
        else {
            xString += " and " + "count(.//set) <" + numberSets*2;
        }
    }
    return xString;
}

/* Part 2d
 This function looks up the value of round selected and the filtering criteria - eq, gt, lt
 The outcome is a string which is appended to the overall testCondition that will be fed into the stylesheet
 */
function filterResultsByRound(xString) {

    var roundNumber = document.getElementById('round').value;
    var radioButtons = document.getElementsByName('group2');
        var radioVal = '';
        for (var i = 0, len = radioButtons.length; i < len; i++) {
            if (radioButtons[i].checked) {
                radioVal = radioButtons[i].value;
                break;
            }
        }
        if (radioVal === "equals") {
            if (xString === "") {
                xString += "round = " + roundNumber;
            }
            else {
                xString += "and " + "round = " + roundNumber;
            }
        }
        else if (radioVal === "greater than") {
            if (xString === "") {
                xString += "round > " + roundNumber;
            }
            else {
                xString += "and " + "round > " + roundNumber;
            }
        }
        else if (radioVal === "less than") {
            if (xString === "") {
                xString += "round < " + roundNumber;
            }
            else {
                xString += "and " + "round < " + roundNumber;
            }
        }
    return xString;
}

/*
 Part 2e - Sorting function
 Relies on a pre-specified sort element in the stylesheet, the property of which is
 amended programmatically dependent on user preferences
 the amended stylesheet is then returned to where it was called(main function)
 */
function sortResultsByRound(styleSheet) {
    if ($('#sort')[0].value === "ascending") {
        $(styleSheet).find("xsl\\:sort, sort").first().attr("order", "ascending");
    }
    else {
        $(styleSheet).find("xsl\\:sort, sort").first().attr("order", "descending");
    }
    return styleSheet;
}
/*
 This function is a helper which takes in the XML and the dynamically modified stylesheet and generates
 the document fragment to be appended to the appropriate section of the html page
 In this case it is appended to a div element with id="display" in order for the results table output to be shown
 */
function loadAndDisplay(results, styleSheet) {
    if (typeof (XSLTProcessor) !== "undefined") {
        var processor = new XSLTProcessor();
        processor.importStylesheet(styleSheet);
        var result = processor.transformToFragment(results, document);
        document.getElementById('display').appendChild(result);
    } else {
        window.alert("Your browser does not support the XSLTProcessor object");
    }
}
/*
 This method is used to reset the form and clear out any results from the previous query if the users 
 wants to do a new search 
 */
function resetForm() {
    $('#display').empty();
    $('#criteria').trigger("reset");
}