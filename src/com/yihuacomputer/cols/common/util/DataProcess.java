package com.yihuacomputer.cols.common.util;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * 公共数据处理类
 * 深圳怡化电脑股份有限公司
 * 2016-10-24
 */


public class DataProcess
{
   //释放资源
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
