//Written by Alon Botvinik
//This JavaScript file is for all the XML logic and parsing.
//Get item arguments, and run them through the XML file.
function processRequestOptions(itemArgs) {
	logJS(itemArgs);
	var requestOptions = [];
	//Get all sublibraries in the XML to find which Sub library the item belongs to
	var subLibraries = xmlDoc.getElementsByTagName("sublibrary");

	//Bring the XML part of the sublibrary that matches:
	var subLibraryLogic = getSubLibrary(subLibraries, itemArgs["subLibraryCode"]);
	if (subLibraryLogic) {

		//Check each type of request against the XML nodes, and add options to the returned array	
		if (checkRequestOption(subLibraryLogic, "alephHoldRequest", itemArgs)) {
			requestOptions.push("hold");
		}
		if (checkRequestOption(subLibraryLogic, "scanDeliver", itemArgs)) {
			requestOptions.push("scandeliver");
		}
		if (checkRequestOption(subLibraryLogic, "aeonrequest", itemArgs)) {
			requestOptions.push("aeon");
		}

	}
	return requestOptions;
}

//Initial check to find the right Sub Library
function getSubLibrary(subLibraries, code) {
	var subLibraryLogic;

	for (var i = 0; i < subLibraries.length; i++) {
		if (subLibraries[i].getAttribute('id') == code) {
			subLibraryLogic = subLibraries[i];
		}
	}
	return subLibraryLogic;
}


//Check request options given a sublibrary Logic, which option to check (alephHoldRequest, alephHoldRequest and aeonrequest), and the record's itemStatus
function checkRequestOption(subLibraryLogic, requestOption, itemArgs) {
	var optionAvailable = false;

	//Build an array of requestOptions elements from the XML
	var requestOptionsArray = subLibraryLogic.getElementsByTagName(requestOption);

	//scan all scenarios of the request option for matching 
	for (var i = 0; i < requestOptionsArray.length; i++) {
		//Check the itemProcessStatus available for this requestOption
		var itemProcessStatuses = requestOptionsArray[i].getAttribute("itemProcessStatus").split(";");

		for (var j = 0; j < itemProcessStatuses.length; j++) {
			if (itemArgs["itemProcessStatus"] == itemProcessStatuses[j]) {
				//Call in to check item-status, loan-status and on-hold conditions in the <xserver> element
				var xServerElement = requestOptionsArray[i];
				optionAvailable = checkXServer(requestOptionsArray[i], itemArgs);
				if (optionAvailable)
					return true;
			}
		}
	}
}

//Check the item-status, loan-status and on-hold conditions in the <xserver> element
function checkXServer(requestOption, itemArgs) {
	//In case there is more than 1 <xserver> element:
	var xServerArray = requestOption.getElementsByTagName("xserver");

	//If a request option does not exist in the sublibrary, immediately return false;
	if (xServerArray.length == 0)
		return false;

	for (var i = 0; i < xServerArray.length; i++) {

		if (xServerArray[i].getAttribute("item-status")) {
			if ($.inArray("*", xServerArray[i].getAttribute("item-status").split(";")) == -1 && $.inArray(itemArgs["itemStatus"], xServerArray[i].getAttribute("item-status").split(";")) == -1) {
				return false;
			}
		}

		if (xServerArray[i].getAttribute("loan-status")) {
			if ($.inArray(itemArgs["loanStatus"], xServerArray[i].getAttribute("loan-status").split(";")) == -1) {
				return false;
			}
		}

		if (xServerArray[i].getAttribute("on-hold")) {
			if ($.inArray(itemArgs["onHoldStatus"], xServerArray[i].getAttribute("on-hold").split(";")) == -1) {
				return false;
			}
		}
		return true;

	}
}
