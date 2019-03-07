package com.yihuacomputer.cols.common.util;

import java.util.Properties;

/**
 * 报文处理类
 */
public class ColsTransMsg
{
    // 存放报文的键值表对象
    protected Properties mapKey2Val = new Properties();
    protected StringBuffer strbufMsg = new StringBuffer(128);

    // 名字(键)与值之间的分隔符
    protected  static String SEP_KEY2VAL = "=";
    protected  static String SEPSTR_KEY2VAL = "!3D";
    // 键值与键值之间的分隔符
    protected  static String SEP_KEYVAL2KEYVAL = "&";
    protected  static String SEPSTR_KEYVAL2KEYVAL = "!26";
    // 报文与报文之间的分隔符
    protected  static String SEP_NEXTLINE = "\n";
    protected  static String SEPSTR_NEXTLINE = "!0A";

    // 一组键的最大个数
    protected  static int MAX_GROUPKEY_NUM = 1024;

    // 结果键和值
    public  static String MSG_KEY_RESULT = "Result";
    public  static String MSG_RESULT_SUCCESSFUL = "0000";
    public  static String MSG_RESULT_FAILED = "0001";
    public  static String MSG_RESULT_UNCERTAIN = "0002";

    // 报文类型键和值
    public  static String MSG_KEY_TYPE = "Type";
    public  static String MSG_TYPE_HDWSTATUS = "HdwStatus";

    public  static String MSG_KEY_TERMNUM = "TermNum";

    /**
     * <p>构造函数</p>
     */
    public ColsTransMsg()
    {
    }

    /**
     * <p>获取存放报文的键值表对象</p>
     * @return Properties 存放报文的键值表对象
     */
    public Properties getMapKey2Val()
    {
        return this.mapKey2Val;
    }

    /**
     * <p>构造函数</p>
     * @param strMsg String 报文的序列化字符串
     */
    public ColsTransMsg(String strMsg)
    {
        if (strMsg != null && strMsg.length() > 0)
        {
            strMsg = strMsg.replaceAll(SEP_NEXTLINE, "");

            strMsg = strMsg.trim();
            strbufMsg.append(strMsg);

            // 执行反序列化
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
     * <p>执行序列化</p>
     * @return String 报文的序列化字符串
     */
    public String toString()
    {
        StringBuffer strbufTmp = new StringBuffer(128);
        strbufTmp.append(strbufMsg);
        strbufTmp.append(SEP_NEXTLINE);
        return strbufTmp.toString();
    }

    /**
     * <p>得到已经缓存的序列化字符串，与toString的区别在于尾部未加报文结束符，一般用于Mac校验</p>
     * @return String 报文的序列化字符串
     */
    public String getBufferedString()
    {
        return strbufMsg.toString() + SEP_KEYVAL2KEYVAL;
    }

    /**
     * <p>转换原字符串至序列化的字符串</p>
     * @param strFrom String 原字符串
     * @return String 序列化的字符串
     */
    protected static String toSerialize(String strFrom)
    {
        return strFrom.replaceAll(SEP_KEY2VAL, SEPSTR_KEY2VAL).
                replaceAll(SEP_KEYVAL2KEYVAL, SEPSTR_KEYVAL2KEYVAL).
                replaceAll(SEP_NEXTLINE, SEPSTR_NEXTLINE);
    }

    /**
     * <p>从序列化的字符串转换原字符串</p>
     * @param strTo String 序列化的字符串
     * @return String 原字符串
     */
    protected static String fromSerialize(String strTo)
    {
        return strTo.replaceAll(SEPSTR_KEY2VAL, SEP_KEY2VAL).
                replaceAll(SEPSTR_KEYVAL2KEYVAL, SEP_KEYVAL2KEYVAL).
                replaceAll(SEPSTR_NEXTLINE, SEP_NEXTLINE);
    }

    /**
     * <p>设置键值</p>
     * @param strKey String 键名
     * @param strVal String 值
     */
    public void put(String strKey, String strVal)
    {
        if (strVal == null)
            return;
        mapKey2Val.setProperty(strKey, strVal);

        // 执行序列化
        if (strbufMsg.length() > 0)
            strbufMsg.append(SEP_KEYVAL2KEYVAL);
        strbufMsg.append(toSerialize(strKey));
        strbufMsg.append(SEP_KEY2VAL);
        strbufMsg.append(toSerialize(strVal));
    }

    /**
     * <p>设置一组键值</p>
     * @param strKey String 键名
     * @param strarrVal String[] 值数组
     */
    public void put(String strKey, String[] strarrVal)
    {
        for (int i = 0; i < strarrVal.length; i++)
            put(strKey + (i + 1), strarrVal[i]);
    }

    /**
     * <p>获取键值</p>
     * @param strKey String 键名
     * @return String 值，值不存在时返回""
     */
    public String get(String strKey)
    {
        return mapKey2Val.getProperty(strKey, "");
    }

    /**
     * <p>获取一组键值中一个键值</p>
     * @param strKey String 键名
     * @param index int 值的索引（从1开始）
     * @return String 值，值不存在时返回""
     */
    public String get(String strKey, int index)
    {
        return mapKey2Val.getProperty(strKey + index, "");
    }

    /**
     * <p>获取一组键值的个数</p>
     * @param strKey String 键名
     * @return int 个数
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
