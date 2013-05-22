/*
Instructions: log into any SP11 instance of BB9, navigate to a course or template, launch the macro.
*/

var progressMessage = "";
var errorMessage = "";
var bb9_courseID = null;
var numberOfUnits = 0;
var numberOfProjects = 0;
var courseID = null;
var userName = null;
var celesteData = [];

// replaces a space character (' ') in a string with an iMacros space entity ('<SP>').
var addIIMSpaces = function(anyStringWithSpaces) {
    var newString = "";
    
    try {
        newString = anyStringWithSpaces.replace(/ /g, "<SP>");
        return newString
    } catch(err) {
        alert(err + ": addIIMSpaces is having problems.");
    }
}

// replaces iMacros space entity ('<SP>') in a string with a space character (' ').
var removeIIMSpaces = function(anyStringWithIIMSpaces) {
    var newString = "";
    
    try {
        newString = anyStringWithIIMSpaces.replace(/<SP>/g, " ");
        return newString
    } catch(err) {
        alert(err + ": removeIIMSpaces is having problems.");
    }
}

// checks if edit mode is on. if it's not it turns it on.
var editModeON = function() {
    var macroCode = "";
    var e = 0;
    var extract = "";
    
    try{
    	macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=SPAN ATTR=ID:statusText EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
        if (e != 1) {
            throw "Failed to extract Edit Mode status.";
        }
		
		editMode = extract.match(/>([OFN]*)</)[1];
		
		if (editMode === "ON") {
		    return
		} else {
		    macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=SPAN ATTR=ID:statusText\n";
            e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
                throw "Failed to turn on Edit Mode.";
            }
		    return
		}
    } catch(err) {
        alert(err + ":\n editModeON is having problems.");
    }
}

// adds the Course Updates page area to the leftNav.
var courseUpdates = function() {
    var macroCode = "";
    var e = 0;
    var extract = "";
    var contextualMenuIdNumber = "";
    
    try{
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=LI ATTR=ID:addCmItem EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		contextualMenuIdNumber = extract.match(/cmlink_(\w{32})/)[1];
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:addModulePageButton\n";
		macroCode += "TAG POS=1 TYPE=INPUT ATTR=ID:addModulePageName CONTENT=Course<SP>Updates\n";
		macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ACTION:/webapps/blackboard/execute/course/addtoc ATTR=ID:module_page_availability_ckbox CONTENT=YES\n";
		macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ACTION:/webapps/blackboard/execute/course/addtoc ATTR=ID:module_page_availability_ckbox CONTENT=YES\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/webapps/blackboard/execute/course/addtoc ATTR=ID:addModulePageFormSubmit\n";
		e = iimPlay("CODE:" + macroCode);
		
		alert("You need to move the cursor in the text input to make the submit button active.");
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "PAUSE\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/webapps/blackboard/execute/course/addtoc ATTR=ID:addModulePageFormSubmit\n";
		macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Course<SP>Updates\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Add<SP>Course<SP>Module\n";
		macroCode += "WAIT SECONDS=1\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:_64_1:_1_1addButton\n";
		macroCode += "WAIT SECONDS=1\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:_1_1:_1_1addButton\n";
		macroCode += "WAIT SECONDS=1\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:_209_1:-1addButton\n";
		macroCode += "WAIT SECONDS=1\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:_66_1:_1_1addButton\n";
		macroCode += "WAIT SECONDS=1\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
		e = iimPlay("CODE:" + macroCode);
		
    } catch(err) {
        alert(err + ":\n courseUpdates is having problems.");
    }
}

