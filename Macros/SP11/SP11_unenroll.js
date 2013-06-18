var unenrollUserFromEverything = function(UID) {

    var sysAdmin = function() {
        var macroCode = "";
        var e = 0;
        var extract = "";
    
        try {
            macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
            macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:System<SP>Admin\n";
            e = iimPlay("CODE:" + macroCode);
            
            return
        } catch(err) {
            alert(err + ": sysAdmin is having problems.");
        }
    }
    
    var captureCMID = function(searchPattern, elementType, elementID) {
		var macroCode = "";
		var e = "";
		var extract = "";
		var TR_or_LI_regex = new RegExp;
		var rows_or_lis = [];
		var i = 0;
		var contextualMenuIdNumber = "";
		
    	try {
    		if (elementType === "TABLE" || elementType === "TBODY") {
    			TR_or_LI_regex = /<tr[\s\S]+?<\/tr>/g;
    		} else if (elementType === "UL") {
    			TR_or_LI_regex = /<li[\s\S]+?<\/li>/g;
    		} else {
    			throw "elementType is neither TABLE, TBODY or UL. I don't know what to do!";
    		}
    	
    		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=" + elementType + " ATTR=ID:" + elementID + " EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            rows_or_lis = extract.match(TR_or_LI_regex);
            
            for (i = 0; i < rows_or_lis.length; i++) {
            	if (rows_or_lis[i].search(searchPattern) != -1) {
            		contextualMenuIdNumber = rows_or_lis[i].match(/cmlink_(\w{32})/)[1];
            	}
            }
            
            return contextualMenuIdNumber
    	} catch(err) {
            alert(err + ":\n captureCMID is having problems.");
        }
    }

    var getEnrollments = function(userName) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var cmID = "";
        var i = 0;
        var enrollmentRows = [];
        var anchorWithCourseID = "";
        var courseID = "";
        var enrollments = [];
    
        try {
            sysAdmin();
            
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:nav_list_users\n";
            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:userManagerSearchForm ATTR=ID:userInfoSearchKeyString CONTENT=%UserName\n";
            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:userManagerSearchForm ATTR=ID:userInfoSearchOperatorString CONTENT=%Equals\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:userManagerSearchForm ATTR=ID:search_text CONTENT=" + userName + "\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:userManagerSearchForm ATTR=VALUE:Go\n";
            e = iimPlay("CODE:" + macroCode);
            
            cmID = captureCMID(userName, "TBODY", "listContainer_databody");
            
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";            
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmID + "\n";            
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:list_courses_by_user\n";
            e = iimPlay("CODE:" + macroCode);
            
            macroCode = "SET !TIMEOUT_STEP 1\n";
            macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";            
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:userEnrollmentForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
            iimPlay("CODE:" + macroCode);
            
            macroCode = "SET !TIMEOUT_STEP 1\n";
            macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            enrollmentRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
            
            for (i = 0; i < enrollmentRows.length; i++) {
                anchorWithCourseID = enrollmentRows[i].match(/<a[\s\S]+?<\/a>/)[0];
                courseID = anchorWithCourseID.match(/>(.+)</)[1];
                enrollments.push(courseID);
            }
            
            return enrollments
        } catch(err) {
            alert(err + ": getEnrollments is having problems.");
        }
    }

    var unenrollInCourseID = function(templateID) {
        var macroCode = "";
        var e = "";
        var extract = "";
        var contextualMenuIdNumber = "";
        var tbody = "";
        var rowsToScan = new Array;
        var searchPattern = new RegExp;
        var i = 0;

        try {
            sysAdmin();
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT=" + templateID + "\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
            e = iimPlay("CODE:" + macroCode);
        	
        	searchPattern = RegExp(">" + templateID + "<");
            contextualMenuIdNumber = captureCMID(searchPattern, "TBODY", "listContainer_databody");
        
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:admin_course_list_users\n";
            e = iimPlay("CODE:" + macroCode);
        
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_showAllButton\n";
			e = iimPlay("CODE:" + macroCode);
        
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            searchPattern = RegExp(">" + userName + " <"); // the space character between the username and the next tag is significant
        
            contextualMenuIdNumber = captureCMID(searchPattern, "TBODY", "listContainer_databody");
                
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
			macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:deleteItem_" + contextualMenuIdNumber + "\n";
			e = iimPlay("CODE:" + macroCode);
        
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
            e = iimPlay("CODE:" + macroCode);
            
            return
        } catch(err) {
            alert(err.message);
        }
    }
    
    var userName = UID;
    var enrollments = [];
    
    try {
         enrollments = getEnrollments(userName);
         
         for (i = 0; i < enrollments.length; i++) {
            unenrollInCourseID(enrollments[i]);
         }
         
         return
    } catch(err) {
        alert(err + ": unenrollUserFromEverything is having problems.");
    }
}

unenrollUserFromEverything(prompt("Username to unenroll."));
