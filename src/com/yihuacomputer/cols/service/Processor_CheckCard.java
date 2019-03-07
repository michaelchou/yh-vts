package com.yihuacomputer.cols.service;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import com.yihuacomputer.cols.entity.CardTypeService;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CheckCard extends Processor {

	public Processor_CheckCard() {
		super();
	}

    protected String getTransName()
	{
		return "���п�У��";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 */
	@SuppressWarnings("rawtypes")
	public void process() throws ProcessorException {
		int ret = -1;//�Ƿ��п���ʶ
		String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//��ȡ����·��
		//�������ļ���ȡ�����еĿ�bin�Լ�������
		List cardList =  new ArrayList();
		try {
			cardList = getCardTypes(File.separator + path + "InterVerify.ini");
		} catch (Exception e) {
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
		String strTrack2 = MsgXmlDom.getElementValue(domReq,"strTrack2");
		String strTrack3 = MsgXmlDom.getElementValue(domReq,"strTrack3");
		if(strTrack2 == null || strTrack2.equals("")){
			strTrack2 = strTrack3;
		}
		if(cardList == null || cardList.size() == 0){
			throw new ProcessorException(TERMRETCODE_INNERR,"��ȡ������ʧ��", "Check Card Error");
		}
		else{
           for(int i=0;i < cardList.size(); i++){
        	  CardTypeService entity = (CardTypeService) cardList.get(i);
              String strCardFlag = entity.getStrCardFlag();
              if(strTrack2.substring(0, 6).equals(strCardFlag)){//���п�
            	  MsgXmlDom.setElementValue(domResp, "strCardType",entity.getStrCardType());//ȡ��������
            	  ret = 0;
            	  break;
              }
           }
		}
		if(ret != 0){
			super.setSimpleRespDom(TERMRETCODE_INVALIDREQUEST, TERMRETDESC_INVALIDCARD, TERMRETDESCEN_INVALIDCARD);
		    return;
		}
		// ���óɹ���Ϣ
		setSucceedRespDom();
	}

    //��ȡ������
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<String> getCardTypes(String fileName) throws Exception{
		String strCardType ="";//��������
		String strCardFlag ="";//��bin��ʶ
		File file = new File(fileName);
		BufferedReader br = new BufferedReader(new FileReader(file));//����һ��BufferedReader������ȡ�ļ�
		List list = new ArrayList();//���ڴ�Ŷ�ȡ����������ֵ
		String s = null;
		while((s = br.readLine())!=null){//ʹ��readLine������һ�ζ�һ��
			if(s.indexOf("CardType") != -1){
				strCardType = s.split("=")[1];  //�ָ��ַ���ȡ=���ұߵ�ֵ
			}
			if(s.indexOf("VerifyStrVal") != -1){  //�ж����ڶ�ȡ����һ���Ƿ����VerifyStrVal����
				String VerifyStrVal = s.split("=")[1];  //�ָ��ַ���ȡ=���ұߵ�ֵ
				strCardFlag = VerifyStrVal.replace(" ","");
				CardTypeService  card =  new CardTypeService ();
				card.setStrCardFlag(strCardFlag);
				card.setStrCardType(strCardType);
				list.add(card);
			}
		}
		br.close();
		return list;
	}
}
