var userName = "cswope";
var bb9_courseID = "";
var courseID = "";
var courseList = [];
var x = 0;

// clicks on a left nav buttons title text.
var lnavButtonClick = function(button) {
    var macroCode = "";
    var e = 0;
    var iimButton = "";

	try {
        iimButton = addIIMSpaces(button);
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:" + iimButton + "\n";
        e = iimPlay("CODE:" + macroCode);
        return
    } catch(err) {
        alert(err + ": lnavButtonClick is having problems.");
    }
}

// replaces a space character (' ') in a string with an iMacros space entity ('<SP>').
var addIIMSpaces = function(anyStringWithSpaces) {
    var newString = "";
	newString = anyStringWithSpaces.replace(/ /g, "<SP>");
	return newString
}

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
    var assignmentCode = "";
    var assNum = "";
    var assType = "";
    
	try {
	    macroCode = "TAB OPEN\n";
	    macroCode += "TAB T=2\n";
        macroCode += "URL GOTO=https://celeste.capella.edu\n";
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
                e = iimPlay("CODE:" + macroCode);
            }
        }
        
		celesteData.push(unitTitles);
		celesteData.push(projectTitles);
        celesteData.push(projectComponents);
        
        
        assignments.push(["1 - Draft", "draft"])
        assignments.push(["2 - Draft", "draft"])
        
        macroCode = "TAG POS=1 TYPE=A ATTR=ID:childMenu\n";
        macroCode += "WAIT SECONDS=2\n";
        macroCode += "TAG POS=2 TYPE=A ATTR=TXT:Activities\n";
        macroCode += "WAIT SECONDS=2\n";
        macroCode += "TAG POS=1 TYPE=UL ATTR=ID:assignmentsList EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        
        assignmentRows = extract.match(/<li[\s\S]+?<\/li>/g);
        
        for (i = 0; i < assignmentRows.length; i++) {
            assignmentCode = assignmentRows[i].match(/u\d{2}a\d{1,2}/)[0];
            unitNum = assignmentCode.match(/u(\d{2})a\d{1,2}/)[1];
            assNum = assignmentCode.match(/u\d{2}a(\d{1,2})/)[1];
            unitNum++;
            unitNum--;
            if (assignmentRows[i].search(/draft/i) > -1) {
            	assType = "draft";
            } else {
            	assType = "final";
            }
            assignment = ["[" + assignmentCode + "] Unit " + unitNum + " Assignment " + assNum, assType];
            assignments.push(assignment);
        }
        
        celesteData.push(assignments);
        macroCode += "TAB CLOSE\n";
        e = iimPlay("CODE:" + macroCode);
        if (e != 1) {
            throw e;
        }
        
		return celesteData
    } catch(err) {
        alert(err + ": celesteDataCapture is having problems.");
    }
}

var captureCourseList = function() {
    var macroCode = "";
    var e = "";
    var extract = "";
    var tableRows = [];
    var courseList = [];
    var i = 0;
    var bb9_courseID = "";
    var courseID = "";
    
    try {
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		tableRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
		
		for (i = 0; i < tableRows.length; i++) {
		    bb9_courseID = tableRows[i].match(/\w{2,4}\d{3,4}_\d{6}_\d_\d{4}_\w\d{2}_\d+?(?=<)/)[0];
		    courseID = bb9_courseID.match(/^.+?(?=_)/);
		    if (bb9_courseID != null) {
		        courseList.push(bb9_courseID);
		    }
		} 
		
        return courseList
    } catch(err) {
        alert(err + ": captureCourseList is having problems.");
    }
}

var goToCourseID = function(bb9_courseID, userName) {
    var macroCode = "";
    var e = "";
    var extract = "";
    var searchPattern = "";

    try {
        macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT=" + bb9_courseID + "\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
        e = iimPlay("CODE:" + macroCode);
        
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
			return true
		} else if (extract.search(userName) != -1) {
			return true
		} else {
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
		return
    } catch(err) {
        alert(err + " unenrollInCourseID is having problems.");
    }
}

