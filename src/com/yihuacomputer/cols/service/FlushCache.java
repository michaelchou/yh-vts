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
 * 更新管控台数据并刷新缓存
 */
public class FlushCache
{
	public static Logger logErr = Logger.getLogger("Error");
	//表名
	private static String strTableName="";
	//根据什么字段刷新
	private static String strKey="";
	//根据什么值刷新
	private static String strValue="";
    // 终端返回码
    private static String strTermRetCode = "false";
    // 返回描述
    private static String strTermRetDesc = "";
    //数据同步结果
    private static boolean isOK = false;

    public FlushCache()
    {
    }

    public static String onFlushCache(String msg)
    {
       //表名
       strTableName="";
       //根据什么字段刷新
       strKey="";
       //根据什么值刷新
       strValue= "";
       //第一步：先处理数据
       isOK = doDataProcess(msg);
       if(isOK){
    	   //第二步:做刷新缓存
    	   String strUrl="MsgType=RefreshBuf&strTableName="+strTableName+"&strKey="+strKey+"&strValue="+strValue;
    	   if (broadcastFlushSession(strUrl))
    	   {
    		   System.out.println("RetCode=true&RetDesc=刷新缓存成功");
    		   return "RetCode=true&RetDesc=刷新缓存成功";
    	   }
    	   else{
    		   System.out.println("RetCode=false&RetDesc=刷新缓存失败");
    	       return "RetCode=false&RetDesc=刷新缓存失败";
    	   }
       }else{
    	   System.out.println("RetCode=false&RetDesc=数据处理失败");
    	   return "RetCode=false&RetDesc=数据处理失败";
       }
    }

