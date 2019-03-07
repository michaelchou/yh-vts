/*
  ȡ��
  UUID:1685AF26-9FCF-4E3C-8EC0-F57248800B14
 */
function Withdraw()
{
  // ������ģ���¼���Ӧ����
  this.CdmEnr = new top.EventHandling(top.YHAXCashDispenser);
  this.CdmEnrFen = new top.EventHandling(top.YHAXCashDispenserFen);
  // �ͳ���ͻ�ȡ����ʱʱ��
  this.iCashPresentTimeout = 120;
  // ȡ�����
  this.strCurrency_Conf = "CNY";
  this.strCurrency = this.strCurrency_Conf;
  // �䳮�㷨
  this.strMixAlgorithm = "1";
  
  // ȡ����
  this.iAmount = -1;
  // ���ȡ��ģ���Ƿ����ʱ���Ƿ���StTransportStatus״̬
  this.bCheckTransportStatus = false;
 
  // ���ȡ��ģ���Ƿ����ʱ���Ƿ���StSafeDoorStatus״̬
  this.bCheckSafeDoorStatus = false;

  /*
    ���ֽ��ȡ����Ƿ����
    ���أ�
      VM_AVAIL_OK       ��������
      VM_AVAIL_LOCKED   ������
      VM_AVAIL_DEVERR   Ӳ������
   */
   
  /*this.checkAvai = function()
  {
    // Ϊ����������������ĳ�����ڣ����м�鲢����
    //var minval = this.getCuMinNoteValue();
    // ֽ����ģ��״̬�Ƿ�����
    var StDeviceStatus = top.YHAXCashDispenser.StDeviceStatus;
    var StDispenserStatus = top.YHAXCashDispenser.StDispenserStatus;
    var StTransportStatus = top.YHAXCashDispenser.StTransportStatus;
    var StSafeDoorStatus = top.YHAXCashDispenser.StSafeDoorStatus;
    var StInputOutputStatus = top.YHAXCashDispenser.StInputOutputStatus;
	var StShutterStatus     = top.YHAXCashDispenser.StShutterStatus;
    if ( (StDeviceStatus != "HEALTHY")
      || (StDispenserStatus != "HEALTHY" && StDispenserStatus != "DEGRADED")//2018-1-10 ȥ��  StDispenserStatus NODISPENSE UNKNOWN
      || (StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN" && StInputOutputStatus != "NOTSUPPORTED")
      || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "NOTSUPPORTED")
      || StSafeDoorStatus != "CLOSED"
	  || StShutterStatus != "CLOSED")
    {
      return false;
    }else{
	  return true;
	}
  }*/
  //2018-1-12 ״̬�ж�ϸ��
  this.checkAvai = function()
  {
    // Ϊ����������������ĳ�����ڣ����м�鲢����
    //var minval = this.getCuMinNoteValue();
    // ֽ����ģ��״̬�Ƿ�����
    var StDeviceStatus = top.YHAXCashDispenser.StDeviceStatus;
    var StDispenserStatus = top.YHAXCashDispenser.StDispenserStatus;
    var StTransportStatus = top.YHAXCashDispenser.StTransportStatus;
    var StSafeDoorStatus = top.YHAXCashDispenser.StSafeDoorStatus;
    var StInputOutputStatus = top.YHAXCashDispenser.StInputOutputStatus;
	var StShutterStatus     = top.YHAXCashDispenser.StShutterStatus;
    if(StDeviceStatus != "HEALTHY"){
		return "Ӳ������";
	}
	if(StDispenserStatus != "HEALTHY" && StDispenserStatus != "DEGRADED"){
		return "����ģ��״̬����ȷ";
	}
	if((StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN" && StInputOutputStatus != "NOTSUPPORTED")
	  || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "NOTSUPPORTED")){
		return "���ڻ�ͨ��״̬����ȷ";
	}
	if(StSafeDoorStatus != "CLOSED"){
		return "��ȫ��״̬����ȷ";
	}
	if(StShutterStatus != "CLOSED"){
		return "����״̬����ȷ";
	}
    return "true";
	
  }
  
  /*
  Ӳ�ҵ�״̬��飬���SP
  */
 this.checkAvaiFen = function()
  {
	var StDeviceStatus = top.YHAXCashDispenserFen.StDeviceStatus;
    var StDispenserStatus = top.YHAXCashDispenserFen.StDispenserStatus;
    if(StDeviceStatus != "HEALTHY"){
    	return "Ӳ��ģ��Ӳ������";
    }
    if(StDispenserStatus != "HEALTHY" && StDispenserStatus != "DEGRADED" && StDispenserStatus != "NODISPENSE" && StDispenserStatus != "UNKNOWN")
    {
    	return "Ӳ��ģ�����״̬����ȷ";
    }
    return "true";
 }
  /*
    ��ȡȡ��ʱȱʡ�ı���
    ���أ�
      CNY��RMB�ȱ���
   */
  this.getCurrency = function()
  {
    return top.withdraw.strCurrency_Conf;
  }
  
  /*
�� ��ȡ������Ϣ��������������ˮ��¼��
   ���أ�
     ������Ϣ�������ַ���
  */
  this.getCassUnitInfo = function()
  {
    var str = "";
    var logicalunits = top.YHAXCashDispenser.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      str += (logicalunit.NoteValue==0 ? "" : (logicalunit.NoteValue+":") ) + logicalunit.CurrentCount + "|";
    }
    if (str.length == 0)
      str = "Yun Failed!";
    else
      str = "Cass:" + str;
    
    var logicalunitsfens = top.YHAXCashDispenserFen.LogicalUnits;
    for (var i=0; i<logicalunitsfens.length; i++)
    {
      var logicalunitfen = logicalunitsfens.Item(i);
      str += (logicalunitfen.NoteValue==0 ? "" : (logicalunitfen.NoteValue+":") ) + logicalunitfen.CurrentCount + "|";
    }
    if (str.length == 0)
      str += "Fen Failed!";
    return str;
  }
  
     /*
    ֽ���䳮
    ������
       strAmount    ȡ�����ԪΪ��λ
       currency  ����
    MainFrame�ṩ�ص�������
	  onMixComplete
      onMixFailed();
   */
  this.Mix = function(strAmount, currency)
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
	// �����������
    //this.iAmount = new top.DataConversion().str2Int(strAmount, -1);
	top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("MixComplete", top.withdraw.onMixComplete);
    top.withdraw.CdmEnr.appendEvent("NotDispensable", top.withdraw.onNotDispensable_Mix);
	top.withdraw.CdmEnr.appendEvent("FatalError", top.withdraw.onFatalError_Mix);
    top.YHAXCashDispenser.Mix(strAmount, currency, top.withdraw.strMixAlgorithm);
	top.journalPrinter.addCashJournalWithTime("ֽ���䳮 Withdraw command Mix(" + strAmount + ")",false);
  }
  
    // ֽ���䳮�ɹ�
  this.onMixComplete = function()
  {
	top.journalPrinter.addCashJournalWithTime("ֽ���䳮�ɹ� Withdraw Event onMixComplete",false);
    top.withdraw.CdmEnr.clearAll();
	if (typeof(top.MainFrame.onMixComplete) == "function")
      top.MainFrame.onMixComplete();			
  } 
  
    // ֽ���䳮ʧ��
  this.onNotDispensable_Mix = function()
  {
	top.journalPrinter.addCashJournalWithTime("ֽ���䳮ʧ�� Withdraw Event onNotDispensable_Mix",true);
    top.withdraw.CdmEnr.clearAll();
    if (typeof(top.MainFrame.onMixFailed) == "function")
      top.MainFrame.onMixFailed();
  }
      // ֽ���䳮Ӳ������
  this.onFatalError_Mix = function()
  {
	top.journalPrinter.addCashJournalWithTime("ֽ���䳮Ӳ������ Withdraw Event onFatalError_Mix",true);
    top.withdraw.CdmEnr.clearAll();
    if (typeof(top.MainFrame.onFatalError_Mix) == "function")
      top.MainFrame.onFatalError_Mix();
  }
  
     /*
    Ӳ���䳮 
    ������
       strAmount    ȡ�����ԪΪ��λ
       currency  ����
    MainFrame�ṩ�ص�������
	  onMixComplete
      onMixFailed();
   */ 
  this.MixFen = function(strAmount, currency)
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
	top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.CdmEnrFen.appendEvent("MixComplete", top.withdraw.onMixFenComplete);
    top.withdraw.CdmEnrFen.appendEvent("NotDispensable", top.withdraw.onNotDispensable_MixFen);
	top.withdraw.CdmEnrFen.appendEvent("FatalError", top.withdraw.onFatalError_MixFen);
    top.YHAXCashDispenserFen.Mix(strAmount, currency, top.withdraw.strMixAlgorithm);	
	top.journalPrinter.addCashJournalWithTime("Ӳ���䳮 Withdraw command Mix(" + strAmount + ")",false);	
  }
   // Ӳ���䳮�ɹ�
  this.onMixFenComplete = function()
  {
	top.journalPrinter.addCashJournalWithTime("Ӳ���䳮�ɹ� Withdraw Event onMixComplete",false);
    top.withdraw.CdmEnrFen.clearAll();
	if (typeof(top.MainFrame.onMixFenComplete) == "function")
      top.MainFrame.onMixFenComplete();	
  }
  // Ӳ���䳮ʧ��
  this.onNotDispensable_MixFen = function()
  {
	top.journalPrinter.addCashJournalWithTime("Ӳ���䳮ʧ�� Withdraw Event onNotDispensable_MixFen",true);
    top.withdraw.CdmEnrFen.clearAll();
    if (typeof(top.MainFrame.onMixFailedFen) == "function")
      top.MainFrame.onMixFailedFen();
  }
  // Ӳ���䳮Ӳ������
  this.onFatalError_MixFen = function()
  {
	top.journalPrinter.addCashJournalWithTime("Ӳ���䳮Ӳ������ Withdraw Event onFatalError_MixFen",true);
    top.withdraw.CdmEnrFen.clearAll();
    if (typeof(top.MainFrame.onFatalError_MixFen) == "function")
      top.MainFrame.onFatalError_MixFen();
  } 
  /*
          ָ���������
	�ĸ��¼�NotDispensable ��CashDispensed ��CashUnitError ��DeviceError
  MainFrame�ṩ�ص�������
	  onCashDispensed
    onMixDispFailed();
   */
  this.Dispense = function(strAmount,strcount)
  {
	var strNewArray = new Array(0,0,0,0,strcount);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
	try{top.cashguidelights.setCashDispenLight("MEDIUM");}catch(e){} //�����ڵ�&�ܳ��ڵ�
	top.withdraw.CdmEnr.clearAll();
	top.withdraw.CdmEnr.appendEvent("CashDispensed", top.withdraw.onCashDispensed);
	top.withdraw.CdmEnr.appendEvent("NotDispensable", top.withdraw.onNotDispensable_MixDisp);
	top.withdraw.CdmEnr.appendEvent("CashUnitError", top.withdraw.CashUnitError_MixDisp);
	top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onDeviceError_MixDisp);
	top.YHAXCashDispenser.Dispense(strAmount,strNewArray,top.withdraw.strCurrency, "0");
	top.journalPrinter.addCashJournalWithTime("ֽ�ҳ��� Withdraw Dispense(" + strAmount + ")",false); 
  }
    /*
    ֽ�ҳ���
	�ĸ��¼�NotDispensable ��CashDispensed ��CashUnitError ��DeviceError
    MainFrame�ṩ�ص�������
	  onCashDispensed
      onMixDispFailed();
  */
  this.MixAndDispense = function(strAmount)
  {	
    top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
	try{top.cashguidelights.setCashDispenLight("MEDIUM");}catch(e){} //�����ڵ�&�ܳ��ڵ�
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("CashDispensed", top.withdraw.onCashDispensed);
    top.withdraw.CdmEnr.appendEvent("NotDispensable", top.withdraw.onNotDispensable_MixDisp);
    top.withdraw.CdmEnr.appendEvent("CashUnitError", top.withdraw.CashUnitError_MixDisp);
    top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onDeviceError_MixDisp);
    top.YHAXCashDispenser.MixAndDispense(strAmount, top.withdraw.strCurrency, top.withdraw.strMixAlgorithm);
	top.journalPrinter.addCashJournalWithTime("ֽ�ҳ��� Withdraw command MixAndDispense(" + strAmount + ")",false);
  }
  
      // ֽ�ҳ����ɹ�
  this.onCashDispensed = function()
  {
	top.journalPrinter.addCashJournalWithTime("ֽ�ҳ����ɹ� Withdraw Event onCashDispensed",false);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
	top.withdraw.CdmEnr.clearAll();
	if (typeof(top.MainFrame.onCashDispensed) == "function")
	  top.MainFrame.onCashDispensed();	 

  }
   // ֽ�ҳ���ʧ��Ԥ������¼�,�������󶼵�����ͬ�ķ���ҳ��Ĵ�����
  this.onNotDispensable_MixDisp = function()
  {
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.onMixDispFailed();
  }
  
    this.CashUnitError_MixDisp = function()
  {
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.onMixDispFailed();
  }
  
  this.onDeviceError_MixDisp = function()
  {
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.onMixDispFailed();
  } 

  this.onMixDispFailed = function()
  {
	try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //�����ڵ�&�ܳ��ڵ�
	top.journalPrinter.addCashJournalWithTime("ֽ�ҳ���ʧ�� Withdraw Event onMixDispFailed",true);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
	top.withdraw.CdmEnr.clearAll();
    if (typeof(top.MainFrame.onMixDispFailed) == "function")
      top.MainFrame.onMixDispFailed();
  } 

    /*
    Ӳ�ҳ���
	�ĸ��¼�NotDispensable ��CashDispensed ��CashUnitError ��DeviceError
    MainFrame�ṩ�ص�������
	  onCashDispensedFen
      onMixDispFailedFen
  */
  this.MixAndDispenseFen = function(strAmount)
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
	try{top.cashguidelights.setCoinDispenserLight("MEDIUM");}catch(e){} //Ӳ�ҳ��ڵ�
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.CdmEnrFen.appendEvent("CashDispensed", top.withdraw.onCashDispensedFen);
    top.withdraw.CdmEnrFen.appendEvent("NotDispensable", top.withdraw.onNotDispensable_MixDispFen);
    top.withdraw.CdmEnrFen.appendEvent("CashUnitError", top.withdraw.CashUnitError_MixDispFen);
    top.withdraw.CdmEnrFen.appendEvent("DeviceError", top.withdraw.onDeviceError_MixDispFen);
    top.YHAXCashDispenserFen.MixAndDispense(strAmount, top.withdraw.strCurrency, top.withdraw.strMixAlgorithm);	
	top.journalPrinter.addCashJournalWithTime("Ӳ�ҳ��� Withdraw command MixAndDispense(" + strAmount + ")",false);
	
  }
  this.onCashDispensedFen = function()
  {
	top.journalPrinter.addCashJournalWithTime("Ӳ�ҳ����ɹ� Withdraw Event onCashDispensedFen",false);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
    top.withdraw.CdmEnrFen.clearAll();
	if (typeof(top.MainFrame.onCashDispensedFen) == "function")
		top.MainFrame.onCashDispensedFen();	
  }  
  
  // Ӳ�ҳ���ʧ��Ԥ������¼�,��Ҷ��ǵ�onMixDispFailedFen����
  this.onNotDispensable_MixDispFen = function()
  {
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.onMixDispFailedFen();
  } 
  this.CashUnitError_MixDispFen = function()
  {
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.onMixDispFailedFen();
  }
  
  this.onDeviceError_MixDispFen = function()
  {
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.onMixDispFailedFen();
  } 
  
  this.onMixDispFailedFen = function()
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
    if (typeof(top.MainFrame.onMixDispFailedFen) == "function")
      top.MainFrame.onMixDispFailedFen();
  }  
  /*
    ֽ���ͳ�����
   */
  this.Present = function()
  {
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("CashPresented", top.withdraw.onCashPresented);
    top.withdraw.CdmEnr.appendEvent("CashTaken", top.withdraw.onCashTaken);
    top.withdraw.CdmEnr.appendEvent("Timeout", top.withdraw.onTimeout_Present);
    top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onDeviceError_Present);
    top.YHAXCashDispenser.Present(top.withdraw.iCashPresentTimeout*1000);
	top.journalPrinter.addCashJournalWithTime("ֽ���ͳ� Withdraw command Present",false);
    // ȡ���ͳ���ʱ����
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.withdraw.onDeviceError_Present();}, 120*1000);
  }
  
  // �ͳ��ɹ�
  this.onCashPresented = function()
  {
	top.journalPrinter.addCashJournalWithTime("ֽ���ͳ��ɹ� Withdraw Event Present",false);
    if (typeof(top.MainFrame.onCashPresented) == "function")
      top.MainFrame.onCashPresented();
  }
 
  // ��Ʊȡ��
  this.onCashTaken = function()
  {
    try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //�����ڵ�&�ܳ��ڵ�	
	top.journalPrinter.addCashJournalWithTime("ֽ�ҳ�Ʊȡ�� Withdraw Event onCashTaken",false);
	top.serviceCtrl.stopFlowCtrlTimeout();
	top.withdraw.CdmEnr.clearAll();
	top.withdraw.closeShutter();

  }
  
  // �ͳ����û���ʱδȡ�߳�Ʊ���¼�
  this.onTimeout_Present = function()
  {
	top.journalPrinter.addCashJournalWithTime("ֽ�ҳ�Ʊ��ʱδȡ Withdraw Event onTimeout_Present",true);
	top.withdraw.CdmEnr.clearAll();
	try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //�����ڵ�&�ܳ��ڵ�
	if (typeof(top.MainFrame.onTimeout_Present) == "function")
      top.MainFrame.onTimeout_Present();
  }

  this.onDeviceError_Present = function()
  {
	top.withdraw.CdmEnr.clearAll();
	try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //�����ڵ�&�ܳ��ڵ�
    // ȡ��ȡ���ͳ���ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();
	top.journalPrinter.addCashJournalWithTime("ֽ�ҳ�Ʊ�ͳ�ʧ�� Withdraw Event onDeviceError_Present",true);
	top.withdraw.CdmEnr.clearAll();
	if (typeof(top.MainFrame.onDeviceError_Present) == "function")
      top.MainFrame.onDeviceError_Present();
  }
  
  /*
   * ShutterClosed or DeviceError
   */
  this.closeShutter = function()
  {	  
	top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("ShutterClosed", top.withdraw.ShutterClosed);
    top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onDeviceError_closeShutter);
    top.YHAXCashDispenser.CloseShutter();	
    top.journalPrinter.addCashJournalWithTime("�رճ���  Withdraw command CloseShutter",false);
  }
  /*
   * ���Żص�
   * */
  this.ShutterClosed = function()
  {
	  top.withdraw.CdmEnr.clearAll();
	  top.journalPrinter.addCashJournalWithTime("�����ѹر� ShutterClosed",false);
	  if (typeof(top.MainFrame.onCashTaken) == "function")
	     top.MainFrame.onCashTaken();
  }
  /*
   * ����Ӳ������
   * */ 
  this.onDeviceError_closeShutter = function()
  {
	  top.withdraw.CdmEnr.clearAll();
	  top.journalPrinter.addCashJournalWithTime("���ڹ��Ź��� DeviceError",false); 
	  try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //�����ڵ�&�ܳ��ڵ�
	  // ȡ��ȡ���ͳ���ʱ����
	  top.serviceCtrl.stopFlowCtrlTimeout();
	  if (typeof(top.MainFrame.onDeviceError_closeShutter) == "function")
	     top.MainFrame.onDeviceError_closeShutter();
  }
 /*
    ֽ��Reset
	Mix�Լ�MIxǰ���ã�֮�󲻵��ã�Ǯ��Reset�Ƶ�����
   */
 this.reset4Mix = function()
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
    top.withdraw.CdmEnr.clearAll();
    top.withdraw.CdmEnr.appendEvent("ResetComplete", top.withdraw.onResetEnd4MixDispFailed);
    top.withdraw.CdmEnr.appendEvent("DeviceError", top.withdraw.onResetEnd4MixDispFailed);
    top.YHAXCashDispenser.Reset("RETRACT", 0);
	top.journalPrinter.addCashJournalWithTime("ֽ��Reset Withdraw command reset4Mix",true);
  }

  /*
    ��λ����ʧ�ܵ��¼��ص��Ĵ�����
   */
  this.onResetEnd4MixDispFailed = function()
  {
	top.journalPrinter.addCashJournalWithTime("ֽ�Ҹ�λʧ�� Withdraw Event onResetEnd4MixDispFailed",true);
    top.withdraw.CdmEnr.clearAll();	
	if (typeof(top.MainFrame.onResetEndFailed) == "function")
	{
		top.MainFrame.onResetEndFailed();
	}
  } 
  
  
    /*
    ��λ�����ɹ����¼��ص��Ĵ�����
   */
  this.onResetEnd4MixDispSucc = function()
  {
	top.journalPrinter.addCashJournalWithTime("ֽ�Ҹ�λ�ɹ� Withdraw Event onResetEnd4MixDispSucc",true);
    top.withdraw.CdmEnr.clearAll();	
	if (typeof(top.MainFrame.onResetEndSucc) == "function")
	{
		top.MainFrame.onResetEndSucc();
	}
  }
     /*
    Ӳ���ͳ�����
   */
  this.PresentFen = function()
  {
    top.withdraw.CdmEnrFen.clearAll();
    top.withdraw.CdmEnrFen.appendEvent("CashPresented", top.withdraw.onCashPresentedFen);
    top.withdraw.CdmEnrFen.appendEvent("CashTaken", top.withdraw.onCashTakenFen);
    top.withdraw.CdmEnrFen.appendEvent("Timeout", top.withdraw.onTimeout_PresentFen);
    top.withdraw.CdmEnrFen.appendEvent("DeviceError", top.withdraw.onDeviceError_PresentFen);
    top.YHAXCashDispenserFen.Present(top.withdraw.iCashPresentTimeout*1000);
	top.journalPrinter.addCashJournalWithTime("Ӳ���ͳ� Withdraw command PresentFen",false);
	try{top.cashguidelights.setCoinAcceptorLight("MEDIUM");}catch(e){} //Ӳ�ҳ��ڵ�
	// ȡ���ͳ���ʱ����
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.withdraw.onDeviceError_PresentFen();}, 120*1000);
  }
  
  this.onCashPresentedFen = function()
  {
	try{top.cashguidelights.setCoinDispenserLight("OFF");}catch(e){} //Ӳ�ҳ��ڵ�
	try{top.cashguidelights.setCoinAcceptorLight("OFF");}catch(e){} //Ӳ���ڲ�������
	top.withdraw.CdmEnrFen.clearAll();	
	top.serviceCtrl.stopFlowCtrlTimeout();
	if (typeof(top.MainFrame.onCashPresentedFen) == "function")
	{
		top.MainFrame.onCashPresentedFen();
	}  
  }
  
  // �ͳ����û���ʱδȡ�߳�Ʊ���¼�
  this.onTimeout_PresentFen = function()
  {
	  top.serviceCtrl.stopFlowCtrlTimeout();
	  try{top.cashguidelights.setCoinDispenserLight("OFF");}catch(e){} //Ӳ�ҳ��ڵ�
	  try{top.cashguidelights.setCoinAcceptorLight("OFF");}catch(e){} //Ӳ���ڲ�������
  }
  
  // �ͳ����û���ʱδȡ�߳�Ʊ���¼�
  this.onCashTakenFen = function()
  {
	  top.serviceCtrl.stopFlowCtrlTimeout();
	  try{top.cashguidelights.setCoinDispenserLight("OFF");}catch(e){} //Ӳ�ҳ��ڵ�
	  try{top.cashguidelights.setCoinAcceptorLight("OFF");}catch(e){} //Ӳ���ڲ�������
  }
  
  this.onDeviceError_PresentFen = function()
  {
    // ȡ��ȡ���ͳ���ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();
	try{top.cashguidelights.setCoinDispenserLight("OFF");}catch(e){} //Ӳ�ҳ��ڵ�
	try{top.cashguidelights.setCoinAcceptorLight("OFF");}catch(e){} //Ӳ���ڲ�������    
  }  
  
  //����ȡ�����ж�ֽ�ҡ�Ӳ��ģ��״̬
  this.checkDeviceStatus = function(strAmount)
  {
	var strAvaiStatus = top.withdraw.checkAvai();	
	var strAvaiFenStatus = top.withdraw.checkAvaiFen();
	var strCheckAmount = strAmount.toString();
	//����ж��Է�Ϊ��λ
	if(strCheckAmount.length > 3){
		if(strCheckAmount.substr(strCheckAmount.length-3,strCheckAmount.length) == "000"){
			if(strAvaiStatus != "true"){
				//ֻ��ֽ�ң��ж�ֽ��ģ��״̬
				return strAvaiStatus;
			}else{
				return "true";
			}	    	
		}else{
			//��ֽ�Һ�Ӳ�ң�2��ģ����ж�
			if(strAvaiStatus != "true" || strAvaiFenStatus != "true"){
				if(strAvaiFenStatus != "true"){
					return strAvaiFenStatus;
				}
				if(strAvaiStatus != "true"){
					return strAvaiStatus;
				}
			}else{
				return "true";
			}			
		}			
	}else{
		//ֻ��Ӳ��
		if(strAvaiFenStatus != "true"){
			return strAvaiFenStatus;
		}else{
			return "true";
		} 
	}   
  }

}
 