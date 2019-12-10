/**
 * Runs a report with any specified parameters and attaches it to the record
 *
 * @example
 *		runReportAttach(capId,"ReportName","altid",capId.getCustomID(),"months","12");
 *		runReportAttach(capId,"ReportName",paramHashtable);
 * @param capId
 *			itemCapId - capId object 
 * @param {report parameter pairs} or {hashtable}
 *			optional parameters are report parameter pairs or a parameters hashtable
 * @returns {boolean}
 *			if the report was generated and attached return true
 *
 */
function runReportAttach(itemCapId,aaReportName)
	{

	var reportName = aaReportName;

	reportResult = aa.reportManager.getReportInfoModelByName(reportName);

	if (!reportResult.getSuccess())
		{ logDebug("**WARNING** couldn't load report " + reportName + " " + reportResult.getErrorMessage()); return false; }

	var report = reportResult.getOutput(); 

	var itemCap = aa.cap.getCap(itemCapId).getOutput();
	itemAppTypeResult = itemCap.getCapType();
	itemAppTypeString = itemAppTypeResult.toString(); 
	itemAppTypeArray = itemAppTypeString.split("/");

	report.setModule(itemAppTypeArray[0]); 
	report.setCapId(itemCapId.getID1() + "-" + itemCapId.getID2() + "-" + itemCapId.getID3()); 
	report.getEDMSEntityIdModel().setAltId(itemCapId.getCustomID());

	var parameters = aa.util.newHashMap(); 

	if(arguments.length > 2 && arguments[2].getClass().toString().equals("class java.lang.String")){
		// optional parameters are report parameter pairs
		// for example: runReportAttach(capId,"ReportName","altid",capId.getCustomID(),"months","12");
		for (var i = 2; i < arguments.length ; i = i+2)
		{
			parameters.put(arguments[i],arguments[i+1]);
			logDebug("Report parameter: " + arguments[i] + " = " + arguments[i+1]);
		}
	}
	else if(arguments.length > 2 && arguments[2].getClass().toString().equals("class java.util.HashMap")){
		// optional argument is a hashmap so assign it to parameters
		parameters = arguments[2]
	}

	report.setReportParameters(parameters);

	var permit = aa.reportManager.hasPermission(reportName,currentUserID); 
	if(permit.getOutput().booleanValue()) 
		{ 
			var reportResult = aa.reportManager.getReportResult(report); 
			if(reportResult){
				logDebug("Report " + aaReportName + " has been run for " + itemCapId.getCustomID());
				return true;
			}
		}
	else{
		logDebug("No permission to report: "+ reportName + " for user: " + currentUserID);
		return false;
	}
}