// 20140919 TESt: CB added textCallNo, buildTextForm
/* function textCallNo () {
	$(".EXLLocationList > .EXLLocationInfo > cite ").each(function() {
		var callno = $(this).text();
		$(this).append('<br /><a onclick="buildTextForm();">T TEST</a>'+callno);
	});
}

function buildTextForm () {		
		window.alert("test1");	
}
 */
function textCallNo() {
	$(".EXLLocationInfo > cite ").each(function() {
		var callno = $(this).text();
		if ($(this).text().indexOf("(") >= 0 && $(this).children("a").length == 0) {
			$(this).append('<br /><a onclick="buildTextForm();"> test 5</a>' + callno);
		}
	});
}

function buildTextForm() {
	console.log("buildformtest");
	var callno = $(".EXLLocationInfo > cite").not("a").text();
	var coll = $(".EXLLocationInfo > strong").text();
	var lib = $(".EXLLocationsTitle > .EXLLocationsTitleContainer").text();
	lib = $.trim(lib);
	var title = $(".EXLLocationInfo").parents(".EXLResultTitle").text();
	console.log(title + ' ' + lib + ' ' + coll + ' ' + callno);
}