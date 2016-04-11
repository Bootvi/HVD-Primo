//Do all these Adjustments once page completes loading
$(document).ready(function() {

	//In my eShelf - make Location tab open in a new tab to allow Location Tab hacks
	$(".EXLEshelfDocumentDetailsIFrame").on("load", function() {
		var recordId = $(this).contents().find(".EXLResultRecordId").attr("id");
		//Handle records with Locations tab
		$(this).contents().find(".EXLLocationsTab > a:contains('Locations')").attr({
			"href": "/HVD:" + recordId + "&availabilityTab=true",
			"target": "_blank"
		});
		//For VIA records
		if (recordId.indexOf("HVD_VIA") == 0)
			buildViaGalleryMyResearch();

	});
	

	//$('#exlidMainMenuRibbon li#exlidMainMenuItem0').insertAfter('#exlidMainMenuRibbon li#exlidMainMenuItem2');

	//Add new Search and Browse Search on different Pages
	var newSearchBasic = "<a class='EXLSearchFieldRibbonAdvancedTwoLinks' href='search.do?vid=HVD'>New Search</a>";
	var newSearch = '<a href="search.do?mode=Basic&vid=HVD" title="New Search">New Search</a>';
	var advancedSearch = '<a href="search.do?mode=Advanced&vid=HVD" title="New Search">Advanced Search</a>';
	var browseSearch = '<a title="Browse HOLLIS by..." href="search.do?fn=showBrowse&mode=BrowseSearch&vid=HVD">Browse HOLLIS by...</a>';

	if ((RegExp("mode=BrowseSearch").test(window.location.href)) || (RegExp("fn=BrowseRedirect").test(window.location.href))) {
		$(".EXLSearchFieldRibbonFormLinks").append(newSearch, advancedSearch);
	} else if ((RegExp("mode=Advanced").test(window.location.href))) {
		$(".EXLSearchFieldRibbonFormLinks").append(newSearch, browseSearch);
	} else {
		$(".EXLSearchFieldRibbonAdvancedSearchLink").append(newSearchBasic);
	}

	// add Limit To before selectors
	$(".EXLHeaderSearchLimitsFieldsTitle").append("Limit to:");

	//Trim long Facets
	$(".EXLFacetContainer ol li a").each(function() {
		var tlength = $(this).text().length;
		if (tlength > 44) {
			$(this).attr("title", $(this).text());
			var text = $(this).text().substr(0, 44);
			$(this).text(text.substr(0, text.lastIndexOf(" ")) + "...");
		}

	});

	//Trim long results titles
	$(".EXLResultsList h2 a").each(function() {
		var tlength = $(this).text().length;
		if (tlength > 150) {
			$(this).attr("title", $(this).text());
			var text = $(this).html().substr(0, 150);
			$(this).html(text.substr(0, text.lastIndexOf(" ")) + "...");
		}
	});

	$(".EXLResultsList h3").each(function() {
		var tlength = $(this).text().length;
		if (tlength > 130) {
			var text = $(this).html().substr(0, 130);
			$(this).html(text.substr(0, text.lastIndexOf(" ")) + "...");
		}
	});

	//Change CSS for GetIt! Tab1 (view online) when there is no full-text
	$("li > a:contains('Find It @ Harvard')").css({
		"color": "#293352",
		"font-weight": "normal",
		"border": "none",
		"background-color": "#fff",
		"background-position": "114px 4px",
		"background-image": "url(../uploaded_files/HVD/icon_popout_tab_hvdindigo.png)"
	});
	$("li > a:contains('Find It @ Harvard')").parent().css({
		"background-image": "none",
		"padding-left": "0px"
	});
	//20160229 CB changed View Online for HathiTrust to "limited search" b/c only 25% of HT content in PCI coll is FT right now
	// waiting for changed PCI activation to take effect so this is temporary fix, changing activation to HT open access only
	// 20160304 reversed, PCI refreshed
	//$(".EXLResultRecordId[id^='TN_hathi_trust']").each(changeHathiTabTitle);
	//Fix thin thumbnail images
	$("img.EXLBriefResultsCover").each(function() {
		$(this).one('load', fixThinThumbnails);
		if ($(this).width() > 0)
			$(this).trigger('load')
        });

	//Change Details tab for VIA records
	$(".EXLResultRecordId[id^='HVD_VIA']").each(changeVIATabTitle);
	$(".EXLFacet a:contains('All VIA records')").parents("li.EXLFacet").hide();
	$(".EXLFacet a:contains('Visual works')").parents("ol.EXLFacetsList").find(".EXLFacetsDisplayMore").hide();

	//Change HELP link to custom file
	//$(".EXLMainMenuItem > span > a:contains('Help')").attr("href", "../uploaded_files/HVD/help.html");
	$(".EXLMainMenuItem > span > a:contains('Help')").attr("href", "http://guides.library.harvard.edu/hollisplus_quicktips");
	$(".EXLMainMenuItem > span > a:contains('Help')").attr("target", "_blank");

	//When users are signed out - change some links, add content, etc..
	if ($('#exlidSignOut').hasClass('EXLHidden')) {
		//Change the My Account link
		$(".EXLMyAccount a").attr("href", "login.do?loginFn=signin&vid=HVD&targetURL=myAccountMenu.do%3Fvid%3DHVD");

		//For results list add sign-in reminder
		if ($("#exlidFacetTile").length && (window.location.href.indexOf("&tab=books") == -1)) {
			var signInLink = $('#exlidSignIn a').attr('href');
			var msg = "<img style='vertical-align:top;' src='../uploaded_files/HVD/exclamation_hvd_bluebonnet.png' alt='!' /><span style='margin-left: 5px;margin-top: 3px;display: inline-block;'>Harvard users: <a href='" + signInLink + "'>sign in<a/> to find more articles</span>";
			$('#exlidHeaderSystemFeedback').append('<div class="HVD_results_signin_reminder"><strong>' + msg + '</strong></div>');
		}
	}

	//Hiding the Sign-blurb from the main page if signed in
	if ($("#exlidSignIn").hasClass("EXLHidden")) {
		$("#signInHomeBodyWrapper").hide();
		$("#signInHomeBodyWrapper").after("you’ve signed in for complete access to articles");
	}

	//Moving RSS, eShelf, etc to bottom of Facets
	$('#exlidFacetTile').append($('.EXLFacetActionsV2').parent().parent());

	//If coming from BorrowDirect, open Locations tab
	if ((RegExp("dlDisplay").test(window.location.href)) && (RegExp("availabilityTab=true").test(window.location.href))) {
		$(".EXLLocationsTab a:contains('Locations')").click();
	}

	//Adding EAD tab for dedupMrg that have Finding Aids in their PNX
	addEADTab();
	
	//20160218 CB added analytics for capturing clicks on TOC link in results page and Details tab, and toplevel facets
	$("div[id^='tocLabel']").click(function(evt) {
		 ga('send', 'event','Table of Contents',evt.timeStamp);
		 //console.log("TOC results");
	});
	$(".EXLResultTabContainer.EXLContainer-detailsTab").click(function(evt) {
		 var gaCategory = evt.target.text.trim();
		 gaCategory = "Details Tab: " + gaCategory;
		 ga('send', 'event',gaCategory,evt.timeStamp);
		 //console.log(evt.target.text.trim());
	});	
	$("#facetListTopLevel").find("a[href*='fctV=available&']").click(function() {
		 ga('send', 'event','Top level facet','In library or depository');
	});
	$("#facetListTopLevel").find("a[href*='fctV=available_onsite&']").click(function() {
		 ga('send', 'event','Top level facet','In library');
	});	
	$("#facetListTopLevel").find("a[href*='fctV=online_resources&']").click(function() {
		 ga('send', 'event','Top level facet','Online');
	});		
	$("#facetListTopLevel").find("a[href*='fctV=peer_reviewed&']").click(function() {
		 ga('send', 'event','Top level facet','Peer-reviewed articles');
	});		
	//201600405 CB adding analytics for clicks on Limit to dropdowns below search box
	$("#exlidHeaderSearchLimits").find("#exlidInput_mediaType_1").change(function(evt) {		 		 
		 ga('send', 'event','Basic search limit: Resource type',evt.timeStamp);
	});		
	$("#exlidHeaderSearchLimits").find("#exlidInput_precisionOperator_1").change(function(evt) {		 
		 ga('send', 'event','Basic search limit: Precision operator',evt.timeStamp);
	});			
	$("#exlidHeaderSearchLimits").find("#exlidInput_scope_1").change(function(evt) {		 
		 ga('send', 'event','Basic search limit: Field (scope)',evt.timeStamp);
	});		
	

});

