/**
Title : licenseObject
Purpose : Licence Object Class
Functional Area : Licensing
Description : Licence Object Class that links Reference License Professional by the License Number and Optional License Type to allow updates
Script Type : EMSE, Pageflow, Batch
Call Example: var licObj = new licenseObject("RN17-00058", capId,"Nurse Practitioner");

Methods: 
setExpiration(expDate) - Update Expiration date on the Renewal and the linked Reference License
setIssued(issuedDate) - Update Issued date on the linked Reference License
setLastRenewal(lastRenewalAADate) - Update the Last Renewal date on the linked Reference License 
setStatus(licStat) - Update Status on the Renewal
getStatus() - Get the Renewal Expiration Status
getCode() - Get the Renewal Expiration Code

@param licnumber {String}
@param [vCapId] {capId}
@param [licenseType] {String}
@return {refLicObj}
 */

function licenseObject(licnumber,vCapId,vLicType)  // optional renewal Cap ID -- uses the expiration on the renewal CAP.
	{
	itemCap = capId;
	if (!matches(vCapId,undefined,null,"")) itemCap = vCapId; // use cap ID specified in args


	this.refProf = null;		// licenseScriptModel (reference licensed professional)
	this.b1Exp = null;		// b1Expiration record (renewal status on application)
	this.b1ExpDate = null;
	this.b1ExpCode = null;
	this.b1Status = null;
	this.refExpDate = null;
	this.licNum = licnumber;	// License Number
	this.licType = vLicType		// Licence Type (optional)


	// Load the reference License Professional if we're linking the two
	if (licnumber) // we're linking
		{
		var newLic = getRefLicenseProf(licnumber,this.licType)
		if (newLic)
				{
				this.refProf = newLic;
				tmpDate = newLic.getLicenseExpirationDate();
				if (tmpDate)
						this.refExpDate = tmpDate.getMonth() + "/" + tmpDate.getDayOfMonth() + "/" + tmpDate.getYear();
				logDebug("(licenseObject) Loaded reference license professional with Expiration of " + this.refExpDate);
				}
		}

   	// Load the renewal info (B1 Expiration)

   	b1ExpResult = aa.expiration.getLicensesByCapID(itemCap)
   		if (b1ExpResult.getSuccess())
   			{
   			this.b1Exp = b1ExpResult.getOutput();
			tmpDate = this.b1Exp.getExpDate();
			if (tmpDate)
				this.b1ExpDate = tmpDate.getMonth() + "/" + tmpDate.getDayOfMonth() + "/" + tmpDate.getYear();
			this.b1Status = this.b1Exp.getExpStatus();
			logDebug("(licenseObject) Found renewal record of status : " + this.b1Status + ", Expires on " + this.b1ExpDate);
			}
		else
			{ logDebug("(licenseObject) **ERROR: Getting B1Expiration Object for Cap.  Reason is: " + b1ExpResult.getErrorType() + ":" + b1ExpResult.getErrorMessage()) ; return false }


   	this.setExpiration = function(expDate)
   		// Update expiration date
   		{
   		var expAADate = aa.date.parseDate(expDate);

   		if (this.refProf) {
   			this.refProf.setLicenseExpirationDate(expAADate);
   			aa.licenseScript.editRefLicenseProf(this.refProf);
   			logDebug("(licenseObject) Updated Reference License Expiration to " + expDate); }

   		if (this.b1Exp)  {
 				this.b1Exp.setExpDate(expAADate);
				aa.expiration.editB1Expiration(this.b1Exp.getB1Expiration());
				logDebug("(licenseObject) Updated Renewal Expiration Date to " + expDate); }
   		}

	this.setIssued = function(issuedDate)
		// Update Issued date
		{
		var issuedAADate = aa.date.parseDate(issuedDate);

		if (this.refProf) {
			this.refProf.setLicenseIssueDate(issuedAADate);
			aa.licenseScript.editRefLicenseProf(this.refProf);
			logDebug("(licenseObject) Updated Reference License Issued Date to " + issuedDate); }

		}
	this.setLastRenewal = function(lastRenewalDate)
		// Update expiration date
		{
		var lastRenewalAADate = aa.date.parseDate(lastRenewalDate)

		if (this.refProf) {
			this.refProf.setLicenseLastRenewalDate(lastRenewalAADate);
			aa.licenseScript.editRefLicenseProf(this.refProf);
			logDebug("(licenseObject) Updated Reference License Last Renewal Date to " + lastRenewalDate); }
		}

	this.setStatus = function(licStat)
		// Update expiration status
		{
		if (this.b1Exp)  {
			this.b1Exp.setExpStatus(licStat);
			aa.expiration.editB1Expiration(this.b1Exp.getB1Expiration());
			logDebug("(licenseObject) Updated Renewal Expiration Status to " + licStat); }
		}

	this.getStatus = function()
		// Get Expiration Status
		{
		if (this.b1Exp) {
			return this.b1Exp.getExpStatus();
			}
		}

	this.getCode = function()
		// Get Expiration Code
		{
		if (this.b1Exp) {
			return this.b1Exp.getExpCode();
			}
		}
	}