var progressMessage = "";
var errorMessage = "";
var bb9_courseID = null;
var numberOfUnits = 0;
var numberOfProjects = 0;
var courseID = null;
var userName = null;

var editModeON = function() {
    var macroCode = "";
    var e = 0;
    var extract = "";
    
    try{
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=SPAN ATTR=ID:statusText EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		editMode = extract.match(/>([OFN]*)</)[1];
		
		if (editMode === "ON") {
		    return
		} else {
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=SPAN ATTR=ID:statusText\n";
            e = iimPlay("CODE:" + macroCode);
		}
    } catch(err) {
        alert(err + " detectEditMode is having problems.");
    }
}

var addAssignment = function(unitNum, assignmentInfo) {
    var macroCode = "";
    var activityCode = "";
    var assignmentNum = "";
    var title = "";
    var contentType = 0;
    var xID = "";
    var fileName = "";
    var linkTitle= "";
    var artifact= "";

    try {
        contentType = assignmentInfo[0];
        xID = assignmentInfo[1];
        fileName = assignmentInfo[2];
        linkTitle = assignmentInfo[3];
        artifact = "<div class=\"capellaDrawer\">" + assignmentInfo[4] + "</div>";
        
        activityCode = fileName.match(/u\d{2}a\d{1,2}/)[0];
        assignmentNum = activityCode.match(/u\d{2}a(\d{1,2})/)[1];
        title = "[" + activityCode + "] Unit " + unitNum + " Assignment " + assignmentNum;

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";       
        macroCode += "TAG POS=2 TYPE=SPAN ATTR=CLASS:chevron&&TXT:\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Assignment\n";
        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageAssignmentForm ATTR=ID:content_name CONTENT=" + addIIMSpaces(title) + "\n";
        macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:manageAssignmentForm ATTR=ID:content_desc_text CONTENT=" + addIIMSpaces(artifact) + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageAssignmentForm ATTR=ID:possible CONTENT=100\n";
        macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:manageAssignmentForm ATTR=ID:isTracked CONTENT=YES\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manageAssignmentForm ATTR=ID:attemptTypeNum\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manageAssignmentForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        e = iimPlay("CODE:" + macroCode);

        progressMessage += title + ": Added.";
    } catch(err) {
        errorMessage += err.message + "\n";
        if (errorMessage != "Errors occured:\n") {
            alert(err.message);
        }
    }
}
    
var addDiscussion = function(unitNum, discussionInfo) {
    var macroCode = "";
    var e = 1;
    var l = 0;
    var activityCode = "";
    var discussionNum = "";
    var title = "";
    var contentType = 0;
    var xID = "";
    var fileName = "";
    var linkTitle= "";
    var artifact= "";
    var discIDs = [];
    var discID = "";

    try {
        contentType = discussionInfo[0];
        xID = discussionInfo[1];
        fileName = discussionInfo[2];
        linkTitle = discussionInfo[3];
        artifact = "<div class=\"capellaDrawer\">" + discussionInfo[4] + "</div>";
        
        activityCode = fileName.match(/u\d{2}d\d{1,2}/)[0];
        discussionNum = activityCode.match(/u\d{2}d(\d{1,2})/)[1];
        title = "[" + activityCode + "] Unit " + unitNum + " Discussion " + discussionNum

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Tools\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>New<SP>Forum\n";
        e = iimPlay("CODE:" + macroCode);

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:forumForm ATTR=ID:title CONTENT=" + addIIMSpaces(title) + "\n";
        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
        macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:forumForm ATTR=ID:descriptiontext CONTENT=" + addIIMSpaces(artifact) + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:forumForm ATTR=ID:isAllowAuthorRemove CONTENT=YES\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:isRemoveAllmsgs_false\n";
        macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:forumForm ATTR=ID:isAllowAuthorModify CONTENT=YES\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:allow1\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:include1\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:gradeForum\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:forumForm ATTR=ID:possiblePoints CONTENT=100\n";
        macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:forumForm ATTR=ID:counterEnableActivityCounterData CONTENT=NO\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:forumForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        e = iimPlay("CODE:" + macroCode);

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
        macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" +artifact + "</div>") + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        e = iimPlay("CODE:" + macroCode);
        
        progressMessage += title + ": Added.";
    } catch(err) {
        errorMessage += "Errors occured:\n";
        errorMessage += err + "\n";
        alert(errorMessage);
    }
}

