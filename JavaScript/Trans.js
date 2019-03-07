function Trans()
{
  // 与服务器异步交互完成时的回调函数
  var onAsyncExchangeComplete = null;
  //是否进行审核	
  var isCheckLoadingMore = false;
  //是否进行协助
  var isCheckHelpingMore = false;
  
  /*向服务器影像文件上传交易请求*/
  this.sendImageFileAsync = function()
  {
	fileControl =  new top.FileControl();
	var fileData = fileControl.fileCompress(top.pool.get("strImageFilePath"));
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ImageFile");
	reqMsg.appendNode("strImageType",top.pool.get("strImageType"));//上传类型,后台会根据这个区分送到影像平台哪个接口
	reqMsg.appendNode("strFileData",fileData);
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDGrantDept",top.pool.get("strIDGrantDept"));//签证机关
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));//客户号
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //业务批次号,这个很重要，一个完整的交易只能用同一个
    reqMsg.appendNode("strIDOnLineImage",top.pool.get("strIDOnLineImage"));//联网核查照片
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncImageFileComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncImageFileComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("影像文件上传"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var strBatchId = top.exchxmlasync.msgxmldomResp.getElementValue("strBatchId");//原交易批次号（影像平台专用、后面的交易都用这个）
		top.pool.set("strBatchId",strBatchId);
		if(top.pool.get("copyFileType") == "signatute"){//如果是电子签名的话，需要备份电子签名轨迹文件
		    top.pool.set("copyFileType","");//上传的类型
			//先创建保存电子签名轨迹备份文件夹
	        new top.FileControl().createFile(top.COLS_SIGNATURE_TEMP_FILEPATH);
	        //复制电子签名轨迹文件到备份文件夹中
	        new top.FileControl().fileCopy(top.COLS_SIGCAMERAS_FILEPATH,top.COLS_SIGNATURE_TEMP_FILEPATH + "\\" +strBatchId,top.COLS_SIGCAMERAS_DAT_FILENAME);
		}
        //上传成功后，把文件删除，防止下次会把上次文件重现上传上来
	    fileControl =  new top.FileControl();
        fileControl.deleteFile(top.pool.get("strImageFilePath"));
        if (typeof(top.MainFrame.onImageFileSuccessful) == "function")
           top.MainFrame.onImageFileSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, "影像文件上传失败");
      }
    }
  }
  
  /*代理人影像上传（取款时用）*/
  this.sendImageAgentFileAsync = function()
  {
	fileControl =  new top.FileControl();
	var fileData = fileControl.fileCompress(top.pool.get("strImageFilePath"));
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ImageAgentFile");
	reqMsg.appendNode("strImageType",top.pool.get("strImageType"));//上传类型,后台会根据这个区分送到影像平台哪个接口
	reqMsg.appendNode("strFileData",fileData);
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDGrantDept",top.pool.get("strIDGrantDept"));//签证机关
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));//客户号
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //业务批次号,这个很重要，一个完整的交易只能用同一个
    reqMsg.appendNode("strIDOnLineImage",top.pool.get("strIDOnLineImage"));//联网核查照片
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncImageFileAgentComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncImageFileAgentComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("影像文件上传"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var strBatchId = top.exchxmlasync.msgxmldomResp.getElementValue("strBatchId");//原交易批次号（影像平台专用、后面的交易都用这个）
		top.pool.set("strBatchId",strBatchId)
		if(top.pool.get("copyFileType") == "signatute"){//如果是电子签名的话，需要备份电子签名轨迹文件
		    top.pool.set("copyFileType","");//上传的类型
			//先创建保存电子签名轨迹备份文件夹
	        new top.FileControl().createFile(top.COLS_SIGNATURE_TEMP_FILEPATH);
	        //复制电子签名轨迹文件到备份文件夹中
	        new top.FileControl().fileCopy(top.COLS_SIGCAMERAS_FILEPATH,top.COLS_SIGNATURE_TEMP_FILEPATH + "\\" +strBatchId,top.COLS_SIGCAMERAS_DAT_FILENAME);
		}
        //上传成功后，把文件删除，防止下次会把上次文件重现上传上来
	    fileControl =  new top.FileControl();
        fileControl.deleteFile(top.pool.get("strImageFilePath"));
        if (typeof(top.MainFrame.onImageAgentFileSuccessful) == "function")
           top.MainFrame.onImageAgentFileSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, "影像文件上传失败");
      }
    }
  }
  
  /*向服务器影像文件上传交易请求(补传)*/
  this.sendImageFileNewAsync = function()
  {
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ImageFileNew");
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDGrantDept",top.pool.get("strIDGrantDept"));//签证机关
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));//客户号
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //业务批次号,这个很重要，一个完整的交易只能用同一个
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncImageFileNewComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncImageFileNewComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("影像文件上传(补传)"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var strBatchId = top.exchxmlasync.msgxmldomResp.getElementValue("strBatchId");//原交易批次号（影像平台专用、后面的交易都用这个）
		top.pool.set("strBatchId", strBatchId)
        if (typeof(top.MainFrame.onImageFileNewSuccessful) == "function")
           top.MainFrame.onImageFileNewSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, "影像文件上传失败");
      }
    }
  }	
  
  /*向服务器影像文件查询交易请求*/
  this.sendImageFileQueryAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ImageFileQuery");
	reqMsg.appendNode("strImageType",top.pool.get("strImageType"));//上传类型,后台会根据这个区分送到影像平台哪个接口
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //业务批次号,这个很重要，一个完整的交易只能用同一个
     var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
	 // 记录终端流水
    var strJrn = new top.StringCtrl("影像文件查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		// 将图片信息数组保存到缓存中
        this.saveXMLDatalist(exch);
        if (typeof(top.MainFrame.onImageFileQuerySuccessful) == "function"){
          top.MainFrame.onImageFileQuerySuccessful();
		}
	}
	else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILEQUERY_FAILED, "影像文件查询失败");
      }
    }
  }
  
  /*向服务器业务申请单交易请求*/
  this.sendBusinessApplicationAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "BusinessApplication");
	reqMsg.appendNode("htmlstr",reqMsg.encode64(reqMsg.utf16to8(top.pool.get("htmlstr"))));//业务申请单上显示的内容，页面DIV中的内容
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //业务批次号,这个很重要，一个完整的交易只能用同一个
	// 记录终端流水
    var strJrn = new top.StringCtrl("开始上传业务请求单 "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncBusinessApplicationComplete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncBusinessApplicationComplete = function(iRet)
  {
	// 记录终端流水
    var strJrn = new top.StringCtrl("业务申请单"+" "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()+" 返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (iRet == top.RESULT_SUCCESSFUL)
    {
        if (typeof(top.MainFrame.onSuccessful) == "function"){
          top.MainFrame.onSuccessful();
		}
	}
	else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_BUSINESSAPPLICATION_FAILED, "业务申请单失败");
      }
    }
  }
	
  /*向服务器签到交易请求*/
  this.send911201Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911201"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strDeviceType",top.terminal.getDeviceType());
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911201Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync911201Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("申请秘钥交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onServiceSuccessful) == "function")
      top.MainFrame.onServiceSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("更新工作密钥失败", top.TERMRETCODE_RQK_FAILED, "更新工作密钥失败");
      }
    }
  }
  
  /*向服务器密钥激活请求*/
  this.send911202Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911202"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911202Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync911202Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("密钥激活"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onServiceSuccessful) == "function")
      top.MainFrame.onServiceSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("密钥激活失败", top.TERMRETCODE_RQK_FAILED, "密钥激活失败");
      }
    }
  }
  
  /*向服务器设备签到请求*/
  this.send911203Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911203"); 
	reqMsg.appendNode("strTellerum",top.pool.get("strTellerum")); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	top.journalPrinter.addJournalWithTime("发送柜员签到交易 send911203Async ");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911203Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync911203Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("柜员签到"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.on911203Successful) == "function")
      top.MainFrame.on911203Successful();
    }
    else
    {
      if (typeof(top.MainFrame.on911203Failed) == "function")
      {
        top.MainFrame.on911203Failed("柜员签到失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
   /*向服务器设备签退请求*/
  this.send911204Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911204"); 
	reqMsg.appendNode("strTellerum",top.pool.get("strTellerum"));
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	top.journalPrinter.addJournalWithTime("发送柜员签退交易 send911204Async ");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911204Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync911204Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("柜员签退"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onServiceSuccessful) == "function")
      top.MainFrame.onServiceSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("柜员签退失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  
 /*向服务器设备签到状态查询请求*/
  this.send911205Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911205"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	top.journalPrinter.addJournalWithTime("发送柜员签到状态查询 send911205Async ");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911205Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync911205Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("柜员签到状态查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  var terminal_sign_flag = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/sign_flag");
	  top.pool.set("terminal_sign_flag",terminal_sign_flag);//0-未签到(pad也未签到)1-未签到（pad已签到）2-已签到
      var staffCode = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/staff_code");
	  if(null != staffCode && staffCode.length > 0){
		  if(terminal_sign_flag == '2'){
			  top.terminal.signTellerNum=staffCode;
		  }else{
			  top.terminal.signTellerNum="";
		  }
		  top.journalPrinter.addJournalWithTime("PAD签到柜员：" + staffCode);  
	  }
	  if (typeof(top.MainFrame.on911205Successful) == "function")
      top.MainFrame.on911205Successful();
    }
    else
    {
      if (typeof(top.MainFrame.on911205Failed) == "function")
      {
        top.MainFrame.on911205Failed("柜员签到状态查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  
  
  /*向服务器查询余额请求*/
  this.send902107Async = function()
  {
	  new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
      var exch = new ExchangeXmlWithHost();
	  var reqMsg = new ColsMsgXmlText();
      reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	  reqMsg.appendNode("strTransCode","902107"); 
	  reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	  reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	  reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	  reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	  reqMsg.appendNode("strCurrency",top.pool.get("strCurrency")); //币种
      top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902107Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902107Complete = function(iRet)
  {
  	
    // 记录终端流水
    var strJrn = new top.StringCtrl("账户余额查询902107"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	var balance = top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE");
    	var availableBalance = top.exchxmlasync.msgxmldomResp.getElementValue("F54_KYYE");
    	if(balance != null && balance != ""){
    		top.pool.set("F54_ZHYE",(balance/100).toFixed(2));
    	}
    	if(availableBalance != null && availableBalance != null){
    		top.pool.set("F54_KYYE",(availableBalance/100).toFixed(2));
    	}
    	if(top.pool.get("inqFlag") == "FX") {
    		top.pool.set("inqFlag", "");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqBalanceSuccess");//IC卡交易后写卡处理
    	} else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    	}
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*用户密码加密*/
  this.getpassEncode= function(password)
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
     var passEncode=reqMsg.encode64(reqMsg.utf16to8(password));
   //  top.journalPrinter.addJournal("========="+passEncode);
     return passEncode;
  }
  /*用户密码解密*/
  this.getpassDecode= function(passEncode)
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
     var passDecode= reqMsg.utf8to16(reqMsg.decode64(passEncode));
     top.journalPrinter.addJournal("========="+passDecode);
     return passDecode;
//      var passDecode=reqMsg.Decode64(passEncode);

  //   alert(passDecode);
  }
 
 	
  /*向服务器查询吞卡明细*/
  this.sendListCardExpLogAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ListCardExpLog");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onListCardExpLogAsyncComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onListCardExpLogAsyncComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询吞卡明细"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
   	  var cardExplogInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("cardExplogInfoStr");	  
	
	  top.pool.set("cardExplogInfoStr",cardExplogInfoStr);
      if (typeof(top.MainFrame.onListCardExpLogAsyncComplete) == "function")
        top.MainFrame.onListCardExpLogAsyncComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询吞卡明细失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*查询清卡状态*/
  this.sendCardSettleCycLogStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CardSettleCycLogStatus");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCardSettleCycLogStatusComplete);
  }

  /*清卡状态与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncCardSettleCycLogStatusComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询清卡状态"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncCardSettleCycLogStatusComplete) == "function")
        top.MainFrame.onAsyncCardSettleCycLogStatusComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询清卡状态失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向后端发送加卡交易*/
  this.send911101Async = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911101"); 
    reqMsg.appendNode("strCardUnitInfo", top.pool.get("strCardUnitInfo"));
    reqMsg.appendNode("strAddFlag", top.pool.get("strAddFlag"));
    if(top.pool.get("strAddFlag") == "card") {
    	reqMsg.appendNode("cardBoxInfoStr", top.pool.get("cardBoxInfoStr"));
        reqMsg.appendNode("cardSurplusCount", top.pool.get("cardSurplusCount"));
        reqMsg.appendNode("cardRefillCount", top.pool.get("cardRefillCount"));
    }
    var strJrn = new top.StringCtrl("加凭证交易："+top.pool.get("strCardUnitInfo"));
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911101Complete);
  }

  /*向后端发送加卡交易，与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync911101Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("加凭证交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsync911101Complete) == "function")
        top.MainFrame.onAsync911101Complete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("加凭证交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器更新卡箱信息*/
  this.sendAddCardDispenserAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AddCard");
    reqMsg.appendNode("cardBoxInfoStr", top.pool.get("cardBoxInfoStr"));
    reqMsg.appendNode("cardSurplusCount", top.pool.get("cardSurplusCount"));
    reqMsg.appendNode("cardRefillCount", top.pool.get("cardRefillCount"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncAddCardDispenserComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncAddCardDispenserComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("加卡"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncAddCardDispenserComplete) == "function")
        top.MainFrame.onAsyncAddCardDispenserComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("加卡失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器查询卡箱信息*/
  this.sendQueryCardDispenserAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CardUnitQuery");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncQueryCardDispenserComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncQueryCardDispenserComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询卡箱"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	
  	  var cardBoxInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("cardBoxInfoStr");	  
  	  var cardTransLogStr = top.exchxmlasync.msgxmldomResp.getElementValue("cardTransLogStr");	  
  	  var explogInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("explogInfoStr");	  
  	
	  top.pool.set("cardBoxInfoStr",cardBoxInfoStr);
	  top.pool.set("cardTransLogStr",cardTransLogStr);
	  top.pool.set("explogInfoStr",explogInfoStr);
      if (typeof(top.MainFrame.onAsyncQueryCardDispenserComplete) == "function")
        top.MainFrame.onAsyncQueryCardDispenserComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询卡箱失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器查询发卡明细*/
  this.sendQueryCardDispenserDetailAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryCardDispenserDetail");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onQueryCardDispenserDetailAsyncComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onQueryCardDispenserDetailAsyncComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询发卡明细"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	
  	  var cardTranslogInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("cardTranslogInfoStr");	  
	
	  top.pool.set("cardTranslogInfoStr",cardTranslogInfoStr);
      if (typeof(top.MainFrame.onQueryCardDispenserDetailAsyncComplete) == "function")
        top.MainFrame.onQueryCardDispenserDetailAsyncComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询发卡明细失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向后端发送清卡交易*/
  this.send911102Async = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911102"); 
    reqMsg.appendNode("strCardUnitInfo", top.pool.get("strCardUnitInfo"));
    var strJrn = new top.StringCtrl("清凭证交易："+top.pool.get("strCardUnitInfo"));
    top.journalPrinter.addJournal(strJrn);
    
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911102Complete);
  }

  /*向后端发送加卡交易，与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync911102Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("清凭证交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsync911102Complete) == "function")
        top.MainFrame.onAsync911102Complete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("清凭证交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器更新卡箱信息*/
  this.sendClearCardDispenserAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CleanCard");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncClearCardDispenserComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数
   * 
   * */
  this.onAsyncClearCardDispenserComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("清卡"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
     	  var cardExplogInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("cardExplogInfoStr");	  
     	  top.pool.set("cardExplogInfoStr",cardExplogInfoStr);
      if (typeof(top.MainFrame.onAsyncClearCardDispenserComplete) == "function")
        top.MainFrame.onAsyncClearCardDispenserComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("清卡失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*查询清存单状态*/
  this.sendCDSSettleCycLogStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CDSSettleCycLogStatus");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCDSSettleCycLogStatusComplete);
  }

  /*清卡状态与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncCDSSettleCycLogStatusComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询清存单状态"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncCDSSettleCycLogStatusComplete) == "function")
        top.MainFrame.onAsyncCDSSettleCycLogStatusComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询清存单状态失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*获取当前设备周期状态*/
   this.sendCDSSettleCycleStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CDSSettleCycleStatus");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCDSSettleCycleStatusComplete);
  }

  /*清卡状态与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncCDSSettleCycleStatusComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询设备周期状态"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      top.pool.set("cdsCycleFlag",top.exchxmlasync.msgxmldomResp.getElementValue("strCycleFlag")); 
      if (typeof(top.MainFrame.onCDSSettleCycleStatusComplete) == "function")
        top.MainFrame.onCDSSettleCycleStatusComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询设备周期状态失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*向服务器查询存单箱信息*/
  this.sendQueryCDSCycleAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CDSUnitQueryCycle");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncQueryCDSCycleComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncQueryCDSCycleComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询存单箱"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	
  	  var cdsBoxInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("cdsBoxInfoStr");	  
  	  var cdsTransLogStr = top.exchxmlasync.msgxmldomResp.getElementValue("cdsTransLogStr");	  
	  var cdsSettleCyclMsg = top.exchxmlasync.msgxmldomResp.getElementValue("cdsSettleCyclMsg");

	  top.pool.set("cdsBoxInfoStr",cdsBoxInfoStr);
	  top.pool.set("cdsTransLogStr",cdsTransLogStr);
	  top.pool.set("cdsSettleCyclMsg",cdsSettleCyclMsg);
      if (typeof(top.MainFrame.onAsyncQueryCDSComplete) == "function")
        top.MainFrame.onAsyncQueryCDSComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询存单箱失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*向服务器轧账后清理数据库中的交易信息*/
  this.sendClearCDSTransLogAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CleanCDSTrans");
    reqMsg.appendNode("successfulAcceptedCDS",top.pool.get("successfulAcceptedCDS")); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncClearTransLogComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncClearTransLogComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("轧账提交"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncClearCDSTransComplete) == "function")
        top.MainFrame.onAsyncClearCDSTransComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("轧账提交失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*向服务器更新存单箱信息*/
  this.sendAddCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AddCDS");
    reqMsg.appendNode("cdsBoxInfoStr", top.pool.get("cdsBoxInfoStr"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncAddCDSComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncAddCDSComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("加存单"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncAddCDSComplete) == "function")
        top.MainFrame.onAsyncAddCDSComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("加存单失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器查询存单箱信息*/
  this.sendQueryCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CDSUnitQuery");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncQueryCDSComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncQueryCDSComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询存单箱"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	
  	  var cdsBoxInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("cdsBoxInfoStr");	  
  	  var cdsTransLogStr = top.exchxmlasync.msgxmldomResp.getElementValue("cdsTransLogStr");	  
	
	  top.pool.set("cdsBoxInfoStr",cdsBoxInfoStr);
	  top.pool.set("cdsTransLogStr",cdsTransLogStr);
      if (typeof(top.MainFrame.onAsyncQueryCDSComplete) == "function")
        top.MainFrame.onAsyncQueryCDSComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询存单箱失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器更新存单箱信息*/
  this.sendClearCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CleanCDS");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncClearCDSComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncClearCDSComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("清存单"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncClearCDSComplete) == "function")
        top.MainFrame.onAsyncClearCDSComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("清存单失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*查询清UKey状态*/
  this.sendUKeySettleCycLogStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "UKeySettleCycLogStatus");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncUKeySettleCycLogStatusComplete);
  }

  /*清卡状态与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncUKeySettleCycLogStatusComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询清UKey状态"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncUKeySettleCycLogStatusComplete) == "function")
        top.MainFrame.onAsyncUKeySettleCycLogStatusComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询清UKey状态失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器更新存单箱信息*/
  this.sendAddUKeyAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AddUKey");
    reqMsg.appendNode("ukeyBoxInfoStr", top.pool.get("ukeyBoxInfoStr"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncAddUKeyComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncAddUKeyComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("加UKey"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncAddUKeyComplete) == "function")
        top.MainFrame.onAsyncAddUKeyComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("加UKey失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*向服务器查询Ukey箱信息*/
  this.sendQueryUKeyAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "UKeyUnitQuery");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncQueryUKeyComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncQueryUKeyComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询UKey箱"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	
  	  var ukeyBoxInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("ukeyBoxInfoStr");	  
  	  var ukeyTransLogStr = top.exchxmlasync.msgxmldomResp.getElementValue("ukeyTransLogStr");	  
  	  var explogInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("explogInfoStr");	  
	  top.pool.set("ukeyBoxInfoStr",ukeyBoxInfoStr);
	  top.pool.set("ukeyTransLogStr",ukeyTransLogStr);
	  top.pool.set("explogInfoStr",explogInfoStr);
      if (typeof(top.MainFrame.onAsyncQueryUKeyComplete) == "function")
        top.MainFrame.onAsyncQueryUKeyComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询UKey箱失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器查询发卡明细*/
  this.sendQueryUkeyDispenserDetailAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryUkeyDispenserDetail");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onQueryUkeyDispenserDetailAsyncComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onQueryUkeyDispenserDetailAsyncComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询发Ukey明细"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	
  	  var ukeyTranslogInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("ukeyTranslogInfoStr");	  
	
	  top.pool.set("ukeyTranslogInfoStr",ukeyTranslogInfoStr);
      if (typeof(top.MainFrame.onQueryUkeyDispenserDetailAsyncComplete) == "function")
        top.MainFrame.onQueryUkeyDispenserDetailAsyncComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询发Ukey明细失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器更新UKey箱信息*/
  this.sendClearUKeyAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CleanUKey");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncClearUKeyComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncClearUKeyComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("清UKey"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncClearUKeyComplete) == "function")
        top.MainFrame.onAsyncClearUKeyComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("清UKey失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器查询受理存单轧账信息*/
  this.sendQueryAcceptedCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryAcceptedCDS");
    reqMsg.appendNode("successfulAcceptedCDS",top.pool.get("successfulAcceptedCDS"));    
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onQueryAcceptedCDSAsyncComplete);
  }

  /*向服务器查询存单轧账信息，与WEB服务器进行异步交互完成时的回调函数*/
  this.onQueryAcceptedCDSAsyncComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询受理存单轧账信息"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	  var cdsTranslogInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("cdsTranslogInfoStr");	  
    		
    	  top.pool.set("cdsTransSucclogInfoStr",cdsTranslogInfoStr);
      if (typeof(top.MainFrame.onQueryAcceptedCDSAsyncComplete) == "function")
        top.MainFrame.onQueryAcceptedCDSAsyncComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询受理存单轧账信息失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  
  /*向服务器查询异常受理存单轧账信息*/
  this.sendQueryAcceptedFailedCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryAcceptedFailedCDS");
    reqMsg.appendNode("successfulAcceptedCDS",top.pool.get("successfulAcceptedCDS"));    
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onQueryAcceptedFailedCDSAsyncComplete);
  }

  /*向服务器查询存单轧账信息，与WEB服务器进行异步交互完成时的回调函数*/
  this.onQueryAcceptedFailedCDSAsyncComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询异常受理存单轧账信息"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	  var cdsTranslogInfoStr = top.exchxmlasync.msgxmldomResp.getElementValue("cdsTranslogInfoStr");	  
    		
    	  top.pool.set("cdsTransFailedlogInfoStr",cdsTranslogInfoStr);
      if (typeof(top.MainFrame.onQueryAcceptedFailedCDSAsyncComplete) == "function")
        top.MainFrame.onQueryAcceptedFailedCDSAsyncComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询异常受理存单轧账信息失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*向服务器报告终端凭证受理结果信息*/
  this.sendUpdateTermStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "UpdateTermStatus");
    reqMsg.appendNode("strPan",top.pool.get("strPan"));    //账号
    reqMsg.appendNode("strVouchNo",top.pool.get("strMangerVouchNo"));    //凭证号码
    reqMsg.appendNode("iTransLogId",top.pool.get("iTransLogId"));    // 交易流水id号,用于更新流水
    reqMsg.appendNode("iTermTxStatus",top.pool.get("iTermTxStatus"));    //终端交易状态 见FinalDef.js
    reqMsg.appendNode("strTransType",top.pool.get("strMangerTransType"));  //  1:卡2:key 3:存单
    reqMsg.appendNode("strVouchType",top.pool.get("strMangerVouchType"));    // 卡、KEY、单对应的型号
    reqMsg.appendNode("strTransCode",top.pool.get("strMangerTransCode"));    // 主机交易代码
    reqMsg.appendNode("strCDSType",top.pool.get("strCDSType"));    // 存单交易分类，存单用:1开户2销户3续存4部提
    reqMsg.appendNode("strIDCardNum",top.pool.get("strMangerIDCardNum"));    //身份证号

    
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onUpdateTermStatusAsyncComplete);
  }

  /*向服务器报告终端凭证受理结果信息，与WEB服务器进行异步交互完成时的回调函数*/
  this.onUpdateTermStatusAsyncComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("报告终端凭证受理结果"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

	//更新结果无论成功与失败
    if (typeof(top.MainFrame.onUpdateTermStatusAsyncComplete) == "function")
        top.MainFrame.onUpdateTermStatusAsyncComplete();
  }
  
   /*向服务器充值绑定账户查询请求*/
  this.send902201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902201"); 
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //金额
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902201Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902201Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("绑定帐户查询交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  var strPan = top.exchxmlasync.msgxmldomResp.getElementValue("F34");	  
	  //绑定账号
	  top.pool.set("strBindPan",strPan);
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessfulLoadInq");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oLoadFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  
  /*向服务器充值(借贷记)请求*/
  this.send902202Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("60",new top.StringCtrl("").YuanToFen(top.pool.get("Amount")));//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902202"); 
	reqMsg.appendNode("Amount",  new top.StringCtrl("").YuanToFen(top.pool.get("Amount"))); //金额
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.cardreader.getField55()); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	if(top.pool.get("strBindPan") != null && top.pool.get("strBindPan") != ""){
		reqMsg.appendNode("strBindPan", top.pool.get("strBindPan")); //借记卡绑定账号		
	}else{
		reqMsg.appendNode("strBindPan", top.pool.get("strPan")); //信用卡无绑定账号
	}
	top.pool.set("isNeedReverse","1");
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902202Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902202Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("指定账户充值"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//冲正交易90域 = 交易类型+交易码+原交易流水号
	var strOrgTsns = "0020902202"+ top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    { 
		top.pool.set("isNeedReverse","");
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceScriptSuccessful");//IC卡交易后写卡处理
	}
	else if(iRet == top.RESULT_FAILED)
    { 
	    top.pool.set("isNeedReverse","");
        if (typeof(top.MainFrame.onServiceFailed) == "function")
        {
           top.MainFrame.onServiceFailed(top.langcur.oLoadFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
        }
    }
	else{
		top.pool.set("isNeedReverse","");
		//交易结果不确认发起冲正
		top.wins.showNewProcessingTip(top.langcur.oSendLoadUnknow);
		top.trans.send900002Async();
		top.MainFrame.onServiceFailed(top.langcur.oLoadFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}
  }  
  
  /*向维护客户信息请求*/
  this.send901101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901101"); 
	//是否是代理人
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strIDSexNum", top.pool.get("strAgentIDSexNum"));//性别(数字类型)
		reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strAgentIDAddress")).replaceAll(",", " "));//住址
		reqMsg.appendNode("strIDEnd", top.pool.get("strAgentIDEnd")); //身份证到期日
		reqMsg.appendNode("strIDCardNum", top.pool.get("strAgentIDCardNum")); //身份证号
		reqMsg.appendNode("strIDName", top.pool.get("strAgentIDName")); //姓名
		reqMsg.appendNode("strIDBorn", top.pool.get("strAgentIDBorn")); //出生日期		
	}else{
	    reqMsg.appendNode("strIDSexNum", top.pool.get("strIDSexNum"));//性别(数字类型)
		reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//住址
		reqMsg.appendNode("strIDEnd", top.pool.get("strIDEnd")); //身份证到期日
		reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号
		reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
		reqMsg.appendNode("strIDBorn", top.pool.get("strIDBorn")); //出生日期		
	}
	reqMsg.appendNode("strPhone", top.pool.get("strPhone"));//手机号
	reqMsg.appendNode("strFamilyCall", top.pool.get("strHomeTel"));//家庭电话
	var strAddress = top.pool.get("strFamilyAddr");
	if(strAddress != null && strAddress != "" && new top.StringCtrl("").getstrLength(strAddress) > 40) {
		strAddress = new top.StringCtrl("").cutstrringValaue(strAddress, 40);
	}
	reqMsg.appendNode("strFamilyAddr", new top.StringCtrl(strAddress).replaceAll(",", " "));//家庭地址
	reqMsg.appendNode("strJob", top.pool.get("strJob"));//职业
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901101Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901101Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("维护客户信息"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    top.pool.set("customNo", top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateCustomInfoSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("维护客户信息失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*开卡个税维护客户信息请求*/
  this.send901102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901102"); 
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));//身份证号码
	reqMsg.appendNode("adminSysId", top.pool.get("customNo")); //客户号
	reqMsg.appendNode("strTaxFlag", top.pool.get("TaxFlag"));//税收居民标识
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901102Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901102Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("居民个税维护客户信息"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("isHaveCustomNum")){//老客户
    		 top.trans.sendImageFileAsync();
    	}else{//新客户
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateTaxSuccessful");//IC卡交易后写卡处理	
    	}
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("居民个税维护客户信息失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
   /*开卡交易*/
  this.send901104Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901104"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));   //客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //加密数据
	reqMsg.appendNode("strOpenCardType", top.pool.get("openCardType")); //57域
	reqMsg.appendNode("strCardType", top.pool.get("cardProduct")); //卡产品
	reqMsg.appendNode("strTransRandom", top.pool.get("strTransRandom"));//随机数(71域)
	reqMsg.appendNode("strCostFee", top.pool.get("strCardPrice"));//工本费
	reqMsg.appendNode("strPindata", top.pool.get("PinBlock4"));//查询密码
	reqMsg.appendNode("strUsage", top.pool.get("strUse"));//开卡用途
	reqMsg.appendNode("strOtherUsage", top.pool.get("strOtherUsage"));//其他用途
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901104Complete);
  }


   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901104Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("开卡901104"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strOpenTsn", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.openCardSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCardDispenserFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*借记卡激活交易*/
  this.send901201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901201"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //加密数据
	reqMsg.appendNode("strCardActiveFlag", top.pool.get("cardActiveFlag")); //激活标示
	reqMsg.appendNode("strPindata", top.pool.get("PinBlock4")); //查询密码
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901201Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901201Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("借记卡激活901201"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("cardActiveFlag") == "N") {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqActiveSuccess");//IC卡交易后写卡处理
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.openCardSuccess");//IC卡交易后写卡处理
    	} 
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oActiveCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*借记卡激活前查询交易*/
  this.send901210Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901210"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //加密数据
	reqMsg.appendNode("strCardActiveFlag", top.pool.get("cardActiveFlag")); //激活标示
	reqMsg.appendNode("strPindata", top.pool.get("PinBlock4")); //查询密码
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901210Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901210Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("借记卡激活前查询901210"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("cardActiveFlag") == "N") {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqActiveSuccess");//IC卡交易后写卡处理
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.openCardSuccess");//IC卡交易后写卡处理
    	} 
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oActiveCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
    /*向服务器客户信息查询-信用卡账户查询请求*/
  this.send904503Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904503"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据	
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904503Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904503Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡账户查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful_AccListQuery");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器客户信息查询-信用卡卡片查询请求*/
  this.send904504Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904504");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904504Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904504Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡卡片查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryCustomSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*向服务器客户信息查询-信用卡卡片查询请求*/
  this.sendCreditInfoAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904504");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("DestPan")); //账号

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onCreditInfoAsyncComplete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onCreditInfoAsyncComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡卡片查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQuerySuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*向服务器转账-借贷记交易请求*/
  this.send903101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("40",top.pool.get("Amount"));//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903101");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("strPassbookNo", top.pool.get("hostAccount")); //账号
	}
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //金额
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	reqMsg.appendNode("strDestPan", top.pool.get("DestPan"));//转入卡号
	reqMsg.appendNode("strTransUse", top.pool.get("transUseSelect"));//资金用途
	reqMsg.appendNode("strAcceptName", top.pool.get("StrPanNameToSign"));//收款人名称
	reqMsg.appendNode("strF616NM", top.pool.get("PayerCustName"));//付款人名称
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903101Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync903101Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("转账"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oTransferFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*转账累计交易额度查询*/
  this.send903111Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903111");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //转出账号
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //转入账号
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903111Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync903111Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("转账"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onService903111Successful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oTransferFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器电子现金交易-写卡结果上送请求*/
  this.send902209Async = function(func)
  {
	onAsyncExchangeComplete = func;
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902209");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("Amount", new top.StringCtrl("").YuanToFen(top.pool.get("Amount"))); //金额
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strScriptRes",top.pool.get("strScriptRes")); //附加交易信息
	reqMsg.appendNode("strOrgTsns", top.pool.get("strOrgTsns")); //原交易流水号
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902209Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902209Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("写卡结果上送"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//写卡成功返回页面
	if(top.pool.get("strScriptRes")!= null && top.pool.get("strScriptRes") == "Y"){
		if(typeof(eval(onAsyncExchangeComplete))=="function"){//回到原交易要返回的函数中去
             eval(onAsyncExchangeComplete+"();"); 
        }
	}else{		
		 if(top.pool.get("isNeedReverse") == "1"){
			top.pool.set("isNeedReverse",""); 
			//写卡失败后发起冲正交易
			top.wins.showNewProcessingTip(top.langcur.oSendLoadFail);
			top.trans.send900002Async();	
		 }		
		 top.MainFrame.onServiceFailed("IC卡交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);		 
	}	
  }
  
  /*向服务器公积金交易-余额查询请求*/
  this.send907301Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907301");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strGjjType", top.pool.get("strGjjType")); //公积金类型 
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907301Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync907301Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("公积金余额查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		//交易成功获取返回数据
		top.pool.set("strAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//公积金账号
		top.pool.set("strAmount",top.exchxmlasync.msgxmldomResp.getElementValue("F54"));//实际余额
		top.pool.set("strMonAmount",top.exchxmlasync.msgxmldomResp.getElementValue("F54_1"));//月缴存额
		top.pool.set("strOrgName",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//单位名称
		top.pool.set("strCustName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//客户姓名
		top.pool.set("strEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));//数据截止日期
		
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器公积金交易-明细查询请求*/
  this.send907302Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907302");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strGjjType", top.pool.get("strGjjType")); //公积金类型 
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907302Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync907302Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("公积金明细查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      //交易返回成功获取明细数据：F59域
      top.pool.set("strDetail",top.exchxmlasync.msgxmldomResp.getElementValue("F59"));
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqDeFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器代缴费交易-用户编号查询请求*/
  this.send907110Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907110");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strUserId", top.pool.get("UserNum"));    //用户编号	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907110Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync907110Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("用户编号查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("UserName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/userName"));
    top.pool.set("UserId",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/userId"));
    top.pool.set("UserAddr",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/userAddr"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oFeeInqFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器代缴费交易-缴费条码查询请求*/
  this.send907101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907101");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strUserNum", top.pool.get("UserNum")); //条形码 
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strUserType",top.pool.get("strUserType")); //代理种类
	if(top.pool.get("strCompanyNum") != null && top.pool.get("strCompanyNum")!=""){
		reqMsg.appendNode("strCompanyNum",top.pool.get("strCompanyNum")); //公司代码	
	}	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907101Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync907101Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("缴费条码查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oFeeInqFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器代缴费交易-水电煤缴费请求*/
  this.send907102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907102");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strUserType",top.pool.get("strUserType")); //代理种类
	reqMsg.appendNode("strUserNum", top.pool.get("UserNum")); //条形码 
	reqMsg.appendNode("Amount",top.pool.get("strPayAmount")); //欠费金额
	reqMsg.appendNode("strCompanyNum",top.pool.get("strCompanyNum")); //公司代码
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907102Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync907102Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("缴费"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	var strOrgTsns = "0001907102"+ top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
	//交易金额
	top.pool.set("Amount",top.pool.get("strPayAmount"));
		
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else if(iRet == top.RESULT_FAILED)
    {
        if (typeof(top.MainFrame.onServiceFailed) == "function")
        {
          top.MainFrame.onServiceFailed(top.langcur.oPaymentFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
        }
    }else{
		//交易结果不确定
		top.wins.showNewProcessingTip(top.langcur.oSendPayFail);
		top.trans.send900002Async();
		top.MainFrame.onServiceFailed(top.langcur.oPaymentFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}
  }
  
    /*向服务器代缴费交易-电缴费请求*/
  this.send907111Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907111");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strUserId", top.pool.get("UserId")); //条形码 
	reqMsg.appendNode("Amount",new StringCtrl("").YuanToFen(top.pool.get("strFeeAmount")));//总金额
	reqMsg.appendNode("strChargeFlag",top.pool.get("strChargeFlag")); //应收标志
	reqMsg.appendNode("strPayerCustName",top.pool.get("UserName")); //账户名称
	reqMsg.appendNode("strAmountMonth",top.pool.get("strAmountMonth")); //应收年月
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907102Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync907111Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("电力缴费"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	var strOrgTsns = top.exchxmlasync.msgxmldomResp.getElementValue("transSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
	//交易金额
	top.pool.set("Amount",top.pool.get("strFeeAmount"));
		
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else if(iRet == top.RESULT_FAILED)
    {
        if (typeof(top.MainFrame.onServiceFailed) == "function")
        {
          top.MainFrame.onServiceFailed(top.langcur.oPaymentFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
        }
    }else{
		//交易结果不确定
		top.wins.showNewProcessingTip(top.langcur.oSendPayFail);
		top.trans.send900002Async();
		top.MainFrame.onServiceFailed(top.langcur.oPaymentFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}
  }
    /*向服务器借记卡修改密码请求*/
  this.send902503Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("70","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902503");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("PinBlock2", top.pool.get("PinBlock2")); //新密码
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	reqMsg.appendNode("strPwdFlag",top.pool.get("strPwdFlag"));//3-查询密码;2-交易密码
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号 存折使用
	reqMsg.appendNode("strVoucherNo", top.pool.get("strVoucherNo")); //扩展主账号 凭证号码
	reqMsg.appendNode("strVoucherType", top.pool.get("strVoucherType")); //扩展主账号 凭证种类
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //身份证号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902503Complete);
	
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902503Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("修改密码"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oPassModFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器活期转定期请求*/
  this.send903401Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903401");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", (top.pool.get("Amount")*100).toFixed(0)); //金额
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strProductType","3504");//产品类型
	reqMsg.appendNode("strProductSubType",top.pool.get("strProductSubType"));//产品子类
	reqMsg.appendNode("strFloatingIntRate",top.pool.get("strFloatingIntRate"));//议价利率
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903401Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync903401Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("活期转定期"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oTransferFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
    /*向服务器定期转活期请求*/
  this.send903402Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903402");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strFixedPan",top.pool.get("strFixedPan"));//定期账户
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //金额
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903402Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync903402Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("定期转活期"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oTransferFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
 
  /*向服务器冲正(充值、缴费冲正)请求*/
  this.send900002Async = function()
  {
		var exch = new ExchangeXmlWithHost();
		var reqMsg = new ColsMsgXmlText();
		reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Reverse");//冲正线程
		reqMsg.appendNode("strTransCode","900002");    //交易编码，需要和配置文件对应
		reqMsg.appendNode("Amount", top.pool.get("Amount")); //金额
		reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
		reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号  //补登折冲正用
		reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
		//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
		reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
		reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
		reqMsg.appendNode("orgTsn", top.pool.get("strOrgTsns"));  //原交易流水号
		reqMsg.appendNode("strField57", top.pool.get("strField57"));
		reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
		var strJrn = new top.StringCtrl("发送冲正交易");
		top.journalPrinter.addJournal(strJrn);
		exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
  }
  
  /*保存从服务器返回的XML数组*/
  this.saveXMLDatalist = function(exch)
  {
    var xml;
    var XMLList = new Array();
	var reqMsg = new ColsMsgXmlText();
    var num = exch.msgxmldomResp.selectNodesCount("/TransMsg/DATA/ITEM");
    for(var i=1; i<=num; i++)
    {
		xml = new Object();
		if(exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/DATA/ITEM[" + i + "]/URL") !="" && 
			exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/DATA/ITEM[" + i + "]/URL") != null){
			xml.url = reqMsg.utf8to16(reqMsg.decode64(exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/DATA/ITEM[" + i + "]/URL").replace(/\s+/g,"")));	        						
			/*if(top.pool.get("strImageType") == "IDType"){
				xml.imgType = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/DATA/ITEM[" + i + "]/IMG_ID_NOTE");
			}else{
				xml.imgType = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/DATA/ITEM[" + i + "]/BUSI_FILE_TYPE");
			}*/
			xml.imgType = exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/DATA/ITEM[" + i + "]/BUSI_FILE_TYPE");
			top.pool.set(xml.imgType, xml.url);
			XMLList[XMLList.length] = xml;
		  }	
    }
    top.pool.set("XMLList", XMLList);
  }
  
  this.sendCheckCardTrackAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
  	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CheckCardTrack");
    reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);    //终端编号
  	reqMsg.appendNode("strPan", top.pool.get("strPan"));    //卡号
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCheckCardTrackComplete);
  }

  /*
    私有函数：与WEB服务器进行异步交互完成时的回调函数
  */
  this.onAsyncCheckCardTrackComplete = function(iRet)
  {
	// 记录终端流水
	var strJrn = new top.StringCtrl("发卡校验"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);

	if (iRet == top.RESULT_SUCCESSFUL)
	{
		if (typeof(top.MainFrame.inputPin1) == "function")
			top.MainFrame.inputPin1();
	}
	else
	{
	   if (typeof(top.MainFrame.onServiceFailed) == "function")
	   {
	      top.MainFrame.onServiceFailed("开卡失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	   }
	}
  }
  
  //卡流水状态更新
  this.sendCardPresentedAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
  	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CardPresented");
    reqMsg.appendNode("transLogId", top.pool.get("transLogId"));    //交易流水
  	reqMsg.appendNode("termTxStatus", top.pool.get("termTransStatus"));    //终端交易状态
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCardPresentedComplete);
  }
  
    /*
    私有函数：与WEB服务器进行异步交互完成时的回调函数
  */
  this.onAsyncCardPresentedComplete = function(iRet)
  {
	// 记录终端流水
	var strJrn = new top.StringCtrl("卡流水状态更新"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);

	if (iRet == top.RESULT_SUCCESSFUL)
	{
	}
	else
	{
	}
  }

  /*向服务器发送信用卡启用*/
  this.send904102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904102");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //姓名
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //身份证号
	reqMsg.appendNode("strCardCVV2", top.pool.get("cvcValue"));  //CVC号
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904102Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904102Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡启用  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 

  /*向服务器发送重置密码（借贷记）*/
  this.send902502Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902502");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //姓名
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //身份证号
	reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//住址
	reqMsg.appendNode("strIDSex", top.pool.get("strIDSex"));//性别
	reqMsg.appendNode("strIDEnd", top.pool.get("strIDEnd")); //身份证到期日
	reqMsg.appendNode("strMobileCall", top.pool.get("strPhone"));//手机号
	reqMsg.appendNode("strIDBorn", top.pool.get("strIDBorn"));//出生日期
	reqMsg.appendNode("strVoucherType", top.pool.get("strVoucherType"));//凭证类型
	reqMsg.appendNode("strVoucherNo", top.pool.get("strVoucherNo"));//凭证类型
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strPwdFlag",top.pool.get("strPwdFlag"));//3-查询密码;2-交易密码
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //IC数据
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902502Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902502Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("重置密码  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.pool.set("strPinBlock",top.pool.get("PinBlock2"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.reSetPWDSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*向服务器发送解锁密码（借贷记）*/
  this.send902501Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902501");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902501Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902501Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("解锁密码 返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.unLockPWDSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  
  /*向服务器发送账户列表查询*/
  this.send902106Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902106");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号 
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902106Complete);
  }
  
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902106Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("账户列表查询902106  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
		
  /*向服务器发送账户信息查询*/
  this.send902105Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902105");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strSubPan", top.pool.get("strPan")); //账号 
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("DestPan",top.pool.get("DestPan"));//扩展主账号
	reqMsg.appendNode("strSubAcctType", top.pool.get("strSubAcctType"));       //子账户类型
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902105Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902105Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("账户信息查询902105 返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("inqFristCard", "");
    	top.pool.set("F60_1",top.exchxmlasync.msgxmldomResp.getElementValue("F60_1"));//证件号
		top.pool.set("F61_6_NM",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//持卡人名
		top.pool.set("subAcctNo",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//子账户号
		top.pool.set("F54_ZHYE",top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));//账户余额
		//可用余额
		top.pool.set("strAccKYYE",top.exchxmlasync.msgxmldomResp.getElementValue("F54_KYYE"));
		top.pool.set("acctStatus",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctStatus"));//账户状态
		top.pool.set("acctType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctType"));//账户类型
		top.pool.set("termCurrentFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/termCurrentFlag"));//定期/活期标识
		top.pool.set("acctKind",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctKind"));//账户类别
		top.pool.set("strDestHolderName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));
	    //取款主账号
	    top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onService902105Successful");//IC卡交易后写卡处理
    }
    else
    {
    	if(top.pool.get("inqFristCard") == "1") {
    		top.pool.set("inqFristCard", "");
    		if (typeof(top.MainFrame.onInqFristCardFail) == "function")
    	    {
    	        top.MainFrame.onInqFristCardFail(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}else {
    		if (typeof(top.MainFrame.onServiceFailed) == "function")
    	    {
    	        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 


  /*向服务器发送信用卡自动还款约定查询*/
  this.send904107Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904107");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strCurrency",top.pool.get("strCurrency")); //币种
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904107Complete);
  }
  
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904107Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡自动还款约定查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	//已签约
      	var bindPan = top.exchxmlasync.msgxmldomResp.getElementValue("F34");
      	var strModeOfRepayment = top.exchxmlasync.msgxmldomResp.getElementValue("F57");
      	if(null != bindPan && bindPan.length > 15)top.pool.set("bindPan",bindPan);
      	if(null != strModeOfRepayment && strModeOfRepayment.length > 0) top.pool.set("strModeOfRepayment",strModeOfRepayment);	
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
     else
    {
    	var respCode = top.exchxmlasync.strTermRetCode;
    	//未签约 respCode 009068  respDesc 无自扣还款账号
    	if ("009068"==respCode && typeof(top.MainFrame.onQueryUNRepay) == "function"){
      	top.MainFrame.onQueryUNRepay();
    	}else	if (typeof(top.MainFrame.onServiceFailed) == "function"){
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  
  /*向服务器发送按证件号查询持卡人卡号*/
  this.send904502Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904502");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //证件号
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //姓名
	reqMsg.appendNode("certType", top.pool.get("certType"));  //证件类型
	reqMsg.appendNode("PAGE-FLAG", top.pool.get("PAGE-FLAG"));  //翻页标识
	
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904502Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904502Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡账户列表查询904502  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSelectAcc");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
   /*向服务器发送信用卡自动还款约定申请*/
  this.send904105Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904105");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("DestPan", top.pool.get("SuccPan"));  //绑定账户
	reqMsg.appendNode("strCurrency",top.pool.get("strCurrency")); //币种
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904105Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904105Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡自动还款约定申请  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onReypaySuccessful");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
   /*向服务器发送信用卡自动还款约定取消*/
  this.send904106Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904106");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("DestPan", top.pool.get("DestPan"));  //解绑账户
	reqMsg.appendNode("strCurrency",top.pool.get("strCurrency")); //币种
	reqMsg.appendNode("strModeOfRepayment",top.pool.get("strModeOfRepayment"));
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904106Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904106Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡自动还款约定取消  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCancleSuccessful");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*向服务器发送信用卡自动购汇还款查询*/
  this.send904208Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904208");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904208Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904208Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡自动购汇还款查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	//已签约
      	var bindPan = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctNo");
      	if(null != bindPan && "" != bindPan){
			
			top.pool.set("bindPan",bindPan);	
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");
		}else{
				
			if (typeof(top.MainFrame.onQueryUNRepay904208) == "function"){
			
				top.MainFrame.onQueryUNRepay904208();
			}else if (typeof(top.MainFrame.onServiceFailed) == "function"){
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, "", "无自扣还款账号");
			}
		}
    }
    else
    {
        if (typeof(top.MainFrame.onServiceFailed) == "function"){
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
   /*向服务器发送信用卡自动购汇还款解约*/
  this.send904207Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904207");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904207Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904207Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡自动购汇还款解约  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCancleSuccessful");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*向服务器发送信用卡自动购汇还款申请*/
  this.send904206Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904206");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("DestPan", top.pool.get("SuccPan"));  //绑定账户
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strservcd", top.pool.get("servcdSelect"));  //还款方式
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904206Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904206Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡自动购汇还款申请  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onReypaySuccessful");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*向服务器发送账户列表查询*/
  this.send902110Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902110");    //交易编码，需要和配置文件对应
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("productType", top.pool.get("strproductType"));  //产品代码
	reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo"));  //循环查询标识
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902110Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902110Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("账户列表查询902110  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));		
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.SelectSubCount");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*新账户列表查询*/
  this.send902125Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902125");    //交易编码，需要和配置文件对应
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902125Complete);
  }
	/*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902125Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("账户列表查询902125  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.showView");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

 /*向服务器发送明细查询*/
  this.send902111Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902111");    //交易编码，需要和配置文件对应
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("DestPan", top.pool.get("DestPan"));  //三磁道
	reqMsg.appendNode("strStartDate", top.pool.get("BeginDate"));  //开始日期
	reqMsg.appendNode("strEndDate", top.pool.get("EndDate"));  //结束日期
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));  //币种
	reqMsg.appendNode("strCashRemitFlag", top.pool.get("strCashRemitFlag"));  //钞汇标识
	
	if(top.pool.get("startRecordNo") != null && top.pool.get("startRecordNo").length > 0 ){
		reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo"));  //开始查询记录号  首次为空，后续上送返回信息	
	}else{
		reqMsg.appendNode("startRecordNo", "1");
	}
	reqMsg.appendNode("strF123", top.pool.get("strF123"));//首次为空，后续上送返回信息	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902111Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902111Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("历史明细查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));	
		top.pool.set("strF123",top.exchxmlasync.msgxmldomResp.getElementValue("F123"));	
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 

 /*综合签约查询*/
  this.send901610Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901610");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901610Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901610Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("综合签约查询901610  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strSignStatus", top.exchxmlasync.msgxmldomResp.getElementValue("F57"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSignSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("综合签约查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 

 /*ATM转账及限额查询*/
  this.send901703Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901703");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901703Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901703Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("ATM转账及限额查询901703  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	//是否签约标志位
    	var atmTransferFlag = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/atmTransferFlag");
    	top.pool.set("atmTransferFlag",atmTransferFlag);
    	//日限额
    	var cashAmtLimit = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/cnyDateQuota");
		//单笔限额    
	    var transferLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/atmTransferQuota"); 
        if(null != cashAmtLimit && cashAmtLimit.length > 0){
      	    top.pool.set("cashAmtLimit",cashAmtLimit);
    	}
    	if(null != transferLimitAmt && transferLimitAmt.length > 0){
      	   top.pool.set("transferLimitAmt",transferLimitAmt);
    	}
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqTrfLmtSucceful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*ATM转账及限额*/
  this.send901704Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901704");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strAtmTransferQuota", top.pool.get("strDayLimitAmount"));//atm转账限额
	//社保卡签约  00000076 社保卡
	if(top.pool.get("productType") == "00000076"){
		reqMsg.appendNode("strAbroadCashDateQuota","10000");//境外取现日限额
		reqMsg.appendNode("strSsdAtmCashDateQuota","10000");
	}else{
		reqMsg.appendNode("strAbroadCashDateQuota","20000");
		reqMsg.appendNode("strSsdAtmCashDateQuota","20000");
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901704Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901704Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("ATM转账及限额签约901704  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    top.pool.set("JJKQYTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onJJKQYComplete");//IC卡交易后写卡处理
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    	}
    }
    else
    {
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode",top.exchxmlasync.strTermRetDesc);
    		if (typeof(top.MainFrame.onJJKQYComplete) == "function")
  	      	{
    			top.MainFrame.onJJKQYComplete();
  	      	}
    	}else {
    		if (typeof(top.MainFrame.onServiceFailed) == "function")
    	    {
    	        top.MainFrame.onServiceFailed("ATM转账签约失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
  /*小额免密签约*/
  this.send901707Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901707");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTrfLimitAmount", top.pool.get("transLimitAmt"));//单笔
	reqMsg.appendNode("strDayLimitAmount", top.pool.get("dayTransLimitAmt"));//单日
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901707Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901707Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("小额免密签约901707  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("XEMMTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onXEMMComplete");//IC卡交易后写卡处理
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    	}
    }
    else
    {
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode",top.exchxmlasync.strTermRetDesc);
    		if (typeof(top.MainFrame.onXEMMComplete) == "function")
  	      	{
    			top.MainFrame.onXEMMComplete();
  	      	}
    	}else {
    		if (typeof(top.MainFrame.onServiceFailed) == "function")
    	    {
    	        top.MainFrame.onServiceFailed("小额免密签约失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
  /*手机号登记新增*/
  this.send901712Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901712");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("inputPhone",top.pool.get("strPhone"));//手机号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901712Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901712Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("手机号登记新增901712  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("DSFKJTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onDSFKJComplete");//IC卡交易后写卡处理
    	}else {
		    new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    	}
    }
    else
    {
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode",top.exchxmlasync.strTermRetDesc);
    		if (typeof(top.MainFrame.onDSFKJComplete) == "function")
  	      	{
    			top.MainFrame.onDSFKJComplete();
  	      	}
    	}else {
    		if (typeof(top.MainFrame.onServiceFailed) == "function")
    	    {
    	        top.MainFrame.onServiceFailed("手机号登记新增失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
  /*限额管理查询*/
  this.send901806Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901806");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strFastPayType",top.pool.get("strPayType"));//交易类型
	reqMsg.appendNode("strType",top.pool.get("strType"));//支付类型区分
	reqMsg.appendNode("strBindAcctType",top.pool.get("acctKind"));//账户类型
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901806Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901806Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("限额管理查询901806  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("strPayType") == "008036-UPQ011"){
    		//单笔限额
        	var transLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/singleLimit");
    		//单日累计限额    
    	    var dayTransLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/dayLimit");
    	    //单月累计限额    
    	    var monthLimith = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/monthLimit");
		}else{
			//单笔限额
	    	var transLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/transLimitAmt");
	    	//单日累计限额     
		    var dayTransLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/dayTransLimitAmt");
		    //单月累计限额    
		    var monthLimith = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/remark1");
		}
    	
        if(null != transLimitAmt && transLimitAmt.length > 0){
      	    top.pool.set("transLimitAmt",transLimitAmt);
    	}
    	if(null != dayTransLimitAmt && dayTransLimitAmt.length > 0){
      	   top.pool.set("dayTransLimitAmt",dayTransLimitAmt);
    	}
    	if(null != monthLimith && monthLimith.length > 0){
       	   top.pool.set("monthLimith",monthLimith);
     	}
    	top.pool.set("signPayTypeFlag","true");
    	
	    new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqTrfLmtSucceful");//IC卡交易后写卡处理
    }else{
    	//未签约返回信息维护页面
    	var retCode = top.exchxmlasync.strTermRetCode;
    	if(retCode == "AQPE004" || retCode == "TQPB004" ||retCode == "JDT017" || retCode == "UPQ002" || retCode == "HFT017" ||
    	   retCode == "TLT010" || retCode == "FFT017" || retCode == "SNT010" || retCode == "BDT010"){
    		top.pool.set("strPayType","");
    		top.MainFrame.signFailed();
    	}else if(top.pool.get("strPayType") == "select"){
    		top.pool.set("strPayType","");
    		top.MainFrame.signFirstSelect();
    	}
    	else if (typeof(top.MainFrame.onServiceFailed) == "function")
	    {
	        top.MainFrame.onServiceFailed("限额管理查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	    }
    }
  } 
  
  /*限额管理修改*/
  this.send901807Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901807");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender", "2");
	}else{
		reqMsg.appendNode("strGender", "1");	
	}
	reqMsg.appendNode("strType",top.pool.get("strType"));//支付类型区分
	reqMsg.appendNode("strSignType",top.pool.get("strFastPayType"));//交易类型
	if(top.pool.get("strFastPayType") == "008036-UPQ012"){ // 银联无卡快捷支付
		reqMsg.appendNode("strSingleLimit", new top.StringCtrl("").YuanToFen(top.pool.get("strTransLimitAmt")));//单笔
		reqMsg.appendNode("strDayLimit", new top.StringCtrl("").YuanToFen(top.pool.get("strDayTransLimitAmt")));//单日
		reqMsg.appendNode("strMonthLimit", new top.StringCtrl("").YuanToFen(top.pool.get("strMonthLimith")));//单月
	}else{
		reqMsg.appendNode("strTrfLimitAmount", new top.StringCtrl("").YuanToFen(top.pool.get("strTransLimitAmt")));//单笔
		reqMsg.appendNode("strDayLimitAmount", new top.StringCtrl("").YuanToFen(top.pool.get("strDayTransLimitAmt")));//单日
		reqMsg.appendNode("strMonthLimith", new top.StringCtrl("").YuanToFen(top.pool.get("strMonthLimith")));//单月
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901807Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901807Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("限额管理修改901807  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    top.pool.set("XEGLTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
		if (typeof(top.MainFrame.onServiceFailed) == "function")
	    {
	        top.MainFrame.onServiceFailed("限额管理修改失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	    }
    }
  } 
  
  /*个人网银专业版注册*/
  this.send908201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908201");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock4")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
	reqMsg.appendNode("strBirthdayDt", top.pool.get("strIDBorn")); //生日
	reqMsg.appendNode("strRegIdAddr", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " ")); //地址
	reqMsg.appendNode("strPostCode", "200000");  //邮编
//	reqMsg.appendNode("strTel",top.pool.get("strPhone"));//电话
	reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//手机号
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender", "F");
	}else{
		reqMsg.appendNode("strGender", "M");	
	}
	reqMsg.appendNode("strVoucherType", top.pool.get("strUkeyType")); //凭证类型strVoucherNo
	reqMsg.appendNode("strVoucherNo", top.pool.get("UkeyNum")); //凭证号
	reqMsg.appendNode("strUKeyNum", top.pool.get("LocalUkeyNum")); //Ukey编号
	reqMsg.appendNode("strCostFee", top.pool.get("strUkeyPrice"));//工本费
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908201Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908201Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("个人网银专业版注册908201  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("strUkeyTsn", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    top.pool.set("WYZSBTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onWYZSBComplete");//IC卡交易后写卡处理
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    	}
    }
    else
    {
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode",top.exchxmlasync.strTermRetDesc);
    		if (typeof(top.MainFrame.onWYZSBComplete) == "function")
  	      	{
    			top.MainFrame.onWYZSBComplete();
  	      	}
    	}else {
    		if (typeof(top.MainFrame.onServiceFailed) == "function")
    	    {
    	        top.MainFrame.onServiceFailed("个人网银专业版注册失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
  /*个人网银短信版注册*/
  this.send908202Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908202");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock4")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
	reqMsg.appendNode("strBirthdayDt", top.pool.get("strIDBorn")); //生日
	reqMsg.appendNode("strRegIdAddr", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " ")); //地址
	reqMsg.appendNode("strPostCode", "200000");  //邮编
//	reqMsg.appendNode("strTel",top.pool.get("strPhone"));//电话
	reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//手机号
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender", "F");
	}else{
		reqMsg.appendNode("strGender", "M");	
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908202Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908202Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("个人网银短信版注册908202  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("WYZSBTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onWYZSBComplete");//IC卡交易后写卡处理
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    	}
    }
    else
    {
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode",top.exchxmlasync.strTermRetDesc);
    		if (typeof(top.MainFrame.onWYZSBComplete) == "function")
  	      	{
    			top.MainFrame.onWYZSBComplete();
  	      	}
    	}else {
    		if (typeof(top.MainFrame.onServiceFailed) == "function")
    	    {
    	        top.MainFrame.onServiceFailed("个人网银短信版注册失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
 /********************开卡类相关交易***************************/

  /*联网核查*/
  this.send910201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","910201");    //交易编码，需要和配置文件对应
	
	//是否是代理人联网核查
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strIDName", top.pool.get("strAgentIDName"));  //姓名
		reqMsg.appendNode("strIDCardNum", top.pool.get("strAgentIDCardNum"));  //身份证号
	}else{
		reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //姓名
		reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //身份证号
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910201Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910201Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("联网核查  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//判断身份证是否到期
    	if(top.pool.get("isAgent") == "1") {
    		//代理人
    		if(top.pool.get("strAgentIDEnd") != "" && top.pool.get("strAgentIDEnd") != "长期" && (parseInt(top.pool.get("strAgentIDEnd")) < parseInt(new top.DateTimeCtrl().getYYYYMMDD())))
        	{
        	    if (typeof(top.MainFrame.onServiceFailed) == "function")
        	    {
        	    	top.pool.set("isPersonal", "");
        	    	top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "对不起，身份证已到期！");
        	    	return;
        	    }
        	}
    	}else {
    		if(top.pool.get("strIDEnd") != "" && top.pool.get("strIDEnd") != "长期" && (parseInt(top.pool.get("strIDEnd")) < parseInt(new top.DateTimeCtrl().getYYYYMMDD())))
        	{
        	    if (typeof(top.MainFrame.onServiceFailed) == "function")
        	    {
        	    	top.pool.set("isPersonal", "");
        	    	top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "对不起，身份证已到期！");
        	    	return;
        	    }
        	}
    	}
    	
    	top.pool.set("customNo",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
    	//老手机号
    	top.pool.set("mobileCall",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mobileCall"));
    	//家庭地址
    	top.pool.set("familyAddr",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/familyAddr"));
    	//家庭电话
    	top.pool.set("familyCall",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/familyCall"));
    	
		if(top.pool.get("isAgent") == "1"){
			//代理人联网核查照片
			top.pool.set("strAgentIDOnLineImage",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//联网核查返回的照片(base64字符串)
		}else{
			top.pool.set("strIDOnLineImage",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//联网核查返回的照片(base64字符串)
		}		
    	//是否需要验证卡证合一
    	if(top.pool.get("isPersonal") == "1") {
    		top.pool.set("isPersonal", "");
    		if(top.pool.get("strIDCardNum") != "" && top.pool.get("strIDCardNum") != null && top.pool.get("strIDCardNum") == top.pool.get("strRespIDNo")) {
				new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onNetworkVirificationSuccessful");//IC卡交易后写卡处理
    		}else {
				if(top.pool.get("IDCardAcceptFlag") != "" && top.pool.get("IDCardAcceptFlag") != null && top.pool.get("IDCardAcceptFlag") == "1"){
					if (typeof(top.MainFrame.onNetworkVirificationSuccessful) == "function")
						top.MainFrame.onNetworkVirificationSuccessful();
					else
						top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "身份证验证与户主不一致");
				}else{
					if(top.pool.get("IDCardAcceptFlag") != "" && top.pool.get("IDCardAcceptFlag") != null && top.pool.get("IDCardAcceptFlag") == "2")
						top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "身份证验证与户主不一致");//2018-1-16 取款时卡证不一提示修改
					else
						top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "该业务需本人办理");
				}
			}
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onNetworkVirificationSuccessful");//IC卡交易后写卡处理	
    	}

    }
    else
    {
    	top.pool.set("isPersonal", "");
	    if (typeof(top.MainFrame.onServiceFailed) == "function")
	    {
			/*  P102-冒名买卖账户  P103-6个月无交易账户  P104-反洗钱账户 
                P105-人行黑名单    P106-本行黑名单       P107-涉案相关账户
                P108-电讯诈骗灰名单
			*/
			if("P102" == top.exchxmlasync.strTermRetCode || "P103" == top.exchxmlasync.strTermRetCode 
			   || "P104" == top.exchxmlasync.strTermRetCode || "P105" == top.exchxmlasync.strTermRetCode
			   || "P106" == top.exchxmlasync.strTermRetCode || "P107" == top.exchxmlasync.strTermRetCode
				||"P108" == top.exchxmlasync.strTermRetCode ){
				top.trans.send910304BalckListAsync(top.langcur.oCheckIDCardSendPadTip);
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.langcur.oCheckIDCardFailedTip);
			}else{
	    		top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	   	 	}
		}
    }
  }   


 /*开卡前查询账户列表*/
  this.send901110Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901110");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));//客户号
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数(71域)
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901110Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901110Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("开卡前查询账户列表901110  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	top.pool.set("openCardFlag", top.exchxmlasync.msgxmldomResp.getElementValue("F57"));	
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqLinkCardSuccess");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*二类户绑定一类户*/
  this.send902123Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902123");                         //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));        //客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                //二类户卡号
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));    //证件号码
	reqMsg.appendNode("strTransRandom", top.pool.get("strTransRandom"));//随机数(71域)
	reqMsg.appendNode("strCardNo", top.pool.get("strFristPan"));        //一类户卡号
	reqMsg.appendNode("strMobileNo", top.pool.get("strPhone"));         //手机号
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902123Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902123Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("二类户绑定一类户  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("cardRetCode", "success");
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onLinkFristCardSuccess");//IC卡交易后写卡处理		
    }
    else
    {
    	top.pool.set("cardRetCode", top.exchxmlasync.strTermRetDesc);
    	if (typeof(top.MainFrame.onLinkFristCardSuccess) == "function")
    	{
    		top.MainFrame.onLinkFristCardSuccess();
    	}
     }
  }
  
 /*信用卡账单头查询*/
  this.send904506Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904506");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
    reqMsg.appendNode("strStartDate", top.pool.get("strDate")); //账单年月
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904506Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904506Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("账单头查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//最小还款额
      top.pool.set("strMiniPay",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/minPayAmt"));
      //本期应还款
      top.pool.set("strCurrentPay",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/periodAmt"));
	  //账单日
	  top.pool.set("DueDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/billDay"));
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onBillTopSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*信用卡已出账单查询*/
  this.send904508Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904508");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strStartDate", top.pool.get("strDate")); //查询日期

	if(top.pool.get("startRecordNo") != null && top.pool.get("startRecordNo").length > 0 ){
		reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo"));  //开始查询记录号  首次为空，后续上送返回信息	
	}else{
		reqMsg.appendNode("startRecordNo", "");
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904508Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904508Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡已出账单查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));			
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
 
     /*信用卡已出账单查询*/
  this.send904508SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904508");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strStartDate", top.pool.get("strDate")); //查询日期

	if(top.pool.get("startRecordNo") != null && top.pool.get("startRecordNo").length > 0 ){
		reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo"));  //开始查询记录号  首次为空，后续上送返回信息	
	}else{
		reqMsg.appendNode("startRecordNo", "");
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904508SecondComplete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904508SecondComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("信用卡已出账单查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));			
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*信用卡未出账单查询*/
  this.send904507Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	top.exchxmlasync.onAsyncExchangeComplete ="again";
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904507");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo")); //翻页查询上送返回字段
	

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904507Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904507Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("未出账单  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));		
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*信用卡未出账单查询*/
  this.send904507SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904507");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo")); //翻页查询上送返回字段
	

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904507SecondComplete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync904507SecondComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("未出账单  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));		
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 


 /*存折补登*/
  this.send902301Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902301");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("CUACNO"));          //存折账号
	reqMsg.appendNode("strTrack2", top.pool.get("TRACK2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902301Complete);
  }

  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902301Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("存折补登  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
		
		
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
		top.pool.set("strOrgTsns","0004902301"+""+top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    	//top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));	
      if (typeof(top.MainFrame.onQuerySuccessful) == "function"){
      	top.MainFrame.onQuerySuccessful();
    	}	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
		if("XX"==top.exchxmlasync.strTermRetCode){
			top.MainFrame.onServiceFailed("存折补登查询失败", top.exchxmlasync.strTermRetCode, "无补登数据");
		}else{
			top.MainFrame.onServiceFailed("存折补登查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
        
      }
    }
  } 

  /*活期子账户查询*/
   this.send902109Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902109");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));   //客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("DestPan", top.pool.get("hostAccount")); // 主账号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902109Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902109Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("活期子账户查询902109  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {  
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryCurrentSubAccountSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*PAD审核交易*/
  this.send910301Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910301");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("idPhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("idPhotoUrl")))); //正
	reqMsg.appendNode("idPhotoBackUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("idPhotoBackUrl")))); //反
	reqMsg.appendNode("scenePhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("scenePhotoUrl"))));//现场
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strBranchNo", "00010");
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId"));
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strBranchName","ATM");
	reqMsg.appendNode("strSceneCheck","N");	
	reqMsg.appendNode("strCheckContent",top.pool.get("strCheckContent"));	
	reqMsg.appendNode("strExpireTime",top.iPadCheckTimeout);	
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//户名
	//是否代办
	if(top.pool.get("strAgentFlag") == "1"){
		reqMsg.appendNode("strAgentIDName",top.pool.get("strAgentIDName"));//代理人
		reqMsg.appendNode("strAgentFlag",top.pool.get("strAgentFlag"));
		reqMsg.appendNode("strAgentIdType","00");
	}else{
		reqMsg.appendNode("strAgentFlag","0");		
	}
	
	reqMsg.appendNode("strTransDateAndTime",new top.DateTimeCtrl(null).getYYYYMMDD()+ new top.DateTimeCtrl(null).getHHmmSS());
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号
	//社保卡申请 pad审核增加签名照片及社保照片
	if(top.pool.get("strbusinessCode") == "901123"){
		if(top.pool.get("strImageNum") == "0"){
			reqMsg.appendNode("selfSignPhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("signaturePhotoUrl")))); //手势签名照
		}else if(top.pool.get("strImageNum") == "1"){
			reqMsg.appendNode("socialSecurityPhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("wechatPhotoUrl")))); //社保卡照片
			reqMsg.appendNode("selfSignPhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("signaturePhotoUrl")))); //手势签名照
		}
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910301Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910301Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("PAD审核交易  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strReqSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/checkSerialNo"));
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  //进行审核结果查询
	   isCheckLoadingMore = true;	   
	   top.trans.send910303Async();
    }
    else
    {
	  isCheckLoadingMore = false;
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("审核失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*PAD审核交易（强存）*/
  this.send910306Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910306");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("idPhotoUrl", ""); //正
	reqMsg.appendNode("idPhotoBackUrl", ""); //反
	reqMsg.appendNode("scenePhotoUrl", "");//现场
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strBranchNo", "00010");
	reqMsg.appendNode("strBatchId", top.pool.get("strBatchId"));
	reqMsg.appendNode("strbusinessCode", top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName", top.pool.get("strbusinessName"));
	reqMsg.appendNode("strBranchName", "ATM");
	reqMsg.appendNode("strSceneCheck", "N");	
	reqMsg.appendNode("strCheckContent", top.pool.get("strCheckContent"));	
	reqMsg.appendNode("strExpireTime", top.iPadCheckTimeout);	
	reqMsg.appendNode("strAgentFlag", "0");	
	reqMsg.appendNode("strTransDateAndTime", new top.DateTimeCtrl(null).getYYYYMMDD()+ new top.DateTimeCtrl(null).getHHmmSS());
	//如果是存单的强存审核
	if(top.pool.get("isDep0005Trans") =="1"){
		reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号
		reqMsg.appendNode("strIDName", top.pool.get("strIDName"));//户名		
	}else{
		reqMsg.appendNode("strIDCardNum", top.pool.get("strRespIDNo")); //身份证号
		reqMsg.appendNode("strIDName", top.pool.get("strRespIDName"));//户名
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910306Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910306Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("PAD审核交易(强存)  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strReqSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/checkSerialNo"));
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  //进行审核结果查询
	   isCheckLoadingMore = true;	   
	   top.trans.send910303ExAsync();
    }
    else
    {
	  isCheckLoadingMore = false;
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onForceDepCheckFailed("协助存款审核失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*审核结果查询(强存)*/
  this.send910303ExAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910303");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strReqSerialNo"));//原审核流水号
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strOrgTsns",top.pool.get("strReqSerialNo"));//S端查询使用
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910303ExComplete);  
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910303ExComplete = function(iRet)
  {
   var strJrn = new top.StringCtrl("审核结果查询(强存)  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		isCheckLoadingMore = false;	
		//审核
		var strCheckStatus =  top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/checkStatus");
		if(strCheckStatus == "S"){
			top.pool.set("custManagerNo", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/custManagerNo"));
			top.pool.set("custManagerName", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/custManagerName"));
			if (typeof(top.MainFrame.onCheckLoadingSuccessful) == "function"){
				top.MainFrame.onCheckLoadingSuccessful();
			}
		}else{		
		  var strTermRetDesc = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/authRejectReason");		
			 if (typeof(top.MainFrame.onForceDepCheckFailed) == "function")
			{
				top.MainFrame.onForceDepCheckFailed("协助存款审核失败", top.exchxmlasync.strTermRetCode, strTermRetDesc);
			}
		}		
    }
    else
    {
		isCheckLoadingMore = false;
		if (typeof(top.MainFrame.onForceDepCheckFailed) == "function")
		{
			top.MainFrame.onForceDepCheckFailed("协助存款审核失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }		  
  }
  
  /*审核结果查询*/
  this.send910303Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910303");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strReqSerialNo"));//原审核流水号
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strOrgTsns",top.pool.get("strReqSerialNo"));//S端查询使用
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910303Complete);  
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910303Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("审核结果查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		isCheckLoadingMore = false;	
		//审核
		var strCheckStatus =  top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/checkStatus");
		if(strCheckStatus == "S"){
			top.pool.set("custManagerNo", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/custManagerNo"));
			top.pool.set("custManagerName", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/custManagerName"));
			if (typeof(top.MainFrame.onCheckLoadingSuccessful) == "function"){
				top.MainFrame.onCheckLoadingSuccessful();
			}
		}else{		
		  var strTermRetDesc = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/authRejectReason");		
			 if (typeof(top.MainFrame.onServiceFailed) == "function")
			{
				top.MainFrame.onServiceFailed("审核失败", top.exchxmlasync.strTermRetCode, strTermRetDesc);
			}
		}		
    }
    else
    {
		isCheckLoadingMore = false;
		if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("审核失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }		  
  }
  
  /*审核交易-取消审核通知*/
  this.send910302Async = function()
  {
	isCheckLoadingMore = false;
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910302");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strReqSerialNo"));//原审核流水号
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strOrgTsns",top.pool.get("strReqSerialNo"));//S端查询使用
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910302Complete);  
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910302Complete = function(iRet)
  {
	 var strJrn = new top.StringCtrl("取消审核通知  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (typeof(top.MainFrame.onServiceFailed) == "function")
	{
		top.MainFrame.onServiceFailed("PAD审核超时", "FFFF", "对不起,PAD审核超时");
	}		  
  }
  
  /*额度查询*/
  this.send906101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906101");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName",top.pool.get("strRespIDName"));//证件姓名
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906101Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync906101Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("额度查询906101  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	top.pool.set("status", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/status"));
    	top.pool.set("isCheck", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/isCheck"));
		top.pool.set("signPayFlag", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/signPayFlag"));
    	top.pool.set("isNotice", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/isNotice"));
    	top.pool.set("customerName", top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));
    	top.pool.set("limitBalance", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/residualLimit"));
    	top.pool.set("usedBalance", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/usedLimit"));
    	top.pool.set("limitBalance2", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/residualLimit2"));
    	top.pool.set("usedBalance2", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/usedLimit2"));
    	if(top.pool.get("isCheck")=="N" && top.pool.get("status")=="01" ){
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.TakePic");//IC卡交易后写卡处理		
    	}else if(top.pool.get("isCheck")=="Y" && top.pool.get("isNotice")=="Y"){
    		top.MainFrame.onServiceFailed("额度查询失败", top.exchxmlasync.strTermRetCode, "请持本人身份证件和真实性证明材料去柜面办理。");
    	}else if(top.pool.get("status")=="03" && top.pool.get("signPayFlag")=="1"){
    		top.MainFrame.onServiceFailed("额度查询失败", top.exchxmlasync.strTermRetCode, "请持本人身份证件和真实性证明材料去柜面办理。");
    	}else if(top.pool.get("status")=="02" && top.pool.get("signPayFlag")=="1"){
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.TakePic");
    	}else{
    		top.pool.set("focussDate", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/focussDate"));
    		top.pool.set("focuseDate", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/focuseDate"));
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqFxBalanceSuccess");//IC卡交易后写卡处理	
    		}
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("额度查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*额度查询*/
  this.send906101SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906101");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName",top.pool.get("strRespIDName"));//证件姓名
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906101SecondComplete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync906101SecondComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("额度查询906101  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	top.pool.set("customerName", top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));
    	top.pool.set("limitBalance", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/residualLimit"));
    	top.pool.set("usedBalance", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/usedLimit"));
    	top.pool.set("limitBalance2", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/residualLimit2"));
    	top.pool.set("usedBalance2", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/usedLimit2"));
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqFxBalanceSuccess");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("额度查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*签署确认书*/
  this.send906104Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906104");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName",top.pool.get("customerName"));//证件姓名
	reqMsg.appendNode("strCuststat",top.pool.get("strCuststat"));//状态
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906104Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync906104Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("签署确认书906104  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onConfirmBookSuccess");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("签署确认书失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*汇率查询*/
  this.send906201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906201");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("Amount"));    //金额
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));          //币种
	reqMsg.appendNode("strTateType", top.pool.get("strTateType"));          //类型
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906201Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync906201Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("汇率查询906201  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.inqFxRateSuccess");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("汇率查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /*美元汇率查询(结汇比较可用额度用)*/
  this.sendUsd906201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906201");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", "100");    //金额
	reqMsg.appendNode("strCurrency", "USD");          //币种
	reqMsg.appendNode("strTateType", "02");          //类型
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncUsd906201Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncUsd906201Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("汇率查询906201  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.inqUsdFxRateSuccess");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("汇率查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /*外汇购汇*/
  this.send906301Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906301");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));   //客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));            //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));      //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));      //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));  //加密数据
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));  //币种
	reqMsg.appendNode("currency", top.pool.get("strCurrency"));  //入库币种
	reqMsg.appendNode("Amount", top.pool.get("Amount"));            //金额
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//户名
	reqMsg.appendNode("strUsage", top.pool.get("strUsage"));        //购汇资金属性
	//reqMsg.appendNode("strRemark", top.pool.get("remark"));
	reqMsg.appendNode("strUseDate", top.pool.get("strUseDate"));
	reqMsg.appendNode("strUsageDetail1", top.pool.get("strUsageDetail1"));
	reqMsg.appendNode("strUsageDetail2", top.pool.get("strUsageDetail2"));
	reqMsg.appendNode("strUsageDetail3", top.pool.get("strUsageDetail3"));
	reqMsg.appendNode("strUsageDetail4", top.pool.get("strUsageDetail4"));
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906301Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync906301Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("外汇购汇906301  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	top.pool.set("transAmt",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/transAmt"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("外汇购汇失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*外汇结汇*/
  this.send906302Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906302");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));   //客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));            //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));      //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));      //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));  //加密数据
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));  //币种
	reqMsg.appendNode("currency", top.pool.get("strCurrency"));  //入库币种
	reqMsg.appendNode("Amount", top.pool.get("Amount"));            //金额
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//户名
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	reqMsg.appendNode("strUsage", top.pool.get("strUsage"));        //购汇资金属性
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906302Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync906302Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("外汇结汇906302  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	top.pool.set("exchangeSettleAmt",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/exchangeSettleAmt"));
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("外汇结汇失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*货币对信息查询*/
  this.send906401Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906401");    //交易编码，需要和配置文件对应
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906401Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync906401Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("货币对信息查询906401  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCurrencyPairSuccess");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("货币对信息查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*外汇买卖*/
  this.send906406Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906406");                           //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));     //客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                   //银行卡号
	reqMsg.appendNode("strHostAccount", top.pool.get("hostAccount"));      //主账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));             //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));             //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));         //加密数据
	reqMsg.appendNode("strAuthWorker", top.pool.get("custManagerNo"));     //授权柜员
	reqMsg.appendNode("strBuyAccount", top.pool.get("hostAccount"));       //买入账户号码
	reqMsg.appendNode("strBuyAccountKind", top.pool.get("BuyAccType"));    //买入账户种类
	reqMsg.appendNode("strBuyCode", top.pool.get("BuyCurr"));              //买入币种代码
	reqMsg.appendNode("strBuyAmt", top.pool.get("fxBuyAmt"));              //买入金额
	reqMsg.appendNode("strCyCode3", top.pool.get("strCyCode"));            //录入货币代码
	reqMsg.appendNode("strOutSubAccountType", top.pool.get("SellAccType"));//转出子账号类别
	reqMsg.appendNode("strSellCardNo", top.pool.get("strPan"));            //转出卡号
	reqMsg.appendNode("strSellAccount", top.pool.get("hostAccount"));      //卖出账户
	reqMsg.appendNode("strSellAccountKind", top.pool.get("SellAccType"));  //卖出账户种类
	reqMsg.appendNode("strSellAmt", top.pool.get("fxSellAmt"));            //卖出金额
	reqMsg.appendNode("strSellCode", top.pool.get("SellCurr"));            //卖出币种代码
	reqMsg.appendNode("strProxyFlag", "0");                                //是否代理标识
	reqMsg.appendNode("strCertificateTypeSrcb", "00");                     //证件类型
	reqMsg.appendNode("strSubAcctType", top.pool.get("BuyAccType"));       //买入账户种类
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));        //证件号码
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));              //户名
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906406Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync906406Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("外汇买卖906406  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	top.pool.set("buyAmt",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/buyAmt"));
    	top.pool.set("sellAmt",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/sellAmt"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("外汇买卖失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
   /*开卡维护客户信息*/
  this.send901108Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901108Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901108Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("维护客户信息"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateCustomInfoSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, "存单开户失败");
      }
    }
  }	
  
  
  /*预留手机号登记查询*/
  this.send901710Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901710");    //交易编码，需要和配置文件对应
    reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901710Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901710Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("预留手机号查询901710"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      top.pool.set("phone",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mobile"));//手机号
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
      }
    }
  }	
  
  /*预留手机号登记修改*/
  this.send901709Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901709");    //交易编码，需要和配置文件对应
    reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("inputPhone",top.pool.get("strPhone"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901709Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901709Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("预留手机号修改901709"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("DSFKJTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onModifyServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
      }
    }
  }



/*电子签约查询 客户级*/
 this.send901608Async = function(){
    //先判断卡类型 如果是信用卡 直接退卡
    if(top.pool.get("strCardType") == "2"){
		top.MainFrame.onServiceFailed("查询失败", "","请插入本行借记卡！" );
    }else if(top.pool.get("strCardType") == "3"){
		top.MainFrame.onServiceFailed("查询失败", "","请插入已注册网银的借记卡！" );
    }else{
		new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	    var exch = new ExchangeXmlWithHost();
	    var reqMsg = new ColsMsgXmlText();
        reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
        reqMsg.appendNode("strTransCode", "901608");    //交易编码，需要和配置文件对应
	    reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
        reqMsg.appendNode("strSignType",top.pool.get("strSignType"));//
        top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901608Complete);
    }
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901608Complete = function(iRet){
    var strJrn = new top.StringCtrl("电子签约查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL){
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//客户号
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//查询类型
		top.pool.set("strIDCardNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/idNo"));//身份证号
      	top.pool.set("strIDName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/customerName"));//姓名
     	top.pool.set("mobile",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mobile"));//手机号
 		top.pool.set("strTel",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/tel"));//手机号     	
		top.pool.set("cardPassbookNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardPassbookNo"));//签约卡号
     	//格式化
		top.pool.set("cardPassbookFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardPassbookFlag"));//凭证类型
		top.pool.set("versionType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/versionType"));//网银版本
		top.pool.set("voucherType",top.trans.convertType(top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/voucherType"),"Ukey"));//Ukey版本
		
		top.pool.set("strSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/signContractSerialNo"));      
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryServiceSuccessful");//IC卡交易后写卡处理
	 }
	 else{
		  var respCode = top.exchxmlasync.strTermRetCode;
		  //未签约 respCode 700011 
		  if ("700011"==respCode && typeof(top.MainFrame.onNoSignSuccessful) == "function"){
			  top.MainFrame.onNoSignSuccessful("查询失败", top.TERMRETCODE_IMAGEFILE_FAILED, "您未注册本行的电子银行！");
		  } 
		  else if (typeof(top.MainFrame.onServiceFailed) == "function"){
	          top.MainFrame.onServiceFailed("查询失败", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
		  }
     }
  }
 
  /*电子签约查询 卡级*/
  this.send901608CardAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901608");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
    reqMsg.appendNode("strSignType",top.pool.get("strSignType"));//
    reqMsg.appendNode("strPan",top.pool.get("strPan"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901608CardComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901608CardComplete = function(iRet){
    var strJrn = new top.StringCtrl("电子签约查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL){
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//客户号
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//查询类型
		top.pool.set("strIDCardNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/idNo"));//身份证号
      	top.pool.set("strIDName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/customerName"));//姓名
     	top.pool.set("mobile",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mobile"));//手机号
 		top.pool.set("strTel",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/tel"));//手机号     	
		top.pool.set("cardPassbookNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardPassbookNo"));//签约卡号
     	//格式化
		top.pool.set("cardPassbookFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardPassbookFlag"));//凭证类型
		top.pool.set("versionType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/versionType"));//网银版本
		top.pool.set("voucherType",top.trans.convertType(top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/voucherType"),"Ukey"));//Ukey版本
		
		top.pool.set("strSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/signContractSerialNo"));      
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryServiceSuccessful");//IC卡交易后写卡处理
    }else{
		  var respCode = top.exchxmlasync.strTermRetCode;
		  //未签约 respCode 700011 
		  if ("700011"==respCode && typeof(top.MainFrame.onNoSignSuccessful) == "function"){
			   top.MainFrame.onNoSignSuccessful("查询失败", top.TERMRETCODE_IMAGEFILE_FAILED, "您的账户尚未进行注册！");
		  } 
		  else if (typeof(top.MainFrame.onServiceFailed) == "function"){
	           top.MainFrame.onServiceFailed("查询失败", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
		  }
    }
  }

 /*网银客户手机号修改908207*/
  this.send908207Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908207");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//身份证号码
    reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//
    reqMsg.appendNode("strTel",top.pool.get("strTel"));//
	reqMsg.appendNode("strSerialNo",top.pool.get("strSerialNo"));//签约流水号 
	reqMsg.appendNode("strRegIdAddr",new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//地址  	
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//卡号
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3")); //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strPostCode", "200000");  //邮编
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908207Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908207Complete = function(iRet){
    // 记录终端流水
    var strJrn = new top.StringCtrl("个人网银信息修改"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL){
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//客户号
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//查询类型
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    } else{
        if (typeof(top.MainFrame.onServiceFailed) == "function"){
           top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, "个人网银信息修改失败");
        }
    }
  }
 
  /*个人网银关联账户明细*/
  this.send908212Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908212");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
    reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//身份证
    reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908212Complete);
  }
  
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908212Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("个人网银关联账户明细"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

   if (iRet == top.RESULT_SUCCESSFUL)
    {
      //交易返回成功获取明细数据：F59域
      top.pool.set("strDetail",top.exchxmlasync.msgxmldomResp.getElementValue("F59"));
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqDeFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*手机银行签约-注册*/
  this.send908101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908101");    //交易编码，需要和配置文件对应
    reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strSignType",top.pool.get("strSignType"));
	reqMsg.appendNode("strPhone", top.pool.get("strPhone"));//手机号
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//户名
	reqMsg.appendNode("strEmail",top.pool.get("email"));//邮件
	reqMsg.appendNode("familyCall",top.pool.get("strPhone"));//家庭电话
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender", "F");
	}else{
		reqMsg.appendNode("strGender", "M");	
	}
	reqMsg.appendNode("strBirthdayDt",top.pool.get("birthDate"));//出生日期
	reqMsg.appendNode("strRegIdAddr",new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//地址
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //加密数据	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908101Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908101Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("手机银行注册908101"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("SJYHTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//客户号
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//查询类型
		if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode", "success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSJYHComplete");//IC卡交易后写卡处理
		}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
		}
    }
    else
    {
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode", top.exchxmlasync.strTermRetDesc);
    		if (typeof(top.MainFrame.onSJYHComplete) == "function")
    	    {
    	        top.MainFrame.onSJYHComplete();
    	    }
    	}else {
    		if (typeof(top.MainFrame.onServiceFailed) == "function")
    	    {
    	        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  }		
  
  /*手机银行关联账户明细*/
  this.send908106Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908106");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strIDCardNum",top.pool.get("IDNum"));//身份证
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908106Complete);
  }
  
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908106Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("手机银行关联账户明细"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

   if (iRet == top.RESULT_SUCCESSFUL)
    {
      //交易返回成功获取明细数据：F59域
      top.pool.set("strDetail",top.exchxmlasync.msgxmldomResp.getElementValue("F59"));
	  var itemCount = top.exchxmlasync.msgxmldomResp.selectNodesCount("/TransMsg/dataList/F59/item");
	  if(parseInt(itemCount,10) < 1){
		top.MainFrame.onServiceFailed("查询失败", "", "关联账户列表查询为空");
	  }
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryListSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqDeFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*手机银行手机号修改908104*/
  this.send908104Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908104");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//身份证号码
    reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//手机号
//    reqMsg.appendNode("strTel",top.pool.get("strPhone"));//电话
	reqMsg.appendNode("strSerialNo",top.pool.get("strSerialNo"));//签约流水号 
	reqMsg.appendNode("strRegIdAddr",new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//地址  	
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//卡号
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender","F")
	}else{
		reqMsg.appendNode("strGender","M");	
	}
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3")); //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strPostCode", "200000");  //邮编
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908104Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908104Complete = function(iRet){
    // 记录终端流水
    var strJrn = new top.StringCtrl("手机银行信息修改"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL){
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//客户号
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//查询类型
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    } else{
     if (typeof(top.MainFrame.onServiceFailed) == "function"){
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, "手机银行信息修改失败");
      }
    }
  }
  
  /*手机银行注销*/
  this.send908102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908102");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //注销卡号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号 存折使用
	reqMsg.appendNode("strCardPassbookFlag", top.pool.get("cardPassbookFlag"));
	reqMsg.appendNode("strSerialNo",top.pool.get("strSerialNo"));//签约流水号 

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908102Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908102Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("手机银行注销返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("手机银行注销失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*手机银行密码重置*/
  this.send908108Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908108");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //加密数据	
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908108Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908108Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("重置密码返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//客户号
	  top.pool.set("strRespIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//证件号
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.reSetPWDSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oMobileResetPWDFail, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*手机银行新增/删除账户*/
  this.send908107Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908107");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据	
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strOperateType",top.pool.get("strOperateType"));//操作类型
	reqMsg.appendNode("strSignContractSerialNo",top.pool.get("strSerialNo"));//签约流水号
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908107Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908107Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("手机银行新增/删除账户908107  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*短信通签约*/
  this.send908304Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908304");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//户名
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//卡号
	reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//手机号
	reqMsg.appendNode("strSign",top.pool.get("strSign"));//是否已签约标志
	if(top.pool.get("strSign") == "1"){
		reqMsg.appendNode("strOperationType","0");	
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908304Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908304Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("短信通签约908304  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("DXTZTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode", "success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onDXTZComplete");//IC卡交易后写卡处理
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    	}
    }
    else
    {
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode", top.exchxmlasync.strTermRetDesc);
    		if (typeof(top.MainFrame.onDXTZComplete) == "function")
    	    {
    	        top.MainFrame.onDXTZComplete();
    	    }
    	}else {
    		if (typeof(top.MainFrame.onServiceFailed) == "function")
    	    {
    	        top.MainFrame.onServiceFailed("短信通签约失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  }
  
  /*短信通维护*/
  this.send908305Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908305");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//卡号
	//reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	//reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	//reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//户名
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号	
	reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//手机号
	reqMsg.appendNode("strAcctType",top.pool.get("strAcctType"));//操作类型 1修改
	reqMsg.appendNode("strOpenLimitAmount",top.pool.get("openLimitAmount"));//
	reqMsg.appendNode("strIsShowBalance",top.pool.get("isShowBalance"));//
	reqMsg.appendNode("strSignMobile",top.pool.get("signMobile"));//查询结果回送
	reqMsg.appendNode("strMandatoryMobile",top.pool.get("mandatoryMobile"));//查询结果回送
	
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908305Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908305Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("短信通维护  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理;
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*短信通查询*/
  this.send908303Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908303");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908303Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908303Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("短信通查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.pool.set("signMobile",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/signMobile"));//修改交易时回送
		top.pool.set("mandatoryMobile",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mandatoryMobile"));//修改交易时回送
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*个人网银密码重置*/
  this.send908214Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908214");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //加密数据
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908214Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908214Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("网银密码重置  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*个人网银新增账户*/
  this.send908213Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908213");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //新增卡号
	reqMsg.appendNode("strActiveFlag", top.pool.get("activeFlag")); //0:新增  1:删除
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908213Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908213Complete = function(iRet)
  {
    // 记录终端流水
	var transName = top.pool.get("activeFlag")=="0"?"网银新增返回码:":"网银删除返回码:";
    var strJrn = new top.StringCtrl(transName + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*个人网银注销*/
  this.send908203Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908203");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //注销卡号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23域
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号 存折使用
	reqMsg.appendNode("strCardPassbookFlag", top.pool.get("cardPassbookFlag"));
	reqMsg.appendNode("strSerialNo",top.pool.get("strSerialNo"));//签约流水号 

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908203Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908203Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("网银注销  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oEBankCancelFail, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*插卡验密*/
  this.send901606Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901606");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号 存折使用
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901606Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901606Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("验密"+"  "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//客户号
    	top.pool.set("strRespIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//用户名
    	top.pool.set("strRespIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//证件号
    	top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//主账号
    	top.pool.set("mainSuppleCardFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mainSuppleCardFlag"));//卡主标示
    	top.pool.set("productType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));//卡产品类型
    	top.pool.set("cardStatus",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardStatus"));//卡状态
	    top.pool.set("strPayerOpenBankNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchNo"));//插卡验密后取到扣款卡的开户行网点号，上送后用于手续费试算
	    top.pool.set("PayerCustName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//插卡验密后取到扣款卡的户名，上送后用于跨行转账
    	var cardStatus = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/cardStatus");
		if(cardStatus.length > 4 && "1" != cardStatus.substr(4,1) ){
			if (typeof(top.MainFrame.onServiceFailed) == "function")
			{
				top.MainFrame.onServiceFailed("交易失败", "","卡状态非法,请联系大堂经理");
			}
		}
		else{
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onVerifyServiceSuccessful");//IC卡交易后写卡处理
		}
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
		/*  P102-冒名买卖账户  P103-6个月无交易账户  P104-反洗钱账户 */
		if("P102" == top.exchxmlasync.strTermRetCode || "P103" == top.exchxmlasync.strTermRetCode 
		   || "P104" == top.exchxmlasync.strTermRetCode || "P105" == top.exchxmlasync.strTermRetCode
		   || "P106" == top.exchxmlasync.strTermRetCode || "P107" == top.exchxmlasync.strTermRetCode
			||"P108" == top.exchxmlasync.strTermRetCode ){
			top.pool.set("isBlackList","true");	
			//推送PAD
			top.trans.send910304BalckListAsync();
			
			top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.langcur.oCheckCardFailedTip);
		}else{
			top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
      }
    }
  }	
	
  /*插卡验密*/
  this.send901606SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901606");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号 存折使用
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901606SecondComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901606SecondComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("验卡验密"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//客户号
    	top.pool.set("strRespIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//用户名
    	top.pool.set("strRespIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//证件号
    	top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//主账号
    	top.pool.set("mainSuppleCardFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mainSuppleCardFlag"));//卡主标示
    	top.pool.set("productType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));//卡产品类型
    	top.pool.set("cardStatus",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardStatus"));//卡状态
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onVerifyServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
		if (typeof(top.MainFrame.onServiceSecondFailed) == "function" && "2055" == top.exchxmlasync.strTermRetCode)
		{
			top.MainFrame.onServiceSecondFailed();
		}else if(typeof(top.MainFrame.onServiceFailed) == "function"){
			if("P102" == top.exchxmlasync.strTermRetCode || "P103" == top.exchxmlasync.strTermRetCode 
				|| "P104" == top.exchxmlasync.strTermRetCode || "P105" == top.exchxmlasync.strTermRetCode
				|| "P106" == top.exchxmlasync.strTermRetCode || "P107" == top.exchxmlasync.strTermRetCode
				||"P108" == top.exchxmlasync.strTermRetCode ){
				top.pool.set("isBlackList","true");	
				//推送PAD
				top.trans.send910304BalckListAsync();
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.langcur.oCheckCardFailedTip);
			}else{
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
			}
		}
    }
  }
  
  /*插卡验密-本行-跨行 存折验密专用 2018-03-09*/
  this.send901606SecondAsyncPassBookTrans = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901606");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("DestPan", top.pool.get("strPassBookNum")); //扩展主账号 存折使用
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901606SecondCompletePassBookTrans);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901606SecondCompletePassBookTrans = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("存折验密"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//客户号
    	top.pool.set("strRespIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//用户名
    	top.pool.set("strRespIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//证件号
    	top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//主账号
    	top.pool.set("mainSuppleCardFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mainSuppleCardFlag"));//卡主标示
    	top.pool.set("productType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));//卡产品类型
    	top.pool.set("cardStatus",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardStatus"));//卡状态
	    top.pool.set("strPayerOpenBankNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchNo"));//插卡验密后取到扣款卡的开户行网点号，上送后用于手续费试算
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onVerifyServiceSuccessfulPassBookTrans");//IC卡交易后写卡处理
    }
    else
    {
		if (typeof(top.MainFrame.onServiceSecondFailedPassBookTrans) == "function" && "2055" == top.exchxmlasync.strTermRetCode)
		{
			top.MainFrame.onServiceSecondFailedPassBookTrans();
		}else if(typeof(top.MainFrame.onServiceFailed) == "function"){
			if("P102" == top.exchxmlasync.strTermRetCode || "P103" == top.exchxmlasync.strTermRetCode 
				|| "P104" == top.exchxmlasync.strTermRetCode || "P105" == top.exchxmlasync.strTermRetCode
				|| "P106" == top.exchxmlasync.strTermRetCode || "P107" == top.exchxmlasync.strTermRetCode
				||"P108" == top.exchxmlasync.strTermRetCode ){
				top.pool.set("isBlackList","true");	
				//推送PAD
				top.trans.send910304BalckListAsync();
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.langcur.oCheckCardFailedTip);
			}else{
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
			}
		}
    }
  }
	
  /*向服务器发送支行信息查询请求*/
  this.sendGetRouteBank = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryRouteBank");
	reqMsg.appendNode("cityCode", top.pool.get("cityCode"));
	reqMsg.appendNode("bankCode", top.pool.get("bankCode"));
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var routeBankList = new Array();
		var num = exch.msgxmldomResp.selectNodesCount("/TransMsg/RB/ITEM");
		for(var i=1; i<=num; i++)
		{    
			routeBankList[i-1]= new Array(exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/RB/ITEM[" + i + "]/strBankName"),exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/RB/ITEM[" + i + "]/strBankCode"),exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/RB/ITEM[" + i + "]/strRouteCode"));
		}
        top.pool.set("routeBankList", routeBankList);
		
		top.MainFrame.readFile();
    }
    else
    {
        top.MainFrame.error_Select.innerHTML = "支行信息查询失败！";
    }
  }  
  
  /*代扣签约查询*/
  this.send907204Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "907204");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号
	reqMsg.appendNode("strUserNum", top.pool.get("strUserNum")); //用户编号
	reqMsg.appendNode("strCompanyNum", top.pool.get("strCompanyNum")); //公司代码
	reqMsg.appendNode("strUserType", top.pool.get("strUserType")); //代扣种类
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));  //客户号
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907204Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync907204Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("代扣签约查询"+"  "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.MainFrame.onServiceFailed(top.langcur.oSignAuthFailed, top.exchxmlasync.strTermRetCode, top.langcur.oSignAuthOK);
    }
    else
    {
		//不存在签约信息
		if(top.exchxmlasync.strTermRetCode == "A000002")
		{
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQuerySuccessful");//IC卡交易后写卡处理
		}else{
			if (typeof(top.MainFrame.onServiceFailed) == "function")
			{
				top.MainFrame.onServiceFailed(top.langcur.oSignAuthFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
			}
		}
    }
  }	
  
  /*代扣签约*/
  this.send907205Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "907205");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号 
	reqMsg.appendNode("strIDName",top.pool.get("strUserName"));//户名
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号	
	reqMsg.appendNode("strPhone", top.pool.get("strPhone")); //手机号
	reqMsg.appendNode("strUserNum", top.pool.get("strUserNum")); //用户编号
	reqMsg.appendNode("strCompanyNum", top.pool.get("strCompanyNum")); //公司代码
	reqMsg.appendNode("strUserType", top.pool.get("strUserType")); //代扣种类
	reqMsg.appendNode("strDkaddr", top.pool.get("strUserAddress"));  //客户地址
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));  //客户号
	reqMsg.appendNode("strPostCode", "200000");  //邮编
	reqMsg.appendNode("strDkpzzl", "37");  //凭证种类
	reqMsg.appendNode("strDkbac1", top.pool.get("strDkbac1"));//电力号码
	if(top.pool.get("strCompanyNum") == "DFYX"){
		reqMsg.appendNode("strIdentNo", top.pool.get("strIDCardNum"));//东方有线客户证件号码  
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907205Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync907205Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("代扣"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oSignAuthFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }	
  
  /*电费代扣签约*/
  this.send907208Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "907208");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号 
	reqMsg.appendNode("strIDName",top.pool.get("strUserName"));//户名
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号	
	reqMsg.appendNode("strPhone", top.pool.get("strPhone")); //手机号
	reqMsg.appendNode("strUserNum", top.pool.get("strUserNum")); //用户编号
	reqMsg.appendNode("strCompanyNum", top.pool.get("strCompanyNum")); //公司代码
	reqMsg.appendNode("strUserType", top.pool.get("strUserType")); //代扣种类
	reqMsg.appendNode("strAddress", top.pool.get("strUserAddress"));  //客户地址
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));  //客户号
	reqMsg.appendNode("strPostCode", "200000");  //邮编
    if(top.pool.get("isPassBook")){
		reqMsg.appendNode("strVoucherType", "37");  //凭证种类
		reqMsg.appendNode("strCardPassbookFlag","03");
		reqMsg.appendNode("strPan", top.pool.get("DestPan")); 
	}else{
		reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	}
	//reqMsg.appendNode("strBarCode", top.pool.get("strDkbac1"));//电力号码
	if(top.pool.get("strCompanyNum") == "DFYX"){
		reqMsg.appendNode("strIdentNo", top.pool.get("strIDCardNum"));//东方有线客户证件号码  
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907208Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync907208Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("电费代扣代扣"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("isPassBook","");
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oSignAuthFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }	
  
  
  /*向服务器发送常用联系人登记簿支行信息查询请求*/
  this.sendGetBrunchRegister = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryBrunchRegister");
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("StrPanOut", top.pool.get("hostAccount"));
	}else{
		reqMsg.appendNode("StrPanOut", top.pool.get("strPan"));          //银行卡号
	}
	reqMsg.appendNode("StrPanInType", top.pool.get("StrPanInType")); //银行卡号类型
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
	top.pool.set("BrunchRegisterList", "");
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var BrunchRegisterList = new Array();
		var num = exch.msgxmldomResp.selectNodesCount("/TransMsg/BR/ITEM");
		//alert("列表长" + num);
		for(var i=1; i<=num; i++)
		{   
			//alert("strBankName---" + exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/BR/ITEM[" + i + "]/strBankName"));
			//alert("strBankCode---" + exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/BR/ITEM[" + i + "]/strBankCode"));
			//alert("strRouteCode---" + exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/BR/ITEM[" + i + "]/strRouteCode"));
			//BrunchRegisterList[i-1]= new Array(exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/BR/ITEM[" + i + "]/strBankName"),exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/RB/ITEM[" + i + "]/strBankCode"));
			BrunchRegisterList[i-1]= new Array(exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/BR/ITEM[" + i + "]/strBankName"),exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/BR/ITEM[" + i + "]/strBankCode"),exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/BR/ITEM[" + i + "]/strRouteCode"));
			
		}
        top.pool.set("BrunchRegisterList", BrunchRegisterList);
		if (typeof(top.MainFrame.GetBrunchRegisterSucc) == "function")
		top.MainFrame.GetBrunchRegisterSucc();
		
    }
    else
    {
        top.MainFrame.error_Select.innerHTML = "常用联系人信息查询失败，请选择转账相关信息！";
    }
  }

  /*向服务器发送常用联系人登记簿支行信息查询请求-本行转账*/
  this.sendGetBrunchRegister903101 = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryBrunchRegister");
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("StrPanOut", top.pool.get("hostAccount"));
	}else{
		reqMsg.appendNode("StrPanOut", top.pool.get("strPan"));          //银行卡号
	}
	reqMsg.appendNode("StrPanInType", top.pool.get("StrPanInType")); //银行卡号类型
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
	top.pool.set("BrunchRegisterList", "");
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var BrunchRegisterList = new Array();
		var num = exch.msgxmldomResp.selectNodesCount("/TransMsg/BR/ITEM");
		for(var i=1; i<=num; i++)
		{    
			BrunchRegisterList[i-1]= new Array(exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/BR/ITEM[" + i + "]/strPanIn"),exch.msgxmldomResp.selectSingleNodeValue("/TransMsg/BR/ITEM[" + i + "]/strPanName"));
		}
		//账号数据唯一
		var uniqueAccount = new top.StringCtrl("").reMoveData(BrunchRegisterList);
	   
		var BrunchRegisterListNew = new top.StringCtrl("").reMoveArrayData(BrunchRegisterList,uniqueAccount);
		
        top.pool.set("BrunchRegisterList", BrunchRegisterListNew);
		if (typeof(top.MainFrame.GetBrunchRegister903101Succ) == "function")
		top.MainFrame.GetBrunchRegister903101Succ();
    }
    else
    {
        top.MainFrame.error_Select.innerHTML = "常用联系人信息查询失败，请选输入转账账号！";
    }
  }  
  
  /*向服务器发送常用联系人登记簿支行信息查询请求*/
  this.sendSetBrunchRegister = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	//alert(top.pool.get("strPan"));
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AddBrunchRegister");
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("StrPanOut", top.pool.get("hostAccount"));
	}else{
		reqMsg.appendNode("StrPanOut", top.pool.get("strPan"));          //银行卡号
	}
	reqMsg.appendNode("StrBankCode", top.pool.get("transferCon"));//行号
	reqMsg.appendNode("StrBankName", top.pool.get("transferCN"));//行名称
	reqMsg.appendNode("StrPanIn", top.pool.get("DestPan"));//转入卡号
	reqMsg.appendNode("StrPanName", top.pool.get("StrPanName"));//转入户名
	reqMsg.appendNode("StrPanInType", top.pool.get("StrPanInType"));//本行-跨行标志位
	reqMsg.appendNode("StrRouteCode", top.pool.get("strRecvBankType"));//汇路代码
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
	//alert("交易结果 " + iRet);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		//alert("成功");
    }
    else
    {
		//alert("失败");
    }
  }  
  
  /*凭证列表查询**/
  this.send902122Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902122");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));  //客户号
	reqMsg.appendNode("strCertType", top.pool.get("strCertType"));  //凭证类型
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902122Complete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902122Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("凭证列表查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.SelectSubCount");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("凭证列表查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /**************存单交易********************/
   /*向维护客户信息请求*/
  this.sendCDS901101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901101"); 
	//是否是代理人
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strIDSexNum", top.pool.get("strAgentIDSexNum"));//性别(数字类型)
		reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strAgentIDAddress")).replaceAll(",", " "));//住址
		reqMsg.appendNode("strIDEnd", top.pool.get("strAgentIDEnd")); //身份证到期日
		reqMsg.appendNode("strIDCardNum", top.pool.get("strAgentIDCardNum")); //身份证号
		reqMsg.appendNode("strIDName", top.pool.get("strAgentIDName")); //姓名
		reqMsg.appendNode("strIDBorn", top.pool.get("strAgentIDBorn")); //出生日期		
	}else{
	    reqMsg.appendNode("strIDSexNum", top.pool.get("strIDSexNum"));//性别(数字类型)
		reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//住址
		reqMsg.appendNode("strIDEnd", top.pool.get("strIDEnd")); //身份证到期日
		reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //身份证号
		reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //姓名
		reqMsg.appendNode("strIDBorn", top.pool.get("strIDBorn")); //出生日期		
	}
	reqMsg.appendNode("strPhone", top.pool.get("strPhone"));//手机号
	reqMsg.appendNode("strFamilyCall", top.pool.get("strHomeTel"));//家庭电话
	reqMsg.appendNode("strFamilyAddr", new top.StringCtrl(top.pool.get("strFamilyAddr")).replaceAll(",", " "));//家庭地址
	reqMsg.appendNode("strJob", top.pool.get("strJob"));//职业
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCDS901101Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncCDS901101Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("代理人客户信息创建"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    top.pool.set("customNo", top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateCustomInfoSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("维护客户信息失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  //存单发放判断凭证号是否在加单批次中
  this.sendCheckCdsTrackAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
  	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CheckCDSTrack");
    reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);    //终端编号
  	reqMsg.appendNode("strOCRNum", top.pool.get("strCDCertNum"));    //存单发放读取的凭证号
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCheckCdsTrackComplete);
  }

  /*
    私有函数：与WEB服务器进行异步交互完成时的回调函数
  */
  this.onAsyncCheckCdsTrackComplete = function(iRet)
  {
	// 记录终端流水
	var strJrn = new top.StringCtrl("发单校验"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);

	if (iRet == top.RESULT_SUCCESSFUL)
	{
		if (typeof(top.MainFrame.CheckCdsTrackSucess) == "function")
			top.MainFrame.CheckCdsTrackSucess();
	}
	else
	{
	   if (typeof(top.MainFrame.onServiceFailed) == "function")
	   {
	      top.MainFrame.onServiceFailed("存单交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	   }
	}
  }
  
   /*存单利率查询*/
  this.send905105Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905105");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strProductType",top.pool.get("strProductType"));//产品类型
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数(71域)
	reqMsg.appendNode("strRateUp",top.pool.get("strRateUp"));//存单上浮利率
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905105Complete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync905105Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("利率查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {  
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onRateSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*建立存款账户*/
  this.send905102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905102");    //交易编码，需要和配置文件对应
	//如果是0元开户
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //金额
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	//存单开户客户号
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strCustomerId",top.pool.get("strAgentCustomId"));
	}else{		
		reqMsg.appendNode("strCustomerId",top.pool.get("strCdsTransId"));
	}	
	reqMsg.appendNode("strTellerId","");//授权柜员号
	reqMsg.appendNode("strDepositTerm",top.pool.get("strDepositTerm"));//存期
	reqMsg.appendNode("strProdType",top.pool.get("CDtype"));//产品类型
	reqMsg.appendNode("strProductSubType",top.trans.convertType(top.pool.get("CDtime"),""));//产品子类
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
	reqMsg.appendNode("strProductType",top.pool.get("strProductType"));//产品类型
	reqMsg.appendNode("strAuthIDCardNum",top.pool.get("strAuthIDCardNum"));//委托人
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//本人
	reqMsg.appendNode("strFloatingIntRate1",top.pool.get("strFloatingIntRate1"));//浮动利率
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905102Complete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync905102Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("开户返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
		//获取定期主账号
		top.pool.set("strCdsAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));
		//开户日期
		top.pool.set("strOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openDate"));
		//到期日
		top.pool.set("strEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));
		//开户柜员
		top.pool.set("strOpenTellerId",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openTellerId"));
		//开户行
		top.pool.set("strBranchName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchName"));
		//核心日期
		top.pool.set("strCoreBankDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/coreBankDate"));
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSOpenFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }   
  /*部提-无折部提转内部账 */
  this.send905103Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905103");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //金额
	reqMsg.appendNode("strCustomerId",top.pool.get("strCdsCustomNo"));//客户号	
	reqMsg.appendNode("strCurrency", "CNY");
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
	reqMsg.appendNode("strAccountOut",top.pool.get("DestPan"));//转出账号
	reqMsg.appendNode("strIDCardNum",top.pool.get("strCdsIDNo"));//存单开户人身份证
	reqMsg.appendNode("strIDName",top.pool.get("strCdsIDName"));//存单开户人姓名
	//有代理人
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strAgentIDCardNum",top.pool.get("strIDCardNum"));//存单代理人身份证
		reqMsg.appendNode("strAgentIDName",top.pool.get("strIDName"));//存单代理人姓名
	}	
	
	//老凭证号码
	reqMsg.appendNode("strOldVouchNo",top.pool.get("strOldVouchNo"));	
	//新凭证号码
	reqMsg.appendNode("strVoucherNo",top.pool.get("strVoucherNo"));
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); //存单类型  1:开户  2：销户  3：续存  4：部提
	//存单本金
	reqMsg.appendNode("strAcctBalance",top.pool.get("strAcctBalance"));
	reqMsg.appendNode("strVoucherDealType",top.pool.get("strPayType")); //支取方式
	
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905103Complete);   
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync905103Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("部提返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//原交易流水
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
	top.pool.set("strOrigstrTxSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
		top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
		//起息日期
		//top.pool.set("strCdsOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/valueDate"));
		//开户日期
		top.pool.set("strOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openDate"));
		//到期日期
		top.pool.set("strCdsEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));
		//存期
		top.pool.set("strDepositTerm",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productSubType"));
		//存单类型
		top.pool.set("strProductType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));
		//利率
		top.pool.set("strCreditIntRate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditIntRate"));
		//存单户名
		top.pool.set("strCdsIDName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/customerName"));//证件名
		//存单证件号
		top.pool.set("strCdsIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//证件号		
		//开户柜员
		top.pool.set("strOpenTellerId",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openTellerId"));
		//开户行
		top.pool.set("strBranchName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchName"));
		//账户余额
		top.pool.set("strAcctBalance",top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));
		//存单账号
		top.pool.set("strCoreAcctNo",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));
        //密押
		top.pool.set("strCipherValue",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cipherValue"));
		//核心日期
		top.pool.set("strCoreBankDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/coreBankDate"));
		//部提金额+部提金额利息
		top.pool.set("strDrawAmount",new top.StringCtrl("").YuanToFen(top.exchxmlasync.msgxmldomResp.getElementValue("F54_XZYE")));		
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceDrawFailed) == "function")
      {
        top.MainFrame.onServiceDrawFailed(top.langcur.oCDSDrawFail, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*存单销户转内部账*/
  this.send905104Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905104");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("strCDAmount")); //当前原存单（金额）
	reqMsg.appendNode("strCustomerId",top.pool.get("strCdsCustomNo"));//存单客户号	
	reqMsg.appendNode("strCurrency", "CNY");
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
	reqMsg.appendNode("strCDSNum", top.pool.get("strCDSNum"));//存单账号
	reqMsg.appendNode("strIDCardNum",top.pool.get("strCdsIDNo"));//存单开户人身份证
	reqMsg.appendNode("strIDName",top.pool.get("strCdsIDName"));//存单开户人姓名
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//有代理人
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strAgentIDCardNum",top.pool.get("strIDCardNum"));//存单代理人身份证
		reqMsg.appendNode("strAgentIDName",top.pool.get("strIDName"));//存单代理人姓名
	}	
	reqMsg.appendNode("strDepositTerm",top.pool.get("strDepositTerm"));//存期
	reqMsg.appendNode("strCDCertNum",top.pool.get("strCDCertNum"));//凭证号
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); //存单类型  1:开户  2：销户  3：续存  4：部提
	reqMsg.appendNode("strRate",top.pool.get("strCreditIntRate")); //利率
	reqMsg.appendNode("strInterest",top.pool.get("strAfterTaxIntAmt")); //利息
	reqMsg.appendNode("strProductSubType",top.pool.get("strDepositTerm"));//存期
	reqMsg.appendNode("strAcctBalance",top.pool.get("strAcctBalance")); //本金
	reqMsg.appendNode("strCdsIDName",top.pool.get("strCdsIDName")); //存单户名
	reqMsg.appendNode("strVoucherDealType",top.pool.get("strPayType")); //支取方式
	
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905104Complete);   
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync905104Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("销户返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
	if (iRet == top.RESULT_SUCCESSFUL)
    {   
		//核心日期
		top.pool.set("strCoreBankDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/coreBankDate"));
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doCaptureCD");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onCancelServiceFailed) == "function")
      {
        top.MainFrame.onCancelServiceFailed(top.langcur.oAcceptCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*插队取号 */
  this.send910103Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910103");    //交易编码，需要和配置文件对应
	//业务办理人身份证和户名
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strIDCardNum",top.pool.get("strAgentIDCardNum"));//证件号码
		reqMsg.appendNode("strIDName", top.pool.get("strAgentIDName"));		
	}else{
		reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
		reqMsg.appendNode("strIDName", top.pool.get("strIDName"));		
	}
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));
	reqMsg.appendNode("strType", top.pool.get("strType"));//类型
	reqMsg.appendNode("strCustomerId",top.pool.get("strCdsTransId"));//业务办理人客户号
	reqMsg.appendNode("strBusinessTypeId",top.pool.get("strBusinessTypeId"));//业务类型ID	
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
	reqMsg.appendNode("strContent",reqMsg.encode64(reqMsg.utf16to8(top.pool.get("strContent"))));//正文内容
	reqMsg.appendNode("strCoreBankDate",top.pool.get("strCoreBankDate"));//核心日期
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910103Complete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910103Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("取号返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {  
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onContentSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }   
  
  /*转账到内部账*/
  this.send905108Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905108");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("TransferAmount")); //转入内部账金额
	reqMsg.appendNode("strOutAcctNo", top.pool.get("strTransAccount")); //转出账号
	reqMsg.appendNode("strAcctPromptCode", "01"); 
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	reqMsg.appendNode("strCustomerId",top.pool.get("strCdsTransId"));//业务办理人客户号
	reqMsg.appendNode("strRespIDName",top.pool.get("strIDName"));//户名
	reqMsg.appendNode("strRespIDNo",top.pool.get("strIDCardNum"));//身份证
	reqMsg.appendNode("strProductType",top.pool.get("strProductType"));//产品类型
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905108Complete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync905108Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("转内部账返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doEjectCardOrPass");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
   /*内部账转账到借记卡*/
  this.send905106Async = function()
  {
    new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905106");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("surplusAmt")); //内部账余额
	reqMsg.appendNode("strInAcctNo", top.pool.get("strInAcctNo")); //转入内部账账号
	reqMsg.appendNode("strCurrency", "CNY");
	//reqMsg.appendNode("strCustomerId", top.pool.get("strBatchId"));	
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905106Complete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync905106Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("余额取现返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    
	if (iRet == top.RESULT_SUCCESSFUL)
    {   
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doTransferOutSucess");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onTransferOutFailed) == "function")
      {
        top.MainFrame.onTransferOutFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*存单接口-利息试算*/
  this.send905111Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905111");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCDSNum", top.pool.get("strCDSNum"));//存单账号
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905111Complete); 	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync905111Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("利息试算  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {  
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onRateSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*存单验证*/
  this.send905119Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905119");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("strCDAmount")); //存单销户金额
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	reqMsg.appendNode("strCDSNum", top.pool.get("strCDSNum"));//存单账号
	reqMsg.appendNode("strCDCertNum", top.pool.get("strCDCertNum"));//存单凭证号	
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strAuthPin", top.pool.get("strAuthPin")); //密押	
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
	reqMsg.appendNode("strQryOption",top.pool.get("strQryOption"));//随机数
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905119Complete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync905119Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("存单验证返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//存单客户号
	top.pool.set("strCdsCustomNo", top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
	//支取方式
	top.pool.set("strPayType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/withdrawMethod"));
	//利息
	top.pool.set("strAfterTaxIntAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/afterTaxIntAmt"));
	//起息日期
	top.pool.set("strCdsOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/valueDate"));
	//到期日期
	top.pool.set("strCdsEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));
	//存期
	top.pool.set("strDepositTerm",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productSubType"));
	//存单类型
	top.pool.set("strProductType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));
	//利率
	top.pool.set("strCreditIntRate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditIntRate"));
	//存单户名
	top.pool.set("strCdsIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//证件名
	//存单证件号
	top.pool.set("strCdsIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//证件号
	//本利合计（金额）
	top.pool.set("strPrinIntAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/prinIntAmt"));
	//存单是否到期
	top.pool.set("strDeptexp",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/dept_exp"));
	//存单本金
	top.pool.set("strAcctBalance",top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.queryCDInfoSucess");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onQueryCDFailed) == "function")
      {
        top.MainFrame.onQueryCDFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /*无密存单验证*/
  this.sendNoPin905119Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905119");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("strCDAmount")); //存单销户金额
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	reqMsg.appendNode("strCDSNum", top.pool.get("strCDSNum"));//存单账号
	reqMsg.appendNode("strCDCertNum", top.pool.get("strCDCertNum"));//存单凭证号	
	reqMsg.appendNode("strAuthPin", top.pool.get("strAuthPin")); //密押	
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
	reqMsg.appendNode("strQryOption",top.pool.get("strQryOption"));//备注
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncNoPin905119Complete); 
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncNoPin905119Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("无密存单验证返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine+
    " " +"支取方式"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/withdrawMethod")+ top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
        //如果支取方式是凭单折
    	var strWithdrawMethod = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/withdrawMethod");
    	//支取方式
    	top.pool.set("strPayType",strWithdrawMethod);
    	if(strWithdrawMethod == "6"){
        	//存单客户号
        	top.pool.set("strCdsCustomNo", top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
        	//利息
        	top.pool.set("strAfterTaxIntAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/afterTaxIntAmt"));
        	//起息日期
        	top.pool.set("strCdsOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/valueDate"));
        	//到期日期
        	top.pool.set("strCdsEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));
        	//存期
        	top.pool.set("strDepositTerm",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productSubType"));
        	//存单类型
        	top.pool.set("strProductType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));
        	//利率
        	top.pool.set("strCreditIntRate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditIntRate"));
        	//存单户名
        	top.pool.set("strCdsIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//证件名
        	//存单证件号
        	top.pool.set("strCdsIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//证件号
        	//本利合计（金额）
        	top.pool.set("strPrinIntAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/prinIntAmt"));
        	//存单是否到期
        	top.pool.set("strDeptexp",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/dept_exp"));
        	//存单本金
        	top.pool.set("strAcctBalance",top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));	
        	//开单网点
        	top.pool.set("strOpenBranchNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openBranchNo"));
    	}
		new top.CheckCard().icCheckAfterTrans("","top.MainFrame.queryCDInfoNoPinSucess");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onQueryCDFailed) == "function")
      {
        top.MainFrame.onQueryCDFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*点按钮协助*/
  this.send910304ExAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strPriority","1");//优先级
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910304ExComplete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910304ExComplete = function(iRet)
  {
    
  } 
  /*换卡协助*/
  this.sendExchange910304Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strPriority","1");//优先级】
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncExchange910304Complete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncExchange910304Complete = function(iRet)
  {
    
  }
  /*黑名单推送PAD*/
  this.send910304BalckListAsync = function(businessName)
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strPriority","1");//优先级
	if(businessName!=null){
		reqMsg.appendNode("strbusinessName",businessName);
	}else{
		reqMsg.appendNode("strbusinessName",top.langcur.oCheckCardSendPadTip);
	}
	
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910304BlackListComplete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910304BlackListComplete = function(iRet)
  {
    //只推送，不做任何处理
  }
  /*存单交易失败：呼叫大堂经理*/
  this.send910304CDSFailedAsync = function()
  {
	 var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strPriority","1");//优先级
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910304CDSFailedComplete);    
  }
    /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910304CDSFailedComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("PAD协助返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//跳转至存单失败页面
	if (typeof(top.MainFrame.onShowTellCDSFailed) == "function"){
		top.MainFrame.onShowTellCDSFailed();
	}
  } 
  
  /*存单验真伪：呼叫柜员协助*/
  this.send910304Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strPriority","1");//优先级
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910304Complete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910304Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strReqSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/assistSerialNo"));
	if (iRet == top.RESULT_SUCCESSFUL)
    {
	   //进行协助结果查询
	   isCheckHelpingMore = true;	   
	   top.serviceCtrl.startFlowCtrlTimeout(top.trans.send910305Async, 5 * 1000);
    }
    else
    {
	  isCheckHelpingMore = false;
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("协助失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /*协助结果查询*/
  this.send910305Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910305");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strReqSerialNo"));//原审核流水号
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strOrgTsns",top.pool.get("strReqSerialNo"));//S端查询使用
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910305Complete);  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910305Complete = function(iRet)
  {
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		isCheckHelpingMore = false;	
		//协助
		var strCheckStatus =  top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/dealResult");
		if(strCheckStatus == "S"){
			if (typeof(top.MainFrame.onCheckHelpingSuccessful) == "function"){
				top.MainFrame.onCheckHelpingSuccessful();
			}
		}else{	
			if (typeof(top.MainFrame.onServiceFailed) == "function"){
				top.MainFrame.onServiceFailed("大堂经理协助失败","FFFF","大堂经理协助失败");
			}
		}		
    }
    else
    {
		//是否进行多次协助结果查询
		if(isCheckHelpingMore){
			top.serviceCtrl.startFlowCtrlTimeout(top.trans.send910305Async, 5 * 1000);
		}	
    }		  
  }
  
  /*代理人交易-代理人身份信息登记*/
  this.send901112Async = function(){
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901112");    //交易编码，需要和配置文件对应	
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //代理人身份证
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //代理人姓名		
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数	
	reqMsg.appendNode("strIdEndDate",top.pool.get("strIDEnd"));//证件到期日
    reqMsg.appendNode("strIdIssureArea",top.pool.get("strIDGrantDept"));//证件颁发地
	reqMsg.appendNode("strOption",top.pool.get("strOption"));//选项
	reqMsg.appendNode("strPhone",top.pool.get("strAgentPhone"));//代理人电话
	reqMsg.appendNode("strAgentTransCode",top.pool.get("strAgentTransCode"));//代理交易类型
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strAgentSerialNo"));//原交易流水号
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901112Complete);   
  }
     /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901112Complete = function(iRet)
  {
	 // 记录终端流水
    var strJrn = new top.StringCtrl("代理人身份信息登记  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateAgentSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onUpdateAgentSuccessful) == "function"){
      	top.MainFrame.onUpdateAgentSuccessful();
    	}	
    }    
  }
  
  
  /*存单配存单*/
  this.send905107Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905107");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCdsAccount", top.pool.get("strCdsAccount")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //加密数据	
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //金额	
	reqMsg.appendNode("strCDCertNum", top.pool.get("strCDCertNum"));//存单凭证号
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数	
	reqMsg.appendNode("strIssueReason","1");//签发原因（1：新存单）	
		
	reqMsg.appendNode("strProductSubType",top.trans.convertType(top.pool.get("CDtime"),""));//产品子类
	if(top.pool.get("isAgent") == "1"){
		//存款人
		reqMsg.appendNode("strAuthName",top.pool.get("strAgentIDName"));
		reqMsg.appendNode("strAuthNum",top.pool.get("strAgentIDCardNum"));
		//代理人
		reqMsg.appendNode("strAgentName",top.pool.get("strIDName"));
		reqMsg.appendNode("strAgentNum",top.pool.get("strIDCardNum"));
		reqMsg.appendNode("isAgent","1");
		reqMsg.appendNode("strCustomerId",top.pool.get("strAgentCustomId"));//存单开户客户号
	}else{
		//存款人
		reqMsg.appendNode("strAuthName",top.pool.get("strIDName"));
		reqMsg.appendNode("strAuthNum",top.pool.get("strIDCardNum"));
		reqMsg.appendNode("strCustomerId",top.pool.get("strCdsTransId"));//存单开户客户号
	}
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); //存单类型  1:开户  2：销户  3：续存  4：部提
	reqMsg.appendNode("strRate",top.pool.get("strRate")); //利率
	reqMsg.appendNode("strInterest",top.pool.get("strInterest")); //利息
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905107Complete); 	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync905107Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("配单返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
	top.pool.set("strOrigstrTxSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {         
	  top.pool.set("strCipherValue",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cipherValue"));	
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.makeCdsSucess");//IC卡交易后写卡处理
    }
    else
    {
	  //配单失败
      if (typeof(top.MainFrame.makeCdsFailed) == "function")
      {
        top.MainFrame.makeCdsFailed(top.langcur.oCDSOpenFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*向服务器发送重置密码（存单）*/
  this.send902502CDSAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902502");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //加密数据
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //姓名
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //身份证号
	reqMsg.appendNode("strVoucherType", "2001");//凭证种类
	reqMsg.appendNode("strVoucherNo",top.pool.get("strCDCertNum"));//凭证号
	reqMsg.appendNode("DestPan",top.pool.get("strCDSNum"));//存单账号

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902502CDSComplete);
  }
 /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902502CDSComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("重置交易密码返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  top.pool.set("strPinBlock",top.pool.get("PinBlock2"));
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.reSetPWDSuccess");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oResetCDPasswordFail, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*审核交易-柜员指纹授权*/
  this.send910206Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910206");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strTellerum", top.pool.get("strTellerum")); //柜员号
	reqMsg.appendNode("strFeatureData", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("strFeatureData")))); //指纹数据		
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910206Complete); 
	  
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910206Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("柜员指纹授权  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.checkFingerSucess");//IC卡交易后写卡处理	
    }
    else
    {
      if(top.pool.get("isFingerMore") == "true"){
      	 if (typeof(top.MainFrame.onFingerCheckFailed) == "function")
	      {
	        top.MainFrame.onFingerCheckFailed("指纹授权失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	      }	
      }else{
	      if (typeof(top.MainFrame.onServiceFailed) == "function")
	      {
	        top.MainFrame.onServiceFailed("指纹授权失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	      }
      }
    }
  } 
  
  /*向服务器发送存单信息查询交易请求*/
  this.sendDepositQueryAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "DepositQuery");    
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
    reqMsg.appendNode("strOldTransCode",top.pool.get("strOldTransCode"));//原交易码
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncDepositQueryComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncDepositQueryComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("存单信息查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  //存单开户信息
	  top.pool.set("cdsTranslogInfoStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsTranslogInfoStr"));
	  //转账信息
	  top.pool.set("cdsTransQueryStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsTransQueryStr"));
	  //内部账存款
	  top.pool.set("cdsCashTransQueryStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsCashTransQueryStr"));	  
      if (typeof(top.MainFrame.depositQuerySucess) == "function")
      top.MainFrame.depositQuerySucess();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, "存单信息查询失败");
      }
    }
  }	
   /*向服务器发送续存交易开户、销户、转账信息查询交易请求*/
  this.sendRenewQueryAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "RenewQuery");    
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
    reqMsg.appendNode("strOldTransCode",top.pool.get("strOldTransCode"));//原交易码
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncRenewQueryComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncRenewQueryComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("续存信息查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  //续存开户信息
	  top.pool.set("cdsOpenInfoStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsOpenInfoStr"));
	  //续存销户信息
	  top.pool.set("cdsCanInfoStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsCanInfoStr"));	  
	  //续存转入内部账信息
	  top.pool.set("cdsTransStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsTransStr"));
	  //续存内部账存款
	  top.pool.set("cdsCashTransStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsCashTransStr"));
      if (typeof(top.MainFrame.reNewQuerySucess) == "function")
      top.MainFrame.reNewQuerySucess();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_IMAGEFILE_FAILED, "存单续存信息查询失败");
      }
    }
  }	
  
  /*向服务器客户信息查询-本行转账前查询请求*/
  this.send903110Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903110");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("DestPan")); //账号
	reqMsg.appendNode("strTransAmount", top.pool.get("strTransAmount")); //交易金额
	reqMsg.appendNode("strTransRandom", top.pool.get("strTransRandom")); //随机数--业务批次号

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903110Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync903110Complete= function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("本行转账前查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doConfirmFee");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBHFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  
   /*向服务器发送查询手续费试算请求*/
  this.send903211Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903211"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strTransAmount", top.pool.get("Amount")); //金额
	reqMsg.appendNode("strPayeeAcctNo", top.pool.get("DestPan")); //收款单位账号
	reqMsg.appendNode("strTemporality", top.pool.get("radioValue")); //时效性
	reqMsg.appendNode("strRecvBankType", top.pool.get("strRecvBankType")); //接收行行号所属系统
	reqMsg.appendNode("strRecvBankNo", top.pool.get("transferCon")); //接受行行号
	reqMsg.appendNode("strPayerOpenBankNo", top.pool.get("strPayerOpenBankNo")); //付款人开户行号
	/* alert("金额--" + top.pool.get("Amount") 
				   + "收款单位账号--" + top.pool.get("DestPan") 
				   + "时效性--" + top.pool.get("radioValue") 
				   + "接收行行号所属系统--" + top.pool.get("strRecvBankType") 
				   + "接受行行号--" + top.pool.get("transferCon") 
				   + "付款人开户行号--" + top.pool.get("strPayerOpenBankNo")); */
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903211Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync903211Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("手续费试算查询交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doConfirmFee");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oKHTransFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 

    /*向服务器发送转出卡开户行号转网点号查询请求-跨行转账*/
  this.sendGetBranchMapNo903211 = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryBranchMapNo");
	reqMsg.appendNode("strLocalRouteCode", top.pool.get("strPayerOpenBankNo")); //跨行转账-付款卡开户行行号
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncGetBranchMapNoComplete);
  } 
 
  this.onAsyncGetBranchMapNoComplete= function(iRet){
	top.pool.set("BranchMapNoList", "");
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var num = top.exchxmlasync.msgxmldomResp.selectNodesCount("/TransMsg/BM/ITEM");
		//alert("num--" + num);
		var BranchMapNo = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/BM/ITEM["+1+"]/strLocalBankCode");
		//alert("BranchMapNoList--" + BranchMapNo);
		if(num > 0){
			top.pool.set("BranchMapNoList",BranchMapNo);
		}else{
			top.pool.set("BranchMapNoList","322290000011");
		}
        
		//alert("网点号--" + top.pool.get("BranchMapNoList"));
		top.trans.send903201Async();
    }
    else
    {
         if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed(top.langcur.oKHTransFailed, "", "跨行转账失败");
		}
    }  
  }
  
  /*向服务器发送跨行转账请求*/
  this.send903201Async = function()
  {
    new top.CheckCard().icCheckBeforeTrans("40",top.pool.get("Amount"));//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903201"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //金额
	reqMsg.appendNode("strFee", top.pool.get("strFee")); //账号
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //机具编号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //转出账号		
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("strPan", top.pool.get("hostAccount")); //账号
		reqMsg.appendNode("strPayerCustName", top.pool.get("strRespIDName")); //付款人名称
	}else{
		reqMsg.appendNode("strPayerCustName", top.pool.get("PayerCustName")); //付款人名称
		reqMsg.appendNode("strTransPan", top.pool.get("strPan")); //转出账号
	}
	reqMsg.appendNode("strDestPan", top.pool.get("DestPan")); //收款人账号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strCollectFeeMode", top.pool.get("strCollectFeeMode"));  //扣款方式
	reqMsg.appendNode("strPayChannelCode", top.pool.get("strRecvBankType")); //对方行行号所属系统-汇路代码
	reqMsg.appendNode("strPayeeBankNo", top.pool.get("transferCon")); //收款行行号
	reqMsg.appendNode("strPayeeAcctName", top.pool.get("PayeeAcctName")); //收款人名称
	reqMsg.appendNode("strPayeeOpenBankNo", top.pool.get("transferpayeeOpenBankNo")); //收款人开户行号
	reqMsg.appendNode("strPayerOpenBankNo", top.pool.get("BranchMapNoList")); //付款人开户行号	
	reqMsg.appendNode("strTransUse", top.pool.get("transUseSelect"));//资金用途
	reqMsg.appendNode("strOpenBankNo", top.pool.get("strPayerOpenBankNo")); //付款人开户行号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903201Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync903201Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("跨行转账交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oKHTransFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*电子现金解锁交易*/
  this.send902601Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902601"); 
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strIDName", top.pool.get("strRespIDName"));  //用户名
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据

	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902601Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902601Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("电子现金解锁交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.unLockPWDSuccess");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oLoadFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*新余额查询-账户信息查询*/
  this.send902117Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902117"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902117Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902117Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("余额查询交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*可挂失卡查询请求*/
  this.send901118Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901118"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));      //客户号	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //终端号
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //身份证号
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901118Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901118Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("可挂失卡查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqCardLossSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("可挂失卡查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*可挂失存单折查询请求*/
  this.send901119Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901119"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));     //客户号	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //终端号
	reqMsg.appendNode("strLossType", top.pool.get("strLossType"));    //存单折标示
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901119Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901119Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("可挂失存单折查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqVoucherLossSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("可挂失存单折查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*无卡验密查询请求*/
  this.send901612Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901612"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));              //卡号	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //终端号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));    //加密数据
	reqMsg.appendNode("strLossDestPan", top.pool.get("strLossDestPan"));    //存单折账号
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901612Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901612Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("无卡验密查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("strBalance", top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onVerifyServiceSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
		var respCode901612 = top.exchxmlasync.strTermRetCode;
		if (typeof(top.MainFrame.onServiceSecondFailedGH) == "function" && respCode901612 == "2055")
		{
			top.MainFrame.onServiceSecondFailedGH();
		}else if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("验密查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  
  /*解挂列表查询*/
  this.send901120Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901120"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo")); 
	reqMsg.appendNode("strUnLockType", top.pool.get("strUnLockType")); 
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901120Complete);
  }
    /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901120Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("解挂凭证列表"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);	
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.SelectSubCount");//IC卡交易后写卡处理	
    }
    else
    {
		if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("解挂列表查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  /*解挂卡*/
  this.send902405Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902405"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));              //卡号	
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	reqMsg.appendNode("strSortFlag", top.pool.get("strSortFlag")); //挂失标志	
	if(top.pool.get("isCardLock") =="1"){
		reqMsg.appendNode("strUnlockFlag", "Y"); //锁定标志
	}else{
		reqMsg.appendNode("strUnlockFlag","N"); //锁定标志	
	}
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902405Complete);
  }
    /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902405Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("卡解挂"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);	
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCardServiceSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
		if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("卡解挂失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  
    /*解挂存单/存折*/
  this.send902406Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902406"); 
	reqMsg.appendNode("strDestPan", top.pool.get("DestPan"));     //介质号	
	reqMsg.appendNode("strSortFlag", top.pool.get("strSortFlag")); //挂失标志
	reqMsg.appendNode("strLossVoucherType", top.pool.get("strLossCertType")); //重空类型
	reqMsg.appendNode("strVoucherNo", top.pool.get("strVoucherNo")); //凭证号码		
	reqMsg.appendNode("strRegisterLossType", top.pool.get("strRegisterLossType"));	//挂失类型
	reqMsg.appendNode("strRegisterLossDate", top.pool.get("strRegisterLossDate"));	//挂失日期
	reqMsg.appendNode("strRegisterLossSerialNo", top.pool.get("strRegisterLossSerialNo"));	//挂失流水号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902405Complete);
  }
    /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902405Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("卡解挂"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);	
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCardServiceSuccessful");//IC卡交易后写卡处理	
    }
    else
    {
		if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("卡解挂失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  /*工本费手续费查询请求*/
  this.send901117Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901117"); 
	reqMsg.appendNode("strPan", top.pool.get("strFeeNum"));            //卡号	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //终端号
	reqMsg.appendNode("strAmtFeeFlag", top.pool.get("strAmtFeeFlag")); //查询类型
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901117Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901117Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("工本费手续费查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    top.pool.set("strCostFee", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/costFee"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	//手续费回调
    	if(top.pool.get("isInqFee") == "1") {
    		top.pool.set("isInqFee", "");
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqFeeSuccessful");//IC卡交易后写卡处理	
    	}
    	//工本费回调
    	else {
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqPriceSuccessful");//IC卡交易后写卡处理	
    	}
    }
    else
    {
      top.pool.set("isInqFee", "");
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("工本费手续费查询", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  

  //判断手机号是否签约过
this.send908215Async = function()
{
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
  var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
  reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "908215"); 
	reqMsg.appendNode("strMobile", top.pool.get("strCheckPhone"));       //手机号
	var strCheckTransTypeNum = top.pool.get("strCheckTransTypeNum");
	if(strCheckTransTypeNum == "1"){
		reqMsg.appendNode("strChannelFlag", "04"); //交易类型
	}else if(strCheckTransTypeNum == "2"){
		reqMsg.appendNode("strChannelFlag", "02"); //交易类型
	}else if(strCheckTransTypeNum == "3"){
		reqMsg.appendNode("strChannelFlag", "04"); //交易类型
	}
  top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908215Complete);
}

//与WEB服务器进行异步交互完成时的回调函数
this.onAsync908215Complete = function(iRet)
{
  // 记录终端流水
  var strJrn = new top.StringCtrl("签约手机号908215"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
  "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
  top.journalPrinter.addJournal(strJrn);
	var channelFlagList = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F59/item");
  var strCheckTransTypeNum = top.pool.get("strCheckTransTypeNum");
  if (iRet == top.RESULT_SUCCESSFUL) {
		if(strCheckTransTypeNum == "1" && channelFlagList != null && channelFlagList != ""){
			top.pool.set("messageline","该手机号已注册手机银行,请重新输入");
		}else if(strCheckTransTypeNum == "2" && channelFlagList != null && channelFlagList != ""){
			top.pool.set("messageline","该手机号已注册网上银行,请重新输入");
		}else if(strCheckTransTypeNum == "3" && channelFlagList != null && channelFlagList != ""){
			top.pool.set("havaContract",true);
			top.trans.send908215AgainAsync();
			return;
		}
  }else {
		var strJrn = "错误码"+top.exchxmlasync.strTermRetCode+";"+"错误描述"+top.exchxmlasync.strTermRetDesc;
		top.journalPrinter.addJournal(strJrn);
		var AnswerBackCode = top.exchxmlasync.msgxmldomResp.getElementValue("F39");
		if(AnswerBackCode == "M00427"){
			if(strCheckTransTypeNum == "3"){
				top.pool.set("havaContract",false);
				top.trans.send908215AgainAsync();
				return;
			}else{
				top.trans.send908301Async();
				return;
			}
		}else{
			top.pool.set("messageline",top.exchxmlasync.strTermRetDesc);
		}
  }
  if (typeof(top.MainFrame.sends908215Complete) == "function")
  {
      top.MainFrame.sends908215Complete();
  }
}

  //判断手机号是否签约过
this.send908215AgainAsync = function()
{
  new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
  var exch = new ExchangeXmlWithHost();
  var reqMsg = new ColsMsgXmlText();
  reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
  reqMsg.appendNode("strTransCode", "908215"); 
  reqMsg.appendNode("strMobile", top.pool.get("strCheckPhone"));       //手机号
  reqMsg.appendNode("strChannelFlag", "02"); //交易类型
	
  top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908215AgainComplete);
}

 //与WEB服务器进行异步交互完成时的回调函数
this.onAsync908215AgainComplete = function(iRet)
{
  // 记录终端流水
  var strJrn = new top.StringCtrl("签约手机号908215"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
  "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
  top.journalPrinter.addJournal(strJrn);
  var channelFlagList = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F59/item");
  if (iRet == top.RESULT_SUCCESSFUL) {
		 if(channelFlagList != null && channelFlagList != ""){
			 if(top.pool.get("havaContract")){
				 top.pool.set("messageline","该手机号既注册手机银行又注册网上银行,请重新输入");
			 }else{
				 top.pool.set("messageline","该手机号已注册网上银行,请重新输入");
			 }
		}
  }else {
		var strJrn = "错误码"+top.exchxmlasync.strTermRetCode+";"+"错误描述"+top.exchxmlasync.strTermRetDesc;
		top.journalPrinter.addJournal(strJrn);
		var AnswerBackCode = top.exchxmlasync.msgxmldomResp.getElementValue("F39");
		if(AnswerBackCode == "M00427"){
			if(top.pool.get("havaContract")){
				top.pool.set("messageline","该手机号已注册手机银行,请重新输入");
			}else{
				top.trans.send908301Async();
				return;
			}
		}else{
			top.pool.set("messageline",top.exchxmlasync.strTermRetDesc);
		}
  }
  if (typeof(top.MainFrame.sends908215Complete) == "function")
  {
      top.MainFrame.sends908215Complete();
  }
}

  
  /*短信验证码交易请求*/
  this.send908301Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "908301"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                   //卡号	
	reqMsg.appendNode("strPhoneNum", top.pool.get("strCheckPhone"));       //手机号
	reqMsg.appendNode("strCheckTrans", top.pool.get("strCheckTransType")); //交易类型
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908301Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync908301Complete = function(iRet)
  {
	top.pool.set("strMessageCode", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/verifyCode"));
    // 记录终端流水
    var strJrn = new top.StringCtrl("短信验证码908301"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine+
    "短信验证码: " + top.pool.get("strMessageCode") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL) {
    	top.pool.set("messageFlag", "1");
    }else {
    	top.pool.set("messageFlag", "2");
    }
  }
  
  /*借记卡挂失请求*/
  this.send902401Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902401"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));     //客户号	
	reqMsg.appendNode("strPan", top.pool.get("strPan"));              //卡号	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //终端号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));    //加密数据
	reqMsg.appendNode("strAmtFee", top.pool.get("strAmtFee"));        //手续费
	reqMsg.appendNode("strTranFlag", top.pool.get("strFillFlag"));    //是否补卡标示
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //身份证号
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));        //姓名
	reqMsg.appendNode("strRefNum", top.pool.get("refNum"));           //手机号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902401Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902401Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("借记卡挂失"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onReportLossSuccess");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("借记卡挂失失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*存单折挂失请求*/
  this.send902402Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902402"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));        //客户号	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);    //终端号
	reqMsg.appendNode("strDestPan", top.pool.get("strAcctNo"));          //主账号
	reqMsg.appendNode("strStartNo", top.pool.get("strVoucherNo"));       //起始号码	
	reqMsg.appendNode("strVoucherType", top.pool.get("strVoucherType")); //凭证类型
	reqMsg.appendNode("strEndNum", top.pool.get("strVoucherNo"));        //终止号码
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));     //身份证号
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));           //姓名
	reqMsg.appendNode("strRefNum", top.pool.get("refNum"));              //手机号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902402Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync902402Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("存单折挂失"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onReportLossSuccess");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("挂失交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*借记卡补卡请求*/
  this.send901301Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901301"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));       //客户号	
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                //卡号	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);   //终端号
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2"));        //加密数据
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));    //身份证号
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));          //姓名
	reqMsg.appendNode("strReportType", top.pool.get("isPassword"));     //挂失类型
	reqMsg.appendNode("strCardProduct", top.pool.get("strCardFlag"));   //卡类型
	reqMsg.appendNode("strRetainCardNoFlag", top.pool.get("isKeeped")); //是否保号
	reqMsg.appendNode("strOldCardNo", top.pool.get("strLossPan"));      //原卡号
	reqMsg.appendNode("strCardType", top.pool.get("cardProduct"));      //卡产品
	if(top.pool.get("productType").indexOf("敬老卡") != -1){
		reqMsg.appendNode("strPostAddress", top.pool.get("postalAddress")); 
		reqMsg.appendNode("strPostCode", top.pool.get("postalCode")); 
		reqMsg.appendNode("strOrderStatus", "1"); 
		reqMsg.appendNode("strContractPhone", top.pool.get("telephone")); 
		reqMsg.appendNode("strCostFee", 0);      //工本费
	}else{
		reqMsg.appendNode("strCostFee", top.pool.get("strCardPrice"));      //工本费
	}
	reqMsg.appendNode("strPindata", top.pool.get("PinBlock4"));         //查询密码
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901301Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901301Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("借记卡补卡"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    top.pool.set("strFillCardId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    top.pool.set("strCardBranchName", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchName")); //领卡机构
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onFillCardSuccess");//IC卡交易后写卡处理	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onFillCardFailed("借记卡补卡失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*向服务器发送小额支付限额查询*/
  this.send901713Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901713"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));  //卡号
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //机具编号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strTerminalTsn", top.pool.get("strTerminalTsn"));	//系统跟踪号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strSingleBusinessNum", top.pool.get("strSingleBusinessNum"));	//业务批次号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901713Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901713Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("小额支付限额修改交易901713"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    	{
    	    //交易成功获取返回数据
        	top.pool.set("transLimitAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/dayTransLimitAmt"));//单笔最大限额
        	top.pool.set("dayTransLimitAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/transLimitAmt"));//每日最大限额
        	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSignInfo");//IC卡交易后写卡处理	
    	}
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("小额支付限额查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器发送小额免密限额修改*/
  this.send901708Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901708"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));//客户号
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //机具编号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strPan", top.pool.get("strPan"));  //卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strTrfLimitAmount", top.pool.get("transLimitAmt"));//单笔最大限额
	reqMsg.appendNode("strDayLimitAmount", top.pool.get("dayTransLimitAmt"));//当日交易累计限额
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901708Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901708Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("小额免密限额修改交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("小额限额修改失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*借记卡换卡请求*/
  this.send901401Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901401"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));       //客户号	
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                //卡号	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);   //终端号
	reqMsg.appendNode("strPinBlock", top.pool.get("strExchangeOldPin"));        //旧卡密码数据
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));    //身份证号
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));          //姓名
	reqMsg.appendNode("strCardProduct", top.pool.get("strCardFlag"));   //卡类型
	reqMsg.appendNode("strRetainCardNoFlag", top.pool.get("isKeeped")); //是否保号
	reqMsg.appendNode("strOldCardNo", top.pool.get("strExchangeOldPan"));      //原卡号
	reqMsg.appendNode("strCostFee", top.pool.get("strCardPrice"));      //工本费
	reqMsg.appendNode("strTranspwd", top.pool.get("PinBlock2"));      //新卡交易密码
	reqMsg.appendNode("strQuerypwd", top.pool.get("PinBlock4"));      //新卡查询密码
	reqMsg.appendNode("strOldCardSeqId", top.pool.get("strOldCardSeqId"));      //旧卡卡序列号
	reqMsg.appendNode("strOldCardAmt", top.pool.get("strExchangeAmt"));      //旧卡电子现金余额
	if(top.pool.get("strCardFlag") == "1"){
		top.pool.set("isNeedReverse","1");	
		top.pool.set("Amount",new top.StringCtrl("").formatStrAmount(top.pool.get("strExchangeAmt")));        //冲正金额						
		reqMsg.appendNode("strCardType", top.pool.get("cardProduct")); //卡产品
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901401Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901401Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("借记卡换卡"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    //换卡流水号
    top.pool.set("exchangeCardSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));    
    top.pool.set("strOpenTsn", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    //冲正交易90域 = 交易类型+交易码+原交易流水号
	var strOrgTsns = "0010901401"+ top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
       top.pool.set("isExchangeSucc","true");
       top.pool.set("isNeedReverse","");
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onExchangeCardSuccess");//IC卡交易后写卡处理	
    }
    else if(iRet == top.RESULT_FAILED)
    {
      if(top.pool.get("isNeedReverse") == "1" && top.pool.get("strCardFlag") == "1" 
    	  && top.pool.get("strOldCardICFlag") == "1"){
        	top.pool.set("isNeedReverse","");
        	top.pool.set("strOldCardICFlag","");
    		//交易结果不确认发起冲正
    		top.wins.showNewProcessingTip(top.langcur.oProcessingTipDef);
    		top.trans.send900002Async();
      }
      if (typeof(top.MainFrame.onExchangeCardFailed) == "function")
      {
        top.MainFrame.onExchangeCardFailed("借记卡换卡失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }else{
    	//预制卡交易结果不确定时进行冲正
    	if(top.pool.get("isNeedReverse") == "1" && top.pool.get("strCardFlag") == "1"
    		&& top.pool.get("strOldCardICFlag") == "1"){
        	top.pool.set("isNeedReverse","");
        	top.pool.set("strOldCardICFlag","");
    		//交易结果不确认发起冲正
    		top.wins.showNewProcessingTip(top.langcur.oProcessingTipDef);
    		top.trans.send900002Async();
    	}
		top.MainFrame.onExchangeCardFailed("借记卡换卡失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}
  }
  
  //社保卡申领功能-社区网点信息查询
  this.send901122Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901122");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //终端号
	reqMsg.appendNode("strBANK_NO", top.terminal.strOrgNum);
	reqMsg.appendNode("strCountyCode", top.pool.get("sendAddressArea"));  //所属区县
	reqMsg.appendNode("strOperType", "4");  //分页操作
	reqMsg.appendNode("strCurrPage", top.pool.get("CurrPage"));  //当前页码
	reqMsg.appendNode("strPageNum", "20");  //每页记录数
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901122Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901122Complete = function(iRet)
  {
   // 记录终端流水
    var strJrn = new top.StringCtrl("社保网点信息查询交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if (typeof(top.MainFrame.onSearchBrnoCodeSuccessful) == "function")
        {
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSearchBrnoCodeSuccessful");//IC卡交易后写卡处理	
        }
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("社保网点查询交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  //社保卡申领功能-社区网点信息查询
  this.send901122SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901122");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //终端号
	reqMsg.appendNode("strBANK_NO", top.terminal.strOrgNum);
	reqMsg.appendNode("strCountyCode", top.pool.get("sendAddressArea"));  //所属区县
	reqMsg.appendNode("strOperType", "4");  //分页操作
	reqMsg.appendNode("strCurrPage", top.pool.get("CurrPage"));  //当前页码
	reqMsg.appendNode("strPageNum", "20");  //每页记录数
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901122SecondComplete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901122SecondComplete = function(iRet)
  {
   // 记录终端流水
    var strJrn = new top.StringCtrl("社保网点信息查询交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if (typeof(top.MainFrame.onSearchBrnoCodeSuccessful) == "function")
        {
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSearchBrnoCodeSuccessful");//IC卡交易后写卡处理	
        }
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("社保网点查询交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  //社保卡申领功能-卡中心核验
  this.send901121Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901121");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //终端号
	reqMsg.appendNode("strIDCardType", top.pool.get("strIDCardNum"));  //证件号码
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //姓名
	reqMsg.appendNode("strIDType", "01");  //证件类型
	reqMsg.appendNode("strNationality", "CHN");  //国籍
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901121Complete);
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901121Complete = function(iRet)
  {
	// 记录终端流水
    var strJrn = new top.StringCtrl("社保卡是否可申领交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("applyFlag", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/applyFlag")); //可申领标识
    top.pool.set("imageFlag", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/imageFlag")); //是否有照片标识
    top.pool.set("checkCode", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/checkCode")); //校验通过码
    if(top.pool.get("imageFlag") == "1"){
    	top.pool.set("strImageNum","0");
    }
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if (typeof(top.MainFrame.onCardMessageSuccessful) == "function")
        {
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCardMessageSuccessful");//IC卡交易后写卡处理	
        }
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("社保卡是否可申领交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  //社保卡申领功能-个人申领
  this.send901123Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901123");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //终端号
	reqMsg.appendNode("strApplyCounty", top.pool.get("sendAddressArea"));  //申领区县
	reqMsg.appendNode("strIDType", "01");  //证件类型
	reqMsg.appendNode("strCheckCode", top.pool.get("checkCode"));  //校验验证码
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //姓名
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //证件号码
	reqMsg.appendNode("strBirthDay", top.pool.get("strIDBorn"));  //出生日期
	reqMsg.appendNode("strNationality", "CHN");  //国籍
	reqMsg.appendNode("strNation", top.pool.get("strIDNationChina"));  //民族
	reqMsg.appendNode("strJob", top.pool.get("professional"));  //职业
	reqMsg.appendNode("strStartDate", top.pool.get("strIDBegin"));  //证件起始日期
	reqMsg.appendNode("strRendDate", top.pool.get("strIDEnd"));  //证件截止日期
	reqMsg.appendNode("strMobilePhone", top.pool.get("phoneNumVal"));  //手机号码
	reqMsg.appendNode("strTelPhone", top.pool.get("telePhoneNumVal")); 
	reqMsg.appendNode("strAddress", top.pool.get("sendAddress"));  //通讯地址
	reqMsg.appendNode("strZipCode", top.pool.get("psotCodeVal"));  //通讯地址邮编
	reqMsg.appendNode("strDeliveryAddress", top.pool.get("sendAddress"));  //指定投递地址
	reqMsg.appendNode("strdeliveryZipCode", top.pool.get("psotCodeVal"));  //指定投递地址邮编
	reqMsg.appendNode("strReselfBrnoCode", top.pool.get("countryMessageval"));  //备选自领社区网点代码
	 if(null != top.pool.get("strIDSex") && top.pool.get("strIDSex") == "男") {
		 reqMsg.appendNode("strSex", "1");  //性别
	   }else if(null != top.pool.get("strIDSex") && top.pool.get("strIDSex") == "女") {
		   reqMsg.appendNode("strSex", "2");  //性别
	   }else {
		   reqMsg.appendNode("strSex", "9");  //性别
	   }
	if(top.pool.get("strImageNum") == "0"){
		reqMsg.appendNode("strImageSource", "1");  //照片来源
		reqMsg.appendNode("strImageName", "");
		reqMsg.appendNode("strImageFlag", "1");
	}else{
		reqMsg.appendNode("strImageSource", "3");  //照片来源
		reqMsg.appendNode("strImageFlag", "0");
		reqMsg.appendNode("strImageName", top.pool.get("fileName"));
	}
	reqMsg.appendNode("strBANK_NO", top.terminal.strOrgNum);
	
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901123Complete);
  }

   //与WEB服务器进行异步交互完成时的回调函数
  this.onAsync901123Complete = function(iRet)
  {
   // 记录终端流水
    var strJrn = new top.StringCtrl("社保卡申领交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if (typeof(top.MainFrame.onCardMessageSuccessful) == "function")
        {
    		 
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理	
        }
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("社保卡申领交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

    /*微信证件信息查询*/
  this.send910209Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910209");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId"));
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910209Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910209Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("微信证件信息查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
   
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if (typeof(top.MainFrame.onWeChatSuccessful) == "function"){
    		 var wechatPhotoUrl = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/wechatPhotoUrl");
    		 var fileName = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/fileName");
    		 top.pool.set("wechatPhotoUrl",wechatPhotoUrl);
    		 top.pool.set("fileName",fileName);
    		 new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onWeChatSuccessful");//IC卡交易后写卡处理		
    	}
    }
    else
    {
      if (typeof(top.MainFrame.onSendPicSuccessful) == "function")
      {
    	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSendPicSuccessful");//IC卡交易后写卡处理		
      }
    }
  }
 
/*排队查询*/
  this.send912104Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "912104");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strDeviceType",top.terminal.getDeviceType());
	top.journalPrinter.addJournalWithTime("发送排队查询交易");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync912104Complete);  

  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync912104Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("排队查询交易  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//成功代表有号，失败代表无号
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
	      if (typeof(top.MainFrame.onHaveCallingNum) == "function")
	      {
	    	  top.MainFrame.onHaveCallingNum();
	      }
    }
    else
    {
		if (typeof(top.MainFrame.onAsync912104Faild) == "function")
	    {
			top.MainFrame.onAsync912104Faild();
	    }
		
    }		  
  }
   
  /*叫号*/
  this.send912109Async = function()
  {
	
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "912109");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strDeviceType",top.terminal.getDeviceType());
	reqMsg.appendNode("strCompleteBusNo",top.terminal.previousCallNumber);
	top.journalPrinter.addJournalWithTime("发送叫号交易");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync912109Complete);  

  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync912109Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("叫号交易  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		  top.pool.set("verifyCodeNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/verificationCode"));//校验码
		  top.terminal.currentCallNumber=top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/queueNo");//当前叫号号码
		  top.terminal.previousCallNumber=top.terminal.currentCallNumber;//为完成顺呼及过号顺呼准备数据
	      if (typeof(top.MainFrame.onUserCallingNumSuccessful) == "function")
	      {
	    	 top.MainFrame.onUserCallingNumSuccessful();
	      }
    }
    else
    {
		if (typeof(top.MainFrame.on912109Failed) == "function")
	    {
			top.MainFrame.on912109Failed();//叫号排队状态查询。	
	    }
    }		  
  }
  
   /*跳号叫号*/
  this.send912108Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "912108");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strDeviceType",top.terminal.getDeviceType());
	reqMsg.appendNode("strCompleteBusNo",top.terminal.previousCallNumber);
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync912108Complete);  

  }
  
  /*与WEB服务器进行异步交互完成时的回调函数  返回处理同叫号912109 */
  this.onAsync912108Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("跳号叫号交易  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		  top.pool.set("verifyCodeNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/verificationCode"));//校验码
		  top.terminal.currentCallNumber=top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/queueNo");//当前叫号号码
		  top.terminal.previousCallNumber=top.terminal.currentCallNumber;//为完成顺呼及过号顺呼准备数据
	      if (typeof(top.MainFrame.onUserCallingNumSuccessful) == "function")
	      {
	    	 top.MainFrame.onUserCallingNumSuccessful();
	      }
    }
    else
    {
		if (typeof(top.MainFrame.on912109Failed) == "function")
	    {
			top.MainFrame.on912109Failed();//叫号排队状态查询。	
	    }
    }		  
  }
  
  
  /*重呼交易*/
  this.send912107Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "912107");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strDeviceType",top.terminal.getDeviceType());
	reqMsg.appendNode("strQueueNo",top.terminal.previousCallNumber);
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync912107Complete);  
	//this.onAsync912107Complete(0);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync912107Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("重呼交易  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//重呼交易返回后，开启第二次重呼
	if (typeof(top.MainFrame.onRepeatCallSuccess) == "function")
	{
		top.MainFrame.onRepeatCallSuccess();//叫号排队状态查询。	
	}
  }
  
  
  
  /*向服务器发送卡/折活期存款交易*/
  this.send909005Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909005"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));  //卡号	
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //金额
	reqMsg.appendNode("strAccount", top.pool.get("hostAccount"));  //主账号
	reqMsg.appendNode("strIDCardNum",top.pool.get("strRespIDNo")); //证件号码
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100元金额数量
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50元金额数量
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20元金额数量
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10元金额数量
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5元金额数量
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1元金额数量
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5角金额数量
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1角金额数量
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5分金额数量
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1分金额数量
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909005Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909005Complete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("活期存款909005 "+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strDepOrgTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onDepositFailed("卡/折活期存款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器发送卡/折活期存款确认交易*/
  this.send909006Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909006"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));  //卡号	
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //金额
	reqMsg.appendNode("strAccount", top.pool.get("hostAccount"));  //主账号
	reqMsg.appendNode("strIDCardNum",top.pool.get("strRespIDNo")); //证件号码
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100元金额数量
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50元金额数量
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20元金额数量
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10元金额数量
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5元金额数量
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1元金额数量
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5角金额数量
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1角金额数量
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5分金额数量
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1分金额数量
	reqMsg.appendNode("strOrgTsn", top.pool.get("strDepOrgTsn"));  //原存款交易流水号
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909006Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909006Complete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("卡/折活期存款确认909006 "+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("卡/折活期存款确认交易失败", top.exchxmlasync.strTermRetCode, top.pool.get("strDepFailDesc"));
      }
    }
  }
  /*对公存款前查询*/
  this.send909019Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909019");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPayeeAccount")); //收款人账号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909019Complete);
  }  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909019Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("对公存款前查询909019  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
      //收款人姓名
      top.pool.set("Payee_name",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctName"));
	  new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onInqSecDepAmountSuccess");//IC卡交易后写卡处理
    }
    else
    {
        if("P102" == top.exchxmlasync.strTermRetCode){
      	  top.MainFrame.onServiceFailed("对公存款前查询失败", top.exchxmlasync.strTermRetCode, "您的账户存在异常，请去柜面办理！");  
        }else{
      	  top.MainFrame.onServiceFailed("对公存款前查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);  
        }
    } 
  } 
  /*向服务器发送对公存款确认交易*/
  this.send909015Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909015"); 
	reqMsg.appendNode("strAccount", top.pool.get("strPayeeAccount"));  //收款人账号(F34)
	reqMsg.appendNode("strPayerName", top.pool.get("Pay_name"));  //解款人姓名
	reqMsg.appendNode("strPayerAcc", top.pool.get("Pay_number"));  //解款人账号
	reqMsg.appendNode("strPayeeAcc", top.pool.get("strPayeeAccount"));  //收款人账号(F103)
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //金额
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum")); //证件号码
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100元金额数量
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50元金额数量
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20元金额数量
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10元金额数量
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5元金额数量
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1元金额数量
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5角金额数量
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1角金额数量
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5分金额数量
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1分金额数量
	reqMsg.appendNode("strOrgTsn", top.pool.get("strDepOrgTsn"));  //原存款交易流水号
	reqMsg.appendNode("CashType", top.pool.get("CashType"));  //现金统计分析码2018-6-22版本增加
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909015Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909015Complete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("对公存款确认909015 "+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("对公存款确认交易失败", top.exchxmlasync.strTermRetCode, top.pool.get("strDepFailDesc"));
      }
    }
  }
  
  /*向服务器发送对公存款交易*/
  this.send909020Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909020"); 
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //金额
	reqMsg.appendNode("strAccount", top.pool.get("strPayeeAccount"));  //收款人账号
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum")); //证件号码
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100元金额数量
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50元金额数量
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20元金额数量
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10元金额数量
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5元金额数量
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1元金额数量
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5角金额数量
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1角金额数量
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5分金额数量
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1分金额数量
	reqMsg.appendNode("strPayerName", top.pool.get("Pay_name"));  //解款人名称
	reqMsg.appendNode("strPayeeAcc", top.pool.get("strPayeeAccount"));  //收款人账号
	reqMsg.appendNode("strPayerAcc", top.pool.get("Pay_number"));  //解款人账号
	reqMsg.appendNode("strUseWay", top.pool.get("UseWay"));  //用途
	reqMsg.appendNode("CashType", top.pool.get("CashType"));  //现金统计分析码2018-6-22版本增加
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909020Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909020Complete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("对公存款909020 "+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strDepOrgTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    	//测试对公存款确认交易接口
      	//top.MainFrame.onDepositFailed("对公存款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onDepositFailed("对公存款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器发送强存登记簿交易*/
  this.send909007Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909007");
	reqMsg.appendNode("strDepY100", top.pool.get("str100ForDep"));  //100元金额数量
	reqMsg.appendNode("strDepY50", top.pool.get("str50ForDep"));  //50元金额数量
	reqMsg.appendNode("strDepY20", top.pool.get("str20ForDep"));  //20元金额数量
	reqMsg.appendNode("strDepY10", top.pool.get("str10ForDep"));  //10元金额数量
	reqMsg.appendNode("strDepY5", top.pool.get("str5ForDept"));  //5元金额数量
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1元金额数量
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5角金额数量
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1角金额数量
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5分金额数量
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1分金额数量
	reqMsg.appendNode("strGzNo", top.pool.get("strGzNo"));  //冠字号
	reqMsg.appendNode("strAuthtellerId", top.pool.get("strAuthtellerId"));  //审核柜员号
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909007Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909007Complete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("强存登记簿909007 "+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onForceDepositSuccessful");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onForceDepositFailed("强存登记簿交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

      /*向服务器发送取款交易*/
  this.send909002Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909002"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //机具编号
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                //卡号	
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strDestPan", top.pool.get("hostAccount"));  //主账号
	reqMsg.appendNode("strIDCardNum", top.pool.get("strRespIDNo")); //身份证号 2018-1-15
	reqMsg.appendNode("strBindAcctType", top.pool.get("acctKind"));  //账户类型
	reqMsg.appendNode("Amount", top.pool.get("AmountCheckFen"));  //金额
	reqMsg.appendNode("strY100Num", top.pool.get("Y100Num"));  //100元金额数量
	reqMsg.appendNode("strY50Num", top.pool.get("Y50Num"));  //50元金额数量
	reqMsg.appendNode("strY20Num", top.pool.get("Y20Num"));  //20元金额数量
	reqMsg.appendNode("strY10Num", top.pool.get("Y10Num"));  //10元金额数量
	reqMsg.appendNode("strY5Num", top.pool.get("Y5Num"));  //5元金额数量
	reqMsg.appendNode("strY1Num", top.pool.get("Y1Num"));  //1元金额数量
	reqMsg.appendNode("strC50Num", top.pool.get("C50Num"));  //5角金额数量
	reqMsg.appendNode("strC10Num", top.pool.get("C10Num"));  //1角金额数量
	reqMsg.appendNode("strC5Num", top.pool.get("C5Num"));  //5分金额数量
	reqMsg.appendNode("strC1Num", top.pool.get("C1Num"));  //1分金额数量
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909002Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909002Complete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("现金取款"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strWithDrawTransJun",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
	var strOrgTsns = "0021909002"+ top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onDrawTransSucc");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("现金取款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
 
    /*插卡验密-主账户验密 2018-1-18*/ 
  this.send901612WithDrawVerifyAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901612"); 
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //终端号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));    //加密数据
	reqMsg.appendNode("strLossDestPan", top.pool.get("hostAccount"));    //存单折账号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901612WithDrawComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901612WithDrawComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("取款前主账户验密"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    { 
		new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onWithDrawVerifyServiceSuccessful");//IC卡交易后写卡处理	
	}
    else 
    {
		var respCode901612 = top.exchxmlasync.strTermRetCode;
		if (typeof(top.MainFrame.onWithDrawVerifyFailed) == "function" && respCode901612 == "2055")
		{
			top.MainFrame.onWithDrawVerifyFailed();
		}else if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("取款前主账户验密查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }

  /*插卡验密-取款二次验密 2018-1-19*/
  this.send901606WithDrawVerifyAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901606");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //银行卡号
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3磁道
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //卡序列号
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC数据
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //扩展主账号 存折使用
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901606WithDrawSecondComplete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901606WithDrawSecondComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("取款前验密"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onWithDrawVerifyServiceSuccessfulCard");//IC卡交易后写卡处理
    }
    else
    {
		if (typeof(top.MainFrame.onWithDrawVerifyFailedCard) == "function" && "2055" == top.exchxmlasync.strTermRetCode)
		{
			top.MainFrame.onWithDrawVerifyFailedCard();
		}else if(typeof(top.MainFrame.onServiceFailed) == "function"){
			if("P102" == top.exchxmlasync.strTermRetCode || "P103" == top.exchxmlasync.strTermRetCode 
				|| "P104" == top.exchxmlasync.strTermRetCode || "P105" == top.exchxmlasync.strTermRetCode
				|| "P106" == top.exchxmlasync.strTermRetCode || "P107" == top.exchxmlasync.strTermRetCode
				||"P108" == top.exchxmlasync.strTermRetCode ){
				top.pool.set("isBlackList","true");	
				//推送PAD
				top.trans.send910304BalckListAsync();
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.langcur.oCheckCardFailedTip);
			}else{
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
			}
		}
    }
  }
  
    /*取款冲正交易-页面*/
  this.send900002WithDrawAsync = function()
  {
		var exch = new ExchangeXmlWithHost();
		var reqMsg = new ColsMsgXmlText();
		reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
		reqMsg.appendNode("strTransCode","900002");    //交易编码，需要和配置文件对应
		reqMsg.appendNode("Amount", top.pool.get("AmountCheckFen")); //金额
		reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
		reqMsg.appendNode("DestPan", top.pool.get("hostAccount")); //扩展主账号  //补登折冲正用
		reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
		//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
		reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
		reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
		reqMsg.appendNode("orgTsn", top.pool.get("strOrgTsns"));  //原交易流水号
		reqMsg.appendNode("strField57", top.pool.get("strField57"));
		reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
		top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync900002WithDrawComplete);
  }
    /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync900002WithDrawComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("取款冲正交易(页面)"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    { 
		new top.CheckCard().icCheckAfterTrans("","top.MainFrame.rollBackSucc");//IC卡交易后写卡处理	
	}
    else 
    {
		if (typeof(top.MainFrame.rollBackFail) == "function")
		{
			top.MainFrame.rollBackFail();
		}
    }
  }
  
  
    /*取款冲正交易-S端线程*/
  this.send900002WithDrawReverseAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Reverse");//冲正线程
	reqMsg.appendNode("strTransCode","900002");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("AmountCheckFen")); //金额
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //账号
	reqMsg.appendNode("DestPan", top.pool.get("hostAccount")); //扩展主账号  //补登折冲正用
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("orgTsn", top.pool.get("strOrgTsns"));  //原交易流水号
	reqMsg.appendNode("strField57", top.pool.get("strField57"));
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	top.journalPrinter.addCashJournalWithTime("取款冲正交易-S端线程",true);
	exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
  }	
		
    /*向服务器发送当日 本年剩余取款金额查询*/
  this.send909001MaxDrawAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909001"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //机具编号
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //加密数据
	reqMsg.appendNode("strField55", top.pool.get("strField55")); //55域
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //二磁道
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //三磁道
	reqMsg.appendNode("strDestPan", top.pool.get("hostAccount"));  //主账号
	reqMsg.appendNode("strBindAcctType", top.pool.get("acctKind"));  //账户类型
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909001MaxDrawComplete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909001MaxDrawComplete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("当日/本年剩余取款金额查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  top.pool.set("totalAmountDay",new top.StringCtrl("").formatStrAmount(top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/amt_xzm")));//当日累计交易额
	  top.pool.set("MaxDrawDay",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/debitDailyUsedLimit"));//当日剩余转出额度
	  top.pool.set("MaxDrawYear",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/debitYearUsedLimit"));//当年剩余转出额度
	  top.pool.set("Cash",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/Cash"));//单笔取款限制金额
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.QuerryMaxDrawSuc");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("当日/本年剩余取款金额查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*取款成功-代理人身份信息登记*/
  this.send901112CashAsync = function(){
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901112");    //交易编码，需要和配置文件对应	
	reqMsg.appendNode("strIDCardNum", top.pool.get("DrawAgentIDNum")); //代理人身份证
	reqMsg.appendNode("strIDName", top.pool.get("DrawAgentName")); //代理人姓名
	reqMsg.appendNode("strPhone",top.pool.get("drawAgentTel"));//代理人电话
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数	
	reqMsg.appendNode("strOption",top.pool.get("strOption"));//选项
	reqMsg.appendNode("strIdEndDate",top.pool.get("strdrawAgentIDEnd"));//证件到期日
    reqMsg.appendNode("strIdIssureArea",top.pool.get("strdrawAgentIDGrantDept"));//证件颁发地
	reqMsg.appendNode("strAgentTransCode",top.pool.get("strAgentTransCode"));//代理交易类型
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strWithDrawTransJun"));//原交易流水号 2018-1-8 代理人登记增加取款流水号
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901112CashComplete);   
  }
     /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901112CashComplete = function(iRet)
  {
	 // 记录终端流水
    var strJrn = new top.StringCtrl("代理人身份信息登记"+ top.pool.get("strAgentTransCode") +"  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
       top.journalPrinter.addCashJournalWithTime("代理人身份信息登记成功",false);
    }
    else
    {
      top.journalPrinter.addCashJournalWithTime("代理人身份信息登记失败",true);
    }    
  }
  
   /*向服务器发送取款交易流水*/
  this.sendUpdateWithDrawTransLog = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "UpdateWithDrawTransLog");
	
	reqMsg.appendNode("strTermTSN", top.pool.get("strWithDrawTransJun"));          //原终端流水号
	reqMsg.appendNode("strTermTransResult", top.pool.get("TermTransResult")); //终端交易状态 0未动作 1已送钞 2出钞失败 3不确定
	reqMsg.appendNode("strReverseentryResult", top.pool.get("ReverseentryResult")); //冲正状态 0不冲正 1冲正成功 2冲正失败 3不确定
	var UpdateData = "原终端流水号:" + top.pool.get("strWithDrawTransJun") + " 终端交易状态:" + top.pool.get("TermTransResult") + " 冲正状态:" + top.pool.get("ReverseentryResult");
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.journalPrinter.addCashJournalWithTime("取款交易流水记录成功" + UpdateData,false);
    }
    else
    {
        top.journalPrinter.addCashJournalWithTime("取款交易流水记录失败" + UpdateData,false);
    }
  }  
  
  
   /*存款前查询*/
  this.send909004Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909004");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strPan", top.pool.get("strDepAccount")); //账号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909004Complete);
  }  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909004Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("存款前查询909004  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
      //账户类型
      top.pool.set("bindAcctType", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/bindAcctType"));
      //贷方日累计可用限额
      top.pool.set("creditDailyUsedLimit", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditDailyUsedLimit"));
      //贷方年累计可用限额
      top.pool.set("creditYearUsedLimit", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditYearUsedLimit"));
      //证件号
      top.pool.set("creditF60_1",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));
      //存款主账号
      top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));
      new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onInqSecDepAmountSuccess");//IC卡交易后写卡处理
    }
    else
    {
      top.MainFrame.onServiceFailed("存款前查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    }
  } 
  
  /*内部账存款交易*/
  this.send909008Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909008");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("strCashAmount")); //账号
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strSummary",top.pool.get("strIDCardNum")+top.pool.get("strIDName"));//摘要
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909008Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909008Complete = function(iRet)
  {
	// 记录终端流水
	var strJrn = new top.StringCtrl("现金存款909008  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
	var strOrgTsns = top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);  
	if (iRet == top.RESULT_SUCCESSFUL)
	{   
		top.pool.set("strCashDepOrgTsns",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
		if (typeof(top.MainFrame.onDepositSuccess) == "function"){
			top.MainFrame.onDepositSuccess();
		}
	}else{
		//失败均需要发送存款确认
		top.trans.send909009Async();
	}
  }
  /*内部账存款确认交易*/
  this.send909009Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909009");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("strCashAmount")); //账号
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strOldOrgTsns",top.pool.get("strOrgTsns"));//原现金存款交易流水
	reqMsg.appendNode("strSummary",top.pool.get("strIDCardNum")+top.pool.get("strIDName"));//摘要
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909009Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909009Complete = function(iRet)
  {
	// 记录终端流水
	var strJrn = new top.StringCtrl("现金存款确认909009  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
	    
	if (iRet == top.RESULT_SUCCESSFUL)
	{   
		top.pool.set("strCashDepOrgTsns",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
		if (typeof(top.MainFrame.onDepositSuccess) == "function"){
			top.MainFrame.onDepositSuccess();
		}
	}
	else
	{
		top.MainFrame.onServiceFailed("现金存款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}    
  }
  /*内部账取款交易*/
  this.send909010Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909010");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("strCashWithDraw")); 
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//证件号码
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//随机数
	reqMsg.appendNode("strSummary",top.pool.get("strIDCardNum")+top.pool.get("strIDName"));//摘要
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909010Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909010Complete = function(iRet)
  {
	// 记录终端流水
	var strJrn = new top.StringCtrl("现金取现909010  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
	top.pool.set("strCashDrawOrgTsns",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));    
	if (iRet == top.RESULT_SUCCESSFUL)
	{   
		if (typeof(top.MainFrame.onCashTransSucess) == "function"){
			top.MainFrame.onCashTransSucess();
		}
	}
	else
	{
		top.MainFrame.onServiceFailed("现金取现失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}    
  }
  /*向服务器请求电子密码锁相关交易*/
  this.send930000Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "EleLockTrans");
	reqMsg.appendNode("strTransCode","930000"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strEleLock",top.pool.get("strEleLock"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync930000Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync930000Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("密码锁请求交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    var retMsg = top.exchxmlasync.getChildTextByTag("F60");
    var TrCode = "" + top.eleLock.GetNodeVal(retMsg,"Ex_TrCode");
    var RetCode = "" + top.eleLock.GetNodeVal(retMsg,"Ex_RetCode");
	top.journalPrinter.addJournalWithTime("密码锁系统返回码：" + RetCode);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strEleLockRetMsg",retMsg);
		if("4000" == TrCode){
    		//交易码为"4000"为在线应急开锁交易
    		if (typeof(top.MainFrame.onAsync930000Complete) == "function"){
    			top.MainFrame.onAsync930000Complete();
    		}
    			
    	}else{
    		top.journalPrinter.addJournalWithTime("接收到服务器响应，开始下行数据到密码锁");
        	var retStr = top.eleLock.WriteReport(retMsg);
            top.journalPrinter.addJournalWithTime("下行结果：" + retStr);
			if (typeof(top.MainFrame.onAsync930000Complete) == "function" && top.pool.get("OpenEleLockAllowed")){
				top.MainFrame.onAsync930000Complete();
    		}
    	}
    }else if(RetCode.length >0){
    	//电子密码锁系统有返回
    	top.pool.set("strEleLockRetMsg",retMsg);
		if("4000" == TrCode){
    		if (typeof(top.MainFrame.onAsync930000Complete) == "function"){
    			top.MainFrame.onAsync930000Complete();
			}
    	}else{
    		top.journalPrinter.addJournalWithTime("接收到服务器响应，开始下行数据到密码锁");
        	var retStr = top.eleLock.WriteReport(retMsg);
            top.journalPrinter.addJournalWithTime("下行结果：" + retStr);
			if (typeof(top.MainFrame.onAsync930000Complete) == "function" && top.pool.get("OpenEleLockAllowed")){
				top.MainFrame.onAsync930000Complete();
    		}
    	}
    }else{		//电子密码锁系统无返回
    	var strJrn = "密码锁操作请求交易失败" + ":" + top.exchxmlasync.strTermRetDesc + top.journalPrinter.strNewLine;
        top.journalPrinter.addJournal(strJrn);
        var strEleLock = top.pool.get("strEleLock");
        var TrCodeOrig = "" + top.eleLock.GetNodeVal(strEleLock,"Ex_TrCode");
        if("4000" == TrCodeOrig || top.pool.get("OpenEleLockAllowed")){
	        if (typeof(top.MainFrame.onServiceFailed) == "function")
	        {
	          top.MainFrame.onServiceFailed("电子密码锁交易请求失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	        }
        }
    }
  }
  
  /*查询清钞状态*/
  this.sendCashSettleCycLogStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryAddCashStatus");
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    reqMsg.appendNode("strTransType",top.pool.get("strTransType"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCashSettleCycLogStatusComplete);
    //top.trans.onAsyncCashSettleCycLogStatusComplete(0);  //测试
  }

  /*清卡状态与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncCashSettleCycLogStatusComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("查询清钞状态"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncCashSettleCycLogStatusComplete) == "function")
        top.MainFrame.onAsyncCashSettleCycLogStatusComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("查询清钞状态失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向后端发送加钞交易*/
  this.send909012Async = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AddCash");
	reqMsg.appendNode("strTransCode","909012"); 
    reqMsg.appendNode("strTotalAmount", new top.StringCtrl("").YuanToFen(top.pool.get("strAddTotalAmount")));
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    var strJrn = new top.StringCtrl("发送加钞交易请求 "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909012Complete);
    //top.trans.onAsync909012Complete(0);	//测试
  }
  
  /*加钞交易与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909012Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("加钞交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsync909012Complete) == "function")
        top.MainFrame.onAsync909012Complete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("加钞交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
   /*向服务器尾箱查询请求*/
  this.send909013Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909013"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	top.journalPrinter.addJournalWithTime("发送尾箱查询交易 send909013Async ");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909013Complete);
  }

  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909013Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("尾箱查询"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	
	var F54_KYYE = top.exchxmlasync.msgxmldomResp.getElementValue("F54_KYYE");
    if (iRet == top.RESULT_SUCCESSFUL && F54_KYYE != null && F54_KYYE.length > 0)
    {
	  top.pool.set("coreBalance",(parseFloat(F54_KYYE)/100.00 ).toFixed(2));  
      if (typeof(top.MainFrame.onServiceSuccessful) == "function")
      top.MainFrame.onServiceSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("尾箱查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向后端发送清钞交易*/
  this.send909011Async = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ClearCash");
	reqMsg.appendNode("strTransCode","909011"); 
    reqMsg.appendNode("strTotalAmount", new top.StringCtrl("").YuanToFen(top.pool.get("strAddTotalAmount")));
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    var strJrn = new top.StringCtrl("发送清钞交易请求 "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909011Complete);
    //top.trans.onAsync909011Complete(0);	//测试
  }
  
  /*清钞交易与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909011Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("清钞交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsync909011Complete) == "function")
        top.MainFrame.onAsync909011Complete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("清钞交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  /*向后端发送现金轧账交易*/
  this.sendCashFailedRecordAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CashFailedRecord");
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    var strJrn = new top.StringCtrl("发送现金轧账交易请求 "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCashFailedRecordComplete);
  }
  /*现金轧账交易与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsyncCashFailedRecordComplete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("现金轧账交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncCashFailedRecordComplete) == "function")
        top.MainFrame.onAsyncCashFailedRecordComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("现金轧账交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*向后端发送钞箱变动交易*/
  this.send909014Async = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	var BoxCheck = new CashBoxCheck();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode","909014"); 
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    reqMsg.appendNode("strCashBoxData",BoxCheck.getCashBoxInfo());
    var strJrn = new top.StringCtrl("发送钞箱变动交易请求 "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909014Complete);
  }
  /*钞箱变动交易与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909014Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("钞箱变动交易"+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    /*if (iRet == top.RESULT_SUCCESSFUL)
    {
      if (typeof(top.MainFrame.onAsyncCashFailedRecordComplete) == "function")
        top.MainFrame.onAsyncCashFailedRecordComplete();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("现金轧账交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }*/
  }

   /*向服务器发送取款存款箱更新交易*/
  this.sendUpdateSettleCycleLogDB = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "UpdateSettleCycleLog");
	
	reqMsg.appendNode("strTransCode",top.pool.get("TransCode")); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("Amount",top.pool.get("AmountCheck")); 
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.journalPrinter.addCashJournalWithTime("取款存款箱更新记录成功",false);
    }
    else
    {
        top.journalPrinter.addCashJournalWithTime("取款存款箱更新记录失败",false);
    }
  } 
  
  /*客户联系信息查询*/
  this.send901129Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901129");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));   //客户号
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901129Complete);
  }
  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync901129Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("客户联系信息查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if (typeof(top.MainFrame.on901129Successful) == "function"){
    		 new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.on901129Successful");//IC卡交易后写卡处理		
    	}
    }
    else
    {
		if(typeof(top.MainFrame.onServiceFailed) == "function"){
			top.MainFrame.onServiceFailed("客户联系信息查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  
  /*柜员信息查询*/
  this.send910207Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910207");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strTellerum", top.pool.get("strTellerum")); //柜员号
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910207Complete); 
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910207Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("柜员信息查询  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {     	
	  var strloginType = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/loginType");
	  top.pool.set("strLoginType",strloginType);
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.TellerQuerySucess");//IC卡交易后写卡处理	
    }
    else
    {
    	if (typeof(top.MainFrame.onTellerQueryFailed) == "function")
	    {
	        top.MainFrame.onTellerQueryFailed("柜员信息查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	    }	
    }
  } 
  
  /*柜员密码验证*/
  this.send910208Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910208");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strTellerum", top.pool.get("strTellerum")); //柜员号
	reqMsg.appendNode("strTellerPwd", top.pool.get("strTellerPwd")); //柜员密码
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910208Complete); 
  }
   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync910208Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("柜员密码验证  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {     	
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.checkFingerSucess");//IC卡交易后写卡处理	
    }
    else
    {
    	if (typeof(top.MainFrame.onTellerCheckFailed) == "function")
	    {
	        top.MainFrame.onTellerCheckFailed("柜员密码验证失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	    }	
    }
  } 
  /*向服务器发送柜员现金查询交易*/
  this.send909122Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909122"); 
	reqMsg.appendNode("Amount", top.pool.get("Amount")); 	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909122Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909122Complete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("柜员现金查询 "+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onTelAmountQuerySuc");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onCashServiceFailed("柜员现金查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*向服务器发送柜员现金存款交易*/
  this.send909120Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909120"); 
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //金额
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100元金额数量
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50元金额数量
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20元金额数量
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10元金额数量
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5元金额数量
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1元金额数量
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5角金额数量
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1角金额数量
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5分金额数量
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1分金额数量
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909120Complete); 
  }

   /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909120Complete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("柜员现金存款 "+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strDepOrgTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onServiceSuccessful");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onDepositFailed("柜员现金存款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*柜员现金取款交易*/
  this.send909119Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909119");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("Amount", top.pool.get("TransAmount")); //取款金额
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909119Complete);
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909119Complete = function(iRet)
  {
	// 记录终端流水
	var strJrn = new top.StringCtrl("柜员现金取款909119  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
	top.pool.set("strWithDrawTransJun",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
	if (iRet == top.RESULT_SUCCESSFUL)
	{   
		if (typeof(top.MainFrame.onDrawTransSucc) == "function"){
			top.MainFrame.onDrawTransSucc();
		}
	}else if(iRet == top.RESULT_FAILED)
    { 
		if(top.exchxmlasync.strTermRetCode == "0002"){
			top.MainFrame.onCashServiceUnknow("柜员取款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}else{
			top.MainFrame.onCashServiceFailed("柜员取款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
	else
	{
		//交易异常
		top.MainFrame.onCashServiceUnknow("柜员取款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}    
  }
  /*对公取款信息查询*/
  this.send909016Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909016");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strMobile", top.pool.get("strMobile")); //手机号
	reqMsg.appendNode("strMessageCode", top.pool.get("strMessageCode")); //验证码
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909016Complete);
  }  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909016Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("对公取款查询909016  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if(iRet == top.RESULT_SUCCESSFUL)
    { 
     //公司名称
      top.pool.set("WithDraw_CompName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acct_name"));//F61_6_NM存放公司名称
     //取款人名称
      top.pool.set("WithDraw_Name",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/trnspersion_name"));
	 //取款账号
      top.pool.set("WithDraw_Acc",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acct_no"));
     //取款金额
      top.pool.set("strCashWithDraw",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/trns_fee"));
     //取款登记日期
      top.pool.set("WithDraw_Date",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/record_date"));
     //登记人身份证号码
      top.pool.set("strRegCardNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cred_code"));
     //取款登记编号
      top.pool.set("strDrawId",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/id"));
     //取款登记的机构号
      top.pool.set("WithDraw_orgNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/bank_no"));
      //取款登记机构与办理机构对比
      if(top.pool.get("WithDraw_orgNum")!=null && top.pool.get("WithDraw_orgNum")!= "" && top.pool.get("WithDraw_orgNum")!=top.terminal.strOrgNum){
    	  top.MainFrame.onServiceFailed("对公取款查询失败", top.exchxmlasync.strTermRetCode, "对公取款登记机构与本机构不一致，请去原登记机构办理业务");  
      }
      if(typeof(top.MainFrame.ShowWithDrawInfo) == "function"){
		  top.MainFrame.ShowWithDrawInfo();
      }
    }else{
    	if(top.pool.get("checkCodeFlag") <2){//验证码输入次数控制
    		top.MainFrame.onService909016Failed("对公取款查询失败", top.exchxmlasync.strTermRetCode, "您输入的手机号或验证码有误，请确认后重新输入");
    	}else{
    		top.MainFrame.onServiceFailed("对公取款查询失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);  
    	} 
    }
  } 
  
  /*对公取款交易*/
  this.send909017Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	var CashWithDrawNum = top.pool.get("strCashWithDraw");
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909017");    //交易编码，需要和配置文件对应
	reqMsg.appendNode("strDrawId", top.pool.get("strDrawId")); //取款编号
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //办理人身份证
	reqMsg.appendNode("Amount", new top.StringCtrl("").YuanToFen(CashWithDrawNum));  //金额
	reqMsg.appendNode("strDestPan",top.pool.get("WithDraw_Acc")); //取款账户
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909017Complete);
  }  
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909017Complete = function(iRet)
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("对公取款交易909017  返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strWithDrawTransJun",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));//原交易流水
    top.pool.set("strDepOrgTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));//原交易流水
    if(iRet == top.RESULT_SUCCESSFUL)
    { 
    	if (typeof(top.MainFrame.onDrawTransSucc) == "function"){
			top.MainFrame.onDrawTransSucc();
			}
    }
    else if(iRet == top.RESULT_FAILED)
    { 
		if(top.exchxmlasync.strTermRetCode == "0002"){// s->p
			top.MainFrame.drawOutOfServiceUnknow("对公取款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}else{
			top.MainFrame.onServiceFailed("对公取款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
	else
	{
		//交易异常 c->s
		top.MainFrame.drawOutOfServiceUnknow("对公取款失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	} 
  }
  /*对公取款确认交易*/
  this.send909021Async = function(){
	  new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	  var exch = new ExchangeXmlWithHost();
	  var reqMsg = new ColsMsgXmlText();
	  reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	  reqMsg.appendNode("strTransCode","909021");    //交易编码，需要和配置文件对应
	  reqMsg.appendNode("strDrawId", top.pool.get("strDrawId")); //取款编号
	  reqMsg.appendNode("strOrgTsn", top.pool.get("strDepOrgTsn"));  //原存款交易流水号
	  top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909021Complete); 
  }
  /*与WEB服务器进行异步交互完成时的回调函数*/
  this.onAsync909021Complete = function(iRet)
  { 
    // 记录终端流水
    var strJrn = new top.StringCtrl("对公取款确认909021 "+" "+"返回码"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "终端流水号"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"主机流水号"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    /*if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onDrawTransSucc");//IC卡交易后写卡处理
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("对公取款确认交易失败", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }*/
  }
  /*网银、手机银行转换*/
  this.convertType =function(transType,flag) 
  {
	  if(flag =="1"){
		switch(transType) {
			case "O" : return "短信专业版";
			case "M" : return "证书专业版";
			case "R" : return "大众注册版";
			case "1" : return "个人网银证书版";
			case "2" : return "个人网银短信版";
			case "3" : return "个人网银短信加证书版";
			default : return "其他"
		}   
	  }else if(flag == "Ukey") {
		  switch(transType) {
			  case "5002" : return "个人网银飞天";
			  case "5003" : return "公司网银飞天";
			  case "5004" : return "支付密码器";
			  case "5005" : return "网银密码信封";
			  case "5006" : return "个人网银海泰";
			  case "5007" : return "公司网银海泰";
			  case "5008" : return "个人飞天二代";
			  case "5009" : return "企业飞天二代";
			  case "5010" : return "个人信安二代";
			  case "5011" : return "企业信安二代";
			  case "5012" : return "个人中金二代蓝牙";
			  case "5013" : return "企业中金二代蓝牙";
			  case "5014" : return "个人飞天二代蓝牙";
			  case "5015" : return "企业飞天二代蓝牙";
			  default : return "其他"
		  }
	  }else if(flag == "Card") {
		  switch(transType) {
			  case "000" : return "国内如意卡(16位)";
			  case "001" : return "国际如意卡(16位)";
			  case "002" : return "国际如意卡";
			  case "003" : return "工会会员服务卡(16位)(杨浦)";
			  case "004" : return "工会会员服务卡(杨浦)";
			  case "005" : return "上海工会会员服务卡";
			  case "022" : return "单位授权卡";
			  case "030" : return "鑫意卡(16位)";
			  case "031" : return "鑫意卡";
			  case "032" : return "鑫意卡(IC)";
			  case "060" : return "鑫通卡";
			  case "061" : return "鑫通卡(国)";
			  case "063" : return "鑫通卡(16位)";
			  case "064" : return "上海工会会员服务卡(IC)";
			  case "065" : return "长宁政府饭贴卡";
			  case "066" : return "鑫捷卡";
			  case "067" : return "鑫意白金卡";
			  case "068" : return "家政卡";
			  case "070" : return "鑫钱包";
			  case "020" : return "曹杨社区卡";
			  case "071" : return "社区一卡通";
			  case "050" : return "园区卡";
			  case "072" : return "家庭账户主卡";
			  case "073" : return "家庭账户附卡";
			  case "021" : return "单位结算卡";
			  case "069" : return "微家园社区服务卡";
			  case "074" : return "松江区市民卡";
			  case "075" : return "敬老卡";
			  default : return "其他"
		  }
	  }else if(flag == "Voucher") {
		  switch(transType) {
			  case "00" : return "无此凭证";
			  case "03" : return "在途";
			  case "05" : return "未用";
			  case "06" : return "使用";
			  case "08" : return "挂失确认";
			  case "09" : return "挂失";
			  case "091" : return "口头挂失";
			  case "10" : return "待销毁";
			  case "11" : return "销毁";
			  case "12" : return "结清";
			  case "13" : return "外部作废";
			  case "30" : return "遗失";
			  case "31" : return "内部作废";
			  case "32" : return "圈存";
			  case "33" : return "止付";
			  case "50" : return "审批";
			  case "55" : return "销毁中";
			  case "60" : return "待销毁在途";
			  default : return "其他"
		  }
	  }else {
		switch(transType) {
			case "01" : return "借记卡";
			case "02" : return "贷记卡";
			case "03" : return "存折";
			case "04" : return "账号";
			case "三个月" : return "0126";
			case "六个月" : return "0131";
			case "一年" : return "0136";
			case "两年" : return "0141";
			case "三年" : return "0146";
			case "五年" : return "0151";
			default : return "其他"
		}  
	  }	
  } 
  
  this.converCurrency = function(transType){
	  switch(transType) {
		case "CNY" : return "人民币";
		case "USD" : return "美元";
		case "EUR" : return "欧元";
		case "CAD" : return "加元";
		case "HKD" : return "港元";
		case "GBP" : return "英镑";
		default : return transtype
	} 
  }
	
	
  /*交易名称转换*/
  this.convertTransType =function(transType) 
  {
	switch(transType) {
		case "902503" : return "修改密码";
		case "902601" : return "借记卡电子现金解锁";
		case "900002" : return "指定账户充值冲正";
		case "901104" : return "开卡交易";
		case "901201" : return "借记卡激活";
		case "901112" : return "代理人身份信息登记";
		case "901610" : return "综合签约";
		case "901608" : return "电子银行签约查询";
		case "901703" : return "ATM转账及限额查询";
		case "901704" : return "ATM转账及限额";
		case "901708" : return "小额支付限额修改";
		case "901709" : return "预留手机号登记修改";
		case "901713" : return "小额支付限额查询";
		case "901807" : return "第三方支付-限额管理修改";
		case "901806" : return "第三方支付-限额管理查询";
		case "902105" : return "账户信息查询";//
		case "902106" : return "账户列表查询交易";
		case "902107" : return "查询余额交易";
		case "902117" : return "余额查询";
		case "902109" : return "活期子账户查询";
		case "902110" : return "定期子账户查询";
		case "902111" : return "账户历史明细查询";
		case "902201" : return "绑定查询";
		case "902202" : return "充值";
		case "902209" : return "电子现金交易-写卡结果上送";
		case "902502" : return "重置密码";
		case "902501" : return "解锁密码";
		case "902301" : return "存折补登交易";
		case "903101" : return "转账-借贷记互转";
		case "903401" : return "活期转定期交易";
		case "903402" : return "定期转活期交易";
		case "904102" : return "信用卡启用";
		case "904103" : return "借记卡转借记卡交易";
		case "904105" : return "自动还款约定";
		case "904106" : return "自动还款约定取消";
		case "904107" : return "自动还款约定查询";
		case "904206" : return "自动购汇还款申请";
		case "904207" : return "自动购汇还款解约";
		case "904208" : return "自动购汇还款查询";
		case "904501" : return "信用卡客户信息查询";
		case "904502" : return "按证件号查询信用卡号";
		case "904503" : return "信用卡账户查询";
		case "904504" : return "信用卡卡片查询";
		case "904506" : return "账单头查询交易";
		case "904507" : return "未出账单查询交易";
		case "904508" : return "已出账单查询交易";
		case "906104" : return "签署确认书";
		case "906201" : return "牌价查询";
		case "906301" : return "外汇购汇";
		case "906302" : return "外汇结汇";
		case "906406" : return "外汇买卖";
		case "907101" : return "缴费条码查询";
		case "907102" : return "缴费";
		case "907301" : return "公积金余额查询";
		case "907302" : return "公积金明细查询-明细查询";
		case "908207" : return "个人网银修改";
		case "910201" : return "联网核查";
		case "910301" : return "PAD审核";
		case "911101" : return "发卡机装卡";
		case "911102" : return "发卡机装卡";
		case "911201" : return "申请密钥交易";
		case "911202" : return "激活密钥交易";
		case "901710" : return "预留手机号查询";
		case "901606" : return "验密交易";
		case "907204" : return "代扣签约查询";
		case "907205" : return "代扣签约交易";
		case "908214" : return "个人网银密码重置";
		case "908213" : return "个人网银新增账户";
		case "908203" : return "个人网银注销";
		case "908108" : return "手机银行密码重置";
		case "908107" : return "手机银行新增账户";
		case "908102" : return "手机银行注销";
		case "908104" : return "手机银行修改";
		case "908305" : return "短信通维护";
		case "902122" : return "凭证列表查询";
		case "905102" : return "存单开户";
		case "905105" : return "利率查询";		
		case "905106" : return "内部账转出";
		case "905107" : return "存单开户";
		case "905108" : return "内部账转入";
		case "905111" : return "利息试算";
		case "905119" : return "存单验证";
		case "910103" : return "排队叫号";		
		case "910206" : return "柜员指纹授权";		
		case "910304" : return "呼叫柜员协助";
		case "910305" : return "协助结果查询";
		case "911203" : return "设备柜员签退";
		case "911204" : return "设备柜员签到";	
		case "903201" : return "跨行转账";			
		case "903101BH" : return "本行转账";
		case "902502CDT" :return "信用卡密码重置";
		case "902502DBT" :return "借记卡密码重置";
		case "902502CD"  :return "存单密码重置";
		case "902502PBK" :return "存折密码重置";
		case "902503DBT" :return "信用卡密码修改";
		case "902503CDT" :return "借记卡密码修改";
		case "902503PBK" :return "存折密码修改";
		case "908305DEL" :return "短信通关闭";
		case "902405" :return "卡解挂";
		case "902406" :return "重空解挂";
		case "901120" :return "可解挂列表查询";
		case "901401" :return "借记卡换卡";
		case "909020" : return "对公存款";
		case "909015" : return "对公存款确认";
		case "909019" : return "对公存款前查询";
		case "901102" : return "更新居民个税";
		case "907208" :return "代扣签约交易";
		default : return "其他"
	}
  } 
	  /*跨行转账汇路代码转换*/
  this.convertRBankCode =function(RBankCode) 
  {
	switch(RBankCode) {
		case "01" : return "1001";
		case "02" : return "1002";
		case "03" : return "1003";
		case "04" : return "1010";
		case "05" : return "1011";
		case "07" : return "YYT";
		case "08" : return "HTC2";
		default : return ""
	}
  }
  
  this.converCurrency = function(transType){
	  switch(transType) {
		case "CNY" : return "人民币";
		case "USD" : return "美元";
		case "EUR" : return "欧元";
		case "CAD" : return "加元";
		case "HKD" : return "港元";
		case "GBP" : return "英镑";
		default : return transtype
	} 
  }
  
  this.converNumberToCurrency = function(transType){
	  switch(transType) {
		case "156" : return "人民币";
		case "840" : return "美元";
		case "978" : return "欧元";
		case "124" : return "加元";
		case "344" : return "港元";
		case "826" : return "英镑";
		case "36" : return "澳元";
		case "392" : return "日元";
		default : return transtype
	}
  }
  
  this.converSubAcctType = function(acctType){
		switch(acctType) {	
			case "CNY0" : return "人民币账户";
			case "USD1" : return "美元钞户";
			case "USD2" : return "美元汇户";
			case "EUR1" : return "欧元钞户";
			case "EUR2" : return "欧元汇户";
			case "HKD1" : return "港币钞户";
			case "HKD2" : return "港币汇户";
			case "JPY1" : return "日元钞户";
			case "JPY2" : return "日元汇户";
			case "AUD1" : return "澳大利亚元钞户";
			case "AUD2" : return "澳大利亚元汇户";
			case "GBP1" : return "英镑钞户";
			case "GBP2" : return "英镑汇户";
			case "SGD1" : return "新加坡元钞户";
			case "SGD2" : return "新加坡元汇户";
			case "CAD1" : return "加拿大元钞户";
			case "CAD2" : return "加拿大元汇户";
			default : return acctType
		}
  }
  
	/*信用卡返回卡状态转换*/
  this.convertCreditCardState = function(state) 
  {
	switch(state) {
		case "A" : return "卡片未激活";
		case "B" : return "银行止付卡片";
		case "C" : return "发卡行关闭账户";
		case "CC" : return "贷款到期";
		case "D" : return "冻结账户";
		case "E" : return "银行停用离行员工卡片";
		case "F" : return "欺诈";
		case "G" : return "授权监控";
		case "H" : return "其他风险控制止付";
		case "I" : return "疑似套现";
		case "K" : return "商务卡丢失";
		case "L" : return "卡片丢失";
		case "M" : return "邮件退回";
		case "N" : return "未收到卡片";
		case "O" : return "因逾期而停用";
		case "P" : return "捡到的卡片挂失";
		case "PQ" : return "内部关帐专用";
		case "Q" : return "持卡人请求关闭";
		case "S" : return "被盗";
		case "T" : return "销卡";
		case "U" : return "睡眠卡关闭";
		case "V" : return "新卡激活旧卡失效";
		case "X" : return "长期逾期";
		case "Y" : return "损坏交回";
		case "Z" : return "持卡人死亡";
		case "W" : return "长期逾期导致冻结";
		case "WQ" : return "长期逾期导致冻结";
		default : return "正常"
	}
  }
}