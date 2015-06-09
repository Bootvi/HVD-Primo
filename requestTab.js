// display patron notes if item status is on order or ordered received
function displayPatronNotesHoldRequest() {	
	if ($("td:contains('Item status: On order')").length) {
		$("label[for^='exlidRequestTabFormInputComment']").show()
		console.log("on order");
	} else {
		console.log("NOT on order");
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
