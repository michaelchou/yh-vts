/*
  ��ˮ��ӡ��������
*/
function JournalPrinter()
{
  this.TITLEWIDTH = 40;
  /*���з�*/
  this.strNewLine = "\n";
  /*XSF�ؼ��¼�������*/
  this.JournalPrintEvents = new top.EventHandling(top.YHAXJournalPrint);
  /*�������ڲ��������*/
  this.strPrintDataBuf4Error = "";
  /*��ǰ��Ҫ��ӡ������*/
  this.strCurPrintData = "";
  /*���з�������*/
  this.LINEFEED_CONF = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_JOURNALPRINTER_LINEFEED, "");
  /*���з���ת��*/
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
  /*��ӡ��ˮ*/
  this.printJournalData = function(JournalData)
  {
    var strTmpFile = top.YHAXCommonCtrl.GenerateTempFile("Journal", JournalData);
    top.journalPrinter.JournalPrintEvents.clearAll();
    top.journalPrinter.JournalPrintEvents.appendEvent("PrintComplete", top.journalPrinter.onPrintComplete);
    top.journalPrinter.JournalPrintEvents.appendEvent("DeviceError", top.journalPrinter.onDeviceError);
	top.journalPrinter.JournalPrintEvents.appendEvent("FatalError", top.journalPrinter.onDeviceError);
    top.YHAXJournalPrint.PrintFile(strTmpFile, -1,true);
  }

  /*��ӡ��ˮ�Ѿ���ɵ��¼��ص�����*/
  this.onPrintComplete = function()
  {
    top.journalPrinter.JournalPrintEvents.clearAll();
    top.journalPrinter.strPrintDataBuf4Error = "";
    if (typeof(top.MainFrame.onPrintOK_journal) == "function")
      top.MainFrame.onPrintOK_journal();
  }

  /*��ˮ��ӡ������Ӳ�����ϵ��¼��ص�����*/
  this.onDeviceError = function()
  {
    top.journalPrinter.JournalPrintEvents.clearAll();
    // ���ӵ����򻺴�
    if (top.journalPrinter.strPrintDataBuf4Error.length > 1024*2)
      top.journalPrinter.strPrintDataBuf4Error = "";
    if (typeof(top.MainFrame.onErrorEvent_journal) == "function")
      top.MainFrame.onErrorEvent_journal();
  }

  /*�����Ҫ��ӡ����ˮ����*/
  this.addJournal = function(JournalData)
  {
    /*��ӵ�������ˮ�ļ�*/
    top.YHAXCommonCtrl.AppendEJournal("Journal.txt", JournalData);
    /*��ˮ��ӡ����ӡ*/
    // ���浱ǰ��ӡ����,�Ա���ӡ�����ϻָ�ʱ����
    this.strCurPrintData += JournalData;
    // ��Ҫ���������뵱ǰ����һ���ӡ
    this.printJournalData(this.strPrintDataBuf4Error + JournalData);
  }
  
  this.addJournalWithTime = function(JournalData){
	  var strJrl = new top.DateTimeCtrl().getHHmmSSMsWithSep() 
				   + "  "+ JournalData + top.journalPrinter.strNewLine;
	  this.addJournal(strJrl);
  }
  
  /*�����Ҫ��ӡ����ˮ����*/
  this.addError = function(JournalData)
  {
    /*��ӵ�������ˮ�ļ�*/
    top.YHAXCommonCtrl.AppendEJournal("Error.txt", JournalData);
    /*��ˮ��ӡ����ӡ*/
    // ���浱ǰ��ӡ����,�Ա���ӡ�����ϻָ�ʱ����
    this.strCurPrintData += JournalData;
    // ��Ҫ���������뵱ǰ����һ���ӡ
    this.printJournalData(this.strPrintDataBuf4Error + JournalData);
  }
    /*�����Ҫ��ӡ����ˮ����*/
  this.addTimeout = function(JournalData)
  {
    /*��ӵ�������ˮ�ļ�*/
    top.YHAXCommonCtrl.AppendEJournal("Timeout.txt", JournalData);
    /*��ˮ��ӡ����ӡ*/
    // ���浱ǰ��ӡ����,�Ա���ӡ�����ϻָ�ʱ����
    this.strCurPrintData += JournalData;
    // ��Ҫ���������뵱ǰ����һ���ӡ
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
    // ��Ҫ���������뵱ǰ����һ���ӡ
    this.printJournalData(this.strPrintDataBuf4Error + JournalData);	  
  }
  
  this.addCashJournalWithTime = function(JournalData,bJournalCashException){
	  var strJrl = new top.DateTimeCtrl().getHHmmSSMsWithSep() 
				   + "  "+ JournalData + top.journalPrinter.strNewLine;
	  this.addCashJournal(strJrl,bJournalCashException);
	  this.addJournal(strJrl);
  }
}