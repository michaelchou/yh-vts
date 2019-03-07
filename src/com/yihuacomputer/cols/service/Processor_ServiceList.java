package com.yihuacomputer.cols.service;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.jdom.Element;

import com.yihuacomputer.cols.database.CardTypeServiceDB;
import com.yihuacomputer.cols.database.ServiceMenuDB;
import com.yihuacomputer.cols.database.TemplateMenuRelationDB;
import com.yihuacomputer.cols.entity.ServiceMenu;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_ServiceList extends Processor {
	//卡的详细类型
	private String strCardType;

	public Processor_ServiceList() {
		super();
	}

    protected String getTransName()
	{
		return "获取服务菜单";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	public void process() throws ProcessorException {
		strCardType = MsgXmlDom.getElementValue(domReq,"strCardType");
		ServiceMenuItem[] menu = getServiceMenu();

		if (null == menu || menu.length <= 0)
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);

		// 设置成功信息
		setSucceedRespDom();
		if (menu != null && menu.length > 0) {
			Element rootElement = domResp.getRootElement();
			Element menuEle = new Element("MENU");
			for (int i = 0; i < menu.length; i++) {
				// 去掉不需要显示的菜单或父菜单
				//if (!menu[i].bShow) {
					//continue;
				//} else {
				//}
				int id = menu[i].getId();
				String strServiceMenuId = menu[i].getStrServiceMenuId();
				String strServiceMenuName = menu[i].getStrServiceMenuName();
				String strServiceMenuNameEn = menu[i].getStrServiceMenuNameEn();
				int btnPos = menu[i].getBtnPos();
				int serviceMenuType = menu[i].getServiceMenuType();
				String strServiceMenuAction = menu[i].getStrServiceMenuAction();
				Element itemEle = new Element("ITEM");
				itemEle.addContent(XmlHelper.createElement("id", String.valueOf(id)));
				itemEle.addContent(XmlHelper.createElement("strServiceMenuId", strServiceMenuId));
				itemEle.addContent(XmlHelper.createElement("strServiceMenuName",strServiceMenuName));
				itemEle.addContent(XmlHelper.createElement("btnPos", String.valueOf(btnPos)));
				itemEle.addContent(XmlHelper.createElement("serviceMenuType",String.valueOf(serviceMenuType)));
				itemEle.addContent(XmlHelper.createElement("strServiceMenuAction",strServiceMenuAction));
				itemEle.addContent(XmlHelper.createElement("strServiceMenuNameEn",strServiceMenuNameEn));
				menuEle.addContent(itemEle);
			}
			rootElement.addContent(menuEle);
		}
	}

	/**
	 * <p>
	 * 根据设备号，卡类型取最终确定的服务菜单
	 * </p>
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public ServiceMenuItem[] getServiceMenu() {
		ServiceMenuItem[] menu = null;
		// 取系统能提供的服务
		List allServiceMenuList = getServiceId();
		if (null == allServiceMenuList)
			return menu;

		// 取管理员所配得服务
		TemplateMenuRelationDB templateMenuRelationDB = new TemplateMenuRelationDB();
		List terminalServiceMenuList = templateMenuRelationDB.getTerminalServiceMenuList(super.terminal.getId());
		if (null == terminalServiceMenuList)
			return menu;

		//取卡类型所确定的服务
	    CardTypeServiceDB cardTypeService = new CardTypeServiceDB();
	    List cardTypeServiceList = cardTypeService.getCardTypeServiceList(strCardType);
	    if (cardTypeServiceList == null)
	      return menu;

	    //取三类服务的交集
	    List serviceList = getIntersectionServiceId(allServiceMenuList, terminalServiceMenuList,cardTypeServiceList);
	    if (serviceList == null)
	      return menu;

	    //根据菜单的id号，取出对应的serviceMenuId
	    List serviceListNew = new ArrayList();
        for(int i=0;i<serviceList.size();i++){
        	Object serviceId = serviceList.get(i);
        	ServiceMenu bean =  new ServiceMenuDB().getServiceInfo(Integer.parseInt(serviceId.toString()));
        	serviceListNew.add(bean.getServiceMenuId());
        }

        //去除重复的记录
        List serviceMenuIdList = removeDuplicate(serviceListNew);

		// 从TerminalService表中取出服务菜单信息
		String ServiceMenu[] = getService(serviceList,serviceMenuIdList,strCardType);
		if (null == ServiceMenu)
			return menu;
		// 服务菜单组合排列处理
		menu = new ServiceMenuArranger(ServiceMenu).getServiceMenuItem();
		return menu;
	}

    // 删除ArrayList中重复元素
    @SuppressWarnings({ "rawtypes", "unchecked" })
	public List removeDuplicate(List serviceList) {
    	List list = new ArrayList();
        HashSet h = new HashSet(serviceList);
        list.clear();
        list.addAll(h);
        return list;
    }

	/**
	 * 取出系统支持的所有服务
	 */
	@SuppressWarnings("rawtypes")
	private List getServiceId() {
		ServiceMenuDB serviceMenuDB = new ServiceMenuDB();
		// 取所有的自助服务
		List allServiceMenuList = serviceMenuDB.getAllServiceMenuList();
		if (allServiceMenuList == null ||  allServiceMenuList.isEmpty()) {
			allServiceMenuList = null;
		}
		return allServiceMenuList;
	}

	/**
	 * 根据服务Id号取出服务菜单信息
	*/
	@SuppressWarnings("rawtypes")
	private String[] getService(List serviceList,List serviceMenuIdList,String strCardType) {
		String[] service = null;
		StringBuffer strServiceMenu = new StringBuffer(128); // 服务菜单
		ServiceMenuDB serviceMenuDB = new ServiceMenuDB();
		List serviceMenuList = serviceMenuDB.getServiceMenuList(serviceMenuIdList,strCardType);
		if (serviceMenuList != null) {
			for (int i = 0; i < serviceMenuList.size(); i++) {
				ServiceMenu serviceEntity = (ServiceMenu) serviceMenuList.get(i);
				int id = serviceEntity.getId();
				if(serviceList.contains(id) || serviceMenuIdList.contains(id)){
					int serviceMenuId = serviceEntity.getServiceMenuId();
					String strServiceMenuName = serviceEntity.getStrServiceMenuName();
					String strServiceMenuNameEn = serviceEntity.getStrServiceMenuNameEn();
					int btnPos = serviceEntity.getBtnPos();
					int serviceMenuType = serviceEntity.getServiceMenuType();
					String strServiceMenuAction = serviceEntity.getStrServiceMenuAction();
					strServiceMenu.append("" + String.valueOf(id) + ",");
					strServiceMenu.append("" + String.valueOf(serviceMenuId) + ",");
					strServiceMenu.append("" + strServiceMenuName + ",");
					strServiceMenu.append("" + String.valueOf(btnPos) + ",");
					strServiceMenu.append("" + String.valueOf(serviceMenuType) + ",");
					strServiceMenu.append("" + strServiceMenuAction + ",");
					strServiceMenu.append("" + strServiceMenuNameEn + ",");
				}
			}
			service = strServiceMenu.toString().split(",");
		}
		return service;
	}

	/**
	 * 根据"系统能提供的服务"、"管控台所配得服务"、"卡类型所确定的服务"，筛选出最终所能提供的服务
	*/
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private List getIntersectionServiceId(List allServiceMenuList, List terminalServiceMenuList,List cardTypeServiceList)
	{
	    List serviceListId = new ArrayList();
	    for (int i = 0; i < allServiceMenuList.size(); i++)
	    {
	      Object serviceId = allServiceMenuList.get(i);
	      if (terminalServiceMenuList.indexOf(serviceId) != -1 && cardTypeServiceList.indexOf(serviceId) != -1)
	      {
	    	  serviceListId.add(serviceId);
	      }
	    }
	    if (serviceListId.isEmpty())
	    	serviceListId = null;
	    return serviceListId;
	}
}
