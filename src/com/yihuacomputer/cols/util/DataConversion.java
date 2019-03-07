package com.yihuacomputer.cols.util;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.net.Socket;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;

import com.yihuacomputer.cols.crypto.CryptoUtils;

/**
 * 数据转换工具类
 * 深圳怡化电脑股份有限公司
 * 2016-11-13
 */
public class DataConversion
{

  /**
   * <p>得到一个小于99></p>
   * @param str String 字符串
   * @param iDef int 如果转换失败，缺省的整数返回值
   * @return int 转换后的整数
   */
  public static String getRandomNumber()
  {
	  int iNum = new Random().nextInt(99);
	  String strNum = String.valueOf(iNum);
	  if(iNum < 10)
	  {
		  strNum = getSuffixStr(strNum,'0',2);
	  }

	  return strNum;
  }
  /**
   * <p>字符串转换为整数</p>
   * @param str String 字符串
   * @param iDef int 如果转换失败，缺省的整数返回值
   * @return int 转换后的整数
   */
  public static int str2Int(String str, int iDef)
  {
	if(null == str)
	str = "0";
    int iRet = iDef;
    try
    {
      iRet = Integer.valueOf(str, 10).intValue();
    }
    catch (Exception e)
    {
    }
    return iRet;
  }

  /**
   * <p>字符型转换为浮点型</p>
   * @param str 字符串
   * @param fDefault 缺省值
   * @return float 转换后的浮点型值，如果转换失败返回缺省值
   */
  public static float str2Float(String str, float fDefault)
  {
    float fRet = fDefault;
    try
    {
      if (str != null)
        fRet = new Float(str).floatValue();
    }
    catch (Exception e)
    {
    }
    return fRet;
  }

  /**
   * <p>分割字符串</p>
   * @param  strWhole String 待分割的字符串
   * @param  chSep char   分割字符
   * @return Object[] 分割后的Object对象数组（实际是字符串数组）
   */
  public static Object[] separate(String strWhole, char chSep)
  {
    // 初始数组列表容量为16，以免每次add时重新分配空间，浪费时间
    ArrayList arrList = new ArrayList(16);
    int nlen = strWhole.length();
    int i = 0, iprev = 0;
    for (; i < nlen; i++)
    {
      if (strWhole.charAt(i) == chSep)
      {
        // 此处去掉首尾的空格
        arrList.add(strWhole.substring(iprev, i).trim());
        iprev = i + 1;
      }
    }
    // 取末尾的字符串
    arrList.add(strWhole.substring(iprev, i).trim());
    return arrList.toArray();
  }


  /**
   * <p>无符号BYTE转换为整形数</p>
   * @param btVal BYTE值
   * @return int 整形数
   */
  public static int unsignedByte2Int(byte btVal)
  {
    int iRet;
    if (btVal >= 0)
      iRet = btVal;
    else
      iRet = 256 + btVal;
    return iRet;
  }

  /**
   * <p>整形转换为BYTE数组</p>
   * @param iVal 整形数
   * @param byteArr BYTE数组
   * @param startPos 数组起始位置
   */
  public static void int2ByteArr(int iVal, byte[] byteArr, int startPos)
  {
    byteArr[startPos] = (byte) (iVal / (256 * 256 * 256));
    byteArr[startPos + 1] = (byte) (iVal % (256 * 256 * 256) / (256 * 256));
    byteArr[startPos + 2] = (byte) (iVal % (256 * 256) / 256);
    byteArr[startPos + 3] = (byte) (iVal % 256);
  }

  /**
   * <p>得到短整形的数的byte数组表示<p>
   * @param sValue 短整形数
   * @return byte[] 长度为2的byte数组
   */
  public static byte[] short2ByteArr(short sValue)
  {
    byte[] byteArr = new byte[2];
    byteArr[0] = (byte) (sValue / 256);
    byteArr[1] = (byte) (sValue % 256);

    return byteArr;
  }

