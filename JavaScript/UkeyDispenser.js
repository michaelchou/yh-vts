/*
  ��Ukey������
 */
function UkeyDispenser()
{	
  // U�ܻ���ģ���¼���Ӧ����
  this.UkeyDispenserEvents = new top.EventHandling(top.YHAXUkeyDispenser);
  //------------------------- ��U������˽������ -------------------------//
  /* �˳�U�ܺ�ȴ��û�ȡ��ʱ�� ��λ���룩*/
  this.EjectTimeout = 120;
  //------------------------- ��U��ִ�еķ��� -------------------------//      
	
  /*����U��*/
  this.dispenseukey = function(strPresentPosition,id)
  {
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyDispensed", top.ukeydispenser.onUkeyDispensed);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyUnitThresholdCrossed", top.ukeydispenser.onUkeyUnitThresholdCrossed);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("Timeout", top.ukeydispenser.onTimeout);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("FatalError", top.ukeydispenser.onDeviceError);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyUnitError", top.ukeydispenser.onDeviceError);
    top.journalPrinter.addJournalWithTime("����Ukey UkeyDispenser command DispenseUkey" + top.journalPrinter.strNewLine);
    top.YHAXUkeyDispenser.DispenseUkey(strPresentPosition,id,this.EjectTimeout*1000);
	// ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("MEDIUM");}catch(e){}
  }
  
  /*������U��*/
  this.cancelDispense = function()
  {
	 top.journalPrinter.addJournalWithTime("������Ukey UkeyDispenser command CancelDispense" + top.journalPrinter.strNewLine);
     top.YHAXUkeyDispenser.CancelDispense();
	 // ����ָʾ��
     try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
  }
    /*��Ukey*/
  this.eject = function()
  {
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyEjected", top.ukeydispenser.onUkeyEjected);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("Timeout", top.ukeydispenser.onTimeout_Eject);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyTaken", top.ukeydispenser.onUkeyTaken);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyRetained", top.ukeydispenser.onUkeyCaptured);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("FatalError", top.ukeydispenser.onDeviceError);
	top.journalPrinter.addJournalWithTime("��Ukey UkeyDispenser command EjectUkey" + top.journalPrinter.strNewLine);
    top.YHAXUkeyDispenser.EjectUkey(this.EjectTimeout*1000);
  }
  /*U�ܻ���λ*/
  this.reset = function ()
  {
	top.ukeydispenser.UkeyDispenserEvents.clearAll();
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("ResetComplete", top.ukeydispenser.onResetComplete);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("FatalError", top.ukeydispenser.onDeviceError);
	top.journalPrinter.addJournalWithTime("Ukeyģ�鸴λ UkeyDispenser command Reset" + top.journalPrinter.strNewLine);
    top.YHAXUkeyDispenser.Reset("RETAIN");
  }
  /*��Ukey*/
  this.capture = function()
  {
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyTaken", top.ukeydispenser.onUkeyTaken);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("UkeyRetained", top.ukeydispenser.onUkeyCaptured);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
	top.ukeydispenser.UkeyDispenserEvents.appendEvent("FatalError", top.ukeydispenser.onDeviceError);
	//�н���ʱ������KEY���ⱨ��
	if(isUkeyPresent()==true){
		sendCaptureStatus();
	}
	top.journalPrinter.addJournalWithTime("��Ukey UkeyDispenser command RetainUkey" + top.journalPrinter.strNewLine);
    top.YHAXUkeyDispenser.RetainUkey(2);
  }
   /*U���Ѿ����˳����¼���Ӧ*/
  this.onUkeyEjected = function()
  {
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("Ukey�˳� UkeyDispenser Event onUkeyEjected" + top.journalPrinter.strNewLine);
    // ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("QUICK");}catch(e){}
    // ������ʾ��
    try{top.soundPlayer.TakeCardMusic();}catch(e){}
    if (typeof(top.MainFrame.onUkeyEjected) == "function")
      top.MainFrame.onUkeyEjected();
    else if (typeof(top.onUkeyEjected) == "function")
      top.onUkeyEjected();
  }
  /*��U�ܳ�ʱδ���ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onTimeout_Eject = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("Ukey�˳���ʱ UkeyDispenser Event onTimeout_Eject" + top.journalPrinter.strNewLine);
    if (typeof(top.MainFrame.onTimeout_Eject) == "function")
      top.MainFrame.onTimeout_Eject();
    else if (typeof(top.onTimeout_Eject) == "function")
      top.onTimeout_Eject();
  }

     /*Ukey�Ѿ���������¼���Ӧ*/
  this.onUkeyCaptured = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("Ukey���� UkeyDispenser Event onUkeyCaptured" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onUkeyCaptured) == "function")
      top.MainFrame.onUkeyCaptured();
    else if (typeof(top.onUkeyCaptured) == "function")
      top.onUkeyCaptured();
  }
  /*U�ܻ���Ϣ�ı��¼���Ӧ*/
  this.onUkeyUnitThresholdCrossed = function()
  {
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onUkeyUnitThresholdCrossed) == "function"){
      top.MainFrame.onUkeyUnitThresholdCrossed();
	}
  }

  /*��U�ܳ�ʱ���¼���Ӧ*/
  this.onTimeout = function()
  {
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��Ukey��ʱ UkeyDispenser Event onTimeout" + top.journalPrinter.strNewLine);
	top.ukeydispenser.UkeyDispenserEvents.clearAll();
    // ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout_UkeyDispensed) == "function")
      top.MainFrame.onTimeout_UkeyDispensed();
	else if (typeof(top.onTimeout_UkeyDispensed) == "function")
      top.onTimeout_UkeyDispensed();
  }

  /*��U�ܻ���ukey�ɹ����¼���Ӧ*/
  this.onUkeyDispensed = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("Ukey�Ѿ����� UkeyDispenser Event onUkeyDispensed" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onUkeyDispensed) == "function")
      top.MainFrame.onUkeyDispensed();
	else if (typeof(top.onUkeyDispensed) == "function")
      top.onUkeyDispensed();
  }
  
  /*��U�ܻ�ukey�Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onUkeyTaken = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("UKEY��ȡ�� UkeyDispenser Event onUkeyTaken" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    // ����ָʾ��
    try{top.guidelights.setCoinDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onUkeyTaken) == "function")
      top.MainFrame.onUkeyTaken();
    else if (typeof(top.onUkeyTaken) == "function")
      top.onUkeyTaken();
  }
  
  /*��U�ܻ�Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError = function()
  {
	top.journalPrinter.addJournalWithTime("��U�ܻ����� UkeyDispenser Event onDeviceError" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_UkeyDispenser) == "function")
    {
      top.MainFrame.onDeviceError_UkeyDispenser();
    }else if (typeof(top.onDeviceError_UkeyDispenser) == "function")
    {
      top.onDeviceError_UkeyDispenser();
    }else{}
  };

  /*U�ܻ���λ�ɹ����¼���Ӧ*/
  this.onResetComplete = function()
  {
	top.journalPrinter.addJournalWithTime("U�ܻ���λ�ɹ� UkeyDispenser Event onResetComplete" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_UkeyDispenser) == "function")
    {
      top.MainFrame.onResetComplete_UkeyDispenser();
    }else if (typeof(top.onResetComplete_UkeyDispenser) == "function")
    {
      top.onResetComplete_UkeyDispenser();
    }else{}
  };

  //------------------------- ������������ -------------------------//

  /*�ж�U�ܻ����Ƿ����ukey*/
  this.isUkeyPresent = function()
  {
    return (top.YHAXUkeyDispenser.StMediaStatus == "PRESENT");
  } 
     /*
���� ��ȡUkey����Ϣ
   */
  this.getUkeyUnitInfo = function()
  {
	//��ȡU�ܻ���Ϣ��ʱ����ȡ��״̬����ֹȡ��SP������Ϣ
	top.YHAXUkeyDispenser.StDeviceStatus;
	top.YHAXUkeyDispenser.StMediaStatus;
	top.YHAXUkeyDispenser.StDispenserStatus;
    var str = "";
	var strRecordArr = new Array();
    var logicalunits = top.YHAXUkeyDispenser.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      str += logicalunit.Number + "," + logicalunit.Type + "," + logicalunit.Status + "," + logicalunit.CurrentCount + "," + logicalunit.InitialCount + "|";
      strRecordArr[strRecordArr.length] =new Array(
                logicalunit.Number,
                logicalunit.Type,
	            logicalunit.Status,
	            logicalunit.CurrentCount,
                logicalunit.InitialCount);
	}
	var strJrn = new top.StringCtrl("U�ܻ���Ϣ: "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	strJrn = strJrn + str + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
    return strRecordArr;
  }
  this.getUkeyInfo= function(){
    //��ȡU�ܻ���Ϣ��ʱ����ȡ��״̬����ֹȡ��SP������Ϣ
      top.YHAXUkeyDispenser.StDeviceStatus;
      top.YHAXUkeyDispenser.StMediaStatus;
      top.YHAXUkeyDispenser.StDispenserStatus;
        var str = "";
      var strRecordArr = new Array();
        var logicalunits = top.YHAXUkeyDispenser.LogicalUnits;
        for (var i=0; i<logicalunits.length; i++)
        {
          var logicalunit = logicalunits.Item(i);
          str += logicalunit.Number + "," + logicalunit.Type + "," + logicalunit.Status + "," + logicalunit.CurrentCount + "," + logicalunit.InitialCount + "|";
          strRecordArr[strRecordArr.length] =new Array(
                    logicalunit.Number,
                    logicalunit.Type,
                  logicalunit.InitialCount,
                  logicalunit.InitialCount-logicalunit.CurrentCount,
                    logicalunit.CurrentCount,
                    logicalunit.RetainCount,
                    logicalunit.Threshold
                    );
  }
  var strJrn = new top.StringCtrl("U�ܻ���Ϣ: "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
  strJrn = strJrn + str + top.journalPrinter.strNewLine;
  top.journalPrinter.addJournal(strJrn);
    return strRecordArr;
  }
  
  /*��ʼ��Ukey��������Ϣ*/
  this.InitiateUkeyUnitConfiguration = function (UkeyUnitsToConfiguration)
  {
	top.journalPrinter.addJournalWithTime("Ukey�����ó�ʼ�� UkeyDispenser command InitiateUkeyUnitConfiguration" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("ConfigurationInitiated", top.ukeydispenser.onConfigurationInitiated);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("ConfigurationFailed", top.ukeydispenser.onConfigurationFailed);
    top.YHAXUkeyDispenser.InitiateUkeyUnitConfiguration(UkeyUnitsToConfiguration);
  }


  /*���Ukey��������Ϣ*/
  this.CompletedUkeyUnitConfiguration = function(){
	top.journalPrinter.addJournalWithTime("Ukey��������� UkeyDispenser command CompletedUkeyUnitConfiguration" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("ConfigurationCompleted", top.ukeydispenser.onConfigurationCompleted);  
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("ConfigurationFailed", top.ukeydispenser.onConfigurationFailed);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("NotSupported", top.ukeydispenser.onNotSupported);
    top.ukeydispenser.UkeyDispenserEvents.appendEvent("DeviceError", top.ukeydispenser.onDeviceError);
    top.YHAXUkeyDispenser.CompletedUkeyUnitConfiguration();
  }

  this.onConfigurationCompleted=function(){
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("���UKey�ɹ� UkeyDispenser Event onConfigurationCompleted" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationCompleted) == "function"){
      top.MainFrame.onConfigurationCompleted();
    }

  }
  this.onConfigurationInitiated=function(){
	top.journalPrinter.addJournalWithTime("���UKey��ʼ�� UkeyDispenser Event onConfigurationInitiated" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationInitiated) == "function"){
      top.MainFrame.onConfigurationInitiated();
    }
  }
  this.onNotSupported=function(){
	top.journalPrinter.addJournalWithTime("���ò�֧�� UkeyDispenser Event onNotSupported" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onNotSupported) == "function")
    {
      top.MainFrame.onNotSupported();
    }else if (typeof(top.onNotSupported) == "function")
    {
      top.onNotSupported();
    }else{}
  }
  this.onConfigurationFailed=function(){
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("���UKeyʧ�� UkeyDispenser Event onConfigurationFailed" + top.journalPrinter.strNewLine);
    top.ukeydispenser.UkeyDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationFailed) == "function"){
      top.MainFrame.onConfigurationFailed();
    }
  }
  
  /*
�� ˽�к���������������濨�����յ���Ϣ
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
	 reqMsg.appendNode("strExpCode", top.EXPCODE_CARDDISPENSER);
	 reqMsg.appendNode("strPan", top.pool.get("LocalUkeyNum"));         //UKEY��
	 reqMsg.appendNode("strMemo", "��KEY����");
	 var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
     return iRet;
  }
}
