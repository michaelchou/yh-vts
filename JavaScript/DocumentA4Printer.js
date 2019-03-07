/*�ĵ���ӡ��*/
function DocumentA4Printer()
{
    /*�ĵ���ӡ����ģ���¼���Ӧ����*/
	this.docPrinterEvents = new top.EventHandling(top.YHAXDocumentA4Printer);
    /* �ĵ���ӡ��ʱʱ�� ��λ���룩*/
    this.Timeout = 120;
	/*��ӡ�ĵ�*/
	this.print = function(strFile)
	{
	   if (top.YHAXDocumentA4Printer.StDeviceStatus != "HEALTHY")
	   {
	     if (typeof(top.MainFrame.onDeviceError_A4_Print) == "function"){
	        top.MainFrame.onDeviceError_A4_Print();
	        return;
		 }
	   }
	   top.journalPrinter.addJournalWithTime("��ӡ�ĵ� DocumentA4Printer command print");
	   top.documentA4Printer.docPrinterEvents.clearAll();
	   top.documentA4Printer.docPrinterEvents.appendEvent("PrintComplete", top.documentA4Printer.onPrintComplete);
	   top.documentA4Printer.docPrinterEvents.appendEvent("Timeout", top.documentA4Printer.onDeviceError_PrintFile);
       top.documentA4Printer.docPrinterEvents.appendEvent("DeviceError", top.documentA4Printer.onDeviceError_PrintFile);
	   top.documentA4Printer.docPrinterEvents.appendEvent("FatalError", top.documentA4Printer.onDeviceError_PrintFile);
	   top.YHAXDocumentA4Printer.PrintFile(strFile, this.Timeout*1000, false);
	   
	}
	
	/*��������λ*/
    this.reset = function ()
    {
	   top.journalPrinter.addJournalWithTime("�ĵ���ӡ����λ DocumentA4Printer command reset");
	   top.documentA4Printer.docPrinterEvents.appendEvent("ResetComplete", top.documentA4Printer.onResetComplete);
	   top.documentA4Printer.docPrinterEvents.appendEvent("DeviceError", top.documentA4Printer.onDeviceError_PrintFile);
	   top.documentA4Printer.docPrinterEvents.appendEvent("FatalError", top.documentA4Printer.onDeviceError_PrintFile);
       top.YHAXDocumentA4Printer.Reset("EJECT",1);
	   
    }
	 
	/*��ӡ�ĵ�ʱӲ�����ϵ��¼��ص�����*/
	this.onDeviceError_PrintFile = function()
	{
	   top.journalPrinter.addJournalWithTime("�ĵ���ӡʧ�� DocumentA4Printer Event onDeviceError_PrintFile");
	   top.documentA4Printer.docPrinterEvents.clearAll();
	   if (typeof(top.MainFrame.onDeviceError_A4_Print) == "function")
	      top.MainFrame.onDeviceError_A4_Print();
	    else{}
	}

	/*��ӡ�ĵ���ɵ��¼��ص�����*/
	this.onPrintComplete = function()
	{
		// ��¼�ն���ˮ
		top.journalPrinter.addJournalWithTime("�ĵ���ӡ�ɹ� DocumentA4Printer Event onPrintComplete");
		top.documentA4Printer.docPrinterEvents.clearAll();
        if (typeof(top.MainFrame.onPrintComplete_A4) == "function"){
	      top.MainFrame.onPrintComplete_A4();
		}
	}
	
	/*�ĵ���ӡ����λ�ɹ����¼���Ӧ*/
    this.onResetComplete = function()
    {
	   top.journalPrinter.addJournalWithTime("�ĵ���ӡ����λ�ɹ� DocumentA4Printer Event onResetComplete");
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
