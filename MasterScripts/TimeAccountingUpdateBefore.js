/*------------------------------------------------------------------------------------------------------/
| Program : TimeAccountingUpdateBefore.js
| Event   : TimeAccountingUpdateBefore
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
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
var controlString = "TimeAccountingUpdateBefore"; // Standard choice for control
var preExecute = "PreExecuteForBeforeEvents"; // Standard choice to execute first (for globals, etc)
var documentOnly = false; // Document Only -- displays hierarchy of std choice steps

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 9.0;
var useCustomScriptFile = true; // if true, use Events->Custom Script and Master Scripts, else use Events->Scripts->INCLUDES_*
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

var timeLog = aa.env.getValue("TimeLogModel");

if (timeLog != "" && timeLog != null && timeLog.getReference().substr("-")) {
	aa.env.setValue("CapId", String(timeLog.getReference())); // populate capID for INCLUDES_ACCELA_GLOBALS
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

if (timeLog != "" && timeLog != null) {
	logDebug("<B>EMSE Script Results for Time Log</B>");
	logDebug("getReference=" + timeLog.getReference());
	logDebug("timeLog= " + timeLog.getClass());
	logDebug("getServProvCode=" + timeLog.getServProvCode());
	logDebug("getTimeLogSeq=" + timeLog.getTimeLogSeq());
	logDebug("getTimeGroupSeq=" + timeLog.getTimeGroupSeq());
	logDebug("getTimeTypeSeq=" + timeLog.getTimeTypeSeq());
	logDebug("getDateLogged=" + timeLog.getDateLogged());
	logDebug("getStartTime=" + timeLog.getStartTime());
	logDebug("getEndTime=" + timeLog.getEndTime());
	logDebug("TimeElapsed=" + timeLog.getTimeElapsed().getHours() + ":" + timeLog.getTimeElapsed().getMinutes());
	logDebug("getTotalMinutes=" + timeLog.getTotalMinutes());
	logDebug("getBillable=" + timeLog.getBillable());
	logDebug("getMaterials=" + timeLog.getMaterials());
	logDebug("getMaterialsCost=" + timeLog.getMaterialsCost());
	logDebug("getMileageStart=" + timeLog.getMileageStart());
	logDebug("getMileageEnd=" + timeLog.getMileageEnd());
	logDebug("getMilageTotal=" + timeLog.getMilageTotal());
	logDebug("getVehicleId=" + timeLog.getVehicleId());
	logDebug("getEntryRate=" + timeLog.getEntryRate());
	logDebug("getEntryPct=" + timeLog.getEntryPct());
	logDebug("getEntryCost=" + timeLog.getEntryCost());
	logDebug("getCreatedDate=" + timeLog.getCreatedDate());
	logDebug("getCreatedBy=" + timeLog.getCreatedBy());
	logDebug("getNotation=" + timeLog.getNotation());
	logDebug("getLastChangeDate()=" + timeLog.getLastChangeDate());
	logDebug("getLastChangeUser()=" + timeLog.getLastChangeUser());
	logDebug("getTimeTypeModel()=" + timeLog.getTimeTypeModel());
	if (timeLog.getTimeTypeModel()) {
		logDebug("getTimeTypeModel().getTimeTypeName()=" + timeLog.getTimeTypeModel().getTimeTypeName());
		logDebug("getTimeTypeModel().getTimeTypeDesc()=" + timeLog.getTimeTypeModel().getTimeTypeDesc());
		logDebug("getTimeTypeModel().getDefaultPctAdj()=" + timeLog.getTimeTypeModel().getDefaultPctAdj());
		logDebug("getTimeTypeModel().getDefaultRate()=" + timeLog.getTimeTypeModel().getDefaultRate());
	}
}
/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

if (preExecute.length)
	doStandardChoiceActions(preExecute, true, 0); // run Pre-execution code

logGlobals(AInfo);

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

if (doStdChoices)
	doStandardChoiceActions(controlString, true, 0);

if (doScripts)
	doScriptActions();

//
// Check for invoicing of fees
//
if (feeSeqList.length) {
	invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
	if (invoiceResult.getSuccess())
		logDebug("Invoicing assessed fee items is successful.");
	else
		logDebug("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
}
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ScriptReturnCode", "1");
		if (showMessage)
			aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
		if (showDebug)
			aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + debug);
	} else {
		aa.env.setValue("ScriptReturnCode", "0");
		if (showMessage)
			aa.env.setValue("ScriptReturnMessage", message);
		if (showDebug)
			aa.env.setValue("ScriptReturnMessage", debug);
	}
}
