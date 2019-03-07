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
		return "����У�飨������";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 */
	public void process() throws ProcessorException {

		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strPan = MsgXmlDom.getElementValue(domReq,"strPan");
        if(strPan !=null && !strPan.equals("") && strPan.length()> 10){
        	strPan = strPan.substring(strPan.length()-11, strPan.length()-1);//�ӵ����ڶ�λ��ʼ��ǰ��ȡ7λ
        }else{
        	throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
        }
        CardUnitStatusDB service = new CardUnitStatusDB();
        CardUnitStatus entity = service.getCardTrackEntity(strTerminalNum, strPan);
		if(entity == null){
			throw new ProcessorException(TERMRETCODE_INNERR,"��Ч��������ϵ���й�����Ա", TERMRETDESCEN_INVALIDCARD);
		}
		// ���óɹ���Ϣ
		setSucceedRespDom();
	}
}
