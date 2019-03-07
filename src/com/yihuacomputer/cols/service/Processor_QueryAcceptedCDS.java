package com.yihuacomputer.cols.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_QueryAcceptedCDS extends Processor {

	public Processor_QueryAcceptedCDS() {
		super();
	}

	protected String getTransName() {
		return "受理存单信息查询";
	}

	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * 
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String cdsTranslogInfoStr = "";// 存单信息
		
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String successfulAcceptedCDS = MsgXmlDom.getElementValue(domReq,"successfulAcceptedCDS");
		CDSTransLogDB transLogDB = new CDSTransLogDB();

		List<?> list = transLogDB.getAcceptedCDSList(strTerminalNum,successfulAcceptedCDS);
			if (list != null && list.size() > 0) {
				for (int i = 0; i < list.size(); i++) {
					CDSTransLog entity = (CDSTransLog) list.get(i);
	
					String strCDSAmt = "";// 存单金额
					BigDecimal amt = entity.getAmt();
					DecimalFormat df = new DecimalFormat("0.00");
					String strAmt = df.format(amt);// 交易金额
	
					DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					Timestamp ts = entity.getDtOccur();
					String tsStr = "";// 交易时间
					tsStr = sdf.format(ts);
	
					String type = entity.getStrCDSType();
	
					String transcode = "";
	
					if (entity.getTransCode() == null)
						continue;
	
					if (entity.getTransCode().equals("905107")) {
						strCDSAmt = strAmt;
						if (type.equals("1"))
							transcode = "存单开户";
						else if (type.equals("3"))
							transcode = "续存开户";
					} else if (entity.getTransCode().equals("905104")) {
						if (entity.getStrExInfo1() == null
								|| entity.getStrExInfo1().equals(""))
							strCDSAmt = strAmt;
						else {
							BigDecimal amtCDS = new BigDecimal(
									entity.getStrExInfo1());
							strCDSAmt = df.format(amtCDS);// 存单金额
						}
	
						if (type.equals("2"))
							transcode = "存单销户";
						else if (type.equals("3"))
							transcode = "续存销户";
					} else if (entity.getTransCode().equals("905103")) {
						if (entity.getStrExInfo1() == null
								|| entity.getStrExInfo1().equals(""))
							strCDSAmt = "";
						else {
							BigDecimal amtCDS = new BigDecimal(
									entity.getStrExInfo1());
							strCDSAmt = df.format(amtCDS);// 存单金额
						}
					} else
						continue;
	
					int iTermTxStatus = entity.getTermTxStatus();
					int iHostTxStatus = entity.getHostTxStatus();
	
					String strTransResult = "";
	
					if (iHostTxStatus == 0) {
						strTransResult = "交易成功";
					} else if (iHostTxStatus == 1) {
						strTransResult = "交易失败";
					} else if (iHostTxStatus == 2) {
						strTransResult = "交易未知";
					} else if (iHostTxStatus == 3) {
						strTransResult = "交易取消";
					} else if (iHostTxStatus == -1) {
						strTransResult = "交易未发";
					} else {
						strTransResult = "交易未知";
					}
	
					if (iTermTxStatus == 0) {
						strTransResult += " 凭证未动作";
					} else if (iTermTxStatus == 9) {
						strTransResult += " 新凭证未动作";
					} else if (iTermTxStatus == 1) {
						strTransResult += " 凭证成功";
					} else if (iTermTxStatus == 2) {
						strTransResult += " 凭证失败";
					} else if (iTermTxStatus == 3) {
						strTransResult += " 凭证已吞";
					} else if (iTermTxStatus == 4) {
						strTransResult += " 凭证未知";
					}
					//销户是先吞单后发交易
					if(entity.getTransCode().equals("905104")){
						cdsTranslogInfoStr = cdsTranslogInfoStr
								+ entity.getStrOCRNum() + ","
								+ entity.getStrAccountNum() + "," + transcode + ","
								+ strCDSAmt + "," + strAmt + "," + tsStr + ","
								+ "交易成功 凭证已吞" + "|";					
					}else if (entity.getTransCode().equals("905103")) {					
						if (iHostTxStatus == 0) {
							//部提交易成功，需要销户及开户均记录一笔
							// 部提销户：老凭证号
							cdsTranslogInfoStr = cdsTranslogInfoStr
									+ entity.getStrExInfo3() + ","
									+ entity.getStrAccountNum() + "," 
									+ "部提销户"+ "," 
									+ entity.getStrExInfo2() + "," 
									+ entity.getStrExInfo1() + "," 
									+ tsStr+ "," 
									+ "交易成功 凭证已吞" + "|";
							//如果部提存单凭证动作正常
							if(iTermTxStatus == 1){
								// 部提开户：新凭证号
								// 部提开户金额 = 部提本金 - 部提金额
								int strDrawTotalAmount = Integer.parseInt(new DataConversion().getMoneyToFen(entity.getStrExInfo2()));
								int strDrawAmount = Integer.parseInt(new DataConversion().getMoneyToFen(strAmt));
								String strDrawOpenAmount = String.valueOf(strDrawTotalAmount - strDrawAmount);
								strDrawOpenAmount = new DataConversion().fromFenToYuan(strDrawOpenAmount);
								cdsTranslogInfoStr = cdsTranslogInfoStr
										+ entity.getStrOCRNum() + ","
										+ entity.getStrAccountNum() + "," 
										+ "部提开户"+ "," 
										+ strDrawOpenAmount + "," 
										+ strDrawOpenAmount+ "," 
										+ tsStr + "," 
										+ "交易成功 凭证成功" + "|";							
							}
						}else{
							// 如果后台返回部提成功，配单失败HX00BF，则销户需记录一笔
							String strHostRetcode = entity.getStrHostRetCode();
							if (iHostTxStatus == 1 && strHostRetcode.equals("HX00BF")) {
								// 部提销户：老凭证号
								cdsTranslogInfoStr = cdsTranslogInfoStr
										+ entity.getStrExInfo3() + ","
										+ entity.getStrAccountNum() + "," 
										+ "部提销户"+ "," 
										+ entity.getStrExInfo2() + "," 
										+ entity.getStrExInfo1() + ","
										+ tsStr + "," 
										+ "交易成功 凭证已吞" + "|";
							}
						}
					}else {
						cdsTranslogInfoStr = cdsTranslogInfoStr
								+ entity.getStrOCRNum() + ","
								+ entity.getStrAccountNum() + "," + transcode + ","
								+ strCDSAmt + "," + strAmt + "," + tsStr + ","
								+ strTransResult + "|";
					}
				}
			}
		
		// 设置成功信息
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cdsTranslogInfoStr",cdsTranslogInfoStr);
	}
}
