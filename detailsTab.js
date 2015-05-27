//Changing links from Popup to new Tab
function linksModifications() {
	$("a[class='outsider EXLFullDetailsOutboundLink']").each(function() {
		$(this).attr('target', '_blank');
		$(this).attr('onclick', '');
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

//Add the current search query to the Finding Aids link within the details tab
function modifyFindingAidsLink() {
	$(".EXLFullDetailsOutboundLink:contains('Finding Aid')").each(function() {
		var findingAidURL = $(this).attr("href");
		if (findingAidURL.indexOf("http://oasis") == 0) {
			findingAidURL = findingAidURL + "&q=" + $("#search_field").val();
			$(this).attr("href", findingAidURL);
		}
	});

}

//Turn any text URL's to hyperlinks
function detailsSubfieldLinks() {
	$(".EXLDetailsContent li > span").linkify();
}

function detailsLanguagesSpaces() {
	$(".EXLDetailsContent li:matchField(Language)").html(function(i, val) {
		if (val.indexOf(";&nbsp;") == -1)
			return val.replace(/[;]/g, ";&nbsp;");
	});
}

//Handles lds3X links in Details tab
function detailsLateralLinks() {

	//lds30 and lds32 require no js mods; they search lsr30, lsr32
	//lds31, remove italic text from search string
	var listOfFields = ["Place"];
	for (var i = 0; i < listOfFields.length; i++) {
		$(".EXLDetailsContent li:matchField(" + listOfFields[i] + ")").find("a").each(function() {
			$(this).attr("href", lateralRemoveItalicLink($(this), $(this).attr("href")));
			$(this).text(lateralRemoveItalicText($(this), $(this).text()));
		});
	}

	//lds33, lds34, lds35, lds36
	var listOfFields = ["Other title", "Title", "Related titles", "In"];
	for (var i = 0; i < listOfFields.length; i++) {
		$(".EXLDetailsContent li:matchField(" + listOfFields[i] + ")").each(detailsLateralLinksFix);
	}

}

//Handle the Preface of the links 
function detailsLateralRemovePreface() {
	var newLine = true;

}

//Handle the content links of lds3X (remove italics from search string, search title index, handle identifiers)
function detailsLateralLinksFix() {
	var newLine = true;
	$(this).find("a, br").each(function() {
		if (newLine) {
			newLine = false;

			//Get the content
			var lateralLink = $(this).attr("href");
			var lateralLinkText = $(this).text();

			//Double check this is lateral link
			if (lateralLink.indexOf("lsr3") == -1)
				return;

			lateralLink = lateralRemoveItalicLink($(this), lateralLink);
			lateralLinkText = lateralRemoveItalicText($(this), lateralLinkText);

			//Handling ISSN's, special identifier, etc..a
			//except for lsr34, uniform title, due to musical work numbers that have same syntax as ISSNs
			if (lateralLink.indexOf("lsr34") == -1) {
				var listOfIdentifiers = ["([0-9]{4})-([0-9]{4})", "\(DLC\)", "\(OCoLC\)", "\(MH\)", "\(CaOONL\)"];
				for (var i = 0; i < listOfIdentifiers.length; i++) {
					lateralLink = lateralIdentifiersLink(lateralLink, listOfIdentifiers[i]);
					$(lateralIdentifiersSuffix(lateralLinkText, listOfIdentifiers[i])).insertAfter($(this));
					lateralLinkText = lateralIdentifiersText(lateralLinkText, listOfIdentifiers[i]);
				};
			}
			
			//Change the link to point to the title
			lateralLink = lateralLink.replace(/lsr3[3-6]/g, "title");			

			//Finalize link and text
			$(this).attr("href", lateralLink);
			$(this).text(lateralLinkText);
		} else {
			if ($(this).is("br"))
				newLine = true;
			else
				$(this).replaceWith($(this).text());
		}

	});

}

function lateralRemoveItalicLink(element, link) {
	//Remove anything inside <i> outside the link
	if ($(element).find("i").length) {
		//Fix the link
		link = link.substr(0, link.indexOf("%3ci%3e")) + link.substr(link.indexOf("%3c%2fi%3e") + 10);
	}

	return link;
}

function lateralRemoveItalicText(element, text) {
	if ($(element).find("i").length) {
		//Move the text
		$(element).find("i").insertBefore($(element));
		text = $(element).text();
	}
	return text;
}

//Modify the search query
function lateralIdentifiersLink(link, regexString) {
	var identifierStart = findIdentifier(link, regexString);
	if (identifierStart > 0) {
		var queryEnd = link.indexOf("&", identifierStart);
		link = link.substr(0, identifierStart - 1) + link.substr(queryEnd);
	}
	return link;
}

//Trims the text of the hyperlink up to the first identifier
function lateralIdentifiersText(text, regexString) {
	var identifierStart = findIdentifier(text, regexString);
	if (identifierStart > 0)
		text = text.substr(0, identifierStart - 1);

	return text
}

//Extract the Identifiers into a "suffix" to add after the link has been trimmed
function lateralIdentifiersSuffix(text, regexString) {
	var identifierStart = findIdentifier(text, regexString);
	var suffix = "";
	if (identifierStart > 0) {
		suffix = text.substring(identifierStart - 1);
		if (regexString == "([0-9]{4})-([0-9]{4})")
			suffix = "<span>, ISSN: " + suffix + "</span>";
		else
			suffix = "<span>" + suffix + "</span>";
	}

	return suffix;
}

//Translate to Regex object, and return the value
function findIdentifier(str, regexString) {
	var regex = new RegExp(regexString, "g");
	return str.search(regex);
}

//Add link to jump to Locations tab
function viewLocationsLink() {	
	$(".EXLDetailsContent ul").each(function() {
		//Check that it's ALEPH data only
		if (!$(this).find("li[id^='Source'] span:contains('HVD ALEPH')").length)
			return;
	
		//Confirm non modified
		if ($(this).find("li.detailsViewLocation").length)
			return;
		
		//Create a new li item with small script
		var linkHtml = $('<li class="detailsViewLocation"></li>');
		$(linkHtml).append($('<a href="javascript:void(0)" onclick="viewLocationsClick($(this))">Locations & Availability</a>'));
		$(this).append(linkHtml);
	});
}

//Enlarging the details tab whenever needed
function enlargeDetailsTab(element) {
	if ((RegExp("tabs=detailsTab").test(window.location.href)) || (RegExp("fn=permalink").test(window.location.href)))
		element.parents(".EXLDetailsTabContent").css("height", "auto");
	else {
		element.parents(".EXLDetailsTabContent").css({
			"height": "auto",
			"max-height": "38em"
		});
	}	
}

//Simulate a click
function viewLocationsClick(element) {
	$(element).parents(".EXLSummary").find(".EXLLocationsTab a").click();
}



//Incase direct link to Details tab, do these:
$(document).ready(function() {
	if ((RegExp("tabs=detailsTab").test(window.location.href)) || (RegExp("fn=permalink").test(window.location.href)) || (RegExp("/display.do?").test(window.location.href)) || (RegExp("/dlDisplay.do?").test(window.location.href))) {
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
	//Links modifications 
	linksModifications();
	modifyFindingAidsLink();

	//Details tab fields
	detailsLateralLinks();
	viewLocationsLink();

	//Linkify some details fields
	detailsSubfieldLinks();
	detailsLanguagesSpaces();

	//Build VIA support
	fixRelatedInformation();
	$("body").each(buildViaGallary);
	
	//SKC support 
	buildSKCgallery();

	//HGL support
	buildHGLLinks();
	osmItegration();
}
