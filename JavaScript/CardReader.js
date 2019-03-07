/*
  读卡器操作类
 */
function CardReader()
{
  // 读卡器虚模块事件响应对象
  this.CardReadEvents = new top.EventHandling(top.YHAXCardReader);
  //------------------------- 读卡器操作类私有属性 -------------------------//
  /*读卡器是否支持吞卡*/
  this.CpCanCapture = top.YHAXCardReader.CpCanCapture;
  /* 退出卡后等待用户取卡时间 单位（秒）*/
  this.EjectTimeout = 120;
  //------------------------- 读卡器执行的方法 -------------------------//
  var isSM4 = -1;//是否支持国密算法标志

  this.strField55Value ="";	//55域
  /*允许插卡*/
  this.accept = function(timeout)
  {
	top.journalPrinter.addJournalWithTime("允许插卡 CardReader command accept");
	top.pool.set("strPinBlock", "");//防止验密的时候，把上次的PinBlock取出来
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
    // 控制指示灯
    try{top.guidelights.setCardReaderLight("MEDIUM");}catch(e){}
  }

  /*不允许插卡*/
  this.cancelAccept = function()
  {
	 top.journalPrinter.addJournalWithTime("取消允许插卡 CardReader command cancelAccept");
     top.cardreader.CardReadEvents.appendEvent("CardAcceptCancelled", top.cardreader.onCardAcceptCancelled);
	 top.YHAXCardReader.CancelAccept();
  }

  /*退卡*/
  this.eject = function()
  {
	top.journalPrinter.addJournalWithTime("退卡 CardReader command eject");
    top.cardreader.CardReadEvents.clearAll();
    top.cardreader.CardReadEvents.appendEvent("CardEjected", top.cardreader.onCardEjected);
    top.cardreader.CardReadEvents.appendEvent("Timeout", top.cardreader.onTimeout_Eject);
    top.cardreader.CardReadEvents.appendEvent("CardTaken", top.cardreader.onCardTaken);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onDeviceError);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onDeviceError);
    top.YHAXCardReader.Eject(this.EjectTimeout*1000);
  }

  /*读卡器复位*/
  this.reset = function ()
  {
	top.journalPrinter.addJournalWithTime("复位 CardReader command reset");
	top.cardreader.CardReadEvents.appendEvent("ResetComplete", top.cardreader.onResetComplete);
	top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onDeviceError);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onDeviceError);
    top.YHAXCardReader.Reset("RETRACT");
  }

  /*IC卡操作*/
  this.ICTask = function ()
  {
      top.journalPrinter.addJournalWithTime("读取IC卡信息 ");
	  var ret = top.YHAXCardReader.ICT_Connect();//建立应用层与读卡器通道层之间的连接，芯片卡使用
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡连接失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  ret = top.YHAXCardReader.ICT_CreateAppList();//创建终端和卡片同时支持的应用列表
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡创建应用列表失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  var strAppValue = top.YHAXCardReader.ICT_GetAppListEx(20);//创建终端和卡片同时支持的应用列表
	  ret = strAppValue.split("|")[0];
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡获取候选应用列表失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //返回的应用列表条数,目前所有的卡都是返回一条，暂时不要循环判断了
	  var appCount = strAppValue.split("|")[1];
	  if(appCount <= 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡获取候选应用列表失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //返回的应用列表
	  var aidtemp = strAppValue.split("|")[2];
	  if(aidtemp == 0 || aidtemp == ""){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡应用选择失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  var aid = aidtemp.substr(0,aidtemp.indexOf(' '));
	  ret = top.YHAXCardReader.ICT_AppSelect(aid);//应用选择
      //判断是否锁定，是否是电子现金解锁交易	 
	  if(ret != 0){
		 if(ret == 11 && top.pool.get("isLockTrans")=="1"){
			// 记录终端流水
			top.journalPrinter.addJournalWithTime("电子现金锁定 ");
			top.pool.set("isCardLock","1");  
		 }else{	
			// 记录终端流水
			top.journalPrinter.addJournalWithTime("IC卡应用选择失败 ");
			if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
				top.MainFrame.onICCardInitFailed();
			}
			return;
		 }
	  }else{
		  //解挂交易但是电子现金未锁定
		  if(top.pool.get("isLockTrans")=="1"){
			top.journalPrinter.addJournalWithTime("解挂电子现金未锁 ");
			top.pool.set("isCardLock","0");
		  }	
	  }
	  ret = top.YHAXCardReader.ICT_AppInit();//应用初始化
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡应用初始化失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //获取卡序列号5F34
	  var str5F34Data = top.YHAXCardReader.ICT_GetValueEx(0x5F34);
	  str5F34Data =  new top.StringCtrl(str5F34Data.split("|")[1]).trim();
	  top.pool.set("str5F34",new top.StringCtrl(str5F34Data).prefixStr('0',3));

	  //获取电子现金充值上限
	  var str9F77Data = top.YHAXCardReader.ICT_GetDataEx(0x9F77);
	  var ret = str9F77Data.split("|")[0];
	  if(ret != 0){
		 var strJrn = new top.StringCtrl("IC卡芯片读取失败 "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
         top.journalPrinter.addJournalWithTime("IC卡芯片读取失败 ");
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
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡获取磁道信息失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  } else{
         top.journalPrinter.addJournalWithTime("IC卡初始化完成 ");
		 //判断是否走国密流程
		 top.cardreader.checkSM4(strICData);
	  }
  }
  //应用初始化流程
  this.appInit = function()
  {
	  var ret;
	  ret = top.YHAXCardReader.ICT_CreateAppList();//创建终端和卡片同时支持的应用列表
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡创建应用列表失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  var strAppValue = top.YHAXCardReader.ICT_GetAppListEx(20);//创建终端和卡片同时支持的应用列表
	  ret = strAppValue.split("|")[0];
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡获取候选应用列表失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //返回的应用列表条数,目前所有的卡都是返回一条，暂时不要循环判断了
	  var appCount = strAppValue.split("|")[1];
	  if(appCount <= 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡获取候选应用列表失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  //返回的应用列表
	  var aidtemp = strAppValue.split("|")[2];
	  if(aidtemp == 0 || aidtemp == ""){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡应用选择失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
	  var aid = aidtemp.substr(0,aidtemp.indexOf(' '));
	  ret = top.YHAXCardReader.ICT_AppSelect(aid);//应用选择	 
	  if(ret != 0){
		 if(ret == 11 && top.pool.get("isLockTrans")=="1"){
			// 记录终端流水
			top.journalPrinter.addJournalWithTime("电子现金锁定 ");
			top.pool.set("isCardLock","1");  
		 }else{	
			 // 记录终端流水
			 top.journalPrinter.addJournalWithTime("IC卡应用选择失败 ");		 
			 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
				top.MainFrame.onICCardInitFailed();
			 }
			 return;
		 }
	  }else{
		  //解挂交易但是电子现金未锁定
		  if(top.pool.get("isLockTrans")=="1"){
			top.journalPrinter.addJournalWithTime("解挂电子现金未锁 ");
			top.pool.set("isCardLock","0");
		  }		  
	  }
	  ret = top.YHAXCardReader.ICT_AppInit();//应用初始化
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡应用初始化失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
		 return;
	  }
  }
  //终端行为分析流程
  this.terminalActAnaly =function()
  {
	 var ret;
	  ret = top.YHAXCardReader.ICT_ProRestr();//交易处理限制
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡交易处理限制失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
	  }
	  ret = top.YHAXCardReader.ICT_CardHolderVeri();//持卡人验证
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡持卡人验证失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
	  }
	  ret = top.YHAXCardReader.ICT_TerminalRiskManage();//终端风险管理
	  if(ret != 0){
		 // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡终端风险管理失败 ");
		 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
            top.MainFrame.onICCardInitFailed();
	     }
	  }
	  ret = top.YHAXCardReader.ICT_TerminalActAnaly();//终端行为分析
	  if(ret != 0){
		 if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){
			// 记录终端流水
			top.journalPrinter.addJournalWithTime("锁定IC卡终端行为分析失败 ");					
		 }else{
			 // 记录终端流水
			 top.journalPrinter.addJournalWithTime("IC卡终端行为分析失败 ");
			 if (typeof(top.MainFrame.onICCardInitFailed) == "function"){
				top.MainFrame.onICCardInitFailed();
			 }
		 }
	  }
	  return ret;
  }

  //判断是否走国密流程
  this.checkSM4 = function(strICData)
  {
		//增加判断卡是否是国密卡，首先取出9F38，然后判断9F38中是否包含DF69，并且DF69的值为01
		var str9F38Data = top.YHAXCardReader.ICT_GetValueEx(0x9F38);
		if(str9F38Data.indexOf("DF69") > 0){//包含DF69
		    var strDF69Data = top.YHAXCardReader.ICT_GetValueEx(0xDF69);
		    var strDF69Flag = new top.StringCtrl(strDF69Data.split("|")[1]).trim();
		    if(strDF69Data.split("|")[0] =="0" && strDF69Flag == "01"){//卡为支持国密算法
		        isSM4 = 0;
		    }else{
		        isSM4 = -1;
		    }
		}else{
		    isSM4 = -1;
		}
		//判断当前是否存在国密密钥
		var isSM4PINKey = top.YHAXPinPad.IsValidEncryptionKeySync("SM4PINKey");
		if(isSM4 == 0 && top.YHAXPinPad.CpSuportSM4 && isSM4PINKey){//走国密流程
			top.journalPrinter.addJournalWithTime("YHAXPinPad.PinMode SM4");
		    top.YHAXPinPad.PinMode = "SM4";//密码键盘设置国密模式
		    top.YHAXCardReader.ICT_SetValue(0xDF69,"01");//设置缓冲区国密算法标志
		    top.pool.set("strEncrypType", "SM4");
		}else{//走国际密钥流程
		    top.YHAXPinPad.PinMode = "NORMAL";//密码键盘设置普通模式
		    top.YHAXCardReader.ICT_SetValue(0xDF69,"00");//设置缓冲区国密算法标志
		    top.pool.set("strEncrypType", "NORMAL");
		}
		var track2 = strICData.split("|")[1].replace("D","=")
		//取55域数据,并保存
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

  //组装55域数据
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
	  // 记录终端流水
      //var strJrn = new top.StringCtrl("获取55域数据: ["+field55 +"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return field55;
  }

  //取9F26值
  this.getTag9F26 = function()
  {
	  var tag9F26 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F26).split("|")[1]).trim();;
	  var tag9F26Len = new top.StringCtrl((new top.StringCtrl(tag9F26).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F26值: 长度["+tag9F26Len +"]  值["+tag9F26+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F26" + tag9F26Len + tag9F26;
  }

  //取9F10值
  this.getTag9F10 = function()
  {
	  var tag9F10 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F10).split("|")[1]).trim();;
	  var tag9F10Len = new top.StringCtrl((new top.StringCtrl(tag9F10).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
     // var strJrn = new top.StringCtrl("获取9F10值: 长度["+tag9F10Len +"]  值["+tag9F10+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
     // top.journalPrinter.addJournal(strJrn);
	  return "9F10" + tag9F10Len + tag9F10;
  }

  //取9F37值
  this.getTag9F37 = function()
  {
	  var tag9F37 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F37).split("|")[1]).trim();;
	  var tag9F37Len = new top.StringCtrl((new top.StringCtrl(tag9F37).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F37值: 长度["+tag9F37Len +"]  值["+tag9F37+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F37" + tag9F37Len + tag9F37;
  }

  //取9F36值
  this.getTag9F36 = function()
  {
	  var tag9F36 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F36).split("|")[1]).trim();;
	  var tag9F36Len = new top.StringCtrl((new top.StringCtrl(tag9F36).trim().length/2).toString(16)).prefixStr('0',2);
	  // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F36值: 长度["+tag9F36Len +"]  值["+tag9F36+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F36" + tag9F36Len + tag9F36;
  }

  //取95值
  this.getTag95 = function()
  {
	  var tag95 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x95).split("|")[1]).trim();;
	  var tag95Len = new top.StringCtrl((new top.StringCtrl(tag95).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取95值: 长度["+tag95Len +"]  值["+tag95+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "95" + tag95Len + tag95;
  }

  //取9A值
  this.getTag9A = function()
  {
	  var tag9A = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9A).split("|")[1]).trim();;
	  var tag9ALen = new top.StringCtrl((new top.StringCtrl(tag9A).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9A值: 长度["+tag9ALen +"]  值["+tag9A+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9A" + tag9ALen + tag9A;
  }

  //取82值
  this.getTag82 = function()
  {
	  var tag82 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x82).split("|")[1]).trim();;
	  var tag82Len = new top.StringCtrl((new top.StringCtrl(tag82).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取82值: 长度["+tag82Len +"]  值["+tag82+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "82" + tag82Len + tag82;
  }

  //取9F1A值
  this.getTag9F1A = function()
  {
	  var tag9F1A = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F1A).split("|")[1]).trim();;
	  var tag9F1ALen = new top.StringCtrl((new top.StringCtrl(tag9F1A).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F1A值: 长度["+tag9F1ALen +"]  值["+tag9F1A+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F1A" + tag9F1ALen + tag9F1A;
  }

  //取9F33值
  this.getTag9F33 = function()
  {
	  var tag9F33= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F33).split("|")[1]).trim();;
	  var tag9F33Len = new top.StringCtrl((new top.StringCtrl(tag9F33).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F33值: 长度["+tag9F33Len +"]  值["+tag9F33+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F33" + tag9F33Len + tag9F33;
  }

  //取9F1E值
  this.getTag9F1E = function()
  {
	  var tag9F1E= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F1E).split("|")[1]).trim();;
	  var tag9F1ELen = new top.StringCtrl((new top.StringCtrl(tag9F1E).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F1E值: 长度["+tag9F1ELen +"]  值["+tag9F1E+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F1E" + tag9F1ELen + tag9F1E;
  }

  //取84值
  this.getTag84 = function()
  {
	  var tag84= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x84).split("|")[1]).trim();;
	  var tag84Len = new top.StringCtrl((new top.StringCtrl(tag84).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取84值: 长度["+tag84Len +"]  值["+tag84+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "84" + tag84Len + tag84;
  }

  //取9F41值
  this.getTag9F41 = function()
  {
	  var tag9F41= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F41).split("|")[1]).trim();;
	  var tag9F41Len = new top.StringCtrl((new top.StringCtrl(tag9F41).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F41值: 长度["+tag9F41Len +"]  值["+tag9F41+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F41" + tag9F41Len + tag9F41;
  }

  //取9F27值
  this.getTag9F27 = function()
  {
	  var tag9F27= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F27).split("|")[1]).trim();;
	  var tag9F27Len = new top.StringCtrl((new top.StringCtrl(tag9F27).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F27值: 长度["+tag9F27Len +"]  值["+tag9F27+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F27" + tag9F27Len + tag9F27;
  }

  //取9C值
  this.getTag9C = function()
  {
	  var tag9C= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9C).split("|")[1]).trim();;
	  var tag9CLen = new top.StringCtrl((new top.StringCtrl(tag9C).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9C值: 长度["+tag9CLen +"]  值["+tag9C+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9C" + tag9CLen + tag9C;
  }

  //取9F02值
  this.getTag9F02 = function()
  {
	  var tag9F02= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F02).split("|")[1]).trim();;
	  var tag9F02Len = new top.StringCtrl((new top.StringCtrl(tag9F02).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F02值: 长度["+tag9F02Len +"]  值["+tag9F02+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F02" + tag9F02Len + tag9F02;
  }

  //取5F2A值
  this.getTag5F2A = function()
  {
	  var tag5F2A= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x5F2A).split("|")[1]).trim();;
	  var tag5F2ALen = new top.StringCtrl((new top.StringCtrl(tag5F2A).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取5F2A值: 长度["+tag5F2ALen +"]  值["+tag5F2A+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "5F2A" + tag5F2ALen + tag5F2A;
  }

  //取9F03值
  this.getTag9F03 = function()
  {
	  var tag9F03= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F03).split("|")[1]).trim();;
	  var tag9F03Len = new top.StringCtrl((new top.StringCtrl(tag9F03).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F03值: 长度["+tag9F03Len +"]  值["+tag9F03+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F03" + tag9F03Len + tag9F03;
  }

  //取9F34值
  this.getTag9F34 = function()
  {
	  var tag9F34= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F34).split("|")[1]).trim();
	  var tag9F34Len = new top.StringCtrl((new top.StringCtrl(tag9F34).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F34值: 长度["+tag9F34Len +"]  值["+tag9F34+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F34" + tag9F34Len + tag9F34;
  }

  //取9F35值
  this.getTag9F35 = function()
  {
	  var tag9F35= new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F35).split("|")[1]).trim();;
	  var tag9F35Len = new top.StringCtrl((new top.StringCtrl(tag9F35).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F35值: 长度["+tag9F35Len +"]  值["+tag9F35+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F35" + tag9F35Len + tag9F35;
  }
  //取9F08值
  this.getTag9F08 = function()
  {
	  var tag9F08 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F08).split("|")[1]).trim();
	  var tag9F08Len = new top.StringCtrl((new top.StringCtrl(tag9F08).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F08值: 长度["+tag9F08Len +"]  值["+tag9F08+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F08" + tag9F08Len + tag9F08;
  }

  //取DF31值
  this.getTagDF31 = function()
  {
	  var tagDF31 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0xDF31).split("|")[1]).trim();
	  var tagDF31Len = new top.StringCtrl((new top.StringCtrl(tagDF31).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取DF31值: 长度["+tagDF31Len +"]  值["+tagDF31+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "DF31" + tagDF31Len + tagDF31;
  }

  //取9F09值
  this.getTag9F09 = function()
  {
	  var tag9F09 = new top.StringCtrl(top.YHAXCardReader.ICT_GetValueEx(0x9F09).split("|")[1]).trim();
	  var tag9F09Len = new top.StringCtrl((new top.StringCtrl(tag9F09).trim().length/2).toString(16)).prefixStr('0',2);
      // 记录终端流水
      //var strJrn = new top.StringCtrl("获取9F09值: 长度["+tag9F09Len +"]  值["+tag9F09+"]" +new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
      //top.journalPrinter.addJournal(strJrn);
	  return "9F09" + tag9F09Len + tag9F09;
  }

  /*解析55域TAG值命令*/
  this.issueReport = function(strFiled55)
  {
	 var ret = top.YHAXCardReader.ICT_IssueReport(strFiled55);
	 if(ret != 0){
	     // 记录终端流水
         top.journalPrinter.addJournalWithTime("解析55域TAG值命令失败 ");
	 }
	 return ret;
  }

  /*发卡行认证*/
  this.exterAuth = function()
  {
	 var ret = top.YHAXCardReader.ICT_ExterAuth();
	 if(ret != 0){
	     // 记录终端流水
         top.journalPrinter.addJournalWithTime("发卡行认证失败 ");
	 }
	 return ret;
  }

  /*结束交易*/
  this.busiAuthor = function(func)
  {
	 var ret = top.YHAXCardReader.ICT_BusiAuthor();
	 if(ret != 0){
	     // 记录终端流水
         top.journalPrinter.addJournalWithTime("IC卡结束交易失败 ");
		 //如果是解挂且电子现金已经锁定
		 if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){
			 top.cardreader.issueScript(0x72,func);
		 }
	 }
	 else{
		top.cardreader.issueScript(0x72,func);
	 }
	 return ret;
  }

  /*发卡行脚本处理*/
  this.issueScript = function(tager,func)
  {
	 var ret = top.YHAXCardReader.ICT_IssueScript(tager);
	 if(tager == 0x71){
		top.cardreader.busiAuthor(func);
	 }
	 else{
		 if(ret != 0){
			 // 记录终端流水
			 top.journalPrinter.addJournal("发卡行脚本处理失败 ");
			 top.pool.set("strScriptRes","N");
			 //电子现金解锁交易不执行脚本通知
			 if(top.pool.get("isLockTrans")=="1"){
				if(typeof(eval(func))=="function")
				{
					eval(func+"();");
				}	
			 }else{
				//写卡失败后发起脚本通知交易
				top.wins.showNewProcessingTip(top.langcur.oProcessingTipDef);
				top.trans.send902209Async(func);				 
			 }
		 }else{			 
			 top.pool.set("strScriptRes","Y");
			 //电子现金解锁交易不执行脚本通知
			if(top.pool.get("isLockTrans")=="1"){
				if(typeof(eval(func))=="function")
				{
					eval(func+"();");
				}	
			 }else{
				//写卡成功后发起脚本通知交易
				top.wins.showNewProcessingTip(top.langcur.oProcessingTipDef);
				top.trans.send902209Async(func);			 
			 }
		 }
	 }
   }

  /*查询卡芯片余额*/
  this.queryBalance = function()
  {
    var strICData = top.YHAXCardReader.ICT_GetDataEx(0x9F79);
	var ret = strICData.split("|")[0];
	if(ret != 0){
	   // 记录终端流水
       top.journalPrinter.addJournalWithTime("电子现金余额查询失败 ");
	   if (typeof(top.MainFrame.onServiceFailed) == "function"){
          top.MainFrame.onServiceFailed("电子现金余额查询失败",top.TERMRETCODE_IC_BALANCEQUERY,"电子现金余额查询失败");
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

  /*查询卡芯片交易明细*/
  this.queryLoadDetail = function()
  {
    var strICInfoData = top.YHAXCardReader.ICT_GetLoadDetailEx(900);
	var ret = strICInfoData.split("|")[0];
	if(ret != 0 || strICInfoData.split("|")[1] < 90){//IC卡芯片的每条记录的长度等于90
	   // 记录终端流水
       top.journalPrinter.addJournalWithTime("电子现金交易明细查询失败 ");
	   if (typeof(top.MainFrame.onServiceFailed) == "function"){
          top.MainFrame.onServiceFailed("电子现金交易明细查询失败",top.TERMRETCODE_IC_QUERYLOADDETAIL,"电子现金交易明细查询失败");
	   }
	}else{
	  if (typeof(top.MainFrame.onServiceSuccessful) == "function"){
          top.MainFrame.onServiceSuccessful(new top.StringCtrl(strICInfoData.split("|")[2]).trim());
	  }
	}
  }

  /*读卡器禁止卡插入的事件响应*/
  this.onCardAcceptCancelled = function()
  {
    top.journalPrinter.addJournalWithTime("读卡器读卡取消 CardReader Event onCardAcceptCancelled ");
    top.cardreader.CardReadEvents.clearAll();
	// 控制指示灯
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}
    if (typeof(top.MainFrame.onCardAcceptCancelled) == "function"){
      top.MainFrame.onCardAcceptCancelled();
	}
  }

  /*读卡超时的事件响应*/
  this.onTimeout_accept = function()
  {
    top.journalPrinter.addJournalWithTime("读卡器读卡超时 CardReader Event onTimeout" );
	top.cardreader.CardReadEvents.clearAll();
    // 控制指示灯
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}

    if (typeof(top.MainFrame.onTimeout_accept) == "function")
      top.MainFrame.onTimeout_accept();
  }

  /*读卡器卡已经插入的事件响应*/
  this.onCardInserted = function()
  {
    top.journalPrinter.addJournalWithTime("卡已经插入  CardReader Event onCardInserted");
    // 控制指示灯
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}

    if (typeof(top.MainFrame.onCardInserted) == "function")
      top.MainFrame.onCardInserted();
  }

  /*读卡器卡已经被受理的事件响应*/
  this.onCardAccepted = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("卡已经受理 CardReader Event onCardAccepted");
    top.cardreader.CardReadEvents.clearAll();
	var chipId = new top.StringCtrl("").byteArr2HexStr(top.YHAXCardReader.AnswerToReset);
	var track2 = top.YHAXCardReader.Track2;
	var track3 = top.YHAXCardReader.Track3;
    if(chipId !=null && chipId !=""){//IC卡
	     top.wins.showNewProcessingTip("正在读取卡信息，请稍候...");
	     top.cardreader.ICTask();
	}
	else{//磁条卡
	    top.pool.set("strICFlag", "0");
		top.pool.set("strTrack2", track2);
		top.pool.set("strTrack3", track3);
		top.pool.set("strPan",track2.split("=")[0]);
		top.pool.set("strField55", this.strField55Value);
		top.YHAXPinPad.PinMode = "NORMAL";//密码键盘设置普通模式
		top.YHAXCardReader.ICT_SetValue(0xDF69,"00");//设置缓冲区国密算法标志
		top.pool.set("strEncrypType", "NORMAL");
		if (typeof(top.MainFrame.onCardAccepted) == "function"){
			top.MainFrame.onCardAccepted();
		}
	}
  }

  /*读卡器发现无效卡的事件响应*/
  this.onCardInvalid = function()
  {
    top.journalPrinter.addJournalWithTime("无效卡 CardReader Event onCardInvalid");
    top.cardreader.CardReadEvents.clearAll();
    if (typeof(top.MainFrame.onCardInvalid) == "function")
      top.MainFrame.onCardInvalid();
  }


   /*读卡器卡已经被退出的事件响应*/
  this.onCardEjected = function()
  {
    top.journalPrinter.addJournalWithTime("卡成功退出 CardReader Event onCardEjected");
    // 控制指示灯
    try{top.guidelights.setCardReaderLight("QUICK");}catch(e){}

    // 播放提示音
    try{top.soundPlayer.TakeCardMusic();}catch(e){}

    if (typeof(top.MainFrame.onCardEjected) == "function")
      top.MainFrame.onCardEjected();
    else if (typeof(top.onCardEjected) == "function")
      top.onCardEjected();
  }

  /*读卡器卡已经被客户取走的事件响应*/
  this.onCardTaken = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("卡被取走 CardReader Event onCardTaken" );

    top.cardreader.CardReadEvents.clearAll();
    // 控制指示灯
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}

    if (typeof(top.MainFrame.onCardTaken) == "function")
      top.MainFrame.onCardTaken();
    else if (typeof(top.onCardTaken) == "function")
      top.onCardTaken();
  }

   /*退出的卡超时未被客户取走的事件响应*/
  this.onTimeout_Eject = function()
  {
    top.journalPrinter.addJournalWithTime("退卡超时 CardReader Event onTimeout_Eject");
	top.cardreader.CardReadEvents.clearAll();
    // 退卡超时，自动吞卡
    top.cardreader.capture();
  }

  /*吞卡*/
  this.capture = function()
  {
    top.cardreader.CardReadEvents.clearAll();
    if (!top.YHAXCardReader.CpCanCapture)
    {
      // 不支持吞卡的读卡器，按照卡被取走处理
      top.cardreader.onCardTaken();
      return;
    }
	top.journalPrinter.addJournalWithTime("吞卡 CardReader command capture");
    top.cardreader.CardReadEvents.appendEvent("CardTaken", top.cardreader.onCardTaken);
    top.cardreader.CardReadEvents.appendEvent("CardCaptured", top.cardreader.onCardCaptured);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onDeviceError4Capture);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onDeviceError4Capture);
    top.YHAXCardReader.Capture();
  }

  /*吞卡时读卡器硬件故障的事件响应*/
  this.onDeviceError4Capture = function()
  {
    top.cardreader.CardReadEvents.appendEvent("ResetComplete", top.cardreader.onResetEnd4DevErr4CaptureRe);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onResetEnd4DevErr4CaptureRe);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onResetEnd4DevErr4CaptureRe);
    top.YHAXCardReader.Reset("RETRACT");
  }

  /*卡时读卡器硬件故障后复位结束的事件响应*/
  this.onResetEnd4DevErr4CaptureRe = function()
  {
    top.cardreader.CardReadEvents.appendEvent("ResetComplete", top.cardreader.onResetEnd4DevErr4CaptureEj);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onResetEnd4DevErr4CaptureEj);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onResetEnd4DevErr4CaptureEj);
    // 必须使用EJECT参数才能解决问题，有点危险，但是没辙。而且这里不做，空闲页面也会这么做。
    top.YHAXCardReader.Reset("EJECT");
  }


  /*吞卡时读卡器硬件故障后复位结束的事件响应*/
  this.onResetEnd4DevErr4CaptureEj = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("吞卡失败 CardReader Event onResetEnd4DevErr4CaptureEj");

    top.cardreader.CardReadEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_Idc) == "function")
      top.MainFrame.onDeviceError_Idc();
    else if (typeof(top.onDeviceError_Idc) == "function")
      top.onDeviceError_Idc();
  }

   /*读卡器卡已经被吞入的事件响应*/
  this.onCardCaptured = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("卡被吞 CardReader command onCardCaptured ");
    top.cardreader.CardReadEvents.clearAll();
	// 向服务器报告卡被回收的信息
    top.cardreader.sendCaptureStatus();
    if (typeof(top.MainFrame.onCardCaptured) == "function")
      top.MainFrame.onCardCaptured();
    else if (typeof(top.onCardCaptured) == "function")
      top.onCardCaptured();
  }

  /*读卡器硬件故障的事件响应*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("读卡器故障 CardReader Event onDeviceError");
    top.cardreader.CardReadEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_Idc) == "function")
    {
      top.MainFrame.onDeviceError_Idc();
    }else if (typeof(top.onDeviceError_Idc) == "function")
    {
      top.onDeviceError_Idc();
    }else{}
  };

  /*读卡器复位成功的事件响应*/
  this.onResetComplete = function()
  {
	top.journalPrinter.addJournalWithTime("读卡器复位成功 ");
    top.cardreader.CardReadEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete_Idc) == "function")
    {
      top.MainFrame.onResetComplete_Idc();
    }else if (typeof(top.onResetComplete_Idc) == "function")
    {
      top.onResetComplete_Idc();
    }else{}
  };

//-----------换卡-----------------//
  /*换卡吞卡*/
  this.excardcapture = function()
  {
    top.cardreader.CardReadEvents.clearAll();
    if (!top.YHAXCardReader.CpCanCapture)
    {
      // 不支持吞卡的读卡器，按照卡被取走处理
      top.cardreader.onExCardTaken();
      return;
    }
	top.journalPrinter.addJournalWithTime("换卡吞卡 CardReader command excardcapture");
    top.cardreader.CardReadEvents.appendEvent("CardTaken", top.cardreader.onExCardTaken);
    top.cardreader.CardReadEvents.appendEvent("CardCaptured", top.cardreader.onExCardCaptured);
    top.cardreader.CardReadEvents.appendEvent("DeviceError", top.cardreader.onDeviceError4Capture);
	top.cardreader.CardReadEvents.appendEvent("FatalError", top.cardreader.onDeviceError4Capture);
    top.YHAXCardReader.Capture();
  }

   /*读卡器-换卡-卡已经被客户取走的事件响应*/
  this.onExCardTaken = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("换卡被拿走 CardReader Event onExCardTaken");
    // 控制指示灯
    try{top.guidelights.setCardReaderLight("OFF");}catch(e){}

    if (typeof(top.MainFrame.onExCardTaken) == "function")
      top.MainFrame.onExCardTaken();
    else if (typeof(top.onExCardTaken) == "function")
      top.onExCardTaken();
  }

   /*读卡器-换卡-卡已经被吞入的事件响应*/
  this.onExCardCaptured = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("换卡被吞 CardReader Event onExCardCaptured");
    top.cardreader.CardReadEvents.clearAll();
	// 向服务器报告卡被回收的信息
    top.cardreader.sendEXCaptureStatus();
    if (typeof(top.MainFrame.onExCardCaptured) == "function")
      top.MainFrame.onExCardCaptured();
    else if (typeof(top.onExCardCaptured) == "function")
      top.onExCardCaptured();
  }

