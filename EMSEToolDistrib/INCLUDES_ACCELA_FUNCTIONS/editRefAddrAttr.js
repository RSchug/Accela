function editRefAddrAttr(refAddressPK, label, newValue) {

	try {
		var rb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.RefAddressBusiness").getOutput();
		var addrResult = aa.address.getRefAddressByPK("" + refAddressPK)
			if (!addrResult.getSuccess()) {
				logDebug("Error getting reference address:  " + addrResult.getErrorMessage());
				return false;
			}

		var addrObj = addrResult.getOutput().getRefAddressModel();
		addressAttrObj = addrObj.getAttributes();
		var itr = addressAttrObj.iterator();
		while (itr.hasNext()) {
			y = itr.next();
			if (label.toUpperCase().equals(y.getAttributeName())) {
				y.setAttributeValue(newValue);
				logDebug("editRefAddrAttr: Setting address attribute " + label + " to " + newValue);
				rb.editRefAddressWithAPOAttribute(aa.getServiceProviderCode(), addrObj, addressAttrObj);
				break;
			}
		}
	} catch (err) {
		logDebug("A Error occured in editRefAddrAttr: " + err.message);
	}

}
