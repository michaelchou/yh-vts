/*
  ��������ǩ��������
 */
function SigEncryptor()
{	
  // ��������ǩ����ģ���¼���Ӧ����
  this.SigEncryptorEvents = new top.EventHandling(top.YHAXSigEncryptor);
  /*���ܵı�������Կ����*/
  this.strLocalMasterKey = "LocalMaster";
  this.LocalMaster = "0000000000000000";//��������ǩ����Կ
  //------------------------- ��������ǩ��ִ�еķ��� -------------------------//   
  
  /*��װ��Կ����*/
  this.loadLocalKey = function(keyname, keyvalue, useflags)
  {
	top.journalPrinter.addJournalWithTime("��װ������Կ SigEncryptor command loadLocalKey");
    var bytearr = new top.StringCtrl("").hexStr2ByteArr(keyvalue);
    var identification = new top.StringCtrl("").hexStr2ByteArr("");
    top.sigEncryptor.SigEncryptorEvents.clearAll();
    top.sigEncryptor.SigEncryptorEvents.appendEvent("KeyLoaded", top.sigEncryptor.onLocalKeyLoaded);
	top.sigEncryptor.SigEncryptorEvents.appendEvent("DeviceError", top.sigEncryptor.onLoadLocalKeyDeviceError);
	top.sigEncryptor.SigEncryptorEvents.appendEvent("FatalError", top.sigEncryptor.onLoadLocalKeyDeviceError);
    try{top.YHAXSigEncryptor.ExtendedLoadKey(keyname, bytearr, useflags, identification);}catch(e){top.sigEncryptor.onLoadLocalKeyDeviceError();}
	
  }
  
    /*װ����Կ�Ѿ����*/
  this.onLocalKeyLoaded = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("װ�ر�����Կ��� SigEncryptor Event onLocalKeyLoaded");
    top.sigEncryptor.SigEncryptorEvents.clearAll();
    if (typeof(top.MainFrame.onLocalKeyLoaded) == "function"){
      top.MainFrame.onLocalKeyLoaded();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onLocalKeyLoaded) == "function"){
      top.MainFrame.window.frames["ifreamSign"].onLocalKeyLoaded();
	}
  }
  
  /*װ����ԿʱӲ������*/
  this.onLoadLocalKeyDeviceError = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("װ�ر�����ԿʱӲ������ SigEncryptor Event onLoadLocalKeyDeviceError");
	top.sigEncryptor.SigEncryptorEvents.clearAll();
    if (typeof(top.MainFrame.onLoadLocalKeyDeviceError) == "function"){
      top.MainFrame.onLoadLocalKeyDeviceError();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onLoadLocalKeyDeviceError) == "function"){
      top.MainFrame.window.frames["ifreamSign"].onLoadLocalKeyDeviceError();
	}
  }
  
  /*ʹ��ָ����Կ����ECB����*/
  this.sigEncryptECB = function()
  {
	top.journalPrinter.addJournalWithTime("ʹ�ñ�����Կ����ECB���� SigEncryptor command sigEncryptECB");
	var bytearrHEX = new top.StringCtrl("").hexStr2ByteArr(top.sigEncryptor.LocalMaster);
    top.sigEncryptor.SigEncryptorEvents.appendEvent("DecryptComplete", top.sigEncryptor.onSigEncryptECBComplete);
	top.sigEncryptor.SigEncryptorEvents.appendEvent("DeviceError", top.sigEncryptor.onLoadLocalKeyDeviceError);
	top.sigEncryptor.SigEncryptorEvents.appendEvent("FatalError", top.sigEncryptor.onLoadLocalKeyDeviceError);
    //top.YHAXSigEncryptor.EncryptECB(bytearrHEX,top.sigEncryptor.strLocalMasterKey,0x0);
	top.YHAXSigEncryptor.DataCrypt("LocalMaster", bytearrHEX, "Encrypt", "DESECB",0x0,"","","");
  }
  
  /*SigEncryptECB��ɺ�Ļص�����*/
  this.onSigEncryptECBComplete = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("���ñ�����ԿECB������� SigEncryptor Event onSigEncryptECBComplete");
	top.sigEncryptor.SigEncryptorEvents.clearAll();
    if (typeof(top.MainFrame.onSigEncryptECBComplete) == "function"){
      top.MainFrame.onSigEncryptECBComplete();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onSigEncryptECBComplete) == "function"){
      top.MainFrame.window.frames["ifreamSign"].onSigEncryptECBComplete();
	}
  }
}
