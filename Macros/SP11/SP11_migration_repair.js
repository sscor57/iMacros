/*
Instructions: log into any SP11 instance of BB9, navigate to a course or template, launch the macro.
*/

// replaces a space character (' ') in a string with an iMacros space entity ('<SP>').
var addIIMSpaces = function(anyStringWithSpaces) {
    var newString = "";
	try {
		newString = anyStringWithSpaces.replace(/ /g, "<SP>");
		return newString
    } catch(err) {
        alert(err + " addIIMSpaces is having problems.");
    }
}

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
        alert(err + " editModeON is having problems.");
    }
}

var fixManifestoInstitionItems = function() {
	var macroCode = "";
	var e = 0;
	var contentAreas = [];
	var i = 0;
	var artifactLinks = [];

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
        var assignmentCode = "";
        var assNum = "";
        var assType = "";
    
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
        
            if (projectTitles != null) {
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
            } else {
                celesteData.push(projectTitles);
                celesteData.push(projectComponents);
            }
        
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
	
	var tii = function(celesteData) {
        var i = 0;
        var j = 0;
        var macroCode = "";
        var e = 0;
        var turnitinData = celesteData[3];
        var tiiTitle = "";
        var tiiType = "";
        var addTIIFrame = 0;
        var nextFrame = 0;

        try {
            // begin Turnitin
            lnavButtonClick("Turnitin");
            progressMessage += "Turnitin Operations:\n";
        
            addTIIFrame = 2;
            nextFrame = 5;
            for (i = 0; i < turnitinData.length; i++) {
                tiiTitle = turnitinData[i][0];
                tiiType = turnitinData[i][1];
            
                if (tiiType === "final") {
                    tiiType = 0;
                } else {
                    tiiType = 1;
                }
            
                macroCode = "SET !TIMEOUT_STEP 1\n";
                macroCode += "TAB T=1\nFRAME F=" + addTIIFrame + "\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Assessments\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Turnitin<SP>Assignment\n";
                e = iimPlay("CODE:" + macroCode);
                if (e != 1) {
                    macroCode = "SET !TIMEOUT_STEP 1\n";
                    macroCode += "TAB T=1\nFRAME F={{loop}}\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Assessments\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Turnitin<SP>Assignment\n";
                    j = 0;
                    while (true) {
                        iimSet("loop", j);
                        if (iimPlay("CODE:" + macroCode) == 1) {
                            break;
                        }
                        j++;
                    }
                }
            
                macroCode = "TAB T=1\nFRAME F=" + nextFrame + "\n";
                macroCode += "TAG POS=1 TYPE=BODY ATTR=TXT:* EXTRACT=HTM\n";
                e = iimPlay("CODE:" + macroCode);
                extract = iimGetLastExtract();
                
                if (extract.search(/<h2>user agreement<\/h2>/) > -1) {
                    macroCode = "TAB T=1\nFRAME F=" + nextFrame + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:new_user5 ATTR=NAME:submit&&VALUE:I<SP>agree<SP>--<SP>continue\n";
                    macroCode += "TAG POS=1 TYPE=BODY ATTR=TXT:* EXTRACT=HTM\n";
                    e = iimPlay("CODE:" + macroCode);
                } 
            
                if (extract.search(/<h2>Select your assignment type<\/h2>/) > -1) {
                    macroCode = "TAB T=1\nFRAME F=" + nextFrame + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:pa\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:assignment_create_form ATTR=NAME:submit&&VALUE:Next<SP>Step\n";
                    e = iimPlay("CODE:" + macroCode);
                }
            
                macroCode = "SET !TIMEOUT_STEP 1\n";
                macroCode += "TAB T=1\nFRAME F=" + nextFrame + "\n";
                macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:assignment ATTR=ID:title CONTENT=" + addIIMSpaces(tiiTitle) + "\n";
                macroCode += "TAG POS=1 TYPE=SPAN ATTR=ID:display_due_date\n";
                macroCode += "TAG POS=21 TYPE=SELECT ATTR=* CONTENT=%11\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:>>\n";
                macroCode += "TAG POS=21 TYPE=SELECT ATTR=* CONTENT=%11\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:>>\n";
                macroCode += "TAG POS=21 TYPE=SELECT ATTR=* CONTENT=%11\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:31\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Optional<SP>settings\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:late_accept_flag_1\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:generate_reports_1\n";
                macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:assignment ATTR=ID:report_gen_speed CONTENT=%" + tiiType + "\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:use_biblio_exclusion_0\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:use_quoted_exclusion_0\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:use_small_matches_1\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:exclude_by_words_radio\n";
                macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:assignment ATTR=ID:exclude_by_words_value CONTENT=8\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:students_view_reports_1\n";
                macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:bb_use_postdate_0\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:assignment_create_form ATTR=NAME:submit_form&&VALUE:Submit\n";
                macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/common/ok_off.gif?course_id=_*_1\n";
                e = iimPlay("CODE:" + macroCode);
                if (e == 1) {
                    nextFrame += 2;
                }
                if (e != 1) {
                    macroCode = "SET !TIMEOUT_STEP 1\n";
                    macroCode += "TAB T=1\nFRAME F={{loop}}\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:assignment ATTR=ID:title CONTENT=" + addIIMSpaces(tiiTitle) + "\n";
                    macroCode += "TAG POS=1 TYPE=SPAN ATTR=ID:display_due_date\n";
                    macroCode += "TAG POS=21 TYPE=SELECT ATTR=* CONTENT=%11\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:>>\n";
                    macroCode += "TAG POS=21 TYPE=SELECT ATTR=* CONTENT=%11\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:>>\n";
                    macroCode += "TAG POS=21 TYPE=SELECT ATTR=* CONTENT=%11\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:31\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Optional<SP>settings\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:late_accept_flag_1\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:generate_reports_1\n";
                    macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:assignment ATTR=ID:report_gen_speed CONTENT=%" + tiiType + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:use_biblio_exclusion_0\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:use_quoted_exclusion_0\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:use_small_matches_1\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:exclude_by_words_radio\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:assignment ATTR=ID:exclude_by_words_value CONTENT=8\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:students_view_reports_1\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:assignment_create_form ATTR=ID:bb_use_postdate_0\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:assignment_create_form ATTR=NAME:submit_form&&VALUE:Submit\n";
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/common/ok_off.gif?course_id=_*_1\n";
                    j = 0;
                    while (true) {
                        iimSet("loop", j);
                        if (iimPlay("CODE:" + macroCode) == 1) {
                            alert(j);
                            nextFrame = j + 2;
                            break;
                        }
                        j++;
                    }
                }
                addTIIFrame += 2;
            }
        
            // the tii building block does crazy things to the frameset. this gets things back to normal.
            macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
            macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
            macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT=" + bb9_courseID + "\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
            e = iimPlay("CODE:" + macroCode);
    
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:" + bb9_courseID + "\n";
            e = iimPlay("CODE:" + macroCode);
            // end Turnitin
        } catch(err) {
            alert(err + " editModeON is having problems.");
        }
    }
	
	var createArtifact = function(searchPattern, artifactRows) {
		var j = 0;
		var xID = "";
		var title = "";
		var artifact = "";
	
        try {
            for (j = 0; j < artifactRows.length; j++) {
                if (artifactRows[j].search(searchPattern) != -1) {
                    xID = artifactRows[j].match(/id=\"(\d+)_1_xythosFileSize\"/)[1];
                    title = artifactRows[j].match(searchPattern);
                	artifact = "<a artifacttype=\"html\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@/bbcswebdav/xid-" + xID + "_1\" target=\"_blank\" alt=\"\">" + title + "</a>";
                }
            }
            return artifact
        } catch(err) {
		    alert(err + "\nSomething went wrong with createArtifact");
		}
	}
	
	var captureArtifactLinks = function() {
		var macroCode = "";
		var e = 0;
		var artifactRows = [];
		var artifactLinks = [];
		var xID = "";
		var artifact = "";
		var title = "";
		
	    try {
            macroCode = "SET !VAR1 {{!URLCURRENT}}\n";
            macroCode += "TAB OPEN\n";
            macroCode += "TAB T=2\n";
            macroCode += "URL GOTO={{!VAR1}}\n";
            e = iimPlay("CODE:" + macroCode);
            
            macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
            macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Content<SP>Collection\n";
            e = iimPlay("CODE:" + macroCode);
            
            macroCode = "TAB T=1\nFRAME NAME=\"WFS_Files\"\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
			macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:filesForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
            e = iimPlay("CODE:" + macroCode);
            
            macroCode = "FRAME NAME=\"WFS_Navigation\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Institution<SP>Content\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:institution\n";
            macroCode += "FRAME NAME=\"WFS_Files\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:*_Print\n";
            e = iimPlay("CODE:" + macroCode);
            
            macroCode = "TAB T=1\nFRAME NAME=\"WFS_Files\"\n";
            macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            artifactRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
            artifactLinks.push(createArtifact(/OOB_PrintSP11\.html/i, artifactRows));
            
            macroCode = "FRAME NAME=\"WFS_Navigation\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Institution<SP>Content\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:institution\n";
            macroCode += "FRAME NAME=\"WFS_Files\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:*_Discussions\n";
            e = iimPlay("CODE:" + macroCode);
            
            macroCode = "TAB T=1\nFRAME NAME=\"WFS_Files\"\n";
            macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();+
            macroCode = "FRAME NAME=\"WFS_Navigation\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Institution<SP>Content\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:institution\n";
            macroCode += "FRAME NAME=\"WFS_Files\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:*_Getting_Started\n";
            e = iimPlay("CODE:" + macroCode);
            
            macroCode = "TAB T=1\nFRAME NAME=\"WFS_Files\"\n";
            macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            artifactRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
            artifactLinks.push(createArtifact(/learner_response_required\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/policies_procedures\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/review_syllabus_and_project\.html/i, artifactRows));
            
            macroCode = "TAB CLOSE\n";
            e = iimPlay("CODE:" + macroCode);
            return artifactLinks
		} catch(err) {
		    alert(err + "\nSomething went wrong with captureArtifactLinks");
		}
	}
	
	var extractLNav = function() {
		var macroCode = "";
		var e = 0;
		var lnavLIs = [];
		var i = 0;
		var buttonTitle = "";
		var buttonTitles = [];
	    
	    try {
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
    
            lnavLIs = extract.match(/<li[\s\S]+?<\/li>/g);
    
            for (i = 0; i < lnavLIs.length; i++) {
                if (lnavLIs[i].search(/Getting Started|Syllabus|(Course Project(?: \d){0,1})|Unit \d{1,2}/g) != -1) {
                    buttonTitle = lnavLIs[i].match(/(Getting Started)|(Syllabus)|((Course Project(?: \d){0,1}))|(Unit \d{1,2})/g)[1];
                    buttonTitles.push(buttonTitle);
                }
            }
            
            return buttonTitles
		} catch(err) {
		    alert(err + "\nSomething went wrong with extractLNav");
		}
		
	}

    var captureContentAreas = function() {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contentLIs = [];
        
        try {
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
    
            contentLIs = extract.match(/<li[\s\S]+?<\/li>/g);
            return contentLIs
        } catch(err) {
		    alert(err + "\nSomething went wrong with captureContentAreas");
		}
    }
    
    var getArtifact = function(searchPattern, artifactLinks) {
        var artifact = "";
        
        try {
            for (j = 0; j < artifactLinks.length; j++) {
                if (artifactLinks[j].search(searchPattern) != -1) {
                    artifact = artifactLinks[j];
                }
            }
            return artifact
        } catch(err) {
            alert(err + "\nSomething went wrong with getArtifact");
        }
    }
    
    var fixPrint = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contentLIs = [];
        var contextualMenuIdNumber = "";
        var artifact = "";
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/OOB_PrintSP11\.html/i, artifactLinks);
            contextualMenuIdNumber = contentLIs[0].match(/cmlink_(\w{32})/)[1];
        
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
			macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
			macroCode += "TAB T=2\n";
			macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces(artifact) + "\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
			e = iimPlay("CODE:" + macroCode);
			if (e != 1) {
				throw "Something went wrong using the VTBE.";
			}
	
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";  
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit";
            e = iimPlay("CODE:" + macroCode);
            return
		} catch(err) {
		    alert(err + "\nSomething went wrong with fixPrint");
		}
    }
    
    var fixAccordion = function() {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contentLIs = [];
        var contextualMenuIdNumber = "";
        var artifact = "";
        
        try {
            contentLIs = captureContentAreas();
            artifact = "<p></p><script type=\"text/javascript\" src=\"//media.capella.edu/Blackboard9/js/CR3/bb9SP11_Layout_accordion_v01.js\"></script>";
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/Accordi[ao]n/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces(artifact) + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";  
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
		    alert(err + "\nSomething went wrong with fixAccordion");
		}
    }
    
    var fixPoliciesProcedures = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/policies_procedures\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/policies_procedures\.html/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixPoliciesProcedures");
        }
    }
    
    var fixReviewSyllabus = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/review_syllabus_and_project\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/review_syllabus_and_project\.html|review_syllabus\.html/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixReviewSyllabus");
        }
    }
    
    var fixWelcomeIntroductions = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/welcome_and_introductions\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/welcome_and_introductions\.html/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:top_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixWelcomeIntroductions");
        }
    }
    
    var fixFacultyExpectations = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/faculty_expectations\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/faculty_expectations\.html/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:top_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixFacultyExpectations");
        }
    }
    
    var fixUpdatesHandouts = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/updates_handouts\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/updates_handouts\.html/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:top_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixUpdatesHandouts");
        }
    }
    
    var fixAskYourInstructor = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/ask_your_instructor\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/ask_your_instructor\.html/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:top_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixAskYourInstructor");
        }
    }
    
    var fixSupplementalInstruction = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/supplemental_instruction\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/Supplemental Instruction</) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:top_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixSupplementalInstruction");
        }
    }
    
    var fixFCSGettingStarted = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/first_course_support_getting_started\.html/, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/first_course_support_getting_started\.html/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixFCSGettingStarted");
        }
    }
    
    var fixFCS = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/first_course_support\.html/, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/first_course_support\.html/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixFCS");
        }
    }
    
    var fixFCSFinalUnit = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/first_course_support_final_unit\.html/, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/first_course_support_final_unit\.html/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
					macroCode += "TAG POS=1 TYPE=SPAN ATTR=CLASS:mceIcon<SP>mce_code\n";
					macroCode += "TAB T=2\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT=" + addIIMSpaces("<div class=\"capellaDrawer\">" + artifact + "</div>") + "\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
					e = iimPlay("CODE:" + macroCode);
					if (e != 1) {
						throw "Something went wrong using the VTBE.";
					}
		
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixFCSFinalUnit");
        }
    }
    
    try {
    	editModeON();
        contentAreas = extractLNav();
        artifactLinks = captureArtifactLinks();
        
        for (i = 0; i < contentAreas.length; i++) {
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:" + addIIMSpaces(contentAreas[i]) + "\n";
            e = iimPlay("CODE:" + macroCode);
            
            fixPrint(artifactLinks);
            fixAccordion();
            fixPoliciesProcedures(artifactLinks);
            fixReviewSyllabus(artifactLinks);
            fixWelcomeIntroductions(artifactLinks);
            fixFacultyExpectations(artifactLinks);
            fixUpdatesHandouts(artifactLinks);
            fixAskYourInstructor(artifactLinks);
            fixSupplementalInstruction(artifactLinks);
            fixFCSGettingStarted(artifactLinks);
            fixFCS(artifactLinks);
            fixFCSFinalUnit(artifactLinks);
        }
        return
    } catch(err) {
        alert(err + "\nSomething went wrong with fixManifestoInstitionItems");
    }
}

fixManifestoInstitionItems();
