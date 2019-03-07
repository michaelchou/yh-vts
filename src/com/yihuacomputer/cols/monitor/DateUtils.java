package com.yihuacomputer.cols.monitor;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {
	public static final String STANDARD_DATE = "yyyy-MM-dd";

	public static final String STANDARD_TIME = "HH:mm:ss";

	public static final String STANDARD_TIME2 = "HHmm";

	public static final String STANDARD_TIMESTAMP = "yyyy-MM-dd HH:mm:ss";

	public static final String STANDARD_TIMESTAMP2 = "yyyyMMddHHmm";

	public static final String STANDARD_DATE_SHORT = "yyyyMMdd";

	public static final String STANDARD_YEAR = "yyyy";

	public static final String STANDARD_MONTH = "MM";

	public static final String STANDARD_DAY = "dd";

	public static final String STANDARD_TIMESTAMP3 = "yyyy-MM-dd HH:mm";

	public static final String STANDARD_MONTH_FULL = "yyyy-MM" ;

	public static final String STANDARD_MONTH_FULL1 = "yyyyMM" ;

	public static final String STANDARD_TIMESTAMP5 = "yyyyMMddHHmmssSSS";

	public static Date get(String strDate, String format) {
		if (format == null) {
			throw new AppException("Date format can not be null");
		}
		Date date = null;
		try {
			date = new SimpleDateFormat(format).parse(strDate);
		} catch (ParseException ex) {
			throw new AppException("Format Error" + ex.getMessage());
		}
		return date;
	}


	public static String getTodayDate() {
		return get(new Date(), STANDARD_DATE_SHORT);
	}

	public static Date getDate(String strDate) {
		return get(strDate, STANDARD_DATE);
	}

	public static Date getTimestamp(String strDate) {
		return get(strDate, STANDARD_TIMESTAMP);
	}

	public static Date getTimestamp2(String strDate) {
		return get(strDate, STANDARD_TIMESTAMP2);
	}

	public static Date getTimestamp3(String strDate) {
		return get(strDate, STANDARD_TIMESTAMP3);
	}

	public static Date getTime(String strDate) {
		return get(strDate, STANDARD_TIME);
	}

	public static String getDate(Date date) {
		return get(date, STANDARD_DATE);
	}

	public static String getTimestamp(Date date) {
		return get(date, STANDARD_TIMESTAMP);
	}

	public static String getTimestamp5(Date date) {
		return get(date, STANDARD_TIMESTAMP5);
	}

	public static String getTimestamp2(Date date) {
		return get(date, STANDARD_TIMESTAMP3);
	}

	public static String getTime(Date date) {
		return get(date, STANDARD_TIME);
	}

	public static String getTime2(Date date) {
		return get(date, STANDARD_TIME2);
	}

	public static String get(Date date, String format) {
		return new SimpleDateFormat(format).format(date);
	}

	public static Date getTimestamp4(String strDate) {
		return get(strDate, STANDARD_DATE);
	}

	public static String getPreMinuteTimestamp(int minute) {

		Calendar date = Calendar.getInstance();
		date.add(Calendar.MINUTE, -minute);

		return new SimpleDateFormat(STANDARD_TIMESTAMP).format(date.getTime());

	}

	public static String getLastDate() {
		Calendar date = Calendar.getInstance();
		date.add(Calendar.DAY_OF_MONTH, -1);
		return new SimpleDateFormat(STANDARD_DATE).format(date.getTime());
	}

	public static Date getDate(int days) {
		Calendar date = Calendar.getInstance();
		date.add(Calendar.DAY_OF_MONTH, days);
		return date.getTime();
	}

	public static String getLastShortDate() {
		Calendar date = Calendar.getInstance();
		date.add(Calendar.DAY_OF_MONTH, -1);
		return new SimpleDateFormat(STANDARD_DATE_SHORT).format(date.getTime());
	}

	public static String getTodayDates() {
		Calendar date = Calendar.getInstance();
		date.add(Calendar.MONTH, -1);
		return new SimpleDateFormat(STANDARD_MONTH_FULL1).format(date.getTime());

	}

	public static String getYearByDay(int day) {
		Calendar date = Calendar.getInstance();
		date.add(Calendar.DAY_OF_MONTH, day);
		return new SimpleDateFormat(STANDARD_YEAR).format(date.getTime());
	}

	public static String getMonthByDay(int day) {
		Calendar date = Calendar.getInstance();
		date.add(Calendar.DAY_OF_MONTH, day);
		return new SimpleDateFormat(STANDARD_MONTH).format(date.getTime());
	}

	public static String getDayByDay(int day) {
		Calendar date = Calendar.getInstance();
		date.add(Calendar.DAY_OF_MONTH, day);
		return new SimpleDateFormat(STANDARD_DAY).format(date.getTime());
	}

	public static String getNextShortDate(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DAY_OF_MONTH, 1);
		return new SimpleDateFormat(STANDARD_DATE_SHORT).format(cal.getTime());
	}

	public static Date getNexDate(String dates) {
		Date date = getTimestamp4(dates);
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DAY_OF_MONTH, 1);
		return cal.getTime();
	}

	public static String getNextShortDate() {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DAY_OF_MONTH, 1);
		return new SimpleDateFormat(STANDARD_DATE_SHORT).format(cal.getTime());
	}

	public static String getNextShortDate(Date date, String format) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DAY_OF_MONTH, 1);
		return new SimpleDateFormat(format).format(cal.getTime());
	}

	public static int daysBetween(Date smdate, Date bdate) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		smdate = sdf.parse(sdf.format(smdate));
		bdate = sdf.parse(sdf.format(bdate));
		Calendar cal = Calendar.getInstance();
		cal.setTime(smdate);
		long time1 = cal.getTimeInMillis();
		cal.setTime(bdate);
		long time2 = cal.getTimeInMillis();
		long between_days = (time2 - time1) / (1000 * 3600 * 24);

		return Integer.parseInt(String.valueOf(between_days));
	}

	public static int daysOfMonth(String month) throws ParseException{
		SimpleDateFormat sdf = new SimpleDateFormat(STANDARD_MONTH_FULL) ;
		Date d = sdf.parse(month) ;
		Calendar cal = Calendar.getInstance();
		cal.setTime(d);
		int days = cal.getActualMaximum(Calendar.DAY_OF_MONTH) ;
		return days ;
	}
}
