/*
��D7D0B898-40CF-46AF-9F76-F8EBA24D78E1
 */
function Deposit()
{
  // �����ģ���¼���Ӧ����
  this.CimEnr = new top.EventHandling(top.YHAXCashAcceptor);


  // �Ƿ��ܹ���⵽Ǯ������
  this.CpCanDetectCashInserted = top.YHAXCashAcceptor.CpCanDetectCashInserted;

  // �������ı���
  this.strCurrency          = "CNY";
  // �����û����볮Ʊ��ʱ����
  this.iAcceptCashTimeout   = 120;
  // �û�ȡ�߾ܳ����˳��ĳ�ʱ����
  this.iEjectCashTimeout    = -1;

  // �鳮ǰ���¼�
  this.EIC_ACCEPTCANCELLED  = 1;
  this.EIC_ACCEPTED         = 2;
  this.EIC_ACCEPTTIMEOUT    = 3;
  this.EIC_RFUCASHTAKEN     = 4;
  
  this.iAmount = 0;
  this.dtDepositStart = "";
  this.iWaitSecondsAfterDepEnd = 120;
  
  /*
    �������Ƿ����
    ���أ�
      VM_AVAIL_OK       ��������
      VM_AVAIL_LOCKED   ������
      VM_AVAIL_DEVERR   Ӳ������
  */
//  this.checkAvai = function()
//  {
//    // ��ģ��״̬�Ƿ�����
//    var StDeviceStatus      = top.YHAXCashAcceptor.StDeviceStatus;
//    var StAcceptorStatus    = top.YHAXCashAcceptor.StAcceptorStatus;
//    var StInputOutputStatus = top.YHAXCashAcceptor.StInputOutputStatus;
//    var StTransportStatus   = top.YHAXCashAcceptor.StTransportStatus;
//    var StShutterStatus     = top.YHAXCashAcceptor.StShutterStatus;
//    var StSafeDoorStatus    = top.YHAXCashAcceptor.StSafeDoorStatus;
//    
//    if (StDeviceStatus != "HEALTHY"
//      || (StAcceptorStatus != "HEALTHY" && StAcceptorStatus != "DEGRADED" && StAcceptorStatus != "UNKNOWN")
//      || (StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN")
//      || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "EMPTY")
//      || (StTransportStatus == "UNKNOWN" && StInputOutputStatus == "UNKNOWN") 
//      || StShutterStatus != "CLOSED"
//      || StSafeDoorStatus != "CLOSED")
//    {
//      top.deposit.CimEnr.appendEvent("ResetComplete", top.deposit.onResetEnd4StatusError);
//      top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onResetEnd4StatusError);
//      top.YHAXCashAcceptor.Reset("RETRACT", 0);     
//      return false;
//	}
//    return true;
//  }
  
  this.checkAvai = function()
  {
    // ��ģ��״̬�Ƿ�����
    var StDeviceStatus      = top.YHAXCashAcceptor.StDeviceStatus;
    var StAcceptorStatus    = top.YHAXCashAcceptor.StAcceptorStatus;
    var StInputOutputStatus = top.YHAXCashAcceptor.StInputOutputStatus;
    var StTransportStatus   = top.YHAXCashAcceptor.StTransportStatus;
    var StShutterStatus     = top.YHAXCashAcceptor.StShutterStatus;
    var StSafeDoorStatus    = top.YHAXCashAcceptor.StSafeDoorStatus;
    
    if(StDeviceStatus != "HEALTHY") {
      return "Ӳ������";
    }
    if(StAcceptorStatus != "HEALTHY" && StAcceptorStatus != "DEGRADED" && StAcceptorStatus != "UNKNOWN")
    {
      return "�ճ�ģ��״̬����ȷ";
    }
    if(StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN"
	  || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "EMPTY")
	  || (StTransportStatus == "UNKNOWN" && StInputOutputStatus == "UNKNOWN")) 
    {
      return "���ڻ�ͨ��״̬����ȷ";
    }
    if(StShutterStatus != "CLOSED")
    {
      return "����״̬����ȷ";
    }
    if(StSafeDoorStatus != "CLOSED")
    {
      return "��ȫ��״̬����ȷ";
    }
    return "true";
  }
  
  /*
    �������Ƿ����(�볮��)
    ���أ�
    VM_AVAIL_OK       ��������
    VM_AVAIL_LOCKED   ������
    VM_AVAIL_DEVERR   Ӳ������
  */
  this.checkCashinAvai = function()
  {
    // ��ģ��״̬�Ƿ�����
    var StDeviceStatus      = top.YHAXCashAcceptor.StDeviceStatus;
    var StAcceptorStatus    = top.YHAXCashAcceptor.StAcceptorStatus;
    var StInputOutputStatus = top.YHAXCashAcceptor.StInputOutputStatus;
    var StTransportStatus   = top.YHAXCashAcceptor.StTransportStatus;
    var StShutterStatus     = top.YHAXCashAcceptor.StShutterStatus;
    var StSafeDoorStatus    = top.YHAXCashAcceptor.StSafeDoorStatus;
    
    if(StDeviceStatus != "HEALTHY") {
	  return "Ӳ������";
	}
	if(StAcceptorStatus != "HEALTHY" && StAcceptorStatus != "DEGRADED" && StAcceptorStatus != "UNKNOWN")
	{
      return "�ճ�ģ��״̬����ȷ";
	}
	if(StInputOutputStatus != "EMPTY" && StInputOutputStatus != "UNKNOWN"
  	  || (StTransportStatus != "HEALTHY" && StTransportStatus != "UNKNOWN" && StTransportStatus != "EMPTY")
  	  || (StTransportStatus == "UNKNOWN" && StInputOutputStatus == "UNKNOWN")) 
	{
      return "���ڻ�ͨ��״̬����ȷ";
	}
	if(StSafeDoorStatus != "CLOSED")
	{
	  return "��ȫ��״̬����ȷ";
	}
	return "true";
  }

  /*
    ˽�к��������ʱӲ�����ϣ���λ���Իָ������Ļص�������
   */
  this.onResetEnd4StatusError = function()
  {
    // ��¼�ն���ˮ
   // var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "CIM: Reset For Status Error!" + top.jrn.strLineFeed;
  //  top.journalPrinter.addCashJournalWithTime(strJrn,false);

    top.deposit.CimEnr.clearAll();
  }

  /*
    ����ʼ������ʼ���ʱ���øú���
   */
  this.init = function()
  {
    iAmount = 0;
    // ��¼��ʼ��ʱ��
    dtDepositStart = new Date();

    // ��¼�ն���ˮ
   // var strJrn = new top.StringCtrl("DEP " + "TELLER:"+top.term.strTellerNum).preandsufStr('-', top.jrn.TITLEWIDTH) +
   //   top.jrn.strLineFeed + new top.DateTimeCtrl().getHHmmSSWithSep() + " " + top.deposit.getCassUnitInfo() + top.jrn.strLineFeed;
   // top.journalPrinter.addCashJournalWithTime(strJrn,false);
  }
  /*
   * ��ʼ�������  CASH_IN_START
   * 
   */
  this.prepare = function()
  {
	 top.deposit.CimEnr.clearAll();
	 top.deposit.CimEnr.appendEvent("AcceptCashPrepared", top.deposit.onCashPrepared);
	 top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Ac);
	 top.deposit.CimEnr.appendEvent("Timeout", top.deposit.onTimeout_prepare);
	 top.YHAXCashAcceptor.PrepareForAcceptCash(); 
  }
  //������ڿ����ɹ�
  this.onCashPrepared = function(){
	top.journalPrinter.addCashJournalWithTime("��Ա��ʼ����", false);
	top.deposit.CimEnr.clearAll();
	if (typeof(top.MainFrame.onCashPrepared) == "function")
	{
	   // ֹͣ��ʾ��ų���ʾ����ʱ��ʱ��������ʾ�쳣��
	   top.serviceCtrl.stopUserTimeout();
	   top.MainFrame.onCashPrepared();
	}
  }
  
  this.onTimeout_prepare= function(){
	top.journalPrinter.addCashJournalWithTime("��Ա��ʼ���ڳ�ʱ", false);
	top.deposit.CimEnr.clearAll();
	if (typeof(top.MainFrame.onTimeout_prepare) == "function")
	{
		// ֹͣ��ʾ��ų���ʾ����ʱ��ʱ��������ʾ�쳣��
		top.serviceCtrl.stopUserTimeout();
		top.MainFrame.onTimeout_prepare();
	}
  }
  
  /*
	CashInserted ��CashAccepted ��CashInserted ��CashRefused ��
	CashInserted ��DeviceError ��CashAcceptCancelled ��Timeout ��	DeviceError ��CashRefused��
    �����û��ų�
    MainFrame�ṩ�ص�������
      onCashInserted();
      onDeviceError_Ac();
      onRefusedCashEjected();
      onDeviceError_Ejr();
      onRetractEnd();
      onIndentifyCash(lais, event2IdCash);
      ������
        lais            �鳮�����LastAcceptItems(LastAcceptItem�ļ���)
        event2IdCash    �鳮ǰ�Ķ����¼�
   */
  this.accept = function()
  {
	//var strJrn = new top.StringCtrl("DEP " + "TELLER:"+top.terminal.strTellerNum).preandsufStr('-', top.journalPrinter.TITLEWIDTH) +
	//top.journalPrinter.strNewLine + " " + top.deposit.getCassUnitInfo();
//	top.journalPrinter.addCashJournalWithTime(strJrn, false);
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
//    this.iCurAcceptTimes++;
    top.deposit.CimEnr.clearAll();
    top.deposit.CimEnr.appendEvent("CashInserted", top.deposit.onCashInserted);
    top.deposit.CimEnr.appendEvent("CashAccepted", top.deposit.onCashAccepted);
    top.deposit.CimEnr.appendEvent("CashRefused", top.deposit.onCashRefused_All);
    top.deposit.CimEnr.appendEvent("CashAcceptCancelled", top.deposit.onCashAcceptCancelled);
    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Ac);
    top.deposit.CimEnr.appendEvent("Timeout", top.deposit.onTimeout_Ac);
