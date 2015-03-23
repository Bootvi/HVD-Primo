function buildSKCgallery() {
	$(".EXLDetailsContent li[id^='lds41']").parents(".EXLDetailsContent").each(function() {
		
		//Avoid duplicate work
		if ($(this).find("#SKCgallery").length)
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
	
		//Create Gallery header
		var galleryHeaderHTML = '<div id="skcGalleryHeader">Select digitized content (click on an image to enlarge)</div>';
		$(this).append(galleryHeaderHTML);

		//Create a gallery area
		$(this).append('<div id="skcGallery">SKC content test</div>');
		
		//Get the SKC data from the PNX record
		var recordId = $(this).parents(".EXLResult").find(".EXLResultRecordId").attr("id");
		var pnxXML = loadPNX(recordId);				
		var skcXML = $(pnxXML).find("addata > mis2");
		var skcHTML = "";
		for	(index = 0; index < skcXML.length ; index++) {
			//split elements into labels and URLs, append to make gallery with thumbnails
			var entry = skcXML[index].textContent;
			var split = entry.split(";",2);
			skcHTML += '<div class="skcItem"><a href="'+split[1]+'?buttons=y" target="_blank"><img src="'+split[1]+'?height=375" height="375px" /></a><br /><span class="skcLabel">'+split[0]+'</span></div>';
		} 

		document.getElementById("skcGallery").innerHTML = skcHTML;



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

