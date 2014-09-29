//Do all these Adjustments once page completes loading
$(document).ready(function() {

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

	//Move VIA thumbnails outside of the result icon
	/*
	$("a.EXLResultRecordId[id^='HVD_VIA']").each(function() {
		if ($(this).parents(".EXLThumbnail").find(".EXLBriefResultsCover").length) {
			var thumbnailUrl = $(this).parents(".EXLThumbnail").find("img.EXLBriefResultsCover").attr("src");
			
			var newThumbnailHTML = '<div class="VIASearchThumbnail"><table><tr><td><img src="' + thumbnailUrl + '"></td></tr></table>';

			$(this).parents(".EXLResult").find(".EXLSummaryContainer").append(newThumbnailHTML);
			console.log(newThumbnailHTML);
		}
	//k++;
	//	console.log(k);
	});*/

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

});

function snippetToLink() {
	//Snippets to TOC links - interim solution - not used 
	$("p.EXLResultSnippet[id^='snippet_HVD_ALEPH']").each(function() {
		if ($(this).text().length > 0) {
			$(this).css("background-color", "yellow");
		}

	});



}


//begin code for ND for Date Slider; added by CB 20140701
jQuery(function($) {
	var $dateSubmit, $end, $slider, $sliderURL, $start, addEventHandlers, addYear, getURL, gotoURL, hideLink, maxYear, minYear, padYear, ready, removePreviousDates, restrictKeyPress, restrictKeyUp, showLink, sortNumber, submitEnd, submitStart, updateEnd, updateSlider, updateStart, updateURL, yearIndex, yearValue, years;
	$slider = $('#slider-range');
	if ($slider.length > 0) {
		$sliderURL = $("#sliderURL");
		$start = $('#startdate');
		$end = $('#enddate');
		$dateSubmit = $('#dateSubmit');
		minYear = 1;
		maxYear = new Date().getFullYear();
		years = window.limits;
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
			$end.val(endValue);
			return updateSlider();
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

//Generic XML loader
function loadXMLDoc(filename) {
	// code for IE7+, Firefox, Chrome, Opera, Safari
	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	}
	// code for IE6, IE5
	else {
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET", filename, false);
	xhttp.send();
	return xhttp.responseXML;
}


//Load PNX XML from Primo DB
function loadPNX(recordId) {
	var pnxRecord;
	if (!pnxRecord) {
		pnxRecord = $.ajax({
			url: 'display.do',
			data: {
				fn: 'display',
				doc: recordId,
				showPnx: true
			},
			async: false,
			error: function() {
				log('pnx retrieval error')
			}
		}).responseXML;
	}
	console.log(pnxRecord);
	return pnxRecord;
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