// captures each Content Collection items data in an array ([contentType, xID, fileName, linkTitle, artifact])
// returns a 3D array where each element is one CC items array of data.
var xIDs = function() {
    var macroCode = "";
    var e = 0;
    var artifactInfo = new Array;
    var contentInfo = new Array;
    var extract = "";
    var rowsToScan = new Array;
    var i = 0;
	var contentType = 0; // 0 = print artifact, 1 = unitX_introduction.html, 2 = unitX_objectives.html, 3 = accordion, 4 = study, 5 = assignment, 6 = discussion, 7 = quiz
	var xID = "";
	var fileName = "";
	var linkTitle = "";
	var artifact = "";
    
    try {
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Getting<SP>Started\n";
        macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:discoverObjectTypePicker CONTENT=%html\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Go\n";
        macroCode += "WAIT SECONDS=2\n";
        macroCode += "TAB T=1\n";
        macroCode += "TAB T=2\n";
        macroCode += "FRAME F=0\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:catForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Authors\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Name\n";
        macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
        macroCode += "TAB T=1\n";
        macroCode += "TAB T=2\n";
        macroCode += "TAB CLOSE\n";
		e = iimPlay("CODE:" + macroCode);		
		extract = iimGetLastExtract();
		if (e != 1) {
		    throw e;
		}

		rowsToScan = extract.match(/<tr .+?<\/tr>/g);
		alert(extract);
		
		for (i = 0; i < rowsToScan.length; i++) {
		    xID = rowsToScan[i].match(/xythos_id=(\d*)_1/)[1];
		    /* remove this comment to include studies
		    if (rowsToScan[i].search(/u\d{2}s\d{1,2}\.html/) != -1) {
				contentType = 4;
				fileName = rowsToScan[i].match(/u\d{2}s\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    */
		    if (rowsToScan[i].search(/u\d{2}a\d{1,2}\.html/) != -1) {
				contentType = 5;
				fileName = rowsToScan[i].match(/u\d{2}a\d{1,2}\.html/)[0];
				linkTitle = "View Assignment Instructions";
				artifact = "<a target=\"_blank\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    
		    if (rowsToScan[i].search(/u\d{2}d\d{1,2}\.html/) != -1) {
				contentType = 6;
				fileName = rowsToScan[i].match(/u\d{2}d\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    
		    if (rowsToScan[i].search(/u\d{2}q\d{1,2}\.html/) != -1) {
		        alert(rowsToScan[i].match(/u\d{2}q\d{1,2}\.html/));
		    }
		}
		
		progressMessage += "";
		return contentInfo
    } catch(err) {
        alert(err + ":\n xIDs is having problems.");
    }
}

/* 
    clicks on each of content area left nav buttons. this controls operations to content 
    areas, with the exception of Course Project and Unit areas, which have their own functions 
    for that. this is where they're called.
*/
var cycleThroughLNav = function(celesteData) {
    var i = 0;
    var j = 0;
    var xidList = [];
    var lnavUnitName = "";
    var macroCode = "";
    var e = 0;
	var contentInfo = xIDs();
	var discussionInfo = [];
	var unitTitles = celesteData[0];
	var projectTitles = celesteData[1];
	var projectComponents = celesteData[2];
	var turnitinData = celesteData[3];
	var tiiTitle = "";
	var tiiType = "";
	var currentFrame = 0;

	try {
		// begin Getting Started		
		progressMessage += "Getting Started Operations:\n";
		lnavButtonClick("Getting Started");
		
		discussionInfo = [6, 1210, "welcome_and_introductions.html", "Welcome and Introductions", "<a artifacttype=\"html\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-1210_1\" target=\"_blank\" alt=\"\">welcome_and_introductions.html</a>"];
		addUngradedDiscussion(discussionInfo);
		
		discussionInfo = [6, 1227, "faculty_expectations.html", "Faculty Expectations", "<a artifacttype=\"html\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-1227_1\" target=\"_blank\" alt=\"\">faculty_expectations.html</a>"];
		addUngradedDiscussion(discussionInfo);
		// end Getting Started
		
		// begin Syllabus	
		progressMessage += "Syllabus Operations:\n";
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Syllabus\n";
		e = iimPlay("CODE:" + macroCode);
		// end Syllabus
		
		// begin Course Project(s)
		i = 1;
		while (i <= numberOfProjects) {
			lnavProjectName = "Course Project " + i	
		    progressMessage += lnavProjectName + " Operations:\n";
			if (lnavProjectName === "Course Project 1") {
				lnavProjectName = "Course Project";
			}
			lnavButtonClick(lnavProjectName);
			projectOperations(i, contentInfo, projectTitles[i - 1], projectComponents[i - 1]);
			i++;
		}
		// end Course Projects
		
		// begin Units
		i = 1;
		while (i <= numberOfUnits) {
			lnavUnitName = addIIMSpaces("Unit " + i);
			progressMessage += removeIIMSpaces(lnavUnitName) + " Operations:\n";
			lnavButtonClick(lnavUnitName);
			unitOperations(i, contentInfo, unitTitles[i - 1]);
			i++;
		}
		// end Units
    	
		progressMessage += "Content areas are set up.\n";
		return
    } catch(err) {
        alert(err + ":\n cycleThroughLNav is having problems.");
    }
}

// clicks on a left nav buttons title text.
var lnavButtonClick = function(button) {
    var macroCode = "";
    e = 0;
    var iimButton = "";

	try {
        iimButton = addIIMSpaces(button);
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:" + iimButton + "\n";
        e = iimPlay("CODE:" + macroCode);
        return
    } catch(err) {
        alert(err + ":\n lnavButtonClick is having problems.");
    }
}

// adds all assignments, graded discussion topics, and the common ungraded discussions to unit content areas, in that order.
var unitOperations = function(unitNum, contentInfo, unitTitle) {
    
    var setUnitTitle = function(title) {
        var macroCode = "";
        var e = 0;
        var extract = "";
    	var num = "";
    	var contentListItems = [];
    	var contextualMenuIdNumber = "";
    	
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		contentListItems = extract.match(/<li[\s\S]+?<\/li>/g);
		contextualMenuIdNumber = contentListItems[1].match(/cmlink_(\w{32})/)[1];
    	
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:the_form ATTR=ID:user_title CONTENT=" + addIIMSpaces(title) + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
		e = iimPlay("CODE:" + macroCode);
    }
    
    var getTitleNumber = function(celesteFileName) {
    	var num = "";
    	
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
    
    var macroCode = "";
    var e = 0;
    var extract = "";
    var j = 0;
    var unitInfo = [];
    var assignments = [];
    var discussions = [];
    var quizzes = [];
    var discussionInfo = [];
    
    try {
        unitInfo = assembleUnitInfo(unitNum, contentInfo);
        assignments = artifactByContentType(5, unitInfo);
        discussions = artifactByContentType(6, unitInfo);
        quizzes = artifactByContentType(7, unitInfo);
        
        setUnitTitle(unitTitle);
        for (j = 0; j < assignments.length; j++) {
            addAssignment(unitNum, assignments[j]);
        }
        
        for (j = 0; j < discussions.length; j++) {
            addDiscussion(unitNum, discussions[j]);
        }
        
        for (j = 0; j < quizzes.length; j++) {
            addQuiz(unitNum, quizzes[j]);
        }
        
		discussionInfo = [6, 1211, "updates_handouts.html", "Unit " + unitNum + " Updates and Handouts", "<a artifacttype=\"html\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-1211_1\" target=\"_blank\" alt=\"\">updates_handouts.html</a>"];
		addUngradedDiscussion(discussionInfo);
		
		discussionInfo = [6, 1212, "ask_your_instructor.html", "Ask Your Instructor", "<a artifacttype=\"html\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-1212_1\" target=\"_blank\" alt=\"\">ask_your_instructor.html</a>"];
		addUngradedDiscussion(discussionInfo);
		return
    } catch(err) {
        alert(err + ":\n unitOperations is having problems.");
    }
}

// adds an assignment.
var addAssignment = function(unitNum, assignmentInfo) {
    var macroCode = "";
    var activityCode = "";
    var assignmentNum = "";
    var title = "";
    var contentType = 0;
    var xID = "";
    var fileName = "";
    var linkTitle = "";
    var artifact = "";

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
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageAssignmentForm ATTR=ID:content_name CONTENT=" + addIIMSpaces(title) + "\n";
		macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
		macroCode += "TAB T=2\n";
		macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces(artifact) + "\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw "Something went wrong submitting " + activityCode + ".";
        }
		
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";  
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageAssignmentForm ATTR=ID:possible CONTENT=100\n";
        macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:manageAssignmentForm ATTR=ID:isTracked CONTENT=YES\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manageAssignmentForm ATTR=ID:attemptTypeNum\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manageAssignmentForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw "Something went wrong submitting " + activityCode + ".";
        }

        progressMessage += title + ": added\n";
		return
    } catch(err) {
        alert(err + " addAssignment is having problems.");
    }
}

// adds graded discussions if they have a activity code.
var addDiscussion = function(unitNum, discussionInfo) {
    var macroCode = "";
    var e = 1;
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
        artifact = discussionInfo[4];
        
        activityCode = fileName.match(/u\d{2}d\d{1,2}/)[0];
        discussionNum = activityCode.match(/u\d{2}d(\d{1,2})/)[1];
        title = "[" + activityCode + "] Unit " + unitNum + " Discussion " + discussionNum;

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Tools\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>New<SP>Forum\n";
        e = iimPlay("CODE:" + macroCode);

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:forumForm ATTR=ID:title CONTENT=" + addIIMSpaces(title) + "\n";
		macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
		macroCode += "TAB T=2\n";
		macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces(artifact) + "\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw "Something went wrong submitting " + activityCode + ".";
        }
		
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";  
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
        if (e != 1) {
            throw "Something went wrong submitting the form to create " + activityCode + ".";
        }

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
		macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
		macroCode += "TAB T=2\n";
		macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw "Something went wrong submitting " + activityCode + ".";
        }

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        e = iimPlay("CODE:" + macroCode);
        
        progressMessage += title + ": added\n";
		return
    } catch(err) {
        alert(err + ":\n addDiscussion is having problems.");
    }
}

// pauses the action for Respondus use. alerts with the title and artifact link for the activity
var addQuiz = function(unitNum, quizInfo) {
    var macroCode = "";
    var e = 1;
    var activityCode = "";
    var quizNum = "";
    var title = "";
    var contentType = 0;
    var xID = "";
    var fileName = "";
    var linkTitle= "";
    var artifact= "";
    var quizIDs = [];
    var quizID = "";
    var message = "";

    try {
        contentType = quizInfo[0];
        xID = quizInfo[1];
        fileName = quizInfo[2];
        linkTitle = quizInfo[3];
        artifact = quizInfo[4];
        
        activityCode = fileName.match(/u\d{2}q\d{1,2}/)[0];
        quizNum = activityCode.match(/u\d{2}q(\d{1,2})/)[1];
        title = "[" + activityCode + "] Unit " + unitNum + " Quiz " + quizNum;
        message = "Pausing for CP intervention. Import or build " + activityCode + ".\n";
        message += "\nFor your clipboard:\n\n";
        message += title + "\n";
        message += "<div class=\"capellaDrawer\">" + artifact + "</div>";
        alert(message);
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "PAUSE\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw e;
        }
        
        progressMessage += title + ": added\n";
		return
    } catch(err) {
        alert(err + ":\n addQuiz is having problems.");
    }
}

