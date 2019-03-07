/*
  发Ukey操作类
 */
function UkeyDispenser()
{	
  // U盾机虚模块事件响应对象
  this.UkeyDispenserEvents = new top.EventHandling(top.YHAXUkeyDispenser);
  //------------------------- 发U盾作类私有属性 -------------------------//
  /* 退出U盾后等待用户取卡时间 单位（秒）*/
  this.EjectTimeout = 120;
  //------------------------- 发U盾执行的方法 -------------------------//      
	
  /*允许发U盾*/
  this.dispenseukey = function(strPresentPosition,id)
  {
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyDispensed", top.ukeydispenser.onUkeyDispensed);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyUnitThresholdCrossed", top.ukeydispenser.onUkeyUnitThresholdCrossed);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("Timeout", top.ukeydispenser.onTimeout);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("FatalError", top.ukeydispenser.onDeviceError);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyUnitError", top.ukeydispenser.onDeviceError);
    top.journalPrinter.addJournalWithTime("允许发Ukey UkeyDispenser command DispenseUkey" + top.journalPrinter.strNewLine);
    top.YHAXUkeyDispenser.DispenseUkey(strPresentPosition,id,this.EjectTimeout*1000);
	// 控制指示灯
    try{top.guidelights.setCoinDispenserLight("MEDIUM");}catch(e){}
  }
  
  /*不允许发U盾*/
  this.cancelDispense = function()
  {
	 top.journalPrinter.addJournalWithTime("不允许发Ukey UkeyDispenser command CancelDispense" + top.journalPrinter.strNewLine);
     top.YHAXUkeyDispenser.CancelDispense();
	 // 控制指示灯
     try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
  }
    /*吐Ukey*/
  this.eject = function()
  {
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyEjected", top.ukeydispenser.onUkeyEjected);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("Timeout", top.ukeydispenser.onTimeout_Eject);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyTaken", top.ukeydispenser.onUkeyTaken);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyRetained", top.ukeydispenser.onUkeyCaptured);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("FatalError", top.ukeydispenser.onDeviceError);
	top.journalPrinter.addJournalWithTime("吐Ukey UkeyDispenser command EjectUkey" + top.journalPrinter.strNewLine);
    top.YHAXUkeyDispenser.EjectUkey(this.EjectTimeout*1000);
  }
  /*U盾机复位*/
  this.reset = function ()
  {
	top.ukeydispenser.UkeyDispenserEvents.clearAll();
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("ResetComplete", top.ukeydispenser.onResetComplete);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("FatalError", top.ukeydispenser.onDeviceError);
	top.journalPrinter.addJournalWithTime("Ukey模块复位 UkeyDispenser command Reset" + top.journalPrinter.strNewLine);
    top.YHAXUkeyDispenser.Reset("RETAIN");
  }
  /*吞Ukey*/
  this.capture = function()
  {
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyTaken", top.ukeydispenser.onUkeyTaken);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyRetained", top.ukeydispenser.onUkeyCaptured);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("FatalError", top.ukeydispenser.onDeviceError);
	//有介质时，发吞KEY例外报告
	if(isUkeyPresent()==true){
		sendCaptureStatus();
	}
	top.journalPrinter.addJournalWithTime("吞Ukey UkeyDispenser command RetainUkey" + top.journalPrinter.strNewLine);
    top.YHAXUkeyDispenser.RetainUkey(2);
  }
   /*U盾已经被退出的事件响应*/
  this.onUkeyEjected = function()
  {
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("Ukey退出 UkeyDispenser Event onUkeyEjected" + top.journalPrinter.strNewLine);
    // 控制指示灯
    try{top.guidelights.setCoinDispenserLight("QUICK");}catch(e){}
    // 播放提示音
    try{top.soundPlayer.TakeCardMusic();}catch(e){}
    if (typeof(top.MainFrame.onUkeyEjected) == "function")
      top.MainFrame.onUkeyEjected();
    else if (typeof(top.onUkeyEjected) == "function")
      top.onUkeyEjected();
  }
  /*退U盾超时未被客户取走的事件响应*/
  this.onTimeout_Eject = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("Ukey退出超时 UkeyDispenser Event onTimeout_Eject" + top.journalPrinter.strNewLine);
    if (typeof(top.MainFrame.onTimeout_Eject) == "function")
      top.MainFrame.onTimeout_Eject();
    else if (typeof(top.onTimeout_Eject) == "function")
      top.onTimeout_Eject();
  }

     /*Ukey已经被吞入的事件响应*/
  this.onUkeyCaptured = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("Ukey被吞 UkeyDispenser Event onUkeyCaptured" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onUkeyCaptured) == "function")
      top.MainFrame.onUkeyCaptured();
    else if (typeof(top.onUkeyCaptured) == "function")
      top.onUkeyCaptured();
  }
  /*U盾机信息改变事件响应*/
  this.onUkeyUnitThresholdCrossed = function()
  {
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onUkeyUnitThresholdCrossed) == "function"){
      top.MainFrame.onUkeyUnitThresholdCrossed();
	}
  }

  /*发U盾超时的事件响应*/
  this.onTimeout = function()
  {
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("发Ukey超时 UkeyDispenser Event onTimeout" + top.journalPrinter.strNewLine);
	top.ukeydispenser.UkeyDispenserEvents.clearAll();
    // 控制指示灯
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout_UkeyDispensed) == "function")
      top.MainFrame.onTimeout_UkeyDispensed();
	else if (typeof(top.onTimeout_UkeyDispensed) == "function")
      top.onTimeout_UkeyDispensed();
  }

  /*发U盾机发ukey成功的事件响应*/
  this.onUkeyDispensed = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("Ukey已经发出 UkeyDispenser Event onUkeyDispensed" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onUkeyDispensed) == "function")
      top.MainFrame.onUkeyDispensed();
	else if (typeof(top.onUkeyDispensed) == "function")
      top.onUkeyDispensed();
  }
  
  /*发U盾机ukey已经被客户取走的事件响应*/
  this.onUkeyTaken = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("UKEY被取走 UkeyDispenser Event onUkeyTaken" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    // 控制指示灯
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onUkeyTaken) == "function")
      top.MainFrame.onUkeyTaken();
    else if (typeof(top.onUkeyTaken) == "function")
      top.onUkeyTaken();
  }
  
  /*发U盾机硬件故障的事件响应*/
  this.onDeviceError = function()
  {
	top.journalPrinter.addJournalWithTime("发U盾机故障 UkeyDispenser Event onDeviceError" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_UkeyDispenser) == "function")
    {
      top.MainFrame.onDeviceError_UkeyDispenser();
    }else if (typeof(top.onDeviceError_UkeyDispenser) == "function")
    {
      top.onDeviceError_UkeyDispenser();
    }else{}
  };

  /*U盾机复位成功的事件响应*/
  this.onResetComplete = function()
  {
	top.journalPrinter.addJournalWithTime("U盾机复位成功 UkeyDispenser Event onResetComplete" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_UkeyDispenser) == "function")
    {
      top.MainFrame.onResetComplete_UkeyDispenser();
    }else if (typeof(top.onResetComplete_UkeyDispenser) == "function")
    {
      top.onResetComplete_UkeyDispenser();
    }else{}
  };

  //------------------------- 其它辅助方法 -------------------------//

  /*判断U盾机中是否存在ukey*/
  this.isUkeyPresent = function()
  {
    return (top.YHAXUkeyDispenser.StMediaStatus == "PRESENT");
  } 
     /*
　　 获取Ukey箱信息
   */
  this.getUkeyUnitInfo = function()
  {
	//获取U盾机信息的时候，先取下状态，防止取出SP缓存信息
	top.YHAXUkeyDispenser.StDeviceStatus;
	top.YHAXUkeyDispenser.StMediaStatus;
	top.YHAXUkeyDispenser.StDispenserStatus;
    var str = "";
	var strRecordArr = new Array();
    var logicalunits = top.YHAXUkeyDispenser.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      str += logicalunit.Number + "," + logicalunit.Type + "," + logicalunit.Status + "," + logicalunit.CurrentCount + "," + logicalunit.InitialCount + "|";
      strRecordArr[strRecordArr.length] =new Array(
                logicalunit.Number,
                logicalunit.Type,
	            logicalunit.Status,
	            logicalunit.CurrentCount,
                logicalunit.InitialCount);
	}
	var strJrn = new top.StringCtrl("U盾机信息: "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	strJrn = strJrn + str + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
    return strRecordArr;
  }
  this.getUkeyInfo= function(){
    //获取U盾机信息的时候，先取下状态，防止取出SP缓存信息
      top.YHAXUkeyDispenser.StDeviceStatus;
      top.YHAXUkeyDispenser.StMediaStatus;
      top.YHAXUkeyDispenser.StDispenserStatus;
        var str = "";
      var strRecordArr = new Array();
        var logicalunits = top.YHAXUkeyDispenser.LogicalUnits;
        for (var i=0; i<logicalunits.length; i++)
        {
          var logicalunit = logicalunits.Item(i);
          str += logicalunit.Number + "," + logicalunit.Type + "," + logicalunit.Status + "," + logicalunit.CurrentCount + "," + logicalunit.InitialCount + "|";
          strRecordArr[strRecordArr.length] =new Array(
                    logicalunit.Number,
                    logicalunit.Type,
                  logicalunit.InitialCount,
                  logicalunit.InitialCount-logicalunit.CurrentCount,
                    logicalunit.CurrentCount,
                    logicalunit.RetainCount,
                    logicalunit.Threshold
                    );
  }
  var strJrn = new top.StringCtrl("U盾机信息: "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
  strJrn = strJrn + str + top.journalPrinter.strNewLine;
  top.journalPrinter.addJournal(strJrn);
    return strRecordArr;
  }
  
  /*初始化Ukey箱配置信息*/
  this.InitiateUkeyUnitConfiguration = function (UkeyUnitsToConfiguration)
  {
	top.journalPrinter.addJournalWithTime("Ukey箱配置初始化 UkeyDispenser command InitiateUkeyUnitConfiguration" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("ConfigurationInitiated", top.ukeydispenser.onConfigurationInitiated);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("ConfigurationFailed", top.ukeydispenser.onConfigurationFailed);
    top.YHAXUkeyDispenser.InitiateUkeyUnitConfiguration(UkeyUnitsToConfiguration);
  }


  /*完成Ukey箱配置信息*/
  this.CompletedUkeyUnitConfiguration = function(){
	top.journalPrinter.addJournalWithTime("Ukey箱配置完成 UkeyDispenser command CompletedUkeyUnitConfiguration" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("ConfigurationCompleted", top.ukeydispenser.onConfigurationCompleted);  
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("ConfigurationFailed", top.ukeydispenser.onConfigurationFailed);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("NotSupported", top.ukeydispenser.onNotSupported);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
    top.YHAXUkeyDispenser.CompletedUkeyUnitConfiguration();
  }

  this.onConfigurationCompleted=function(){
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("添加UKey成功 UkeyDispenser Event onConfigurationCompleted" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationCompleted) == "function"){
      top.MainFrame.onConfigurationCompleted();
    }

  }
  this.onConfigurationInitiated=function(){
	top.journalPrinter.addJournalWithTime("添加UKey初始化 UkeyDispenser Event onConfigurationInitiated" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationInitiated) == "function"){
      top.MainFrame.onConfigurationInitiated();
    }
  }
  this.onNotSupported=function(){
	top.journalPrinter.addJournalWithTime("配置不支持 UkeyDispenser Event onNotSupported" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onNotSupported) == "function")
    {
      top.MainFrame.onNotSupported();
    }else if (typeof(top.onNotSupported) == "function")
    {
      top.onNotSupported();
    }else{}
  }
  this.onConfigurationFailed=function(){
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("添加UKey失败 UkeyDispenser Event onConfigurationFailed" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationFailed) == "function"){
      top.MainFrame.onConfigurationFailed();
    }
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
	 reqMsg.appendNode("strPan", top.pool.get("LocalUkeyNum"));         //UKEY号
	 reqMsg.appendNode("strMemo", "发KEY回收");
	 var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
     return iRet;
  }
}
