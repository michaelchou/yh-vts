
/*
  密码键盘操作类
  实现对密码键盘的明文输入、密文输入、按键转换、密钥下发和报文加密等操作
 */
function Pinpad()
{
  // 密码键盘虚模块事件响应对象
  this.PinPadEvents = new top.EventHandling(top.YHAXPinPad);
  //------------------------- 密码键盘操作类私有属性 -------------------------//
  /*参与ECB加密的数据*/
  this.EncryptECB_data;
  /*参与ECB加密的密钥名称*/
  this.EncryptECB_encryptName;
  /*补位符*/
  this.EncryptECB_addChar;
  /*返回函数*/
  this.EncryptECB_function;
  /*加密PinKey(DES)的主密钥名称*/
  this.strMasterKey4Pin = "MasterKey";
  /*加密PinKey(国密)的主密钥名称*/
  this.strSM4MasterKey4Pin = "SM4MasterKey";
  /*加密MacKey(DES)的主密钥名称*/
  this.strMasterKey4Mac = "MasterKey";
  /*加密MacKey(国密)的主密钥名称*/
  this.strSM4MasterKey4Mac = "SM4MasterKey";
  /*参与PINBLOCK计算的卡号位数是否是倒数第二位起向前截取12位*/
  this.PanLenCheck = false;
  /*密码最小长度*/
  this.iMinPinLen = 4;
  /*密码最大长度*/
  this.iMaxPinLen = 6;
   /*存折原密码密码最小长度*/
  this.iPassMinPinLen = 1;
  /*存折原密码密码最大长度*/
  this.iPassMaxPinLen = 6;
  /*存单原密码密码最小长度*/
  this.iCDSMinPinLen = 1;
  /*存单原密码密码最大长度*/
  this.iCDSMaxPinLen = 6;
  
  /*密码键盘支持的按键集合*/
  this.KeySupported = top.YHAXPinPad.CpKeysSupported;    
  /*是否需要发送签到交易*/
  this.bGetWorkingKey = true;
    
//------------------------- 密码键盘执行的方法 -------------------------//

  /*等待用户输入明文*/
  this.userEntry = function()
  {
    top.pinpad.PinPadEvents.clearAll();
	top.guidelights.setPinPadLight("OFF");
    top.pinpad.PinPadEvents.appendEvent("KeyPressed", top.pinpad.onKeyPressed);
    top.journalPrinter.addJournalWithTime("打开明文 Pinpad command UserEntry" );
	if(this.KeySupported != null && this.KeySupported.length > 0){
		top.YHAXPinPad.UserEntry(0, false, this.KeySupported, "", -1);
	}else{
		top.YHAXPinPad.UserEntry(0, false, "0,1,2,3,4,5,6,7,8,9,00,ENTER,CANCEL,CLEAR,.", "", -1);
	} 
  }
 
  /*取消等待用户输入明文*/
  this.cancelUserEntry = function()
  {
  	top.pinpad.PinPadEvents.clearAll();
    top.pinpad.PinPadEvents.appendEvent("Cancelled", top.pinpad.onPlainCancelled);
    top.journalPrinter.addJournalWithTime("关闭明文 Pinpad command CancelUserEntry");
    top.YHAXPinPad.CancelUserEntry();  
  }
  
  /*
  * 等待用户输入密码
  * 参数：activeKeys 允许输入的键值
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
	top.journalPrinter.addJournalWithTime("打开密文(卡号加密) Pinpad command BufferPIN");
    top.YHAXPinPad.BufferPIN(top.pinpad.iMinPinLen, top.pinpad.iMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  /*将用户输入的密码加密为密码块*/
  this.onPinBuffered = function()
  {
    /*停止超时保护*/
    top.serviceCtrl.stopFlowCtrlTimeout();
    var strPanData = top.pool.get("strPan");
	var len = strPanData.length;
    /*判断是否需要截取12位卡号*/
    if (top.pinpad.PanLenCheck)
    {

      if (len > 12)
        strPanData = strPanData.substring(len-13, len-1);
    }
	if(len < 12)//卡号长度小于12位时，补足12位
	{
		strPanData  = new top.StringCtrl(strPanData).suffixStr('0',12);
	}
    top.pinpad.PinPadEvents.appendEvent("PinFormatted", top.pinpad.onPinFormatted);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("加密(卡号加密) Pinpad command FormatPin" );
	if(top.pool.get("strEncrypType") == "SM4"){//国密
		top.YHAXPinPad.FormatPin("ANSI", strPanData, 0x0F, "SM4PINKey", "", "");
	}else{
		top.YHAXPinPad.FormatPin("ANSI", strPanData, 0x0F, "PINKey", "", "");
	} 
  }
  
  /*
  * 等待用户输入密码(主要是针对客户号)
  * 参数：activeKeys 允许输入的键值
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
	top.journalPrinter.addJournalWithTime("打开密文(客户号加密) Pinpad command BufferPIN");
    top.YHAXPinPad.BufferPIN(top.pinpad.iMinPinLen, top.pinpad.iMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  /*将用户输入的密码加密为密码块*/
  this.onPinBufferedCustom = function()
  {
    /*停止超时保护*/
    top.serviceCtrl.stopFlowCtrlTimeout();
    var strCustomerId = top.pool.get("strCustomerId");
	var len = strCustomerId.length;
    /*判断是否需要截取12位卡号*/
    if (top.pinpad.PanLenCheck)
    {

      if (len > 12)
        strCustomerId = strCustomerId.substring(len-13, len-1);
    }
	if(len < 12)//卡号长度小于12位时，补足12位
	{
		strCustomerId  = new top.StringCtrl(strCustomerId).suffixStr('0',12);
	}
    top.pinpad.PinPadEvents.appendEvent("PinFormatted", top.pinpad.onPinFormatted);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("加密(客户号加密) Pinpad command FormatPin" );
	if(top.pool.get("strEncrypType") == "SM4"){//国密
		top.YHAXPinPad.FormatPin("ANSI", strCustomerId, 0x0F, "SM4PINKey", "", "");
	}else{
		top.YHAXPinPad.FormatPin("ANSI", strCustomerId, 0x0F, "PINKey", "", "");
	} 
  }
  
   /*
  * 等待用户输入密码(主要是针对存折号)
  * 参数：activeKeys 允许输入的键值
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
	top.journalPrinter.addJournalWithTime("打开密文(存折号加密) Pinpad command BufferPIN" );
    top.YHAXPinPad.BufferPIN(top.pinpad.iMinPinLen, top.pinpad.iMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  /*
  * 等待用户输入密码(主要是针对存折号)
  * 参数：activeKeys 允许输入的键值
  * 存折原密码支持1-6位
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
	top.journalPrinter.addJournalWithTime("打开密文(存折号加密 支持1-6位) Pinpad command BufferPIN" );
    top.YHAXPinPad.BufferPIN(top.pinpad.iPassMinPinLen, top.pinpad.iPassMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  /*将用户输入的密码加密为密码块*/
  this.onPinBufferedPassBook = function()
  {
    /*停止超时保护*/
    top.serviceCtrl.stopFlowCtrlTimeout();
    var strPassBookNum = top.pool.get("strPassBookNum");
	var len = strPassBookNum.length;
    /*判断是否需要截取12位卡号*/
    if (top.pinpad.PanLenCheck)
    {

      if (len > 12)
        strPassBookNum = strPassBookNum.substring(len-13, len-1);
    }
	if(len < 12)//卡号长度小于12位时，补足12位
	{
		strPassBookNum = new top.StringCtrl(strPassBookNum).suffixStr('0',12);
	}
    top.pinpad.PinPadEvents.appendEvent("PinFormatted", top.pinpad.onPinFormatted);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("加密(存折号加密) Pinpad command FormatPin" );
	if(top.pool.get("strEncrypType") == "SM4"){//国密
		top.YHAXPinPad.FormatPin("ANSI",strPassBookNum, 0x0F, "SM4PINKey", "", "");
	}else{
		top.YHAXPinPad.FormatPin("ANSI",strPassBookNum, 0x0F, "PINKey", "", "");
	} 
  }
  
  /*
  * 等待用户输入密码(主要是针对存单账号)
  * 参数：activeKeys 允许输入的键值
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
	top.journalPrinter.addJournalWithTime("打开密文(存单号加密) Pinpad command BufferPIN" );
    top.YHAXPinPad.BufferPIN(top.pinpad.iMinPinLen, top.pinpad.iMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  
   /*
  * 等待用户输入密码(主要是针对存单账号)
  * 参数：activeKeys 允许输入的键值
  *存单原密码支持1-6位
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
	top.journalPrinter.addJournalWithTime("打开密文(存单号加密 支持1-6位) Pinpad command BufferPIN");
    top.YHAXPinPad.BufferPIN(top.pinpad.iCDSMinPinLen, top.pinpad.iCDSMaxPinLen, true, "NUMBERS,ENTER,CLEAR", "ENTER", top.serviceCtrl.iUserTimeout*1000);
  }
  
  
  /*将用户输入的密码加密为密码块*/
  this.onPinBufferedCDS = function()
  {
    /*停止超时保护*/
    top.serviceCtrl.stopFlowCtrlTimeout();
    var strCDSNum = top.pool.get("strCDSNum");
	var len = strCDSNum.length;
    /*判断是否需要截取12位卡号*/
    if (top.pinpad.PanLenCheck)
    {

      if (len > 12)
        strCDSNum = strCDSNum.substring(len-13, len-1);
    }
	if(len < 12)//卡号长度小于12位时，补足12位
	{
		strCDSNum = new top.StringCtrl(strCDSNum).suffixStr('0',12);
	}
    top.pinpad.PinPadEvents.appendEvent("PinFormatted", top.pinpad.onPinFormatted);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onDeviceError_Pinpad);
	top.journalPrinter.addJournalWithTime("加密(存单号加密) Pinpad command FormatPin" );
	if(top.pool.get("strEncrypType") == "SM4"){//国密
		top.YHAXPinPad.FormatPin("ANSI",strCDSNum, 0x0F, "SM4PINKey", "", "");
	}else{
		top.YHAXPinPad.FormatPin("ANSI",strCDSNum, 0x0F, "PINKey", "", "");
	} 
  }  
  /*取消等待用户输入密码*/
  this.cancelPINEntry = function()
  {	
	top.journalPrinter.addJournalWithTime("取消输入密码 Pinpad command CancelPINEntry" );
	top.guidelights.setPinPadLight("OFF");
    top.YHAXPinPad.CancelPINEntry();
  }
  
  /*下装密钥明文*/
  this.loadKey = function(keyname, keyvalue, useflags)
  {
    var bytearr = new top.StringCtrl("").hexStr2ByteArr(keyvalue);
    var identification = new top.StringCtrl("").hexStr2ByteArr("");
    top.pinpad.PinPadEvents.clearAll();
    top.pinpad.PinPadEvents.appendEvent("KeyLoaded", top.pinpad.onKeyLoaded);
	top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onLoadKeyDeviceError);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onLoadKeyDeviceError);
	top.journalPrinter.addJournalWithTime("下装密钥明文 Pinpad command ExtendedLoadKey");
    try{top.YHAXPinPad.ExtendedLoadKey(keyname, bytearr, useflags, identification);}catch(e){top.pinpad.onLoadKeyDeviceError();}
  }
  
  /*下装加密的密钥*/
  this.loadEncryptedKey = function(keyname, keyvalue, enckeyname, useflags)
  {
    var bytearr = new top.StringCtrl("").hexStr2ByteArr(keyvalue);
    var identification = new top.StringCtrl("").hexStr2ByteArr("");
    top.pinpad.PinPadEvents.clearAll();
	top.pinpad.PinPadEvents.appendEvent("KeyLoaded", top.pinpad.onKeyLoaded);
    top.pinpad.PinPadEvents.appendEvent("DeviceError", top.pinpad.onLoadKeyDeviceError);
	top.pinpad.PinPadEvents.appendEvent("FatalError", top.pinpad.onLoadKeyDeviceError);
	top.journalPrinter.addJournalWithTime("下装加密的密钥 Pinpad command ExtendedLoadEncryptedKey" );
    try{top.YHAXPinPad.ExtendedLoadEncryptedKey(keyname, bytearr, enckeyname, useflags, identification);}catch(e){top.pinpad.onLoadKeyDeviceError();}
  }

  /*用户按键的事件回调的处理函数*/
  this.onKeyPressed = function(Key, KeyCode)
  {
    /*在部分机器上输入密码时，Key为""，需要转换
     * 部分设备的按键值被错误的设置了Shift方式，需要替换
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
 
//-------------------------- 响应读卡器事件的方法 -------------------------//

  /*密码键盘硬件故障的事件响应*/
  this.onDeviceError_Pinpad = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("密码键盘故障 Pinpad Event onDeviceError_Pinpad" );
	top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//打开明文输入
    if (typeof(top.MainFrame.onDeviceError_Pinpad) == "function")
      top.MainFrame.onDeviceError_Pinpad();
  }

  /*明文输入被取消的事件响应*/
  this.onPlainCancelled = function()
  {
	top.journalPrinter.addJournalWithTime("明文输入被取消 Pinpad Event onPlainCancelled" );
    top.pinpad.PinPadEvents.clearAll();
    if (typeof(top.MainFrame.onPlainCancelled) == "function"){
      top.MainFrame.onPlainCancelled();
	}
  }
  
  /*密码块转换完成的事件响应*/
  this.onPinFormatted = function(pinblock)
  {
	top.journalPrinter.addJournalWithTime("密码块转换完成 Pinpad Event onPinFormatted" );
    var strPinBlock = new top.StringCtrl("").byteArr2HexStr(pinblock);
    top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//打开明文输入
    if (typeof(top.MainFrame.onGetPinBlockOK) == "function")
      top.MainFrame.onGetPinBlockOK(strPinBlock);
  }
  
  /*密文输入异常情况
   */
  this.onPinCancelled = function()
  {
	top.journalPrinter.addJournalWithTime("密文输入取消 Pinpad Event onPinCancelled");
    top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//打开明文输入
    if(typeof(top.MainFrame.onPinCancelled) == "function")
   	{
   		top.MainFrame.onPinCancelled();
   	}
  }
  
  /*用户输入Pin时超时*/
  this.onPinInputTimeout = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("输入Pin超时 Pinpad Event onPinInputTimeout" );
	top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//打开明文输入
    if (typeof(top.MainFrame.onPinInputTimeout) == "function")
      top.MainFrame.onPinInputTimeout();
  }
  
  /*装载密钥已经完成*/
  this.onKeyLoaded = function()
  {
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("装载密钥完成 Pinpad Event onKeyLoaded");
    top.pinpad.PinPadEvents.clearAll();
    if (typeof(top.MainFrame.onKeyLoaded) == "function"){
      top.MainFrame.onKeyLoaded();
	}
	else if (typeof(top.onKeyLoaded) == "function"){
      top.onKeyLoaded();
	}
  }
  
  /*装载密钥时硬件故障*/
  this.onLoadKeyDeviceError = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("装载密钥硬件故障 Pinpad Event onLoadKeyDeviceError" );
	top.pinpad.PinPadEvents.clearAll();
	top.pinpad.userEntry();//打开明文输入
    if (typeof(top.MainFrame.onLoadKeyDeviceError) == "function"){
      top.MainFrame.onLoadKeyDeviceError();
	}
	else if (typeof(top.onLoadKeyDeviceError) == "function"){
      top.onLoadKeyDeviceError();
	}
  }
  
