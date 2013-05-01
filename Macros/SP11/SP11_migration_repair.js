/*
Instructions: log into any SP11 instance of BB9, navigate to a course or template, launch the macro.
*/

// replaces a space character (' ') in a string with an iMacros space entity ('<SP>').
var addIIMSpaces = function(anyStringWithSpaces) {
    var newString = "";
	try {
		newString = anyStringWithSpaces.replace(/ /g, "<SP>");
		return newString
	} catch (err) {
		alert(err);
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
				throw "Something went wrong using the VTE.";
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
						throw "Something went wrong using the VTE.";
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
                if (contentLIs[j].search(/Review Policies and Procedures</) != -1) {
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
						throw "Something went wrong using the VTE.";
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
                if (contentLIs[j].search(/Review the Syllabus</) != -1) {
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
						throw "Something went wrong using the VTE.";
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
                if (contentLIs[j].search(/Welcome and Introductions</) != -1) {
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
						throw "Something went wrong using the VTE.";
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
                if (contentLIs[j].search(/Faculty Expectations</) != -1) {
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
						throw "Something went wrong using the VTE.";
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
						throw "Something went wrong using the VTE.";
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
                if (contentLIs[j].search(/Ask Your Instructor</) != -1) {
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
						throw "Something went wrong using the VTE.";
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
						throw "Something went wrong using the VTE.";
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
						throw "Something went wrong using the VTE.";
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
						throw "Something went wrong using the VTE.";
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
						throw "Something went wrong using the VTE.";
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
        alert(contentAreas);
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
