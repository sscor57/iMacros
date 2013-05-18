var controlFlow = function(){
    var macroCode = "";
    var e = "";	
    var extract = "";
    var i = "";
    var rowsToScan = new Array;
    var contextualMenuIdNumber = "";
    var sectionStart = "";

    //var userName = prompt("Please enter your Username","abianchi1");
    //var sectionStart = prompt("Please enter what # of section to start on","1")        

    macroCode = "TAB T=1\nFRAME F=2\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
    macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);
    extract = iimGetLastExtract();
    
    rowsToScan = extract.match(/<tr .+?<\/tr>/g);

    for (i = 1; i < rowsToScan.length; i++) {
        len = i;
        //userEnroll();
        gradebook();
    }
}

var userEnroll = function() {
    var macroCode = "";
    var e = "";	
    var extract = "";

    macroCode = "TAB T=1\nFRAME F=2\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
    macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);
    extract = iimGetLastExtract();
    
    rowsToScan = extract.match(/<tr .+?<\/tr>/g);
    contextualMenuIdNumber = rowsToScan[i].match(/cmlink_(\w{32})/)[1];
    
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:admin_course_list_users\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Enroll<SP>Users\n";
    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:myForm ATTR=ID:userName CONTENT=" + userName + "\n";
    macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:myForm ATTR=ID:courseRoleId CONTENT=%C\n";
    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:myForm ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
    e = iimPlay("CODE:" + macroCode);
}

var gradebook = function() {
    var macroCode = "";
    var e = "";	
    var extract = "";
    
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
            var extract = "";
            var smartViewRows = [];
            var currentTitle = "";
            var contextualMenuIdNumber = "";
            var assignCode = [];
    		var tdCode = [];
		
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
                        macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:dataCollectionContainer EXTRACT=HTM\n";
                        e = iimPlay("CODE:" + macroCode);
                        extract = iimGetLastExtract();
                        
                        alert(extract);

                        tdCode = extract.match(/<label for\=\"categorySel[\s\S]+?<\/td>/);
                        alert(tdCode);
                        assignCode = tdCode[0].match(/[0-9]{4}/g)[0];
                        alert(assignCode);
			
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:custom_view_form ATTR=ID:status\n";
		            	macroCode += "WAIT SECONDS=1\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:categorySel CONTENT=%" + assignCode + "\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:userSel CONTENT=%all\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:filterQueryCriteria CONTENT=%ALL\n";
                        e = iimPlay("CODE:" + macroCode);
                    }
                    
                    if (newTitle === "Quizzes") {
                        macroCode = "TAB T=1\nFRAME F=2\n";
                		macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:dataCollectionContainer EXTRACT=HTM\n";
                        e = iimPlay("CODE:" + macroCode);
                        extract = iimGetLastExtract();
                        
                        alert(extract);

                        tdCode = extract.match(/<label for\=\"categorySel[\s\S]+?<\/td>/);
                        
                        alert(tdCode);
                        
    	                assignCode = tdCode[0].match(/[0-9]{4}/g)[14];
    	                
	            		alert(assignCode);
                        
                        macroCode = "TAB T=1\nFRAME F=2\n";
                        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:custom_view_form ATTR=ID:status\n";
                        macroCode += "WAIT SECONDS=1\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:categorySel CONTENT=%" + assignCode + "\n";
                        macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:userSel CONTENT=%all\n";
                        e = iimPlay("CODE:" + macroCode);
                    }
                    
                    macroCode = "TAB T=1\nFRAME F=2\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:name CONTENT=" + newTitle + "\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:AddModifyCustomViewsForm ATTR=ID:favoriteCbox CONTENT=YES\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:custom_view_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
                    e = iimPlay("CODE:" + macroCode);
                }
				
                if (newTitle === "Discussions") {
                    macroCode = "TAB T=1\nFRAME F=2\n";
            		macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:dataCollectionContainer EXTRACT=HTM\n";
               		e = iimPlay("CODE:" + macroCode);
                    extract = iimGetLastExtract();
                    
                    alert(extract);

                    tdCode = extract.match(/<label for\=\"categorySel[\s\S]+?<\/td>/);
                    
                    alert(tdCode);
                    
	                assignCode = tdCode[0].match(/[0-9]{4}/g)[5];
	                
        			alert(assignCode);
                        
                    macroCode = "TAB T=1\nFRAME F=2\n";
                    macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:custom_view_form ATTR=ID:status\n";
        			macroCode += "WAIT SECONDS=1\n";
                    macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:categorySel CONTENT=%" + assignCode + "\n";
                    macroCode += "TAG POS=1 TYPE=SELECT FORM=NAME:AddModifyCustomViewsForm ATTR=ID:userSel CONTENT=%all\n";
                    e = iimPlay("CODE:" + macroCode);
                }
            }
        }
        
        try {
            macroCode = "TAB T=1\nFRAME F=2\n";
		    macroCode += "WAIT SECONDS=4\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Manage\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Smart<SP>Views\n";
            e = iimPlay("CODE:" + macroCode);

            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=NAME:manage_views_form ATTR=ID:listContainer_selectAll CONTENT=YES\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Favorites\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Remove<SP>from<SP>Favorites\n";
            e = iimPlay("CODE:" + macroCode);

            editSmartview("Assignments", "Assignments");
            editSmartview("Discussions", "Discussions");
            editSmartview("Quizzes", "Quizzes");
                        
            macroCode = "TAB T=1\nFRAME F=2\n";
            macroCode += "TAG POS=1 TYPE=A ATTR=TXT:OK\n";
            e = iimPlay("CODE:" + macroCode);

            progressMessage += "\n";
            return
        } catch(err) {
            alert(err + " smartViews is having problems.");
        }
    }
}

