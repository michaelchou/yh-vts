package com.yihuacomputer.cols.service;


import org.apache.log4j.Logger;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.database.OtherTransLogDB;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.entity.OtherTransLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_TransQuery extends Processor {

	public Logger error = Logger.getLogger("Error");

	public Processor_TransQuery() {
		super();
	}

    protected String getTransName()
	{
		return "存单转入内部账查询";
	}

	/**
	 * 服务处理
	 */
	public void process() throws ProcessorException {
		String cdsTransQueryStr ="";//转入内部账信息
		String strTransRandom = MsgXmlDom.getElementValue(domReq,"strTransRandom");
		String strTerminalNum = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
		String strOldTransCode = MsgXmlDom.getElementValue(domReq, "strOldTransCode");
		OtherTransLogDB  transLogDB = new OtherTransLogDB();
		List<?> list = transLogDB.getTransList(strTransRandom,strTerminalNum,strOldTransCode);
		
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				OtherTransLog entity = (OtherTransLog)list.get(i);
				BigDecimal amt=entity.getAmt();
				DecimalFormat df = new DecimalFormat("0.00");
				String strAmt = df.format(amt);
				 
				cdsTransQueryStr = cdsTransQueryStr +
				                                  entity.getStrPan()+"," +
				                                  strAmt+"|";
			}
		}
		System.out.println("cdsTransQueryStr=="+cdsTransQueryStr);
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cdsTransQueryStr", cdsTransQueryStr);
	}
}
