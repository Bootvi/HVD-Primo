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
		"color": "#8C8179",
		"font-weight": "normal",
		"background-position": "108px 2px"
	});
	$("li > a:contains('Find It @ Harvard')").parent().css({
		"background-image": "none",
		"padding-left": "0px"
	});
	//Fix thin thumbnail images
	$("img.EXLBriefResultsCover").each(function() {
		$(this).one('load', fixThinThumbnails);
		if ($(this).width() > 0)
			$(this).trigger('load')
        });

	//Change Details tab for VIA records
	$(".EXLResultRecordId[id^='HVD_VIA']").each(changeVIATabTitle);
	
	$(".EXLFacet a:contains('Surrogate at Harvard')").parents("li.EXLFacet").hide(); // 20150218 after next week renorm this line will be obsolete
	$(".EXLFacet a:contains('All VIA records')").parents("li.EXLFacet").hide();
	$(".EXLFacet a:contains('Visual works')").parents("ol.EXLFacetsList").find(".EXLFacetsDisplayMore").hide();

	//Change HELP link to custom file
	$(".EXLMainMenuItem > span > a:contains('Help')").attr("href", "../uploaded_files/HVD/help.html");

	//When users are signed out - change some links, add content, etc..
	if ($('#exlidSignOut').hasClass('EXLHidden')) {
		//Change the My Account link
		$(".EXLMyAccount a").attr("href", "login.do?loginFn=signin&vid=HVD&targetURL=myAccountMenu.do%3Fvid%3DHVD");

		//For Brief results add the yellow ribbon
		if ($("#exlidFacetTile").length) {
			var signInLink = $('#exlidSignIn a').attr('href');
			var msg = "You don't know what you're missing. <a href='" + signInLink + "'>Sign in<a/> to get results from all available resources.";
			$('#exlidHeaderSystemFeedback').append('<div id="exlidHeaderSystemFeedbackContent" class="EXLSystemFeedback"><strong>' + msg + '</strong></div>');
		}
	}

	//Hiding the Sign-blurb from the main page if signed in
	if ($("#exlidSignIn").hasClass("EXLHidden")) {
		$("#signInHomeBody strong").hide();
	}

	//Moving RSS, eShelf, etc to bottom of Facets
	$('#exlidFacetTile').append($('.EXLFacetActionsV2').parent().parent());

	//If coming from BorrowDirect, open Locations tab
	if ((RegExp("dlDisplay").test(window.location.href)) && (RegExp("availabilityTab=true").test(window.location.href))) {
		$(".EXLLocationsTab a:contains('Locations')").click();
	}

	//Adding EAD tab for dedupMrg that have Finding Aids in their PNX
	addEADTab();

});

function changeVIATabTitle() {
                var viaTabTitle = "Details & Gallery (View Online)";
				
                $(this).parents(".EXLResult").find(".EXLDetailsTab a:contains('Details')").css({
                        "font-weight": "bold",
                        "color": "#52854C"
                });
                $(this).parents(".EXLResult").find("li.EXLDetailsTab").css({
                        "background-image": "url(../images/icon_available.png)",
                        "background-repeat": "no-repeat",
                        "background-position": "2px 2px",
                        "padding-left": "15px"
                });				

                //In case of numberOfImages="0"
                if ($(this).parents(".EXLResult").find(".EXLResultFourthLine:contains('no digitized images')").length) {
                        $(this).parents(".EXLResult").find(".EXLResultFourthLine:contains('no digitized images')").text("");
                        viaTabTitle = "Details";
						 $(this).parents(".EXLResult").find("li.EXLDetailsTab").css({
							"background-image": "",
						});
						 $(this).parents(".EXLResult").find(".EXLDetailsTab a:contains('Details')").css({
							"font-weight": "normal",
							"color": "#293352"                
						});		
                }
                $(this).parents(".EXLResult").find(".EXLDetailsTab a:contains('Details')").text(viaTabTitle);

                $(this).parents(".EXLResult").find("li.EXLViewOnlineTab ").css("display", "none");


}

