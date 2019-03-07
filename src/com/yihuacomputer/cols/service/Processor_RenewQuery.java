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

public class Processor_RenewQuery extends Processor {

	public Logger error = Logger.getLogger("Error");

	public Processor_RenewQuery() {
		super();
	}

    protected String getTransName()
	{
		return "�浥��Ϣ��ѯ:����";
	}

	/**
	 * ������
	 */
	public void process() throws ProcessorException {
		String cdsOpenInfoStr ="";//���濪����Ϣ
		String cdsCanInfoStr ="";//����������Ϣ
		String cdsTransStr ="";//����ת���ڲ�����Ϣ
		String cdsCashTransStr ="";//�����ڲ��˴����Ϣ
		
		String strTransRandom = MsgXmlDom.getElementValue(domReq,"strTransRandom");
		//�浥����  3������  
		String strCDSType = MsgXmlDom.getElementValue(domReq,"strCDSType");
		//ԭ�����룺�䵥 905107 ����905104 �ڲ���ת�� 905108
		String strOldTransCode = MsgXmlDom.getElementValue(domReq, "strOldTransCode");
		String[] values = strOldTransCode.split(",");
		//����/������Ϣ��ѯ
		CDSTransLogDB  transLogDB = new CDSTransLogDB();
		
		if(values.length > 0){
			//����ת���ڲ���
			if(values[0].equals("905108")){
				List<?> otherlist = transLogDB.getTransOutList(strTransRandom,values[0]);
				
				if(otherlist != null && otherlist.size() > 0){
					for(int i=0; i < otherlist.size(); i++){
						CDSTransLog entity = (CDSTransLog)otherlist.get(i);
						BigDecimal amt=entity.getAmt();
						DecimalFormat df = new DecimalFormat("0.00");
						String strAmt = df.format(amt);				 
						cdsTransStr = cdsTransStr +
						              entity.getStrAccountNum()+"," +
						              strAmt+"|";
					}
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
					cdsCashTransStr = cdsCashTransStr +
						          	  strAmt+"|";
				}
			}       			
			//��������
			if(values[1].equals("905104")){
				List<?> list = transLogDB.getCDSInfoList(strTransRandom,strCDSType,values[1]);
				
				if(list != null && list.size() > 0){
					for(int i=0; i < list.size(); i++){
						CDSTransLog entity = (CDSTransLog)list.get(i);
						BigDecimal amt=entity.getAmt();
						DecimalFormat df = new DecimalFormat("0.00");
						String strAmt = df.format(amt);

						cdsCanInfoStr = cdsCanInfoStr +
						                entity.getStrAccountNum() + "," +
						                strAmt + "," +
		                                entity.getStrTimeLimit()+"," +
		                                entity.getStrRate()+","+
		                                entity.getStrInterest()+","+
		                                entity.getStrExInfo1()+","+
		                                entity.getStrExInfo2()+"|";
					}
				}									        			
			} 
			//���濪��
			if(values[2].equals("905107")){
				List<?> list = transLogDB.getCDSInfoList(strTransRandom,strCDSType,values[2]);
				if(list != null && list.size() > 0){
					for(int i=0; i < list.size(); i++){
						CDSTransLog entity = (CDSTransLog)list.get(i);
						BigDecimal amt=entity.getAmt();
						DecimalFormat df = new DecimalFormat("0.00");
						String strAmt = df.format(amt);

						cdsOpenInfoStr = cdsOpenInfoStr +
										entity.getStrAccountNum() + "," +
		                                strAmt + "," +
		                                entity.getStrTimeLimit()+"," +
		                                entity.getStrRate()+","+
		                                entity.getStrInterest()+","+
		                                entity.getStrExInfo1()+","+
		                                entity.getStrExInfo2()+"|";
					}
				}
					
				}  				
            }
		System.out.println("cdsOpenInfoStr=="+cdsOpenInfoStr);
		System.out.println("cdsCanInfoStr=="+cdsCanInfoStr);
		System.out.println("cdsTransStr=="+cdsTransStr);
		System.out.println("cdsCashTransStr=="+cdsCashTransStr);
		
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cdsOpenInfoStr", cdsOpenInfoStr);
		MsgXmlDom.setElementValue(domResp, "cdsCanInfoStr", cdsCanInfoStr);
		MsgXmlDom.setElementValue(domResp, "cdsTransStr", cdsTransStr);
		MsgXmlDom.setElementValue(domResp, "cdsCashTransStr", cdsCashTransStr);
	}		
}
