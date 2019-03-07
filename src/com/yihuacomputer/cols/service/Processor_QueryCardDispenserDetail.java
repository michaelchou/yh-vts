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
		return "������Ϣ��ѯ";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String cardTranslogInfoStr ="";//������Ϣ
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
				 
				//strCardType="��ͨ��";
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
					 strTransResult+="δ����";
				 }else
				  if(iTermTxStatus==1){
					 strTransResult+="������ȡ";
				 }else
				 if(iTermTxStatus==2){
					 strTransResult+="����ʧ��";
				 }else if(iTermTxStatus==3){
						 strTransResult+="��������";
				 }else{
					 strTransResult+="����δ֪";
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
		//�ѷ�����Ϣ���ݽ��зֽ⣬��,|���зָ�
		//���óɹ���Ϣ
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cardTranslogInfoStr", cardTranslogInfoStr);
	}
}
