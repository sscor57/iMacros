var controlFlow = function() {
    try {
        var bb9_courseID = null;
        var userName = null;
		var userCourse = new Array;
		var progressMessage = "";
		var errorMessage = "";
        
        userCourse = goToCourseID(bb9_courseID,userName);
        pauseMacro();
        unenrollInCourseID(userCourse[0],userCourse[1]);
    } catch(err) {
	    errorMessage += "\tcontrolFlow() says: "+err.message+"\n";
    }
}

// navigates via the course search feature to the specified course id
var goToCourseID = function(bb9_courseID,userName,progressMessage,errorMessage) {
    try {
		var macroCode = "";
		var e = "";
		var extract = "";
        var searchPattern = "";
		
		if (bb9_courseID === null) {
		    bb9_courseID = prompt("Enter the Destination Course ID:",bb9_courseID);
		}
        
        macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT="+bb9_courseID+"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
        e = iimPlay("CODE:" + macroCode);
		
		if (userName === null) {
		    userName = prompt("Enter your username",userName);
		}
        
        enrollInCourseID(userName,"C");
    
        macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
    
        searchPattern = RegExp(bb9_courseID+"</a>");
    
        if (extract.search(searchPattern) != -1) {
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+bb9_courseID+"\n";
            e = iimPlay("CODE:" + macroCode);
        }
		progressMessage += "Found course ID: "+bb9_courseID+".\n";
		return [bb9_courseID,userName]
	} catch (err) {
	    errorMessage += "\tgoToTemplate() says: "+err.message+"\n";
    	alert(errorMessage);
	}
}

var enrollInCourseID = function(userName,role,progressMessage,errorMessage) {
	try {
		var macroCode = "";
		var e = "";
		var extract = "";
		var contextualMenuIdNumber = "";
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		if (extract.match(/cmlink_(\w{32})/) != null && extract.search(userName) === -1) {
			contextualMenuIdNumber = extract.match(/cmlink_(\w{32})/)[1];
		
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+contextualMenuIdNumber+"\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:admin_course_list_users\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Enroll<SP>Users\n";
			macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:myForm ATTR=ID:userName CONTENT="+userName+"\n";
			macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:myForm ATTR=ID:courseRoleId CONTENT=%"+role+"\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:myForm ATTR=NAME:top_Submit&&VALUE:Submit\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
			e = iimPlay("CODE:" + macroCode);			
			
			progressMessage += "Enrolled "+userName+" in:\t";
			return true
		} else if (extract.search(userName) != -1) {
			progressMessage += userName+" is already enrolled in:\t";
			return true
		} else {
	    errorMessage += "\tenrollInCourseID() says: "+err.message+"\n";
			return false
		}
	} catch(err) {
		alert(err.message);
	}
}

var unenrollInCourseID = function(bb9_courseID,userName,progressMessage,errorMessage) {
	try {
		var macroCode = "";
		var e = "";
		var extract = "";
		var contextualMenuIdNumber = "";
		var tbody = "";
		var rowsToScan = new Array;
		var i = 0;
		
        macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT="+bb9_courseID+"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
        e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		tbody = iimGetLastExtract();
		
		contextualMenuIdNumber = tbody.match(/cmlink_(\w{32})/)[1];
		
		macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+contextualMenuIdNumber+"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:admin_course_list_users\n";
        e = iimPlay("CODE:" + macroCode);
        
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
        
        rowsToScan = extract.match(/<tr .+?<\/tr>/g);
        
        for (i=0;i<rowsToScan.length;i++) {
            if (rowsToScan[i].search(userName) != -1) {
                contextualMenuIdNumber = rowsToScan[i].match(/cmlink_(\w{32})/)[1];
                
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+contextualMenuIdNumber+"\n";
                macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:deleteItem_"+contextualMenuIdNumber+"\n";
                e = iimPlay("CODE:" + macroCode);
                
                progressMessage += "Un-enrolled from:\t"+bb9_courseID+".\n";
            }
        }
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
		e = iimPlay("CODE:" + macroCode);
	} catch(err) {
	    errorMessage += "\tunenrollInCourseID() says: "+err.message+"\n";
	}
}

var pauseMacro = function(progressMessage,errorMessage) {
    try {
		var macroCode = "";
		var e = "";	
		
		macroCode = "PAUSE\n";
		e = iimPlay("CODE:" + macroCode);
		progressMessage += "Paused\n";
    } catch(err) {
	    errorMessage += "\tpauseMacro() says: "+err.message+"\n";
	}
}

controlFlow()