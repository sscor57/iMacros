var controlFlow = function() {
    try {
  	var errorMessage = "";
		var progressMessage = "";
        var bb9_courseID = null;
        var userName = null;
		
		userSearch(userName);
		
    } catch(err) {
	    errorMessage += "\ncontrolFlow() says: "+err.message+"\n";
    	alert(errorMessage);
	}
}

// replaces a space character (' ') in a string with an iMacros space entity ('<SP>')
var addIIMSpaces = function(anyStringWithSpaces) {
	newString = anyStringWithSpaces.replace(/ /g,"<SP>");
	return newString
}

// replaces iMacros space entity ('<SP>') in a string with a space character (' ')
var removeIIMSpaces = function(anyStringWithIIMSpaces) {
	newString = anyStringWithIIMSpaces.replace(/<SP>/g," ");
	return newString
}

// navigates the the user search tool
var userSearch = function(userName) {
	try {
		var macroCode = "";
		var e = "";	
		
		if (userName === null) {
			userName = prompt("Enter username","cswope");
		}
        
        macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Users\n";
        e = iimPlay("CODE:" + macroCode);
		
		editPagingSearchResults();
		
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:userManagerSearchForm ATTR=ID:userInfoSearchKeyString CONTENT=%UserName\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:userManagerSearchForm ATTR=ID:userInfoSearchOperatorString CONTENT=%Equals\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:userManagerSearchForm ATTR=ID:search_text CONTENT="+userName+"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:userManagerSearchForm ATTR=VALUE:Go\n";
        e = iimPlay("CODE:" + macroCode);
	} catch (err) {
	    errorMessage += "\nuserSearch() says: "+err.message+"\n";
    	alert(errorMessage);
	}
}

// navigates the the user search tool
var editPagingSearchResults = function() {
	try {
		var macroCode = "";
		var e = "";	
		
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:userManagerForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
        e = iimPlay("CODE:" + macroCode);
	} catch (err) {
	    errorMessage += "\nuserSearch() says: "+err.message+"\n";
    	alert(errorMessage);
	}
}

controlFlow();
