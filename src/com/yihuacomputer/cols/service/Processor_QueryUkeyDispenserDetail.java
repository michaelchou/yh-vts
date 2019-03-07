package com.yihuacomputer.cols.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.database.UKeyTransLogDB;
import com.yihuacomputer.cols.database.UKeyTransLogDB;
import com.yihuacomputer.cols.entity.CardTransLog;
import com.yihuacomputer.cols.entity.Misc;
import com.yihuacomputer.cols.entity.UKeyTransLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_QueryUkeyDispenserDetail extends Processor {

	public Processor_QueryUkeyDispenserDetail() {
		super();
	}

    protected String getTransName()
	{
		return "发Ukey信息查询";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String ukeyTranslogInfoStr ="";//发Ukey信息
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		UKeyTransLogDB  transLogDB = new UKeyTransLogDB();
		List<?> list = transLogDB.getBatchList(strTerminalNum);
		MiscDB   db= new MiscDB();	    
    	List<?> miscList=db.getList("00001", "strUkeyType");
    	
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				UKeyTransLog entity = (UKeyTransLog)list.get(i);
				String strPan=entity.getStrUKeyNum();
			
				String strUkeyType=entity.getStrUKeyType();
				int iTermTxStatus=entity.getTermTxStatus();
				int iHostTxStatus=entity.getHostTxStatus();
				
			     if(entity.getTransCode()==null)
					 continue;
			     
				 if(!entity.getTransCode().equals("908201")){
					continue;
				 }
			

				//strUkeyType="";
				if(miscList != null && miscList.size() > 0){
			    	for(int m=0;m<miscList.size();m++){
			    		Misc misc = (Misc)miscList.get(m);
			    		if(strUkeyType.equals(misc.getStrValue())){
			    			strUkeyType=misc.getStrDesc();
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
					 strTransResult+="未发UKEY";
				 }else
				  if(iTermTxStatus==1){
					 strTransResult+="发UKEY已取";
				 }else
				 if(iTermTxStatus==2){
					 strTransResult+="发UKEY失败";
				 }else if(iTermTxStatus==3){
						 strTransResult+="发UKEY回收";
				 }else{
					 strTransResult+="发UKEY未知";
				 }
				 			 

				 ukeyTranslogInfoStr = ukeyTranslogInfoStr +
													strPan  + "," +
													strUkeyType + "," +
													strTransResult+ "," +
													tsStr+ "|";
			}
		}
		
//		else{
//			throw new ProcessorException(TERMRETCODE_UKEY_TRANSLOG_QUERY,TERMRETDESC_UKEY_TRANSLOG_QUERY, TERMRETDESCEN_UKEY_TRANSLOG_QUERY);
//		}
		//把发Ukey信息数据进行分解，以,|进行分割
		//设置成功信息
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "ukeyTranslogInfoStr", ukeyTranslogInfoStr);
	}
}
