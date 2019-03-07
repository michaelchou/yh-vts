package com.yihuacomputer.cols.startserver;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.logicalcobwebs.proxool.ProxoolFacade;

import com.yihuacomputer.cols.database.MiscDB;

/**
 * log4j日志系统服务启动类
 * 深圳怡化电脑股份有限公司
 * 2016-10-24
 */
public class Log4jServer extends HttpServlet{

	private static final long serialVersionUID = 2L;
	private HashMap<String, Integer> logFlagMap=null;//日志开关

    public void init() throws ServletException {
    	super.init();
    	initLog4j();
    	logFlagMap=new HashMap<String, Integer>(30,0.8f);
	}

    /**
     *
     * @param loggerType 日志类型
     * @param strChannel 终端渠道名称
     * @return
     */
    public static Logger getLoger(String loggerType,String strChannelName){
    	StringBuffer loggerName=new StringBuffer(128);
		loggerName.append(loggerType);
		loggerName.append(strChannelName);
    	return Logger.getLogger(loggerName.toString());
    }

    protected void initLog4j(){
    	StringBuffer path=new StringBuffer(128);
    	String strPath=getServletContext().getRealPath(File.separator);

    	path.append(strPath);
    	path.append("WEB-INF");
    	path.append(File.separator);
    	path.append("classes");
    	path.delete(0, path.length());
    	String logParent= new MiscDB().get("00001", "LogParent","/logs");
    	path.append(logParent);

      	File logRootPath=new File(path.toString());
      	if(!logRootPath.exists()){//如果不存在就创建
      		logRootPath.mkdirs();
      	}


    	path.delete(0, path.length());
    	path.append(strPath);
        path.append(getInitParameter("log4jproperties"));

    	if(path.indexOf("trial")>-1){//如果是试用节点
    		loadLogConfig(path.toString());
    	}else{
    		PropertyConfigurator.configure(path.toString());
    	}

    	Logger info = Logger.getLogger("Info");
    	info.info("日志初始化完毕");
    	path.delete(0, path.length());
    }

    public void loadLogConfig(String path){
    	Properties props = new Properties();
        FileInputStream input = null;
        try
        {
            input = new FileInputStream(path);
            props.load(input);
            props.setProperty("log4j.appender.Debug.File", "/was/profiles/itsapp01/logs/debug_trail.log");
            props.setProperty("log4j.appender.Info.File", "/was/profiles/itsapp01/logs/info_trial.log");
            props.setProperty("log4j.appender.Error.File", "/was/profiles/itsapp01/logs/error_trial.log");
            PropertyConfigurator.configure(props);
        }
        catch (IOException e)
        {
            PropertyConfigurator.configure(path.toString());
        }
        finally
        {
            if (input != null)
            {
                try
                {
                    input.close();
                }
                catch (IOException e)
                {

                }
            }
        }
    }


	public void destroy() {
		Logger.getRoot().removeAllAppenders();
		Logger.shutdown();
		if(logFlagMap!=null){
			logFlagMap.clear();
		}
		ProxoolFacade.shutdown(0);
	}
}
