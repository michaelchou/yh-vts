package com.yihuacomputer.cols.service;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.logging.Level;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.crypto.TransLogLevel;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.util.DateCtrl;

/**
 * <p>服务器文件流水处理线程类</p>
 */
public class JournalThread extends Thread
{
    /**
     * <p>服务器文件流水对象类</p>
     */
    protected class JournalObject
    {
        public String strTerminalNum;

        public String strJournal;

        public int iLevel;
    }

    public static Logger info = Logger.getLogger("Info");

	public static Logger error = Logger.getLogger("Error");

    // 最大缓存的对象数
    protected static int MAX_JOURNALOBJ_NUM = 1024;

    // 当前的级别设置
    protected static int iCurLevel = TransLogLevel.DEBUG.getLevel();

    public static String logParent = "/was/profiles/itsapp01/logs/";

    // 服务器流水文件的目录
    public static String TRANSLOGPATH = logParent + "TransLog/";

    // 缓存对象
    @SuppressWarnings("rawtypes")
	protected ArrayList arrJournalBuf = new ArrayList(MAX_JOURNALOBJ_NUM);

    // 静态实例
    protected static JournalThread instance = null;

    /**
     * <p>获取对象实例</p>
     * @return LinxViewProxyThread 对象实例
     */
    public static JournalThread getInstance()
    {
        synchronized (TRANSLOGPATH)
        {
            if (instance == null)
            {
                instance = new JournalThread();
                try
                {
                    instance.start();
                }
                catch (Exception e)
                {
                    JournalThread.getInstance().append("00000000", e);
                }
            }
        }
        return instance;
    }

    public void append(String strTerminalNum, Exception e)
    {
        // 记录日志流水
        StringWriter sw = new StringWriter(1024 * 4);
        PrintWriter px = new PrintWriter(sw);
        sw.write("[" + new DateCtrl().getDateTimeStrFull() + "] " + TransLogLevel.ERROR + "  ");
        e.printStackTrace(px);
        append(strTerminalNum, TransLogLevel.ERROR, sw.toString() + "\r\n");
        releaseRes(sw, px);
    }

    /**
     * 记录INFO级别日志
     * @param strTerminalNum
     * @param level
     * @param strJournal
     */
    public void appendInfoLog(String strTerminalNum, String strJournal){
    	append(strTerminalNum, TransLogLevel.INFO, strJournal);
    }
    public void appendDebugLog(String strTerminalNum, String strJournal){
    	append(strTerminalNum, TransLogLevel.DEBUG, strJournal);
    }
    public void appendErrorLog(String strTerminalNum, String strJournal){
    	append(strTerminalNum, TransLogLevel.ERROR, strJournal);
    }
    /**
     * <p>添加流水</p>
     * @param strBranchNum String 分行号
     * @param strTerminalNum String 终端号
     * @param level int 流水级别
     * @param strJournal String 流水内容
     */
    @SuppressWarnings("unchecked")
	public void append(String strTerminalNum, TransLogLevel level, String strJournal)
    {
        if (strJournal == null || strJournal.length() == 0)
            return;
        strJournal = "[" + new DateCtrl().getDateTimeStrFull() + "] " + level + "  " + strJournal;
        JournalObject jobj = new JournalObject();
        jobj.strTerminalNum = strTerminalNum;
        jobj.iLevel = level.getLevel();
        jobj.strJournal = strJournal;

        synchronized (TRANSLOGPATH)
        {
            if (arrJournalBuf.size() >= MAX_JOURNALOBJ_NUM)
                arrJournalBuf.remove(0);
            arrJournalBuf.add(jobj);
        }
    }

    /**
     * <p>重载基类的run()函数，运行实际的线程处理程序</p>
     */
    public void run()
    {
        while (true)
        {
            try
            {
                super.sleep(1000);
            }
            catch (Exception e)
            {
                JournalThread.getInstance().append("00000000", e);
            }
            Object[] arrJObj = null;
            synchronized (TRANSLOGPATH)
            {
                arrJObj = arrJournalBuf.toArray();
                arrJournalBuf.clear();
            }
            if (arrJObj == null || arrJObj.length <= 0)
                continue;
            for (int i = 0; i < arrJObj.length; i++)
            {
                JournalObject jobj = (JournalObject)arrJObj[i];
                processJournal(jobj.strTerminalNum, jobj.iLevel, jobj.strJournal);
            }
        }
    }

    /**
     * <p>过滤字符串中的磁道信息，将=号后的数字转换为*</p>
     * @param str 字符串
     * @return 过滤后的字符串
     */
    public static String filterTrackData(String str)
    {
        if (str == null || str.length() == 0)
            return str;

        int iLen = str.length();
        StringBuffer buf = new StringBuffer(iLen);
        try
        {
            int digitNum = 0;
            for (int i = 0; i < iLen; i++)
            {
                buf.append(str.charAt(i));
                if (str.charAt(i) == '=')
                {
                    if (digitNum >= 8)
                    {
                        int trackindex = i + 1;
                        for (; trackindex < iLen && (trackindex - i <= 16)
                            && (str.charAt(trackindex) >= '0' && str.charAt(trackindex) <= '9'); trackindex++)
                            buf.append('*');
                        i = trackindex - 1;
                    }
                    continue;
                }
                else if (str.charAt(i) >= '0' && str.charAt(i) <= '9')
                    digitNum++;
                else
                    digitNum = 0;
            }
        }
        catch (Exception e)
        {
            return str;
        }
        return buf.toString();
    }

    /**
     * <p>处理流水对象</p>
     * @param strBranchNum String 分行号
     * @param level int 流水级别
     * @param strJournal String 流水内容
     * @return boolean 是否成功
     */
    protected boolean processJournal(String strTerminalNum, int level, String strJournal)
    {
        if (level <= iCurLevel)
        {
            String strDirPath = TRANSLOGPATH;
            String strDirFinalPath = strDirPath + strTerminalNum;
            String strJournalFilePath = strDirFinalPath + File.separator + new DateCtrl().getDateStrSimple() + ".log";
            FileWriter fw = null;
            try
            {
                File dir = new File(strDirPath);
                if (dir.isDirectory() || dir.mkdir())
                {
                    File dirFinal = new File(strDirFinalPath);
                    if (dirFinal.isDirectory() || dirFinal.mkdir())
                    {
                        fw = new FileWriter(strJournalFilePath, true);
                        fw.write(strJournal);
                        return true;
                    }
                }
            }
            catch (Exception e)
            {
                error.error(e.getMessage());
            }
            finally
            {
                if (fw != null)
                {
                    try
                    {
                        fw.close();
                    }
                    catch (Exception e2)
                    {
                        error.error(e2.getMessage());
                    }
                }
            }

        }
        return false;
    }

    private static void releaseRes(StringWriter sw, PrintWriter psw)
    {
        if (sw != null)
        {
            try
            {
                sw.close();
            }
            catch (Exception e)
            {
            }
        }
        if (psw != null)
        {
            try
            {
                psw.close();
            }
            catch (Exception e)
            {
            }
        }

    }

}
