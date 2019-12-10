/**
* Add Inspection Result Sumbit After Parameters for use in Notification Templates. 
* This should be called from InspectionResultSubmitAfter Event
*
* @param params {HashMap}
* @return {HashMap}
*/

function getInspectionResultParams4Notification(params) {

	if (inspId) addParameter(params, "$$inspId$$", inspId);

	if (inspResult) addParameter(params, "$$inspResult$$", inspResult);

	if (inspComment) addParameter(params, "$$inspComment$$", inspComment);

	if (inspResultDate) addParameter(params, "$$inspResultDate$$", inspResultDate);

	if (inspGroup) addParameter(params, "$$inspGroup$$", inspGroup);
	
	if (inspType) addParameter(params, "$$inspType$$", inspType);
	
	if (inspSchedDate) addParameter(params, "$$inspSchedDate$$", inspSchedDate);

	return params;

}