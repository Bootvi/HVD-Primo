//Written by Alon Botvinik
//Location tab related functions.
//Processing starts here (after page load, or Ajax, see bottom of file)
function locationsTabModifications() {
	//Create a global variable for the XML, no need to read it million of times
	xmlDoc = loadXML("../uploaded_files/HVD/requestLinkLogic.xml");

	//Each DIV has it's own variables and listener, so no conflict should happen.
	$(".EXLSublocation").each(function() {
		//Modify all the Items in this single Holding record
		modifyHoldItems();

		//Put a listener on the Sublibrary DIV which contains the Request options to catch when it is populated, or more items are added
		$(this).on("DOMSubtreeModified propertychange", handleDomChanges);

	});


	//If full display, let Locations tab extend like Details tab.
	if ((RegExp("display.do").test(window.location.href)) || (RegExp("dlDisplay.do").test(window.location.href)))
		$(".EXLLocationListContainer").css("height", "auto");

	//Add a spinning wheel for loading locations for any arrows that appear on the Locations tabs
	$(".EXLLocationsIcon").click(handleLocationIconClick);

	//If it is a single location, perform all changes immediately before attaching a listener
	//20150107 CB added libInfoLink for library info links
	shortenLocationNotes();
	createCountwaySerialsNote();
	libInfoLink();

	//20140919 TEST: CB added text call number 
	//textCallNo();

	//Alon B: Adding BorrowDirect at the bottom of Locations tab
	borrowDirect();	
}

//Handles when the EXLSublocation is updated, with condition when it contains the EXLLocationTableActions in it
//Place functions here needed per Holding when expended (Request Options, Notes, MapIt, etc...)
function handleDomChanges() {
	//Remove the listener before changing
	$(this).off();

	//Modify contents of Holding
	//20150107 CB added libInfoLink for library info links
	shortenLocationNotes();
	createCountwaySerialsNote();
	libInfoLink();	

	//20140919 TEST: CB added text call number 
	//textCallNo();
	
	//Modify all items in this Holding that was just changed in the DOM.
	if ($(this).find(".EXLLocationTableActions").length)
		modifyHoldItems();

	//Resume listening (if there are more items, RTA changes, Primo OTB changes
	$(this).on("DOMSubtreeModified propertychange", handleDomChanges);

	//Remove the Loading Wheel
	$(this).parents(".EXLLocationList").find(".HVD_LoadingWheel").remove();
}


//Full solution implementation, e.g. HVD_ALEPH008190450
//Uses functions inside requestOptions.js, mapIt.js to modify request options and enable other features
function modifyHoldItems() {
	$(".EXLLocationTableActions").each(function() {
		//Check if this Item was modified already
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

		//Hold Request available, will display the original link
		if (requestOptions.indexOf("hold") > -1)
			$(this).find("ul").append('<li>' + holdRequest + '</li>');
		
		//AEON request
		if (requestOptions.indexOf("aeon") > -1) {
			var url = "http://sfx.hul.harvard.edu/sfx_local?sid=HOLLIS:AEON&pid=DocNumber=" + itemArgs["admDocNumer"] + ",ItemSequence=" + itemArgs["itemSequence"] + "&sfx.skip_augmentation=1";
			$(this).find("ul").append('<li><a href="' + url + '" target="_blank">Request Item</a></li>');
		}
		//Scan & Deliver request
		if (requestOptions.indexOf("scandeliver") > -1) {
			var url = "http://sfx.hul.harvard.edu/sfx_local?sid=HOLLIS:ILL&pid=DocNumber=" + itemArgs["admDocNumer"] + ",ItemSequence=" + itemArgs["itemSequence"] + "&sfx.skip_augmentation=1";
			$(this).find("ul").append('<li><a href="' + url + '" target="_blank">Scan & Deliver</a></li>');
		}

		//MapIt feature - per item
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
			if ($(this).text().trim().length > 250 && $(this).children("a").length == 0) {
				var part1 = $(this).text().trim().substr(0, $(this).text().trim().substr(0, 130).lastIndexOf(" "));
				var recordId = $(this).parents("div.EXLSublocation").attr("id").substr(5, 9);
				var url = "http://lms01.harvard.edu/F?func=direct&local_base=HVD01&doc_number=" + recordId;
				$(this).html(part1 + '<a href="' + url + '" target="_blank">...more</a>');
			}
		});
	}

//Corinna B. added test for temporary Countway serials workaround due to AVA bug; backfiles don't display
function createCountwaySerialsNote() {
	$(".EXLLocationInfo > strong").each(function() {
		if ($(this).text() == 'Russell Reading Room') {
			var callno = $(this).siblings("cite").text();
			var recordId = $(this).parents("form[name='locationsTabForm']").children("input[name='recIds']").val();
			var url = "http://lms01.harvard.edu/F/?func=item-global&doc_library=HVD01&doc_number=" + recordId.substr(("HVD_ALEPH").length) + "&year=&volume=&sub_library=MED" ;
			if (callno.indexOf("Serial") >= 0) {
				$(this).append('<br /><a href="' + url + '" target="_blank">Check for older vols.</a>');
			}
		}
	});
}

function collectItemArgs(element) {
	var itemArgs = {};

	//For request options, collect data from the Item Elements on page
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
	if (value.toLowerCase().indexOf("long overdue") > -1)
		return "L";
	else if (value.toLowerCase().indexOf("claimed returned") > -1)
		return "C";
	else if (value.toLowerCase().indexOf("checked") == 0)
		return "A";
	else if ((value.toLowerCase().indexOf("not checked out") > -1) || (value.toLowerCase().indexOf("requested") == 0))
		return "NULL";
	
	return "A";
}

//On Hold status can be Y or N
function returnOnHoldStatus(value) {
	if (value.toLowerCase().indexOf("on hold") > -1)
		return "Y";
	else
		return "N";
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



