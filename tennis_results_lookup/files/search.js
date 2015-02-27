/**
 * Created by liliya on 26/02/2015.
 */

function getXML(urlName){
    var xhr = $.ajax({
        url:urlName,
        datatype:"xml",
        async:false
    })
    return xhr.responseXML;
    
}

function findResults(category,player,word_match,sets,pred,round,pred1,sort){
    var styleSheet = getXML("results-style.xsl");
    if(category.value=="men"){
        var results = getXML("wimbledon-men-2013.xml");
    }
    else{
        var results = getXML("wimbledon-women-2013.xml");
    }
   
    if(typeof (XSLTProcessor) !== "undefined"){
        var processor = new XSLTProcessor();
        processor.importStylesheet(styleSheet);
        var result = processor.transformToFragment(results, document);
        document.getElementById("display").appendChild(result);}
        else{
        window.alert("Your browser does not support the XSLTProcessor object");
        
        player.getAttribute("value")
    }
}
