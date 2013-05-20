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

// checks to see if edit mode is on, and turns it on if it isn't.
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

// extracts the left nav and parses it to return an array of lnav button names to click on.
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

/*
Captures the irFiles for all the institution-wide content files, uses that to create a artifact 
links for each of them, cycles through the content areas in the left nav and replaces each 
institution-wide item on each page with a functioning artifact link.
*/
var fixInstitionItems = function() {
	var macroCode = "";
	var e = 0;
	var contentAreas = [];
	var i = 0;
	var artifactLinks = [];
	
	// captures an xid and uses that to extrapolate the artifact link and returns it.
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
	
	// returns an array of artifact links by combing through the Content Collection in specified folders.
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
	
	// extracts the UL containing all the content and returns an array with each LI as an element in the array.
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
    
    // uses a regular expression to find a artifact link and return the match if it finds one.
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
    
    // replaces the first content item on each pageview with the SP11 print artifact.
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
    
    // replaces the accordion artifact with the JavaScript include.
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
    
    // replaces the policies and procedures artifact.
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
    
    // replaces the review the syllabus artifact.
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
    
    // replaces the welcome and introductions artifact.
    var fixWelcomeIntroductions = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/cyber_cafe\.html/i, artifactLinks);
            
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
    
    // replaces the welcome and introductions artifact.
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
    
    // replaces the faculty expectations artifact.
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
    
    // replaces the updates and handouts artifact.
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
    
    // replaces the ask your instructor artifact.
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
    
    // replaces the supplemental instruction artifact.
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
    
    // fixes the first course support artifact on the getting started page.
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
    
    // fixes the first course support artifact on unit pages that aren't the last unit.
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
    
    // replaces the first course support artifact on the last unit page.
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
        
        /*for (i = 0; i < contentAreas.length; i++) {
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
        }*/
        return
    } catch(err) {
        alert(err + "\nSomething went wrong with fixInstitionItems");
    }
}

var myJournalsCode = function() {
		  
	hasIRFiles = new Array;
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	hasIRFiles = irFiles()
	hasIRLnav = extract.match(/Instructor Resources/);
	hasJournals = extract.match(/Journals/);
	alert(hasIRLnav)

//if Journals exist
	  if (hasJournals != null) {
//Ask if it finds IR_ files
		if(hasIRFiles.length > 0) {
		//If yes, Rename Journals and add the IR files
			alert("Changing Journals to Instructor Resources")
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
	
			lnavLIs = extract.match(/<li[\s\S]+?<\/li>/g);

			for (i = 0; i < lnavLIs.length; i++) {
			  if (lnavLIs[i].search(/Journals/g) != -1) {
				journalCMLink = lnavLIs[i].match(/cmlink_(\w{32})/)[1];
			  }
			}
			
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + journalCMLink + "\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Rename<SP>Link\n";
			macroCode += "TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:renameSubHeaderInputBox CONTENT=Instructor<SP>Resources\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Save\n";					
			e = iimPlay("CODE:" + macroCode);
				
		} else {
		//If not, remove Journals from lnav
			alert("Deleting Journals")
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
	
			lnavLIs = extract.match(/<li[\s\S]+?<\/li>/g);

			for (i = 0; i < lnavLIs.length; i++) {
			  if (lnavLIs[i].search(/Journals/g) != -1) {
				journalCMLink = lnavLIs[i].match(/cmlink_(\w{32})/)[1];
			  }
			}
			
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + journalCMLink + "\n";
			//macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Delete\n";			
			e = iimPlay("CODE:" + macroCode);
			
			}
//If Journals does not exist, check for Instructor Resource Files to see if we even need an lnav
	} else if (hasIRFiles > 0) {
	//Check for Instructor Resources	
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();

		hasIRLnav = extract.match(/Instructor Resources/);
		
		
		if (hasIRLnav != null){
		//Need to make Instructor Resource LNav item
			alert("Create Instructor Resource left nav content page")
				
			}
		else {
		//Else check the Instructor Resources to ensure the files are in it
			alert("Check Instructor Resources to ensure ir_ files are in it")
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
	
			lnavLIs = extract.match(/<li[\s\S]+?<\/li>/g);

			for (i = 0; i < lnavLIs.length; i++) {
			  if (lnavLIs[i].search(/Instructor Resources/g) != -1) {
				irCMLink = lnavLIs[i].match(/cmlink_(\w{32})/)[1];
			  }
			}
			
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + irCMLink + "\n";
			//macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Delete\n";			
			e = iimPlay("CODE:" + macroCode);
			}
	
// Finally check for and/or delete Instructor Resources				
		}
	else if ( hasIRLnav != null) {
		alert("Deleting Instructor Resources")
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
	
		lnavLIs = extract.match(/<li[\s\S]+?<\/li>/g);

		for (i = 0; i < lnavLIs.length; i++) {
		  if (lnavLIs[i].search(/Instructor Resources/g) != -1) {
			irCMLink = lnavLIs[i].match(/cmlink_(\w{32})/)[1];
			  }
			}
			
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + irCMLink + "\n";
		//macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Delete\n";
		//macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
				
		e = iimPlay("CODE:" + macroCode);
		}
	else { alert("Found nothing")
		}
}
// captures each Content Collection items data in an array ([contentType, xID, fileName, linkTitle, artifact])
// returns a 3D array where each element is one CC items array of data.
var irFiles = function() {
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
	
		for (i = 0; i < rowsToScan.length; i++) {
		    xID = rowsToScan[i].match(/xythos_id=(\d*)_1/)[1];
		   		    
		    if (rowsToScan[i].search(/ir_/) != -1) {
				fileName = rowsToScan[i].match(/ir_/)[0];
				linkTitle = fileName;
				artifact = "<a target=\"_blank\" href=\"@X@EmbeddedFile.requestUrlStub@X@bbcswebdav/xid-" + xID + "_1\" artifacttype=\"html\">" + linkTitle + "</a>";
				artifactInfo = [contentType, xID, fileName, linkTitle, artifact];
				contentInfo.push(artifactInfo);

			} else {
				contentInfo === null;
				}
		    
		}
		
		progressMessage += "";
		return contentInfo
    } catch(err) {
        alert(err + " irFiles is having problems.");
    }
}
var instructorResources = function() {
	try {
	
	// extract lnav
	extractLNav();
	// determing whether Journals || Instructor Resources are in the lnav
	// if Journals is present determine whether there are ir_ files
	// if Journals is there and NO ir_ files, delete Journals from the lnavLIs
	// else rename Journals to Instructor Resources and add resources
	// if Instrucor Resources IS there, add resources
	
	} catch(err) {
		alert(err + ": instructorResources is having problems.");
	}
}

myJournalsCode();
//fixInstitionItems();