var unitOperations = function(unitNum, contentInfo) {
    var j = 0;
    var unitInfo = [];
    var assignments = [];
    var discussions = [];
    
    var getTitleNumber = function(celesteFileName) {
        num = celesteFileName.match(/u(\d{2})|unit(\d{2})/)[1];
        if (num < 10) {
            num++;
            num--;
        }
        return num
    }
    
    var assembleUnitInfo = function(unitNum, contentInfo) {
        var titleNumber = "";
        var unitInfo = [];
        
        for (j = 0; j < contentInfo.length; j++) {
            titleNumber = getTitleNumber(contentInfo[j][2]);
            titleNumber++;
            titleNumber--;
            if (unitNum == titleNumber) {
                unitInfo.push(contentInfo[j]);
            }
        }
        return unitInfo
    }
    
    var artifactByContentType = function(contentType, unitInfo) {
        var artifactList = [];
        for (j = 0; j < unitInfo.length; j++) {
            if (unitInfo[j][0] == contentType) {
                artifactList.push(unitInfo[j]);
            }
        }
        return artifactList
    }
    
    try {
        unitInfo = assembleUnitInfo(unitNum, contentInfo);
        assignments = artifactByContentType(5, unitInfo);
        discussions = artifactByContentType(6, unitInfo);
        
        for (j = 0; j < assignments.length; j++) {
            addAssignment(unitNum, assignments[j]);
        }
        
        for (j = 0; j < discussions.length; j++) {
            addDiscussion(unitNum, discussions[j]);
        }
    } catch(err) {
        errorMessage += err.message + "\n";
        if (errorMessage != "Errors occured:\n") {
            alert(err.message);
        }
    }
}

