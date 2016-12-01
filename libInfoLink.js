//Will ba called from Locations Tab JS file
//Added 20150106 CB

//Add library info link and icon for each library in locations tab

function libInfoLink() {	
	$(".EXLLocationsTitleContainer").each(function() {
		if ($(this).find(".hvdLibInfo").length)
			return;
		
		if ($(this).text().trim().length > 1) {
			var baseUrl = "http://library.harvard.edu/" ;
			var libraryHash = {
				"Afro-American Studies": "AFR",
				"Andover-Harv. Theol": "DIV",
				"Baker Business": "BAK",
				"Biblioteca Berenson": "BER",
				"Birkhoff Math": "BIR",
				"Blue Hill": "MCK",
				"Botany Ames Orchid": "BOT",
				"Botany Arboretum": "AJP",
				"Botany Arnold (Cambr.)": "BOT",
				"Botany Econ. Botany": "BOT",
				"Botany Farlow Library": "BOT",
				"Botany Gray Herbarium": "BOT",
				"Botany Gray/Arnold": "BOT",
				"Cabot Science": "CAB",
				"Carpenter Center": "ART", 
				"Chemistry": "CHE",
				"Child Memorial": "CHI",
				"Countway Medicine": "MED",
				"CRL (Ctr for Research Libs)": "CRL",
				"Ctr Hellen Studies": "HEL",
				"Derek Bok Center": "DAN",
				"Development Office": "DEV",
				"Documents (Lamont)": "DOC",
				"Dumbarton Oaks": "DDO",
				"Dumbarton Oaks ICFA": "DDO",
				"Environmental Information Ctr": "ENV",
				"Fine Arts": "FAL",
				"Fung Library": "FUN",
				"Gibb Islamic": "GIB",
				"Grossman": "GRO",
				"Gutman Education": "GUT",
				"Harvard Art Museums": "ART",
				"Harvard Film Archive": "HFA",
				"Harvard Forest": "FOR",
				"Harvard Kennedy School": "KSG",
				"Harvard Planning & Real Estate": "HPO",
				"Harvard University Archives": "HUA",
				"Harvard-Yenching": "HYL",
				"History Dept": "HIS",
				"History of Science": "HSL",
				"Houghton": "HOU",
				"Kirkland House": "KIR",
				"Lamont": "LAM",
				"Law School": "LAW",
				"Linguistics": "LIN",
				"Loeb Design": "DES",
				"Loeb Music": "MUS",
				"Map Coll (Pusey)": "MAP",
				"Master Microforms": "MMF",
				"McKay Applied Sci": "MCK",
				"Medieval Studies Lib": "PAL",
				"Microforms (Lamont)": "DOC",
				"Murray Research Ctr": "GDC",  
				"Museum Comp Zoology": "MCZ",
				"National master micro": "NMM",
				"Near Eastern Lib": "NEL",
				"Networked Resource": "NET",
				"Ophthalmology": "EYE",  
				"Peabody Museum": "PEA",
				"Physics Research": "PHY",
				"Poetry Room (Lamont)": "POE",
				"Robbins Philosophy": "PHI",
				"Robinson Celtic": "CEL",
				"Rubel (Fine Arts)": "FAL",
				"Sanskrit Library": "SAN",
				"Schlesinger": "SCH",
				"Sci & Intl Affairs": "SIA",
				"Sci Instruments": "HSI",
				"Smyth Classical": "SMY",
				"Statistics": "STA",
				"Straus Conservation": "ART", 
				"Theatre Collection": "THE",
				"Tozzer": "TOZ",
				"Ukrainian Res Inst": "URI",
				"Warren Anatomical": "MED",
				"Weissman Preservation Ctr": "WEI",
				"Widener": "WID",
				"Wolbach Library": "WOL"
			};
			var libName = $(this).text().trim();
			var libCode = libraryHash[libName];
			$(this).append(' <span class="hvdLibInfo"><a href="' + baseUrl + libCode + '" target="_blank"><img title="Library Information"  alt="Library Information" src="../uploaded_files/HVD/libInfoPage.png" /></a><span>');
		}
	});
}