/*function changeHathiTabTitle() {
	var hathiTabTitle = "May be online at HathiTrust";	
	$(this).parents(".EXLResult").find(".EXLViewOnlineTab a:contains('View Online')").css({
		"font-weight": "normal",
		"color": "#293352",
		"background-image": "none"
	});
    $(this).parents(".EXLResult").find("li.EXLViewOnlineTab").css({
		"background-image": "none",
		"padding-left": "15px"
	});	
	$(this).parents(".EXLResult").find(".EXLViewOnlineTab a:contains('View Online')").text(hathiTabTitle);	
}*/

function changeVIATabTitle() {
	var viaTabTitle = "Details & Gallery (View Online)";
	//In case of numberOfImages="0"
	if ($(this).parents(".EXLResult").find(".EXLResultFourthLine:contains('no digitized images')").length) {
			$(this).parents(".EXLResult").find(".EXLResultFourthLine:contains('no digitized images')").text("");
			//viaTabTitle = "Details";
			/* $(this).parents(".EXLResult").find("li.EXLDetailsTab").css({
				"background-image": "",
			});
			 $(this).parents(".EXLResult").find(".EXLDetailsTab a:contains('Details')").css({
				"font-weight": "normal",
				"color": "#293352",
				"background-color": "none",		
				"border": "none",			
				"margin-left": "-1em"	
			});		*/
	} else if ($(this).parents(".EXLResult").find(".EXLResultSelectedTab").length) {
		$(this).parents(".EXLResult").find(".EXLDetailsTab a:contains('Details')").text(viaTabTitle);
	}	
	else {					
		$(this).parents(".EXLResult").find(".EXLDetailsTab a:contains('Details')").css({
			"font-weight": "bold",
			"color": "#a51c30",
			"margin-left": "-0.8em",
			"border": "1px solid #8c8179",
			"border-radius": "5px",
			"background-color": "#f8f8f8",
			"padding": "5px"
		});
		//$(this).parents(".EXLResult").find("li.EXLDetailsTab").css({						
		//});
		$(this).parents(".EXLResult").find(".EXLDetailsTab a:contains('Details')").text(viaTabTitle);		
	}           
	$(this).parents(".EXLResult").find("li.EXLViewOnlineTab ").css("display", "none");
}

