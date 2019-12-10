/**
 * Requires parity between CONTACT TYPE and CONTACT RELATIONSHIP standard choices
 */
function setContactRelToContactType() {
	try {

		iCont = null;
		contactArray = new Array();
		contactArray = getContactArray();
		if (contactArray.length > 0) {
			for (iCont in contactArray) {
				tContact = contactArray[iCont];
				aa.print("ContactName: " + tContact["firstName"] + " " + tContact["lastName"] + " " + tContact["contactType"]);
				contactSetRelation(tContact["contactSeqNumber"], tContact["contactType"]);
			}
		}
	} catch (err) {
		logDebug("A JavaScript Error occured in setContactRelToContactType function: " + err.message + " In Line " + err.lineNumber);
	}
}