//remove Weighted and Total Columns
var removeColumns = function() {
    var cmScreenReader = "";
    var macroCode = "";
    var e = "";	
    var extract = "";
    var cmColumns = "";
    var cmWeighted = "";
    var tHead = "";
			
    //Find Screen Reader
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:pageTitleBar EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);
    extract = iimGetLastExtract();
    
    cmScreenReader = extract.match(/cmlink_(\w{32})/)[1];
    	
    //Turn it On
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmScreenReader + "\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:standardMenuItem*\n";
    macroCode += "WAIT SECONDS=1\n";
    e = iimPlay("CODE:" + macroCode);

    //Open Weighted Grading Column Options
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:table1_accessible_container EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);
    extract = iimGetLastExtract();
			
    //Edit Weighted Column
    if (extract.match(/cmlink_(\w{32}_0_5)/) != null) {
        cmWeighted = extract.match(/cmlink_(\w{32}_0_5)/)[1];
            
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmWeighted + "\n";
        macroCode += "WAIT SECONDS=1\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Edit<SP>Column<SP>Information\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:scorableNo\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:visibleNo\n";
        macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        macroCode += "WAIT SECONDS=2\n";				
        e = iimPlay("CODE:" + macroCode);
    } else {
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Weighted<SP>Total\n";
        macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:table1_accessible_container EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        
        cmWeighted = extract.match(/cmlink_(\w{32}_0_5)/)[1];
    
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmWeighted + "\n";
        macroCode += "WAIT SECONDS=1\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Edit<SP>Column<SP>Information\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:scorableNo\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:visibleNo\n";
        macroCode += "ONDIALOG POS=1 BUTTON=OK CONTENT=\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        macroCode += "WAIT SECONDS=2\n";
        e = iimPlay("CODE:" + macroCode);
    }
    
    //Hide Weighted Column
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:table1_accessible_container EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);
    extract = iimGetLastExtract();
    
    if (extract.match(/cmlink_(\w{32}_0_5)/) != null) {
        cmWeighted = extract.match(/cmlink_(\w{32}_0_5)/)[1];
    
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmWeighted + "\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Hide<SP>Column\n";
        macroCode += "WAIT SECONDS=2\n";
        e = iimPlay("CODE:" + macroCode);
    } else {
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Weighted<SP>Total\n";
        macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:table1_accessible_container EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        
        cmWeighted = extract.match(/cmlink_(\w{32}_0_5)/)[1];
        
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmWeighted + "\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Hide<SP>Column\n";
        macroCode += "WAIT SECONDS=2\n";
        e = iimPlay("CODE:" + macroCode);
    }
    
    //Edit Total Column	
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:table1_accessible_container EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);
    extract = iimGetLastExtract();
    
    if (extract.match(/cmlink_(\w{32}_0_5)/) != null) {
        cmWeighted = extract.match(/cmlink_(\w{32}_0_5)/)[1];
        
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmWeighted + "\n";
        macroCode += "WAIT SECONDS=1\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Edit<SP>Column<SP>Information\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:visibleNo\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        macroCode += "WAIT SECONDS=2\n";
        e = iimPlay("CODE:" + macroCode);
    } else {
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Total\n";
        macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:table1_accessible_container EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        
        cmWeighted = extract.match(/cmlink_(\w{32}_0_5)/)[1];				

        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmWeighted + "\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Edit<SP>Column<SP>Information\n";
        macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:manage_cumulative_form ATTR=ID:visibleNo\n";
        macroCode += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:manage_cumulative_form ATTR=NAME:bottom_Submit&&VALUE:Submit\n";
        macroCode += "WAIT SECONDS=2\n";
        e = iimPlay("CODE:" + macroCode);
    }                   
        
    //Hide Total Column
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:table1_accessible_container EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);
    extract = iimGetLastExtract();
    
    if (extract.match(/cmlink_(\w{32}_0_5)/) != null) {
        cmWeighted = extract.match(/cmlink_(\w{32}_0_5)/)[1];
        
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";		
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmWeighted + "\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Hide<SP>Column\n";
        macroCode += "WAIT SECONDS=3\n";
        e = iimPlay("CODE:" + macroCode);
    } else {
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Total\n";
        macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:table1_accessible_container EXTRACT=HTM\n";
        e = iimPlay("CODE:" + macroCode);
        extract = iimGetLastExtract();
        
        cmWeighted = extract.match(/cmlink_(\w{32}_0_5)/)[1];	
        
        macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";		
        macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmWeighted + "\n";
        macroCode += "TAG POS=1 TYPE=A ATTR=TITLE:Hide<SP>Column\n";
        macroCode += "WAIT SECONDS=3\n";
        e = iimPlay("CODE:" + macroCode);
    }
        
    //Turn Screen Reader Off	
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=DIV ATTR=ID:pageTitleBar EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);
    extract = iimGetLastExtract();
    
    cmScreenReader = extract.match(/cmlink_(\w{32})/)[1];
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + cmScreenReader + "\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:standardMenuItem*\n";
    macroCode += "WAIT SECONDS=1\n";
    e = iimPlay("CODE:" + macroCode);

    macroCode = "TAB T=1\nFRAME F=2\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.grade.center_groupExpanderLink\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Full<SP>Grade<SP>Center\n";
    e = iimPlay("CODE:" + macroCode);
}
	
