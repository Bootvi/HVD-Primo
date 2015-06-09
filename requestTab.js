// display patron notes if item status is on order or ordered received

function displayPatronNotesHoldRequest() {
	/* jquery here */
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
