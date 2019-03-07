package com.yihuacomputer.cols.service;

import java.util.List;

import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.database.CDSUnitStatusDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.entity.CDSUnitStatus;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CDSUnitQueryCycle extends Processor {

	public Processor_CDSUnitQueryCycle() {
		super();
	}

    protected String getTransName()
	{
		return "�浥����Ϣ��ѯ";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String cdsBoxInfoStr ="";//�浥����Ϣ
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  cDSSettleCycleLog = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ��浥״̬
		//���κ�Ϊ��
		if(cDSSettleCycleLog == null){	
			throw new ProcessorException(TERMRETCODE_CLEANCDS_NORECORD,TERMRETDESC_CLEANCDS_NORECORD, TERMRETDESCEN_CLEANCDS_NORECORD);
		}
		
		
		String cdsTransLogStr="";//�������ڽ�����ϸ��Ϣ
		//���������Ƿ��мӵ�����
		String cdsSettleCyclMsg="";
		CDSUnitStatusDB cdsUnitStatusDB = new CDSUnitStatusDB();
		List<?> cdsUnitList = cdsUnitStatusDB.getCDSUnitList(strTerminalNum);
		if(cdsUnitList != null && cdsUnitList.size() > 0){
			for(int i=0; i < cdsUnitList.size(); i++){
				CDSUnitStatus entity = (CDSUnitStatus)cdsUnitList.get(i);
				cdsBoxInfoStr = cdsBoxInfoStr + entity.getCuNum()  + "," +
				                                  entity.getStrCuType() + "," +
						                          entity.getInitialCount() + "," +
				                                  entity.getCurCount() + "," +
						                          entity.getStrCuStatus()+ "," +
						                          entity.getStrCdsTrackStart()+ "," +
						                          entity.getStrCdsTrackEnd()+ "," +
						                          entity.getCdsSuccCount()+ "," +
						                          entity.getCdsCaptureCount()+ "," +
						                          entity.getCdsDestroyCount()+ "," +
						                          entity.getCdsUnknown()+ "," +
						                          entity.getCdsTakenCount()+ "|";
			}
		}else{
			//���κŲ�Ϊ�գ����ǲ����ڼӵ�����
			cdsBoxInfoStr="";
			cdsSettleCyclMsg="1";
		}

		//�������ڽ�����ϸ��Ϣ
		CDSTransLogDB  transLogDB = new CDSTransLogDB();
		List<?> list = transLogDB.getCDSBatchList(strTerminalNum);
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				CDSTransLog entity = (CDSTransLog)list.get(i);
				int iHostTxStatus=entity.getHostTxStatus();
				int iTermTxStatus=entity.getTermTxStatus();
				String strOCRNum=entity.getStrOCRNum();

				//û�н��׻���ʧ�ܵĶ��ݶ�Ϊ��Ҫ�Ͻ���
			     if(iHostTxStatus==-1||iHostTxStatus==1) continue;
			     
			     if(entity.getTransCode()==null)
					 continue;
				 
				 if(entity.getTransCode().equals("905107")||
						 entity.getTransCode().equals("905104")||
						 entity.getTransCode().equals("905103")
						 ){
				 }else  
					 continue;
			     
				cdsTransLogStr = cdsTransLogStr +
						strOCRNum + "," +
						 iHostTxStatus+ "," +
                         iTermTxStatus+ "|";
			}
		}

		//�Ѵ浥����Ϣ���ݽ��зֽ⣬��,|���зָ�
		//���óɹ���Ϣ
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cdsBoxInfoStr", cdsBoxInfoStr);
		MsgXmlDom.setElementValue(domResp, "cdsTransLogStr", cdsTransLogStr);
		MsgXmlDom.setElementValue(domResp, "cdsSettleCyclMsg", cdsSettleCyclMsg);
	}
}
