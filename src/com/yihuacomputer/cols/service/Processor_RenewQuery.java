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
		return "存单信息查询:续存";
	}

	/**
	 * 服务处理
	 */
	public void process() throws ProcessorException {
		String cdsOpenInfoStr ="";//续存开户信息
		String cdsCanInfoStr ="";//续存销户信息
		String cdsTransStr ="";//续存转入内部账信息
		String cdsCashTransStr ="";//续存内部账存款信息
		
		String strTransRandom = MsgXmlDom.getElementValue(domReq,"strTransRandom");
		//存单类型  3：续存  
		String strCDSType = MsgXmlDom.getElementValue(domReq,"strCDSType");
		//原交易码：配单 905107 销户905104 内部账转账 905108
		String strOldTransCode = MsgXmlDom.getElementValue(domReq, "strOldTransCode");
		String[] values = strOldTransCode.split(",");
		//开户/销户信息查询
		CDSTransLogDB  transLogDB = new CDSTransLogDB();
		
		if(values.length > 0){
			//续存转入内部账
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
			//续存现金充值
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
			//续存销户
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
			//续存开户
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