  /**
   * <p>短整形转换为BYTE数组</p>
   * @param sVal 短整形数
   * @param byteArr BYTE数组
   * @param startPos 数组起始位置
   */
  public static void short2ByteArr(short sVal, byte[] byteArr, int startPos)
  {
    byteArr[startPos] = (byte) (sVal / 256);
    byteArr[startPos + 1] = (byte) (sVal % 256);
  }


  /**
   * <p>BYTE数组转换为整形</p>
   * @param byteArr BYTE数组
   * @param startPos 数组起始位置
   * @return int 整形数
   */
  public static int byteArr2Int(byte[] byteArr, int startPos)
  {
    short shortHi = byteArr2Short(byteArr, startPos);
    short shortLo = byteArr2Short(byteArr, startPos + 2);
    int iRet = shortHi * 256 * 256 + shortLo;
    return iRet;
  }

  /**
   * <p>BYTE数组转换为整形</p>
   * @param byteArr BYTE数组
   * @return int 整形数
   */
  public static int byteArr2Int(byte[] byteArr)
  {
    return byteArr2Int(byteArr, 0);
  }

  /**
   * <p>BYTE数组转换为短整形</p>
   * @param byteArr BYTE数组
   * @return short 短整形数
   */
  public static short byteArr2Short(byte[] byteArr)
  {
    short sRet = (short) (byteArr[0] * 256 + byteArr[1]);
    return sRet;
  }

  /**
   * <p>BYTE数组转换为短整形</p>
   * @param byteArr BYTE数组
   * @param startPos 数组起始位置
   * @return short 短整形数
   */
  public static short byteArr2Short(byte[] byteArr, int startPos)
  {
    short sRet = (short) (unsignedByte2Int(byteArr[startPos]) * 256 + unsignedByte2Int(byteArr[startPos + 1]));
    return sRet;
  }


  /**
   * <p>十六进制字符串转二进制数据</p>
   * @param strHex 待转换的字符串
   * @return byte[] 返回转换后的byte数组，如果失败返回null
   */
  public static byte[] hex2Byte(String strHex)
  {
    return CryptoUtils.toBytesBlock(strHex);
  }

  /**
   * <p>十六进制字符串转二进制数据</p>
   * @param strHex 待转换的字符串
   * @param byteArrDest 目标数组
   * @param iDestPos 目标数组起始位置
   * @return int 转换的字节数，失败返回-1
   */
  public static int hex2Byte(String strHex, byte[] byteArrDest, int iDestPos)
  {
    int iRet = -1;

    byte[] byteArr = hex2Byte(strHex);
    if (byteArr != null && byteArr.length > 0 && byteArr.length <= byteArrDest.length - iDestPos)
    {
      System.arraycopy(byteArr, 0, byteArrDest, iDestPos, byteArr.length);
      iRet = byteArr.length;
    }

    return iRet;
  }

