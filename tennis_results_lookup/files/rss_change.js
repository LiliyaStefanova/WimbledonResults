

function getXML(urlName) {
    var xhr = $.ajax({
        url: urlName,
        datatype: "xml",
        async: false
    });
    return xhr.responseXML;
}

function rss(){

    var xmlDoc = getXML("rss-fragment.xml");
    var styleSheet = getXML("rss-headlines.xsl");
    $(styleSheet).find("xsl\\:value")
        .first()
        .attr("select", "description");
    if (typeof XSLTProcessor != "undefined") {
        var processor = new XSLTProcessor();
        processor.importStylesheet(styleSheet);
        var result = processor.transformToFragment(xmlDoc, document);
        document.getElementById("display").appendChild(result);

    }

}