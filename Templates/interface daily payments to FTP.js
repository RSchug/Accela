/*------------------------------------------------------------------------------------------------------/
| Program: PaymentsDailyBatch.js  Trigger: Batch    Client : N/A   SAN# : N/A
| 
|                                                                       
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START USER CONFIGURABLE PARAMETERS
|
|	Almost all user configurable parameters are stored in Standard Choices:
|	
|	Application Submittal Script Control : 	Points to Criteria/Action pairs (Standard Choice Entries)
|						by Application Type
|
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;			  // Set to true to see results in popup window
var showDebug = true;				  // Set to true to see debug messages in popup window
var controlString = "OnlinePaymentsDailyBatch";   // Standard choice for control
var documentOnly = false;			  // Document Only -- displays hierarchy of std choice steps
var disableTokens = false;			  // turn off tokenizing of App Specific and Parcel Attributes
var useAppSpecificGroupName = true;		  // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = true;		  // Use Group name when populating Task Specific Info Values
var maxEntries = 99;				  // Maximum number of std choice entries.  Must be Left Zero Padded
var maxSeconds = 4*60;				  // number of seconds allowed for batch processing, usually < 5*60
var maxDays = 999;				  // Maximum Span to search for scheduled inspections
var sysEnv; 
	sysEnv = lookup("AGENCY_CONTACT_INFO", "Env"); 
	if (sysEnv == "null") sysEnv = "";
var debug = "";    				  // Debug String

/*----------------------------------------------------------------------------------------------------/
|
| END USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var StartDateDays = aa.env.getValue("StartDateDays");    // number of days to go back (scheduled date, e.g. -30)
var EndDateDays = aa.env.getValue("EndDateDays");	 // number of days to go forward (e.g. 30)
//StartDateDays = -1;
//EndDateDays = 0;
var RE_PUBLICUSER = /^PUBLICUSER/;
/*----------------------------------------------------------------------------------------------------/
|
| END BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var message = "";
var startDate = new Date();
var startTime = startDate.getTime();			// Start timer
var todayDate = "" + startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate();

var firstDate = aa.util.dateDiff(aa.util.now(),"day",StartDateDays);
firstDate.setHours(00);
firstDate.setMinutes(00);
firstDate.setSeconds(00);
fileFirstDate = new Date(firstDate);
var dd = fileFirstDate.getDate();
if(dd<10){var dd='0'+dd;}
var mm = fileFirstDate.getMonth()+1;
if(mm<10){var mm='0'+mm;}
//aa.print("firstDate " + mm + dd + fileFirstDate.getFullYear());

var firstDateJava = new java.util.Date();
firstDateJava.setDate(firstDateJava.getDate() + parseInt(StartDateDays,10));
firstDateJava.setHours(00);
firstDateJava.setMinutes(00);
firstDateJava.setSeconds(00);
//aa.print("firstDateJava " + firstDateJava);

endDate = aa.util.dateDiff(aa.util.now(),"day",(EndDateDays));
endDate.setHours(00);
endDate.setMinutes(00);
endDate.setSeconds(00);
//aa.print("endDate " + endDate);

var endDateJava = new java.util.Date();
endDateJava.setDate(endDateJava.getDate() + parseInt(EndDateDays,10));
endDateJava.setHours(00);
endDateJava.setMinutes(00);
endDateJava.setSeconds(00);
//aa.print("endDateJava " + endDateJava);

var sysDate = aa.util.now();
var timeExpired = false;
var emailText = "";
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = aa.env.getValue("BatchJobName"); 
var recordsWritten = false; 
var filename = "Test_CityAccelaPayments" + mm + dd + fileFirstDate.getFullYear() + sysEnv + ".csv"; 
var filepath = "c://test"; 
var ftpsite = "ftp.test.org"; 
var ftplogin = "Finance"; 
var ftppassword = "MoNeY"; 
var ftppath = "/in"; 
var filehandle = null;
//var br = "<BR>";					// Break Tag
var br = "\r\n"

if (parseInt(EndDateDays) - parseInt(StartDateDays) > maxDays) {
	logMessage("FATAL: The batch script can search through a maximum span of " + maxDays + " days") ;
	aa.abortScript();
	}

if (documentOnly) { 
	doStandardChoiceActions(controlString,false,0); 
	aa.env.setValue("ScriptReturnCode", "0"); 
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript(); 
	}
	
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
| 
/-----------------------------------------------------------------------------------------------------*/
//aa.print(("START: Searching online payments from " + firstDate + " to " + endDate));
logMessage("*** This script - DailyPaymentsBatch - is in the Test City Agency - \r\n")
logMessage("START: Searching online payments from " + firstDate + " to " + endDate);

