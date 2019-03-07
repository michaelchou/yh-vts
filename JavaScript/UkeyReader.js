/*
  读UKEY操作类
 */
function UkeyReader()
{	
  // 读UKEY虚模块事件响应对象
  this.UkeyReadEvents = new top.EventHandling(top.YHAXUkeyReader);
  //------------------------- 读UKEY器操作类私有属性 -------------------------//
  /* 退出UKEY后等待用户取UKEY时间 单位（秒）*/
  this.EjectTimeout = 120;
  //------------------------- 读UKEY器执行的方法 -------------------------//   
    
	
  /*允许读UKEY*/
  this.accept = function()
  {
    top.ukeyReader.UkeyReadEvents.clearAll();
    top.ukeyReader.UkeyReadEvents.appendEvent("CardInserted", top.ukeyReader.onCardInserted);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardAccepted", top.ukeyReader.onCardAccepted);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardInvalid", top.ukeyReader.onCardInvalid);
	top.ukeyReader.UkeyReadEvents.appendEvent("Timeout", top.ukeyReader.onTimeout);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onDeviceError);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onDeviceError);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardAcceptCancelled", top.ukeyReader.onCardAcceptCancelled);
    top.journalPrinter.addJournalWithTime("允许读UKEY UkeyReader command AcceptAndReadAvailableTracks" + top.journalPrinter.strNewLine);
    top.YHAXUkeyReader.AcceptAndReadAvailableTracks("3", top.iUserTimeout*1000);
	// 控制指示灯
    try{top.guidelights.setCoinDispenserLight("MEDIUM");}catch(e){}
  }
  
  /*不允许读UKEY*/
  this.cancelAccept = function()
  {
	 top.journalPrinter.addJournalWithTime("不允许读UKEY UkeyReader command CancelAccept" + top.journalPrinter.strNewLine);
     top.YHAXUkeyReader.CancelAccept();
	 // 控制指示灯
     try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
  }
  
  /*退UKEY*/
  this.eject = function()
  {
    top.ukeyReader.UkeyReadEvents.clearAll();
    top.ukeyReader.UkeyReadEvents.appendEvent("CardEjected", top.ukeyReader.onCardEjected);
    top.ukeyReader.UkeyReadEvents.appendEvent("Timeout", top.ukeyReader.onTimeout_Eject);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardTaken", top.ukeyReader.onCardTaken);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onDeviceError);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onDeviceError);
	top.journalPrinter.addJournalWithTime("吐UKEY UkeyReader command Eject" + top.journalPrinter.strNewLine);
    top.YHAXUkeyReader.Eject(this.EjectTimeout*1000);
  }
  
  /*读UKEY禁止读UKEY的事件响应*/
  this.onCardAcceptCancelled = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("取消读取UKEY UkeyReader Event onCardAcceptCancelled" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onCardAcceptCancelled) == "function"){
      top.MainFrame.onCardAcceptCancelled();
	}
  }

  /*读UKEY超时的事件响应*/
  this.onTimeout = function()
  {
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("读取UKEY超时 UkeyReader Event onTimeout" + top.journalPrinter.strNewLine);
	top.ukeyReader.UkeyReadEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout_ukeyreader) == "function")
      top.MainFrame.onTimeout_ukeyreader();
  }
  
  /*读UKEY时UKEY已经插入的事件响应*/
  this.onCardInserted = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("UKEY已经插入 UkeyReader Event onCardInserted" + top.journalPrinter.strNewLine);
	// 控制指示灯
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardInserted) == "function")
      top.MainFrame.onCardInserted();
  }

  /*读UKEY时UKEY已经被受理的事件响应*/
  this.onCardAccepted = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("读UKEY已经受理 UkeyReader Event onCardAccepted" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onCardAccepted) == "function"){
      top.MainFrame.onCardAccepted(top.YHAXUkeyReader.Track3);
	}
  }

  /*读UKEY时发现无效UKEY的事件响应*/
  this.onCardInvalid = function()
  {
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("无效UKEY UkeyReader Event onCardInvalid" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onCardInvalid) == "function")
      top.MainFrame.onCardInvalid();
  }

  
   /*读UKEY时UKEY已经被退出的事件响应*/
  this.onCardEjected = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("UKEY退出成功 UkeyReader Event onCardEjected" + top.journalPrinter.strNewLine);
	// 控制指示灯
    try{top.guidelights.setCoinDispenserLight("QUICK");}catch(e){}
	// 播放提示音
    try{top.soundPlayer.TakeCardMusic();}catch(e){}

    if (typeof(top.MainFrame.onCardEjected_ukeyreader) == "function")
      top.MainFrame.onCardEjected_ukeyreader();
    else if (typeof(top.onCardEjected_ukeyreader) == "function")
      top.onCardEjected_ukeyreader();
  }
  
  /*读UKEY时UKEY已经被客户取走的事件响应*/
  this.onCardTaken = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("UKEY被取走 UkeyReader Event onCardTaken" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    // 控制指示灯
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardTaken_ukeyreader) == "function")
      top.MainFrame.onCardTaken_ukeyreader();
    else if (typeof(top.onCardTaken_ukeyreader) == "function")
      top.onCardTaken_ukeyreader();
  }
  
   /*退出的UKEY超时未被客户取走的事件响应*/
  this.onTimeout_Eject = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("UKEY退出超时 UkeyReader Event onTimeout_Eject" + top.journalPrinter.strNewLine);
	top.ukeyReader.UkeyReadEvents.clearAll();
    // 退UKEY超时，自动吞UKEY
    top.ukeyReader.capture();
  }
  
  /*吞UKEY*/
  this.capture = function()
  {
    top.ukeyReader.UkeyReadEvents.clearAll();
    top.ukeyReader.UkeyReadEvents.appendEvent("CardTaken", top.ukeyReader.onCardTaken);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardCaptured", top.ukeyReader.onCardCaptured);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onDeviceError4Capture);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onDeviceError4Capture);
	top.journalPrinter.addJournalWithTime("吞UKEY UkeyReader command Capture" + top.journalPrinter.strNewLine);
    top.YHAXUkeyReader.Capture();
  }
  
  /*吞UKEY时UKEY器硬件故障的事件响应*/
  this.onDeviceError4Capture = function()
  {
    top.ukeyReader.UkeyReadEvents.appendEvent("ResetComplete", top.ukeyReader.onResetEnd4DevErr4CaptureRe);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onResetEnd4DevErr4CaptureRe);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onResetEnd4DevErr4CaptureRe);
	top.journalPrinter.addJournalWithTime("复位(回收) UkeyReader command Reset" + top.journalPrinter.strNewLine);
    top.YHAXUkeyReader.Reset("RETRACT");
  }
  
  /*读UKEY时UKEY硬件故障后复位结束的事件响应*/
  this.onResetEnd4DevErr4CaptureRe = function()
  {
    top.ukeyReader.UkeyReadEvents.appendEvent("ResetComplete", top.ukeyReader.onResetEnd4DevErr4CaptureEj);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onResetEnd4DevErr4CaptureEj);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onResetEnd4DevErr4CaptureEj);
	top.journalPrinter.addJournalWithTime("复位(吐) UkeyReader command Reset" + top.journalPrinter.strNewLine);
    // 必须使用EJECT参数才能解决问题，有点危险，但是没辙。而且这里不做，空闲页面也会这么做。
    top.YHAXUkeyReader.Reset("EJECT");
  }
  
  
  /*吞UKEY时UKEY硬件故障后复位结束的事件响应*/
  this.onResetEnd4DevErr4CaptureEj = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("吞UKEY失败 UkeyReader Event onResetEnd4DevErr4CaptureEj" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_ukeyreader) == "function")
      top.MainFrame.onDeviceError_ukeyreader();
    else if (typeof(top.onDeviceError_ukeyreader) == "function")
      top.onDeviceError_ukeyreader();
  }
  
   /*读UKEY时UKEY已经被吞入的事件响应*/
  this.onCardCaptured = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("UKEY被吞 UkeyReader Event onCardCaptured" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onUkeyCaptured) == "function")
      top.MainFrame.onUkeyCaptured();
    else if (typeof(top.onUkeyCaptured) == "function")
      top.onUkeyCaptured();
  }
  
  /*读UKEY硬件故障的事件响应*/
  this.onDeviceError = function()
  {
	top.journalPrinter.addJournalWithTime("UKEY读卡器故障 UkeyReader Event onDeviceError" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_ukeyreader) == "function")
    {
      top.MainFrame.onDeviceError_ukeyreader();
    }else if (typeof(top.onDeviceError_ukeyreader) == "function")
    {
      top.onDeviceError_ukeyreader();
    }else{}
  };

  /*读UKEY器复位成功的事件响应*/
  this.onResetComplete = function()
  {
	top.journalPrinter.addJournalWithTime("UKEY复位成功 UkeyReader Event onResetComplete" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_ukeyreader) == "function")
    {
      top.MainFrame.onResetComplete_ukeyreader();
    }else if (typeof(top.onResetComplete_ukeyreader) == "function")
    {
      top.onResetComplete_ukeyreader();
    }else{}
  };

//------------------------- 其它辅助方法 -------------------------//

  /*判断UKEY读卡器中是否存在UKEY*/
  this.isCardPresent = function()
  {
    return (top.YHAXUkeyReader.StMediaStatus == "PRESENT");
  } 
}