// adds discussions that are not included in the grading equation.
var addUngradedDiscussion = function(discussionInfo) {

    var toggleCreateNewForum = function() {
        var macroCode = "";
        var e = "";

        try {    	
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>New<SP>Forum\n";
            e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
                throw e;
            }
            return
        } catch(err) {
            alert(err + ":\n toggleCreateNewForum is having problems.");
        }
    }
    
    var toggleDiscussionTool = function() {
    	var macroCode = "";
    	var e = 0;
    	
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Tools\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
		e = iimPlay("CODE:" + macroCode);
    }
    
    var buildDiscussion = function() {
        var macroCode = "";
        var e = 0;
    
        try {
            toggleDiscussionTool();
            toggleCreateNewForum();

            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:forumForm ATTR=ID:title CONTENT=" + addIIMSpaces(linkTitle) + "\n";
            macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
            macroCode += "TAB T=2\n";
            macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces(artifact) + "\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
            e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
                throw "Something went wrong submitting " + linkTitle + ".";
            }
        
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:forumForm ATTR=ID:isAllowAuthorRemove CONTENT=YES\n";
            macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:forumForm ATTR=ID:isAllowAuthorModify CONTENT=YES\n";
            macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:allow2\n";
            macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:include1\n";
            macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:nograde\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:forumForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
            e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
                throw "Something went wrong creating " + linkTitle + ".";
            }

            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
            macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
            macroCode += "TAB T=2\n";
            macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces(artifact) + "\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
            e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
                throw "Something went wrong submitting " + linkTitle + ".";
            }
        
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
            e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
                throw "Something went wrong adding " + linkTitle + " to it's content area.";
            }
        } catch(err) {
            alert(err + ":\n buildDiscussion is having problems.");
        }
    }
    
    var courseWideDiscussion = function(linkTitle, artifact) {
    	var macroCode = "";
    	var e = 0;
    	var extract = "";
    	var discOptions = [];
    	var i = 0;
    	var searchPattern = new RegExp;
    	
    	try {
    	    toggleDiscussionTool();
    	    if (linkTitle.search(/Ask Your Instructor/) != -1) {
    	        searchPattern = linkTitle.match(/Ask Your Instructor/);
    	    }
    	    
    	    if (linkTitle.search(/Updates and Handouts/) != -1) {
    	        searchPattern = linkTitle.match(/Updates and Handouts/);
    	    }
    	
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:itemId EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            discOptions = extract.match(/<option[\s\S]+?<\/option>/g);
            
            if (extract.search(searchPattern) != - 1) {
                for (i = 0; i < discOptions.length; i++) {
                    if (discOptions[i].search(searchPattern) != -1) {
                        discID = discOptions[i].match(/_\d+?_1/g);
                    }
                }
                
                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:addItemFormId ATTR=ID:rTool_1\n";
                macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:addItemForm ATTR=ID:itemId CONTENT=%" + discID + "\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
                macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:course_link ATTR=ID:specific_link_name CONTENT=" + addIIMSpaces(linkTitle) + "\n";
                macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code&&TXT:\n";
                macroCode += "TAB T=2\n";
                macroCode += "FRAME F=0\n";
                macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + artifact + "\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
                e = iimPlay("CODE:" + macroCode);
                if (e != 1) {
                    throw "Something went wrong submitting " + linkTitle + ".";
                }

                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                e = iimPlay("CODE:" + macroCode);
                if (e != 1) {
                    throw "Something went wrong reusing " + linkTitle + " to it's content area.";
                }
            }
            
            if (extract.search(searchPattern) == -1) {
                toggleCreateNewForum();
                title = linkTitle.match(searchPattern)[0];
                
                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:forumForm ATTR=ID:title CONTENT=" + addIIMSpaces(title) + "\n";
                macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
                macroCode += "TAB T=2\n";
                macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + artifact + "\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
                e = iimPlay("CODE:" + macroCode);
                if (e != 1) {
                    throw "Something went wrong submitting " + title + ".";
                }

                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:forumForm ATTR=ID:isAllowAuthorRemove CONTENT=YES\n";
                macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:forumForm ATTR=ID:isAllowAuthorModify CONTENT=YES\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:allow2\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:include1\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:nograde\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:forumForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                e = iimPlay("CODE:" + macroCode);
                if (e != 1) {
                    throw "Something went wrong creating " + title + ".";
                }

                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
                macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:course_link ATTR=ID:specific_link_name CONTENT=" + addIIMSpaces(linkTitle) + "\n";
                macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
                macroCode += "TAB T=2\n";
                macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces(artifact) + "\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
                e = iimPlay("CODE:" + macroCode);
                if (e != 1) {
                    throw "Something went wrong submitting " + linkTitle + ".";
                }

                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                e = iimPlay("CODE:" + macroCode);
                if (e != 1) {
                    throw "Something went wrong adding " + linkTitle + " to it's content area.";
                }
            }
			return
		} catch(err) {
			alert(err + ":\n courseWideDiscussion is having problems.");
		}
    }

    var macroCode = "";
    var e = 1;
    var i = 0;
    var contentType = 0;
    var xID = "";
    var fileName = "";
    var linkTitle = "";
    var artifact = "";
    var discussionTopics = [];
    
    try {
        contentType = discussionInfo[0];
        xID = discussionInfo[1];
        fileName = discussionInfo[2];
        linkTitle = discussionInfo[3];
        artifact = addIIMSpaces("<div class=\"capellaDrawer\">" + discussionInfo[4] + "</div>");
		
		if (xID == 1211 || xID == 1212) {
		    courseWideDiscussion(linkTitle, artifact);
		} else {
			buildDiscussion(linkTitle, artifact);
		}
		return
    } catch(err) {
        alert(err + " addUngradedDiscussion is having problems.");
    }
}

// adds project titles, and project component assignment artifacts.
var projectOperations = function(projectNum, contentInfo, projectTitle, components) {
    var macroCode = "";
    var e = 0;
    var extract = "";
    
    var setProjectTitle = function(title) {
        var macroCode = "";
        var e = 0;
        var extract = "";
    	var contentListItems = [];
    	var contextualMenuIdNumber = "";
    	
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		contentListItems = extract.match(/<li[\s\S]+?<\/li>/g);
		contextualMenuIdNumber = contentListItems[2].match(/cmlink_(\w{32})/)[1];
    	
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:the_form ATTR=ID:user_title CONTENT=" + addIIMSpaces(title) + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
		e = iimPlay("CODE:" + macroCode);
    }
    
    var addComponents = function(listOfCodes, contentInfo) {
        var i = 0;
        var j = 0;
        var linkTitle = "";
        var title = "";
        
        for (i = 0; i < listOfCodes.length; i++) {
            titleInfo = listOfCodes[i].match(/u(\d{2})([ad])(\d{1,2})/);
            
            unitNum = titleInfo[1];
            unitNum++;
            unitNum--;
            
            if (titleInfo[2] == "a") {
                type = "Assignment";
            }
            if (titleInfo[2] == "d") {
                type = "Discussion";
            }
            
            title = "[" + listOfCodes[i] + "] Unit " + unitNum + " " + type + " " + titleInfo[3];
            for (j = 0; j < contentInfo.length; j++) {
                if (contentInfo[j][2].search(listOfCodes[i]) != -1) {
                    artifact = "<div class=\"capellaDrawer\">" + contentInfo[j][4] + "</div>";
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Build<SP>Content\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Item\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:the_form ATTR=ID:user_title CONTENT=" + addIIMSpaces(title) + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces(artifact) + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong submitting " + activityCode + ".";
					}
					
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                }
            }
        }
    }
    
    try {
        setProjectTitle(projectTitle);
        addComponents(components, contentInfo);
		return
    } catch(err) {
        alert(err + ":\n projectOperations is having problems.");
    }
}

