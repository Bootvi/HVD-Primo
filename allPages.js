//Do all these Adjustments once page completes loading
$(document).ready(function() {

	//In my eShelf - make Location tab open in a new tab to allow Location Tab hacks
	$(".EXLEshelfDocumentDetailsIFrame").on("load", function() {
		var recordId = $(this).contents().find(".EXLResultRecordId").attr("id");
		$(this).contents().find(".EXLLocationsTab > a:contains('Locations')").attr({
			"href": "/HVD:" + recordId + "&availabilityTab=true",
			"target": "_blank"
		});
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
		"font-weight": "normal"
	});
	$("li > a:contains('Find It @ Harvard')").parent().css({
		"background-image": "none",
		"padding-left": "0px"
	});

	//Change Details tab for VIA records
	$(".EXLResultRecordId[id^='HVD_VIA']").each(function() {
		$(this).parents(".EXLResult").find(".EXLDetailsTab a:contains('Details')").text("Details & Gallery (View Online)");
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
		$(this).parents(".EXLResult").find("li.EXLViewOnlineTab ").css("display", "none");
	});
	$(".EXLFacet a:contains('Surrogate at Harvard')").parents("li.EXLFacet").hide();
	$(".EXLFacet a:contains('Surrogate at Harvard')").parents("ol.EXLFacetsList").find(".EXLFacetsDisplayMore").hide();

	//Change HELP link to custom file
	$(".EXLMainMenuItem > span > a:contains('Help')").attr("href", "../uploaded_files/HVD/help.html");

	//Adding the Sign-in Prompt on Brief results only
	if ($('#exlidSignOut').hasClass('EXLHidden') && $("#exlidFacetTile").length != 0) {
		var signInLink = $('#exlidSignIn a').attr('href');
		var msg = "You don't know what you're missing. <a href='" + signInLink + "'>Sign in<a/> to get results from all available resources.";
		$('#exlidHeaderSystemFeedback').append('<div id="exlidHeaderSystemFeedbackContent" class="EXLSystemFeedback"><strong>' + msg + '</strong></div>');
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
				var findingAidLink = "http://oasis.lib.harvard.edu/oasis/deliver/primo?id=" + eadId + "&q=" + $("#search_field").val();;
				var findingAidTab = '<li class="EXLFindingAids EXLResultTab"><a target="_blank" href="' + findingAidLink + '">Finding Aids</a></li>';
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


function loadXMLDoc(filename) {
	if (window.ActiveXObject) {
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

function transformXSL(viaXML, fileName) {
	//Code for IE
	if (window.ActiveXObject) {
		//Initialize all the XSLT methods
		var xslt = new ActiveXObject("Msxml2.XSLTemplate.3.0");
		var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.3.0");
		xslDoc.async = false;
		xslDoc.load(fileName);

		//Load the XML
		var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.6.0");
		xmlDoc.loadXML('<?xml version="1.0"?>' + (new XMLSerializer()).serializeToString(viaXML));

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
