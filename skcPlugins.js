function buildSKCgallery() {
	$(".EXLDetailsContent li[id^='lds41']").parents(".EXLDetailsContent").each(function() {
		//Avoid duplicate work
		if ($(this).find(".SKCgallery").length)
			return;

		//Make this details tab larger
		if ((RegExp("tabs=detailsTab").test(window.location.href)) || (RegExp("fn=permalink").test(window.location.href)))
			$(this).parents(".EXLDetailsTabContent").css("height", "auto");
		else {
			$(this).parents(".EXLDetailsTabContent").css({
				"height": "auto",
				"max-height": "38em"
			});
		}

		//Get the SKC data from the PNX record
		var recordId = $(this).parents(".EXLResult").find(".EXLResultRecordId").attr("id");
		var pnxXML = loadPNX(recordId);
		var skcXML = $.parseXML($(pnxXML).find("addata > mis2").text().replace(/&/g, "&amp;"));

		//Create Gallery header
		//createHeader($(this), $(pnxXML).find("lds41").text());

		//Create a gallery area
		$(this).append('<div class="SKCgallery">SKC TEST<br /><span></span></div>');
		
		// THIS IS WHERE I STOPPED

		// REMOVE?
		//Append the converted VIA XML to the gallery, and set 'rel' parameter to make them 1 gallary 
		/* $(this).find(".VIAGallary").append(transformXSL(viaXML, "../uploaded_files/HVD/viaThumbnail.xsl"));
		$(this).find("a.fancybox").attr("rel", recordId); */

		// REMOVE?
		//Trim the cpations
		/* $(this).find(".VIAThumbnailTitle").each(function() {
			var tlength = $(this).text().length;
			if (tlength > 44) {
				$(this).attr("title", $(this).text());
				var text = $(this).text().substr(0, 44);
				$(this).text(text.substr(0, text.lastIndexOf(" ")) + "...");
			}

		}); */

		// REMOVE?
		//Make it FANCYBOX, with MetaData function call to populate the information
		/* $(this).find(".VIAGallary a.fancybox").fancybox({
			openEffect: 'none',
			closeEffect: 'none',
			nextEffect: 'none',
			prevEffect: 'none',
			width: '1200',
			height: 660,
			maxHeight: 700,
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
				modifyContents(current, previous);
			},
			onUpdate: function() {
				resizeFancyBox();

			}
		}); */
	});
}



//Builds a header based on lds41
/* function createHeader(element, keycontent) {
	var gallaryHeaderHTML = '<span class="skcGalleryHeader">';

	if (keycontent)
		galleryHeaderHTML += 'KEY CONTENT';
	element.append(galleryHeaderHTML);
} 
 */

//REMOVE? 
//Resize the box if image is narrower than 800px
/* function resizeFancyBox() {
	if ($(".fancybox-type-image").length) {
		var width = $(".fancybox-type-image").css("width").replace("px", "");
		if (width < 1200) {
			var newWidth = 1200;
			if (window.innerWidth < 1400)
				newWidth = window.innerWidth - 200;
			$(".fancybox-type-image").css("width", newWidth + "px");
			$(".fancybox-inner").css("width", (newWidth - 30) + "px");
			$.fancybox.reposition()
		}
	}
} */


// NA here b/c already in via plugins? 
//Fixing brief results thumbnails, shifting the pan and overflow from fixed height to fixed width
//function fixThinThumbnails() 

