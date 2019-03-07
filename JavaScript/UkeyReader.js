/*
  ��UKEY������
 */
function UkeyReader()
{	
  // ��UKEY��ģ���¼���Ӧ����
  this.UkeyReadEvents = new top.EventHandling(top.YHAXUkeyReader);
  //------------------------- ��UKEY��������˽������ -------------------------//
  /* �˳�UKEY��ȴ��û�ȡUKEYʱ�� ��λ���룩*/
  this.EjectTimeout = 120;
  //------------------------- ��UKEY��ִ�еķ��� -------------------------//   
    
	
  /*�����UKEY*/
  this.accept = function()
  {
    top.ukeyReader.UkeyReadEvents.clearAll();
    top.ukeyReader.UkeyReadEvents.appendEvent("CardInserted", top.ukeyReader.onCardInserted);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardAccepted", top.ukeyReader.onCardAccepted);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardInvalid", top.ukeyReader.onCardInvalid);
	top.ukeyReader.UkeyReadEvents.appendEvent("Timeout", top.ukeyReader.onTimeout);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onDeviceError);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onDeviceError);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardAcceptCancelled", top.ukeyReader.onCardAcceptCancelled);
    top.journalPrinter.addJournalWithTime("�����UKEY UkeyReader command AcceptAndReadAvailableTracks" + top.journalPrinter.strNewLine);
    top.YHAXUkeyReader.AcceptAndReadAvailableTracks("3", top.iUserTimeout*1000);
	// ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("MEDIUM");}catch(e){}
  }
  
  /*�������UKEY*/
  this.cancelAccept = function()
  {
	 top.journalPrinter.addJournalWithTime("�������UKEY UkeyReader command CancelAccept" + top.journalPrinter.strNewLine);
     top.YHAXUkeyReader.CancelAccept();
	 // ����ָʾ��
     try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
  }
  
  /*��UKEY*/
  this.eject = function()
  {
    top.ukeyReader.UkeyReadEvents.clearAll();
    top.ukeyReader.UkeyReadEvents.appendEvent("CardEjected", top.ukeyReader.onCardEjected);
    top.ukeyReader.UkeyReadEvents.appendEvent("Timeout", top.ukeyReader.onTimeout_Eject);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardTaken", top.ukeyReader.onCardTaken);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onDeviceError);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onDeviceError);
	top.journalPrinter.addJournalWithTime("��UKEY UkeyReader command Eject" + top.journalPrinter.strNewLine);
    top.YHAXUkeyReader.Eject(this.EjectTimeout*1000);
  }
  
  /*��UKEY��ֹ��UKEY���¼���Ӧ*/
  this.onCardAcceptCancelled = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("ȡ����ȡUKEY UkeyReader Event onCardAcceptCancelled" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onCardAcceptCancelled) == "function"){
      top.MainFrame.onCardAcceptCancelled();
	}
  }

  /*��UKEY��ʱ���¼���Ӧ*/
  this.onTimeout = function()
  {
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��ȡUKEY��ʱ UkeyReader Event onTimeout" + top.journalPrinter.strNewLine);
	top.ukeyReader.UkeyReadEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout_ukeyreader) == "function")
      top.MainFrame.onTimeout_ukeyreader();
  }
  
  /*��UKEYʱUKEY�Ѿ�������¼���Ӧ*/
  this.onCardInserted = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("UKEY�Ѿ����� UkeyReader Event onCardInserted" + top.journalPrinter.strNewLine);
	// ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardInserted) == "function")
      top.MainFrame.onCardInserted();
  }

  /*��UKEYʱUKEY�Ѿ���������¼���Ӧ*/
  this.onCardAccepted = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��UKEY�Ѿ����� UkeyReader Event onCardAccepted" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onCardAccepted) == "function"){
      top.MainFrame.onCardAccepted(top.YHAXUkeyReader.Track3);
	}
  }

  /*��UKEYʱ������ЧUKEY���¼���Ӧ*/
  this.onCardInvalid = function()
  {
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��ЧUKEY UkeyReader Event onCardInvalid" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onCardInvalid) == "function")
      top.MainFrame.onCardInvalid();
  }

  
   /*��UKEYʱUKEY�Ѿ����˳����¼���Ӧ*/
  this.onCardEjected = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("UKEY�˳��ɹ� UkeyReader Event onCardEjected" + top.journalPrinter.strNewLine);
	// ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("QUICK");}catch(e){}
	// ������ʾ��
    try{top.soundPlayer.TakeCardMusic();}catch(e){}

    if (typeof(top.MainFrame.onCardEjected_ukeyreader) == "function")
      top.MainFrame.onCardEjected_ukeyreader();
    else if (typeof(top.onCardEjected_ukeyreader) == "function")
      top.onCardEjected_ukeyreader();
  }
  
  /*��UKEYʱUKEY�Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onCardTaken = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("UKEY��ȡ�� UkeyReader Event onCardTaken" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    // ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardTaken_ukeyreader) == "function")
      top.MainFrame.onCardTaken_ukeyreader();
    else if (typeof(top.onCardTaken_ukeyreader) == "function")
      top.onCardTaken_ukeyreader();
  }
  
   /*�˳���UKEY��ʱδ���ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onTimeout_Eject = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("UKEY�˳���ʱ UkeyReader Event onTimeout_Eject" + top.journalPrinter.strNewLine);
	top.ukeyReader.UkeyReadEvents.clearAll();
    // ��UKEY��ʱ���Զ���UKEY
    top.ukeyReader.capture();
  }
  
  /*��UKEY*/
  this.capture = function()
  {
    top.ukeyReader.UkeyReadEvents.clearAll();
    top.ukeyReader.UkeyReadEvents.appendEvent("CardTaken", top.ukeyReader.onCardTaken);
    top.ukeyReader.UkeyReadEvents.appendEvent("CardCaptured", top.ukeyReader.onCardCaptured);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onDeviceError4Capture);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onDeviceError4Capture);
	top.journalPrinter.addJournalWithTime("��UKEY UkeyReader command Capture" + top.journalPrinter.strNewLine);
    top.YHAXUkeyReader.Capture();
  }
  
  /*��UKEYʱUKEY��Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError4Capture = function()
  {
    top.ukeyReader.UkeyReadEvents.appendEvent("ResetComplete", top.ukeyReader.onResetEnd4DevErr4CaptureRe);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onResetEnd4DevErr4CaptureRe);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onResetEnd4DevErr4CaptureRe);
	top.journalPrinter.addJournalWithTime("��λ(����) UkeyReader command Reset" + top.journalPrinter.strNewLine);
    top.YHAXUkeyReader.Reset("RETRACT");
  }
  
  /*��UKEYʱUKEYӲ�����Ϻ�λ�������¼���Ӧ*/
  this.onResetEnd4DevErr4CaptureRe = function()
  {
    top.ukeyReader.UkeyReadEvents.appendEvent("ResetComplete", top.ukeyReader.onResetEnd4DevErr4CaptureEj);
    top.ukeyReader.UkeyReadEvents.appendEvent("DeviceError", top.ukeyReader.onResetEnd4DevErr4CaptureEj);
	top.ukeyReader.UkeyReadEvents.appendEvent("FatalError", top.ukeyReader.onResetEnd4DevErr4CaptureEj);
	top.journalPrinter.addJournalWithTime("��λ(��) UkeyReader command Reset" + top.journalPrinter.strNewLine);
    // ����ʹ��EJECT�������ܽ�����⣬�е�Σ�գ�����û�ޡ��������ﲻ��������ҳ��Ҳ����ô����
    top.YHAXUkeyReader.Reset("EJECT");
  }
  
  
  /*��UKEYʱUKEYӲ�����Ϻ�λ�������¼���Ӧ*/
  this.onResetEnd4DevErr4CaptureEj = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��UKEYʧ�� UkeyReader Event onResetEnd4DevErr4CaptureEj" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_ukeyreader) == "function")
      top.MainFrame.onDeviceError_ukeyreader();
    else if (typeof(top.onDeviceError_ukeyreader) == "function")
      top.onDeviceError_ukeyreader();
  }
  
   /*��UKEYʱUKEY�Ѿ���������¼���Ӧ*/
  this.onCardCaptured = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("UKEY���� UkeyReader Event onCardCaptured" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onUkeyCaptured) == "function")
      top.MainFrame.onUkeyCaptured();
    else if (typeof(top.onUkeyCaptured) == "function")
      top.onUkeyCaptured();
  }
  
  /*��UKEYӲ�����ϵ��¼���Ӧ*/
  this.onDeviceError = function()
  {
	top.journalPrinter.addJournalWithTime("UKEY���������� UkeyReader Event onDeviceError" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_ukeyreader) == "function")
    {
      top.MainFrame.onDeviceError_ukeyreader();
    }else if (typeof(top.onDeviceError_ukeyreader) == "function")
    {
      top.onDeviceError_ukeyreader();
    }else{}
  };

  /*��UKEY����λ�ɹ����¼���Ӧ*/
  this.onResetComplete = function()
  {
	top.journalPrinter.addJournalWithTime("UKEY��λ�ɹ� UkeyReader Event onResetComplete" + top.journalPrinter.strNewLine);
    top.ukeyReader.UkeyReadEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_ukeyreader) == "function")
    {
      top.MainFrame.onResetComplete_ukeyreader();
    }else if (typeof(top.onResetComplete_ukeyreader) == "function")
    {
      top.onResetComplete_ukeyreader();
    }else{}
  };

//------------------------- ������������ -------------------------//

  /*�ж�UKEY���������Ƿ����UKEY*/
  this.isCardPresent = function()
  {
    return (top.YHAXUkeyReader.StMediaStatus == "PRESENT");
  } 
}