  /**
   * <p>得到以字符ch后缀的字符串</p>
   * @param str 原始字符串
   * @param ch 后缀字符
   * @param nWantLength 希望的字符串长度
   * @return String 长度为nWantLength的字符串，不足长度的后补字符ch
   */
  public static String getSuffixStr(String str, char ch, int nWantLength)
  {
	  if (null == str)
	      str = "";
         int iLength = byteLength(str);
	    if (iLength >= nWantLength)
	      return str;

	    StringBuffer strbuf = new StringBuffer(nWantLength);
	    strbuf.append(str);
	    while (iLength < nWantLength){
	      strbuf.append(ch);
	      iLength++;
	    }
	    return strbuf.toString();
  }
  /**
   * <p>得到以字符ch后缀的字符串</p>
   * @param str 原始字符串
   * @param ch 后缀字符
   * @param nWantLength 希望的字符串长度
   * @return String 长度为nWantLength的字符串，不足长度的后补字符ch
   */
  public static String getSuffixStr(String str, char ch, int nWantLength,boolean flag)
  {
    if (null == str)
      str = "";

    if (str.length() >= nWantLength)
      return str;

    StringBuffer strbuf = new StringBuffer(nWantLength);
    strbuf.append(str);
    while (strbuf.length() < nWantLength)
      strbuf.append(ch);
    return strbuf.toString();

  }
  /**
   * <p>字符串转换为BYTE数组</p>
   * @param byteArrDest 目标BYTE数组
   * @param iDestPos 数组起始位置
   * @param str 字符串
   * @param iWantedLen 希望的长度
   * <pre>不足iWantedLen长度时：
   *  strFormat = "-A"    前补A
   *  strFormat = "A"     后补A
   *  strFormat = null    后补空格
   * </pre>
   */
  public static void str2ByteArr(byte[] byteArrDest, int iDestPos, String str, int iWantedLen, String strFormat)
  {
    String strFixedLen = str;

    if (strFormat != null && strFormat.length() > 0)
    {
      if (strFormat.length() == 2 && strFormat.charAt(0) == '-')
        strFixedLen = DataConversion.getPrefixStr(str, strFormat.charAt(1), iWantedLen);
      else
        strFixedLen = DataConversion.getSuffixStr(str, strFormat.charAt(0), iWantedLen);
    }
    else
    {
      strFixedLen = DataConversion.getSuffixStr(str, ' ', iWantedLen);
    }

    System.arraycopy(strFixedLen.getBytes(), 0, byteArrDest, iDestPos, iWantedLen);
  }


  /**
   * <p>得到以字符ch前缀的字符串</p>
   * @param str 原始字符串
   * @param ch 前缀字符
   * @param nWantLength 希望的字符串长度
   * @return String 长度为nWantLength的字符串，不足长度的前补字符ch
   */
  public static String getPrefixStr(String str, char ch, int nWantLength)
  {
    if (null == str)
      str = "";

    int strlen = str.length();
    if (strlen >= nWantLength)
      return str;

    StringBuffer strbuf = new StringBuffer(nWantLength);
    while (strbuf.length() < nWantLength-strlen)
      strbuf.append(ch);
    strbuf.append(str);
    return strbuf.toString();
  }

  /**
   * <p>格式化二进制数据为十六进制和ASCII字符串表现形式</p>
   * @param byteArr 二进制数据的BYTE数组
   * @return String 格式化后的字符串
   */
  public static String formatBinaryData(byte[] byteArr, int len)
  {
    int COLPERROW = 16;
    StringBuffer strRet = new StringBuffer(len*6);
    int iLen = len <= 0 ? byteArr.length : len;

    for (int iRow = 0; iRow * COLPERROW < iLen; iRow++)
    {
      strRet.append(DataConversion.getPrefixStr(new Integer(iRow * COLPERROW).toString(), '0', 4) + "  ");

      int iCol;
      for (iCol = 0; iCol < COLPERROW && iRow * COLPERROW + iCol < iLen; iCol++)
      {
        byte bytetmp = byteArr[iRow * COLPERROW + iCol];
        strRet.append(" ");
        strRet.append(CryptoUtils.hex_asc_tab[ ( bytetmp >>> 4) & 0x0f ]);
        strRet.append(CryptoUtils.hex_asc_tab[ ( bytetmp      ) & 0x0f ]);
      }
      for (; iCol < COLPERROW; iCol++)
        strRet.append("   ");

      strRet.append("\t");
      for (iCol = 0; iCol < COLPERROW && iRow * COLPERROW + iCol < iLen; iCol++)
      {
        if (!Character.isISOControl((char) byteArr[iRow * COLPERROW + iCol]))
          strRet.append((char)byteArr[iRow * COLPERROW + iCol]);
        else
          strRet.append("*");
      }

      strRet.append("\r\n");
    }

    return strRet.toString();
  }


  /**
   * <p>二进制数据转十六进制字符串</p>
   * @param byteArr 待转换的byte数组
   * @return String 返回转换后的大写字符串
   */
  public static String byte2Hex(byte[] byteArr)
  {
    return CryptoUtils.toStringBlock(byteArr);
  }


