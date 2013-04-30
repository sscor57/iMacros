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

var fixManifestoInstitionItems = function() {
	var macroCode = "";
	var e = 0;
	var contentAreas = [];
	var i = 0;
	var artifactLinks = [];
	
	var captureArtifactLinks = function() {
		var macroCode = "";
		var e = 0;
		var artifactRows = [];
		var artifactLinks = [];
		var xID = "";
		var artifact = "";
	    
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
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:*_Manifesto\n";
            e = iimPlay("CODE:" + macroCode);
            
            macroCode = "TAB T=1\nFRAME NAME=\"WFS_Files\"\n";
            macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
            e = iimPlay("CODE:" + macroCode);
            extract = iimGetLastExtract();
            
            artifactRows = extract.match(/<tr[\s\S]+?<\/tr>/g);
            
            for (j = 0; j < artifactRows.length; j++) {
                if (artifactRows[j].search(/orientation\.html/i) != -1) {
                    xID = artifactRows[j].match(/id=\"(\d+)_1_xythosFileSize\"/)[1];
                    title = artifactRows[j].match(/orientation\.html/i);
                }
                if (artifactRows[j].search(/learner_expectations\.html/i) != -1) {
                    xID = artifactRows[j].match(/id=\"(\d+)_1_xythosFileSize\"/)[1];
                    title = artifactRows[j].match(/learner_expectations\.html/i);
                }
                if (artifactRows[j].search(/grading_explanation\.html/i) != -1) {
                    xID = artifactRows[j].match(/id=\"(\d+)_1_xythosFileSize\"/)[1];
                    title = artifactRows[j].match(/grading_explanation\.html/i);
                }
                if (artifactRows[j].search(/disability_services_statement\.html/i) != -1) {
                    xID = artifactRows[j].match(/id=\"(\d+)_1_xythosFileSize\"/)[1];
                    title = artifactRows[j].match(/disability_services_statement\.html/i);
                }
                if (artifactRows[j].search(/courseroom_tour\.html/i) != -1) {
                    xID = artifactRows[j].match(/id=\"(\d+)_1_xythosFileSize\"/i)[1];
                    title = artifactRows[j].match(/courseroom_tour\.html/i);
                }
                if (artifactRows[j].search(/course_plan\.html/i) != -1) {
                    xID = artifactRows[j].match(/id=\"(\d+)_1_xythosFileSize\"/)[1];
                    title = artifactRows[j].match(/course_plan\.html/i);
                }
                artifact = "<a artifacttype=\"html\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@/bbcswebdav/xid-" + xID + "_1\" target=\"_blank\" alt=\"\">" + title + "</a>";
                artifactLinks.push(artifact);
            }
            
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
            
            for (j = 0; j < artifactRows.length; j++) {
                if (artifactRows[j].search(/oob_print_manifesto\.html/i) != -1) {
                    xID = artifactRows[j].match(/id=\"(\d+)_1_xythosFileSize\"/)[1];
                    title = artifactRows[j].match(/oob_print_manifesto\.html/i);
                }
                artifact = "<a artifacttype=\"html\" href=\"http://@X@EmbeddedFile.requestUrlStub@X@/bbcswebdav/xid-" + xID + "_1\" target=\"_blank\" alt=\"\">" + title + "</a>";
                artifactLinks.push(artifact);
            }
            
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
                if (lnavLIs[i].search(/Getting Started|Syllabus|Unit \d{1,2}/g) != -1) {
                    buttonTitle = lnavLIs[i].match(/(Getting Started)|(Syllabus)|(Unit \d{1,2})/g)[1];
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
    
    var fixPrint = function(contentLIs) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contentLIs = [];
        var contextualMenuIdNumber = "";
        var artifact = "";
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/oob_print_manifesto\.html/i, artifactLinks);
            contextualMenuIdNumber = contentLIs[0].match(/cmlink_(\w{32})/)[1];
        
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
            macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
            macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT=" + addIIMSpaces(artifact) + "\n";
            macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit";
            e = iimPlay("CODE:" + macroCode);
            return
		} catch(err) {
		    alert(err + "\nSomething went wrong with captureContentAreas");
		}
    }
    
    var fixCoursePlan = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/course_plan\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/Required Course Plan/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                    macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:manageAssignmentForm ATTR=ID:content_desc_text CONTENT=" + addIIMSpaces(artifact) + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manageAssignmentForm ATTR=NAME:top_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixCoursePlan");
        }
    }
    
    var fixLearnerExpectations = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/learner_expectations\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/Learner Expectations/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                    macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT=" + addIIMSpaces(artifact) + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixLearnerExpectations");
        }
    }
    
    var fixOrientation = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/orientation\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/Orientation/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                    macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT=" + addIIMSpaces(artifact) + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixOrientation");
        }
    }
    
    var fixCourseroomTour = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/courseroom_tour\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/Courseroom Tour/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                    macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT=" + addIIMSpaces(artifact) + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixCourseroomTour");
        }
    }
    
    var fixExplanationOfGrading = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/grading_explanation\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/Explanation of Grading/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                    macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT=" + addIIMSpaces(artifact) + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixExplanationOfGrading");
        }
    }
    
    var fixDisabilityServicesStatement = function(artifactLinks) {
        var macroCode = "";
        var e = 0;
        var extract = "";
        var contextualMenuIdNumber = "";
        var artifact = "";
        var j = 0;
        
        try {
            contentLIs = captureContentAreas();
            artifact = getArtifact(/disability_services_statement\.html/i, artifactLinks);
            
            for (j = 0; j < contentLIs.length; j++) {
                if (contentLIs[j].search(/Disability Services Statement/) != -1) {
                    contextualMenuIdNumber = contentLIs[j].match(/cmlink_(\w{32})/)[1];
                    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_" + contextualMenuIdNumber + "\n";
                    macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                    macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT=" + addIIMSpaces(artifact) + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                    if (e != 1) {
                        throw e;
                    }
                }
            }
            return
        } catch(err) {
            alert(err + "\nSomething went wrong with fixDisabilityServicesStatement");
        }
    }
    
    try {
        contentAreas = extractLNav();
        artifactLinks = captureArtifactLinks();
        
        for (i = 0; i < contentAreas.length; i++) {
            macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
            macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:" + addIIMSpaces(contentAreas[i]) + "\n";
            e = iimPlay("CODE:" + macroCode);
            
            fixPrint();
            fixCoursePlan(artifactLinks);
            fixLearnerExpectations(artifactLinks);
            fixOrientation(artifactLinks);
            fixCourseroomTour(artifactLinks);
            fixExplanationOfGrading(artifactLinks);
            fixDisabilityServicesStatement(artifactLinks);
        }
        return
    } catch(err) {
        alert(err + "\nSomething went wrong with fixManifestoInstitionItems");
    }
}

fixManifestoInstitionItems();
