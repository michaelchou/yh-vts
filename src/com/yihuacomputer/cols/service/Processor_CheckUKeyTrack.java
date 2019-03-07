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
		return "�Ŷ�У�飨��UKey��";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 */
	public void process() throws ProcessorException {

		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strUKeyNum = MsgXmlDom.getElementValue(domReq,"strUKeyNum");
        if(strUKeyNum !=null && !strUKeyNum.equals("") && strUKeyNum.length()> 8){
        	strUKeyNum = strUKeyNum.substring(strUKeyNum.length()-8, strUKeyNum.length()-1);//�ӵ����ڶ�λ��ʼ��ǰ��ȡ7λ
        }else{
        	throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
        }
        UKeyUnitStatusDB service = new UKeyUnitStatusDB();
        UKeyUnitStatus entity = service.getUKeyTrackEntity(strTerminalNum, strUKeyNum);
		if(entity == null){
			throw new ProcessorException(TERMRETCODE_INNERR,"��ЧUKey������ϵ���й�����Ա", TERMRETDESCEN_INVALIDCARD);
		}
		// ���óɹ���Ϣ
		setSucceedRespDom();
	}
}
