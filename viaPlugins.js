function buildViaGallary() {
	if ($(".EXLDetailsContent li[id^='lds20']").length && $(".EXLDetailsContent li[id^='lds21']").length) {

		$(".EXLDetailsContent li[id^='lds20']").parents(".EXLDetailsContent").each(function() {
			//Avoid duplicate work
			if ($(this).find(".VIAGallary").length)
				return;

			$(this).parents(".EXLDetailsTabContent").css({
				"height": "auto",
				"max-height": "38em"
			});

			//Get the record ID to create unique gallaries
			var recordId = $(this).parents(".EXLResult").find(".EXLResultRecordId").attr("id");

			//Load XSL file
			xslDoc = loadXMLDoc("../uploaded_files/HVD/via.xsl");

			//Create a header and a blank Gallary at the bottom of the Details tab
			createHeader($(this));
			$(this).append('<div class="VIAGallary"></div>');

			//Each XML needs to become HTML using the XSL
			$(this).find("li[id^='lds21'] span.EXLDetailsDisplayVal").each(convertXMLtoHTML);

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
}

//Builds a header based on lds20
function createHeader(element) {
	var numberOfImages = element.find("li[id^='lds20'] .EXLDetailsDisplayVal").text();

	var gallaryHeaderHTML = '<span class="VIAGallaryHeader">';
	if (numberOfImages == '1')
		gallaryHeaderHTML = 'Click on the image to enlarge and view more information</span>';
	else
		gallaryHeaderHTML = numberOfImages + ' images (Click on an image to enlarge and view more information)</span>';
	element.append(gallaryHeaderHTML);
}

//Use the XSL 
function convertXMLtoHTML() {
	var recordId = $(this).parents(".EXLResult").find(".EXLResultRecordId").attr("id");

	var xmlDoc = jQuery.parseXML($(this).text().replace("&", "&amp;"));
	if (xmlDoc) {
		var newHTML = transformXSL(xmlDoc, xslDoc);
		$(this).parents(".EXLDetailsContent").find(".VIAGallary").append(newHTML);
	}
	//Add a Gallary ID for the FancyBox
	$(this).parents(".EXLDetailsContent").find("a.fancybox").attr("rel", recordId);
}

//Get the MetaData based on the Image URL (unique), and puts the title with that value
function addMetaData(current, previous) {
	metaData = $("a.fancybox[href='" + current.href + "']").parents(".VIAThumbnail").find(".VIAMetaData").html();
	if (metaData.length > 0)
		current.title = metaData;

}

