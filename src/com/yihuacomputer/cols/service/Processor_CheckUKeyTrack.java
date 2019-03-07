package com.yihuacomputer.cols.service;


import com.yihuacomputer.cols.database.UKeyUnitStatusDB;
import com.yihuacomputer.cols.entity.UKeyUnitStatus;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CheckUKeyTrack extends Processor {

	public Processor_CheckUKeyTrack() {
		super();
	}

    protected String getTransName()
	{
		return "号段校验（发UKey）";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	public void process() throws ProcessorException {

		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strUKeyNum = MsgXmlDom.getElementValue(domReq,"strUKeyNum");
        if(strUKeyNum !=null && !strUKeyNum.equals("") && strUKeyNum.length()> 8){
        	strUKeyNum = strUKeyNum.substring(strUKeyNum.length()-8, strUKeyNum.length()-1);//从倒数第二位开始往前截取7位
        }else{
        	throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
        }
        UKeyUnitStatusDB service = new UKeyUnitStatusDB();
        UKeyUnitStatus entity = service.getUKeyTrackEntity(strTerminalNum, strUKeyNum);
		if(entity == null){
			throw new ProcessorException(TERMRETCODE_INNERR,"无效UKey，请联系银行工作人员", TERMRETDESCEN_INVALIDCARD);
		}
		// 设置成功信息
		setSucceedRespDom();
	}
}
