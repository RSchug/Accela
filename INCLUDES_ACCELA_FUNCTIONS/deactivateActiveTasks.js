 function deactivateActiveTasks(processName) {

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else

  	  	{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }

	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
		if (fTask.getProcessCode().equals(processName))
			if (fTask.getActiveFlag().equals("Y"))
				deactivateTask(fTask.getTaskDescription());
		}

}

