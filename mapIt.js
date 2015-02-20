function stacksMap(itemArgs, element) {
	var proceedWithMapIt = false;

	if (itemArgs["subLibraryCode"] == 'WID')
		if (['WIDLC', 'GEN'].indexOf(itemArgs["collectionCode"]) > -1)
			proceedWithMapIt = true;

	if (itemArgs["subLibraryCode"] == 'LAW')
		if (['ISLAR', 'GEN'].indexOf(itemArgs["collectionCode"]) > -1)
			proceedWithMapIt = true;

	if (itemArgs["subLibraryCode"] == 'LAM')
		if (['GEN', 'GEN', 'REF', 'MRSV', 'MRSAU', 'MRSCD', 'MRSDV'].indexOf(itemArgs["collectionCode"]) > -1)
			proceedWithMapIt = true;

	if (proceedWithMapIt) {

		var lawApiUrl = 'http://mapit.library.harvard.edu/map-it/api/locate/';

		$.ajax({
			url: lawApiUrl + itemArgs["subLibraryCode"] + '/' + itemArgs["collectionCode"] + '/' + itemArgs["callNumber"] + '/' + itemArgs["barcode"],
			dataType: 'jsonp',
			success: function(data) {
				spanid = 'stacksmapurl' + itemArgs["barcode"];
				floor = data[0]['floor'];
				range = data[0]['range'];
				floordisplay = floor.replace("E", " East");
				floordisplay = floordisplay.replace("W", " West");
				var htmlCode = '<br><strong>Map It:</strong> <a target="_blank" href="' + data[0].maplink + '">' + 'Floor ' + floordisplay + ' Row ' + range + '</a>';

				if (element.parents("table.EXLLocationTable").find(".EXLLocationTableColumn1").html().indexOf("<br>") == -1)
					element.parents("table.EXLLocationTable").find(".EXLLocationTableColumn1").append(htmlCode);
			},
			error: function(data, error, thrown) {
				logJS("error: " + itemArgs["barcode"] + " " + thrown);
			}
		});
	}
};
