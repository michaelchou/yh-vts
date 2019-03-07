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
		return "银行卡校验";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	@SuppressWarnings("rawtypes")
	public void process() throws ProcessorException {
		int ret = -1;//是否本行卡标识
		String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
		//从配置文件中取出所有的卡bin以及卡类型
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
			throw new ProcessorException(TERMRETCODE_INNERR,"获取卡类型失败", "Check Card Error");
		}
		else{
           for(int i=0;i < cardList.size(); i++){
        	  CardTypeService entity = (CardTypeService) cardList.get(i);
              String strCardFlag = entity.getStrCardFlag();
              if(strTrack2.substring(0, 6).equals(strCardFlag)){//本行卡
            	  MsgXmlDom.setElementValue(domResp, "strCardType",entity.getStrCardType());//取出卡类型
            	  ret = 0;
            	  break;
              }
           }
		}
		if(ret != 0){
			super.setSimpleRespDom(TERMRETCODE_INVALIDREQUEST, TERMRETDESC_INVALIDCARD, TERMRETDESCEN_INVALIDCARD);
		    return;
		}
		// 设置成功信息
		setSucceedRespDom();
	}

    //获取卡类型
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<String> getCardTypes(String fileName) throws Exception{
		String strCardType ="";//卡类类型
		String strCardFlag ="";//卡bin标识
		File file = new File(fileName);
		BufferedReader br = new BufferedReader(new FileReader(file));//构造一个BufferedReader类来读取文件
		List list = new ArrayList();//用于存放读取出来的属性值
		String s = null;
		while((s = br.readLine())!=null){//使用readLine方法，一次读一行
			if(s.indexOf("CardType") != -1){
				strCardType = s.split("=")[1];  //分割字符串取=号右边的值
			}
			if(s.indexOf("VerifyStrVal") != -1){  //判断正在读取的这一行是否存在VerifyStrVal属性
				String VerifyStrVal = s.split("=")[1];  //分割字符串取=号右边的值
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
