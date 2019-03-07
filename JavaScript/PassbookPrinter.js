/*
  ���۴�ӡ��
 */
function PassbookPrinter()
{ 
  // ���۴�ӡ����ģ���¼���Ӧ����
  this.PassbookEvents = new top.EventHandling(top.YHAXPassbook);
  
  /*�ȴ��û����۶�ȡ�ŵ�����*/
  this.accept = function()
  {
	top.journalPrinter.addJournalWithTime("�ȴ��û����� PassbookPrinter command accept");
    top.passbookprinter.PassbookEvents.clearAll();
    top.passbookprinter.PassbookEvents.appendEvent("MediaInserted", top.passbookprinter.onMediaInserted);
    top.passbookprinter.PassbookEvents.appendEvent("MediaAccepted", top.passbookprinter.onMediaAccepted);
    top.passbookprinter.PassbookEvents.appendEvent("MediaInvalid", top.passbookprinter.onMediaInvalid);
    top.passbookprinter.PassbookEvents.appendEvent("Timeout", top.passbookprinter.onTimeout_MediaAccept);
    top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.AcceptAndRead("ReadPassbook", "Track2,Track3", top.iUserTimeout*1000);
    // ����ָʾ��
    try{top.guidelights.setPassBookLight("MEDIUM");}catch(e){}
  }

  /*���۷���ص�����*/
  this.onMediaInserted = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�����Ѿ����� PassbookPrinter Event onMediaInserted "); 
    // ����ָʾ��
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*��ȡ�ŵ���ɻص�����*/
  this.onMediaAccepted = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�����Ѿ����� PassbookPrinter Event onMediaAccepted");
	top.passbookprinter.PassbookEvents.clearAll();
    if (typeof(top.MainFrame.onMediaAccepted) == "function"){   
	  var strPassbaookData = top.YHAXPassbook.GetFieldSync("Track2");
	  if(strPassbaookData == null || strPassbaookData.length < 10){
		  strPassbaookData = top.YHAXPassbook.GetFieldSync("Track3");
	  }
      	  //�ŵ������ж�
	  if(strPassbaookData == null || strPassbaookData == ""){
		 top.journalPrinter.addJournalWithTime("���۶����ŵ�������Ч");  
		 top.MainFrame.onMediaInvalid();
	  }else{
		   top.MainFrame.onMediaAccepted(strPassbaookData); 
	  } 
    }
  }

  /*��Ч���ۻص�����*/
  this.onMediaInvalid = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��Ч���� PassbookPrinter Event onMediaInvalid");
    top.passbookprinter.PassbookEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onMediaInvalid) == "function")
      top.MainFrame.onMediaInvalid();
  }

  /*
    ˽�к��������۳�ʱ
  */
  this.onTimeout_MediaAccept = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�����۳�ʱ PassbookPrinter Accept onTimeout ");
  	top.passbookprinter.PassbookEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onTimeout_MediaAccept) == "function")
      top.MainFrame.onTimeout_MediaAccept();
  }
  /*
       ˽�к��������۳�ʱ
  */  
  this.onTimeout_PrintEject = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�˴��۳�ʱ PassbookPrinter Eject onTimeout ");
  	top.passbookprinter.PassbookEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onTimeout_PrintEject) == "function")
      top.MainFrame.onTimeout_PrintEject();
  }
  /*Ӳ�����ϻص�����*/
  this.onDeviceError = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���۴�ӡ������ PassbookPrinter Event onDeviceError");
    top.passbookprinter.PassbookEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onDeviceError_Pbp) == "function"){
    
      top.MainFrame.onDeviceError_Pbp();
    }
    else if (typeof(top.onDeviceError_Pbp) == "function"){
    	
    top.onDeviceError_Pbp();
    }
  }

  /*ȡ���������*/
  this.cancelAccept = function()
  {
	top.journalPrinter.addJournal("ȡ��������� PassbookPrinter command onAcceptCancelled");  
    top.passbookprinter.PassbookEvents.appendEvent("AcceptCancelled", top.passbookprinter.onAcceptCancelled);
	top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.CancelAccept();
  }

  /*ȡ��������ۻص�����*/
  this.onAcceptCancelled = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournal("ȡ��������� PassbookPrinter Event onAcceptCancelled");  
    top.passbookprinter.PassbookEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onAcceptCancelled) == "function")
      top.MainFrame.onAcceptCancelled();
  }

  /*���۴�ӡ��ʹ��Form��ʽ��*/
  this.print = function(str)
  {
	top.YHAXPassbook.DefaultMediaName = "PassbookMedia";
    top.passbookprinter.PassbookEvents.clearAll();
    top.passbookprinter.PassbookEvents.appendEvent("PrintComplete", top.passbookprinter.onPrintComplete);
    top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.Print("SRCB_PB_Form_First", str);
	// ����ָʾ��
    try{top.guidelights.setPassBookLight("QUICK");}catch(e){}
  }

  /*��ӡ��ɻص�����*/
  this.onPrintComplete = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���۴�ӡ��� PassbookPrinter Event onPrintComplete");   
    top.passbookprinter.PassbookEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onPrintComplete) == "function")
      top.MainFrame.onPrintComplete();
  }

  /*ģ�鸴λ��*/
  this.reset = function()
  {
    top.passbookprinter.PassbookEvents.clearAll();
    top.passbookprinter.PassbookEvents.appendEvent("ResetComplete", top.passbookprinter.onResetComplete);
	top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.Reset("EJECT", 1);
  }

  /*��λ��ɻص�����*/
  this.onResetComplete = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���۸�λ�ɹ� PassbookPrinter Event onResetComplete");   
    top.passbookprinter.PassbookEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete) == "function")
      top.MainFrame.onResetComplete();
  }

  /*
    ���ۡ�
  */
  this.eject = function()
  {
	top.journalPrinter.addJournalWithTime("�����˳� PassbookPrinter command onPrintEjected");
    top.passbookprinter.PassbookEvents.clearAll();
	top.passbookprinter.PassbookEvents.appendEvent("PrintEjected", top.passbookprinter.onPrintEjected);
    top.passbookprinter.PassbookEvents.appendEvent("PrintTaken", top.passbookprinter.onPrintTaken);
    top.passbookprinter.PassbookEvents.appendEvent("Timeout", top.passbookprinter.onTimeout_PrintEject);
    top.passbookprinter.PassbookEvents.appendEvent("DeviceError", top.passbookprinter.onDeviceError);
	top.passbookprinter.PassbookEvents.appendEvent("FatalError", top.passbookprinter.onDeviceError);
    top.YHAXPassbook.Eject(120*1000);
    // ����ָʾ��
    try{top.guidelights.setPassBookLight("QUICK");}catch(e){}
  }

  /*�������˳��ص�����*/
  this.onPrintEjected = function()
  {
	 // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�����˳� PassbookPrinter Event onPrintEjected");
    if (typeof(top.MainFrame.onPrintEjected) == "function")
      top.MainFrame.onPrintEjected();
  }

  /*�������˳��ص�����*/
  this.onPrintTaken = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���۱�ȡ�� PassbookPrinter Event onPrintTaken");
    top.passbookprinter.PassbookEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setPassBookLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onPrintTaken) == "function")
      top.MainFrame.onPrintTaken();
  }
}
