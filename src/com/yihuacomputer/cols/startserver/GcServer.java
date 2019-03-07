package com.yihuacomputer.cols.startserver;

import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.common.util.DataProcess;

/**
 * 垃圾回收服务启动类
 * 深圳怡化电脑股份有限公司
 * 2016-10-24
 */
public class GcServer extends HttpServlet {
	private static final long serialVersionUID = 1L;
    protected int iGap;

    Logger log = Log4jServer.getLoger("Info", "");
    Logger logErr = Logger.getLogger("Error");

    public void init() throws ServletException {

    	new DaySchedule().main();//执行批处理

		Thread thread = new Thread() {
			public void run() {
				log.info("GCServer is  started!");
				// 每10秒钟 一次
				int PERIOD = 1000 * 10 ;
				while (true) {
					try {
						System.gc();
						Thread.sleep(PERIOD);
					} catch (Exception e) {
						StringWriter sw = new StringWriter(1024 * 4);
						PrintWriter psw = new PrintWriter(sw);
						e.printStackTrace(psw);
						logErr.error("GCServer init Exception:" + sw.toString());
						DataProcess.releaseRes(sw,psw);
					}
				}
			}
		};
		thread.start();
	}

	public void destroy() {
		log.info("GCServer shutdown!");
	}

}
