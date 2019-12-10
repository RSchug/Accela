/**
 * Builds a URL path for the record in ACA that is appended to the ACA Site URL.
 * 
 * @param {capId}
 * 		capId - optional capId object
 * @returns {string}
 *		acaUrl - URL path for the record in ACA
 *
 */

function getACAUrl(){

	// returns the path to the record on ACA.  Needs to be appended to the site

	itemCap = (arguments.length == 1) ? arguments[0] : capId;
	var enableCustomWrapper = lookup("ACA_CONFIGS","ENABLE_CUSTOMIZATION_PER_PAGE");
   	var acaUrl = "";
	var id1 = itemCap.getID1();
	var id2 = itemCap.getID2();
	var id3 = itemCap.getID3();
	var itemCapModel = aa.cap.getCap(itemCap).getOutput().getCapModel();

	acaUrl += "/urlrouting.ashx?type=1000";
	acaUrl += "&Module=" + itemCapModel.getModuleName();
	acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
	acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
	if(matches(enableCustomWrapper,"Yes","YES")) acaRecordUrl += "&FromACA=Y";

	return acaUrl;
}