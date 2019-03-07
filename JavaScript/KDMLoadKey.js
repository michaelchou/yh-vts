/*
  ��Կ�ַ���
 */
function KDMLoadKey()
{ 
  // ��Կ�ַ�����ģ���¼���Ӧ����
  this.kdmEvents = new top.EventHandling(top.YHAXKDMLoadKey);
  
  /*���豸*/
  this.openDevice = function()
  {
	top.journalPrinter.addJournalWithTime("���豸 KDMLoadKey command openDevice");
    top.kdmLoadKey.kdmEvents.clearAll();
    top.kdmLoadKey.kdmEvents.appendEvent("DeviceOpen", top.kdmLoadKey.onDeviceOpen);
    top.kdmLoadKey.kdmEvents.appendEvent("DeviceOpenError", top.kdmLoadKey.onDeviceOpenError);
    top.YHAXKDMLoadKey.OpenDevice();
  }
  
  /*��������*/
  this.readData = function()
  {
	top.journalPrinter.addJournalWithTime("�������� KDMLoadKey command readData");
    top.kdmLoadKey.kdmEvents.clearAll();
    top.kdmLoadKey.kdmEvents.appendEvent("DataRecieved", top.kdmLoadKey.onDataRecieved);
    top.YHAXKDMLoadKey.ReadData();
  }
  
  /*��������*/
  this.dispatchData = function()
  {
	top.journalPrinter.addJournalWithTime("�������� KDMLoadKey command dispatchData");
    top.kdmLoadKey.kdmEvents.clearAll();
    top.kdmLoadKey.kdmEvents.appendEvent("KeyDecrypted", top.kdmLoadKey.onKeyDecrypted);
	top.kdmLoadKey.kdmEvents.appendEvent("KeyDecryptFailed", top.kdmLoadKey.onKeyDecryptFailed);
    top.YHAXKDMLoadKey.dispatchData();
  }
  
  /*��Ӧ����*/
  this.assembleMsg = function()
  {
	top.journalPrinter.addJournalWithTime("��Ӧ���� KDMLoadKey Event assembleMsg");
    top.kdmLoadKey.kdmEvents.clearAll();
    var iRet = top.YHAXKDMLoadKey.assembleMsg(1);
	if(iRet ==0){
       top.kdmLoadKey.onAssembleMsg();
    }else{
       top.kdmLoadKey.onAssembleMsgError();
    }
  }
 
  /*��Կ�ַ����򿨳ɹ��ص�����*/
  this.onDeviceOpen = function()
  {
	
	var strCommPort = top.YHAXKDMLoadKey.StComm;
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��Կ�ַ����򿪴������(���ں�:" + strCommPort + ")" + " KDMLoadKey Event onDeviceOpen");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceOpen) == "function"){   
      top.MainFrame.onDeviceOpen();
    }
  }

  /*��Կ�ַ�����ʧ�ܻص�����*/
  this.onDeviceOpenError = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��Կ�ַ�����ʧ�� KDMLoadKey Event onDeviceOpenError");
    top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceOpenError) == "function")
      top.MainFrame.onDeviceOpenError();
    else if (typeof(top.onDeviceOpenError) == "function")
      top.onDeviceOpenError();
  }

  /*�������ݳɹ��ص�����*/
  this.onDataRecieved = function()
  {
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��Կ�ַ����������ݳɹ� KDMLoadKey Event onDataRecieved");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onDataRecieved) == "function"){   
      top.MainFrame.onDataRecieved();
    }
  }
  
  /*������Կ�ɹ��ص�����*/
  this.onKeyDecrypted = function()
  {
	var strMasterKey = top.YHAXKDMLoadKey.decryptedTMK;
	top.pool.set("strMasterKey", strMasterKey);
	top.journalPrinter.addJournalWithTime("��Կ�ַ���������Կ�ɹ� KDMLoadKey Event onKeyDecrypted");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onKeyDecrypted) == "function"){   
      top.MainFrame.onKeyDecrypted();
    }
  }
  
  /*������Կʧ�ܻص�����*/
  this.onKeyDecryptFailed = function()
  {
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��Կ�ַ���������Կʧ�� KDMLoadKey Event onKeyDecryptFailed");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onKeyDecryptFailed) == "function"){   
      top.MainFrame.onKeyDecryptFailed();
    }
  }
  
  /*��Ӧ����ɹ��ص�����*/
  this.onAssembleMsg = function()
  {
	var strKey = top.YHAXKDMLoadKey.decryptedTMK;
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��Կ�ַ�����Ӧ����ɹ� KDMLoadKey Event onAssembleMsg");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onAssembleMsg) == "function"){   
      top.MainFrame.onAssembleMsg();
    }
  }
  
  /*��Ӧ����ʧ�ܻص�����*/
  this.onAssembleMsgError = function()
  {
	var strKey = top.YHAXKDMLoadKey.decryptedTMK;
	//��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��Կ�ַ�����Ӧ����ʧ�� KDMLoadKey Event onAssembleMsgError");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onAssembleMsgError) == "function"){   
      top.MainFrame.onAssembleMsgError();
    }
  }
  
}
