// display patron notes if item status is on order or ordered received
function displayPatronNotesHoldRequest() {	
	if ($("td:contains('Item status: On order')").length || $("td:contains('Item status: Ordered--received')").length) {
		$("label[for^='exlidRequestTabFormInputComment']").show()
		$("input[id^='exlidRequestTabFormInputComment']").show()
		//console.log("on order");
		// make input type date for 2nd comment, must go to Aleph as YYYY-MM-DD for Cognos reporting purposes 
		//$("input[id='exlidRequestTabFormInputComment2']").prop("type","date");   not supported
		$("input[id='exlidRequestTabFormInputComment2']").prop("pattern","^\\d\\d\\d\\d-\\d\\d-\\d\\d");   
		$("input[id='exlidRequestTabFormInputComment2']").prop("title","Please enter date in YYYY-MM-DD format, e.g. 2016-02-20");   
	} else {
		//console.log("NOT on order");
		return;
	}
}

//Ajax finishes - Opening the Request tab
$(document).ajaxComplete(function(event, request, settings) {
	if ((RegExp("tabs=requestTab").test(settings.url))) {
		doRequestTab();
	}
});

function doRequestTab() {

	//display patron notes
	displayPatronNotesHoldRequest();
}
