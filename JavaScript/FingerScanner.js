/*
  ָ������
 */
function FingerScanner()
{ 
  var isFingerOpen = false;//ָ�����Ƿ��
  // ָ������ģ���¼���Ӧ����
  this.FingerEvents = new top.EventHandling(top.YHAXFingerScanner);
  
  /*�ȴ��û�ָ�Ʒ��벢��ȡ����*/
  this.readFinger = function()
  {
	isFingerOpen = true;
    top.fingerScanner.FingerEvents.clearAll();
    top.fingerScanner.FingerEvents.appendEvent("FingerInserted", top.fingerScanner.onFingerInserted);
    top.fingerScanner.FingerEvents.appendEvent("ReadFingerCompleted", top.fingerScanner.onReadFingerCompleted);
    top.fingerScanner.FingerEvents.appendEvent("InvalidFinger", top.fingerScanner.onInvalidFinger);
    top.fingerScanner.FingerEvents.appendEvent("Timeout", top.fingerScanner.onTimeout);
    top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
    top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
    top.YHAXFingerScanner.ReadFinger("FEATURE",top.COLS_FINGERSCANNER_FILEPATH, 120*1000);
    top.journalPrinter.addJournalWithTime("��ȡָ������ Finger command readFinger ");
	// ����ָʾ��
    try{top.guidelights.setFingerLight("MEDIUM");}catch(e){}
  }

  /*�ȴ���Աָ�Ʒ��벢��ȡ����*/
  this.readTellerFinger = function()
  {
	isFingerOpen = true;
    top.fingerScanner.FingerEvents.clearAll();
    top.fingerScanner.FingerEvents.appendEvent("FingerInserted", top.fingerScanner.onFingerInserted);
    top.fingerScanner.FingerEvents.appendEvent("ReadFingerCompleted", top.fingerScanner.onReadTellerFingerCompleted);
    top.fingerScanner.FingerEvents.appendEvent("InvalidFinger", top.fingerScanner.onInvalidFinger);
    top.fingerScanner.FingerEvents.appendEvent("Timeout", top.fingerScanner.onTimeout);
    top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
    top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
    top.YHAXFingerScanner.ReadFinger("FEATURE",top.COLS_FINGERSCANNER_FILEPATH, 120*1000);
    top.journalPrinter.addJournalWithTime("��ȡ��Աָ������(ȡ��) Finger command readTellerFinger ");
	// ����ָʾ��
    try{top.guidelights.setFingerLight("MEDIUM");}catch(e){}
  }
   /*�ȴ���Աָ�Ʒ��벢��ȡ����*/
  this.readTellerOutFinger = function()
  {
	isFingerOpen = true;
    top.fingerScanner.FingerEvents.clearAll();
    top.fingerScanner.FingerEvents.appendEvent("FingerInserted", top.fingerScanner.onFingerInserted);
    top.fingerScanner.FingerEvents.appendEvent("ReadFingerCompleted", top.fingerScanner.onReadTellerOutFingerCompleted);
    top.fingerScanner.FingerEvents.appendEvent("InvalidFinger", top.fingerScanner.onInvalidFinger);
    top.fingerScanner.FingerEvents.appendEvent("Timeout", top.fingerScanner.onTimeout);
    top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
    top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
    top.YHAXFingerScanner.ReadFinger("FEATURE",top.COLS_FINGERSCANNER_FILEPATH, 120*1000);
    top.journalPrinter.addJournalWithTime("��ȡ��Աָ������(�ŵ�) Finger command readTellerOutFinger ");
	// ����ָʾ��
    try{top.guidelights.setFingerLight("MEDIUM");}catch(e){}
  }
  /*ָ�Ʒ���ص�����*/
  this.onFingerInserted = function()
  {
    top.journalPrinter.addJournalWithTime("ָ���ѷ��� Finger Event FingerInserted ");  
	// ����ָʾ��
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onFingerInserted) == "function"){
      top.MainFrame.onFingerInserted();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onFingerInserted) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onFingerInserted();
	}
  }
  
  /*��ȡָ����Ϣ��ɻص�����*/
  this.onReadFingerCompleted = function()
  {
	isFingerOpen = false;
	// ��¼�ն���ˮ
     top.journalPrinter.addJournalWithTime("ָ�������� Finger Event ReadFingerCompleted ");  
	top.fingerScanner.FingerEvents.clearAll();
	if (typeof(top.MainFrame.window.frames["ifreamSign"].onReadFingerCompleted) == "function" && top.pool.get("IsSignFinger") != null && top.pool.get("IsSignFinger") != "" && top.pool.get("IsSignFinger") == "1")
	{
		top.pool.set("IsSignFinger","");
		top.MainFrame.window.frames["ifreamSign"].onReadFingerCompleted(top.YHAXFingerScanner.FeatureData);
	}
	else  if (typeof(top.MainFrame.onReadFingerCompleted) == "function"){   
      top.MainFrame.onReadFingerCompleted(top.YHAXFingerScanner.FeatureData);
    }
  }

   /*��ȡ��Աָ����Ϣ��ɻص�����*/
  this.onReadTellerFingerCompleted = function()
  {
	isFingerOpen = false;
	// ��¼�ն���ˮ
   top.journalPrinter.addJournalWithTime("ָ��������(ȡ��) Finger Event ReadTellerFingerCompleted "); 
	top.fingerScanner.FingerEvents.clearAll();
	//��Աָ����Ȩ��浥
	if (typeof(top.MainFrame.onReadTellerFingerCompleted) == "function"){
		top.MainFrame.onReadTellerFingerCompleted(top.YHAXFingerScanner.FeatureData);		
	}
  }
     /*��ȡ��Աָ����Ϣ��ɻص�����*/
  this.onReadTellerOutFingerCompleted = function()
  {
	isFingerOpen = false;
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ָ��������(�ŵ�) Finger Event ReadTellerOutFingerCompleted ");
	top.fingerScanner.FingerEvents.clearAll();
	//��Աָ����Ȩ��浥
	if (typeof(top.MainFrame.onReadTellerOutFingerCompleted) == "function"){
		top.MainFrame.onReadTellerOutFingerCompleted(top.YHAXFingerScanner.FeatureData);		
	}
  }
  
  /*��Чָ�ƻص�����*/
  this.onInvalidFinger = function()
  {
	isFingerOpen = false;
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��Чָ�� Finger Event InvalidFinger ");
    top.fingerScanner.FingerEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onInvalidFinger) == "function")
      top.MainFrame.onInvalidFinger();
    else if (typeof(top.MainFrame.window.frames["ifreamSign"].onInvalidFinger) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onInvalidFinger();
	}
  }

  /*��ָ�Ƴ�ʱ*/
  this.onTimeout = function()
  {
	isFingerOpen = false;
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��ָ�Ƴ�ʱ Finger Event Timeout ");
  	top.fingerScanner.FingerEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout_Finger) == "function")
      top.MainFrame.onTimeout_Finger();
    else if (typeof(top.MainFrame.window.frames["ifreamSign"].onTimeout_Finger) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onTimeout_Finger();
	}
  }

  /*Ӳ�����ϻص�����*/
  this.onDeviceError = function()
  {
	isFingerOpen = false;
    // ��¼�ն���ˮ
     top.journalPrinter.addJournalWithTime("ָ���Ƕ��������� Finger Event DeviceError ");
    top.fingerScanner.FingerEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onDeviceError_Finger) == "function")
      top.MainFrame.onDeviceError_Finger();
    else if (typeof(top.onDeviceError_Finger) == "function")
      top.onDeviceError_Finger();
    else if (typeof(top.MainFrame.window.frames["ifreamSign"].onDeviceError_Finger) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onDeviceError_Finger();
	}
  }

  /*ȡ�������ָ��*/
  this.cancelRead = function()
  {
	if(isFingerOpen){//���ָ���Ǵ򿪲ŵ��ô˷���
	    top.journalPrinter.addJournalWithTime("ȡ�������ָ�� Finger Event cancelRead ");
	    isFingerOpen = false;
		top.fingerScanner.FingerEvents.appendEvent("ReadCancelled", top.fingerScanner.onReadCancelled);
	    top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
	    top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
        top.YHAXFingerScanner.CancelRead();
	}
  }

  /*ȡ���������ָ�ƻص�����*/
  this.onReadCancelled = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ȡ����ȡָ�� Finger Event ReadCancelled "); 
    top.fingerScanner.FingerEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setFingerLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onReadCancelled) == "function")
      top.MainFrame.onReadCancelled();
    else if (typeof(top.MainFrame.window.frames["ifreamSign"].onReadCancelled) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onReadCancelled();
	}
  } 

  /*ģ�鸴λ*/
  this.reset = function()
  {
    top.fingerScanner.FingerEvents.clearAll();
    top.fingerScanner.FingerEvents.appendEvent("ResetComplete", top.fingerScanner.onResetComplete);
	top.fingerScanner.FingerEvents.appendEvent("DeviceError", top.fingerScanner.onDeviceError);
	top.fingerScanner.FingerEvents.appendEvent("FatalError", top.fingerScanner.onDeviceError);
    top.YHAXFingerScanner.Reset();
    top.journalPrinter.addJournalWithTime("ָ���Ǹ�λ Finger Event reset ");
  }

  /*��λ��ɻص�����*/
  this.onResetComplete = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ָ�Ƹ�λ�ɹ� Finger Event ResetComplete "); 
    top.fingerScanner.FingerEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete) == "function")
      top.MainFrame.onResetComplete();
  }
}