//Fixing brief results thumbnails, shifting the pan and overflow from fixed height to fixed width
function fixThinThumbnails() {
	var maxWidth = $(this).parents(".EXLBriefResultsDisplayCoverImages").find(".EXLBriefResultsDisplayCoverImageBackup").width();
	var maxheight = $(this).parents(".EXLBriefResultsDisplayCoverImages").find(".EXLBriefResultsDisplayCoverImageBackup").height();
	if ($(this).width() < maxWidth) {
		//Update the image SRC to the be the width limited
		$(this).attr("src", $(this).attr("src").replace("height=65", "width=43"));

		//Change the CSS attributes of the Div and image to reflect narrow thin images
		$(this).parents("div.coverImageDiv").css("height", "65px");
		$(this).css({
			"width": maxWidth + "px",
			"height": "auto",
			"top": "50%",
			"transform": "translate(-50%, -50%)",
			"-ms-transform": "translate(-50%, -50%)",
			"-webkit-transform": "translate(-50%, -50%)"
		});
	}
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
function openPermaLinkLbox(action,parameters,recordIndex,recordId){
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
	if (!window.location.href.indexOf("harvard-primosb") && window.location.href.indexOf("stage.pd.dc04")) {
		if (RegExp("HVD:HVD_ALEPH").test($("#exlidURL").attr("value"))) {
			var url = "http://id.lib.harvard.edu/aleph/" + $("#exlidURL").attr("value").replace(/(.*)(HVD:HVD_ALEPH)/, "") + "/catalog";
			$("#exlidURL").attr("value", url);
		}
		else if (RegExp("HVD:HVD_VIA").test($("#exlidURL").attr("value"))) {
                	var url = "http://id.lib.harvard.edu/via/" + $("#exlidURL").attr("value").replace(/(.*)(HVD:HVD_VIA)/, "") + "/catalog";    
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


//begin code for ND for Date Slider; added by CB 20140701, revised 20141006
jQuery(function($) {
	var $dateSubmit, $end, $slider, $sliderURL, $start, addEventHandlers, addYear, allowedYears, getURL, gotoURL, hideLink, maxYear, minYear, nearestYear, padYear, ready, recentYears, removePreviousDates, restrictKeyPress, restrictKeyUp, showLink, sortNumber, submitEnd, submitStart, updateEnd, updateSlider, updateStart, updateURL, yearIndex, yearValue, years, _i, _results;
	$slider = $('#slider-range');
	if ($slider.length > 0) {
		$sliderURL = $("#sliderURL");
		$start = $('#startdate');
		$end = $('#enddate');
		$dateSubmit = $('#dateSubmit');
		minYear = 1;
		maxYear = new Date().getFullYear();
		years = window.limits;
		recentYears = (function() {
			_results = [];
			for (var _i = 1951; 1951 <= maxYear ? _i <= maxYear : _i >= maxYear; 1951 <= maxYear ? _i++ : _i--) {
				_results.push(_i);
			}
			return _results;
		}).apply(this);
		allowedYears = $.merge([1, 500, 1000, 1500, 1600, 1700, 1800, 1900, 1910, 1920, 1930, 1940, 1950], recentYears);
		removePreviousDates = function() {
			var modifiedURL, nameMatches, originalURL, valueMatches;
			originalURL = $sliderURL.val();
			modifiedURL = originalURL;
			nameMatches = originalURL.match(/fctN=[^&]+&?/g);
			valueMatches = originalURL.match(/fctV=[^&]+&?/g);
			$.each(nameMatches, function(index, nameMatch) {
				var valueMatch;
				if (nameMatch.match(RegExp("=facet_creationdate"))) {
					valueMatch = valueMatches[index];
					modifiedURL = modifiedURL.replace(nameMatch, "");
					modifiedURL = modifiedURL.replace(valueMatch, "");
				}
			});
			return $sliderURL.val(modifiedURL);
		};
		hideLink = function() {
			$dateSubmit.hide();
		};
		showLink = function() {
			$dateSubmit.show();
		};
		getURL = function() {
			var dateString, url;
			showLink();
			url = $sliderURL.val();
			url = url.replace('fctN=xxx', "fctN=facet_creationdate");
			dateString = "fctV=%5b" + (padYear($start.val())) + "+TO+" + (padYear($end.val())) + "%5d";
			url = url.replace('fctV=xxx', dateString);
			return url;
		};
		padYear = function(year) {
			var pad;
			year = '' + year;
			pad = "0000";
			return pad.substring(0, pad.length - year.length) + year;
		};
		updateURL = function() {
			$dateSubmit.attr('href', getURL());
		};
		gotoURL = function() {
			window.location.href = getURL();
		};
		restrictKeyPress = function(event) {
			var keyValue;
			keyValue = String.fromCharCode(event.which);
			if (keyValue && /\D/.test(keyValue)) {
				event.preventDefault();
			}
		};
		restrictKeyUp = function(event) {
			var input, newValue;
			input = $(this);
			newValue = input.val().replace(/\D/g, '');
			if (newValue !== input.val()) {
				input.val(newValue);
			}
		};
		yearValue = function(input) {
			var string;
			string = input.val().replace(/\D/g, '');
			if (string === '') {
				return minYear;
			} else {
				return parseInt(string, 10);
			}
		};
		submitStart = function(event) {
			if (event.which === 13) {
				updateStart();
				return gotoURL();
			}
		};
		submitEnd = function(event) {
			if (event.which === 13) {
				updateEnd();
				return gotoURL();
			}
		};
		updateStart = function(event) {
			var endValue, startValue;
			startValue = yearValue($start);
			endValue = yearValue($end);
			if (startValue < minYear) {
				startValue = minYear;
			} else if (startValue > endValue) {
				startValue = endValue;
			}
			startValue = nearestYear(startValue, 'start');
			$start.val(startValue);
			return updateSlider();
		};
		updateEnd = function(event) {
			var endValue, startValue;
			startValue = yearValue($start);
			endValue = yearValue($end);
			if (endValue > maxYear) {
				endValue = maxYear;
			} else if (endValue < startValue) {
				endValue = startValue;
			}
			endValue = nearestYear(endValue, 'end');
			$end.val(endValue);
			return updateSlider();
		};
		nearestYear = function(year, rangeType) {
			var arrayIndex, index, value, _j, _len;
			year = parseInt(year, 10);
			index = allowedYears.indexOf(year);
			if (index === -1) {
				for (arrayIndex = _j = 0, _len = allowedYears.length; _j < _len; arrayIndex = ++_j) {
					value = allowedYears[arrayIndex];
					if (year < value) {
						if (rangeType === 'start' && arrayIndex > 0) {
							index = arrayIndex - 1;
						} else {
							index = arrayIndex;
						}
						break;
					}
				}
			}
			return allowedYears[index];
		};
		yearIndex = function(year) {
			var index;
			year = parseInt(year, 10);
			index = years.indexOf(year);
			if (index === -1) {
				addYear(year);
				index = years.indexOf(year);
			}
			return index;
		};
		sortNumber = function(a, b) {
			return a - b;
		};
		addYear = function(year) {
			years.push(parseInt(year, 10));
			years.sort(sortNumber);
			return $slider.slider("option", "max", years.length - 1);
		};
		updateSlider = function() {
			var endValue, startValue;
			updateURL();
			startValue = yearValue($start);
			endValue = yearValue($end);
			$slider.slider("values", 0, yearIndex(startValue));
			$slider.slider("values", 1, yearIndex(endValue));
			return window.changeTooltipsHeadeValues($slider, startValue, endValue);
		};
		addEventHandlers = function() {
			var $inputs;
			$inputs = $start.add($end);
			$inputs.attr('onblur', '').attr('onkeyup', '');
			$inputs.attr('pattern', '[0-9]*');
			$inputs.keypress(restrictKeyPress);
			$inputs.keyup(restrictKeyUp);
			$inputs.keyup(showLink);
			$inputs.change(updateURL);
			$start.blur(updateStart);
			$end.blur(updateEnd);
			$start.keypress(submitStart);
			$end.keypress(submitEnd);
			return $slider.on("slidestop", updateSlider);
		};
		ready = function() {
			removePreviousDates();
			hideLink();
			return addEventHandlers();
		};
		return $(document).ready(ready);
	}
});
//end code for ND for Date Slider;

