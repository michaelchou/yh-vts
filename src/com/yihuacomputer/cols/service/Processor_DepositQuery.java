package com.yihuacomputer.cols.service;


import org.apache.log4j.Logger;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.List;

import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.database.TransLogDepositDB;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.entity.TransLogDeposit;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_DepositQuery extends Processor {

	public Logger error = Logger.getLogger("Error");

	public Processor_DepositQuery() {
		super();
	}

    protected String getTransName()
	{
		return "�浥��Ϣ��ѯ:���������������ᡢ����";
	}

	/**
	 * ������
	 */
	public void process() throws ProcessorException {
		String cdsTranslogInfoStr ="";//�浥��Ϣ
		String cdsTransQueryStr ="";//ת���ڲ�����Ϣ
		String cdsCashTransQueryStr ="";//�ڲ��˴����Ϣ
		
		String strTransRandom = MsgXmlDom.getElementValue(domReq,"strTransRandom");
		//�浥����  1:����  2������  3������  4������
		String strCDSType = MsgXmlDom.getElementValue(domReq,"strCDSType");
		//ת���ڲ��˽�����
		String strOldTransCode = MsgXmlDom.getElementValue(domReq, "strOldTransCode");
		//����/������Ϣ��ѯ
		CDSTransLogDB  transLogDB = new CDSTransLogDB();
		List<?> list = transLogDB.getCDSInfoList(strTransRandom,strCDSType);
		
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				CDSTransLog entity = (CDSTransLog)list.get(i);
				BigDecimal amt=entity.getAmt();
				DecimalFormat df = new DecimalFormat("0.00");
				String strAmt = df.format(amt);
				//�浥�������˺š����������ڡ�����
				//�浥�������˺š���Ϣ�͡����ڡ����ʡ���Ϣ�����𡢴浥����
				cdsTranslogInfoStr = cdsTranslogInfoStr +
				                                  entity.getStrAccountNum() + "," +
				                                  strAmt + "," +
				                                  entity.getStrTimeLimit()+"," +
				                                  entity.getStrRate()+","+
				                                  entity.getStrInterest()+","+
				                                  entity.getStrExInfo1()+","+
				                                  entity.getStrExInfo2()+"|";
			}
		}
		if(strOldTransCode != null && !strOldTransCode.equals("")){
			//ת����Ϣ��ѯ��905108��	
			CDSTransLogDB  othertransLogDB = new CDSTransLogDB();
			List<?> otherlist = othertransLogDB.getTransOutList(strTransRandom,strOldTransCode);
			
			if(otherlist != null && otherlist.size() > 0){
				for(int i=0; i < otherlist.size(); i++){
					CDSTransLog entity = (CDSTransLog)otherlist.get(i);
					BigDecimal amt=entity.getAmt();
					DecimalFormat df = new DecimalFormat("0.00");
					String strAmt = df.format(amt);				 
					cdsTransQueryStr = cdsTransQueryStr +
					                                  entity.getStrAccountNum()+"," +
					                                  strAmt+"|";
				}
			}
			
			//�����ֽ��ֵ
			List<?> otherCashlist = new TransLogDepositDB().getTransOutList(strTransRandom,"909008");		
			if(otherCashlist != null && otherCashlist.size() > 0){
				for(int i=0; i < otherCashlist.size(); i++){
					TransLogDeposit entity = (TransLogDeposit)otherCashlist.get(i);
					BigDecimal amt=entity.getDamount();
					DecimalFormat df = new DecimalFormat("0.00");
					String strAmt = df.format(amt);				 
					cdsCashTransQueryStr = cdsCashTransQueryStr +
						          	  	  strAmt+"|";
				}
			} 
		}
		
		System.out.println("cdsTransQueryStr=="+cdsTransQueryStr);
		System.out.println("cdsTranslogInfoStr=="+cdsTranslogInfoStr);
		System.out.println("cdsCashTransQueryStr=="+cdsCashTransQueryStr);
		
		MsgXmlDom.setElementValue(domResp, "cdsTranslogInfoStr", cdsTranslogInfoStr);
		MsgXmlDom.setElementValue(domResp, "cdsTransQueryStr", cdsTransQueryStr);
		MsgXmlDom.setElementValue(domResp, "cdsCashTransQueryStr", cdsCashTransQueryStr);
		setSucceedRespDom();
	}
}
