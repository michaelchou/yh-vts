package com.yihuacomputer.cols.service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.database.ExpLogDB;
import com.yihuacomputer.cols.database.CardUnitStatusDB;
import com.yihuacomputer.cols.entity.ExpLog;
import com.yihuacomputer.cols.entity.CardUnitStatus;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_ListCardExpLog extends Processor {

	public Processor_ListCardExpLog() {
		super();
	}

    protected String getTransName()
	{
		return "�̿���ϸ��Ϣ��ѯ";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
	
		String cardExplogInfoArr="";//���������̿���ϸ��Ϣ
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
	
		//�������ڿ�������ϸ��Ϣ
		ExpLogDB  expLogDB = new ExpLogDB();
		List<?> list = expLogDB.getCardList(strTerminalNum);
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				ExpLog entity = (ExpLog)list.get(i);
				
				String strPan=entity.getStrPan();
				if(strPan==null) strPan="";
				String strExpCode=entity.getStrExpCode();
				if(strExpCode==null) strExpCode="";
				String strMemo=entity.getStrMemo();
				if(strMemo==null) strMemo="";
				 DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				 Timestamp ts = entity.getDtOccur();
				 String tsStr = "";
				 tsStr = sdf.format(ts);
				 
				 cardExplogInfoArr = cardExplogInfoArr +
						 strPan + "," +
						 strExpCode + "," +
						 strMemo+ "," +
						 tsStr+ "|";
				
			}
			 System.out.println("1111111111111");
			 System.out.println(cardExplogInfoArr);
		}

	
		//���óɹ���Ϣ
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cardExplogInfoStr", cardExplogInfoArr);
	}
}
