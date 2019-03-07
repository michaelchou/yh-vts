package com.yihuacomputer.cols.util;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

/**
 * ���ڹ�����
 * �����������Թɷ����޹�˾
 * 2016-11-13
 */
public class DateCtrl extends Date
{
	private static final long serialVersionUID = -7101466306762271601L;

  /**
   * <p>���캯����ȡ��ǰ����ʱ�䣩</p>
   */
  public DateCtrl()
  {
    super();
  }

  /**
   * <p>���캯��</p>
   * @param date Date ���ڶ���
   */
  public DateCtrl(Date date)
  {
    super.setTime(date.getTime());
  }

  /**
   * <p>����ʽ��������ʱ���ַ����������ý����������ʱ��</p>
   * @param strDate Date String in format ("yyyy/MM/dd HH:mm:ss");
   * @return boolean �Ƿ�ɹ�
   */
  public boolean parseDate(String strDate)
  {
    try
    {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
      Date date = sdf.parse(strDate);
      super.setTime(date.getTime());
      return true;
    } catch (Exception e)
    {
    }
    return false;
  }

  /**
   * <p>ȡ���</p>
   * @return int ���
   */
  public int getYear_()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return calendar.get(Calendar.YEAR);
  }

  /**
   * <p>ȡ�·�</p>
   * @return int �·�
   */
  public int getMonth_()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return 1 + calendar.get(Calendar.MONTH);
  }

  /**
   * <p>ȡ����</p>
   * @return int ����
   */
  public int getDayOfMonth()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return calendar.get(Calendar.DAY_OF_MONTH);
  }

  /**
   * <p>ȡ���ڼ�</p>
   * @return int ��1�Ƶ�7
   */
  public int getDayOfWeek()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    // ���� 1-7 �ֱ��ʾ �����죭������
    int i = calendar.get(Calendar.DAY_OF_WEEK);
    if (i == 1)
      return 7;
    else
      return i-1;
  }

  /**
   * <p>ȡСʱ</p>
   * @return int Сʱ
   */
  public int getHourOfDay()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return calendar.get(Calendar.HOUR_OF_DAY);
  }

  /**
   * <p>ȡ����</p>
   * @return int ����
   */
  public int getMinute()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return calendar.get(Calendar.MINUTE);
  }

  /**
   * <p>ȡ����</p>
   * @return int ����
   */
  public int getSecond()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return calendar.get(Calendar.SECOND);
  }

  /**
   * <p>Formats a Date into a date/time string</p>
   * @return String the formatted time string. format ("yyyy/MM/dd HH:mm:ss")
   */
  public String getDateTimeStrFull()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
    return sdf.format(this);
  }

  /**
   * <p>Formats a Date into a date/time string</p>
   * @param strDate Date String in format ("yyyyMMddHHmmss");
   * @return String the formatted time string. format ("yyyy/MM/dd HH:mm:ss")
   */
  public String getDateTimeStrFull(String strDate)
  {
	  SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
	  Date date = null;
	 try
	 {
		 SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
         date = format.parse(strDate);
	 }
	 catch(Exception ex)
	 {
		 date = this;
	 }

    return sdf.format(date);
  }
  /**
   * <p>Formats a Date into a date/time string</p>
   * @return String the formatted time string. format ("yyyyMMdd HHmmss")
   */
  public String getDateTimeStrSimple()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd HHmmss");
    return sdf.format(this);
  }
  public String getDateTimeStrSimple2()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHHmmss");
    return sdf.format(this);
  }
  public String getDateTimeStrSimple3()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
    return sdf.format(this);
  }
  public String getDateTimeStrSimpleFull()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    return sdf.format(this);
  }
  public String getDateTimeToView()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("HHmmss");
    return sdf.format(this);
  }
  public String getTransDateToView()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
    return sdf.format(this);
  }
  /**
   * <p>Formats a Date into a date/time string</p>
   * @return String the formatted time string. format ("yyyyMMdd")
   */
  public String getDateStrSimple()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    return sdf.format(this);
  }

  /**
   * <p>Formats a Date into a date/time string</p>
   * @return String the formatted time string. format ("HHmmss")
   */
  public String getTimeStrSimple()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
    return sdf.format(this);
  }

  /**
   * <p>Formats a Date into a date/time string</p>
   * @return String the formatted time string. format ("HH:mm:ss")
   */
  public String getTimeStrFull()
  {
    SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
    return sdf.format(this);
  }

  /**
   * <p>�õ�ĳһ���µ��������</p>
   * @param strYear ����
   * @param strMonth �·�
   * @return int �������
   * <p>�����·�ֵ������1-12</p>
   */
  public static int getMonthDayNumber(String strYear, String strMonth)
  {
    int year = DataConversion.str2Int(strYear, 1980);
    int month = DataConversion.str2Int(strMonth, 1);
    return getMonthDayNumber(year, month);
  }

  /**
   * <p>�õ�ĳһ���µ��������</p>
   * @param year ����
   * @param month �·�
   * @return int �������
   * <p>�����·�ֵ������1-12</p>
   */
  public static int getMonthDayNumber(int year, int month)
  {
      Calendar cal = Calendar.getInstance();
      cal.setTime(new Date());
      // ����Ǳ��£��ͷ��ؽ��������
		if (cal.get(Calendar.YEAR) == year && cal.get(Calendar.MONTH) + 1 == month)
			return cal.get(Calendar.DATE);

      cal.set(year, month-1, 1);
		return cal.getActualMaximum(Calendar.DATE);
  }

  /**
   * <p>�õ�һ������֮����������¼��ϣ�������ʼ�ͽ������ڱ���</p>
   * @param strStartDate ��ʼ����
   * @param strEndDate ��������
   * @return Object[] �����ַ�������
   */
  public static Object[] getMonthArray(String strStartDate, String strEndDate)
  {
    ArrayList strArrList = new ArrayList();
    if (strStartDate.length() == 6 && strEndDate.length() == 6)
    {
      int iStartYear = DataConversion.str2Int(strStartDate.substring(0,4), 1980);
      int iStartMonth = DataConversion.str2Int(strStartDate.substring(4,6), 1);
      int iEndYear = DataConversion.str2Int(strEndDate.substring(0,4), 1980);
      int iEndMonth = DataConversion.str2Int(strEndDate.substring(4,6), 1);

      Calendar calEnd = Calendar.getInstance();
      calEnd.set(iEndYear, iEndMonth, 1);

      Calendar calStart = Calendar.getInstance();
      calStart.set(iStartYear, iStartMonth-1, 1);
      while (calStart.before(calEnd))
      {
				String str = DataConversion.getZeroPrefixStr(
						String.valueOf(calStart.get(Calendar.YEAR)), 4)
						+ DataConversion.getZeroPrefixStr(String.valueOf(calStart.get(Calendar.MONTH) + 1), 2);
        strArrList.add(str);
				calStart.add(Calendar.MONTH, 1);
      }
    }
    return strArrList.toArray();
  }

  /**
   * <p>�ж�2��ʱ���������</p>
   * @param strStartDate ��ʼʱ��
   * @param strEndDate ����ʱ��
   * @return int 2�����ڵ��������
   */
  public static int getIntervalDays(Date startDate, Date endDate) {

	  Calendar aCalendar = Calendar.getInstance();

      aCalendar.setTime(startDate);

      int day1 = aCalendar.get(Calendar.DAY_OF_YEAR);

      aCalendar.setTime(endDate);

      int day2 = aCalendar.get(Calendar.DAY_OF_YEAR);

      return day2 - day1;
   }


  public Timestamp getTimestamp(){
	  SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	  String dtDate = sdf.format(new java.util.Date());
	  Timestamp ts = Timestamp.valueOf(dtDate);
	  return ts;
   }

  public Timestamp getStrToTimestamp(String dtDate){
	  Timestamp ts = Timestamp.valueOf(dtDate);
	  return ts;
   }

   public String getDateStrSimpleYestoday()
   {
	  Calendar calendar = Calendar.getInstance();//��ʱ��ӡ����ȡ����ϵͳ��ǰʱ��
	  calendar.add(Calendar.DATE, -1);
      return new SimpleDateFormat("yyyyMMdd").format(calendar.getTime());
   }
   
   public String getDateStrSimpleTomorrow()
   {
	   Calendar calendar = Calendar.getInstance();//��ʱ��ӡ����ȡ����ϵͳ��ǰʱ��
	   calendar.add(Calendar.DATE, 1);
	   return new SimpleDateFormat("yyyyMMdd").format(calendar.getTime());
   }
}
