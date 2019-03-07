package com.yihuacomputer.cols.service;


import com.yihuacomputer.cols.database.CDSUnitStatusDB;
import com.yihuacomputer.cols.entity.CDSUnitStatus;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CheckCDSTrack extends Processor {

	public Processor_CheckCDSTrack() {
		super();
	}

    protected String getTransName()
	{
		return "卡段校验（存单开户）";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	public void process() throws ProcessorException {

		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strOCRNum = MsgXmlDom.getElementValue(domReq,"strOCRNum");
		
		 if(strOCRNum !=null && !strOCRNum.equals("")){
			 if(strOCRNum.length()> 8){
				 strOCRNum = strOCRNum.substring(strOCRNum.length()-8, strOCRNum.length()-1);//从倒数第二位开始往前截取7位
			 }else if(strOCRNum.length() < 8){				 
				 throw new ProcessorException(TERMRETCODE_INNERR,"无效存单，请联系银行工作人员", TERMRETDESCEN_INNERR);
			 }			 
		 }else{	        	
			 throw new ProcessorException(TERMRETCODE_INNERR,"无效存单，请联系银行工作人员", TERMRETDESCEN_INNERR);
		 }	

        CDSUnitStatusDB service = new CDSUnitStatusDB();
        CDSUnitStatus entity = service.getCDSTrackEntity(strTerminalNum, strOCRNum);
		if(entity == null){
			throw new ProcessorException(TERMRETCODE_INNERR,"无效存单，请联系银行工作人员", TERMRETDESCEN_INVALIDCARD);
		}
		// 设置成功信息
		setSucceedRespDom();
	}
}
