package com.yihuacomputer.cols.util;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

/**
 * 日期工具类
 * 深圳怡化电脑股份有限公司
 * 2016-11-13
 */
public class DateCtrl extends Date
{
	private static final long serialVersionUID = -7101466306762271601L;

  /**
   * <p>构造函数（取当前日期时间）</p>
   */
  public DateCtrl()
  {
    super();
  }

  /**
   * <p>构造函数</p>
   * @param date Date 日期对象
   */
  public DateCtrl(Date date)
  {
    super.setTime(date.getTime());
  }

  /**
   * <p>按格式解析日期时间字符串，并设置解析结果日期时间</p>
   * @param strDate Date String in format ("yyyy/MM/dd HH:mm:ss");
   * @return boolean 是否成功
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
   * <p>取年份</p>
   * @return int 年份
   */
  public int getYear_()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return calendar.get(Calendar.YEAR);
  }

  /**
   * <p>取月份</p>
   * @return int 月份
   */
  public int getMonth_()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return 1 + calendar.get(Calendar.MONTH);
  }

  /**
   * <p>取日期</p>
   * @return int 日期
   */
  public int getDayOfMonth()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return calendar.get(Calendar.DAY_OF_MONTH);
  }

  /**
   * <p>取星期几</p>
   * @return int 从1计到7
   */
  public int getDayOfWeek()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    // 西方 1-7 分别表示 星期天－星期六
    int i = calendar.get(Calendar.DAY_OF_WEEK);
    if (i == 1)
      return 7;
    else
      return i-1;
  }

  /**
   * <p>取小时</p>
   * @return int 小时
   */
  public int getHourOfDay()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return calendar.get(Calendar.HOUR_OF_DAY);
  }

  /**
   * <p>取分钟</p>
   * @return int 分钟
   */
  public int getMinute()
  {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(this);
    return calendar.get(Calendar.MINUTE);
  }

  /**
   * <p>取秒数</p>
   * @return int 秒数
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
   * <p>得到某一个月的最大天数</p>
   * @param strYear 年数
   * @param strMonth 月份
   * @return int 最大天数
   * <p>所有月份值都介于1-12</p>
   */
  public static int getMonthDayNumber(String strYear, String strMonth)
  {
    int year = DataConversion.str2Int(strYear, 1980);
    int month = DataConversion.str2Int(strMonth, 1);
    return getMonthDayNumber(year, month);
  }

  /**
   * <p>得到某一个月的最大天数</p>
   * @param year 年数
   * @param month 月份
   * @return int 最大天数
   * <p>所有月份值都介于1-12</p>
   */
  public static int getMonthDayNumber(int year, int month)
  {
      Calendar cal = Calendar.getInstance();
      cal.setTime(new Date());
      // 如果是本月，就返回今天的日期
		if (cal.get(Calendar.YEAR) == year && cal.get(Calendar.MONTH) + 1 == month)
			return cal.get(Calendar.DATE);

      cal.set(year, month-1, 1);
		return cal.getActualMaximum(Calendar.DATE);
  }

  /**
   * <p>得到一段日期之间的所有年月集合，包括起始和结束日期本身</p>
   * @param strStartDate 起始日期
   * @param strEndDate 结束日期
   * @return Object[] 年月字符串数组
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
   * <p>判断2个时间相差天数</p>
   * @param strStartDate 开始时间
   * @param strEndDate 结束时间
   * @return int 2个日期的相差天数
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
	  Calendar calendar = Calendar.getInstance();//此时打印它获取的是系统当前时间
	  calendar.add(Calendar.DATE, -1);
      return new SimpleDateFormat("yyyyMMdd").format(calendar.getTime());
   }
   
   public String getDateStrSimpleTomorrow()
   {
	   Calendar calendar = Calendar.getInstance();//此时打印它获取的是系统当前时间
	   calendar.add(Calendar.DATE, 1);
	   return new SimpleDateFormat("yyyyMMdd").format(calendar.getTime());
   }
}
