/*
  存单操作类
 */
function DocumentScanner()
{	
  // 存单模块事件响应对象
  this.DocumentScannerEvents = new top.EventHandling(top.YHAXDocumentScanner);
  //------------------------- 发卡器操作类私有属性 -------------------------//
  /* 退存单卡后等待用户取卡时间 单位（秒）*/
  this.EjectTimeout = 120;
  //------------------------- 发卡器执行的方法 -------------------------//      
	
  /*允许受理存单*/
  this.acceptAndRead = function(CodelineFormat,ImageSource)
  {
    top.documentscanner.DocumentScannerEvents.clearAll();
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaInserted", top.documentscanner.onMediaInserted);
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaAccepted", top.documentscanner.onMediaAccepted);
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaInvalid", top.documentscanner.onMediaInvalid);
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaReaded", top.documentscanner.onMediaReaded);
    top.documentscanner.DocumentScannerEvents.appendEvent("Timeout", top.documentscanner.onTimeout);
    top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onDeviceError);
    top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onDeviceError);
    top.YHAXDocumentScanner.AcceptAndRead("BMP","BMP","FULL","FULL",CodelineFormat,ImageSource,"C:\\FrontImage.bmp","C:\\BackImage.bmp",top.iUserTimeout*1000);
    top.journalPrinter.addJournalWithTime("存单发放扫描 CheckPrint2 command acceptAndRead ");
  }
  
  /*不允许受理*/
  this.cancelAccept = function()
  {
     top.journalPrinter.addJournalWithTime("存单发放扫描取消 CheckPrint2 Event cancelAccept ");
     top.YHAXDocumentScanner.CancelAccept();
  }
  
  
   /*存单机控制*/
  this.controlMedia = function(MediaAction)
  {
	top.documentscanner.DocumentScannerEvents.clearAll();
	top.documentscanner.DocumentScannerEvents.appendEvent("ControlComplete", top.documentscanner.onControlComplete);
	top.documentscanner.DocumentScannerEvents.appendEvent("MediaTaken", top.documentscanner.onMediaTaken_Media);
	top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onDeviceError);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onDeviceError);
    top.YHAXDocumentScanner.ControlMedia(MediaAction,top.iUserTimeout*1000);
    top.journalPrinter.addJournalWithTime("存单发放扫描控制 CheckPrint2 command controlMedia "+MediaAction);
  }
  
  
  /*存单机复位*/
  this.reset = function ()
  {
	top.documentscanner.DocumentScannerEvents.clearAll();
	top.documentscanner.DocumentScannerEvents.appendEvent("ResetComplete", top.documentscanner.onResetComplete);
	top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onDeviceError);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onDeviceError);
    top.YHAXDocumentScanner.Reset("RETRACT",1);
    top.journalPrinter.addJournalWithTime("存单发放扫描复位 CheckPrint2 command Reset");
  }
  
  
    /*退卡*/
  this.eject = function()
  {
    top.documentscanner.DocumentScannerEvents.clearAll();
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaEjected", top.documentscanner.onMediaEjected);
    top.documentscanner.DocumentScannerEvents.appendEvent("Timeout", top.documentscanner.onTimeout_Eject);
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaTaken", top.documentscanner.onMediaTaken);
    top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onDeviceError);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onDeviceError);
    top.YHAXDocumentScanner.Eject(this.EjectTimeout*1000);
    top.journalPrinter.addJournalWithTime("存单发放扫描退单 CheckPrint2 command Eject");
  }
  
  /*吞存单*/
  this.capture = function()
  {
    top.documentscanner.DocumentScannerEvents.clearAll();
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaTaken", top.documentscanner.onMediaTaken);
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaCaptured", top.documentscanner.onMediaCaptured);
    top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onDeviceError4Capture);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onDeviceError4Capture);
    top.YHAXDocumentScanner.Capture();
     top.journalPrinter.addJournalWithTime("存单发放扫描吞单 CheckPrint2 command capture");
  }
  
  /*吞存单时硬件故障的事件响应*/
  this.onDeviceError4Capture = function()
  {
    top.documentscanner.DocumentScannerEvents.appendEvent("ResetComplete", top.documentscanner.onResetEnd4DevErr4CaptureRe);
    top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onResetEnd4DevErr4CaptureRe);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onResetEnd4DevErr4CaptureRe);
    top.YHAXDocumentScanner.Reset("RETRACT",1);
     top.journalPrinter.addJournalWithTime("存单发放扫描故障复位吞单 CheckPrint2 command DeviceError4Capture");
  }
  
  /*吞存单时硬件故障后复位结束的事件响应*/
  this.onResetEnd4DevErr4CaptureRe = function()
  {
    top.documentscanner.DocumentScannerEvents.appendEvent("ResetComplete", top.documentscanner.onResetEnd4DevErr4CaptureEj);
    top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onResetEnd4DevErr4CaptureEj);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onResetEnd4DevErr4CaptureEj);
    // 必须使用EJECT参数才能解决问题，有点危险，但是没辙。而且这里不做，空闲页面也会这么做。
    top.YHAXDocumentScanner.Reset("EJECT",1);
     top.journalPrinter.addJournalWithTime("存单发放扫描故障复位结束后退单 CheckPrint2 command ResetEnd4DevErr4CaptureRe");
  }
  
  /*吞卡时读卡器硬件故障后复位结束的事件响应*/
  this.onResetEnd4DevErr4CaptureEj = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单发放扫描故障复位结束后退单完成 CheckPrint2 Event ResetEnd4DevErr4CaptureEj");

    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cd) == "function")
      top.MainFrame.onDeviceError_cd();
    else if (typeof(top.onDeviceError_cd) == "function")
      top.onDeviceError_cd();
  }
  
  /*存单机存单已经插入的事件响应*/
  this.onMediaInserted = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 存单已插入 CheckPrint2 Event MediaInserted");
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*存单机存单已经被受理的事件响应*/
  this.onMediaAccepted = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单发放扫描 存单已读取 CheckPrint2 Event MediaAccepted");
    if (typeof(top.MainFrame.onMediaAccepted) == "function"){
      top.MainFrame.onMediaAccepted();
	}
  }
  
  /*存单机发现无效存单的事件响应*/
  this.onMediaInvalid = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 无效存单 CheckPrint2 Event MediaInvalid");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onMediaInvalid) == "function")
      top.MainFrame.onMediaInvalid();
  }
  
  /*存单机存单验证的事件响应*/
  this.onMediaReaded = function()
  {
    top.documentscanner.DocumentScannerEvents.clearAll();
	var strCodeData = top.YHAXDocumentScanner.CodelineData;
	if(strCodeData.indexOf("|") > 0){
		var  strCertNum = strCodeData.split("|")[0].substr(strCodeData.split("|")[0].indexOf('=') + 1, strCodeData.split("|")[0].length);
		top.pool.set("strCDCertNum",strCertNum);//凭证号
	}else{
		top.pool.set("strCDCertNum",strCodeData);//凭证号
	}
	//凭证号记录
	var strCDSNum = top.pool.get("strCDCertNum");
    top.journalPrinter.addJournalWithTime("存单发放扫描 存单读取完成 凭证号长度:"+strCDSNum.length);
    if (typeof(top.MainFrame.onMediaReaded) == "function"){
      top.MainFrame.onMediaReaded();
	}
  }

  /*发卡超时的事件响应*/
  this.onTimeout = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 存单超时 CheckPrint2 Event Timeout");  
    top.documentscanner.DocumentScannerEvents.clearAll();	
    if (typeof(top.MainFrame.onTimeout) == "function")
      top.MainFrame.onTimeout();
  }
  
  /*存单机硬件故障的事件响应*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 存单机故障 CheckPrint2 Event DeviceError");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cd) == "function")
    {
      top.MainFrame.onDeviceError_cd();
    }else if (typeof(top.onDeviceError_cd) == "function")
    {
      top.onDeviceError_cd();
    }else{}
  };
  
   /*存单机复位成功的事件响应*/
  this.onResetComplete = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 复位成功 CheckPrint2 Event ResetComplete");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_cd) == "function")
    {
      top.MainFrame.onResetComplete_cd();
    }else if (typeof(top.onResetComplete_cd) == "function")
    {
      top.onResetComplete_cd();
    }else{}
  };
  
  
  /*存单机存单ControlMedia完成的事件响应*/
  this.onControlComplete = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 CheckPrint2 Event ControlComplete");
    if (typeof(top.MainFrame.onControlComplete) == "function")
      top.MainFrame.onControlComplete();
  }
  
  /*存单机存单已经被客户取走的事件响应*/
  this.onMediaTaken = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 存单取走 CheckPrint2 Event MediaTaken");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onMediaTaken) == "function")
      top.MainFrame.onMediaTaken();
    else if (typeof(top.onMediaTaken) == "function")
      top.onMediaTaken();
  }
  
   /*存单机存单已经被客户取走的事件响应*/
  this.onMediaTaken_Media = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 CheckPrint2 Event MediaTaken_Media");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onMediaTaken_Media) == "function")
      top.MainFrame.onMediaTaken_Media();
    else if (typeof(top.onMediaTaken_Media) == "function")
      top.onMediaTaken_Media();
  }
  
  
  /*存单机存单已经被退出的事件响应*/
  this.onMediaEjected = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 CheckPrint2 Event MediaEjected");  
    if (typeof(top.MainFrame.onMediaEjected) == "function")
      top.MainFrame.onMediaEjected();
    else if (typeof(top.onMediaEjected) == "function")
      top.onMediaEjected();
  }

   /*退出的存单超时未被客户取走的事件响应*/
  this.onTimeout_Eject = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放扫描 CheckPrint2 Event Timeout_Eject");    
    top.documentscanner.DocumentScannerEvents.clearAll();
    // 退存单超时，自动吞存单
    top.documentscanner.capture();
  }
  
  /*存单已经被吞入的事件响应*/
  this.onMediaCaptured = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单发放扫描 CheckPrint2 Event MediaCaptured");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onMediaCaptured) == "function")
      top.MainFrame.onMediaCaptured();
    else if (typeof(top.onMediaCaptured) == "function")
      top.onMediaCaptured();
  }
 

  //------------------------- 其它辅助方法 -------------------------//

  /*判断发卡器中是否存在卡*/
  this.isCardPresent = function()
  {
    return (top.YHAXDocumentScanner.StMediaStatus == "PRESENT");
  } 
}
