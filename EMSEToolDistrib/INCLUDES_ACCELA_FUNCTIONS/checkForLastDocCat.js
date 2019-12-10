function checkForLastDocCat(vDocCat,capId)
{
//function looks at the last date any document(s) was uploaded and evaluates if matches the specified doc type
docListResult = aa.document.getCapDocumentList(capId ,currentUserID);
varWasUploaded = false;
if (docListResult.getSuccess()) 
	{ 
	docListArray = docListResult.getOutput()
	varDocLast = docListArray.length;
	varLastPos = varDocLast -1
	docLastCat = docListArray[varLastPos].getDocCategory();
	docLastDate = docListArray[varLastPos].getFileUpLoadDate() + " " ;
	dIndex = docLastDate.indexOf(" ")
	dDateCompare = docLastDate.substring(0,dIndex );
	for(x in docListArray)
		{
		inputDate = docListArray[x].getFileUpLoadDate() + " " ;
		inputIndex = inputDate.indexOf(" ")
	    inputCompare = inputDate.substring(0,inputIndex );
		if(inputCompare == dDateCompare)
			{
			if(docListArray[x].getDocCategory() == vDocCat)
				{
				varWasUploaded = true;
				}
			}
		}

	}
	return varWasUploaded;
}
