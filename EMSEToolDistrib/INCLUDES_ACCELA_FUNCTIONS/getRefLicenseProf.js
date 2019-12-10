/**
Title : getRefLicenseProf
Purpose : Look up a Reference License Professional
Functional Area : Licensing
Description : Look up a Reference License Professional by the License Number and Optional License Type
Script Type : EMSE, Pageflow, Batch
Call Example: getRefLicenseProf("RN17-00058","Nurse Practitioner");

@param refstlic {String}
@param [licenseType] {String}
@return {refLicObj}
 */
function getRefLicenseProf(refstlic,licenseType)
	{
	var refLicObj = null;
	var refLicenseResult = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(),refstlic);
	if (!refLicenseResult.getSuccess())
		{ logDebug("**ERROR retrieving Ref Lic Profs : " + refLicenseResult.getErrorMessage()); return false; }
	else
		{
		var newLicArray = refLicenseResult.getOutput();
		if (!newLicArray) return null;
		for (var thisLic in newLicArray)
			if(!matches(licenseType,null,undefined,"")){
				if (refstlic.toUpperCase().equals(newLicArray[thisLic].getStateLicense().toUpperCase()) && 
					licenseType.toUpperCase().equals(newLicArray[thisLic].getLicenseType().toUpperCase()))
					refLicObj = newLicArray[thisLic];
			}
			else if (refstlic && newLicArray[thisLic] && refstlic.toUpperCase().equals(newLicArray[thisLic].getStateLicense().toUpperCase()))
				refLicObj = newLicArray[thisLic];
		}

	return refLicObj;
	}

