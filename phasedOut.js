//Phased out?
//Changing incase Multi-Location - to land back on Request tab. Not working good right now.
function cleanUrl(url) {
                var urlParams = parseUrl(decodeURIComponent(url));
                var newUrl = decodeURIComponent(url).substr(0, decodeURIComponent(url).indexOf("expand.do?") + 10);
                newUrl = newUrl + "&tab=" + urlParams["tab"];
                newUrl = newUrl + "&mode=" + urlParams["mode"];
                newUrl = newUrl + "&gathStatTab=" + urlParams["gathStatTab"];
                newUrl = newUrl + "&vl(freeText0)=" + urlParams["vl(freeText0)"];
                newUrl = newUrl + "&vid=" + urlParams["vid"];
                newUrl = newUrl + "&recIds=" + urlParams["recIds"];
                newUrl = newUrl + "&tabs=requestTab";
                return newUrl;
        }
        //Part of the above scenario - clonky

function parseUrl(url) {
        var urlParams;
        var match,
                pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function(s) {
                        return decodeURIComponent(s.replace(pl, " "));
                },
                query = url.substring(1);

        urlParams = {};
        while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
}
