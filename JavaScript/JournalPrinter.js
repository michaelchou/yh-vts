/*
  流水打印机处理类
*/
function JournalPrinter()
{
  this.TITLEWIDTH = 40;
  /*换行符*/
  this.strNewLine = "\n";
  /*XSF控件事件接收器*/
  this.JournalPrintEvents = new top.EventHandling(top.YHAXJournalPrint);
  /*缓存用于补打的内容*/
  this.strPrintDataBuf4Error = "";
  /*当前需要打印的内容*/
  this.strCurPrintData = "";
  /*换行符的设置*/
  this.LINEFEED_CONF = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_JOURNALPRINTER_LINEFEED, "");
  /*换行符的转换*/
  if ("\\r" == this.LINEFEED_CONF)
  {
  	this.strNewLine = "\r";
  }else if ("\\n" == this.LINEFEED_CONF)
  {
  	this.strNewLine = "\n";
  }else if ("\\r\\n" == this.LINEFEED_CONF)
  {
  	this.strNewLine = "\r\n";
  }else if ("\\n\\r" == this.LINEFEED_CONF)
  {
  	this.strNewLine = "\n\r";
  }
  /*打印流水*/
  this.printJournalData = function(JournalData)
  {
    var strTmpFile = top.YHAXCommonCtrl.GenerateTempFile("Journal", JournalData);
    top.journalPrinter.JournalPrintEvents.clearAll();
    top.journalPrinter.JournalPrintEvents.appendEvent("PrintComplete", top.journalPrinter.onPrintComplete);
    top.journalPrinter.JournalPrintEvents.appendEvent("DeviceError", top.journalPrinter.onDeviceError);
	top.journalPrinter.JournalPrintEvents.appendEvent("FatalError", top.journalPrinter.onDeviceError);
    top.YHAXJournalPrint.PrintFile(strTmpFile, -1,true);
  }

  /*打印流水已经完成的事件回调函数*/
  this.onPrintComplete = function()
  {
    top.journalPrinter.JournalPrintEvents.clearAll();
    top.journalPrinter.strPrintDataBuf4Error = "";
    if (typeof(top.MainFrame.onPrintOK_journal) == "function")
      top.MainFrame.onPrintOK_journal();
  }

  /*流水打印机发生硬件故障的事件回调函数*/
  this.onDeviceError = function()
  {
    top.journalPrinter.JournalPrintEvents.clearAll();
    // 增加到补打缓存
    if (top.journalPrinter.strPrintDataBuf4Error.length > 1024*2)
      top.journalPrinter.strPrintDataBuf4Error = "";
    if (typeof(top.MainFrame.onErrorEvent_journal) == "function")
      top.MainFrame.onErrorEvent_journal();
  }

  /*添加需要打印的流水内容*/
  this.addJournal = function(JournalData)
  {
    /*添加到电子流水文件*/
    top.YHAXCommonCtrl.AppendEJournal("Journal.txt", JournalData);
    /*流水打印机打印*/
    // 保存当前打印内容,以备打印机故障恢复时补打
    this.strCurPrintData += JournalData;
    // 需要补打内容与当前内容一起打印
    this.printJournalData(this.strPrintDataBuf4Error + JournalData);
  }
  
  this.addJournalWithTime = function(JournalData){
	  var strJrl = new top.DateTimeCtrl().getHHmmSSMsWithSep() 
				   + "  "+ JournalData + top.journalPrinter.strNewLine;
	  this.addJournal(strJrl);
  }
  
  /*添加需要打印的流水内容*/
  this.addError = function(JournalData)
  {
    /*添加到电子流水文件*/
    top.YHAXCommonCtrl.AppendEJournal("Error.txt", JournalData);
    /*流水打印机打印*/
    // 保存当前打印内容,以备打印机故障恢复时补打
    this.strCurPrintData += JournalData;
    // 需要补打内容与当前内容一起打印
    this.printJournalData(this.strPrintDataBuf4Error + JournalData);
  }
    /*添加需要打印的流水内容*/
  this.addTimeout = function(JournalData)
  {
    /*添加到电子流水文件*/
    top.YHAXCommonCtrl.AppendEJournal("Timeout.txt", JournalData);
    /*流水打印机打印*/
    // 保存当前打印内容,以备打印机故障恢复时补打
    this.strCurPrintData += JournalData;
    // 需要补打内容与当前内容一起打印
    this.printJournalData(this.strPrintDataBuf4Error + JournalData);
  }
  
  this.addErrorWithTime = function(JournalData){
	  var strJrl = new top.DateTimeCtrl().getHHmmSSMsWithSep() 
				   + "  "+ JournalData + top.journalPrinter.strNewLine;
	  this.addError(strJrl);
  }
  
  this.addTimeoutWithTime = function(JournalData){
	  var strJrl = new top.DateTimeCtrl().getHHmmSSMsWithSep() 
				   + "  "+ JournalData + top.journalPrinter.strNewLine;
	  this.addTimeout(strJrl);
  }
  
  this.addCashJournal = function(JournalData,bJournalCashException){	  
	  top.YHAXCommonCtrl.AppendEJournal("Cash.txt", JournalData);
	  if(bJournalCashException){		  
		  top.YHAXCommonCtrl.AppendEJournal("CashException.txt", JournalData); 
	  }
	    this.strCurPrintData += JournalData;
    // 需要补打内容与当前内容一起打印
    this.printJournalData(this.strPrintDataBuf4Error + JournalData);	  
  }
  
  this.addCashJournalWithTime = function(JournalData,bJournalCashException){
	  var strJrl = new top.DateTimeCtrl().getHHmmSSMsWithSep() 
				   + "  "+ JournalData + top.journalPrinter.strNewLine;
	  this.addCashJournal(strJrl,bJournalCashException);
	  this.addJournal(strJrl);
  }
}