//    top.YHAXCashAcceptor.AcceptCash(top.deposit.iAcceptCashTimeout*1000);
    top.YHAXCashAcceptor.AcceptCash(-1);
    try{top.cashguidelights.setCashAcceptorLight("MEDIUM");}catch(e){} //�����ڵ�
    // ��ʱ����
//    top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onDeviceError_Ac();}, 120*1000);
  }

  /*
    ˽�к������ȴ��û��ų�ʱ��Ʊ��������¼��ص��Ĵ�����
   */
  this.onCashInserted = function()
  {
	top.journalPrinter.addCashJournalWithTime("�ͻ��ų� onCashInserted", false);
    if (typeof(top.MainFrame.onCashInserted) == "function")
    {
      // ֹͣ��ʾ��ų���ʾ����ʱ��ʱ��������ʾ�쳣��
      top.serviceCtrl.stopUserTimeout();
      top.MainFrame.onCashInserted();
    }
  }

  /*
    ˽�к������û��ų���������¼��ص��Ĵ�����
    ������
      TotalItems    ����ĳ�Ʊ����
      PartRefused   �Ƿ��в��־ܳ�
   */
  this.onCashAccepted = function(TotalItems, PartRefused)
  {
	top.journalPrinter.addCashJournalWithTime("��Ʊ������ Cash Accepted (PartRefused)��"+PartRefused +" TotalItems:"+TotalItems, false);
    // ֹͣ��ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();
    
    top.pool.set("strTotalItems", TotalItems);
    // ��¼�ն���ˮ
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Cash Accepted" +
      //(PartRefused ? "(PartRefused)" : "") + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,false);

    top.deposit.CimEnr.clearAll();
    if (PartRefused) {
      top.deposit.onCashRefused();
    }else {
      top.deposit.onIndentifyCash(top.deposit.EIC_ACCEPTED);
    }
  }

  /*
    ˽�к������ȴ��û��ų���ʱ���¼��ص��Ĵ�����
   */
  this.onTimeout_Ac = function()
  {
	top.journalPrinter.addCashJournalWithTime("�ų���ʱ onTimeout_Ac", false);	  
    // ֹͣ��ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();

    // ��¼�ն���ˮ
   // var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Accept:User Timeout" + top.jrn.strLineFeed;
   // top.journalPrinter.addCashJournalWithTime(strJrn,true);

    top.deposit.CimEnr.clearAll();
    top.deposit.onIndentifyCash(top.deposit.EIC_ACCEPTTIMEOUT);
  }

  /*
    ˽�к������û��ų������ȴ��鳮�Ĵ�����
    ������
      event2IdCash    �鳮ǰ���¼�
   */
  this.iEvent2IdCash;
  this.onIndentifyCash = function(event2IdCash)
  {
	try{top.cashguidelights.setCashDispenLight("OFF");}catch(e){} //�����ڵ�&�ܳ��ڵ�
	try{top.cashguidelights.setCashAcceptorLight("OFF");}catch(e){} //�����ڵ�
    top.deposit.iEvent2IdCash = event2IdCash;
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onIndentifyCash_func();}, 1*1000);
  }
  
  this.onIndentifyCash_func = function()
  {
	top.journalPrinter.addCashJournalWithTime(new top.CashBoxCheck().getCashBoxRecord(),false);//2018-1-18 ��¼������Ϣ
    var lais = top.YHAXCashAcceptor.LastAcceptItems;
    top.deposit.iAmount = top.deposit.getLaisValidAmount(lais, top.deposit.strCurrency);
    top.journalPrinter.addCashJournalWithTime("�鳮��� onIndentifyCash �鳮�ܽ��Ϊ " + top.deposit.iAmount + ".00 Ԫ ", false);	
    if (typeof(top.MainFrame.onIndentifyCash) == "function")
//      top.MainFrame.onIndentifyCash(lais, top.deposit.iEvent2IdCash);
      top.MainFrame.onIndentifyCash(lais, top.deposit.iAmount);

    // ��¼�ն���ˮ
    if (!top.deposit.isNoCash(lais))
    {
     // var strJrn = "IdentifyCash:" + top.deposit.getLaisDetailStr(lais) + top.jrn.strLineFeed;
    //  top.journalPrinter.addCashJournalWithTime(strJrn,false);
    }
    else
    {
      //var strJrn = "No Cash Identified" + " " + top.deposit.getLaisDetailStr(lais) + top.jrn.strLineFeed;
     // top.journalPrinter.addCashJournalWithTime(strJrn,false);
    }
  }

  /*
    ˽�к������ȴ��û��ų�ʱӲ�����ϵ��¼��ص��Ĵ�����
   */
  this.onDeviceError_Ac = function()
  {
	top.journalPrinter.addCashJournalWithTime("Ӳ������ onDeviceError_Ac", false);	
    // ֹͣ��ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();

    // ��¼�ն���ˮ
  //  var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Accept:Device Error" + top.deposit.getLastAcceptNumDesc() + top.jrn.strLineFeed;
   // top.jrn.appendJournal(strJrn);

    top.deposit.CimEnr.clearAll();
    // �Ƚϴ�ʼ��ʱ��
//    var msFromDepStart = new Date().getTime() - top.deposit.dtDepositStart.getTime();
//    
//    // ����Ӵ�ʼ������ʱʱ�䳬��20���ӣ���ֱ���˳��������̣���ֹ��ǰ�ͻ����뿪���·���
//    if (msFromDepStart >= 20*60*1000)
//    {
//	  var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Accept:Device Error 20m"  + top.jrn.strLineFeed;
//	  top.journalPrinter.addCashJournalWithTime(strJrn,true);
//      top.serviceCtrl.navigate2Quit();
//      return;
//    }

    if (typeof(top.MainFrame.onDeviceError_Ac) == "function")
    {
      // ֹͣ��ʾ��ų���ʾ����ʱ��ʱ��������ʾ�쳣��
      top.serviceCtrl.stopUserTimeout();
      // ��ʾ����������ȡ����ʾ��ͬʱ�������ڴ���ʱ��ʱ��������������ֹ��
//      top.wins.showProcessingTip(top.langcur.oDepCancelling);
//      top.serviceCtrl.startFlowCtrlTimeout(function(){top.MainFrame.onDeviceError_Ac();}, 30*1000);
      top.MainFrame.onDeviceError_Ac();
    }
  }

  /*
    ˽�к����������˾ܳ�ʱӲ�����ϣ������˳�ʧ�ܺ�λʧ�ܵĻص�������
   */
  this.onReset4AcAndEjrErr_DeviceError = function()
  {
    // ��¼�ն���ˮ
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Reset(EJECT): DeviceError" + top.jrn.strLineFeed;
   // top.journalPrinter.addCashJournalWithTime(strJrn,true);

    // �������ܻ����CashTaken�¼�
  }

  /*
    ˽�к�����׼�����ʱӲ�����ϣ���λ���Իָ������Ļص�������
   */
  this.onResetEnd4PrepareErrAc = function()
  {
    // ��¼�ն���ˮ
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "CIM: Reset For Prepare Error!" + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,true);

    top.deposit.CimEnr.clearAll();
  }

  /*
    ˽�к������û��ų�����ȫ���ܳ����¼��ص��Ĵ�����
   */
  this.onCashRefused_All = function()
  {
	top.journalPrinter.addCashJournalWithTime("�оܳ� onCashRefused_All", false);	  
    // ֹͣ��ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();
    top.pool.set("strTotalItems", "");
    // ��¼�ն���ˮ
   // var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Accept:Cash Refused" + top.jrn.strLineFeed;
   // top.journalPrinter.addCashJournalWithTime(strJrn,false);
    top.deposit.onCashRefused();
  }

  /*
    ˽�к������û��ų����־ܳ����¼��ص��Ĵ�����
	RefusedCashEjected ��RefusedCashEjected then CashTaken��RefusedCashEjected then Timeout��
	RefusedCashEjected then DeviceError��DeviceError
   */
  this.dtOnRefusedCash;
  this.onCashRefused = function()
  {
    top.deposit.CimEnr.clearAll();
    top.deposit.CimEnr.appendEvent("RefusedCashEjected", top.deposit.onRefusedCashEjected);
    top.deposit.CimEnr.appendEvent("CashTaken", top.deposit.onCashTaken_Ejr);

    // ��¼���־ܳ���ʱ��
    top.deposit.dtOnRefusedCash = new Date();

    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Ejr);