  /**
   * <p>格式化货币值字符串为 Px.2 格式</p>
   * @param strVal
   * @return String 格式化后的字符串
   */
  public static String FormatMoneyVal(String strVal)
  {
    String strRet = strVal;
    try
    {
      double dbVal = new Double(strVal).doubleValue();
      NumberFormat nf = NumberFormat.getInstance();
      nf.setMinimumFractionDigits(2);
      nf.setMaximumFractionDigits(2);
      nf.setGroupingUsed(false);
      strRet = nf.format(dbVal);
    }
    catch (Exception e)
    {
    }
    return strRet;
  }
  /**
   * <p>得到以分为单位的字符串</p>
   * @param str String 源字符串
   * @return String 处理后的字符串
   */
  public static String getMoneyToFen(String strMoney)
  {
	    String strM = "";
	    if(strMoney.lastIndexOf('.')== -1 )
	    {
	      strM = strMoney +"00";
	    }
	    else
	    {
	      strM  =FormatMoneyVal(strMoney);
	      strM = strM.substring(0,strM.indexOf('.')) + strM.substring(strM.indexOf('.')+1) ;
	    }
	  return strM;
  }

  /**
   * 分转换为元.
   * @return 元
  */
  public String fromFenToYuan(String fen) {
	  if(fen.indexOf(".") != -1){
           return fen;
	  }
      String yuan = "";
      final int MULTIPLIER = 100;
      fen = String.valueOf(Integer.parseInt(fen));
      Pattern pattern = Pattern.compile("^[1-9][0-9]*{1}");
      Matcher matcher = pattern.matcher(fen);
      if (matcher.matches()) {
          yuan = new BigDecimal(fen).divide(new BigDecimal(MULTIPLIER)).setScale(2).toString();
      } else {
          System.out.println("参数格式不正确!");
      }
      return yuan;
  }
  /**
   * <p>转换货币类型</p>
   * @param str String 源字符串
   * @return String 处理后的字符串
   */
  public static String parseCurrencyCode(String strCyno)
  {
	if(strCyno != null)
	{
		if("01".equals(strCyno))
		{
			return "156";
		}
		else if("156".equals(strCyno))
		{
			return "01";
		}
	}
	return strCyno;
  }
  /**
   * <p>根据货币代码转换货币名称</p>
   * @param str String 源字符串
   * @return String 货币名称
   */
  public static String getCurrencyName(String strCyno)
  {
	if(strCyno != null)
	{
		if("156".equals(strCyno))
		{
			return "人民币";
		}
		else if("392".equals(strCyno))
		{
			return "日元";
		}
		else if("840".equals(strCyno))
		{
			return "美元";
		}
		else if("978".equals(strCyno))
		{
			return "欧元";
		}
		else if("826".equals(strCyno))
		{
			return "英镑";
		}
		else if("344".equals(strCyno))
		{
			return "港币";
		}
		else if("410".equals(strCyno))
		{
			return "韩国元";
		}
		else
		{
			return strCyno;
		}
	}
	return strCyno;
  }
  /**
   * <p>转换帐户类型</p>
   * @param str String 源字符串
   * @return String 处理后的字符串
   */
  public static String parseAccountType(String strCardType)
	{
		if("11000".equals(strCardType))
			return "10";
		else if("12000".equals(strCardType))
			return "30";

		return "10";
	}
  /**
   * <p>把从数据库中读出的中文字符串转换为国标编码</p>
   * @param str 字符串
   * @param strGBName 中文国标编码名
   * @return String 编码转换后的字符串
   */
  public static String convertFromChinese(String str, String strGBName)
  {
    try
    {
      return new String(str.getBytes(), strGBName);
    }
    catch (Exception e)
    {
    }
    return str;
  }


