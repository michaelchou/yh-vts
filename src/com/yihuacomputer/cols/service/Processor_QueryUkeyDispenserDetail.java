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
		return "��Ukey��Ϣ��ѯ";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String ukeyTranslogInfoStr ="";//��Ukey��Ϣ
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
					 strTransResult+="δ��UKEY";
				 }else
				  if(iTermTxStatus==1){
					 strTransResult+="��UKEY��ȡ";
				 }else
				 if(iTermTxStatus==2){
					 strTransResult+="��UKEYʧ��";
				 }else if(iTermTxStatus==3){
						 strTransResult+="��UKEY����";
				 }else{
					 strTransResult+="��UKEYδ֪";
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
		//�ѷ�Ukey��Ϣ���ݽ��зֽ⣬��,|���зָ�
		//���óɹ���Ϣ
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "ukeyTranslogInfoStr", ukeyTranslogInfoStr);
	}
}
