package com.yihuacomputer.cols.common.util;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * �������ݴ�����
 * �����������Թɷ����޹�˾
 * 2016-10-24
 */


public class DataProcess
{
   //�ͷ���Դ
   public static void releaseRes(StringWriter sw, PrintWriter psw) {
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
