/*
  取款
  UUID:1685AF26-9FCF-4E3C-8EC0-F57248800B14
 */
function Withdraw()
{
  // 出钞虚模块事件响应对象
  this.CdmEnr = new top.EventHandling(top.YHAXCashDispenser);
  this.CdmEnrFen = new top.EventHandling(top.YHAXCashDispenserFen);
  // 送钞后客户取钞超时时间
  this.iCashPresentTimeout = 120;
  // 取款币种
  this.strCurrency_Conf = "CNY";
  this.strCurrency = this.strCurrency_Conf;
  // 配钞算法
  this.strMixAlgorithm = "1";
  
  // 取款金额
  this.iAmount = -1;
  // 检查取款模块是否可用时，是否检查StTransportStatus状态
  this.bCheckTransportStatus = false;
 
  // 检查取款模块是否可用时，是否检查StSafeDoorStatus状态
  this.bCheckSafeDoorStatus = false;

  /*
    检查纸币取款功能是否可用
    返回：
      VM_AVAIL_OK       正常可用
      VM_AVAIL_LOCKED   被锁定
      VM_AVAIL_DEVERR   硬件故障
   */
   
  /*this.checkAvai = function()
  {
    // 为避免错误设置了面额的钞箱存在，进行检查并锁定
    //var minval = this.getCuMinNoteValue();
    // 纸币虚模块状态是否正常
    var StDeviceStatus = top.YHAXCashDispenser.StDeviceStatus;
    var StDispenserStatus = top.YHAXCashDispenser.StDispenserStatus;
    var StTransportStatus = top.YHAXCashDispenser.StTransportStatus;
    var StSafeDoorStatus = top.YHAXCashDispenser.StSafeDoorStatus;
    var StInputOutputStatus = top.YHAXCashDispenser.StInputOutputStatus;
	var StShutterStatus     = top.YHAXCashDispenser.StShutterStatus;
    if ( (StDeviceStatus != "HEALTHY")
      || (StDispenserStatus != "HEALTHY" && StDispenserStatus != "DEGRADED")//2018-1-10 去除  StDispenserStatus NODISPENSE UNKNOWN
      || (StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN" && StInputOutputStatus != "NOTSUPPORTED")
      || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "NOTSUPPORTED")
      || StSafeDoorStatus != "CLOSED"
	  || StShutterStatus != "CLOSED")
    {
      return false;
    }else{
	  return true;
	}
  }*/
  //2018-1-12 状态判断细化
  this.checkAvai = function()
  {
    // 为避免错误设置了面额的钞箱存在，进行检查并锁定
    //var minval = this.getCuMinNoteValue();
    // 纸币虚模块状态是否正常
    var StDeviceStatus = top.YHAXCashDispenser.StDeviceStatus;
    var StDispenserStatus = top.YHAXCashDispenser.StDispenserStatus;
    var StTransportStatus = top.YHAXCashDispenser.StTransportStatus;
    var StSafeDoorStatus = top.YHAXCashDispenser.StSafeDoorStatus;
    var StInputOutputStatus = top.YHAXCashDispenser.StInputOutputStatus;
	var StShutterStatus     = top.YHAXCashDispenser.StShutterStatus;
    if(StDeviceStatus != "HEALTHY"){
		return "硬件故障";
	}
	if(StDispenserStatus != "HEALTHY" && StDispenserStatus != "DEGRADED"){
		return "出钞模块状态不正确";
	}
	if((StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN" && StInputOutputStatus != "NOTSUPPORTED")
	  || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "NOTSUPPORTED")){
		return "钞口或通道状态不正确";
	}
	if(StSafeDoorStatus != "CLOSED"){
		return "安全门状态不正确";
	}
	if(StShutterStatus != "CLOSED"){
		return "钞门状态不正确";
	}
    return "true";
	
  }
  
  /*
  硬币的状态检查，需等SP
  */
 this.checkAvaiFen = function()
  {
	var StDeviceStatus = top.YHAXCashDispenserFen.StDeviceStatus;
    var StDispenserStatus = top.YHAXCashDispenserFen.StDispenserStatus;
    if(StDeviceStatus != "HEALTHY"){
    	return "硬币模块硬件故障";
    }
    if(StDispenserStatus != "HEALTHY" && StDispenserStatus != "DEGRADED" && StDispenserStatus != "NODISPENSE" && StDispenserStatus != "UNKNOWN")
    {
    	return "硬币模块出币状态不正确";
    }
    return "true";
 }
  /*
    获取取款时缺省的币种
    返回：
      CNY、RMB等币种
   */
  this.getCurrency = function()
  {
    return top.withdraw.strCurrency_Conf;
  }
  
  /*
　 获取钞箱信息的描述（用于流水记录）
   返回：
     钞箱信息的描述字符串
  */
  this.getCassUnitInfo = function()
  {
    var str = "";
    var logicalunits = top.YHAXCashDispenser.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      str += (logicalunit.NoteValue==0 ? "" : (logicalunit.NoteValue+":") ) + logicalunit.CurrentCount + "|";
    }
    if (str.length == 0)
      str = "Yun Failed!";
    else
      str = "Cass:" + str;
    
    var logicalunitsfens = top.YHAXCashDispenserFen.LogicalUnits;
    for (var i=0; i<logicalunitsfens.length; i++)
    {
      var logicalunitfen = logicalunitsfens.Item(i);
      str += (logicalunitfen.NoteValue==0 ? "" : (logicalunitfen.NoteValue+":") ) + logicalunitfen.CurrentCount + "|";
    }
    if (str.length == 0)
      str += "Fen Failed!";
    return str;
  }
  
     /*
    纸币配钞
    参数：
       strAmount    取款金额，以元为单位
       currency  币种
    MainFrame提供回调函数：
	  onMixComplete
      onMixFailed();
   */
  this.Mix = function(strAmount, currency)
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
	// 保存参数变量
    //this.iAmount = new top.DataConversion().str2Int(strAmount, -1);
	top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("MixComplete", top.withdraw.onMixComplete);
    top.withdraw.CdmEnr.appendEvent("NotDispensable", top.withdraw.onNotDispensable_Mix);
	top.withdraw.CdmEnr.appendEvent("FatalError", top.withdraw.onFatalError_Mix);
    top.YHAXCashDispenser.Mix(strAmount, currency, top.withdraw.strMixAlgorithm);
	top.journalPrinter.addCashJournalWithTime("纸币配钞 Withdraw command Mix(" + strAmount + ")",false);
  }
  
    // 纸币配钞成功
  this.onMixComplete = function()
  {
	top.journalPrinter.addCashJournalWithTime("纸币配钞成功 Withdraw Event onMixComplete",false);
    top.withdraw.CdmEnr.clearAll();
	if (typeof(top.MainFrame.onMixComplete) == "function")
      top.MainFrame.onMixComplete();			
  } 
  
    // 纸币配钞失败
  this.onNotDispensable_Mix = function()
  {
	top.journalPrinter.addCashJournalWithTime("纸币配钞失败 Withdraw Event onNotDispensable_Mix",true);
    top.withdraw.CdmEnr.clearAll();
    if (typeof(top.MainFrame.onMixFailed) == "function")
      top.MainFrame.onMixFailed();
  }
      // 纸币配钞硬件故障
  this.onFatalError_Mix = function()
  {
	top.journalPrinter.addCashJournalWithTime("纸币配钞硬件故障 Withdraw Event onFatalError_Mix",true);
    top.withdraw.CdmEnr.clearAll();
    if (typeof(top.MainFrame.onFatalError_Mix) == "function")
      top.MainFrame.onFatalError_Mix();
  }
  
     /*
    硬币配钞 
    参数：
       strAmount    取款金额，以元为单位
       currency  币种
    MainFrame提供回调函数：
	  onMixComplete
      onMixFailed();
   */ 
  this.MixFen = function(strAmount, currency)
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
	top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.CdmEnrFen.appendEvent("MixComplete", top.withdraw.onMixFenComplete);
    top.withdraw.CdmEnrFen.appendEvent("NotDispensable", top.withdraw.onNotDispensable_MixFen);
	top.withdraw.CdmEnrFen.appendEvent("FatalError", top.withdraw.onFatalError_MixFen);
    top.YHAXCashDispenserFen.Mix(strAmount, currency, top.withdraw.strMixAlgorithm);	
	top.journalPrinter.addCashJournalWithTime("硬币配钞 Withdraw command Mix(" + strAmount + ")",false);	
  }
   // 硬币配钞成功
  this.onMixFenComplete = function()
  {
	top.journalPrinter.addCashJournalWithTime("硬币配钞成功 Withdraw Event onMixComplete",false);
    top.withdraw.CdmEnrFen.clearAll();
	if (typeof(top.MainFrame.onMixFenComplete) == "function")
      top.MainFrame.onMixFenComplete();	
  }
  // 硬币配钞失败
  this.onNotDispensable_MixFen = function()
  {
	top.journalPrinter.addCashJournalWithTime("硬币配钞失败 Withdraw Event onNotDispensable_MixFen",true);
    top.withdraw.CdmEnrFen.clearAll();
    if (typeof(top.MainFrame.onMixFailedFen) == "function")
      top.MainFrame.onMixFailedFen();
  }
  // 硬币配钞硬件故障
  this.onFatalError_MixFen = function()
  {
	top.journalPrinter.addCashJournalWithTime("硬币配钞硬件故障 Withdraw Event onFatalError_MixFen",true);
    top.withdraw.CdmEnrFen.clearAll();
    if (typeof(top.MainFrame.onFatalError_MixFen) == "function")
      top.MainFrame.onFatalError_MixFen();
  } 
  /*
          指定钞箱出钞
	四个事件NotDispensable ，CashDispensed ，CashUnitError ，DeviceError
  MainFrame提供回调函数：
	  onCashDispensed
    onMixDispFailed();
   */
  this.Dispense = function(strAmount,strcount)
  {
	var strNewArray = new Array(0,0,0,0,strcount);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
	try{top.cashguidelights.setCashDispenLight("MEDIUM");}catch(e){} //出钞口灯&拒钞口灯
	top.withdraw.CdmEnr.clearAll();
	top.withdraw.CdmEnr.appendEvent("CashDispensed", top.withdraw.onCashDispensed);
	top.withdraw.CdmEnr.appendEvent("NotDispensable", top.withdraw.onNotDispensable_MixDisp);
	top.withdraw.CdmEnr.appendEvent("CashUnitError", top.withdraw.CashUnitError_MixDisp);
	top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onDeviceError_MixDisp);
	top.YHAXCashDispenser.Dispense(strAmount,strNewArray,top.withdraw.strCurrency, "0");
	top.journalPrinter.addCashJournalWithTime("纸币出钞 Withdraw Dispense(" + strAmount + ")",false); 
  }
    /*
    纸币出钞
	四个事件NotDispensable ，CashDispensed ，CashUnitError ，DeviceError
    MainFrame提供回调函数：
	  onCashDispensed
      onMixDispFailed();
  */
  this.MixAndDispense = function(strAmount)
  {	
    top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
	try{top.cashguidelights.setCashDispenLight("MEDIUM");}catch(e){} //出钞口灯&拒钞口灯
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("CashDispensed", top.withdraw.onCashDispensed);
    top.withdraw.CdmEnr.appendEvent("NotDispensable", top.withdraw.onNotDispensable_MixDisp);
    top.withdraw.CdmEnr.appendEvent("CashUnitError", top.withdraw.CashUnitError_MixDisp);
    top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onDeviceError_MixDisp);
    top.YHAXCashDispenser.MixAndDispense(strAmount, top.withdraw.strCurrency, top.withdraw.strMixAlgorithm);
	top.journalPrinter.addCashJournalWithTime("纸币出钞 Withdraw command MixAndDispense(" + strAmount + ")",false);
  }
  
      // 纸币出钞成功
  this.onCashDispensed = function()
  {
	top.journalPrinter.addCashJournalWithTime("纸币出钞成功 Withdraw Event onCashDispensed",false);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
	top.withdraw.CdmEnr.clearAll();
	if (typeof(top.MainFrame.onCashDispensed) == "function")
	  top.MainFrame.onCashDispensed();	 

  }
   // 纸币出钞失败预留这个事件,三个错误都调用相同的返回页面的处理方法
  this.onNotDispensable_MixDisp = function()
  {
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.onMixDispFailed();
  }
  
    this.CashUnitError_MixDisp = function()
  {
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.onMixDispFailed();
  }
  
  this.onDeviceError_MixDisp = function()
  {
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.onMixDispFailed();
  } 

  this.onMixDispFailed = function()
  {
	try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //出钞口灯&拒钞口灯
	top.journalPrinter.addCashJournalWithTime("纸币出钞失败 Withdraw Event onMixDispFailed",true);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
	top.withdraw.CdmEnr.clearAll();
    if (typeof(top.MainFrame.onMixDispFailed) == "function")
      top.MainFrame.onMixDispFailed();
  } 

    /*
    硬币出钞
	四个事件NotDispensable ，CashDispensed ，CashUnitError ，DeviceError
    MainFrame提供回调函数：
	  onCashDispensedFen
      onMixDispFailedFen
  */
  this.MixAndDispenseFen = function(strAmount)
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
	try{top.cashguidelights.setCoinDispenserLight("MEDIUM");}catch(e){} //硬币出口灯
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.CdmEnrFen.appendEvent("CashDispensed", top.withdraw.onCashDispensedFen);
    top.withdraw.CdmEnrFen.appendEvent("NotDispensable", top.withdraw.onNotDispensable_MixDispFen);
    top.withdraw.CdmEnrFen.appendEvent("CashUnitError", top.withdraw.CashUnitError_MixDispFen);
    top.withdraw.CdmEnrFen.appendEvent("DeviceError", top.withdraw.onDeviceError_MixDispFen);
    top.YHAXCashDispenserFen.MixAndDispense(strAmount, top.withdraw.strCurrency, top.withdraw.strMixAlgorithm);	
	top.journalPrinter.addCashJournalWithTime("硬币出钞 Withdraw command MixAndDispense(" + strAmount + ")",false);
	
  }
  this.onCashDispensedFen = function()
  {
	top.journalPrinter.addCashJournalWithTime("硬币出钞成功 Withdraw Event onCashDispensedFen",false);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
    top.withdraw.CdmEnrFen.clearAll();
	if (typeof(top.MainFrame.onCashDispensedFen) == "function")
		top.MainFrame.onCashDispensedFen();	
  }  
  
  // 硬币出钞失败预留这个事件,大家都是到onMixDispFailedFen调用
  this.onNotDispensable_MixDispFen = function()
  {
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.onMixDispFailedFen();
  } 
  this.CashUnitError_MixDispFen = function()
  {
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.onMixDispFailedFen();
  }
  
  this.onDeviceError_MixDispFen = function()
  {
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.onMixDispFailedFen();
  } 
  
  this.onMixDispFailedFen = function()
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
    if (typeof(top.MainFrame.onMixDispFailedFen) == "function")
      top.MainFrame.onMixDispFailedFen();
  }  
  /*
    纸币送钞动作
   */
  this.Present = function()
  {
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("CashPresented", top.withdraw.onCashPresented);
    top.withdraw.CdmEnr.appendEvent("CashTaken", top.withdraw.onCashTaken);
    top.withdraw.CdmEnr.appendEvent("Timeout", top.withdraw.onTimeout_Present);
    top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onDeviceError_Present);
    top.YHAXCashDispenser.Present(top.withdraw.iCashPresentTimeout*1000);
	top.journalPrinter.addCashJournalWithTime("纸币送钞 Withdraw command Present",false);
    // 取款送钞超时保护
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.withdraw.onDeviceError_Present();}, 120*1000);
  }
  
  // 送钞成功
  this.onCashPresented = function()
  {
	top.journalPrinter.addCashJournalWithTime("纸币送钞成功 Withdraw Event Present",false);
    if (typeof(top.MainFrame.onCashPresented) == "function")
      top.MainFrame.onCashPresented();
  }
 
  // 钞票取走
  this.onCashTaken = function()
  {
    try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //出钞口灯&拒钞口灯	
	top.journalPrinter.addCashJournalWithTime("纸币钞票取走 Withdraw Event onCashTaken",false);
	top.serviceCtrl.stopFlowCtrlTimeout();
	top.withdraw.CdmEnr.clearAll();
	top.withdraw.closeShutter();

  }
  
  // 送钞后用户超时未取走钞票的事件
  this.onTimeout_Present = function()
  {
	top.journalPrinter.addCashJournalWithTime("纸币钞票超时未取 Withdraw Event onTimeout_Present",true);
	top.withdraw.CdmEnr.clearAll();
	try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //出钞口灯&拒钞口灯
	if (typeof(top.MainFrame.onTimeout_Present) == "function")
      top.MainFrame.onTimeout_Present();
  }

  this.onDeviceError_Present = function()
  {
	top.withdraw.CdmEnr.clearAll();
	try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //出钞口灯&拒钞口灯
    // 取消取款送钞超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();
	top.journalPrinter.addCashJournalWithTime("纸币钞票送钞失败 Withdraw Event onDeviceError_Present",true);
	top.withdraw.CdmEnr.clearAll();
	if (typeof(top.MainFrame.onDeviceError_Present) == "function")
      top.MainFrame.onDeviceError_Present();
  }
  
  /*
   * ShutterClosed or DeviceError
   */
  this.closeShutter = function()
  {	  
	top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("ShutterClosed", top.withdraw.ShutterClosed);
    top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onDeviceError_closeShutter);
    top.YHAXCashDispenser.CloseShutter();	
    top.journalPrinter.addCashJournalWithTime("关闭钞门  Withdraw command CloseShutter",false);
  }
  /*
   * 关门回调
   * */
  this.ShutterClosed = function()
  {
	  top.withdraw.CdmEnr.clearAll();
	  top.journalPrinter.addCashJournalWithTime("钞门已关闭 ShutterClosed",false);
	  if (typeof(top.MainFrame.onCashTaken) == "function")
	     top.MainFrame.onCashTaken();
  }
  /*
   * 关门硬件故障
   * */ 
  this.onDeviceError_closeShutter = function()
  {
	  top.withdraw.CdmEnr.clearAll();
	  top.journalPrinter.addCashJournalWithTime("钞口关门故障 DeviceError",false); 
	  try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //出钞口灯&拒钞口灯
	  // 取消取款送钞超时保护
	  top.serviceCtrl.stopFlowCtrlTimeout();
	  if (typeof(top.MainFrame.onDeviceError_closeShutter) == "function")
	     top.MainFrame.onDeviceError_closeShutter();
  }
 /*
    纸币Reset
	Mix以及MIx前调用，之后不调用，钱会Reset推到钞口
   */
 this.reset4Mix = function()
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("ResetComplete", top.withdraw.onResetEnd4MixDispFailed);
    top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onResetEnd4MixDispFailed);
    top.YHAXCashDispenser.Reset("RETRACT", 0);
	top.journalPrinter.addCashJournalWithTime("纸币Reset Withdraw command reset4Mix",true);
  }

  /*
    复位结束失败的事件回调的处理函数
   */
  this.onResetEnd4MixDispFailed = function()
  {
	top.journalPrinter.addCashJournalWithTime("纸币复位失败 Withdraw Event onResetEnd4MixDispFailed",true);
    top.withdraw.CdmEnr.clearAll();	
	if (typeof(top.MainFrame.onResetEndFailed) == "function")
	{
		top.MainFrame.onResetEndFailed();
	}
  } 
  
  
    /*
    复位结束成功的事件回调的处理函数
   */
  this.onResetEnd4MixDispSucc = function()
  {
	top.journalPrinter.addCashJournalWithTime("纸币复位成功 Withdraw Event onResetEnd4MixDispSucc",true);
    top.withdraw.CdmEnr.clearAll();	
	if (typeof(top.MainFrame.onResetEndSucc) == "function")
	{
		top.MainFrame.onResetEndSucc();
	}
  }
     /*
    硬币送钞动作
   */
  this.PresentFen = function()
  {
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.CdmEnrFen.appendEvent("CashPresented", top.withdraw.onCashPresentedFen);
    top.withdraw.CdmEnrFen.appendEvent("CashTaken", top.withdraw.onCashTakenFen);
    top.withdraw.CdmEnrFen.appendEvent("Timeout", top.withdraw.onTimeout_PresentFen);
    top.withdraw.CdmEnrFen.appendEvent("DeviceError", top.withdraw.onDeviceError_PresentFen);
    top.YHAXCashDispenserFen.Present(top.withdraw.iCashPresentTimeout*1000);
	top.journalPrinter.addCashJournalWithTime("硬币送钞 Withdraw command PresentFen",false);
	try{top.cashguidelights.setCoinAcceptorLight("MEDIUM");}catch(e){} //硬币出口灯
	// 取款送钞超时保护
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.withdraw.onDeviceError_PresentFen();}, 120*1000);
  }
  
  this.onCashPresentedFen = function()
  {
	try{top.cashguidelights.setCoinDispenserLight("OFF");}catch(e){} //硬币出口灯
	try{top.cashguidelights.setCoinAcceptorLight("OFF");}catch(e){} //硬币内侧照明灯
	top.withdraw.CdmEnrFen.clearAll();	
	top.serviceCtrl.stopFlowCtrlTimeout();
	if (typeof(top.MainFrame.onCashPresentedFen) == "function")
	{
		top.MainFrame.onCashPresentedFen();
	}  
  }
  
  // 送钞后用户超时未取走钞票的事件
  this.onTimeout_PresentFen = function()
  {
	  top.serviceCtrl.stopFlowCtrlTimeout();
	  try{top.cashguidelights.setCoinDispenserLight("OFF");}catch(e){} //硬币出口灯
	  try{top.cashguidelights.setCoinAcceptorLight("OFF");}catch(e){} //硬币内侧照明灯
  }
  
  // 送钞后用户超时未取走钞票的事件
  this.onCashTakenFen = function()
  {
	  top.serviceCtrl.stopFlowCtrlTimeout();
	  try{top.cashguidelights.setCoinDispenserLight("OFF");}catch(e){} //硬币出口灯
	  try{top.cashguidelights.setCoinAcceptorLight("OFF");}catch(e){} //硬币内侧照明灯
  }
  
  this.onDeviceError_PresentFen = function()
  {
    // 取消取款送钞超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();
	try{top.cashguidelights.setCoinDispenserLight("OFF");}catch(e){} //硬币出口灯
	try{top.cashguidelights.setCoinAcceptorLight("OFF");}catch(e){} //硬币内侧照明灯    
  }  
  
  //根据取款金额判断纸币、硬币模块状态
  this.checkDeviceStatus = function(strAmount)
  {
	var strAvaiStatus = top.withdraw.checkAvai();	
	var strAvaiFenStatus = top.withdraw.checkAvaiFen();
	var strCheckAmount = strAmount.toString();
	//金额判断以分为单位
	if(strCheckAmount.length > 3){
		if(strCheckAmount.substr(strCheckAmount.length-3,strCheckAmount.length) == "000"){
			if(strAvaiStatus != "true"){
				//只有纸币，判断纸币模块状态
				return strAvaiStatus;
			}else{
				return "true";
			}	    	
		}else{
			//有纸币和硬币，2个模块均判断
			if(strAvaiStatus != "true" || strAvaiFenStatus != "true"){
				if(strAvaiFenStatus != "true"){
					return strAvaiFenStatus;
				}
				if(strAvaiStatus != "true"){
					return strAvaiStatus;
				}
			}else{
				return "true";
			}			
		}			
	}else{
		//只有硬币
		if(strAvaiFenStatus != "true"){
			return strAvaiFenStatus;
		}else{
			return "true";
		} 
	}   
  }

}
 