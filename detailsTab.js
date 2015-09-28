//Changing links from Popup to new Tab
function linksModifications() {
	$("a[class='outsider EXLFullDetailsOutboundLink']").each(function() {
		$(this).attr('target', '_blank');
		$(this).attr('onclick', '');
	});
}

// 20150818 CB I don't think we use this function anymore, not since we re-implementing linking with lsr's
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
// 20150819 CB adding author link mod as well
function detailsLateralLinks() {
	
	//lds30, lds31, and lds32 require no js mods; they search lsr's
	
	//lds31, remove italic text from search string
	var listOfFields = ["Place"];
	for (var i = 0; i < listOfFields.length; i++) {
		$(".EXLDetailsContent li:matchField(" + listOfFields[i] + ")").find("a").each(function() {
			$(this).attr("href", lateralRemoveItalicLink($(this), $(this).attr("href")));
			$(this).text(lateralRemoveItalicText($(this), $(this).text()));
		});
	}

	//lds33, lds34
	var listOfFields = ["Other title", "Title"];
	for (var i = 0; i < listOfFields.length; i++) {
		$(".EXLDetailsContent li:matchField(" + listOfFields[i] + ")").each(detailsLateralLinksFixUT);
	}
	
	//lds38
	var listOfFields = ["Other title / series"];
	for (var i = 0; i < listOfFields.length; i++) {
		$(".EXLDetailsContent li:matchField(" + listOfFields[i] + ")").each(detailsLateralLinksFixSeries);
	}	

	//lds35 linking entries
	var listOfFields = ["Related titles"];
	for (var i = 0; i < listOfFields.length; i++) {
		$(".EXLDetailsContent li:matchField(" + listOfFields[i] + ")").each(detailsLateralLinksFixLinkingEntries);
	}		
	
	// author links with relator terms in square brackets
	// and handling of non-author subfields like t, placed after -- with NR change
	var listOfFields = ["Author / Creator"];
	for (var i = 0; i < listOfFields.length; i++) {
		$(".EXLDetailsContent li:matchField(" + listOfFields[i] + ")").find("a").each(function() {
			if ($(this).attr("href").search(/\+%5b.+%5d&/) > 0) {	 //ampersand etc are remaining parameters in href search
				$(this).attr("href",$(this).attr("href").replace(/\+%5b.+%5d&/,"&")); //take relator out of href
				var relator = $(this).text().replace(/.+( \[.+\])/,"$1");	//capture relator term from a text			
				$("<span>"+relator+"</span>").insertAfter($(this));  // insert after a text
				$(this).text($(this).text().replace(/ \[.+\]$/,"")); // remove from within a text
			} else if ($(this).attr("href").search(/\+%5b.+%5d\+--.+--&/) > 0) { // handle cases with both relator and -- 
				$(this).attr("href",$(this).attr("href").replace(/\+%5b.+%5d\+--.+--&/,"&")); //take term out of href
				var relandmore = $(this).text().replace(/.+( \[.+\] )--(.+)--/,"$1. $2");	//capture term from a text		
				$("<span> "+relandmore+"</span>").insertAfter($(this));  // insert after a text
				$(this).text($(this).text().replace(/\[.+--$/,"")); // remove from within a text						
			} else if ($(this).attr("href").search(/\+--.+--&/) > 0) { // handle cases with -- and no relator
				$(this).attr("href",$(this).attr("href").replace(/\+--.+--&/,"&")); //take term out of href
				var nonauthor = $(this).text().replace(/.+ --(.+)--/,"$1");	//capture term from a text			
				$("<span> "+nonauthor+"</span>").insertAfter($(this));  // insert after a text
				$(this).text($(this).text().replace(/ --.+--$/,"")); // remove from within a text				
			}
		});
	}		
}

//Handle the Preface of the links 
function detailsLateralRemovePreface() {
	var newLine = true;

}

//Handle lds33 and lds34, uniform titles and collective titles (search title index)
function detailsLateralLinksFixUT() {
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
			
			//Change the link to point to the title
			lateralLink = lateralLink.replace(/lsr3[3-4]/g, "title");			

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

//Handle the content links of lds38 (trim volume numbers, omit ISSN from search)
function detailsLateralLinksFixSeries() {
	var newLine = true;
	$(this).find("a, br").each(function() {
		if (newLine) {
			newLine = false;

			//Get the content
			var lateralLink = $(this).attr("href");
			var lateralLinkText = $(this).text();

			//Double check this is lateral link
			if (lateralLink.indexOf("lsr38") == -1)
				return;

			//Handling ISSN's, volume numbers
			// sometimes dddd-dddd is a year range and not ISSN (e.g. bib 000446127)			
			var listOfIdentifiers = ["ISSN"," ; "];
			for (var i = 0; i < listOfIdentifiers.length; i++) {
				lateralLink = lateralIdentifiersLink(lateralLink, listOfIdentifiers[i]);
				$(lateralIdentifiersSuffix(lateralLinkText, listOfIdentifiers[i])).insertAfter($(this));
				lateralLinkText = lateralIdentifiersText(lateralLinkText, listOfIdentifiers[i]);
			};	 			
		

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

//Handle the content links of lds35 (remove italics from search string, search issn or isbn index, handle identifiers)
function detailsLateralLinksFixLinkingEntries() {
	var newLine = true;
	$(this).find("a, br").each(function() {
		if (newLine) {
			newLine = false;

			//Get the content
			var lateralLink = $(this).attr("href");
			var lateralLinkText = $(this).text();

			//Double check this is lateral link
			if (lateralLink.indexOf("lsr35") == -1)
				return;

			lateralLink = lateralRemoveItalicLink($(this), lateralLink);
			lateralLinkText = lateralRemoveItalicText($(this), lateralLinkText);

			//For these, instead of linking text in front of identifers, need to link only identifers, and search appropriate index
			//doing title search doesn't work becuase these fields may include authors etc. 
			// if no ISSN or ISBN, don't present link at all
			
			if (lateralLink.indexOf("ISSN") > 0 ) {				
				lateralLink = lateralIdentifiersLinkAlt(lateralLink, "ISSN");
				$(lateralIdentifiersPrefix(lateralLinkText, "ISSN")).insertBefore($(this));
				lateralLinkText = lateralIdentifiersTextAlt(lateralLinkText, "ISSN");
				lateralLink = lateralLink.replace(/lsr35/g, "issn");	
			} else if (lateralLink.indexOf("ISBN") > 0 ) {				
				lateralLink = lateralIdentifiersLinkAlt(lateralLink, "ISBN");
				$(lateralIdentifiersPrefix(lateralLinkText, "ISBN")).insertBefore($(this));
				lateralLinkText = lateralIdentifiersTextAlt(lateralLinkText, "ISBN");
				lateralLink = lateralLink.replace(/lsr35/g, "isbn");	
			} else {
				lateralLink = "";				
				$("<span>"+lateralLinkText+"</span>").insertBefore($(this));
				lateralLinkText = "";
			}					

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
// link = href, regexString = ISSN
function lateralIdentifiersLink(link, regexString) {
	var identifierStart = findIdentifier(link, regexString);
	if (identifierStart > 0) {
		var queryEnd = link.indexOf("&", identifierStart);
		link = link.substr(0, identifierStart - 1) + link.substr(queryEnd);
	}
	return link;
}

// instead of retaining text in front of identifier for href, keep identifer only
function lateralIdentifiersLinkAlt(link, regexString) {
	var identifierStart = findIdentifier(link, regexString);
	if (identifierStart > 0) {
		var queryEnd = link.indexOf("&", identifierStart);
		link = "search.do?vl(freeText0)=" + link.substr(identifierStart + 7) + link.substr(queryEnd);
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

//Trims the text of the hyperlink to only include identifier
function lateralIdentifiersTextAlt(text, regexString) {
	var identifierStart = findIdentifier(text, regexString);
	if (identifierStart > 0)
		text = text.substr(identifierStart);

	return text
}

//Extract the Identifiers into a "suffix" to add after the link has been trimmed
function lateralIdentifiersSuffix(text, regexString) {
	var identifierStart = findIdentifier(text, regexString);
	var suffix = "";
	if (identifierStart > 0) {
		suffix = text.substring(identifierStart - 1);
		if (regexString == "([0-9]{4})-([0-9]{4})")
			//suffix = "<span>, ISSN: " + suffix + "</span>";
			// need to remove ISSN prefix b/c is applied to years span too, need more robust solution
			suffix = "<span> ; " + suffix + "</span>";
		else
			suffix = "<span>" + suffix + "</span>";
	}

	return suffix;
}

//Extract the text into a "prefix" to add before the link to ISSN/ISBN for lds35
function lateralIdentifiersPrefix(text, regexString) {
	var identifierStart = findIdentifier(text, regexString);
	var prefix = "";
	if (identifierStart > 0) {
		prefix = text.substring(0,identifierStart);
		prefix = "<span>" + prefix + "</span>";
	}
	return prefix;
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



//In case direct link to Details tab, do these:
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
