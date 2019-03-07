/*
  ������������
 */
function CardReader()
{
  // ��������ģ���¼���Ӧ����
  this.CardReadEvents = new top.EventHandling(top.YHAXCardReader);
  //------------------------- ������������˽������ -------------------------//
  /*�������Ƿ�֧���̿�*/
  this.CpCanCapture = top.YHAXCardReader.CpCanCapture;
  /* �˳�����ȴ��û�ȡ��ʱ�� ��λ���룩*/
  this.EjectTimeout = 120;
  //------------------------- ������ִ�еķ��� -------------------------//
  var isSM4 = -1;//�Ƿ�֧�ֹ����㷨��־

  this.strField55Value ="";	//55��
  /*����忨*/
  this.accept = function(timeout)
  {
	top.journalPrinter.addJournalWithTime("����忨 CardReader command accept");
	top.pool.set("strPinBlock", "");//��ֹ���ܵ�ʱ�򣬰��ϴε�PinBlockȡ����
	var cardReadTimeout = 125*1000;
	if(timeout == -1){
		cardReadTimeout = timeout;
	}
    top.cardreader.CardReadEvents.clearAll();
    top.cardreader.CardReadEvents.appendEvent("CardInserted", top.cardreader.onCardInserted);
    top.cardreader.CardReadEvents.appendEvent("CardAccepted", top.cardreader.onCardAccepted);
    top.cardreader.CardReadEvents.appendEvent("CardInvalid", top.cardreader.onCardInvalid);
	top.cardreader.CardReadEvents.appendEvent("Timeout", top.cardreader.onTimeout_accept);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onDeviceError);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onDeviceError);
    top.cardreader.CardReadEvents.appendEvent("CardAcceptCancelled", top.cardreader.onCardAcceptCancelled);
    top.YHAXCardReader.AcceptAndReadAvailableTracks("2,3,CHIP", cardReadTimeout);
    // ����ָʾ��
    try{top.guidelights.setCardReaderLight("MEDIUM");}catch(e){}
  }

  /*������忨*/
  this.cancelAccept = function()
  {
	 top.journalPrinter.addJournalWithTime("ȡ������忨 CardReader command cancelAccept");
     top.cardreader.CardReadEvents.appendEvent("CardAcceptCancelled", top.cardreader.onCardAcceptCancelled);
	 top.YHAXCardReader.CancelAccept();
  }

  /*�˿�*/
  this.eject = function()
  {
	top.journalPrinter.addJournalWithTime("�˿� CardReader command eject");
    top.cardreader.CardReadEvents.clearAll();
    top.cardreader.CardReadEvents.appendEvent("CardEjected", top.cardreader.onCardEjected);
    top.cardreader.CardReadEvents.appendEvent("Timeout", top.cardreader.onTimeout_Eject);
    top.cardreader.CardReadEvents.appendEvent("CardTaken", top.cardreader.onCardTaken);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onDeviceError);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onDeviceError);
    top.YHAXCardReader.Eject(this.EjectTimeout*1000);
  }

  /*��������λ*/
  this.reset = function ()
  {
	top.journalPrinter.addJournalWithTime("��λ CardReader command reset");
	top.cardreader.CardReadEvents.appendEvent("ResetComplete", top.cardreader.onResetComplete);
	top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onDeviceError);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onDeviceError);
    top.YHAXCardReader.Reset("RETRACT");
  }

  /*IC������*/
  this.ICTask = function ()
  {
      top.journalPrinter.addJournalWithTime("��ȡIC����Ϣ ");
	  var ret = top.YHAXCardReader.ICT_Connect();//����Ӧ�ò��������ͨ����֮������ӣ�оƬ��ʹ��
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC������ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  ret = top.YHAXCardReader.ICT_CreateAppList();//�����ն˺Ϳ�Ƭͬʱ֧�ֵ�Ӧ���б�
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC������Ӧ���б�ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  var strAppValue = top.YHAXCardReader.ICT_GetAppListEx(20);//�����ն˺Ϳ�Ƭͬʱ֧�ֵ�Ӧ���б�
	  ret = strAppValue.split("|")[0];
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC����ȡ��ѡӦ���б�ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //���ص�Ӧ���б�����,Ŀǰ���еĿ����Ƿ���һ������ʱ��Ҫѭ���ж���
	  var appCount = strAppValue.split("|")[1];
	  if(appCount <= 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC����ȡ��ѡӦ���б�ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //���ص�Ӧ���б�
	  var aidtemp = strAppValue.split("|")[2];
	  if(aidtemp == 0 || aidtemp == ""){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC��Ӧ��ѡ��ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  var aid = aidtemp.substr(0,aidtemp.indexOf(' '));
	  ret = top.YHAXCardReader.ICT_AppSelect(aid);//Ӧ��ѡ��
      //�ж��Ƿ��������Ƿ��ǵ����ֽ��������	 
	  if(ret != 0){
		 if(ret == 11 && top.pool.get("isLockTrans")=="1"){
			// ��¼�ն���ˮ
			top.journalPrinter.addJournalWithTime("�����ֽ����� ");
			top.pool.set("isCardLock","1");  
		 }else{	
			// ��¼�ն���ˮ
			top.journalPrinter.addJournalWithTime("IC��Ӧ��ѡ��ʧ�� ");
			if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
				top.MainFrame.onICCardInitFailed();
			}
			return;
		 }
	  }else{
		  //��ҽ��׵��ǵ����ֽ�δ����
		  if(top.pool.get("isLockTrans")=="1"){
			top.journalPrinter.addJournalWithTime("��ҵ����ֽ�δ�� ");
			top.pool.set("isCardLock","0");
		  }	
	  }
	  ret = top.YHAXCardReader.ICT_AppInit();//Ӧ�ó�ʼ��
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC��Ӧ�ó�ʼ��ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //��ȡ�����к�5F34
	  var str5F34Data = top.YHAXCardReader.ICT_GetValueEx(0x5F34);
	  str5F34Data =  new top.StringCtrl(str5F34Data.split("|")[1]).trim();
	  top.pool.set("str5F34",new top.StringCtrl(str5F34Data).prefixStr('0',3));

	  //��ȡ�����ֽ��ֵ����
	  var str9F77Data = top.YHAXCardReader.ICT_GetDataEx(0x9F77);
	  var ret = str9F77Data.split("|")[0];
	  if(ret != 0){
		 var strJrn = new top.StringCtrl("IC��оƬ��ȡʧ�� "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
         top.journalPrinter.addJournalWithTime("IC��оƬ��ȡʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }else{
		var strICDataF = (str9F77Data.split("|")[1].replace(/\b(0+)/gi,"")).replace(/(^\s+)|(\s+$)/g, "");
		if(strICDataF == null ||  strICDataF == ""){
			top.pool.set("strICLimitAmount", "1,000.00");
		}else{
			top.pool.set("strICLimitAmount", new top.StringCtrl(parseInt(strICDataF) /100).formatNumber(2));
		}
	 }

	  var strICData = top.YHAXCardReader.ICT_GetValueEx(0x57);
	  ret = strICData.split("|")[0];
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC����ȡ�ŵ���Ϣʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  } else{
         top.journalPrinter.addJournalWithTime("IC����ʼ����� ");
		 //�ж��Ƿ��߹�������
		 top.cardreader.checkSM4(strICData);
	  }
  }
  //Ӧ�ó�ʼ������
  this.appInit = function()
  {
	  var ret;
	  ret = top.YHAXCardReader.ICT_CreateAppList();//�����ն˺Ϳ�Ƭͬʱ֧�ֵ�Ӧ���б�
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC������Ӧ���б�ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  var strAppValue = top.YHAXCardReader.ICT_GetAppListEx(20);//�����ն˺Ϳ�Ƭͬʱ֧�ֵ�Ӧ���б�
	  ret = strAppValue.split("|")[0];
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC����ȡ��ѡӦ���б�ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //���ص�Ӧ���б�����,Ŀǰ���еĿ����Ƿ���һ������ʱ��Ҫѭ���ж���
	  var appCount = strAppValue.split("|")[1];
	  if(appCount <= 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC����ȡ��ѡӦ���б�ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //���ص�Ӧ���б�
	  var aidtemp = strAppValue.split("|")[2];
	  if(aidtemp == 0 || aidtemp == ""){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC��Ӧ��ѡ��ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  var aid = aidtemp.substr(0,aidtemp.indexOf(' '));
	  ret = top.YHAXCardReader.ICT_AppSelect(aid);//Ӧ��ѡ��	 
	  if(ret != 0){
		 if(ret == 11 && top.pool.get("isLockTrans")=="1"){
			// ��¼�ն���ˮ
			top.journalPrinter.addJournalWithTime("�����ֽ����� ");
			top.pool.set("isCardLock","1");  
		 }else{	
			 // ��¼�ն���ˮ
			 top.journalPrinter.addJournalWithTime("IC��Ӧ��ѡ��ʧ�� ");		 
			 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
				top.MainFrame.onICCardInitFailed();
			 }
			 return;
		 }
	  }else{
		  //��ҽ��׵��ǵ����ֽ�δ����
		  if(top.pool.get("isLockTrans")=="1"){
			top.journalPrinter.addJournalWithTime("��ҵ����ֽ�δ�� ");
			top.pool.set("isCardLock","0");
		  }		  
	  }
	  ret = top.YHAXCardReader.ICT_AppInit();//Ӧ�ó�ʼ��
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC��Ӧ�ó�ʼ��ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
  }
  //�ն���Ϊ��������
  this.terminalActAnaly =function()
  {
	 var ret;
	  ret = top.YHAXCardReader.ICT_ProRestr();//���״�������
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC�����״�������ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
	  }
	  ret = top.YHAXCardReader.ICT_CardHolderVeri();//�ֿ�����֤
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC���ֿ�����֤ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
	  }
	  ret = top.YHAXCardReader.ICT_TerminalRiskManage();//�ն˷��չ���
	  if(ret != 0){
		 // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC���ն˷��չ���ʧ�� ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
	  }
	  ret = top.YHAXCardReader.ICT_TerminalActAnaly();//�ն���Ϊ����
	  if(ret != 0){
		 if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){
			// ��¼�ն���ˮ
			top.journalPrinter.addJournalWithTime("����IC���ն���Ϊ����ʧ�� ");					
		 }else{
			 // ��¼�ն���ˮ
			 top.journalPrinter.addJournalWithTime("IC���ն���Ϊ����ʧ�� ");
			 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
				top.MainFrame.onICCardInitFailed();
			 }
		 }
	  }
	  return ret;
  }

  //�ж��Ƿ��߹�������
  this.checkSM4 = function(strICData)
  {
		//�����жϿ��Ƿ��ǹ��ܿ�������ȡ��9F38��Ȼ���ж�9F38���Ƿ����DF69������DF69��ֵΪ01
		var str9F38Data = top.YHAXCardReader.ICT_GetValueEx(0x9F38);
		if(str9F38Data.indexOf("DF69") > 0){//����DF69
		    var strDF69Data = top.YHAXCardReader.ICT_GetValueEx(0xDF69);
		    var strDF69Flag = new top.StringCtrl(strDF69Data.split("|")[1]).trim();
		    if(strDF69Data.split("|")[0] =="0" && strDF69Flag == "01"){//��Ϊ֧�ֹ����㷨
		        isSM4 = 0;
		    }else{
		        isSM4 = -1;
		    }
		}else{
		    isSM4 = -1;
		}
		//�жϵ�ǰ�Ƿ���ڹ�����Կ
		var isSM4PINKey = top.YHAXPinPad.IsValidEncryptionKeySync("SM4PINKey");
		if(isSM4 == 0 && top.YHAXPinPad.CpSuportSM4 && isSM4PINKey){//�߹�������
			top.journalPrinter.addJournalWithTime("YHAXPinPad.PinMode SM4");
		    top.YHAXPinPad.PinMode = "SM4";//����������ù���ģʽ
		    top.YHAXCardReader.ICT_SetValue(0xDF69,"01");//���û����������㷨��־
		    top.pool.set("strEncrypType", "SM4");
		}else{//�߹�����Կ����
		    top.YHAXPinPad.PinMode = "NORMAL";//�������������ͨģʽ
		    top.YHAXCardReader.ICT_SetValue(0xDF69,"00");//���û����������㷨��־
		    top.pool.set("strEncrypType", "NORMAL");
		}
		var track2 = strICData.split("|")[1].replace("D","=")
		//ȡ55������,������
		top.pool.set("strField55", "");
		if(top.cardreader.getField55() != null && top.cardreader.getField55() != ""){
			top.pool.set("strField55", top.cardreader.getField55());
		}
		top.pool.set("strICFlag", "1");
        top.pool.set("strTrack2", track2);
		top.pool.set("strPan",track2.split("=")[0]);
		if (typeof(top.MainFrame.onCardAccepted) == "function"){
			top.MainFrame.onCardAccepted();
		}
  }

  //��װ55������
  this.getField55 = function()
  {
	  var field55 = top.cardreader.getTag9F26() + top.cardreader.getTag9F10() + top.cardreader.getTag9F37()
	              + top.cardreader.getTag9F36() + top.cardreader.getTag95() + top.cardreader.getTag9A()
				  + top.cardreader.getTag82() + top.cardreader.getTag9F1A() + top.cardreader.getTag9F33()
				  + top.cardreader.getTag9F1E() + top.cardreader.getTag84() + top.cardreader.getTag9F41()
				  + top.cardreader.getTag9F27() + top.cardreader.getTag9C() + top.cardreader.getTag9F02()
				  + top.cardreader.getTag5F2A() + top.cardreader.getTag9F03() + top.cardreader.getTag9F34()
				  + top.cardreader.getTag9F35() + top.cardreader.getTag9F08() + top.cardreader.getTag9F09()
				  + top.cardreader.getTagDF31();
	  // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ55������: ["+field55 +"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return field55;
  }

  //ȡ9F26ֵ
  this.getTag9F26 = function()
  {
	  var tag9F26 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F26).split("|")[1]).trim();;
	  var tag9F26Len = new top.StringCtrl((new top.StringCtrl(tag9F26).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F26ֵ: ����["+tag9F26Len +"]  ֵ["+tag9F26+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F26" + tag9F26Len + tag9F26;
  }

  //ȡ9F10ֵ
  this.getTag9F10 = function()
  {
	  var tag9F10 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F10).split("|")[1]).trim();;
	  var tag9F10Len = new top.StringCtrl((new top.StringCtrl(tag9F10).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
     // var strJrn = new top.StringCtrl("��ȡ9F10ֵ: ����["+tag9F10Len +"]  ֵ["+tag9F10+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
     // top.journalPrinter.addJournal(strJrn);
	  return "9F10" + tag9F10Len + tag9F10;
  }

  //ȡ9F37ֵ
  this.getTag9F37 = function()
  {
	  var tag9F37 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F37).split("|")[1]).trim();;
	  var tag9F37Len = new top.StringCtrl((new top.StringCtrl(tag9F37).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F37ֵ: ����["+tag9F37Len +"]  ֵ["+tag9F37+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F37" + tag9F37Len + tag9F37;
  }

  //ȡ9F36ֵ
  this.getTag9F36 = function()
  {
	  var tag9F36 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F36).split("|")[1]).trim();;
	  var tag9F36Len = new top.StringCtrl((new top.StringCtrl(tag9F36).trim().length/2).toString(16)).prefixStr('0',2);
	  // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F36ֵ: ����["+tag9F36Len +"]  ֵ["+tag9F36+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F36" + tag9F36Len + tag9F36;
  }

  //ȡ95ֵ
  this.getTag95 = function()
  {
	  var tag95 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x95).split("|")[1]).trim();;
	  var tag95Len = new top.StringCtrl((new top.StringCtrl(tag95).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ95ֵ: ����["+tag95Len +"]  ֵ["+tag95+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "95" + tag95Len + tag95;
  }

  //ȡ9Aֵ
  this.getTag9A = function()
  {
	  var tag9A = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9A).split("|")[1]).trim();;
	  var tag9ALen = new top.StringCtrl((new top.StringCtrl(tag9A).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9Aֵ: ����["+tag9ALen +"]  ֵ["+tag9A+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9A" + tag9ALen + tag9A;
  }

  //ȡ82ֵ
  this.getTag82 = function()
  {
	  var tag82 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x82).split("|")[1]).trim();;
	  var tag82Len = new top.StringCtrl((new top.StringCtrl(tag82).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ82ֵ: ����["+tag82Len +"]  ֵ["+tag82+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "82" + tag82Len + tag82;
  }

  //ȡ9F1Aֵ
  this.getTag9F1A = function()
  {
	  var tag9F1A = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F1A).split("|")[1]).trim();;
	  var tag9F1ALen = new top.StringCtrl((new top.StringCtrl(tag9F1A).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F1Aֵ: ����["+tag9F1ALen +"]  ֵ["+tag9F1A+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F1A" + tag9F1ALen + tag9F1A;
  }

  //ȡ9F33ֵ
  this.getTag9F33 = function()
  {
	  var tag9F33= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F33).split("|")[1]).trim();;
	  var tag9F33Len = new top.StringCtrl((new top.StringCtrl(tag9F33).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F33ֵ: ����["+tag9F33Len +"]  ֵ["+tag9F33+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F33" + tag9F33Len + tag9F33;
  }

  //ȡ9F1Eֵ
  this.getTag9F1E = function()
  {
	  var tag9F1E= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F1E).split("|")[1]).trim();;
	  var tag9F1ELen = new top.StringCtrl((new top.StringCtrl(tag9F1E).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F1Eֵ: ����["+tag9F1ELen +"]  ֵ["+tag9F1E+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F1E" + tag9F1ELen + tag9F1E;
  }

  //ȡ84ֵ
  this.getTag84 = function()
  {
	  var tag84= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x84).split("|")[1]).trim();;
	  var tag84Len = new top.StringCtrl((new top.StringCtrl(tag84).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ84ֵ: ����["+tag84Len +"]  ֵ["+tag84+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "84" + tag84Len + tag84;
  }

  //ȡ9F41ֵ
  this.getTag9F41 = function()
  {
	  var tag9F41= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F41).split("|")[1]).trim();;
	  var tag9F41Len = new top.StringCtrl((new top.StringCtrl(tag9F41).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F41ֵ: ����["+tag9F41Len +"]  ֵ["+tag9F41+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F41" + tag9F41Len + tag9F41;
  }

  //ȡ9F27ֵ
  this.getTag9F27 = function()
  {
	  var tag9F27= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F27).split("|")[1]).trim();;
	  var tag9F27Len = new top.StringCtrl((new top.StringCtrl(tag9F27).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F27ֵ: ����["+tag9F27Len +"]  ֵ["+tag9F27+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F27" + tag9F27Len + tag9F27;
  }

  //ȡ9Cֵ
  this.getTag9C = function()
  {
	  var tag9C= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9C).split("|")[1]).trim();;
	  var tag9CLen = new top.StringCtrl((new top.StringCtrl(tag9C).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9Cֵ: ����["+tag9CLen +"]  ֵ["+tag9C+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9C" + tag9CLen + tag9C;
  }

  //ȡ9F02ֵ
  this.getTag9F02 = function()
  {
	  var tag9F02= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F02).split("|")[1]).trim();;
	  var tag9F02Len = new top.StringCtrl((new top.StringCtrl(tag9F02).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F02ֵ: ����["+tag9F02Len +"]  ֵ["+tag9F02+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F02" + tag9F02Len + tag9F02;
  }

  //ȡ5F2Aֵ
  this.getTag5F2A = function()
  {
	  var tag5F2A= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x5F2A).split("|")[1]).trim();;
	  var tag5F2ALen = new top.StringCtrl((new top.StringCtrl(tag5F2A).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ5F2Aֵ: ����["+tag5F2ALen +"]  ֵ["+tag5F2A+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "5F2A" + tag5F2ALen + tag5F2A;
  }

  //ȡ9F03ֵ
  this.getTag9F03 = function()
  {
	  var tag9F03= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F03).split("|")[1]).trim();;
	  var tag9F03Len = new top.StringCtrl((new top.StringCtrl(tag9F03).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F03ֵ: ����["+tag9F03Len +"]  ֵ["+tag9F03+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F03" + tag9F03Len + tag9F03;
  }

  //ȡ9F34ֵ
  this.getTag9F34 = function()
  {
	  var tag9F34= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F34).split("|")[1]).trim();
	  var tag9F34Len = new top.StringCtrl((new top.StringCtrl(tag9F34).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F34ֵ: ����["+tag9F34Len +"]  ֵ["+tag9F34+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F34" + tag9F34Len + tag9F34;
  }

  //ȡ9F35ֵ
  this.getTag9F35 = function()
  {
	  var tag9F35= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F35).split("|")[1]).trim();;
	  var tag9F35Len = new top.StringCtrl((new top.StringCtrl(tag9F35).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F35ֵ: ����["+tag9F35Len +"]  ֵ["+tag9F35+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F35" + tag9F35Len + tag9F35;
  }
  //ȡ9F08ֵ
  this.getTag9F08 = function()
  {
	  var tag9F08 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F08).split("|")[1]).trim();
	  var tag9F08Len = new top.StringCtrl((new top.StringCtrl(tag9F08).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F08ֵ: ����["+tag9F08Len +"]  ֵ["+tag9F08+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F08" + tag9F08Len + tag9F08;
  }

  //ȡDF31ֵ
  this.getTagDF31 = function()
  {
	  var tagDF31 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0xDF31).split("|")[1]).trim();
	  var tagDF31Len = new top.StringCtrl((new top.StringCtrl(tagDF31).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡDF31ֵ: ����["+tagDF31Len +"]  ֵ["+tagDF31+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "DF31" + tagDF31Len + tagDF31;
  }

  //ȡ9F09ֵ
  this.getTag9F09 = function()
  {
	  var tag9F09 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F09).split("|")[1]).trim();
	  var tag9F09Len = new top.StringCtrl((new top.StringCtrl(tag9F09).trim().length/2).toString(16)).prefixStr('0',2);
      // ��¼�ն���ˮ
      //var strJrn = new top.StringCtrl("��ȡ9F09ֵ: ����["+tag9F09Len +"]  ֵ["+tag9F09+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F09" + tag9F09Len + tag9F09;
  }

  /*����55��TAGֵ����*/
  this.issueReport = function(strFiled55)
  {
	 var ret = top.YHAXCardReader.ICT_IssueReport(strFiled55);
	 if(ret != 0){
	     // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("����55��TAGֵ����ʧ�� ");
	 }
	 return ret;
  }

  /*��������֤*/
  this.exterAuth = function()
  {
	 var ret = top.YHAXCardReader.ICT_ExterAuth();
	 if(ret != 0){
	     // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("��������֤ʧ�� ");
	 }
	 return ret;
  }

  /*��������*/
  this.busiAuthor = function(func)
  {
	 var ret = top.YHAXCardReader.ICT_BusiAuthor();
	 if(ret != 0){
	     // ��¼�ն���ˮ
         top.journalPrinter.addJournalWithTime("IC����������ʧ�� ");
		 //����ǽ���ҵ����ֽ��Ѿ�����
		 if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){
			 top.cardreader.issueScript(0x72,func);
		 }
	 }
	 else{
		top.cardreader.issueScript(0x72,func);
	 }
	 return ret;
  }

  /*�����нű�����*/
  this.issueScript = function(tager,func)
  {
	 var ret = top.YHAXCardReader.ICT_IssueScript(tager);
	 if(tager == 0x71){
		top.cardreader.busiAuthor(func);
	 }
	 else{
		 if(ret != 0){
			 // ��¼�ն���ˮ
			 top.journalPrinter.addJournal("�����нű�����ʧ�� ");
			 top.pool.set("strScriptRes","N");
			 //�����ֽ�������ײ�ִ�нű�֪ͨ
			 if(top.pool.get("isLockTrans")=="1"){
				if(typeof(eval(func))=="function")
				{
					eval(func+"();");
				}	
			 }else{
				//д��ʧ�ܺ���ű�֪ͨ����
				top.wins.showNewProcessingTip(top.langcur.oProcessingTipDef);
				top.trans.send902209Async(func);				 
			 }
		 }else{			 
			 top.pool.set("strScriptRes","Y");
			 //�����ֽ�������ײ�ִ�нű�֪ͨ
			if(top.pool.get("isLockTrans")=="1"){
				if(typeof(eval(func))=="function")
				{
					eval(func+"();");
				}	
			 }else{
				//д���ɹ�����ű�֪ͨ����
				top.wins.showNewProcessingTip(top.langcur.oProcessingTipDef);
				top.trans.send902209Async(func);			 
			 }
		 }
	 }
   }

  /*��ѯ��оƬ���*/
  this.queryBalance = function()
  {
    var strICData = top.YHAXCardReader.ICT_GetDataEx(0x9F79);
	var ret = strICData.split("|")[0];
	if(ret != 0){
	   // ��¼�ն���ˮ
       top.journalPrinter.addJournalWithTime("�����ֽ�����ѯʧ�� ");
	   if (typeof(top.MainFrame.onServiceFailed) == "function"){
          top.MainFrame.onServiceFailed("�����ֽ�����ѯʧ��",top.TERMRETCODE_IC_BALANCEQUERY,"�����ֽ�����ѯʧ��");
	   }
	}else{
	  if (typeof(top.MainFrame.onServiceSuccessful) == "function"){
		  var strICDataF = (strICData.split("|")[1].replace(/\b(0+)/gi,"")).replace(/(^\s+)|(\s+$)/g, "");
		  if(strICDataF == null ||  strICDataF == ""){
			   top.pool.set("strICAmount", "0.00");
		  }else{
		       top.pool.set("strICAmount", new top.StringCtrl(parseInt(strICDataF) / 100).formatNumber(2));
		  }
          top.MainFrame.onServiceSuccessful();
	  }
	}
  }

  /*��ѯ��оƬ������ϸ*/
  this.queryLoadDetail = function()
  {
    var strICInfoData = top.YHAXCardReader.ICT_GetLoadDetailEx(900);
	var ret = strICInfoData.split("|")[0];
	if(ret != 0 || strICInfoData.split("|")[1] < 90){//IC��оƬ��ÿ����¼�ĳ��ȵ���90
	   // ��¼�ն���ˮ
       top.journalPrinter.addJournalWithTime("�����ֽ�����ϸ��ѯʧ�� ");
	   if (typeof(top.MainFrame.onServiceFailed) == "function"){
          top.MainFrame.onServiceFailed("�����ֽ�����ϸ��ѯʧ��",top.TERMRETCODE_IC_QUERYLOADDETAIL,"�����ֽ�����ϸ��ѯʧ��");
	   }
	}else{
	  if (typeof(top.MainFrame.onServiceSuccessful) == "function"){
          top.MainFrame.onServiceSuccessful(new top.StringCtrl(strICInfoData.split("|")[2]).trim());
	  }
	}
  }

  /*��������ֹ��������¼���Ӧ*/
  this.onCardAcceptCancelled = function()
  {
    top.journalPrinter.addJournalWithTime("����������ȡ�� CardReader Event onCardAcceptCancelled ");
    top.cardreader.CardReadEvents.clearAll();
	// ����ָʾ��
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardAcceptCancelled) == "function"){
      top.MainFrame.onCardAcceptCancelled();
	}
  }

  /*������ʱ���¼���Ӧ*/
  this.onTimeout_accept = function()
  {
    top.journalPrinter.addJournalWithTime("������������ʱ CardReader Event onTimeout" );
	top.cardreader.CardReadEvents.clearAll();
    // ����ָʾ��
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}

    if (typeof(top.MainFrame.onTimeout_accept) == "function")
      top.MainFrame.onTimeout_accept();
  }

  /*���������Ѿ�������¼���Ӧ*/
  this.onCardInserted = function()
  {
    top.journalPrinter.addJournalWithTime("���Ѿ�����  CardReader Event onCardInserted");
    // ����ָʾ��
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}

    if (typeof(top.MainFrame.onCardInserted) == "function")
      top.MainFrame.onCardInserted();
  }

  /*���������Ѿ���������¼���Ӧ*/
  this.onCardAccepted = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���Ѿ����� CardReader Event onCardAccepted");
    top.cardreader.CardReadEvents.clearAll();
	var chipId = new top.StringCtrl("").byteArr2HexStr(top.YHAXCardReader.AnswerToReset);
	var track2 = top.YHAXCardReader.Track2;
	var track3 = top.YHAXCardReader.Track3;
    if(chipId !=null && chipId !=""){//IC��
	     top.wins.showNewProcessingTip("���ڶ�ȡ����Ϣ�����Ժ�...");
	     top.cardreader.ICTask();
	}
	else{//������
	    top.pool.set("strICFlag", "0");
		top.pool.set("strTrack2", track2);
		top.pool.set("strTrack3", track3);
		top.pool.set("strPan",track2.split("=")[0]);
		top.pool.set("strField55", this.strField55Value);
		top.YHAXPinPad.PinMode = "NORMAL";//�������������ͨģʽ
		top.YHAXCardReader.ICT_SetValue(0xDF69,"00");//���û����������㷨��־
		top.pool.set("strEncrypType", "NORMAL");
		if (typeof(top.MainFrame.onCardAccepted) == "function"){
			top.MainFrame.onCardAccepted();
		}
	}
  }

  /*������������Ч�����¼���Ӧ*/
  this.onCardInvalid = function()
  {
    top.journalPrinter.addJournalWithTime("��Ч�� CardReader Event onCardInvalid");
    top.cardreader.CardReadEvents.clearAll();
    if (typeof(top.MainFrame.onCardInvalid) == "function")
      top.MainFrame.onCardInvalid();
  }


   /*���������Ѿ����˳����¼���Ӧ*/
  this.onCardEjected = function()
  {
    top.journalPrinter.addJournalWithTime("���ɹ��˳� CardReader Event onCardEjected");
    // ����ָʾ��
    try{top.guidelights.setCardReaderLight("QUICK");}catch(e){}

    // ������ʾ��
    try{top.soundPlayer.TakeCardMusic();}catch(e){}

    if (typeof(top.MainFrame.onCardEjected) == "function")
      top.MainFrame.onCardEjected();
    else if (typeof(top.onCardEjected) == "function")
      top.onCardEjected();
  }

  /*���������Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onCardTaken = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("����ȡ�� CardReader Event onCardTaken" );

    top.cardreader.CardReadEvents.clearAll();
    // ����ָʾ��
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}

    if (typeof(top.MainFrame.onCardTaken) == "function")
      top.MainFrame.onCardTaken();
    else if (typeof(top.onCardTaken) == "function")
      top.onCardTaken();
  }

   /*�˳��Ŀ���ʱδ���ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onTimeout_Eject = function()
  {
    top.journalPrinter.addJournalWithTime("�˿���ʱ CardReader Event onTimeout_Eject");
	top.cardreader.CardReadEvents.clearAll();
    // �˿���ʱ���Զ��̿�
    top.cardreader.capture();
  }

  /*�̿�*/
  this.capture = function()
  {
    top.cardreader.CardReadEvents.clearAll();
    if (!top.YHAXCardReader.CpCanCapture)
    {
      // ��֧���̿��Ķ����������տ���ȡ�ߴ���
      top.cardreader.onCardTaken();
      return;
    }
	top.journalPrinter.addJournalWithTime("�̿� CardReader command capture");
    top.cardreader.CardReadEvents.appendEvent("CardTaken", top.cardreader.onCardTaken);
    top.cardreader.CardReadEvents.appendEvent("CardCaptured", top.cardreader.onCardCaptured);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onDeviceError4Capture);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onDeviceError4Capture);
    top.YHAXCardReader.Capture();
  }

  /*�̿�ʱ������Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError4Capture = function()
  {
    top.cardreader.CardReadEvents.appendEvent("ResetComplete", top.cardreader.onResetEnd4DevErr4CaptureRe);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onResetEnd4DevErr4CaptureRe);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onResetEnd4DevErr4CaptureRe);
    top.YHAXCardReader.Reset("RETRACT");
  }

  /*��ʱ������Ӳ�����Ϻ�λ�������¼���Ӧ*/
  this.onResetEnd4DevErr4CaptureRe = function()
  {
    top.cardreader.CardReadEvents.appendEvent("ResetComplete", top.cardreader.onResetEnd4DevErr4CaptureEj);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onResetEnd4DevErr4CaptureEj);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onResetEnd4DevErr4CaptureEj);
    // ����ʹ��EJECT�������ܽ�����⣬�е�Σ�գ�����û�ޡ��������ﲻ��������ҳ��Ҳ����ô����
    top.YHAXCardReader.Reset("EJECT");
  }


  /*�̿�ʱ������Ӳ�����Ϻ�λ�������¼���Ӧ*/
  this.onResetEnd4DevErr4CaptureEj = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�̿�ʧ�� CardReader Event onResetEnd4DevErr4CaptureEj");

    top.cardreader.CardReadEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_Idc) == "function")
      top.MainFrame.onDeviceError_Idc();
    else if (typeof(top.onDeviceError_Idc) == "function")
      top.onDeviceError_Idc();
  }

   /*���������Ѿ���������¼���Ӧ*/
  this.onCardCaptured = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("������ CardReader command onCardCaptured ");
    top.cardreader.CardReadEvents.clearAll();
	// ����������濨�����յ���Ϣ
    top.cardreader.sendCaptureStatus();
    if (typeof(top.MainFrame.onCardCaptured) == "function")
      top.MainFrame.onCardCaptured();
    else if (typeof(top.onCardCaptured) == "function")
      top.onCardCaptured();
  }

  /*������Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("���������� CardReader Event onDeviceError");
    top.cardreader.CardReadEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_Idc) == "function")
    {
      top.MainFrame.onDeviceError_Idc();
    }else if (typeof(top.onDeviceError_Idc) == "function")
    {
      top.onDeviceError_Idc();
    }else{}
  };

  /*��������λ�ɹ����¼���Ӧ*/
  this.onResetComplete = function()
  {
	top.journalPrinter.addJournalWithTime("��������λ�ɹ� ");
    top.cardreader.CardReadEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_Idc) == "function")
    {
      top.MainFrame.onResetComplete_Idc();
    }else if (typeof(top.onResetComplete_Idc) == "function")
    {
      top.onResetComplete_Idc();
    }else{}
  };

