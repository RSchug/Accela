function getParcelConditions(pType,pStatus,pDesc,pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";
	
	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS","I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();
			
	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check Parcel
	////////////////////////////////////////
	
	var parcResult = aa.parcel.getParcelDailyByCapID(itemCap,null);
	if (!parcResult.getSuccess())
		{
		logDebug("**WARNING: getting CAP addresses: "+ parcResult.getErrorMessage());
		var parcArray = new Array();
		}
	else
		{
		var parcArray = parcResult.getOutput();
		if (!parcArray) parcArray = new Array();
		}
		
	for (var thisParc in parcArray)
		if (parcArray[thisParc].getParcelNumber())
			{
			parcCondResult = aa.parcelCondition.getParcelConditions(parcArray[thisParc].getParcelNumber())
			if (!parcCondResult.getSuccess())
				{
				logDebug("**WARNING: getting Parcel Conditions : "+parcCondResult.getErrorMessage());
				var parcCondArray = new Array();
				}
			else
				{
				var parcCondArray = parcCondResult.getOutput();
				}
			
			for (var thisParcCond in parcCondArray)
				{
				var thisCond = parcCondArray[thisParcCond];
				var cType = thisCond.getConditionType();
				var cStatus = thisCond.getConditionStatus();
				var cDesc = thisCond.getConditionDescription();
				var cImpact = thisCond.getImpactCode();
				var cType = thisCond.getConditionType();
				var cComment = thisCond.getConditionComment();
				var cExpireDate = thisCond.getExpireDate();

				if (cType == null)
					cType = " ";
				if (cStatus==null)
					cStatus = " ";
				if (cDesc==null)
					cDesc = " ";
				if (cImpact==null)
					cImpact = " ";

				if ( (pType==null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus==null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc==null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact==null || pImpact.toUpperCase().equals(cImpact.toUpperCase())))
					{
					var r = new condMatchObj;
					r.objType = "Parcel";
					r.parcelObj = parcArray[thisParc];
					r.status = cStatus;
					r.type = cType;
					r.impact = cImpact;
					r.description = cDesc;
					r.comment = cComment;
					r.expireDate = cExpireDate;

					var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

					r.arObject = langCond;
					r.arDescription = langCond.getResConditionDescription();
					r.arComment = langCond.getResConditionComment();
			
					resultArray.push(r);
					}
				}
			}

	return resultArray;
}
