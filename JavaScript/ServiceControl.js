/*
  �������̿�����
 */
function ServiceControl()
{
  //�������һ��ִ�е�id
  this.lastFlowId = 1;
  //���ý���ǰ�Ƿ���Ҫ�ٴ���������
  this.bReInputPwdBeforeTrans = true;
  // �û�������ʱʱ������
  this.iUserTimeout = 120;
  
  //Ӧ�÷�����IP
  this.strServerIP = window.location.hostname;
  //Ӧ�÷������˿ں�
  this.iServerPort = window.location.port;
  //��ؿͻ���IP��ַ
  this.strAgentClientIp = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_DEVICE_AGENTCLIENTIP, "127.0.0.1");
  //��ؿͻ��˶˿ں�
  this.strAgentClientPort = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_DEVICE_AGENTCLIENTPORT, "9201");
  // �ƶ���ת��url��ַ
  this.strNavigate2Url = "";
  //Ӧ�õ�ǰ״̬
  this.CurrentStatus = "";
  //�Ƿ�Ҫ��״̬���͸�agent
  this.sendAgentFlag = true;
  /*
    ���Զ������
   */
  this.checkSvcCmd = function()
  {
	  //��ȡ����ؿͻ�����û��������Ϣ���͹���,0��ʾ�У�1��ʾû��
      var CmdStatus = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
      //��ǰ����״̬
      this.CurrentStatus = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SERVICESTATUS_CURRENTSTATUS, "0");
      //����У����ȴ���
      if(CmdStatus == 0){
               var Cmd = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CMD, "");
	           if(Cmd == top.AGENT_CONF_RESTART){//��������
	              // ��¼�ն���ˮ
                  var strJrn = new top.StringCtrl("��������(�������) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
		   		  // ����������������״̬
                  top.serviceCtrl.setSvcStatus(top.TTSTATUS_RESTART); 
		          top.YHAXCommonCtrl.RestartWindows();
	           }
	           else if(Cmd == top.AGENT_CONF_SHUTDOWN){//�رջ���
	              // ��¼�ն���ˮ
                  var strJrn = new top.StringCtrl("�رջ���(�������) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
			      // ���ùرջ�������״̬
                  top.serviceCtrl.setSvcStatus(top.TTSTATUS_SHUTDOWN);  
		          top.YHAXCommonCtrl.ShutdownWindows();
	           }
	           else if(Cmd == top.AGENT_CONF_PAUSE){//��ͣ����
	              // ��¼�ն���ˮ
                  var strJrn = new top.StringCtrl("��ͣ����(�������) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
		          if(this.CurrentStatus == top.SVCSTATUS_OK){//��ǰ�ǿ�������Ҫ����
		               //���ֻ�޸�״̬����������ᴦ��
		               new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SERVICESTATUS_CURRENTSTATUS, top.SVCSTATUS_PAUSEBYMGR);
		          }
			      // ������ͣ����״̬
                  top.serviceCtrl.setSvcStatus(top.TTSTATUS_PAUSEBYMGR);  
	          }
	          else if(Cmd == top.AGENT_CONF_START){//��������
	              // ��¼�ն���ˮ
                  var strJrn = new top.StringCtrl("��������(�������) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
		          if(this.CurrentStatus != top.SVCSTATUS_OK){//��ǰ���ǿ�������Ҫ����
		              //���ֻ�޸�״̬����������ᴦ��
		              new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SERVICESTATUS_CURRENTSTATUS, top.SVCSTATUS_OK);
		          }
		   		  // ������������״̬
                  top.serviceCtrl.setSvcStatus(top.TTSTATUS_OK);
	          }
	          else if(Cmd == top.AGENT_CONF_CONNECT){//������������
	              var strJrn = new top.StringCtrl("��ؿͻ�����������(�������) "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
                  top.journalPrinter.addJournal(strJrn);
		          new top.XmlManage().setXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_CMDSVCTYPE_CURRENTSTATUS, "1");
		          //�ȷ�����������֪ͨ��agent
	              var strStatus = "";
		          //ȡ�����µ�״̬����ʼ�������̴���
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
	              // ���õ�ǰ״̬
                  top.serviceCtrl.setSvcStatus(strStatus); 
	          }
      }
      //ȡ�����µ�״̬����ʼ�������̴���
      this.CurrentStatus = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SERVICESTATUS_CURRENTSTATUS, "0");
      //�Ȱѵ�ǰ���µ�״̬���͸�agent
      if(this.sendAgentFlag){  
         //�ȷ���ʵʱ״̬֪ͨ��agent
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
	 	// ���õ�ǰ״̬
        top.serviceCtrl.setSvcStatus(strStatus); 
        this.sendAgentFlag = false;
     }
  }
  /*
    ���õ�ǰ����״̬
   */
  this.setSvcStatus = function(status)
  {
	  top.pool.set("devStatus",status);
      //��������
	  var strRequestData = "MSU" + new top.StringCtrl(""+top.terminal.strTerminalNum).suffixStr(' ', 8) + status;
	  var ret = top.YHAXCommonCtrl.SendBufferedData(this.strAgentClientIp,parseInt(this.strAgentClientPort),strRequestData);
	  if(ret == true){
	     //��¼��ˮ
		 strJrn = new top.StringCtrl("���ͼ������ɹ� "+ "     ["+strRequestData+"]" + new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	     top.journalPrinter.addJournal(strJrn);
	  }else{
	     //��¼��ˮ
	     strJrn = new top.StringCtrl("���ͼ������ʧ�� "+ "     ["+strRequestData+"]" + new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	     top.journalPrinter.addJournal(strJrn);
	  }
  }
  
  /*
   * ����汾����
   */
  this.SendUpdateVersion = function()
  {
    //��������
	  var strRequestData = top.pool.get("strRequestData");
	  var ret = top.YHAXCommonCtrl.SendBufferedData(this.strAgentClientIp,parseInt(this.strAgentClientPort),strRequestData);
	  if(ret == true){
	     //��¼��ˮ
		 strJrn = "���ͼ������ɹ� "+ "     ["+strRequestData+"]";
	     top.journalPrinter.addTimeoutWithTime(strJrn);
	  }else{
	     //��¼��ˮ
	     strJrn = "���ͼ������ʧ�� "+ "     ["+strRequestData+"]";
	     top.journalPrinter.addTimeoutWithTime(strJrn);
	  }
	  return ret;
   }
  /*
  ���ط���������״̬
  ������������״̬
 */
  this.sendEleLockStatus = function(EleLokStatus)
  {
	//��������
	  var strRequestData = "MLS" 
		  + new top.StringCtrl(""+top.terminal.strTerminalNum).suffixStr(' ', 8)
		  + new top.StringCtrl(""+top.pool.get("devStatus")).suffixStr(' ', 1)
		  + new top.StringCtrl(""+EleLokStatus).suffixStr(' ', 16)
		  + new top.StringCtrl(""+top.pool.get("EleLockSign")).suffixStr(' ', 1);
	  var ret = top.YHAXCommonCtrl.SendBufferedData(this.strAgentClientIp,parseInt(this.strAgentClientPort),strRequestData);
	  if(ret == true){
	     //��¼��ˮ
		 strJrn = "��������״̬����سɹ� "+ "     ["+strRequestData+"]";
	     top.journalPrinter.addJournalWithTime(strJrn);
	  }else{
	     //��¼��ˮ
	     strJrn = "��������״̬�����ʧ�� "+ "     ["+strRequestData+"]";
	     top.journalPrinter.addJournalWithTime(strJrn);
	  }
  }
  /*��ת���忨ҳ��*/
  this.navigate2InsertCard = function()
  {
    this.navigate2("/Service/CardReader.html");
  }
  /*��ת�����ÿ������˵�*/
  this.navigate2Quit_CreditCardMenu = function()
  {
    this.navigate2("/Service/CreditCardMenu.html");
  }
  /*��ת������*/
  this.navigate2Idle = function()
  {
	if(top.terminal.isSmartTeller){
		this.navigate2("/Service/Idle.html");
	
	}else{
		this.navigate2("/ServiceMV/Idle.html");
	}
    // ������ҳ�治��Ҫ��ʱ�������Ա�����ܵ���ѭ������
    top.wins.stopProcessingTimeout();
  }
  /*��ת�������ƶ��ն�*/
  this.navigate2IdleMV = function()
  {
    this.navigate2("/ServiceMV/Idle.html");
	// ������ҳ�治��Ҫ��ʱ�������Ա�����ܵ���ѭ������
    top.wins.stopProcessingTimeout();
  }
  
  /*��ת����������ҳ��*/
  this.navigate2InputPin = function()
  {
    this.navigate2("/Service/InputPin.html");
  }
  
  /*��ת������˵�ҳ��*/
  this.navigate2ServiceMenu = function()
  {
    top.serviceCtrl.navigate2("/Service/ServiceMenu.html");
  }
  
  /*��ת�������˵�ҳ��*/
  this.navigate2SecondMenu = function()
  {
    top.serviceCtrl.navigate2("/Service/SecondMenu.html");
  }
  
  /*��ת���ܻ�Ա�˵�ҳ��*/
  this.navigate2Maintenance = function()
  {
	  top.journalPrinter.addJournalWithTime("�ͻ�ѡ�� ���أ����ص��ܻ�Ա�˵�");
    top.serviceCtrl.navigate2("/Maintenance/Menu_Maintenance.html");
  }
  
  /*��ת�����񷵻�ҳ��*/
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
  
  /*��ת����ӡƾ��ҳ��*/
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
    /*ֹͣ���м�ʱ�߼�*/
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
    /*ֹͣ���м�ʱ�߼�*/
    this.stopCountDown();
    	this.stopTipTick();
    this.stopFlowCtrlTimeout();
    this.stopUserTimeout();
	
    if (top.document.all.ProcessingAdFrame.style.visibility == "hidden")
      top.wins.showProcessingTip("");

    this.strNavigate2Url = url.substring(url.lastIndexOf('/ServiceMV/'));   
    top.serviceCtrl.navigate2_F();
  }
  
   /*��ת��ָ��������ҳ��*/
  this.navigate2_F = function()
  {
    /*Ϊ��ֹNT����ϵͳ�Ļ���������ʱ�ȴ�����ʱ�䣬�Ȳ�����·	*/
    if (this.strNavigate2Url != "about:blank" && !new top.ExchangeXmlWithHost().IsServerOnLine())
    {
      top.onServerErr_Def("MainFrame", "Net offline (navigate)");
      return;
    }
    top.MainFrame.navigate(".."+top.serviceCtrl.strNavigate2Url);
  }
  
  /*���̼�ʱ����*/
  this.iTimerId_FlowCtrlTimeout = null;
  this.startFlowCtrlTimeout = function(doFunc, mstimeout)
  {
    this.stopFlowCtrlTimeout();
    this.iTimerId_FlowCtrlTimeout = setTimeout(doFunc, mstimeout);
	top.journalPrinter.addTimeoutWithTime("   FlowCtrl������" + this.iTimerId_FlowCtrlTimeout);
	
  }
  
  /*
    ���̿��Ƴ�ʱ����ʱ�Ĵ���
   */
  this.onFlowCtrlTimeout = function()
  {
    top.serviceCtrl.iTimerId_FlowCtrlTimeout = null;
  }
  
  /*ֹͣ���̿ؼ�ʱ����*/
  this.stopFlowCtrlTimeout = function()
  {
    if (this.iTimerId_FlowCtrlTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("   FlowCtrl�رգ�" + this.iTimerId_FlowCtrlTimeout);
      clearTimeout(this.iTimerId_FlowCtrlTimeout);
      this.iTimerId_FlowCtrlTimeout = null;
    }
    if (top.serviceCtrl.iTimerId_FlowCtrlTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("   FlowCtrl�ر�top��" + this.iTimerId_FlowCtrlTimeout);
      top.clearTimeout(top.serviceCtrl.iTimerId_FlowCtrlTimeout);
      top.serviceCtrl.iTimerId_FlowCtrlTimeout = null;
    }
  }
  
  /*��ͨѶ���ϻָ���ת������ҳ��*/
  this.CommErrAfter2Idle = function()
  {
    this.navigate2Idle();
  }
  
  /*��ͨѶ���ϻָ���ת������ҳ��*/
  this.CommErrAfter2IdleMV = function()
  {
    this.navigate2IdleMV();
  }
  
   /*ҵ����ʱ���ؽ��׹��*/
  this.doWithProcessingAd = function(doFunc)
  {
    top.wins.showProcessingAd();
    this.startFlowCtrlTimeout(doFunc, 20);
  }
  
  /*���̴���ҳ���ʱ����*/
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
	top.journalPrinter.addTimeoutWithTime("   User������" + this.iTimerId_UserTimeout);
    if (otiptext != null)
    {
      this.startTipTick(timeout, otiptext);
    }
  }
  
  /*ֹͣ���̴���ҳ��ļ�ʱ����*/
  this.stopUserTimeout = function()
  {
  	top.wins.stopProcessingTimeout();
    if (top.serviceCtrl.iTimerId_UserTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("   User�ر�top��" + top.serviceCtrl.iTimerId_UserTimeout);
      top.MainFrame.clearTimeout(top.serviceCtrl.iTimerId_UserTimeout);
      top.serviceCtrl.iTimerId_UserTimeout = null;
    }
	if (this.iTimerId_UserTimeout != null)
    {
	  top.journalPrinter.addTimeoutWithTime("   User�رգ�" + this.iTimerId_UserTimeout);
      clearTimeout(this.iTimerId_UserTimeout);
      this.iTimerId_UserTimeout = null;
    }
  }
  
  /*ֹͣ����ʱ��ʾ*/
  this.stopCountDown = function()
  {
    if (this.iTimerId_Tip != null)
    {
      top.MainFrame.clearInterval(this.iTimerId_Tip);
      this.iTimerId_Tip = null;
    }
  }
  
  /*
    ת�����񷵻� 
   */
  this.navigate2Quit = function()
  {
    // �齱ʱ��ͬ�����ûᵼ��ҳ��ͣ�٣��������г��ȴ�����
    top.wins.showProcessingTip("");
	if(top.terminal.isSmartTeller){
		this.startFlowCtrlTimeout(this.navigate2Quit_F, 100);
	}else{
		this.startFlowCtrlTimeout(this.navigate2Quit_FMV, 100);
	}
  }
  
  /*
    �ڲ�������ת���˳�����
   */
  this.navigate2Quit_F = function()
  {
    top.serviceCtrl.navigate2("/Service/Quit.html");
  }
  
  /*
   ת�����񷵻� 
  */
 this.navigate2QuitMV = function()
 {
   // �齱ʱ��ͬ�����ûᵼ��ҳ��ͣ�٣��������г��ȴ�����
   top.wins.showProcessingTip("");
   this.startFlowCtrlTimeout(this.navigate2Quit_FMV, 100);
 }

 /*
   �ڲ�������ת���˳�����
  */
 this.navigate2Quit_FMV = function()
 {
   top.serviceCtrl.navigate2("/ServiceMV/Quit.html");
 }
  
  /*
   ת�������֤ҳ�� 
  */
  this.navigate2QuitID = function()
  {
    // �齱ʱ��ͬ�����ûᵼ��ҳ��ͣ�٣��������г��ȴ�����
    top.wins.showProcessingTip("");
    this.startFlowCtrlTimeout(this.navigate2Quit_ID, 100);
  }
  
  /*
    �ڲ�������ת���˳�����
  */
  this.navigate2Quit_ID = function()
  {
    top.serviceCtrl.navigate2("/Service/QuitIDCard.html");
  }
  
  /*
   ת�������֤ҳ�� 
  */
  this.navigate2QuitIDMV = function()
  {
    // �齱ʱ��ͬ�����ûᵼ��ҳ��ͣ�٣��������г��ȴ�����
    top.wins.showProcessingTip("");
    this.startFlowCtrlTimeout(this.navigate2Quit_IDMV, 100);
  }
 
  /*
    �ڲ�������ת���˳�����
  */
  this.navigate2Quit_IDMV = function()
  {
    top.serviceCtrl.navigate2("/ServiceMV/QuitIDCard.html");
  }
  
  /*
    ת���˴浥ҳ��  
  */
  this.navigate2QuitCD = function()
  {
    // �齱ʱ��ͬ�����ûᵼ��ҳ��ͣ�٣��������г��ȴ�����
    top.wins.showProcessingTip("");
    this.startFlowCtrlTimeout(this.navigate2Quit_CD, 100);
  }
  
  /*
    �ڲ�������ת���˳�����
  */
  this.navigate2Quit_CD = function()
  {
    top.serviceCtrl.navigate2("/Service/QuitDepositRpt.html");
  }
  

  
  /*
    ��ʼ��ʾ��ʱ���������û�����������ʾ��
    ������
      timeout   ��ʱ�������
      otiptext  ��ʾ��ʱ����HTMLҳ�����
   */
  this.iTimerId_Tip = null;
  this.oTipText = null;
  this.startTipTick = function(timeout, otiptext)
  {
    // ��ֹ��ǰ���õļ�ʱ��
    this.stopTipTick();
    //this.stopTipTick2();
    this.iTipTimeout = timeout;
    this.oTipText = otiptext;
    this.iTimerId_Tip = top.MainFrame.setInterval(this.onTipTick, 1*1000);
    // ����ִ��һ�Σ�����յ�һ�μ��
    this.onTipTick();
  }

  /*
    ˽�к���������ʾ��ʱ����ʱ����Ӧ
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
    ��ֹ��ʾ��ʱ
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
    // ��ֹ��ǰ���õļ�ʱ��
    this.stopTipTick2();
    //this.stopTipTick();
    this.iTipTimeout2 = timeout;
    this.oTipText2 = otiptext;
    this.iTimerId_Tip2 = top.MainFrame.setInterval(this.onTipTick2, 1*1000);
    // ����ִ��һ�Σ�����յ�һ�μ��
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
    ��ֹ��ʾ��ʱ
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
   *Ϊ���̴���ҳ����ǰ��׼��
   *doc ҳ��document����
   *win ҳ��window����
   *serverEntrance ������ں���
   */
  this.funcServerEntrance = null;
  this.prepare4Entrance = function(doc, win, serverEntrance)
  {
    /*�ű�����Ĵ�����*/
    win.onerror = top.fnErrorTrap;
    /*ʵ������������*/
    win.operateCtrl = new top.OperateControl(doc);
    /*��ʱ��ֹ�κβ���*/
    win.operateCtrl.disableInput(true);
    /*���ñ���ͼƬʹ�û���*/
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
   *���̴���ҳ��׼�����ʱ�߼�����
   * doc ҳ��document����
   * serverEntrance ������ں���
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
  
  //��ȡ������ֵ
  this.setValue = function(Key)
  { 
    var isFocus = top.MainFrame.document.activeElement.id;//�жϵ�ǰ�Ƿ�������
	if(isFocus == null || isFocus == ""){
		if(!isNaN(Key)){//����
		   if (typeof(top.MainFrame.onChangeNum) == "function"){
		      top.MainFrame.onChangeNum(Key);
		   }
	    }
		else if(Key == "CANCEL"){//ȡ����
		   if (typeof(top.MainFrame.onKey_Cancel) == "function"){
		      top.MainFrame.onKey_Cancel();
	       }
	    }
		else if(Key == "ENTER"){//ȷ�ϼ�
		   if (typeof(top.MainFrame.onKey_Enter) == "function"){
		      top.MainFrame.onKey_Enter();
	       }
		}
	}else{
        this.inputVaue = top.MainFrame.document.getElementById(top.MainFrame.document.activeElement.id).value;//��ȡ�ı����ֵ
		var maxLength = top.MainFrame.document.getElementById(top.MainFrame.document.activeElement.id).maxLength;//��ȡ�ı����ǩ��maxlength����
	    var len = this.inputVaue.length;//��ȡ�ı���ֵ�ĳ���
	    if( Key == "BACKSPACE"){//�˸��
            if (len > 0) {
               this.inputVaue = this.inputVaue.substring(0, len - 1);
            }
	    }
	    else if(Key == "CLEAR"){//�����
		   this.inputVaue = "";
	    }
	    else if(Key == "CANCEL"){//ȡ����
		   if (typeof(top.MainFrame.onKey_Cancel) == "function"){
			  this.inputVaue = "";
		      top.MainFrame.onKey_Cancel();
	       }
	    }
		else if(Key == "ENTER"){//ȷ�ϼ�
		   if (typeof(top.MainFrame.onKey_Enter) == "function"){
			  this.inputVaue = "";
		      top.MainFrame.onKey_Enter();
	       }
		}
	    else if(!isNaN(Key) || Key == "."){//���ֻ�С����
		   if(len < maxLength){
			   this.inputVaue = this.inputVaue + Key;
		   }
	    }
	    else if(Key.length == 1 && new top.StringCtrl(Key).isLetter()){//��ĸ
		   if(len < maxLength){
		      this.inputVaue = this.inputVaue + Key;
		   }
	    }
		//�ж��������󳤶�
        if(this.inputVaue.length > maxLength){
			this.inputVaue = this.inputVaue.substring(0, maxLength);
		}
	    top.MainFrame.document.getElementById(top.MainFrame.document.activeElement.id).value=this.inputVaue;
	    if (typeof(top.MainFrame.CheckValue) == "function"){
		    top.MainFrame.CheckValue();
	    }
	}
  }
  
  //�޸ĵ�����״̬
  this.changeNaviStatus = function(id) {
	   var node = top.MainFrame.document.getElementById("node"+id);
	   if(id == 1){
		  this.lastFlowId = 1;
	      //�޸ı��ڵ�
	      node.className = "stepStatusIconOn";
	   }
	   else{
	     var nodeline1 = top.MainFrame.document.getElementById("nodeline"+(id-1)+"1");
	     var nodeline2 = top.MainFrame.document.getElementById("nodeline"+(id-1)+"2");
	      
         //�޸Ľڵ�������״̬
	     if(nodeline1 !=null){
	       nodeline1.className = "stepLineOn";
	     }
	     if(nodeline2 !=null){
	       nodeline2.className = "stepLineOn";
	     }
         //�޸Ľڵ�״̬
	     //�޸ı��ڵ�
	     node.className = "stepStatusIconOn"; 
	     //�޸��Ѿ���ɵĽڵ�
	     for(var i =1;i<id; i++){
		    var nodeOff = top.MainFrame.document.getElementById("node"+i);
            nodeOff.className = "stepStatusIconOff";
		 }
	  }
	  //���˵�ʱ�򣬺��������ȫ����λ��δ���
	  if(parseInt(id) < this.lastFlowId){
		  for(var j =id;j<this.lastFlowId; j++){
			  //�޸Ľڵ�״̬
			  var nodeInit = top.MainFrame.document.getElementById("node"+(parseInt(j)+1));
			  nodeInit.className = "stepStatusIcon";
			  //�޸�������״̬
			  var nodelineInit1 = top.MainFrame.document.getElementById("nodeline"+j+"1");
	          var nodelineInit2 = top.MainFrame.document.getElementById("nodeline"+j+"2");
			  nodelineInit1.className = "stepLine";
			  nodelineInit2.className = "stepLine";
		  }
	  }
	  this.lastFlowId = id;
   }
}