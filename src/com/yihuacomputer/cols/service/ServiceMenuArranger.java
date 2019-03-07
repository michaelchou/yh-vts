package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.ServiceMenuDB;
import com.yihuacomputer.cols.util.DataConversion;


/**
 * 服务菜单组合排列处理
 * 深圳怡化电脑股份有限公司
 * 2016-11-23
 */
public class ServiceMenuArranger
{
    // 服务菜单项的记录的字段数
    protected static int RECORD_FIELDNUM = 7;
    // 服务菜单项对象数组
    protected ServiceMenuItem[] serviceMenu = null;
    /**
     * 构造函数
     */
    public ServiceMenuArranger(String[] strRecordArr)
    {
	int iNum = strRecordArr.length / RECORD_FIELDNUM;
	if (iNum > 0)
	{

		serviceMenu = new ServiceMenuItem[iNum];
	    for (int i = 0; i < iNum; i++)
	    {
	    	serviceMenu[i] = new ServiceMenuItem();
	    	serviceMenu[i].id = DataConversion.str2Int(strRecordArr[i* RECORD_FIELDNUM + 0], 0);
	    	serviceMenu[i].strServiceMenuId = strRecordArr[i * RECORD_FIELDNUM + 1];
	    	serviceMenu[i].strServiceMenuName = strRecordArr[i * RECORD_FIELDNUM + 2];
	    	serviceMenu[i].btnPos = DataConversion.str2Int(strRecordArr[i* RECORD_FIELDNUM + 3], 0);
	    	serviceMenu[i].serviceMenuType = DataConversion.str2Int(strRecordArr[i* RECORD_FIELDNUM + 4], ServiceMenuDB.SERVICEMENUTYPE_PARENTMENU);
	    	serviceMenu[i].strServiceMenuAction = strRecordArr[i * RECORD_FIELDNUM+ 5];
	    	serviceMenu[i].strServiceMenuNameEn = strRecordArr[i * RECORD_FIELDNUM + 6];
	    }
	}
	// 处理重组
	arrange();
    }

    /**
     *获取服务菜单项对象数组
     */
    public ServiceMenuItem[] getServiceMenuItem()
    {
	   return serviceMenu;
    }

    /**
     * 对服务菜单项进行处理重组
     */
    protected void arrange()
    {
		// 根据服务过滤出所有要显示的菜单
		for (int i = 0; i < serviceMenu.length; i++)
		{
		    if (serviceMenu[i].serviceMenuType != ServiceMenuDB.SERVICEMENUTYPE_PARENTMENU && serviceMenu[i].strServiceMenuId.length() > 0)
		    {
			    for (int j = 0; j < serviceMenu.length; j++)
			    {
			        if (serviceMenu[j].strServiceMenuId.length() > 0 && serviceMenu[i].strServiceMenuId == serviceMenu[j].strServiceMenuId){
			        	serviceMenu[j].bShow = true;
			        }
			    }
		    }
		}

		// 将独个子菜单与父菜单进行合并
		for (int i = 0; i < serviceMenu.length; i++)
		{
		    if (serviceMenu[i].bShow && serviceMenu[i].strServiceMenuId.length() > 1)
		    {
			   if (!isHasSibling(i)){
				   replaceParentItem(i);
			   }
		    }
		}
    }

    /**
     *判断是否有同级菜单项
     */
    private boolean isHasSibling(int index)
    {
	    ServiceMenuItem mi = serviceMenu[index];
	    for (index = 0; index < serviceMenu.length; index++)
	    {
	         ServiceMenuItem miTmp = serviceMenu[index];
	         if (miTmp.bShow && mi != miTmp && mi.strServiceMenuId == miTmp.strServiceMenuId)
	         {
		       return true;
	         }
	    }
	    return false;
    }

    /**
     * 将独个子菜单与父菜单进行合并
     */
    private void replaceParentItem(int index)
    {
	   ServiceMenuItem mi = serviceMenu[index];
	   mi.bShow = false;
	   for (index = 0; index < serviceMenu.length; index++)
	   {
	       ServiceMenuItem miTmp = serviceMenu[index];
	       if (miTmp.bShow && mi != miTmp && mi.strServiceMenuId == miTmp.strServiceMenuId)
	       {
		      miTmp.strServiceMenuAction = mi.strServiceMenuAction;
		      miTmp.strServiceMenuName = mi.strServiceMenuName;
		      miTmp.strServiceMenuNameEn = mi.strServiceMenuNameEn;
		      // 提升所有下级菜单，使其指向父菜单，即将下级菜单的ID的前缀替换成父菜单的ID。
		      replaceChildPrefix(mi.strServiceMenuId, miTmp.strServiceMenuId);
		      break;
	        }
	    }
    }

    /**
     * 将下级菜单的ID的前缀替换成父菜单的ID。
    */
    private void replaceChildPrefix(String strOldPre, String strNewPre)
    {
	   for (int i = 0; i < serviceMenu.length; i++)
	   {
	      ServiceMenuItem mi = serviceMenu[i];
	      if (mi.bShow)
	      {
		    if (mi.strServiceMenuId.length() > strOldPre.length())
		    {
		      if (mi.strServiceMenuId == strOldPre)
		      {
		    	  if (mi.strServiceMenuId == strOldPre) mi.strServiceMenuId = strNewPre;
		      }
		    }
	      }
	   }
    }
}
