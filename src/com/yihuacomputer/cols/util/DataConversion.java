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
 * ����ת��������
 * �����������Թɷ����޹�˾
 * 2016-11-13
 */
public class DataConversion
{

  /**
   * <p>�õ�һ��С��99></p>
   * @param str String �ַ���
   * @param iDef int ���ת��ʧ�ܣ�ȱʡ����������ֵ
   * @return int ת���������
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
   * <p>�ַ���ת��Ϊ����</p>
   * @param str String �ַ���
   * @param iDef int ���ת��ʧ�ܣ�ȱʡ����������ֵ
   * @return int ת���������
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
   * <p>�ַ���ת��Ϊ������</p>
   * @param str �ַ���
   * @param fDefault ȱʡֵ
   * @return float ת����ĸ�����ֵ�����ת��ʧ�ܷ���ȱʡֵ
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
   * <p>�ָ��ַ���</p>
   * @param  strWhole String ���ָ���ַ���
   * @param  chSep char   �ָ��ַ�
   * @return Object[] �ָ���Object�������飨ʵ�����ַ������飩
   */
  public static Object[] separate(String strWhole, char chSep)
  {
    // ��ʼ�����б�����Ϊ16������ÿ��addʱ���·���ռ䣬�˷�ʱ��
    ArrayList arrList = new ArrayList(16);
    int nlen = strWhole.length();
    int i = 0, iprev = 0;
    for (; i < nlen; i++)
    {
      if (strWhole.charAt(i) == chSep)
      {
        // �˴�ȥ����β�Ŀո�
        arrList.add(strWhole.substring(iprev, i).trim());
        iprev = i + 1;
      }
    }
    // ȡĩβ���ַ���
    arrList.add(strWhole.substring(iprev, i).trim());
    return arrList.toArray();
  }


  /**
   * <p>�޷���BYTEת��Ϊ������</p>
   * @param btVal BYTEֵ
   * @return int ������
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
   * <p>����ת��ΪBYTE����</p>
   * @param iVal ������
   * @param byteArr BYTE����
   * @param startPos ������ʼλ��
   */
  public static void int2ByteArr(int iVal, byte[] byteArr, int startPos)
  {
    byteArr[startPos] = (byte) (iVal / (256 * 256 * 256));
    byteArr[startPos + 1] = (byte) (iVal % (256 * 256 * 256) / (256 * 256));
    byteArr[startPos + 2] = (byte) (iVal % (256 * 256) / 256);
    byteArr[startPos + 3] = (byte) (iVal % 256);
  }

  /**
   * <p>�õ������ε�����byte�����ʾ<p>
   * @param sValue ��������
   * @return byte[] ����Ϊ2��byte����
   */
  public static byte[] short2ByteArr(short sValue)
  {
    byte[] byteArr = new byte[2];
    byteArr[0] = (byte) (sValue / 256);
    byteArr[1] = (byte) (sValue % 256);

    return byteArr;
  }

  /**
   * <p>������ת��ΪBYTE����</p>
   * @param sVal ��������
   * @param byteArr BYTE����
   * @param startPos ������ʼλ��
   */
  public static void short2ByteArr(short sVal, byte[] byteArr, int startPos)
  {
    byteArr[startPos] = (byte) (sVal / 256);
    byteArr[startPos + 1] = (byte) (sVal % 256);
  }


  /**
   * <p>BYTE����ת��Ϊ����</p>
   * @param byteArr BYTE����
   * @param startPos ������ʼλ��
   * @return int ������
   */
  public static int byteArr2Int(byte[] byteArr, int startPos)
  {
    short shortHi = byteArr2Short(byteArr, startPos);
    short shortLo = byteArr2Short(byteArr, startPos + 2);
    int iRet = shortHi * 256 * 256 + shortLo;
    return iRet;
  }

  /**
   * <p>BYTE����ת��Ϊ����</p>
   * @param byteArr BYTE����
   * @return int ������
   */
  public static int byteArr2Int(byte[] byteArr)
  {
    return byteArr2Int(byteArr, 0);
  }

  /**
   * <p>BYTE����ת��Ϊ������</p>
   * @param byteArr BYTE����
   * @return short ��������
   */
  public static short byteArr2Short(byte[] byteArr)
  {
    short sRet = (short) (byteArr[0] * 256 + byteArr[1]);
    return sRet;
  }

