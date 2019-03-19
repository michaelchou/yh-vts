/*
存款：D7D0B898-40CF-46AF-9F76-F8EBA24D78E1
 */
function Deposit()
{
  // 存款虚模块事件响应对象
  this.CimEnr = new top.EventHandling(top.YHAXCashAcceptor);


  // 是否能够检测到钱被插入
  this.CpCanDetectCashInserted = top.YHAXCashAcceptor.CpCanDetectCashInserted;

  // 存款受理的币种
  this.strCurrency          = "CNY";
  // 接受用户插入钞票超时秒数
  this.iAcceptCashTimeout   = 120;
  // 用户取走拒钞或退钞的超时秒数
  this.iEjectCashTimeout    = -1;

  // 验钞前的事件
  this.EIC_ACCEPTCANCELLED  = 1;
  this.EIC_ACCEPTED         = 2;
  this.EIC_ACCEPTTIMEOUT    = 3;
  this.EIC_RFUCASHTAKEN     = 4;
  
  this.iAmount = 0;
  this.dtDepositStart = "";
  this.iWaitSecondsAfterDepEnd = 120;
  
  /*
    检查存款功能是否可用
    返回：
      VM_AVAIL_OK       正常可用
      VM_AVAIL_LOCKED   被锁定
      VM_AVAIL_DEVERR   硬件故障
  */
//  this.checkAvai = function()
//  {
//    // 虚模块状态是否正常
//    var StDeviceStatus      = top.YHAXCashAcceptor.StDeviceStatus;
//    var StAcceptorStatus    = top.YHAXCashAcceptor.StAcceptorStatus;
//    var StInputOutputStatus = top.YHAXCashAcceptor.StInputOutputStatus;
//    var StTransportStatus   = top.YHAXCashAcceptor.StTransportStatus;
//    var StShutterStatus     = top.YHAXCashAcceptor.StShutterStatus;
//    var StSafeDoorStatus    = top.YHAXCashAcceptor.StSafeDoorStatus;
//    
//    if (StDeviceStatus != "HEALTHY"
//      || (StAcceptorStatus != "HEALTHY" && StAcceptorStatus != "DEGRADED" && StAcceptorStatus != "UNKNOWN")
//      || (StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN")
//      || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "EMPTY")
//      || (StTransportStatus == "UNKNOWN" && StInputOutputStatus == "UNKNOWN") 
//      || StShutterStatus != "CLOSED"
//      || StSafeDoorStatus != "CLOSED")
//    {
//      top.deposit.CimEnr.appendEvent("ResetComplete", top.deposit.onResetEnd4StatusError);
//      top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onResetEnd4StatusError);
//      top.YHAXCashAcceptor.Reset("RETRACT", 0);     
//      return false;
//	}
//    return true;
//  }
  
  this.checkAvai = function()
  {
    // 虚模块状态是否正常
    var StDeviceStatus      = top.YHAXCashAcceptor.StDeviceStatus;
    var StAcceptorStatus    = top.YHAXCashAcceptor.StAcceptorStatus;
    var StInputOutputStatus = top.YHAXCashAcceptor.StInputOutputStatus;
    var StTransportStatus   = top.YHAXCashAcceptor.StTransportStatus;
    var StShutterStatus     = top.YHAXCashAcceptor.StShutterStatus;
    var StSafeDoorStatus    = top.YHAXCashAcceptor.StSafeDoorStatus;
    
    if(StDeviceStatus != "HEALTHY") {
      return "硬件故障";
    }
    if(StAcceptorStatus != "HEALTHY" && StAcceptorStatus != "DEGRADED" && StAcceptorStatus != "UNKNOWN")
    {
      return "收钞模块状态不正确";
    }
    if(StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN"
	  || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "EMPTY")
	  || (StTransportStatus == "UNKNOWN" && StInputOutputStatus == "UNKNOWN")) 
    {
      return "钞口或通道状态不正确";
    }
    if(StShutterStatus != "CLOSED")
    {
      return "钞门状态不正确";
    }
    if(StSafeDoorStatus != "CLOSED")
    {
      return "安全门状态不正确";
    }
    return "true";
  }
  
  /*
    检查存款功能是否可用(入钞后)
    返回：
    VM_AVAIL_OK       正常可用
    VM_AVAIL_LOCKED   被锁定
    VM_AVAIL_DEVERR   硬件故障
  */
  this.checkCashinAvai = function()
  {
    // 虚模块状态是否正常
    var StDeviceStatus      = top.YHAXCashAcceptor.StDeviceStatus;
    var StAcceptorStatus    = top.YHAXCashAcceptor.StAcceptorStatus;
    var StInputOutputStatus = top.YHAXCashAcceptor.StInputOutputStatus;
    var StTransportStatus   = top.YHAXCashAcceptor.StTransportStatus;
    var StShutterStatus     = top.YHAXCashAcceptor.StShutterStatus;
    var StSafeDoorStatus    = top.YHAXCashAcceptor.StSafeDoorStatus;
    
    if(StDeviceStatus != "HEALTHY") {
	  return "硬件故障";
	}
	if(StAcceptorStatus != "HEALTHY" && StAcceptorStatus != "DEGRADED" && StAcceptorStatus != "UNKNOWN")
	{
      return "收钞模块状态不正确";
	}
	if(StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN"
  	  || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "EMPTY")
  	  || (StTransportStatus == "UNKNOWN" && StInputOutputStatus == "UNKNOWN")) 
	{
      return "钞口或通道状态不正确";
	}
	if(StSafeDoorStatus != "CLOSED")
	{
	  return "安全门状态不正确";
	}
	return "true";
  }

  /*
    私有函数：存款时硬件故障，复位尝试恢复结束的回调函数。
   */
  this.onResetEnd4StatusError = function()
  {
    // 记录终端流水
   // var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "CIM: Reset For Status Error!" + top.jrn.strLineFeed;
  //  top.journalPrinter.addCashJournalWithTime(strJrn,false);

    top.deposit.CimEnr.clearAll();
  }

  /*
    存款初始化，开始存款时调用该函数
   */
  this.init = function()
  {
    iAmount = 0;
    // 记录存款开始的时间
    dtDepositStart = new Date();

    // 记录终端流水
   // var strJrn = new top.StringCtrl("DEP " + "TELLER:"+top.term.strTellerNum).preandsufStr('-', top.jrn.TITLEWIDTH) +
   //   top.jrn.strLineFeed + new top.DateTimeCtrl().getHHmmSSWithSep() + " " + top.deposit.getCassUnitInfo() + top.jrn.strLineFeed;
   // top.journalPrinter.addCashJournalWithTime(strJrn,false);
  }
  /*
   * 开始存款周期  CASH_IN_START
   * 
   */
  this.prepare = function()
  {
	 top.deposit.CimEnr.clearAll();
	 top.deposit.CimEnr.appendEvent("AcceptCashPrepared", top.deposit.onCashPrepared);
	 top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Ac);
	 top.deposit.CimEnr.appendEvent("Timeout", top.deposit.onTimeout_prepare);
	 top.YHAXCashAcceptor.PrepareForAcceptCash(); 
  }
  //存款周期开启成功
  this.onCashPrepared = function(){
	top.journalPrinter.addCashJournalWithTime("柜员存款开始周期", false);
	top.deposit.CimEnr.clearAll();
	if (typeof(top.MainFrame.onCashPrepared) == "function")
	{
	   // 停止显示请放钞提示的延时计时，避免显示异常。
	   top.serviceCtrl.stopUserTimeout();
	   top.MainFrame.onCashPrepared();
	}
  }
  
  this.onTimeout_prepare= function(){
	top.journalPrinter.addCashJournalWithTime("柜员存款开始周期超时", false);
	top.deposit.CimEnr.clearAll();
	if (typeof(top.MainFrame.onTimeout_prepare) == "function")
	{
		// 停止显示请放钞提示的延时计时，避免显示异常。
		top.serviceCtrl.stopUserTimeout();
		top.MainFrame.onTimeout_prepare();
	}
  }
  
  /*
	CashInserted ，CashAccepted ；CashInserted ，CashRefused ；
	CashInserted ，DeviceError ；CashAcceptCancelled ；Timeout ；	DeviceError ；CashRefused；
    允许用户放钞
    MainFrame提供回调函数：
      onCashInserted();
      onDeviceError_Ac();
      onRefusedCashEjected();
      onDeviceError_Ejr();
      onRetractEnd();
      onIndentifyCash(lais, event2IdCash);
      参数：
        lais            验钞结果，LastAcceptItems(LastAcceptItem的集合)
        event2IdCash    验钞前的动作事件
   */
  this.accept = function()
  {
	//var strJrn = new top.StringCtrl("DEP " + "TELLER:"+top.terminal.strTellerNum).preandsufStr('-', top.journalPrinter.TITLEWIDTH) +
	//top.journalPrinter.strNewLine + " " + top.deposit.getCassUnitInfo();
//	top.journalPrinter.addCashJournalWithTime(strJrn, false);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
//    this.iCurAcceptTimes++;
    top.deposit.CimEnr.clearAll();
    top.deposit.CimEnr.appendEvent("CashInserted", top.deposit.onCashInserted);
    top.deposit.CimEnr.appendEvent("CashAccepted", top.deposit.onCashAccepted);
    top.deposit.CimEnr.appendEvent("CashRefused", top.deposit.onCashRefused_All);
    top.deposit.CimEnr.appendEvent("CashAcceptCancelled", top.deposit.onCashAcceptCancelled);
    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Ac);
    top.deposit.CimEnr.appendEvent("Timeout", top.deposit.onTimeout_Ac);
