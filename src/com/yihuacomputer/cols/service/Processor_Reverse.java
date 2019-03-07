package com.yihuacomputer.cols.service;

import java.math.BigDecimal;

import com.yihuacomputer.cols.crypto.Base64;
import com.yihuacomputer.cols.entity.FlushData;
import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_Reverse extends Processor
{
    public Processor_Reverse()
    {
	    super();
    }
    protected String getTransName()
	{
		return "冲正业务处理";
	}
    /**
     * <p>
     * 服务处理
     * </p>
     */
    @SuppressWarnings("static-access")
	public void process() throws ProcessorException
    {
    	//交易处理码
    	String strTransCode = MsgXmlDom.getElementValue(domReq,"strTransCode");
    	//交易金额
    	String strAmount = MsgXmlDom.getElementValue(domReq,"Amount");
    	//交易卡号
    	String strPan = MsgXmlDom.getElementValue(domReq,"strPan");
    	//拓展主账号
    	String strDestPan = MsgXmlDom.getElementValue(domReq,"DestPan");
    	//安全控制信息 06-国际算法 04-国密算法
    	String strEncrypType = MsgXmlDom.getElementValue(domReq,"strEncrypType");
    	//个人标识码数据
    	String strPinBlock = MsgXmlDom.getElementValue(domReq,"strPinBlock");
    	//55域
    	String strField55 = MsgXmlDom.getElementValue(domReq,"strField55");
    	//第二磁道数据
    	String strTrack2 = MsgXmlDom.getElementValue(domReq,"strTrack2");
    	//第三磁道数据
    	String strTrack3 = MsgXmlDom.getElementValue(domReq,"strTrack3");
    	//原始数据元
    	String strOrgTsn = MsgXmlDom.getElementValue(domReq,"orgTsn");
    	//补登折冲正数据
    	String strField57 = MsgXmlDom.getElementValue(domReq,"strField57");
    	//机具编号
    	String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");

    	FlushData entity = new FlushData();
    	entity.setStrTransCode(strTransCode);
    	if(strAmount == null || strAmount.equals("")){
    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
    		entity.setAmount(amt);
		}else{			
			if(!strOrgTsn.equals("") && strOrgTsn !=null && strOrgTsn.length() >9){
				String strTransFlag= strOrgTsn.substring(0,10);
				//圈存交易是以元为单位上送的
				if(strTransFlag.equals("0020902202")){
					BigDecimal amt = new BigDecimal(strAmount); //把交易金额转化成BigDecimal型
					entity.setAmount(amt);
				}else{
					strAmount = new DataConversion().fromFenToYuan(strAmount);//分转换为元
					BigDecimal amt = new BigDecimal(strAmount); //把交易金额转化成BigDecimal型
					entity.setAmount(amt);
				}
			}else{
				BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
	    		entity.setAmount(amt);
			}
		}
    	entity.setStrPan(strPan);
    	entity.setStrDestPan(strDestPan);
    	entity.setStrEncrypType(strEncrypType);
    	entity.setStrPinBlock(new Base64().encode(strPinBlock.getBytes()));
    	entity.setStrTrack2(new Base64().encode(strTrack2.getBytes()));
    	entity.setStrTrack3(new Base64().encode(strTrack3.getBytes()));
    	entity.setStrField55(new Base64().encode(strField55.getBytes()));
    	entity.setStrField57(strField57);
    	entity.setStrTerminalNum(strTerminalNum);
    	entity.setStrOrgTsn(strOrgTsn);
    	entity.setFlushTimes(0);//冲正次数
    	FlushSaveAdapter.getInstance().appendFlushData(entity);
    }
}
