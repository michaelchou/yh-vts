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
		return "����У�飨�浥������";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 */
	public void process() throws ProcessorException {

		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strOCRNum = MsgXmlDom.getElementValue(domReq,"strOCRNum");
		
		 if(strOCRNum !=null && !strOCRNum.equals("")){
			 if(strOCRNum.length()> 8){
				 strOCRNum = strOCRNum.substring(strOCRNum.length()-8, strOCRNum.length()-1);//�ӵ����ڶ�λ��ʼ��ǰ��ȡ7λ
			 }else if(strOCRNum.length() < 8){				 
				 throw new ProcessorException(TERMRETCODE_INNERR,"��Ч�浥������ϵ���й�����Ա", TERMRETDESCEN_INNERR);
			 }			 
		 }else{	        	
			 throw new ProcessorException(TERMRETCODE_INNERR,"��Ч�浥������ϵ���й�����Ա", TERMRETDESCEN_INNERR);
		 }	

        CDSUnitStatusDB service = new CDSUnitStatusDB();
        CDSUnitStatus entity = service.getCDSTrackEntity(strTerminalNum, strOCRNum);
		if(entity == null){
			throw new ProcessorException(TERMRETCODE_INNERR,"��Ч�浥������ϵ���й�����Ա", TERMRETDESCEN_INVALIDCARD);
		}
		// ���óɹ���Ϣ
		setSucceedRespDom();
	}
}
