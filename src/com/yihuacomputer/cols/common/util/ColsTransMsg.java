package com.yihuacomputer.cols.common.util;

import java.util.Properties;

/**
 * ���Ĵ�����
 */
public class ColsTransMsg
{
    // ��ű��ĵļ�ֵ�����
    protected Properties mapKey2Val = new Properties();
    protected StringBuffer strbufMsg = new StringBuffer(128);

    // ����(��)��ֵ֮��ķָ���
    protected  static String SEP_KEY2VAL = "=";
    protected  static String SEPSTR_KEY2VAL = "!3D";
    // ��ֵ���ֵ֮��ķָ���
    protected  static String SEP_KEYVAL2KEYVAL = "&";
    protected  static String SEPSTR_KEYVAL2KEYVAL = "!26";
    // �����뱨��֮��ķָ���
    protected  static String SEP_NEXTLINE = "\n";
    protected  static String SEPSTR_NEXTLINE = "!0A";

    // һ�����������
    protected  static int MAX_GROUPKEY_NUM = 1024;

    // �������ֵ
    public  static String MSG_KEY_RESULT = "Result";
    public  static String MSG_RESULT_SUCCESSFUL = "0000";
    public  static String MSG_RESULT_FAILED = "0001";
    public  static String MSG_RESULT_UNCERTAIN = "0002";

    // �������ͼ���ֵ
    public  static String MSG_KEY_TYPE = "Type";
    public  static String MSG_TYPE_HDWSTATUS = "HdwStatus";

    public  static String MSG_KEY_TERMNUM = "TermNum";

    /**
     * <p>���캯��</p>
     */
    public ColsTransMsg()
    {
    }

    /**
     * <p>��ȡ��ű��ĵļ�ֵ�����</p>
     * @return Properties ��ű��ĵļ�ֵ�����
     */
    public Properties getMapKey2Val()
    {
        return this.mapKey2Val;
    }

    /**
     * <p>���캯��</p>
     * @param strMsg String ���ĵ����л��ַ���
     */
    public ColsTransMsg(String strMsg)
    {
        if (strMsg != null && strMsg.length() > 0)
        {
            strMsg = strMsg.replaceAll(SEP_NEXTLINE, "");

            strMsg = strMsg.trim();
            strbufMsg.append(strMsg);

            // ִ�з����л�
            String[] arrKeyVal2KeyVal = strMsg.split(SEP_KEYVAL2KEYVAL);
            String[] arrKey2Val;
            for (int i = 0; i < arrKeyVal2KeyVal.length; i++)
            {
                arrKey2Val = arrKeyVal2KeyVal[i].split(SEP_KEY2VAL);
                if (arrKey2Val.length == 2)
                {
                    mapKey2Val.setProperty(fromSerialize((String) arrKey2Val[0]),
                                           fromSerialize((String) arrKey2Val[1]));
                }
            }
        }
    }

    /**
     * <p>ִ�����л�</p>
     * @return String ���ĵ����л��ַ���
     */
    public String toString()
    {
        StringBuffer strbufTmp = new StringBuffer(128);
        strbufTmp.append(strbufMsg);
        strbufTmp.append(SEP_NEXTLINE);
        return strbufTmp.toString();
    }

    /**
     * <p>�õ��Ѿ���������л��ַ�������toString����������β��δ�ӱ��Ľ�������һ������MacУ��</p>
     * @return String ���ĵ����л��ַ���
     */
    public String getBufferedString()
    {
        return strbufMsg.toString() + SEP_KEYVAL2KEYVAL;
    }

    /**
     * <p>ת��ԭ�ַ��������л����ַ���</p>
     * @param strFrom String ԭ�ַ���
     * @return String ���л����ַ���
     */
    protected static String toSerialize(String strFrom)
    {
        return strFrom.replaceAll(SEP_KEY2VAL, SEPSTR_KEY2VAL).
                replaceAll(SEP_KEYVAL2KEYVAL, SEPSTR_KEYVAL2KEYVAL).
                replaceAll(SEP_NEXTLINE, SEPSTR_NEXTLINE);
    }

    /**
     * <p>�����л����ַ���ת��ԭ�ַ���</p>
     * @param strTo String ���л����ַ���
     * @return String ԭ�ַ���
     */
    protected static String fromSerialize(String strTo)
    {
        return strTo.replaceAll(SEPSTR_KEY2VAL, SEP_KEY2VAL).
                replaceAll(SEPSTR_KEYVAL2KEYVAL, SEP_KEYVAL2KEYVAL).
                replaceAll(SEPSTR_NEXTLINE, SEP_NEXTLINE);
    }

    /**
     * <p>���ü�ֵ</p>
     * @param strKey String ����
     * @param strVal String ֵ
     */
    public void put(String strKey, String strVal)
    {
        if (strVal == null)
            return;
        mapKey2Val.setProperty(strKey, strVal);

        // ִ�����л�
        if (strbufMsg.length() > 0)
            strbufMsg.append(SEP_KEYVAL2KEYVAL);
        strbufMsg.append(toSerialize(strKey));
        strbufMsg.append(SEP_KEY2VAL);
        strbufMsg.append(toSerialize(strVal));
    }

    /**
     * <p>����һ���ֵ</p>
     * @param strKey String ����
     * @param strarrVal String[] ֵ����
     */
    public void put(String strKey, String[] strarrVal)
    {
        for (int i = 0; i < strarrVal.length; i++)
            put(strKey + (i + 1), strarrVal[i]);
    }

    /**
     * <p>��ȡ��ֵ</p>
     * @param strKey String ����
     * @return String ֵ��ֵ������ʱ����""
     */
    public String get(String strKey)
    {
        return mapKey2Val.getProperty(strKey, "");
    }

    /**
     * <p>��ȡһ���ֵ��һ����ֵ</p>
     * @param strKey String ����
     * @param index int ֵ����������1��ʼ��
     * @return String ֵ��ֵ������ʱ����""
     */
    public String get(String strKey, int index)
    {
        return mapKey2Val.getProperty(strKey + index, "");
    }

    /**
     * <p>��ȡһ���ֵ�ĸ���</p>
     * @param strKey String ����
     * @return int ����
     */
    public int getGroupNum(String strKey)
    {
        int iGroupNum = 0;
        for (int i = 1; i <= MAX_GROUPKEY_NUM; i++)
        {
            if (mapKey2Val.containsKey(strKey + i))
                iGroupNum = i;
            else
                break;
        }
        return iGroupNum;
    }
}