// captures essential information like BB9 Course ID, number of units and projects.
var templateInfo = function() {
    var macroCode = "";
    var e = 0;
    var extract = "";
    var lnavItems = [];
    var units = [];
    var projects = [];
    var courseUpdatesID = "";

	try {
	    editModeON();
	    courseUpdates();
	    
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
		macroCode = "SET !TIMEOUT_STEP 1\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Teaching<SP>Style\n";
		e = iimPlay("CODE:" + macroCode);
		
		if (e === -921) {
            macroCode = "TAB T=1\nFRAME F=2\n";
		    macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.customization_groupExpanderLink\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Teaching<SP>Style\n";
            e = iimPlay("CODE:" + macroCode);
		}
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:entryCourseTocIdStr EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		courseUpdatesID = extract.match(/<option value="(_\d+?_1)">Course Updates<\/option>/)[1];
	
		macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=ACTION:manageCourseDesign?cmd=save&course_id=_*_1 ATTR=ID:entryCourseTocIdStr CONTENT=%" + courseUpdatesID + "\n"; 
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ACTION:manageCourseDesign?cmd=save&course_id=_*_1 ATTR=ID:textOnlyView\n";
        macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ACTION:manageCourseDesign?cmd=save&course_id=_*_1 ATTR=ID:applyAllContentAreas CONTENT=YES\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:manageCourseDesign?cmd=save&course_id=_*_1 ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        e = iimPlay("CODE:" + macroCode);
        if (e == 1) {
            progressMessage += "Icons are turned off.\n";
        }
	
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
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
		return courseID
    } catch(err) {
        alert(err + ":\n templateInfo is having problems.");
    }
}

// captures data from Celeste. 
var celesteDataCapture = function(courseID) {
    var macroCode = "";
    var e = "";
    var extract = "";
    var assignedRows = [];
    var i = 0;
    var linkID = "";
    var unitTitles = [];
    var projectTitles = [];
    var celesteData = [];
    var subMenu = "";
    var components = [];
    var projectComponents = [];
    var unitNum = "";
    var assignmentRows = [];
    var assignment = [];
    var assignments = [];
    var assignmentTitle = "";
    var assNum = "";
    var assType = "";

    try {
        macroCode = "TAB OPEN\n";
        macroCode += "TAB T=2\n";
        macroCode += "URL GOTO=https://celeste.capella.edu\n";
        macroCode += "PAUSE\n";
        e = iimPlay("CODE:" + macroCode);
    
        macroCode = "TAG POS=1 TYPE=A ATTR=ID:assToMe_Nav\n";
        macroCode += "WAIT SECONDS=3\n";
        macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:dialogHolder EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        
        assignedRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
        for (i = 0; i < assignedRows.length; i++) {
            if (assignedRows[i].search(courseID) != -1) {
                linkID = assignedRows[i].match(/assToMeContentLink-\d+/);
            
                macroCode = "TAG POS=1 TYPE=A ATTR=ID:" + linkID + "\n";
                macroCode += "WAIT SECONDS=12\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:childMenu\n";
                macroCode += "WAIT SECONDS=3\n";
                macroCode += "TAG POS=2 TYPE=A ATTR=TXT:Units\n";
                e = iimPlay("CODE:" + macroCode);
            }
        }
    
        macroCode = "TAG POS=1 TYPE=DIV ATTR=ID:courseUnitSummary EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
    
        unitTitles = extract.match(/<h3>[\s\S]+?(?=<\/h3>)/g);
    
        for (i = 0; i < unitTitles.length; i++) {
            unitTitles[i] = unitTitles[i].replace(/<h3>/, "");
            unitNum = unitTitles[i].match(/Unit \d{1,2}/);
            unitTitles[i] = unitTitles[i].replace(/Unit \d{1,2} -/, unitNum);
        }
    
        celesteData.push(unitTitles);
    
        macroCode = "TAG POS=1 TYPE=DIV ATTR=ID:childMenuContent EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        subMenu = extract.match(/<a href="#" onclick="">\s*Syllabus<\/a>\s*?(<ul>[\s\S]+?<\/ul>)/)[1];
        projectTitles = subMenu.match(/Project: [\s\S]+?(?=<\/a>)/g);
    
        if (projectTitles != null) {
            for (i = 0; i < projectTitles.length; i++) {
                projectTitles[i] = projectTitles[i].replace(/Project: /, "");
            }
    
            celesteData.push(projectTitles);
    
            for (i = 0; i < projectTitles.length; i++) {
                components = [];
                macroCode = "TAG POS=1 TYPE=A ATTR=ID:childMenu\n";
                macroCode += "WAIT SECONDS=2\n";
                macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Syllabus\n";
                macroCode += "WAIT SECONDS=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Project:<SP>" + addIIMSpaces(projectTitles[i]) + "\n";
                macroCode += "WAIT SECONDS=10\n";
                macroCode += "TAG POS=1 TYPE=H3 ATTR=TXT:Project<SP>Components\n";
                macroCode += "WAIT SECONDS=2\n";
                macroCode += "TAG POS=1 TYPE=TABLE ATTR=ID:componentsList EXTRACT=HTM\n";
                e = iimPlay("CODE:" + macroCode);
                extract = iimGetLastExtract();
                components = extract.match(/u\d{2}[ad]\d{1,2}/g);
                projectComponents.push(components);
            }
            celesteData.push(projectComponents);
        } else {
            celesteData.push(projectTitles);
            celesteData.push(projectComponents);
        }
    
        assignments.push(["1 - Draft", "draft"])
        assignments.push(["2 - Draft", "draft"])
    
        macroCode = "TAG POS=1 TYPE=A ATTR=ID:childMenu\n";
        macroCode += "WAIT SECONDS=3\n";
        macroCode += "TAG POS=2 TYPE=A ATTR=TXT:Activities\n";
        macroCode += "WAIT SECONDS=3\n";
        macroCode += "TAG POS=1 TYPE=UL ATTR=ID:assignmentsList EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
    
        assignmentRows = extract.match(/<li[\s\S]+?<\/li>/g);
    
        for (i = 0; i < assignmentRows.length; i++) {
            assignmentTitle = assignmentRows[i].match(/u\d{2}a\d{1,2}: *[\s\S]+?(?=<\/a>)/)[0];
            
            if (assignmentRows[i].search(/draft/i) > -1) {
                assType = "draft";
            } else {
                assType = "final";
            }
            assignment = [assignmentTitle, assType];
            assignments.push(assignment);
        }
    
        celesteData.push(assignments);
    
        macroCode = "TAB CLOSE\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw e;
        }
    
        return celesteData
    } catch(err) {
        alert(err + ":\n celesteDataCapture is having problems.");
    }
}

// captures each Content Collection items data in an array ([contentType, xID, fileName, linkTitle, artifact])
// returns a 3D array where each element is one CC items array of data.
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
        macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Getting<SP>Started\n";
        macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:discoverObjectTypePicker CONTENT=%html\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Go\n";
        macroCode += "WAIT SECONDS=2\n";
        macroCode += "TAB T=1\n";
        macroCode += "TAB T=2\n";
        macroCode += "FRAME F=0\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:catForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Authors\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Name\n";
        macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
        macroCode += "TAB T=1\n";
        macroCode += "TAB T=2\n";
        macroCode += "TAB CLOSE\n";
		e = iimPlay("CODE:" + macroCode);		
		extract = iimGetLastExtract();
		if (e != 1) {
		    throw e;
		}

		rowsToScan = extract.match(/<tr .+?<\/tr>/g);
		
		for (i = 0; i < rowsToScan.length; i++) {
		    xID = rowsToScan[i].match(/xythos_id=(\d*)_1/)[1];
		    /* remove this comment to include studies
		    if (rowsToScan[i].search(/u\d{2}s\d{1,2}\.html/) != -1) {
				contentType = 4;
				fileName = rowsToScan[i].match(/u\d{2}s\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    */
		    if (rowsToScan[i].search(/u\d{2}a\d{1,2}\.html/) != -1) {
				contentType = 5;
				fileName = rowsToScan[i].match(/u\d{2}a\d{1,2}\.html/)[0];
				linkTitle = "View Assignment Instructions";
				artifact = "<a target=\"_blank\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    
		    if (rowsToScan[i].search(/u\d{2}d\d{1,2}\.html/) != -1) {
				contentType = 6;
				fileName = rowsToScan[i].match(/u\d{2}d\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    
		    if (rowsToScan[i].search(/u\d{2}q\d{1,2}\.html/) != -1) {
				contentType = 7;
				fileName = rowsToScan[i].match(/u\d{2}q\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		}
		
		progressMessage += "";
		return contentInfo
    } catch(err) {
        alert(err + ":\n xIDs is having problems.");
    }
}

// navigates via the course search feature to the specified course id.
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
		    userName = prompt("Enter your username", userName);
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
		return
    } catch(err) {
        alert(err + ":\n goToCourseID is having problems.");
    }
}

// enrolls a specified user as a CP (if you know the values for other roles it can enroll as them too.)
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
			
			progressMessage += "Enrolled " + userName + " in: " + bb9_courseID + "\n";
			return true
		} else if (extract.search(userName) != -1) {
			progressMessage += userName + " is already enrolled in: " + bb9_courseID + "\n";
			return true
		} else {
			progressMessage += "Failed to enroll" + userName + "\n";
			return false
		}
    } catch(err) {
        alert(err + ":\n enrollInCourseID is having problems.");
    }
}

