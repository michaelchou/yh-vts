package com.yihuacomputer.cols.service;

import java.util.Date;

import org.jdom.Document;

import com.yihuacomputer.cols.database.TerminalDB;
import com.yihuacomputer.cols.entity.Terminal;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public abstract class Processor
{
	// int�ͱ�����ʼֵ
	public static int INT_DEFAULT = -1;
	public static int PROCESS_SUCCEED = 0; // �ɹ�
	public static int PROCESS_FAILED = 1; // ʧ��
	public static int PROCESS_UNCERTAIN = 2; // ��ȷ��

    // Ԥ���屨�Ľڵ�����
	public static String XMLNODENAME_TERMRETCODE = "TermRetCode";
	public static String XMLNODENAME_TERMRETDESC = "TermRetDesc";
	public static String XMLNODENAME_TERMRETDESCEN = "TermRetDescEn";
	public static String XMLNODENAME_PROCESSORNAME = "ProcessorName";
	public static String XMLNODENAME_SERVERDATETIME = "ServerDataTime";

    // �ն˷����뼰������
	public static String TERMRETCODE_SUCCEED = "0000";
	public static String TERMRETDESC_SUCCEED = "���׳ɹ�";
	public static String TERMRETDESCEN_SUCCEED = "Succeed";

	public static String TERMRETCODE_COMMERR = "0001";
	public static String TERMRETDESC_COMMERR = "ͨѶ����";
	public static String TERMRETDESCEN_COMMERR = "Comm error";

    public static String TERMRETCODE_COMMUNC = "0002";
	public static String TERMRETDESC_COMMUNC = "����ͨѶ�쳣������ʧ��";
	public static String TERMRETDESCEN_COMMUNC = "Comm uncertain";

	public static String TERMRETCODE_INVALIDTERM = "0003";
	public static String TERMRETDESC_INVALIDTERM = "�Ƿ��ն�";
	public static String TERMRETDESCEN_INVALIDTERM = "Invalid term";

	public static String TERMRETCODE_TSFRPINBLKERR = "0004";
	public static String TERMRETDESC_TSFRPINBLKERR = "��Ч���ף�ת��PinBlockʧ��";
	public static String TERMRETDESCEN_TSFRPINBLKERR = "Transfer pin failed";

	public static String TERMRETCODE_INVALIDREQUEST = "0005";
	public static String TERMRETDESC_INVALIDREQUEST = "��Ч�Ľ�������";
	public static String TERMRETDESCEN_INVALIDREQUEST = "Invalid request";

	public static String TERMRETCODE_MACERR = "0006";
	public static String TERMRETDESC_MACERR = "��Ч���ף�MACУ���";
	public static String TERMRETDESCEN_MACERR = "Mac error";

	public static String TERMRETDESC_INVALIDCARD = "��Ч����";
	public static String TERMRETDESCEN_INVALIDCARD = "Invalid card.";

	public static String TERMRETCODE_TOOBUSY = "9998";
	public static String TERMRETDESC_TOOBUSY = "������æ";
	public static String TERMRETDESCEN_TOOBUSY = "Server busy";

	public static String TERMRETCODE_INNERR = "9999";
	public static String TERMRETDESC_INNERR = "�ڲ�����";
	public static String TERMRETDESCEN_INNERR = "System error";

	public static String TERMRETCODE_UPLOADFILE = "0007";
	public static String TERMRETDESC_UPLOADFILE = "�ϴ�Ӱ���ļ�ʧ��";
	public static String TERMRETDESCEN_UPLOADFILE = "Upload File Error";

	public static String TERMRETCODE_QUERYFILE = "0008";
	public static String TERMRETDESC_QUERYFILE = "Ӱ���ļ���ѯʧ��";
	public static String TERMRETDESCEN_QUERYFILE = "Query File Error";

	public static String TERMRETCODE_ADDCARD = "0009";
	public static String TERMRETDESC_ADDCARD = "�ӿ�ʧ��";
	public static String TERMRETDESCEN_ADDCARD = "Add Card Error";

	public static String TERMRETCODE_CARDUNITQUERY = "0010";
	public static String TERMRETDESC_CARDUNITQUERY = "������Ϣ��ѯʧ��";
	public static String TERMRETDESCEN_CARDUNITQUERY = "CardUnit Query Error";

	public static String TERMRETCODE_CLEANCARD = "0011";
	public static String TERMRETDESC_CLEANCARD = "�忨ʧ��";
	public static String TERMRETDESCEN_CLEANCARD = "Clean Card Error";

	public static String TERMRETCODE_NOCLEANCARD = "0012";
	public static String TERMRETDESC_NOCLEANCARD = "�Բ��������忨";
	public static String TERMRETDESCEN_NOCLEANCARD = "Sorry, Please Clean Card First";
	
	public static String TERMRETCODE_CARD_TRANSLOG_QUERY = "0013";
	public static String TERMRETDESC_CARD_TRANSLOG_QUERY  = "����������Ϣ��ѯʧ��";
	public static String TERMRETDESCEN_CARD_TRANSLOG_QUERY  = "CARD TRANSLOG QUERY  Error";
	
	public static String TERMRETCODE_CLEANCARD_NORECORD = "0014";
	public static String TERMRETDESC_CLEANCARD_NORECORD = "�Բ������ȼӿ�";
	public static String TERMRETDESCEN_CLEANCARD_NORECORD  = "Sorry, Please Add Card First ";

	public static String TERMRETCODE_ADDCDS = "0109";
	public static String TERMRETDESC_ADDCDS = "�Ӵ浥ʧ��";
	public static String TERMRETDESCEN_ADDCDS = "Add CDS Error";

	public static String TERMRETCODE_CDSUNITQUERY = "0110";
	public static String TERMRETDESC_CDSUNITQUERY = "�浥����Ϣ��ѯʧ��";
	public static String TERMRETDESCEN_CDSUNITQUERY = "CDSUnit Query Error";

	public static String TERMRETCODE_CLEANCDS = "0111";
	public static String TERMRETDESC_CLEANCDS = "��浥ʧ��";
	public static String TERMRETDESCEN_CLEANCDS = "Clean CDS Error";

	public static String TERMRETCODE_NOCLEANCDS = "0112";
	public static String TERMRETDESC_NOCLEANCDS = "�Բ���������浥";
	public static String TERMRETDESCEN_NOCLEANCDS = "Sorry, Please Clean CDS First";
	
	public static String TERMRETCODE_ACCEPTEDCDSQUERY = "0113";
	public static String TERMRETDESC_ACCEPTEDCDSQUERY  = "�浥������Ϣ��ѯʧ��";
	public static String TERMRETDESCEN_ACCEPTEDCDSQUERY  = "ACCEPTEDCDS Query Error";
	
	public static String TERMRETCODE_CLEANCDS_NORECORD = "0114";
	public static String TERMRETDESC_CLEANCDS_NORECORD = "�Բ������ȼӴ浥";
	public static String TERMRETDESCEN_CLEANCDS_NORECORD  = "Sorry, Please Add CDS First ";

	public static String TERMRETCODE_ADDUKEY = "0209";
	public static String TERMRETDESC_ADDUKEY = "��UKeyʧ��";
	public static String TERMRETDESCEN_ADDUKEY = "Add UKEY Error";

	public static String TERMRETCODE_UKEYUNITQUERY = "0210";
	public static String TERMRETDESC_UKEYUNITQUERY = "UKey����Ϣ��ѯʧ��";
	public static String TERMRETDESCEN_UKEYUNITQUERY = "UKeyUnit Query Error";

	public static String TERMRETCODE_CLEANUKEY = "0211";
	public static String TERMRETDESC_CLEANUKEY = "��UKeyʧ��";
	public static String TERMRETDESCEN_CLEANUKEY = "Clean UKey Error";

	public static String TERMRETCODE_NOCLEANUKEY = "0212";
	public static String TERMRETDESC_NOCLEANUKEY = "�Բ���������UKey";
	public static String TERMRETDESCEN_NOCLEANUKEY = "Sorry, Please Clean Ukey First";
	
	public static String TERMRETCODE_UKEY_TRANSLOG_QUERY = "0213";
	public static String TERMRETDESC_UKEY_TRANSLOG_QUERY  = "��UKEY������Ϣ��ѯʧ��";
	public static String TERMRETDESCEN_UKEY_TRANSLOG_QUERY  = "UKEY TRANSLOG QUERY  Error";
	
	public static String TERMRETCODE_CLEANUKEY_NORECORD = "0214";
	public static String TERMRETDESC_CLEANUKEY_NORECORD = "�Բ������ȼ�UKey";
	public static String TERMRETDESCEN_CLEANUKEY_NORECORD  = "Sorry, Please Add UKey First ";
	
	public static String TERMRETCODE_NOCLEANCASH = "0300";
	public static String TERMRETDESC_NOCLEANCASH = "�Բ������мӳ���¼�������豸�峮";
	public static String TERMRETDESCEN_NOCLEANCASH = "Sorry, Please Clean Cash First ";
	
	public static String TERMRETCODE_NOADDCASH = "0310";
	public static String TERMRETDESC_NOADDCASH = "�Բ����޼ӳ���¼�������豸�ӳ�";
	public static String TERMRETDESCEN_NOADDCASH = "Sorry, Please Add Cash First ";
	

    // ��ǰ����������ʱ��
    protected DateCtrl dtCur = null;

    // �ն�ʵ�����
    protected Terminal terminal = null;

    protected Document domReq = null;
    protected Document domResp = null;
    protected String strReq = null;

	private static int iRunningThreadCount = 0;
	private static String RUNNINGTHREADCOUNTLOCK = "RUNNINGTHREADCOUNTLOCK";
	private static int MAX_RUNNINGTHREADCOUNT = 128;

	public static int increaseRunningThreadCount()
	{
		synchronized (RUNNINGTHREADCOUNTLOCK)
		{
			return ++iRunningThreadCount;
		}
	}

	public static int decreaseRunningThreadCount()
	{
		synchronized (RUNNINGTHREADCOUNTLOCK)
		{
			return --iRunningThreadCount;
		}
	}

	public static int getRunningThreadCount()
	{
		synchronized (RUNNINGTHREADCOUNTLOCK)
		{
			if (iRunningThreadCount < 0)
				iRunningThreadCount = 0;
			return iRunningThreadCount;
		}
	}

	public Processor()
	{
	}

	public String getRespText()
	{
		return XmlHelper.transformDom2Str(this.domResp, "UTF-8");
	}

	/**
	 * <p>
	 * ����ָ���ķ���ֵ���õ��򵥻�Ӧ�������ݡ�һ�����ڷ���δ�ɹ��Ļ�Ӧ��
	 * </p>
	 */
	public void setSimpleRespDom(String strTermRetCode, String strTermRetDesc, String strTermRetDescEn)
	{
		MsgXmlDom.setElementValue(this.domResp, XMLNODENAME_SERVERDATETIME, dtCur.getDateTimeStrFull());
		MsgXmlDom.setElementValue(this.domResp, XMLNODENAME_TERMRETCODE, strTermRetCode);
		MsgXmlDom.setElementValue(this.domResp, XMLNODENAME_TERMRETDESC, strTermRetDesc);
		MsgXmlDom.setElementValue(this.domResp, XMLNODENAME_TERMRETDESCEN, strTermRetDescEn);
	}

	public void setSucceedRespDom()
	{
		setSimpleRespDom(TERMRETCODE_SUCCEED, TERMRETDESC_SUCCEED, TERMRETDESCEN_SUCCEED);
	}

	public void doProcess(DateCtrl dtCur, String strReq, Document domReq)
	{
		this.dtCur = dtCur;
		this.strReq = strReq;
		this.domReq = domReq;
		this.domResp = new Document();
		if (getRunningThreadCount() > MAX_RUNNINGTHREADCOUNT)
		{
			setSimpleRespDom(TERMRETCODE_TOOBUSY, TERMRETDESC_TOOBUSY, TERMRETDESCEN_TOOBUSY);
			return;
		}
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		if (strTerminalNum == null || strTerminalNum.length() == 0)
		{
			setSimpleRespDom(TERMRETCODE_INVALIDTERM, TERMRETDESC_INVALIDTERM, TERMRETDESCEN_INVALIDTERM);
			return;
		}
		this.terminal = new TerminalDB().getEntityByTerminal(strTerminalNum);
		if (this.terminal == null)
		{
			setSimpleRespDom(TERMRETCODE_INVALIDTERM, TERMRETDESC_INVALIDTERM, TERMRETDESCEN_INVALIDTERM);
			return;
		}

		increaseRunningThreadCount();
		try
		{
			process();
		}
		catch (ProcessorException pe)
		{
			setSimpleRespDom(pe.getTermRetCode(), pe.getTermRetDesc(), pe.getTermRetDescEn());
		}
		catch (Exception e)
		{
			e.printStackTrace();
			// ����δ������쳣�׳����򷵻ز�ȷ��
			setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC, TERMRETDESCEN_COMMUNC);
		}
		decreaseRunningThreadCount();
	}
    /**
	 * ��ȡ16λ�ն���ˮ��:8λ�ն˱�� + 8λ�ն���ˮ��
	*/
	public String getTerminalTsn()
	{
		String strtm = "" + new Date().getTime();
		String str = MsgXmlDom.getElementValue(domReq, "strTerminalNum") + strtm.substring(strtm.length() - 8, strtm.length());
		return str;
	}
	/**
	 * ������
	 */
	protected abstract void process() throws ProcessorException;
}