//------------------------- 其它辅助方法 -------------------------//

  /*判断读卡器中是否存在磁卡*/
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
  	  retReason = "开闭器异常";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_MEDIA_JAM:
  	  retReason = "卡介质被卡住";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_HARDWARE_ERROR:
  	  retReason = "读卡器故障";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_DEVICE_LOCKED:
  	  retReason = "读卡器被锁定";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_COMMAND_NOT_SUPPORTED:
  	  retReason = "命令不能执行";
  	  break;
  	  case top.IDCReadFailure.IDC_READ_CANCELLED:
  	  retReason = "命令被取消";
  	  break;
  	  default:
  	  retReason = "硬件故障";
  	}
  	return retReason;
  }

  this.getUnableToEjectReason = function(reason)
  {
    var retReason = "";
  	switch(reason)
  	{
  	  case top.IDCEjectFailure.IDC_EJECT_SHUTTER_FAILURE:
  	  retReason = "开闭器异常";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_MEDIA_JAM:
  	  retReason = "卡介质被卡住";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_NO_MEDIA:
  	  retReason = "无卡介质";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_MEDIA_RETAINED:
  	  retReason = "卡被回收";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_COMMAND_NOT_SUPPORTED:
  	  retReason = "命令不能执行";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_CANCELLED:
  	  retReason = "命令被取消";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_HARDWARE_ERROR:
  	  retReason = "硬件故障";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_DEVICE_LOCKED:
  	  retReason = "硬件被锁定";
  	  break;
  	  case top.IDCEjectFailure.IDC_EJECT_TIMEOUT:
  	  retReason = "超时未取卡";
  	  break;
  	  default:
  	  retReason = "硬件故障";
  	}
  	return retReason;
  }

  this.convertTransType =function(transType)
  {
	switch(transType) {
		case "00" : return "消费";
		case "01" : return "取款";
		case "03" : return "预授权";
		case "20" : return "退货";
		case "21" : return "存款";
		case "22" : return "差错调整";
		case "30" : return "查询";
		case "40" : return "转账";
		case "46" : return "转出";
		case "47" : return "转入";
		case "60" : return "指定账户充值";
		case "62" : return "非绑定账户充值";
		case "63" : return "现金充值";
		case "64" : return "非指定账户转出充值";
		case "65" : return "非指定账户转入充值";
		case "66" : return "圈提";
		case "67" : return "临时账户划入";
		case "70" : return "改密";
		case "80" : return "安全认证";
		case "97" : return "补登充值";
		case "98" : return "修改卡内参数";
		case "99" : return "其他";
		//测试(实际数据待P端提供)
		case "11" : return "补缴";
		case "12" : return "缴存";
		case "13" : return "支取";
		case "14" : return "利息";
		case "3504" : return "整存整取";
		case "3503" : return "零存整取";
		case "3501" : return "存本取息";
		case "3502" : return "整存零取";
		case "0126" : return "三个月";
		case "0131" : return "六个月";
		case "0136" : return "一年";
		case "0141" : return "两年";
		case "0146" : return "三年";
		case "0151" : return "五年";
		  default : return "其他"
	}
  }

   this.ICTransType =function(transType)
   {
	  switch(transType) {
		case "903101" : return "40";  //转账
		case "903201" : return "40";  //转账
		case "902202" : return "60";  //充值
		case "902503" : return "70";  //改密
		  default : return "99"
	}
  }

   /*
　　 私有函数：向服务器报告卡被回收的信息
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
      reqMsg.appendNode("strExpCode", top.EXPCODE_RETRACTCARD);
	  reqMsg.appendNode("strPan", top.pool.get("strPan"));         //卡号
      reqMsg.appendNode("strMemo", "卡被回收");
      var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
      return iRet;
   }
      /*
　　 私有函数：向服务器报告卡被回收的信息
     返回：
     报告终端动作状态的结果，包括
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
	  reqMsg.appendNode("strPan", top.pool.get("strPan"));         //卡号
      reqMsg.appendNode("strMemo", "换卡回收旧卡");
      var iRet = top.exchxmlasync.doExchange(SERVICEPROCESSOR_URL, reqMsg);
      return iRet;
   }   
}

/*
  验卡流程控制类
 */
