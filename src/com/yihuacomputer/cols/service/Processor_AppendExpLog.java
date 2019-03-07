package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.ExpLogDB;
import com.yihuacomputer.cols.entity.ExpLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;


public class Processor_AppendExpLog extends Processor
{
    public Processor_AppendExpLog()
    {
	   super();
    }

    protected String getTransName()
	{
		return "异常信息处理";
	}

    /**
     * 服务处理
    */
    public void process() throws ProcessorException
    {
    	String strTerminalNum = MsgXmlDom.getElementValue(super.domReq, "strTerminalNum");
	    String strPan = MsgXmlDom.getElementValue(super.domReq, "strPan");
	    String strExpCode = MsgXmlDom.getElementValue(super.domReq, "strExpCode");
	    String strMemo = MsgXmlDom.getElementValue(super.domReq, "strMemo");
	    String dtDate = dtCur.getDateTimeStrSimpleFull();
	    ExpLog entity = new ExpLog();
	    entity.setStrTerminalNum(strTerminalNum);
	    entity.setStrPan(strPan);
	    entity.setStrExpCode(strExpCode);
	    entity.setStrMemo(strMemo);
	    entity.setDtOccur(new DateCtrl().getStrToTimestamp(dtDate));
	    if (!new ExpLogDB().save(entity)) {
	    	throw new ProcessorException(TERMRETCODE_INNERR, TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
	    }
	    else{
	       setSucceedRespDom();
	    }
	    //把异常信息发送给监控
	    ColsTransMsg msg = new ColsTransMsg();
	    msg.put("strTerminalNum", strTerminalNum);
	    msg.put("strExpCode", strExpCode);
	    msg.put("strPan", strPan);
	    msg.put("dtOccur", dtDate);
	    msg.put("strMemo", strMemo);
	    new LinxViewProxy().sendExplogMsg(msg.toString());
    }
}
