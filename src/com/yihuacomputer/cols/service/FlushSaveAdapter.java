package com.yihuacomputer.cols.service;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.database.FlushDataDB;
import com.yihuacomputer.cols.entity.FlushData;
/**
 * 存储冲正交易适配器类
 * 深圳怡化电脑股份有限公司
 * 2017-06-01
 */
public class FlushSaveAdapter {

	// 适配器对象的静态实例
	private static FlushSaveAdapter instance = null;

	public Logger error = Logger.getLogger("Error");
	public Logger info = Logger.getLogger("Info");

	protected FlushSaveThread aFlushSaveThread=null;

	public static  String FlushSaveAdapter_Lock = "FlushSaveAdapter_Lock";

	public FlushSaveAdapter()
	{
		if(aFlushSaveThread==null)
		{
			//冲正起4个线程数
			try
			{
				//用来处理发送次数为0的存储冲正数据
				aFlushSaveThread=new FlushSaveThread(1000*5*1,"0");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000  iThreadNum: 0");

                //用来处理发送次数为1的存储冲正数据
				aFlushSaveThread=new FlushSaveThread(60*1000*2,"1");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000*10  iThreadNum: 1");

                //用来处理发送次数为2的存储冲正数据
				aFlushSaveThread=new FlushSaveThread(60*1000*3,"2");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000*20  iThreadNum: 2");

                //用来处理发送次数为3的存储冲正数据
				aFlushSaveThread=new FlushSaveThread(60*1000*4,"3");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000*30  iThreadNum: 3");

                //用来处理发送次数为4的存储冲正数据
				aFlushSaveThread=new FlushSaveThread(60*1000*5,"4");
				aFlushSaveThread.start();
				info.info("FlushSaveAdapter aFlushSaveThread.start iSleepMsel:60*1000*60*3  iThreadNum: 4");
			}
			catch(Exception e)
			{
				error.error("启动冲正线程失败: "+e.getMessage());
			}

		}

	}
	/**
	 * 得到适配器实例对象
	 * @return 实例对象
	 */
	public static FlushSaveAdapter getInstance()
	{
		synchronized (FlushSaveAdapter_Lock) {
			if (instance == null)
			{
				// 第一次构造并初始化
				instance = new FlushSaveAdapter();
			}
		}
		return instance;
	}

	/**
	 * 记录冲正数据进数据库
	 */
	public boolean appendFlushData(FlushData bean) {
		boolean bRet =  new FlushDataDB().save(bean);
		return bRet;
	}
}
