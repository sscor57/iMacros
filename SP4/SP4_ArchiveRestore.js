var destinationTemplateID = prompt("Enter the Destination Course ID:");
var userID = prompt("Enter your username:");
var versionFolder = "Version" + prompt("Enter the version folder # (just the number)")
var courseID = destinationTemplateID.match(/([A-Z]{2,4}\d{3,4})/)[0]; // captures the course id by extracting it from destinationTemplateID
var program = courseID.match(/[A-Z]{2,4}(?=\d)/); // captures the program by extracting it from courseID
var macroCode = "";
var e = "";
var menuID = "";
var extract = "";

var cbsaArtifacts = [ // this will be a list of all the institution wide artifacts. we're going to need one of these for each CB environment
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-1210_1\"<SP>artifacttype=\"html\">Welcome<SP>and<SP>Introductions</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-1227_1\"<SP>artifacttype=\"html\">Faculty<SP>Expectations</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-1211_1\"<SP>artifacttype=\"html\">Updates<SP>and<SP>Handouts</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-1212_1\"<SP>artifacttype=\"html\">Ask<SP>Your<SP>Instructor</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-135927_1\"<SP>artifacttype=\"html\">Supplemental<SP>Instruction</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-20978_1\"<SP>artifacttype=\"html\">SOBT<SP>Media</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-1214_1\"<SP>artifacttype=\"html\">Policies<SP>Procedures</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-1214_1\"<SP>artifacttype=\"html\">Review<SP>Syllabus</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-126499_1\"<SP>artifacttype=\"html\">First<SP>Course<SP>Support<SP>Getting<SP>Started</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-126500_1\"<SP>artifacttype=\"html\">First<SP>Course<SP>Support</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-129509_1\"<SP>artifacttype=\"html\">First<SP>Course<SP>Support<SP>Final<SP>Unit</a>"
	];

var cbsbArtifacts = [ // this will be a list of all the institution wide artifacts. we're going to need one of these for each CB environment
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-18902_1\"<SP>artifacttype=\"html\">Welcome<SP>and<SP>Introductions</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-18903_1\"<SP>artifacttype=\"html\">Faculty<SP>Expectations</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-5965_1\"<SP>artifacttype=\"html\">Updates<SP>and<SP>Handouts</a>",
	"<a<SP>target=\"_blank\"<SP>href=\"/bbcswebdav/xid-5966_1\"<SP>artifacttype=\"html\">Ask<SP>Your<SP>Instructor</a>"
	];

var goToTemplate = function(destinationTemplateID) {
	var searchPattern = "";
	
	// using the course search, navigate to the template
	macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
	macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
	macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
	macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT="+destinationTemplateID+"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	searchPattern = RegExp(destinationTemplateID+"</a>");
	
	if (extract.search(searchPattern) != -1) {
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+destinationTemplateID+"\n";
		e = iimPlay("CODE:" + macroCode);
	} else {
		alert("Something truly horrible happened. I can't find your new template!");
	}
}

var addIIMSpaces = function(anyStringWithSpaces) {
	newString = anyStringWithSpaces.replace(/ /g,"<SP>");
	return newString
}

/* This function: 
	1. restores the ArchiveBuilder archive to the BB9 environment
	2. sets the folder permissions for the courses home directory
	3. moves all the imported Content Collection files into the 
	   courses home directory
	4. recycles the empty imported content folder
*/
function createTempTemplate(destinationTemplateID,userID,courseID,program) {
	// navigate to the archive restore form, fill out the the course ID field and pause
	macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin<SP>*\n";
	macroCode += "FRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
	macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/expand.gif\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Restore\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:selectCourse ATTR=ID:courseId CONTENT="+destinationTemplateID+"\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "PAUSE\n";
	e = iimPlay("CODE:" + macroCode);
	
	// this is where user action is required to browse to the archive created by ArchiveBuilder
	
	// this while loop will keep going until the course ID that was just created appears in the search results table
	while (extract.search(destinationTemplateID) == -1) {
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "WAIT SECONDS=30\n";
		macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
		macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT="+destinationTemplateID+"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
		e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
	}
	
	menuID = extract.substr(extract.search(/(cmlink_)[a-z0-9]{32}/) + 7,32); // this acquires the 32 digit ID number for selecting items in the contextual menu
	
	// uses the contextual menu to get to the enrollment form	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+menuID+"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:admin_course_list_users\n";
	macroCode += "TAG POS=3 TYPE=A ATTR=ID:<SP>\n";
	e = iimPlay("CODE:" + macroCode);
	
	// enroll in the new template
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:myForm ATTR=ID:userName CONTENT="+userID+"\n";
	macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:myForm ATTR=ID:courseRoleId CONTENT=%C\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:myForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
	e = iimPlay("CODE:" + macroCode);
	
	// navigate to the templates home directory in the Content Collection
	macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Content<SP>Collection*\n";
	macroCode += "FRAME NAME=\"WFS_Navigation\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Course<SP>Content\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:courses\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "FRAME NAME=\"WFS_Files\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:filesForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+destinationTemplateID+"\n";
	e = iimPlay("CODE:" + macroCode);
	
	// extract the content of the header div	
	macroCode = "FRAME NAME=\"WFS_Files\"\n";
	macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:pageTitleDiv EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// acquire the ID num for the contextual menu for home directory
	menuID = extract.substr(extract.search(/(cmlink_)[a-z0-9]{32}/) + 7,32);
	
	// set the folder permissions for the template home directory
	macroCode = "TAB T=1\nFRAME NAME=\"WFS_Files\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+menuID+"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:permissions_tool\n";
	macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/expand.gif\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Institution<SP>Roles\n";
	macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:adduserlistform ATTR=ID:prms_source_select CONTENT=%_121_1:%_123_1:%_120_1:%_124_1:%_122_1:%_1_1\n";
	macroCode += "TAG POS=1 TYPE=BUTTON ATTR=TITLE:Move<SP>to<SP>list<SP>of<SP>selected<SP>items&&TYPE:button\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:adduserlistform ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
	e = iimPlay("CODE:" + macroCode);
	
	// enter the imported content folder
	macroCode = "FRAME NAME=\"WFS_Files\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+destinationTemplateID+"_ImportedContent_*\n";
	e = iimPlay("CODE:" + macroCode);
	
	// move everything within the imported content subfolder to the templates home directory root
	macroCode = "FRAME NAME=\"WFS_Files\"\n";
	macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:containerdiv\n";
	macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:filesForm ATTR=ID:listContainer_selectAll CONTENT=YES\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:*_bottom&&TXT:Move\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:destination ATTR=ID:targetPath_CSFile CONTENT=courses/"+destinationTemplateID+"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:destination ATTR=ID:overwrite CONTENT=YES\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:destination ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
	macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:containerdiv\n";
	e = iimPlay("CODE:" + macroCode);
	
	// navigate back to the templates home directory
	macroCode = "TAB T=1\nFRAME NAME=\"WFS_Navigation\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+destinationTemplateID+"\n";
	e = iimPlay("CODE:" + macroCode);
	
	// recycle the newly emptied imported content folder
	macroCode = "TAB T=1\nFRAME NAME=\"WFS_Files\"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:filesForm ATTR=VALUE:/courses/"+destinationTemplateID+"/"+destinationTemplateID+"_ImportedContent_* CONTENT=YES\n";
	macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:*_bottom&&TXT:Recycle\n";
	e = iimPlay("CODE:" + macroCode);
}