var fixUnit = function(){
    var contextualGSNum = "";
    var extract = "";

    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=SPAN ATTR=TXT:Unit<SP>8\n";
    macroCode += "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=UL ATTR=ID:content_listContainer EXTRACT=HTM\n";
    e = iimPlay("CODE:" + macroCode);
    extract = iimGetLastExtract();

    contextualGSNum = extract.match(/cmlink_(\w{32})/g)[1];
    
    macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:" + contextualGSNum + "\n";
    macroCode += "TAG POS=1 TYPE=A ATTR=ID:remove_*\n";
    macroCode += "WAIT SECONDS=1\n";
    e = iimPlay("CODE:" + macroCode);
}

macroCode = "TAB T=1\nFRAME F=2\n";
macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_openpaging\n";
macroCode += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:courseManagerForm ATTR=ID:listContainer_numResults CONTENT=1000\n";
macroCode += "TAG POS=1 TYPE=A ATTR=ID:listContainer_gopaging\n";
macroCode += "TAG POS=1 TYPE=TBODY ATTR=ID:listContainer_databody EXTRACT=HTM\n";
e = iimPlay("CODE:" + macroCode);
extract = iimGetLastExtract();

rowsToScan = extract.match(/<tr .+?<\/tr>/g);
contextualMenuIdNumber = rowsToScan[len].match(/cmlink_(\w{32})/)[1];

macroCode = "TAB T=1\nFRAME NAME=\"content\"\n";
macroCode += "TAG POS=1 TYPE=A ATTR=ID:cmlink_" + contextualMenuIdNumber + "\n";
macroCode += "TAG POS=1 TYPE=A ATTR=ID:openItem*\n";
macroCode += "TAB T=2\nFRAME NAME=\"content\"\n";
macroCode += "TAG POS=1 TYPE=A ATTR=ID:controlpanel.grade.center_groupExpanderLink\n";
macroCode += "TAG POS=1 TYPE=A ATTR=TXT:Full<SP>Grade<SP>Center\n";
e = iimPlay("CODE:" + macroCode);
        
//smartViews();
fixUnit();
//removeColumns();

macroCode = "TAB T=1\n TAB CLOSE\n";
e = iimPlay("CODE:" + macroCode);

controlFlow();