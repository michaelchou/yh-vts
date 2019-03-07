package com.yihuacomputer.cols.service;


import com.yihuacomputer.cols.database.CardUnitStatusDB;
import com.yihuacomputer.cols.entity.CardUnitStatus;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CheckCardTrack extends Processor {

	public Processor_CheckCardTrack() {
		super();
	}

    protected String getTransName()
	{
		return "卡段校验（发卡）";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	public void process() throws ProcessorException {

		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strPan = MsgXmlDom.getElementValue(domReq,"strPan");
        if(strPan !=null && !strPan.equals("") && strPan.length()> 10){
        	strPan = strPan.substring(strPan.length()-11, strPan.length()-1);//从倒数第二位开始往前截取7位
        }else{
        	throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
        }
        CardUnitStatusDB service = new CardUnitStatusDB();
        CardUnitStatus entity = service.getCardTrackEntity(strTerminalNum, strPan);
		if(entity == null){
			throw new ProcessorException(TERMRETCODE_INNERR,"无效卡，请联系银行工作人员", TERMRETDESCEN_INVALIDCARD);
		}
		// 设置成功信息
		setSucceedRespDom();
	}
}
