/*
  界面显示控制类
 */
function Windows()
{
  // 用户界面风格
  this.strCurUiStyle = "";
  // 正在处理广告是否就绪可用
  this.processingAdFrmReady = false;
  /*
    控制窗口显示
    参数1：doc     页面文档对象
    参数2：winid   页面中子窗口（DIV或IFRAM层）的Id
   */
  this.show = function(doc, winid)
  {
	top.wins.stopProcessingTimeout();
    if (winid == null || winid.length == 0)
      return;
    try{window.external.BringToForeground();}catch(e){}
    doc.parentWindow.focus();
    var url = doc.body.currentStyle.backgroundImage;
    if(winid != "MainFrame")
    {
    	var box = doc.getElementById("appendID");
    	if(box)
    	{
    		box.parentNode.removeChild(box);
    	}
    	
    	var customStatus = top.pool.get("customStatus");
    	if(winid.indexOf("Processing")<0 && customStatus !="1" )//正在处理的过度页面不增加,管机员页面不增加
    	{//动态增加呼叫大堂经理按钮
    	var div = doc.createElement('div');
    	if(url.indexOf("3")>=0  || url == "none")//url是页面背景图片的地址,背景图的名称包含2或3,用来区分,none是空闲页
    	{
    		div.innerHTML="<button onclick=\"top.wins.padAssist(this)\"  style=\"position: absolute;left: 81%;top: 3%;width:212px;height:46px;color:#FFFFFF;font-family:微软雅黑;font-size: 24px;background-image: url('../Terminal/Style/Default/Img/Main_btn3.png');BORDER:#FFFFFF 0px solid;cursor:pointer;background-color:transparent;letter-spacing: 6px;\">&nbsp;&nbsp;&nbsp;大堂经理</button>";
    	}else{
            div.innerHTML="<button onclick=\"top.wins.padAssist(this)\"  style=\"position: absolute;left: 81%;top: 3%;width:212px;height:46px;color:#3e80ca;font-family:微软雅黑;font-size: 24px;background-image: url('../Terminal/Style/Default/Img/Main_btn2.png');BORDER:#FFFFFF 0px solid;cursor:pointer;background-color:transparent;letter-spacing: 6px;\">&nbsp;&nbsp;&nbsp;大堂经理</button>";
        }
        div.id = "appendID"
      
        doc.body.appendChild(div);
      }
    }
    var aNodes = doc.body.childNodes;
    for (var i=0; i<aNodes.length; i++){
	  if(aNodes[i].id != "divFlowPage" && aNodes[i].id != "oLSafeQuit" && aNodes[i].id != "appendID" && aNodes[i].id != "oLGoHome" && aNodes[i].id !="infoToPic"
		 && aNodes[i].id!= "divTiannetDate"){
		  if(aNodes[i].id=="message" && "undefined"!=top.pool&&null!=top.pool) {
			var strUserlevel=top.pool.get("maintenance_userlevel");
			if(strUserlevel=="1"||strUserlevel=="0"){
				aNodes[i].style.visibility = "visible";
			}else
				aNodes[i].style.visibility = "hidden";
		  }else
		  aNodes[i].style.visibility = aNodes[i].id==winid ? "visible" : "hidden";		
	  }
	}
  }

  this.iTimerId_910304Timeout = null;
  this.iTimerId_910304Time = 0;
  this.padAssist = function(doc)
  {
	  this.stop910304Tick();
	  top.wins.iTimerId_910304Time = 0;
  	  doc.disabled = true;
	  top.trans.send910304ExAsync();//大堂经理协助
	  this.iTimerId_910304Timeout = top.setInterval(function()
	       {
	          top.wins.iTimerId_910304Time ++;
	          if(parseInt(top.wins.iTimerId_910304Time) == 10) {
                   top.wins.stop910304Tick();
	               doc.innerHTML = "&nbsp;&nbsp;&nbsp;大堂经理";
		           doc.disabled = false;
	          }
	          else {
		           var printnr = 10 - parseInt(top.wins.iTimerId_910304Time);
		           doc.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;呼叫中"  + printnr ;
	          }  	
	  }, 1000);
   }
  
    /*停止流程处理页面的计时处理*/
  this.stop910304Tick = function()
  {
	  if (this.iTimerId_910304Timeout != null)
      {
           top.clearInterval(this.iTimerId_910304Timeout);
           this.iTimerId_910304Timeout = null;
      }
  }
  /*
    控制窗口显示
    参数：winid   页面中子窗口（DIV或IFRAM层）的Id
   */
  this.showMain = function(winid)
  {
    // 1. 让MainFrame窗口可见
    this.show(top.document, "MainFrame");
    top.MainFrame.focus();
    // 2. 显示MainFrame中的子窗口
    this.show(top.MainFrame.document, winid);
  }

  /*
    显示正在处理广告
    如果处理广告可用，则显示广告，否则显示正在处理提示
   */
  this.showProcessingAd = function()
  {
    if (this.processingAdFrmReady)
	{
      top.wins.show(top.document, "ProcessingAdFrame");
      top.wins.startProcessingTimeout();
	}
    else
	{
      this.showProcessingTip2("");
	}
  }
  
  /*
    显示正在处理提示
   */
  this.showProcessingTip = function(tiphtml)
  {  
    if (tiphtml != null && tiphtml.length > 0){
      top.document.getElementsByName("ProcessingTipContent")[0].innerHTML = tiphtml;
	}
    else{
      top.document.getElementsByName("ProcessingTipContent")[0].innerHTML = top.langcur.oProcessingTipDef;
	}
    top.wins.show(top.document, "oLProcessingTip");
	top.serviceCtrl.startTipTick2(top.iUserTimeout, document.all.oInpProcessTick);
	top.wins.startProcessingTimeout();
  }
  
  /*
    交易过程中显示正在处理提示
   */
  this.showNewProcessingTip = function(tiphtml)
  { 
    if (tiphtml != null && tiphtml.length > 0){
      top.document.getElementsByName("ProcessingTipNewContent")[0].innerHTML = tiphtml;
	}
    else{
      top.document.getElementsByName("ProcessingTipNewContent")[0].innerHTML = top.langcur.oProcessingTipDef;
	}
    top.wins.show(top.document, "oLNewProcessingTip");
	if(tiphtml == top.langcur.oCheckLoading){
		top.serviceCtrl.startTipTick2(top.iPadCheckTimeout, document.all.oInpNewProcessTick);
		top.wins.startPADCheckProcessingTimeout();
	}else if(tiphtml == top.langcur.oDrawTransLoading){
		top.serviceCtrl.startTipTick2(top.iUserTimeout, document.all.oInpNewProcessTick);
		top.wins.startDrawProcessingTimeout();
	}else{
		top.serviceCtrl.startTipTick2(top.iUserTimeout, document.all.oInpNewProcessTick);
		top.wins.startProcessingTimeout();
	}
  }
  
  /*
    显示正在处理提示
   */
  this.showProcessingTip2 = function(tiphtml)
  {
    if (tiphtml != null && tiphtml.length > 0)
      top.document.getElementsByName("ProcessingTipContent")[0].innerHTML = tiphtml;
    else
      top.document.getElementsByName("ProcessingTipContent")[0].innerHTML = top.langcur.oProcessingTipDef;
    top.wins.show(top.document, "oLProcessingTip");
	
	top.wins.startProcessingTimeout();
  }
  
  /*
    开始正在处理超时计时
    注：
      该函数首先终止先前已经设置的超时计时器
   */
  this.iTimerId_ProcessingTimeout = null;
  this.startProcessingTimeout = function()
  {
    this.stopProcessingTimeout();
	this.iTimerId_ProcessingTimeout = top.setTimeout(top.wins.onProcessingTimeout, top.iUserTimeout*1000);
	top.pool.set("strTimeoutID", this.iTimerId_ProcessingTimeout);
	top.journalPrinter.addTimeoutWithTime("Process开启：" + this.iTimerId_ProcessingTimeout);
  }

    /*
    PAD审核开始正在处理超时计时
    注：
      该函数首先终止先前已经设置的超时计时器
   */
  this.iTimerId_ProcessingTimeoutPad = null;
  this.startPADCheckProcessingTimeout = function()
  {
    this.stopProcessingTimeout();
	this.iTimerId_ProcessingTimeoutPad = top.setTimeout(top.wins.onProcessingTimeoutPad, top.iPadCheckTimeout*1000);
	top.pool.set("strTimeoutID", this.iTimerId_ProcessingTimeoutPad);
	top.journalPrinter.addTimeoutWithTime("PAD开启：" + this.iTimerId_ProcessingTimeoutPad);
  }
 /*
    开始正在处理超时计时-取款交易
    注：
      该函数首先终止先前已经设置的超时计时器
   */
  this.iTimerId_ProcessingTimeoutDraw = null;
  this.startDrawProcessingTimeout = function()
  {
    this.stopProcessingTimeout();
	this.iTimerId_ProcessingTimeoutDraw = top.setTimeout(top.wins.onProcessingTimeoutDraw, top.iUserTimeout*1000);
	top.pool.set("strTimeoutID", this.iTimerId_ProcessingTimeoutDraw);
	top.journalPrinter.addTimeoutWithTime("Draw开启：" + this.iTimerId_ProcessingTimeoutDraw);
  }
  
 
	
  
  /*
    终止正在处理超时计时
   */
  this.stopProcessingTimeout = function()
  {
    if (this.iTimerId_ProcessingTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("Process关闭：" + this.iTimerId_ProcessingTimeout);
      clearTimeout(this.iTimerId_ProcessingTimeout);
      top.clearTimeout(this.iTimerId_ProcessingTimeout);
      clearTimeout(top.wins.iTimerId_ProcessingTimeout);
	  //clearBefore100Timeout(this.iTimerId_ProcessingTimeout);
	  var id = this.iTimerId_ProcessingTimeout;
	 //往前多clear 100个id 。
	for(var i=id;(i>id-100)&&(i>0);i--){
		clearTimeout(i);
	} 
      this.iTimerId_ProcessingTimeout = null;
	  
    }
	if (top.wins.iTimerId_ProcessingTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("top.Process关闭：" + top.wins.iTimerId_ProcessingTimeout);
      top.clearTimeout(top.wins.iTimerId_ProcessingTimeout);
	  //clearBefore100Timeout(top.wins.iTimerId_ProcessingTimeout);
	  var id = top.wins.iTimerId_ProcessingTimeout;
	 //往前多clear 100个id 。
	for(var i=id;(i>id-100)&&(i>0);i--){
		clearTimeout(i);
	} 
      top.wins.iTimerId_ProcessingTimeout = null;
    }
    if (this.iTimerId_ProcessingTimeoutPad != null)
    {
	  top.journalPrinter.addTimeoutWithTime("Pad关闭：" + this.iTimerId_ProcessingTimeoutPad);
      clearTimeout(this.iTimerId_ProcessingTimeoutPad);
      top.clearTimeout(this.iTimerId_ProcessingTimeoutPad);
      clearTimeout(top.wins.iTimerId_ProcessingTimeoutPad);
	  //clearBefore100Timeout(this.iTimerId_ProcessingTimeoutPad);
	  var id = this.iTimerId_ProcessingTimeoutPad;
	 //往前多clear 100个id 。
	for(var i=id;(i>id-100)&&(i>0);i--){
		clearTimeout(i);
	} 
      this.iTimerId_ProcessingTimeoutPad = null;	  
    }	
    if (this.iTimerId_ProcessingTimeoutDraw != null)
    {
	  top.journalPrinter.addTimeoutWithTime("Draw关闭：" + this.iTimerId_ProcessingTimeoutDraw);
      clearTimeout(this.iTimerId_ProcessingTimeoutDraw);
      top.clearTimeout(this.iTimerId_ProcessingTimeoutDraw);
      clearTimeout(top.wins.iTimerId_ProcessingTimeoutDraw);
	  //clearBefore100Timeout(this.iTimerId_ProcessingTimeoutDraw);
	  var id = this.iTimerId_ProcessingTimeoutDraw;
	 //往前多clear 100个id 。
	for(var i=id;(i>id-100)&&(i>0);i--){
		clearTimeout(i);
	} 
      this.iTimerId_ProcessingTimeoutDraw = null;	  
    }	
  }

  /*
    正在处理超时后的处理
   */
  this.onProcessingTimeout = function()
  {
	top.journalPrinter.addJournalWithTime("!!!ProcessingTimeout: " + top.wins.iTimerId_ProcessingTimeout + " poolID: " + top.pool.get("strTimeoutID"));
	try
    {
      // 处理流程超时，异步调用回调函数置null，防止错误调用。
      if (top.exchxmlasync.onAsyncExchangeComplete != null)
        top.exchxmlasync.onAsyncExchangeComplete = null;
    } catch(e){}
	
	//Process的ID不为null,并PAD的ID和Draw的ID为null,才能执行回调。如果在PAD审核过程有Process的回调，这时PAD的ID不为null,也不能执行，保证PAD不终止
    if(top.wins.iTimerId_ProcessingTimeout != null && top.wins.iTimerId_ProcessingTimeoutPad == null) {
      top.wins.iTimerId_ProcessingTimeout = null;
      if (typeof(top.MainFrame.onProcessingTimeout) == "function")
      {
    	top.journalPrinter.addJournalWithTime("!!!ProcessingTimeout!!! poolID: " + top.pool.get("strTimeoutID"));
        top.MainFrame.onProcessingTimeout();
      }
      else
      {
        try{top.onServerErr_Def("MainFrame", "Process timeout.");}catch(e){}
      }
	}
  }
  
  //
  this.onProcessingTimeoutPad = function()
  {
	top.journalPrinter.addJournalWithTime("!!!ProcessingTimeoutPad: " + top.wins.iTimerId_ProcessingTimeoutPad + " poolID: " + top.pool.get("strTimeoutID"));
	try
    {
      // 处理流程超时，异步调用回调函数置null，防止错误调用。
      if (top.exchxmlasync.onAsyncExchangeComplete != null)
        top.exchxmlasync.onAsyncExchangeComplete = null;
    } catch(e){}
	// 判断PAD的ID不为NULL，同时Process的ID为NULL 才去执行回调
    if(top.wins.iTimerId_ProcessingTimeoutPad != null && top.wins.iTimerId_ProcessingTimeout == null) {
      top.wins.iTimerId_ProcessingTimeoutPad = null;
      if (typeof(top.MainFrame.onProcessingTimeout) == "function")
      {
    	top.journalPrinter.addJournalWithTime("!!!ProcessingTimeout-Pad!!! poolID: " + top.pool.get("strTimeoutID"));
        top.MainFrame.onProcessingTimeout();
      }
      else
      {
        try{top.onServerErr_Def("MainFrame", "Process timeout.");}catch(e){}
      }
	}
  }  
  
  
  /*
    正在处理超时后的处理-draw
   */
  this.onProcessingTimeoutDraw = function()
  {
	top.journalPrinter.addJournalWithTime("!!!ProcessingTimeout-Draw: " + top.wins.iTimerId_ProcessingTimeoutDraw + " poolID: " + top.pool.get("strTimeoutID"));
	try
    {
      // 处理流程超时，异步调用回调函数置null，防止错误调用。
      if (top.exchxmlasync.onAsyncExchangeComplete != null)
        top.exchxmlasync.onAsyncExchangeComplete = null;
    } catch(e){}
	if(top.wins.iTimerId_ProcessingTimeoutDraw != null && top.wins.iTimerId_ProcessingTimeout == null) {
		top.wins.iTimerId_ProcessingTimeoutDraw = null;
		if (typeof(top.MainFrame.onProcessingTimeoutDraw) == "function")
		{
		  top.journalPrinter.addJournalWithTime("!!!ProcessingTimeout-Draw!!! poolID: " + top.pool.get("strTimeoutID"));
		  top.MainFrame.onProcessingTimeoutDraw();
		}
		else
		{
		  try{top.onServerErr_Def("MainFrame", "Process timeout Draw.");}catch(e){}
		}
	}
  }

  /*
    显示信息提示窗口
    参数：tiphtml   提示的HTML内容
   */
  this.showInfoTip = function(tiphtml)
  {
    if (tiphtml != null && tiphtml.length > 0)
       top.setInfoTipContent(tiphtml);
    this.show(top.document, "oLInfoTip");
  }
  
  /*
	为解决无效终端时显示top.pool问题。
  */
  this.showErrInfoTip = function(tiphtml)
  {
    if (tiphtml != null && tiphtml.length > 0)
       top.setInfoTipContent(tiphtml);
    this.show(top.document, "");
  }
  
  /*
    刷新界面风格
    参数：
      style    界面风格设置
   */
  this.refreshStyle = function(style)
  {
    if (new top.StringCtrl(style.toString()).trim().length == 0 || style == "null")
      style = "Default";

    if (this.strCurUiStyle != style)
    {
      this.strCurUiStyle = style;
      // 界面风格发生了变化，更新该风格影响的相关内容
      top.document.styleSheets(0).href = this.getCurCssFilePath();
      top.document.body.background = this.getCurImgPath() + "Bg_Main_Menu3.jpg";
      //top.document.all.oLoadingImg.src = this.getCurImgPath() + "Loading.gif";
    }
  }
    /*
    得到当前风格下图片文件的路径
   */
  this.getCurImgPath = function()
  {
    return "../Terminal/Style/" + this.strCurUiStyle + "/Img/";
  }

  /*
    得到当前风格下Css文件的路径
   */
  this.getCurCssFilePath = function()
  {
    return "../Terminal/Style/" + this.strCurUiStyle + "/Style.css";
  }
  //根据菜单级别改变背景图片
  this.chgBodyBGround=function(picNumber){
  	  if(picNumber==null||picNumber==""){
  	  	top.document.body.background = this.getCurImgPath() + "Bg_Main_Menu3.jpg";
  	  }else{
      	top.document.body.background = this.getCurImgPath() + "Bg_Main_Menu3.jpg";
  	  } 
  }
  
  //禁止页面其他空间获得焦点的方法
  this.checkEvent=function(eve,idName){
	if(idName==null||idName=="null"||idName==""){
		return;
	}
	if(typeof(eve.type)=="undefined"){
	    var tmpRange=top.MainFrame.document.getElementById(idName).createTextRange();
		tmpRange.moveStart('character',top.MainFrame.document.getElementById(idName).value.length);
		tmpRange.collapse(true);
		tmpRange.select();
		return;
	}
  	var cliType=eve.type.toLowerCase();
	if(cliType!="button"){
		var tmpRange=top.MainFrame.document.getElementById(idName).createTextRange();
		tmpRange.moveStart('character',top.MainFrame.document.getElementById(idName).value.length);
		tmpRange.collapse(true);
		tmpRange.select();
		return;
	}
  }
  
  //根据事件判断是否改变按钮的状态为点击下,每个页面通用的方法
  this.clickDEvent=function(doc,btnName,clsName){
	if(btnName==null||btnName=="null"||btnName==""||btnName=="N/A"||btnName=="undefined"){
			return;
	}
	var obj=doc.getElementsByName(btnName);
	for(var a=0;a<obj.length;a++){
		 obj[a].className=clsName;
	}
	setTimeout(function(){top.wins.retBtnStus(doc,btnName,btnName);}, 50);
  }
  
  //恢复按钮状态
  this.retBtnStus=function(doc,eleType,clsName){
	var obj=doc.getElementsByName(eleType);
	for(var a=0;a<obj.length;a++){
		 obj[a].className=clsName;
	}
  }
  
  //改变当前按钮风格
  this.doMouseDown = function(Elementname)
  {
    top.wins.clickDEvent(top.MainFrame.document,Elementname,Elementname +"Down");
  }
}
