/**
 * Recalcs fees
 * @param itemCap {capIdModel}
 * @returns {boolean}
 */
function recalcFees(itemCap){
	var valobj = aa.finance.getContractorSuppliedValuation(itemCap,null).getOutput();	
	var estValue = 0;
	var calcValue = 0;
	var feeFactor = "CONT";
	if (valobj.length) {
		estValue = valobj[0].getEstimatedValue();
		calcValue = valobj[0].getCalculatedValue();
		feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
	}
	var feeValue = estValue;
	if(feeFactor != "CONT"){ 
		feeValue = calcValue;
	}
	//perform the recalculation
	var res = aa.finance.reCalculateFees(itemCap, feeFactor, feeValue);
	
	return res.getSuccess();
}

