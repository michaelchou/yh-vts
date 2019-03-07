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
 * <p>�������ļ���ˮ�����߳���</p>
 */
public class JournalThread extends Thread
{
    /**
     * <p>�������ļ���ˮ������</p>
     */
    protected class JournalObject
    {
        public String strTerminalNum;

        public String strJournal;

        public int iLevel;
    }

    public static Logger info = Logger.getLogger("Info");

	public static Logger error = Logger.getLogger("Error");

    // ��󻺴�Ķ�����
    protected static int MAX_JOURNALOBJ_NUM = 1024;

    // ��ǰ�ļ�������
    protected static int iCurLevel = TransLogLevel.DEBUG.getLevel();

    public static String logParent = "/was/profiles/itsapp01/logs/";

    // ��������ˮ�ļ���Ŀ¼
    public static String TRANSLOGPATH = logParent + "TransLog/";

    // �������
    @SuppressWarnings("rawtypes")
	protected ArrayList arrJournalBuf = new ArrayList(MAX_JOURNALOBJ_NUM);

    // ��̬ʵ��
    protected static JournalThread instance = null;

    /**
     * <p>��ȡ����ʵ��</p>
     * @return LinxViewProxyThread ����ʵ��
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
        // ��¼��־��ˮ
        StringWriter sw = new StringWriter(1024 * 4);
        PrintWriter px = new PrintWriter(sw);
        sw.write("[" + new DateCtrl().getDateTimeStrFull() + "] " + TransLogLevel.ERROR + "  ");
        e.printStackTrace(px);
        append(strTerminalNum, TransLogLevel.ERROR, sw.toString() + "\r\n");
        releaseRes(sw, px);
    }

    /**
     * ��¼INFO������־
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
     * <p>�����ˮ</p>
     * @param strBranchNum String ���к�
     * @param strTerminalNum String �ն˺�
     * @param level int ��ˮ����
     * @param strJournal String ��ˮ����
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
     * <p>���ػ����run()����������ʵ�ʵ��̴߳������</p>
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
     * <p>�����ַ����еĴŵ���Ϣ����=�ź������ת��Ϊ*</p>
     * @param str �ַ���
     * @return ���˺���ַ���
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
     * <p>������ˮ����</p>
     * @param strBranchNum String ���к�
     * @param level int ��ˮ����
     * @param strJournal String ��ˮ����
     * @return boolean �Ƿ�ɹ�
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
