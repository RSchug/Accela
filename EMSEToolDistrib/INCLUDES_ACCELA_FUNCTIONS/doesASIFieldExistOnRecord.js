
function doesASIFieldExistOnRecord(asiFieldName) {
	var itemCap = capId;
	if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args

	return (aa.appSpecificInfo.getAppSpecificInfos(itemCap, asiFieldName).getOutput()[0] != 'undefined');

}
