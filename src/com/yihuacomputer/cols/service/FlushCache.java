package com.yihuacomputer.cols.service;

import java.util.Iterator;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.log4j.Logger;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.BankDB;
import com.yihuacomputer.cols.database.BranchMapDB;
import com.yihuacomputer.cols.database.BrunchRegisterDB;
import com.yihuacomputer.cols.database.CardTypeServiceDB;
import com.yihuacomputer.cols.database.CityDB;
import com.yihuacomputer.cols.database.DevManuDB;
import com.yihuacomputer.cols.database.DevModelDB;
import com.yihuacomputer.cols.database.DevModelModuleDB;
import com.yihuacomputer.cols.database.DevTypeDB;
import com.yihuacomputer.cols.database.HostRetCodeDB;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.database.ModuleDB;
import com.yihuacomputer.cols.database.OrgDB;
import com.yihuacomputer.cols.database.PadCheckDB;
import com.yihuacomputer.cols.database.ProvinceDB;
import com.yihuacomputer.cols.database.RouteBankDB;
import com.yihuacomputer.cols.database.ServiceMenuDB;
import com.yihuacomputer.cols.database.TemplateMenuDB;
import com.yihuacomputer.cols.database.TemplateMenuRelationDB;
import com.yihuacomputer.cols.database.TerminalDB;
import com.yihuacomputer.cols.database.TerminalModuleDB;
import com.yihuacomputer.cols.database.TerminalServiceDB;
import com.yihuacomputer.cols.database.TrialDB;
import com.yihuacomputer.cols.entity.Bank;
import com.yihuacomputer.cols.entity.CardTypeService;
import com.yihuacomputer.cols.entity.City;
import com.yihuacomputer.cols.entity.DevManu;
import com.yihuacomputer.cols.entity.DevModel;
import com.yihuacomputer.cols.entity.DevModelModule;
import com.yihuacomputer.cols.entity.DevType;
import com.yihuacomputer.cols.entity.Misc;
import com.yihuacomputer.cols.entity.Module;
import com.yihuacomputer.cols.entity.Org;
import com.yihuacomputer.cols.entity.Province;
import com.yihuacomputer.cols.entity.ServiceMenu;
import com.yihuacomputer.cols.entity.TemplateMenu;
import com.yihuacomputer.cols.entity.TemplateMenuRelation;
import com.yihuacomputer.cols.entity.Terminal;
import com.yihuacomputer.cols.entity.TerminalModule;
import com.yihuacomputer.cols.entity.TerminalService;
import com.yihuacomputer.cols.entity.Trial;
import com.yihuacomputer.cols.util.DateCtrl;


/**
 * ���¹ܿ�̨���ݲ�ˢ�»���
 */
public class FlushCache
{
	public static Logger logErr = Logger.getLogger("Error");
	//����
	private static String strTableName="";
	//����ʲô�ֶ�ˢ��
	private static String strKey="";
	//����ʲôֵˢ��
	private static String strValue="";
    // �ն˷�����
    private static String strTermRetCode = "false";
    // ��������
    private static String strTermRetDesc = "";
    //����ͬ�����
    private static boolean isOK = false;

    public FlushCache()
    {
    }

    public static String onFlushCache(String msg)
    {
       //����
       strTableName="";
       //����ʲô�ֶ�ˢ��
       strKey="";
       //����ʲôֵˢ��
       strValue= "";
       //��һ�����ȴ�������
       isOK = doDataProcess(msg);
       if(isOK){
    	   //�ڶ���:��ˢ�»���
    	   String strUrl="MsgType=RefreshBuf&strTableName="+strTableName+"&strKey="+strKey+"&strValue="+strValue;
    	   if (broadcastFlushSession(strUrl))
    	   {
    		   System.out.println("RetCode=true&RetDesc=ˢ�»���ɹ�");
    		   return "RetCode=true&RetDesc=ˢ�»���ɹ�";
    	   }
    	   else{
    		   System.out.println("RetCode=false&RetDesc=ˢ�»���ʧ��");
    	       return "RetCode=false&RetDesc=ˢ�»���ʧ��";
    	   }
       }else{
    	   System.out.println("RetCode=false&RetDesc=���ݴ���ʧ��");
    	   return "RetCode=false&RetDesc=���ݴ���ʧ��";
       }
    }

