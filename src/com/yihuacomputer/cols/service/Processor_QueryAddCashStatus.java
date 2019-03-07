package com.yihuacomputer.cols.service;

import java.math.BigDecimal;

import com.yihuacomputer.cols.database.SettleCycleLogDB;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

/**
 * 加钞前未清机记录查询
 * @author Administrator
 *
 */
public class Processor_QueryAddCashStatus extends Processor {

	public Processor_QueryAddCashStatus() {
		super();
	}

    protected String getTransName()
	{
		return "加钞前未清机记录查询";
	}

	@Override
	protected void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strTransType = MsgXmlDom.getElementValue(domReq,"strTransType");//addCash:加钞    clearCash：清机
		SettleCycleLogDB settleCycleLogDB = new SettleCycleLogDB();
		SettleCycleLog settleCycleLog = settleCycleLogDB.getEntityByTermianl(strTerminalNum);

		if("addCash".equals(strTransType)){//加钞前查询
			if(settleCycleLog != null){
				throw new ProcessorException(TERMRETCODE_NOCLEANCASH,TERMRETDESC_NOCLEANCASH, TERMRETDESCEN_NOCLEANCASH);
			}
		}else if("deposit".equals(strTransType)) {//存款前查询
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
		}else {//清机前查询
			if(settleCycleLog == null){
				throw new ProcessorException(TERMRETCODE_NOADDCASH,TERMRETDESC_NOADDCASH, TERMRETDESCEN_NOADDCASH);
			}else{
				MsgXmlDom.setElementValue(domResp, "addCashRecord",settleCycleLog.toString());
			}
		}
		//设置成功信息
		setSucceedRespDom();

	}

}
