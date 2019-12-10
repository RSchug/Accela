
function addContactStdCondition(contSeqNum,cType,cDesc)
	{

	var foundCondition = false;
	var javascriptDate = new Date()
	var javautilDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());

	
	cStatus = "Applied";
	if (arguments.length > 3)
		cStatus = arguments[3]; // use condition status in args
		
	if (!aa.capCondition.getStandardConditions)
		{
		logDebug("addAddressStdCondition function is not available in this version of Accela Automation.");
		}
        else
		{
		standardConditions = aa.capCondition.getStandardConditions(cType,cDesc).getOutput();
		for(i = 0; i<standardConditions.length;i++)
			if(standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
			{
			standardCondition = standardConditions[i]; // add the last one found
			
			foundCondition = true;
		
			if (!contSeqNum) // add to all reference address on the current capId
				{
				var capContactResult = aa.people.getCapContactByCapID(capId);
				if (capContactResult.getSuccess())
					{
					var Contacts = capContactResult.getOutput();
					for (var contactIdx in Contacts)
						{
						var contactNbr = Contacts[contactIdx].getCapContactModel().getPeople().getRefContactNumber();
						if (contactNbr)
							{
							var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
							newCondition.setServiceProviderCode(aa.getServiceProviderCode());
							newCondition.setEntityType("CONTACT");
							newCondition.setEntityID(contactNbr);
							newCondition.setConditionDescription(standardCondition.getConditionDesc());
							newCondition.setConditionGroup(standardCondition.getConditionGroup());
							newCondition.setConditionType(standardCondition.getConditionType());
							newCondition.setConditionComment(standardCondition.getConditionComment());
							newCondition.setImpactCode(standardCondition.getImpactCode());
							newCondition.setConditionStatus(cStatus)
							newCondition.setAuditStatus("A");
							newCondition.setIssuedByUser(systemUserObj);
							newCondition.setIssuedDate(javautilDate);
							newCondition.setEffectDate(javautilDate);
							newCondition.setAuditID(currentUserID);
							var addContactConditionResult = aa.commonCondition.addCommonCondition(newCondition);
							
							if (addContactConditionResult.getSuccess())
								{
								logDebug("Successfully added reference contact (" + contactNbr + ") condition: " + cDesc);
								}
							else
								{
								logDebug( "**ERROR: adding reference contact (" + contactNbr + ") condition: " + addContactConditionResult.getErrorMessage());
								}
							}
						}
					}
				}
			else
				{
				var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
				newCondition.setServiceProviderCode(aa.getServiceProviderCode());
				newCondition.setEntityType("CONTACT");
				newCondition.setEntityID(contSeqNum);
				newCondition.setConditionDescription(standardCondition.getConditionDesc());
				newCondition.setConditionGroup(standardCondition.getConditionGroup());
				newCondition.setConditionType(standardCondition.getConditionType());
				newCondition.setConditionComment(standardCondition.getConditionComment());
				newCondition.setImpactCode(standardCondition.getImpactCode());
				newCondition.setConditionStatus(cStatus)
				newCondition.setAuditStatus("A");
				
				newCondition.setIssuedByUser(systemUserObj);
				newCondition.setIssuedDate(javautilDate);
				newCondition.setEffectDate(javautilDate);
				
				newCondition.setAuditID(currentUserID);
				var addContactConditionResult = aa.commonCondition.addCommonCondition(newCondition);

				if (addContactConditionResult.getSuccess())
					{
					logDebug("Successfully added reference contact (" + contSeqNum + ") condition: " + cDesc);
					}
				else
					{
					logDebug( "**ERROR: adding reference contact (" + contSeqNum + ") condition: " + addContactConditionResult.getErrorMessage());
					}
				}
			}
		}
	if (!foundCondition) logDebug( "**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
	}