function CheckCard()
{
  /*
 　 向服务器请求验卡，使用异步发方式
  */
  this.sendCheckCardAsync = function()
  {
	//解挂交易验卡不进行IC卡交易前认证
	if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1" && top.pool.get("isNeedF55") == "1"){
	}else{
		new top.CheckCard().icCheckBeforeTrans("","");//IC卡交易前认证
	}	  
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
	  if("0" == top.pool.get("strICFlag")){
		  reqMsg.appendNode("strICFlag","021")
	  }else{
		  reqMsg.appendNode("strICFlag","051");
	  }
      var iRet = top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, this.onSendCheckCardAsyncComplete);
  }

  /*
    私有函数：与WEB服务器进行异步交互完成时的回调函数
  */
  this.onSendCheckCardAsyncComplete = function(iRet)
  {
    // 记录终端流水
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
        top.journalPrinter.addJournalWithTime(" 验卡流程成功");
		top.pool.set("CheckCardRet",iRet);
    }
    else
    {
		top.pool.set("CheckCardRet",iRet);
        top.journalPrinter.addJournalWithTime(" 验卡流程失败");
    }
	if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1" && top.pool.get("isNeedF55") == "1"){
		new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onAsyncExchangeComplete");//IC卡交易后写卡处理	
	}else{
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onAsyncExchangeComplete");//IC卡交易后写卡处理	
	}	
  }

  /*
　　 交易之前IC相关认证
     参数：strICType  交易类型 注：是指IC卡交易类型，而不是交易本身
	       strAmount  交易金额 注：要以分为单位
  */
  this.icCheckBeforeTrans = function(strICType,strAmount)
  {
	 if(top.pool.get("strICFlag") == "1" && top.cardreader.isCardPresent()){//有卡并且是IC卡的时候，才走IC认证流程
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
		top.YHAXCardReader.ICT_SetValue(0x9C,strICType); //把现有交易转换成IC卡交易类型
		top.YHAXCardReader.ICT_SetValue(0x5F57,"00");
		
		var ret = top.cardreader.terminalActAnaly();
		if(ret != 0){
			//如果是解锁交易且是电子现金已经锁定
			if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){
				// 记录终端流水
				top.journalPrinter.addJournalWithTime("锁定IC卡过滤终端行为分析 ");					
			}else{
				// 记录终端流水
				top.journalPrinter.addJournalWithTime("IC卡终端行为分析失败 ");
				if (typeof(top.MainFrame.onServiceFailed) == "function"){
				  top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_CARD_FAILED, top.langcur.oICCardTerm);
				  return;
				}
			}
		}
		//取55域数据,并保存
		top.pool.set("strField55", top.cardreader.getField55());
	}
  }

  /*
　　 交易之后IC相关处理
     参数：iRet 交易结果
	       strField55  交易返回的55域
  */
  this.icCheckAfterTrans = function(strField55,func)
  {
	  if(top.pool.get("strICFlag") == "1" && top.cardreader.isCardPresent()){//IC卡
		  //写卡结果
		  if(strField55 != null && strField55 != ""){
			 var iRet = top.cardreader.issueReport(strField55);
			 if(iRet == 0){
				 var str91 = new top.StringCtrl(top.YHAXCardReader.ICT_GetFieldEx(0x91).split("|")[1]).trim();
				 top.YHAXCardReader.ICT_SetValue(0x91,str91);
			     top.YHAXCardReader.ICT_SetValue(0x8A,"3030");
				 //解挂交易中的电子现金解锁交易不进行发卡行认证
				 if(top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){
					 iRet = 0;					 
				 }else{
					iRet = top.cardreader.exterAuth(); 
				 }			     
			     if(iRet == 0)
			     {
                     var str71 = new top.StringCtrl(top.YHAXCardReader.ICT_GetFieldEx(0x71).split("|")[1]).trim();
					 var str72 = new top.StringCtrl(top.YHAXCardReader.ICT_GetFieldEx(0x72).split("|")[1]).trim();
			         if(str72 != null && str72 != ""){//判断是否包含71和72值，没有的话，脚本通知就不需要做
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
			            top.MainFrame.onServiceFailed("交易失败", top.TERMRETCODE_CARD_FAILED, "IC卡认证失败,请联系发卡行!");
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

  /***发卡交易模块状态判断***/
  this.carddispenserStatus = function()
  {
	 //身份证、读卡器、发卡、密码键盘、摄像头
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

  /***换卡、补卡交易模块状态判断***/
  this.cardStatus = function()
  {
	 //身份证、读卡器、发卡、密码键盘、摄像头
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

  /***签约、重置密码、信用卡启用类交易模块状态判断***/
  this.cardSignStatus = function()
  {
	 //身份证、读卡器、密码键盘、摄像头
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

  /**充值、公积金、转账、缴费等交易模块状态判断***/
  this.cardTransStatus = function()
  {
	 //身份证、读卡器、密码键盘、摄像头
	 if(top.YHAXCardReader.StDeviceStatus != "HEALTHY"){
		 return top.langcur.oCardReaderError;
	 }else if(top.YHAXPinPad.StDeviceStatus != "HEALTHY"){
		return top.langcur.oPinPadError;
	 }else{
		 return "true";
	 }
  }

  /*存单开户模块**/
  this.cdStDeviceStatus = function()
  {
	 //身份证、读卡器、密码键盘、摄像头、签名、存单扫描、存单打印
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

  /*存单销户模块*/
  this.cdoutStDeviceStatus = function()
  {
	//存单受理、身份证、读卡器、密码键盘、摄像头、签名
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

  /*存单销户+开户*/
  this.cdDisStDeviceStatus = function()
  {
	//存单受理、存单开户、身份证、读卡器、密码键盘、摄像头、签名
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
