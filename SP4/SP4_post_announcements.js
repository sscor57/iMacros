alert("ATTENTION!!! The body of your announcement must be HTML formatted, and the announcement tools WYSIWYG Text-Editor must be set to \"OFF\"!");
var courseID = prompt("Please Enter the Course ID.","MBA6004");
var integrationDate = prompt("Enter the Integration Date for the Sections that Need an Announcement Posted.", "07/30/2012");
var userID = prompt("Please Enter Your User ID", "cswope");
var sectionIDSearch = "";
var sectionList = new Array;
var macroCode = "";
var a = 1; // used to increment up the position of the contextual menus in enrollMe() and unenrollMe()
var enrolled = false;

var announcementSubject = prompt("Enter the subject or title of the announcement.","test");
announcementSubject = announcementSubject.replace(/ /g, "<SP>");
var announcementBody = prompt("Enter the body of the announcement.","test test test test test");
announcementBody = announcementBody.replace(/ /g, "<SP>");

var displayAfter = "08/10/2012";
var displayUntil = "08/15/2012";

function enrollMe(courseID,integrationDate,userID) {
	sectionIDSearch = courseID+"_......_._...._..._..[0-9]?";
	
	macroCode = "TAB T=1\nFRAME F=1\n";
	macroCode += "SET !REPLAYSPEED MEDIUM\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin*\n";
	macroCode += "FRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
	macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchKeyString CONTENT=%CourseId\n";
	macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:courseInfoSearchOperatorString CONTENT=%Contains\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:courseInfoSearchText CONTENT="+courseID+"\n";
	macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:courseManagerFormSearch ATTR=NAME:dateCreatedSearchOperatorString CONTENT=%GreaterThan\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerFormSearch ATTR=ID:dp_bbDateTimePicker_date CONTENT="+integrationDate+"\n";
	macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:courseManagerFormSearch ATTR=VALUE:Go\n";
	e = iimPlay("CODE:" + macroCode);

	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
	macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
	macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
	e = iimPlay("CODE:" + macroCode);
	
	macroCode = "TAB T=1\nFRAME F=2\n";
	macroCode += "TAG POS=1 TYPE=TABLE ATTR=* EXTRACT=HTM\n";
	e = iimPlay("CODE:" + macroCode);
	extract = iimGetLastExtract();
	
	sectionList = extract.match(sectionIDSearch, "g");
	
	for (i=0; i<sectionList.length; i++) {
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS="+a+" TYPE=A ATTR=ID:cmlink_*\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:admin_course_list_users\n";
		macroCode += "TAG POS=3 TYPE=A ATTR=ID:<SP>\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:myForm ATTR=ID:userName CONTENT="+userID+"\n";
		macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:myForm ATTR=ID:courseRoleId CONTENT=%C\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:myForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
		e = iimPlay("CODE:" + macroCode);
		
		a++;
	}
}

function postAnnouncements(announcementSubject,announcementBody,displayAfter,displayUntil) {
	for (i=0; i<sectionList.length; i++) {
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:"+sectionList[i]+"\n";
		macroCode += "FRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Announcements\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Create<SP>Announcement*\n";
		e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "WAIT SECONDS=3\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:announcementForm ATTR=ID:subject CONTENT="+announcementSubject+"\n";
		macroCode += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:announcementForm ATTR=ID:messagetext CONTENT="+announcementBody+"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:announcementForm ATTR=ID:start_restrict CONTENT=YES\n";
		macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:announcementForm ATTR=ID:end_restrict CONTENT=YES\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:announcementForm ATTR=ID:dp_restrict_start_date CONTENT="+displayAfter+"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:announcementForm ATTR=ID:dp_restrict_end_date CONTENT="+displayUntil+"\n";
		macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:announcementForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
		e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME F=1\n";
		macroCode += "SET !REPLAYSPEED MEDIUM\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:System<SP>Admin*\n";
		macroCode += "FRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Courses\n";
		e = iimPlay("CODE:" + macroCode);
	}
}

function unenrollMe(userID) {
	var prodID = "";
	var subExtract = "";
	var idMatch = "[0-9]+";
	a = 1;
	
	for (i=0; i<sectionList.length; i++) {
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS="+a+" TYPE=A ATTR=ID:cmlink_*\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:admin_course_list_users\n";
		e = iimPlay("CODE:" + macroCode);
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "TAG POS=1 TYPE=TABLE ATTR=* EXTRACT=HTM\n";
		e = iimPlay("CODE:" + macroCode);
		extract = iimGetLastExtract();
		
		subExtract = extract.slice(extract.lastIndexOf(userID) + 200,extract.lastIndexOf(userID) + 240);
		prodID = subExtract.match(idMatch);
		
		macroCode = "TAB T=1\nFRAME F=2\n";
		macroCode += "SET !REPLAYSPEED MEDIUM\n";
		macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:enrollmentsForm ATTR=ID:listContainer_ckbox"+prodID+" CONTENT=YES\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_link_*_bottom\n";
		macroCode += "WAIT SECONDS=1\n";
		macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
		macroCode += "WAIT SECONDS=1\n";
		macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
		e = iimPlay("CODE:" + macroCode);
		
		a++;
	}
}

try {
	if (courseID.length > 0&&integrationDate.length > 0&&userID.length > 0) {
		enrollMe(courseID,integrationDate,userID);
		enrolled = true;
	} else {
		alert("Some fields were left blank. Relaunch the sript and be more careful next time.");
	}
	if (announcementSubject != null&&announcementBody != null) {
		postAnnouncements(announcementSubject,announcementBody,displayAfter,displayUntil);
	}
	if (enrolled == true) {
		unenrollMe(userID);
	}
}
catch(err) {}