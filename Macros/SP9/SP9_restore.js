var progressMessage = "";
var errorMessage = "";
var bb9_courseID = null;
var numberOfUnits = 0;
var numberOfProjects = 0;
var courseID = null;
var userName = null;

// replaces a space character (' ') in a string with an iMacros space entity ('<SP>').
var addIIMSpaces = function(anyStringWithSpaces) {
    var newString = "";
	newString = anyStringWithSpaces.replace(/ /g,"<SP>");
	return newString
}

// replaces iMacros space entity ('<SP>') in a string with a space character (' ').
var removeIIMSpaces = function(anyStringWithIIMSpaces) {
    var newString = "";
	newString = anyStringWithIIMSpaces.replace(/<SP>/g," ");
	return newString
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
            progressMessage += "Turned on edit mode.\n";
		    return
		}
    } catch(err) {
        alert(err + " editModeON is having problems.");
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
        alert(err + " courseUpdates is having problems.");
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
				artifact = "<a target=\"_blank\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    */
		    if (rowsToScan[i].search(/u\d{2}a\d{1,2}\.html/) != -1) {
				contentType = 5;
				fileName = rowsToScan[i].match(/u\d{2}a\d{1,2}\.html/)[0];
				linkTitle = "View Assignment Instructions";
				artifact = "<a target=\"_blank\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    
		    if (rowsToScan[i].search(/u\d{2}d\d{1,2}\.html/) != -1) {
				contentType = 6;
				fileName = rowsToScan[i].match(/u\d{2}d\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
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
        alert(err + " xIDs is having problems.");
    }
}

/* 
    clicks on each of content area left nav buttons. this controls operations to content 
    areas, with the exception of Course Project and Unit areas, which have their own functions 
    for that. this is where they're called.
*/
var cycleThroughUnits = function(celesteData) {
    var i = 0;
    var xidList = [];
    var lnavUnitName = "";
    var macroCode = "";
    var e = 0;
	var contentInfo = xIDs();
	var discussionInfo = [];
	var unitTitles = celesteData[0];
	var projectTitles = celesteData[1];
	var projectComponents = celesteData[2];

	try {
	    // begin Getting Started		
		progressMessage += "Getting Started Operations:\n";
		lnavButtonClick("Getting Started");
		
		discussionInfo = [6, 1210, "welcome_and_introductions.html", "Welcome and Introductions", "<a artifacttype=\"html\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-1210_1\" target=\"_blank\" alt=\"\">welcome_and_introductions.html</a>"];
		addUngradedDiscussion(discussionInfo);
		
		discussionInfo = [6, 1227, "faculty_expectations.html", "Faculty Expectations", "<a artifacttype=\"html\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-1227_1\" target=\"_blank\" alt=\"\">faculty_expectations.html</a>"];
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
        alert(err + " cycleThroughUnits is having problems.");
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
        alert(err + " lnavButtonClick is having problems.");
    }
}

// adds all assignments, graded discussion topics, and the common ungraded discussions to unit content areas, in that order.
var unitOperations = function(unitNum, contentInfo, unitTitle) {
    var macroCode = "";
    var e = 0;
    var extract = "";
    var j = 0;
    var unitInfo = [];
    var assignments = [];
    var discussions = [];
    var quizzes = [];
    var discussionInfo = [];
    
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
		
		discussionInfo = [6, 1211, "updates_handouts.html", "Unit " + unitNum + " Updates and Handouts", "<a artifacttype=\"html\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-1211_1\" target=\"_blank\" alt=\"\">updates_handouts.html</a>"];
		addUngradedDiscussion(discussionInfo);
		
		discussionInfo = [6, 1212, "ask_your_instructor.html", "Ask Your Instructor", "<a artifacttype=\"html\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-1212_1\" target=\"_blank\" alt=\"\">ask_your_instructor.html</a>"];
		addUngradedDiscussion(discussionInfo);
		return
    } catch(err) {
        alert(err + " unitOperations is having problems.");
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
        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageAssignmentForm ATTR=ID:content_name CONTENT=" + addIIMSpaces(title) + "\n";
        macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:manageAssignmentForm ATTR=ID:content_desc_text CONTENT=" + addIIMSpaces(artifact) + "\n";
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
        if (e != 1) {
            throw "Something went wrong submitting the form to create " + activityCode + ".";
        }

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
        macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
        macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw "Something went wrong adding " + activityCode + " in Unit " + unitNum;
        }
        
        progressMessage += title + ": added\n";
		return
    } catch(err) {
        alert(err + " addDiscussion is having problems.");
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
        message += artifact;
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
        alert(err + " addQuiz is having problems.");
    }
}