/* This function adds all the content that ArchiveBuilder couldn't. It: 
	1. adds "Welcome and Introductions" and "Faculty Expectations" to Getting Started
	2. repairs unit overview that are corrupted by BlackBoards Restore process
	3. adds Assignments to units (for now, all assignments are graded)
	4. adds graded discussions to units
	5. adds ungraded discussions to units
*/
function addContentItemsToUnits(destinationTemplateID,userID,courseID,program,versionFolder) {
	var searchPattern = "";
	var navButtonList = [];
	var contentArea = "";
	var contentAreasToConfigure = [];
	var selectElements = [];
	var discussionID = "";
	var currentUnit = "";
	var unitFolder = "";
	var roughArtifactInventory = [];
	var assignmentArtifacts = [];
	var discussionArtifacts = [];
	var quizArtifacts = [];
	var overviewArtifacts = [];
	var activityCode = "";
	var unitNum = "";
	var xID = "";
	var artifact = "";
	var title = "";
	var assignment = [];
	var discussion = [];
	var quiz = [];
	var overview = [];
	var unitContentAreas = [];
	var overviewContent = "";
	var assignmentNum = [];
	var unitCodePrefix = "";
	var assignmentCode = ""
	var assignmentTitle = "";
	var discussionNum = "";
	var discussionCode = ""
	var discussionTitle = "";
	var dicussionID = "";
	var roughQuizList = [];
	var quizID = "";
	
	// this subroutine fixes the unit overview items that get corrupted when we use the restore feature
	function assembleOverview(currentUnit,program,courseID,versionFolder) {
		var intro = "";
		var obj = "";
		var introduction = "";
		var objectives = "";
		var unitFolder = "";
		var roughDiscussionList = [];
		
		if (currentUnit == "Unit 1") {
			intro = "unit01_introduction";
			obj = "unit01_objectives";
			unitFolder = "Unit01";
		} else if (currentUnit == "Unit 2") {
			intro = "unit02_introduction";
			obj = "unit02_objectives";
			unitFolder = "Unit02";
		} else if (currentUnit == "Unit 3") {
			intro = "unit03_introduction";
			obj = "unit03_objectives";
			unitFolder = "Unit03";
		} else if (currentUnit == "Unit 4") {
			intro = "unit04_introduction";
			obj = "unit04_objectives";
			unitFolder = "Unit04";
		} else if (currentUnit == "Unit 5") {
			intro = "unit05_introduction";
			obj = "unit05_objectives";
			unitFolder = "Unit05";
		} else if (currentUnit == "Unit 6") {
			intro = "unit06_introduction";
			obj = "unit06_objectives";
			unitFolder = "Unit06";
		} else if (currentUnit == "Unit 7") {
			intro = "unit07_introduction";
			obj = "unit07_objectives";
			unitFolder = "Unit07";
		} else if (currentUnit == "Unit 8") {
			intro = "unit08_introduction";
			obj = "unit08_objectives";
			unitFolder = "Unit08";
		} else if (currentUnit == "Unit 9") {
			intro = "unit09_introduction";
			obj = "unit09_objectives";
			unitFolder = "Unit09";
		} else if (currentUnit == "Unit 10") {
			intro = "unit10_introduction";
			obj = "unit10_objectives";
			unitFolder = "Unit10";
		}
		
		for (j=0;j<overviewArtifacts.length;j++) {
			if (overviewArtifacts[j][0].search(intro) != -1) {
				introduction = overviewArtifacts[j][1];
			}
			if (overviewArtifacts[j][0].search(obj) != -1) {
				objectives = overviewArtifacts[j][1];
			}
		}
		overviewContent = "<h3>Introduction</h3> <div id=\"greetingText\"><span class=\"ellipsis_text\">"+introduction+"</span></div> <div class=\"view\"><a title=\"Select this link to launch this material in a new window.\" class=\"animationLink\" onclick=\"return popup(this,{\'width\':700, \'height\':450});\" href=\"/bbcswebdav/institution/"+program+"/"+courseID+"/"+versionFolder+"/"+unitFolder+"/"+unitFolder.toLowerCase()+"_full_introduction.html\" target=\"_blank\">Read Full Introduction</a></div> <br />  "+objectives+"";
		return overviewContent
	}
	
	goToTemplate(destinationTemplateID)
	
	// open a new tab which displays all of the HMTL documents for the course in the Content Collection
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Show<SP>Discover<SP>Content\n";
	macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:discoverObjectTypePicker CONTENT=%html\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Go\n";
	e = iimPlay("CODE:" + macroCode);
	
	// make sure everything is displayed
	macroCode = "TAB T=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:catForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
	macroCode += "WAIT SECONDS=10\n";
	macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// this populates 3 arrays (assignments, discussions, and unit overview artifacts), comprised of other 2 element arrays in the format of: activity code, artifact link. it ignores scoring guides.
	roughArtifactInventory = extract.match(/(<tr ).+?(<\/tr>)/g);
	for (i=0;i<roughArtifactInventory.length;i++) {
		if (roughArtifactInventory[i].search(/u\d{2}a/) != -1&&roughArtifactInventory[i].search(/scoring_guide/) == -1) {
			xid = roughArtifactInventory[i].match(/\d+?_1/);
			activityCode = roughArtifactInventory[i].match(/u\d{2}a\d{1,2}/)[0];
			unitNum = activityCode.match(/\d{2}(?=a)/);
			artifact = "<a target=\"_blank\" href=\"/bbcswebdav/xid-"+xid+"\" artifacttype=\"html\">["+activityCode+"] Unit "+unitNum+" Assignment</a>";
			assignment = [activityCode,artifact];
			assignmentArtifacts.push(assignment);
		}
		if (roughArtifactInventory[i].search(/u\d{2}d/) != -1&&roughArtifactInventory[i].search(/scoring_guide/) == -1) {
			xid = roughArtifactInventory[i].match(/\d+?_1/);
			activityCode = roughArtifactInventory[i].match(/u\d{2}d\d{1,2}/)[0];
			unitNum = activityCode.match(/\d{2}(?=d)/);
			artifact = "<a target=\"_blank\" href=\"/bbcswebdav/xid-"+xid+"\" artifacttype=\"html\">["+activityCode+"] Unit "+unitNum+" Discussion</a>";
			discussion = [activityCode,artifact];
			discussionArtifacts.push(discussion);
		}
		if (roughArtifactInventory[i].search(/u\d{2}q/) != -1&&roughArtifactInventory[i].search(/scoring_guide/) == -1) {
			xid = roughArtifactInventory[i].match(/\d+?_1/);
			activityCode = roughArtifactInventory[i].match(/u\d{2}q\d{1,2}/)[0];
			unitNum = activityCode.match(/\d{2}(?=a)/);
			artifact = "<a target=\"_blank\" href=\"/bbcswebdav/xid-"+xid+"\" artifacttype=\"html\">["+activityCode+"] Unit "+unitNum+" Quiz</a>";
			quiz = [activityCode,artifact];
			quizArtifacts.push(quiz);
		}
		if (roughArtifactInventory[i].search(/unit/) != -1&&roughArtifactInventory[i].search(/scoring_guide/) == -1) {
			xid = roughArtifactInventory[i].match(/\d+?_1/);
			activityCode = roughArtifactInventory[i].match(/unit\d{1,2}_\w+?\.html/)[0];
			unitNum = activityCode.match(/\d{1,2}(?=_)/);
			artifact = "<a target=\"_blank\" href=\"/bbcswebdav/xid-"+xid+"\" artifacttype=\"html\">"+activityCode+"</a>";
			overview = [activityCode,artifact]
			overviewArtifacts.push(overview);
		}
	}
	
	macroCode = "TAB CLOSE\n";
	e = iimPlay("CODE:" + macroCode);
	
	if (quizArtifacts.length != 0) {
		alert("There are quizzes in this course.\n\nYou must add them to the course before I can proceed.\n\nI suggest you find the quizzes that are already produced, or you're going to have to rebuild them.\n\nEither way, I'm pausing the macro to allow you to add the quizzes.\n\nWhen you're finished, return to \"Getting Started\" and hit Continue in the iMacros controls.")
		
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.course.tools_groupExpanderLink\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Tests,<SP>Surveys,<SP>and<SP>Pools\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Tests\n";
		macroCode += "PAUSE\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.course.tools_groupExpanderLink\n";
		e = iimPlay("CODE:" + macroCode);
		
		
	}
	
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// this creates an array of all the content areas lnav buttons.
	navButtonList = extract.match(/(<li ).+?(<\/li>)/g);
	for (i=0;i<navButtonList.length;i++) {
		navButtonList[i] = navButtonList[i].replace(/ /g, "<SP>");
		if (navButtonList[i].search(/Getting<SP>Started|Syllabus|Course<SP>Project(<SP>){0,1}\d{0,1}|Unit<SP>\d{1,2}/) != -1) {
			contentArea = navButtonList[i].match(/Getting<SP>Started(?=<\/span>)|Syllabus(?=<\/span>)|Course<SP>Project(<SP>){0,1}\d{0,1}(?=<\/span>)|Unit<SP>\d{1,2}(?=<\/span>)/)[0];
			contentAreasToConfigure.push(contentArea);
		}
	}
	
	// this is where we start cycling through all those nav buttons adding content as it goes through the list
	for (i=0;i<contentAreasToConfigure.length;i++) {
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+contentAreasToConfigure[i]+"\n";
		e = iimPlay("CODE:" + macroCode);
		if (contentAreasToConfigure[i] == "Getting<SP>Started") { // beginning the Getting Started operations. just adding discussion topics in this case
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Add<SP>Interactive<SP>Tool\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
			e = iimPlay("CODE:" + macroCode);
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:addItemFormId ATTR=ID:rTool_1\n";
			e = iimPlay("CODE:" + macroCode);
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:itemId EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
			
			selectElements = extract.match(/(<option ).+?(<\/option>)/g);
			
			for (j=0;j<selectElements.length;j++) {
				if (selectElements[j].search(/Welcome and Introductions/) != -1) {
					discussionID = selectElements[j].match(/_\d+?_1/);
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:addItemForm ATTR=ID:itemId CONTENT=%"+discussionID+"\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
					e = iimPlay("CODE:" + macroCode);
					
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT="+cbsbArtifacts[0]+"\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:top_Submit&&VALUE:Submit\n";
					e = iimPlay("CODE:" + macroCode);
				}
			}
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Add<SP>Interactive<SP>Tool\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
			e = iimPlay("CODE:" + macroCode);
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:addItemFormId ATTR=ID:rTool_1\n";
			e = iimPlay("CODE:" + macroCode);
			
			for (j=0;j<selectElements.length;j++) {
				if (selectElements[j].search(/Faculty Expectations/) != -1) {
					discussionID = selectElements[j].match(/_\d+?_1/);
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:addItemForm ATTR=ID:itemId CONTENT=%"+discussionID+"\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
					e = iimPlay("CODE:" + macroCode);
					
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT="+cbsbArtifacts[1]+"\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:top_Submit&&VALUE:Submit\n";
					e = iimPlay("CODE:" + macroCode);
				}
			}
			
		} else if (contentAreasToConfigure[i].search(/Course<SP>Project/) != -1) { // beginning the Course Project operations. there's not much going on here right now.
			alert("Add the projects assignments to the bottom of the page.");
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "PAUSE\n";
			e = iimPlay("CODE:" + macroCode);
			
		} else if (contentAreasToConfigure[i].search(/Unit<SP>/) != -1) { // beginning the weekly unit operations. this is where most of the fun happens
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:pageTitleDiv EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
			
			currentUnit = extract.match(/Unit \d{1,2}(?=<\/span>)/)[0]; // currentUnit is used to verify what unit the script is in and it's parsed for adding to titles
	
			if (currentUnit == "Unit 1") {
				unitCodePrefix = "u01";
			} else if (currentUnit == "Unit 2") {
				unitCodePrefix = "u02";
			} else if (currentUnit == "Unit 3") {
				unitCodePrefix = "u03";
			} else if (currentUnit == "Unit 4") {
				unitCodePrefix = "u04";
			} else if (currentUnit == "Unit 5") {
				unitCodePrefix = "u05";
			} else if (currentUnit == "Unit 6") {
				unitCodePrefix = "u06";
			} else if (currentUnit == "Unit 7") {
				unitCodePrefix = "u07";
			} else if (currentUnit == "Unit 8") {
				unitCodePrefix = "u08";
			} else if (currentUnit == "Unit 9") {
				unitCodePrefix = "u09";
			} else if (currentUnit == "Unit 10") {
				unitCodePrefix = "u10";
			}
			
			// extract the UL containing content objects already on the page
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
			
			// break up the extract into an array with each element being the LI from the extracted UL
			unitContentAreas = extract.match(/(<li ).+?(?=<\/div> {0,1}<\/li>)/g);
			
			// acquire the id to expand the contextual menu for the unit overview. it's always the 2nd item on the page, thus: unitContentAreas[1]
			menuID = unitContentAreas[1].match(/(cmlink_)[a-z0-9]{32}/)[0];
			
			// expand the menu
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:"+menuID+"\n";
			e = iimPlay("CODE:" + macroCode);
			
			menuID = menuID.replace(/cmlink_/,"edit_"); // get the edit buttons id in the expanded contextual menu
			
			// click Edit in the contextual menu and set the VTBE to edit as HTML
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:"+menuID+"\n";
			macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
			e = iimPlay("CODE:" + macroCode);
			
			// this creates a iMacros variable containing the repaired unit overview artifact links
			iimSet("OVERVIEW",assembleOverview(currentUnit,program,courseID,versionFolder));
			
			// add the repaired unit overview
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:the_form ATTR=ID:htmlData_text CONTENT={{OVERVIEW}}\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
			e = iimPlay("CODE:" + macroCode);
			
			// grabs all the needed assignment data to create assignments
			for (j=0;j<assignmentArtifacts.length;j++) {
				if (assignmentArtifacts[j][0].search(RegExp(unitCodePrefix+"a")) != -1) {
					assignmentNum.push(assignmentArtifacts[j][1]);
				}
			}
			
			// make sure it's in the right order
			assignmentNum.sort()
			
			// create all the assignments
			for (j=0;j<assignmentNum.length;j++) {
				macroCode = "TAB T=1\nFRAME F=2\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>Assessment\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Assignment\n";
				e = iimPlay("CODE:" + macroCode);
				
				assignmentCode = assignmentNum[j].match(/u\d{2}a\d{1,2}/)[0];
				assignmentTitle = "["+assignmentCode+"] "+currentUnit+" Assignment "+assignmentCode.charAt(4);
				iimSet("TITLE",assignmentTitle);
				iimSet("ARTIFACT",assignmentNum[j]);
				
				macroCode = "TAB T=1\nFRAME F=2\n";
				macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
				macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageAssignmentForm ATTR=ID:content_name CONTENT={{TITLE}}\n";
				macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:manageAssignmentForm ATTR=ID:content_desc_text CONTENT={{ARTIFACT}}\n";
				macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageAssignmentForm ATTR=ID:possible CONTENT=100\n";
				macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:manageAssignmentForm ATTR=ID:isTracked CONTENT=YES\n";
				macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manageAssignmentForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
				e = iimPlay("CODE:" + macroCode);
			}
			assignmentNum = [];
			
			// this adds all the GRADED discussions to the unit which were already created by ArchiveBuilder
			for (j=0;j<discussionArtifacts.length;j++) {
				if (discussionArtifacts[j][0].search(RegExp(unitCodePrefix+"d")) != -1) {
					
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Add<SP>Interactive<SP>Tool\n";
					macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
					macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:addItemFormId ATTR=ID:rTool_1\n";
					e = iimPlay("CODE:" + macroCode);
					
					for (k=0;k<selectElements.length;k++) {
						if (selectElements[k].search(discussionArtifacts[j][0]) != -1) {
							discussionID = selectElements[k].match(/_\d+?_1/);
							macroCode = "TAB T=1\nFRAME F=2\n";
							macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:addItemForm ATTR=ID:itemId CONTENT=%"+discussionID+"\n";
							macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
							e = iimPlay("CODE:" + macroCode);
							
							iimSet("ARTIFACT",discussionArtifacts[j][1]);
							
							macroCode = "TAB T=1\nFRAME F=2\n";
							macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
							macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT={{ARTIFACT}}\n";
							macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
							e = iimPlay("CODE:" + macroCode);
						}
					}
				}
			}
			
			for (j=0;j<quizArtifacts.length;j++) {
				if (quizArtifacts[j][0].search(RegExp(unitCodePrefix+"q")) != -1) {
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
					macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>Assessment\n";
					macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Test\n";
					e = iimPlay("CODE:" + macroCode);
			
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:assessmentId EXTRACT=HTM\n";
					e = iimPlay("CODE:" + macroCode);
					extract = iimGetLastExtract();
					
					roughQuizList = extract.match(/<option.+?<\/option>/g);
					
					for (k=0;k<roughQuizList.length;k++) {
						if (roughQuizList[k].search(quizArtifacts[j][0]) != -1) {
							quizID = roughQuizList[k].match(/_\d+?_1/);
							macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
							macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:assessmentForm ATTR=ID:assessmentId CONTENT=%"+quizID+"\n";
							macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:assessmentForm ATTR=NAME:top_Submit&&VALUE:Submit\n";
							macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:assessmentForm ATTR=ID:fIsLinkVisible1\n";
							macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:assessmentForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
							e = iimPlay("CODE:" + macroCode);
						}
					}
				}
			}
			
			// finally add all the UNGRADED discussions that were created already by ArchiveBuilder
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Add<SP>Interactive<SP>Tool\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:addItemFormId ATTR=ID:rTool_1\n";
			e = iimPlay("CODE:" + macroCode);
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:itemId EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
			
			roughDiscussionList = extract.match(/<option .+?<\/option>/g);
			
			for (j=0;j<roughDiscussionList.length;j++) {
				if (roughDiscussionList[j].search(/Updates and Handouts/i) > -1) {
					discussionID = roughDiscussionList[j].match(/_\d+?_1/);
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:addItemForm ATTR=ID:itemId CONTENT=%"+discussionID+"\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
					e = iimPlay("CODE:" + macroCode);
							
					iimSet("ARTIFACT",cbsbArtifacts[2]);
					
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT={{ARTIFACT}}\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
					e = iimPlay("CODE:" + macroCode);
				}
			}
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Add<SP>Interactive<SP>Tool\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussion<SP>Board\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:addItemFormId ATTR=ID:rTool_1\n";
			e = iimPlay("CODE:" + macroCode);
			
			for (j=0;j<roughDiscussionList.length;j++) {
				if (roughDiscussionList[j].search(/Ask Your Instructor/i) > -1) {
					discussionID = roughDiscussionList[j].match(/_\d+?_1/);
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:addItemForm ATTR=ID:itemId CONTENT=%"+discussionID+"\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:addItemFormId ATTR=NAME:top_Next&&VALUE:Next\n";
					e = iimPlay("CODE:" + macroCode);
							
					iimSet("ARTIFACT",cbsbArtifacts[3]);
					
					macroCode = "TAB T=1\nFRAME F=2\n";
					macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
					macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:course_link ATTR=ID:link_desc_text CONTENT={{ARTIFACT}}\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:course_link ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
					e = iimPlay("CODE:" + macroCode);
				}
			}
		}
	}
}

