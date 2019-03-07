/*
  ����֤��
 */
function IDCardReader()
{ 
  var isOK = true;//��ȡ���֤��Ϣ�Ƿ�Ϸ�,Ĭ���ǺϷ�
  // ����֤��ģ���¼���Ӧ����
  this.IDCardEvents = new top.EventHandling(top.YHAXIDCardReader);
  
  /*�ȴ��û���������֤����ȡ����*/
  this.accept = function()
  {
	isOK = true;
    top.idCardReader.IDCardEvents.clearAll();
    top.idCardReader.IDCardEvents.appendEvent("CardInserted", top.idCardReader.onCardInserted);
    top.idCardReader.IDCardEvents.appendEvent("CardReaded", top.idCardReader.onCardReaded);
    top.idCardReader.IDCardEvents.appendEvent("CardInvalid", top.idCardReader.onCardInvalid);
    top.idCardReader.IDCardEvents.appendEvent("Timeout", top.idCardReader.onTimeout);
    top.idCardReader.IDCardEvents.appendEvent("DeviceError", top.idCardReader.onDeviceError);
	top.idCardReader.IDCardEvents.appendEvent("FatalError", top.idCardReader.onDeviceError);
    top.YHAXIDCardReader.AcceptAndReadData("3,FRONTIMAGE,BACKIMAGE", 120*1000);
	// ����ָʾ��
    try{top.guidelights.setEnvelopeDispenserLight("MEDIUM");}catch(e){}
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("�ȴ��û��������֤ IDCardReader Event accept"); 
  }

  /*����֤����ص�����*/
  this.onCardInserted = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���֤�Ѳ��� IDCardReader Event onCardInserted"); 
	// ����ָʾ��
    try{top.guidelights.setEnvelopeDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardInserted_ID) == "function")
      top.MainFrame.onCardInserted_ID();
  }
  
   /*�ȴ������˲�������֤����ȡ����*/
  this.acceptAgent = function()
  {
    top.idCardReader.IDCardEvents.clearAll();
    top.idCardReader.IDCardEvents.appendEvent("CardInserted", top.idCardReader.onCardInserted);
    top.idCardReader.IDCardEvents.appendEvent("CardReaded", top.idCardReader.onAgentCardReaded);
    top.idCardReader.IDCardEvents.appendEvent("CardInvalid", top.idCardReader.onCardInvalid);
    top.idCardReader.IDCardEvents.appendEvent("Timeout", top.idCardReader.onTimeout);
    top.idCardReader.IDCardEvents.appendEvent("DeviceError", top.idCardReader.onDeviceError);
	top.idCardReader.IDCardEvents.appendEvent("FatalError", top.idCardReader.onDeviceError);
    top.YHAXIDCardReader.AcceptAndReadData("3,FRONTIMAGE,BACKIMAGE", 120*1000);
	// ����ָʾ��
    try{top.guidelights.setEnvelopeDispenserLight("MEDIUM");}catch(e){}
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("�ȴ������˲������֤ IDCardReader Event acceptAgent"); 
  }
  
    /*��ȡ�����˶���֤��Ϣ��ɻص�����*/
  this.onAgentCardReaded = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��ȡ���������֤��Ϣ��� IDCardReader Event onAgentCardReaded"); 
	top.idCardReader.IDCardEvents.clearAll();
	var strIDData = top.YHAXIDCardReader.SFZDataInfo;//���֤��Ϣ
	if (strIDData.indexOf("|") > 0) {//�ж��������Ƿ���ڡ�|������ֹ�����֤��ʱ�򣬲��������п�
	   isOK = true;
	   top.pool.set("strAgentIDName", strIDData.split("|")[0].substr(strIDData.split("|")[0].indexOf('=') + 1, strIDData.split("|")[0].length));
	   top.pool.set("strAgentIDSex", strIDData.split("|")[1].substr(strIDData.split("|")[1].indexOf('=') + 1, strIDData.split("|")[1].length));
	   if(null != top.pool.get("strAgentIDSex") && top.pool.get("strAgentIDSex") == "��") {
		   top.pool.set("strAgentIDSexNum", "1");
	   }else if(null != top.pool.get("strAgentIDSex") && top.pool.get("strAgentIDSex") == "Ů") {
		   top.pool.set("strAgentIDSexNum", "0");
	   }else {
		   top.pool.set("strAgentIDSexNum", "9");
	   }
	   top.pool.set("strAgentIDNation", strIDData.split("|")[2].substr(strIDData.split("|")[2].indexOf('=') + 1, strIDData.split("|")[2].length));
	   top.pool.set("strAgentIDBorn", strIDData.split("|")[3].substr(strIDData.split("|")[3].indexOf('=') + 1, strIDData.split("|")[3].length));
	   top.pool.set("strAgentIDAddress", strIDData.split("|")[4].substr(strIDData.split("|")[4].indexOf('=') + 1, strIDData.split("|")[4].length));
	   top.pool.set("strAgentIDCardNum", strIDData.split("|")[5].substr(strIDData.split("|")[5].indexOf('=') + 1, strIDData.split("|")[5].length));
	   top.pool.set("strAgentIDGrantDept", strIDData.split("|")[6].substr(strIDData.split("|")[6].indexOf('=') + 1, strIDData.split("|")[6].length));
	   top.pool.set("strAgentIDBegin", strIDData.split("|")[7].substr(strIDData.split("|")[7].indexOf('=') + 1, strIDData.split("|")[7].length));
	   var strAgentIDEndDate = strIDData.split("|")[8].substr(strIDData.split("|")[8].indexOf('=') + 1, strIDData.split("|")[8].length);
	   if(null != strAgentIDEndDate && strAgentIDEndDate.indexOf("����") != -1) {
		   top.pool.set("strAgentIDEnd", "20991231");
	   }else {
		   top.pool.set("strAgentIDEnd", strAgentIDEndDate);
	   }
	   top.pool.set("strAgentIDPhotoName", strIDData.split("|")[9].substr(strIDData.split("|")[9].indexOf('=') + 1, strIDData.split("|")[9].length));
	   if (typeof(top.MainFrame.onAgentCardReaded) == "function"){ 
          top.MainFrame.onAgentCardReaded();
       }
	}
	else{
	  isOK = false;
	  if (typeof(top.MainFrame.onServiceFailed) == "function"){ 
         top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_ID_READFAILED, "��ȡ���֤��Ϣʧ��");
      }
	}
  }
  
  /*��ȡ����֤��Ϣ��ɻص�����*/
  this.onCardReaded = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��ȡ���֤��Ϣ��� IDCardReader Event onCardReaded");
	top.idCardReader.IDCardEvents.clearAll();
	var strIDData = top.YHAXIDCardReader.SFZDataInfo;//���֤��Ϣ
	if (strIDData.indexOf("|") > 0) {//�ж��������Ƿ���ڡ�|������ֹ�����֤��ʱ�򣬲��������п�
	   isOK = true;
	   top.pool.set("strIDName", strIDData.split("|")[0].substr(strIDData.split("|")[0].indexOf('=') + 1, strIDData.split("|")[0].length));
	   top.pool.set("strIDSex", strIDData.split("|")[1].substr(strIDData.split("|")[1].indexOf('=') + 1, strIDData.split("|")[1].length));
	   if(null != top.pool.get("strIDSex") && top.pool.get("strIDSex") == "��") {
		   top.pool.set("strIDSexNum", "1");
	   }else if(null != top.pool.get("strIDSex") && top.pool.get("strIDSex") == "Ů") {
		   top.pool.set("strIDSexNum", "0");
	   }else {
		   top.pool.set("strIDSexNum", "9");
	   }
	   top.pool.set("strIDNation", strIDData.split("|")[2].substr(strIDData.split("|")[2].indexOf('=') + 1, strIDData.split("|")[2].length));
	   top.pool.set("strIDBorn", strIDData.split("|")[3].substr(strIDData.split("|")[3].indexOf('=') + 1, strIDData.split("|")[3].length));
	   top.pool.set("strIDAddress", strIDData.split("|")[4].substr(strIDData.split("|")[4].indexOf('=') + 1, strIDData.split("|")[4].length));
	   top.pool.set("strIDCardNum", strIDData.split("|")[5].substr(strIDData.split("|")[5].indexOf('=') + 1, strIDData.split("|")[5].length));
	   top.pool.set("strIDGrantDept", strIDData.split("|")[6].substr(strIDData.split("|")[6].indexOf('=') + 1, strIDData.split("|")[6].length));
	   top.pool.set("strIDBegin", strIDData.split("|")[7].substr(strIDData.split("|")[7].indexOf('=') + 1, strIDData.split("|")[7].length));
	   var strIDEndDate = strIDData.split("|")[8].substr(strIDData.split("|")[8].indexOf('=') + 1, strIDData.split("|")[8].length);
	   if(strIDEndDate != null && strIDEndDate.indexOf("����") != -1) {
		   top.pool.set("strIDEnd", "20991231");
	   }else {
		   top.pool.set("strIDEnd", strIDEndDate);
	   }
	   top.pool.set("strIDPhotoName", strIDData.split("|")[9].substr(strIDData.split("|")[9].indexOf('=') + 1, strIDData.split("|")[9].length));
	   if (typeof(top.MainFrame.onCardReaded) == "function"){ 
          top.MainFrame.onCardReaded();
       }
	}
	else{
	  isOK = false;
	  if (typeof(top.MainFrame.onServiceFailed) == "function"){ 
         top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_ID_READFAILED, "��ȡ���֤��Ϣʧ��");
      }
	}
  }

  /*��Ч����֤�ص�����*/
  this.onCardInvalid = function()
  {
	isOK = false;
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��Ч���֤ IDCardReader Event onCardInvalid");
    top.idCardReader.IDCardEvents.clearAll();
	if(top.idCardReader.isCardPresent())//������֤���ڣ�ֱ���˳����֤
	{
	   top.YHAXIDCardReader.Eject(120*1000);
	}
    if (typeof(top.MainFrame.onCardInvalid_ID) == "function")
      top.MainFrame.onCardInvalid_ID();
  }

  /*������֤��ʱ*/
  this.onTimeout = function()
  {
	isOK = false;
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��ȡ���֤��Ϣ��ʱ IDCardReader Event onTimeout");
	top.idCardReader.IDCardEvents.clearAll();
	if(top.idCardReader.isCardPresent())//������֤���ڣ�ֱ���˳����֤
	{
	   top.YHAXIDCardReader.Eject(120*1000);
	}
  	// ����ָʾ��
    try{top.guidelights.setEnvelopeDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout_ID) == "function")
      top.MainFrame.onTimeout_ID();
  }

  /*Ӳ�����ϻص�����*/
  this.onDeviceError = function()
  {
	isOK = false;
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���֤������Ӳ��ģ����� IDCardReader Event onDeviceError");
    top.idCardReader.IDCardEvents.clearAll();
	if(top.idCardReader.isCardPresent())//������֤���ڣ�ֱ���˳����֤
	{
	   top.YHAXIDCardReader.Eject(120*1000);
	}
    if (typeof(top.MainFrame.onDeviceError_ID) == "function")
      top.MainFrame.onDeviceError_ID();
    else if (typeof(top.onDeviceError_ID) == "function")
      top.onDeviceError_ID();
  }

  /*ȡ�����������֤*/
  this.cancelAccept = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ȡ������������֤ IDCardReader Commond cancelAccept");
    top.idCardReader.IDCardEvents.appendEvent("CardAcceptCancelled", top.idCardReader.onCardAcceptCancelled);
	top.idCardReader.IDCardEvents.appendEvent("DeviceError", top.idCardReader.onDeviceError);
	top.idCardReader.IDCardEvents.appendEvent("FatalError", top.idCardReader.onDeviceError);
    top.YHAXIDCardReader.CancelAccept();
	// ����ָʾ��
    try{top.guidelights.setEnvelopeDispenserLight("OFF");}catch(e){}
  }

  /*ȡ������������֤�ص�����*/
  this.onCardAcceptCancelled = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ȡ������������֤ IDCardReader Event onCardAcceptCancelled"); 
    top.idCardReader.IDCardEvents.clearAll();
    if (typeof(top.MainFrame.onCardAcceptCancelled_ID) == "function")
      top.MainFrame.onCardAcceptCancelled_ID();
  } 

  /*ģ�鸴λ��*/
  this.reset = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���֤ģ�鸴λ IDCardReader Commond reset"); 
    top.idCardReader.IDCardEvents.clearAll();
    top.idCardReader.IDCardEvents.appendEvent("ResetComplete", top.idCardReader.onResetComplete);
	top.idCardReader.IDCardEvents.appendEvent("DeviceError", top.idCardReader.onDeviceError);
	top.idCardReader.IDCardEvents.appendEvent("FatalError", top.idCardReader.onDeviceError);
    top.YHAXIDCardReader.Reset();
  }

  /*��λ��ɻص�����*/
  this.onResetComplete = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���֤ģ�鸴λ��� IDCardReader Event onResetComplete"); 
    top.idCardReader.IDCardEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_ID) == "function")
      top.MainFrame.onResetComplete_ID();
  }

  /*�˶���֤*/
  this.eject = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�˳����֤ IDCardReader Commond eject"); 
    top.idCardReader.IDCardEvents.clearAll();
	top.idCardReader.IDCardEvents.appendEvent("CardEjected", top.idCardReader.onCardEjected);
    top.idCardReader.IDCardEvents.appendEvent("CardTaken", top.idCardReader.onCardTaken);
    top.idCardReader.IDCardEvents.appendEvent("Timeout", top.idCardReader.onTimeout);
    top.idCardReader.IDCardEvents.appendEvent("DeviceError", top.idCardReader.onDeviceError);
	top.idCardReader.IDCardEvents.appendEvent("FatalError", top.idCardReader.onDeviceError);
    top.YHAXIDCardReader.Eject(120*1000);
  }

  /*����֤���˳��ص�����*/
  this.onCardEjected = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���֤���˳� IDCardReader Event onCardEjected"); 
	// ����ָʾ��
    try{top.guidelights.setEnvelopeDispenserLight("QUICK");}catch(e){}
    if (typeof(top.MainFrame.onCardEjected_ID) == "function")
      top.MainFrame.onCardEjected_ID();
  }

  /*����֤���˳��ص�����*/
  this.onCardTaken = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���֤��ȡ�� IDCardReader Event onCardTaken"); 
    top.idCardReader.IDCardEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setEnvelopeDispenserLight("OFF");}catch(e){}
	if(isOK){//���֤��ȡ�ɹ��Ž��������˲�
	   //���������˲�����
       top.idCardReader.idCardTakenComplete();
	}
  }
  
  /*����֤ȡ�ߴ���*/
  this.idCardTakenComplete = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���֤��ȡ�߽��������˲� IDCardReader Commond idCardTakenComplete");
	if (typeof(top.MainFrame.IDCardTakenComplete) == "function"){
	    top.MainFrame.IDCardTakenComplete();
	}else{
	    //ֱ�ӽ��������˲�����
	    top.serviceCtrl.stopUserTimeout();
	    top.wins.showNewProcessingTip(top.langcur.send910201);
        top.trans.send910201Async();
	}
  }
  
  
  //------------------------- ������������ -------------------------//

  /*�ж����֤���������Ƿ�������֤*/
  this.isCardPresent = function()
  {
    return (top.YHAXIDCardReader.StMediaStatus == "PRESENT");
  }
}
