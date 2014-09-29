//Written by Alon Botvinik
//Location tab related functions.
//Processing starts here (after page load, or Ajax, see bottom of file)
function locationsTabModifications() {
	//Create a global variable for the XML, no need to read it million of times
	xmlDoc = loadXMLDoc("../uploaded_files/HVD/requestLinkLogic.xml");

	//Each DIV has it's own variables and listener, so no conflict should happen.
	$(".EXLSublocation").each(function() {
		createRequestOptions();

		//Put a listener on the Sublibrary DIV which contains the Request options to catch when it is populated, or more items are added
		$(this).on("DOMSubtreeModified propertychange", handleDomChanges);

	});


	//If full display, let Locations tab extend like Details tab.
	if ((RegExp("display.do").test(window.location.href)) || (RegExp("dlDisplay.do").test(window.location.href)))
		$(".EXLLocationListContainer").css("height", "auto");

	//Add a spinning wheel for loading locations for any arrows that appear on the Locations tabs
	$(".EXLLocationsIcon").click(handleLocationIconClick);

	//If it is a single location, perform all changes immediately before attaching a listener
	shortenLocationNotes();

	createCountwaySerialsNote();
	//20140919 TEST: CB added text call number 
	textCallNo();

	//Alon B: Adding BorrowDirect at the bottom of Locations tab
	borrowDirect();


}

//Handles when the EXLSublocation is updated, with condition when it contains the EXLLocationTableActions in it
function handleDomChanges() {
	//Remove the listener before changing
	$(this).off();

	//Modify contents
	shortenLocationNotes();
	createCountwaySerialsNote();
	//20140919 TEST: CB added text call number 
	textCallNo();

	if ($(this).find(".EXLLocationTableActions").length)
		createRequestOptions();

	//Resume listening (if there are more items, RTA changes, Primo OTB changes
	$(this).on("DOMSubtreeModified propertychange", handleDomChanges);

	//Remove the Loading Wheel
	$(this).parents(".EXLLocationList").find(".HVD_LoadingWheel").remove();
}


//Full solution implementation, e.g. HVD_ALEPH008190450
//Uses functions inside requestOptions.js to determine the request options available
function createRequestOptions() {
	$(".EXLLocationTableActions").each(function() {
		//Check if this was modified
		if ($(this).find(".EXLLocationModified").length)
			return;

		//Mark this Item as modified and collect data
		$(this).prepend('<input type="hidden" class="EXLLocationModified">');
		var itemArgs = collectItemArgs($(this));

		//Get an array of requesting options based on the itemArguments (call from requestOptions.js)
		var requestOptions = processRequestOptions(itemArgs);

		//If there's any Hold Request from Primo's API, store it.
		$(this).find("ul li.EXLLocationTableActionsFirstItem a").text("Request Item");
		var holdRequest = $(this).find("ul li.EXLLocationTableActionsFirstItem").html();
		//Clean the list
		$(this).find("ul").empty();

		//AEON request, will remove Booking option from Aleph's OvP API if present
		if (requestOptions.indexOf("hold") > -1)
			$(this).find("ul").append('<li>' + holdRequest + '</li>');

		if (requestOptions.indexOf("aeon") > -1) {
			var url = "http://sfx.hul.harvard.edu/sfx_local?sid=HOLLIS:AEON&pid=DocNumber=" + itemArgs["admDocNumer"] + ",ItemSequence=" + itemArgs["itemSequence"] + "&sfx.skip_augmentation=1";
			$(this).find("ul").append('<li><a href="' + url + '" target="_blank">Request Item</a></li>');
		}
		//Scan & Deliver request, will remove Photocopy Request option from Aleph's OvP API if present
		if (requestOptions.indexOf("scandeliver") > -1) {
			var url = "http://sfx.hul.harvard.edu/sfx_local?sid=HOLLIS:ILL&pid=DocNumber=" + itemArgs["admDocNumer"] + ",ItemSequence=" + itemArgs["itemSequence"] + "&sfx.skip_augmentation=1";
			$(this).find("ul").append('<li><a href="' + url + '" target="_blank">Scan & Deliver</a></li>');
		}
		//If no options, show not available
		//if (!$(this).find("ul li").length)
		//	$(this).find("ul").append('<li>Request not available</li>');
		//
		stacksMap(itemArgs, $(this));
	});
}

//Handles the click event on the arrow (in addition the Primo built in handlers).
function handleLocationIconClick() {
	if ($(this).parents(".EXLLocationsTitle").find(".wheelLoadedAlready").length)
		return;

	var loadingWheel = '<input type="hidden" class="wheelLoadedAlready"><img src="../uploaded_files/HVD/loading.gif" class="HVD_LoadingWheel">';
	$(this).parents(".EXLLocationsTitle").append(loadingWheel);
}

