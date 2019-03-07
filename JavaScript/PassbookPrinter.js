/*
  存折打印类
 */
function PassbookPrinter()
{ 
  // 存折打印机虚模块事件响应对象
  this.PassbookEvents = new top.EventHandling(top.YHAXPassbook);
  
  /*等待用户插折读取磁道数据*/
  this.accept = function()
  {
	top.journalPrinter.addJournalWithTime("等待用户插折 PassbookPrinter command accept");
    top.passbookprinter.PassbookEvents.clearAll();
    top.passbookprinter.PassbookEvents.appendEvent("MediaInserted", top.passbookprinter.onMediaInserted);
    top.passbookprinter.PassbookEvents.appendEvent("MediaAccepted", top.passbookprinter.onMediaAccepted);
    top.passbookprinter.PassbookEvents.appendEvent("MediaInvalid", top.passbookprinter.onMediaInvalid);
    top.passbookprinter.PassbookEvents.appendEvent("Timeout", top.passbookprinter.onTimeout_MediaAccept);
    top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.AcceptAndRead("ReadPassbook", "Track2,Track3", top.iUserTimeout*1000);
    // 控制指示灯
    try{top.guidelights.setPassBookLight("MEDIUM");}catch(e){}
  }

  /*存折放入回调函数*/
  this.onMediaInserted = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("存折已经插入 PassbookPrinter Event onMediaInserted "); 
    // 控制指示灯
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*读取磁道完成回调函数*/
  this.onMediaAccepted = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("存折已经受理 PassbookPrinter Event onMediaAccepted");
	top.passbookprinter.PassbookEvents.clearAll();
    if (typeof(top.MainFrame.onMediaAccepted) == "function"){   
	  var strPassbaookData = top.YHAXPassbook.GetFieldSync("Track2");
	  if(strPassbaookData == null || strPassbaookData.length < 10){
		  strPassbaookData = top.YHAXPassbook.GetFieldSync("Track3");
	  }
      	  //磁道数据判断
	  if(strPassbaookData == null || strPassbaookData == ""){
		 top.journalPrinter.addJournalWithTime("存折二三磁道数据无效");  
		 top.MainFrame.onMediaInvalid();
	  }else{
		   top.MainFrame.onMediaAccepted(strPassbaookData); 
	  } 
    }
  }

  /*无效存折回调函数*/
  this.onMediaInvalid = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("无效存折 PassbookPrinter Event onMediaInvalid");
    top.passbookprinter.PassbookEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onMediaInvalid) == "function")
      top.MainFrame.onMediaInvalid();
  }

  /*
    私有函数：读折超时
  */
  this.onTimeout_MediaAccept = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("读存折超时 PassbookPrinter Accept onTimeout ");
  	top.passbookprinter.PassbookEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onTimeout_MediaAccept) == "function")
      top.MainFrame.onTimeout_MediaAccept();
  }
  /*
       私有函数：退折超时
  */  
  this.onTimeout_PrintEject = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("退存折超时 PassbookPrinter Eject onTimeout ");
  	top.passbookprinter.PassbookEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onTimeout_PrintEject) == "function")
      top.MainFrame.onTimeout_PrintEject();
  }
  /*硬件故障回调函数*/
  this.onDeviceError = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存折打印机故障 PassbookPrinter Event onDeviceError");
    top.passbookprinter.PassbookEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onDeviceError_Pbp) == "function"){
    
      top.MainFrame.onDeviceError_Pbp();
    }
    else if (typeof(top.onDeviceError_Pbp) == "function"){
    	
    top.onDeviceError_Pbp();
    }
  }

  /*取消允许进折*/
  this.cancelAccept = function()
  {
	top.journalPrinter.addJournal("取消允许进折 PassbookPrinter command onAcceptCancelled");  
    top.passbookprinter.PassbookEvents.appendEvent("AcceptCancelled", top.passbookprinter.onAcceptCancelled);
	top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.CancelAccept();
  }

  /*取消允许进折回调函数*/
  this.onAcceptCancelled = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournal("取消允许进折 PassbookPrinter Event onAcceptCancelled");  
    top.passbookprinter.PassbookEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onAcceptCancelled) == "function")
      top.MainFrame.onAcceptCancelled();
  }

  /*存折打印（使用Form方式）*/
  this.print = function(str)
  {
	top.YHAXPassbook.DefaultMediaName = "PassbookMedia";
    top.passbookprinter.PassbookEvents.clearAll();
    top.passbookprinter.PassbookEvents.appendEvent("PrintComplete", top.passbookprinter.onPrintComplete);
    top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.Print("SRCB_PB_Form_First", str);
	// 控制指示灯
    try{top.guidelights.setPassBookLight("QUICK");}catch(e){}
  }

  /*打印完成回调函数*/
  this.onPrintComplete = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("存折打印完成 PassbookPrinter Event onPrintComplete");   
    top.passbookprinter.PassbookEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onPrintComplete) == "function")
      top.MainFrame.onPrintComplete();
  }

  /*模块复位。*/
  this.reset = function()
  {
    top.passbookprinter.PassbookEvents.clearAll();
    top.passbookprinter.PassbookEvents.appendEvent("ResetComplete", top.passbookprinter.onResetComplete);
	top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.Reset("EJECT", 1);
  }

  /*复位完成回调函数*/
  this.onResetComplete = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("存折复位成功 PassbookPrinter Event onResetComplete");   
    top.passbookprinter.PassbookEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete) == "function")
      top.MainFrame.onResetComplete();
  }

  /*
    退折。
  */
  this.eject = function()
  {
	top.journalPrinter.addJournalWithTime("存折退出 PassbookPrinter command onPrintEjected");
    top.passbookprinter.PassbookEvents.clearAll();
	top.passbookprinter.PassbookEvents.appendEvent("PrintEjected", top.passbookprinter.onPrintEjected);
    top.passbookprinter.PassbookEvents.appendEvent("PrintTaken", top.passbookprinter.onPrintTaken);
    top.passbookprinter.PassbookEvents.appendEvent("Timeout", top.passbookprinter.onTimeout_PrintEject);
    top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.Eject(120*1000);
    // 控制指示灯
    try{top.guidelights.setPassBookLight("QUICK");}catch(e){}
  }

  /*存折已退出回调函数*/
  this.onPrintEjected = function()
  {
	 // 记录终端流水
    top.journalPrinter.addJournalWithTime("存折退出 PassbookPrinter Event onPrintEjected");
    if (typeof(top.MainFrame.onPrintEjected) == "function")
      top.MainFrame.onPrintEjected();
  }

  /*存折已退出回调函数*/
  this.onPrintTaken = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存折被取走 PassbookPrinter Event onPrintTaken");
    top.passbookprinter.PassbookEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onPrintTaken) == "function")
      top.MainFrame.onPrintTaken();
  }
}
