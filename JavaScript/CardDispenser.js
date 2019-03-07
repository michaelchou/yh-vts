/*
  ������������
 */
function CardDispenser()
{
  // ��������ģ���¼���Ӧ����
  this.CardDispenserEvents = new top.EventHandling(top.YHAXCardDispenser);
  //------------------------- ������������˽������ -------------------------//
  /* �˳�����ȴ��û�ȡ��ʱ�� ��λ���룩*/
  this.EjectTimeout = 120;
  //------------------------- ������ִ�еķ��� -------------------------//

  /*������*/
  this.dispensecard = function(strPresentPosition,id)
  {
    top.carddispenser.CardDispenserEvents.clearAll();
    top.carddispenser.CardDispenserEvents.appendEvent("CardDispensed", top.carddispenser.onCardDispensed);
    top.carddispenser.CardDispenserEvents.appendEvent("CardUnitThresholdCrossed", top.carddispenser.onCardUnitThresholdCrossed);
    top.carddispenser.CardDispenserEvents.appendEvent("CardTaken", top.carddispenser.onCardTaken);
	top.carddispenser.CardDispenserEvents.appendEvent("Timeout", top.carddispenser.onTimeout);
    top.carddispenser.CardDispenserEvents.appendEvent("DeviceError", top.carddispenser.onDeviceError);
	top.carddispenser.CardDispenserEvents.appendEvent("FatalError", top.carddispenser.onDeviceError);
    top.carddispenser.CardDispenserEvents.appendEvent("CardUnitError", top.carddispenser.onDeviceError);
    top.journalPrinter.addJournalWithTime("������ CardDispenser command DispenseCard" + top.journalPrinter.strNewLine);
    top.YHAXCardDispenser.DispenseCard(strPresentPosition,id,this.EjectTimeout*1000);
	// ����ָʾ��
    try{top.guidelights.setCardReaderLight("MEDIUM");}catch(e){}
  }

  /*��������*/
  this.cancelDispense = function()
  {
	 top.journalPrinter.addJournalWithTime("�������� CardDispenser command CancelDispense" + top.journalPrinter.strNewLine);
     top.YHAXCardDispenser.CancelDispense();
	 // ����ָʾ��
     try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
  }

  /*��������λ*/
  this.reset = function ()
  {
	top.carddispenser.CardDispenserEvents.clearAll();
	top.carddispenser.CardDispenserEvents.appendEvent("ResetComplete", top.carddispenser.onResetComplete);
	top.carddispenser.CardDispenserEvents.appendEvent("DeviceError", top.carddispenser.onDeviceError);
	top.carddispenser.CardDispenserEvents.appendEvent("FatalError", top.carddispenser.onDeviceError);
	//�н��ʸ�λʱ�����̿����ⱨ��
	if(isCardPresent()==true){
		sendCaptureStatus();
	}
	top.journalPrinter.addJournalWithTime("��������λ CardDispenser command Reset" + top.journalPrinter.strNewLine);
    top.YHAXCardDispenser.Reset("RETRACT");
  }

  /*��ʼ������������Ϣ*/
  this.InitiateCardUnitConfiguration = function (CardUnitsToConfiguration)
  {
	top.journalPrinter.addJournalWithTime("�������ó�ʼ�� CardDispenser command InitiateCardUnitConfiguration" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    top.carddispenser.CardDispenserEvents.appendEvent("ConfigurationInitiated",top.carddispenser.onConfigurationInitiated);
    top.carddispenser.CardDispenserEvents.appendEvent("ConfigurationFailed",top.carddispenser.onConfigurationFailed);
    
    top.YHAXCardDispenser.InitiateCardUnitConfiguration(CardUnitsToConfiguration);
  }



  /*��ɿ���������Ϣ*/
  this.CompletedCardUnitConfiguration = function(){
	top.journalPrinter.addJournalWithTime("����������� CardDispenser command CompletedCardUnitConfiguration" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    top.carddispenser.CardDispenserEvents.appendEvent("ConfigurationCompleted", top.carddispenser.onConfigurationCompleted);
    top.carddispenser.CardDispenserEvents.appendEvent("ConfigurationFailed", top.carddispenser.onConfigurationFailed);
    top.carddispenser.CardDispenserEvents.appendEvent("NotSupported", top.carddispenser.onNotSupported);
    top.carddispenser.CardDispenserEvents.appendEvent("DeviceError", top.carddispenser.onDeviceError);
    top.YHAXCardDispenser.CompletedCardUnitConfiguration();
  }

  /*��������Ϣ�ı��¼���Ӧ*/
  this.onCardUnitThresholdCrossed = function()
  {
	top.journalPrinter.addJournalWithTime("������ֵ CardDispenser Event onCardUnitThresholdCrossed" + top.journalPrinter.strNewLine);
	top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onCardUnitThresholdCrossed) == "function"){
      top.MainFrame.onCardUnitThresholdCrossed();
	}
  }

  /*������ʱ���¼���Ӧ*/
  this.onTimeout = function()
  {
	top.journalPrinter.addJournalWithTime("������ʱ CardDispenser Event onTimeout" + top.journalPrinter.strNewLine);
	top.carddispenser.CardDispenserEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout) == "function")
      top.MainFrame.onTimeout();
  }

  /*���������ɹ����¼���Ӧ*/
  this.onCardDispensed = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("���Ѿ����� CardDispenser Event onCardDispensed" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setCardReaderLight("QUICK");}catch(e){}
    if (typeof(top.MainFrame.onCardDispensed) == "function"){
      top.MainFrame.onCardDispensed();
	}
  }

  /*���������Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onCardTaken = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("����ȡ�� CardDispenser Event onCardTaken" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    // ����ָʾ��
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardTaken) == "function")
      top.MainFrame.onCardTaken();
    else if (typeof(top.onCardTaken) == "function")
      top.onCardTaken();
  }

  /*������Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError = function()
  {
	top.journalPrinter.addJournalWithTime("���������� CardDispenser Event onDeviceError" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_CardDispenser) == "function")
    {
      top.MainFrame.onDeviceError_CardDispenser();
    }else if (typeof(top.onDeviceError_CardDispenser) == "function")
    {
      top.onDeviceError_CardDispenser();
    }else{}
  };

  /*��������λ�ɹ����¼���Ӧ*/
  this.onResetComplete = function()
  {
	top.journalPrinter.addJournalWithTime("��������λ�ɹ� CardDispenser Event onResetComplete" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_CardDispenser) == "function")
    {
      top.MainFrame.onResetComplete_CardDispenser();
    }else if (typeof(top.onResetComplete_CardDispenser) == "function")
    {
      top.onResetComplete_CardDispenser();
    }else{}
  };

  /*��ʼ������������Ϣ�ɹ����¼���Ӧ*/
  this.onConfigurationInitiated = function(){
	top.journalPrinter.addJournalWithTime("��ʼ������������Ϣ�ɹ� CardDispenser Event onConfigurationInitiated" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationInitiated) == "function")
    {
      top.MainFrame.onConfigurationInitiated();
    }else if (typeof(top.onConfigurationInitiated) == "function")
    {
      top.onConfigurationInitiated();
    }else{}
  }
  /*��ɿ���������Ϣ���¼���Ӧ*/
  this.onConfigurationCompleted = function(){
	top.journalPrinter.addJournalWithTime("��ɿ���������Ϣ�ɹ� CardDispenser Event onConfigurationCompleted" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationCompleted) == "function")
    {
      top.MainFrame.onConfigurationCompleted();
    }else if (typeof(top.onConfigurationCompleted) == "function")
    {
      top.onConfigurationCompleted();
    }else{}
  }
  /*��ʼ������������Ϣʧ�ܵ��¼���Ӧ*/
  this.onConfigurationFailed = function ()
  {
	top.journalPrinter.addJournalWithTime("��ʼ������ʧ�� CardDispenser Event onConfigurationFailed" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onConfigurationFailed) == "function")
    {
      top.MainFrame.onConfigurationFailed();
    }else if (typeof(top.onConfigurationFailed) == "function")
    {
      top.onConfigurationFailed();
    }else{}
  }
  /*��֧�����ÿ���������Ϣ���¼���Ӧ*/
  this.onNotSupported = function(){
	top.journalPrinter.addJournalWithTime("��֧�����ÿ���������Ϣ CardDispenser Event onNotSupported" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
    if (typeof(top.MainFrame.onNotSupported) == "function")
    {
      top.MainFrame.onNotSupported();
    }else if (typeof(top.onNotSupported) == "function")
    {
      top.onNotSupported();
    }else{}
  }
  //-------------����------------------//
  /*����-����*/
  this.exdispensecard = function(strPresentPosition,id)
  {
    top.carddispenser.CardDispenserEvents.clearAll();
    top.carddispenser.CardDispenserEvents.appendEvent("CardDispensed", top.carddispenser.onExCardDispensed);
    top.carddispenser.CardDispenserEvents.appendEvent("CardUnitThresholdCrossed", top.carddispenser.onExCardUnitThresholdCrossed);
    top.carddispenser.CardDispenserEvents.appendEvent("CardTaken", top.carddispenser.onExCardTaken);
	top.carddispenser.CardDispenserEvents.appendEvent("Timeout", top.carddispenser.onTimeout);
    top.carddispenser.CardDispenserEvents.appendEvent("DeviceError", top.carddispenser.onDeviceError);
	top.carddispenser.CardDispenserEvents.appendEvent("FatalError", top.carddispenser.onDeviceError);
    top.carddispenser.CardDispenserEvents.appendEvent("CardUnitError", top.carddispenser.onDeviceError);
    top.journalPrinter.addJournalWithTime("������(����) CardDispenser command DispenseCard" + top.journalPrinter.strNewLine);
    top.YHAXCardDispenser.DispenseCard(strPresentPosition,id,this.EjectTimeout*1000);
	// ����ָʾ��
    try{top.guidelights.setCardReaderLight("MEDIUM");}catch(e){}
  }

    /*������-����-���ɹ����¼���Ӧ*/
  this.onExCardDispensed = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("�����Ѿ����� CardDispenser Event onExCardDispensed" + top.journalPrinter.strNewLine);
    top.carddispenser.CardDispenserEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setCardReaderLight("QUICK");}catch(e){}
    if (typeof(top.MainFrame.onExCardDispensed) == "function"){
      top.MainFrame.onExCardDispensed();
	}
  }

   /*������-����-���Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onExCardTaken = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("������ȡ�� CardDispenser Event onExCardTaken" + top.journalPrinter.strNewLine);
    // ����ָʾ��
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onExCardTaken) == "function")
      top.MainFrame.onExCardTaken();
    else if (typeof(top.onExCardTaken) == "function")
      top.onExCardTaken();
  }
  /*��������Ϣ�ı��¼���Ӧ*/
  this.onExCardUnitThresholdCrossed = function()
  {
	top.journalPrinter.addJournalWithTime("������ֵ CardDispenser Event onExCardUnitThresholdCrossed" + top.journalPrinter.strNewLine);
    if (typeof(top.MainFrame.onExCardUnitThresholdCrossed) == "function"){
      top.MainFrame.onExCardUnitThresholdCrossed();
	}
  }

  //------------------------- ������������ -------------------------//

  /*�жϷ��������Ƿ���ڿ�*/
  this.isCardPresent = function()
  {
    return (top.YHAXCardDispenser.StMediaStatus == "PRESENT");
  }
     /*
���� ��ȡ������Ϣ
   */
  this.getCardUnitInfo = function()
  {
	//��ȡ������Ϣ��ʱ����ȡ��״̬����ֹȡ��SP������Ϣ
	top.YHAXCardDispenser.StDeviceStatus;
	top.YHAXCardDispenser.StMediaStatus;
	top.YHAXCardDispenser.StDispenserStatus;
    var str = "";
	var strRecordArr = new Array();
    var logicalunits = top.YHAXCardDispenser.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      str += logicalunit.Number + "," + logicalunit.Type + "," + logicalunit.Status + "," + logicalunit.CurrentCount + "," + logicalunit.InitialCount + "," + logicalunit.Threshold + "," + logicalunit.RetainCount +"|";
      strRecordArr[strRecordArr.length] =new Array(
                logicalunit.Number,
                logicalunit.Type,
	            logicalunit.Status,
	            logicalunit.CurrentCount,
                logicalunit.InitialCount,
				logicalunit.Threshold,
				logicalunit.RetainCount);
	}
	var strJrn = new top.StringCtrl("������Ϣ: "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	strJrn = strJrn + str + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
    return strRecordArr;
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
	  reqMsg.appendNode("strPan", top.pool.get("strPan"));         //����
     reqMsg.appendNode("strMemo", "��������");
     var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
     return iRet;
  }
}
