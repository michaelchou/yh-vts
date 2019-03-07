
/*
  ������̲�����
  ʵ�ֶ�������̵��������롢�������롢����ת������Կ�·��ͱ��ļ��ܵȲ���
 */
function Pinpad()
{
  // ���������ģ���¼���Ӧ����
  this.PinPadEvents = new top.EventHandling(top.YHAXPinPad);
  //------------------------- ������̲�����˽������ -------------------------//
  /*����ECB���ܵ�����*/
  this.EncryptECB_data;
  /*����ECB���ܵ���Կ����*/
  this.EncryptECB_encryptName;
  /*��λ��*/
  this.EncryptECB_addChar;
  /*���غ���*/
  this.EncryptECB_function;
  /*����PinKey(DES)������Կ����*/
  this.strMasterKey4Pin = "MasterKey";
  /*����PinKey(����)������Կ����*/
  this.strSM4MasterKey4Pin = "SM4MasterKey";
  /*����MacKey(DES)������Կ����*/
  this.strMasterKey4Mac = "MasterKey";
  /*����MacKey(����)������Կ����*/
  this.strSM4MasterKey4Mac = "SM4MasterKey";
  /*����PINBLOCK����Ŀ���λ���Ƿ��ǵ����ڶ�λ����ǰ��ȡ12λ*/
  this.PanLenCheck = false;
  /*������С����*/
  this.iMinPinLen = 4;
  /*������󳤶�*/
  this.iMaxPinLen = 6;
   /*����ԭ����������С����*/
  this.iPassMinPinLen = 1;
  /*����ԭ����������󳤶�*/
  this.iPassMaxPinLen = 6;
  /*�浥ԭ����������С����*/
  this.iCDSMinPinLen = 1;
  /*�浥ԭ����������󳤶�*/
  this.iCDSMaxPinLen = 6;
  
  /*�������֧�ֵİ�������*/
  this.KeySupported = top.YHAXPinPad.CpKeysSupported;    
  /*�Ƿ���Ҫ����ǩ������*/
  this.bGetWorkingKey = true;
    
//------------------------- �������ִ�еķ��� -------------------------//

  /*�ȴ��û���������*/
  this.userEntry = function()
  {
    top.pinpad.PinPadEvents.clearAll();
	top.guidelights.setPinPadLight("OFF");
    top.pinpad.PinPadEvents.appendEvent("KeyPressed", top.pinpad.onKeyPressed);
    top.journalPrinter.addJournalWithTime("������ Pinpad command UserEntry" );
	if(this.KeySupported != null && this.KeySupported.length > 0){
		top.YHAXPinPad.UserEntry(0, false, this.KeySupported, "", -1);
	}else{
		top.YHAXPinPad.UserEntry(0, false, "0,1,2,3,4,5,6,7,8,9,00,ENTER,CANCEL,CLEAR,.", "", -1);
	} 
  }
 
  /*ȡ���ȴ��û���������*/
  this.cancelUserEntry = function()
  {
  	top.pinpad.PinPadEvents.clearAll();
    top.pinpad.PinPadEvents.appendEvent("Cancelled", top.pinpad.onPlainCancelled);
    top.journalPrinter.addJournalWithTime("�ر����� Pinpad command CancelUserEntry");
    top.YHAXPinPad.CancelUserEntry();  
  }
  
  /*
  * �ȴ��û���������
  * ������activeKeys ��������ļ�ֵ
  */
  this.bufferPIN = function()
  {
    top.pinpad.PinPadEvents.clearAll();
	top.guidelights.setPinPadLight("CONTINUOUS");
    top.pinpad.PinPadEvents.appendEvent("KeyPressed", top.pinpad.onKeyPressed);
    top.pinpad.PinPadEvents.appendEvent("PinBuffered", top.pinpad.onPinBuffered);
    top.pinpad.PinPadEvents.appendEvent("PinCancelled", top.pinpad.onPinCancelled);
	top.pinpad.PinPadEvents.appendEvent("Timeout", top.pinpad.onPinInputTimeout);
    top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onDeviceError_Pinpad);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("������(���ż���) Pinpad command BufferPIN");
    top.YHAXPinPad.BufferPIN(top.pinpad.iMinPinLen, top.pinpad.iMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  /*���û�������������Ϊ�����*/
  this.onPinBuffered = function()
  {
    /*ֹͣ��ʱ����*/
    top.serviceCtrl.stopFlowCtrlTimeout();
    var strPanData = top.pool.get("strPan");
	var len = strPanData.length;
    /*�ж��Ƿ���Ҫ��ȡ12λ����*/
    if (top.pinpad.PanLenCheck)
    {

      if (len > 12)
        strPanData = strPanData.substring(len-13, len-1);
    }
	if(len < 12)//���ų���С��12λʱ������12λ
	{
		strPanData  = new top.StringCtrl(strPanData).suffixStr('0',12);
	}
    top.pinpad.PinPadEvents.appendEvent("PinFormatted", top.pinpad.onPinFormatted);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("����(���ż���) Pinpad command FormatPin" );
	if(top.pool.get("strEncrypType") == "SM4"){//����
		top.YHAXPinPad.FormatPin("ANSI", strPanData, 0x0F, "SM4PINKey", "", "");
	}else{
		top.YHAXPinPad.FormatPin("ANSI", strPanData, 0x0F, "PINKey", "", "");
	} 
  }
  
  /*
  * �ȴ��û���������(��Ҫ����Կͻ���)
  * ������activeKeys ��������ļ�ֵ
  */
  this.bufferPINCustom = function()
  {
    top.pinpad.PinPadEvents.clearAll();
	top.guidelights.setPinPadLight("CONTINUOUS");
    top.pinpad.PinPadEvents.appendEvent("KeyPressed", top.pinpad.onKeyPressed);
    top.pinpad.PinPadEvents.appendEvent("PinBuffered", top.pinpad.onPinBufferedCustom);
    top.pinpad.PinPadEvents.appendEvent("PinCancelled", top.pinpad.onPinCancelled);
	top.pinpad.PinPadEvents.appendEvent("Timeout", top.pinpad.onPinInputTimeout);
    top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onDeviceError_Pinpad);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("������(�ͻ��ż���) Pinpad command BufferPIN");
    top.YHAXPinPad.BufferPIN(top.pinpad.iMinPinLen, top.pinpad.iMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  /*���û�������������Ϊ�����*/
  this.onPinBufferedCustom = function()
  {
    /*ֹͣ��ʱ����*/
    top.serviceCtrl.stopFlowCtrlTimeout();
    var strCustomerId = top.pool.get("strCustomerId");
	var len = strCustomerId.length;
    /*�ж��Ƿ���Ҫ��ȡ12λ����*/
    if (top.pinpad.PanLenCheck)
    {

      if (len > 12)
        strCustomerId = strCustomerId.substring(len-13, len-1);
    }
	if(len < 12)//���ų���С��12λʱ������12λ
	{
		strCustomerId  = new top.StringCtrl(strCustomerId).suffixStr('0',12);
	}
    top.pinpad.PinPadEvents.appendEvent("PinFormatted", top.pinpad.onPinFormatted);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("����(�ͻ��ż���) Pinpad command FormatPin" );
	if(top.pool.get("strEncrypType") == "SM4"){//����
		top.YHAXPinPad.FormatPin("ANSI", strCustomerId, 0x0F, "SM4PINKey", "", "");
	}else{
		top.YHAXPinPad.FormatPin("ANSI", strCustomerId, 0x0F, "PINKey", "", "");
	} 
  }
  
   /*
  * �ȴ��û���������(��Ҫ����Դ��ۺ�)
  * ������activeKeys ��������ļ�ֵ
  */
  this.bufferPINPassBook = function()
  {
    top.pinpad.PinPadEvents.clearAll();
	top.guidelights.setPinPadLight("CONTINUOUS");
    top.pinpad.PinPadEvents.appendEvent("KeyPressed", top.pinpad.onKeyPressed);
    top.pinpad.PinPadEvents.appendEvent("PinBuffered", top.pinpad.onPinBufferedPassBook);
    top.pinpad.PinPadEvents.appendEvent("PinCancelled", top.pinpad.onPinCancelled);
	top.pinpad.PinPadEvents.appendEvent("Timeout", top.pinpad.onPinInputTimeout);
    top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onDeviceError_Pinpad);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("������(���ۺż���) Pinpad command BufferPIN" );
    top.YHAXPinPad.BufferPIN(top.pinpad.iMinPinLen, top.pinpad.iMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  /*
  * �ȴ��û���������(��Ҫ����Դ��ۺ�)
  * ������activeKeys ��������ļ�ֵ
  * ����ԭ����֧��1-6λ
  */
  this.bufferPINPassBookEx = function()
  {
    top.pinpad.PinPadEvents.clearAll();
	top.guidelights.setPinPadLight("CONTINUOUS");
    top.pinpad.PinPadEvents.appendEvent("KeyPressed", top.pinpad.onKeyPressed);
    top.pinpad.PinPadEvents.appendEvent("PinBuffered", top.pinpad.onPinBufferedPassBook);
    top.pinpad.PinPadEvents.appendEvent("PinCancelled", top.pinpad.onPinCancelled);
	top.pinpad.PinPadEvents.appendEvent("Timeout", top.pinpad.onPinInputTimeout);
    top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onDeviceError_Pinpad);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("������(���ۺż��� ֧��1-6λ) Pinpad command BufferPIN" );
    top.YHAXPinPad.BufferPIN(top.pinpad.iPassMinPinLen, top.pinpad.iPassMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  /*���û�������������Ϊ�����*/
  this.onPinBufferedPassBook = function()
  {
    /*ֹͣ��ʱ����*/
    top.serviceCtrl.stopFlowCtrlTimeout();
    var strPassBookNum = top.pool.get("strPassBookNum");
	var len = strPassBookNum.length;
    /*�ж��Ƿ���Ҫ��ȡ12λ����*/
    if (top.pinpad.PanLenCheck)
    {

      if (len > 12)
        strPassBookNum = strPassBookNum.substring(len-13, len-1);
    }
	if(len < 12)//���ų���С��12λʱ������12λ
	{
		strPassBookNum = new top.StringCtrl(strPassBookNum).suffixStr('0',12);
	}
    top.pinpad.PinPadEvents.appendEvent("PinFormatted", top.pinpad.onPinFormatted);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("����(���ۺż���) Pinpad command FormatPin" );
	if(top.pool.get("strEncrypType") == "SM4"){//����
		top.YHAXPinPad.FormatPin("ANSI",strPassBookNum, 0x0F, "SM4PINKey", "", "");
	}else{
		top.YHAXPinPad.FormatPin("ANSI",strPassBookNum, 0x0F, "PINKey", "", "");
	} 
  }
  
  /*
  * �ȴ��û���������(��Ҫ����Դ浥�˺�)
  * ������activeKeys ��������ļ�ֵ
  */
  this.bufferPINCDS = function()
  {
    top.pinpad.PinPadEvents.clearAll();
	top.guidelights.setPinPadLight("CONTINUOUS");
    top.pinpad.PinPadEvents.appendEvent("KeyPressed", top.pinpad.onKeyPressed);
    top.pinpad.PinPadEvents.appendEvent("PinBuffered", top.pinpad.onPinBufferedCDS);
    top.pinpad.PinPadEvents.appendEvent("PinCancelled", top.pinpad.onPinCancelled);
	top.pinpad.PinPadEvents.appendEvent("Timeout", top.pinpad.onPinInputTimeout);
    top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onDeviceError_Pinpad);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("������(�浥�ż���) Pinpad command BufferPIN" );
    top.YHAXPinPad.BufferPIN(top.pinpad.iMinPinLen, top.pinpad.iMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  
   /*
  * �ȴ��û���������(��Ҫ����Դ浥�˺�)
  * ������activeKeys ��������ļ�ֵ
  *�浥ԭ����֧��1-6λ
  */
  this.bufferPINCDSEx = function()
  {
    top.pinpad.PinPadEvents.clearAll();
	top.guidelights.setPinPadLight("CONTINUOUS");
    top.pinpad.PinPadEvents.appendEvent("KeyPressed", top.pinpad.onKeyPressed);
    top.pinpad.PinPadEvents.appendEvent("PinBuffered", top.pinpad.onPinBufferedCDS);
    top.pinpad.PinPadEvents.appendEvent("PinCancelled", top.pinpad.onPinCancelled);
	top.pinpad.PinPadEvents.appendEvent("Timeout", top.pinpad.onPinInputTimeout);
    top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onDeviceError_Pinpad);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("������(�浥�ż��� ֧��1-6λ) Pinpad command BufferPIN");
    top.YHAXPinPad.BufferPIN(top.pinpad.iCDSMinPinLen, top.pinpad.iCDSMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  
  /*���û�������������Ϊ�����*/
  this.onPinBufferedCDS = function()
  {
    /*ֹͣ��ʱ����*/
    top.serviceCtrl.stopFlowCtrlTimeout();
    var strCDSNum = top.pool.get("strCDSNum");
	var len = strCDSNum.length;
    /*�ж��Ƿ���Ҫ��ȡ12λ����*/
    if (top.pinpad.PanLenCheck)
    {

      if (len > 12)
        strCDSNum = strCDSNum.substring(len-13, len-1);
    }
	if(len < 12)//���ų���С��12λʱ������12λ
	{
		strCDSNum = new top.StringCtrl(strCDSNum).suffixStr('0',12);
	}
    top.pinpad.PinPadEvents.appendEvent("PinFormatted", top.pinpad.onPinFormatted);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("����(�浥�ż���) Pinpad command FormatPin" );
	if(top.pool.get("strEncrypType") == "SM4"){//����
		top.YHAXPinPad.FormatPin("ANSI",strCDSNum, 0x0F, "SM4PINKey", "", "");
	}else{
		top.YHAXPinPad.FormatPin("ANSI",strCDSNum, 0x0F, "PINKey", "", "");
	} 
  }  
  /*ȡ���ȴ��û���������*/
  this.cancelPINEntry = function()
  {	
	top.journalPrinter.addJournalWithTime("ȡ���������� Pinpad command CancelPINEntry" );
	top.guidelights.setPinPadLight("OFF");
    top.YHAXPinPad.CancelPINEntry();
  }
  
  /*��װ��Կ����*/
  this.loadKey = function(keyname, keyvalue, useflags)
  {
    var bytearr = new top.StringCtrl("").hexStr2ByteArr(keyvalue);
    var identification = new top.StringCtrl("").hexStr2ByteArr("");
    top.pinpad.PinPadEvents.clearAll();
    top.pinpad.PinPadEvents.appendEvent("KeyLoaded", top.pinpad.onKeyLoaded);
	top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onLoadKeyDeviceError);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onLoadKeyDeviceError);
	top.journalPrinter.addJournalWithTime("��װ��Կ���� Pinpad command ExtendedLoadKey");
    try{top.YHAXPinPad.ExtendedLoadKey(keyname, bytearr, useflags, identification);}catch(e){top.pinpad.onLoadKeyDeviceError();}
  }
  
  /*��װ���ܵ���Կ*/
  this.loadEncryptedKey = function(keyname, keyvalue, enckeyname, useflags)
  {
    var bytearr = new top.StringCtrl("").hexStr2ByteArr(keyvalue);
    var identification = new top.StringCtrl("").hexStr2ByteArr("");
    top.pinpad.PinPadEvents.clearAll();
	top.pinpad.PinPadEvents.appendEvent("KeyLoaded", top.pinpad.onKeyLoaded);
    top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onLoadKeyDeviceError);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onLoadKeyDeviceError);
	top.journalPrinter.addJournalWithTime("��װ���ܵ���Կ Pinpad command ExtendedLoadEncryptedKey" );
    try{top.YHAXPinPad.ExtendedLoadEncryptedKey(keyname, bytearr, enckeyname, useflags, identification);}catch(e){top.pinpad.onLoadKeyDeviceError();}
  }

  /*�û��������¼��ص��Ĵ�����*/
  this.onKeyPressed = function(Key, KeyCode)
  {
    /*�ڲ��ֻ�������������ʱ��KeyΪ""����Ҫת��
     * �����豸�İ���ֵ�������������Shift��ʽ����Ҫ�滻
     */
    if (Key == "")
      Key = ".";
    else if (Key == "!")
      Key = "1";
    else if (Key == "@")
      Key = "2";
    else if (Key == "#")
      Key = "3";
    else if (Key == "$")
      Key = "4";
    else if (Key == "%")
      Key = "5";
    else if (Key == "^")
      Key = "6";
    else if (Key == "&")
      Key = "7";
    else if (Key == "*")
      Key = "8";
    else if (Key == "(")
      Key = "9";
    else if (Key == ")")
      Key = "0";
    else if (Key == ">")
      Key = ".";
    top.serviceCtrl.setValue(Key);
  }
 
//-------------------------- ��Ӧ�������¼��ķ��� -------------------------//

  /*�������Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError_Pinpad = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("������̹��� Pinpad Event onDeviceError_Pinpad" );
	top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//����������
    if (typeof(top.MainFrame.onDeviceError_Pinpad) == "function")
      top.MainFrame.onDeviceError_Pinpad();
  }

  /*�������뱻ȡ�����¼���Ӧ*/
  this.onPlainCancelled = function()
  {
	top.journalPrinter.addJournalWithTime("�������뱻ȡ�� Pinpad Event onPlainCancelled" );
    top.pinpad.PinPadEvents.clearAll();
    if (typeof(top.MainFrame.onPlainCancelled) == "function"){
      top.MainFrame.onPlainCancelled();
	}
  }
  
  /*�����ת����ɵ��¼���Ӧ*/
  this.onPinFormatted = function(pinblock)
  {
	top.journalPrinter.addJournalWithTime("�����ת����� Pinpad Event onPinFormatted" );
    var strPinBlock = new top.StringCtrl("").byteArr2HexStr(pinblock);
    top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//����������
    if (typeof(top.MainFrame.onGetPinBlockOK) == "function")
      top.MainFrame.onGetPinBlockOK(strPinBlock);
  }
  
  /*���������쳣���
   */
  this.onPinCancelled = function()
  {
	top.journalPrinter.addJournalWithTime("��������ȡ�� Pinpad Event onPinCancelled");
    top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//����������
    if(typeof(top.MainFrame.onPinCancelled) == "function")
   	{
   		top.MainFrame.onPinCancelled();
   	}
  }
  
  /*�û�����Pinʱ��ʱ*/
  this.onPinInputTimeout = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("����Pin��ʱ Pinpad Event onPinInputTimeout" );
	top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//����������
    if (typeof(top.MainFrame.onPinInputTimeout) == "function")
      top.MainFrame.onPinInputTimeout();
  }
  
  /*װ����Կ�Ѿ����*/
  this.onKeyLoaded = function()
  {
	// ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("װ����Կ��� Pinpad Event onKeyLoaded");
    top.pinpad.PinPadEvents.clearAll();
    if (typeof(top.MainFrame.onKeyLoaded) == "function"){
      top.MainFrame.onKeyLoaded();
	}
	else if (typeof(top.onKeyLoaded) == "function"){
      top.onKeyLoaded();
	}
  }
  
  /*װ����ԿʱӲ������*/
  this.onLoadKeyDeviceError = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("װ����ԿӲ������ Pinpad Event onLoadKeyDeviceError" );
	top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//����������
    if (typeof(top.MainFrame.onLoadKeyDeviceError) == "function"){
      top.MainFrame.onLoadKeyDeviceError();
	}
	else if (typeof(top.onLoadKeyDeviceError) == "function"){
      top.onLoadKeyDeviceError();
	}
  }
  
//------------------------- ������������ -------------------------//  
  /*��װ������Կ��DES����PinKey*/
  this.loadPinKey = function(strPinKey)
  {
    this.loadEncryptedKey("PINKey", strPinKey, this.strMasterKey4Pin, "FUNCTION");
  }
  /*��װ������Կ�����ܣ���PinKey*/
  this.loadSM4PinKey = function(strSM4PinKey)
  {
    this.loadEncryptedKey("SM4PINKey", strSM4PinKey, this.strSM4MasterKey4Pin, "FUNCTION");
  }
  /*��װ������Կ��DES����MacKey*/
  this.loadMacKey = function(strMacKey)
  {
    this.loadEncryptedKey("MACKey", strMacKey, this.strMasterKey4Mac, "MACING,CRYPT");
  }
  /*��װ������Կ�����ܣ���MacKey*/
  this.loadSM4MacKey = function(strSM4MacKey)
  {
    this.loadEncryptedKey("SM4MACKey", strSM4MacKey, this.strSM4MasterKey4Mac, "MACING,CRYPT");
  }
  /*��װ��������Կ��MasterKey*/
  this.loadMasterKey = function(strMasterKey)
  {
    this.loadEncryptedKey("MasterKey", strMasterKey, "MasterKey", "KEYENCKEY");
  }
  
  /*ʹ��ָ����Կ����ECB����*/
  this.encryptECB = function(data, encryptName, addChar, retFunction)
  {
    this.EncryptECB_data = data;
    this.EncryptECB_encryptName = encryptName;
    this.EncryptECB_addChar = addChar;
    this.EncryptECB_function = retFunction;
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.pinpad.disablePlain4EncryptECB_F();}, 500);
  }
  
  /*��ֹ��������*/
  this.disablePlain4EncryptECB_F = function()
  {
    top.pinpad.PinPadEvents.appendEvent("Cancelled", top.pinpad.onCancelled4EncryptECB);
    // ȡ���������볬ʱ����
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.pinpad.onCancelled4EncryptECB();}, 10*1000);
    top.journalPrinter.addJournalWithTime("�ر�����(ECB) Pinpad command CancelUserEntry" );
    top.YHAXPinPad.CancelUserEntry(); 
  }
  
  /*�������ķ�ʽ��ȡ����׼���ý���EncryptECB�Ļص�����*/
  this.onCancelled4EncryptECB = function()
  {
    // ֹͣȡ���������볬ʱ����
    top.serviceCtrl.stopFlowCtrlTimeout();

    top.pinpad.PinPadEvents.appendEvent("EncryptComplete", top.pinpad.onEncryptECBComplete);
    top.journalPrinter.addJournalWithTime("����(ECB) Pinpad command EncryptECB" );
    top.YHAXPinPad.EncryptECB(top.pinpad.EncryptECB_data, top.pinpad.EncryptECB_encryptName, top.pinpad.EncryptECB_addChar);
  }
  
  /*EncryptECB��ɺ�Ļص�����*/
  this.onEncryptECBComplete = function(data)
  {
	var strData = new top.StringCtrl("").byteArr2HexStr(data);
    // �ָ��������ķ�ʽ
    top.pinpad.userEntry();
    top.pinpad.EncryptECB_function(strData);
  }
}