//    top.YHAXCashAcceptor.AcceptCash(top.deposit.iAcceptCashTimeout*1000);
    top.YHAXCashAcceptor.AcceptCash(-1);
    try{top.cashguidelights.setCashAcceptorLight("MEDIUM");}catch(e){} //进钞口灯
    // 存款超时保护
//    top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onDeviceError_Ac();}, 120*1000);
  }

  /*
    私有函数：等待用户放钞时钞票被放入的事件回调的处理函数
   */
  this.onCashInserted = function()
  {
	top.journalPrinter.addCashJournalWithTime("客户放钞 onCashInserted", false);
    if (typeof(top.MainFrame.onCashInserted) == "function")
    {
      // 停止显示请放钞提示的延时计时，避免显示异常。
      top.serviceCtrl.stopUserTimeout();
      top.MainFrame.onCashInserted();
    }
  }

  /*
    私有函数：用户放钞被受理的事件回调的处理函数
    参数：
      TotalItems    受理的钞票张数
      PartRefused   是否有部分拒钞
   */
  this.onCashAccepted = function(TotalItems, PartRefused)
  {
	top.journalPrinter.addCashJournalWithTime("钞票已受理 Cash Accepted (PartRefused)："+PartRefused +" TotalItems:"+TotalItems, false);
    // 停止存款超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();
    
    top.pool.set("strTotalItems", TotalItems);
    // 记录终端流水
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Cash Accepted" +
      //(PartRefused ? "(PartRefused)" : "") + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,false);

    top.deposit.CimEnr.clearAll();
    if (PartRefused) {
      top.deposit.onCashRefused();
    }else {
      top.deposit.onIndentifyCash(top.deposit.EIC_ACCEPTED);
    }
  }

  /*
    私有函数：等待用户放钞超时的事件回调的处理函数
   */
  this.onTimeout_Ac = function()
  {
	top.journalPrinter.addCashJournalWithTime("放钞超时 onTimeout_Ac", false);	  
    // 停止存款超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();

    // 记录终端流水
   // var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Accept:User Timeout" + top.jrn.strLineFeed;
   // top.journalPrinter.addCashJournalWithTime(strJrn,true);

    top.deposit.CimEnr.clearAll();
    top.deposit.onIndentifyCash(top.deposit.EIC_ACCEPTTIMEOUT);
  }

  /*
    私有函数：用户放钞就绪等待验钞的处理函数
    参数：
      event2IdCash    验钞前的事件
   */
  this.iEvent2IdCash;
  this.onIndentifyCash = function(event2IdCash)
  {
	try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //出钞口灯&拒钞口灯
	try{top.cashguidelights.setCashAcceptorLight("OFF");}catch(e){} //进钞口灯
    top.deposit.iEvent2IdCash = event2IdCash;
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onIndentifyCash_func();}, 1*1000);
  }
  
  this.onIndentifyCash_func = function()
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 记录钞箱信息
    var lais = top.YHAXCashAcceptor.LastAcceptItems;
    top.deposit.iAmount = top.deposit.getLaisValidAmount(lais, top.deposit.strCurrency);
    top.journalPrinter.addCashJournalWithTime("验钞完成 onIndentifyCash 验钞总金额为 " + top.deposit.iAmount + ".00 元 ", false);	
    if (typeof(top.MainFrame.onIndentifyCash) == "function")
