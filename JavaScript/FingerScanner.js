/*
  指纹仪类
 */
function FingerScanner()
{ 
  var isFingerOpen = false;//指纹仪是否打开
  // 指纹仪虚模块事件响应对象
  this.FingerEvents = new top.EventHandling(top.YHAXFingerScanner);
  
  /*等待用户指纹放入并读取数据*/
  this.readFinger = function()
  {
	isFingerOpen = true;
    top.fingerScanner.FingerEvents.clearAll();
    top.fingerScanner.FingerEvents.appendEvent("FingerInserted", top.fingerScanner.onFingerInserted);
    top.fingerScanner.FingerEvents.appendEvent("ReadFingerCompleted", top.fingerScanner.onReadFingerCompleted);
    top.fingerScanner.FingerEvents.appendEvent("InvalidFinger", top.fingerScanner.onInvalidFinger);
    top.fingerScanner.FingerEvents.appendEvent("Timeout", top.fingerScanner.onTimeout);
    top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
    top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
    top.YHAXFingerScanner.ReadFinger("FEATURE",top.COLS_FINGERSCANNER_FILEPATH, 120*1000);
    top.journalPrinter.addJournalWithTime("读取指纹数据 Finger command readFinger ");
	// 控制指示灯
    try{top.guidelights.setFingerLight("MEDIUM");}catch(e){}
  }

  /*等待柜员指纹放入并读取数据*/
  this.readTellerFinger = function()
  {
	isFingerOpen = true;
    top.fingerScanner.FingerEvents.clearAll();
    top.fingerScanner.FingerEvents.appendEvent("FingerInserted", top.fingerScanner.onFingerInserted);
    top.fingerScanner.FingerEvents.appendEvent("ReadFingerCompleted", top.fingerScanner.onReadTellerFingerCompleted);
    top.fingerScanner.FingerEvents.appendEvent("InvalidFinger", top.fingerScanner.onInvalidFinger);
    top.fingerScanner.FingerEvents.appendEvent("Timeout", top.fingerScanner.onTimeout);
    top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
    top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
    top.YHAXFingerScanner.ReadFinger("FEATURE",top.COLS_FINGERSCANNER_FILEPATH, 120*1000);
    top.journalPrinter.addJournalWithTime("读取柜员指纹数据(取单) Finger command readTellerFinger ");
	// 控制指示灯
    try{top.guidelights.setFingerLight("MEDIUM");}catch(e){}
  }
   /*等待柜员指纹放入并读取数据*/
  this.readTellerOutFinger = function()
  {
	isFingerOpen = true;
    top.fingerScanner.FingerEvents.clearAll();
    top.fingerScanner.FingerEvents.appendEvent("FingerInserted", top.fingerScanner.onFingerInserted);
    top.fingerScanner.FingerEvents.appendEvent("ReadFingerCompleted", top.fingerScanner.onReadTellerOutFingerCompleted);
    top.fingerScanner.FingerEvents.appendEvent("InvalidFinger", top.fingerScanner.onInvalidFinger);
    top.fingerScanner.FingerEvents.appendEvent("Timeout", top.fingerScanner.onTimeout);
    top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
    top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
    top.YHAXFingerScanner.ReadFinger("FEATURE",top.COLS_FINGERSCANNER_FILEPATH, 120*1000);
    top.journalPrinter.addJournalWithTime("读取柜员指纹数据(放单) Finger command readTellerOutFinger ");
	// 控制指示灯
    try{top.guidelights.setFingerLight("MEDIUM");}catch(e){}
  }
  /*指纹放入回调函数*/
  this.onFingerInserted = function()
  {
    top.journalPrinter.addJournalWithTime("指纹已放入 Finger Event FingerInserted ");  
	// 控制指示灯
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onFingerInserted) == "function"){
      top.MainFrame.onFingerInserted();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onFingerInserted) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onFingerInserted();
	}
  }
  
  /*读取指纹信息完成回调函数*/
  this.onReadFingerCompleted = function()
  {
	isFingerOpen = false;
	// 记录终端流水
     top.journalPrinter.addJournalWithTime("指纹已受理 Finger Event ReadFingerCompleted ");  
	top.fingerScanner.FingerEvents.clearAll();
	if (typeof(top.MainFrame.window.frames["ifreamSign"].onReadFingerCompleted) == "function" && top.pool.get("IsSignFinger") != null && top.pool.get("IsSignFinger") != "" && top.pool.get("IsSignFinger") == "1")
	{
		top.pool.set("IsSignFinger","");
		top.MainFrame.window.frames["ifreamSign"].onReadFingerCompleted(top.YHAXFingerScanner.FeatureData);
	}
	else  if (typeof(top.MainFrame.onReadFingerCompleted) == "function"){   
      top.MainFrame.onReadFingerCompleted(top.YHAXFingerScanner.FeatureData);
    }
  }

   /*读取柜员指纹信息完成回调函数*/
  this.onReadTellerFingerCompleted = function()
  {
	isFingerOpen = false;
	// 记录终端流水
   top.journalPrinter.addJournalWithTime("指纹已受理(取单) Finger Event ReadTellerFingerCompleted "); 
	top.fingerScanner.FingerEvents.clearAll();
	//柜员指纹授权验存单
	if (typeof(top.MainFrame.onReadTellerFingerCompleted) == "function"){
		top.MainFrame.onReadTellerFingerCompleted(top.YHAXFingerScanner.FeatureData);		
	}
  }
     /*读取柜员指纹信息完成回调函数*/
  this.onReadTellerOutFingerCompleted = function()
  {
	isFingerOpen = false;
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("指纹已受理(放单) Finger Event ReadTellerOutFingerCompleted ");
	top.fingerScanner.FingerEvents.clearAll();
	//柜员指纹授权验存单
	if (typeof(top.MainFrame.onReadTellerOutFingerCompleted) == "function"){
		top.MainFrame.onReadTellerOutFingerCompleted(top.YHAXFingerScanner.FeatureData);		
	}
  }
  
  /*无效指纹回调函数*/
  this.onInvalidFinger = function()
  {
	isFingerOpen = false;
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("无效指纹 Finger Event InvalidFinger ");
    top.fingerScanner.FingerEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onInvalidFinger) == "function")
      top.MainFrame.onInvalidFinger();
    else if (typeof(top.MainFrame.window.frames["ifreamSign"].onInvalidFinger) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onInvalidFinger();
	}
  }

  /*读指纹超时*/
  this.onTimeout = function()
  {
	isFingerOpen = false;
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("读指纹超时 Finger Event Timeout ");
  	top.fingerScanner.FingerEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout_Finger) == "function")
      top.MainFrame.onTimeout_Finger();
    else if (typeof(top.MainFrame.window.frames["ifreamSign"].onTimeout_Finger) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onTimeout_Finger();
	}
  }

  /*硬件故障回调函数*/
  this.onDeviceError = function()
  {
	isFingerOpen = false;
    // 记录终端流水
     top.journalPrinter.addJournalWithTime("指纹仪读卡器故障 Finger Event DeviceError ");
    top.fingerScanner.FingerEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onDeviceError_Finger) == "function")
      top.MainFrame.onDeviceError_Finger();
    else if (typeof(top.onDeviceError_Finger) == "function")
      top.onDeviceError_Finger();
    else if (typeof(top.MainFrame.window.frames["ifreamSign"].onDeviceError_Finger) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onDeviceError_Finger();
	}
  }

  /*取消允许读指纹*/
  this.cancelRead = function()
  {
	if(isFingerOpen){//如果指纹仪打开才调用此方法
	    top.journalPrinter.addJournalWithTime("取消允许读指纹 Finger Event cancelRead ");
	    isFingerOpen = false;
		top.fingerScanner.FingerEvents.appendEvent("ReadCancelled", top.fingerScanner.onReadCancelled);
	    top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
	    top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
        top.YHAXFingerScanner.CancelRead();
	}
  }

  /*取消允许放入指纹回调函数*/
  this.onReadCancelled = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("取消读取指纹 Finger Event ReadCancelled "); 
    top.fingerScanner.FingerEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onReadCancelled) == "function")
      top.MainFrame.onReadCancelled();
    else if (typeof(top.MainFrame.window.frames["ifreamSign"].onReadCancelled) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onReadCancelled();
	}
  } 

  /*模块复位*/
  this.reset = function()
  {
    top.fingerScanner.FingerEvents.clearAll();
    top.fingerScanner.FingerEvents.appendEvent("ResetComplete", top.fingerScanner.onResetComplete);
	top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
	top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
    top.YHAXFingerScanner.Reset();
    top.journalPrinter.addJournalWithTime("指纹仪复位 Finger Event reset ");
  }

  /*复位完成回调函数*/
  this.onResetComplete = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("指纹复位成功 Finger Event ResetComplete "); 
    top.fingerScanner.FingerEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete) == "function")
      top.MainFrame.onResetComplete();
  }
}
