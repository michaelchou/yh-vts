package com.yihuacomputer.cols.entity;
/**
 * 主机返回码对照表对象
 * 深圳怡化电脑股份有限公司
 * 2017-05-05
 */
public class HostRetCode
{
   private int id;                //id号
   private String strHostRetCode; //主机返回码
   private String strHostRetDesc; //主机返回码描述

   public int getId() {
	   return id;
   }
   public void setId(int id) {
	   this.id = id;
   }
   public String getStrHostRetCode() {
	   return strHostRetCode;
   }
   public void setStrHostRetCode(String strHostRetCode) {
	   this.strHostRetCode = strHostRetCode;
   }
   public String getStrHostRetDesc() {
	   return strHostRetDesc;
   }
   public void setStrHostRetDesc(String strHostRetDesc) {
	   this.strHostRetDesc = strHostRetDesc;
   }
}
