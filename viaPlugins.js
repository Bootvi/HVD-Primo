function buildViaGallary() {
	$(".EXLDetailsContent li[id^='lds20']").parents(".EXLDetailsContent").each(function() {
		//Avoid duplicate work
		if ($(this).find(".VIAGallary").length)
			return;
		
		//Make this details tab larger
		$(this).parents(".EXLDetailsTabContent").css({
			"height": "auto",
			"max-height": "38em"
		});
		
		//Get the VIA XML from the PNX record
		var recordId = $(this).parents(".EXLResult").find(".EXLResultRecordId").attr("id");
		var pnxXML = loadPNX(recordId);
		var viaXML = $.parseXML($(pnxXML).find("addata > mis1").text().replace(/&/g, "&amp;"));
                
		//Create Gallary header
                createHeader($(this), $(pnxXML).find("lds20").text());		

		//Create a gallery area
                $(this).append('<div class="VIAGallary"></div>');
	
		//Append the converted VIA XML to the gallery, and set 'rel' parameter to make them 1 gallary 
		$(this).find(".VIAGallary").append(transformVIAXML(viaXML));
		$(this).find("a.fancybox").attr("rel", recordId);
		
                //Trim the cpations
                $(this).find(".VIAThumbnailTitle").each(function() {
                	var tlength = $(this).text().length;
                        if (tlength > 44) {
                        	$(this).attr("title", $(this).text());
                                var text = $(this).text().substr(0, 44);
                                $(this).text(text.substr(0, text.lastIndexOf(" ")) + "...");
                        }

               });

               //Make it FANCYBOX, with MetaData function call to populate the information
               $(this).find(".VIAGallary a.fancybox").fancybox({
                                openEffect: 'none',
                                closeEffect: 'none',
                                nextEffect: 'none',
                                prevEffect: 'none',
                                width: '1200',
                                height: '660',
                                margin: [20, 60, 20, 60],
                                helpers: {
                                        title: {
                                                type: 'inside'
                                        },
                                        overlay: {
                                                locked: false
                                        }
                                },
                                afterLoad: function(current, previous) {
                                        addMetaData(current, previous);
                                }


                        });

	});
}

function transformVIAXML(viaXML) {
        //Code for IE
        if (window.ActiveXObject) {
                //Initialize all the XSLT methods
                var xslt = new ActiveXObject("Msxml2.XSLTemplate.3.0");
                var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.3.0");
                xslDoc.async = false;
                xslDoc.load("../uploaded_files/HVD/via.xsl");

                //Load the XML
                var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.6.0");
                xmlDoc.loadXML('<?xml version="1.0"?>' + (new XMLSerializer()).serializeToString(viaXML));

                if (xslDoc.parseError.errorCode != 0) {
                        var myErr = xslDoc.parseError;
                        logJS("You have error " + myErr.reason);
                } else {
                        xslt.stylesheet = xslDoc;
                        var xslProc = xslt.createProcessor();
                        xslProc.input = xmlDoc;
                        xslProc.transform();

                        return xslProc.output;
                }
        }
        //Code for Normal browsers like Chrome, Firefox, Opera, etc.
        else if (document.implementation && document.implementation.createDocument) {
                var viaXSL = loadXML("../uploaded_files/HVD/via.xsl");
                xsltProcessor = new XSLTProcessor();
                xsltProcessor.importStylesheet(viaXSL);
                resultDocument = xsltProcessor.transformToFragment(viaXML, document);
                return resultDocument;
        }
}

//Builds a header based on lds20
function createHeader(element, numberOfImages) {
	var gallaryHeaderHTML = '<span class="VIAGallaryHeader">';

	if (numberOfImages == '0')
		gallaryHeaderHTML += 'Slides and Photographs Available (Not Digitized)';
	else if (numberOfImages == '1')
		gallaryHeaderHTML += 'Click on the image to enlarge and view more information</span>';
	else
		gallaryHeaderHTML += numberOfImages + ' images (Click on an image to enlarge and view more information)</span>';
	element.append(gallaryHeaderHTML);
}

//Get the MetaData based on the Image URL (unique), and puts the title with that value
function addMetaData(current, previous) {
	var metaData = $("a.fancybox[href='" + current.href + "']").parents(".VIAThumbnail").find(".VIAMetaData").html();
	if (metaData != null && metaData.length > 0)
		current.title = metaData;

}

