//Written by Alon Botvinik
//Location tab related functions.
//Processing starts here (after page load, or Ajax, see bottom of file)
function locationsTabModifications() {
	//Create a global variable for the XML, no need to read it million of times
	xmlDoc = loadXML("../uploaded_files/HVD/requestLinkLogic.xml");

	//Each DIV has it's own variables and listener, so no conflict should happen.
	$(".EXLSublocation").each(function() {
		//Modify all the Items in this single Holding record
		modifyItems();

		//Modify the Holding note action link, semicolon fix
		modifyHoldingLinks($(this));

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
	libInfoLink();

	//Add note to Show More items that it is loading; this will disappear when items load b/c Primo already hides that row after items load
	/*$(".EXLLocationViewAllLink").click(function() {
		$(this).append('&nbsp;Loading...');
	});		*/

	//Alon B: Adding BorrowDirect at the bottom of Locations tab
	borrowDirect();	

	//Alon B: Adding Expand All feature
	addExpandAll();
}

//Handles when the EXLSublocation is updated, with condition when it contains the EXLLocationTableActions in it
//Place functions here needed per Holding when expended (Request Options, Notes, MapIt, etc...)
function handleDomChanges() {
	//Remove the listener before changing
	$(this).off();

	//Modify contents of Holding
	//20150107 CB added libInfoLink for library info links
	libInfoLink();	
	
	//Add note to Show More items that it is loading; this will disappear when items load b/c Primo already hides that row after items load
	/*$(".EXLLocationViewAllLink").click(function() {
		$(this).append('&nbsp;Loading...');
	});	*/

	//Modify all items in this Holding that was just changed in the DOM.
	if ($(this).find(".EXLLocationTableActions").length)
		modifyItems();
	
	//Change holding note action and semicolon:
	modifyHoldingLinks($(this));
	
	//Resume listening (if there are more items, RTA changes, Primo OTB changes
	$(this).on("DOMSubtreeModified propertychange", handleDomChanges);

	//Remove the Loading Wheel
	$(this).parents(".EXLLocationList").find(".HVD_LoadingWheel").remove();
}


//Full solution implementation, e.g. HVD_ALEPH008190450
//Uses functions inside requestOptions.js, mapIt.js to modify request options and enable other features
function modifyItems() {
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

//Fixing the links, including the "More holdings information" link
//Adding another function for the onclick and the onKeyUp attributes
function modifyHoldingLinks(element) {
	//Workaround to fix the semicolon issue with the notes/links
        $(element).find(".EXLLocationsTabSummaryHoldingsContentLine a, .EXLLocationsTabSummaryHoldingsContentLine span").each(function () {
	        content = $(this).text();
                if (RegExp(/((;)(http|https)(:\/\/)(.*))|((http|https)(:\/\/)(.*)(;))/).test(content)) {
                        $(this).parent().html(breakHyperlinksOnSemicolons(content));
                }
        });

	//Modify the "More holdings information" link
	$(element).find(".EXLLocationsTabSummaryHoldingsContentLineMoreLine a").each(function () {
		if ($(this).attr("onclick").indexOf("modifyHoldingInformationWhiteBox") > 0)
			return;

		$(this).attr("onclick","addLightBoxDivsNoLoading(event, this); modifyHoldingInformationWhiteBox();");
		$(this).attr("onkeyup","addLightBoxDivsNoLoading(event, this); modifyHoldingInformationWhiteBox();");
	});
}


//Once the holding note has been popped out - it will be modified CSS wise only.
//Modifying the links and applying workaround....
function modifyHoldingInformationWhiteBox() {
	//Check if whitebox has been popped
	if ($("#exliWhiteContent").css("display") != 'none') {
		
		//Update the notes
		$("#exliWhiteContent .EXLLocationsTabSummaryHoldingsMoreLightBoxContainerValue").each(function() {
			var content = $(this).attr("title");
			if (RegExp(/((;)(http|https)(:\/\/)(.*))|((http|https)(:\/\/)(.*)(;))/).test(content)){
				$(this).html(breakHyperlinksOnSemicolons(content));
				
			}
		});
		
		//Reposition the box to be fixed postion...
		$("#exliWhiteContent").css({
			"position":"fixed", 
			"top":"20%"
		});	
		$("table.EXLLocationsTabSummaryHoldingsMoreLightBox").parent().css({
			"overflow-y": "auto",
			"overflow-x": "hidden",
			"max-height": "400px"
		});
	}
}

//Add Expand All feature to locations tab
function addExpandAll() {
	//Find all open Location Tabs
	$(".EXLLocationListContainer").each(function() {
		//If modified already, return
		if ($(this).find(".HVDExpandAll").length)
                        return;

		//If there is more than 1 location, add stuff
		if ($(this).find(".EXLLocationsIcon").length > 1) {
			//Add the link (style in the CSS)
			$(this).prepend("<div class='HVDExpandAll'>Expand All</div>");
		
			//Add click event
			$(this).find(".HVDExpandAll").on("click", function() {
				$(this).parent().find(".EXLLocationsIcon").each(function() {   
					$(this).click(); 
					
				});

				//Change the link accordingly
				if ($(this).text() == 'Expand All')
					$(this).text("Collapse All");	
				else 
					$(this).text("Expand All");
			});
		}
	});
}

//Takes a text with URL inside of, builds a cleaner version with semicolons as delimeters
function breakHyperlinksOnSemicolons(urlText) {
        var regexSearch = "(http|https)(:\/\/)([^;]*)";
        var url = RegExp(regexSearch).exec(urlText)[0];
        var prefix = urlText.substr(0, urlText.search(regexSearch));
        var suffix = urlText.substr(prefix.length + url.length + 1);

        var fixedHtml = prefix + ' <a target="_blank" href="' + url + '">' + url + '</a>; ' + suffix;

        return fixedHtml;
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



