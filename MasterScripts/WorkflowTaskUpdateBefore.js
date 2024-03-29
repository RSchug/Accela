/*------------------------------------------------------------------------------------------------------/
| SVN $Id: WorkflowTaskUpdateBefore.js 6515 2012-03-16 18:15:38Z john.schomp $
| Program : WorkflowTaskUpdateBeforeV.js
| Event   : WorkflowTaskUpdateBefore
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   : Requires the TaskSpecificInfoModels parameter on this event.
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var controlString = "WorkflowTaskUpdateBefore"; 				// Standard choice for control
var preExecute = "PreExecuteForAfterEvents"				// Standard choice to execute first (for globals, etc)
var documentOnly = false;						// Document Only -- displays hierarchy of std choice steps

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 9.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script and Master Scripts, else use Events->Scripts->INCLUDES_*
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true; // compatibility default
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr3 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "USE_MASTER_INCLUDES");
	if (bvr3.getSuccess()) {if(bvr3.getOutput().getDescription() == "No") useCustomScriptFile = false}; 
}

if (SA) {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA,useCustomScriptFile));
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM",null,useCustomScriptFile));

if (documentOnly) {
	doStandardChoiceActions(controlString, false, 0);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript();
}

var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName);

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
var wfTSI = aa.env.getValue("TaskSpecificInfoModels");	// Workflow Task Specific Info Array
logDebug("TSIM = " + wfTSI);
var wfDate = aa.env.getValue("WorkflowStatusDate");	// Workflow Task Date
var wfTask = aa.env.getValue("WorkflowTask");		// Workflow Task Triggered event
var wfStatus = aa.env.getValue("WorkflowStatus");	// Status of workflow that triggered event
var wfLastName = aa.env.getValue("StaffLastName");
var wfFirstName = aa.env.getValue("StaffFirstName");
var wfMiddleName = aa.env.getValue("StaffMiddleName");
var wfProcessID = aa.env.getValue("ProcessID");
var wfHours = aa.env.getValue("HoursSpent");
if (wfMiddleName.length() == 0) wfMiddleName = null;
var wfUserObj = aa.person.getUser(wfFirstName,wfMiddleName,wfLastName).getOutput();
var wfUserId = " ";
if (wfUserObj) wfUserId = wfUserObj.getUserID();
var wfDateMMDDYYYY = wfDate.substr(5,2) + "/" + wfDate.substr(8,2) + "/" + wfDate.substr(0,4);	// date of status of workflow that triggered event in format MM/DD/YYYY
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");
var wfStep ; var wfDue ; var wfProcess ; var wfTaskObj;		// Initialize

var wfObj = aa.workflow.getTasks(capId).getOutput();
for (i in wfObj)
	{
	fTask = wfObj[i];
	if (fTask.getTaskDescription().equals(wfTask) && (fTask.getProcessID() == wfProcessID))
		{
		wfStep = fTask.getStepNumber();
		wfProcess = fTask.getProcessCode();
		wfDue = fTask.getDueDate();
		wfTaskObj = fTask;
		}
	}

if (wfTSI != "")
	{
	for (TSIm in wfTSI)
		{
		if (useTaskSpecificGroupName)
			AInfo["Updated." + wfProcess + "." + wfTask + "." + wfTSI[TSIm].getCheckboxDesc()] = wfTSI[TSIm].getChecklistComment();
		else
			AInfo["Updated." + wfTSI[TSIm].getCheckboxDesc()] = wfTSI[TSIm].getChecklistComment();
		}
	}


logDebug("wfDate = " + wfDate);
logDebug("wfDateMMDDYYYY = " + wfDateMMDDYYYY);
logDebug("wfTask = " + wfTask);
logDebug("wfStep = " + wfStep);
logDebug("wfProcess = " + wfProcess);
logDebug("wfStatus = " + wfStatus);
logDebug("wfUserId = " + wfUserId);
if(wfTaskObj)
	logDebug("wfTaskObj = " + wfTaskObj.getClass());
logDebug("wfHours = " + wfHours);

/* Added for version 1.7 */
var wfStaffUserID = aa.env.getValue("StaffUserID");
var timeAccountingArray = new Array()
if(aa.env.getValue("TimeAccountingArray") != "")
	timeAccountingArray =  aa.env.getValue("TimeAccountingArray");
var wfTimeBillable = aa.env.getValue("Billable");
var wfTimeOT = aa.env.getValue("Overtime");
logDebug("wfStaffUserID = " + wfStaffUserID);
logDebug("wfTimeBillable = " + wfTimeBillable);
logDebug("wfTimeOT = " + wfTimeOT);


if (timeAccountingArray != null || timeAccountingArray !='')
	{
			for(var i=0;i<timeAccountingArray.length;i++)
			{
			var timeLogModel = timeAccountingArray[i];
			var timeLogSeq = timeLogModel.getTimeLogSeq();
			var dateLogged = timeLogModel.getDateLogged();
			var startTime = timeLogModel.getStartTime();
			var endTime	= timeLogModel.getEndTime();
			var timeElapsedHours = timeLogModel.getTimeElapsed().getHours();
			var timeElapsedMin = timeLogModel.getTimeElapsed().getMinutes();

			logDebug("TAtimeLogSeq = " + timeLogSeq);
			logDebug("TAdateLogged = " + dateLogged);
			logDebug("TAstartTime = " + startTime);
			logDebug("TAendTime = " + endTime);
			logDebug("TAtimeElapsedHours = " + timeElapsedHours);
			logDebug("TAtimeElapsedMin = " + timeElapsedMin);
			}
	}
/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

if (preExecute.length) doStandardChoiceActions(preExecute,true,0); 	// run Pre-execution code

logGlobals(AInfo);

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
//
//  Get the Standard choices entry we'll use for this App type
//  Then, get the action/criteria pairs for this app
//

if (doStdChoices) doStandardChoiceActions(controlString,true,0);


//
//  Next, execute and scripts that are associated to the record type
//

if (doScripts) doScriptActions();

//
// Check for invoicing of fees
//
if (feeSeqList.length)
	{
	invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
	if (invoiceResult.getSuccess())
		logMessage("Invoicing assessed fee items is successful.");
	else
		logMessage("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful.  Reason: " +  invoiceResult.getErrorMessage());
	}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0)
	{
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
	}
else
	{
	if (cancel)
		{
		aa.env.setValue("ScriptReturnCode", "1");
		if (showMessage) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
		if (showDebug) 	aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + debug);
		}
	else
		{
		aa.env.setValue("ScriptReturnCode", "0");
		if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
		if (showDebug) 	aa.env.setValue("ScriptReturnMessage", debug);
		}
	}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/