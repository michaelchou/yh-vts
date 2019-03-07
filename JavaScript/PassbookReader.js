/*
  ˢ������
 */
function PassbookReader()
{ 
  // ���۴�ӡ����ģ���¼���Ӧ����
  this.PassbookReaderEvents = new top.EventHandling(top.YHAXPassbookReader);
  
  /*�ȴ��û�ˢ�۶�ȡ�ŵ�����*/
  this.accept = function(timeout)
  {
	top.journalPrinter.addJournalWithTime("�ȴ��û�ˢ�� PassbookReader command accept");
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

  /*���۷���ص�����*/
  this.onMediaInserted = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ˢ���Ѿ����� PassbookReader Event onMediaInserted");     
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*��ȡ�ŵ���ɻص�����*/
  this.onMediaAccepted = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�����Ѿ����� Passbookreader Event onMediaAccepted");
	top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onMediaAccepted) == "function"){   
	  var strPassbaookData = top.YHAXPassbookReader.Track2;
	  if(strPassbaookData == null || strPassbaookData.length < 10){
		  strPassbaookData = top.YHAXPassbookReader.Track3;
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
    top.journalPrinter.addJournalWithTime("��Ч���� Passbookreader Event onMediaInvalid");
    top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onMediaInvalid) == "function")
      top.MainFrame.onMediaInvalid();
  }

  /*
    ˽�к��������۳�ʱ
  */
  this.onTimeout = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ˢ�۳�ʱ PassbookReader Event onPassbookReadTimeout");
  	top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onPassbookReadTimeout) == "function")
      top.MainFrame.onPassbookReadTimeout();
  }

  /*Ӳ�����ϻص�����*/
  this.onDeviceError = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ˢ�۹��� PassbookReader Event onDeviceError");
    top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_Pbp) == "function")
      top.MainFrame.onDeviceError_Pbp();
    else if (typeof(top.onDeviceError_Pbp) == "function")
      top.onDeviceError_Pbp();
  }

  /*ȡ���������*/
  this.cancelAccept = function()
  {
	top.journalPrinter.addJournalWithTime("ȡ��ˢ�� PassbookReader command cancelAccept");
    top.passbookreader.PassbookReaderEvents.appendEvent("CardAcceptCancelled", top.passbookreader.onAcceptCancelled);
	top.passbookreader.PassbookReaderEvents.appendEvent("DeviceError", top.passbookreader.onDeviceError);
	top.passbookreader.PassbookReaderEvents.appendEvent("FatalError", top.passbookreader.onDeviceError);
    top.YHAXPassbookReader.CancelAccept();
  }

  /*ȡ��������ۻص�����*/
  this.onAcceptCancelled = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ȡ��ˢ�� PassbookReader Event onAcceptCancelled");  
    top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onAcceptCancelled) == "function")
      top.MainFrame.onAcceptCancelled();
  }
  /*ģ�鸴λ��*/
  this.reset = function()
  {
	top.journalPrinter.addJournalWithTime("ˢ������λ PassbookReader command reset");
    top.passbookreader.PassbookReaderEvents.clearAll();
    top.passbookreader.PassbookReaderEvents.appendEvent("ResetComplete", top.passbookreader.onResetComplete);
	top.passbookreader.PassbookReaderEvents.appendEvent("DeviceError", top.passbookreader.onDeviceError);
	top.passbookreader.PassbookReaderEvents.appendEvent("FatalError", top.passbookreader.onDeviceError);
    top.YHAXPassbookReader.Reset("EJECT", 1);
  }

  /*��λ��ɻص�����*/
  this.onResetComplete = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ˢ������λ�ɹ� PassbookReader Event onResetComplete");    
    top.passbookreader.PassbookReaderEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete) == "function")
      top.MainFrame.onResetComplete();
  }
}
