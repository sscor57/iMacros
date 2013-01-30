var userName = null;
var courseID = null;
var progressMessage = "";
var errorMessage = "";

// replaces a space character (' ') in a string with an iMacros space entity ('<SP>')
var addIIMSpaces = function(anyStringWithSpaces) {
	newString = anyStringWithSpaces.replace(/ /g,"<SP>");
	return newString
}

// navigates via the course search feature to the specified course id
var goToCourseID = function(courseID) {
    try {
		var macroCode = "";
		var e = "";
		var extract = "";
        var searchPattern = "";
		
		if (courseID === null) {
		    var courseID = prompt("Enter the Destination Course ID:","TEMPLATE_MHA5002_00010");
		}
        
        macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT="+courseID+"\n";
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
    
        searchPattern = RegExp(courseID+"</a>");
    
        if (extract.search(searchPattern) != -1) {
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+courseID+"\n";
            e = iimPlay("CODE:" + macroCode);
        }
		progressMessage += "Found course ID: "+courseID+".\n";
	} catch (err) {
	    errorMessage += "\tgoToTemplate() says: "+err.message+"\n";
    	alert(errorMessage);
	}
}

var goSafeAssign = function() {
    try {
		var macroCode = "";
		var e = "";

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.course.tools_groupExpanderLink\n";
        macroCode += "TAG POS=2 TYPE=A ATTR=TXT:SafeAssign\n";
        e = iimPlay("CODE:" + macroCode);
	} catch (e) {
	    errorMessage += err.message;
    	alert(errorMessage);
	}
}

var enrollInCourseID = function(userName,role) {
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
			progressMessage += "Failed to enroll"+userName+".";
			return false
		}
	} catch(err) {
		alert(err.message);
	}
}

var unenrollInCourseID = function(templateID) {
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
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT="+templateID+"\n";
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
                
                progressMessage += "Un-enrolled from:\t"+templateID+".\n";
            }
        }
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
		e = iimPlay("CODE:" + macroCode);
	} catch(err) {
		alert(err.message);
	}
}

var createDraftSafeAssignment = function(title) {
	try {
		var macroCode = "";
		var e = "";
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Assessments\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:SafeAssignment\n";
		e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:mainForm ATTR=ID:titleInput CONTENT="+addIIMSpaces(title)+"\n";
		macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:mainForm ATTR=NAME:text CONTENT="+addIIMSpaces("Use this link to submit drafts of discussions or assignments to check for text that matches sources, and to make sure you are citing your sources appropriately before turning in your final version to the instructor for grading.")+"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:mainForm ATTR=NAME:trackNumberOfViews CONTENT=YES\n";
		macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:mainForm ATTR=NAME:isDraft CONTENT=YES\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:mainForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
		e = iimPlay("CODE:" + macroCode);
	} catch(err) {
		alert(err.message);
	}
}

var createFinalSafeAssignment = function(title) {
	try {
		var macroCode = "";
		var e = "";
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Assessments\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:SafeAssignment\n";
		e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:mainForm ATTR=ID:titleInput CONTENT="+addIIMSpaces(title)+"\n";
		macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:mainForm ATTR=NAME:text CONTENT="+addIIMSpaces("Use this link to submit the FINAL version of your course project or final paper (the version you are submitting for grading in Assignments) to check for text that matches sources, and to make sure you are citing your sources appropriately. This link can only be used ONCE. Your submission will be saved to the Capella Database and reduce the risk of other learners using your work without giving you credit.")+"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:mainForm ATTR=NAME:trackNumberOfViews CONTENT=YES\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:mainForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
		e = iimPlay("CODE:" + macroCode);
	} catch(err) {
		alert(err.message);
	}
}

var courseList = function() {
	try {
		var courseIDsToGoTo = new Array;
		var i = 0;
		var courseIDs = new Array;
		var courseID = "";
		var macroCode = "";
		var e = "";
		var extract = "";
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		courseIDsToGoTo = extract.match(/<tr .+?<\/tr>/g);
		
		for (i=0;i<courseIDsToGoTo.length;i++) {
			if (courseIDsToGoTo[i].match(/>([(?:TESTSUB\d{4})|(?:\w{2,4}\d{4})]+?_\w+?_\w_\w+?_\w+?_\w+?)</) != null) {
				courseID = courseIDsToGoTo[i].match(/>([(?:TESTSUB\d{4})|(?:\w{2,4}\d{4})]+?_\w+?_\w_\w+?_\w+?_\w+?)</)[1];
				courseIDs.push(courseID);
				progressMessage += "Located section:\t"+courseID+"\n";
			}
		}
		return courseIDs
	} catch(err) {
		alert(err.message);
	}
}

var controlFlow = function(courseList) {
	try {
		var i = 0;	

		for (i=0;i<courseList.length;i++) {	
			goToCourseID(courseList[i]);
			goSafeAssign();
			unenrollInCourseID(courseList[i]);
		}
	} catch(err) {
		alert(err.message);
	}
}

controlFlow(courseList());
alert(progressMessage);