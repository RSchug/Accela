function updatePlanReviewWorkflow(wfTask,status,wfComments,updateIndicator) {
	// updateIndicator determines if to update workflow or inspection
	// if a value of "W" workflow will be updated
	// if a value of "I" inspection will be updated
	// otherwise will return a false

	if (updateIndicator == "I") {
		var sysDateYYYYMMDD = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"YYYY-MM-DD");
		resultInspection(wfTask,status,sysDateYYYYMMDD,wfComments);
	} else if (updateIndicator == "W") {
		var action = "";

		action = lookup(docReviewStatusStdChoice,status);

		if (!matches(action,"",undefined)) {
			if (action == "Next") {
				closeTask(wfTask,status,wfComments,"");
				return true;
			} else if (action == "No Change") {
				updateTask(wfTask,status,wfComments,"");
				return true;
			} else if (action == "Loop") {
				loopTask(wfTask,status,wfComments,"");
				return true;
			} else if (action == "Branch") {
				branchTask(wfTask,status,wfComments,"");
				return true;
			} else {
				logDebug("Workflow not updated, action not defined");
				return false;
			}
		} else {
			logDebug("Workflow not updated, workflow task name not found");
			return false;
			
		}
	} else {

		logDebug("updateIndicator of " + updateIndicator + "is not a valid value only W or I are expected");
		return false;
	}
}
