package com.yihuacomputer.cols.monitor;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Vector;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.params.ClientPNames;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.params.HttpParams;
import org.apache.log4j.Logger;

import java.util.Iterator;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSUnitStatus;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardUnitStatus;
import com.yihuacomputer.cols.entity.CashBoxUnit;
import com.yihuacomputer.cols.entity.CashBoxUnitStatus;
import com.yihuacomputer.cols.entity.ExpLog;
import com.yihuacomputer.cols.entity.HostRetCode;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyUnitStatus;
import com.yihuacomputer.cols.util.DateCtrl;

public class LinxViewProxy {
	public Logger error = Logger.getLogger("Error");
	public Logger info = Logger.getLogger("Info");
	/**
	 * 组装交易报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendTransMsg(String strTransMsg) {
	    ColsTransMsg msg = new ColsTransMsg(strTransMsg);
	    List<Transaction> cardSettleList = new ArrayList<Transaction>();
	    ATMVTrans  trans =  new ATMVTrans();
	    //组装交易数据
	    Transaction status = new Transaction();
	    status.setTermId(msg.get("strTerminalNum"));
	    status.setTransId(msg.get("strTerminalTsn"));
	    status.setDebitAccount(msg.get("strPan"));
	    status.setCreditAccount(msg.get("strDestPan"));
	    status.setTransCode(msg.get("strTransCode"));
	    if(msg.get("Amount") != null && !msg.get("Amount").equals("")&& !msg.get("Amount").equals("0")){
	       status.setAmt(Double.parseDouble(msg.get("Amount")));
	    }
	    else{
	       status.setAmt(0.00);
	    }
	    status.setCurrency("CNY");
	    status.setDateTime(Long.parseLong(msg.get("DateTime")));
	    status.setTransDate(Integer.parseInt(msg.get("TransDate")));
	    status.setHostRet(msg.get("strHostRet"));
	    status.setLocalRet(msg.get("strLocalRet"));
	    status.setTipFee(Double.parseDouble(msg.get("fee")));
	    if(msg.get("CardType").equals("060") || msg.get("CardType").equals("061") || msg.get("CardType").equals("062") || msg.get("CardType").equals("063")){
	    	status.setCardType(msg.get("1"));
	    }
	    else{
	        status.setCardType(msg.get("CardType"));
	    }
	    status.setCostTime(Long.parseLong(msg.get("CostTime")));
	    status.setiHostTxStatus(Integer.parseInt(msg.get("iHostTxStatus")));
	    status.setStrHostSerialNo(msg.get("strHostSerialNo"));
	    status.setiTermBatchNo(msg.get("iTermBatchNo"));
	    status.setiTermTxStatus(msg.get("iTermTxStatus"));
	    status.setStrOrigstrTxSerialNo(msg.get("strOrigstrTxSerialNo"));
		try {
		    Date dtHostOccur = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(msg.get("dtHostOccur"));
			status.setDtHostOccur(dtHostOccur);
		} catch (ParseException e1) {
			error.error("日期类型转换错误:"+e1.getMessage() + "\r\n");
		}
		cardSettleList.add(status);
		//组装 交易数据+MsgType
		trans.setMsgType("TRANSACTION");

		trans.setData(cardSettleList);
	    String strJson = new JsonUtils().toJson(trans);
	    //向监控发送报文
	    SendMonitor(strJson);
	}

	/**
	 * 组装异常信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendExplogMsg(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 //组装异常信息数据
		 ExpLog entity = new ExpLog();
		 List<ExpLog> cardSettleList = new ArrayList<ExpLog>();
		 entity.setStrTerminalNum(msg.get("strTerminalNum"));
		 entity.setStrPan(msg.get("strPan"));
		 entity.setStrExpCode(msg.get("strExpCode"));
		 entity.setDtOccur(new DateCtrl().getStrToTimestamp(msg.get("dtOccur")));
		 entity.setStrMemo(msg.get("strMemo"));
		 //组装 异常信息数据+MsgType
		 trans.setMsgType("ExpLog");
		 cardSettleList.add(entity);
		 trans.setData(cardSettleList);
		 String strJson = new JsonUtils().toJson(trans);
		 //向监控发送报文
		 SendMonitor(strJson);
	}

	/**
	 * 组装主机返回码信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendHostRetCodeMsg(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 //组装主机返回码信息数据
		 HostRetCode entity = new HostRetCode();
		 List<HostRetCode> cardSettleList = new ArrayList<HostRetCode>();
		 entity.setId(Integer.parseInt(msg.get("id")));
		 entity.setStrHostRetCode(msg.get("strHostRetCode"));
		 entity.setStrHostRetDesc(msg.get("strHostRetDesc"));
		 //组装 异常信息数据+MsgType
		 trans.setMsgType("RetCodeConvt");
		 cardSettleList.add(entity);
		 trans.setData(cardSettleList);
		 String strJson = new JsonUtils().toJson(trans);
		 //向监控发送报文
		 SendMonitor(strJson);
	}

	/**
	 * 组装加卡批次信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendCardSettleCycleLogMsg(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 //组装加卡批次信息数据
		 List<CardSettleCycleLog> cardSettleList = new ArrayList<CardSettleCycleLog>();
		 CardSettleCycleLog entity = new CardSettleCycleLog();
		 entity.setStrTerminalNum(msg.get("strTerminalNum"));
		 entity.setTermBatchNo(Integer.parseInt(msg.get("iTermBatchNo")));
		 entity.setDtStart(new DateCtrl().getStrToTimestamp(msg.get("dtStart")));
		 entity.setStatus(Integer.parseInt(msg.get("iStatus")));
		 entity.setCardSurplusCount(Integer.parseInt(msg.get("iCardSurplusCount")));
		 entity.setCardRefillCount(Integer.parseInt(msg.get("iCardRefillCount")));
		 //组装 加卡批次数据+MsgType
		 trans.setMsgType("CardSettleCycleLog");
		 cardSettleList.add(entity);
		 trans.setData(cardSettleList);
	//	 trans.setCardSettleCycleLog(entity);
		 String strJson = new JsonUtils().toJson(trans);
		 //向监控发送报文
		 SendMonitor(strJson);
	}
	@SuppressWarnings("static-access")
	public void sendCardUnitStatusMsg(List<CardUnitStatus> cardList) {
		 ATMVTrans  trans =  new ATMVTrans();
		 //组装 卡箱状态表数据+MsgType
		 trans.setMsgType("CardUnitStatus");
		 trans.setData(cardList);
		 String strJson = new JsonUtils().toJson(trans);
		 //向监控发送报文
		 System.out.println(strJson);
		 SendMonitor(strJson);
	}
	/**
	 * 组装清卡批次信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendCardSettleCycleLogMsg_Clean(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 //组装加卡批次信息数据
		 List<CardSettleCycleLog> cardSettleList = new ArrayList<CardSettleCycleLog>();
		 CardSettleCycleLog entity = new CardSettleCycleLog();
		 entity.setStrTerminalNum(msg.get("strTerminalNum"));
		 entity.setTermBatchNo(Integer.parseInt(msg.get("iTermBatchNo")));
		 entity.setDtStart(new DateCtrl().getStrToTimestamp(msg.get("dtStart")));
		 entity.setDtEnd(new DateCtrl().getStrToTimestamp(msg.get("dtEnd")));
		 entity.setStatus(Integer.parseInt(msg.get("iStatus")));
		 entity.setCardSurplusCount(Integer.parseInt(msg.get("iCardSurplusCount")));
		 entity.setCardRefillCount(Integer.parseInt(msg.get("iCardRefillCount")));
		 //组装 清卡批次数据+MsgType
		 trans.setMsgType("CleanCard");
		 cardSettleList.add(entity);
		 trans.setData(cardSettleList);
	//	 trans.setCardSettleCycleLog(entity);
		 String strJson = new JsonUtils().toJson(trans);
		 System.out.println(strJson);
		 //向监控发送报文
		 SendMonitor(strJson);
	}
	/**
	 * 组装加存单批次信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendCDSSettleCycleLogMsg(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 List<CDSSettleCycleLog> cdsSettleList = new ArrayList<CDSSettleCycleLog>();
		 //组装加存单批次信息数据
		 CDSSettleCycleLog entity = new CDSSettleCycleLog();
		 entity.setStrTerminalNum(msg.get("strTerminalNum"));
		 entity.setTermBatchNo(Integer.parseInt(msg.get("iTermBatchNo")));
		 entity.setDtStart(new DateCtrl().getStrToTimestamp(msg.get("dtStart")));
		 entity.setStatus(Integer.parseInt(msg.get("iStatus")));
		 entity.setCdsSurplusCount(Integer.parseInt(msg.get("iDepSurplusCount")));
		 entity.setCdsRefillCount(Integer.parseInt(msg.get("iDepRefillCount")));

		 //组装 加存单批次数据+MsgType
		 trans.setMsgType("DepositReceiptBatch");
		 cdsSettleList.add(entity);
		 trans.setData(cdsSettleList);

		 String strJson = new JsonUtils().toJson(trans);
		 //向监控发送报文
		 SendMonitor(strJson);
	}

	/**
	 * 组装存单箱状态表信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendDepositReceiptStatusMsg(List<CDSUnitStatus> cdsList) {
		 ATMVTrans  trans =  new ATMVTrans();
		 //组装 存单箱状态表数据+MsgType
		 trans.setMsgType("DepositReceiptStatus");
		 trans.setData(cdsList);
		 String strJson = new JsonUtils().toJson(trans);
		 //向监控发送报文
		 SendMonitor(strJson);
	}
	/**
	 * 组装清存单批次信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendCDSSettleCycleLogMsg_Clean(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 List<CDSSettleCycleLog> cdsSettleList = new ArrayList<CDSSettleCycleLog>();
		 //组装清存单批次信息数据
		 CDSSettleCycleLog entity = new CDSSettleCycleLog();
		 entity.setStrTerminalNum(msg.get("strTerminalNum"));
		 entity.setTermBatchNo(Integer.parseInt(msg.get("iTermBatchNo")));
		 entity.setDtStart(new DateCtrl().getStrToTimestamp(msg.get("dtStart")));
		 entity.setDtEnd(new DateCtrl().getStrToTimestamp(msg.get("dtEnd")));
		 entity.setStatus(Integer.parseInt(msg.get("iStatus")));
		 entity.setCdsSurplusCount(Integer.parseInt(msg.get("iDepSurplusCount")));
		 entity.setCdsRefillCount(Integer.parseInt(msg.get("iDepRefillCount")));

		 //组装 清存单批次数据+MsgType
		 trans.setMsgType("CleanCDS");
		 cdsSettleList.add(entity);
		 trans.setData(cdsSettleList);

		 String strJson = new JsonUtils().toJson(trans);
		 System.out.println(strJson);
		 //向监控发送报文
		 SendMonitor(strJson);
	}
	/**
	 * 组装加UKey批次信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendUKeySettleCycleLogMsg(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 List<UKeySettleCycleLog> ukeySettleList = new ArrayList<UKeySettleCycleLog>();
		 //组装加UKey批次信息数据
		 UKeySettleCycleLog entity = new UKeySettleCycleLog();
		 entity.setStrTerminalNum(msg.get("strTerminalNum"));
		 entity.setTermBatchNo(Integer.parseInt(msg.get("iTermBatchNo")));
		 entity.setDtStart(new DateCtrl().getStrToTimestamp(msg.get("dtStart")));
		 entity.setStatus(Integer.parseInt(msg.get("iStatus")));
		 entity.setuKeySurplusCount(Integer.parseInt(msg.get("iUKeySurplusCount")));
		 entity.setuKeyRefillCount(Integer.parseInt(msg.get("iUKeyRefillCount")));
		 //组装 加UKey批次数据+MsgType
		 trans.setMsgType("UKeySettleCycleLog");
		 ukeySettleList.add(entity);
		 trans.setData(ukeySettleList);

		 String strJson = new JsonUtils().toJson(trans);
		 //向监控发送报文
		 SendMonitor(strJson);
	}

	/**
	 * 组装ukey箱状态表信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendUKeyUnitStatusMsg(List<UKeyUnitStatus> ukeyList) {
		 ATMVTrans  trans =  new ATMVTrans();
		 //组装 ukey箱状态表数据+MsgType
		 trans.setMsgType("UKeyUnitStatus");
		 trans.setData(ukeyList);
		 String strJson = new JsonUtils().toJson(trans);
		 //向监控发送报文
		 SendMonitor(strJson);
	}
	/**
	 * 组装清UKey批次信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendUKeySettleCycleLogMsg_Clean(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 List<UKeySettleCycleLog> ukeySettleList = new ArrayList<UKeySettleCycleLog>();
		 //组装清UKey批次信息数据
		 UKeySettleCycleLog entity = new UKeySettleCycleLog();
		 entity.setStrTerminalNum(msg.get("strTerminalNum"));
		 entity.setTermBatchNo(Integer.parseInt(msg.get("iTermBatchNo")));
		 entity.setDtStart(new DateCtrl().getStrToTimestamp(msg.get("dtStart")));
		 entity.setDtEnd(new DateCtrl().getStrToTimestamp(msg.get("dtEnd")));
		 entity.setStatus(Integer.parseInt(msg.get("iStatus")));
		 entity.setuKeySurplusCount(Integer.parseInt(msg.get("iUKeySurplusCount")));
		 entity.setuKeyRefillCount(Integer.parseInt(msg.get("iUKeyRefillCount")));
		 //组装 清UKey批次数据+MsgType
		 trans.setMsgType("CleanUKey");
		 ukeySettleList.add(entity);
		 trans.setData(ukeySettleList);

		 String strJson = new JsonUtils().toJson(trans);
		 System.out.println(strJson);
		 //向监控发送报文
		 SendMonitor(strJson);
	}
	/**
	 * 组装增加钞箱批次信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendCashSettleCycleLogMsg_Add(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 List<SettleCycleLog> cashSettleList = new ArrayList<SettleCycleLog>();
		 //组装钞箱批次信息数据
		 SettleCycleLog entity = new SettleCycleLog();
		 entity.setStrTerminalNum(msg.get("strTerminalNum"));
		 entity.setIsettlecycle(Integer.parseInt(msg.get("iTermBatchNo")));
		 entity.setDtStart(new DateCtrl().getStrToTimestamp(msg.get("dtStart")));
		 entity.setIsStatus(Integer.parseInt(msg.get("iStatus")));
		 entity.setDcdmAddAmt(new BigDecimal(msg.get("addBillAmount")));
		 entity.setDcdmSurplusAmt(new BigDecimal(msg.get("surplusBillAmount")));
		 entity.setDcimSurplusAmt(new BigDecimal("0.00"));
		 //组装钞箱批次数据+MsgType
		 trans.setMsgType("CashBoxCycleLog");
		 cashSettleList.add(entity);
		 trans.setData(cashSettleList);

		 String strJson = new JsonUtils().toJson(trans);
		 System.out.println(strJson);
		 //向监控发送报文
		 SendMonitor(strJson);
	}
	/**
	 * 组装清机钞箱批次信息报文
	 * @param msg
	 * @return
	 */
	@SuppressWarnings("static-access")
	public void sendCashSettleCycleLogMsg_Clean(String strTransMsg) {
		 ColsTransMsg msg = new ColsTransMsg(strTransMsg);
		 ATMVTrans  trans =  new ATMVTrans();
		 //组装钞箱批次信息数据
		 List<SettleCycleLog> cashSettleList = new ArrayList<SettleCycleLog>();
		 SettleCycleLog entity = new SettleCycleLog();
		 entity.setStrTerminalNum(msg.get("strTerminalNum"));
		 entity.setIsettlecycle(Integer.parseInt(msg.get("iTermBatchNo")));
		 entity.setDtStart(new DateCtrl().getStrToTimestamp(msg.get("dtStart")));
		 entity.setDtEnd(new DateCtrl().getStrToTimestamp(msg.get("dtEnd")));
		 entity.setIsStatus(Integer.parseInt(msg.get("iStatus")));
		 entity.setDcdmAddAmt(new BigDecimal(msg.get("addBillAmount")));
		 entity.setDcdmSurplusAmt(new BigDecimal(msg.get("cdmBillAmount")));
		 entity.setDcimSurplusAmt(new BigDecimal(msg.get("cimBillAmount")));
		 //组装 清钞箱批次数据+MsgType
		 trans.setMsgType("CashBoxCycleLog");
		 cashSettleList.add(entity);
		 trans.setData(cashSettleList);
		 String strJson = new JsonUtils().toJson(trans);
		 System.out.println(strJson);
		 //向监控发送报文
		 SendMonitor(strJson);
	}
	/**
	 * 组装钞箱计数信息报文
	 * @param msg
	 * @return
	 */
	public void sendCashBoxUnitStatus(String strTransMsg,String strTerminalNum) {
		 ATMVTrans  trans =  new ATMVTrans();
		 //组装钞箱批次信息数据
		 List<CashBoxUnitStatus> cashBoxUnitStatus = new ArrayList<CashBoxUnitStatus>();
		 //解析数据
		 Vector strMessinfo = readXMLString(strTransMsg);
         Iterator it = strMessinfo.iterator();
         while (it.hasNext()) {
        	 CashBoxUnitStatus entity = new CashBoxUnitStatus();
        	 CashBoxUnit cashBoxUnit = (CashBoxUnit) it.next();
        	 entity.setBoxNum(Integer.parseInt(cashBoxUnit.getBox_no()));
        	 entity.setBoxStatus(Integer.parseInt(cashBoxUnit.getStatus()));
        	 entity.setBoxType(Integer.parseInt(cashBoxUnit.getBox_type()));
        	 entity.setCurrentCount(Integer.parseInt(cashBoxUnit.getCash_count()));
        	 entity.setStrTerminalNum(strTerminalNum);
        	 entity.setId(cashBoxUnit.getId());
        	 entity.setInitCount(Integer.parseInt(cashBoxUnit.getCash_count0()));
        	 entity.setDenom(Integer.parseInt(cashBoxUnit.getDenom()));
        	 cashBoxUnitStatus.add(entity);
         }
		 //组装 清钞箱批次数据+MsgType
		 trans.setMsgType("CashBoxUnitStatus");
		 trans.setData(cashBoxUnitStatus);
		 String strJson = new JsonUtils().toJson(trans);
		 System.out.println(strJson);
		 //向监控发送报文
		 SendMonitor(strJson);
	}
	//解析钞箱信息数据数据方法
	public Vector readXMLString(String xmlStr){
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder;
        Vector cashbox_Vector = null;
        InputStream inputStream = null;
        Document doc;
		try {
			builder = dbf.newDocumentBuilder();
	        inputStream = new ByteArrayInputStream(xmlStr.getBytes());
			doc = builder.parse(inputStream);
	        // 下面开始读取
	        Element root = doc.getDocumentElement(); // 获取根元素
	        NodeList cashbox = root.getElementsByTagName("item");
	        cashbox_Vector = new Vector();
	        for (int i = 0; i < cashbox.getLength(); i++) {
	            // 一次取得每一个钞箱元素
	            Element ss = (Element) cashbox.item(i);
	
	            // 创建一个钞箱的实例
	            CashBoxUnit cashBoxUnit = new CashBoxUnit();
	            
	            cashBoxUnit.setId(i+1);
	            NodeList names = ss.getElementsByTagName("box_no");
	            Element e = (Element) names.item(0);
	            Node t = e.getFirstChild();
	            cashBoxUnit.setBox_no(t.getNodeValue());
	
	            NodeList status = ss.getElementsByTagName("status");
	            e = (Element) status.item(0);
	            t = e.getFirstChild();
	            cashBoxUnit.setStatus(t.getNodeValue());
	
	            NodeList denom = ss.getElementsByTagName("denom");
	            e = (Element) denom.item(0);
	            t = e.getFirstChild();
	            cashBoxUnit.setDenom(t.getNodeValue());
	            
	            NodeList cash_count = ss.getElementsByTagName("cash_count");
	            e = (Element) cash_count.item(0);
	            t = e.getFirstChild();
	            cashBoxUnit.setCash_count(t.getNodeValue());
	            
	            NodeList cash_count0 = ss.getElementsByTagName("cash_count0");
	            e = (Element) cash_count0.item(0);
	            t = e.getFirstChild();
	            cashBoxUnit.setCash_count0(t.getNodeValue());
	            
	            NodeList box_type = ss.getElementsByTagName("box_type");
	            e = (Element) box_type.item(0);
	            t = e.getFirstChild();
	            cashBoxUnit.setBox_type(t.getNodeValue());   
	            cashbox_Vector.add(cashBoxUnit);
	        }
        } catch (Exception e1) {
        	error.error("钞箱信息数据解析异常");
		}finally{
			try {
				inputStream.close();
			} catch (Exception e) {
				System.out.println("关闭流");
			}
		}
        return cashbox_Vector;
    }
	
