function buildViaGallary() {
        $(".EXLDetailsContent li[id^='Images']").each(function() {
                //Mark as modified
                if ($(this).find(".VIAGallaryGenerated").length)
                        return;
                else
                        $(this).append('<input type="hidden" class="VIAGallaryGenerated">');

                //Create a top header
                var numberOfImages = $(this).parents(".EXLDetailsContent").find("li[id^='Number of Images'] .EXLDetailsDisplayVal").text();
		var recordId = $(this).parents(".EXLResult").find(".EXLResultRecordId").attr("id");
		var gallaryHeaderHTML = "";
                if (numberOfImages == '1')
                        gallaryHeaderHTML = '<span class="VRAGallaryHeader">Click on the image to enlarge and view more information</span>';
                else
                        gallaryHeaderHTML = '<span class="VRAGallaryHeader">' + numberOfImages + ' images (Click on an image to enlarge and view more information)</span>';


                //Generate Gallary
                var thumbnailsHTML = '<div class="VRAGallary">';
                $(this).find("span.EXLDetailsDisplayVal").each(function() {
                        thumbnailsHTML = thumbnailsHTML + '<div class="VRAThumbnail"><table><tr><td>';
			thumbnailsHTML = thumbnailsHTML +       '<a href="' + $(this).text() + '?buttons=Y"  data-fancybox-group="' + recordId + '" class="fancybox fancybox.iframe" title="This is amazing!">';
			thumbnailsHTML = thumbnailsHTML + 	'<img src="' + $(this).text() + '?height=150&width=150">';
			thumbnailsHTML = thumbnailsHTML +       '</a>';
			thumbnailsHTML = thumbnailsHTML + '</td></tr></table></div>';
                });
                thumbnailsHTML = thumbnailsHTML + "</div>";
		
		//Add the gallary below the details of the record
                $(this).parents(".EXLDetailsContent").append(gallaryHeaderHTML, thumbnailsHTML);

		//For VRA records, 
                $(this).parents(".EXLDetailsTabContent").css({
                        "height": "auto",
                        "max-height": "38em"
                });
		
		//Add a FancyBox plugin to generate a Lightbox with full viewer iFrame
		$(".fancybox").fancybox({
			openEffect: 'none',
			closeEffect: 'none',
		        nextEffect: 'none',
		        prevEffect: 'none',
 	         	width: '1200',
        	        height: '660',
			margin: [20, 60, 20, 60],
			helpers: {
				overlay: {
					locked: false
				}
			}
		});
        });
}

