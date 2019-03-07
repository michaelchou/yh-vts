package com.yihuacomputer.cols.service;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.database.FlushDataDB;
import com.yihuacomputer.cols.entity.FlushData;
/**
 * �洢����������������
 * �����������Թɷ����޹�˾
 * 2017-06-01
 */
public class FlushSaveAdapter {

	// ����������ľ�̬ʵ��
	private static FlushSaveAdapter instance = null;

	public Logger error = Logger.getLogger("Error");
	public Logger info = Logger.getLogger("Info");

	protected FlushSaveThread aFlushSaveThread=null;

	public static  String FlushSaveAdapter_Lock = "FlushSaveAdapter_Lock";

	public FlushSaveAdapter()
	{
		if(aFlushSaveThread==null)
		{
			//������4���߳���
			try
			{
				//���������ʹ���Ϊ0�Ĵ洢��������
				aFlushSaveThread=new FlushSaveThread(1000*5*1,"0");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000  iThreadNum: 0");

                //���������ʹ���Ϊ1�Ĵ洢��������
				aFlushSaveThread=new FlushSaveThread(60*1000*2,"1");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000*10  iThreadNum: 1");

                //���������ʹ���Ϊ2�Ĵ洢��������
				aFlushSaveThread=new FlushSaveThread(60*1000*3,"2");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000*20  iThreadNum: 2");

                //���������ʹ���Ϊ3�Ĵ洢��������
				aFlushSaveThread=new FlushSaveThread(60*1000*4,"3");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000*30  iThreadNum: 3");

                //���������ʹ���Ϊ4�Ĵ洢��������
				aFlushSaveThread=new FlushSaveThread(60*1000*5,"4");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000*60*3  iThreadNum: 4");
			}
			catch(Exception e)
			{
				error.error("���������߳�ʧ��: "+e.getMessage());
			}

		}

	}
	/**
	 * �õ�������ʵ������
	 * @return ʵ������
	 */
	public static FlushSaveAdapter getInstance()
	{
		synchronized (FlushSaveAdapter_Lock) {
			if (instance == null)
			{
				// ��һ�ι��첢��ʼ��
				instance = new FlushSaveAdapter();
			}
		}
		return instance;
	}

	/**
	 * ��¼�������ݽ����ݿ�
	 */
	public boolean appendFlushData(FlushData bean) {
		boolean bRet =  new FlushDataDB().save(bean);
		return bRet;
	}
}
