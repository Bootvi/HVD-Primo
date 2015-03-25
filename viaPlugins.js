function buildViaGallary() {
	$(".EXLDetailsContent li[id^='lds20']").parents(".EXLDetailsContent").each(function() {
		//Avoid duplicate work
		if ($(this).find(".VIAGallary").length)
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

		//Get the VIA XML from the PNX record
		var recordId = $(this).parents(".EXLResult").find(".EXLResultRecordId").attr("id");
		var pnxXML = loadPNX(recordId);
		var viaXML = $.parseXML($(pnxXML).find("addata > mis1").text().replace(/&/g, "&amp;"));

		//Create Gallary header
		createHeader($(this), $(pnxXML).find("lds20").text());

		//Create a gallery area
		$(this).append('<div class="VIAGallary"></div>');

		//Append the converted VIA XML to the gallery, and set 'rel' parameter to make them 1 gallary 
		$(this).find(".VIAGallary").append(transformXSL(viaXML, "../uploaded_files/HVD/viaThumbnail.xsl"));
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

		//If the user is signed out - switch to iframe for restricted images
		if ($("#exlidSignOut").hasClass("EXLHidden")) {
			$(this).find(".VIAGallary a.fancybox").each(function() {
				if ($(this).find(".VIARestrictedThumbnail").length) {
					$(this).removeClass("fancybox.iframe");
					$(this).removeClass("fancybox.image");

					var signInLink = $('#exlidSignIn a').attr('href');
					var dlDisplayUrl = $(this).parents(".EXLResultTabContainer").find(".EXLTabHeaderButtonPopout a").attr("href");
					var correctUrl = signInLink.substr(0, signInLink.indexOf("targetURL=") + 10) + encodeURIComponent(dlDisplayUrl);
					$(this).attr("href", correctUrl);
				}

			});
		}

		//Make it FANCYBOX, with MetaData function call to populate the information
		$(this).find(".VIAGallary a.fancybox").fancybox({
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
		});
	});
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
function modifyContents(current, previous) {	
//	console.log(current.content);
//	if (current.content != null && current.content.indexOf("fancybox-error")) {
//		console.log("bad image");
//		current.type = "iframe";
//		current.content = '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please sign in.</p>';
//	}
	//Get the parameters from the fancy box and the page URL
	var recordId = $("a.fancybox[href='" + current.href + "']").attr("rel");
	var imageId = current.href.replace(/^(.*[\/])/, "");
	imageId = imageId.substr(0, imageId.indexOf("?"));

        //Get the MetaData next to the thumbnail on the page below, make it an HTML tree
        var metaDataTree = $("<div>" + $("a.fancybox[href='" + current.href + "']").parents(".VIAThumbnail").find(".VIAMetaData").html() + "</div>");

	//Process the metaData
	if (metaDataTree != null && metaDataTree.length > 0) {
		var componentId = $(metaDataTree).find("tr.VIAComponentId td.VIAMetaDataValue").text();

		//PermaLink addition
		$(metaDataTree).find(".LinkPrintPlaceHolder").attr("href", "../uploaded_files/HVD/viaPage.html?recordId=" + recordId + "&imageId=" + imageId + "&compId=" + componentId);

		//X of Y feature
		var numOfImages = $("a.fancybox[href='" + current.href + "']").parents(".EXLDetailsContent").find("li[id^='lds20'] .EXLDetailsDisplayVal").html();
		$(metaDataTree).find(".VIATotalImages").text(numOfImages);
		if (numOfImages == '1')
			$(metaDataTree).find("#XofY").remove();

		//Applying the metaData to the fancybox from the thumbnail metaData HTML
		current.title = $(metaDataTree).html();
	}
}

//Resize the box if image is narrower than 800px
function resizeFancyBox() {
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
}


//Related Information modifications (lds25) due to Normalization Rules limitations
function fixRelatedInformation() {
	$(".EXLDetailsContent > ul > li[id^='Related Information']").each(function() {
		var totalItems = $(this).find("span").length;
		var totalLinks = $(this).find("span a").length;
		if (totalItems / totalLinks == 2) {
			for (var i = 0; i < totalLinks; i++) {
				$(this).find("span:eq(" + (totalLinks) + ") a").text($(this).find("span:eq(0)").text());
				$(this).find("span:eq(0)").remove();
			}
			$(this).find("br:lt(" + totalLinks + ")").remove();
		}
	});
}


