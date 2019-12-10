function getNextSequence(maskName) {
	var agencySeqBiz = aa.proxyInvoker.newInstance("com.accela.sg.AgencySeqNextBusiness").getOutput();
	var params = aa.proxyInvoker.newInstance("com.accela.domain.AgencyMaskDefCriteria").getOutput();
	params.setAgencyID(aa.getServiceProviderCode());
	params.setMaskName(maskName);
	params.setRecStatus("A");
	params.setSeqType("Agency");

	var seq = agencySeqBiz.getNextMaskedSeq("ADMIN", params, null, null);

	return seq;
}
