package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.ServiceMenuDB;
import com.yihuacomputer.cols.util.DataConversion;


/**
 * ����˵�������д���
 * �����������Թɷ����޹�˾
 * 2016-11-23
 */
public class ServiceMenuArranger
{
    // ����˵���ļ�¼���ֶ���
    protected static int RECORD_FIELDNUM = 7;
    // ����˵����������
    protected ServiceMenuItem[] serviceMenu = null;
    /**
     * ���캯��
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
	// ��������
	arrange();
    }

    /**
     *��ȡ����˵����������
     */
    public ServiceMenuItem[] getServiceMenuItem()
    {
	   return serviceMenu;
    }

    /**
     * �Է���˵�����д�������
     */
    protected void arrange()
    {
		// ���ݷ�����˳�����Ҫ��ʾ�Ĳ˵�
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

		// �������Ӳ˵��븸�˵����кϲ�
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
     *�ж��Ƿ���ͬ���˵���
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
     * �������Ӳ˵��븸�˵����кϲ�
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
		      // ���������¼��˵���ʹ��ָ�򸸲˵��������¼��˵���ID��ǰ׺�滻�ɸ��˵���ID��
		      replaceChildPrefix(mi.strServiceMenuId, miTmp.strServiceMenuId);
		      break;
	        }
	    }
    }

    /**
     * ���¼��˵���ID��ǰ׺�滻�ɸ��˵���ID��
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
