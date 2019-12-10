// testing parameters, uncomment to use in script test

aa.env.setValue("paramStdChoice","EXPIRY TEST 1");

/*------------------------------------------------------------------------------------------------------/
| Program: License Expirations.js  Trigger: Batch
| Client:
|
| Version 1.0 - Base Version. 11/01/08 JHS
| Version 2.0 - Updated for Masters Scripts 2.0  02/13/14 JHS
| Version 3.0 - Updated for 3.0, new features 9/30/15 JHS
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
message = "";
br = "<br>";
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName) {
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	return emseScript.getScriptText() + "";
}

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

try {

showDebug = true;
if (String(aa.env.getValue("showDebug")).length > 0) {
	showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
}

sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
batchJobID = 0;
if (batchJobResult.getSuccess()) {
	batchJobID = batchJobResult.getOutput();
	logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
} else {
	logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
}

/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var paramStdChoice = getJobParam("paramStdChoice")  // use this standard choice for parameters instead of batch jobs
var fromDate = getJobParam("fromDate"); // Hardcoded dates.   Use for testing only
var toDate = getJobParam("toDate"); // ""
var dFromDate = aa.date.parseDate(fromDate); //
var dToDate = aa.date.parseDate(toDate); //
var lookAheadDays = aa.env.getValue("lookAheadDays"); // Number of days from today
var daySpan = aa.env.getValue("daySpan"); // Days to search (6 if run weekly, 0 if daily, etc.)
var appGroup = getJobParam("appGroup"); //   app Group to process {Licenses}
var appTypeType = getJobParam("appTypeType"); //   app type to process {Rental License}
var appSubtype = getJobParam("appSubtype"); //   app subtype to process {NA}
var appCategory = getJobParam("appCategory"); //   app category to process {NA}
var expStatus = getJobParam("expirationStatus"); //   test for this expiration status
var newExpStatus = getJobParam("newExpirationStatus"); //   update to this expiration status
var newAppStatus = getJobParam("newApplicationStatus"); //   update the CAP to this status
var gracePeriodDays = getJobParam("gracePeriodDays"); //	bump up expiration date by this many days
var setPrefix = getJobParam("setPrefix"); //   Prefix for set ID
var inspSched = getJobParam("inspSched"); //   Schedule Inspection
var skipAppStatusArray = getJobParam("skipAppStatus").split(","); //   Skip records with one of these application statuses
var emailAddress = getJobParam("emailAddress"); // email to send report
var sendEmailToContactTypes = getJobParam("sendEmailToContactTypes"); // ALL,PRIMARY, or comma separated values
var emailTemplate = getJobParam("emailTemplate"); // email Template
var deactivateLicense = getJobParam("deactivateLicense").substring(0, 1).toUpperCase().equals("Y"); // deactivate the LP
var lockParentLicense = getJobParam("lockParentLicense").substring(0, 1).toUpperCase().equals("Y"); // add this lock on the parent license
var createRenewalRecord = getJobParam("createTempRenewalRecord").substring(0, 1).toUpperCase().equals("Y"); // create a temporary record
var feeSched = getJobParam("feeSched"); //
var feeList = getJobParam("feeList"); // comma delimted list of fees to add to renewal record
var feePeriod = getJobParam("feePeriod"); // fee period to use {LICENSE}
var parentFeeSched = getJobParam("parentFeeSched"); //
var parentFeeList = getJobParam("parentFeeList"); // comma delimted list of fees to add to renewal record
var parentFeePeriod = getJobParam("parentFeePeriod"); // fee period to use {LICENSE}
var respectNotifyPrefs = getJobParam("respectNotifyPrefs").substring(0, 1).toUpperCase().equals("Y"); // respect contact notification preferences
var createNotifySets = getJobParam("createNotifySets").substring(0, 1).toUpperCase().equals("Y") ; // different sets based on notification preferences
var setType = getJobParam("setType"); // Sets will be created with this type
var setStatus = getJobParam("setStatus"); // Sets will be created with this initial status
var setParentWorkflowTaskAndStatus = getJobParam("setParentWorkflowTaskAndStatus").split(","); // update workflow task/status, comma separated.
var filterExpression = getJobParam("filterExpression"); // JavaScript used to filter records.   Evaluating to false will skip the record, for example:   getAppSpecific("FieldName").toUpperCase() == "TEST"
var actionExpression = getJobParam("actionExpression"); // JavaScript used to perform custom action, for example:   addStdCondition(...)
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();

if (!fromDate.length) { // no "from" date, assume today + number of days to look ahead
	fromDate = dateAdd(null, parseInt(lookAheadDays))
}
if (!toDate.length) { // no "to" date, assume today + number of look ahead days + span
	toDate = dateAdd(null, parseInt(lookAheadDays) + parseInt(daySpan))
}
var mailFrom = lookup("ACA_EMAIL_TO_AND_FROM_SETTING", "RENEW_LICENSE_AUTO_ISSUANCE_MAILFROM");
var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));

logDebug("Date Range -- fromDate: " + fromDate + ", toDate: " + toDate)

var startTime = startDate.getTime(); // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();

appGroup = appGroup == "" ? "*" : appGroup;
appTypeType = appTypeType == "" ? "*" : appTypeType;
appSubtype = appSubtype == "" ? "*" : appSubtype;
appCategory = appCategory == "" ? "*" : appCategory;
var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;



/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");

} catch (err) {
	logDebug("ERROR: " + err.message + " In " + batchJobName + " Line " + err.lineNumber);
	logDebug("Stack: " + err.stack);
}

try {
	mainProcess();

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

if (emailAddress.length)
	aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);

} catch (err) {
	logDebug("ERROR: " + err.message + " In " + batchJobName + " Line " + err.lineNumber);
	logDebug("Stack: " + err.stack);
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
	var capFilterType = 0;
	var capFilterInactive = 0;
	var capFilterError = 0;
	var capFilterStatus = 0;
	var capFilterExpression = 0;
	var capDeactivated = 0;
	var capCount = 0;
	var inspDate;
	var setName;
	var setDescription;

	// prep the set prefix for all sets
	
	if (setPrefix != "") {
		var yy = startDate.getFullYear().toString().substr(2, 2);
		var mm = (startDate.getMonth() + 1).toString();
		if (mm.length < 2)
			mm = "0" + mm;
		var dd = startDate.getDate().toString();
		if (dd.length < 2)
			dd = "0" + dd;
		var hh = startDate.getHours().toString();
		if (hh.length < 2)
			hh = "0" + hh;
		var mi = startDate.getMinutes().toString();
		if (mi.length < 2)
			mi = "0" + mi;

		setPrefix+= ":" + yy + mm + dd + hh + mi;
	}
	
	//  create Set of Sets if we are using notify sets

	var masterSet;
	if (setPrefix != "" && createNotifySets) {
		var masterSet = setPrefix + ":MASTER";
		aa.set.createSet(masterSet,masterSet,"SETS","Contains all sets created by Batch Job " + batchJobName + " Job ID " + batchJobID);
	}

	
	// Obtain the array of records to loop through.   This can be changed as needed based on the business rules
	//
	var expResult = aa.expiration.getLicensesByDate(expStatus, fromDate, toDate);

	if (expResult.getSuccess()) {
		myExp = expResult.getOutput();
		logDebug("Processing " + myExp.length + " expiration records");
	} else {
		logDebug("ERROR: Getting Expirations, reason is: " + expResult.getErrorType() + ":" + expResult.getErrorMessage());
		return false
	}

	for (thisExp in myExp) // for each b1expiration (effectively, each license app)
	{
		b1Exp = myExp[thisExp];
		var expDate = b1Exp.getExpDate();
		if (expDate) {
			var b1ExpDate = expDate.getMonth() + "/" + expDate.getDayOfMonth() + "/" + expDate.getYear();
		}
		var b1Status = b1Exp.getExpStatus();
		var renewalCapId = null;

		capId = aa.cap.getCapID(b1Exp.getCapID().getID1(), b1Exp.getCapID().getID2(), b1Exp.getCapID().getID3()).getOutput();

		if (!capId) {
			logDebug("Could not get a Cap ID for " + b1Exp.getCapID().getID1() + "-" + b1Exp.getCapID().getID2() + "-" + b1Exp.getCapID().getID3());
			continue;
		}

		altId = capId.getCustomID();

		logDebug("==========: " + altId + " :==========");
		logDebug("     " +"Renewal Status : " + b1Status + ", Expires on " + b1ExpDate);

		var capResult = aa.cap.getCap(capId);

		if (!capResult.getSuccess()) {
			logDebug("     " +"skipping, Record is deactivated");
			capDeactivated++;
			continue;
		} else {
			var cap = capResult.getOutput();
		}

		var capStatus = cap.getCapStatus();

		appTypeResult = cap.getCapType(); //create CapTypeModel object
		appTypeString = appTypeResult.toString();
		appTypeArray = appTypeString.split("/");

		// Filter by CAP Type
		if (appType.length && !appMatch(appType)) {
			capFilterType++;
			logDebug("     " +"skipping, Application Type does not match")
			continue;
		}

		// Filter by CAP Status
		if (exists(capStatus, skipAppStatusArray)) {
			capFilterStatus++;
			logDebug("     " +"skipping, due to application status of " + capStatus)
			continue;
		}

		// custom filter  
		
		if (filterExpression.length > 0) {
			var result = eval(filterExpression);
			if (!result) {
				capFilterExpression++;
				logDebug("skipping, due to:  " + filterExpression + " = " + eval(result));
				continue;
			}
		}
		
		// done filtering, so increase the record count to include this record.
		
		capCount++;


		// Actions start here:

		var refLic = getRefLicenseProf(altId); // Load the reference License Professional

		if (refLic && deactivateLicense) {
			refLic.setAuditStatus("I");
			aa.licenseScript.editRefLicenseProf(refLic);
			logDebug( "deactivated linked License");
		}

		// update expiration status


		if (newExpStatus.length > 0) {
			b1Exp.setExpStatus(newExpStatus);
			aa.expiration.editB1Expiration(b1Exp.getB1Expiration());
			logDebug("Update expiration status: " + newExpStatus);
		}

		// update expiration date based on interval

		if (parseInt(gracePeriodDays) != 0) {
			newExpDate = dateAdd(b1ExpDate, parseInt(gracePeriodDays));
			b1Exp.setExpDate(aa.date.parseDate(newExpDate));
			aa.expiration.editB1Expiration(b1Exp.getB1Expiration());

			logDebug("updated CAP expiration to " + newExpDate);
			if (refLic) {
				refLic.setLicenseExpirationDate(aa.date.parseDate(newExpDate));
				aa.licenseScript.editRefLicenseProf(refLic);
				logDebug("updated License expiration to " + newExpDate);
			}
		}

		if (sendEmailToContactTypes.length > 0 && emailTemplate.length > 0) {

			var conTypeArray = sendEmailToContactTypes.split(",");
			var sendAllContacts = conTypeArray.indexOf("ALL") >= 0 || conTypeArray.indexOf("All") >= 0 || conTypeArray.indexOf("all") >= 0;
			var sendPrimaryContact = conTypeArray.indexOf("PRIMARY") >= 0 || conTypeArray.indexOf("Primary") >= 0 || conTypeArray.indexOf("primary") >= 0;
			
			// create an array of contactObjs
			var conArray = [];
			var capContactResult = aa.people.getCapContactByCapID(capId);
				if (capContactResult.getSuccess()) {
					var capContactArray = capContactResult.getOutput();
				}
			if (capContactArray) {
				for (var yy in capContactArray) {
					conArray.push(new contactObj(capContactArray[yy]));
				}
			}
	
			// filter based on business rules in params
			
			var sendArray = [];
			for (thisCon in conArray) {
				var c = conArray[thisCon];
				if ((c.primary && sendPrimaryContact) || sendAllContacts || contTypeArray.indexOf(c.type) >= 0) {
					sendArray.push(c); 
				}
			}
				
			// process each qualified contact
			for (var i in sendArray) {
				//  create set  
				var channel = ("" + lookup("CONTACT_PREFERRED_CHANNEL","" + sendArray[i].capContact.getPreferredChannel())).toUpperCase();
				var email = sendArray[i].capContact.getEmail();
				logDebug("Notification requested for " + sendArray[i] + " preferred channel: " + channel);
				if (createNotifySets && setPrefix != "") {
					var s = new capSet(setPrefix + ":" + channel,setType,channel  + " notification records processed by Batch Job " + batchJobName + " Job ID " + batchJobID);
					s.add(capId);
					if (masterSet) {
						var setResult = aa.set.addSetofSetMember(masterSet, s.id); 
						if (!setResult.getSuccess()) {
							logDebug("Warning: could not add channel set to master set " + setResult.getErrorMessage());
							}
						}
					}

				if (!respectNotifyPrefs || (channel.indexOf("EMAIL") >= 0 || channel.indexOf("E-MAIL") >= 0)) {
					if (!email) {
							logDebug("Email channel detected but contact has no email address");
							continue;
						}
					else {
						emailParameters = aa.util.newHashtable();
						c.getEmailTemplateParams(emailParameters);
						addParameter(emailParameters, "$$altid$$", altId);
						addParameter(emailParameters, "$$acaUrl$$", acaSite + getACAUrl());
						addParameter(emailParameters, "$$businessName$$", cap.getSpecialText());
						addParameter(emailParameters, "$$expirationDate$$", b1ExpDate);
						var capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
						var fileNames = [];
						aa.document.sendEmailAndSaveAsDocument(mailFrom, email, "", emailTemplate, emailParameters, capId4Email, fileNames);
						logDebug("Sent Email template " + emailTemplate + " to " + sendArray[i]+ " : " + email);
					}
				}
			}
		}

		// update CAP status

		if (newAppStatus.length > 0) {
			updateAppStatus(newAppStatus, "");
			logDebug("Updated Application Status to " + newAppStatus);
		}

		// schedule Inspection

		if (inspSched.length > 0) {
			scheduleInspection(inspSched, "1");
			inspId = getScheduledInspId(inspSched);
			if (inspId) {
				autoAssignInspection(inspId);
			}
			logDebug("Scheduled " + inspSched + ", Inspection ID: " + inspId);
		}

		// Add to the overall Set

		if (setPrefix != "") {
			var s = new capSet(setPrefix + ":ALL",setType,"All Records Processed by Batch Job " + batchJobName + " Job ID " + batchJobID);
			s.add(capId);
			if (masterSet) {
				aa.set.addSetofSetMember(masterSet, s.id); 
				}
			}

		// update workflow tasks, statuses.    There can be more than one pair.

		while (setParentWorkflowTaskAndStatus.length > 1) {
			logDebug("Setting workflow task " + setParentWorkflowTaskAndStatus[0] + " to " + setParentWorkflowTaskAndStatus[1] );
			resultWorkflowTask(setParentWorkflowTaskAndStatus[0], setParentWorkflowTaskAndStatus[1], "Updated by batch job "+ batchJobName + " Job ID " + batchJobID, "");
			setParentWorkflowTaskAndStatus.splice(0, 2); // pop these off the queue
		}


			
		// lock Parent License

		if (lockParentLicense) {
			licCap = getLicenseCapId("*/*/*/*");

			if (licCap) {
				logDebug(licCap + ": adding Lock : " + lockParentLicense);
				addStdCondition("Suspension", lockParentLicense, licCap);
			} else
				logDebug("Can't add Lock, no parent license found");
		}

		// add fees to parent
		
		if (parentFeeList.length > 0) {
			for (var fe in parentFeeList.split(",")) {
				logDebug("Adding fee: " + parentFeeList.split(",")[fe] + " to parent record");	
				var feObj = addFee(parentFeeList.split(",")[fe], parentFeeList, parentFeeList, 1, "Y", capId);
			}
		}

		// execute custom expression
		
		if (actionExpression.length > 0) {
			logDebug("Executing action expression : " + actionExpression);
			var result = eval(filterExpression);
		}
			
		// create renewal record and add fees

		if (createRenewalRecord) {
			createResult = aa.cap.createRenewalRecord(capId);

			if (!createResult.getSuccess() || !createResult.getOutput()) {
				logDebug("Could not create renewal record.   This could be due to EMSE errors on record creation : " + createResult.getErrorMessage());
			} else {
				renewalCapId = createResult.getOutput();
				renewalCap = aa.cap.getCap(renewalCapId).getOutput();
				if (renewalCap.isCompleteCap()) {
					logDebug("Renewal Record already exists : " + renewalCapId.getCustomID());
				} else {
					logDebug("created Renewal Record " + renewalCapId.getCustomID());

					// add fees

					if (feeList.length > 0) {
						for (var fe in feeList.split(",")) {
							logDebug("Adding fee: " + feeList.split(",")[fe] + " to renewal record");
							var feObj = addFee(feeList.split(",")[fe], feeSched, feePeriod, 1, "Y", renewalCapId);
						}
					}
				}
			}
		}
	}

	logDebug("========================================");
	logDebug("Total CAPS qualified date range: " + myExp.length);
	logDebug("Ignored due to application type: " + capFilterType);
	logDebug("Ignored due to CAP Status: " + capFilterStatus);
	logDebug("Ignored due to Deactivated CAP: " + capDeactivated);
	logDebug("Ignored due to Custom Filter Expression: " + capFilterExpression);
	
	logDebug("Total CAPS processed: " + capCount);
}

function getJobParam(pParamName) //gets parameter value and logs message showing param value
{
	var ret;
	if (aa.env.getValue("paramStdChoice") != "") {
		var b = aa.bizDomain.getBizDomainByValue(aa.env.getValue("paramStdChoice"),pParamName);
		if (b.getSuccess()) {
			ret = b.getOutput().getDescription();
			}	

		ret = ret ? "" + ret : "";   // convert to String
		
		logDebug("Parameter (from std choice " + aa.env.getValue("paramStdChoice") + ") : " + pParamName + " = " + ret);
		}
	else {
			ret = "" + aa.env.getValue(pParamName);
			logDebug("Parameter (from batch job) : " + pParamName + " = " + ret);
		}
	return ret;
}