  /**
   * <p>BYTE����ת��Ϊ������</p>
   * @param byteArr BYTE����
   * @param startPos ������ʼλ��
   * @return short ��������
   */
  public static short byteArr2Short(byte[] byteArr, int startPos)
  {
    short sRet = (short) (unsignedByte2Int(byteArr[startPos]) * 256 + unsignedByte2Int(byteArr[startPos + 1]));
    return sRet;
  }


  /**
   * <p>ʮ�������ַ���ת����������</p>
   * @param strHex ��ת�����ַ���
   * @return byte[] ����ת�����byte���飬���ʧ�ܷ���null
   */
  public static byte[] hex2Byte(String strHex)
  {
    return CryptoUtils.toBytesBlock(strHex);
  }

  /**
   * <p>ʮ�������ַ���ת����������</p>
   * @param strHex ��ת�����ַ���
   * @param byteArrDest Ŀ������
   * @param iDestPos Ŀ��������ʼλ��
   * @return int ת�����ֽ�����ʧ�ܷ���-1
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
   * <p>�õ����ַ�ch��׺���ַ���</p>
   * @param str ԭʼ�ַ���
   * @param ch ��׺�ַ�
   * @param nWantLength ϣ�����ַ�������
   * @return String ����ΪnWantLength���ַ��������㳤�ȵĺ��ַ�ch
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
   * <p>�õ����ַ�ch��׺���ַ���</p>
   * @param str ԭʼ�ַ���
   * @param ch ��׺�ַ�
   * @param nWantLength ϣ�����ַ�������
   * @return String ����ΪnWantLength���ַ��������㳤�ȵĺ��ַ�ch
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
   * <p>�ַ���ת��ΪBYTE����</p>
   * @param byteArrDest Ŀ��BYTE����
   * @param iDestPos ������ʼλ��
   * @param str �ַ���
   * @param iWantedLen ϣ���ĳ���
   * <pre>����iWantedLen����ʱ��
   *  strFormat = "-A"    ǰ��A
   *  strFormat = "A"     ��A
   *  strFormat = null    �󲹿ո�
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
   * <p>�õ����ַ�chǰ׺���ַ���</p>
   * @param str ԭʼ�ַ���
   * @param ch ǰ׺�ַ�
   * @param nWantLength ϣ�����ַ�������
   * @return String ����ΪnWantLength���ַ��������㳤�ȵ�ǰ���ַ�ch
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
   * <p>��ʽ������������Ϊʮ�����ƺ�ASCII�ַ���������ʽ</p>
   * @param byteArr ���������ݵ�BYTE����
   * @return String ��ʽ������ַ���
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
   * <p>����������תʮ�������ַ���</p>
   * @param byteArr ��ת����byte����
   * @return String ����ת����Ĵ�д�ַ���
   */
  public static String byte2Hex(byte[] byteArr)
  {
    return CryptoUtils.toStringBlock(byteArr);
  }


  /**
   * <p>��ʽ������ֵ�ַ���Ϊ Px.2 ��ʽ</p>
   * @param strVal
   * @return String ��ʽ������ַ���
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
   * <p>�õ��Է�Ϊ��λ���ַ���</p>
   * @param str String Դ�ַ���
   * @return String �������ַ���
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
   * ��ת��ΪԪ.
   * @return Ԫ
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
          System.out.println("������ʽ����ȷ!");
      }
      return yuan;
  }
  /**
   * <p>ת����������</p>
   * @param str String Դ�ַ���
   * @return String �������ַ���
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
   * <p>���ݻ��Ҵ���ת����������</p>
   * @param str String Դ�ַ���
   * @return String ��������
   */
  public static String getCurrencyName(String strCyno)
  {
	if(strCyno != null)
	{
		if("156".equals(strCyno))
		{
			return "�����";
		}
		else if("392".equals(strCyno))
		{
			return "��Ԫ";
		}
		else if("840".equals(strCyno))
		{
			return "��Ԫ";
		}
		else if("978".equals(strCyno))
		{
			return "ŷԪ";
		}
		else if("826".equals(strCyno))
		{
			return "Ӣ��";
		}
		else if("344".equals(strCyno))
		{
			return "�۱�";
		}
		else if("410".equals(strCyno))
		{
			return "����Ԫ";
		}
		else
		{
			return strCyno;
		}
	}
	return strCyno;
  }
  /**
   * <p>ת���ʻ�����</p>
   * @param str String Դ�ַ���
   * @return String �������ַ���
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
   * <p>�Ѵ����ݿ��ж����������ַ���ת��Ϊ�������</p>
   * @param str �ַ���
   * @param strGBName ���Ĺ��������
   * @return String ����ת������ַ���
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
   * <p>�õ����ַ�'0'ǰ׺���ַ���</p>
   * @param str ԭʼ�ַ���
   * @param nWantLength ϣ�����ַ�������
   * @return String ����ΪnWantLength���ַ��������㳤�ȵ�ǰ���ַ�'0'
   */
  public static String getZeroPrefixStr(String str, int nWantLength)
  {
    return getPrefixStr(str, '0', nWantLength);
  }

