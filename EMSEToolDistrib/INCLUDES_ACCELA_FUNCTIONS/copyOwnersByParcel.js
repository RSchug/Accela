function copyOwnersByParcel()
{
	//get parcel(s) by capid
	var parcels = aa.parcel.getParcelDailyByCapID(capId,null);
	
	if(parcels.getSuccess())
	{
		 parcels = parcels.getOutput();
		 if(parcels == null || parcels.length == 0) 
		 {
		   	logDebug("No parcels available for this record");
		 }
		 else
		 {
		    //get owner(s) by parcel(s)
		    for (var i =0; i< parcels.length; i++)
		    {
				var parcelOwnersResult = aa.owner.getOwnersByParcel(parcels[i]);
				var parcelNbr = parcels[i].getParcelNumber();
				var parcelUID = parcels[i].getParcelModel().getUID();
				if (parcelOwnersResult.getSuccess())
				{
						var actuallyParcelNumber = parcelNbr != null?parcelNbr:parcelUID;
						//aa.print("Successfully get owner(s) by Parcel "+actuallyParcelNumber+". Detail as follow:");
						var ownerArr = parcelOwnersResult.getOutput();
						//aa.print("Size :" + ownerArr.length);
						for (j = 0; j < ownerArr.length; j++)
						{
							ownerArr[j].setCapID(capId);
							aa.owner.createCapOwnerWithAPOAttribute(ownerArr[j]);
						}		
				}
				else
				{
						logDebug("ERROR: Failed to get owner(s) by Parcel(s): " + parcelOwnersResult.getErrorMessage());
				}
		    }
		 }
	} 
}