//      top.MainFrame.onIndentifyCash(lais, top.deposit.iEvent2IdCash);
      top.MainFrame.onIndentifyCash(lais, top.deposit.iAmount);

    // 记录终端流水
    if (!top.deposit.isNoCash(lais))
    {
     // var strJrn = "IdentifyCash:" + top.deposit.getLaisDetailStr(lais) + top.jrn.strLineFeed;
    //  top.journalPrinter.addCashJournalWithTime(strJrn,false);
    }
    else
    {
      //var strJrn = "No Cash Identified" + " " + top.deposit.getLaisDetailStr(lais) + top.jrn.strLineFeed;
     // top.journalPrinter.addCashJournalWithTime(strJrn,false);
    }
  }

  /*
    私有函数：等待用户放钞时硬件故障的事件回调的处理函数
   */
  this.onDeviceError_Ac = function()
  {
	top.journalPrinter.addCashJournalWithTime("硬件故障 onDeviceError_Ac", false);	
    // 停止存款超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();

    // 记录终端流水
  //  var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Accept:Device Error" + top.deposit.getLastAcceptNumDesc() + top.jrn.strLineFeed;
   // top.jrn.appendJournal(strJrn);

    top.deposit.CimEnr.clearAll();
    // 比较存款开始的时间
//    var msFromDepStart = new Date().getTime() - top.deposit.dtDepositStart.getTime();
//    
//    // 如果从存款开始到故障时时间超过20分钟，则直接退出所有流程，防止当前客户已离开导致风险
//    if (msFromDepStart >= 20*60*1000)
//    {
//	  var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Accept:Device Error 20m"  + top.jrn.strLineFeed;
//	  top.journalPrinter.addCashJournalWithTime(strJrn,true);
//      top.serviceCtrl.navigate2Quit();
//      return;
//    }

    if (typeof(top.MainFrame.onDeviceError_Ac) == "function")
    {
      // 停止显示请放钞提示的延时计时，避免显示异常。
      top.serviceCtrl.stopUserTimeout();
      // 显示存款服务正在取消提示，同时避免正在处理超时计时到达引起流程中止。
//      top.wins.showProcessingTip(top.langcur.oDepCancelling);
//      top.serviceCtrl.startFlowCtrlTimeout(function(){top.MainFrame.onDeviceError_Ac();}, 30*1000);
      top.MainFrame.onDeviceError_Ac();
    }
  }

  /*
    私有函数：存款或退拒钞时硬件故障，尝试退钞失败后复位失败的回调函数。
   */
  this.onReset4AcAndEjrErr_DeviceError = function()
  {
    // 记录终端流水
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Reset(EJECT): DeviceError" + top.jrn.strLineFeed;
   // top.journalPrinter.addCashJournalWithTime(strJrn,true);

    // 后续可能还会出CashTaken事件
  }

  /*
    私有函数：准备存款时硬件故障，复位尝试恢复结束的回调函数。
   */
  this.onResetEnd4PrepareErrAc = function()
  {
    // 记录终端流水
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "CIM: Reset For Prepare Error!" + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,true);

    top.deposit.CimEnr.clearAll();
  }

  /*
    私有函数：用户放钞后发现全部拒钞的事件回调的处理函数
   */
  this.onCashRefused_All = function()
  {
	top.journalPrinter.addCashJournalWithTime("有拒钞 onCashRefused_All", false);	  
    // 停止存款超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();
    top.pool.set("strTotalItems", "");
    // 记录终端流水
   // var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Accept:Cash Refused" + top.jrn.strLineFeed;
   // top.journalPrinter.addCashJournalWithTime(strJrn,false);
    top.deposit.onCashRefused();
  }

  /*
    私有函数：用户放钞后发现拒钞的事件回调的处理函数
	RefusedCashEjected ，RefusedCashEjected then CashTaken，RefusedCashEjected then Timeout，
	RefusedCashEjected then DeviceError，DeviceError
   */
  this.dtOnRefusedCash;
  this.onCashRefused = function()
  {
    top.deposit.CimEnr.clearAll();
    top.deposit.CimEnr.appendEvent("RefusedCashEjected", top.deposit.onRefusedCashEjected);
    top.deposit.CimEnr.appendEvent("CashTaken", top.deposit.onCashTaken_Ejr);

    // 记录发现拒钞的时间
    top.deposit.dtOnRefusedCash = new Date();

    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Ejr);