// unenrolls a specified user.
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
            }
        }
        
        macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:" + bb9_courseID + "\n";
        e = iimPlay("CODE:" + macroCode);
		
		progressMessage += "Un-enrolled " + userName + " from: " + templateID + ".\n";
		return
    } catch(err) {
        alert(err + ":\n unenrollInCourseID is having problems.");
    }
}

// controls all the gradebook setup operations.
var gradebook = function(celesteData) {
    
    // smartview operations.
    var smartViews = function() {
        
        var extractSmartViewRows = function() {
            var macroCode = "";
            var e = "";
            var extract = "";
            var smartViewRows = [];
            
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "WAIT SECONDS=2\n";
            macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
        
            smartViewRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
            return smartViewRows
        }
        
        var editSmartview = function(title, newTitle) {
            var macroCode = "";
            var e = "";
            var smartViewRows = [];
            var currentTitle = "";
            var contextualMenuIdNumber = "";
            
            smartViewRows = extractSmartViewRows();
            currentTitle = ">" + title + "<";
            for (i = 0; i < smartViewRows.length; i++) {
                if (smartViewRows[i].search(currentTitle) != - 1) {
                    contextualMenuIdNumber = smartViewRows[i].match(/cmlink_(\w{32})/)[1];

                    macroCode = "TAB T=1\nFRAME F=2\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:context_menu_tag_item1_" + contextualMenuIdNumber + "\n";
		            macroCode += "WAIT SECONDS=4\n";
                    e = iimPlay("CODE:" + macroCode);
                    
                    if (newTitle === "Assignments") {
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:categorySel CONTENT=%20379\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:userSel CONTENT=%all\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:filterQueryCriteria CONTENT=%ALL\n";
                        e = iimPlay("CODE:" + macroCode);
                    }
                    
                    if (newTitle === "Discussions") {
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:custom_view_form ATTR=ID:status\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:categorySel CONTENT=%20382\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:userSel CONTENT=%all\n";
                        e = iimPlay("CODE:" + macroCode);
                    }
                    
                    if (newTitle === "Quizzes") {
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:custom_view_form ATTR=ID:status\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:categorySel CONTENT=%20381\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:userSel CONTENT=%all\n";
                        e = iimPlay("CODE:" + macroCode);
                    }
                    
                    macroCode = "TAB T=1\nFRAME F=2\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:name CONTENT=" + addIIMSpaces(newTitle) + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:AddModifyCustomViewsForm ATTR=ID:favoriteCbox CONTENT=YES\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:custom_view_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                }
            }
        }
        
        var macroCode = "";
        var e = "";
        var extract = "";
        var contextualMenuIdNumber = "";
        var smartViewRows = [];
        
        try {
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Manage\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Smart<SP>Views\n";
            e = iimPlay("CODE:" + macroCode);

            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:manage_views_form ATTR=ID:listContainer_selectAll CONTENT=YES\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Favorites\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Remove<SP>from<SP>Favorites\n";
            e = iimPlay("CODE:" + macroCode);

            editSmartview("Assignments", "Assignments");
            editSmartview("Discussion Boards", "Discussion Participation");
            editSmartview("Tests", "Quizzes");
            
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
            e = iimPlay("CODE:" + macroCode);
		
            progressMessage += "\n";
            return
        } catch(err) {
            alert(err + ":\n editSmartView is having problems.");
        }
    }
    
    // sets up the discussion participation grading column (it excludes individually graded topics).
    var discussionParticipationCol = function(listOfGradedDiscussions) {
        var macroCode = "";
        var e = "";
        var extract = "";
        var colIDs = [];
        var commonDiscWeight = 0;
        var i = 0;
        var j = 0;
        var id = "";
		var discussionNum = 0;
		var colWeightID = 0;
		
        try {
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "WAIT SECONDS=5\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>Calculated<SP>Column\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Weighted<SP>Column\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:columnName CONTENT=Discussion<SP>Participation\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:gradebookDisplayName CONTENT=Disc.<SP>Participation\n";
            macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:prms_left_select EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
            	throw "problems while extracting prms_left_select."; 
            }
            extract = iimGetLastExtract();
            colIDs = extract.match(/<option[\s\S]+?<\/option>/g);
            
            if (listOfGradedDiscussions.length != 0) {
                for (i = 0; i < colIDs.length; i++) {
                    for (j = 0; j < listOfGradedDiscussions.length; j++) {
                        if (colIDs[i].search(/u\d{2}d\d{1,2}/) != -1 && colIDs[i].search(listOfGradedDiscussions[j]) === -1) {
                            discussionNum++;
                        }
                    }
                }
            
                commonDiscWeight = 100 / discussionNum;
            
                for (i = 0; i < colIDs.length; i++) {
                    for (j = 0; j < listOfGradedDiscussions.length; j++) {
                        if (colIDs[i].search(/u\d{2}d\d{1,2}/) != -1 && colIDs[i].search(listOfGradedDiscussions[j]) === -1) {
                            id = colIDs[i].match(/item_(\d+?)" value.+?(u\d{2}d\d{1,2})/)[1];
                        
                            macroCode = "TAB T=1\nFRAME F=2\n";
                            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                            macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + commonDiscWeight + "\n";
                            e = iimPlay("CODE:" + macroCode);
							if (e != 1) {
								throw "problems adding discussions to disc. participation column (with special graded discussion(s))."; 
							}
                            colWeightID++;
                        }
                    }
                }
            } else {
                for (i = 0; i < colIDs.length; i++) {
                    if (colIDs[i].search(/u\d{2}d\d{1,2}/) != -1) {
                        discussionNum++;
                    }
                }
            
                commonDiscWeight = 100 / discussionNum;
            
                for (i = 0; i < colIDs.length; i++) {
                    if (colIDs[i].search(/u\d{2}d\d{1,2}/) != -1) {
                        id = colIDs[i].match(/item_(\d+?)" value.+?(u\d{2}d\d{1,2})/)[1];
                    
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + commonDiscWeight + "\n";
                        e = iimPlay("CODE:" + macroCode);
						if (e != 1) {
							throw "problems adding discussions to disc. participation column."; 
						}
                        colWeightID++;
                    }
                }
            }
            
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
            e = iimPlay("CODE:" + macroCode);
			if (e != 1) {
				throw "problems submitting disc. participation column."; 
			}
            
        } catch(err) {
            alert(err + ":\n discussionParticipationCol is having problems.");
        }
    }
    
    // captures the weighted grade percentage from a line in the table of the grading page.
    var getWeight = function(pattern, gradingTableWeights) {
		var i = 0;
		var weight = 0;
		
		for (i = 0; i < gradingTableWeights.length; i++) {
			if (gradingTableWeights[i].search(pattern) != -1) {
				weight = gradingTableWeights[i].match(/(\d+)%/)[1];
			}
		}
		return weight;
	}
    
    // sets up the Current Grade Column (it includes individually graded topics).
    var currentGradeCol = function(gradingTableRows, listOfGradedDiscussions) {
        var macroCode = "";
        var e = "";
        var extract = "";
        var colIDs = [];
        var colWeightID = 0;
        var weight = 0;
        var searchPattern = "";
		
        try {
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>Calculated<SP>Column\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Weighted<SP>Column\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:columnName CONTENT=Current<SP>Grade\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:gradebookDisplayName CONTENT=Current<SP>Grade\n";
            macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:prms_left_select EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            colIDs = extract.match(/<option[\s\S]+?<\/option>/g);
            weight = 0;
            
            if (listOfGradedDiscussions.length != 0) {
                for (i = 0; i < colIDs.length; i++) {
                    for (j = 0; j < listOfGradedDiscussions.length; j++) {
                        if (colIDs[i].search(/Disc\. Participation/) != -1) {
                            weight = getWeight("Discussion Participation", gradingTableRows);
                            id = colIDs[i].match(/item_(\d+)/)[1];
                        
                            macroCode = "TAB T=1\nFRAME F=2\n";
                            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                            macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + weight + "\n";
                            e = iimPlay("CODE:" + macroCode);
                            if (e != 1) {
                                throw "Failed to add Discussion Participation column";
                            }
                            colWeightID++;
                        } else if (colIDs[i].search(/u\d{2}[aq]\d{1,2}/) != -1 || colIDs[i].search(listOfGradedDiscussions[j]) != -1) {
                            searchPattern = colIDs[i].match(/u\d{2}[adq]\d{1,2}/);
                            weight = getWeight(searchPattern, gradingTableRows);
                            id = colIDs[i].match(/item_(\d+)/)[1];
                        
                            macroCode = "TAB T=1\nFRAME F=2\n";
                            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                            macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + weight + "\n";
                            e = iimPlay("CODE:" + macroCode);
                            if (e != 1) {
                                throw "Failed to add " + searchPattern + " column";
                            }
                            colWeightID++;
                        }
                    }
                }
            } else {
                for (i = 0; i < colIDs.length; i++) {
                    if (colIDs[i].search(/Disc\. Participation/) != -1) {
                        weight = getWeight("Discussion Participation", gradingTableRows);
                        id = colIDs[i].match(/item_(\d+)/)[1];
                    
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + weight + "\n";
                        e = iimPlay("CODE:" + macroCode);
                        if (e != 1) {
                            throw "Failed to add Discussion Participation column";
                        }
                        colWeightID++;
                    } else if (colIDs[i].search(/u\d{2}[aq]\d{1,2}/) != -1) {
                        searchPattern = colIDs[i].match(/u\d{2}[aq]\d{1,2}/);
                        weight = getWeight(searchPattern, gradingTableRows);
                        id = colIDs[i].match(/item_(\d+)/)[1];
                    
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + weight + "\n";
                        e = iimPlay("CODE:" + macroCode);
                        if (e != 1) {
                            throw "Failed to add " + searchPattern + " column";
                        }
                        colWeightID++;
                    }
                }
            }
			
			macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:runningYes\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:scorableNo\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:visibleYes\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:showStatToStudentNo\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
			e = iimPlay("CODE:" + macroCode);
            
        } catch(err) {
            alert(err + ":\n currentGradeCol is having problems.");
        }
    }
    
    // sets up the Current Grade Column (it includes individually graded topics).
	var finalGradeCol = function(gradingTableRows, listOfGradedDiscussions) {
        var macroCode = "";
        var e = "";
        var extract = "";
        var colIDs = [];
        var colWeightID = 0;
        var weight = 0;
        var searchPattern = "";
		
        try {
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>Calculated<SP>Column\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Weighted<SP>Column\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:columnName CONTENT=Final<SP>Grade\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:gradebookDisplayName CONTENT=Final<SP>Grade\n";
            macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:prms_left_select EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            colIDs = extract.match(/<option[\s\S]+?<\/option>/g);
            weight = 0;
            
            if (listOfGradedDiscussions.length != 0) {
                for (i = 0; i < colIDs.length; i++) {
                    for (j = 0; j < listOfGradedDiscussions.length; j++) {
                        if (colIDs[i].search(/Disc\. Participation/) != -1) {
                            weight = getWeight("Discussion Participation", gradingTableRows);
                            id = colIDs[i].match(/item_(\d+)/)[1];
                        
                            macroCode = "TAB T=1\nFRAME F=2\n";
                            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                            macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + weight + "\n";
                            e = iimPlay("CODE:" + macroCode);
                            if (e != 1) {
                                throw "Failed to add Discussion Participation column";
                            }
                            colWeightID++;
                        } else if (colIDs[i].search(/u\d{2}[aq]\d{1,2}/) != -1 || colIDs[i].search(listOfGradedDiscussions[j]) != -1) {
                            searchPattern = colIDs[i].match(/u\d{2}[adq]\d{1,2}/);
                            weight = getWeight(searchPattern, gradingTableRows);
                            id = colIDs[i].match(/item_(\d+)/)[1];
                        
                            macroCode = "TAB T=1\nFRAME F=2\n";
                            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                            macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + weight + "\n";
                            e = iimPlay("CODE:" + macroCode);
                            if (e != 1) {
                                throw "Failed to add " + searchPattern + " column";
                            }
                            colWeightID++;
                        }
                    }
                }
            } else {
                for (i = 0; i < colIDs.length; i++) {
                    if (colIDs[i].search(/Disc\. Participation/) != -1) {
                        weight = getWeight("Discussion Participation", gradingTableRows);
                        id = colIDs[i].match(/item_(\d+)/)[1];
                    
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + weight + "\n";
                        e = iimPlay("CODE:" + macroCode);
                        if (e != 1) {
                            throw "Failed to add Discussion Participation column";
                        }
                        colWeightID++;
                    } else if (colIDs[i].search(/u\d{2}[aq]\d{1,2}/) != -1) {
                        searchPattern = colIDs[i].match(/u\d{2}[aq]\d{1,2}/);
                        weight = getWeight(searchPattern, gradingTableRows);
                        id = colIDs[i].match(/item_(\d+)/)[1];
                    
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%" + id + "\n";
                        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight" + colWeightID + " CONTENT=" + weight + "\n";
                        e = iimPlay("CODE:" + macroCode);
                        if (e != 1) {
                            throw "Failed to add " + searchPattern + " column";
                        }
                        colWeightID++;
                    }
                }
            }
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:runningNo\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:scorableNo\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:visibleNo\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:showStatToStudentNo\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
			e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
                throw "Failed to submit column:" + e;
            }
            
        } catch(err) {
            alert(err + ":\n finalGradeCol is having problems.");
        }
    }
    
    // moves the disc. participation, current grade and final grade columns to the beginning of the gradbook.
	var arrangeColumns = function() {
        
        var clicks = function(id, numberOfClicks) {
			var macroCode = "";
			var e = "";
        	var clicks = 0;
        	
			macroCode = "TAB T=1\nFRAME F=2\n";		
			macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:gpRepoSel CONTENT=%item_" + id + "\n";
			e = iimPlay("CODE:" + macroCode);
        	
        	while (clicks <= numberOfClicks) {
				macroCode = "TAB T=1\nFRAME F=2\n";		
				macroCode += "TAG POS=1 TYPE=BUTTON ATTR=ID:gpRepoMoveUp\n";
				e = iimPlay("CODE:" + macroCode);
				clicks++;
        	}
        	return
        }
		
        var macroCode = "";
        var e = "";
        var extract = "";
        var orgRowNum = 0;
        var reorderItems = [];
        var id = 0;
        
        try {
			macroCode = "TAB T=1\nFRAME F=2\n";		
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Manage\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Column<SP>Organization\n";
			macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:reorderTable1 EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
			
			orgRowNum = extract.match(/<tr[\s\S]+?<\/tr>/g).length - 2;
			
			macroCode = "TAB T=1\nFRAME F=2\n";		
			macroCode += "TAG POS=4 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/keyboard.gif\n";
			macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:gpRepoSel EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
			
			reorderItems = extract.match(/<option[\s\S]+?<\/option>/g);
			
			for (i = 0; i < reorderItems.length; i++) {
				if (reorderItems[i].search(/Current Grade/) != -1) {
					id = reorderItems[i].match(/item_(\d+)/)[1];
					clicks(id, orgRowNum);
				}
			}
			
			for (i = 0; i < reorderItems.length; i++) {
				if (reorderItems[i].search(/Disc. Participation/) != -1) {
					id = reorderItems[i].match(/item_(\d+)/)[1];
					clicks(id, orgRowNum);
				}
			}
			
			for (i = 0; i < reorderItems.length; i++) {
				if (reorderItems[i].search(/Final Grade/) != -1) {
					id = reorderItems[i].match(/item_(\d+)/)[1];
					clicks(id, orgRowNum);
				}
			}
			
			macroCode = "TAB T=1\nFRAME F=2\n";		
			macroCode += "TAG POS=1 TYPE=BUTTON ATTR=ID:gpRepoApply\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:gradingPeriodLayoutForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
			e = iimPlay("CODE:" + macroCode);
			return
        } catch(err) {
            alert(err + ":\n arrangeColumns is having problems.");
        }
    }

    var macroCode = "";
    var e = "";
    var extract = "";
    var gradingTableRows = [];
    var i = 0;
    var gradedDiscussions = [];
	var turnitinData = celesteData[3];
	
	try {
        lnavButtonClick("Syllabus");
        
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TABLE ATTR=ID:activities_scoring_guide EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		gradingTableRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
		
		for (i = 0; i < gradingTableRows.length; i++) {
		    if (gradingTableRows[i].search(/u\d{2}d\d{1,2}/) != - 1) {
		        gradedDiscussions.push(gradingTableRows[i].match(/u\d{2}d\d{1,2}/));
		    }
		}
		
        macroCode = "TAB T=1\nFRAME F=2\n";		
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.grade.center_groupExpanderLink\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Full<SP>Grade<SP>Center\n";
        e = iimPlay("CODE:" + macroCode);
        
		discussionParticipationCol(gradedDiscussions);
		currentGradeCol(gradingTableRows, gradedDiscussions);
		finalGradeCol(gradingTableRows, gradedDiscussions);
		arrangeColumns();
        smartViews();
		
		progressMessage += "\n";
		return
    } catch(err) {
        alert(err + ":\n gradebook is having problems.");
    }
}

