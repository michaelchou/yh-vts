package com.yihuacomputer.cols.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.jdom.Document;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.crypto.Base64;
import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.database.CDSUnitStatusDB;
import com.yihuacomputer.cols.database.CardSettleCycleLogDB;
import com.yihuacomputer.cols.database.CardTransLogDB;
import com.yihuacomputer.cols.database.CardUnitStatusDB;
import com.yihuacomputer.cols.database.UKeySettleCycleLogDB;
import com.yihuacomputer.cols.database.UKeyTransLogDB;
import com.yihuacomputer.cols.database.UKeyUnitStatusDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.entity.CDSUnitStatus;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardTransLog;
import com.yihuacomputer.cols.entity.CardUnitStatus;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyTransLog;
import com.yihuacomputer.cols.entity.UKeyUnitStatus;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_UpdateTermStatus extends Processor
{
	public Logger info = Logger.getLogger("Info");
	public Logger error = Logger.getLogger("Error");
	
    public Processor_UpdateTermStatus()
    {
	   super();
    }

    /**
     * ������
    */
    public void process() throws ProcessorException
    {
        
         String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");//�ն˺�
         String strPan= MsgXmlDom.getElementValue(domReq, "strPan");//�˺�
         String strVouchNo= MsgXmlDom.getElementValue(domReq, "strVouchNo");//ƾ֤����
         int iTransLogId = MsgXmlDom.getElementValueInt(domReq,"iTransLogId", -1);// ������ˮid��,���ڸ�����ˮ
         int iTermTxStatus = MsgXmlDom.getElementValueInt(domReq,"iTermTxStatus", 0);//�ն˽���״̬
         int strTransType = MsgXmlDom.getElementValueInt(domReq,"strTransType", 1);// 1:��2:key 3:�浥
         String strVouchType = MsgXmlDom.getElementValue(domReq,"strVouchType");// ����KEY������Ӧ���ͺ�
         String strTransCode = MsgXmlDom.getElementValue(domReq,"strTransCode");// �������״���
         String strCDSType = MsgXmlDom.getElementValue(domReq,"strCDSType");// �浥���׷��࣬�浥��:1����2����3����4����
         String strIDCardNum=MsgXmlDom.getElementValue(domReq, "strIDCardNum");//���֤��
         String strSingleBusinessNum=MsgXmlDom.getElementValue(domReq, "strSingleBusinessNum");//ҵ���
         
     	info.info("Processor_UpdateTerm:"+"["+strTerminalNum+"]"+"["+strPan+"]"+"["+strVouchNo+"]"+"["+String.valueOf(iTransLogId)+"]"+"["+String.valueOf(iTermTxStatus)+"]"+"["+String.valueOf(strTransType)+"]"+"["+strVouchType+"]"+"["+strTransCode+"]"+"["+strCDSType+"]");
         if(strIDCardNum==null) strIDCardNum="";
         if(strCDSType==null) strCDSType="";
         
         
         
         
         boolean bSuccess=false;
         String strSegment="";	 
         
         CardSettleCycleLog  cardSettleCycleLog =null;
         UKeySettleCycleLog  ukeySettleCycleLog =null;
         CDSSettleCycleLog  cdsSettleCycleLog =null;
         
         CardTransLogDB cardTransLogDB=new CardTransLogDB();
         UKeyTransLogDB uKeyTransLogDB=new UKeyTransLogDB();
         CDSTransLogDB cdsTransLogDB=new CDSTransLogDB();

         
         int termBatchNo=-1;
         
         //ȡ��ǰ��������
         if(strTransType==1){//��
        	   cardSettleCycleLog = new CardSettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
				if(cardSettleCycleLog == null ){
					error.info("cardSettleCycleLog is null");
					return;
				}
				termBatchNo = cardSettleCycleLog.getTermBatchNo();
				System.out.println("termBatchNo = "+termBatchNo);
         }else  if(strTransType==2){//key
        	 ukeySettleCycleLog = new UKeySettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
				if(ukeySettleCycleLog == null ){
					error.info("ukeySettleCycleLog is null");
					return;
				}
				termBatchNo = ukeySettleCycleLog.getTermBatchNo();
         }else  if(strTransType==3){//�浥
        	 cdsSettleCycleLog = new CDSSettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
				if(cdsSettleCycleLog == null ){
					error.info("cdsSettleCycleLog is null");
					return;
				}
				termBatchNo = cdsSettleCycleLog.getTermBatchNo();
         }
         try{
         //�����ն�ƾ֤����״̬���Ӽ�ͳ�����ݣ����ͼ�ر���
         if(iTransLogId!=-1){
        	//����������,�����ն�ƾ֤����״̬���Ӽ�ͳ�����ݣ����ͼ�ر���
             if(strTransType==1){//��
            	   //�����ն�״̬
            	    bSuccess = new CardTransLogDB().update4CardPresented(iTransLogId,iTermTxStatus);
            	   //�Ӽ�ͳ������
//            		System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//        			System.out.println("strVouchType="+strVouchType);
//        			System.out.println("strVouchNo="+strVouchNo);
//        		
        			info.info("strSegment="+strVouchNo.substring(strVouchNo.length()-11, strVouchNo.length()-1));
            	    if(strVouchNo !=null && !strVouchNo.equals("") && strVouchNo.length()>10){
            	     	strSegment = strVouchNo.substring(strVouchNo.length()-11, strVouchNo.length()-1);//�ӵ����ڶ�λ��ʼ��ǰ��ȡ10λ  
            	    	info.info("strSegment ="+strSegment);
            	    	CardUnitStatus cardUnitStatus=new CardUnitStatusDB().getCardUnitStatusBySegment(strTerminalNum, strVouchType,strSegment);
            	    
            	    	if(cardUnitStatus!=null){
            	    	
            	    		switch(iTermTxStatus){
             	    			case 0:
             	    				break;
	             	    		case 1:
	             	    			cardUnitStatus.setCardSuccCount(cardUnitStatus.getCardSuccCount()+1);
	             	    			cardUnitStatus.setCurCount(cardUnitStatus.getCurCount()-1);
	             	    			new CardUnitStatusDB().update(cardUnitStatus);
	            	    			break;
	            	    		case 2:
	            	    			cardUnitStatus.setCardDestroyCount(cardUnitStatus.getCardDestroyCount()+1);
	             	    			cardUnitStatus.setCurCount(cardUnitStatus.getCurCount()-1);	            	    			
	            	    			new CardUnitStatusDB().update(cardUnitStatus);
	            	    			break;
	            	    		case 3:
	            	    			cardUnitStatus.setCardCaptureCount(cardUnitStatus.getCardCaptureCount()+1);
	             	    			cardUnitStatus.setCurCount(cardUnitStatus.getCurCount()-1);	            	    			
	            	    			new CardUnitStatusDB().update(cardUnitStatus);
	            	    			break;
	            	    		default:
	            	    			cardUnitStatus.setCardUnknown(cardUnitStatus.getCardUnknown()+1);
	             	    			cardUnitStatus.setCurCount(cardUnitStatus.getCurCount()-1);	            	    			
	            	    			new CardUnitStatusDB().update(cardUnitStatus);
	            	    			break;
            	    		}
            	    	}
            	    }
            	   if(iTermTxStatus!=0){
            	    		cardSettleCycleLog.setCardSurplusCount(cardSettleCycleLog.getCardSurplusCount()-1);
            	    		 new CardSettleCycleLogDB().update(cardSettleCycleLog);
            	    		  //���ͼ�ر���
         					//�ѿ�����Ϣ���͸����
            	 			List<CardUnitStatus> cardList = new ArrayList<CardUnitStatus>();
            	 			cardList=(List<CardUnitStatus> ) new  CardUnitStatusDB().getCardUnitList(strTerminalNum);
         	       			new LinxViewProxy().sendCardUnitStatusMsg(cardList); 
         					//�ѿ�����Ϣ���͸����
         	       	    ColsTransMsg msg = new ColsTransMsg();
    	       		    msg.put("strTerminalNum", strTerminalNum);
    	       		    msg.put("iTermBatchNo", String.valueOf(termBatchNo));
    	       		    msg.put("dtStart",  new DateCtrl(cardSettleCycleLog.getDtStart()).getDateTimeStrSimpleFull());
    	       		    msg.put("iStatus", String.valueOf(0));
    	       		    msg.put("iCardSurplusCount", String.valueOf(cardSettleCycleLog.getCardSurplusCount()));
    	       		    msg.put("iCardRefillCount", String.valueOf(cardSettleCycleLog.getCardRefillCount()));
        	       		new LinxViewProxy().sendCardSettleCycleLogMsg(msg.toString());            	             	       			
            	   }
            	 
            	   
             }else  if(strTransType==2){//key
            	//�����ն�״̬
            	 bSuccess = new UKeyTransLogDB().update4UKeyPresented(iTransLogId,iTermTxStatus);
          	   //�Ӽ�ͳ������
         	    if(strVouchNo !=null && !strVouchNo.equals("") && strVouchNo.length()>=16){
         	    	strSegment = strVouchNo.substring(7, 15);//9629992 61000004 4  
         	    	info.info("strSegment ="+strSegment);
         	    	UKeyUnitStatus ukeyUnitStatus=new UKeyUnitStatusDB().getUKeyTrackEntity(strTerminalNum, strSegment);
         	    	if(ukeyUnitStatus!=null){
         	    		switch(iTermTxStatus){
          	    				case 0:
          	    					break;
	             	    		case 1:
	             	    			ukeyUnitStatus.setuKeySuccCount(ukeyUnitStatus.getuKeySuccCount()+1);
	             	    			ukeyUnitStatus.setCurCount(ukeyUnitStatus.getCurCount()-1);
	             	    			new UKeyUnitStatusDB().update(ukeyUnitStatus);
	            	    			break;
	            	    		case 2:
	            	    			ukeyUnitStatus.setuKeyDestroyCount(ukeyUnitStatus.getuKeyDestroyCount()+1);
	            	    			ukeyUnitStatus.setCurCount(ukeyUnitStatus.getCurCount()-1);	            	    			
	            	    			new UKeyUnitStatusDB().update(ukeyUnitStatus);
	            	    			break;
	            	    		case 3:
	            	    			ukeyUnitStatus.setuKeyCaptureCount(ukeyUnitStatus.getuKeyCaptureCount()+1);
	            	    			ukeyUnitStatus.setCurCount(ukeyUnitStatus.getCurCount()-1);	            	    			
	            	    			new UKeyUnitStatusDB().update(ukeyUnitStatus);
	            	    			break;
	            	    		default:
	            	    			ukeyUnitStatus.setuKeyUnknown(ukeyUnitStatus.getuKeyUnknown()+1);
	            	    			ukeyUnitStatus.setCurCount(ukeyUnitStatus.getCurCount()-1);	            	    			
	            	    			new UKeyUnitStatusDB().update(ukeyUnitStatus);
	            	    			break;
         	    		}
         	    	}
         	    }
         	   if(iTermTxStatus!=0){
         	    		ukeySettleCycleLog.setuKeySurplusCount(ukeySettleCycleLog.getuKeySurplusCount()-1);
         	    		 new UKeySettleCycleLogDB().update(ukeySettleCycleLog);
         	    		  //���ͼ�ر���
      					//��key����Ϣ���͸����
         	 			List<UKeyUnitStatus> keyList = new ArrayList<UKeyUnitStatus>();
         	 			keyList=(List<UKeyUnitStatus> ) new  UKeyUnitStatusDB().getUKeyUnitList(strTerminalNum);
      	       			new LinxViewProxy().sendUKeyUnitStatusMsg(keyList); 
      					//��key����Ϣ���͸����
      	       	    ColsTransMsg msg = new ColsTransMsg();
 	       		    msg.put("strTerminalNum", strTerminalNum);
 	       		    msg.put("iTermBatchNo", String.valueOf(termBatchNo));
 	       		    msg.put("dtStart",  new DateCtrl(ukeySettleCycleLog.getDtStart()).getDateTimeStrSimpleFull());
 	       		    msg.put("iStatus", String.valueOf(0));
 	       		    msg.put("iUKeySurplusCount", String.valueOf(ukeySettleCycleLog.getuKeySurplusCount()));
 	       		    msg.put("iUKeyRefillCount", String.valueOf(ukeySettleCycleLog.getuKeyRefillCount()));
     	       		new LinxViewProxy().sendUKeySettleCycleLogMsg(msg.toString());            	             	       			
         	   }
         	  
             }else  if(strTransType==3){//�浥
            	//�����ն�״̬
            	 bSuccess = new CDSTransLogDB().update4CDSPresented(iTransLogId,iTermTxStatus);
          	   //�Ӽ�ͳ������
         	    if(strVouchNo !=null && !strVouchNo.equals("") && strVouchNo.length()>= 8){
         	    	strSegment = strVouchNo;//8λ       
         	    	info.info("strSegment ="+strSegment);
         	    	CDSUnitStatus cdsUnitStatus=new CDSUnitStatusDB().getCDSTrackEntity(strTerminalNum,strSegment);
         	    	if(cdsUnitStatus!=null){
         	    		if(!strTransCode.equals("905104"))
         	    		switch(iTermTxStatus){
          	    				case 0:
          	    				case 9:
          	    					break;
          	    				
	             	    		case 1:
		             	    		cdsUnitStatus.setCdsSuccCount(cdsUnitStatus.getCdsSuccCount()+1);
		             	    		cdsUnitStatus.setCurCount(cdsUnitStatus.getCurCount()-1);
		             	    		new CDSUnitStatusDB().update(cdsUnitStatus);
		             	    		break;
	            	    		case 2:
	            	    			cdsUnitStatus.setCdsDestroyCount(cdsUnitStatus.getCdsDestroyCount()+1);
	             	    			cdsUnitStatus.setCurCount(cdsUnitStatus.getCurCount()-1);
	             	    			new CDSUnitStatusDB().update(cdsUnitStatus);
	            	    			break;
	            	    		case 3:
	            	    			cdsUnitStatus.setCdsCaptureCount(cdsUnitStatus.getCdsCaptureCount()+1);
	             	    			cdsUnitStatus.setCurCount(cdsUnitStatus.getCurCount()-1);
	             	    			new CDSUnitStatusDB().update(cdsUnitStatus);
	            	    			break;
	            	    		default:
	            	    			cdsUnitStatus.setCdsUnknown(cdsUnitStatus.getCdsUnknown()+1);
	             	    			cdsUnitStatus.setCurCount(cdsUnitStatus.getCurCount()-1);
	             	    			new CDSUnitStatusDB().update(cdsUnitStatus);
	            	    			break;
         	    		}
         	    	}
         	    }
         	   if(iTermTxStatus!=0&&iTermTxStatus!=9&&	!strTransCode.equals("905104")){
         	    		cdsSettleCycleLog.setCdsSurplusCount(cdsSettleCycleLog.getCdsSurplusCount()-1);
         	    		 new CDSSettleCycleLogDB().update(cdsSettleCycleLog);
         	    		  //���ͼ�ر���
      					//�Ѵ浥����Ϣ���͸����
         	 			List<CDSUnitStatus> cdsList = new ArrayList<CDSUnitStatus>();
         	 			cdsList=(List<CDSUnitStatus>) new  CDSUnitStatusDB().getCDSUnitList(strTerminalNum);
      	       			new LinxViewProxy().sendDepositReceiptStatusMsg(cdsList); 
      					//�Ѵ浥����Ϣ���͸����
      	       	    ColsTransMsg msg = new ColsTransMsg();
 	       		    msg.put("strTerminalNum", strTerminalNum);
 	       		    msg.put("iTermBatchNo", String.valueOf(termBatchNo));
 	       		    msg.put("dtStart",  new DateCtrl(cdsSettleCycleLog.getDtStart()).getDateTimeStrSimpleFull());
 	       		    msg.put("iStatus", String.valueOf(0));
 	       		    msg.put("iDepSurplusCount", String.valueOf(cdsSettleCycleLog.getCdsSurplusCount()));
 	       		    msg.put("iDepRefillCount", String.valueOf(cdsSettleCycleLog.getCdsRefillCount()));
     	       		new LinxViewProxy().sendCDSSettleCycleLogMsg(msg.toString());            	             	       			
         	   }
             }
	      
        }else{
        	//δ��������,�������׼�¼(������Ϣȱʡ���������׽��Ϊ-1δ���ף�ƾ֤�ɼ����Ͻ�)��������״̬���Ӽ�ͳ�����ݣ����ͼ�ر���

            if(strTransType==1){//��
            	//������Ϣȱʡ���������׽��Ϊ-1δ����
				CardTransLog entity = new CardTransLog();
		    	entity.setStrTerminalNum(strTerminalNum);
		    	entity.setTransCode(strTransCode);
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(new DateCtrl().getDateTimeStrSimpleFull()));
		    	entity.setStrPan(strVouchNo);
		    	entity.setStrIDCardNum(new Base64().encode(strIDCardNum.getBytes()));
		    	entity.setStrCardType(strVouchType);
		    	entity.setTermTxStatus(iTermTxStatus);
		    	entity.setHostTxStatus(-1);
		    	entity.setStrHostRetCode("");
		    	entity.setStrHostSerialNo("");
		    	entity.setSettleCycleStatus(0);//���״̬   0��δ��� 1�������
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(new DateCtrl().getDateTimeStrSimpleFull()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setStrSingleBusinessNum(strSingleBusinessNum);
		    	entity.setStrTermSerialNo("");
		    	entity.setStrOrigstrTxSerialNo("");
	
		    	boolean result= new CardTransLogDB().save(entity);
		    	
		    	iTransLogId = entity.getId();

		    
           	   //�Ӽ�ͳ������		    
           	    if(strVouchNo !=null && !strVouchNo.equals("") && strVouchNo.length()> 10){
           	    	strSegment = strVouchNo.substring(strVouchNo.length()-11, strVouchNo.length()-1);//�ӵ����ڶ�λ��ʼ��ǰ��ȡ10λ 
           	    	info.info("strSegment ="+strSegment);
           	    	CardUnitStatus cardUnitStatus=new CardUnitStatusDB().getCardUnitStatusBySegment(strTerminalNum, strVouchType,strSegment);
           	    	if(cardUnitStatus!=null){
           	    		switch(iTermTxStatus){
            	    			case 0:
            	    				break;
	             	    		case 1:
	             	    			cardUnitStatus.setCardSuccCount(cardUnitStatus.getCardSuccCount()+1);
	             	    			cardUnitStatus.setCurCount(cardUnitStatus.getCurCount()-1);
	             	    			new CardUnitStatusDB().update(cardUnitStatus);
	            	    			break;
	            	    		case 2:
	            	    			cardUnitStatus.setCardDestroyCount(cardUnitStatus.getCardDestroyCount()+1);
	             	    			cardUnitStatus.setCurCount(cardUnitStatus.getCurCount()-1);	            	    			
	            	    			new CardUnitStatusDB().update(cardUnitStatus);
	            	    			break;
	            	    		case 3:
	            	    			cardUnitStatus.setCardCaptureCount(cardUnitStatus.getCardCaptureCount()+1);
	             	    			cardUnitStatus.setCurCount(cardUnitStatus.getCurCount()-1);	            	    			
	            	    			new CardUnitStatusDB().update(cardUnitStatus);
	            	    			break;
	            	    		default:
	            	    			cardUnitStatus.setCardUnknown(cardUnitStatus.getCardUnknown()+1);
	             	    			cardUnitStatus.setCurCount(cardUnitStatus.getCurCount()-1);	            	    			
	            	    			new CardUnitStatusDB().update(cardUnitStatus);
	            	    			break;
           	    		}
           	    	}
           	    }
           	   if(iTermTxStatus!=0){
           	    		cardSettleCycleLog.setCardSurplusCount(cardSettleCycleLog.getCardSurplusCount()-1);
           	    		 new CardSettleCycleLogDB().update(cardSettleCycleLog);
           	    		  //���ͼ�ر���
        					//�ѿ�����Ϣ���͸����
           	 			List<CardUnitStatus> cardList = new ArrayList<CardUnitStatus>();
           	 			cardList=(List<CardUnitStatus> ) new  CardUnitStatusDB().getCardUnitList(strTerminalNum);
        	       			new LinxViewProxy().sendCardUnitStatusMsg(cardList); 
        					//�ѿ�����Ϣ���͸����
        	       	    ColsTransMsg msg = new ColsTransMsg();
   	       		    msg.put("strTerminalNum", strTerminalNum);
   	       		    msg.put("iTermBatchNo", String.valueOf(termBatchNo));
   	       		    msg.put("dtStart",  new DateCtrl(cardSettleCycleLog.getDtStart()).getDateTimeStrSimpleFull());
   	       		    msg.put("iStatus", String.valueOf(0));
   	       		    msg.put("iCardSurplusCount", String.valueOf(cardSettleCycleLog.getCardSurplusCount()));
   	       		    msg.put("iCardRefillCount", String.valueOf(cardSettleCycleLog.getCardRefillCount()));
       	       		new LinxViewProxy().sendCardSettleCycleLogMsg(msg.toString());            	             	       			
           	   }
           	 
           	   
            }else  if(strTransType==2){//key
            	UKeyTransLog entity = new UKeyTransLog();
		    	entity.setStrTerminalNum(strTerminalNum);
		    	entity.setTransCode(strTransCode);
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(new DateCtrl().getDateTimeStrSimpleFull()));
		    	entity.setStrUKeyNum(strVouchNo);

		     	entity.setStrBindCardNum(strPan);
		    	entity.setStrIDCardNum(new Base64().encode(strIDCardNum.getBytes()));
		    	entity.setStrUKeyType(strVouchType);
		    	entity.setTermTxStatus(iTermTxStatus);
		    	entity.setHostTxStatus(-1);
		    	entity.setStrHostRetCode("");
		    	entity.setStrHostSerialNo("");
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(new DateCtrl().getDateTimeStrSimpleFull()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//���״̬   0��δ��� 1�������
		    	entity.setStrTermSerialNo("");
		    	entity.setStrOrigstrTxSerialNo("");
		    	entity.setStrSingleBusinessNum(strSingleBusinessNum);
		    	entity.setStrExInfo1(strCDSType);
		    	boolean result=new UKeyTransLogDB().save(entity);
		    	iTransLogId = entity.getId();
		
         	   //�Ӽ�ͳ������
        	    if(strVouchNo !=null && !strVouchNo.equals("") && strVouchNo.length()>=16){
        	    	strSegment = strVouchNo.substring(7, 15);//9629992 61000004 4  
        	    	info.info("strSegment ="+strSegment);
        	    	UKeyUnitStatus ukeyUnitStatus=new UKeyUnitStatusDB().getUKeyTrackEntity(strTerminalNum, strSegment);
        	    	if(ukeyUnitStatus!=null){
        	    		switch(iTermTxStatus){
         	    				case 0:
         	    					break;
	             	    		case 1:
	             	    			ukeyUnitStatus.setuKeySuccCount(ukeyUnitStatus.getuKeySuccCount()+1);
	             	    			ukeyUnitStatus.setCurCount(ukeyUnitStatus.getCurCount()-1);
	             	    			new UKeyUnitStatusDB().update(ukeyUnitStatus);
	            	    			break;
	            	    		case 2:
	            	    			ukeyUnitStatus.setuKeyDestroyCount(ukeyUnitStatus.getuKeyDestroyCount()+1);
	            	    			ukeyUnitStatus.setCurCount(ukeyUnitStatus.getCurCount()-1);	            	    			
	            	    			new UKeyUnitStatusDB().update(ukeyUnitStatus);
	            	    			break;
	            	    		case 3:
	            	    			ukeyUnitStatus.setuKeyCaptureCount(ukeyUnitStatus.getuKeyCaptureCount()+1);
	            	    			ukeyUnitStatus.setCurCount(ukeyUnitStatus.getCurCount()-1);	            	    			
	            	    			new UKeyUnitStatusDB().update(ukeyUnitStatus);
	            	    			break;
	            	    		default:
	            	    			ukeyUnitStatus.setuKeyUnknown(ukeyUnitStatus.getuKeyUnknown()+1);
	            	    			ukeyUnitStatus.setCurCount(ukeyUnitStatus.getCurCount()-1);	            	    			
	            	    			new UKeyUnitStatusDB().update(ukeyUnitStatus);
	            	    			break;
        	    		}
        	    	}
        	    }
        	   if(iTermTxStatus!=0){
        	    		ukeySettleCycleLog.setuKeySurplusCount(ukeySettleCycleLog.getuKeySurplusCount()-1);
        	    		 new UKeySettleCycleLogDB().update(ukeySettleCycleLog);
        	    		  //���ͼ�ر���
     					//��key����Ϣ���͸����
        	 			List<UKeyUnitStatus> keyList = new ArrayList<UKeyUnitStatus>();
        	 			keyList=(List<UKeyUnitStatus> ) new  UKeyUnitStatusDB().getUKeyUnitList(strTerminalNum);
     	       			new LinxViewProxy().sendUKeyUnitStatusMsg(keyList); 
     					//��key����Ϣ���͸����
     	       	    ColsTransMsg msg = new ColsTransMsg();
	       		    msg.put("strTerminalNum", strTerminalNum);
	       		    msg.put("iTermBatchNo", String.valueOf(termBatchNo));
	       		    msg.put("dtStart",  new DateCtrl(ukeySettleCycleLog.getDtStart()).getDateTimeStrSimpleFull());
	       		    msg.put("iStatus", String.valueOf(0));
	       		    msg.put("iUKeySurplusCount", String.valueOf(ukeySettleCycleLog.getuKeySurplusCount()));
	       		    msg.put("iUKeyRefillCount", String.valueOf(ukeySettleCycleLog.getuKeyRefillCount()));
    	       		new LinxViewProxy().sendUKeySettleCycleLogMsg(msg.toString());            	             	       			
        	   }
        	  
            }else  if(strTransType==3){//�浥
            	CDSTransLog entity = new CDSTransLog();
		    	entity.setStrTerminalNum(strTerminalNum);
		    	entity.setTransCode(strTransCode);
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(new DateCtrl().getDateTimeStrSimpleFull()));
		    	entity.setStrOCRNum(strVouchNo);

		     	entity.setStrAccountNum(strPan);
		    	entity.setStrIDCardNum(new Base64().encode(strIDCardNum.getBytes()));
		    	entity.setStrCDSType(strCDSType);
		    	entity.setTermTxStatus(iTermTxStatus);
		    	entity.setHostTxStatus(-1);
		    	entity.setStrAccMode("3504");
		    	entity.setStrHostRetCode("");
		    	entity.setStrHostSerialNo("");
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(new DateCtrl().getDateTimeStrSimpleFull()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//���״̬   0��δ��� 1�������
		    	entity.setStrTermSerialNo("");
		    	entity.setStrOrigstrTxSerialNo("");
		    	entity.setStrRate("");
		    	entity.setStrInterest("");
		    	entity.setStrTimeLimit("");
		    	BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
	    		entity.setAmt(amt);
	    		entity.setFee(amt);
		    	entity.setStrSingleBusinessNum(strSingleBusinessNum);
		    	entity.setStrExInfo1("");
		    	entity.setStrExInfo2("");
		    	entity.setStrExInfo3("");
		    	entity.setStrExInfo4("");
		    	entity.setStrExInfo5("");
		    	boolean result=new CDSTransLogDB().save(entity);
		    	iTransLogId = entity.getId();

          	   //�Ӽ�ͳ������
        	    if(strVouchNo !=null && !strVouchNo.equals("") && strVouchNo.length()>= 8){
        	    	strSegment = strVouchNo;//8λ      
        	    	info.info("strSegment ="+strSegment);
        	    	CDSUnitStatus cdsUnitStatus=new CDSUnitStatusDB().getCDSTrackEntity(strTerminalNum,strSegment);
        	    	if(cdsUnitStatus!=null){
        	    		if(!strTransCode.equals("905104"))
        	    		switch(iTermTxStatus){
         	    				case 0:
         	    				case 9:
         	    					break;
	             	    		case 1:
	             	    			cdsUnitStatus.setCdsSuccCount(cdsUnitStatus.getCdsSuccCount()+1);
	             	    			cdsUnitStatus.setCurCount(cdsUnitStatus.getCurCount()-1);
	             	    			new CDSUnitStatusDB().update(cdsUnitStatus);
	            	    			break;
	            	    		case 2:
	            	    			cdsUnitStatus.setCdsDestroyCount(cdsUnitStatus.getCdsDestroyCount()+1);
	             	    			cdsUnitStatus.setCurCount(cdsUnitStatus.getCurCount()-1);
	             	    			new CDSUnitStatusDB().update(cdsUnitStatus);
	            	    			break;
	            	    		case 3:
	            	    			cdsUnitStatus.setCdsCaptureCount(cdsUnitStatus.getCdsCaptureCount()+1);
	             	    			cdsUnitStatus.setCurCount(cdsUnitStatus.getCurCount()-1);
	             	    			new CDSUnitStatusDB().update(cdsUnitStatus);
	            	    			break;
	            	    		default:
	            	    			cdsUnitStatus.setCdsUnknown(cdsUnitStatus.getCdsUnknown()+1);
	             	    			cdsUnitStatus.setCurCount(cdsUnitStatus.getCurCount()-1);
	             	    			new CDSUnitStatusDB().update(cdsUnitStatus);
	            	    			break;
        	    		}
        	    	}
        	    }
        	   if(iTermTxStatus!=0&&iTermTxStatus!=9&&	!strTransCode.equals("905104")){
        	    		cdsSettleCycleLog.setCdsSurplusCount(cdsSettleCycleLog.getCdsSurplusCount()-1);
        	    		 new CDSSettleCycleLogDB().update(cdsSettleCycleLog);
        	    		  //���ͼ�ر���
     					//�Ѵ浥����Ϣ���͸����
        	 			List<CDSUnitStatus> cdsList = new ArrayList<CDSUnitStatus>();
        	 			cdsList=(List<CDSUnitStatus>) new  CDSUnitStatusDB().getCDSUnitList(strTerminalNum);
     	       			new LinxViewProxy().sendDepositReceiptStatusMsg(cdsList); 
     					//�Ѵ浥����Ϣ���͸����
     	       	    ColsTransMsg msg = new ColsTransMsg();
	       		    msg.put("strTerminalNum", strTerminalNum);
	       		    msg.put("iTermBatchNo", String.valueOf(termBatchNo));
	       		    msg.put("dtStart",  new DateCtrl(cdsSettleCycleLog.getDtStart()).getDateTimeStrSimpleFull());
	       		    msg.put("iStatus", String.valueOf(0));
	       		    msg.put("iDepSurplusCount", String.valueOf(cdsSettleCycleLog.getCdsSurplusCount()));
	       		    msg.put("iDepRefillCount", String.valueOf(cdsSettleCycleLog.getCdsRefillCount()));
    	       		new LinxViewProxy().sendCDSSettleCycleLogMsg(msg.toString());            	             	       			
        	   }
            }
	      
        }
         
       

    	  } catch (Exception e) {
    		  e.printStackTrace();
    		 setSimpleRespDom(TERMRETCODE_INNERR, TERMRETDESC_INNERR,TERMRETDESCEN_INNERR);
    	  }
		     setSucceedRespDom();
    }
}
