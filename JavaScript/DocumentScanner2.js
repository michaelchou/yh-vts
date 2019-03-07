/*
  �浥������
 */
function DocumentScanner2()
{	
  // �浥ģ���¼���Ӧ����
  this.DocumentScannerEvents2 = new top.EventHandling(top.YHAXDocumentScanner2);
  //------------------------- ������������˽������ -------------------------//
  /* �˴浥����ȴ��û�ȡ��ʱ�� ��λ���룩*/
  this.EjectTimeout = 120;
  //------------------------- ������ִ�еķ��� -------------------------//      
	
  /*��������浥*/
  this.acceptAndRead = function(CodelineFormat,ImageSource)
  {
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaInserted", top.documentscanner2.onMediaInserted);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaAccepted", top.documentscanner2.onMediaAccepted);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaInvalid", top.documentscanner2.onMediaInvalid);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaReaded", top.documentscanner2.onMediaReaded);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("Timeout", top.documentscanner2.onTimeout);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError);
    top.YHAXDocumentScanner2.AcceptAndRead("BMP","BMP","FULL","FULL",CodelineFormat,ImageSource,"C:\\FrontImage.bmp","C:\\BackImage.bmp",top.iUserTimeout*1000);	
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� CheckScanner command acceptAndRead ");
    // ����ָʾ��
    try{top.guidelights.setCashOutLight("MEDIUM");}catch(e){}
  }
  
  /*����������*/
  this.cancelAccept = function()
  {
     top.journalPrinter.addJournalWithTime("�浥����ɨ��ȡ�� CheckScanner command cancelAccept ");
     top.YHAXDocumentScanner2.CancelAccept();
	 // ����ָʾ��
     try{top.guidelights.setCashOutLight("OFF");}catch(e){}
  }
  
  
   /*�浥������*/
  this.controlMedia = function(MediaAction)
  {
	top.documentscanner2.DocumentScannerEvents2.clearAll();
	top.documentscanner2.DocumentScannerEvents2.appendEvent("ControlComplete", top.documentscanner2.onControlComplete);
	top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaTaken", top.documentscanner2.onMediaTaken_Media);
	top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError);
	top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError);
	top.journalPrinter.addJournalWithTime("�浥����ɨ����� CheckScanner command controlMedia "+MediaAction);
	//���ղ����ó�ʱʱ��
	if(MediaAction == "RETRACT"){
		top.YHAXDocumentScanner2.ControlMedia(MediaAction,0);	
	}else{
		// ����ָʾ��
		try{top.guidelights.setCashOutLight("MEDIUM");}catch(e){}
		top.YHAXDocumentScanner2.ControlMedia(MediaAction,top.iUserTimeout*1000);		
	}  
  }
  
  
  /*�浥����λ*/
  this.reset = function ()
  {
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    top.documentscanner2.DocumentScannerEvents2.appendEvent("ResetComplete", top.documentscanner2.onResetComplete);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError);
    top.YHAXDocumentScanner2.Reset("RETRACT",1);
    top.journalPrinter.addJournalWithTime("�浥����ɨ�踴λ CheckScanner command Reset");
  }
  
  
    /*�˿�*/
  this.eject = function()
  {
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaEjected", top.documentscanner2.onMediaEjected);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("Timeout", top.documentscanner2.onTimeout_Eject);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaTaken", top.documentscanner2.onMediaTaken);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError);
    top.YHAXDocumentScanner2.Eject(this.EjectTimeout*1000);
    top.journalPrinter.addJournalWithTime("�浥����ɨ���˵� CheckScanner command Eject");
  }
  
  /*�̴浥*/
  this.capture = function()
  {
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaTaken", top.documentscanner2.onMediaTaken);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaCaptured", top.documentscanner2.onMediaCaptured);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError4Capture);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError4Capture);
    top.YHAXDocumentScanner2.Capture();
    top.journalPrinter.addJournalWithTime("�浥����ɨ���̵� CheckScanner command Capture");
  }
  
  /*�̴浥ʱӲ�����ϵ��¼���Ӧ*/
  this.onDeviceError4Capture = function()
  {
    top.documentscanner2.DocumentScannerEvents2.appendEvent("ResetComplete", top.documentscanner2.onResetEnd4DevErr4CaptureRe);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onResetEnd4DevErr4CaptureRe);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onResetEnd4DevErr4CaptureRe);
    top.YHAXDocumentScanner2.Reset("RETRACT",1);
    top.journalPrinter.addJournalWithTime("�浥����ɨ���̵����ϸ�λ���� CheckScanner command Reset");
  }
  
  /*�̴浥ʱӲ�����Ϻ�λ�������¼���Ӧ*/
  this.onResetEnd4DevErr4CaptureRe = function()
  {
    top.documentscanner2.DocumentScannerEvents2.appendEvent("ResetComplete", top.documentscanner2.onResetEnd4DevErr4CaptureEj);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onResetEnd4DevErr4CaptureEj);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onResetEnd4DevErr4CaptureEj);
    // ����ʹ��EJECT�������ܽ�����⣬�е�Σ�գ�����û�ޡ��������ﲻ��������ҳ��Ҳ����ô����
    top.YHAXDocumentScanner2.Reset("EJECT",1);
    top.journalPrinter.addJournalWithTime("�浥����ɨ���̵����ϸ�λ���ս�����λ�� CheckScanner command Reset");
  }
  
  /*�̿�ʱ������Ӳ�����Ϻ�λ�������¼���Ӧ*/
  this.onResetEnd4DevErr4CaptureEj = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ���̵����ϸ�λ���ս�����λ�˽��� CheckScanner command ResetEnd4DevErr4CaptureEj");
		
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cd) == "function")
      top.MainFrame.onDeviceError_cd();
    else if (typeof(top.onDeviceError_cd) == "function")
      top.onDeviceError_cd();
  }
  
  /*�浥���浥�Ѿ�������¼���Ӧ*/
  this.onMediaInserted = function()
  {
	 // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥���� CheckScanner Event MediaInserted");  
	// ����ָʾ��
    try{top.guidelights.setCashOutLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*�浥���浥�Ѿ���������¼���Ӧ*/
  this.onMediaAccepted = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥������ CheckScanner Event MediaAccepted");
    if (typeof(top.MainFrame.onMediaAccepted) == "function"){
      top.MainFrame.onMediaAccepted();
	}
  }
  
  /*�浥��������Ч�浥���¼���Ӧ*/
  this.onMediaInvalid = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� ��Ч�浥 CheckScanner Event MediaInvalid");   
    top.documentscanner2.DocumentScannerEvents2.clearAll();
	var strCodeData = top.YHAXDocumentScanner2.CodelineData;
	if(strCodeData.indexOf("|") > 0){
		//�浥��ʽ
		var strCDSFormate  = strCodeData.split("|")[0].substr(strCodeData.split("|")[0].indexOf('=') + 1, strCodeData.split("|")[0].length);
		//��α�㡢ƾ֤�š��˺š���Ѻ��������
		var strCDSAllResult = strCodeData.split("|")[1].substr(strCodeData.split("|")[1].indexOf('=') + 1, strCodeData.split("|")[1].length);	
		var strIdentAllResult = strCodeData.split("|")[2].substr(strCodeData.split("|")[2].indexOf('=') + 1, strCodeData.split("|")[2].length);	
		//ӡˢ��Ʊ��OCR
		var  strCertNum = strCodeData.split("|")[3].substr(strCodeData.split("|")[3].indexOf('=') + 1, strCodeData.split("|")[3].length);				
	    var  strAccoutNum = strCodeData.split("|")[4].substr(strCodeData.split("|")[4].indexOf('=') + 1, strCodeData.split("|")[4].length);
		//�����Ʊ��OCR
		//var strPrintOCR = strCodeData.split("|")[5].substr(strCodeData.split("|")[5].indexOf('=') + 1, strCodeData.split("|")[5].length);
        var strAuthPin = strCodeData.split("|")[6].substr(strCodeData.split("|")[6].indexOf('=') + 1, strCodeData.split("|")[6].length);	
		//��д���
		var strAmount = strCodeData.split("|")[7].substr(strCodeData.split("|")[7].indexOf('=') + 1, strCodeData.split("|")[7].length);			
		//SP��������ż������
		if(strAmount.toString().indexOf("�����") != -1){
			try{
				//��дתСд
				strAmount = new top.StringCtrl("").aNumber(strAmount.split("�����")[1]);
			}catch(e){
				//��дתСд�쳣
				strAmount = "0";
			}
		}else{
			strAmount = "0";
		}
		//�ж��Ƿ�����Ѻ:��ʶ���֧�־�Ϊ��
		var strAuthPinCheck = strCDSAllResult.substr(strCDSAllResult.length-1,strCDSAllResult.length);
		if(strAuthPinCheck != "1"){
			strAuthPin = "";
		}
		//�浥��ʽ
		top.pool.set("strCDSFormate",strCDSFormate);
		//Ҫ����ȫ
		top.pool.set("integralityCheck",strCDSAllResult);
		//��α��
		top.pool.set("receiptDistinguish",strIdentAllResult);
		
		//��ȡǰ6λ�ļ�α�㼰��3λ�ı�����
		top.pool.set("strIdentResult",strIdentAllResult.substring(0,strIdentAllResult.length-3));//��α���		
		top.pool.set("strElement",strIdentAllResult.substring(strIdentAllResult.length-3,strIdentAllResult.length));//������		
		top.pool.set("strCDCertNum",strCertNum);//ƾ֤��
		top.pool.set("strAccoutNum",strAccoutNum);//�˺�
		top.pool.set("strCDAmount", new top.StringCtrl("").YuanToFen(strAmount));//����ʽ��Ϊ��
		top.pool.set("strAuthPin",strAuthPin);//��Ѻ������
		
		//ƾ֤�ż�¼
		var strCDSNum = top.pool.get("strCDCertNum");
		var strCDSNums = top.pool.get("strAccoutNum");
		top.journalPrinter.addJournalWithTime("ƾ֤�ų���: "+strCDSNum.length+"  �˺ų���:"+strCDSNums.length); 
		
		if (typeof(top.MainFrame.onMediaInvalid) == "function")
		  top.MainFrame.onMediaInvalid();					
	}else{	
		if (typeof(top.MainFrame.onMediaInvalid) == "function")
		  top.MainFrame.onMediaInvalid();
	}
  }
  
  /*�浥���浥��֤���¼���Ӧ*/
  this.onMediaReaded = function(cardData)
  {
  	top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥��Ϣ�Ѷ�ȡ CheckScanner Event MediaReaded"); 
	var strCardData = new top.StringCtrl("").byteArr2HexStr(cardData);
    top.documentscanner2.DocumentScannerEvents2.clearAll();
	var strCodeData = top.YHAXDocumentScanner2.CodelineData;
	if(strCodeData.indexOf("|") > 0){
		//�浥��ʽ
		var strCDSFormate  = strCodeData.split("|")[0].substr(strCodeData.split("|")[0].indexOf('=') + 1, strCodeData.split("|")[0].length);
		//��α�㡢ƾ֤�š��˺š���Ѻ��������
		var strCDSAllResult = strCodeData.split("|")[1].substr(strCodeData.split("|")[1].indexOf('=') + 1, strCodeData.split("|")[1].length);	
		var strIdentAllResult = strCodeData.split("|")[2].substr(strCodeData.split("|")[2].indexOf('=') + 1, strCodeData.split("|")[2].length);	
		//ӡˢ��Ʊ��OCR
		var  strCertNum = strCodeData.split("|")[3].substr(strCodeData.split("|")[3].indexOf('=') + 1, strCodeData.split("|")[3].length);				
	    var  strAccoutNum = strCodeData.split("|")[4].substr(strCodeData.split("|")[4].indexOf('=') + 1, strCodeData.split("|")[4].length);
		//�����Ʊ��OCR
		//var strPrintOCR = strCodeData.split("|")[5].substr(strCodeData.split("|")[5].indexOf('=') + 1, strCodeData.split("|")[5].length);
        var strAuthPin = strCodeData.split("|")[6].substr(strCodeData.split("|")[6].indexOf('=') + 1, strCodeData.split("|")[6].length);	
		//��д���
		var strAmount = strCodeData.split("|")[7].substr(strCodeData.split("|")[7].indexOf('=') + 1, strCodeData.split("|")[7].length);			
		//SP��������ż������
		if(strAmount.toString().indexOf("�����") != -1){
			try{
				//��дתСд
				strAmount = new top.StringCtrl("").aNumber(strAmount.split("�����")[1]);
			}catch(e){
				//��дתСд�쳣
				strAmount = "0";
			}		
		}else{
			strAmount = "0";
		}
		//�ж��Ƿ�����Ѻ:��ʶ���֧�־�Ϊ��
		var strAuthPinCheck = strCDSAllResult.substr(strCDSAllResult.length-1,strCDSAllResult.length);
		if(strAuthPinCheck != "1"){
			strAuthPin = "";
		}
		//�浥��ʽ
		top.pool.set("strCDSFormate",strCDSFormate);
		//Ҫ����ȫ
		top.pool.set("integralityCheck",strCDSAllResult);
		//��α��
		top.pool.set("receiptDistinguish",strIdentAllResult);
		
		//��ȡǰ6λ�ļ�α�㼰��3λ�ı�����
		top.pool.set("strIdentResult",strIdentAllResult.substring(0,strIdentAllResult.length-3));//��α���		
		top.pool.set("strElement",strIdentAllResult.substring(strIdentAllResult.length-3,strIdentAllResult.length));//������		
		top.pool.set("strCDCertNum",strCertNum);//ƾ֤��
		top.pool.set("strAccoutNum",strAccoutNum);//�˺�
		top.pool.set("strCDAmount", new top.StringCtrl("").YuanToFen(strAmount));//����ʽ��Ϊ��
		top.pool.set("strAuthPin",strAuthPin);//��Ѻ������
		// ��¼�ն���ˮ
		//ƾ֤�ż�¼
		var strCDSNum = top.pool.get("strCDCertNum");
		var strCDSNums = top.pool.get("strAccoutNum");
		top.journalPrinter.addJournalWithTime("ƾ֤�ų���: "+strCDSNum.length+"  �˺ų���:"+strCDSNums.length);
	
		if (typeof(top.MainFrame.onMediaReaded) == "function"){
			top.MainFrame.onMediaReaded();
		}					
	}else{
	  if (typeof(top.MainFrame.onServiceFailed) == "function"){ 
         top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_ID_READFAILED, "��ȡ�浥Ҫ����Ϣʧ�ܣ�");
      }	
	}
  }

  /*������ʱ���¼���Ӧ*/
  this.onTimeout = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥��ʱ CheckScanner Event Timeout");   
		top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onTimeout_cd) == "function")
      top.MainFrame.onTimeout_cd();
  }
  
  /*�浥��Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥������ CheckScanner Event DeviceError");  
    top.documentscanner2.DocumentScannerEvents2.clearAll();
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
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� ��λ�ɹ� CheckScanner Event ResetComplete"); 
    top.documentscanner2.DocumentScannerEvents2.clearAll();
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
    if (typeof(top.MainFrame.onControlComplete) == "function")
      top.MainFrame.onControlComplete();
  }
  
  /*�浥���浥�Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onMediaTaken = function()
  {
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥��ȡ�� CheckScanner Event MediaTaken");
		// ����ָʾ��
    try{top.guidelights.setCashOutLight("OFF");}catch(e){}
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onMediaTaken) == "function")
      top.MainFrame.onMediaTaken();
    else if (typeof(top.onMediaTaken) == "function")
      top.onMediaTaken();
  }
  
   /*�浥���浥�Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onMediaTaken_Media = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� CheckScanner Event MediaTaken_Media");
	// ����ָʾ��
    try{top.guidelights.setCashOutLight("OFF");}catch(e){}
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onMediaTaken_Media) == "function")
      top.MainFrame.onMediaTaken_Media();
    else if (typeof(top.onMediaTaken_Media) == "function")
      top.onMediaTaken_Media();
  } 
  
  /*�浥���浥�Ѿ����˳����¼���Ӧ*/
  this.onMediaEjected = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥�˳��ɹ� CheckScanner Event MediaEjected");
    if (typeof(top.MainFrame.onMediaEjected) == "function")
      top.MainFrame.onMediaEjected();
    else if (typeof(top.onMediaEjected) == "function")
      top.onMediaEjected();
  }

   /*�˳��Ĵ浥��ʱδ���ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onTimeout_Eject = function()
  {
     // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥�˳���ʱ CheckScanner Event Timeout_Eject");
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    // �˴浥��ʱ���Զ��̴浥
    top.documentscanner2.capture();
  }
  
  /*�浥�Ѿ���������¼���Ӧ*/
  this.onMediaCaptured = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥����ɨ�� �浥���� CheckScanner Event MediaCaptured");
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onMediaCaptured) == "function")
      top.MainFrame.onMediaCaptured();
    else if (typeof(top.onMediaCaptured) == "function")
      top.onMediaCaptured();
  }
 

  //------------------------- ������������ -------------------------//

  /*�жϷ��������Ƿ���ڿ�*/
  this.isCardPresent = function()
  {
    return (top.YHAXDocumentScanner2.StMediaStatus == "PRESENT");
  } 
  
    /*
���� ˽�к����������������浥�����յ���Ϣ
     ���أ�
     �����ն˶���״̬�Ľ��������
     RESULT_SUCCESSFUL
     RESULT_FAILED
     RESULT_UNCERTAIN
   */
   this.sendCaptureStatus = function()
   {
      var exch = new ExchangeXmlWithHost();
	  var reqMsg = new ColsMsgXmlText();
      reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AppendExpLog");
      reqMsg.appendNode("strExpCode", top.EXPCODE_CDSDISPENSER);
	  reqMsg.appendNode("strPan", top.pool.get("strCDCertNum"));         //�浥ƾ֤��
      reqMsg.appendNode("strMemo", "�浥������");
      var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
      return iRet;
   }
}
