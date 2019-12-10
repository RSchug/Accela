/**
* This function is intended to update reference parcel attributes and refresh the parcel information on the record. 
* If no parcel number is provided, it will update all parcels that contain the attributeName with the supplied attributeValue
*
* Call Example:
* 	editRefParcelAttribute("DELINQUENT TAXES","No","048072002");
*
* @param attributeName {String}
* @param attributeValue {String}
* @param parcelNumber {String}
* @return {Boolean}
*/

function editRefParcelAttribute(attributeName, attributeValue, parcelNumber) //Takes Optional CapId
{
	var matchedParcel = false;
	var updateAllParcels = false;
	var updatedParcel = false;
	var vCapId = null;
	var pb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness").getOutput();

	if (arguments.length > 3)
		vCapId = arguments[3];
	else
		vCapId = capId;

		logDebug("editRefParcelAttribute: Processing Record " + vCapId.getCustomID())
	
	var capPrclArr = aa.parcel.getParcelDailyByCapID(vCapId, null).getOutput();

	if (capPrclArr != null) {
		for (x in capPrclArr) {
			// Check if the parcel number passed in matches and update the one, if no parcel number supplied update all parcels
			if(!matches(parcelNumber,null,undefined,"")){
				if(parcelNumber.equals(capPrclArr[x].getParcelNumber())){
					matchedParcel = true;
				}
				else{
					matchedParcel = false;
				}
			} else {
				updateAllParcels = true;
			}
			
			if(updateAllParcels || matchedParcel) {
			var refPrclObj = aa.parcel.getParceListForAdmin(capPrclArr[x].getParcelNumber(), null, null, null, null, null, null, null, null, null);
			
			if (refPrclObj.getSuccess()) {
				var refPrclArr = refPrclObj.getOutput();
				if (refPrclArr.length) {
					for(iPar in refPrclArr){
					var refParcelModel = refPrclArr[iPar].getParcelModel();
					var refParcelNumber = refParcelModel.getParcelNumber();
					var newParcelAttributeList = aa.util.newArrayList();
					var parcelAttrList = refParcelModel.getParcelAttribute();
					var parcelAttrListIt = parcelAttrList.iterator();
					while(parcelAttrListIt.hasNext())
					{
						var parcelAttrObj = parcelAttrListIt.next();
						
						if(attributeName.equals(parcelAttrObj.getAttributeName())){
							
							parcelAttrObj.setAttributeValue(attributeValue);
							logDebug("Parcel Attribute " + parcelAttrObj.getAttributeName() + " updated value to " + attributeValue);
						}
						newParcelAttributeList.add(parcelAttrObj);
					}
					
					try{
						pb.editParcelWithAttributes(servProvCode, refParcelModel, newParcelAttributeList, "ADMIN");
					} catch (err){
							logDebug("Error Updating Reference Parcel: " + err.message);
						}
					
					var caprefPrclObj = aa.parcel.warpCapIdParcelModel2CapParcelModel(vCapId, refParcelModel);

					if (caprefPrclObj.getSuccess()) {

						var capPrcl = caprefPrclObj.getOutput();
						try{
						capPrcl.setL1ParcelNo(refParcelNumber);
						aa.parcel.updateDailyParcelWithAPOAttribute(capPrcl);
						updatedParcel = true;
						logDebug("Updated Parcel " + capPrclArr[x].getParcelNumber() + " with Reference Data");
						
						} catch (err){
							logDebug("Error Updating Parcel " + capPrclArr[x].getParcelNumber() + ": " +  err.message);
						}
					} else
						logDebug("Failed to Wrap Parcel Model for " + capPrclArr[x].getParcelNumber());
					}
				} else
					logDebug("No matching reference Parcels found for " + capPrclArr[x].getParcelNumber());
			} else
				logDebug("Failed to get reference Parcel for " + capPrclArr[x].getParcelNumber())
			}
		}
	}
	return updatedParcel;
} 