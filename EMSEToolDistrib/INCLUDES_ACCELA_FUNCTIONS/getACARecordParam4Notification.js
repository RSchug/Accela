/** * Adds a parameter $$acaRecordUrl$$ to a hashtable by buiding a URL path  * for the record in ACA *  * @requires * 		addParameter() * 		getACARecordURL() * * @param hashtable *			parameters hashtable * @param acaUrl *			ACA URL Path to append * @param {capId} *			capId - optional capId object * @returns {string} *			acaUrl - URL path for the record in ACA * */function getACARecordParam4Notification(params,acaUrl) {	itemCap = (arguments.length == 3) ? itemCap = arguments[2] : itemCap = capId;

	addParameter(params, "$$acaRecordUrl$$", getACARecordURL(acaUrl,itemCap));
	return params;	
}

