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
	public String CLEARCASH_FAILEDDESC = "�豸�峮ʧ��";
	public String CLEARCASH_FAILEDDESCEN = "ClearCash Failed";
	public String addBillAmount_clean;
	public String DcdmSurplusAm_clean;
	public String DcimSurplusAm_clean;
	public int iTermBatchNo_clean;
	public String DtStart_clean;
	/**
	 * ��¼������ˮ
	*/
	protected void append2TransLog()
	{
		//�������ǿ�Ƽ�¼��־������Ҫ���ݱ���F999�ж�
		if (TERMRETCODE_SUCCEED.equals(MsgXmlDom.getElementValue(domResp, "TermRetCode"))){
			//ֻ�гɹ���ʱ�򣬲�Ҫ�޸���״̬
			executeClearCash();
		}
	}

	/**
	 * ������ݿ����
	 */
	public void executeClearCash(){
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		SettleCycleLogDB settleCycleLogDB = new SettleCycleLogDB();
		SettleCycleLog settleCycleLog = settleCycleLogDB.getEntityByTermianl(strTerminalNum);
		if(settleCycleLog  == null){
			infoLog.info("�豸�峮ʧ�ܣ�" + strTerminalNum + " �޼ӳ���¼�������豸�ӳ�" + "�����룺" + TERMRETCODE_NOADDCASH );
			setSimpleRespDom(TERMRETCODE_NOADDCASH,TERMRETDESC_NOADDCASH, TERMRETDESCEN_NOADDCASH);
		}else{
			//��������Ρ��ӳ���ʣ����
			addBillAmount_clean = settleCycleLog.getDcdmAddAmt().toString();
			DcdmSurplusAm_clean = settleCycleLog.getDcdmSurplusAmt().toString();
			DcimSurplusAm_clean = settleCycleLog.getDcimSurplusAmt().toString();
			iTermBatchNo_clean = settleCycleLog.getIsettlecycle();
			DtStart_clean = settleCycleLog.getDtStart().toString();
			boolean result = clearCash(strTerminalNum);
			if(result){
			}else{
				infoLog.info("�豸�峮ʧ�ܣ�" + strTerminalNum + "�����룺" + CLEARCASH_FAILEDCODE );
				setSimpleRespDom(CLEARCASH_FAILEDCODE,CLEARCASH_FAILEDDESC, CLEARCASH_FAILEDDESCEN);
			}
		}
	}
//	//�������
	protected void notifyxViewProxy(){
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		//�Ѽӳ�������Ϣ���͸����
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
	  *���ô洢����
	*/
	public boolean clearCash(String strTerminalNum ){
		//1.�����ն˼ӳ���
		//2.���´����ˮ��¼��
		//3.����ȡ����ˮ��ˮ��
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
	        //���쳣�Ҵ洢���̵ķ���ֵΪ0��Ϊ100
	        if (cstmt.getInt(2) == 0||cstmt.getInt(2) ==100)
	        {
	           bRet = true;
	        }
	    }
	    catch (Exception e)
	    {
	       // ��¼��־��ˮ
	    	error.error("�豸�峮�洢����ʧ��:"+e.getMessage());
	       bRet = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return bRet;
	}

}