payResult = aa.finance.getPaymentByDate(firstDate,endDate,null);
if (payResult.getSuccess())
	{
	payArray = payResult.getOutput();
//aa.print("Searching through " + payArray.length + " payments.");
	logMessage("Searching through " + payArray.length + " payments.");

	//aa.util.writeToFile("Date,Distribution Code,Payment Code,Amount,Customer Name,Source\r\n",(filepath + "/" + filename))
//aa.print("Date,Distribution Code,Payment Code,Amount,Customer Name,Source");
	logMessage("Date,Distribution Code,Payment Code,Amount,Customer Name,Source");

	for (ii in payArray)
		{
		if (elapsed() > maxSeconds) // only continue if time hasn't expired
			{ 
			logMessage("A script timeout has caused partial completion of this process.  Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.") ;
			logMessage("Looped through " + ii + " records.") ;
			timeExpired = true ;
			break; 
			}    			
		if (payArray[ii] === null)
			{
			logMessage("payment #" + ii + " is null");
			continue;
			}
			

		var payObj = payArray[ii];
//for (x in payObj) {aa.print(x + " : " + payObj[x])};		
		capTemp = payObj.getCapID();  // reload the cap to get the custom id
		capId = aa.cap.getCapID(capTemp.getID1(),capTemp.getID2(),capTemp.getID3()).getOutput();
		
		paySeq = payObj.getPaymentSeqNbr();
	        var paidDate = payObj.getPaymentDate();	
		var pdmm = paidDate.getMonth()-1;
	        var pddd = paidDate.getDayOfMonth();
	        var pdyy = paidDate.getYear() - 1900;
	        var pdhh = paidDate.getHourOfDay();
	        var pdmi = paidDate.getMinute();
	        var pdss = paidDate.getSecond();
	        var paymentDateJava = new java.util.Date(pdyy,pdmm,pddd,pdhh,pdmi,pdss);
	        //var paymentDateJava = paidDate;
//aa.print("paymentDateJava = " + paymentDateJava);
//aa.print("paymentStatus = " + payObj.paymentStatus);
	        //if (paymentDateJava >= firstDateJava && paymentDateJava <= endDateJava) { 
		logMessage("The paymentDate is:"+paymentDateJava+", and the valid date range is between: {" + firstDateJava + "} and {"+ endDateJava + "}.");
		if ( paymentDateJava.getTime() >= firstDateJava.getTime() && paymentDateJava.getTime() <= endDateJava.getTime()){
			var altIDString = capId.getCustomID();					// alternate cap id string
//aa.print("Record: " + altIDString);	
		   pfResult = aa.finance.getPaymentFeeItems(capId, null);
		   if (pfResult.getSuccess()) {
			pfObj = pfResult.getOutput();
			for (ij in pfObj) {
				if (paySeq == pfObj[ij].getPaymentSeqNbr()){
				//if (paySeq == paySeq){	
					recordsWritten = true;
					filehandle = writePaymentFile(payObj,pfObj[ij],filepath, filename);		
				}
			}
		   }		
		   else {
			logMessage("ERROR: getting payments fees: " + pfResult.getErrorMessage());
			}  // each payment
		}
	        else {
	        	logMessage("Payment does not occur in requested time window: " + paymentDateJava);   
	        	}
     }}
     else
	{
	logMessage("ERROR: getting payments: " + payResult.getErrorMessage());
	}

if (recordsWritten)
	{
	aa.util.ftpUpload(ftpsite, "21", ftplogin, ftppassword, ftppath, filehandle)
	aa.util.deleteFile(filepath + "/" + filename);
	}

//aa.print("End of Job: Elapsed Time : " + elapsed() + " Seconds");	
logMessage("End of Job: Elapsed Time : " + elapsed() + " Seconds");

aa.print(message);		
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/

