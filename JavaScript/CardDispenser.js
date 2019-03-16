/*
  发卡器操作类
 */
function CardDispenser()
{
  // 读卡器虚模块事件响应对象
  this.CardDispenserEvents = new top.EventHandling(top.YHAXCardDispenser);
  //------------------------- 发卡器操作类私有属性 -------------------------//
  /* 退出卡后等待用户取卡时间 单位（秒）*/
  this.EjectTimeout = 120;
  //------------------------- 发卡器执行的方法 -------------------------//

  /*允许发卡*/
  this.dispensecard = function(strPresentPosition,id)
  {
    top.carddispenser.CardDispenserEvents.clearAll();
    top.carddispenser.CardDispenserEvents.appendEvent("CardDispensed", top.carddispenser.onCardDispensed);
    top.carddispenser.CardDispenserEvents.appendEvent("CardUnitThresholdCrossed", top.carddispenser.onCardUnitThresholdCrossed);
    top.carddispenser.CardDispenserEvents.appendEvent("CardTaken", top.carddispenser.onCardTaken);
	top.carddispenser.CardDispenserEvents.appendEvent("Timeout", top.carddispenser.onTimeout);
    top.carddispenser.CardDispenserEvents.appendEvent("DeviceError", top.carddispenser.onDeviceError);
	top.carddispenser.CardDispenserEvents.appendEvent("FatalError", top.carddispenser.onDeviceError);
    top.carddispenser.CardDispenserEvents.appendEvent("CardUnitError", top.carddispenser.onDeviceError);
    top.journalPrinter.addJournalWithTime("允许发卡 CardDispenser command DispenseCard" + top.journalPrinter.strNewLine);
    top.YHAXCardDispenser.DispenseCard(strPresentPosition,id,this.EjectTimeout*1000);
	// 控制指示灯
    try{top.guidelights.setCardReaderLight("MEDIUM");}catch(e){}
  }

  /*不允许发卡*/
  this.cancelDispense = function()
  {
	 top.journalPrinter.addJournalWithTime("不允许发卡 CardDispenser command CancelDispense" + top.journalPrinter.strNewLine);
     top.YHAXCardDispenser.CancelDispense();
	 // 控制指示灯
     try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
  }

  /*发卡器复位*/
  this.reset = function ()
  {
	top.carddispenser.CardDispenserEvents.clearAll();
	top.carddispenser.CardDispenserEvents.appendEvent("ResetComplete", top.carddispenser.onResetComplete);
	top.carddispenser.CardDispenserEvents.appendEvent("DeviceError", top.carddispenser.onDeviceError);
	top.carddispenser.CardDispenserEvents.appendEvent("FatalError", top.carddispenser.onDeviceError);
	//有介质复位时，发吞卡例外报告
	if(isCardPresent()==true){
		sendCaptureStatus();
	}
	top.journalPrinter.addJournalWithTime("发卡器复位 CardDispenser command Reset" + top.journalPrinter.strNewLine);
    top.YHAXCardDispenser.Reset("RETRACT");
  }

  /*初始化卡箱配置信息*/
  this.InitiateCardUnitConfiguration = function (CardUnitsToConfiguration)
  {
	top.journalPrinter.addJournalWithTime("卡箱配置初始化 CardDispenser command InitiateCardUnitConfiguration" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    top.carddispenser.CardDispenserEvents.appendEvent("ConfigurationInitiated",top.carddispenser.onConfigurationInitiated);
    top.carddispenser.CardDispenserEvents.appendEvent("ConfigurationFailed",top.carddispenser.onConfigurationFailed);
    
    top.YHAXCardDispenser.InitiateCardUnitConfiguration(CardUnitsToConfiguration);
  }



  /*完成卡箱配置信息*/
  this.CompletedCardUnitConfiguration = function(){
	top.journalPrinter.addJournalWithTime("卡箱配置完成 CardDispenser command CompletedCardUnitConfiguration" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    top.carddispenser.CardDispenserEvents.appendEvent("ConfigurationCompleted", top.carddispenser.onConfigurationCompleted);
    top.carddispenser.CardDispenserEvents.appendEvent("ConfigurationFailed", top.carddispenser.onConfigurationFailed);
    top.carddispenser.CardDispenserEvents.appendEvent("NotSupported", top.carddispenser.onNotSupported);
    top.carddispenser.CardDispenserEvents.appendEvent("DeviceError", top.carddispenser.onDeviceError);
    top.YHAXCardDispenser.CompletedCardUnitConfiguration();
  }

  /*卡箱阈信息改变事件响应*/
  this.onCardUnitThresholdCrossed = function()
  {
	top.journalPrinter.addJournalWithTime("卡箱阈值 CardDispenser Event onCardUnitThresholdCrossed" + top.journalPrinter.strNewLine);
	top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onCardUnitThresholdCrossed) == "function"){
      top.MainFrame.onCardUnitThresholdCrossed();
	}
  }

  /*发卡超时的事件响应*/
  this.onTimeout = function()
  {
	top.journalPrinter.addJournalWithTime("发卡超时 CardDispenser Event onTimeout" + top.journalPrinter.strNewLine);
	top.carddispenser.CardDispenserEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout) == "function")
      top.MainFrame.onTimeout();
  }

  /*发卡器卡成功的事件响应*/
  this.onCardDispensed = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("卡已经发出 CardDispenser Event onCardDispensed" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setCardReaderLight("QUICK");}catch(e){}
    if (typeof(top.MainFrame.onCardDispensed) == "function"){
      top.MainFrame.onCardDispensed();
	}
  }

  /*发卡器卡已经被客户取走的事件响应*/
  this.onCardTaken = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("卡被取走 CardDispenser Event onCardTaken" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    // 控制指示灯
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardTaken) == "function")
      top.MainFrame.onCardTaken();
    else if (typeof(top.onCardTaken) == "function")
      top.onCardTaken();
  }

  /*发卡器硬件故障的事件响应*/
  this.onDeviceError = function()
  {
	top.journalPrinter.addJournalWithTime("发卡器故障 CardDispenser Event onDeviceError" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_CardDispenser) == "function")
    {
      top.MainFrame.onDeviceError_CardDispenser();
    }else if (typeof(top.onDeviceError_CardDispenser) == "function")
    {
      top.onDeviceError_CardDispenser();
    }else{}
  };

  /*读卡器复位成功的事件响应*/
  this.onResetComplete = function()
  {
	top.journalPrinter.addJournalWithTime("发卡器复位成功 CardDispenser Event onResetComplete" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_CardDispenser) == "function")
    {
      top.MainFrame.onResetComplete_CardDispenser();
    }else if (typeof(top.onResetComplete_CardDispenser) == "function")
    {
      top.onResetComplete_CardDispenser();
    }else{}
  };

  /*初始化卡箱配置信息成功的事件响应*/
  this.onConfigurationInitiated = function(){
	top.journalPrinter.addJournalWithTime("初始化卡箱配置信息成功 CardDispenser Event onConfigurationInitiated" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationInitiated) == "function")
    {
      top.MainFrame.onConfigurationInitiated();
    }else if (typeof(top.onConfigurationInitiated) == "function")
    {
      top.onConfigurationInitiated();
    }else{}
  }
  /*完成卡箱配置信息的事件响应*/
  this.onConfigurationCompleted = function(){
	top.journalPrinter.addJournalWithTime("完成卡箱配置信息成功 CardDispenser Event onConfigurationCompleted" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationCompleted) == "function")
    {
      top.MainFrame.onConfigurationCompleted();
    }else if (typeof(top.onConfigurationCompleted) == "function")
    {
      top.onConfigurationCompleted();
    }else{}
  }
  /*初始化卡箱配置信息失败的事件响应*/
  this.onConfigurationFailed = function ()
  {
	top.journalPrinter.addJournalWithTime("初始化参数失败 CardDispenser Event onConfigurationFailed" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationFailed) == "function")
    {
      top.MainFrame.onConfigurationFailed();
    }else if (typeof(top.onConfigurationFailed) == "function")
    {
      top.onConfigurationFailed();
    }else{}
  }
  /*不支持配置卡箱配置信息的事件响应*/
  this.onNotSupported = function(){
	top.journalPrinter.addJournalWithTime("不支持配置卡箱配置信息 CardDispenser Event onNotSupported" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onNotSupported) == "function")
    {
      top.MainFrame.onNotSupported();
    }else if (typeof(top.onNotSupported) == "function")
    {
      top.onNotSupported();
    }else{}
  }
  //-------------换卡------------------//
  /*换卡-发卡*/
  this.exdispensecard = function(strPresentPosition,id)
  {
    top.carddispenser.CardDispenserEvents.clearAll();
    top.carddispenser.CardDispenserEvents.appendEvent("CardDispensed", top.carddispenser.onExCardDispensed);
    top.carddispenser.CardDispenserEvents.appendEvent("CardUnitThresholdCrossed", top.carddispenser.onExCardUnitThresholdCrossed);
    top.carddispenser.CardDispenserEvents.appendEvent("CardTaken", top.carddispenser.onExCardTaken);
	top.carddispenser.CardDispenserEvents.appendEvent("Timeout", top.carddispenser.onTimeout);
    top.carddispenser.CardDispenserEvents.appendEvent("DeviceError", top.carddispenser.onDeviceError);
	top.carddispenser.CardDispenserEvents.appendEvent("FatalError", top.carddispenser.onDeviceError);
    top.carddispenser.CardDispenserEvents.appendEvent("CardUnitError", top.carddispenser.onDeviceError);
    top.journalPrinter.addJournalWithTime("允许发卡(换卡) CardDispenser command DispenseCard" + top.journalPrinter.strNewLine);
    top.YHAXCardDispenser.DispenseCard(strPresentPosition,id,this.EjectTimeout*1000);
	// 控制指示灯
    try{top.guidelights.setCardReaderLight("MEDIUM");}catch(e){}
  }

    /*发卡器-换卡-卡成功的事件响应*/
  this.onExCardDispensed = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("换卡已经发出 CardDispenser Event onExCardDispensed" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setCardReaderLight("QUICK");}catch(e){}
    if (typeof(top.MainFrame.onExCardDispensed) == "function"){
      top.MainFrame.onExCardDispensed();
	}
  }

   /*发卡器-换卡-卡已经被客户取走的事件响应*/
  this.onExCardTaken = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("换卡被取走 CardDispenser Event onExCardTaken" + top.journalPrinter.strNewLine);
    // 控制指示灯
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onExCardTaken) == "function")
      top.MainFrame.onExCardTaken();
    else if (typeof(top.onExCardTaken) == "function")
      top.onExCardTaken();
  }
  /*卡箱阈信息改变事件响应*/
  this.onExCardUnitThresholdCrossed = function()
  {
	top.journalPrinter.addJournalWithTime("卡箱阈值 CardDispenser Event onExCardUnitThresholdCrossed" + top.journalPrinter.strNewLine);
    if (typeof(top.MainFrame.onExCardUnitThresholdCrossed) == "function"){
      top.MainFrame.onExCardUnitThresholdCrossed();
	}
  }

  //------------------------- 其它辅助方法 -------------------------//

  /*判断发卡器中是否存在卡*/
  this.isCardPresent = function()
  {
    return (top.YHAXCardDispenser.StMediaStatus == "PRESENT");
  }
     /*
　　 获取卡箱信息
   */
  this.getCardUnitInfo = function()
  {
	//获取卡箱信息的时候，先取下状态，防止取出SP缓存信息
	top.YHAXCardDispenser.StDeviceStatus;
	top.YHAXCardDispenser.StMediaStatus;
	top.YHAXCardDispenser.StDispenserStatus;
    var str = "";
	var strRecordArr = new Array();
    var logicalunits = top.YHAXCardDispenser.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      str += logicalunit.Number + "," + logicalunit.Type + "," + logicalunit.Status + "," + logicalunit.CurrentCount + "," + logicalunit.InitialCount + "," + logicalunit.Threshold + "," + logicalunit.RetainCount +"|";
      strRecordArr[strRecordArr.length] =new Array(
                logicalunit.Number,
                logicalunit.Type,
	            logicalunit.Status,
	            logicalunit.CurrentCount,
                logicalunit.InitialCount,
				logicalunit.Threshold,
				logicalunit.RetainCount);
	}
	var strJrn = new top.StringCtrl("卡箱信息: "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	strJrn = strJrn + str + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
    return strRecordArr;
  }

  /*
　 私有函数：向服务器报告卡被回收的信息
    返回：
    报告终端动作状态的结果，包括
    RESULT_SUCCESSFUL
    RESULT_FAILED
    RESULT_UNCERTAIN
  */
  this.sendCaptureStatus = function()
  {
     var exch = new ExchangeXmlWithHost();
	  var reqMsg = new ColsMsgXmlText();
     reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AppendExpLog");
     reqMsg.appendNode("strExpCode", top.EXPCODE_CARDDISPENSER);
	  reqMsg.appendNode("strPan", top.pool.get("strPan"));         //卡号
     reqMsg.appendNode("strMemo", "发卡回收");
     var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
     return iRet;
  }
}