//Fixing brief results thumbnails, shifting the pan and overflow from fixed height to fixed width
function fixThinThumbnails() {
	// this = $("img.EXLBriefResultsCover")
	var maxWidth = $(this).parents(".EXLBriefResultsDisplayCoverImages").find(".EXLBriefResultsDisplayCoverImageBackup").width();
	var maxheight = $(this).parents(".EXLBriefResultsDisplayCoverImages").find(".EXLBriefResultsDisplayCoverImageBackup").height();
	//console.log("maxWidth " + maxWidth);
	//console.log("maxheight " + maxheight);
	//console.log("this width " + $(this).width());
	//if ($(this).width() < maxWidth) {
		////Update the image SRC to the be the width limited
		//$(this).attr("src", $(this).attr("src").replace("height=65", "width=43"));

		//Change the CSS attributes of the Div and image to reflect narrow thin images
		//$(this).parents("div.coverImageDiv").css("height", "65px");
		/*$(this).css({
			"width": maxWidth + "px",
			"height": "auto",
			"top": "50%",
			"transform": "translate(-50%, -50%)",
			"-ms-transform": "translate(-50%, -50%)",
			"-webkit-transform": "translate(-50%, -50%)"
		});*/
	//}
}

//Overwrite the mogileDisplay.js function to avoid adding the languages to the mobile page
function addLanguages() {}

function addEADTab() {
	//Adding EAD tab for dedupMrg that have Finding Aids in their PNX
	$(".EXLResult").each(function() {
		var recordId = $(this).find(".EXLResultRecordId").attr("id");
		if (recordId.indexOf("dedupmrg") == 0) {
			//Get PNX record from the DB
			var pnxXML = loadPNX(recordId);

			//Obtain the EAD ID from the PNX
			var eadId = $(pnxXML).find("search > recordid:contains('HVD_EAD'):eq(0)").text().replace("HVD_EAD", "");
			if (eadId) {
				//Build a link and add it to the tab list
				var findingAidLink = "http://id.lib.harvard.edu/ead/" + eadId + "/catalog" + "&q=" + $("#search_field").val();;
				var findingAidTab = '<li class="EXLFindingAids EXLResultTab"><a target="_blank" href="' + findingAidLink + '">Finding Aid<img class="eadlinkicon" src="../images/icon_popout_tab.png" alt="Open in a new tab"></a></li>';
				$(this).find(".EXLResultTabs").append(findingAidTab);

			}
		}
	});
}

function snippetToLink() {
	//Snippets to TOC links - interim solution - not used 
	$("p.EXLResultSnippet[id^='snippet_HVD_ALEPH']").each(function() {
		if ($(this).text().length > 0) {
			$(this).css("background-color", "yellow");
		}

	});
}

//Overwritting Primo default function to call openPrimoLightBox with the additional modifyPermaLink
function openPermaLinkLbox(action,parameters,recordIndex,recordId) {
	var recordElement = $('#exlidResult'+recordIndex);
	if (isFullDisplay())
                var recordElement = $('#resultsListNoId');

	openPrimoLightBox(action, 'plGo', 'permalinkResultsXml', null, parameters, modifyPermaLink, true, recordElement);
 
	$('#exliWhiteContent').css('z-index','2');
	$('#exliWhiteContent').css('outline','none');
	$('#exliGreyOverlay').hide();
}