//------------------------- 其它辅助方法 -------------------------//  
  /*下装工作密钥（DES）：PinKey*/
  this.loadPinKey = function(strPinKey)
  {
    this.loadEncryptedKey("PINKey", strPinKey, this.strMasterKey4Pin, "FUNCTION");
  }
  /*下装工作密钥（国密）：PinKey*/
  this.loadSM4PinKey = function(strSM4PinKey)
  {
    this.loadEncryptedKey("SM4PINKey", strSM4PinKey, this.strSM4MasterKey4Pin, "FUNCTION");
  }
  /*下装工作密钥（DES）：MacKey*/
  this.loadMacKey = function(strMacKey)
  {
    this.loadEncryptedKey("MACKey", strMacKey, this.strMasterKey4Mac, "MACING,CRYPT");
  }
  /*下装工作密钥（国密）：MacKey*/
  this.loadSM4MacKey = function(strSM4MacKey)
  {
    this.loadEncryptedKey("SM4MACKey", strSM4MacKey, this.strSM4MasterKey4Mac, "MACING,CRYPT");
  }
  /*下装密文主密钥：MasterKey*/
  this.loadMasterKey = function(strMasterKey)
  {
    this.loadEncryptedKey("MasterKey", strMasterKey, "MasterKey", "KEYENCKEY");
  }
  
  /*使用指定密钥进行ECB加密*/
  this.encryptECB = function(data, encryptName, addChar, retFunction)
  {
    this.EncryptECB_data = data;
    this.EncryptECB_encryptName = encryptName;
    this.EncryptECB_addChar = addChar;
    this.EncryptECB_function = retFunction;
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.pinpad.disablePlain4EncryptECB_F();}, 500);
  }
  
  /*禁止输入明文*/
  this.disablePlain4EncryptECB_F = function()
  {
    top.pinpad.PinPadEvents.appendEvent("Cancelled", top.pinpad.onCancelled4EncryptECB);
    // 取消明文输入超时保护
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.pinpad.onCancelled4EncryptECB();}, 10*1000);
    top.journalPrinter.addJournalWithTime("关闭明文(ECB) Pinpad command CancelUserEntry" );
    top.YHAXPinPad.CancelUserEntry(); 
  }
  
  /*输入明文方式被取消后，准备好进行EncryptECB的回调函数*/
  this.onCancelled4EncryptECB = function()
  {
    // 停止取消明文输入超时保护
    top.serviceCtrl.stopFlowCtrlTimeout();

    top.pinpad.PinPadEvents.appendEvent("EncryptComplete", top.pinpad.onEncryptECBComplete);
    top.journalPrinter.addJournalWithTime("加密(ECB) Pinpad command EncryptECB" );
    top.YHAXPinPad.EncryptECB(top.pinpad.EncryptECB_data, top.pinpad.EncryptECB_encryptName, top.pinpad.EncryptECB_addChar);
  }
  
  /*EncryptECB完成后的回调函数*/
  this.onEncryptECBComplete = function(data)
  {
	var strData = new top.StringCtrl("").byteArr2HexStr(data);
    // 恢复输入明文方式
    top.pinpad.userEntry();
    top.pinpad.EncryptECB_function(strData);
  }
}
