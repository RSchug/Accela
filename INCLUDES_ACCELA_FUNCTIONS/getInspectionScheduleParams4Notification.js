/**
* Add Inspection Schedule After Parameters for use in Notification Templates. 
* This should be called from InspectionScheduleAfter Event
*
* @param params {HashMap}
* @return {HashMap}
*/

function getInspectionScheduleParams4Notification(params) {

	if (inspId) addParameter(params, "$$inspId$$", inspId);

	if (inspInspector) addParameter(params, "$$inspInspector$$", inspInspector);

	if (InspectorFirstName) addParameter(params, "$$InspectorFirstName$$", InspectorFirstName);

	if (InspectorMiddleName) addParameter(params, "$$InspectorMiddleName$$", InspectorMiddleName);

	if (InspectorLastName) addParameter(params, "$$InspectorLastName$$", InspectorLastName);

	if (inspGroup) addParameter(params, "$$inspGroup$$", inspGroup);
	
	if (inspType) addParameter(params, "$$inspType$$", inspType);
	
	if (inspSchedDate) addParameter(params, "$$inspSchedDate$$", inspSchedDate);

	return params;

}

