/**
 * getUserObjsByDisciplineAndDistrict
 * Description: Returns an array of userObj objects for all users in the system that match userDiscipline and districtName
 * 
 * @param userDiscipline {string}
 * @param districtName {string}
 * @return array {userObj}
 */
function getUserObjsByDisciplineAndDistrict(userDiscipline, districtName){ 
	var userObjArray = new Array();
	var sysUserList
	var sysUserResult = aa.people.getSysUserListByDiscipline(userDiscipline);
	
	if (sysUserResult.getSuccess()) {
			sysUserList = sysUserResult.getOutput().toArray();
		} else {
			logDebug("**ERROR: getUserObjsByDisciplineAndDistrict: " + sysUserResult.getErrorMessage());
			return userObjArray;
		}
	
	for(var iUser in sysUserList){
		var userId = sysUserList[iUser].getUserID();
		if (userId) {
				var vUserObj = new userObj(userId);
				var vUserDistArray = vUserObj.getUserDistricts();
				
				if (!districtName|| exists(districtName, vUserDistArray)) {
					userObjArray.push(vUserObj);
				}
        }
	}
	
	return userObjArray;
	
}