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
		return "存单信息查询:开户、销户、部提、续存";
	}

	/**
	 * 服务处理
	 */
	public void process() throws ProcessorException {
		String cdsTranslogInfoStr ="";//存单信息
		String cdsTransQueryStr ="";//转入内部账信息
		String cdsCashTransQueryStr ="";//内部账存款信息
		
		String strTransRandom = MsgXmlDom.getElementValue(domReq,"strTransRandom");
		//存单类型  1:开户  2：销户  3：续存  4：部提
		String strCDSType = MsgXmlDom.getElementValue(domReq,"strCDSType");
		//转账内部账交易码
		String strOldTransCode = MsgXmlDom.getElementValue(domReq, "strOldTransCode");
		//开户/销户信息查询
		CDSTransLogDB  transLogDB = new CDSTransLogDB();
		List<?> list = transLogDB.getCDSInfoList(strTransRandom,strCDSType);
		
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				CDSTransLog entity = (CDSTransLog)list.get(i);
				BigDecimal amt=entity.getAmt();
				DecimalFormat df = new DecimalFormat("0.00");
				String strAmt = df.format(amt);
				//存单开户：账号、开户金额、存期、利率
				//存单销户：账号、本息和、存期、利率、利息、本金、存单户名
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
			//转账信息查询（905108）	
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
			
			//开户现金充值
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