// adds turnitin assignments, it also hides the gradebook columns that it creates
var addTII = function(celesteData, bb9_courseID) {

    var createTIIAssignments = function(celesteData, bb9_courseID) {

        var buildTIIAssignment = function(turnitinData) {
            var macroCode = "";
            var e = "";
            var extract = "";
            var tiiTitle = turnitinData[0];
            var tiiType = turnitinData[1];
            var tiiframe = 0;
    
            try {
                lnavButtonClick("Turnitin");
        
                macroCode = "SET !TIMEOUT_STEP 1\n";
                macroCode += "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
                iimPlay("CODE:" + macroCode);
                extract = iimGetLastExtract();
        
                if (extract.search(tiiTitle) === -1) {
                    macroCode = "SET !TIMEOUT_STEP 1\n";
                    macroCode += "TAB T=1\nFRAME F=2\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Assessments\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Turnitin<SP>Assignment\n";
                    e = iimPlay("CODE:" + macroCode);
            
                    macroCode = "SET !TIMEOUT_STEP 1\n";
                    macroCode += "TAB T=1\nFRAME F=5\n";
                    macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:ibox_form_header EXTRACT=HTM\n";
                    e = iimPlay("CODE:" + macroCode);
                    extract = iimGetLastExtract();
                
                    if (extract.search(/<h2>user agreement<\/h2>/i) > -1) {
                        macroCode = "TAB T=1\nFRAME F=5\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:new_user5 ATTR=NAME:submit&&VALUE:I<SP>agree<SP>--<SP>continue\n";
                        macroCode += "TAG POS=1 TYPE=BODY ATTR=TXT:* EXTRACT=HTM\n";
                        e = iimPlay("CODE:" + macroCode);
                    }
        
                    if (extract.search(/<h2>Select your assignment type<\/h2>/) > -1) {
                        macroCode = "TAB T=1\nFRAME F=5\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:pa\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:assignment_create_form ATTR=NAME:submit&&VALUE:Next<SP>Step\n";
                        e = iimPlay("CODE:" + macroCode);
                    }
        
                    macroCode = "SET !TIMEOUT_STEP 1\n";
                    macroCode += "TAB T=1\nFRAME F=5\n"
                    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:assignment ATTR=ID:title CONTENT=" + addIIMSpaces(tiiTitle) + "\n";
                    macroCode += "TAG POS=1 TYPE=SPAN ATTR=ID:due_link\n";
                    macroCode += "TAG POS=14 TYPE=SELECT ATTR=* CONTENT=%11\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:>>\n";
                    macroCode += "TAG POS=14 TYPE=SELECT ATTR=* CONTENT=%11\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:>>\n";
                    macroCode += "TAG POS=14 TYPE=SELECT ATTR=* CONTENT=%11\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:31\n";
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:https://ne.edgecastcdn.net/800404/www.turnitin.com/image_bin/icons/cms/turnitin/small_16/expand.gif\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:late_accept_flag_1\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:generate_reports_1\n";
                    macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:assignment ATTR=ID:report_gen_speed CONTENT=%" + tiiType + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:use_small_matches_1\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:assignment ATTR=ID:exclude_by_words_value CONTENT=8\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:students_view_reports_1\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:bb_use_postdate_0\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:assignment_create_form ATTR=NAME:submit_form&&VALUE:Submit\n";
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/common/ok_off.gif?course_id=_*_1\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e!=1) {
                        throw e;
                    }
                    
                    // the tii building block does crazy things to the frameset. this gets things back to normal.
                    macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
                    macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
                    e = iimPlay("CODE:" + macroCode);

                    macroCode = "TAB T=1\nFRAME F=2\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:" + bb9_courseID + "\n";
                    e = iimPlay("CODE:" + macroCode);
                
                    lnavButtonClick("Turnitin");
                    return
                } else {
                    return
                }
            } catch(err) {
                alert(err + ":\n buildTIIAssignment is having problems.");
            }
        }

        var i = 0;
        var j = 0;
        var macroCode = "";
        var e = 0;
        var turnitinData = celesteData[3];
        
        try {
            for (i = 0; i < turnitinData.length; i++) {
                buildTIIAssignment(turnitinData[i]);
            }
        } catch(err) {
            alert(err + ": createTIIAssignments is having problems.");
        }
    }

    // hides the turnitin assignment columns 
    var hideTIIColumns = function(celesteData) {

        var screenReaderON = function() {
            var macroCode = "";
            var e = "";
            var extract = "";
    
            try {
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:pageTitleBar EXTRACT=HTM\n";
                e = iimPlay("CODE:" + macroCode);
                extract = iimGetLastExtract();

                if (extract.search(/Screen Reader Mode Active/) == -1) {
            
                    macroCode = "TAB T=1\nFRAME F=2\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:" + extract.match(/cmlink_\w{32}/) + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Turn<SP>Screen<SP>Reader<SP>Mode<SP>On\n";
                    macroCode += "WAIT SECONDS=4\n";
                    e = iimPlay("CODE:" + macroCode);
                }
            } catch(err) {
                alert(err + ":\n screenReaderON is having problems.");
            }
        }

        var macroCode = "";
        var e = "";
        var extract = "";
        var thCols = [];
        var i = 0;
        var tiiCols = [];
        var j = 0;
        var turnitinData = celesteData[3];
        
        try {
            macroCode = "SET !TIMEOUT_STEP 1\n";
            macroCode += "TAB T=1\nFRAME F=2\n";		
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.grade.center_groupExpanderLink\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Full<SP>Grade<SP>Center\n";
            e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
                macroCode = "TAB T=1\nFRAME F=2\n";		
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.grade.center_groupExpanderLink\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Full<SP>Grade<SP>Center\n";
                e = iimPlay("CODE:" + macroCode);
            }
        
            screenReaderON();

            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "WAIT SECONDS=4\n";
            macroCode += "TAG POS=1 TYPE=TABLE ATTR=ID:table1_accessible EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();

            thCols = extract.match(/<th[\s\S]+?<\/th>/g);
            thCols = thCols.slice(Math.max(thCols.length - turnitinData.length, 1));

            for (i = thCols.length - 1; i > thCols.length - (turnitinData.length + 1); i--) {	
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:" + thCols[i].match(/cmlink_.+?(?=")/) + "\n";
                e = iimPlay("CODE:" + macroCode);
    
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=TABLE ATTR=ID:table1_accessible EXTRACT=HTM\n";
                e = iimPlay("CODE:" + macroCode);
                extract = iimGetLastExtract();
    
                tiiCols = extract.match(/<th[\s\S]+?<\/th>/g);
                tiiCols = tiiCols.slice(Math.max(tiiCols.length - turnitinData.length, 1));
    
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:" + tiiCols[i].match(/cmlink_.+?(?=")/) + "\n";
                e = iimPlay("CODE:" + macroCode);
    
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:" + tiiCols[tiiCols.length - 1].match(/cmlink_.+?(?=")/) + "\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Edit<SP>Column<SP>Information\n";
                e = iimPlay("CODE:" + macroCode);
    
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:item_definition_form ATTR=ID:scrollableNo\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:item_definition_form ATTR=ID:visibleNo\n";
                macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:item_definition_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                macroCode += "WAIT SECONDS=1\n";
                e = iimPlay("CODE:" + macroCode);
            }

            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=TABLE ATTR=ID:table1_accessible EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();

            thCols = extract.match(/<th[\s\S]+?<\/th>/g);
            thCols = thCols.slice(Math.max(thCols.length - turnitinData.length, 1));

            for (i = thCols.length - 1; i > thCols.length - (turnitinData.length + 1); i--) {	
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:" + thCols[i].match(/cmlink_.+?(?=")/) + "\n";
                e = iimPlay("CODE:" + macroCode);
    
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=TABLE ATTR=ID:table1_accessible EXTRACT=HTM\n";
                e = iimPlay("CODE:" + macroCode);
                extract = iimGetLastExtract();
    
                tiiCols = extract.match(/<th[\s\S]+?<\/th>/g);
                tiiCols = tiiCols.slice(Math.max(tiiCols.length - turnitinData.length, 1));
    
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:" + tiiCols[i].match(/cmlink_.+?(?=")/) + "\n";
                e = iimPlay("CODE:" + macroCode);
    
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:" + tiiCols[tiiCols.length - 1].match(/cmlink_.+?(?=")/) + "\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Hide<SP>Column\n";
                macroCode += "WAIT SECONDS=3\n";
                e = iimPlay("CODE:" + macroCode);
            }
            return
        } catch(err) {
            alert(err + ":\n hideTIIColumns is having problems.");
        }
    }
    
    try {
        createTIIAssignments(celesteData, bb9_courseID);
        hideTIIColumns(celesteData)
    } catch(err) {
        alert(err + ": addTII is having problems.");
    }
}