/* this function goes through all the graded discussions, makes 
them gradable, and sets their point value to 100 points each */
function makeUnitDiscussionsGradeable(destinationTemplateID,userID,courseID,program,versionFolder) {	
	var roughDiscussionList = [];
	
	goToTemplate(destinationTemplateID)
	
	// go in the Discussions left navigation item
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Discussions\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// make certain that all the discussion topics are displayed on one page view
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:conferenceForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
	e = iimPlay("CODE:" + macroCode);
	
	// extract that page for parsing
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// make each TR an element in an array. each table row contains the specific ID for each discussion topic
	roughDiscussionList = extract.match(/<tr .+?<\/tr>/g);
	
	// if a discussions title contains a discussion activity code (u01dx) open it and make it gradeable for 100 points
	for (i=0;i<roughDiscussionList.length;i++) {
		if (roughDiscussionList[i].search(/u\d{2}d\d{1,2}/) != -1) {
			menuID = roughDiscussionList[i].match(/cmlink_[a-z0-9]{32}/)[0];
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:"+menuID+"\n";
			e = iimPlay("CODE:" + macroCode);
			
			menuID = menuID.replace(/cmlink_/,"editItem_")
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:"+menuID+"\n";
			e = iimPlay("CODE:" + macroCode);
			
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:forumForm ATTR=ID:gradeForum\n";
			macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:forumForm ATTR=ID:possiblePoints CONTENT=100\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:forumForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
			e = iimPlay("CODE:" + macroCode);
			
			// all the id numbers change when the page reloades so the list of IDs needs to be reassembled each time we alter a discussion
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
			
			roughDiscussionList = extract.match(/<tr .+?<\/tr>/g); 
		}
	}
}