  /**
   * <p>得到以字符'0'前缀的字符串</p>
   * @param str 原始字符串
   * @param nWantLength 希望的字符串长度
   * @return String 长度为nWantLength的字符串，不足长度的前补字符'0'
   */
  public static String getZeroPrefixStr(String str, int nWantLength)
  {
    return getPrefixStr(str, '0', nWantLength);
  }

  /**
   * <p>得到两个值异或运算后的结果</p>
   * @param hexstr1 参与异或运算的十六进制字符串1
   * @param hexstr2 参与异或运算的十六进制字符串2
   * @return String 异或运算结果的十六进制字符串，失败返回null
   */
  public static String xor(String hexstr1, String hexstr2)
  {
    String hexstrRet = "";
    byte[] byteArr1 = hex2Byte(hexstr1);
    byte[] byteArr2 = hex2Byte(hexstr2);

    if (byteArr1 != null && byteArr2 != null && byteArr1.length == byteArr2.length)
    {
      for (int i=0; i<byteArr1.length; i++)
      {
        hexstrRet += getZeroPrefixStr(Integer.toHexString((byteArr1[i]^byteArr2[i]) & 0xFF), 2).toUpperCase();
      }
    }

    return hexstrRet;
  }

  /**
   * <p>格式化数值字符串为指定数位和精度的格式</p>
   * @param strVal 数值字符串
   * @param iIntegerDigitsNum  整数位数
   * @param iFractionDigitsNum 小数位数
   * @return String 格式化后的字符串
   */
  public static String formatNumVal(String strVal, int iIntegerDigitsNum, int iFractionDigitsNum)
  {
    String strRet = strVal;
    try
    {
      double dbVal = new Double(strVal).doubleValue();
      NumberFormat nf = NumberFormat.getInstance();
      nf.setMinimumIntegerDigits(iIntegerDigitsNum);
      nf.setMaximumIntegerDigits(iIntegerDigitsNum);
      nf.setMinimumFractionDigits(iFractionDigitsNum);
      nf.setMaximumFractionDigits(iFractionDigitsNum);
      nf.setGroupingUsed(false);
      strRet = nf.format(dbVal);
    }
    catch (Exception e)
    {
    }
    return strRet;
  }

  /**
   * <p>删除字符串尾部的空格</p>
   * @param str String 源字符串
   * @return String 处理后的字符串
   */
  public static String trimRight(String str)
  {
    int i = str.length()-1;
    for (; i>=0 && (str.charAt(i)==' ' || str.charAt(i) == '\r' || str.charAt(i) == '\n'); i--);
    if (i < str.length() -1)
      str = str.substring(0, i+1);
    return str;
  }

  /**
   * <p>将字符串中的中文转换为汉语拼音</p>
   * @param strCh String 包含中文的字符串
   * @return String 转换后的字符串
   */
  public static String chinese2HanyuPinyin(String strCh)
  {
    boolean bPreChCh = false;
    int chlen = strCh.length();
    StringBuffer strSentenceBuf = new StringBuffer(chlen*4);
    HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
    format.setCaseType(HanyuPinyinCaseType.LOWERCASE);
    format.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
    format.setVCharType(HanyuPinyinVCharType.WITH_V);
    for (int ich = 0; ich < chlen; ich++)
    {
      try
      {
        String[] arr = PinyinHelper.toHanyuPinyinStringArray(strCh.charAt(ich), format);
        if (arr != null && arr.length > 0 && arr[0].length() > 0)
        {
          // 在汉语拼音与非中文之间加空格
          if (!bPreChCh && strSentenceBuf.length() > 0)
            strSentenceBuf.append(' ');
          String strPyWord = arr[0];
          if (strSentenceBuf.length() == 0)
          {
            // 将首个汉语拼音字母转换为大写
            StringBuffer wordbuf = new StringBuffer(strPyWord);
            wordbuf.setCharAt(0, Character.toUpperCase(strPyWord.charAt(0)));
            strPyWord = wordbuf.toString();
          }
          strSentenceBuf.append(strPyWord);
          // 在汉语拼音后增加空格
          strSentenceBuf.append(' ');
          bPreChCh = true;
        }
        else
        {
          // 非中文字符
          strSentenceBuf.append(strCh.charAt(ich));
          bPreChCh = false;
        }
      }
      catch (Exception e)
      {
        strSentenceBuf.append(strCh.charAt(ich));
        bPreChCh = false;
      }
    }
    return strSentenceBuf.toString();
  }

