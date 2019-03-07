/*
  ����˵���ȡ��
 */
function ServiceMenu()
{
  /*��ȡ����˵�����*/
  this.getMenulist = function()
  {
    // �ӷ�������ȡ
    top.wins.showProcessingTip("");
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ServiceList");
	reqMsg.appendNode("terminalId", top.terminal.id);
    reqMsg.appendNode("strCardType", top.pool.get("strCardType"));
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
      // ������˵����鱣�浽������
      this.saveMenulist(exch);
      if (typeof(top.MainFrame.showMenu) == "function")
        top.MainFrame.showMenu();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        if (top.langcur == top.langdef)
          top.MainFrame.onServiceFailed(top.langcur.oServiceMenuFailed, exch.strTermRetCode, exch.strTermRetDesc);
        if (top.langcur == top.langen)
          top.MainFrame.onServiceFailed(top.langcur.oServiceMenuFailed, exch.strTermRetCode, exch.strTermRetDescEn);
      }
    }
  }

  /*����ӷ��������صķ���˵�����*/
  this.saveMenulist = function(exch)
  {
    var menu;
    var MenuList = new Array();
    var num = exch.msgxmldomResp.selectNodesCount("/TransMsg/MENU/ITEM");
    for(var i=1; i<=num; i++)
    {
      menu = new Object();
      menu.id = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/MENU/ITEM[" + i + "]/id");
      menu.strServiceMenuId = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/MENU/ITEM[" + i + "]/strServiceMenuId");
      menu.btnPos = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/MENU/ITEM[" + i + "]/btnPos");
      menu.strServiceMenuAction = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/MENU/ITEM[" + i + "]/strServiceMenuAction");
      menu.strServiceMenuName = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/MENU/ITEM[" + i + "]/strServiceMenuName");
	  menu.strServiceMenuNameEn = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/MENU/ITEM[" + i + "]/strServiceMenuNameEn");
      MenuList[MenuList.length] = menu;
    }
    top.pool.set("MenuList", MenuList);
  }
}