// makes a copy of the version folder on the institution side so scoring guides and course files links will work
var copyCC = function(bb9_courseID) {
    var macroCode = "";
    var e = 0;
    var extract = "";
    var ccTRs = [];
    var i = 0;
    var versionFolder = "";
    var errorMessage = "";

    try {
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.course.files_groupExpanderLink\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            iimPlay("CODE:" + macroCode);
        }
        
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=3 TYPE=A ATTR=TXT:" + bb9_courseID + "\n";
        e = iimPlay("CODE:" + macroCode);
        
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=TABLE ATTR=ID:listContainer_datatable EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        
        versionFolder = extract.match(/Version\d{4}/);
        ccTRs = extract.match(/<tr[\s\S]+?<\/tr>/g);
        for (i = 0; i < ccTRs.length; i++) {
            if (ccTRs[i].search(/Version\d{4}</) != -1) {
                macroCode = "SET !TIMEOUT_STEP 1\n";
                macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:filesForm ATTR=ID:listContainer_file*/courses/" + bb9_courseID + "/" + versionFolder + " CONTENT=YES\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_link_*_top&&TXT:Copy\n";
                e = iimPlay("CODE:" + macroCode);
                if (e != 1) {
                    errorMessage = "There is a version folder with that name in that location already.\n\n";
                    errorMessage += "This script can continue to advance, but you will need to fix the paths in all \n";
                    errorMessage += "links to course files and scoring guides after you rename the folder and copy it\n";
                    errorMessage += "to it's course folder (/institution/";
                    errorMessage += bb9_courseID.match(/_(\w+?)\d+?(?:\w+?-\w+?)*_/)[1] + "/" + bb9_courseID.match(/_(\w+?\d+?(?:\w+?-\w+?)*)_/)[1] + ").";
                    throw errorMessage;
                }
                
                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:destination ATTR=ID:targetPath_CSFile CONTENT=/institution/" + bb9_courseID.match(/_(\w+?)\d+?(?:\w+?-\w+?)*_/)[1] + "/" + bb9_courseID.match(/_(\w+?\d+?(?:\w+?-\w+?)*)_/)[1] + "/\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:destination ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                e = iimPlay("CODE:" + macroCode);
            }
        }
        return
    } catch(err) {
        alert("copyCC is having problems.\n" + err);
    }
}

