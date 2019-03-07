/*
  ��������Ϣ��ȡ��
 */
function MyChooseCard()
{
  /*��ȡ����������*/
  this.getCardlist = function()
  {
    // �ӷ�������ȡ
//    top.wins.showNewProcessingTip("");
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ChooseCard");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("cardListFlag", "1");
    	this.saveCardTypeList(exch);
    }
    else
    {	
    	top.pool.set("cardListFlag", "");
//      if (typeof(top.MainFrame.onServiceFailed) == "function")
//      {
//        if (top.langcur == top.langdef)
//          top.MainFrame.onServiceFailed(top.langcur.oGetCardTypeFailed, exch.strTermRetCode, exch.strTermRetDesc);
//        if (top.langcur == top.langen)
//          top.MainFrame.onServiceFailed(top.langcur.oGetCardTypeFailed, exch.strTermRetCode, exch.strTermRetDescEn);
//      }
    }
  }

  /*����ӷ��������صĿ������б�*/
  this.saveCardTypeList = function(exch)
  {
    var cardType;
    var cardList = new Array();
    var num = exch.msgxmldomResp.selectNodesCount("/TransMsg/CARD/ITEM");
    for(var i=1; i<=num; i++)
    {    
    	cardType = new Object();
        cardType.strCuNum = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/CARD/ITEM[" + i + "]/strCuNum");
        cardType.strCardType = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/CARD/ITEM[" + i + "]/strCardType");
        cardType.strCardName = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/CARD/ITEM[" + i + "]/strCardName");
        cardType.strCardDesc = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/CARD/ITEM[" + i + "]/strCardDesc");
        cardType.strCardPic = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/CARD/ITEM[" + i + "]/strCardPic");
        cardList[cardList.length] = cardType;
    }
    top.pool.set("cardList", cardList);
  }
  
  /*��ȡUkey��������*/
  this.getUkeylist = function()
  {
    // �ӷ�������ȡ
//    top.wins.showNewProcessingTip("");
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ChooseUkey");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("ukeyListFlag", "1");
    	this.saveUkeyTypeList(exch);
    }
    else
    {	
    	top.pool.set("ukeyListFlag", "");
    }
  }

  /*����ӷ��������ص�Ukey�����б�*/
  this.saveUkeyTypeList = function(exch)
  {
    var ukeyType;
    var ukeyList = new Array();
    var num = exch.msgxmldomResp.selectNodesCount("/TransMsg/UKEY/ITEM");
    for(var i=1; i<=num; i++)
    {    
    	ukeyType = new Object();
    	ukeyType.strCuNum = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/UKEY/ITEM[" + i + "]/strCuNum");
    	ukeyType.strUkeyType = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/UKEY/ITEM[" + i + "]/strUkeyType");
    	ukeyType.strUkeyName = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/UKEY/ITEM[" + i + "]/strUkeyName");
    	ukeyList[ukeyList.length] = ukeyType;
    }
    top.pool.set("ukeyList", ukeyList);
  }
}