//-----------����-----------------//
  /*�����̿�*/
  this.excardcapture = function()
  {
    top.cardreader.CardReadEvents.clearAll();
    if (!top.YHAXCardReader.CpCanCapture)
    {
      // ��֧���̿��Ķ����������տ���ȡ�ߴ���
      top.cardreader.onExCardTaken();
      return;
    }
	top.journalPrinter.addJournalWithTime("�����̿� CardReader command excardcapture");
    top.cardreader.CardReadEvents.appendEvent("CardTaken", top.cardreader.onExCardTaken);
    top.cardreader.CardReadEvents.appendEvent("CardCaptured", top.cardreader.onExCardCaptured);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onDeviceError4Capture);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onDeviceError4Capture);
    top.YHAXCardReader.Capture();
  }

   /*������-����-���Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onExCardTaken = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���������� CardReader Event onExCardTaken");
    // ����ָʾ��
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}

    if (typeof(top.MainFrame.onExCardTaken) == "function")
      top.MainFrame.onExCardTaken();
    else if (typeof(top.onExCardTaken) == "function")
      top.onExCardTaken();
  }

   /*������-����-���Ѿ���������¼���Ӧ*/
  this.onExCardCaptured = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("�������� CardReader Event onExCardCaptured");
    top.cardreader.CardReadEvents.clearAll();
	// ����������濨�����յ���Ϣ
    top.cardreader.sendEXCaptureStatus();
    if (typeof(top.MainFrame.onExCardCaptured) == "function")
      top.MainFrame.onExCardCaptured();
    else if (typeof(top.onExCardCaptured) == "function")
      top.onExCardCaptured();
  }