	  /**
	   * <p>转换为二进制字符串</p>
	   * @param str 原始字符串
	   * @return String 补满8位的二进制字符串'
	   */
	public static String byteToBinary(String strVal)
	{
		String strBinary=null;
		try
		{
			 strBinary = DataConversion.getZeroPrefixStr(Integer.toBinaryString(Integer.parseInt(strVal)),8);
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
		}

		return strBinary;
	}

  /**
   * <p>转换为Unicode编码的十六进制字符串。（中文四个字符，英文两个字符）</p>
   * @param str String 源字符串
   * @return String Unicode编码的十六进制字符串。
   */
  public static String str2UnicodeHex(String str)
  {
    try
    {
      byte[] bytes = str.getBytes("UTF-16");
      StringBuffer strRet = new StringBuffer(bytes.length);
      for (int i=2; i+1<bytes.length; i+=2)
      {
        if (bytes[i] != 0)
        {
          strRet.append(CryptoUtils.hex_asc_tab[(bytes[i] >>> 4) & 0x0f]);
          strRet.append(CryptoUtils.hex_asc_tab[(bytes[i]) & 0x0f]);
        }
        strRet.append(CryptoUtils.hex_asc_tab[(bytes[i+1] >>> 4) & 0x0f]);
        strRet.append(CryptoUtils.hex_asc_tab[(bytes[i+1]) & 0x0f]);
      }
      return strRet.toString();
    }
    catch (Exception e)
    {
      return str;
    }
  }


  /**
   * <p>压缩bcd码字节数组转换为ascii字符串</p>
   * @param bytearrSrc
   * @return
   */
  public static String cbcdTostr(byte[] bytearrSrc)
  {
    StringBuffer sb = new StringBuffer(128);
    int nHighValue = 0, nLowValue = 0;
    for(int nLoop = 0; nLoop < bytearrSrc.length; nLoop ++)
    {
      nLowValue = bytearrSrc[nLoop] & 0x0F;
      nHighValue = (bytearrSrc[nLoop] >> 4) & 0x0F;
      sb.append(String.valueOf(Integer.toHexString(nHighValue)));
      sb.append(String.valueOf(Integer.toHexString(nLowValue)));
    }

    return sb.toString().toUpperCase();
  }

  /**
   * <p>右靠ascii字符串转换为压缩bcd码字节数组</p>
   * @param bytearrSrc
   * @return
   */
 public static byte[] strRightTocbcd(String strSrc)
 {
   if(0 != strSrc.length() % 2)
   {
     strSrc = "0" + strSrc;
   }
   byte[] bytearrRet = new byte[strSrc.length() / 2];
   int nValue = 0;
   for(int nLoop = 0; nLoop < strSrc.length(); nLoop ++)
   {
     nValue = Integer.parseInt(strSrc.substring(nLoop, nLoop + 1), 16);
     if(0 == nLoop % 2)
       bytearrRet[nLoop / 2] = (byte)(nValue << 4);
     else
       bytearrRet[nLoop / 2] = (byte)((int)bytearrRet[nLoop / 2] ^ nValue);
   }

   return bytearrRet;
}



  /**
    * <p>ascii字符串转换为压缩bcd码字节数组</p>
    * @param bytearrSrc
    * @return
  */
  public static byte[] strTocbcd(String strSrc)
  {
    if(0 != strSrc.length() % 2)
    {
      strSrc =   strSrc+"0";
    }
    byte[] bytearrRet = new byte[strSrc.length() / 2];
    int nValue = 0;
    for(int nLoop = 0; nLoop < strSrc.length(); nLoop ++)
    {
      nValue = Integer.parseInt(strSrc.substring(nLoop, nLoop + 1), 16);
      if(0 == nLoop % 2)
        bytearrRet[nLoop / 2] = (byte)(nValue << 4);
      else
        bytearrRet[nLoop / 2] = (byte)((int)bytearrRet[nLoop / 2] ^ nValue);
    }

    return bytearrRet;
 }

