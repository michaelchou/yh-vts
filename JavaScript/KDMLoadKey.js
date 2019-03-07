/*
  密钥分发器
 */
function KDMLoadKey()
{ 
  // 密钥分发器虚模块事件响应对象
  this.kdmEvents = new top.EventHandling(top.YHAXKDMLoadKey);
  
  /*打开设备*/
  this.openDevice = function()
  {
	top.journalPrinter.addJournalWithTime("打开设备 KDMLoadKey command openDevice");
    top.kdmLoadKey.kdmEvents.clearAll();
    top.kdmLoadKey.kdmEvents.appendEvent("DeviceOpen", top.kdmLoadKey.onDeviceOpen);
    top.kdmLoadKey.kdmEvents.appendEvent("DeviceOpenError", top.kdmLoadKey.onDeviceOpenError);
    top.YHAXKDMLoadKey.OpenDevice();
  }
  
  /*接收数据*/
  this.readData = function()
  {
	top.journalPrinter.addJournalWithTime("接收数据 KDMLoadKey command readData");
    top.kdmLoadKey.kdmEvents.clearAll();
    top.kdmLoadKey.kdmEvents.appendEvent("DataRecieved", top.kdmLoadKey.onDataRecieved);
    top.YHAXKDMLoadKey.ReadData();
  }
  
  /*接收数据*/
  this.dispatchData = function()
  {
	top.journalPrinter.addJournalWithTime("接收数据 KDMLoadKey command dispatchData");
    top.kdmLoadKey.kdmEvents.clearAll();
    top.kdmLoadKey.kdmEvents.appendEvent("KeyDecrypted", top.kdmLoadKey.onKeyDecrypted);
	top.kdmLoadKey.kdmEvents.appendEvent("KeyDecryptFailed", top.kdmLoadKey.onKeyDecryptFailed);
    top.YHAXKDMLoadKey.dispatchData();
  }
  
  /*回应请求*/
  this.assembleMsg = function()
  {
	top.journalPrinter.addJournalWithTime("回应请求 KDMLoadKey Event assembleMsg");
    top.kdmLoadKey.kdmEvents.clearAll();
    var iRet = top.YHAXKDMLoadKey.assembleMsg(1);
	if(iRet ==0){
       top.kdmLoadKey.onAssembleMsg();
    }else{
       top.kdmLoadKey.onAssembleMsgError();
    }
  }
 
  /*密钥分发器打卡成功回调函数*/
  this.onDeviceOpen = function()
  {
	
	var strCommPort = top.YHAXKDMLoadKey.StComm;
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("密钥分发器打开串口完成(串口号:" + strCommPort + ")" + " KDMLoadKey Event onDeviceOpen");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceOpen) == "function"){   
      top.MainFrame.onDeviceOpen();
    }
  }

  /*密钥分发器打开失败回调函数*/
  this.onDeviceOpenError = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("密钥分发器打开失败 KDMLoadKey Event onDeviceOpenError");
    top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceOpenError) == "function")
      top.MainFrame.onDeviceOpenError();
    else if (typeof(top.onDeviceOpenError) == "function")
      top.onDeviceOpenError();
  }

  /*接收数据成功回调函数*/
  this.onDataRecieved = function()
  {
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("密钥分发器接收数据成功 KDMLoadKey Event onDataRecieved");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onDataRecieved) == "function"){   
      top.MainFrame.onDataRecieved();
    }
  }
  
  /*请求密钥成功回调函数*/
  this.onKeyDecrypted = function()
  {
	var strMasterKey = top.YHAXKDMLoadKey.decryptedTMK;
	top.pool.set("strMasterKey", strMasterKey);
	top.journalPrinter.addJournalWithTime("密钥分发器请求密钥成功 KDMLoadKey Event onKeyDecrypted");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onKeyDecrypted) == "function"){   
      top.MainFrame.onKeyDecrypted();
    }
  }
  
  /*请求密钥失败回调函数*/
  this.onKeyDecryptFailed = function()
  {
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("密钥分发器请求密钥失败 KDMLoadKey Event onKeyDecryptFailed");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onKeyDecryptFailed) == "function"){   
      top.MainFrame.onKeyDecryptFailed();
    }
  }
  
  /*回应请求成功回调函数*/
  this.onAssembleMsg = function()
  {
	var strKey = top.YHAXKDMLoadKey.decryptedTMK;
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("密钥分发器回应请求成功 KDMLoadKey Event onAssembleMsg");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onAssembleMsg) == "function"){   
      top.MainFrame.onAssembleMsg();
    }
  }
  
  /*回应请求失败回调函数*/
  this.onAssembleMsgError = function()
  {
	var strKey = top.YHAXKDMLoadKey.decryptedTMK;
	//记录终端流水
	top.journalPrinter.addJournalWithTime("密钥分发器回应请求失败 KDMLoadKey Event onAssembleMsgError");
	top.kdmLoadKey.kdmEvents.clearAll();
    if (typeof(top.MainFrame.onAssembleMsgError) == "function"){   
      top.MainFrame.onAssembleMsgError();
    }
  }
  
}
