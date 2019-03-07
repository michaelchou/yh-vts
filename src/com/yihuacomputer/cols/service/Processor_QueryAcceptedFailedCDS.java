package com.yihuacomputer.cols.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_QueryAcceptedFailedCDS extends Processor {

	public Processor_QueryAcceptedFailedCDS() {
		super();
	}

    protected String getTransName()
	{
		return "�쳣����浥��Ϣ��ѯ";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String cdsTranslogInfoStr ="";//�浥��Ϣ
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String successfulAcceptedCDS = MsgXmlDom.getElementValue(domReq,"successfulAcceptedCDS");
		CDSTransLogDB  transLogDB = new CDSTransLogDB();
		List<?> list = transLogDB.getAcceptedCDSList(strTerminalNum,successfulAcceptedCDS);
		
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				CDSTransLog entity = (CDSTransLog)list.get(i);
				
				 String strCDSAmt="";//�浥���
				BigDecimal amt=entity.getAmt();
				DecimalFormat df = new DecimalFormat("0.00");
				 String strAmt = df.format(amt);//���׽��

				 DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				 Timestamp ts = entity.getDtOccur();
				 String tsStr = "";//����ʱ��
				 tsStr = sdf.format(ts);

				 String type=entity.getStrCDSType();
				 
				 String transcode="";
				
				 if(entity.getTransCode()==null)
					 continue;
				 
				 if(entity.getTransCode().equals("905107")){
					 strCDSAmt=strAmt;
					 if(type.equals("1"))
						 transcode="�浥����";
					 else if(type.equals("3"))
						 transcode="���濪��";
				 }else if(entity.getTransCode().equals("905104")){
					if(entity.getStrExInfo1()==null||entity.getStrExInfo1().equals(""))
						 strCDSAmt=strAmt;
					else{
						BigDecimal amtCDS=new BigDecimal(entity.getStrExInfo1());
						strCDSAmt = df.format(amtCDS);//�浥���
					}
					 
					 if(type.equals("2"))
						 transcode="�浥����";
					 else if(type.equals("3"))
						 transcode="��������";
				 }else if(entity.getTransCode().equals("905103")){
						if(entity.getStrExInfo1()==null||entity.getStrExInfo1().equals(""))
							 strCDSAmt="";
						else{
							BigDecimal amtCDS=new BigDecimal(entity.getStrExInfo1());
							strCDSAmt = df.format(amtCDS);//�浥���
						}						 
				 }else  continue;
				
				 
				 int iTermTxStatus=entity.getTermTxStatus();
				 int iHostTxStatus=entity.getHostTxStatus();
					
				 String strTransResult="";
					 
				 if(iHostTxStatus==0){
					strTransResult="���׳ɹ�";
				 }else if(iHostTxStatus==1){
					strTransResult="����ʧ��";
				 }else if(iHostTxStatus==2){
					strTransResult="����δ֪";
				 }else if(iHostTxStatus==3){
					strTransResult="����ȡ��";
				 }else if(iHostTxStatus==-1){
					strTransResult="����δ��";
				 }else{
					strTransResult="����δ֪";
				 }
					 
				 if(iTermTxStatus==0){
					 strTransResult+=" ƾ֤δ����";
				 }else if(iTermTxStatus==9){
					 strTransResult+=" ��ƾ֤δ����";
				 }else if(iTermTxStatus==1){
					 strTransResult+=" ƾ֤�ɹ�";
				 }else if(iTermTxStatus==2){
					 strTransResult+=" ƾ֤ʧ��";
				 }else if(iTermTxStatus==3){
					 strTransResult+=" ƾ֤����";
				 }else if(iTermTxStatus==4){
					 strTransResult+=" ƾ֤δ֪";
				 }
				//����	 
			    if(entity.getTransCode().equals("905104")){
			    	//�������������̵��󷢽��ף�����ʧ�ܺ�ƾ֤����
					cdsTranslogInfoStr = cdsTranslogInfoStr +
							  entity.getStrOCRNum()  + "," +
	                          entity.getStrAccountNum() + "," +
	                          transcode+ "," +
	                          strCDSAmt + "," +
	                          strAmt + "," +
		                      tsStr+  "," +
		                      "����ʧ�� ƾ֤����"+"|";	 
			    }else if(entity.getTransCode().equals("905103")){  	//����
			    	//�����쳣�浥������������ʧ�ܡ�����ɹ�ƾ֤�쳣		        	
		        	if(iHostTxStatus !=0){
		        		String strRetCode = entity.getStrHostRetCode();
		        		//����ɹ����䵥ʧ��
		        		if(!strRetCode.equals("") && strRetCode != null && strRetCode.equals("HX00BF")){
		        			int strDrawTotalAmount = Integer.parseInt(new DataConversion().getMoneyToFen(entity.getStrExInfo2()));
							int strDrawAmount = Integer.parseInt(new DataConversion().getMoneyToFen(strAmt));
							String strDrawOpenAmount = String.valueOf(strDrawTotalAmount - strDrawAmount);
							strDrawOpenAmount = new DataConversion().fromFenToYuan(strDrawOpenAmount);
		        			cdsTranslogInfoStr = cdsTranslogInfoStr +
									entity.getStrOCRNum()  + "," +
		                            entity.getStrAccountNum() + "," +
		                            "���Ὺ��"+ "," +
		                            strDrawOpenAmount + "," +
		                            strDrawOpenAmount + "," +
			                        tsStr+  "," +
			                        "����ʧ�� ƾ֤δ����"+"|";			        			
		        		}else{
		        			//���ύ��ʧ��
			        		//������������ƾ֤��
		        			cdsTranslogInfoStr = cdsTranslogInfoStr +
									entity.getStrExInfo3()  + "," +
		                            entity.getStrAccountNum() + "," +
		                            "��������"+ "," +
		                            entity.getStrExInfo2() + "," +
		                            entity.getStrExInfo1() + "," +
			                        tsStr+  "," +
			                        "����ʧ�� ƾ֤����"+"|";	
		        		}	        					        		
		        	}else{
	        			int strDrawTotalAmount = Integer.parseInt(new DataConversion().getMoneyToFen(entity.getStrExInfo2()));
						int strDrawAmount = Integer.parseInt(new DataConversion().getMoneyToFen(strAmt));
						String strDrawOpenAmount = String.valueOf(strDrawTotalAmount - strDrawAmount);
						strDrawOpenAmount = new DataConversion().fromFenToYuan(strDrawOpenAmount);
	        			//���ύ�׳ɹ�������ƾ֤ʧ��
		        		cdsTranslogInfoStr = cdsTranslogInfoStr +
							    entity.getStrOCRNum()  + "," +
	                            entity.getStrAccountNum() + "," +
	                            "���Ὺ��"+ "," +
	                            strDrawOpenAmount + "," +
	                            strDrawOpenAmount + "," +
		                        tsStr+  "," +
		                        strTransResult+"|";	 		
		        	}		        	
		        }else{
					cdsTranslogInfoStr = cdsTranslogInfoStr +
							    entity.getStrOCRNum()  + "," +
	                            entity.getStrAccountNum() + "," +
	                            transcode+ "," +
	                            strCDSAmt + "," +
	                            strAmt + "," +
		                        tsStr+  "," +
		                        strTransResult+"|";	 						 
			    }	
		        
			}
		}
		
		//�Ѵ浥����Ϣ���ݽ��зֽ⣬��,|���зָ�
		//���óɹ���Ϣ
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cdsTranslogInfoStr", cdsTranslogInfoStr);
	}
}