    /**
     * 刷新缓存，且通知监控代理
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
     * 数据处理
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
 		  if(key.equals("tableName")){//取出表名
 			// 表名为空
 			if (value == null || value.length() == 0) {
 				return false;
 			}else{
 				strTableName = value;
 			}
 		  }
 		  else if(key.equals("changes")){//增加、修改的数据
 			 JSONArray jsonArray = jsonObj.getJSONArray(key);
 			 for (int i = 0; i < jsonArray.size(); i++) {
 				JSONObject dataObject = jsonArray.getJSONObject(i);
 				int id = dataObject.getInt("id");
 			    if(String.valueOf(id)== null || String.valueOf(id).equals("")){
 			    	return false;
 			    }else{//增加、修改数据
 			    	if(strTableName.equals("Sm_Org")){//机构表
 			    		bRet = changeSm_Org(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Its_Misc")){//参数表
 			    		bRet = changeIts_Misc(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Exper_Device")){//使用设备表
 			    		bRet = changeExper_Device(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Module")){//设备模块表
 			    		bRet = changeDev_Module(id,dataObject);
 	 				}
 			    	else if(strTableName.equals("Service_Menu")){//菜单表
 			    		bRet = changeService_Menu(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Info")){//终端表
 			    		bRet = changeDev_Info(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Vendor")){//设备品牌表
 			    		bRet = changeDev_Vendor(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Type")){//设备型号表
 			    		bRet = changeDev_Type(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Catalog")){//设备类型表
 			    		bRet = changeDev_Catalog(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_AtmType_Module")){//型号模块关联表
 			    		bRet = changeDev_AtmType_Module(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Dev_Moudle_Relation")){//设备模块关联表
 			    		bRet = changeDev_Moudle_Relation(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Template_Menu")){//菜单模板表
 			    		bRet = changeTemplate_Menu(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Template_Menu_Relation")){//菜单与模板关联表
 			    		bRet = changeTemplate_Menu_Relation(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("Device_Template_Menu_Relation")){//终端服务表
 			    		bRet = changeDevice_Template_Menu_Relation(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("ITS_BANK")){//银行表
 			    		bRet = changeITS_BANK(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("ITS_PROVINCE")){//省份表
 			    		bRet = changeITS_PROVINCE(id,dataObject);
 			    	}
 			    	else if(strTableName.equals("ITS_CITY_COUNTY")){//城市表
 			    		bRet = changeITS_CITY_COUNTY(id,dataObject);
 			    	}
 			    }
 			 }
 		  }
 		  else if(key.equals("removes")){//删除的数据
 			 JSONArray jsonArray = jsonObj.getJSONArray(key);
 			 for (int i = 0; i < jsonArray.size(); i++) {
 				JSONObject dataObject = jsonArray.getJSONObject(i);
 				int id = dataObject.getInt("id");
 				if(String.valueOf(id)== null || String.valueOf(id).equals("")){
 			    	return false;
 			    }else{//删除数据
 			    	if(strTableName.equals("Sm_Org")){//机构表
 	 			    	System.out.println("--------删除记录（Org）---------");
 	 			    	bRet = new OrgDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Its_Misc")){//参数表
 			    		System.out.println("--------删除记录（Misc）---------");
 	 			    	bRet = new MiscDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Exper_Device")){//设备试运行表
 			    		System.out.println("--------删除记录（Trial）---------");
 	 			    	bRet = new TrialDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Module")){//设备模块表
 			    		System.out.println("--------删除记录（Module）---------");
 	 			    	bRet = new ModuleDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Service_Menu")){//菜单表
 			    		System.out.println("--------删除记录（ServiceMenu）---------");
	 			    	ServiceMenu serviceMenu = new ServiceMenuDB().getServiceInfo(id);
 	 			    	bRet = new ServiceMenuDB().delete(id);
 	 			    	if(bRet){
 	 			    		if(serviceMenu != null ){
 	 			    		    new CardTypeServiceDB().delete(id);
 	 			    		}
 	 			    	}
 			    	}
 			    	else if(strTableName.equals("Dev_Info")){//终端表
 			    		System.out.println("--------删除记录（Terminal）---------");
 	 			    	bRet = new TerminalDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Vendor")){//设备品牌表
 			    		System.out.println("--------删除记录（DevManu）---------");
 	 			    	bRet = new DevManuDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Type")){//设备型号表
 			    		System.out.println("--------删除记录（DevModel）---------");
 	 			    	bRet = new DevModelDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Catalog")){//设备类型表
 			    		System.out.println("--------删除记录（DevType）---------");
 	 			    	bRet = new DevTypeDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_AtmType_Module")){//型号模块关联表
 			    		System.out.println("--------删除记录（DevModelModule）---------");
 	 			    	bRet = new DevModelModuleDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Dev_Moudle_Relation")){//设备模块关联表
 			    		System.out.println("--------删除记录（TerminalModule）---------");
 	 			    	bRet = new TerminalModuleDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Template_Menu")){//菜单模板表
 			    		System.out.println("--------删除记录（TemplateMenu）---------");
 	 			    	bRet = new TemplateMenuDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Template_Menu_Relation")){//菜单与模板关联表
 			    		System.out.println("--------删除记录（TemplateMenuRelation）---------");
 	 			    	bRet = new TemplateMenuRelationDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("Device_Template_Menu_Relation")){//菜单与模板关联表
 			    		System.out.println("--------删除记录（TerminalService）---------");
 	 			    	bRet = new TerminalServiceDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("ITS_BANK")){//银行表
 			    		System.out.println("--------删除记录（Bank）---------");
 	 			    	bRet = new BankDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("ITS_PROVINCE")){//省份表
 			    		System.out.println("--------删除记录（Province）---------");
 	 			    	bRet = new ProvinceDB().delete(id);
 			    	}
 			    	else if(strTableName.equals("ITS_CITY_COUNTY")){//城市表
 			    		System.out.println("--------删除记录（City）---------");
 	 			    	bRet = new CityDB().delete(id);
 			    	}
 			    }
 			 }
 		  }
      }
	  return bRet;
    }

    /**
     * 机构表changeSm_Org
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeSm_Org(int id,JSONObject dataObject){
    	boolean bRet =false;
    	//机构表
 		Org org = new OrgDB().getOrgInfoNoCache(id);
 		if(org == null){//无记录当增加处理
 			System.out.println("--------增加记录(Sm_org)---------");
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
 		else{//修改记录
 			System.out.println("--------修改记录(Sm_org)---------");
 			System.out.println("--------修改前记录:---------:"+org.getStrOrgName());
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
     * 参数表changeIts_Misc
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeIts_Misc(int id,JSONObject dataObject){
    	boolean bRet = false;
    	//参数表
 		Misc misc = new MiscDB().getMiscByIdNoCache(id);
 		if(misc == null){//无记录当增加处理
 			System.out.println("--------增加记录(Its_Misc)---------");
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
 		else{//修改记录
 			System.out.println("--------修改记录(Its_Misc)---------");
 			System.out.println("--------修改前记录:---------:"+misc.getStrValue());
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
     * 设备试用表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeExper_Device(int id,JSONObject dataObject){
    	boolean bRet = false;
 		Trial trial = new TrialDB().getTrialInfoNoCache(id);
 		if(trial == null){//无记录当增加处理
 			System.out.println("--------增加记录(Trial)---------");
 			Trial bean = new Trial();
 			bean.setId(id);
 			bean.setStrTerminalNum(dataObject.getString("strTerminalNum"));
	    		bRet = new TrialDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(Trial)---------");
 			System.out.println("--------修改前记录:---------:"+trial.getStrTerminalNum());
 			trial.setStrTerminalNum(dataObject.getString("strTerminalNum"));
	    		bRet = new TrialDB().Update(trial);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}

    	return bRet;
    }

    /**
     * 设备模块表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Module(int id,JSONObject dataObject){
    	boolean bRet = false;
    	Module module = new ModuleDB().getModuleInfoNoCache(id);
 		if(module == null){//无记录当增加处理
 			System.out.println("--------增加记录(Module)---------");
 			Module bean = new Module();
 			bean.setId(id);
 			bean.setStrModuleName(dataObject.getString("strModuleName"));
 			bean.setStrModuleClsid(dataObject.getString("strModuleClsid"));
 			bean.setStrModuleDesc(dataObject.getString("strModuleDesc"));
	    		bRet = new ModuleDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(Module)---------");
 			System.out.println("--------修改前记录:---------:"+module.getStrModuleName());
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
     * 菜单表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeService_Menu(int id,JSONObject dataObject){
    	boolean bRet = false;
 		ServiceMenu serviceMenu = new ServiceMenuDB().getServiceInfoNoCache(id);
 		if(serviceMenu == null){//无记录当增加处理
 			System.out.println("--------增加记录(ServiceMenu)---------");
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
		    		//根据选择的卡类型，数据同步到卡类型对应的菜单表中
                String strCardType = dataObject.getString("strCardType");//0：全部  1：借记卡  3：信用卡
                if(strCardType != null && strCardType.equals("0")){
                	CardTypeService  entity = new CardTypeService();
                	entity.setId(id);
                	entity.setStrCardType("1");//转成本系统的卡类型 1：借记卡 3：信用卡
                	entity.setServiceMenuId(id);
                	new CardTypeServiceDB().save(entity);
                	CardTypeService entity2 = new CardTypeService();
                	entity2.setId(id+5000);
                	entity2.setStrCardType("3");//转成本系统的卡类型 1：借记卡 3：信用卡
                	entity2.setServiceMenuId(id);
                	new CardTypeServiceDB().save(entity2);
                }
                else if(strCardType != null && strCardType.equals("1")){
                	CardTypeService  entity = new CardTypeService();
                	entity.setId(id);
                	entity.setStrCardType("1");//转成本系统的卡类型 1：借记卡 3：信用卡
                	entity.setServiceMenuId(id);
                	new CardTypeServiceDB().save(entity);
                }
                else if(strCardType != null && strCardType.equals("3")){

                	CardTypeService  entity = new CardTypeService();
                	entity.setStrCardType("3");//转成本系统的卡类型 1：借记卡 3：信用卡
                	entity.setId(id);
                	entity.setServiceMenuId(id);
                	new CardTypeServiceDB().save(entity);
                }
	    		}
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(ServiceMenu)---------");
 			System.out.println("--------修改前记录:---------:"+serviceMenu.getStrServiceMenuName());
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
	      		    //根据选择的卡类型，数据同步到卡类型对应的菜单表中
                String strCardType = dataObject.getString("strCardType");//0：全部  1：借记卡  3：信用卡
                bRet = new CardTypeServiceDB().delete(serviceMenu.getId());//先删除记录
                if(bRet){
                	if(strCardType != null && strCardType.equals("0")){
                    	CardTypeService  entity = new CardTypeService();
                    	entity.setId(id);
                    	entity.setStrCardType("1");//转成本系统的卡类型 1：借记卡 3：信用卡
                    	entity.setServiceMenuId(serviceMenu.getId());
                    	new CardTypeServiceDB().save(entity);
                    	CardTypeService entity2 = new CardTypeService();
                    	entity2.setId(id+5000);
                    	entity2.setStrCardType("3");//转成本系统的卡类型 1：借记卡 3：信用卡
                    	entity2.setServiceMenuId(serviceMenu.getId());
                    	new CardTypeServiceDB().save(entity2);
                    }
                    else if(strCardType != null && strCardType.equals("1")){
                    	CardTypeService  entity = new CardTypeService();
                    	entity.setId(id);
                    	entity.setStrCardType("1");//转成本系统的卡类型 1：借记卡 3：信用卡
                    	entity.setServiceMenuId(serviceMenu.getId());
                    	new CardTypeServiceDB().save(entity);
                    }
                    else if(strCardType != null && strCardType.equals("3")){
                    	CardTypeService  entity = new CardTypeService();
                    	entity.setId(id);
                    	entity.setStrCardType("3");//转成本系统的卡类型 1：借记卡 3：信用卡
                    	entity.setServiceMenuId(serviceMenu.getId());
                    	new CardTypeServiceDB().save(entity);
                    }
                }
	    		}
 		}
    	return bRet;
    }

    /**
     * 终端表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Info(int id,JSONObject dataObject){
    	boolean bRet = false;
 		Terminal terminal = new TerminalDB().getEntityByIdNoCache(id);
 		if(terminal == null){//无记录当增加处理
 			System.out.println("--------增加记录(Terminal)---------");
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
 		else{//修改记录
 			System.out.println("--------修改记录(Terminal)---------");
 			System.out.println("--------修改前记录:---------:"+terminal.getStrTerminalNum());
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
	    			if(terminal.getStatus() != Integer.parseInt(dataObject.getString("iStatus"))){//当状态有变化时
                   if(Integer.parseInt(dataObject.getString("iStatus")) == 1){// 1：开通
                	   terminal.setDtStart(new DateCtrl().getTimestamp());//修改开通时间
                	   terminal.setDtEnd(null);
                   }
                   else if(Integer.parseInt(dataObject.getString("iStatus")) == 2){// 2：停用
                	   terminal.setDtEnd(new DateCtrl().getTimestamp());//修改停用时间
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
     * 设备品牌表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Vendor(int id,JSONObject dataObject){
    	boolean bRet = false;
 		DevManu devManu = new DevManuDB().getDevManuByIdNoCache(id);
 		if(devManu == null){//无记录当增加处理
 			System.out.println("--------增加记录(DevManu)---------");
 			DevManu bean = new DevManu();
 			bean.setId(id);
 			bean.setStrDevManuName(dataObject.getString("name"));
	    		bRet = new DevManuDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(DevManu)---------");
 			System.out.println("--------修改前记录:---------:"+devManu.getStrDevManuName());
 			devManu.setStrDevManuName(dataObject.getString("name"));
	    		bRet = new DevManuDB().Update(devManu);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * 设备型号表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Type(int id,JSONObject dataObject){
    	boolean bRet = false;
 		DevModel devModel = new DevModelDB().getDevModelByIdNoCache(id);
 		if(devModel == null){//无记录当增加处理
 			System.out.println("--------增加记录(DevModel)---------");
 			DevModel bean = new DevModel();
 			bean.setId(id);
 			bean.setDevManuId(Integer.parseInt(dataObject.getString("iDevManuId")));
 			bean.setStrDevModelName(dataObject.getString("iDevTypeName"));
	    		bRet = new DevModelDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(DevModel)---------");
 			System.out.println("--------修改前记录:---------:"+devModel.getStrDevModelName());
 			devModel.setDevManuId(Integer.parseInt(dataObject.getString("iDevManuId")));
 			devModel.setStrDevModelName(dataObject.getString("iDevTypeName"));
	    		bRet = new DevModelDB().Update(devModel);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}

    	return bRet;
    }

    /**
     * 设备类型表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Catalog(int id,JSONObject dataObject){
    	boolean bRet = false;

 		DevType devType = new DevTypeDB().getDevTypeByIdNoCache(id);
 		if(devType == null){//无记录当增加处理
 			System.out.println("--------增加记录(DevType)---------");
 			DevType bean = new DevType();
 			bean.setId(id);
 			bean.setStrDevTypeName(dataObject.getString("name"));
	    		bRet = new DevTypeDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(DevType)---------");
 			System.out.println("--------修改前记录:---------:"+devType.getStrDevTypeName());
 			devType.setStrDevTypeName(dataObject.getString("name"));
	    		bRet = new DevTypeDB().Update(devType);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}

    	return bRet;
    }

    /**
     * 型号模块关联表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_AtmType_Module(int id,JSONObject dataObject){
    	boolean bRet = false;
 		DevModelModule devModelModule = new DevModelModuleDB().getDevModelModuleByIdNoCache(id);
 		if(devModelModule == null){//无记录当增加处理
 			System.out.println("--------增加记录(DevModelModule)---------");
 			DevModelModule bean = new DevModelModule();
 			bean.setId(id);
 			bean.setDevModelId(Integer.parseInt(dataObject.getString("iDevTypeId")));
 			bean.setModuleId(Integer.parseInt(dataObject.getString("iModuleId")));
	    		bRet = new DevModelModuleDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(DevModelModule)---------");
 			System.out.println("--------修改前记录:---------:"+devModelModule.getId());
 			devModelModule.setDevModelId(Integer.parseInt(dataObject.getString("iDevTypeId")));
 			devModelModule.setModuleId(Integer.parseInt(dataObject.getString("iModuleId")));
	    		bRet = new DevModelModuleDB().Update(devModelModule);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * 设备模块关联表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDev_Moudle_Relation(int id,JSONObject dataObject){
    	boolean bRet = false;
 		TerminalModule terminalModule = new TerminalModuleDB().getTerminalModuleByIdNoCache(id);
 		if(terminalModule == null){//无记录当增加处理
 			System.out.println("--------增加记录(TerminalModule)---------");
 			TerminalModule bean = new TerminalModule();
 			bean.setId(id);
 			bean.setTerminalId(Integer.parseInt(dataObject.getString("deviceId")));
 			bean.setModuleId(Integer.parseInt(dataObject.getString("moduleId")));
 			bean.setModuleFlag(Integer.parseInt(dataObject.getString("isable")));
	    		bRet = new TerminalModuleDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(TerminalModule)---------");
 			System.out.println("--------修改前记录:---------:"+terminalModule.getId());
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
     * 菜单模板表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeTemplate_Menu(int id,JSONObject dataObject){
    	boolean bRet = false;
 		TemplateMenu templateMenu = new TemplateMenuDB().getTemplateMenuByIdNoCache(id);
 		if(templateMenu == null){//无记录当增加处理
 			System.out.println("--------增加记录(TemplateMenu)---------");
 			TemplateMenu bean = new TemplateMenu();
 			bean.setId(id);
 			bean.setStrTemplateName(dataObject.getString("templateName"));
 			bean.setStrDescription(dataObject.getString("description"));
	    		bRet = new TemplateMenuDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(TemplateMenu)---------");
 			System.out.println("--------修改前记录:---------:"+templateMenu.getStrTemplateName());
 			templateMenu.setStrTemplateName(dataObject.getString("templateName"));
 			templateMenu.setStrDescription(dataObject.getString("description"));
	    		bRet = new TemplateMenuDB().Update(templateMenu);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * 菜单与模板关联表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeTemplate_Menu_Relation(int id,JSONObject dataObject){
    	boolean bRet = false;
 		TemplateMenuRelation templateMenuRelation = new TemplateMenuRelationDB().getTemplateMenuRelationByIdNoCache(id);
 		if(templateMenuRelation == null){//无记录当增加处理
 			System.out.println("--------增加记录(TemplateMenuRelation)---------");
 			TemplateMenuRelation bean = new TemplateMenuRelation();
 			bean.setId(id);
 			bean.setTemplateId(Integer.parseInt(dataObject.getString("templateId")));
 			bean.setServiceMenuId(Integer.parseInt(dataObject.getString("menuId")));
	    		bRet = new TemplateMenuRelationDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(TemplateMenuRelation)---------");
 			System.out.println("--------修改前记录:---------:"+templateMenuRelation.getTemplateId());
 			templateMenuRelation.setTemplateId(Integer.parseInt(dataObject.getString("templateId")));
 			templateMenuRelation.setServiceMenuId(Integer.parseInt(dataObject.getString("menuId")));
	    		bRet = new TemplateMenuRelationDB().Update(templateMenuRelation);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * 终端服务表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeDevice_Template_Menu_Relation(int id,JSONObject dataObject){
    	boolean bRet = false;
 		TerminalService terminalService = new TerminalServiceDB().getTerminalServiceByIdNoCache(id);
 		if(terminalService == null){//无记录当增加处理
 			System.out.println("--------增加记录(TerminalService)---------");
 			TerminalService bean = new TerminalService();
 			bean.setId(id);
 			bean.setTerminalId(Integer.parseInt(dataObject.getString("deviceId")));
 			bean.setTemplateId(Integer.parseInt(dataObject.getString("templateId")));
	    		bRet = new TerminalServiceDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(TerminalService)---------");
 			System.out.println("--------修改前记录:---------:"+terminalService.getId());
 			terminalService.setTerminalId(Integer.parseInt(dataObject.getString("deviceId")));
 			terminalService.setTemplateId(Integer.parseInt(dataObject.getString("templateId")));
	    		bRet = new TerminalServiceDB().Update(terminalService);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * 银行表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeITS_BANK(int id,JSONObject dataObject){
    	boolean bRet = false;
 		Bank bank = new BankDB().getBankByIdNoCache(id);
 		if(bank == null){//无记录当增加处理
 			System.out.println("--------增加记录(Bank)---------");
 			Bank bean = new Bank();
 			bean.setId(id);
 			bean.setStrBankCode(dataObject.getString("code"));
 			bean.setStrBankName(dataObject.getString("name"));
	    		bRet = new BankDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(Bank)---------");
 			System.out.println("--------修改前记录:---------:"+bank.getStrBankName());
 			bank.setStrBankCode(dataObject.getString("code"));
 			bank.setStrBankName(dataObject.getString("name"));
	    		bRet = new BankDB().Update(bank);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * 省份表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeITS_PROVINCE(int id,JSONObject dataObject){
    	boolean bRet = false;
 		Province province = new ProvinceDB().getProvinceByIdNoCache(id);
 		if(province == null){//无记录当增加处理
 			System.out.println("--------增加记录(Province)---------");
 			Province bean = new Province();
 			bean.setId(id);
 			bean.setStrProvinceCode(dataObject.getString("code"));
 			bean.setStrProvinceName(dataObject.getString("name"));
	    		bRet = new ProvinceDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(Province)---------");
 			System.out.println("--------修改前记录:---------:"+province.getStrProvinceName());
 			province.setStrProvinceCode(dataObject.getString("code"));
 			province.setStrProvinceName(dataObject.getString("name"));
	    		bRet = new ProvinceDB().Update(province);
	    		strKey = "id";
	    		strValue = strValue +id +",";
 		}
    	return bRet;
    }

    /**
     * 城市表
     * @param id
     * @param dataObject
     * @return
     */
    public static boolean changeITS_CITY_COUNTY(int id,JSONObject dataObject){
    	boolean bRet = false;
 		City city = new CityDB().getCityByIdNoCache(id);
 		if(city == null){//无记录当增加处理
 			System.out.println("--------增加记录(City)---------");
 			City bean = new City();
 			bean.setId(id);
 			bean.setStrProvinceCode(dataObject.getString("pcode"));
 			bean.setStrCityCode(dataObject.getString("code"));
 			bean.setStrCityName(dataObject.getString("name"));
	    		bRet = new CityDB().save(bean);
 		}
 		else{//修改记录
 			System.out.println("--------修改记录(City)---------");
 			System.out.println("--------修改前记录:---------:"+city.getStrCityName());
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
     * 刷新缓存
    */
	public boolean doProcess(String strMsgInfo)
    {
	  // 第一步：分解交易请求信息
	  ColsTransMsg msg = new ColsTransMsg(strMsgInfo);
	  strTableName = msg.get("strTableName").trim();
	  strKey = msg.get("strKey").trim();
      strValue = msg.get("strValue").trim();
      boolean bRet = false;
      if(strTableName.equals("Sm_Org")){//机构表
         if(strKey.equals("id")){//按id刷新缓存
        	 if(strValue !=null && strValue.length()>1){
        		 String[] values = strValue.split(",");
        		 if(values.length > 0){
                     for(int i=0;i<values.length;i++){
                    	 bRet = new OrgDB().FlushSession(Integer.parseInt(values[i]));
                     }
        		 }
        	 }
         }else{//整表刷新
        	 bRet = new OrgDB().FlushSession();
         }
      }
      else if(strTableName.equals("Its_Misc")){//参数表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new MiscDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new MiscDB().FlushSession();
          }
       }
      else if(strTableName.equals("Exper_Device")){//设备试用表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TrialDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new TrialDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Module")){//设备模块表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new ModuleDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new ModuleDB().FlushSession();
          }
      }
      else if(strTableName.equals("Service_Menu")){//服务菜单表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new ServiceMenuDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new ServiceMenuDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Info")){//终端表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TerminalDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new TerminalDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Vendor")){//设备品牌表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new DevManuDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new DevManuDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Type")){//设备型号表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new DevModelDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new DevModelDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Catalog")){//设备类型表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new DevTypeDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new DevTypeDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_AtmType_Module")){//型号模块关联表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new DevModelModuleDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new DevModelModuleDB().FlushSession();
          }
      }
      else if(strTableName.equals("Dev_Moudle_Relation")){//设备模块关联表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TerminalModuleDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new TerminalModuleDB().FlushSession();
          }
      }
      else if(strTableName.equals("Template_Menu")){//菜单模板表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TemplateMenuDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new TemplateMenuDB().FlushSession();
          }
      }
      else if(strTableName.equals("Template_Menu_Relation")){//菜单与模板关联表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TemplateMenuRelationDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new TemplateMenuRelationDB().FlushSession();
          }
      }
      else if(strTableName.equals("Device_Template_Menu_Relation")){//终端服务表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new TerminalServiceDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new TerminalServiceDB().FlushSession();
          }
      }
      else if(strTableName.equals("ITS_BANK")){//银行表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new BankDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new BankDB().FlushSession();
          }
      }
      else if(strTableName.equals("ITS_PROVINCE")){//省份表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new ProvinceDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new ProvinceDB().FlushSession();
          }
      }
      else if(strTableName.equals("ITS_CITY_COUNTY")){//城市表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new CityDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new CityDB().FlushSession();
          }
      }
      else if(strTableName.equals("HostRetCode")){//主机返回码表
          if(strKey.equals("id")){//按id刷新缓存
         	 if(strValue !=null && strValue.length()>1){
         		 String[] values = strValue.split(",");
         		 if(values.length > 0){
                      for(int i=0;i<values.length;i++){
                     	 bRet = new HostRetCodeDB().FlushSession(Integer.parseInt(values[i]));
                      }
         		 }
         	 }
          }else{//整表刷新
         	 bRet = new HostRetCodeDB().FlushSession();
          }
      }
      else if(strTableName.equals("BrunchRegister")){//常用联系人信息
          if(strKey.equals("id")){//按id刷新缓存
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
      else if(strTableName.equals("RouteBank")){//转账汇路信息
          //整表刷新
          bRet = new RouteBankDB().FlushSession();
      }
      else if(strTableName.equals("BranchMap")){//本行转账汇路信息
          //整表刷新
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
	 	   msg.put("errors", "成功");
	     }
	     else
	     {
	       msg.put("success", "false");
	  	   msg.put("errors", "数据同步失败");
	     }
	     return msg;
    }
    /**
     * 获取交易处理结果的报文
     */
    public ColsTransMsg getTransMsg()
    {
       ColsTransMsg msg = new ColsTransMsg();
	   msg.put("success", strTermRetCode);
	   msg.put("errors", strTermRetDesc);
	   return msg;
    }

    /**
     * 广播通知集群中的所有节点刷新缓存
     * @param msg String 通知的消息内容字符串
     * @return boolean 是否全部成功
    */
    public static boolean broadcastFlushSession(String strUrl)
    {
	    boolean succeed = false;
	    // 广播通知集群中的所有节点刷新缓存
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
		    	  strTermRetDesc = "数据同步失败：刷新缓存失败";
		          // 记录日志流水
		          logErr.error("刷新缓存失败:"+ "刷新节点:"+ strTransNodeUrl+ "缓存("+ strUrl+ ")异常");
		       }
		       else
		       {
		    	   succeed = true;
		       }
	        }
	        catch (Exception e)
	        {
	           succeed = false;
	           strTermRetDesc = "数据同步失败："+e.getMessage();
		       // 记录日志流水
		       logErr.error("刷新缓存失败:"+ "刷新节点:"+ strTransNodeUrl+ "缓存("+ strUrl+ ")异常");
	        }
	    }
	    return succeed;
    }

    /**
     * 广播通知集群中的所有节点刷新缓存，异步方式
     * @param msg String 通知的消息内容字符串
     * @return boolean 是否全部成功
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
