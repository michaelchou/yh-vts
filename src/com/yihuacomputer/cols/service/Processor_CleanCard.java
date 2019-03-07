package com.yihuacomputer.cols.service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.CardSettleCycleLogDB;
import com.yihuacomputer.cols.database.CardTransLogDB;
import com.yihuacomputer.cols.database.ExpLogDB;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardTransLog;
import com.yihuacomputer.cols.entity.ExpLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CleanCard extends Processor {

	public Processor_CleanCard() {
		super();
	}

    protected String getTransName()
	{
		return "�忨";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CardSettleCycleLogDB cardSettleCycleLogDB = new CardSettleCycleLogDB();
		CardSettleCycleLog  entity = cardSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ�忨״̬
		if(entity != null){
			entity.setStatus(1);//��Ϊ�����״̬
			entity.setDtEnd(new DateCtrl().getTimestamp());//�����ν���ʱ��
			boolean ret = cardSettleCycleLogDB.update(entity);
			if(!ret){
				throw new ProcessorException(TERMRETCODE_CLEANCARD,TERMRETDESC_CLEANCARD, TERMRETDESCEN_CLEANCARD);
			}
			//�޸���ˮ���忨״̬
			CardTransLog bean = new CardTransLog();
			bean.setSettleCycleStatus(1);
			bean.setStrTerminalNum(strTerminalNum);
			new CardTransLogDB().updateStatus(bean);
			//���忨������Ϣ���͸����
   		    ColsTransMsg msg = new ColsTransMsg();
   		    msg.put("strTerminalNum", strTerminalNum);
   		    msg.put("iTermBatchNo", String.valueOf(entity.getTermBatchNo()));
   		    msg.put("dtStart",  new DateCtrl(entity.getDtStart()).getDateTimeStrSimpleFull());
   		    msg.put("dtEnd", new DateCtrl(entity.getDtEnd()).getDateTimeStrSimpleFull());
   		    msg.put("iStatus", String.valueOf(1));
   		    msg.put("iCardSurplusCount", String.valueOf(entity.getCardSurplusCount()));
   		    msg.put("iCardRefillCount", String.valueOf(entity.getCardRefillCount()));
   		    System.out.println(msg.toString());
   		    new LinxViewProxy().sendCardSettleCycleLogMsg_Clean(msg.toString());
		}else
			throw new ProcessorException(TERMRETCODE_CLEANCARD_NORECORD,TERMRETDESC_CLEANCARD_NORECORD, TERMRETDESCEN_CLEANCARD_NORECORD);



		String cardExplogInfoArr="";//���������̿���ϸ��Ϣ
		//�������ڿ�������ϸ��Ϣ
		ExpLogDB  expLogDB = new ExpLogDB();
		List<?> list = expLogDB.getCardList(strTerminalNum);
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				ExpLog expEntity = (ExpLog)list.get(i);

				String strPan=expEntity.getStrPan();
				if(strPan==null) strPan="";
				String strExpCode=expEntity.getStrExpCode();
				if(strExpCode==null) strExpCode="";
				String strMemo=expEntity.getStrMemo();
				if(strMemo==null) strMemo="";
				 DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				 Timestamp ts = expEntity.getDtOccur();
				 String tsStr = "";
				 tsStr = sdf.format(ts);

				 cardExplogInfoArr = cardExplogInfoArr +
						 strPan + "," +
						 strExpCode + "," +
						 strMemo+ "," +
						 tsStr+ "|";

			}

			 //ɾ���̿���ϸ
			expLogDB.removeCardExpLog(strTerminalNum);
		}
		//�̿���ϸ
		MsgXmlDom.setElementValue(domResp, "cardExplogInfoStr", cardExplogInfoArr);
		//���óɹ���Ϣ
		setSucceedRespDom();
	}
}
