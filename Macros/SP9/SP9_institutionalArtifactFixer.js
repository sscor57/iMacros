/*
  the purpose of this script is to fix the institution wide artifacts in a BB9 SP4 
	template. it has been found to work on SP9, but it's not thoroughly tested. It will
	certainly fail on SP11.
	
	WARNING:
		* this script assumes that the course files for your course
		  resides within the courses home directory. make certain the
		  version folder for your courses lives in that directory for
		  the duration of the scripts operations.
		   
		* if you use a popup blocker, this will likely fail on you.
		
		* if links are still broken after running this script, yet you
		  recieved no error messages, check that the xid is correct for
		  your artifact in the array of artifacts for your environment.
	
	last edited: 01/25/2013 by c. swope
*/
var courseID = null;
var userName = null;
var errorMessage = "Something unexpected happened:\n";
var progressMessage = "____REPORT:\n";

var dvsxArtifacts = [
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-13909_1\" artifacttype=\"html\">OOB_Print.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1210_1\" artifacttype=\"html\">Welcome and Introductions</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-6470_1\" artifacttype=\"html\">Faculty Expectations</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-8608_1\" artifacttype=\"html\">Updates and Handouts</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-10216_1\" artifacttype=\"html\">Ask Your Instructor</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-13918_1\" artifacttype=\"html\">Supplemental Instruction</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-7179_1\" artifacttype=\"html\">SOBT Media</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-6460_1\" artifacttype=\"html\">Review Policies and Procedures</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-7171_1\" artifacttype=\"html\">Review the Syllabus</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-6467_1\" artifacttype=\"html\">First Course Support Getting Started</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-6466_1\" artifacttype=\"html\">First Course Support</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-6469_1\" artifacttype=\"html\">First Course Support Final Unit</a>"
	];
var cbsaArtifacts = [
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-116502_1\" artifacttype=\"html\">OOB_Print.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1210_1\" artifacttype=\"html\">Welcome and Introductions</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1227_1\" artifacttype=\"html\">Faculty Expectations</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1211_1\" artifacttype=\"html\">Updates and Handouts</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1212_1\" artifacttype=\"html\">Ask Your Instructor</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-135927_1\" artifacttype=\"html\">Supplemental Instruction</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-20978_1\" artifacttype=\"html\">SOBT Media</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1214_1\" artifacttype=\"html\">Review Policies and Procedures</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1215_1\" artifacttype=\"html\">Review the Syllabus</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-126499_1\" artifacttype=\"html\">First Course Support Getting Started</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-126500_1\" artifacttype=\"html\">First Course Support</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-129509_1\" artifacttype=\"html\">First Course Support Final Unit</a>"
	];
var prsaArtifacts = [
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-423974_1\" artifacttype=\"html\">OOB_Print.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1310_1\" artifacttype=\"html\">Welcome and Introductions</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1307_1\" artifacttype=\"html\">Faculty Expectations</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1309_1\" artifacttype=\"html\">Updates and Handouts</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1306_1\" artifacttype=\"html\">Ask Your Instructor</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-71516_1\" artifacttype=\"html\">Supplemental Instruction</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1316_1\" artifacttype=\"html\">SOBT Media</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1314_1\" artifacttype=\"html\">Review Policies and Procedures</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1315_1\" artifacttype=\"html\">Review the Syllabus</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-51627_1\" artifacttype=\"html\">First Course Support Getting Started</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-51636_1\" artifacttype=\"html\">First Course Support</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-51624_1\" artifacttype=\"html\">First Course Support Final Unit</a>"
	];
var cbsbArtifacts = [
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-37316_1\" artifacttype=\"html\">OOB_Print.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-18902_1\" artifacttype=\"html\">Welcome and Introductions</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-18903_1\" artifacttype=\"html\">Faculty Expectations</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-5965_1\" artifacttype=\"html\">Updates and Handouts</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-xxxx_1\" artifacttype=\"html\">Review Policies and Procedures</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-xxxx_1\" artifacttype=\"html\">Review the Syllabus</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-5966_1\" artifacttype=\"html\">Ask Your Instructor</a>"
	];
