/*
  二维码扫描器
 */
function BarcodeReader()
{ 
  // 二维码虚模块事件响应对象
  this.BarcodeEvents = new top.EventHandling(top.YHAXBarcodeReader);
  
  /*允许用户放入条形码，并且在扫描之后读取条形码数据*/
  this.readBarcode = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("允许用户放入条形码 BarcodeReader Commond readBarcode");
    top.barcodeReader.BarcodeEvents.clearAll();
    top.barcodeReader.BarcodeEvents.appendEvent("ReadBarcodeComplete", top.barcodeReader.onBarcodeReadComplete);
    top.barcodeReader.BarcodeEvents.appendEvent("ReadCancelled", top.barcodeReader.onReadCancelled);
    top.barcodeReader.BarcodeEvents.appendEvent("MediaInserted", top.barcodeReader.onMediaInserted);
	top.barcodeReader.BarcodeEvents.appendEvent("MediaRemoved", top.barcodeReader.onMediaRemoved);
    top.barcodeReader.BarcodeEvents.appendEvent("Timeout", top.barcodeReader.onTimeout);
    top.barcodeReader.BarcodeEvents.appendEvent("DeviceError", top.barcodeReader.onDeviceError);
	top.barcodeReader.BarcodeEvents.appendEvent("FatalError", top.barcodeReader.onDeviceError);
    top.YHAXBarcodeReader.ReadBarcode("", 120*1000);
  }

  /*条形码放入回调函数*/
  this.onMediaInserted = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("条形码已放入 BarcodeReader Event onMediaInserted");
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*读取条形码信息完成回调函数*/
  this.onBarcodeReadComplete = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("读取条形码信息完成 BarcodeReader Event onBarcodeReadComplete");
	top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onBarcodeReadComplete) == "function"){   
      top.MainFrame.onBarcodeReadComplete();
    }
  }

  /*条形码拿走回调函数*/
  this.onMediaRemoved = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("条形码被取走 BarcodeReader Event onMediaRemoved");
    top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onMediaRemoved) == "function")
      top.MainFrame.onMediaRemoved();
  }

  /*读二代证超时*/
  this.onTimeout = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("条形码读取超时 BarcodeReader Event onTimeout");
  	top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onTimeout) == "function")
      top.MainFrame.onTimeout();
  }

  /*硬件故障回调函数*/
  this.onDeviceError = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("条形码读卡器故障 BarcodeReader Event onDeviceError");
    top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_Barcode) == "function")
      top.MainFrame.onDeviceError_Barcode();
    else if (typeof(top.onDeviceError_Barcode) == "function")
      top.onDeviceError_Barcode();
  }

  /*取消允许放入条形码证*/
  this.cancelRead = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("取消允许放入条形码 BarcodeReader Commond cancelRead");
    top.barcodeReader.BarcodeEvents.appendEvent("ReadCancelled", top.barcodeReader.onReadCancelled);
	top.barcodeReader.BarcodeEvents.appendEvent("DeviceError", top.barcodeReader.onDeviceError);
	top.barcodeReader.BarcodeEvents.appendEvent("FatalError", top.barcodeReader.onDeviceError);
    top.YHAXBarcodeReader.CancelRead();
  }

  /*取消允许放入条形码回调函数*/
  this.onReadCancelled = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("取消允许放入条形码 BarcodeReader Event onReadCancelled");
    top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onReadCancelled) == "function")
      top.MainFrame.onReadCancelled();
  } 

  /*模块复位。*/
  this.reset = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("条形码模块复位 BarcodeReader Commond reset");
    top.barcodeReader.BarcodeEvents.clearAll();
    top.barcodeReader.BarcodeEvents.appendEvent("ResetComplete", top.barcodeReader.onResetComplete);
	top.barcodeReader.BarcodeEvents.appendEvent("DeviceError", top.barcodeReader.onDeviceError);
	top.barcodeReader.BarcodeEvents.appendEvent("FatalError", top.barcodeReader.onDeviceError);
    top.YHAXBarcodeReader.Reset();
  }

  /*复位完成回调函数*/
  this.onResetComplete = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("条形码模块复位完成 BarcodeReader Event onResetComplete");
    top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete) == "function")
      top.MainFrame.onResetComplete();
  }
}