//    var iEjectRefuseCashRet = top.YHAXCashAcceptor.EjectRefusedCash(top.deposit.iEjectCashTimeout);
 
    try{top.cashguidelights.setCashDispenLight("MEDIUM");}catch(e){} //�����ڵ�&�ܳ��ڵ�
    // ����˾ܳ���ʱ����
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onCashTaken_Ejr();}, 10*1000);
  }

  /*
    ˽�к������ܳ��Ѿ����˳����¼��ص��Ĵ�����
   */
  this.onRefusedCashEjected = function()
  {
  
    // ��ʱ����ֹͣ����˾ܳ���ʱ����

    // �ܳ�����
    var strNumOfRefusedDesc = "";
    try
    {
      if (!top.deposit.bLogicalJammed && typeof(top.YHAXCashAcceptor.NumOfRefused) != "undefined" && top.YHAXCashAcceptor.NumOfRefused > 0)
        strNumOfRefusedDesc = "(RefusedNum:" + top.YHAXCashAcceptor.NumOfRefused + ")";
    } catch(e){}
    
    top.journalPrinter.addCashJournalWithTime("�˾ܳ� onRefusedCashEjected "+strNumOfRefusedDesc, false);
    // ��¼�ն���ˮ
   // var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Refused Cash Ejected" + strNumOfRefusedDesc + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,false);

    if (typeof(top.MainFrame.onRefusedCashEjected) == "function")
      top.MainFrame.onRefusedCashEjected();
  }

  /*
    ˽�к������˳��ľܳ��Ѿ����û�ȡ�ߵ��¼��ص��Ĵ�����
   */
  this.onCashTaken_Ejr = function()
  {
	top.journalPrinter.addCashJournalWithTime("�ܳ�ȡ�� onCashTaken_Ejr", false);	
    // ֹͣ����˾ܳ���ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();

    // ��¼�ն���ˮ
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "Refused Cash Taken" + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,false);

    top.deposit.CimEnr.clearAll();


    top.deposit.onIndentifyCash(top.deposit.EIC_RFUCASHTAKEN);
    
  }

  /*
    ˽�к������˾ܳ�ʱӲ�����ϵ��¼��ص��Ĵ�����
   */
  this.onDeviceError_Ejr = function()
  {
	top.journalPrinter.addCashJournalWithTime("�˾ܳ����� onDeviceError_Ejr", false);	  
    // ֹͣ����˾ܳ���ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();

    // ��¼�ն���ˮ
    //var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "EjectRefusedCash:Device Error" + top.deposit.getLastAcceptNumDesc() + top.jrn.strLineFeed;
    //top.journalPrinter.addCashJournalWithTime(strJrn,false);

    top.deposit.CimEnr.clearAll();

    if (typeof(top.MainFrame.onDeviceError_Ejr) == "function")
    {
    	top.MainFrame.onDeviceError_Ejr();
    }
  }

  /*
   �ڴ������֮ǰ��ȡ�����
  MainFrame�ṩ�ص�������
  onCashAcceptCancelled();
  */
  this.CancelAcceptCash = function()
  {
	var strJrn = new top.StringCtrl("DEP " + "CancelAcceptCash :"+top.terminal.strTellerNum).preandsufStr('-', top.journalPrinter.TITLEWIDTH) +
	top.journalPrinter.strNewLine + " " + top.deposit.getCassUnitInfo();
	top.journalPrinter.addCashJournalWithTime(strJrn, false);
    top.deposit.CimEnr.clearAll();
    top.deposit.CimEnr.appendEvent("CashAcceptCancelled", top.deposit.onCashAcceptCancelled);
    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Ac);
    top.YHAXCashAcceptor.CancelAcceptCash();
  }
  
  
  this.onCashAcceptCancelled = function()
  {
	top.serviceCtrl.stopFlowCtrlTimeout();
	top.deposit.CimEnr.clearAll();
	if (typeof(top.MainFrame.onCashAcceptCancelled) == "function")
	{
	  top.MainFrame.onCashAcceptCancelled();
	}
  }
  
  /*
    ��Escrow�еĳ�Ʊ���볮��
    MainFrame�ṩ�ص�������
      onStoreEscrowedCashEnd();
   */
  this.storeEscrowedCash = function()
  {
	var strJrn = new top.StringCtrl("DEP " + "storeEscrowedCash Before:"+top.terminal.strTellerNum).preandsufStr('-', top.journalPrinter.TITLEWIDTH) +
	top.journalPrinter.strNewLine + " " + top.deposit.getCassUnitInfo();
	top.journalPrinter.addCashJournalWithTime(strJrn, false);
    top.deposit.CimEnr.clearAll();
    top.deposit.CimEnr.appendEvent("EscrowedCashStored", top.deposit.onEscrowedCashStored);
    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onDeviceError_Se);
    top.deposit.CimEnr.appendEvent("FatalError", top.deposit.onDeviceError_Se);
    top.deposit.CimEnr.appendEvent("CashTaken", top.deposit.onCashTaken_Se);
    // ���볮�䳬ʱ����
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onDeviceError_Se();}, 30*1000);
    top.YHAXCashAcceptor.StoreEscrowedCash();
  }

  /*
    ˽�к�����Escrow�еĳ�Ʊ�Ѿ������볮����¼��ص��Ĵ�����
   */
  this.onEscrowedCashStored = function()
  {
    // ֹͣ���볮�䳬ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();

    top.journalPrinter.addCashJournalWithTime("Escrowed Cash Stored" ,false);

    top.deposit.CimEnr.clearAll();
    if (typeof(top.MainFrame.onStoreEscrowedCashEnd) == "function")
    {
      top.MainFrame.onStoreEscrowedCashEnd();
    }
  }

  /*
    ˽�к�����Escrow�еĳ�Ʊ���볮��ʱӲ�����ϵ��¼��ص��Ĵ�����
   */
  this.onDeviceError_Se = function()
  {
    // ֹͣ���볮�䳬ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();
    top.journalPrinter.addCashJournalWithTime("StoreEscrowedCash:Device Error",true);

    top.deposit.CimEnr.clearAll();
    // ��ʱ��ʾ���
//    top.serviceCtrl.startFlowCtrlTimeout(function(){try{top.MainFrame.onStoreEscrowedCashEnd();}catch(e){}}, 30*1000);
    if (typeof(top.MainFrame.onDeviceError_Store) == "function")
        top.MainFrame.onDeviceError_Store();
  }


  /*
    ˽�к�����Escrow�еĳ�Ʊ���볮��ʱ��Ʊ���û�ȡ�ߵ��¼��ص��Ĵ�����
   */
  this.onCashTaken_Se = function()
  {
	top.journalPrinter.addCashJournalWithTime("StoreEscrowedCash:onCashTaken_Se", false);	  
    // ֹͣ���볮�䳬ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();

    // ��¼�ն���ˮ
  //  var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "StoreEscrowedCash:Cash Taken" + top.jrn.strLineFeed;
	//top.journalPrinter.addCashJournalWithTime(strJrn,true);

    top.deposit.CimEnr.clearAll();
    if (typeof(top.MainFrame.onStoreEscrowedCashEnd) == "function")
      top.MainFrame.onStoreEscrowedCashEnd();
  }


  /*
    ���һ�ηų��ѵ㳮�������������������฻�ȴ���豸��������ʱ����������˶ԡ�
    ���أ�
      ���һ�ηų��ѵ㳮������������
   */
  this.getLastAcceptNumDesc = function()
  {
    var strLastAcceptNumDesc = "";
    try
    {
      if (typeof(top.YHAXCashAcceptor.LastAcceptCount) != "undefined" && top.YHAXCashAcceptor.LastAcceptCount > 0)
        strLastAcceptNumDesc = "(LastAcceptNum:" + top.YHAXCashAcceptor.LastAcceptCount + ")";
    }
    catch(e)
    {
    }
    return strLastAcceptNumDesc;
  }

  /*
    �õ��鳮�Ľ���г�Ʊ������
    ������
      lais �鳮�����LastAcceptItems(LastAcceptItem�ļ���)
    ���أ�
      ��Ʊ������
   */
  this.getLaisCountTotal = function(lais)
  {
    var iCountTotal = 0;
    for (var i=0; i<lais.Count; i++)
      iCountTotal += lais.Item(i).Count;
    return iCountTotal;
  }

  /*
    �õ��鳮�Ľ������Ч�ĳ�Ʊ������
    ������
      lais      �鳮�����LastAcceptItems(LastAcceptItem�ļ���)
      currency  ��Ч�ı���
    ���أ�
      ��Ч�ĳ�Ʊ������
   */
  this.getLaisValidCountTotal = function(lais, currency)
  {
    if (currency == null || currency.length < 3)
      currency = top.deposit.strCurrency;
    var iCountTotal = 0;
    for (var i=0; i<lais.count; i++)
    {
      if ( lais.item(i).Validity == "VALID"
        && lais.item(i).Currency == currency
        && (lais.item(i).Denomination == 50 || lais.item(i).Denomination == 100)
        && lais.item(i).Count > 0 )
        iCountTotal += lais.item(i).Count;
    }
    return iCountTotal;
  }

  /*
    ʶ��ĳ�Ʊ���Ƿ��в�ϣ������ģ��������ұ��֣�
    ������
      lais �鳮�����LastAcceptItems(LastAcceptItem�ļ���)
   */
  this.isCashMisMatch = function(lais)
  {
    return top.deposit.getLaisCountTotal(lais) !=  top.deposit.getLaisValidCountTotal(lais, top.deposit.strCurrency);
  }

  /*
    �Ƿ��޿�ʶ��ĳ�Ʊ
    ������
      lais �鳮�����LastAcceptItems(LastAcceptItem�ļ���)
   */
  this.isNoCash = function(lais)
  {
    return top.deposit.getLaisCountTotal(lais) == 0;
  }

  /*
    �õ��鳮�Ľ������Ч�ĳ�Ʊ�ܽ��
    ���أ�
      ��Ч�ĳ�Ʊ�ܽ��
   */
  this.getLaisValidAmount = function(lais, currency)
  {
    if (currency == null || currency.length < 3)
      currency = top.deposit.strCurrency;
    var amount = 0;
    for (var i=0; i<lais.count; i++)
    {
      if ( lais.item(i).Validity == "VALID"
        && lais.item(i).Currency == currency
        && (lais.item(i).Denomination == 100 ||
        	lais.item(i).Denomination == 50 || 
        	lais.item(i).Denomination == 20 || 
        	lais.item(i).Denomination == 10 || 
        	lais.item(i).Denomination == 5)
        && lais.item(i).Count > 0 ) {
    	if(lais.item(i).Denomination == 100){
    		top.pool.set("strY100Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("�鳮 100ԪƱ������Ϊ " + lais.item(i).Count + " �� ", false);
    	}else if(lais.item(i).Denomination == 50) {
    		top.pool.set("strY50Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("�鳮 50ԪƱ������Ϊ " + lais.item(i).Count + " �� ", false);
    	}else if(lais.item(i).Denomination == 20) {
    		top.pool.set("strY20Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("�鳮 20ԪƱ������Ϊ " + lais.item(i).Count + " �� ", false);
    	}else if(lais.item(i).Denomination == 10) {
    		top.pool.set("strY10Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("�鳮 10ԪƱ������Ϊ " + lais.item(i).Count + " �� ", false);
    	}else if(lais.item(i).Denomination == 5) {
    		top.pool.set("strY5Count", lais.item(i).Count);
    		top.journalPrinter.addCashJournalWithTime("�鳮 5ԪƱ������Ϊ " + lais.item(i).Count + " �� ", false);
    	}
    	amount += lais.item(i).Count*lais.item(i).Denomination;
      }
    }
    return amount;
  }

  /*
    �õ��鳮�Ľ������Ч�ĳ�Ʊ�������������
    ������
      lais      �鳮�����LastAcceptItems(LastAcceptItem�ļ���)
      currency  ��Ч�ı���
    ���أ�
      ��Ч�ĳ�Ʊ�������������
    ע��
      ���ص����飬�����Ϊ�±꣬����Ϊֵ
      ����1��100����ĳ���ĳ�Ʊ������ʱ����ֵΪnull
   */
  this.getLaisValidItems = function(lais, currency)
  {
    var denocntarr = new Array();
    if (currency == null || currency.length < 3)
      currency = top.deposit.strCurrency;
    for (var i=0; i<lais.count; i++)
    {
      if ( lais.item(i).Validity == "VALID"
        && lais.item(i).Currency == currency
        && (lais.item(i).Denomination == 50 || lais.item(i).Denomination == 100)
        && lais.item(i).Count > 0 )
      {
        if (typeof(denocntarr[lais.item(i).Denomination]) != "undefined")
          denocntarr[lais.item(i).Denomination] += lais.item(i).Count;
        else
          denocntarr[lais.item(i).Denomination] = lais.item(i).Count;
      }
    }
    return denocntarr;
  }

  /*
    �õ��鳮�Ľ������ϸ�ַ�������
    ������
      lais      �鳮�����LastAcceptItems(LastAcceptItem�ļ���)
    ���أ�
      ��ϸ�����ַ���
   */
  this.getLaisDetailStr = function(lais)
  {
    var str = "";
    for (var i=0; i<lais.count; i++)
    {
      if (str == "")
        str = lais.item(i).Currency + lais.item(i).Denomination + "," + lais.item(i).Count;
      else
        str = str + "|" + lais.item(i).Currency + lais.item(i).Denomination + "," + lais.item(i).Count;
    }
    return str;
  }

  /*
���� ��ȡ������Ϣ��������������ˮ��¼��
    ���أ�
      ������Ϣ�������ַ���
   */
  this.getCassUnitInfo = function()
  {
    var str = "";
    var logicalunits = top.YHAXCashAcceptor.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      str += logicalunit.Total + "|";
    }
    if (str.length == 0)
      str = "Failed!";
    else
      str = "Cass:" + str;
    return str;
  }

  /*
 �� ��ȡ������������
    ���أ�
      ������������
   */
  this.getAllCUTotal = function()
  {
    var alltotal = 0;
    var logicalunits = top.YHAXCashAcceptor.LogicalUnits;
    for (var i=0; i<logicalunits.length; i++)
    {
      var logicalunit = logicalunits.Item(i);
      alltotal += logicalunit.Total;
    }
    return alltotal;
  }
  
  /*
   ����
   */
  this.CloseShutter = function()
  {
	    top.deposit.CimEnr.clearAll();
	    top.deposit.CimEnr.appendEvent("ShutterClosed ", top.deposit.onShutterClosed);
	    top.deposit.CimEnr.appendEvent("DeviceError", top.deposit.onAcShutterNotClosed);
	    //���ų�ʱ
	    //top.serviceCtrl.startFlowCtrlTimeout(function(){top.deposit.onDeviceError_Se();}, 30*1000);
	    top.YHAXCashAcceptor.CloseShutter();	  
  }
  
  /*
       ˽�к��������ųɹ�
 */
  this.onShutterClosed = function()
  {
	  top.journalPrinter.addCashJournalWithTime("���ųɹ�:onShutterClosed", false);	  
	  top.serviceCtrl.stopFlowCtrlTimeout();

	//var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "onShutterClosed" + top.jrn.strLineFeed;
	//top.journalPrinter.addCashJournalWithTime(strJrn,true);
	
	  top.deposit.CimEnr.clearAll();
	  if (typeof(top.MainFrame.onShutterClosed) == "function")
	    top.MainFrame.onShutterClosed();
   }  

  /*
	  ˽�к���:�����豸����
	*/
   this.onAcShutterNotClosed = function()
   {
	 top.journalPrinter.addCashJournalWithTime("���Ź���:onAcShutterNotClosed", false);	   
	 top.serviceCtrl.stopFlowCtrlTimeout();
	
	//var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "onAcShutterNotClosed" + top.jrn.strLineFeed;
	//top.journalPrinter.addCashJournalWithTime(strJrn,true);
	
	 top.deposit.CimEnr.clearAll();
	 if (typeof(top.MainFrame.onAcShutterNotClosed) == "function")
	   top.MainFrame.onAcShutterNotClosed();
	} 
}
