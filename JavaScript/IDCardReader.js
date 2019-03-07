/*
  二代证类
 */
function IDCardReader()
{ 
  var isOK = true;//读取身份证信息是否合法,默认是合法
  // 二代证虚模块事件响应对象
  this.IDCardEvents = new top.EventHandling(top.YHAXIDCardReader);
  
  /*等待用户插插入二代证并读取数据*/
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
	// 控制指示灯
    try{top.guidelights.setEnvelopeDispenserLight("MEDIUM");}catch(e){}
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("等待用户插入身份证 IDCardReader Event accept"); 
  }

  /*二代证放入回调函数*/
  this.onCardInserted = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("身份证已插入 IDCardReader Event onCardInserted"); 
	// 控制指示灯
    try{top.guidelights.setEnvelopeDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardInserted_ID) == "function")
      top.MainFrame.onCardInserted_ID();
  }
  
   /*等待代理人插插入二代证并读取数据*/
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
	// 控制指示灯
    try{top.guidelights.setEnvelopeDispenserLight("MEDIUM");}catch(e){}
	// 记录终端流水
	top.journalPrinter.addJournalWithTime("等待代理人插入身份证 IDCardReader Event acceptAgent"); 
  }
  
    /*读取代理人二代证信息完成回调函数*/
  this.onAgentCardReaded = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("读取代理人身份证信息完成 IDCardReader Event onAgentCardReaded"); 
	top.idCardReader.IDCardEvents.clearAll();
	var strIDData = top.YHAXIDCardReader.SFZDataInfo;//身份证信息
	if (strIDData.indexOf("|") > 0) {//判断数据中是否存在“|”，防止读身份证的时候，插入了银行卡
	   isOK = true;
	   top.pool.set("strAgentIDName", strIDData.split("|")[0].substr(strIDData.split("|")[0].indexOf('=') + 1, strIDData.split("|")[0].length));
	   top.pool.set("strAgentIDSex", strIDData.split("|")[1].substr(strIDData.split("|")[1].indexOf('=') + 1, strIDData.split("|")[1].length));
	   if(null != top.pool.get("strAgentIDSex") && top.pool.get("strAgentIDSex") == "男") {
		   top.pool.set("strAgentIDSexNum", "1");
	   }else if(null != top.pool.get("strAgentIDSex") && top.pool.get("strAgentIDSex") == "女") {
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
	   if(null != strAgentIDEndDate && strAgentIDEndDate.indexOf("长期") != -1) {
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
         top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_ID_READFAILED, "读取身份证信息失败");
      }
	}
  }
  
  /*读取二代证信息完成回调函数*/
  this.onCardReaded = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("读取身份证信息完成 IDCardReader Event onCardReaded");
	top.idCardReader.IDCardEvents.clearAll();
	var strIDData = top.YHAXIDCardReader.SFZDataInfo;//身份证信息
	if (strIDData.indexOf("|") > 0) {//判断数据中是否存在“|”，防止读身份证的时候，插入了银行卡
	   isOK = true;
	   top.pool.set("strIDName", strIDData.split("|")[0].substr(strIDData.split("|")[0].indexOf('=') + 1, strIDData.split("|")[0].length));
	   top.pool.set("strIDSex", strIDData.split("|")[1].substr(strIDData.split("|")[1].indexOf('=') + 1, strIDData.split("|")[1].length));
	   if(null != top.pool.get("strIDSex") && top.pool.get("strIDSex") == "男") {
		   top.pool.set("strIDSexNum", "1");
	   }else if(null != top.pool.get("strIDSex") && top.pool.get("strIDSex") == "女") {
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
	   if(strIDEndDate != null && strIDEndDate.indexOf("长期") != -1) {
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
         top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_ID_READFAILED, "读取身份证信息失败");
      }
	}
  }

  /*无效二代证回调函数*/
  this.onCardInvalid = function()
  {
	isOK = false;
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("无效身份证 IDCardReader Event onCardInvalid");
    top.idCardReader.IDCardEvents.clearAll();
	if(top.idCardReader.isCardPresent())//如果身份证存在，直接退出身份证
	{
	   top.YHAXIDCardReader.Eject(120*1000);
	}
    if (typeof(top.MainFrame.onCardInvalid_ID) == "function")
      top.MainFrame.onCardInvalid_ID();
  }

  /*读二代证超时*/
  this.onTimeout = function()
  {
	isOK = false;
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("读取身份证信息超时 IDCardReader Event onTimeout");
	top.idCardReader.IDCardEvents.clearAll();
	if(top.idCardReader.isCardPresent())//如果身份证存在，直接退出身份证
	{
	   top.YHAXIDCardReader.Eject(120*1000);
	}
  	// 控制指示灯
    try{top.guidelights.setEnvelopeDispenserLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onTimeout_ID) == "function")
      top.MainFrame.onTimeout_ID();
  }

  /*硬件故障回调函数*/
  this.onDeviceError = function()
  {
	isOK = false;
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("身份证读卡器硬件模块故障 IDCardReader Event onDeviceError");
    top.idCardReader.IDCardEvents.clearAll();
	if(top.idCardReader.isCardPresent())//如果身份证存在，直接退出身份证
	{
	   top.YHAXIDCardReader.Eject(120*1000);
	}
    if (typeof(top.MainFrame.onDeviceError_ID) == "function")
      top.MainFrame.onDeviceError_ID();
    else if (typeof(top.onDeviceError_ID) == "function")
      top.onDeviceError_ID();
  }

  /*取消允许进二代证*/
  this.cancelAccept = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("取消允许插入身份证 IDCardReader Commond cancelAccept");
    top.idCardReader.IDCardEvents.appendEvent("CardAcceptCancelled", top.idCardReader.onCardAcceptCancelled);
	top.idCardReader.IDCardEvents.appendEvent("DeviceError", top.idCardReader.onDeviceError);
	top.idCardReader.IDCardEvents.appendEvent("FatalError", top.idCardReader.onDeviceError);
    top.YHAXIDCardReader.CancelAccept();
	// 控制指示灯
    try{top.guidelights.setEnvelopeDispenserLight("OFF");}catch(e){}
  }

  /*取消允许插入二代证回调函数*/
  this.onCardAcceptCancelled = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("取消允许插入身份证 IDCardReader Event onCardAcceptCancelled"); 
    top.idCardReader.IDCardEvents.clearAll();
    if (typeof(top.MainFrame.onCardAcceptCancelled_ID) == "function")
      top.MainFrame.onCardAcceptCancelled_ID();
  } 

  /*模块复位。*/
  this.reset = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("身份证模块复位 IDCardReader Commond reset"); 
    top.idCardReader.IDCardEvents.clearAll();
    top.idCardReader.IDCardEvents.appendEvent("ResetComplete", top.idCardReader.onResetComplete);
	top.idCardReader.IDCardEvents.appendEvent("DeviceError", top.idCardReader.onDeviceError);
	top.idCardReader.IDCardEvents.appendEvent("FatalError", top.idCardReader.onDeviceError);
    top.YHAXIDCardReader.Reset();
  }

  /*复位完成回调函数*/
  this.onResetComplete = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("身份证模块复位完成 IDCardReader Event onResetComplete"); 
    top.idCardReader.IDCardEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_ID) == "function")
      top.MainFrame.onResetComplete_ID();
  }

  /*退二代证*/
  this.eject = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("退出身份证 IDCardReader Commond eject"); 
    top.idCardReader.IDCardEvents.clearAll();
	top.idCardReader.IDCardEvents.appendEvent("CardEjected", top.idCardReader.onCardEjected);
    top.idCardReader.IDCardEvents.appendEvent("CardTaken", top.idCardReader.onCardTaken);
    top.idCardReader.IDCardEvents.appendEvent("Timeout", top.idCardReader.onTimeout);
    top.idCardReader.IDCardEvents.appendEvent("DeviceError", top.idCardReader.onDeviceError);
	top.idCardReader.IDCardEvents.appendEvent("FatalError", top.idCardReader.onDeviceError);
    top.YHAXIDCardReader.Eject(120*1000);
  }

  /*二代证已退出回调函数*/
  this.onCardEjected = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("身份证已退出 IDCardReader Event onCardEjected"); 
	// 控制指示灯
    try{top.guidelights.setEnvelopeDispenserLight("QUICK");}catch(e){}
    if (typeof(top.MainFrame.onCardEjected_ID) == "function")
      top.MainFrame.onCardEjected_ID();
  }

  /*二代证已退出回调函数*/
  this.onCardTaken = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("身份证被取走 IDCardReader Event onCardTaken"); 
    top.idCardReader.IDCardEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setEnvelopeDispenserLight("OFF");}catch(e){}
	if(isOK){//身份证读取成功才进行联网核查
	   //进行联网核查流程
       top.idCardReader.idCardTakenComplete();
	}
  }
  
  /*二代证取走处理*/
  this.idCardTakenComplete = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("身份证被取走进行联网核查 IDCardReader Commond idCardTakenComplete");
	if (typeof(top.MainFrame.IDCardTakenComplete) == "function"){
	    top.MainFrame.IDCardTakenComplete();
	}else{
	    //直接进行联网核查流程
	    top.serviceCtrl.stopUserTimeout();
	    top.wins.showNewProcessingTip(top.langcur.send910201);
        top.trans.send910201Async();
	}
  }
  
  
  //------------------------- 其它辅助方法 -------------------------//

  /*判断身份证读卡器中是否存在身份证*/
  this.isCardPresent = function()
  {
    return (top.YHAXIDCardReader.StMediaStatus == "PRESENT");
  }
}