/* this adds the course updates to the template. BlackBoard creates a problem for the macro with some 
poorly thought out form validation. This pauses a couple of times and prompts for user action as well
because I don't know a way to automate drag and drop dependent UI features */
function courseUpdates(destinationTemplateID,userID,courseID,program,versionFolder) {
	var menuID = "";
	var roughModuleList = "";
	var addModuleBttn = "";
	
	goToTemplate(destinationTemplateID)
	
	// extract the LI containing the button to create a leftnav item
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=LI ATTR=ID:addCmItem EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// acquire the ID number for the contextual menu
	menuID = extract.match(/cmlink_[a-z0-9]{32}/)[0];
	
	// expand the contextual menu
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:"+menuID+"\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// add a Course Module type lnav item and try to name it Course Updates
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:addModulePageButton\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/webapps/blackboard/execute/course/addtoc ATTR=ID:addModulePageName CONTENT=Course<SP>Updates\n";
	macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ACTION:/webapps/blackboard/execute/course/addtoc ATTR=ID:module_page_availability_ckbox CONTENT=YES\n";
	e = iimPlay("CODE:" + macroCode);
	
	// prompting for user action
	alert("ArchiveRestore says, \"I'm sorry, due to some janky form validation by BlackBoard, the \'Name\' field doesn't know it's got any content in it until there's been a keystroke in the field. It doesn't recognize the content I put in the field as a keystroke (discrimination!), and the submit button remains grayed out until there's been one.\n\n I simply can't work under these conditions and need you to:\n\t1. Close this alert dialog\n\t2. Move the cursor in that \'Name\' field (left arrow will work great!)\n\t3. Click \'Continue\' in the iMacros controls.\n\nI deeply apologize for this failure, but it really is BlackBoards fault. I'm just a simple script, trying to do my job... I could really use a hug, but I don't have a body to hug. Those 3 steps will have to do.\"")
	
	// pausing the macro for user action
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "PAUSE\n";
	e = iimPlay("CODE:" + macroCode);
	
	// when the user clicks "Continue" submit the form
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/webapps/blackboard/execute/course/addtoc ATTR=ID:addModulePageFormSubmit\n";
	e = iimPlay("CODE:" + macroCode);
	
	// enter the newly created module
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Course<SP>Updates\n";
	e = iimPlay("CODE:" + macroCode);
	
	// click the add module button in the content area
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Add<SP>Course<SP>Module\n";
	e = iimPlay("CODE:" + macroCode);
	
	// make certain that all the possible modules are displayed
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:content_listContainer_openpaging\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:content_listContainer_numResults CONTENT=1000\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:content_listContainer_gopaging\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// assemble an array, each element is one LI that contains all the info needed to add one module.
	roughModuleList = extract.match(/<li .+?<\/li>/g);
	
	// loop through the array adding the ones that are wanted
	for (i=0;i<roughModuleList.length;i++) {
		if (roughModuleList[i].search(/My Announcements/) != -1||roughModuleList[i].search(/Course Updates/) != -1||roughModuleList[i].search(/To Do/) != -1) {
			addModuleBttn = roughModuleList[i].match(/_\d+?_1\:_\d+?_1addButton/);
			macroCode = "TAB T=1\nFRAME F=2\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=ID:"+addModuleBttn+"\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
		}
	}
	
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
	e = iimPlay("CODE:" + macroCode);
	
	// prompt for user action to rearrange the modules in the desired configuration
	alert("ArchiveRestore says, \"It's me again, ArchiveRestore, and this is hard for me to admit... I don't have fingers to operate a mouse and I can't drag and drop.\n\nYou are going to have to rearrange the course modules on this page.\n\nAlso, please remember to move \'Course Updates\' below the \'Notifications\' subheader in the left nav.\"")
			
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "PAUSE\n";
	e = iimPlay("CODE:" + macroCode);
}

