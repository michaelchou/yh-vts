/*
  存单操作类
 */
function DocumentScanner2()
{	
  // 存单模块事件响应对象
  this.DocumentScannerEvents2 = new top.EventHandling(top.YHAXDocumentScanner2);
  //------------------------- 发卡器操作类私有属性 -------------------------//
  /* 退存单卡后等待用户取卡时间 单位（秒）*/
  this.EjectTimeout = 120;
  //------------------------- 发卡器执行的方法 -------------------------//      
	
  /*允许受理存单*/
  this.acceptAndRead = function(CodelineFormat,ImageSource)
  {
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaInserted", top.documentscanner2.onMediaInserted);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaAccepted", top.documentscanner2.onMediaAccepted);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaInvalid", top.documentscanner2.onMediaInvalid);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaReaded", top.documentscanner2.onMediaReaded);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("Timeout", top.documentscanner2.onTimeout);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError);
    top.YHAXDocumentScanner2.AcceptAndRead("BMP","BMP","FULL","FULL",CodelineFormat,ImageSource,"C:\\FrontImage.bmp","C:\\BackImage.bmp",top.iUserTimeout*1000);	
    top.journalPrinter.addJournalWithTime("存单受理扫描 CheckScanner command acceptAndRead ");
    // 控制指示灯
    try{top.guidelights.setCashOutLight("MEDIUM");}catch(e){}
  }
  
  /*不允许受理*/
  this.cancelAccept = function()
  {
     top.journalPrinter.addJournalWithTime("存单受理扫描取消 CheckScanner command cancelAccept ");
     top.YHAXDocumentScanner2.CancelAccept();
	 // 控制指示灯
     try{top.guidelights.setCashOutLight("OFF");}catch(e){}
  }
  
  
   /*存单机控制*/
  this.controlMedia = function(MediaAction)
  {
	top.documentscanner2.DocumentScannerEvents2.clearAll();
	top.documentscanner2.DocumentScannerEvents2.appendEvent("ControlComplete", top.documentscanner2.onControlComplete);
	top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaTaken", top.documentscanner2.onMediaTaken_Media);
	top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError);
	top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError);
	top.journalPrinter.addJournalWithTime("存单受理扫描控制 CheckScanner command controlMedia "+MediaAction);
	//回收不设置超时时间
	if(MediaAction == "RETRACT"){
		top.YHAXDocumentScanner2.ControlMedia(MediaAction,0);	
	}else{
		// 控制指示灯
		try{top.guidelights.setCashOutLight("MEDIUM");}catch(e){}
		top.YHAXDocumentScanner2.ControlMedia(MediaAction,top.iUserTimeout*1000);		
	}  
  }
  
  
  /*存单机复位*/
  this.reset = function ()
  {
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    top.documentscanner2.DocumentScannerEvents2.appendEvent("ResetComplete", top.documentscanner2.onResetComplete);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError);
    top.YHAXDocumentScanner2.Reset("RETRACT",1);
    top.journalPrinter.addJournalWithTime("存单受理扫描复位 CheckScanner command Reset");
  }
  
  
    /*退卡*/
  this.eject = function()
  {
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaEjected", top.documentscanner2.onMediaEjected);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("Timeout", top.documentscanner2.onTimeout_Eject);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaTaken", top.documentscanner2.onMediaTaken);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError);
    top.YHAXDocumentScanner2.Eject(this.EjectTimeout*1000);
    top.journalPrinter.addJournalWithTime("存单受理扫描退单 CheckScanner command Eject");
  }
  
  /*吞存单*/
  this.capture = function()
  {
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaTaken", top.documentscanner2.onMediaTaken);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("MediaCaptured", top.documentscanner2.onMediaCaptured);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onDeviceError4Capture);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onDeviceError4Capture);
    top.YHAXDocumentScanner2.Capture();
    top.journalPrinter.addJournalWithTime("存单受理扫描吞单 CheckScanner command Capture");
  }
  
  /*吞存单时硬件故障的事件响应*/
  this.onDeviceError4Capture = function()
  {
    top.documentscanner2.DocumentScannerEvents2.appendEvent("ResetComplete", top.documentscanner2.onResetEnd4DevErr4CaptureRe);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onResetEnd4DevErr4CaptureRe);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onResetEnd4DevErr4CaptureRe);
    top.YHAXDocumentScanner2.Reset("RETRACT",1);
    top.journalPrinter.addJournalWithTime("存单受理扫描吞单故障复位回收 CheckScanner command Reset");
  }
  
  /*吞存单时硬件故障后复位结束的事件响应*/
  this.onResetEnd4DevErr4CaptureRe = function()
  {
    top.documentscanner2.DocumentScannerEvents2.appendEvent("ResetComplete", top.documentscanner2.onResetEnd4DevErr4CaptureEj);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("DeviceError", top.documentscanner2.onResetEnd4DevErr4CaptureEj);
    top.documentscanner2.DocumentScannerEvents2.appendEvent("FatalError", top.documentscanner2.onResetEnd4DevErr4CaptureEj);
    // 必须使用EJECT参数才能解决问题，有点危险，但是没辙。而且这里不做，空闲页面也会这么做。
    top.YHAXDocumentScanner2.Reset("EJECT",1);
    top.journalPrinter.addJournalWithTime("存单受理扫描吞单故障复位回收结束后复位退 CheckScanner command Reset");
  }
  
  /*吞卡时读卡器硬件故障后复位结束的事件响应*/
  this.onResetEnd4DevErr4CaptureEj = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单受理扫描吞单故障复位回收结束后复位退结束 CheckScanner command ResetEnd4DevErr4CaptureEj");
		
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cd) == "function")
      top.MainFrame.onDeviceError_cd();
    else if (typeof(top.onDeviceError_cd) == "function")
      top.onDeviceError_cd();
  }
  
  /*存单机存单已经插入的事件响应*/
  this.onMediaInserted = function()
  {
	 // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单受理扫描 存单插入 CheckScanner Event MediaInserted");  
	// 控制指示灯
    try{top.guidelights.setCashOutLight("OFF");}catch(e){}	
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*存单机存单已经被受理的事件响应*/
  this.onMediaAccepted = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单受理扫描 存单已受理 CheckScanner Event MediaAccepted");
    if (typeof(top.MainFrame.onMediaAccepted) == "function"){
      top.MainFrame.onMediaAccepted();
	}
  }
  
  /*存单机发现无效存单的事件响应*/
  this.onMediaInvalid = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单受理扫描 无效存单 CheckScanner Event MediaInvalid");   
    top.documentscanner2.DocumentScannerEvents2.clearAll();
	var strCodeData = top.YHAXDocumentScanner2.CodelineData;
	if(strCodeData.indexOf("|") > 0){
		//存单版式
		var strCDSFormate  = strCodeData.split("|")[0].substr(strCodeData.split("|")[0].indexOf('=') + 1, strCodeData.split("|")[0].length);
		//鉴伪点、凭证号、账号、密押、存入金额
		var strCDSAllResult = strCodeData.split("|")[1].substr(strCodeData.split("|")[1].indexOf('=') + 1, strCodeData.split("|")[1].length);	
		var strIdentAllResult = strCodeData.split("|")[2].substr(strCodeData.split("|")[2].indexOf('=') + 1, strCodeData.split("|")[2].length);	
		//印刷的票号OCR
		var  strCertNum = strCodeData.split("|")[3].substr(strCodeData.split("|")[3].indexOf('=') + 1, strCodeData.split("|")[3].length);				
	    var  strAccoutNum = strCodeData.split("|")[4].substr(strCodeData.split("|")[4].indexOf('=') + 1, strCodeData.split("|")[4].length);
		//机打的票号OCR
		//var strPrintOCR = strCodeData.split("|")[5].substr(strCodeData.split("|")[5].indexOf('=') + 1, strCodeData.split("|")[5].length);
        var strAuthPin = strCodeData.split("|")[6].substr(strCodeData.split("|")[6].indexOf('=') + 1, strCodeData.split("|")[6].length);	
		//大写金额
		var strAmount = strCodeData.split("|")[7].substr(strCodeData.split("|")[7].indexOf('=') + 1, strCodeData.split("|")[7].length);			
		//SP解析金额会偶发错乱
		if(strAmount.toString().indexOf("人民币") != -1){
			try{
				//大写转小写
				strAmount = new top.StringCtrl("").aNumber(strAmount.split("人民币")[1]);
			}catch(e){
				//大写转小写异常
				strAmount = "0";
			}
		}else{
			strAmount = "0";
		}
		//判断是否有密押:不识别或不支持均为空
		var strAuthPinCheck = strCDSAllResult.substr(strCDSAllResult.length-1,strCDSAllResult.length);
		if(strAuthPinCheck != "1"){
			strAuthPin = "";
		}
		//存单版式
		top.pool.set("strCDSFormate",strCDSFormate);
		//要素齐全
		top.pool.set("integralityCheck",strCDSAllResult);
		//鉴伪点
		top.pool.set("receiptDistinguish",strIdentAllResult);
		
		//截取前6位的鉴伪点及后3位的变造区
		top.pool.set("strIdentResult",strIdentAllResult.substring(0,strIdentAllResult.length-3));//鉴伪结果		
		top.pool.set("strElement",strIdentAllResult.substring(strIdentAllResult.length-3,strIdentAllResult.length));//变造区		
		top.pool.set("strCDCertNum",strCertNum);//凭证号
		top.pool.set("strAccoutNum",strAccoutNum);//账号
		top.pool.set("strCDAmount", new top.StringCtrl("").YuanToFen(strAmount));//金额：格式化为分
		top.pool.set("strAuthPin",strAuthPin);//密押串数据
		
		//凭证号记录
		var strCDSNum = top.pool.get("strCDCertNum");
		var strCDSNums = top.pool.get("strAccoutNum");
		top.journalPrinter.addJournalWithTime("凭证号长度: "+strCDSNum.length+"  账号长度:"+strCDSNums.length); 
		
		if (typeof(top.MainFrame.onMediaInvalid) == "function")
		  top.MainFrame.onMediaInvalid();					
	}else{	
		if (typeof(top.MainFrame.onMediaInvalid) == "function")
		  top.MainFrame.onMediaInvalid();
	}
  }
  
  /*存单机存单验证的事件响应*/
  this.onMediaReaded = function(cardData)
  {
  	top.journalPrinter.addJournalWithTime("存单受理扫描 存单信息已读取 CheckScanner Event MediaReaded"); 
	var strCardData = new top.StringCtrl("").byteArr2HexStr(cardData);
    top.documentscanner2.DocumentScannerEvents2.clearAll();
	var strCodeData = top.YHAXDocumentScanner2.CodelineData;
	if(strCodeData.indexOf("|") > 0){
		//存单版式
		var strCDSFormate  = strCodeData.split("|")[0].substr(strCodeData.split("|")[0].indexOf('=') + 1, strCodeData.split("|")[0].length);
		//鉴伪点、凭证号、账号、密押、存入金额
		var strCDSAllResult = strCodeData.split("|")[1].substr(strCodeData.split("|")[1].indexOf('=') + 1, strCodeData.split("|")[1].length);	
		var strIdentAllResult = strCodeData.split("|")[2].substr(strCodeData.split("|")[2].indexOf('=') + 1, strCodeData.split("|")[2].length);	
		//印刷的票号OCR
		var  strCertNum = strCodeData.split("|")[3].substr(strCodeData.split("|")[3].indexOf('=') + 1, strCodeData.split("|")[3].length);				
	    var  strAccoutNum = strCodeData.split("|")[4].substr(strCodeData.split("|")[4].indexOf('=') + 1, strCodeData.split("|")[4].length);
		//机打的票号OCR
		//var strPrintOCR = strCodeData.split("|")[5].substr(strCodeData.split("|")[5].indexOf('=') + 1, strCodeData.split("|")[5].length);
        var strAuthPin = strCodeData.split("|")[6].substr(strCodeData.split("|")[6].indexOf('=') + 1, strCodeData.split("|")[6].length);	
		//大写金额
		var strAmount = strCodeData.split("|")[7].substr(strCodeData.split("|")[7].indexOf('=') + 1, strCodeData.split("|")[7].length);			
		//SP解析金额会偶发错乱
		if(strAmount.toString().indexOf("人民币") != -1){
			try{
				//大写转小写
				strAmount = new top.StringCtrl("").aNumber(strAmount.split("人民币")[1]);
			}catch(e){
				//大写转小写异常
				strAmount = "0";
			}		
		}else{
			strAmount = "0";
		}
		//判断是否有密押:不识别或不支持均为空
		var strAuthPinCheck = strCDSAllResult.substr(strCDSAllResult.length-1,strCDSAllResult.length);
		if(strAuthPinCheck != "1"){
			strAuthPin = "";
		}
		//存单版式
		top.pool.set("strCDSFormate",strCDSFormate);
		//要素齐全
		top.pool.set("integralityCheck",strCDSAllResult);
		//鉴伪点
		top.pool.set("receiptDistinguish",strIdentAllResult);
		
		//截取前6位的鉴伪点及后3位的变造区
		top.pool.set("strIdentResult",strIdentAllResult.substring(0,strIdentAllResult.length-3));//鉴伪结果		
		top.pool.set("strElement",strIdentAllResult.substring(strIdentAllResult.length-3,strIdentAllResult.length));//变造区		
		top.pool.set("strCDCertNum",strCertNum);//凭证号
		top.pool.set("strAccoutNum",strAccoutNum);//账号
		top.pool.set("strCDAmount", new top.StringCtrl("").YuanToFen(strAmount));//金额：格式化为分
		top.pool.set("strAuthPin",strAuthPin);//密押串数据
		// 记录终端流水
		//凭证号记录
		var strCDSNum = top.pool.get("strCDCertNum");
		var strCDSNums = top.pool.get("strAccoutNum");
		top.journalPrinter.addJournalWithTime("凭证号长度: "+strCDSNum.length+"  账号长度:"+strCDSNums.length);
	
		if (typeof(top.MainFrame.onMediaReaded) == "function"){
			top.MainFrame.onMediaReaded();
		}					
	}else{
	  if (typeof(top.MainFrame.onServiceFailed) == "function"){ 
         top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_ID_READFAILED, "读取存单要素信息失败！");
      }	
	}
  }

  /*发卡超时的事件响应*/
  this.onTimeout = function()
  {
	// 记录终端流水
    top.journalPrinter.addJournalWithTime("存单受理扫描 存单超时 CheckScanner Event Timeout");   
		top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onTimeout_cd) == "function")
      top.MainFrame.onTimeout_cd();
  }
  
  /*存单机硬件故障的事件响应*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("存单受理扫描 存单机故障 CheckScanner Event DeviceError");  
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cd) == "function")
    {
      top.MainFrame.onDeviceError_cd();
    }else if (typeof(top.onDeviceError_cd) == "function")
    {
      top.onDeviceError_cd();
    }else{}
  };
  
   /*存单机复位成功的事件响应*/
  this.onResetComplete = function()
  {
    top.journalPrinter.addJournalWithTime("存单受理扫描 复位成功 CheckScanner Event ResetComplete"); 
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onResetComplete_cd) == "function")
    {
      top.MainFrame.onResetComplete_cd();
    }else if (typeof(top.onResetComplete_cd) == "function")
    {
      top.onResetComplete_cd();
    }else{}
  };
  
  
  /*存单机存单ControlMedia完成的事件响应*/
  this.onControlComplete = function()
  {
    if (typeof(top.MainFrame.onControlComplete) == "function")
      top.MainFrame.onControlComplete();
  }
  
  /*存单机存单已经被客户取走的事件响应*/
  this.onMediaTaken = function()
  {
    top.journalPrinter.addJournalWithTime("存单受理扫描 存单被取走 CheckScanner Event MediaTaken");
		// 控制指示灯
    try{top.guidelights.setCashOutLight("OFF");}catch(e){}
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onMediaTaken) == "function")
      top.MainFrame.onMediaTaken();
    else if (typeof(top.onMediaTaken) == "function")
      top.onMediaTaken();
  }
  
   /*存单机存单已经被客户取走的事件响应*/
  this.onMediaTaken_Media = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单受理扫描 CheckScanner Event MediaTaken_Media");
	// 控制指示灯
    try{top.guidelights.setCashOutLight("OFF");}catch(e){}
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onMediaTaken_Media) == "function")
      top.MainFrame.onMediaTaken_Media();
    else if (typeof(top.onMediaTaken_Media) == "function")
      top.onMediaTaken_Media();
  } 
  
  /*存单机存单已经被退出的事件响应*/
  this.onMediaEjected = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单受理扫描 存单退出成功 CheckScanner Event MediaEjected");
    if (typeof(top.MainFrame.onMediaEjected) == "function")
      top.MainFrame.onMediaEjected();
    else if (typeof(top.onMediaEjected) == "function")
      top.onMediaEjected();
  }

   /*退出的存单超时未被客户取走的事件响应*/
  this.onTimeout_Eject = function()
  {
     // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单受理扫描 存单退出超时 CheckScanner Event Timeout_Eject");
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    // 退存单超时，自动吞存单
    top.documentscanner2.capture();
  }
  
  /*存单已经被吞入的事件响应*/
  this.onMediaCaptured = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单受理扫描 存单被吞 CheckScanner Event MediaCaptured");
    top.documentscanner2.DocumentScannerEvents2.clearAll();
    if (typeof(top.MainFrame.onMediaCaptured) == "function")
      top.MainFrame.onMediaCaptured();
    else if (typeof(top.onMediaCaptured) == "function")
      top.onMediaCaptured();
  }
 

  //------------------------- 其它辅助方法 -------------------------//

  /*判断发卡器中是否存在卡*/
  this.isCardPresent = function()
  {
    return (top.YHAXDocumentScanner2.StMediaStatus == "PRESENT");
  } 
  
    /*
　　 私有函数：向服务器报告存单被回收的信息
     返回：
     报告终端动作状态的结果，包括
     RESULT_SUCCESSFUL
     RESULT_FAILED
     RESULT_UNCERTAIN
   */
   this.sendCaptureStatus = function()
   {
      var exch = new ExchangeXmlWithHost();
	  var reqMsg = new ColsMsgXmlText();
      reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AppendExpLog");
      reqMsg.appendNode("strExpCode", top.EXPCODE_CDSDISPENSER);
	  reqMsg.appendNode("strPan", top.pool.get("strCDCertNum"));         //存单凭证号
      reqMsg.appendNode("strMemo", "存单被回收");
      var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
      return iRet;
   }
}
