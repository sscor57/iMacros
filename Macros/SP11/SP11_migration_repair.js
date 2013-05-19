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

var getBB9_courseID = function() {
    var macroCode = "";
    var e = 0;
    var extract = "";
    
    try {
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:courseMenuPalette_paletteTitleHeading EXTRACT=TXT\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        
        bb9_courseID = extract.match(/TEMPLATE_\w+?\d+?(?:\w+?-\w+?)*_\d+/)[0];
        return bb9_courseID
    } catch(err) {
        alert(err + ": getBB9_courseID is having problems.");
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

var templateSetup = function() {
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
            alert(err + " celesteDataCapture is having problems.");
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
        var contentType = 0; // 0 = print artifact, 1 = unitX_introduction.html, 2 = unitX_objectives.html, 3 = accordion, 4 = study, 5 = assignment, 6 = discussion, 7 = quiz
        var xID = "";
        var fileName = "";
        var linkTitle = "";
        var artifact = "";
    
        try {
            lnavButtonClick("Getting Started");
            
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
                
                if (rowsToScan[i].search(/u\d{2}s\d{1,2}\.html/) != -1) {
                    contentType = 4;
                    fileName = rowsToScan[i].match(/u\d{2}s\d{1,2}\.html/)[0];
                    linkTitle = fileName;
                    artifact = "<a target=\"_blank\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
                    artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
                    contentInfo.push(artifactInfo);
                }
                
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
            return contentInfo
        } catch(err) {
            alert(err + "\n: xIDs is having problems.");
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
            
            macroCode = "FRAME NAME=\"WFS_Navigation\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Institution<SP>Content\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:institution\n";
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
            extract = iimGetLastExtract();
            
            artifactRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
            artifactLinks.push(createArtifact(/ask_your_instructor\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/faculty_expectations\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/first_course_support\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/first_course_support_final_unit\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/first_course_support_getting_started\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/MBA6004_welcome_and_introductions\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/supplemental_instruction\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/updates_handouts\.html/i, artifactRows));
            artifactLinks.push(createArtifact(/welcome_and_introductions\.html/i, artifactRows));
            
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
            macroCode = "SET !TIMEOUT_STEP 1\n";
            macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
    
            contentLIs = extract.match(/<li[\s\S]+?<\/li>/g);
            
            if (contentLIs === null) {
                return []
            } else {
                return contentLIs
            }
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
                if (contentLIs[j].search(/Policies and Procedures</) != -1) {
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
    
    var fixReviewCourseContent = function(artifactLinks) {
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
                if (contentLIs[j].search(/Review Course Content|Review Syllabus/) != -1) {
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
            alert(err + "\nSomething went wrong with fixReviewCourseContent");
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
                if (contentLIs[j].search(/>Welcome and Introductions</) != -1) {
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
                if (contentLIs[j].search(/>Faculty Expectations</) != -1) {
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
    
    var updatesHandoutsCheck = function() {
        var macroCode = "";
        var e = "";
        var extract = "";
        var contentAreas = [];
        
        try {
            
            lnavButtonClick("Discussions");
            
            macroCode = "SET !TIMEOUT_STEP 1\n";
            macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=TABLE ATTR=ID:listContainer_datatable EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            if (extract.match(/Updates and Handouts</g) === null) {
                return false
            }
            if (extract.match(/Updates and Handouts</g).length > 1) {
                return true
            } else {
                return false
            }
        } catch(err) {
            alert(err + "\n: updatesHandoutsCheck is having problems.");
        }
    }
    
    var rebuildUpdatesHandouts = function(discussionInfo) {
        var macroCode = "";
        var e = 1;
        var i = 0;
        var contentType = 0;
        var xID = "";
        var fileName = "";
        var linkTitle = "";
        var artifact = "";
        var discussionTopics = [];

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
                alert(err + ": toggleCreateNewForum is having problems.");
            }
        }
    
        var toggleDiscussionTool = function() {
            var macroCode = "";
            var e = 0;
        
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Tools\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
            e = iimPlay("CODE:" + macroCode);
            return
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
                return
            } catch(err) {
                alert(err + ": buildDiscussion is having problems.");
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
                alert(err + ": courseWideDiscussion is having problems.");
            }
        }

        var UHReorder = function() {
            var macroCode = "";
            var e = 0;
            var extract = "";
            var pageOptions = [];
            var i = 0;
            
            try {
                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Keyboard<SP>Accessible<SP>Reordering:<SP>Content\n";
                macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:pageListReorderControlSelect EXTRACT=HTM\n";
                e = iimPlay("CODE:" + macroCode);
                extract = iimGetLastExtract();
                
                pageOptions = extract.match(/<option[\s\S]+?<\/option>/g);
                
                for (i = 0; i < pageOptions.length; i++) {
                    if (pageOptions[i].search(/Unit \d{1,2} Updates and Handouts/) != -1) {
                        orderID = pageOptions[i].match(/_\d+?_1/)[0];
                    }
                }
                
                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:pageListReorderControlSelect CONTENT=%" + orderID + "\n";
                macroCode += "TAG POS=1 TYPE=BUTTON ATTR=TITLE:Move<SP>Up&&TYPE:button&&TXT:\n";
                macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
                macroCode += "TAG POS=1 TYPE=BUTTON ATTR=TXT:Submit\n";
                e = iimPlay("CODE:" + macroCode);
                return
            } catch(err) {
                alert(err + ": UHReorder is having problems.");
            }
        }

        try {
            contentType = discussionInfo[0];
            xID = discussionInfo[1];
            fileName = discussionInfo[2];
            linkTitle = discussionInfo[3];
            artifact = addIIMSpaces("<div class=\"capellaDrawer\">" + discussionInfo[4] + "</div>");
            
            macroCode = "SET !TIMEOUT_STEP 1\n";
            macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            if (extract.search(/Updates and Handouts</) != -1) {
                return
            }
    
            contentLIs = extract.match(/<li[\s\S]+?<\/li>/g);
            
            if (xID == 1651) {
                courseWideDiscussion(linkTitle, artifact);
            } else {
                buildDiscussion(linkTitle, artifact);
            }
            
            UHReorder();
            return
        } catch(err) {
            alert(err + " rebuildUpdatesHandouts is having problems.");
        }
    }
    
    var deleteUpdatesHandouts = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var artifact = "";
        var contentLIs = [];
        var contextualMenuIdNumber = "";
    
        try {
            lnavButtonClick("Discussions");
            
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";    
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
            macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:conferenceForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
            e = iimPlay("CODE:" + macroCode);
            
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            contentLIs = extract.match(/<tr[\s\S]+?<\/tr>/g);
            artifact = getArtifact(/updates_handouts\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/Updates and Handouts/) != -1) {
                    checkbox = contentLIs[j].match(/listContainer_formCBs_\d+?_1/)[0];
            
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:conferenceForm ATTR=ID:" + checkbox + " CONTENT=YES\n";
                    e = iimPlay("CODE:" + macroCode);
                }
            }
            
            if (extract.search(/Updates and Handouts/) != -1) {
                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_link_removeListAction_bottom\n";
                e = iimPlay("CODE:" + macroCode);
            }
            return
        } catch(err) {
            alert(err + ": deleteUpdatesHandouts is having problems.");
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
                if (contentLIs[j].search(/Updates and Handouts</) != -1) {
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
                if (contentLIs[j].search(/>Ask Your Instructor</) != -1) {
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
    
    var enrollInCourseID = function(userName, bb9_courseID, role) {
        var macroCode = "";
        var e = "";
        var extract = "";
        var contextualMenuIdNumber = "";

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
        
                macroCode = "TAB T=1\nFRAME F=2\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=TXT:" + bb9_courseID + "\n";
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

    var addTII = function(celesteData, bb9_courseID) {
        var x = 0;
    
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
                    alert(err + ": buildTIIAssignment is having problems.");
                }
            }
    
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
                alert(err + ": hideTIIColumns is having problems.");
            }
        }
    
        try {
            createTIIAssignments(celesteData, bb9_courseID);
            hideTIIColumns(celesteData)
            x++;
        } catch(err) {
            alert(err + ": addTII is having problems.");
        }
    }
    
    var tiiCheck = function(celesteData) {
        var macroCode = "";
        var e = "";
        var extract = "";
        var contentAreas = [];
        var tiiData = celesteData[3];
        
        try {        
            lnavButtonClick("Turnitin");
            if (captureContentAreas().length === null) {
                return false
            } else if (captureContentAreas().length != tiiData.length) {
                return true
            }
        } catch(err) {
            alert(err + "\n: tiiCheck is having problems.");
        }
    }
    
    var bb9_courseID = "";
    var unitNum = "";
    var discussionInfo = [];
    var contentInfo = [];
    
    try {
    	editModeON();
    	bb9_courseID = addIIMSpaces(getBB9_courseID());
    	enrollInCourseID(prompt("Enter your user ID:", "CP_cswope"), bb9_courseID, "C");
    	contentInfo = xIDs();
    	celesteData = celesteDataCapture(prompt("Enter the Capella Course ID:", bb9_courseID.match(/_(\w+?\d+?(?:\w+?-\w+?)*)_/)[1]));
        contentAreas = extractLNav();
        artifactLinks = captureArtifactLinks();
        
        if (updatesHandoutsCheck()) {
            deleteUpdatesHandouts(artifactLinks);
        }
        
        for (i = 0; i < contentAreas.length; i++) {
            lnavButtonClick(contentAreas[i]);
            fixPrint(artifactLinks);
            fixAccordion();

            if (contentAreas[i].search(/Getting Started/) != -1) {
                fixPoliciesProcedures(artifactLinks);
                fixReviewCourseContent(artifactLinks);
                fixWelcomeIntroductions(artifactLinks);
                fixFacultyExpectations(artifactLinks);
                fixFCSGettingStarted(artifactLinks);
            }

            if (contentAreas[i].search(/Unit \d{1,2}/) != -1) {
                unitNum = contentAreas[i].match(/Unit (\d{1,2})/)[1];
                discussionInfo = [6, 1651, "updates_handouts.html", "Unit " + unitNum + " Updates and Handouts", "<a artifacttype=\"html\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-1651_1\" target=\"_blank\" alt=\"\">updates_handouts.html</a>"];
                rebuildUpdatesHandouts(discussionInfo);
                fixUpdatesHandouts(artifactLinks);
                fixAskYourInstructor(artifactLinks);
                fixFCS(artifactLinks);
                fixFCSFinalUnit(artifactLinks);
                fixSupplementalInstruction(artifactLinks);
            }
        }
        
    	if (tiiCheck(celesteData)) {
            addTII(celesteData, bb9_courseID);
        }
        return
    } catch(err) {
        alert(err + "\nSomething went wrong with templateSetup");
    }
}

templateSetup();
