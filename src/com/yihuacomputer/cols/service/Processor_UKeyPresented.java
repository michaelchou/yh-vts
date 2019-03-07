package com.yihuacomputer.cols.service;

import org.jdom.Document;

import com.yihuacomputer.cols.database.UKeyTransLogDB;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_UKeyPresented extends Processor
{
    public Processor_UKeyPresented()
    {
	   super();
    }

    /**
     * 服务处理
    */
    public void process() throws ProcessorException
    {
         Document domTemp = XmlHelper.parseStr2Dom(super.strReq);
         int transLogId = MsgXmlDom.getElementValueInt(domTemp,"transLogId", -1);// 交易流水id号,用于更新流水
         int termTxStatus = MsgXmlDom.getElementValueInt(domTemp,"termTxStatus", -1);//终端交易状态
         try{
    	     boolean bSuccess = new UKeyTransLogDB().update4UKeyPresented(transLogId,termTxStatus);
    	     if (bSuccess){
    		     setSucceedRespDom();
    	     }
    	     else{
    		     setSimpleRespDom(TERMRETCODE_INNERR, TERMRETDESC_INNERR,TERMRETDESCEN_INNERR);
    	     }
    	  } catch (Exception e) {
    		 setSimpleRespDom(TERMRETCODE_INNERR, TERMRETDESC_INNERR,TERMRETDESCEN_INNERR);
    	  }
     }
}