//If the Location note is too long, make it a link "more..."
function shortenLocationNotes() {
		$(".EXLLocationsMoreInfo > strong").each(function() {
			if ($(this).text().trim().length > 100 && $(this).children("a").length == 0) {
				var part1 = $(this).text().trim().substr(0, $(this).text().trim().substr(0, 130).lastIndexOf(" "));
				var recordId = $(this).parents("form[name='locationsTabForm']").children("input[name='recIds']").val();
				var url = "http://hollis.harvard.edu/availability.ashx?&skin=primo&itemid=|library/m/aleph|" + recordId.substr(("HVD_ALEPH").length);
				$(this).html(part1 + '<a href="' + url + '" target="_blank">...more</a>');
			}
		});
	}
	// 20140911 CB added test for temporary Countway serials workaround due to AVA bug; backfiles don't display

function createCountwaySerialsNote() {
	$(".EXLLocationInfo > strong").each(function() {
		if ($(this).text() == 'Russell Reading Room') {
			var callno = $(this).siblings("cite").text();
			var recordId = $(this).parents("form[name='locationsTabForm']").children("input[name='recIds']").val();
			var url = "http://hollis.harvard.edu/availability.ashx?&skin=primo&itemid=|library/m/aleph|" + recordId.substr(("HVD_ALEPH").length);
			if (callno.indexOf("Serial") >= 0) {
				$(this).append('<br /><a href="' + url + '" target="_blank">Check for older vols.</a>');
			}
		}
	});
}

function collectItemArgs(element) {
	var itemArgs = {};

	//For each ITEM, collect data from the Elements on page
	itemArgs["admDocNumer"] = getAdmDocNumber(element.find(".EXLLocationItemId").val());
	itemArgs["itemSequence"] = getItemSequence(element.find(".EXLLocationItemId").val());
	itemArgs["subLibraryCode"] = element.find(".EXLLocationMainLocationCode").val();
	itemArgs["itemProcessStatus"] = returnItemProcessStatus(element.find(".EXLLocationProcessingStatus").val());
	itemArgs["itemStatus"] = element.find(".EXLLocationItemCategoryCode").val();
	itemArgs["loanStatus"] = returnLoanStatus(element.find(".EXLLocationItemLoanStatus").val());
	itemArgs["onHoldStatus"] = returnOnHoldStatus(element.find(".EXLLocationItemLoanStatus").val());

	//Addition parameters needed for Map It
	itemArgs["barcode"] = element.find(".EXLLocationItemBarcode").val();
	itemArgs["callNumber"] = element.find(".EXLLocationCallNumber").val();
	itemArgs["collectionCode"] = element.find(".EXLLocationSecondaryLocationCode").val();

	return itemArgs;
}

//Translation Functions here
//---------------------------------------
//Parse Id's from a combined ID/Sequence
function getAdmDocNumber(itemId) {
	if (itemId != undefined)
		return itemId.substr(5, 9);
	else return "";
}

//Parse sequence from a combined ID/Sequence
function getItemSequence(itemId) {
	if (itemId != undefined)
		return itemId.substr(14, 6);
	else return "";
}

//Item Process Status can either have values, or default NULL
function returnItemProcessStatus(value) {
	if (value == "")
		return "NULL";
	else
		return value;
}

//Loan Status can have NULL or A
function returnLoanStatus(value) {
	if (value.toLowerCase().indexOf("checked") == 0)
		return "A";
	else if ((value.toLowerCase().indexOf("not checked out") > -1) || (value.toLowerCase().indexOf("requested") == 0))
		return "NULL";
	else
		return "A";
}

//On Hold status can be Y or N
function returnOnHoldStatus(value) {
	if (value.toLowerCase().indexOf("on hold") > -1)
		return "Y";
	else
		return "N";
}



//Phased out?
//Changing incase Multi-Location - to land back on Request tab. Not working good right now.
function cleanUrl(url) {
		var urlParams = parseUrl(decodeURIComponent(url));
		var newUrl = decodeURIComponent(url).substr(0, decodeURIComponent(url).indexOf("expand.do?") + 10);
		newUrl = newUrl + "&tab=" + urlParams["tab"];
		newUrl = newUrl + "&mode=" + urlParams["mode"];
		newUrl = newUrl + "&gathStatTab=" + urlParams["gathStatTab"];
		newUrl = newUrl + "&vl(freeText0)=" + urlParams["vl(freeText0)"];
		newUrl = newUrl + "&vid=" + urlParams["vid"];
		newUrl = newUrl + "&recIds=" + urlParams["recIds"];
		newUrl = newUrl + "&tabs=requestTab";
		return newUrl;
	}
	//Part of the above scenario - clonky

function parseUrl(url) {
	var urlParams;
	var match,
		pl = /\+/g, // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function(s) {
			return decodeURIComponent(s.replace(pl, " "));
		},
		query = url.substring(1);

	urlParams = {};
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
	return urlParams;
}



//Ajax Events for locations tabs 
$(document).ajaxComplete(function(event, request, settings) {
	if ((RegExp("tabs=locationsTab").test(settings.url))) {
		locationsTabModifications();
	}
});

//If location tabs are open directly on Full Details view
$(document).ready(function() {
	if ((RegExp("tabs=locationsTab").test(window.location.href))) {
		locationsTabModifications();
	}
});