var xIDs = function() {
    var macroCode = "";
    var e = 0;
    var artifactInfo = new Array;
    var contentInfo = new Array;
    var extract = "";
    var rowsToScan = new Array;
    var i = 0;
	var contentType = 0; // 0 = print artifact, 1 = unitX_introduction.html, 2 = unitX_objectives.html, 3 = accordion, 4 = study, 5 = assignment, 6 = discussion
	var xID = "";
	var fileName = "";
	var linkTitle = "";
	var artifact = "";
    
    try {
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:discoverObjectTypePicker CONTENT=%html\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Go\n";
        macroCode += "TAB T=1\n";
        macroCode += "TAB T=2\n";
        macroCode += "FRAME F=0\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:catForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
        macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
        macroCode += "TAB T=1\n";
        macroCode += "TAB T=2\n";
        macroCode += "TAB CLOSE\n";
		e = iimPlay("CODE:" + macroCode);
		if (e != 1) {
		    throw e;
		}
		
		extract = iimGetLastExtract();
		rowsToScan = extract.match(/<tr .+?<\/tr>/g);
		
		for (i = 0; i < rowsToScan.length; i++) {
		    xID = rowsToScan[i].match(/xythos_id=(\d*)_1/)[1];
		    /* remove this comment to include studies
		    if (rowsToScan[i].search(/u\d{2}s\d{1,2}\.html/) != -1) {
				contentType = 4;
				fileName = rowsToScan[i].match(/u\d{2}s\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"http://cbsa.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    */
		    if (rowsToScan[i].search(/u\d{2}a\d{1,2}\.html/) != -1) {
				contentType = 5;
				fileName = rowsToScan[i].match(/u\d{2}a\d{1,2}\.html/)[0];
				linkTitle = "View Assignment Instructions";
				artifact = "<a target=\"_blank\" href=\"http://cbsa.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    
		    if (rowsToScan[i].search(/u\d{2}d\d{1,2}\.html/) != -1) {
				contentType = 6;
				fileName = rowsToScan[i].match(/u\d{2}d\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"http://cbsa.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		}
		
		progressMessage += "";
		return contentInfo
	} catch (err) {
		alert(err);
	}
}
    
var currentUnit = function() {
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";        
    macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:pageTitleDiv EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);            
    extract = iimGetLastExtract();
    if (e != 1) {
        throw e;
    }
    
    folderTitle = extract.match(/Getting Started|Course Project(?: \d)*?|Unit \d{1,2}/);
    return folderTitle
}

var cycleThroughUnits = function() {
    var i = 0;
    var xidList = [];
    var lnavUnitName = "";
    var macroCode = "";
    var e = 0;
	var contentInfo = xIDs();

	try {
		i = 1;
		while (i <= numberOfUnits) {
			lnavUnitName = addIIMSpaces("Unit " + i);
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:" + lnavUnitName + "\n";
			e = iimPlay("CODE:" + macroCode);
			unitOperations(i, contentInfo);
			i++;
		}
		
		progressMessage += "";
	} catch (err) {
		errorMessage += err.message + "\n";
		if (errorMessage != "Errors occured:\n") {
			alert(err.message);
		}
	}
}

var templateInfo = function() {
    var macroCode = "";
    var e = 0;
    var extract = "";
    var lnavItems = [];
    var units = [];
    var projects = [];

	try {
	    editModeON();
	    
	    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.customization_groupExpanderLink\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Properties\n";
		e = iimPlay("CODE:" + macroCode);
	
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=INPUT ATTR=ID:coursename EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
	
		courseName = extract.match(/value="(.+?)"/)[1];
		courseID = extract.match(/_(.+?)_/)[1];
		bb9_courseID = courseName;
	
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
	
		macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Teaching<SP>Style\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ACTION:manageCourseDesign?cmd=save&course_id=_*_1 ATTR=ID:textOnlyView\n";
        macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ACTION:manageCourseDesign?cmd=save&course_id=_*_1 ATTR=ID:applyAllContentAreas CONTENT=YES\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:manageCourseDesign?cmd=save&course_id=_*_1 ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
		e = iimPlay("CODE:" + macroCode);
		
		lnavItems = extract.match(/<li.+?<\/li>/g);
	
		for (i = 0; i < lnavItems.length; i++) {
			if (lnavItems[i].search(/Unit \d{1,2}/) != -1) {
				units.push(lnavItems[i].match(/Unit \d{1,2}/));
			}
		}
	
		numberOfUnits = units.length;
	
		for (i = 0; i < lnavItems.length; i++) {
			if (lnavItems[i].search(/Course Project/) != -1) {
				projects.push(lnavItems[i].match(/Course Project/));
			}
		}
	
		numberOfProjects = projects.length;
		
		progressMessage += "";
	} catch (err) {
		errorMessage += err.message + "\n";
		if (errorMessage != "Errors occured:\n") {
			alert(err.message);
		}
	}
}

// navigates via the course search feature to the specified course id
var goToCourseID = function(bb9_courseID, userName) {
    var macroCode = "";
    var e = "";
    var extract = "";
    var searchPattern = "";

    try {		
		if (bb9_courseID === null) {
		    bb9_courseID = prompt("Enter the Destination Course ID:", bb9_courseID);
		}
        
        macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT=" + bb9_courseID + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
        e = iimPlay("CODE:" + macroCode);
		
		if (userName === null) {
		    userName = prompt("Enter your username", "cswope");
		}
        
        enrollInCourseID(userName, "C");
    
        macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
    
        searchPattern = RegExp(bb9_courseID + "</a>");
    
        if (extract.search(searchPattern) != -1) {
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:" + bb9_courseID + "\n";
            e = iimPlay("CODE:" + macroCode);
        }
		
		progressMessage += "";
	} catch (err) {
		errorMessage += err.message + "\n";
		if (errorMessage != "Errors occured:\n") {
			alert(err.message);
		}
	}
}

var enrollInCourseID = function(userName, role) {
    var macroCode = "";
    var e = "";
    var extract = "";
    var contextualMenuIdNumber = "";

	try {
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		if (extract.match(/cmlink_(\w{32})/) != null && extract.search(userName) === -1) {
			contextualMenuIdNumber = extract.match(/cmlink_(\w{32})/)[1];
		
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:admin_course_list_users\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Enroll<SP>Users\n";
			macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:myForm ATTR=ID:userName CONTENT=" + userName + "\n";
			macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:myForm ATTR=ID:courseRoleId CONTENT=%" + role + "\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:myForm ATTR=NAME:top_Submit&&VALUE:Submit\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
			e = iimPlay("CODE:" + macroCode);			
			
			progressMessage += "Enrolled " + userName + " in:\t";
			return true
		} else if (extract.search(userName) != -1) {
			progressMessage += userName + " is already enrolled in:\t";
			return true
		} else {
			progressMessage += "Failed to enroll" + userName + ".";
			return false
		}
	} catch(err) {
		alert(err.message);
	}
}

var unenrollInCourseID = function(templateID) {
    var macroCode = "";
    var e = "";
    var extract = "";
    var contextualMenuIdNumber = "";
    var tbody = "";
    var rowsToScan = new Array;
    var i = 0;

	try {
        macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT=" + templateID + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
        e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		tbody = iimGetLastExtract();
		
		contextualMenuIdNumber = tbody.match(/cmlink_(\w{32})/)[1];
		
		macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:admin_course_list_users\n";
        e = iimPlay("CODE:" + macroCode);
        
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
        
        rowsToScan = extract.match(/<tr .+?<\/tr>/g);
        
        for (i = 0; i < rowsToScan.length; i++) {
            if (rowsToScan[i].search(userName) != -1) {
                contextualMenuIdNumber = rowsToScan[i].match(/cmlink_(\w{32})/)[1];
                
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:deleteItem_" + contextualMenuIdNumber + "\n";
                e = iimPlay("CODE:" + macroCode);
                
                progressMessage += "Un-enrolled from:\t" + templateID + ".\n";
            }
        }
		
		progressMessage += "";
	} catch (err) {
		errorMessage += err.message + "\n";
		if (errorMessage != "Errors occured:\n") {
			alert(err.message);
		}
	}
}

// replaces a space character (' ') in a string with an iMacros space entity ('<SP>')
var addIIMSpaces = function(anyStringWithSpaces) {
    var newString = "";
	newString = anyStringWithSpaces.replace(/ /g,"<SP>");
	return newString
}

// replaces iMacros space entity ('<SP>') in a string with a space character (' ')
var removeIIMSpaces = function(anyStringWithIIMSpaces) {
    var newString = "";
	newString = anyStringWithIIMSpaces.replace(/<SP>/g," ");
	return newString
}

templateInfo();
goToCourseID(bb9_courseID, userName);
cycleThroughUnits(); // edit unitOperations() to add/remove an operation
unenrollInCourseID(bb9_courseID)

macroCode = "TAB T=1\nFRAME F=2\n";
macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
macroCode += "TAG POS=1 TYPE=A ATTR=TXT:" + bb9_courseID + "\n"; // TEMPLATE_PS4105_00002
e = iimPlay("CODE:" + macroCode);