function writePaymentFile(po,pf,mypath,myfn)
	{
	var d = ",";
	var fn = mypath + "//" + myfn;
	//"c://test//Invoice" + InvoiceNbrArray[0] + ".csv"
	var UDF1 = "";
	var UDF2 = "";
	var UDF3 = "";
	var UDF4 = "";
	var os = "";
	var altIDString = capId.getCustomID();					// alternate cap id string

	
//aa.print("Record: " + altIDString + " PaySeq: " + po.getPaymentSeqNbr()  + " Total Payment: " + po.getPaymentAmount());	

	fiSeq = pf.getFeeSeqNbr();
	fi = aa.finance.getFeeItemByPK(capId, fiSeq).getOutput();

//for (x in fi) {aa.print(x)};
//aa.print(convertDate(fi.getAuditDate()));
//aa.print(convertDate(fi.getApplyDate()));
//aa.print(convertDate(fi.getAuditDate()));
//aa.print(convertDate(fi.getEffectDate()));
//aa.print(convertDate(fi.getExpireDate()));
//aa.print(fi.getFeeitemStatus());
	
/*	if (fi.auditDate === null)
	   os+= "Date not Found";
	else 
	   os += (convertDate(fi.getAuditDate()));
	   os += d;
*/

	if (paidDate === null)
	   os+= "Date not Found";
	else 
	   os += (convertDate(paidDate));
	   os += d;


	if (fi.getAccCodeL1()=== null)
	  {os+= "Account code 1 not Found";}
	else
	os += fi.getAccCodeL1();      
        os += d;
        
/*
	if (fi.getAccCodeL2() === null)
	  {os+= "Account code 2 not Found";}
	else
	os += fi.getAccCodeL2();      
        os += d;
*/        

	if (po.getPaymentMethod() == 'Check') {
		os += '31';
		os += d; }
	else if (po.getPaymentMethod() == 'Credit Card') {
		os += '32';
		os += d; }
	else if (po.getPaymentMethod() == 'Cash') {
		os += '30';
		os += d; }
	else {
		os += po.getPaymentMethod();
		os += d;}				
        
        os += fi.getFee();
        os += d;
        
	if (po.payee === null)
	  {os+= "";
	  os += d;}
	else
	  {
	  	var tmplen = po.payee.length()
	  	if (tmplen > 30){os += po.payee.substring(0,30);os += d;}
	  	else
	  	{os += po.payee;os += d;}
           }
	
	
	os += "ACCELA";
       /*  if (RE_PUBLICUSER.test(po.getCashierID()))
              {os += "ONLINE";}
         else
              {os += po.getPaymentMethod();}
	*/
       	os += "\r\n";

//aa.print(os);
logMessage(os);

	var f = aa.util.writeToFile(os,fn);
	return f;
	}

function zeroLeftPad(stw,noz)
	{
	if (stw === null) { stw = ""; }
	var workstr = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" + stw;
	return String(workstr).substring(workstr.length,workstr.length - noz);
	}
	
function spaceLeftPad(stw,nos)
	{
	if (stw === null) { stw = ""; }
	var workstr = "                                                                                                      " + stw;
	return String(workstr).substring(workstr.length,workstr.length - nos);
	}
	
function spaceRightPad(stw,nos)
	{
	if (stw == null) { stw = "" }
	var workstr = stw + "                                                                                                ";
	return String(workstr).substring(0,nos);
	}
	
function logDebug(dstr)
	{
	debug+=dstr + br;
	}
	
function logMessage(dstr)
	{
	message+=dstr + br;
	}

function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000) 
	}	
	
function dateFormatted(pMonth,pDay,pYear,pFormat)
//returns date string formatted as YYYY-MM-DD or MM/DD/YYYY (default)
	{
	var mth = "";
	var day = "";
	var ret = "";
	if (pMonth > 10)
		mth = pMonth.toString();
	else
		mth = "0"+pMonth.toString();
	
	if (pDay > 10)
		day = pDay.toString();
	else
		day = "0"+pDay.toString();

	ret = ""+mth+"/"+day+"/"+pYear.toString();	
	
	if (pFormat=="YYYY-MM-DD")
		ret = pYear.toString()+"-"+mth+"-"+day;
	
	if (pFormat=="MMDDYY")
		ret = mth+day+pYear.toString().substring(2);
	
	return ret;
	}
	
function currency(amount)
{
	var i = parseFloat(amount);
	if(isNaN(i)) { i = 0.00; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	i = parseInt((i + .005) * 100);
	i = i / 100;
	s = new String(i);
	if(s.indexOf('.') < 0) { s += '00'; }
	if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
	s = minus + s;
	s = s.replace(".","");
	return s;
}

function convertDate(thisDate)
// convert ScriptDateTime to Javascript Date Object
	{
	if (thisDate != null) {
	return dateFormatted(thisDate.getMonth(),thisDate.getDayOfMonth(),thisDate.getYear());  
	//return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
		}

	}

function lookup(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		var strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
	}