  /**
	* <p>判断是否返回默认值</p>
	* @param strReqFiledVal 原始字符串
	* @param strDefFiledVal 默认值
	* @return String 如果strReqFiledVal为null，则返回默认值strDefFiledVal
  */
  public static String getFieldDefVal(String strReqFiledVal,String strDefFiledVal)
  {
	if(strReqFiledVal!=null&&strReqFiledVal.length()!=0)
	{
		return strReqFiledVal;
	}
	if(null !=strDefFiledVal)
		 return strDefFiledVal.trim();
	else
	return "";
  }

  /**
	* <P>binary(64/128) to char(8/16)</p>
	* @param str String
	* @return String
  */
  public static byte[] atoc(String str)
  {
	 int i = 0;
	 int iLen = str.length();
	 byte[] tmps = new byte[iLen / 8];
	 String strtmp = "";

	 for (i = 0; i < iLen / 8; i++) {
	    for (int j = i; j < i + 8; j++) {
	      strtmp = str.substring(0, 8);
	      str = str.substring(8, str.length());
	      j += 8;
	      tmps[i] = btoc(strtmp);
	    }
	 }
	 return tmps;
  }

  /**
	* binary(8) to char(1)
	* @param bit1 String
	* @return byte
  */
  public static byte btoc(String bit1)
  {
	  int q = 0, i = 7, tt = 1;
	  char[] cin = new char[8];
	  char[] cout = new char[8];
	  java.lang.Character ccc = new Character(cout[0]);

	  for (int j = 0; j < 8; j++) {
	    cin[j] = bit1.charAt(j);
	  }
	  while (i >= 0) {
	    cout[0] = cin[i];
	    if (i == 7) {
	      tt = 1;
	    }
	    else {
	      tt = tt * 2;
	    }
	    q = q + tt * ccc.digit(cout[0], 10);
	    i--;
	  }
	  return (byte) q;
  }

  /**
	* char(8/16) to binary(64/128)
	* @param str byte[]
	* @return String
  */
  public static String atob(byte[] str)
  {
	  int ctoi, chr = 0, i = 0;
	  int iLen=str.length;
	  char[] tmp = new char[iLen ];
	  StringBuffer Bstr = new StringBuffer(128);
	  //tmp = str.toCharArray();
	  while (i < iLen ) {
	    ctoi = (int) (str[i]);
	    if (ctoi < 0) {
	      chr = 256 + ctoi;
	    }
	    else {
	      chr = ctoi;
	    }
	    Bstr.append(ctob(chr));
	    i++;
	   }
	   return Bstr.toString();
  }


  //char(1) to binary(8)
  private static String ctob(int sei)
  {
	 int  i =0;
	 String strtmp = "";
	 Integer Inttemp = new Integer(0);
	 strtmp = Inttemp.toBinaryString(sei);
	 while(strtmp.length()+0 < 8){
	    strtmp = "0" + strtmp;
	      i++ ;
	  }
	  return strtmp;
  }

  public static int byte4ToInt(byte[] ba)
  {
	 int mask=0xff;
	 int temp=0;
	 int n=0;
	 for(int i=0;i<4;i++){
		 n<<=8;
	     temp=ba[i]&mask;
		 n|=temp;
	  }
	  return n;
  }

  public static byte[] intToByte4(int n)
  {
	byte[] b = new byte[4];

	for(int i = 0;i < 4;i++)
	{
		b[i]=(byte)(n>>(24-i*8));
	}
	return b;
  }

