//Will ba called from Locations Tab JS file, uses Tab API PNX retrieval methods
//Written by Alon B.
function borrowDirect() {
	$("form[name='locationsTabForm']").each(function() {
		if ($(this).find(".borrowDirect").length)
			return;

		var recordId = $(this).find("input[name='recIds']").val();

		//Call Ajax to get PNX XML of the record
		var pnxRecord = loadPNX(recordId);

		var firstISBN = $(pnxRecord).find("isbn").eq(0).text();
		var recordTitle = $(pnxRecord).find("display > title").text();

		var borrowDirectHTML = '<div class="borrowDirect">';
		borrowDirectHTML += '<span class="borrowDirectHeader">Not available at Harvard ?</span>';

		borrowDirectHTML += '<span class="borrowDirectText">See <a href="http://nrs.harvard.edu/urn-3:hul.eother:GetIt" target="_blank">Get It</a> options, or search ';

		if (firstISBN.length > 0)
			borrowDirectHTML += '<a href="http://access.harvard.edu/access/servlet/access?__hulaccess_gateway=bdirect&__hulaccess_resource=&query=' + encodeURIComponent('isbn=' + firstISBN) + '" target="_blank">';
		else
			borrowDirectHTML += '<a href="http://access.harvard.edu/access/servlet/access?__hulaccess_gateway=bdirect&__hulaccess_resource=&query=' + encodeURIComponent(recordTitle) + '" target="_blank">';

		borrowDirectHTML += 'Borrow Direct</a> now.</span>';
		borrowDirectHTML += '</div>';

		$(this).find(".EXLLocationListContainer").append(borrowDirectHTML);

	});


}