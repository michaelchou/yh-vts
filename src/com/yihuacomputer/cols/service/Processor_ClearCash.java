package com.yihuacomputer.cols.service;

import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;

import org.apache.log4j.Logger;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.database.SettleCycleLogDB;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_ClearCash extends Processor_Trans {
	public Logger infoLog = Logger.getLogger("Info");

	public String CLEARCASH_FAILEDCODE = "0311";
	public String CLEARCASH_FAILEDDESC = "设备清钞失败";
	public String CLEARCASH_FAILEDDESCEN = "ClearCash Failed";
	public String addBillAmount_clean;
	public String DcdmSurplusAm_clean;
	public String DcimSurplusAm_clean;
	public int iTermBatchNo_clean;
	public String DtStart_clean;
	/**
	 * 记录交易流水
	*/
	protected void append2TransLog()
	{
		//清机交易强制记录日志，不需要根据报文F999判断
		if (TERMRETCODE_SUCCEED.equals(MsgXmlDom.getElementValue(domResp, "TermRetCode"))){
			//只有成功的时候，才要修改其状态
			executeClearCash();
		}
	}

	/**
	 * 清机数据库操作
	 */
	public void executeClearCash(){
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		SettleCycleLogDB settleCycleLogDB = new SettleCycleLogDB();
		SettleCycleLog settleCycleLog = settleCycleLogDB.getEntityByTermianl(strTerminalNum);
		if(settleCycleLog  == null){
			infoLog.info("设备清钞失败：" + strTerminalNum + " 无加钞记录，请先设备加钞" + "错误码：" + TERMRETCODE_NOADDCASH );
			setSimpleRespDom(TERMRETCODE_NOADDCASH,TERMRETDESC_NOADDCASH, TERMRETDESCEN_NOADDCASH);
		}else{
			//清机的批次、加钞金额、剩余金额
			addBillAmount_clean = settleCycleLog.getDcdmAddAmt().toString();
			DcdmSurplusAm_clean = settleCycleLog.getDcdmSurplusAmt().toString();
			DcimSurplusAm_clean = settleCycleLog.getDcimSurplusAmt().toString();
			iTermBatchNo_clean = settleCycleLog.getIsettlecycle();
			DtStart_clean = settleCycleLog.getDtStart().toString();
			boolean result = clearCash(strTerminalNum);
			if(result){
			}else{
				infoLog.info("设备清钞失败：" + strTerminalNum + "错误码：" + CLEARCASH_FAILEDCODE );
				setSimpleRespDom(CLEARCASH_FAILEDCODE,CLEARCASH_FAILEDDESC, CLEARCASH_FAILEDDESCEN);
			}
		}
	}
//	//发往监控
	protected void notifyxViewProxy(){
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		//把加钞批次信息发送给监控
		String dtDate = new DateCtrl().getDateTimeStrSimpleFull();
		ColsTransMsg msg = new ColsTransMsg();
		if (TERMRETCODE_SUCCEED.equals(MsgXmlDom.getElementValue(domResp, "TermRetCode"))){
		    msg.put("strTerminalNum", strTerminalNum);
		    msg.put("iTermBatchNo", String.valueOf(iTermBatchNo_clean));
		    msg.put("dtStart", DtStart_clean);
		    msg.put("dtEnd", dtDate);
		    msg.put("iStatus", String.valueOf(1));
		    msg.put("addBillAmount", addBillAmount_clean);
		    msg.put("cdmBillAmount",DcdmSurplusAm_clean);
		    msg.put("cimBillAmount",DcimSurplusAm_clean);
		}else{
		    msg.put("strTerminalNum", strTerminalNum);
		    msg.put("iTermBatchNo", "0");
		    msg.put("dtStart", new DateCtrl().getDateTimeStrSimpleFull());
		    msg.put("dtEnd", dtDate);
		    msg.put("iStatus", String.valueOf(1));
		    msg.put("addBillAmount", "0.00");
		    msg.put("cdmBillAmount","0.00");
		    msg.put("cimBillAmount","0.00");
		}
	    new LinxViewProxy().sendCashSettleCycleLogMsg_Clean(msg.toString());
	}
	/**
	  *调用存储过程
	*/
	public boolean clearCash(String strTerminalNum ){
		//1.更新终端加钞表
		//2.更新存款流水记录表
		//3.更新取款流水流水表
		boolean bRet = false;
	    CallableStatement cstmt = null;
	    String procedure = "{call ClearCash(?,?)}";
	    try
	    {
	        Session session = HibernateUtil.getSession();
	        Connection conn = session.connection();
	        cstmt = conn.prepareCall(procedure);
	        cstmt.setString(1, strTerminalNum);
	        cstmt.registerOutParameter(2, Types.INTEGER);
	        cstmt.execute();
	        //无异常且存储过程的返回值为0或为100
	        if (cstmt.getInt(2) == 0||cstmt.getInt(2) ==100)
	        {
	           bRet = true;
	        }
	    }
	    catch (Exception e)
	    {
	       // 记录日志流水
	    	error.error("设备清钞存储过程失败:"+e.getMessage());
	       bRet = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return bRet;
	}

}