    /**
     * ˢ�»��棬��֪ͨ��ش���
    */
    public int process(String strMsgInfo)
    {
    	boolean bRet = doProcess(strMsgInfo);
	    if (!bRet)
	    {
	       strTermRetCode = "false";
	       strTermRetDesc = Processor.TERMRETDESC_INNERR;
	       return Processor.PROCESS_FAILED;
	     }
	     else
	     {
	       strTermRetCode = "true";
	       strTermRetDesc = Processor.TERMRETDESC_SUCCEED;
	       return Processor.PROCESS_SUCCEED;
	     }
    }
    /**
     * ���ݴ���
    */
    @SuppressWarnings({ "rawtypes" })
	public static boolean doDataProcess(String strTransMsg)
    {
      boolean bRet = false;
      JSONObject jsonObj = JSONObject.fromObject(strTransMsg);
      Iterator it = jsonObj.keys();
      while(it.hasNext()){
    	  String key = (String)it.next();
 		  String value = jsonObj.getString(key);
 		  if(key.equals("tableName")){//ȡ������
 			// ����Ϊ��
 			if (value == null || value.length() == 0) {
 				return false;
 			}else{
 				strTableName = value;
 			}
 		  }
 		  else if(key.equals("changes")){//���ӡ��޸ĵ�����
 			 JSONArray jsonArray = jsonObj.getJSONArray(key);
 			 for (int i = 0; i < jsonArray.size(); i++) {
 				JSONObject dataObject = jsonArray.getJSONObject(i);
 				int id = dataObject.getInt("id");
 			    if(String.valueOf(id)== null || String.valueOf(id).equals("")){
 			    	return false;
 			    }else{//���ӡ��޸�����
 			    	if(strTableName.equals("Sm_Org")){//������
 			    		bRet = changeSm_Org(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Its_Misc")){//������
 			    		bRet = changeIts_Misc(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Exper_Device")){//ʹ���豸��
 			    		bRet = changeExper_Device(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Module")){//�豸ģ���
 			    		bRet = changeDev_Module(id,dataObject);
 	 				}
 			    	else if(strTableName.equals("Service_Menu")){//�˵���
 			    		bRet = changeService_Menu(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Info")){//�ն˱�
 			    		bRet = changeDev_Info(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Vendor")){//�豸Ʒ�Ʊ�
 			    		bRet = changeDev_Vendor(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Type")){//�豸�ͺű�
 			    		bRet = changeDev_Type(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Catalog")){//�豸���ͱ�
 			    		bRet = changeDev_Catalog(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_AtmType_Module")){//�ͺ�ģ�������
 			    		bRet = changeDev_AtmType_Module(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Moudle_Relation")){//�豸ģ�������
 			    		bRet = changeDev_Moudle_Relation(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Template_Menu")){//�˵�ģ���
 			    		bRet = changeTemplate_Menu(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Template_Menu_Relation")){//�˵���ģ�������
 			    		bRet = changeTemplate_Menu_Relation(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Device_Template_Menu_Relation")){//�ն˷����
 			    		bRet = changeDevice_Template_Menu_Relation(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("ITS_BANK")){//���б�
 			    		bRet = changeITS_BANK(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("ITS_PROVINCE")){//ʡ�ݱ�
 			    		bRet = changeITS_PROVINCE(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("ITS_CITY_COUNTY")){//���б�
 			    		bRet = changeITS_CITY_COUNTY(id,dataObject);
 			    	}
 			    }
 			 }
 		  }
 		  else if(key.equals("removes")){//ɾ��������
 			 JSONArray jsonArray = jsonObj.getJSONArray(key);
 			 for (int i = 0; i < jsonArray.size(); i++) {
 				JSONObject dataObject = jsonArray.getJSONObject(i);
 				int id = dataObject.getInt("id");
 				if(String.valueOf(id)== null || String.valueOf(id).equals("")){
 			    	return false;
 			    }else{//ɾ������
 			    	if(strTableName.equals("Sm_Org")){//������
 	 			    	System.out.println("--------ɾ����¼��Org��---------");
 	 			    	bRet = new OrgDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Its_Misc")){//������
 			    		System.out.println("--------ɾ����¼��Misc��---------");
 	 			    	bRet = new MiscDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Exper_Device")){//�豸�����б�
 			    		System.out.println("--------ɾ����¼��Trial��---------");
 	 			    	bRet = new TrialDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Module")){//�豸ģ���
 			    		System.out.println("--------ɾ����¼��Module��---------");
 	 			    	bRet = new ModuleDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Service_Menu")){//�˵���
 			    		System.out.println("--------ɾ����¼��ServiceMenu��---------");
	 			    	ServiceMenu serviceMenu = new ServiceMenuDB().getServiceInfo(id);
 	 			    	bRet = new ServiceMenuDB().delete(id);
 	 			    	if(bRet){
 	 			    		if(serviceMenu != null ){
 	 			    		    new CardTypeServiceDB().delete(id);
 	 			    		}
 	 			    	}
 			    	}
 			    	else if(strTableName.equals("Dev_Info")){//�ն˱�
 			    		System.out.println("--------ɾ����¼��Terminal��---------");
 	 			    	bRet = new TerminalDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Vendor")){//�豸Ʒ�Ʊ�
 			    		System.out.println("--------ɾ����¼��DevManu��---------");
 	 			    	bRet = new DevManuDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Type")){//�豸�ͺű�
 			    		System.out.println("--------ɾ����¼��DevModel��---------");
 	 			    	bRet = new DevModelDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Catalog")){//�豸���ͱ�
 			    		System.out.println("--------ɾ����¼��DevType��---------");
 	 			    	bRet = new DevTypeDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_AtmType_Module")){//�ͺ�ģ�������
 			    		System.out.println("--------ɾ����¼��DevModelModule��---------");
 	 			    	bRet = new DevModelModuleDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Moudle_Relation")){//�豸ģ�������
 			    		System.out.println("--------ɾ����¼��TerminalModule��---------");
 	 			    	bRet = new TerminalModuleDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Template_Menu")){//�˵�ģ���
 			    		System.out.println("--------ɾ����¼��TemplateMenu��---------");
 	 			    	bRet = new TemplateMenuDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Template_Menu_Relation")){//�˵���ģ�������
 			    		System.out.println("--------ɾ����¼��TemplateMenuRelation��---------");
 	 			    	bRet = new TemplateMenuRelationDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Device_Template_Menu_Relation")){//�˵���ģ�������
 			    		System.out.println("--------ɾ����¼��TerminalService��---------");
 	 			    	bRet = new TerminalServiceDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("ITS_BANK")){//���б�
 			    		System.out.println("--------ɾ����¼��Bank��---------");
 	 			    	bRet = new BankDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("ITS_PROVINCE")){//ʡ�ݱ�
 			    		System.out.println("--------ɾ����¼��Province��---------");
 	 			    	bRet = new ProvinceDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("ITS_CITY_COUNTY")){//���б�
 			    		System.out.println("--------ɾ����¼��City��---------");
 	 			    	bRet = new CityDB().delete(id);
 			    	}
 			    }
 			 }
 		  }
      }
	  return bRet;
    }

    /**
     * ������changeSm_Org
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeSm_Org(int id,JSONObject dataObject){
    	boolean bRet =false;
    	//������
 		Org org = new OrgDB().getOrgInfoNoCache(id);
 		if(org == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(Sm_org)---------");
 			Org bean = new Org();
 			bean.setId(id);
 			bean.setStrParentOrgCode(dataObject.getString("parentOrgCode"));
 			if(dataObject.getString("orgNum").equals("00000")){
 				bean.setStrOrgNum("00001");
 			}
 			else
 			{
 			    bean.setStrOrgNum(dataObject.getString("orgNum"));
 			}
 			bean.setStrOrgName(dataObject.getString("orgName"));
	    		bRet = new OrgDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(Sm_org)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+org.getStrOrgName());
 			org.setStrParentOrgCode(dataObject.getString("parentOrgCode"));
 			if(dataObject.getString("orgNum").equals("00000")){
 				org.setStrOrgNum("00001");
 			}
 			else
 			{
 				org.setStrOrgNum(dataObject.getString("orgNum"));
 			}
	    		org.setStrOrgName(dataObject.getString("orgName"));
	    		bRet = new OrgDB().Update(org);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
 		return bRet;
    }


    /**
     * ������changeIts_Misc
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeIts_Misc(int id,JSONObject dataObject){
    	boolean bRet = false;
    	//������
 		Misc misc = new MiscDB().getMiscByIdNoCache(id);
 		if(misc == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(Its_Misc)---------");
 			Misc bean = new Misc();
 			bean.setId(id);
 			bean.setStrName(dataObject.getString("strName"));
 			bean.setStrValue(dataObject.getString("strValue"));
 			bean.setStrDesc(dataObject.getString("strDesc"));
 			if(dataObject.getString("strOrgNum").equals("00000")){
 				bean.setStrOrgNum("00001");
 			}
 			else
 			{
	    			bean.setStrOrgNum(dataObject.getString("strOrgNum"));
 			}
	    		bRet = new MiscDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(Its_Misc)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+misc.getStrValue());
 			misc.setStrName(dataObject.getString("strName"));
 			misc.setStrValue(dataObject.getString("strValue"));
 			misc.setStrDesc(dataObject.getString("strDesc"));
 			if(dataObject.getString("strOrgNum").equals("00000")){
 				misc.setStrOrgNum("00001");
 			}
 			else
 			{
 				misc.setStrOrgNum(dataObject.getString("strOrgNum"));
 			}
	    		bRet = new MiscDB().Update(misc);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
		return bRet;
    }

    /**
     * �豸���ñ�
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeExper_Device(int id,JSONObject dataObject){
    	boolean bRet = false;
 		Trial trial = new TrialDB().getTrialInfoNoCache(id);
 		if(trial == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(Trial)---------");
 			Trial bean = new Trial();
 			bean.setId(id);
 			bean.setStrTerminalNum(dataObject.getString("strTerminalNum"));
	    		bRet = new TrialDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(Trial)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+trial.getStrTerminalNum());
 			trial.setStrTerminalNum(dataObject.getString("strTerminalNum"));
	    		bRet = new TrialDB().Update(trial);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}

    	return bRet;
    }

    /**
     * �豸ģ���
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Module(int id,JSONObject dataObject){
    	boolean bRet = false;
    	Module module = new ModuleDB().getModuleInfoNoCache(id);
 		if(module == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(Module)---------");
 			Module bean = new Module();
 			bean.setId(id);
 			bean.setStrModuleName(dataObject.getString("strModuleName"));
 			bean.setStrModuleClsid(dataObject.getString("strModuleClsid"));
 			bean.setStrModuleDesc(dataObject.getString("strModuleDesc"));
	    		bRet = new ModuleDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(Module)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+module.getStrModuleName());
 			module.setStrModuleName(dataObject.getString("strModuleName"));
 			module.setStrModuleClsid(dataObject.getString("strModuleClsid"));
 			module.setStrModuleDesc(dataObject.getString("strModuleDesc"));
	    		bRet = new ModuleDB().Update(module);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * �˵���
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeService_Menu(int id,JSONObject dataObject){
    	boolean bRet = false;
 		ServiceMenu serviceMenu = new ServiceMenuDB().getServiceInfoNoCache(id);
 		if(serviceMenu == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(ServiceMenu)---------");
 			ServiceMenu bean = new ServiceMenu();
 			bean.setId(id);
 			bean.setServiceMenuId(Integer.parseInt(dataObject.getString("iServiceMenuId")));
 			bean.setStrServiceMenuName(dataObject.getString("strServiceMenuName"));
 			bean.setStrServiceMenuNameEn(dataObject.getString("strServiceMenuNameEn"));
 			bean.setBtnPos(Integer.parseInt(dataObject.getString("iBtnPos")));
 			bean.setServiceMenuType(Integer.parseInt(dataObject.getString("iServiceMenuType")));
 			bean.setStrServiceMenuAction(dataObject.getString("strServiceMenuAction"));
 			if(dataObject.getString("strOrgNum").equals("00000")){
 				bean.setStrOrgNum("00001");
 			}
 			else
 			{
	    			bean.setStrOrgNum(dataObject.getString("strOrgNum"));
 			}
 			bean.setStrCardType(dataObject.getString("strCardType"));
	    		bRet = new ServiceMenuDB().save(bean);

	    		if(bRet){
		    		//����ѡ��Ŀ����ͣ�����ͬ���������Ͷ�Ӧ�Ĳ˵�����
                String strCardType = dataObject.getString("strCardType");//0��ȫ��  1����ǿ�  3�����ÿ�
                if(strCardType != null && strCardType.equals("0")){
                	CardTypeService  entity = new CardTypeService();
                	entity.setId(id);
                	entity.setStrCardType("1");//ת�ɱ�ϵͳ�Ŀ����� 1����ǿ� 3�����ÿ�
                	entity.setServiceMenuId(id);
                	new CardTypeServiceDB().save(entity);
                	CardTypeService entity2 = new CardTypeService();
                	entity2.setId(id+5000);
                	entity2.setStrCardType("3");//ת�ɱ�ϵͳ�Ŀ����� 1����ǿ� 3�����ÿ�
                	entity2.setServiceMenuId(id);
                	new CardTypeServiceDB().save(entity2);
                }
                else if(strCardType != null && strCardType.equals("1")){
                	CardTypeService  entity = new CardTypeService();
                	entity.setId(id);
                	entity.setStrCardType("1");//ת�ɱ�ϵͳ�Ŀ����� 1����ǿ� 3�����ÿ�
                	entity.setServiceMenuId(id);
                	new CardTypeServiceDB().save(entity);
                }
                else if(strCardType != null && strCardType.equals("3")){

                	CardTypeService  entity = new CardTypeService();
                	entity.setStrCardType("3");//ת�ɱ�ϵͳ�Ŀ����� 1����ǿ� 3�����ÿ�
                	entity.setId(id);
                	entity.setServiceMenuId(id);
                	new CardTypeServiceDB().save(entity);
                }
	    		}
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(ServiceMenu)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+serviceMenu.getStrServiceMenuName());
 			serviceMenu.setServiceMenuId(Integer.parseInt(dataObject.getString("iServiceMenuId")));
 			serviceMenu.setStrServiceMenuName(dataObject.getString("strServiceMenuName"));
 			serviceMenu.setStrServiceMenuNameEn(dataObject.getString("strServiceMenuNameEn"));
 			serviceMenu.setBtnPos(Integer.parseInt(dataObject.getString("iBtnPos")));
 			serviceMenu.setServiceMenuType(Integer.parseInt(dataObject.getString("iServiceMenuType")));
 			serviceMenu.setStrServiceMenuAction(dataObject.getString("strServiceMenuAction"));
 			if(dataObject.getString("strOrgNum").equals("00000")){
 				serviceMenu.setStrOrgNum("00001");
 			}
 			else
 			{
	    			serviceMenu.setStrOrgNum(dataObject.getString("strOrgNum"));
 			}
 			serviceMenu.setStrCardType(dataObject.getString("strCardType"));
	    		bRet = new ServiceMenuDB().Update(serviceMenu);
	    		strKey = "id";
	    		strValue = strValue +id +",";
	    		if(bRet){
	      		    //����ѡ��Ŀ����ͣ�����ͬ���������Ͷ�Ӧ�Ĳ˵�����
                String strCardType = dataObject.getString("strCardType");//0��ȫ��  1����ǿ�  3�����ÿ�
                bRet = new CardTypeServiceDB().delete(serviceMenu.getId());//��ɾ����¼
                if(bRet){
                	if(strCardType != null && strCardType.equals("0")){
                    	CardTypeService  entity = new CardTypeService();
                    	entity.setId(id);
                    	entity.setStrCardType("1");//ת�ɱ�ϵͳ�Ŀ����� 1����ǿ� 3�����ÿ�
                    	entity.setServiceMenuId(serviceMenu.getId());
                    	new CardTypeServiceDB().save(entity);
                    	CardTypeService entity2 = new CardTypeService();
                    	entity2.setId(id+5000);
                    	entity2.setStrCardType("3");//ת�ɱ�ϵͳ�Ŀ����� 1����ǿ� 3�����ÿ�
                    	entity2.setServiceMenuId(serviceMenu.getId());
                    	new CardTypeServiceDB().save(entity2);
                    }
                    else if(strCardType != null && strCardType.equals("1")){
                    	CardTypeService  entity = new CardTypeService();
                    	entity.setId(id);
                    	entity.setStrCardType("1");//ת�ɱ�ϵͳ�Ŀ����� 1����ǿ� 3�����ÿ�
                    	entity.setServiceMenuId(serviceMenu.getId());
                    	new CardTypeServiceDB().save(entity);
                    }
                    else if(strCardType != null && strCardType.equals("3")){
                    	CardTypeService  entity = new CardTypeService();
                    	entity.setId(id);
                    	entity.setStrCardType("3");//ת�ɱ�ϵͳ�Ŀ����� 1����ǿ� 3�����ÿ�
                    	entity.setServiceMenuId(serviceMenu.getId());
                    	new CardTypeServiceDB().save(entity);
                    }
                }
	    		}
 		}
    	return bRet;
    }

    /**
     * �ն˱�
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Info(int id,JSONObject dataObject){
    	boolean bRet = false;
 		Terminal terminal = new TerminalDB().getEntityByIdNoCache(id);
 		if(terminal == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(Terminal)---------");
 			Terminal bean = new Terminal();
 			bean.setId(id);
 			if(dataObject.getString("orgNum").equals("00000")){
 				bean.setStrOrgNum("00001");
 			}
 			else
 			{
 				bean.setStrOrgNum(dataObject.getString("orgNum"));
 			}
 			bean.setStrParentOrgNum(dataObject.getString("parentOrgNum"));
 			bean.setStrTerminalNum(dataObject.getString("strTerminalNum"));
 			bean.setStrTellerNum(dataObject.getString("strTerminalNum"));
 			bean.setStrNetAddr(dataObject.getString("strNetAddr"));
 			bean.setStatus(Integer.parseInt(dataObject.getString("iStatus")));
 			bean.setStrTerminalStyle(dataObject.getString("strTerminalStyle"));
 			bean.setStrTerminalAddr(dataObject.getString("strTerminalAddr"));
 			bean.setStrDevSn(dataObject.getString("strDevSn"));
 			bean.setDevModel(Integer.parseInt(dataObject.getString("iDevModel")));
 			bean.setDevManu(Integer.parseInt(dataObject.getString("iDevManu")));
 			bean.setDevType(Integer.parseInt(dataObject.getString("iDevType")));
 			bean.setDtStart(new DateCtrl().getTimestamp());
 			bean.setStrMemo(dataObject.getString("strMemo"));
	    		bRet = new TerminalDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(Terminal)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+terminal.getStrTerminalNum());
 			if(dataObject.getString("orgNum").equals("00000")){
 				terminal.setStrOrgNum("00001");
 			}
 			else
 			{
 				terminal.setStrOrgNum(dataObject.getString("orgNum"));
 			}
 			terminal.setStrParentOrgNum(dataObject.getString("parentOrgNum"));
 			terminal.setStrTerminalNum(dataObject.getString("strTerminalNum"));
 			terminal.setStrTellerNum(dataObject.getString("strTerminalNum"));
 			terminal.setStrNetAddr(dataObject.getString("strNetAddr"));
 			terminal.setStrTerminalStyle(dataObject.getString("strTerminalStyle"));
 			terminal.setStrTerminalAddr(dataObject.getString("strTerminalAddr"));
 			terminal.setStrDevSn(dataObject.getString("strDevSn"));
 			terminal.setDevModel(Integer.parseInt(dataObject.getString("iDevModel")));
 			terminal.setDevManu(Integer.parseInt(dataObject.getString("iDevManu")));
 			terminal.setDevType(Integer.parseInt(dataObject.getString("iDevType")));
 			terminal.setStrMemo(dataObject.getString("strMemo"));
 			if(dataObject.getString("iStatus") != null && !dataObject.getString("iStatus").equals("")){
	    			if(terminal.getStatus() != Integer.parseInt(dataObject.getString("iStatus"))){//��״̬�б仯ʱ
                   if(Integer.parseInt(dataObject.getString("iStatus")) == 1){// 1����ͨ
                	   terminal.setDtStart(new DateCtrl().getTimestamp());//�޸Ŀ�ͨʱ��
                	   terminal.setDtEnd(null);
                   }
                   else if(Integer.parseInt(dataObject.getString("iStatus")) == 2){// 2��ͣ��
                	   terminal.setDtEnd(new DateCtrl().getTimestamp());//�޸�ͣ��ʱ��
                   }
	    			}
 			}
 			terminal.setStatus(Integer.parseInt(dataObject.getString("iStatus")));
	    		bRet = new TerminalDB().Update(terminal);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * �豸Ʒ�Ʊ�
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Vendor(int id,JSONObject dataObject){
    	boolean bRet = false;
 		DevManu devManu = new DevManuDB().getDevManuByIdNoCache(id);
 		if(devManu == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(DevManu)---------");
 			DevManu bean = new DevManu();
 			bean.setId(id);
 			bean.setStrDevManuName(dataObject.getString("name"));
	    		bRet = new DevManuDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(DevManu)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+devManu.getStrDevManuName());
 			devManu.setStrDevManuName(dataObject.getString("name"));
	    		bRet = new DevManuDB().Update(devManu);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * �豸�ͺű�
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Type(int id,JSONObject dataObject){
    	boolean bRet = false;
 		DevModel devModel = new DevModelDB().getDevModelByIdNoCache(id);
 		if(devModel == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(DevModel)---------");
 			DevModel bean = new DevModel();
 			bean.setId(id);
 			bean.setDevManuId(Integer.parseInt(dataObject.getString("iDevManuId")));
 			bean.setStrDevModelName(dataObject.getString("iDevTypeName"));
	    		bRet = new DevModelDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(DevModel)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+devModel.getStrDevModelName());
 			devModel.setDevManuId(Integer.parseInt(dataObject.getString("iDevManuId")));
 			devModel.setStrDevModelName(dataObject.getString("iDevTypeName"));
	    		bRet = new DevModelDB().Update(devModel);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}

    	return bRet;
    }

    /**
     * �豸���ͱ�
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Catalog(int id,JSONObject dataObject){
    	boolean bRet = false;

 		DevType devType = new DevTypeDB().getDevTypeByIdNoCache(id);
 		if(devType == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(DevType)---------");
 			DevType bean = new DevType();
 			bean.setId(id);
 			bean.setStrDevTypeName(dataObject.getString("name"));
	    		bRet = new DevTypeDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(DevType)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+devType.getStrDevTypeName());
 			devType.setStrDevTypeName(dataObject.getString("name"));
	    		bRet = new DevTypeDB().Update(devType);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}

    	return bRet;
    }

    /**
     * �ͺ�ģ�������
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_AtmType_Module(int id,JSONObject dataObject){
    	boolean bRet = false;
 		DevModelModule devModelModule = new DevModelModuleDB().getDevModelModuleByIdNoCache(id);
 		if(devModelModule == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(DevModelModule)---------");
 			DevModelModule bean = new DevModelModule();
 			bean.setId(id);
 			bean.setDevModelId(Integer.parseInt(dataObject.getString("iDevTypeId")));
 			bean.setModuleId(Integer.parseInt(dataObject.getString("iModuleId")));
	    		bRet = new DevModelModuleDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(DevModelModule)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+devModelModule.getId());
 			devModelModule.setDevModelId(Integer.parseInt(dataObject.getString("iDevTypeId")));
 			devModelModule.setModuleId(Integer.parseInt(dataObject.getString("iModuleId")));
	    		bRet = new DevModelModuleDB().Update(devModelModule);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * �豸ģ�������
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Moudle_Relation(int id,JSONObject dataObject){
    	boolean bRet = false;
 		TerminalModule terminalModule = new TerminalModuleDB().getTerminalModuleByIdNoCache(id);
 		if(terminalModule == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(TerminalModule)---------");
 			TerminalModule bean = new TerminalModule();
 			bean.setId(id);
 			bean.setTerminalId(Integer.parseInt(dataObject.getString("deviceId")));
 			bean.setModuleId(Integer.parseInt(dataObject.getString("moduleId")));
 			bean.setModuleFlag(Integer.parseInt(dataObject.getString("isable")));
	    		bRet = new TerminalModuleDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(TerminalModule)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+terminalModule.getId());
 			terminalModule.setTerminalId(Integer.parseInt(dataObject.getString("deviceId")));
 			terminalModule.setModuleId(Integer.parseInt(dataObject.getString("moduleId")));
 			terminalModule.setModuleFlag(Integer.parseInt(dataObject.getString("isable")));
	    		bRet = new TerminalModuleDB().Update(terminalModule);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * �˵�ģ���
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeTemplate_Menu(int id,JSONObject dataObject){
    	boolean bRet = false;
 		TemplateMenu templateMenu = new TemplateMenuDB().getTemplateMenuByIdNoCache(id);
 		if(templateMenu == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(TemplateMenu)---------");
 			TemplateMenu bean = new TemplateMenu();
 			bean.setId(id);
 			bean.setStrTemplateName(dataObject.getString("templateName"));
 			bean.setStrDescription(dataObject.getString("description"));
	    		bRet = new TemplateMenuDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(TemplateMenu)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+templateMenu.getStrTemplateName());
 			templateMenu.setStrTemplateName(dataObject.getString("templateName"));
 			templateMenu.setStrDescription(dataObject.getString("description"));
	    		bRet = new TemplateMenuDB().Update(templateMenu);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * �˵���ģ�������
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeTemplate_Menu_Relation(int id,JSONObject dataObject){
    	boolean bRet = false;
 		TemplateMenuRelation templateMenuRelation = new TemplateMenuRelationDB().getTemplateMenuRelationByIdNoCache(id);
 		if(templateMenuRelation == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(TemplateMenuRelation)---------");
 			TemplateMenuRelation bean = new TemplateMenuRelation();
 			bean.setId(id);
 			bean.setTemplateId(Integer.parseInt(dataObject.getString("templateId")));
 			bean.setServiceMenuId(Integer.parseInt(dataObject.getString("menuId")));
	    		bRet = new TemplateMenuRelationDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(TemplateMenuRelation)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+templateMenuRelation.getTemplateId());
 			templateMenuRelation.setTemplateId(Integer.parseInt(dataObject.getString("templateId")));
 			templateMenuRelation.setServiceMenuId(Integer.parseInt(dataObject.getString("menuId")));
	    		bRet = new TemplateMenuRelationDB().Update(templateMenuRelation);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * �ն˷����
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDevice_Template_Menu_Relation(int id,JSONObject dataObject){
    	boolean bRet = false;
 		TerminalService terminalService = new TerminalServiceDB().getTerminalServiceByIdNoCache(id);
 		if(terminalService == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(TerminalService)---------");
 			TerminalService bean = new TerminalService();
 			bean.setId(id);
 			bean.setTerminalId(Integer.parseInt(dataObject.getString("deviceId")));
 			bean.setTemplateId(Integer.parseInt(dataObject.getString("templateId")));
	    		bRet = new TerminalServiceDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(TerminalService)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+terminalService.getId());
 			terminalService.setTerminalId(Integer.parseInt(dataObject.getString("deviceId")));
 			terminalService.setTemplateId(Integer.parseInt(dataObject.getString("templateId")));
	    		bRet = new TerminalServiceDB().Update(terminalService);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * ���б�
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeITS_BANK(int id,JSONObject dataObject){
    	boolean bRet = false;
 		Bank bank = new BankDB().getBankByIdNoCache(id);
 		if(bank == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(Bank)---------");
 			Bank bean = new Bank();
 			bean.setId(id);
 			bean.setStrBankCode(dataObject.getString("code"));
 			bean.setStrBankName(dataObject.getString("name"));
	    		bRet = new BankDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(Bank)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+bank.getStrBankName());
 			bank.setStrBankCode(dataObject.getString("code"));
 			bank.setStrBankName(dataObject.getString("name"));
	    		bRet = new BankDB().Update(bank);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * ʡ�ݱ�
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeITS_PROVINCE(int id,JSONObject dataObject){
    	boolean bRet = false;
 		Province province = new ProvinceDB().getProvinceByIdNoCache(id);
 		if(province == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(Province)---------");
 			Province bean = new Province();
 			bean.setId(id);
 			bean.setStrProvinceCode(dataObject.getString("code"));
 			bean.setStrProvinceName(dataObject.getString("name"));
	    		bRet = new ProvinceDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(Province)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+province.getStrProvinceName());
 			province.setStrProvinceCode(dataObject.getString("code"));
 			province.setStrProvinceName(dataObject.getString("name"));
	    		bRet = new ProvinceDB().Update(province);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * ���б�
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeITS_CITY_COUNTY(int id,JSONObject dataObject){
    	boolean bRet = false;
 		City city = new CityDB().getCityByIdNoCache(id);
 		if(city == null){//�޼�¼�����Ӵ���
 			System.out.println("--------���Ӽ�¼(City)---------");
 			City bean = new City();
 			bean.setId(id);
 			bean.setStrProvinceCode(dataObject.getString("pcode"));
 			bean.setStrCityCode(dataObject.getString("code"));
 			bean.setStrCityName(dataObject.getString("name"));
	    		bRet = new CityDB().save(bean);
 		}
 		else{//�޸ļ�¼
 			System.out.println("--------�޸ļ�¼(City)---------");
 			System.out.println("--------�޸�ǰ��¼:---------:"+city.getStrCityName());
 			city.setStrProvinceCode(dataObject.getString("pcode"));
 			city.setStrCityCode(dataObject.getString("code"));
 			city.setStrCityName(dataObject.getString("name"));
	    		bRet = new CityDB().Update(city);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * ˢ�»���
    */
	public boolean doProcess(String strMsgInfo)
    {
	  // ��һ�����ֽ⽻��������Ϣ
	  ColsTransMsg msg = new ColsTransMsg(strMsgInfo);
	  strTableName = msg.get("strTableName").trim();
	  strKey = msg.get("strKey").trim();
      strValue = msg.get("strValue").trim();
      boolean bRet = false;
      if(strTableName.equals("Sm_Org")){//������
         if(strKey.equals("id")){//��idˢ�»���
        	 if(strValue !=null && strValue.length()>1){
        		 String[] values = strValue.split(",");
        		 if(values.length > 0){
                     for(int i=0;i<values.length;i++){
                    	 bRet = new OrgDB().FlushSession(Integer.parseInt(values[i]));
                     }
        		 }
        	 }
         }else{//����ˢ��
        	 bRet = new OrgDB().FlushSession();
         }
      }
      else if(strTableName.equals("Its_Misc")){//������
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new MiscDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new MiscDB().FlushSession();
          }
       }
      else if(strTableName.equals("Exper_Device")){//�豸���ñ�
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TrialDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new TrialDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Module")){//�豸ģ���
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new ModuleDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new ModuleDB().FlushSession();
          }
      }
      else if(strTableName.equals("Service_Menu")){//����˵���
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new ServiceMenuDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new ServiceMenuDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Info")){//�ն˱�
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TerminalDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new TerminalDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Vendor")){//�豸Ʒ�Ʊ�
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new DevManuDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new DevManuDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Type")){//�豸�ͺű�
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new DevModelDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new DevModelDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Catalog")){//�豸���ͱ�
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new DevTypeDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new DevTypeDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_AtmType_Module")){//�ͺ�ģ�������
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new DevModelModuleDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new DevModelModuleDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Moudle_Relation")){//�豸ģ�������
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TerminalModuleDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new TerminalModuleDB().FlushSession();
          }
      }
      else if(strTableName.equals("Template_Menu")){//�˵�ģ���
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TemplateMenuDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new TemplateMenuDB().FlushSession();
          }
      }
      else if(strTableName.equals("Template_Menu_Relation")){//�˵���ģ�������
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TemplateMenuRelationDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new TemplateMenuRelationDB().FlushSession();
          }
      }
      else if(strTableName.equals("Device_Template_Menu_Relation")){//�ն˷����
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TerminalServiceDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new TerminalServiceDB().FlushSession();
          }
      }
      else if(strTableName.equals("ITS_BANK")){//���б�
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new BankDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new BankDB().FlushSession();
          }
      }
      else if(strTableName.equals("ITS_PROVINCE")){//ʡ�ݱ�
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new ProvinceDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new ProvinceDB().FlushSession();
          }
      }
      else if(strTableName.equals("ITS_CITY_COUNTY")){//���б�
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new CityDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new CityDB().FlushSession();
          }
      }
      else if(strTableName.equals("HostRetCode")){//�����������
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new HostRetCodeDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//����ˢ��
         	 bRet = new HostRetCodeDB().FlushSession();
          }
      }
      else if(strTableName.equals("BrunchRegister")){//������ϵ����Ϣ
          if(strKey.equals("id")){//��idˢ�»���
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new BrunchRegisterDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }
      }
      else if(strTableName.equals("RouteBank")){//ת�˻�·��Ϣ
          //����ˢ��
          bRet = new RouteBankDB().FlushSession();
      }
      else if(strTableName.equals("BranchMap")){//����ת�˻�·��Ϣ
          //����ˢ��
          bRet = new BranchMapDB().FlushSession();
      }
	  return bRet;
    }


	 public ColsTransMsg getDataSynchTransMsg()
    {
		ColsTransMsg msg = new ColsTransMsg();
	    if (isOK)
	    {
	       msg.put("success", "true");
	 	   msg.put("errors", "�ɹ�");
	     }
	     else
	     {
	       msg.put("success", "false");
	  	   msg.put("errors", "����ͬ��ʧ��");
	     }
	     return msg;
    }
    /**
     * ��ȡ���״������ı���
     */
    public ColsTransMsg getTransMsg()
    {
       ColsTransMsg msg = new ColsTransMsg();
	   msg.put("success", strTermRetCode);
	   msg.put("errors", strTermRetDesc);
	   return msg;
    }

    /**
     * �㲥֪ͨ��Ⱥ�е����нڵ�ˢ�»���
     * @param msg String ֪ͨ����Ϣ�����ַ���
     * @return boolean �Ƿ�ȫ���ɹ�
    */
    public static boolean broadcastFlushSession(String strUrl)
    {
	    boolean succeed = false;
	    // �㲥֪ͨ��Ⱥ�е����нڵ�ˢ�»���
	    List<?> misc = new MiscDB().getList("00001", "TransNodeUrl");
	    try{strUrl = java.net.URLEncoder.encode(strUrl, "gb2312");}catch (Exception e){}
	    for (int i = 0; misc != null && i < misc.size(); i++)
	    {
	       Misc miscEntity = (Misc) misc.get(i);

	       String strTransNodeUrl = miscEntity.getStrValue();
	       String strFlushCacheUrl = strTransNodeUrl +"/Cache/NotifyFlushCache.jsp?strMsgInfo="+strUrl;
	       try
	       {
		       int iRet = new HttpClient().executeMethod(new PostMethod(strFlushCacheUrl));
		       if (iRet != 200)
		       {
                  succeed = false;
		    	  strTermRetDesc = "����ͬ��ʧ�ܣ�ˢ�»���ʧ��";
		          // ��¼��־��ˮ
		          logErr.error("ˢ�»���ʧ��:"+ "ˢ�½ڵ�:"+ strTransNodeUrl+ "����("+ strUrl+ ")�쳣");
		       }
		       else
		       {
		    	   succeed = true;
		       }
	        }
	        catch (Exception e)
	        {
	           succeed = false;
	           strTermRetDesc = "����ͬ��ʧ�ܣ�"+e.getMessage();
		       // ��¼��־��ˮ
		       logErr.error("ˢ�»���ʧ��:"+ "ˢ�½ڵ�:"+ strTransNodeUrl+ "����("+ strUrl+ ")�쳣");
	        }
	    }
	    return succeed;
    }

    /**
     * �㲥֪ͨ��Ⱥ�е����нڵ�ˢ�»��棬�첽��ʽ
     * @param msg String ֪ͨ����Ϣ�����ַ���
     * @return boolean �Ƿ�ȫ���ɹ�
    */
    public void broadcastFlushSessionAsync(String msg)
    {
	    class BroadcastFlushSessionThread extends Thread
	    {
	       private String strMsg;
	       public BroadcastFlushSessionThread(String msg)
	       {
		       strMsg = msg;
	       }

	       public void run()
	       {
		       broadcastFlushSession(strMsg);
	       }
	     }
	     new BroadcastFlushSessionThread(msg).start();
    }
}