//------------------------- ������������ -------------------------//

  /*�ж϶��������Ƿ���ڴſ�*/
  this.isCardPresent = function()
  {
	  if(top.YHAXCardReader.StMediaStatus == "PRESENT"){
		  return true;
	  }else{
		  return false;
	  }
  }

  this.getUnableToReadReason = function(reason)
  {
  	var retReason = "";
  	switch(reason)
  	{
  	  case top.IDCReadFailure.IDC_READ_SHUTTER_FAILURE:
  	  retReason = "�������쳣";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_MEDIA_JAM:
  	  retReason = "�����ʱ���ס";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_HARDWARE_ERROR:
  	  retReason = "����������";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_DEVICE_LOCKED:
  	  retReason = "������������";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_COMMAND_NOT_SUPPORTED:
  	  retReason = "�����ִ��";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_CANCELLED:
  	  retReason = "���ȡ��";
  	  break;
  	  default:
  	  retReason = "Ӳ������";
  	}
  	return retReason;
  }

  this.getUnableToEjectReason = function(reason)
  {
    var retReason = "";
  	switch(reason)
  	{
  	  case top.IDCEjectFailure.IDC_EJECT_SHUTTER_FAILURE:
  	  retReason = "�������쳣";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_MEDIA_JAM:
  	  retReason = "�����ʱ���ס";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_NO_MEDIA:
  	  retReason = "�޿�����";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_MEDIA_RETAINED:
  	  retReason = "��������";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_COMMAND_NOT_SUPPORTED:
  	  retReason = "�����ִ��";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_CANCELLED:
  	  retReason = "���ȡ��";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_HARDWARE_ERROR:
  	  retReason = "Ӳ������";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_DEVICE_LOCKED:
  	  retReason = "Ӳ��������";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_TIMEOUT:
  	  retReason = "��ʱδȡ��";
  	  break;
  	  default:
  	  retReason = "Ӳ������";
  	}
  	return retReason;
  }

  this.convertTransType =function(transType)
  {
	switch(transType) {
		case "00" : return "����";
		case "01" : return "ȡ��";
		case "03" : return "Ԥ��Ȩ";
		case "20" : return "�˻�";
		case "21" : return "���";
		case "22" : return "������";
		case "30" : return "��ѯ";
		case "40" : return "ת��";
		case "46" : return "ת��";
		case "47" : return "ת��";
		case "60" : return "ָ���˻���ֵ";
		case "62" : return "�ǰ��˻���ֵ";
		case "63" : return "�ֽ��ֵ";
		case "64" : return "��ָ���˻�ת����ֵ";
		case "65" : return "��ָ���˻�ת���ֵ";
		case "66" : return "Ȧ��";
		case "67" : return "��ʱ�˻�����";
		case "70" : return "����";
		case "80" : return "��ȫ��֤";
		case "97" : return "���ǳ�ֵ";
		case "98" : return "�޸Ŀ��ڲ���";
		case "99" : return "����";
		//����(ʵ�����ݴ�P���ṩ)
		case "11" : return "����";
		case "12" : return "�ɴ�";
		case "13" : return "֧ȡ";
		case "14" : return "��Ϣ";
		case "3504" : return "������ȡ";
		case "3503" : return "�����ȡ";
		case "3501" : return "�汾ȡϢ";
		case "3502" : return "������ȡ";
		case "0126" : return "������";
		case "0131" : return "������";
		case "0136" : return "һ��";
		case "0141" : return "����";
		case "0146" : return "����";
		case "0151" : return "����";
		  default : return "����"
	}
  }

   this.ICTransType =function(transType)
   {
	  switch(transType) {
		case "903101" : return "40";  //ת��
		case "903201" : return "40";  //ת��
		case "902202" : return "60";  //��ֵ
		case "902503" : return "70";  //����
		  default : return "99"
	}
  }

   /*
���� ˽�к���������������濨�����յ���Ϣ
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
      reqMsg.appendNode("strExpCode", top.EXPCODE_RETRACTCARD);
	  reqMsg.appendNode("strPan", top.pool.get("strPan"));         //����
      reqMsg.appendNode("strMemo", "��������");
      var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
      return iRet;
   }
      /*
���� ˽�к���������������濨�����յ���Ϣ
     ���أ�
     �����ն˶���״̬�Ľ��������
     RESULT_SUCCESSFUL
     RESULT_FAILED
     RESULT_UNCERTAIN
   */
   this.sendEXCaptureStatus = function()
   {
      var exch = new ExchangeXmlWithHost();
	  var reqMsg = new ColsMsgXmlText();
      reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AppendExpLog");
      reqMsg.appendNode("strExpCode", top.EXPCODE_RETRACTCARD);
	  reqMsg.appendNode("strPan", top.pool.get("strPan"));         //����
      reqMsg.appendNode("strMemo", "�������վɿ�");
      var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
      return iRet;
   }   
}

