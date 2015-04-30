function buildHGLLinks() {
	$(".EXLDetailsContent li[id^='lds42']").each(function() {	
		$(this).find("span.EXLDetailsDisplayVal").each(function() {
			var title = $(this).text().substr(0, $(this).text().indexOf("$$"));
			var fgdcId = $(this).text().substr($(this).text().indexOf("$$") + 2);
			
			var newHtml = '<a href="' + window.location.host + '/HVD:HVD_FGDC' + fgdcId + '">' + title + '</a>';
			console.log(title);	
			$(this).html(newHtml);
		});

	});
}