	/**
	 * 向监控服务器发送报文(包含交易、吞卡、重空)
	 * @param msg
	 * @param httpUrl
	 * @return
	 */
	public void SendMonitor(String strJson) {
		Long CONN_MANAGER_TIMEOUT = 500L; //该值就是连接不够用的时候等待超时时间，一定要设置，而且不能太大
		HttpParams httpParams  = new BasicHttpParams();
		httpParams.setIntParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 1000);
		httpParams.setIntParameter(CoreConnectionPNames.SO_TIMEOUT, 5000);
		httpParams.setLongParameter(ClientPNames.CONN_MANAGER_TIMEOUT, CONN_MANAGER_TIMEOUT);
		//在提交请求之前 测试连接是否可用
		httpParams.setBooleanParameter(CoreConnectionPNames.STALE_CONNECTION_CHECK, true);
		HttpClient httpClient = new DefaultHttpClient(httpParams);
		//监控交易服务器URL地址
		String httpUrl = new MiscDB().get("00001", "ATMVHostUrl", "");
		HttpPost httpPost = new HttpPost(httpUrl);
		try {
			// 设置请求体参数,编码方式为utf-8
			StringEntity entity = new StringEntity(strJson, "UTF-8");
			// 设置请求头信息
			Header header = new BasicHeader("Content-Type","application/json;charset=UTF-8");
			entity.setContentType(header);
			httpPost.setEntity(entity);
			// 发送请求
			HttpResponse response = httpClient.execute(httpPost);
			StatusLine statusLine = response.getStatusLine();
			if(statusLine.getStatusCode() == 200){
				info.info("send msg success:"+httpUrl+ strJson.toString() + "\r\n");
			}else{
				error.error("send msg fail:"+"["+statusLine.getStatusCode()+"]"+httpUrl+ strJson.toString() + "\r\n");
			}
		} catch (Exception e) {
			e.printStackTrace();
			error.error("send msg fail"+httpUrl+ strJson.toString() + " 错误信息:"+e.getMessage()+"\r\n");
		} finally {
			httpClient.getConnectionManager().shutdown();
		}
	}
}