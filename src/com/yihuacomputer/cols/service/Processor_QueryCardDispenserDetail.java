package com.yihuacomputer.cols.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.database.CardTransLogDB;
import com.yihuacomputer.cols.database.CardTransLogDB;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.entity.CardTransLog;
import com.yihuacomputer.cols.entity.Misc;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_QueryCardDispenserDetail extends Processor {

	public Processor_QueryCardDispenserDetail() {
		super();
	}

    protected String getTransName()
	{
		return "发卡信息查询";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String cardTranslogInfoStr ="";//发卡信息
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CardTransLogDB  transLogDB = new CardTransLogDB();
		List<?> list = transLogDB.getBatchList(strTerminalNum);
		
		MiscDB   db= new MiscDB();
	    
    	List<?> miscList=db.getList("00001", "strCardType");
		
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				CardTransLog entity = (CardTransLog)list.get(i);
				String strPan=entity.getStrPan();
			
				String strCardType=entity.getStrCardType();
				int iTermTxStatus=entity.getTermTxStatus();
				int iHostTxStatus=entity.getHostTxStatus();
				
			     if(entity.getTransCode()==null)
					 continue;
			     
				 if(!entity.getTransCode().equals("901104") && !entity.getTransCode().equals("901301")
						 && !entity.getTransCode().equals("901401")){
					continue;
				 }
				 
				//strCardType="鑫通卡";
				if(miscList != null && miscList.size() > 0){
			    	for(int m=0;m<miscList.size();m++){
			    		Misc misc = (Misc)miscList.get(m);
			    		if(strCardType.equals(misc.getStrValue())){
			    			strCardType=misc.getStrDesc();
			    			break;
			    		}
			    		
			    	}
				}
				
			
				 DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				 Timestamp ts = entity.getDtOccur();
				 String tsStr = "";
				 tsStr = sdf.format(ts);

				 String strTransResult="";
				 if(iTermTxStatus==0){
					 strTransResult+="未发卡";
				 }else
				  if(iTermTxStatus==1){
					 strTransResult+="发卡已取";
				 }else
				 if(iTermTxStatus==2){
					 strTransResult+="发卡失败";
				 }else if(iTermTxStatus==3){
						 strTransResult+="发卡回收";
				 }else{
					 strTransResult+="发卡未知";
				 }
				 			 

				cardTranslogInfoStr = cardTranslogInfoStr +
													strPan  + "," +
													strCardType + "," +
													strTransResult+ "," +
													tsStr+ "|";
			}
		}
		
//		else{
//			throw new ProcessorException(TERMRETCODE_CARD_TRANSLOG_QUERY,TERMRETDESC_CARD_TRANSLOG_QUERY, TERMRETDESCEN_CARD_TRANSLOG_QUERY);
//		}
		//把发卡信息数据进行分解，以,|进行分割
		//设置成功信息
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cardTranslogInfoStr", cardTranslogInfoStr);
	}
}