  public static String printHex(byte[] b)
  {
	String retStr = "";
	if(b==null)
		return "";
	for (int i = 0; i < b.length; ++i) {
		if (i % 16 == 0) {
			retStr += (Integer.toHexString ((i & 0xFFFF) | 0x10000).substring(1,5) + " - ");
		}
		retStr += (Integer.toHexString((b[i]&0xFF) | 0x100).substring(1,3) + " ");
		if (i % 16 == 15 || i == b.length - 1)
		{
			int j;
			for (j = 16 - i % 16; j > 1; --j)
				retStr += ("   ");
			retStr += (" - ");
			int start = (i / 16) * 16;
			int end = (b.length < i + 1) ? b.length : (i + 1);
			for (j = start; j < end; ++j)
				if (b[j] >= 32 && b[j] <= 126)
					retStr += ((char)b[j]);
				else
					retStr += (".");
			retStr += '\n';
		 }
	 }
	 retStr += '\n';
	 return retStr;
 }

 /**
   * <p>得到以字符ch后缀的字符串</p>
   * @param str 原始字符串
   * @param ch 后缀字符
   * @param nWantLength 希望的字符串长度
   * @return String 长度为nWantLength的字符串，不足长度的后补字符ch
 */
  public static String getstrSuffixStr(String str, char ch, int nWantLength)
  {
	 if (null == str)
		 str = "";
     int iLength = byteLength(str);
	 if (iLength >= nWantLength)
		 return str;

	 StringBuffer strbuf = new StringBuffer(nWantLength);
	 strbuf.append(str);
	 while (iLength < nWantLength){
		  strbuf.append(ch);
		  iLength++;
	 }
	 return strbuf.toString();
  }

  /*
   * * 计算字符串的字节长度(字母数字计1，汉字及标点计2) *
  */
  public static int byteLength(String string)
  {
	int count = 0;
	for (int i = 0; i < string.length(); i++) {
		if (Integer.toHexString(string.charAt(i)).length() == 4) {
		   count += 2;
		} else {
		   count++;
		}
	}
	return count;
  }

  /**
  * 是否包含汉字<br>
  * 根据汉字编码范围进行判断<br>
  * CJK统一汉字（不包含中文的，。《》（）“‘'”、！￥等符号）<br>
  * @param str
  * @return
  */
  public boolean hasChineseByReg(String str) {
     if (str == null) {
        return false;
     }
     Pattern pattern = Pattern.compile("[\\u4E00-\\u9FBF]+");
     return pattern.matcher(str).find();
  }

  /**
   * 全角转半角
   * @param input String.
   * @return 半角字符串
   */
  public String ToDBC(String input) {
      char c[] = input.toCharArray();
      for (int i = 0; i < c.length; i++) {
          if (c[i] == '\u3000') {
               c[i] = ' ';
          }
          else if (c[i] > '\uFF00' && c[i] < '\uFF5F') {
               c[i] = (char) (c[i] - 65248);

          }
       }
       String returnString = new String(c);
       return returnString;
  }

  public static void releaseRes(Socket sock, InputStream is, OutputStream os)
  {
	if (is != null)
		try {
			is.close();
		} catch (Exception e) {

		}
	if (os != null)
		try {
			os.close();
		} catch (Exception e) {

		}

	if (sock != null)
		try {
			sock.close();
		} catch (Exception e) {

		}
  }

  /**
   * 取出字符串中的空格、回车、换行符、制表符
   */
  public String replaceBlank(String str)
  {
     String dest = "";
     if(str != null && !str.equals("")){
         Pattern p = Pattern.compile("\\s*|\t|\r|\n");
         Matcher m = p.matcher(str);
         dest = m.replaceAll("");
     }
     return dest;
  }

  //释放资源
  public static void releaseRes(StringWriter sw, PrintWriter psw)
  {
	 if (sw != null)
	 {
		try
		{
			sw.close();
		}
		catch (Exception e) {
					}
		}
		if (psw != null)
		{
			try
			{
				psw.close();
			}
			catch (Exception e) {
			}

		}

	}
 }
