  

var x = [
  {
    "BIZDOMAIN": "JOHNTEST2",
    "STD_CHOICE_TYPE": "SystemSwitch",
    "BIZDOMAIN_VALUE": "Value 1",
    "REC_STATUS": "A",
    "VALUE_DESC": "Value 1 Description!"
  },
  {
    "BIZDOMAIN": "JOHNTEST2",
    "STD_CHOICE_TYPE": "SystemSwitch",
    "BIZDOMAIN_VALUE": "Value 2",
    "REC_STATUS": "A",
    "VALUE_DESC": "Value 2 Description!"
  }
]

var args = new Array();
var bm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.systemConfig.RBizDomainModel", args).getOutput();
var r = aa.proxyInvoker.newInstance("com.accela.aa.aamain.systemConfig.BizDomainBusiness").getOutput();
for (var i in x) {
	row = x[i];
	bm.setServiceProviderCode(aa.getServiceProviderCode());
	bm.setBizDomain(row.BIZDOMAIN);
	bm.setDescription("");
	bm.setType(row.STD_CHOICE_TYPE);
	bm.setAuditDate(new Date());
	bm.setAuditID("ADMIN");
	bm.setAuditStatus(row.REC_STATUS);
	try {
		r.createRBizDomain(bm);
	} catch (err) {
		aa.print("error creating biz: " + row.BIZDOMAIN + ":" + row.BIZDOMAIN_VALUE)
	}
	z = aa.bizDomain.createBizDomain(row.BIZDOMAIN, row.BIZDOMAIN_VALUE, row.REC_STATUS, row.VALUE_DESC);
	aa.print(row.BIZDOMAIN + ":" + row.BIZDOMAIN_VALUE + " = "+ z.getSuccess());
}
