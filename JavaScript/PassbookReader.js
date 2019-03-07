/*
  刷折器类
 */
function PassbookReader()
{ 
  // 存折打印机虚模块事件响应对象
  this.PassbookReaderEvents = new top.EventHandling(top.YHAXPassbookReader);
  
  /*等待用户刷折读取磁道数据*/
  this.accept = function(timeout)
  {
	top.journalPrinter.addJournalWithTime("等待用户刷折 PassbookReader command accept");
	var cardReadTimeout = top.iUserTimeout*1000;
	if(timeout == -1){
		cardReadTimeout = timeout;
	}
    top.passbookreader.PassbookReaderEvents.clearAll();
    top.passbookreader.PassbookReaderEvents.appendEvent("CardInserted", top.passbookreader.onMediaInserted);
    top.passbookreader.PassbookReaderEvents.appendEvent("CardAccepted", top.passbookreader.onMediaAccepted);
    top.passbookreader.PassbookReaderEvents.appendEvent("CardInvalid", top.passbookreader.onMediaInvalid);
    top.passbookreader.PassbookReaderEvents.appendEvent("Timeout", top.passbookreader.onTimeout);
    top.passbookreader.PassbookReaderEvents.appendEvent("DeviceError", top.passbookreader.onDeviceError);
	top.passbookreader.PassbookReaderEvents.appendEvent("FatalError", top.passbookreader.onDeviceError);
    top.passbookreader.PassbookReaderEvents.appendEvent("CardAcceptCancelled", top.passbookreader.onAcceptCancelled);
	top.YHAXPassbookReader.AcceptAndReadAvailableTracks("2,3", cardReadTimeout);
  }

  /*存折放入回调函数*/
  this.onMediaInserted = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("刷折已经插入 PassbookReader Event onMediaInserted");     
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*读取磁道完成回调函数*/
  this.onMediaAccepted = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("存折已经受理 Passbookreader Event onMediaAccepted");
	top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onMediaAccepted) == "function"){   
	  var strPassbaookData = top.YHAXPassbookReader.Track2;
	  if(strPassbaookData == null || strPassbaookData.length < 10){
		  strPassbaookData = top.YHAXPassbookReader.Track3;
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
    top.journalPrinter.addJournalWithTime("无效存折 Passbookreader Event onMediaInvalid");
    top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onMediaInvalid) == "function")
      top.MainFrame.onMediaInvalid();
  }

  /*
    私有函数：读折超时
  */
  this.onTimeout = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("刷折超时 PassbookReader Event onPassbookReadTimeout");
  	top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onPassbookReadTimeout) == "function")
      top.MainFrame.onPassbookReadTimeout();
  }

  /*硬件故障回调函数*/
  this.onDeviceError = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("刷折故障 PassbookReader Event onDeviceError");
    top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_Pbp) == "function")
      top.MainFrame.onDeviceError_Pbp();
    else if (typeof(top.onDeviceError_Pbp) == "function")
      top.onDeviceError_Pbp();
  }

  /*取消允许进折*/
  this.cancelAccept = function()
  {
	top.journalPrinter.addJournalWithTime("取消刷折 PassbookReader command cancelAccept");
    top.passbookreader.PassbookReaderEvents.appendEvent("CardAcceptCancelled", top.passbookreader.onAcceptCancelled);
	top.passbookreader.PassbookReaderEvents.appendEvent("DeviceError", top.passbookreader.onDeviceError);
	top.passbookreader.PassbookReaderEvents.appendEvent("FatalError", top.passbookreader.onDeviceError);
    top.YHAXPassbookReader.CancelAccept();
  }

  /*取消允许进折回调函数*/
  this.onAcceptCancelled = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("取消刷折 PassbookReader Event onAcceptCancelled");  
    top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onAcceptCancelled) == "function")
      top.MainFrame.onAcceptCancelled();
  }
  /*模块复位。*/
  this.reset = function()
  {
	top.journalPrinter.addJournalWithTime("刷折器复位 PassbookReader command reset");
    top.passbookreader.PassbookReaderEvents.clearAll();
    top.passbookreader.PassbookReaderEvents.appendEvent("ResetComplete", top.passbookreader.onResetComplete);
	top.passbookreader.PassbookReaderEvents.appendEvent("DeviceError", top.passbookreader.onDeviceError);
	top.passbookreader.PassbookReaderEvents.appendEvent("FatalError", top.passbookreader.onDeviceError);
    top.YHAXPassbookReader.Reset("EJECT", 1);
  }

  /*复位完成回调函数*/
  this.onResetComplete = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("刷折器复位成功 PassbookReader Event onResetComplete");    
    top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete) == "function")
      top.MainFrame.onResetComplete();
  }
}
