/*
  �浥������
 */
function DocumentScanner()
{	
  // �浥ģ���¼���Ӧ����
  this.DocumentScannerEvents = new top.EventHandling(top.YHAXDocumentScanner);
  //------------------------- ������������˽������ -------------------------//
  /* �˴浥����ȴ��û�ȡ��ʱ�� ��λ���룩*/
  this.EjectTimeout = 120;
  //------------------------- ������ִ�еķ��� -------------------------//      
	
  /*��������浥*/
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
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� CheckPrint2 command acceptAndRead ");
  }
  
  /*����������*/
  this.cancelAccept = function()
  {
     top.journalPrinter.addJournalWithTime("�浥����ɨ��ȡ�� CheckPrint2 Event cancelAccept ");
     top.YHAXDocumentScanner.CancelAccept();
  }
  
  
   /*�浥������*/
  this.controlMedia = function(MediaAction)
  {
	top.documentscanner.DocumentScannerEvents.clearAll();
	top.documentscanner.DocumentScannerEvents.appendEvent("ControlComplete", top.documentscanner.onControlComplete);
	top.documentscanner.DocumentScannerEvents.appendEvent("MediaTaken", top.documentscanner.onMediaTaken_Media);
	top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onDeviceError);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onDeviceError);
    top.YHAXDocumentScanner.ControlMedia(MediaAction,top.iUserTimeout*1000);
    top.journalPrinter.addJournalWithTime("�浥����ɨ����� CheckPrint2 command controlMedia "+MediaAction);
  }
  
  
  /*�浥����λ*/
  this.reset = function ()
  {
	top.documentscanner.DocumentScannerEvents.clearAll();
	top.documentscanner.DocumentScannerEvents.appendEvent("ResetComplete", top.documentscanner.onResetComplete);
	top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onDeviceError);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onDeviceError);
    top.YHAXDocumentScanner.Reset("RETRACT",1);
    top.journalPrinter.addJournalWithTime("�浥����ɨ�踴λ CheckPrint2 command Reset");
  }
  
  
    /*�˿�*/
  this.eject = function()
  {
    top.documentscanner.DocumentScannerEvents.clearAll();
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaEjected", top.documentscanner.onMediaEjected);
    top.documentscanner.DocumentScannerEvents.appendEvent("Timeout", top.documentscanner.onTimeout_Eject);
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaTaken", top.documentscanner.onMediaTaken);
    top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onDeviceError);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onDeviceError);
    top.YHAXDocumentScanner.Eject(this.EjectTimeout*1000);
    top.journalPrinter.addJournalWithTime("�浥����ɨ���˵� CheckPrint2 command Eject");
  }
  
  /*�̴浥*/
  this.capture = function()
  {
    top.documentscanner.DocumentScannerEvents.clearAll();
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaTaken", top.documentscanner.onMediaTaken);
    top.documentscanner.DocumentScannerEvents.appendEvent("MediaCaptured", top.documentscanner.onMediaCaptured);
    top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onDeviceError4Capture);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onDeviceError4Capture);
    top.YHAXDocumentScanner.Capture();
     top.journalPrinter.addJournalWithTime("�浥����ɨ���̵� CheckPrint2 command capture");
  }
  
  /*�̴浥ʱӲ�����ϵ��¼���Ӧ*/
  this.onDeviceError4Capture = function()
  {
    top.documentscanner.DocumentScannerEvents.appendEvent("ResetComplete", top.documentscanner.onResetEnd4DevErr4CaptureRe);
    top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onResetEnd4DevErr4CaptureRe);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onResetEnd4DevErr4CaptureRe);
    top.YHAXDocumentScanner.Reset("RETRACT",1);
     top.journalPrinter.addJournalWithTime("�浥����ɨ����ϸ�λ�̵� CheckPrint2 command DeviceError4Capture");
  }
  
  /*�̴浥ʱӲ�����Ϻ�λ�������¼���Ӧ*/
  this.onResetEnd4DevErr4CaptureRe = function()
  {
    top.documentscanner.DocumentScannerEvents.appendEvent("ResetComplete", top.documentscanner.onResetEnd4DevErr4CaptureEj);
    top.documentscanner.DocumentScannerEvents.appendEvent("DeviceError", top.documentscanner.onResetEnd4DevErr4CaptureEj);
	top.documentscanner.DocumentScannerEvents.appendEvent("FatalError", top.documentscanner.onResetEnd4DevErr4CaptureEj);
    // ����ʹ��EJECT�������ܽ�����⣬�е�Σ�գ�����û�ޡ��������ﲻ��������ҳ��Ҳ����ô����
    top.YHAXDocumentScanner.Reset("EJECT",1);
     top.journalPrinter.addJournalWithTime("�浥����ɨ����ϸ�λ�������˵� CheckPrint2 command ResetEnd4DevErr4CaptureRe");
  }
  
  /*�̿�ʱ������Ӳ�����Ϻ�λ�������¼���Ӧ*/
  this.onResetEnd4DevErr4CaptureEj = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ����ϸ�λ�������˵���� CheckPrint2 Event ResetEnd4DevErr4CaptureEj");

    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cd) == "function")
      top.MainFrame.onDeviceError_cd();
    else if (typeof(top.onDeviceError_cd) == "function")
      top.onDeviceError_cd();
  }
  
  /*�浥���浥�Ѿ�������¼���Ӧ*/
  this.onMediaInserted = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥�Ѳ��� CheckPrint2 Event MediaInserted");
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*�浥���浥�Ѿ���������¼���Ӧ*/
  this.onMediaAccepted = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥�Ѷ�ȡ CheckPrint2 Event MediaAccepted");
    if (typeof(top.MainFrame.onMediaAccepted) == "function"){
      top.MainFrame.onMediaAccepted();
	}
  }
  
  /*�浥��������Ч�浥���¼���Ӧ*/
  this.onMediaInvalid = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� ��Ч�浥 CheckPrint2 Event MediaInvalid");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onMediaInvalid) == "function")
      top.MainFrame.onMediaInvalid();
  }
  
  /*�浥���浥��֤���¼���Ӧ*/
  this.onMediaReaded = function()
  {
    top.documentscanner.DocumentScannerEvents.clearAll();
	var strCodeData = top.YHAXDocumentScanner.CodelineData;
	if(strCodeData.indexOf("|") > 0){
		var  strCertNum = strCodeData.split("|")[0].substr(strCodeData.split("|")[0].indexOf('=') + 1, strCodeData.split("|")[0].length);
		top.pool.set("strCDCertNum",strCertNum);//ƾ֤��
	}else{
		top.pool.set("strCDCertNum",strCodeData);//ƾ֤��
	}
	//ƾ֤�ż�¼
	var strCDSNum = top.pool.get("strCDCertNum");
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥��ȡ��� ƾ֤�ų���:"+strCDSNum.length);
    if (typeof(top.MainFrame.onMediaReaded) == "function"){
      top.MainFrame.onMediaReaded();
	}
  }

  /*������ʱ���¼���Ӧ*/
  this.onTimeout = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥��ʱ CheckPrint2 Event Timeout");  
    top.documentscanner.DocumentScannerEvents.clearAll();	
    if (typeof(top.MainFrame.onTimeout) == "function")
      top.MainFrame.onTimeout();
  }
  
  /*�浥��Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥������ CheckPrint2 Event DeviceError");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cd) == "function")
    {
      top.MainFrame.onDeviceError_cd();
    }else if (typeof(top.onDeviceError_cd) == "function")
    {
      top.onDeviceError_cd();
    }else{}
  };
  
   /*�浥����λ�ɹ����¼���Ӧ*/
  this.onResetComplete = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� ��λ�ɹ� CheckPrint2 Event ResetComplete");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_cd) == "function")
    {
      top.MainFrame.onResetComplete_cd();
    }else if (typeof(top.onResetComplete_cd) == "function")
    {
      top.onResetComplete_cd();
    }else{}
  };
  
  
  /*�浥���浥ControlMedia��ɵ��¼���Ӧ*/
  this.onControlComplete = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� CheckPrint2 Event ControlComplete");
    if (typeof(top.MainFrame.onControlComplete) == "function")
      top.MainFrame.onControlComplete();
  }
  
  /*�浥���浥�Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onMediaTaken = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥ȡ�� CheckPrint2 Event MediaTaken");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onMediaTaken) == "function")
      top.MainFrame.onMediaTaken();
    else if (typeof(top.onMediaTaken) == "function")
      top.onMediaTaken();
  }
  
   /*�浥���浥�Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onMediaTaken_Media = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� CheckPrint2 Event MediaTaken_Media");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onMediaTaken_Media) == "function")
      top.MainFrame.onMediaTaken_Media();
    else if (typeof(top.onMediaTaken_Media) == "function")
      top.onMediaTaken_Media();
  }
  
  
  /*�浥���浥�Ѿ����˳����¼���Ӧ*/
  this.onMediaEjected = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� CheckPrint2 Event MediaEjected");  
    if (typeof(top.MainFrame.onMediaEjected) == "function")
      top.MainFrame.onMediaEjected();
    else if (typeof(top.onMediaEjected) == "function")
      top.onMediaEjected();
  }

   /*�˳��Ĵ浥��ʱδ���ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onTimeout_Eject = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� CheckPrint2 Event Timeout_Eject");    
    top.documentscanner.DocumentScannerEvents.clearAll();
    // �˴浥��ʱ���Զ��̴浥
    top.documentscanner.capture();
  }
  
  /*�浥�Ѿ���������¼���Ӧ*/
  this.onMediaCaptured = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� CheckPrint2 Event MediaCaptured");
    top.documentscanner.DocumentScannerEvents.clearAll();
    if (typeof(top.MainFrame.onMediaCaptured) == "function")
      top.MainFrame.onMediaCaptured();
    else if (typeof(top.onMediaCaptured) == "function")
      top.onMediaCaptured();
  }
 

  //------------------------- ������������ -------------------------//

  /*�жϷ��������Ƿ���ڿ�*/
  this.isCardPresent = function()
  {
    return (top.YHAXDocumentScanner.StMediaStatus == "PRESENT");
  } 
}