var prsbArtifacts = [
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1313_1\" artifacttype=\"html\">OOB_Print.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1306_1\" artifacttype=\"html\">Welcome and Introductions</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1304_1\" artifacttype=\"html\">Faculty Expectations</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1305_1\" artifacttype=\"html\">Updates and Handouts</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1303_1\" artifacttype=\"html\">Ask Your Instructor</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-5514_1\" artifacttype=\"html\">Supplemental Instruction</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1309_1\" artifacttype=\"html\">SOUS_Media.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1310_1\" artifacttype=\"html\">Review Policies and Procedures</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1311_1\" artifacttype=\"html\">Review the Syllabus</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-5512_1\" artifacttype=\"html\">First Course Support Getting Started</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-5513_1\" artifacttype=\"html\">First Course Support</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-5511_1\" artifacttype=\"html\">First Course Support Final Unit</a>"
	];
var cbscArtifacts = [
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1423_1\" artifacttype=\"html\">OOB_Print.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1309_1\" artifacttype=\"html\">Welcome and Introductions</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1302_1\" artifacttype=\"html\">Faculty Expectations</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1308_1\" artifacttype=\"html\">Updates and Handouts</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1301_1\" artifacttype=\"html\">Ask Your Instructor</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1307_1\" artifacttype=\"html\">Supplemental Instruction</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1311_1\" artifacttype=\"html\">SOPSL_Media.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1313_1\" artifacttype=\"html\">Review Policies and Procedures</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1314_1\" artifacttype=\"html\">Review the Syllabus</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1304_1\" artifacttype=\"html\">First Course Support Getting Started</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1305_1\" artifacttype=\"html\">First Course Support</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1303_1\" artifacttype=\"html\">First Course Support Final Unit</a>"
	];
var prscArtifacts = [
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1500_1\" artifacttype=\"html\">OOB_Print.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1707_1\" artifacttype=\"html\">Welcome and Introductions</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1702_1\" artifacttype=\"html\">Faculty Expectations</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1706_1\" artifacttype=\"html\">Updates and Handouts</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1701_1\" artifacttype=\"html\">Ask Your Instructor</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-5514_1\" artifacttype=\"html\">Supplemental Instruction</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1711_1\" artifacttype=\"html\">SOPSL_Media.html</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1709_1\" artifacttype=\"html\">Review Policies and Procedures</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1710_1\" artifacttype=\"html\">Review the Syllabus</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1704_1\" artifacttype=\"html\">First Course Support Getting Started</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1705_1\" artifacttype=\"html\">First Course Support</a>",
	"<a target=\"_blank\" href=\"/bbcswebdav/xid-1703_1\" artifacttype=\"html\">First Course Support Final Unit</a>"
	];

