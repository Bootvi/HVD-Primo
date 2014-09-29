//Changing links from Popup to new Tab
function linksModifications() {
	$("a[class='outsider EXLFullDetailsOutboundLink']").each(function() {
		$(this).attr('target', '_blank');
		$(this).attr('onclick', '');
	});
}

//Moving LDS14 to the Title line in Details tab
function title245cModification() {
	$(".EXLDetailsContent > ul > li[id^='Statement']").each(function() {
		var text245c = $(this).children("span").text();
		$(this).parent().find(".EXLLinkedFieldTitle").append("<br> / " + text245c);
		$(this).remove();
	});
}

//Change all hyperlinks
//For targets: anywhere = any, title = title, author = creator, subject = sub, ISSN = issn, ISBN = isbn
function detailsHyperlinks() {
	buildDetailsHyperlinks("Med. Subject", "sub", true); //lds08
	buildDetailsHyperlinks("Other subject", "sub", true); //lds10
	buildDetailsHyperlinks("Other title", "title", true); //lds03
	buildDetailsHyperlinks("Series", "title", true); //lds05 series
	buildDetailsHyperlinks("Place", "any", true); //Place
	buildDetailsHyperlinks("Linking notes", "title", true); // Relation (aka Linking notes)
	buildDetailsHyperlinks("Title", "title", false); // Unititle (aka title in code tables)

}


//Hyperlinking building
//Source = the <strong> element, target = the search field  
function buildDetailsHyperlinks(source, target, split) {
	$(".EXLDetailsContent li[id^='" + source + "']").children("span").each(function() {
		var prefix = "";
		var text = $(this).html();

		//Incase there's a prefix subfield 
		if ($(this).children("i").length) {
			prefix = text.substr(0, text.indexOf("</i>") + 4);
			text = text.substr(text.indexOf("</i>") + 4);
		}

		//For subject, split to different links according to semi-colon
		if (split) {
			var splittedText = text.split(";");
			var listOfLinks = "";
			for (var i = 0; i < splittedText.length; i++) {
				listOfLinks = listOfLinks + '<a href="' + buildDeepURL(splittedText[i], target) + ' " class="EXLLinkedField" title="Find all records containing" target="_parent">' + splittedText[i] + '</a>';
				if (i < splittedText.length) {
					listOfLinks = listOfLinks + "; ";
				}
			}
			$(this).replaceWith(prefix + listOfLinks);

		} else {
			$(this).replaceWith(prefix + '<a href="' + buildDeepURL(text, target) + ' " class="EXLLinkedField" title="Find all records containing" target="_parent">' + text + '</a>');
		}
	});
}

//Build DeepSearch for different searches
function buildDeepURL(text, target) {
	//Clean up the text
	text = text.trim().replace(/<span class="searchword">/g, '');
	text = text.replace(/<\/span>/g, '');
	text = text.replace(/ /g, '+');

	//Start with basics, disable DUM (default), enable highlighting
	var url = "dlSearch.do?institution=HVD&vid=HVD&fn=search&displayField=all&highlight=true";

	//Mode, Tab and Scope with defaults (first tab)
	url = url + "&mode=" + ($("#exlidAdvancedSearchRibbon #mode").val() != undefined ? "Advanced" : "Basic");;
	url = url + "&tab=" + ($("#exlidSearchRibbon #tab").val() != undefined ? $("#exlidSearchRibbon #tab").val() : "everything");
	url = url + "&search_scope=" + ($(".EXLSelectedScopeId").val() != undefined ? $(".EXLSelectedScopeId").val() : "everything");

	//If there's a resource type defined
	if ($("#exlidInput_mediaType_1").val() != "all_items" && $("#exlidInput_mediaType_1").val() != undefined)
		url = url + "&" + $("#exlidInput_mediaType_1").attr('name') + "=" + $("#exlidInput_mediaType_1").val();

	//Build the query
	url = url + "&query=" + target + ",exact," + text;

	return url;
}

//Table of Content link removal
function removeTOCLinks() {
	$(".EXLFullDetailsOutboundLink:contains('Table of Contents')").each(function() {
		if ($(this).parents(".EXLSummary").find(".EXLResultSnippet").text().length == 0 && window.location.pathname.indexOf("display.do") == -1) {
			$(this).parents("li").remove();
		}
	});
}

function detailsSubfieldLinks() {
	$(".EXLDetailsContent > ul > li > span").linkify();
}

function detailsLanguagesSpaces() {
	$(".EXLDetailsContent > ul > li[id^='Language']").html(function(i, val) {
		if (val.indexOf(";&nbsp;") == -1)
			return val.replace(/[;]/g, ";&nbsp;");
	});
}

function buildViaGallary() {
	$(".EXLDetailsContent li[id^='Images']").each(function() {
		//Mark as modified
		if ($(this).find(".VIAGallaryGenerated").length)
			return;
		else
			$(this).append('<input type="hidden" class="VIAGallaryGenerated">');

		//Create a top header
		var numberOfImages = $(this).parents(".EXLDetailsContent").find("li[id^='Number of Images'] .EXLDetailsDisplayVal").text();
		var gallaryHeaderHTML
		if (numberOfImages == '1')
			gallaryHeaderHTML = '<span class="VRAGallaryHeader">Click on the image to enlarge and view more information</span>';
		else
			gallaryHeaderHTML = '<span class="VRAGallaryHeader">' + numberOfImages + ' images (Click on an image to enlarge and view more information)</span>';


		//Generate Gallary
		var thumbnailsHTML = '<div class="VRAGallary">';
		$(this).find("span.EXLDetailsDisplayVal").each(function() {
			thumbnailsHTML = thumbnailsHTML + '<div class="VRAThumbnail"><table><tr><td><img src="' + $(this).text() + '?height=150&width=150"></td></tr></table></div>';
		});
		thumbnailsHTML = thumbnailsHTML + "</div>";

		$(this).parents(".EXLDetailsContent").append(gallaryHeaderHTML, thumbnailsHTML);

		$(this).parents(".EXLDetailsTabContent").css({
			"height": "auto",
			"max-height": "34em"
		});
	});
}

//Incase direct link to Details tab, do these:
$(document).ready(function() {
	if ((RegExp("tabs=detailsTab").test(window.location.href)) || (RegExp("fn=permalink").test(window.location.href))) {
		doDetailsTab();
	}
});

//Ajax finishes - Opening the Details tab
$(document).ajaxComplete(function(event, request, settings) {
	if ((RegExp("tabs=detailsTab").test(settings.url))) {
		doDetailsTab();
	}
});

function doDetailsTab() {
	linksModifications();
	title245cModification();

	detailsHyperlinks();
	removeTOCLinks();

	buildViaGallary();

	//Linkify here 
	detailsSubfieldLinks();
	detailsLanguagesSpaces();
}