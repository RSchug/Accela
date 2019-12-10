function getDocOperation(docModelList)
{


	var docModel = docModelList.get(0);
	if(docModel == null)
	{


		return false;
	}

	
	if(docModel.getCategoryByAction() == null || "".equals(docModel.getCategoryByAction()))
	{


		return "UPLOAD";
	}
	//Judging it's check in
	else if("CHECK-IN".equals(docModel.getCategoryByAction()))
	{
		return "CHECK_IN";
	}
	//Judging it's resubmit or normal upload.
	else if("RESUBMIT".equals(docModel.getCategoryByAction()))
	{
		return "RESUBMIT";
	}
}
