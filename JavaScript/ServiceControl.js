/*
  服务流程控制类
 */
function ServiceControl()
{
  //导航最后一次执行的id
  this.lastFlowId = 1;
  //设置交易前是否需要再次输入密码
  this.bReInputPwdBeforeTrans = true;
  // 用户操作超时时间秒数
  this.iUserTimeout = 120;
  
  //应用服务器IP
  this.strServerIP = window.location.hostname;
  //应用服务器端口号
  this.iServerPort = window.location.port;
  //监控客户端IP地址
  this.strAgentClientIp = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_DEVICE_AGENTCLIENTIP, "127.0.0.1");
  //监控客户端端口号
  this.strAgentClientPort = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_DEVICE_AGENTCLIENTPORT, "9201");
  // 制定跳转的url地址
  this.strNavigate2Url = "";
  //应用当前状态
  this.CurrentStatus = "";
  //是否要把状态发送给agent
  this.sendAgentFlag = true;
  /*
    检测远程命令
   */
  this.checkSvcCmd = function()
  {
	  //先取出监控客户端有没有最新消息发送过来,0表示有；1表示没有
      var CmdStatus = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
      //当前服务状态
      this.CurrentStatus = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SERVICESTATUS_CURRENTSTATUS, "0");
      //如果有，则先处理
      if(CmdStatus == 0){
               var Cmd = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CMD, "");
	           if(Cmd == top.AGENT_CONF_RESTART){//重启机器
	              // 记录终端流水
                  var strJrn = new top.StringCtrl("重启机器(监控命令) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
		   		  // 设置重启机器服务状态
                  top.serviceCtrl.setSvcStatus(top.TTSTATUS_RESTART); 
		          top.YHAXCommonCtrl.RestartWindows();
	           }
	           else if(Cmd == top.AGENT_CONF_SHUTDOWN){//关闭机器
	              // 记录终端流水
                  var strJrn = new top.StringCtrl("关闭机器(监控命令) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
			      // 设置关闭机器服务状态
                  top.serviceCtrl.setSvcStatus(top.TTSTATUS_SHUTDOWN);  
		          top.YHAXCommonCtrl.ShutdownWindows();
	           }
	           else if(Cmd == top.AGENT_CONF_PAUSE){//暂停服务
	              // 记录终端流水
                  var strJrn = new top.StringCtrl("暂停服务(监控命令) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
		          if(this.CurrentStatus == top.SVCSTATUS_OK){//当前是空闲是需要处理
		               //这边只修改状态，流程下面会处理
		               new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SERVICESTATUS_CURRENTSTATUS, top.SVCSTATUS_PAUSEBYMGR);
		          }
			      // 设置暂停服务状态
                  top.serviceCtrl.setSvcStatus(top.TTSTATUS_PAUSEBYMGR);  
	          }
	          else if(Cmd == top.AGENT_CONF_START){//开启服务
	              // 记录终端流水
                  var strJrn = new top.StringCtrl("开启服务(监控命令) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
		          if(this.CurrentStatus != top.SVCSTATUS_OK){//当前不是空闲是需要处理
		              //这边只修改状态，流程下面会处理
		              new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SERVICESTATUS_CURRENTSTATUS, top.SVCSTATUS_OK);
		          }
		   		  // 设置正常服务状态
                  top.serviceCtrl.setSvcStatus(top.TTSTATUS_OK);
	          }
	          else if(Cmd == top.AGENT_CONF_CONNECT){//心跳连接命令
	              var strJrn = new top.StringCtrl("监控客户端连接请求(监控命令) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
		          //先发送正常服务通知给agent
	              var strStatus = "";
		          //取出最新的状态，开始进行流程处理
                  this.CurrentStatus = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SERVICESTATUS_CURRENTSTATUS, "0");
	              if(this.CurrentStatus == top.SVCSTATUS_OK){
	                   strStatus = top.TTSTATUS_OK;
	              }
	              else if(this.CurrentStatus == top.SVCSTATUS_PAUSEBYDEV){
	                   strStatus = top.TTSTATUS_INMAINTENANCE;
	              }
	              else if(this.CurrentStatus == top.SVCSTATUS_PAUSEBYMGR){
                      strStatus = top.TTSTATUS_PAUSEBYMGR;
	              }
	              else{
	                  strStatus = top.TTSTATUS_OK;
	              }
	              // 设置当前状态
                  top.serviceCtrl.setSvcStatus(strStatus); 
	          }
      }
      //取出最新的状态，开始进行流程处理
      this.CurrentStatus = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SERVICESTATUS_CURRENTSTATUS, "0");
      //先把当前最新的状态发送给agent
      if(this.sendAgentFlag){  
         //先发送实时状态通知给agent
	     var strStatus = "";
	     if(this.CurrentStatus == top.SVCSTATUS_OK){
	         strStatus = top.TTSTATUS_OK;
	     }
	     else if(this.CurrentStatus == top.SVCSTATUS_PAUSEBYDEV){
	         strStatus = top.TTSTATUS_INMAINTENANCE;
	     }
	     else if(this.CurrentStatus == top.SVCSTATUS_PAUSEBYMGR){
             strStatus = top.TTSTATUS_PAUSEBYMGR;
	     }
	     else{
	         strStatus = top.TTSTATUS_OK;
	    }
	 	// 设置当前状态
        top.serviceCtrl.setSvcStatus(strStatus); 
        this.sendAgentFlag = false;
     }
  }
  /*
    设置当前服务状态
   */
  this.setSvcStatus = function(status)
  {
	  top.pool.set("devStatus",status);
      //报文数据
	  var strRequestData = "MSU" + new top.StringCtrl(""+top.terminal.strTerminalNum).suffixStr(' ', 8) + status;
	  var ret = top.YHAXCommonCtrl.SendBufferedData(this.strAgentClientIp,parseInt(this.strAgentClientPort),strRequestData);
	  if(ret == true){
	     //记录流水
		 strJrn = new top.StringCtrl("发送监控命令成功 "+ "     ["+strRequestData+"]" + new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	     top.journalPrinter.addJournal(strJrn);
	  }else{
	     //记录流水
	     strJrn = new top.StringCtrl("发送监控命令失败 "+ "     ["+strRequestData+"]" + new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	     top.journalPrinter.addJournal(strJrn);
	  }
  }
  
  /*
   * 请求版本更新
   */
  this.SendUpdateVersion = function()
  {
    //报文数据
	  var strRequestData = top.pool.get("strRequestData");
	  var ret = top.YHAXCommonCtrl.SendBufferedData(this.strAgentClientIp,parseInt(this.strAgentClientPort),strRequestData);
	  if(ret == true){
	     //记录流水
		 strJrn = "发送监控命令成功 "+ "     ["+strRequestData+"]";
	     top.journalPrinter.addTimeoutWithTime(strJrn);
	  }else{
	     //记录流水
	     strJrn = "发送监控命令失败 "+ "     ["+strRequestData+"]";
	     top.journalPrinter.addTimeoutWithTime(strJrn);
	  }
	  return ret;
   }
  /*
  向监控发送密码锁状态
  参数：密码锁状态
 */
  this.sendEleLockStatus = function(EleLokStatus)
  {
	//报文数据
	  var strRequestData = "MLS" 
		  + new top.StringCtrl(""+top.terminal.strTerminalNum).suffixStr(' ', 8)
		  + new top.StringCtrl(""+top.pool.get("devStatus")).suffixStr(' ', 1)
		  + new top.StringCtrl(""+EleLokStatus).suffixStr(' ', 16)
		  + new top.StringCtrl(""+top.pool.get("EleLockSign")).suffixStr(' ', 1);
	  var ret = top.YHAXCommonCtrl.SendBufferedData(this.strAgentClientIp,parseInt(this.strAgentClientPort),strRequestData);
	  if(ret == true){
	     //记录流水
		 strJrn = "发密码锁状态到监控成功 "+ "     ["+strRequestData+"]";
	     top.journalPrinter.addJournalWithTime(strJrn);
	  }else{
	     //记录流水
	     strJrn = "发密码锁状态到监控失败 "+ "     ["+strRequestData+"]";
	     top.journalPrinter.addJournalWithTime(strJrn);
	  }
  }
  /*跳转至插卡页面*/
  this.navigate2InsertCard = function()
  {
    this.navigate2("/Service/CardReader.html");
  }
  /*跳转至信用卡二级菜单*/
  this.navigate2Quit_CreditCardMenu = function()
  {
    this.navigate2("/Service/CreditCardMenu.html");
  }
  /*跳转至空闲*/
  this.navigate2Idle = function()
  {
	if(top.terminal.isSmartTeller){
		this.navigate2("/Service/Idle.html");
	
	}else{
		this.navigate2("/ServiceMV/Idle.html");
	}
    // 往空闲页面不需要超时保护，以避免可能的死循环现象。
    top.wins.stopProcessingTimeout();
  }
  /*跳转至空闲移动终端*/
  this.navigate2IdleMV = function()
  {
    this.navigate2("/ServiceMV/Idle.html");
	// 往空闲页面不需要超时保护，以避免可能的死循环现象。
    top.wins.stopProcessingTimeout();
  }
  
  /*跳转至密码输入页面*/
  this.navigate2InputPin = function()
  {
    this.navigate2("/Service/InputPin.html");
  }
  
  /*跳转至服务菜单页面*/
  this.navigate2ServiceMenu = function()
  {
    top.serviceCtrl.navigate2("/Service/ServiceMenu.html");
  }
  
  /*跳转至二级菜单页面*/
  this.navigate2SecondMenu = function()
  {
    top.serviceCtrl.navigate2("/Service/SecondMenu.html");
  }
  
  /*跳转至管机员菜单页面*/
  this.navigate2Maintenance = function()
  {
	  top.journalPrinter.addJournalWithTime("客户选择 返回，返回到管机员菜单");
    top.serviceCtrl.navigate2("/Maintenance/Menu_Maintenance.html");
  }
  
  /*跳转至服务返回页面*/
  this.navigate2Return = function()
  {
    top.wins.showProcessingTip("");
    this.startFlowCtrlTimeout(this.navigate2Return_F, 20);
  }
  
  this.navigate2Return_F = function(url)
  {
	if(top.cardreader.isCardPresent())
    {
    	top.serviceCtrl.navigate2SecondMenu();
    }else{
		top.serviceCtrl.navigate2Idle();
    }
  }
  
  /*跳转至打印凭条页面*/
  this.navigate2PrintReceipt = function()
  {
    this.navigate2("/Service/PrintReceipt.html");
  }
  
  this.navigate2 = function(url)
  {
    if (url.length < 8)
      return;
    if (top.document.all.ProcessingAdFrame.style.visibility == "hidden")
      top.wins.showProcessingTip("");
    /*停止所有计时逻辑*/
    this.stopCountDown();
    	this.stopTipTick();
    this.stopFlowCtrlTimeout();
    this.stopUserTimeout();
	
    if (top.document.all.ProcessingAdFrame.style.visibility == "hidden")
      top.wins.showProcessingTip("");

    this.strNavigate2Url = url.substring(url.lastIndexOf('/Service/'));   
    top.serviceCtrl.navigate2_F();
  }
  
  this.navigateMV2 = function(url)
  {
    if (url.length < 8)
      return;
    if (top.document.all.ProcessingAdFrame.style.visibility == "hidden")
      top.wins.showProcessingTip("");
    /*停止所有计时逻辑*/
    this.stopCountDown();
    	this.stopTipTick();
    this.stopFlowCtrlTimeout();
    this.stopUserTimeout();
	
    if (top.document.all.ProcessingAdFrame.style.visibility == "hidden")
      top.wins.showProcessingTip("");

    this.strNavigate2Url = url.substring(url.lastIndexOf('/ServiceMV/'));   
    top.serviceCtrl.navigate2_F();
  }
  
   /*跳转至指定的流程页面*/
  this.navigate2_F = function()
  {
    /*为防止NT操作系统的机器在连接时等待过长时间，先测试线路	*/
    if (this.strNavigate2Url != "about:blank" && !new top.ExchangeXmlWithHost().IsServerOnLine())
    {
      top.onServerErr_Def("MainFrame", "Net offline (navigate)");
      return;
    }
    top.MainFrame.navigate(".."+top.serviceCtrl.strNavigate2Url);
  }
  
  /*流程计时处理*/
  this.iTimerId_FlowCtrlTimeout = null;
  this.startFlowCtrlTimeout = function(doFunc, mstimeout)
  {
    this.stopFlowCtrlTimeout();
    this.iTimerId_FlowCtrlTimeout = setTimeout(doFunc, mstimeout);
	top.journalPrinter.addTimeoutWithTime("   FlowCtrl开启：" + this.iTimerId_FlowCtrlTimeout);
	
  }
  
  /*
    流程控制超时到达时的处理
   */
  this.onFlowCtrlTimeout = function()
  {
    top.serviceCtrl.iTimerId_FlowCtrlTimeout = null;
  }
  
  /*停止流程控计时处理*/
  this.stopFlowCtrlTimeout = function()
  {
    if (this.iTimerId_FlowCtrlTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("   FlowCtrl关闭：" + this.iTimerId_FlowCtrlTimeout);
      clearTimeout(this.iTimerId_FlowCtrlTimeout);
      this.iTimerId_FlowCtrlTimeout = null;
    }
    if (top.serviceCtrl.iTimerId_FlowCtrlTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("   FlowCtrl关闭top：" + this.iTimerId_FlowCtrlTimeout);
      top.clearTimeout(top.serviceCtrl.iTimerId_FlowCtrlTimeout);
      top.serviceCtrl.iTimerId_FlowCtrlTimeout = null;
    }
  }
  
  /*在通讯故障恢复后，转至正常页面*/
  this.CommErrAfter2Idle = function()
  {
    this.navigate2Idle();
  }
  
  /*在通讯故障恢复后，转至正常页面*/
  this.CommErrAfter2IdleMV = function()
  {
    this.navigate2IdleMV();
  }
  
   /*业务处理时加载交易广告*/
  this.doWithProcessingAd = function(doFunc)
  {
    top.wins.showProcessingAd();
    this.startFlowCtrlTimeout(doFunc, 20);
  }
  
  /*流程处理页面计时处理*/
  this.iTimerId_UserTimeout = null;
  this.startUserTimeout = function(funcontmout, timeout, otiptext)
  {
  	this.stopTipTick2();
    this.stopUserTimeout();
    
    if (timeout == null || timeout <= 0)
    {
      timeout = top.serviceCtrl.iUserTimeout;
    }
    try{this.iTimerId_UserTimeout = top.MainFrame.setTimeout(funcontmout, timeout*1000);}catch(e){}
	top.journalPrinter.addTimeoutWithTime("   User开启：" + this.iTimerId_UserTimeout);
    if (otiptext != null)
    {
      this.startTipTick(timeout, otiptext);
    }
  }
  
  /*停止流程处理页面的计时处理*/
  this.stopUserTimeout = function()
  {
  	top.wins.stopProcessingTimeout();
    if (top.serviceCtrl.iTimerId_UserTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("   User关闭top：" + top.serviceCtrl.iTimerId_UserTimeout);
      top.MainFrame.clearTimeout(top.serviceCtrl.iTimerId_UserTimeout);
      top.serviceCtrl.iTimerId_UserTimeout = null;
    }
	if (this.iTimerId_UserTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("   User关闭：" + this.iTimerId_UserTimeout);
      clearTimeout(this.iTimerId_UserTimeout);
      this.iTimerId_UserTimeout = null;
    }
  }
  
  /*停止倒计时显示*/
  this.stopCountDown = function()
  {
    if (this.iTimerId_Tip != null)
    {
      top.MainFrame.clearInterval(this.iTimerId_Tip);
      this.iTimerId_Tip = null;
    }
  }
  
  /*
    转至服务返回 
   */
  this.navigate2Quit = function()
  {
    // 抽奖时的同步调用会导致页面停顿，所以先切出等待画面
    top.wins.showProcessingTip("");
	if(top.terminal.isSmartTeller){
		this.startFlowCtrlTimeout(this.navigate2Quit_F, 100);
	}else{
		this.startFlowCtrlTimeout(this.navigate2Quit_FMV, 100);
	}
  }
  
  /*
    内部函数：转至退出服务
   */
  this.navigate2Quit_F = function()
  {
    top.serviceCtrl.navigate2("/Service/Quit.html");
  }
  
  /*
   转至服务返回 
  */
 this.navigate2QuitMV = function()
 {
   // 抽奖时的同步调用会导致页面停顿，所以先切出等待画面
   top.wins.showProcessingTip("");
   this.startFlowCtrlTimeout(this.navigate2Quit_FMV, 100);
 }

 /*
   内部函数：转至退出服务
  */
 this.navigate2Quit_FMV = function()
 {
   top.serviceCtrl.navigate2("/ServiceMV/Quit.html");
 }
  
  /*
   转至退身份证页面 
  */
  this.navigate2QuitID = function()
  {
    // 抽奖时的同步调用会导致页面停顿，所以先切出等待画面
    top.wins.showProcessingTip("");
    this.startFlowCtrlTimeout(this.navigate2Quit_ID, 100);
  }
  
  /*
    内部函数：转至退出服务
  */
  this.navigate2Quit_ID = function()
  {
    top.serviceCtrl.navigate2("/Service/QuitIDCard.html");
  }
  
  /*
   转至退身份证页面 
  */
  this.navigate2QuitIDMV = function()
  {
    // 抽奖时的同步调用会导致页面停顿，所以先切出等待画面
    top.wins.showProcessingTip("");
    this.startFlowCtrlTimeout(this.navigate2Quit_IDMV, 100);
  }
 
  /*
    内部函数：转至退出服务
  */
  this.navigate2Quit_IDMV = function()
  {
    top.serviceCtrl.navigate2("/ServiceMV/QuitIDCard.html");
  }
  
  /*
    转至退存单页面  
  */
  this.navigate2QuitCD = function()
  {
    // 抽奖时的同步调用会导致页面停顿，所以先切出等待画面
    top.wins.showProcessingTip("");
    this.startFlowCtrlTimeout(this.navigate2Quit_CD, 100);
  }
  
  /*
    内部函数：转至退出服务
  */
  this.navigate2Quit_CD = function()
  {
    top.serviceCtrl.navigate2("/Service/QuitDepositRpt.html");
  }
  

  
  /*
    开始提示计时，用于向用户进行数秒提示等
    参数：
      timeout   计时间隔秒数
      otiptext  显示计时数的HTML页面对象
   */
  this.iTimerId_Tip = null;
  this.oTipText = null;
  this.startTipTick = function(timeout, otiptext)
  {
    // 终止先前设置的计时器
    this.stopTipTick();
    //this.stopTipTick2();
    this.iTipTimeout = timeout;
    this.oTipText = otiptext;
    this.iTimerId_Tip = top.MainFrame.setInterval(this.onTipTick, 1*1000);
    // 首先执行一次，避免空等一次间隔
    this.onTipTick();
  }

  /*
    私有函数：当提示计时到达时的响应
   */
  this.onTipTick = function()
  {
    try
    {
    	
      top.serviceCtrl.oTipText.innerHTML = new top.StringCtrl(""+top.serviceCtrl.iTipTimeout).prefixStr(' ', 2);
      if (top.serviceCtrl.iTipTimeout > 1)
        top.serviceCtrl.iTipTimeout--;
    }
    catch(e)
    {
      top.serviceCtrl.stopTipTick();
    }
  }

  /*
    终止提示计时
   */
  this.stopTipTick = function()
  {
    //if (this.iTimerId_Tip2 != null)
    //{  	
      //top.MainFrame.clearInterval(this.iTimerId_Tip2);
      //top.ProcessingAdFrame.clearInterval(this.iTimerId_Tip2);
      //this.iTimerId_Tip2 = null;
    	 //this.oTipText2 = null;
    //}
    if(this.iTimerId_Tip != null)
    {
    	top.MainFrame.clearInterval(this.iTimerId_Tip);
    	
    	//top.ProcessingAdFrame.clearInterval(this.iTimerId_Tip);
    	 this.iTimerId_Tip = null;
    	 this.oTipText = null;
    	 
    }
  }
  
  this.iTipTimeout2=0;
  this.iTimerId_Tip2=null;
  this.oTipText2=null;
  this.startTipTick2 = function(timeout, otiptext)
  {
    // 终止先前设置的计时器
    this.stopTipTick2();
    //this.stopTipTick();
    this.iTipTimeout2 = timeout;
    this.oTipText2 = otiptext;
    this.iTimerId_Tip2 = top.MainFrame.setInterval(this.onTipTick2, 1*1000);
    // 首先执行一次，避免空等一次间隔
    this.onTipTick2();
  }

this.onTipTick2 = function()
  {
    try
    {
    	
      top.serviceCtrl.oTipText2.innerHTML = new top.StringCtrl(""+top.serviceCtrl.iTipTimeout2).prefixStr(' ', 2);
      if (top.serviceCtrl.iTipTimeout2 > 1)
        top.serviceCtrl.iTipTimeout2--;
    }
    catch(e)
    {
      top.serviceCtrl.stopTipTick2();
    }
  }
  /*
    终止提示计时
   */
  this.stopTipTick2 = function()
  {
    if (this.iTimerId_Tip2 != null)
    {  	
      
    	top.MainFrame.clearInterval(this.iTimerId_Tip2);
    	
    	//top.ProcessingAdFrame.clearInterval(this.iTimerId_Tip2);
    	
      this.oTipText2 = null;
      this.iTimerId_Tip2 = null;
    }
    //if(this.iTimerId_Tip != null)
    //{
    	//top.MainFrame.clearInterval(this.iTimerId_Tip);
    	//top.ProcessingAdFrame.clearInterval(this.iTimerId_Tip);
    	 //this.oTipText = null;
    	 //this.iTimerId_Tip = null;
    //}
  }
  /*
   *为流程处理页面做前期准备
   *doc 页面document对象
   *win 页面window对象
   *serverEntrance 服务入口函数
   */
  this.funcServerEntrance = null;
  this.prepare4Entrance = function(doc, win, serverEntrance)
  {
    /*脚本错误的处理函数*/
    win.onerror = top.fnErrorTrap;
    /*实例化操作对象*/
    win.operateCtrl = new top.OperateControl(doc);
    /*此时禁止任何操作*/
    win.operateCtrl.disableInput(true);
    /*设置背景图片使用缓存*/
    try{doc.execCommand("BackgroundImageCache", false, true);}catch(e){}
    this.funcServerEntrance = serverEntrance;
    doc.onreadystatechange = function()
    {
      if (this.readyState == "complete"){
        top.serviceCtrl.prepare4EntranceComplete(this, top.serviceCtrl.funcServerEntrance);
	  }
    }
  }
    /*
   *流程处理页面准备完成时逻辑处理
   * doc 页面document对象
   * serverEntrance 服务入口函数
   */
  this.prepare4EntranceComplete = function(doc, serverEntrance)
  {
    new top.HtmlUtil(doc).initDocObjLangHtml();
    try
    {
      doc.styleSheets(0).cssText =
      top.document.styleSheets(0).cssText +
      top.document.styleSheets(1).cssText +
      doc.styleSheets(0).cssText;
    } catch (e){}
    top.serviceCtrl.startFlowCtrlTimeout(serverEntrance, 50);
  }
  
  //获取按键的值
  this.setValue = function(Key)
  { 
    var isFocus = top.MainFrame.document.activeElement.id;//判断当前是否是输入
	if(isFocus == null || isFocus == ""){
		if(!isNaN(Key)){//数字
		   if (typeof(top.MainFrame.onChangeNum) == "function"){
		      top.MainFrame.onChangeNum(Key);
		   }
	    }
		else if(Key == "CANCEL"){//取消键
		   if (typeof(top.MainFrame.onKey_Cancel) == "function"){
		      top.MainFrame.onKey_Cancel();
	       }
	    }
		else if(Key == "ENTER"){//确认键
		   if (typeof(top.MainFrame.onKey_Enter) == "function"){
		      top.MainFrame.onKey_Enter();
	       }
		}
	}else{
        this.inputVaue = top.MainFrame.document.getElementById(top.MainFrame.document.activeElement.id).value;//获取文本框的值
		var maxLength = top.MainFrame.document.getElementById(top.MainFrame.document.activeElement.id).maxLength;//获取文本框标签的maxlength属性
	    var len = this.inputVaue.length;//获取文本框值的长度
	    if( Key == "BACKSPACE"){//退格键
            if (len > 0) {
               this.inputVaue = this.inputVaue.substring(0, len - 1);
            }
	    }
	    else if(Key == "CLEAR"){//清除键
		   this.inputVaue = "";
	    }
	    else if(Key == "CANCEL"){//取消键
		   if (typeof(top.MainFrame.onKey_Cancel) == "function"){
			  this.inputVaue = "";
		      top.MainFrame.onKey_Cancel();
	       }
	    }
		else if(Key == "ENTER"){//确认键
		   if (typeof(top.MainFrame.onKey_Enter) == "function"){
			  this.inputVaue = "";
		      top.MainFrame.onKey_Enter();
	       }
		}
	    else if(!isNaN(Key) || Key == "."){//数字或小数点
		   if(len < maxLength){
			   this.inputVaue = this.inputVaue + Key;
		   }
	    }
	    else if(Key.length == 1 && new top.StringCtrl(Key).isLetter()){//字母
		   if(len < maxLength){
		      this.inputVaue = this.inputVaue + Key;
		   }
	    }
		//判断输入的最大长度
        if(this.inputVaue.length > maxLength){
			this.inputVaue = this.inputVaue.substring(0, maxLength);
		}
	    top.MainFrame.document.getElementById(top.MainFrame.document.activeElement.id).value=this.inputVaue;
	    if (typeof(top.MainFrame.CheckValue) == "function"){
		    top.MainFrame.CheckValue();
	    }
	}
  }
  
  //修改导航条状态
  this.changeNaviStatus = function(id) {
	   var node = top.MainFrame.document.getElementById("node"+id);
	   if(id == 1){
		  this.lastFlowId = 1;
	      //修改本节点
	      node.className = "stepStatusIconOn";
	   }
	   else{
	     var nodeline1 = top.MainFrame.document.getElementById("nodeline"+(id-1)+"1");
	     var nodeline2 = top.MainFrame.document.getElementById("nodeline"+(id-1)+"2");
	      
         //修改节点连接线状态
	     if(nodeline1 !=null){
	       nodeline1.className = "stepLineOn";
	     }
	     if(nodeline2 !=null){
	       nodeline2.className = "stepLineOn";
	     }
         //修改节点状态
	     //修改本节点
	     node.className = "stepStatusIconOn"; 
	     //修改已经完成的节点
	     for(var i =1;i<id; i++){
		    var nodeOff = top.MainFrame.document.getElementById("node"+i);
            nodeOff.className = "stepStatusIconOff";
		 }
	  }
	  //回退的时候，后面的流程全部复位成未完成
	  if(parseInt(id) < this.lastFlowId){
		  for(var j =id;j<this.lastFlowId; j++){
			  //修改节点状态
			  var nodeInit = top.MainFrame.document.getElementById("node"+(parseInt(j)+1));
			  nodeInit.className = "stepStatusIcon";
			  //修改连接线状态
			  var nodelineInit1 = top.MainFrame.document.getElementById("nodeline"+j+"1");
	          var nodelineInit2 = top.MainFrame.document.getElementById("nodeline"+j+"2");
			  nodelineInit1.className = "stepLine";
			  nodelineInit2.className = "stepLine";
		  }
	  }
	  this.lastFlowId = id;
   }
}