// navigates via the course search feature to the specified course id
var goToCourseID = function(bb9_courseID) {
    try {
		var macroCode = "";
		var e = "";
		var extract = "";
        var searchPattern = "";
		
		if (bb9_courseID === null) {
		    bb9_courseID = prompt("Enter the Destination Course ID:","TEMPLATE_MHA5002_00010");
		}
        
        macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
        macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT="+bb9_courseID+"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
        e = iimPlay("CODE:" + macroCode);
		
		if (userName === null) {
		    userName = prompt("Enter your username","cswope");
		}
        
        enrollInCourseID(userName,"C");
    
        macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
    
        searchPattern = RegExp(courseID+"</a>");
    
        if (extract.search(searchPattern) != -1) {
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+bb9_courseID+"\n";
            e = iimPlay("CODE:" + macroCode);
        }
		progressMessage += "Found course ID: "+bb9_courseID+".\n";
	} catch (err) {
	    errorMessage += "\tgoToTemplate() says: "+err.message+"\n";
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

// replaces a space character (' ') in a string with an iMacros space entity ('<SP>')
var addIIMSpaces = function(anyStringWithSpaces) {
	newString = anyStringWithSpaces.replace(/ /g,"<SP>");
	return newString
}

// replaces iMacros space entity ('<SP>') in a string with a space character (' ')
var removeIIMSpaces = function(anyStringWithIIMSpaces) {
	newString = anyStringWithIIMSpaces.replace(/<SP>/g," ");
	return newString
}

// chooses which array of institution wides artifact links to use and returns that array
var environmentChooser = function() {
	try {
        var macroCode = "";
        var e = "";
        var currentBB9Environment = "";
        var artifactList = new Array;
        var artifact = "";
        var x = 0;
    
        macroCode = "ADD !EXTRACT {{!URLCURRENT}}\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        currentBB9Environment = extract.substr(7,4);
    
        if (currentBB9Environment === "dvsx") {
            artifactList = dvsxArtifacts;
        }  else if (currentBB9Environment === "cbsa" || extract.substr(7,12) === "coursebuilda") {
            artifactList = cbsaArtifacts;
        } else if (currentBB9Environment === "prsa") {
            artifactList = prsaArtifacts;
        } else if (currentBB9Environment === "cbsb" || extract.substr(7,12) === "coursebuildb") {
            artifactList = cbsbArtifacts;
        } else if (currentBB9Environment === "prsb") {
            artifactList = prsbArtifacts;
        } else if (currentBB9Environment === "cbsc" || extract.substr(7,12) === "coursebuildc") {
            artifactList = cbscArtifacts;
        } else if (currentBB9Environment === "prsc") {
            artifactList = prscArtifacts;
        } else if (currentBB9Environment === "cbsd" || extract.substr(7,12) === "coursebuildd") {
            artifactList = cbsdArtifacts;
        } else if (currentBB9Environment === "prsd") {
            artifactList = prsdArtifacts;
        } else if (currentBB9Environment === "cbse" || extract.substr(7,12) === "coursebuilde") {
            artifactList = cbseArtifacts;
        } else if (currentBB9Environment === "prse") {
            artifactList = prseArtifacts;
        } else if (currentBB9Environment === "cbsf" || extract.substr(7,12) === "coursebuildf") {
            artifactList = cbsfArtifacts;
        } else if (currentBB9Environment === "prsf") {
            artifactList = prsfArtifacts;
        }
		
		if (currentBB9Environment === "cour") {
			currentBB9Environment = extract.substr(7,12);
		}
		//progressMessage += "Current Environment: "+currentBB9Environment+".\n";
		return artifactList
	} catch(err) {
        errorMessage += "\tenvironmentChooser() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// returns an artifact link if it locates the 'title' string in the artifacts linked text
var institutionalArtifact = function(title) {
    try {
        var currentBB9Environment = "";
        var artifactList = new Array;
        var artifact = "";
        var x = 0;
    
        artifactList = environmentChooser();
    
        for (x=0;x<artifactList.length;x++) {
            if (artifactList[x].search(title) != -1) {
                artifact = artifactList[x];
            }
        }
		//progressMessage += "Found Institutional Artifact for: "+title+".\n";
        return addIIMSpaces(artifact)
    } catch(err) {
        errorMessage += "\tinstitutionalArtifact() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

var goToContentPage = function(lnavButton) {
    try {
        var macroCode = "";
        var e = "";
        
        macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:"+lnavButton+"\n";
        e = iimPlay("CODE:" + macroCode);
		
		progressMessage += removeIIMSpaces(lnavButton)+"______________________________\n";
    } catch(err) {
        errorMessage += "\tgoToContentPage() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// extracts the content area of a content page and returns each LI as an element in an array
var contentItems = function() {
    try {
        var macroCode = "";
        var e = "";
        var extract = "";
        var content_listContainer = new Array;
        
        macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        content_listContainer = iimGetLastExtract();	
			
		//progressMessage += "Extracted Content Area.\n";
        return content_listContainer.match(/(<li ).+?(<\/li>)/g)
    } catch(err) {
        errorMessage += "\tcontentItems() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// assembles an array of leftnav buttons for content areas and returns that array
var pagesToCycleThrough = function() {
    try {
        var macroCode = "";
        var e = "";
        var extract = "";
        var navButtonList = new Array;
        var contentArea = new String;
        var contentAreasToConfigure = new Array;
        var x = 0;
    
        macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();

        navButtonList = extract.match(/(<li ).+?(<\/li>)/g);

        for (x=0;x<navButtonList.length;x++) {
            navButtonList[x] = navButtonList[x].replace(/ /g, "<SP>");
            if (navButtonList[x].search(/Getting<SP>Started|Syllabus|Course<SP>Project(<SP>){0,1}\d{0,1}|Unit<SP>\d{1,2}/) != -1) {
                contentArea = navButtonList[x].match(/Getting<SP>Started(?=<\/span>)|Syllabus(?=<\/span>)|Course<SP>Project(<SP>){0,1}\d{0,1}(?=<\/span>)|Unit<SP>\d{1,2}(?=<\/span>)/)[0];
                contentAreasToConfigure.push(contentArea);
            }
        }			
		progressMessage += "Extracted leftnav to determine pagination sequence.\n";
        return contentAreasToConfigure
    } catch(err) {
        errorMessage += "\tpagesToCycleThrough() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// replaces the first content item on a content pages with the current environments OOB_Print.html artifact
var fixPrintArtifact = function() {
    try {
        var macroCode = "";
        var e = "";
        var content_listItems = new Array;
        var contextualMenuIdNumber = "";
    
        content_listItems = contentItems();
        contextualMenuIdNumber = content_listItems[0].match(/cmlink_(\w{32})/)[1];
    
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+contextualMenuIdNumber+"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_"+contextualMenuIdNumber+"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:htmlData_text_code\n";
        macroCode = "TAB T=2\nFRAME F=0\n";
        macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:source ATTR=ID:htmlSource CONTENT="+institutionalArtifact("OOB_Print.html")+"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:source ATTR=ID:insert\n";
        
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
        e = iimPlay("CODE:" + macroCode);	
		
		progressMessage += "Fixed a print object.\n";
    } catch(err) {
        errorMessage += "\tfixPrintArtifact() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// environmentalizes content items
var fixContentItem = function(title,contentItems) {
    try {
        var macroCode = "";
        var e = "";
        var contextualMenuIdNumber = "";
        var x = 0;
    
        for (x=0;x<contentItems.length;x++) {
            if (contentItems[x].search(title) != -1) {
                contextualMenuIdNumber = contentItems[x].match(/cmlink_(\w{32})/)[1];
            
                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+contextualMenuIdNumber+"\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_"+contextualMenuIdNumber+"\n";
                macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT="+addIIMSpaces(institutionalArtifact(title))+"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
                e = iimPlay("CODE:" + macroCode);
            }
        }	
		
		progressMessage += "Fixed content item: "+title+".\n";
    } catch(err) {
        errorMessage += "\tfixContentItem() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// environmentalizes first course support content items
var fixFirstCourseSupport = function(title,contentItems,artifactTitle) {
    try {
        var macroCode = "";
        var e = "";
        var contextualMenuIdNumber = "";
        var x = 0;
    
        for (x=0;x<contentItems.length;x++) {
            if (contentItems[x].search(title) != -1) {
                contextualMenuIdNumber = contentItems[x].match(/cmlink_(\w{32})/)[1];
            
                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+contextualMenuIdNumber+"\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_"+contextualMenuIdNumber+"\n";
                macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT="+addIIMSpaces(institutionalArtifact(artifactTitle))+"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
                e = iimPlay("CODE:" + macroCode);
            }
        }	
		
		progressMessage += "Fixed content item: "+title+".\n";
    } catch(err) {
        errorMessage += "\tfixFirstCourseSupport() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// environmentalizes discussion items in content areas (not to be mistaken with the discussion topic fixer)
var fixDiscussionItem = function(title,contentItems) {
    try {
        var macroCode = "";
        var e = "";
        var contextualMenuIdNumber = "";
        var x = 0;
    
        for (x=0;x<contentItems.length;x++) {
            if (contentItems[x].search(title) != -1 && contentItems[x].search(/launchLink.jsp/) != -1) {
                contextualMenuIdNumber = contentItems[x].match(/cmlink_(\w{32})/)[1];
            
                macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+contextualMenuIdNumber+"\n";
                macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_"+contextualMenuIdNumber+"\n";
                macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
                macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT="+addIIMSpaces(institutionalArtifact(title))+"\n";
                macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:top_Submit&&VALUE:Submit\n";
                e = iimPlay("CODE:" + macroCode);
            }
        }	
		
		progressMessage += "Fixed discussion item: "+title+".\n";
		return title
    } catch(err) {
        errorMessage += "\tfixDiscussionItem() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// environmentalizes the school media in the coure overview by replacing all the artifact links inside of it
var fixProgramMedia = function(title,contentItems) {
    try {
        var macroCode = "";
        var e = "";
        var extract = "";
		var roughArtifactInventory = new Array;
		var objectTitle = "";
		var x = 0;
		var xid = "";
		var prgramMedia = "";
		var intro = "";
		var comps = "";
		var contextualMenuIdNumber = "";
        
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Show<SP>Discover<SP>Content\n";
		macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:discoverObjectTypePicker CONTENT=%html\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Go\n";
		e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=2\n";
		macroCode += "WAIT SECONDS=1\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:catForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		macroCode += "TAG POS=1 TYPE=INPUT:BUTTON ATTR=NAME:bottom_Cancel&&VALUE:Cancel\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		roughArtifactInventory = extract.match(/(<tr ).+?(<\/tr>)/g);
		
		prgramMedia = institutionalArtifact("_Media");
		for (x=0;x<roughArtifactInventory.length;x++) {
			xid = roughArtifactInventory[x].match(/\d+?_1/);
			if (roughArtifactInventory[x].search(/course_introduction.html/) != -1) {
				intro = "<a target=\"_blank\" href=\"/bbcswebdav/xid-"+xid+"\" artifacttype=\"html\">course_introduction.html</a>";
			} 
			if (roughArtifactInventory[x].search(/course_competencies.html/) != -1) {
				comps = "<a target=\"_blank\" href=\"/bbcswebdav/xid-"+xid+"\" artifacttype=\"html\">course_competencies.html</a>";
			}
		}
		
		intro = addIIMSpaces(intro);
		comps = addIIMSpaces(comps);
		
		for (x=0;x<contentItems.length;x++) {
            if (contentItems[x].search(title) != -1) {
                contextualMenuIdNumber = contentItems[x].match(/cmlink_(\w{32})/)[1];
				
				macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+contextualMenuIdNumber+"\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_"+contextualMenuIdNumber+"\n";
				macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
				macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT="+prgramMedia + intro + comps+"\n";
				macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
				e = iimPlay("CODE:" + macroCode);
            }
        }	
		
		progressMessage += "Rebuilt the Course Overview object in order to fix school media.\n";
    } catch(err) {
        errorMessage += "\tfixProgramMedia() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// create and array with each TR as an element, and return that array
var discussionContentItems = function() {
    try {
        var macroCode = "";
        var e = "";
        var extract = "";
        content_listContainer = new Array;
        content_listItems = new Array;
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
			
		//progressMessage += "Extracted Content Area.\n";
        return extract.match(/<tr .+?<\/tr>/g)	
    } catch(err) {
        errorMessage += "\tdiscussionContentItems() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// environmentalizes discussion topics artifact links
var fixDiscussionTopic = function(title,contentItems) {
    try {
        var macroCode = "";
        var e = "";
        var contextualMenuIdNumber = "";
        var x = 0;
    
        for (x=0;x<contentItems.length;x++) {
            if (contentItems[x].search(title) != -1) {
                contextualMenuIdNumber = contentItems[x].match(/cmlink_(\w{32})/)[1];
            
                macroCode = "TAB T=1\nFRAME F=2\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+contextualMenuIdNumber+"\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=ID:editItem_"+contextualMenuIdNumber+"\n";
				macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
				macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:forumForm ATTR=ID:descriptiontext CONTENT="+addIIMSpaces(institutionalArtifact(title))+"\n";
				macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:forumForm ATTR=NAME:top_Submit&&VALUE:Submit\n";
				e = iimPlay("CODE:" + macroCode);
            }
        }	
		
		progressMessage += "Fixed discussion topic: "+title+".\n";
		return title
    } catch(err) {
        errorMessage += "\tfixDiscussionTopic() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// chooses which discussions to fix by parsing a list of what's already been fixed in the content areas
var discussionArea = function(discussionTitles) {
    try {
        var macroCode = "";
        var e = "";
		var roughDiscussionList = new Array;
		var titles = new Array;
		
    	macroCode = "TAB T=1\nFRAME F=2\n";
        macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Discussions\n";
        e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:conferenceForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
		e = iimPlay("CODE:" + macroCode);
		
		titles = discussionTitles.filter(function(elem, pos) {
			return discussionTitles.indexOf(elem) == pos;
		})
		
		for (x=0;x<titles.length;x++) {
			fixDiscussionTopic(titles[x],discussionContentItems());
		}
		
		progressMessage += "Discussions:\n";
    } catch(err) {
        errorMessage += "\tdiscussionArea() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// establishes whether or not the template is for a first course, and replaces the first course support artifacts accordingly
var firstCourseItems = function(pageList,pageListItem) {
    try {
        var firstCourses = ["CES8002","COUN5003","COUN5004","CST5003","CST8002","DSW8002",
        "PSY5002","PSY5004","PSY5005","PSY7011","PSY7012","PSY7021","PSY7022","PSY7023",
        "PSY8001","PSY8002","SHB5003","SHB8002","DHA8002","DHA8003","DNP8000","DPA8002",
        "DRPH8004","DRPH8005","HLS5002","HS5002","HS8002","HS8003","MHA5002","MPA5002",
        "MPH5002","MSN5000","MSN6000","NPM5002","PSF5002","PSF5003","PSF8002","PSF8003",
        "PSL5002","PSL8002","PSPA5002","PUBH5002","BMGT8004","DB8004","HRM5004",
        "ISTM5002","LEAD5004","MBA6004","MBA6010","OM5004","OM5005","OM8004","OM8005",
        "ORD5004","PHB8004","TS5004","TS5005","TS7000","TS8004","ED5001","ED5002",
        "ED5004","ED5005","ED5007","ED5008","ED5009","ED8002","ED8004","ED8005","ED8007",
        "ED8009","EDD8100","EDD8200","ELM8100","SC504","SC804","HD501","HS5003","HS5004",
        "HS5005","HS8004","HS8005","BPA3004","BSN4000","BUS3004","BUS3005","BUS3006",
        "IT3004","IT3006","IT4800","PS3004","PSYC3002","TS3004","TS3005","TS3006"];
        var firstCourseID = "";
        var bb9_courseID = "";
        var isFirstCourse = false;
        var x = 0;
		
		if (courseID === null) {
		    bb9_courseID = prompt("Enter the Destination Course ID:","TEMPLATE_TESTSUB1333_00001");
		    courseID = bb9_courseID;
		}
        
        firstCourseID = courseID.match(/_(.+?)_/)[1];

        for (x=0;x<firstCourses.length;x++) {
            if (firstCourses[x] === firstCourseID) {
                isFirstCourse = true;
            }
        }
        
        if (!isFirstCourse) {
            progressMessage += "This is not a first course.\n";
        } else {
            if (pageListItem === "Getting<SP>Started") {
                progressMessage += "This is a First Course and requires the Ask Your Tech items.\n";
                fixFirstCourseSupport("First Course Support",contentItems(),"First Course Support Getting Started");
            } else if (pageListItem === pageList[pageList.length - 1]) {
                progressMessage += "This is a First Course and requires the Ask Your Tech items.\n";
                fixFirstCourseSupport("First Course Support",contentItems(),"First Course Support Final Unit");
                progressMessage += "This is a First Course and requires the Ask Your Tech items.\n";
            } else {
                fixFirstCourseSupport("First Course Support",contentItems(),"First Course Support<");
            }
        }
    } catch(err) {
        errorMessage += "\tfirstCourseItems() says: "+err.message+"\n";
    	alert(errorMessage);
    }
}

// this controls the order of operations
var controlFlow = function() {
    try {
        var bb9_courseID = "";
        var macroCode = "";
        var e = "";
        var pageList = new Array;
        var discussionTitles = new Array;
		
		if (courseID === null) {
		    bb9_courseID = prompt("Enter the Destination Course ID:","TEMPLATE_MHA5002_00010");
		    courseID = bb9_courseID;
		}
    
        goToCourseID(courseID);
    
        pageList = pagesToCycleThrough();
    
        for (i=0;i<pageList.length;i++) {
            goToContentPage(pageList[i]);
            fixPrintArtifact();
        
            if (pageList[i] === "Getting<SP>Started") {
                fixProgramMedia("Course Overview",contentItems());
                fixContentItem("Review Policies and Procedures",contentItems());
                fixContentItem("Review the Syllabus",contentItems());
                discussionTitles.push(fixDiscussionItem("Welcome and Introductions",contentItems()));
                discussionTitles.push(fixDiscussionItem("Faculty Expectations",contentItems()));
                firstCourseItems(pageList,pageList[i]);
            }

            if (pageList[i].substr(0,4) === "Unit") {
                discussionTitles.push(fixDiscussionItem("Updates and Handouts",contentItems()));
                discussionTitles.push(fixDiscussionItem("Ask Your Instructor",contentItems()));
                discussionTitles.push(fixDiscussionItem("Supplemental Instruction",contentItems()));
                firstCourseItems(pageList,pageList[i]);
            }
        }
        discussionArea(discussionTitles);
		unenrollInCourseID(bb9_courseID);
		
        progressMessage += "Completed fixing institutionally common artifacts.";
        alert(progressMessage);
    } catch(err) {
        errorMessage += err.message;
        alert(errorMessage);
    }
}

controlFlow();