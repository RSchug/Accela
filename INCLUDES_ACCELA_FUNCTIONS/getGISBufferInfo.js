function getGISBufferInfo(svc,layer,numDistance)
	{
	// returns an array of associative arrays
	// each additional parameter will return another value in the array
	//x = getGISBufferInfo("flagstaff","Parcels","50","PARCEL_ID1","MAP","BOOK","PARCEL","LOT_AREA");
	//
	//for (x1 in x)
	//   {
	//   aa.print("Object " + x1)
	//   for (x2 in x[x1])
	//      aa.print("  " + x2 + " = " + x[x1][x2])
	//   }

	var distanceType = "feet";
	var retArray = new Array();
   	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		for (argnum = 3; argnum < arguments.length ; argnum++)
			buf.addAttributeName(arguments[argnum]);
		}
	else
		{ aa.print("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ aa.print("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ aa.print("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
			{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
				{
				var n = proxObj[z1].getAttributeNames();
				var v = proxObj[z1].getAttributeValues();
				
				var valArray = new Array();
				
				//
				// 09/18/08 JHS Explicitly adding the key field of the object, since getBufferByRadius will not pull down the key field
				// hardcoded this to GIS_ID
				//
				
				valArray["GIS_ID"] = proxObj[z1].getGisId()
				for (n1 in n)
					{
					valArray[n[n1]] = v[n1];
					}
				retArray.push(valArray);
				}
			
			}
		}
	return retArray
	}

