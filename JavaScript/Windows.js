/*
  ������ʾ������
 */
function Windows()
{
  // �û�������
  this.strCurUiStyle = "";
  // ���ڴ������Ƿ��������
  this.processingAdFrmReady = false;
  /*
    ���ƴ�����ʾ
    ����1��doc     ҳ���ĵ�����
    ����2��winid   ҳ�����Ӵ��ڣ�DIV��IFRAM�㣩��Id
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
    	if(winid.indexOf("Processing")<0 && customStatus !="1" )//���ڴ���Ĺ���ҳ�治����,�ܻ�Աҳ�治����
    	{//��̬���Ӻ��д��þ���ť
    	var div = doc.createElement('div');
    	if(url.indexOf("3")>=0  || url == "none")//url��ҳ�汳��ͼƬ�ĵ�ַ,����ͼ�����ư���2��3,��������,none�ǿ���ҳ
    	{
    		div.innerHTML="<button onclick=\"top.wins.padAssist(this)\"  style=\"position: absolute;left: 81%;top: 3%;width:212px;height:46px;color:#FFFFFF;font-family:΢���ź�;font-size: 24px;background-image: url('../Terminal/Style/Default/Img/Main_btn3.png');BORDER:#FFFFFF 0px solid;cursor:pointer;background-color:transparent;letter-spacing: 6px;\">&nbsp;&nbsp;&nbsp;���þ���</button>";
    	}else{
            div.innerHTML="<button onclick=\"top.wins.padAssist(this)\"  style=\"position: absolute;left: 81%;top: 3%;width:212px;height:46px;color:#3e80ca;font-family:΢���ź�;font-size: 24px;background-image: url('../Terminal/Style/Default/Img/Main_btn2.png');BORDER:#FFFFFF 0px solid;cursor:pointer;background-color:transparent;letter-spacing: 6px;\">&nbsp;&nbsp;&nbsp;���þ���</button>";
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
	  top.trans.send910304ExAsync();//���þ���Э��
	  this.iTimerId_910304Timeout = top.setInterval(function()
	       {
	          top.wins.iTimerId_910304Time ++;
	          if(parseInt(top.wins.iTimerId_910304Time) == 10) {
                   top.wins.stop910304Tick();
	               doc.innerHTML = "&nbsp;&nbsp;&nbsp;���þ���";
		           doc.disabled = false;
	          }
	          else {
		           var printnr = 10 - parseInt(top.wins.iTimerId_910304Time);
		           doc.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;������"  + printnr ;
	          }  	
	  }, 1000);
   }
  
    /*ֹͣ���̴���ҳ��ļ�ʱ����*/
  this.stop910304Tick = function()
  {
	  if (this.iTimerId_910304Timeout != null)
      {
           top.clearInterval(this.iTimerId_910304Timeout);
           this.iTimerId_910304Timeout = null;
      }
  }
  /*
    ���ƴ�����ʾ
    ������winid   ҳ�����Ӵ��ڣ�DIV��IFRAM�㣩��Id
   */
  this.showMain = function(winid)
  {
    // 1. ��MainFrame���ڿɼ�
    this.show(top.document, "MainFrame");
    top.MainFrame.focus();
    // 2. ��ʾMainFrame�е��Ӵ���
    this.show(top.MainFrame.document, winid);
  }

  /*
    ��ʾ���ڴ�����
    �����������ã�����ʾ��棬������ʾ���ڴ�����ʾ
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
    ��ʾ���ڴ�����ʾ
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
    ���׹�������ʾ���ڴ�����ʾ
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
    ��ʾ���ڴ�����ʾ
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
    ��ʼ���ڴ���ʱ��ʱ
    ע��
      �ú���������ֹ��ǰ�Ѿ����õĳ�ʱ��ʱ��
   */
  this.iTimerId_ProcessingTimeout = null;
  this.startProcessingTimeout = function()
  {
    this.stopProcessingTimeout();
	this.iTimerId_ProcessingTimeout = top.setTimeout(top.wins.onProcessingTimeout, top.iUserTimeout*1000);
	top.pool.set("strTimeoutID", this.iTimerId_ProcessingTimeout);
	top.journalPrinter.addTimeoutWithTime("Process������" + this.iTimerId_ProcessingTimeout);
  }

    /*
    PAD��˿�ʼ���ڴ���ʱ��ʱ
    ע��
      �ú���������ֹ��ǰ�Ѿ����õĳ�ʱ��ʱ��
   */
  this.iTimerId_ProcessingTimeoutPad = null;
  this.startPADCheckProcessingTimeout = function()
  {
    this.stopProcessingTimeout();
	this.iTimerId_ProcessingTimeoutPad = top.setTimeout(top.wins.onProcessingTimeoutPad, top.iPadCheckTimeout*1000);
	top.pool.set("strTimeoutID", this.iTimerId_ProcessingTimeoutPad);
	top.journalPrinter.addTimeoutWithTime("PAD������" + this.iTimerId_ProcessingTimeoutPad);
  }
 /*
    ��ʼ���ڴ���ʱ��ʱ-ȡ���
    ע��
      �ú���������ֹ��ǰ�Ѿ����õĳ�ʱ��ʱ��
   */
  this.iTimerId_ProcessingTimeoutDraw = null;
  this.startDrawProcessingTimeout = function()
  {
    this.stopProcessingTimeout();
	this.iTimerId_ProcessingTimeoutDraw = top.setTimeout(top.wins.onProcessingTimeoutDraw, top.iUserTimeout*1000);
	top.pool.set("strTimeoutID", this.iTimerId_ProcessingTimeoutDraw);
	top.journalPrinter.addTimeoutWithTime("Draw������" + this.iTimerId_ProcessingTimeoutDraw);
  }
  
 
	
  
  /*
    ��ֹ���ڴ���ʱ��ʱ
   */
  this.stopProcessingTimeout = function()
  {
    if (this.iTimerId_ProcessingTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("Process�رգ�" + this.iTimerId_ProcessingTimeout);
      clearTimeout(this.iTimerId_ProcessingTimeout);
      top.clearTimeout(this.iTimerId_ProcessingTimeout);
      clearTimeout(top.wins.iTimerId_ProcessingTimeout);
	  //clearBefore100Timeout(this.iTimerId_ProcessingTimeout);
	  var id = this.iTimerId_ProcessingTimeout;
	 //��ǰ��clear 100��id ��
	for(var i=id;(i>id-100)&&(i>0);i--){
		clearTimeout(i);
	} 
      this.iTimerId_ProcessingTimeout = null;
	  
    }
	if (top.wins.iTimerId_ProcessingTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("top.Process�رգ�" + top.wins.iTimerId_ProcessingTimeout);
      top.clearTimeout(top.wins.iTimerId_ProcessingTimeout);
	  //clearBefore100Timeout(top.wins.iTimerId_ProcessingTimeout);
	  var id = top.wins.iTimerId_ProcessingTimeout;
	 //��ǰ��clear 100��id ��
	for(var i=id;(i>id-100)&&(i>0);i--){
		clearTimeout(i);
	} 
      top.wins.iTimerId_ProcessingTimeout = null;
    }
    if (this.iTimerId_ProcessingTimeoutPad != null)
    {
	  top.journalPrinter.addTimeoutWithTime("Pad�رգ�" + this.iTimerId_ProcessingTimeoutPad);
      clearTimeout(this.iTimerId_ProcessingTimeoutPad);
      top.clearTimeout(this.iTimerId_ProcessingTimeoutPad);
      clearTimeout(top.wins.iTimerId_ProcessingTimeoutPad);
	  //clearBefore100Timeout(this.iTimerId_ProcessingTimeoutPad);
	  var id = this.iTimerId_ProcessingTimeoutPad;
	 //��ǰ��clear 100��id ��
	for(var i=id;(i>id-100)&&(i>0);i--){
		clearTimeout(i);
	} 
      this.iTimerId_ProcessingTimeoutPad = null;	  
    }	
    if (this.iTimerId_ProcessingTimeoutDraw != null)
    {
	  top.journalPrinter.addTimeoutWithTime("Draw�رգ�" + this.iTimerId_ProcessingTimeoutDraw);
      clearTimeout(this.iTimerId_ProcessingTimeoutDraw);
      top.clearTimeout(this.iTimerId_ProcessingTimeoutDraw);
      clearTimeout(top.wins.iTimerId_ProcessingTimeoutDraw);
	  //clearBefore100Timeout(this.iTimerId_ProcessingTimeoutDraw);
	  var id = this.iTimerId_ProcessingTimeoutDraw;
	 //��ǰ��clear 100��id ��
	for(var i=id;(i>id-100)&&(i>0);i--){
		clearTimeout(i);
	} 
      this.iTimerId_ProcessingTimeoutDraw = null;	  
    }	
  }

  /*
    ���ڴ���ʱ��Ĵ���
   */
  this.onProcessingTimeout = function()
  {
	top.journalPrinter.addJournalWithTime("!!!ProcessingTimeout: " + top.wins.iTimerId_ProcessingTimeout + " poolID: " + top.pool.get("strTimeoutID"));
	try
    {
      // �������̳�ʱ���첽���ûص�������null����ֹ������á�
      if (top.exchxmlasync.onAsyncExchangeComplete != null)
        top.exchxmlasync.onAsyncExchangeComplete = null;
    } catch(e){}
	
	//Process��ID��Ϊnull,��PAD��ID��Draw��IDΪnull,����ִ�лص��������PAD��˹�����Process�Ļص�����ʱPAD��ID��Ϊnull,Ҳ����ִ�У���֤PAD����ֹ
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
      // �������̳�ʱ���첽���ûص�������null����ֹ������á�
      if (top.exchxmlasync.onAsyncExchangeComplete != null)
        top.exchxmlasync.onAsyncExchangeComplete = null;
    } catch(e){}
	// �ж�PAD��ID��ΪNULL��ͬʱProcess��IDΪNULL ��ȥִ�лص�
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
    ���ڴ���ʱ��Ĵ���-draw
   */
  this.onProcessingTimeoutDraw = function()
  {
	top.journalPrinter.addJournalWithTime("!!!ProcessingTimeout-Draw: " + top.wins.iTimerId_ProcessingTimeoutDraw + " poolID: " + top.pool.get("strTimeoutID"));
	try
    {
      // �������̳�ʱ���첽���ûص�������null����ֹ������á�
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
    ��ʾ��Ϣ��ʾ����
    ������tiphtml   ��ʾ��HTML����
   */
  this.showInfoTip = function(tiphtml)
  {
    if (tiphtml != null && tiphtml.length > 0)
       top.setInfoTipContent(tiphtml);
    this.show(top.document, "oLInfoTip");
  }
  
  /*
	Ϊ�����Ч�ն�ʱ��ʾtop.pool���⡣
  */
  this.showErrInfoTip = function(tiphtml)
  {
    if (tiphtml != null && tiphtml.length > 0)
       top.setInfoTipContent(tiphtml);
    this.show(top.document, "");
  }
  
  /*
    ˢ�½�����
    ������
      style    ����������
   */
  this.refreshStyle = function(style)
  {
    if (new top.StringCtrl(style.toString()).trim().length == 0 || style == "null")
      style = "Default";

    if (this.strCurUiStyle != style)
    {
      this.strCurUiStyle = style;
      // ���������˱仯�����¸÷��Ӱ����������
      top.document.styleSheets(0).href = this.getCurCssFilePath();
      top.document.body.background = this.getCurImgPath() + "Bg_Main_Menu3.jpg";
      //top.document.all.oLoadingImg.src = this.getCurImgPath() + "Loading.gif";
    }
  }
    /*
    �õ���ǰ�����ͼƬ�ļ���·��
   */
  this.getCurImgPath = function()
  {
    return "../Terminal/Style/" + this.strCurUiStyle + "/Img/";
  }

  /*
    �õ���ǰ�����Css�ļ���·��
   */
  this.getCurCssFilePath = function()
  {
    return "../Terminal/Style/" + this.strCurUiStyle + "/Style.css";
  }
  //���ݲ˵�����ı䱳��ͼƬ
  this.chgBodyBGround=function(picNumber){
  	  if(picNumber==null||picNumber==""){
  	  	top.document.body.background = this.getCurImgPath() + "Bg_Main_Menu3.jpg";
  	  }else{
      	top.document.body.background = this.getCurImgPath() + "Bg_Main_Menu3.jpg";
  	  } 
  }
  
  //��ֹҳ�������ռ��ý���ķ���
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
  
  //�����¼��ж��Ƿ�ı䰴ť��״̬Ϊ�����,ÿ��ҳ��ͨ�õķ���
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
  
  //�ָ���ť״̬
  this.retBtnStus=function(doc,eleType,clsName){
	var obj=doc.getElementsByName(eleType);
	for(var a=0;a<obj.length;a++){
		 obj[a].className=clsName;
	}
  }
  
  //�ı䵱ǰ��ť���
  this.doMouseDown = function(Elementname)
  {
    top.wins.clickDEvent(top.MainFrame.document,Elementname,Elementname +"Down");
  }
}
