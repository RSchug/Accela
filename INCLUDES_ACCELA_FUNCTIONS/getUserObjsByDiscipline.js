/**
 * getUserObjsByDiscipline
 * Description: Returns an array of userObj objects for all users in the system that match userDiscipline
 * 
 * @param userDiscipline {string}
 * @return array {userObj}
 */
function getUserObjsByDiscipline(userDiscipline){
	var userObjArray = new Array();
	var sysUserList
	var sysUserResult = aa.people.getSysUserListByDiscipline(userDiscipline);
	
	if (sysUserResult.getSuccess()) {
			sysUserList = sysUserResult.getOutput().toArray();
		} else {
			logDebug("**ERROR: getUserObjsByDiscipline: " + sysUserResult.getErrorMessage());
			return userObjArray;
		}
	
	for(var iUser in sysUserList){
		var userId = sysUserList[iUser].getUserID();
		if (userId) {
			var vUserObj = new userObj(userId);
			userObjArray.push(vUserObj);
        }
	}
	
	return userObjArray;
}