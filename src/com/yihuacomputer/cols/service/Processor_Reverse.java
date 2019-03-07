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
		return "����ҵ����";
	}
    /**
     * <p>
     * ������
     * </p>
     */
    @SuppressWarnings("static-access")
	public void process() throws ProcessorException
    {
    	//���״�����
    	String strTransCode = MsgXmlDom.getElementValue(domReq,"strTransCode");
    	//���׽��
    	String strAmount = MsgXmlDom.getElementValue(domReq,"Amount");
    	//���׿���
    	String strPan = MsgXmlDom.getElementValue(domReq,"strPan");
    	//��չ���˺�
    	String strDestPan = MsgXmlDom.getElementValue(domReq,"DestPan");
    	//��ȫ������Ϣ 06-�����㷨 04-�����㷨
    	String strEncrypType = MsgXmlDom.getElementValue(domReq,"strEncrypType");
    	//���˱�ʶ������
    	String strPinBlock = MsgXmlDom.getElementValue(domReq,"strPinBlock");
    	//55��
    	String strField55 = MsgXmlDom.getElementValue(domReq,"strField55");
    	//�ڶ��ŵ�����
    	String strTrack2 = MsgXmlDom.getElementValue(domReq,"strTrack2");
    	//�����ŵ�����
    	String strTrack3 = MsgXmlDom.getElementValue(domReq,"strTrack3");
    	//ԭʼ����Ԫ
    	String strOrgTsn = MsgXmlDom.getElementValue(domReq,"orgTsn");
    	//�����۳�������
    	String strField57 = MsgXmlDom.getElementValue(domReq,"strField57");
    	//���߱��
    	String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");

    	FlushData entity = new FlushData();
    	entity.setStrTransCode(strTransCode);
    	if(strAmount == null || strAmount.equals("")){
    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
    		entity.setAmount(amt);
		}else{			
			if(!strOrgTsn.equals("") && strOrgTsn !=null && strOrgTsn.length() >9){
				String strTransFlag= strOrgTsn.substring(0,10);
				//Ȧ�潻������ԪΪ��λ���͵�
				if(strTransFlag.equals("0020902202")){
					BigDecimal amt = new BigDecimal(strAmount); //�ѽ��׽��ת����BigDecimal��
					entity.setAmount(amt);
				}else{
					strAmount = new DataConversion().fromFenToYuan(strAmount);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strAmount); //�ѽ��׽��ת����BigDecimal��
					entity.setAmount(amt);
				}
			}else{
				BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
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
    	entity.setFlushTimes(0);//��������
    	FlushSaveAdapter.getInstance().appendFlushData(entity);
    }
}