/*
  �鿨���̿�����
 */
function CheckCard()
{
  /*
 �� ������������鿨��ʹ���첽����ʽ
  */
  this.sendCheckCardAsync = function()
  {
	//��ҽ����鿨������IC������ǰ��֤
	if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1" && top.pool.get("isNeedF55") == "1"){
	}else{
		new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	}	  
	  var exch = new ExchangeXmlWithHost();
	  var reqMsg = new ColsMsgXmlText();
      reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
      reqMsg.appendNode("strTransCode", "901606");    //���ױ��룬��Ҫ�������ļ���Ӧ
	  reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	  reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	  reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	  reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	  reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	  //reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	  reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺� ����ʹ��
	  if("0" == top.pool.get("strICFlag")){
		  reqMsg.appendNode("strICFlag","021")
	  }else{
		  reqMsg.appendNode("strICFlag","051");
	  }
      var iRet = top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, this.onSendCheckCardAsyncComplete);
  }

  /*
    ˽�к�������WEB�����������첽�������ʱ�Ļص�����
  */
  this.onSendCheckCardAsyncComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
    	top.pool.set("strRespIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//�û���
    	top.pool.set("strRespIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//֤����
    	top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//���˺�
    	top.pool.set("mainSuppleCardFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mainSuppleCardFlag"));//������ʾ
    	top.pool.set("productType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));//����Ʒ����
    	top.pool.set("cardStatus",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardStatus"));//��״̬
	    top.pool.set("strPayerOpenBankNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchNo"));//�忨���ܺ�ȡ���ۿ�Ŀ���������ţ����ͺ���������������
	    top.pool.set("PayerCustName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//�忨���ܺ�ȡ���ۿ�Ļ��������ͺ����ڿ���ת��
        top.journalPrinter.addJournalWithTime(" �鿨���̳ɹ�");
		top.pool.set("CheckCardRet",iRet);
    }
    else
    {
		top.pool.set("CheckCardRet",iRet);
        top.journalPrinter.addJournalWithTime(" �鿨����ʧ��");
    }
	if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1" && top.pool.get("isNeedF55") == "1"){
		new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onAsyncExchangeComplete");//IC�����׺�д������	
	}else{
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onAsyncExchangeComplete");//IC�����׺�д������	
	}	
  }

  /*
���� ����֮ǰIC�����֤
     ������strICType  �������� ע����ָIC���������ͣ������ǽ��ױ���
	       strAmount  ���׽�� ע��Ҫ�Է�Ϊ��λ
  */
  this.icCheckBeforeTrans = function(strICType,strAmount)
  {
	 if(top.pool.get("strICFlag") == "1" && top.cardreader.isCardPresent()){//�п�������IC����ʱ�򣬲���IC��֤����
		top.cardreader.appInit();
		if(strICType == null || strICType == ""){
			strICType = "99";
		}
		if(strAmount != null && strAmount != ""){
		    top.YHAXCardReader.ICT_SetValue(0x9F02,new top.StringCtrl(strAmount).prefixStr("0",12));
		}
		else{
			top.YHAXCardReader.ICT_SetValue(0x9F02,new top.StringCtrl("").prefixStr("0",12));
		}
		top.YHAXCardReader.ICT_SetValue(0x9F03,"000000000000");
		top.YHAXCardReader.ICT_SetValue(0x9C,strICType); //�����н���ת����IC����������
		top.YHAXCardReader.ICT_SetValue(0x5F57,"00");
		
		var ret = top.cardreader.terminalActAnaly();
		if(ret != 0){
			//����ǽ����������ǵ����ֽ��Ѿ�����
			if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){
				// ��¼�ն���ˮ
				top.journalPrinter.addJournalWithTime("����IC�������ն���Ϊ���� ");					
			}else{
				// ��¼�ն���ˮ
				top.journalPrinter.addJournalWithTime("IC���ն���Ϊ����ʧ�� ");
				if (typeof(top.MainFrame.onServiceFailed) == "function"){
				  top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_CARD_FAILED, top.langcur.oICCardTerm);
				  return;
				}
			}
		}
		//ȡ55������,������
		top.pool.set("strField55", top.cardreader.getField55());
	}
  }

  /*
���� ����֮��IC��ش���
     ������iRet ���׽��
	       strField55  ���׷��ص�55��
  */
  this.icCheckAfterTrans = function(strField55,func)
  {
	  if(top.pool.get("strICFlag") == "1" && top.cardreader.isCardPresent()){//IC��
		  //д�����
		  if(strField55 != null && strField55 != ""){
			 var iRet = top.cardreader.issueReport(strField55);
			 if(iRet == 0){
				 var str91 = new top.StringCtrl(top.YHAXCardReader.ICT_GetFieldEx(0x91).split("|")[1]).trim();
				 top.YHAXCardReader.ICT_SetValue(0x91,str91);
			     top.YHAXCardReader.ICT_SetValue(0x8A,"3030");
				 //��ҽ����еĵ����ֽ�������ײ����з�������֤
				 if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){
					 iRet = 0;					 
				 }else{
					iRet = top.cardreader.exterAuth(); 
				 }			     
			     if(iRet == 0)
			     {
                     var str71 = new top.StringCtrl(top.YHAXCardReader.ICT_GetFieldEx(0x71).split("|")[1]).trim();
					 var str72 = new top.StringCtrl(top.YHAXCardReader.ICT_GetFieldEx(0x72).split("|")[1]).trim();
			         if(str72 != null && str72 != ""){//�ж��Ƿ����71��72ֵ��û�еĻ����ű�֪ͨ�Ͳ���Ҫ��
				        top.cardreader.issueScript(0x71,func);
					 }
					 else{
						if(typeof(eval(func))=="function")
                        {
                           eval(func+"();");
                        }
					 }
				 }
				 else{
					if (typeof(top.MainFrame.onServiceFailed) == "function"){
			            top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_CARD_FAILED, "IC����֤ʧ��,����ϵ������!");
			        }
				 }
			  }
		   }
		   else{
			  if(typeof(eval(func))=="function")
              {
                 eval(func+"();");
              }
		   }
	   }
	   else{
			if(typeof(eval(func))=="function")
            {
                eval(func+"();");
            }
		}
  }

  /***��������ģ��״̬�ж�***/
  this.carddispenserStatus = function()
  {
	 //���֤����������������������̡�����ͷ
	 if(top.YHAXCardDispenser.StDeviceStatus != "HEALTHY" || top.YHAXCardDispenser.StMediaStatus !="NOTPRESENT")
	 {
		 return top.langcur.oCardDispenserError;
	 }else if(top.YHAXCardReader.StDeviceStatus != "HEALTHY" || top.YHAXCardReader.StMediaStatus !="NOTPRESENT")
	 {
		 return top.langcur.oCardReaderError;
	 }else if(top.YHAXIDCardReader.StDeviceStatus !="HEALTHY" || top.YHAXIDCardReader.StMediaStatus !="NOTPRESENT")
	 {
		 return top.langcur.oIDCardError;
	 }else if(top.YHAXPinPad.StDeviceStatus != "HEALTHY"){
		return top.langcur.oPinPadError;
	 }else if(top.YHAXCameras.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oCamerasError;
	 }else{
		 return "true";
	 }
  }

  /***��������������ģ��״̬�ж�***/
  this.cardStatus = function()
  {
	 //���֤����������������������̡�����ͷ
	 if(top.YHAXCardDispenser.StDeviceStatus != "HEALTHY" || top.YHAXCardDispenser.StMediaStatus !="NOTPRESENT")
	 {
		return top.langcur.oCardDispenserError;
	 }else if(top.YHAXCardReader.StDeviceStatus != "HEALTHY")
	 {
		 return top.langcur.oCardReaderError;
	 }else if(top.YHAXIDCardReader.StDeviceStatus !="HEALTHY" || top.YHAXIDCardReader.StMediaStatus !="NOTPRESENT"){
		 return top.langcur.oIDCardError;
	 }else if(top.YHAXPinPad.StDeviceStatus != "HEALTHY"){
		return top.langcur.oPinPadError;
	 }else if(top.YHAXCameras.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oCamerasError;
	 }else{
		 return "true";
	 }
  }

  /***ǩԼ���������롢���ÿ������ཻ��ģ��״̬�ж�***/
  this.cardSignStatus = function()
  {
	 //���֤����������������̡�����ͷ
	 if(top.YHAXCardReader.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oCardReaderError;
	 }else if(top.YHAXIDCardReader.StDeviceStatus !="HEALTHY" || top.YHAXIDCardReader.StMediaStatus !="NOTPRESENT")
	 {
		 return top.langcur.oIDCardError;
	 }else if(top.YHAXPinPad.StDeviceStatus != "HEALTHY"){
		return top.langcur.oPinPadError;
	 }else if(top.YHAXCameras.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oCamerasError;
	 }else{
		 return "true";
	 }
  }

  /**��ֵ��������ת�ˡ��ɷѵȽ���ģ��״̬�ж�***/
  this.cardTransStatus = function()
  {
	 //���֤����������������̡�����ͷ
	 if(top.YHAXCardReader.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oCardReaderError;
	 }else if(top.YHAXPinPad.StDeviceStatus != "HEALTHY"){
		return top.langcur.oPinPadError;
	 }else{
		 return "true";
	 }
  }

  /*�浥����ģ��**/
  this.cdStDeviceStatus = function()
  {
	 //���֤����������������̡�����ͷ��ǩ�����浥ɨ�衢�浥��ӡ
	 if(top.YHAXDocumentScanner.StDeviceStatus != "HEALTHY" || top.YHAXDocumentScanner.StMediaStatus !="NOTPRESENT")
	 {
		 return top.langcur.oDocumentScannerError;
	 }else if(top.YHAXDocumentPrinter.StDeviceStatus != "HEALTHY" || top.YHAXDocumentPrinter.StMediaStatus !="NOTPRESENT"
		|| top.YHAXDocumentPrinter.StPaperStatus != "FULL")
	 {
		if(top.YHAXDocumentPrinter.StPaperStatus == "OUT"){
			return top.langcur.oDocumentPrinterError2;
		}else{
			return top.langcur.oDocumentPrinterError;
		}
	 }else if(top.YHAXCardReader.StDeviceStatus != "HEALTHY")
	 {
		 return top.langcur.oCardReaderError;
	 }else if(top.YHAXIDCardReader.StDeviceStatus !="HEALTHY" || top.YHAXIDCardReader.StMediaStatus !="NOTPRESENT"){
		 return top.langcur.oIDCardError;
	 }else if(top.YHAXPinPad.StDeviceStatus != "HEALTHY"){
		return top.langcur.oPinPadError;
	 }else if(top.YHAXCameras.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oCamerasError;
	 }else{
		 return "true";
	 }
  }

  /*�浥����ģ��*/
  this.cdoutStDeviceStatus = function()
  {
	//�浥�������֤����������������̡�����ͷ��ǩ��
	 if(top.YHAXDocumentScanner2.StDeviceStatus != "HEALTHY" || top.YHAXDocumentScanner2.StMediaStatus != "NOTPRESENT")
	 {
		 return top.langcur.oDocumentScanner2Error;
	 }else if(top.YHAXCardReader.StDeviceStatus != "HEALTHY")
	 {
		 return top.langcur.oCardReaderError;
	 }else if(top.YHAXIDCardReader.StDeviceStatus !="HEALTHY" || top.YHAXIDCardReader.StMediaStatus !="NOTPRESENT"){
		 return top.langcur.oIDCardError;
	 }else if(top.YHAXPinPad.StDeviceStatus != "HEALTHY"){
		return top.langcur.oPinPadError;
	 }else if(top.YHAXCameras.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oCamerasError;
	 }else if(top.YHAXFingerScanner.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oFingerScannerError;
	 }else{
		 return "true";
	 }
  }

  /*�浥����+����*/
  this.cdDisStDeviceStatus = function()
  {
	//�浥�����浥���������֤����������������̡�����ͷ��ǩ��
	if(top.YHAXCardReader.StDeviceStatus != "HEALTHY")
	{
		 return top.langcur.oCardReaderError;
	}else if(top.YHAXIDCardReader.StDeviceStatus !="HEALTHY" || top.YHAXIDCardReader.StMediaStatus !="NOTPRESENT")
	{
		 return top.langcur.oIDCardError;
	}else if(top.YHAXDocumentScanner2.StDeviceStatus != "HEALTHY" || top.YHAXDocumentScanner2.StMediaStatus != "NOTPRESENT")
	{
		return top.langcur.oDocumentScanner2Error;
	}else if(top.YHAXDocumentScanner.StDeviceStatus != "HEALTHY" || top.YHAXDocumentScanner.StMediaStatus !="NOTPRESENT")
	{
		return top.langcur.oDocumentScannerError;
	}else if(top.YHAXDocumentPrinter.StDeviceStatus != "HEALTHY" || top.YHAXDocumentPrinter.StMediaStatus != "NOTPRESENT"
		|| top.YHAXDocumentPrinter.StPaperStatus != "FULL")
	{
		if(top.YHAXDocumentPrinter.StPaperStatus == "OUT"){
			return top.langcur.oDocumentPrinterError2;
		}else{
			return top.langcur.oDocumentPrinterError;
		}
	}else if(top.YHAXPinPad.StDeviceStatus != "HEALTHY"){
		return top.langcur.oPinPadError;
	 }else if(top.YHAXCameras.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oCamerasError;
	 }else if(top.YHAXFingerScanner.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oFingerScannerError;
	 }else{
		 return "true";
	 }
  }
}