// appends "_INPROGRESS" to the course name
var courseNameInProgress = function(bb9_courseID) {
    var macroCode = "";
    var e = 0;
    var extract = "";
    var bb9_courseName = "";
        
    try {
        macroCode = "SET !TIMEOUT_STEP 1\n";
	    macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.customization_groupExpanderLink\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Properties\n";
		e = iimPlay("CODE:" + macroCode);
		if (e != 1) {
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.customization_groupExpanderLink\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Properties\n";
            e = iimPlay("CODE:" + macroCode);
		}
		
        macroCode = "SET !TIMEOUT_STEP 1\n";
	    macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:myForm ATTR=ID:courseName CONTENT=" + bb9_courseID + "_INPROGRESS" + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:myForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
		e = iimPlay("CODE:" + macroCode);
    } catch(err) {
        alert(err + ": courseNameInProgress is having problems.");
    }
}

courseID = templateInfo();
goToCourseID(bb9_courseID, userName);
copyCC(bb9_courseID);
celesteData = celesteDataCapture(courseID);
cycleThroughLNav(celesteData); // edit unitOperations() to add/remove an operation
gradebook(celesteData);
//addTII(celesteData, bb9_courseID);
courseNameInProgress(bb9_courseID);
unenrollInCourseID(bb9_courseID);