function gradeBookSetup(destinationTemplateID,userID,courseID,program,versionFolder,environment) {
	var grading_tbody = "";
	var rows = [];
	var validRows = [];
	var weights = [];
	var gradedActivity = [];
	var gradableActivities = [];
	var k = 0;
	var commonlyGradedDiscussions = [];
	var singleDiscussionWeight = 0;
	var itemValues = [];
	var columnTitles = [];
	var smartViewRows = [];
	
	function clicks(numOfClicks,upOrDown) {
		for (x=0; x<numOfClicks; x++) {
			if (upOrDown === 0) {
				macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
				macroCode += "TAG POS=1 TYPE=BUTTON ATTR=ID:gpRepoMoveUp\n";
				e = iimPlay("CODE:" + macroCode);
			} else if (upOrDown === 1) {
				macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
				macroCode += "TAG POS=1 TYPE=BUTTON ATTR=ID:gpRepoMoveDown\n";
				e = iimPlay("CODE:" + macroCode);
			}
		}
	}
	
	function smartViewFix(svCurrentName,svNewName) {
		currentName = svCurrentName + "</a>";
		newName = svNewName;
		smartViewRows = [];
		smartViewID = "";
	
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		smartViewRows = extract.match(/<tr.+?<\/tr>/g);
		
		for (i=0; i<smartViewRows.length; i++) {
			if (smartViewRows[i].search(currentName) != -1) {
				smartViewID = smartViewRows[i].substr(smartViewRows[i].search(/(cmlink_)[a-z0-9]{32}/) + 7,32);
			}
		}
	
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+smartViewID+"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:context_menu_tag_item1_"+smartViewID+"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:name CONTENT="+svNewName+"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:AddModifyCustomViewsForm ATTR=ID:favoriteCbox CONTENT=YES\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:custom_view_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
		e = iimPlay("CODE:" + macroCode);
	}
	
	macroCode = "TAB T=1\nFRAME NAME=\"nav\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Content<SP>Collection*\n";
	macroCode += "FRAME NAME=\"WFS_Navigation\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Course<SP>Content\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:courses\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "TAB T=1\nFRAME NAME=\"WFS_Files\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:filesForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+destinationTemplateID+"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+versionFolder+"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Syllabus\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:course_grading*\n";
	macroCode += "TAB T=2\n";
	macroCode += "TAG POS=1 TYPE=TBODY ATTR=* EXTRACT=HTM\n";
	macroCode += "TAB CLOSE\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	rows = extract.match(/<tr>.+?<\/tr>/g);
	
	for (i=0; i<rows.length; i++) {
		if (rows[i].search(/1\. Discussion Participation|u[0-9]{2}[adjq][0-9]{1,2}/) != -1) {
			validRows.push(rows[i]); // just the important rows now
		}
	}
	
	for (i=0; i<validRows.length; i++) { // all the weights on the page in the order in which they appear
		if (validRows[i].search(/1\. Discussion Participation/) != -1) {
			weights[i] = validRows[i].match(/[0-9]{1,2}(?=%)/);
		} else if (validRows[i].search(/u[0-9]{2}[adjq][0-9]{1,2}/) != -1) {
			weights[i] = validRows[i].match(/[0-9]{1,2}(?=%)/);
		}
	}
	
	for (i=0; i<validRows.length; i++) { // all the activity codes preceded by "1. Discussion Participation" because that matches the order of "weights". our two arrays are created and synchronized.
		if (validRows[i].search(/1\. Discussion Participation/) != -1) {
			gradedActivity[i] = "Discussion Participation";
		} else if (validRows[i].search(/u[0-9]{2}[adjq][0-9]{1,2}/) != -1) {
			gradedActivity[i] = validRows[i].match(/u[0-9]{2}[adjq][0-9]{1,2}/);
		}
	}
	
	goToTemplate(destinationTemplateID)
	
	// go to the Full Grading Center
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.grade.center_groupExpanderLink\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Full<SP>Grade<SP>Center\n";
	e = iimPlay("CODE:" + macroCode);

	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:*Create<SP>Calculated<SP>Column*\n";
	macroCode += "WAIT SECONDS=1\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Weighted<SP>Column\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:columnName CONTENT=Current<SP>Grade\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:gradebookDisplayName CONTENT=Current<SP>Grade\n";
	macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
	macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:manageCumulativeItemForm ATTR=ID:descriptiontext CONTENT=The<SP>weighted<SP>sum<SP>of<SP>all<SP>grades<SP>for<SP>a<SP>user<SP>based<SP>on<SP>item<SP>or<SP>category<SP>weighting.\n";
	macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:scorableNo\n";
	macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:visibleYes\n";
	macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:showStatToStudentNo\n";
	macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:prms_left_select EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	gradableActivities = extract.match(/[0-9]{4,10}">\[u[0-9]{2}[adjq][0-9]{1,2}/g);
		
	for (i=1; i<gradedActivity.length; i++) { // these nested for loops require that gradableActivities (the values of the items in the grading equation builder), gradedActivity ("1. Discussion Participation" + activity codes) and weights have the same number of individually graded activities.
		for (j=0; j<gradableActivities.length; j++) {
			if (gradableActivities[j].search(gradedActivity[i]) != -1) { 
				gradableActivities[j] = gradableActivities[j].replace(/">\[u[0-9]{2}[adjq][0-9]{1,2}/, ""); // strips the extra characters from each value
				
				macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
				macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%"+gradableActivities[j]+"\n";
				macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
				e = iimPlay("CODE:" + macroCode);
				
				macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
				macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight"+k+" CONTENT="+weights[i]+"\n"; // itemWeight is the order in which they appear
				e = iimPlay("CODE:" + macroCode);
				k++;
			}
		}
	}
	
	// extract that select tag and its children again now that only ungraded stuff and commonly graded discussion topics are left.
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:prms_left_select EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// populate an array with all the discussion topics that aren't graded individually, and their option value.
	commonlyGradedDiscussions = extract.match(/[0-9]{4,10}">\[u[0-9]{2}d[0-9]{1,2}/g); // 
	commonlyGradedDiscussions.sort(); // put IDs in their numeric order. they will be added to the gradebook equation in the same order in which the topics were created.
	
	singleDiscussionWeight = weights[0] / commonlyGradedDiscussions.length; // does the division to figure out what the individual weighted value is for each commonly graded discussion topic.
	
	for (i=0; i<commonlyGradedDiscussions.length; i++) {
		commonlyGradedDiscussions[i] = commonlyGradedDiscussions[i].replace(/">\[u[0-9]{2}d[0-9]{1,2}/, ""); // removes extra characters from each items value
		
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%"+commonlyGradedDiscussions[i]+"\n"; // uses the value to add the topic to the grading equation
		macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
		e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight"+k+" CONTENT="+singleDiscussionWeight+"\n"; // adds the individual topics weight
		e = iimPlay("CODE:" + macroCode);
		k++;
	}
	
	macoCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n"; // after all that is finished, the total weight should be %100. Blackboard will let you know if something when wrong, otherwise this will hit submit and Current Grade is done.
	e = iimPlay("CODE:" + macroCode);
	
	//-----------------------------------------------
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:*Create<SP>Calculated<SP>Column*\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Weighted<SP>Column\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:columnName CONTENT=Final<SP>Grade\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:gradebookDisplayName CONTENT=Final<SP>Grade\n";
	macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/textboxeditor/ed_html.gif\n";
	macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:manageCumulativeItemForm ATTR=ID:descriptiontext CONTENT=The<SP>weighted<SP>sum<SP>of<SP>all<SP>grades<SP>for<SP>a<SP>user<SP>based<SP>on<SP>item<SP>or<SP>category<SP>weighting.\n";
	macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:runningNo\n";
	macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:scorableNo\n";
	macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:visibleNo\n";
	macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:prms_left_select EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	gradableActivities = extract.match(/[0-9]{4,10}">\[u[0-9]{2}[adjq][0-9]{1,2}/g);
	
	k = 0;
		
	for (i=1; i<gradedActivity.length; i++) {
		for (j=0; j<gradableActivities.length; j++) {
			if (gradableActivities[j].search(gradedActivity[i]) != -1) {
				gradableActivities[j] = gradableActivities[j].replace(/">\[u[0-9]{2}[adjq][0-9]{1,2}/, "");
				
				macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
				macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%"+gradableActivities[j]+"\n";
				macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
				e = iimPlay("CODE:" + macroCode);
				
				macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
				macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight"+k+" CONTENT="+weights[i]+"\n";
				e = iimPlay("CODE:" + macroCode);
				k++;
			}
		}
	}
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:prms_left_select EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	commonlyGradedDiscussions = extract.match(/[0-9]{4,10}">\[u[0-9]{2}d[0-9]{1,2}/g);
	commonlyGradedDiscussions.sort();
	
	singleDiscussionWeight = weights[0] / commonlyGradedDiscussions.length;
	
	for (i=0; i<commonlyGradedDiscussions.length; i++) {
		commonlyGradedDiscussions[i] = commonlyGradedDiscussions[i].replace(/">\[u[0-9]{2}d[0-9]{1,2}/, "");
		
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:manageCumulativeItemForm ATTR=ID:prms_left_select CONTENT=%"+commonlyGradedDiscussions[i]+"\n";
		macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/cm_arrow_right.gif\n";
		e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:manageCumulativeItemForm ATTR=ID:itemWeight"+k+" CONTENT="+singleDiscussionWeight+"\n";
		e = iimPlay("CODE:" + macroCode);
		k++;
	}
	
	macoCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
	e = iimPlay("CODE:" + macroCode);

	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:*Manage*\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Column<SP>Organization\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/icons/cm_arrow.gif\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:sortAscendingMenuItem\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=4 TYPE=IMG ATTR=SRC:http://*.capella.edu/images/ci/ng/keyboard.gif\n";
	macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:gpRepoSel EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	itemValues = extract.match(/item_\d+(?=">)/g);
	columnTitles = extract.match(/[\[\] \d\w]+(?=<\/option>)/g);
	
	for (i=0; i<columnTitles.length; i++) {
		columnTitles[i] = columnTitles[i].trim()
		if (columnTitles[i] === "Current Grade") {
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:gpRepoSel CONTENT=%"+itemValues[i]+"\n";
			e = iimPlay("CODE:" + macroCode);
			
			clicks(i,0);
		}
		
		if (columnTitles[i] === "Final Grade") {
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:gpRepoSel CONTENT=%"+itemValues[i]+"\n";
			e = iimPlay("CODE:" + macroCode);
			
			clicks(i-1,0);
		}
	}	
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=BUTTON ATTR=ID:gpRepoApply\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:gradingPeriodLayoutForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
	e = iimPlay("CODE:" + macroCode);	

	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Manage\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Smart<SP>Views\n";
	e = iimPlay("CODE:" + macroCode);
	
	smartViewFix("Discussion Boards","Discussions",smartViewRows)	
	smartViewFix("Tests","Quizzes",smartViewRows)
	
	for (i=0; i<smartViewRows.length; i++) {
		if (smartViewRows[i].search(/Discussion Boards<\/a>/) != -1) {
			smartViewID = smartViewRows[i].substr(smartViewRows[i].search(/(cmlink_)[a-z0-9]{32}/) + 7,32);
		}
	}
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+smartViewID+"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:context_menu_tag_item1_"+smartViewID+"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:name CONTENT=Discussions\n";
	macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:AddModifyCustomViewsForm ATTR=ID:favoriteCbox CONTENT=YES\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:custom_view_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
	e = iimPlay("CODE:" + macroCode);
}

function templateProperties(destinationTemplateID) {
	var bb9Course_id = "";
	var entryPointOptions = [];
	var entryPointID = "";
	
	goToTemplate(destinationTemplateID)
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.customization_groupExpanderLink\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Properties\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:myForm ATTR=ID:courseName CONTENT="+destinationTemplateID+".preprod\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:myForm ATTR=NAME:top_Submit&&VALUE:Submit\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Style\n";
	macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ACTION:manageCourseDesign?cmd=save&course_id=_1049_1 ATTR=ID:textOnlyView\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=HTML ATTR=* EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	bb9Course_id = extract.match(/course_id=(_\d+?_1)/)[1];
	
	macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
	macroCode += "TAG POS=1 TYPE=SELECT ATTR=ID:entryCourseTocIdStr EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	entryPointOptions = extract.match(/<option.+?<\/option>/g);
	
	for (i=0; i<entryPointOptions.length; i++) {
		if (entryPointOptions[i].search(/Course Updates/) != -1) {
			entryPointID = entryPointOptions[i].match(/_\d+?_1/);
			
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ACTION:manageCourseDesign?cmd=save&course_id="+bb9Course_id+" ATTR=ID:textOnlyView\n";
			macroCode += "TAG POS=1 TYPE=SELECT FORM=ACTION:manageCourseDesign?cmd=save&course_id="+bb9Course_id+" ATTR=ID:entryCourseTocIdStr CONTENT=%"+entryPointID+"\n";
			macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:manageCourseDesign?cmd=save&course_id="+bb9Course_id+" ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
			e = iimPlay("CODE:" + macroCode);
		}
	}
}

function projectCleanup(destinationTemplateID) {
	var navButtonList = [];
	var projList = [];
	var cmMenuId = "";
	var cpContentItems = [];
	var projectTitle = "";
	var proj = "";
	
	goToTemplate(destinationTemplateID)
	
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=UL ATTR=ID:courseMenuPalette_contents EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	// this creates an array of all the content areas lnav buttons.
	navButtonList = extract.match(/(<li ).+?(<\/li>)/g);
	
	for (i=0; i<navButtonList.length; i++) {
		if (navButtonList[i].search(/Course Project/) != -1) {
			projList.push(navButtonList[i])
		}
	}
	
	if (projList.length == 1) {
		cmMenuId = projList[0].match(/cmlink_(\w{32})/)[1];
			
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+cmMenuId+"\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Rename<SP>Link\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:renameSubHeaderInputBox CONTENT=Course<SP>Project\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ONCLICK:javascript:theCourseMenu.saveRenamedSubHeaderItem()\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Course<SP>Project\n";
		e = iimPlay("CODE:" + macroCode);
			
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		cpContentItems = extract.match(/(<li ).+?(<\/li>)/g);
		
		for (i=0; i<cpContentItems.length; i++) {
			if (cpContentItems[i].search(/Course Project 1(?! Title)/) != -1) {
				cmMenuId = cpContentItems[i].match(/cmlink_(\w{32})/)[1];
				
				macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+cmMenuId+"\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_"+cmMenuId+"\n";
				macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:the_form ATTR=ID:user_title CONTENT=Course<SP>Project\n";
				macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
				e = iimPlay("CODE:" + macroCode);
			}
		}
		
		for (i=0; i<cpContentItems.length; i++) {
			if (cpContentItems[i].search(/(<caption class="access">)(.+?)( Scoring Guide Grading Rubric<\/caption>)/) != -1) {
				projectTitle = cpContentItems[i].match(/(<caption class="access">)(.+?)( Scoring Guide Grading Rubric<\/caption>)/)[2];
			}
		}
			
		macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
		macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();

		cpContentItems = extract.match(/(<li ).+?(<\/li>)/g);
		
		for (i=0; i<cpContentItems.length; i++) {
			if (cpContentItems[i].search(/Course Project 1 Title/) != -1) {
				cmMenuId = cpContentItems[i].match(/cmlink_(\w{32})/)[1];
				macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+cmMenuId+"\n";
				macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_"+cmMenuId+"\n";
				macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:the_form ATTR=ID:user_title CONTENT="+addIIMSpaces(projectTitle)+"\n";
				macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
				e = iimPlay("CODE:" + macroCode);
			}
		}
	}
	else if (projList.length > 1) {
		for (i=0; i<projList.length; i++) {
			cmMenuId = projList[i].match(/cmlink_(\w{32})/)[1];
			proj = projList[i].match(/Course Project \d/)[0];
			
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+addIIMSpaces(proj)+"\n";
			e = iimPlay("CODE:" + macroCode);
			
			macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
			macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
			e = iimPlay("CODE:" + macroCode);
			extract = iimGetLastExtract();
			
			cpContentItems = extract.match(/(<li ).+?(<\/li>)/g);
			
			for (j=0; j<cpContentItems.length; j++) {
				if (cpContentItems[j].search(/(<caption class="access">)(.+?)( Scoring Guide Grading Rubric<\/caption>)/) != -1) {
					projectTitle = cpContentItems[j].match(/(<caption class="access">)(.+?)( Scoring Guide Grading Rubric<\/caption>)/)[2];
				}
			}
			
			for (j=0; j<cpContentItems.length; j++) {
				if (cpContentItems[j].search(/Course Project \d Title/) != -1) {
					cmMenuId = cpContentItems[j].match(/cmlink_(\w{32})/)[1];
					macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
					macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_"+cmMenuId+"\n";
					macroCode += "TAG POS=1 TYPE=A ATTR=ID:edit_"+cmMenuId+"\n";
					macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:the_form ATTR=ID:user_title CONTENT="+addIIMSpaces(projectTitle)+"\n";
					macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:the_form ATTR=NAME:top_Submit&&VALUE:Submit\n";
					e = iimPlay("CODE:" + macroCode);
				}
			}
		}
	}
}

createTempTemplate(destinationTemplateID,userID,courseID,program)
addContentItemsToUnits(destinationTemplateID,userID,courseID,program,versionFolder)
makeUnitDiscussionsGradeable(destinationTemplateID,userID,courseID,program,versionFolder)
courseUpdates(destinationTemplateID,userID,courseID,program,versionFolder)
gradeBookSetup(destinationTemplateID,userID,courseID,program,versionFolder)
templateProperties(destinationTemplateID)
projectCleanup(destinationTemplateID)