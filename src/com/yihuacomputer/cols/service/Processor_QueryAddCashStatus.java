package com.yihuacomputer.cols.service;

import java.math.BigDecimal;

import com.yihuacomputer.cols.database.SettleCycleLogDB;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

/**
 * �ӳ�ǰδ�����¼��ѯ
 * @author Administrator
 *
 */
public class Processor_QueryAddCashStatus extends Processor {

	public Processor_QueryAddCashStatus() {
		super();
	}

    protected String getTransName()
	{
		return "�ӳ�ǰδ�����¼��ѯ";
	}

	@Override
	protected void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strTransType = MsgXmlDom.getElementValue(domReq,"strTransType");//addCash:�ӳ�    clearCash�����
		SettleCycleLogDB settleCycleLogDB = new SettleCycleLogDB();
		SettleCycleLog settleCycleLog = settleCycleLogDB.getEntityByTermianl(strTerminalNum);

		if("addCash".equals(strTransType)){//�ӳ�ǰ��ѯ
			if(settleCycleLog != null){
				throw new ProcessorException(TERMRETCODE_NOCLEANCASH,TERMRETDESC_NOCLEANCASH, TERMRETDESCEN_NOCLEANCASH);
			}
		}else if("deposit".equals(strTransType)) {//���ǰ��ѯ
			if(settleCycleLog == null) {
				try{
					boolean result = settleCycleLogDB.addCash(strTerminalNum, new BigDecimal(0));
					if(result){
		       			//new LinxViewProxy();
					}else{
						throw new ProcessorException(TERMRETCODE_NOADDCASH,TERMRETDESC_NOADDCASH, TERMRETDESCEN_NOADDCASH);
					}
				}catch(Exception e){
					throw new ProcessorException(TERMRETCODE_NOADDCASH,TERMRETDESC_NOADDCASH, TERMRETDESCEN_NOADDCASH);
				}
			}
		}else {//���ǰ��ѯ
			if(settleCycleLog == null){
				throw new ProcessorException(TERMRETCODE_NOADDCASH,TERMRETDESC_NOADDCASH, TERMRETDESCEN_NOADDCASH);
			}else{
				MsgXmlDom.setElementValue(domResp, "addCashRecord",settleCycleLog.toString());
			}
		}
		//���óɹ���Ϣ
		setSucceedRespDom();

	}

}
