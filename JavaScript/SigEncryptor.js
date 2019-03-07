/*
  电子密码签名操作类
 */
function SigEncryptor()
{	
  // 电子密码签名虚模块事件响应对象
  this.SigEncryptorEvents = new top.EventHandling(top.YHAXSigEncryptor);
  /*加密的本地主密钥名称*/
  this.strLocalMasterKey = "LocalMaster";
  this.LocalMaster = "0000000000000000";//电子密码签名密钥
  //------------------------- 电子密码签名执行的方法 -------------------------//   
  
  /*下装密钥明文*/
  this.loadLocalKey = function(keyname, keyvalue, useflags)
  {
	top.journalPrinter.addJournalWithTime("下装本地密钥 SigEncryptor command loadLocalKey");
    var bytearr = new top.StringCtrl("").hexStr2ByteArr(keyvalue);
    var identification = new top.StringCtrl("").hexStr2ByteArr("");
    top.sigEncryptor.SigEncryptorEvents.clearAll();
    top.sigEncryptor.SigEncryptorEvents.appendEvent("KeyLoaded", top.sigEncryptor.onLocalKeyLoaded);
	top.sigEncryptor.SigEncryptorEvents.appendEvent("DeviceError", top.sigEncryptor.onLoadLocalKeyDeviceError);
	top.sigEncryptor.SigEncryptorEvents.appendEvent("FatalError", top.sigEncryptor.onLoadLocalKeyDeviceError);
    try{top.YHAXSigEncryptor.ExtendedLoadKey(keyname, bytearr, useflags, identification);}catch(e){top.sigEncryptor.onLoadLocalKeyDeviceError();}
	
  }
  
    /*装载密钥已经完成*/
  this.onLocalKeyLoaded = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("装载本地密钥完成 SigEncryptor Event onLocalKeyLoaded");
    top.sigEncryptor.SigEncryptorEvents.clearAll();
    if (typeof(top.MainFrame.onLocalKeyLoaded) == "function"){
      top.MainFrame.onLocalKeyLoaded();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onLocalKeyLoaded) == "function"){
      top.MainFrame.window.frames["ifreamSign"].onLocalKeyLoaded();
	}
  }
  
  /*装载密钥时硬件故障*/
  this.onLoadLocalKeyDeviceError = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("装载本地密钥时硬件故障 SigEncryptor Event onLoadLocalKeyDeviceError");
	top.sigEncryptor.SigEncryptorEvents.clearAll();
    if (typeof(top.MainFrame.onLoadLocalKeyDeviceError) == "function"){
      top.MainFrame.onLoadLocalKeyDeviceError();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onLoadLocalKeyDeviceError) == "function"){
      top.MainFrame.window.frames["ifreamSign"].onLoadLocalKeyDeviceError();
	}
  }
  
  /*使用指定密钥进行ECB加密*/
  this.sigEncryptECB = function()
  {
	top.journalPrinter.addJournalWithTime("使用本地密钥进行ECB加密 SigEncryptor command sigEncryptECB");
	var bytearrHEX = new top.StringCtrl("").hexStr2ByteArr(top.sigEncryptor.LocalMaster);
    top.sigEncryptor.SigEncryptorEvents.appendEvent("DecryptComplete", top.sigEncryptor.onSigEncryptECBComplete);
	top.sigEncryptor.SigEncryptorEvents.appendEvent("DeviceError", top.sigEncryptor.onLoadLocalKeyDeviceError);
	top.sigEncryptor.SigEncryptorEvents.appendEvent("FatalError", top.sigEncryptor.onLoadLocalKeyDeviceError);
    //top.YHAXSigEncryptor.EncryptECB(bytearrHEX,top.sigEncryptor.strLocalMasterKey,0x0);
	top.YHAXSigEncryptor.DataCrypt("LocalMaster", bytearrHEX, "Encrypt", "DESECB",0x0,"","","");
  }
  
  /*SigEncryptECB完成后的回调函数*/
  this.onSigEncryptECBComplete = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("调用本地密钥ECB加密完成 SigEncryptor Event onSigEncryptECBComplete");
	top.sigEncryptor.SigEncryptorEvents.clearAll();
    if (typeof(top.MainFrame.onSigEncryptECBComplete) == "function"){
      top.MainFrame.onSigEncryptECBComplete();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onSigEncryptECBComplete) == "function"){
      top.MainFrame.window.frames["ifreamSign"].onSigEncryptECBComplete();
	}
  }
}