//Change the permalink content itself
function modifyPermaLink() {
	if (window.location.href.indexOf("harvard-primosb") == -1 && window.location.href.indexOf("stage.pd.dc04") == -1) {
		if (RegExp("HVD_ALEPH").test($("#exlidURL").attr("value"))) {
			var url = "http://id.lib.harvard.edu/aleph/" + $("#exlidURL").attr("value").replace(/(.*)(HVD)(.*)(:HVD_ALEPH)/, "") + "/catalog";
			$("#exlidURL").attr("value", url);
		}
		else if (RegExp("HVD_VIA").test($("#exlidURL").attr("value"))) {
                	var url = "http://id.lib.harvard.edu/via/" + $("#exlidURL").attr("value").replace(/(.*)(HVD)(.*)(:HVD_VIA)/, "") + "/catalog";    
	                $("#exlidURL").attr("value", url);
        	}
	}
}

//Call to Primo's login.do to get Login Status
function getLoginStatus() {
	var loginStatus = false;
	$.ajax({
		url: "/primo_library/libweb/action/login.do?afterPDS=true&ajaxSSO=true&vid=HVD",
		dataType:'json',
		async: false,
		success: function(result) {
			if (result["status"] != "failure") 
				loginStatus = true;
		},
		error: function(request,errorType,exceptionOcurred) {
			console.log("Login Check Ajax failed");
			console.log(errorType);
		}
	});
	return loginStatus;
}

function loadXMLDoc(filename) {
	if (window.ActiveXObject || window.navigator.userAgent.indexOf("Trident/7.0") > 0) {
		xhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} else {
		xhttp = new XMLHttpRequest();
	}
	xhttp.open("GET", filename, false);
	try {
		xhttp.responseType = "msxml-document"
	} catch (err) {} // Helping IE11
	xhttp.send("");
	return xhttp.responseXML;
}



//Load PNX XML from Primo DB
function loadXML(url) {
	//Creating a Native empty Dom Element
	var xml = $.ajax({
		url: url,
		dataType: "xml",
		async: false,
		error: function() {
			logJS('XML retrieval error')
		}
	}).responseXML;
	//logJS(pnxRecord);
	return xml;
}

//Support both IE10 and IE11
function serializeXmlNode(xmlNode) {
	if (typeof window.XMLSerializer != "undefined") {
		return (new window.XMLSerializer()).serializeToString(xmlNode);
	} else if (typeof xmlNode.xml != "undefined") {
		return xmlNode.xml;
	}
	return "";
}

//Transforms the VIA original XML with the XSL on uploaded folder
function transformXSL(viaXML, fileName) {
	//Code for IE
	if (window.ActiveXObject || window.navigator.userAgent.indexOf("Trident/7.0") > 0) {
		//Initialize all the XSLT methods
		var xslt = new ActiveXObject("Msxml2.XSLTemplate.3.0");
		var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.3.0");
		xslDoc.async = false;
		xslDoc.load(fileName);

		//Load the XML
		console.log(typeof window.XMLSerializer != "undefined");
		var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.6.0");
		xmlDoc.loadXML('<?xml version="1.0"?>' + serializeXmlNode(viaXML));

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
		var viaXSL = loadXML(fileName);
		xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(viaXSL);
		resultDocument = xsltProcessor.transformToFragment(viaXML, document);
		return resultDocument;
	}
}

//Load PNX XML from Primo DB
function loadPNX(recordId) {
	//Creating a Native empty Dom Element
	var pnxRecord;
	if (!pnxRecord) {
		pnxRecord = $.ajax({
			url: '/primo_library/libweb/action/display.do',
			data: {
				fn: 'display',
				doc: recordId,
				showPnx: true
			},
			dataType: "xml",
			async: false,
			error: function() {
				log('pnx retrieval error')
			}
		}).responseXML;
	}
	//logJS(pnxRecord);
	return pnxRecord;
}

//General URL parser:
function getURLParams(qs) {
	qs = qs.split("+").join(" ");

	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}

	return params;
}



//Debugger for the customer JS
debugJS = false

function logJS(msg) {
	try {
		if (console && console.log) {
			console.log(msg);
		}
	} catch (logerr) {
		if (debugJS) {
			alert(msg);
		}
	}
}

//Customer JQuery expression selector for finding Display fields. Matches StringXX where XX are digits (e.g. -1, 5, 29)
jQuery.expr[':'].matchField = function(elem, index, match) {
	var matchParams = match[3],
		regexFlags = 'g',
		regex = new RegExp("^" + matchParams.trim() + "\(\\d|-\\d\)", regexFlags);
	return regex.test(jQuery(elem)["attr"]("id"));
}

//Regex toolkit
function getRegexMatches(string, regex, index) {
	index || (index = 1); // default to the first capturing group
	var matches = [];
	var match;
	while (match = regex.exec(string)) {
		matches.push(match[index]);
	}
	return matches;
}