var createTIIAssignments = function(celesteData, bb9_courseID) {
    var i = 0;
    var j = 0;
    var macroCode = "";
    var e = 0;
	var turnitinData = celesteData[3];

    var buildTIIAssignment = function(turnitinData) {
        var macroCode = "";
        var e = "";
        var extract = "";
        var tiiTitle = turnitinData[0];
        var tiiType = turnitinData[1];
        var bbframe = 0;
        var tiiframe = 0;
        
        try {
            lnavButtonClick("Turnitin");
			
			macroCode = "SET !TIMEOUT_STEP 1\n";
			macroCode += "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
			iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
			
			if (extract.search(tiiTitle) == -1) {
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
                /*
                if (extract.search(/<h2>user agreement<\/h2>/i) > -1) {
                    macroCode = "TAB T=1\nFRAME F=" + tiiframe + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:new_user5 ATTR=NAME:submit&&VALUE:I<SP>agree<SP>--<SP>continue\n";
                    macroCode += "TAG POS=1 TYPE=BODY ATTR=TXT:* EXTRACT=HTM\n";
                    e = iimPlay("CODE:" + macroCode);
                }
                */
            
                if (extract.search(/<h2>Select your assignment type<\/h2>/) > -1) {
                    macroCode = "TAB T=1\nFRAME F=5\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:pa\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:assignment_create_form ATTR=NAME:submit&&VALUE:Next<SP>Step\n";
                    e = iimPlay("CODE:" + macroCode);
                }
            
                macroCode = "SET !TIMEOUT_STEP 1\n";
                macroCode += "TAB T=1\nFRAME F=5\n"
                macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:assignment ATTR=ID:title CONTENT=" + addIIMSpaces(tiiTitle) + "\n";
                macroCode += "TAG POS=1 TYPE=SPAN ATTR=ID:display_due_date\n";
                macroCode += "TAG POS=15 TYPE=SELECT ATTR=* CONTENT=%11\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:>>\n";
                macroCode += "TAG POS=15 TYPE=SELECT ATTR=* CONTENT=%11\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:>>\n";
                macroCode += "TAG POS=15 TYPE=SELECT ATTR=* CONTENT=%11\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:31\n";
                macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:https://ne.edgecastcdn.net/800404/www.turnitin.com/image_bin/icons/cms/turnitin/small_16/expand.gif\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:late_accept_flag_1\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:generate_reports_1\n";
                macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:assignment ATTR=ID:report_gen_speed CONTENT=%" + tiiType + "\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:use_small_matches_1\n";
                macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:assignment ATTR=ID:exclude_by_words_value CONTENT=8\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:students_view_reports_1\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:bb_use_postdate_0\n";
                macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:assignment ATTR=ID:submit_papers_to CONTENT=%2\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:assignment_create_form ATTR=NAME:submit_form&&VALUE:Submit\n";
                macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/common/ok_off.gif?course_id=_*_1\n";
                e = iimPlay("CODE:" + macroCode);
                
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
            } else {
			    return
            }
            
		
        } catch(err) {
            alert(err + ": buildTIIAssignment is having problems.");
        }
    }
	
	try {
	    
	    for (i = 0; i < turnitinData.length; i++) {
	        buildTIIAssignment(turnitinData[i]);
	    }
    	// end Turnitin
    } catch(err) {
    	alert(err + ": createTIIAssignments is having problems.");
    }
}
    
// hides the turnitin assignment columns 
var hideTIIColumns = function(celesteData) {
    var macroCode = "";
    var e = "";
    var extract = "";
    var thCols = [];
    var i = 0;
    var tiiCols = [];
    var j = 0;
    var turnitinData = celesteData[3];
    
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
            alert(err + " screenReaderON is having problems.");
        }
    }
    
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
        alert(err + ": hideTIIColumns is having problems.");
    }
}

courseList = ["FD3005_005999_1_1133_J06_14"];

celesteData = celesteDataCapture("FD3005");
x = 0;
while (x < courseList.length) {
    bb9_courseID = courseList[x];
    courseID = bb9_courseID.match(/^.+?(?=_)/);
    goToCourseID(bb9_courseID, userName);
    //createTIIAssignments(celesteData, bb9_courseID);
    hideTIIColumns(celesteData)
    x++;
}