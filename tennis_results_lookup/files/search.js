/**
 * Created by liliya on 26/02/2015.
 */



var results = null;

function getXML(urlName) {
    var xhr = $.ajax({
        url: urlName,
        datatype: "xml",
        async: false
    });
    return xhr.responseXML;
}

//Part 2a
function chooseDataSet(){
    if ($('#category')[0].value === "men") {
        results = getXML("wimbledon-men-2013.xml");
    } else {
        results = getXML("wimbledon-women-2013.xml");
    }
}

//Part 2b
function findResults() {
    var styleSheet = getXML("results-style.xsl");
    var testQueryString = "";
    chooseDataSet();
    var playerName = document.getElementById('player').value;
    if(playerName === ""){
        loadAndDisplay(results, styleSheet);
        return;
    }
    if ($('#match_case')[0].value === "equals") {
        testQueryString+=".//name = '" + playerName + "'";
        testQueryString = filterResultsByRound(testQueryString);
        testQueryString = filterResultsByNumberSets(testQueryString);
        $(styleSheet).find("xsl\\:when", "when").first().attr("test", testQueryString);
        loadAndDisplay(results, styleSheet);
    }
    else if ($('#match_case')[0].value === "contains") {
        testQueryString+=".//name[contains(., '" + playerName + "'" + ")]";
        testQueryString = filterResultsByRound(testQueryString);
        testQueryString = filterResultsByNumberSets(testQueryString);
        $(styleSheet).find("xsl\\:when", "when").first().attr("test", testQueryString);
        loadAndDisplay(results, styleSheet);
    }
    else {
        window.alert("Not working");
    }
   
}

function filterResultsByRound(qString) {
    
    var numberRounds = document.getElementById('round').value;
    var radioBtns = document.getElementsByName('group2');
    var radioVal = '';
    for (var i = 0, len = radioBtns.length; i < len; i++) {
        if (radioBtns[i].checked) {
            radioVal = radioBtns[i].value;
            break;
        }
    }
    if (radioVal === "equals") {
        qString += "and " + "round = " + numberRounds;
    }
    else if (radioVal === "greater than") {
        qString += "and " + "round >" + numberRounds;
    }
    else if(radioVal === "less than") {
        qString += "and " + "round <" + numberRounds;
    }
    return qString;
}

function filterResultsByNumberSets(qString) {
    var numberSets = document.getElementById('sets').value;
    var radioBtns = document.getElementsByName('group1');
    var radioVal = '';
    for (var i = 0, len = radioBtns.length; i < len; i++) {
        if (radioBtns[i].checked) {
            radioVal = radioBtns[i].value;
            break;
        }
    }
    if (radioVal === "equals") {
        qString += " and " + "count(.//set) = " + numberSets;
    }
    else if (radioVal === "greater than") {
        qString += " and " + "count(.//set) >" + numberSets;
    }
    else if(radioBtns === "less than") {
        qString += " and " + "count(.//set) <" + numberSets;
    }
    return qString;
}


//if($('#sort')[0].value === "ascending"){
//    $(styleSheet).("xsl\\:sort").insertAfter("xsl\\:for-each").attr()
//
//} else{
//    $(styleSheet).find("xsl\\:for-each", "for-each").add("xsl\\:sort", "round")

//part 2e

//     var sort = $('#sort');
//     styleSheet = getXML("results-style.xsl");
//    if(sort[0].value == "descending"){
//       // $(styleSheet).find("xsl\\:for-each").first().attr("order-by", "- round");
//        if (typeof (XSLTProcessor) !== "undefined") {
//            var processor = new XSLTProcessor();
//            processor.importStylesheet(styleSheet);
//            var  result = processor.transformToFragment(results, document);
//            document.getElementById("display").appendChild(result);
//        } else {
//            window.alert("Your browser does not support the XSLTProcessor object");
//        }
//        window.alert("Sorting")
//    }
//}


function loadAndDisplay(results, styleSheet) {
    if (typeof (XSLTProcessor) !== "undefined") {
        var processor = new XSLTProcessor();
        processor.importStylesheet(styleSheet);
        var result = processor.transformToFragment(results, document);
        document.getElementById("display").appendChild(result);
    } else {
        window.alert("Your browser does not support the XSLTProcessor object");
    }
}

function resetForm() {
    var displayDiv = document.getElementById("display");
    var children = displayDiv.childNodes;
    displayDiv.removeChild(children[1]);
    $('#criteria').trigger("reset");
}