//    var iEjectRefuseCashRet = top.YHAXCashAcceptor.EjectRefusedCash(top.deposit.iEjectCashTimeout);
 
    try{top.cashguidelights.setCashDispenLight("MEDIUM");}catch(e){} //出钞口灯&拒钞口灯
    // 存款退拒钞超时保护
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onCashTaken_Ejr();}, 10*1000);
  }

  /*
    私有函数：拒钞已经被退出的事件回调的处理函数
   */
  this.onRefusedCashEjected = function()
  {
  
    // 这时不能停止存款退拒钞超时保护

    // 拒钞张数
    var strNumOfRefusedDesc = "";
    try
    {
      if (!top.deposit.bLogicalJammed && typeof(top.YHAXCashAcceptor.NumOfRefused) != "undefined" && top.YHAXCashAcceptor.NumOfRefused > 0)
        strNumOfRefusedDesc = "(RefusedNum:" + top.YHAXCashAcceptor.NumOfRefused + ")";
    } catch(e){}
    
    top.journalPrinter.addCashJournalWithTime("退拒钞 onRefusedCashEjected "+strNumOfRefusedDesc, false);
    // 记录终端流水
   // var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Refused Cash Ejected" + strNumOfRefusedDesc + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,false);

    if (typeof(top.MainFrame.onRefusedCashEjected) == "function")
      top.MainFrame.onRefusedCashEjected();
  }

  /*
    私有函数：退出的拒钞已经被用户取走的事件回调的处理函数
   */
  this.onCashTaken_Ejr = function()
  {
	top.journalPrinter.addCashJournalWithTime("拒钞取走 onCashTaken_Ejr", false);	
    // 停止存款退拒钞超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();

    // 记录终端流水
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Refused Cash Taken" + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,false);

    top.deposit.CimEnr.clearAll();


    top.deposit.onIndentifyCash(top.deposit.EIC_RFUCASHTAKEN);
    
  }

  /*
    私有函数：退拒钞时硬件故障的事件回调的处理函数
   */
  this.onDeviceError_Ejr = function()
  {
	top.journalPrinter.addCashJournalWithTime("退拒钞故障 onDeviceError_Ejr", false);	  
    // 停止存款退拒钞超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();

    // 记录终端流水
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "EjectRefusedCash:Device Error" + top.deposit.getLastAcceptNumDesc() + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,false);

    top.deposit.CimEnr.clearAll();

    if (typeof(top.MainFrame.onDeviceError_Ejr) == "function")
    {
    	top.MainFrame.onDeviceError_Ejr();
    }
  }

  /*
   在存款动作完成之前，取消存款
  MainFrame提供回调函数：
  onCashAcceptCancelled();
  */
  this.CancelAcceptCash = function()
  {
	var strJrn = new top.StringCtrl("DEP " + "CancelAcceptCash :"+top.terminal.strTellerNum).preandsufStr('-', top.journalPrinter.TITLEWIDTH) +
	top.journalPrinter.strNewLine + " " + top.deposit.getCassUnitInfo();
	top.journalPrinter.addCashJournalWithTime(strJrn, false);
    top.deposit.CimEnr.clearAll();
    top.deposit.CimEnr.appendEvent("CashAcceptCancelled", top.deposit.onCashAcceptCancelled);
    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Ac);
    top.YHAXCashAcceptor.CancelAcceptCash();
  }
  
  
  this.onCashAcceptCancelled = function()
  {
	top.serviceCtrl.stopFlowCtrlTimeout();
	top.deposit.CimEnr.clearAll();
	if (typeof(top.MainFrame.onCashAcceptCancelled) == "function")
	{
	  top.MainFrame.onCashAcceptCancelled();
	}
  }
  
  /*
    将Escrow中的钞票存入钞箱
    MainFrame提供回调函数：
      onStoreEscrowedCashEnd();
   */
  this.storeEscrowedCash = function()
  {
	var strJrn = new top.StringCtrl("DEP " + "storeEscrowedCash Before:"+top.terminal.strTellerNum).preandsufStr('-', top.journalPrinter.TITLEWIDTH) +
	top.journalPrinter.strNewLine + " " + top.deposit.getCassUnitInfo();
	top.journalPrinter.addCashJournalWithTime(strJrn, false);
    top.deposit.CimEnr.clearAll();
    top.deposit.CimEnr.appendEvent("EscrowedCashStored", top.deposit.onEscrowedCashStored);
    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Se);
    top.deposit.CimEnr.appendEvent("FatalError", top.deposit.onDeviceError_Se);
    top.deposit.CimEnr.appendEvent("CashTaken", top.deposit.onCashTaken_Se);
    // 存入钞箱超时保护
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onDeviceError_Se();}, 30*1000);
    top.YHAXCashAcceptor.StoreEscrowedCash();
  }

  /*
    私有函数：Escrow中的钞票已经被存入钞箱的事件回调的处理函数
   */
  this.onEscrowedCashStored = function()
  {
    // 停止存入钞箱超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();

    top.journalPrinter.addCashJournalWithTime("Escrowed Cash Stored" ,false);

    top.deposit.CimEnr.clearAll();
    if (typeof(top.MainFrame.onStoreEscrowedCashEnd) == "function")
    {
      top.MainFrame.onStoreEscrowedCashEnd();
    }
  }

  /*
    私有函数：Escrow中的钞票存入钞箱时硬件故障的事件回调的处理函数
   */
  this.onDeviceError_Se = function()
  {
    // 停止存入钞箱超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();
    top.journalPrinter.addCashJournalWithTime("StoreEscrowedCash:Device Error",true);

    top.deposit.CimEnr.clearAll();
    // 延时显示结果
//    top.serviceCtrl.startFlowCtrlTimeout(function(){try{top.MainFrame.onStoreEscrowedCashEnd();}catch(e){}}, 30*1000);
    if (typeof(top.MainFrame.onDeviceError_Store) == "function")
        top.MainFrame.onDeviceError_Store();
  }


  /*
    私有函数：Escrow中的钞票存入钞箱时钞票被用户取走的事件回调的处理函数
   */
  this.onCashTaken_Se = function()
  {
	top.journalPrinter.addCashJournalWithTime("StoreEscrowedCash:onCashTaken_Se", false);	  
    // 停止存入钞箱超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();

    // 记录终端流水
  //  var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "StoreEscrowedCash:Cash Taken" + top.jrn.strLineFeed;
	//top.journalPrinter.addCashJournalWithTime(strJrn,true);

    top.deposit.CimEnr.clearAll();
    if (typeof(top.MainFrame.onStoreEscrowedCashEnd) == "function")
      top.MainFrame.onStoreEscrowedCashEnd();
  }


  /*
    最后一次放钞已点钞张数的描述。用于利多富等存款设备发生故障时，便于帐务核对。
    返回：
      最后一次放钞已点钞张数的描述。
   */
  this.getLastAcceptNumDesc = function()
  {
    var strLastAcceptNumDesc = "";
    try
    {
      if (typeof(top.YHAXCashAcceptor.LastAcceptCount) != "undefined" && top.YHAXCashAcceptor.LastAcceptCount > 0)
        strLastAcceptNumDesc = "(LastAcceptNum:" + top.YHAXCashAcceptor.LastAcceptCount + ")";
    }
    catch(e)
    {
    }
    return strLastAcceptNumDesc;
  }

  /*
    得到验钞的结果中钞票总张数
    参数：
      lais 验钞结果，LastAcceptItems(LastAcceptItem的集合)
    返回：
      钞票总张数
   */
  this.getLaisCountTotal = function(lais)
  {
    var iCountTotal = 0;
    for (var i=0; i<lais.Count; i++)
      iCountTotal += lais.Item(i).Count;
    return iCountTotal;
  }

  /*
    得到验钞的结果中有效的钞票总张数
    参数：
      lais      验钞结果，LastAcceptItems(LastAcceptItem的集合)
      currency  有效的币种
    返回：
      有效的钞票总张数
   */
  this.getLaisValidCountTotal = function(lais, currency)
  {
    if (currency == null || currency.length < 3)
      currency = top.deposit.strCurrency;
    var iCountTotal = 0;
    for (var i=0; i<lais.count; i++)
    {
      if ( lais.item(i).Validity == "VALID"
        && lais.item(i).Currency == currency
        && (lais.item(i).Denomination == 50 || lais.item(i).Denomination == 100)
        && lais.item(i).Count > 0 )
        iCountTotal += lais.item(i).Count;
    }
    return iCountTotal;
  }

  /*
    识别的钞票中是否有不希望受理的（如非人民币币种）
    参数：
      lais 验钞结果，LastAcceptItems(LastAcceptItem的集合)
   */
  this.isCashMisMatch = function(lais)
  {
    return top.deposit.getLaisCountTotal(lais) !=  top.deposit.getLaisValidCountTotal(lais, top.deposit.strCurrency);
  }

  /*
    是否无可识别的钞票
    参数：
      lais 验钞结果，LastAcceptItems(LastAcceptItem的集合)
   */
  this.isNoCash = function(lais)
  {
    return top.deposit.getLaisCountTotal(lais) == 0;
  }

  /*
    得到验钞的结果中有效的钞票总金额
    返回：
      有效的钞票总金额
   */
  this.getLaisValidAmount = function(lais, currency)
  {
    if (currency == null || currency.length < 3)
      currency = top.deposit.strCurrency;
    var amount = 0;
    for (var i=0; i<lais.count; i++)
    {
      if ( lais.item(i).Validity == "VALID"
        && lais.item(i).Currency == currency
        && (lais.item(i).Denomination == 100 ||
        	lais.item(i).Denomination == 50 || 
        	lais.item(i).Denomination == 20 || 
        	lais.item(i).Denomination == 10 || 
        	lais.item(i).Denomination == 5)
        && lais.item(i).Count > 0 ) {
    	if(lais.item(i).Denomination == 100){
    		top.pool.set("strY100Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("验钞 100元票面张数为 " + lais.item(i).Count + " 张 ", false);
    	}else if(lais.item(i).Denomination == 50) {
    		top.pool.set("strY50Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("验钞 50元票面张数为 " + lais.item(i).Count + " 张 ", false);
    	}else if(lais.item(i).Denomination == 20) {
    		top.pool.set("strY20Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("验钞 20元票面张数为 " + lais.item(i).Count + " 张 ", false);
    	}else if(lais.item(i).Denomination == 10) {
    		top.pool.set("strY10Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("验钞 10元票面张数为 " + lais.item(i).Count + " 张 ", false);
    	}else if(lais.item(i).Denomination == 5) {
    		top.pool.set("strY5Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("验钞 5元票面张数为 " + lais.item(i).Count + " 张 ", false);
    	}
    	amount += lais.item(i).Count*lais.item(i).Denomination;
      }
    }
    return amount;
  }

  /*
    得到验钞的结果中有效的钞票面额与张数数组
    参数：
      lais      验钞结果，LastAcceptItems(LastAcceptItem的集合)
      currency  有效的币种
    返回：
      有效的钞票面额与张数数组
    注：
      返回的数组，以面额为下标，张数为值
      面额从1至100，当某面额的钞票不存在时，其值为null
   */
  this.getLaisValidItems = function(lais, currency)
  {
    var denocntarr = new Array();
    if (currency == null || currency.length < 3)
      currency = top.deposit.strCurrency;
    for (var i=0; i<lais.count; i++)
    {
      if ( lais.item(i).Validity == "VALID"
        && lais.item(i).Currency == currency
        && (lais.item(i).Denomination == 50 || lais.item(i).Denomination == 100)
        && lais.item(i).Count > 0 )
      {
        if (typeof(denocntarr[lais.item(i).Denomination]) != "undefined")
          denocntarr[lais.item(i).Denomination] += lais.item(i).Count;
        else
          denocntarr[lais.item(i).Denomination] = lais.item(i).Count;
      }
    }
    return denocntarr;
  }

  /*
    得到验钞的结果的详细字符串描述
    参数：
      lais      验钞结果，LastAcceptItems(LastAcceptItem的集合)
    返回：
      详细描述字符串
   */
  this.getLaisDetailStr = function(lais)
  {
    var str = "";
    for (var i=0; i<lais.count; i++)
    {
      if (str == "")
        str = lais.item(i).Currency + lais.item(i).Denomination + "," + lais.item(i).Count;
      else
        str = str + "|" + lais.item(i).Currency + lais.item(i).Denomination + "," + lais.item(i).Count;
    }
    return str;
  }

  /*
　　 获取钞箱信息的描述（用于流水记录）
    返回：
      钞箱信息的描述字符串
   */
  this.getCassUnitInfo = function()
  {
    var str = "";
    var logicalunits = top.YHAXCashAcceptor.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      str += logicalunit.Total + "|";
    }
    if (str.length == 0)
      str = "Failed!";
    else
      str = "Cass:" + str;
    return str;
  }

  /*
 　 获取钞箱张数汇总
    返回：
      钞箱张数汇总
   */
  this.getAllCUTotal = function()
  {
    var alltotal = 0;
    var logicalunits = top.YHAXCashAcceptor.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      alltotal += logicalunit.Total;
    }
    return alltotal;
  }
  
  /*
   关门
   */
  this.CloseShutter = function()
  {
	    top.deposit.CimEnr.clearAll();
	    top.deposit.CimEnr.appendEvent("ShutterClosed ", top.deposit.onShutterClosed);
	    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onAcShutterNotClosed);
	    //关门超时
	    //top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onDeviceError_Se();}, 30*1000);
	    top.YHAXCashAcceptor.CloseShutter();	  
  }
  
  /*
       私有函数：关门成功
 */
  this.onShutterClosed = function()
  {
	  top.journalPrinter.addCashJournalWithTime("关门成功:onShutterClosed", false);	  
	  top.serviceCtrl.stopFlowCtrlTimeout();

	//var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "onShutterClosed" + top.jrn.strLineFeed;
	//top.journalPrinter.addCashJournalWithTime(strJrn,true);
	
	  top.deposit.CimEnr.clearAll();
	  if (typeof(top.MainFrame.onShutterClosed) == "function")
	    top.MainFrame.onShutterClosed();
   }  

  /*
	  私有函数:关门设备故障
	*/
   this.onAcShutterNotClosed = function()
   {
	 top.journalPrinter.addCashJournalWithTime("关门故障:onAcShutterNotClosed", false);	   
	 top.serviceCtrl.stopFlowCtrlTimeout();
	
	//var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "onAcShutterNotClosed" + top.jrn.strLineFeed;
	//top.journalPrinter.addCashJournalWithTime(strJrn,true);
	
	 top.deposit.CimEnr.clearAll();
	 if (typeof(top.MainFrame.onAcShutterNotClosed) == "function")
	   top.MainFrame.onAcShutterNotClosed();
	} 
}