// adds discussions that are not included in the grading equation.
var addUngradedDiscussion = function(discussionInfo) {
    var macroCode = "";
    var e = 1;
    var i = 0;
    var contentType = 0;
    var xID = "";
    var fileName = "";
    var linkTitle = "";
    var artifact = "";
    var discussionTopics = [];
    var discID = "";
    
    var buildDiscussion = function(linkTitle, artifact) {
    	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>New<SP>Forum\n";
		e = iimPlay("CODE:" + macroCode);

		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:forumForm ATTR=ID:title CONTENT=" + linkTitle + "\n";
		macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
		macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:forumForm ATTR=ID:descriptiontext CONTENT=" + artifact + "\n";
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
		macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
		macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT=" + artifact + "\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
		e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw "Something went wrong adding " + linkTitle + " to it's content area.";
        }
    }

    try {
        contentType = discussionInfo[0];
        xID = discussionInfo[1];
        fileName = discussionInfo[2];
        linkTitle = addIIMSpaces(discussionInfo[3]);
        artifact = addIIMSpaces("<div class=\"capellaDrawer\">" + discussionInfo[4] + "</div>");

		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Tools\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
		e = iimPlay("CODE:" + macroCode);

		if (xID != 1212) {
			buildDiscussion(linkTitle, artifact);
		} else {
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";        
			macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:itemID EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);            
			extract = iimGetLastExtract();
			
			if (extract.search(/Ask Your Instructor/) === -1) {
				buildDiscussion(linkTitle, artifact);
			} else {
				discussionTopics = extract.match(/<option[\s\S]+?<\/option>/g);
				
				for (i = 0; i <discussionTopics.length; i++) {
					if (discussionTopics[i].search(/Ask Your Instructor/) != -1) {
						discID = discussionTopics[i].match(/_\d+?_1/);
					
						macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";        
						macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:addItemFormId ATTR=ID:rTool_1\n";
						macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:addItemForm ATTR=ID:itemId CONTENT=%" + discID + "\n";
						macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
						e = iimPlay("CODE:" + macroCode);  
                        if (e != 1) {
                            throw "Something went wrong selecting the right option for " + removeIIMSpaces(linkTitle) + ".";
                        }
					
						macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";        
						macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
						macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT=" + artifact + "\n";
						macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
						e = iimPlay("CODE:" + macroCode);    
                        if (e != 1) {
                            throw "Something went wrong adding " + removeIIMSpaces(linkTitle) + ".";
                        }         
					}
				}
			}
		}
		        
        progressMessage += removeIIMSpaces(linkTitle) + ": added\n";
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
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                    macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT=" + addIIMSpaces(artifact) + "\n";
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
        alert(err + " projectOperations is having problems.");
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
        alert(err + " templateInfo is having problems.");
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
    
	try {
	    macroCode = "TAB OPEN\n";
	    macroCode += "TAB T=2\n";
        macroCode += "URL GOTO=https://celeste.capella.edu\n";
        alert("Log into Celeste and click Continue in your iMacros controls.");
        macroCode += "PAUSE\n";
        e = iimPlay("CODE:" + macroCode);
        
        macroCode = "TAG POS=1 TYPE=A ATTR=ID:assToMe_Nav\n";
        macroCode += "WAIT SECONDS=2\n";
		macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:dialogHolder EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        
        assignedRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
        for (i = 0; i < assignedRows.length; i++) {
            if (assignedRows[i].search(courseID) != -1) {
                linkID = assignedRows[i].match(/assToMeContentLink-\d+/);
                
                macroCode = "TAG POS=1 TYPE=A ATTR=ID:" + linkID + "\n";
                macroCode += "WAIT SECONDS=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:childMenu\n";
                macroCode += "WAIT SECONDS=2\n";
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
        
        if (projectTitles === null) {
            macroCode = "TAG POS=1 TYPE=A ATTR=TXT:Logout\n";
            macroCode += "WAIT SECONDS=2\n";
            macroCode += "TAB CLOSE\n";
            e = iimPlay("CODE:" + macroCode);
            if (e != 1) {
                throw e;
            }
            return celesteData
        }
        
        for (i = 0; i < projectTitles.length; i++) {
            projectTitles[i] = projectTitles[i].replace(/Project: /, "");
        }
        
        celesteData.push(projectTitles);
        
        for (i = 0; i < projectTitles.length; i++) {
            components = [];
            macroCode = "TAG POS=1 TYPE=A ATTR=ID:childMenu\n";
            macroCode += "WAIT SECONDS=1\n";
            macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Syllabus\n";
            macroCode += "WAIT SECONDS=1\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Project:<SP>" + addIIMSpaces(projectTitles[i]) + "\n";
            macroCode += "WAIT SECONDS=1\n";
            macroCode += "TAG POS=1 TYPE=H3 ATTR=TXT:Project<SP>Components\n";
            macroCode += "WAIT SECONDS=1\n";
            macroCode += "TAG POS=1 TYPE=TABLE ATTR=ID:componentsList EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            components = extract.match(/u\d{2}[ad]\d{1,2}/g);
            projectComponents.push(components);
        }
        
        celesteData.push(projectComponents);
        
        macroCode = "TAG POS=1 TYPE=A ATTR=TXT:Logout\n";
        macroCode += "WAIT SECONDS=2\n";
        macroCode += "TAB CLOSE\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw e;
        }
        
		return celesteData
    } catch(err) {
        alert(err + " celesteDataCapture is having problems.");
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
				artifact = "<a target=\"_blank\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    */
		    if (rowsToScan[i].search(/u\d{2}a\d{1,2}\.html/) != -1) {
				contentType = 5;
				fileName = rowsToScan[i].match(/u\d{2}a\d{1,2}\.html/)[0];
				linkTitle = "View Assignment Instructions";
				artifact = "<a target=\"_blank\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    
		    if (rowsToScan[i].search(/u\d{2}d\d{1,2}\.html/) != -1) {
				contentType = 6;
				fileName = rowsToScan[i].match(/u\d{2}d\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		    
		    if (rowsToScan[i].search(/u\d{2}q\d{1,2}\.html/) != -1) {
				contentType = 7;
				fileName = rowsToScan[i].match(/u\d{2}q\d{1,2}\.html/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@.capella.edu/bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);
		    }
		}
		
		progressMessage += "";
		return contentInfo
    } catch(err) {
        alert(err + " xIDs is having problems.");
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
        alert(err + " goToCourseID is having problems.");
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
        alert(err + " enrollInCourseID is having problems.");
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
        alert(err + " unenrollInCourseID is having problems.");
    }
}

// controls all the gradebook setup operations.
var gradebook = function() {
    var macroCode = "";
    var e = "";
    var extract = "";
    var gradingTableRows = [];
    var i = 0;
    var gradedDiscussions = [];
    
    // smartview operations.
    var smartViews = function() {
        var macroCode = "";
        var e = "";
        var extract = "";
        var contextualMenuIdNumber = "";
        var smartViewRows = [];
        
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
                    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:name CONTENT=" + newTitle + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:AddModifyCustomViewsForm ATTR=ID:favoriteCbox CONTENT=YES\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:custom_view_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                }
            }
        }
        
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
            editSmartview("Discussion Boards", "Discussions");
            editSmartview("Tests", "Quizzes");
            
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
            e = iimPlay("CODE:" + macroCode);
		
            progressMessage += "\n";
            return
        } catch(err) {
            alert(err + " editSmartView is having problems.");
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
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>Calculated<SP>Column\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Weighted<SP>Column\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:columnName CONTENT=Discussion<SP>Participation\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:gradebookDisplayName CONTENT=Disc.<SP>Participation\n";
            macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:prms_left_select EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
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
                        colWeightID++;
                    }
                }
            }
            
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
            e = iimPlay("CODE:" + macroCode);
            
        } catch(err) {
            alert(err + " discussionParticipationCol is having problems.");
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
            alert(err + " currentGradeCol is having problems.");
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
            alert(err + " finalGradeCol is having problems.");
        }
    }
    
    // sets up the Current Grade Column (it includes individually graded topics).
	var arrangeColumns = function() {
        var macroCode = "";
        var e = "";
        var extract = "";
        var orgRowNum = 0;
        var reorderItems = [];
        var id = 0;
        
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
				if (reorderItems[i].search(/Final Grade/) != -1) {
					id = reorderItems[i].match(/item_(\d+)/)[1];
					clicks(id, orgRowNum);
				}
			}
			
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
			
			macroCode = "TAB T=1\nFRAME F=2\n";		
			macroCode += "TAG POS=1 TYPE=BUTTON ATTR=ID:gpRepoApply\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:gradingPeriodLayoutForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
			e = iimPlay("CODE:" + macroCode);
			
        } catch(err) {
            alert(err + " arrangeColumns is having problems.");
        }
    }

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
        
        smartViews();
		discussionParticipationCol(gradedDiscussions);
		currentGradeCol(gradingTableRows, gradedDiscussions);
		finalGradeCol(gradingTableRows, gradedDiscussions);
		arrangeColumns();
		
		progressMessage += "\n";
		return
    } catch(err) {
        alert(err + " gradebook is having problems.");
    }
}

courseID = templateInfo();
goToCourseID(bb9_courseID, userName);
cycleThroughUnits(celesteDataCapture(courseID)); // edit unitOperations() to add/remove an operation
gradebook();
unenrollInCourseID(bb9_courseID);
