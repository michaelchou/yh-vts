/*文档打印类*/
function DocumentA4Printer()
{
    /*文档打印机虚模块事件响应对象*/
	this.docPrinterEvents = new top.EventHandling(top.YHAXDocumentA4Printer);
    /* 文档打印超时时间 单位（秒）*/
    this.Timeout = 120;
	/*打印文档*/
	this.print = function(strFile)
	{
	   if (top.YHAXDocumentA4Printer.StDeviceStatus != "HEALTHY")
	   {
	     if (typeof(top.MainFrame.onDeviceError_A4_Print) == "function"){
	        top.MainFrame.onDeviceError_A4_Print();
	        return;
		 }
	   }
	   top.journalPrinter.addJournalWithTime("打印文档 DocumentA4Printer command print");
	   top.documentA4Printer.docPrinterEvents.clearAll();
	   top.documentA4Printer.docPrinterEvents.appendEvent("PrintComplete", top.documentA4Printer.onPrintComplete);
	   top.documentA4Printer.docPrinterEvents.appendEvent("Timeout", top.documentA4Printer.onDeviceError_PrintFile);
       top.documentA4Printer.docPrinterEvents.appendEvent("DeviceError", top.documentA4Printer.onDeviceError_PrintFile);
	   top.documentA4Printer.docPrinterEvents.appendEvent("FatalError", top.documentA4Printer.onDeviceError_PrintFile);
	   top.YHAXDocumentA4Printer.PrintFile(strFile, this.Timeout*1000, false);
	   
	}
	
	/*读卡器复位*/
    this.reset = function ()
    {
	   top.journalPrinter.addJournalWithTime("文档打印机复位 DocumentA4Printer command reset");
	   top.documentA4Printer.docPrinterEvents.appendEvent("ResetComplete", top.documentA4Printer.onResetComplete);
	   top.documentA4Printer.docPrinterEvents.appendEvent("DeviceError", top.documentA4Printer.onDeviceError_PrintFile);
	   top.documentA4Printer.docPrinterEvents.appendEvent("FatalError", top.documentA4Printer.onDeviceError_PrintFile);
       top.YHAXDocumentA4Printer.Reset("EJECT",1);
	   
    }
	 
	/*打印文档时硬件故障的事件回调函数*/
	this.onDeviceError_PrintFile = function()
	{
	   top.journalPrinter.addJournalWithTime("文档打印失败 DocumentA4Printer Event onDeviceError_PrintFile");
	   top.documentA4Printer.docPrinterEvents.clearAll();
	   if (typeof(top.MainFrame.onDeviceError_A4_Print) == "function")
	      top.MainFrame.onDeviceError_A4_Print();
	    else{}
	}

	/*打印文档完成的事件回调函数*/
	this.onPrintComplete = function()
	{
		// 记录终端流水
		top.journalPrinter.addJournalWithTime("文档打印成功 DocumentA4Printer Event onPrintComplete");
		top.documentA4Printer.docPrinterEvents.clearAll();
        if (typeof(top.MainFrame.onPrintComplete_A4) == "function"){
	      top.MainFrame.onPrintComplete_A4();
		}
	}
	
	/*文档打印机复位成功的事件响应*/
    this.onResetComplete = function()
    {
	   top.journalPrinter.addJournalWithTime("文档打印机复位成功 DocumentA4Printer Event onResetComplete");
       top.documentA4Printer.docPrinterEvents.clearAll();
       if (typeof(top.MainFrame.onResetComplete_A4) == "function")
       {
          top.MainFrame.onResetComplete_A4();
       }else if (typeof(top.onResetComplete_A4) == "function")
       {
          top.onResetComplete_A4();
       }else{}
    }
}