  /**
   * <p>�õ�����ֵ��������Ľ��</p>
   * @param hexstr1 ������������ʮ�������ַ���1
   * @param hexstr2 ������������ʮ�������ַ���2
   * @return String �����������ʮ�������ַ�����ʧ�ܷ���null
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
   * <p>��ʽ����ֵ�ַ���Ϊָ����λ�;��ȵĸ�ʽ</p>
   * @param strVal ��ֵ�ַ���
   * @param iIntegerDigitsNum  ����λ��
   * @param iFractionDigitsNum С��λ��
   * @return String ��ʽ������ַ���
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
   * <p>ɾ���ַ���β���Ŀո�</p>
   * @param str String Դ�ַ���
   * @return String �������ַ���
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
   * <p>���ַ����е�����ת��Ϊ����ƴ��</p>
   * @param strCh String �������ĵ��ַ���
   * @return String ת������ַ���
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
          // �ں���ƴ���������֮��ӿո�
          if (!bPreChCh && strSentenceBuf.length() > 0)
            strSentenceBuf.append(' ');
          String strPyWord = arr[0];
          if (strSentenceBuf.length() == 0)
          {
            // ���׸�����ƴ����ĸת��Ϊ��д
            StringBuffer wordbuf = new StringBuffer(strPyWord);
            wordbuf.setCharAt(0, Character.toUpperCase(strPyWord.charAt(0)));
            strPyWord = wordbuf.toString();
          }
          strSentenceBuf.append(strPyWord);
          // �ں���ƴ�������ӿո�
          strSentenceBuf.append(' ');
          bPreChCh = true;
        }
        else
        {
          // �������ַ�
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
	   * <p>ת��Ϊ�������ַ���</p>
	   * @param str ԭʼ�ַ���
	   * @return String ����8λ�Ķ������ַ���'
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
   * <p>ת��ΪUnicode�����ʮ�������ַ������������ĸ��ַ���Ӣ�������ַ���</p>
   * @param str String Դ�ַ���
   * @return String Unicode�����ʮ�������ַ�����
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
   * <p>ѹ��bcd���ֽ�����ת��Ϊascii�ַ���</p>
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
   * <p>�ҿ�ascii�ַ���ת��Ϊѹ��bcd���ֽ�����</p>
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
    * <p>ascii�ַ���ת��Ϊѹ��bcd���ֽ�����</p>
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
	* <p>�ж��Ƿ񷵻�Ĭ��ֵ</p>
	* @param strReqFiledVal ԭʼ�ַ���
	* @param strDefFiledVal Ĭ��ֵ
	* @return String ���strReqFiledValΪnull���򷵻�Ĭ��ֵstrDefFiledVal
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
   * <p>�õ����ַ�ch��׺���ַ���</p>
   * @param str ԭʼ�ַ���
   * @param ch ��׺�ַ�
   * @param nWantLength ϣ�����ַ�������
   * @return String ����ΪnWantLength���ַ��������㳤�ȵĺ��ַ�ch
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
   * * �����ַ������ֽڳ���(��ĸ���ּ�1�����ּ�����2) *
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
  * �Ƿ��������<br>
  * ���ݺ��ֱ��뷶Χ�����ж�<br>
  * CJKͳһ���֣����������ĵģ���������������'���������ȷ��ţ�<br>
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
   * ȫ��ת���
   * @param input String.
   * @return ����ַ���
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
   * ȡ���ַ����еĿո񡢻س������з����Ʊ��
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

  //�ͷ���Դ
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
