function Trans()
{
  // ��������첽�������ʱ�Ļص�����
  var onAsyncExchangeComplete = null;
  //�Ƿ�������	
  var isCheckLoadingMore = false;
  //�Ƿ����Э��
  var isCheckHelpingMore = false;
  
  /*�������Ӱ���ļ��ϴ���������*/
  this.sendImageFileAsync = function()
  {
	fileControl =  new top.FileControl();
	var fileData = fileControl.fileCompress(top.pool.get("strImageFilePath"));
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ImageFile");
	reqMsg.appendNode("strImageType",top.pool.get("strImageType"));//�ϴ�����,��̨�������������͵�Ӱ��ƽ̨�ĸ��ӿ�
	reqMsg.appendNode("strFileData",fileData);
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDGrantDept",top.pool.get("strIDGrantDept"));//ǩ֤����
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));//�ͻ���
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //ҵ�����κ�,�������Ҫ��һ�������Ľ���ֻ����ͬһ��
    reqMsg.appendNode("strIDOnLineImage",top.pool.get("strIDOnLineImage"));//�����˲���Ƭ
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncImageFileComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncImageFileComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("Ӱ���ļ��ϴ�"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var strBatchId = top.exchxmlasync.msgxmldomResp.getElementValue("strBatchId");//ԭ�������κţ�Ӱ��ƽ̨ר�á�����Ľ��׶��������
		top.pool.set("strBatchId",strBatchId);
		if(top.pool.get("copyFileType") == "signatute"){//����ǵ���ǩ���Ļ�����Ҫ���ݵ���ǩ���켣�ļ�
		    top.pool.set("copyFileType","");//�ϴ�������
			//�ȴ����������ǩ���켣�����ļ���
	        new top.FileControl().createFile(top.COLS_SIGNATURE_TEMP_FILEPATH);
	        //���Ƶ���ǩ���켣�ļ��������ļ�����
	        new top.FileControl().fileCopy(top.COLS_SIGCAMERAS_FILEPATH,top.COLS_SIGNATURE_TEMP_FILEPATH + "\\" +strBatchId,top.COLS_SIGCAMERAS_DAT_FILENAME);
		}
        //�ϴ��ɹ��󣬰��ļ�ɾ������ֹ�´λ���ϴ��ļ������ϴ�����
	    fileControl =  new top.FileControl();
        fileControl.deleteFile(top.pool.get("strImageFilePath"));
        if (typeof(top.MainFrame.onImageFileSuccessful) == "function")
           top.MainFrame.onImageFileSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "Ӱ���ļ��ϴ�ʧ��");
      }
    }
  }
  
  /*������Ӱ���ϴ���ȡ��ʱ�ã�*/
  this.sendImageAgentFileAsync = function()
  {
	fileControl =  new top.FileControl();
	var fileData = fileControl.fileCompress(top.pool.get("strImageFilePath"));
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ImageAgentFile");
	reqMsg.appendNode("strImageType",top.pool.get("strImageType"));//�ϴ�����,��̨�������������͵�Ӱ��ƽ̨�ĸ��ӿ�
	reqMsg.appendNode("strFileData",fileData);
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDGrantDept",top.pool.get("strIDGrantDept"));//ǩ֤����
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));//�ͻ���
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //ҵ�����κ�,�������Ҫ��һ�������Ľ���ֻ����ͬһ��
    reqMsg.appendNode("strIDOnLineImage",top.pool.get("strIDOnLineImage"));//�����˲���Ƭ
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncImageFileAgentComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncImageFileAgentComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("Ӱ���ļ��ϴ�"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var strBatchId = top.exchxmlasync.msgxmldomResp.getElementValue("strBatchId");//ԭ�������κţ�Ӱ��ƽ̨ר�á�����Ľ��׶��������
		top.pool.set("strBatchId",strBatchId)
		if(top.pool.get("copyFileType") == "signatute"){//����ǵ���ǩ���Ļ�����Ҫ���ݵ���ǩ���켣�ļ�
		    top.pool.set("copyFileType","");//�ϴ�������
			//�ȴ����������ǩ���켣�����ļ���
	        new top.FileControl().createFile(top.COLS_SIGNATURE_TEMP_FILEPATH);
	        //���Ƶ���ǩ���켣�ļ��������ļ�����
	        new top.FileControl().fileCopy(top.COLS_SIGCAMERAS_FILEPATH,top.COLS_SIGNATURE_TEMP_FILEPATH + "\\" +strBatchId,top.COLS_SIGCAMERAS_DAT_FILENAME);
		}
        //�ϴ��ɹ��󣬰��ļ�ɾ������ֹ�´λ���ϴ��ļ������ϴ�����
	    fileControl =  new top.FileControl();
        fileControl.deleteFile(top.pool.get("strImageFilePath"));
        if (typeof(top.MainFrame.onImageAgentFileSuccessful) == "function")
           top.MainFrame.onImageAgentFileSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "Ӱ���ļ��ϴ�ʧ��");
      }
    }
  }
  
  /*�������Ӱ���ļ��ϴ���������(����)*/
  this.sendImageFileNewAsync = function()
  {
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ImageFileNew");
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDGrantDept",top.pool.get("strIDGrantDept"));//ǩ֤����
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));//�ͻ���
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //ҵ�����κ�,�������Ҫ��һ�������Ľ���ֻ����ͬһ��
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncImageFileNewComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncImageFileNewComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("Ӱ���ļ��ϴ�(����)"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var strBatchId = top.exchxmlasync.msgxmldomResp.getElementValue("strBatchId");//ԭ�������κţ�Ӱ��ƽ̨ר�á�����Ľ��׶��������
		top.pool.set("strBatchId", strBatchId)
        if (typeof(top.MainFrame.onImageFileNewSuccessful) == "function")
           top.MainFrame.onImageFileNewSuccessful();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "Ӱ���ļ��ϴ�ʧ��");
      }
    }
  }	
  
  /*�������Ӱ���ļ���ѯ��������*/
  this.sendImageFileQueryAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ImageFileQuery");
	reqMsg.appendNode("strImageType",top.pool.get("strImageType"));//�ϴ�����,��̨�������������͵�Ӱ��ƽ̨�ĸ��ӿ�
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //ҵ�����κ�,�������Ҫ��һ�������Ľ���ֻ����ͬһ��
     var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
	 // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("Ӱ���ļ���ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		// ��ͼƬ��Ϣ���鱣�浽������
        this.saveXMLDatalist(exch);
        if (typeof(top.MainFrame.onImageFileQuerySuccessful) == "function"){
          top.MainFrame.onImageFileQuerySuccessful();
		}
	}
	else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILEQUERY_FAILED, "Ӱ���ļ���ѯʧ��");
      }
    }
  }
  
  /*�������ҵ�����뵥��������*/
  this.sendBusinessApplicationAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "BusinessApplication");
	reqMsg.appendNode("htmlstr",reqMsg.encode64(reqMsg.utf16to8(top.pool.get("htmlstr"))));//ҵ�����뵥����ʾ�����ݣ�ҳ��DIV�е�����
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId")); //ҵ�����κ�,�������Ҫ��һ�������Ľ���ֻ����ͬһ��
	// ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ʼ�ϴ�ҵ������ "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncBusinessApplicationComplete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncBusinessApplicationComplete = function(iRet)
  {
	// ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ҵ�����뵥"+" "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()+" ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_BUSINESSAPPLICATION_FAILED, "ҵ�����뵥ʧ��");
      }
    }
  }
	
  /*�������ǩ����������*/
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

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync911201Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("������Կ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("���¹�����Կʧ��", top.TERMRETCODE_RQK_FAILED, "���¹�����Կʧ��");
      }
    }
  }
  
  /*���������Կ��������*/
  this.send911202Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911202"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911202Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync911202Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Կ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��Կ����ʧ��", top.TERMRETCODE_RQK_FAILED, "��Կ����ʧ��");
      }
    }
  }
  
  /*��������豸ǩ������*/
  this.send911203Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911203"); 
	reqMsg.appendNode("strTellerum",top.pool.get("strTellerum")); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	top.journalPrinter.addJournalWithTime("���͹�Աǩ������ send911203Async ");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911203Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync911203Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Աǩ��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.on911203Failed("��Աǩ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
   /*��������豸ǩ������*/
  this.send911204Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911204"); 
	reqMsg.appendNode("strTellerum",top.pool.get("strTellerum"));
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	top.journalPrinter.addJournalWithTime("���͹�Աǩ�˽��� send911204Async ");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911204Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync911204Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Աǩ��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��Աǩ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  
 /*��������豸ǩ��״̬��ѯ����*/
  this.send911205Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911205"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	top.journalPrinter.addJournalWithTime("���͹�Աǩ��״̬��ѯ send911205Async ");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911205Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync911205Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Աǩ��״̬��ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  var terminal_sign_flag = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/sign_flag");
	  top.pool.set("terminal_sign_flag",terminal_sign_flag);//0-δǩ��(padҲδǩ��)1-δǩ����pad��ǩ����2-��ǩ��
      var staffCode = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/staff_code");
	  if(null != staffCode && staffCode.length > 0){
		  if(terminal_sign_flag == '2'){
			  top.terminal.signTellerNum=staffCode;
		  }else{
			  top.terminal.signTellerNum="";
		  }
		  top.journalPrinter.addJournalWithTime("PADǩ����Ա��" + staffCode);  
	  }
	  if (typeof(top.MainFrame.on911205Successful) == "function")
      top.MainFrame.on911205Successful();
    }
    else
    {
      if (typeof(top.MainFrame.on911205Failed) == "function")
      {
        top.MainFrame.on911205Failed("��Աǩ��״̬��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  
  
  /*���������ѯ�������*/
  this.send902107Async = function()
  {
	  new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
      var exch = new ExchangeXmlWithHost();
	  var reqMsg = new ColsMsgXmlText();
      reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	  reqMsg.appendNode("strTransCode","902107"); 
	  reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	  reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	  reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	  reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	  reqMsg.appendNode("strCurrency",top.pool.get("strCurrency")); //����
      top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902107Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902107Complete = function(iRet)
  {
  	
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�˻�����ѯ902107"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqBalanceSuccess");//IC�����׺�д������
    	} else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
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
  /*�û��������*/
  this.getpassEncode= function(password)
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
     var passEncode=reqMsg.encode64(reqMsg.utf16to8(password));
   //  top.journalPrinter.addJournal("========="+passEncode);
     return passEncode;
  }
  /*�û��������*/
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
 
 	
  /*���������ѯ�̿���ϸ*/
  this.sendListCardExpLogAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ListCardExpLog");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onListCardExpLogAsyncComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onListCardExpLogAsyncComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ�̿���ϸ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ�̿���ϸʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*��ѯ�忨״̬*/
  this.sendCardSettleCycLogStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CardSettleCycLogStatus");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCardSettleCycLogStatusComplete);
  }

  /*�忨״̬��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncCardSettleCycLogStatusComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ�忨״̬"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ�忨״̬ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���˷��ͼӿ�����*/
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
    var strJrn = new top.StringCtrl("��ƾ֤���ף�"+top.pool.get("strCardUnitInfo"));
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911101Complete);
  }

  /*���˷��ͼӿ����ף���WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync911101Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ƾ֤����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ƾ֤����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������¿�����Ϣ*/
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

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncAddCardDispenserComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ӿ�"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("�ӿ�ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���������ѯ������Ϣ*/
  this.sendQueryCardDispenserAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CardUnitQuery");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncQueryCardDispenserComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncQueryCardDispenserComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���������ѯ������ϸ*/
  this.sendQueryCardDispenserDetailAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryCardDispenserDetail");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onQueryCardDispenserDetailAsyncComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onQueryCardDispenserDetailAsyncComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ������ϸ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ������ϸʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���˷����忨����*/
  this.send911102Async = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","911102"); 
    reqMsg.appendNode("strCardUnitInfo", top.pool.get("strCardUnitInfo"));
    var strJrn = new top.StringCtrl("��ƾ֤���ף�"+top.pool.get("strCardUnitInfo"));
    top.journalPrinter.addJournal(strJrn);
    
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync911102Complete);
  }

  /*���˷��ͼӿ����ף���WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync911102Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ƾ֤����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ƾ֤����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������¿�����Ϣ*/
  this.sendClearCardDispenserAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CleanCard");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncClearCardDispenserComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����
   * 
   * */
  this.onAsyncClearCardDispenserComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�忨"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("�忨ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*��ѯ��浥״̬*/
  this.sendCDSSettleCycLogStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CDSSettleCycLogStatus");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCDSSettleCycLogStatusComplete);
  }

  /*�忨״̬��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncCDSSettleCycLogStatusComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ��浥״̬"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ��浥״̬ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*��ȡ��ǰ�豸����״̬*/
   this.sendCDSSettleCycleStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CDSSettleCycleStatus");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCDSSettleCycleStatusComplete);
  }

  /*�忨״̬��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncCDSSettleCycleStatusComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ�豸����״̬"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ�豸����״̬ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*���������ѯ�浥����Ϣ*/
  this.sendQueryCDSCycleAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CDSUnitQueryCycle");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncQueryCDSCycleComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncQueryCDSCycleComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ�浥��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ�浥��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*����������˺��������ݿ��еĽ�����Ϣ*/
  this.sendClearCDSTransLogAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CleanCDSTrans");
    reqMsg.appendNode("successfulAcceptedCDS",top.pool.get("successfulAcceptedCDS")); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncClearTransLogComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncClearTransLogComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����ύ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("�����ύʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*����������´浥����Ϣ*/
  this.sendAddCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AddCDS");
    reqMsg.appendNode("cdsBoxInfoStr", top.pool.get("cdsBoxInfoStr"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncAddCDSComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncAddCDSComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�Ӵ浥"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("�Ӵ浥ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���������ѯ�浥����Ϣ*/
  this.sendQueryCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CDSUnitQuery");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncQueryCDSComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncQueryCDSComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ�浥��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ�浥��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������´浥����Ϣ*/
  this.sendClearCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CleanCDS");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncClearCDSComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncClearCDSComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��浥"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��浥ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*��ѯ��UKey״̬*/
  this.sendUKeySettleCycLogStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "UKeySettleCycLogStatus");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncUKeySettleCycLogStatusComplete);
  }

  /*�忨״̬��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncUKeySettleCycLogStatusComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ��UKey״̬"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ��UKey״̬ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������´浥����Ϣ*/
  this.sendAddUKeyAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AddUKey");
    reqMsg.appendNode("ukeyBoxInfoStr", top.pool.get("ukeyBoxInfoStr"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncAddUKeyComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncAddUKeyComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��UKey"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��UKeyʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*���������ѯUkey����Ϣ*/
  this.sendQueryUKeyAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "UKeyUnitQuery");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncQueryUKeyComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncQueryUKeyComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯUKey��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯUKey��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���������ѯ������ϸ*/
  this.sendQueryUkeyDispenserDetailAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryUkeyDispenserDetail");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onQueryUkeyDispenserDetailAsyncComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onQueryUkeyDispenserDetailAsyncComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ��Ukey��ϸ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ��Ukey��ϸʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�����������UKey����Ϣ*/
  this.sendClearUKeyAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CleanUKey");
   
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncClearUKeyComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncClearUKeyComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��UKey"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��UKeyʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���������ѯ����浥������Ϣ*/
  this.sendQueryAcceptedCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryAcceptedCDS");
    reqMsg.appendNode("successfulAcceptedCDS",top.pool.get("successfulAcceptedCDS"));    
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onQueryAcceptedCDSAsyncComplete);
  }

  /*���������ѯ�浥������Ϣ����WEB�����������첽�������ʱ�Ļص�����*/
  this.onQueryAcceptedCDSAsyncComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ����浥������Ϣ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ����浥������Ϣʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  
  /*���������ѯ�쳣����浥������Ϣ*/
  this.sendQueryAcceptedFailedCDSAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryAcceptedFailedCDS");
    reqMsg.appendNode("successfulAcceptedCDS",top.pool.get("successfulAcceptedCDS"));    
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onQueryAcceptedFailedCDSAsyncComplete);
  }

  /*���������ѯ�浥������Ϣ����WEB�����������첽�������ʱ�Ļص�����*/
  this.onQueryAcceptedFailedCDSAsyncComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ�쳣����浥������Ϣ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ�쳣����浥������Ϣʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*������������ն�ƾ֤��������Ϣ*/
  this.sendUpdateTermStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "UpdateTermStatus");
    reqMsg.appendNode("strPan",top.pool.get("strPan"));    //�˺�
    reqMsg.appendNode("strVouchNo",top.pool.get("strMangerVouchNo"));    //ƾ֤����
    reqMsg.appendNode("iTransLogId",top.pool.get("iTransLogId"));    // ������ˮid��,���ڸ�����ˮ
    reqMsg.appendNode("iTermTxStatus",top.pool.get("iTermTxStatus"));    //�ն˽���״̬ ��FinalDef.js
    reqMsg.appendNode("strTransType",top.pool.get("strMangerTransType"));  //  1:��2:key 3:�浥
    reqMsg.appendNode("strVouchType",top.pool.get("strMangerVouchType"));    // ����KEY������Ӧ���ͺ�
    reqMsg.appendNode("strTransCode",top.pool.get("strMangerTransCode"));    // �������״���
    reqMsg.appendNode("strCDSType",top.pool.get("strCDSType"));    // �浥���׷��࣬�浥��:1����2����3����4����
    reqMsg.appendNode("strIDCardNum",top.pool.get("strMangerIDCardNum"));    //���֤��

    
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onUpdateTermStatusAsyncComplete);
  }

  /*������������ն�ƾ֤��������Ϣ����WEB�����������첽�������ʱ�Ļص�����*/
  this.onUpdateTermStatusAsyncComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����ն�ƾ֤������"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

	//���½�����۳ɹ���ʧ��
    if (typeof(top.MainFrame.onUpdateTermStatusAsyncComplete) == "function")
        top.MainFrame.onUpdateTermStatusAsyncComplete();
  }
  
   /*���������ֵ���˻���ѯ����*/
  this.send902201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902201"); 
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902201Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902201Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ʻ���ѯ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  var strPan = top.exchxmlasync.msgxmldomResp.getElementValue("F34");	  
	  //���˺�
	  top.pool.set("strBindPan",strPan);
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessfulLoadInq");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oLoadFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  
  /*���������ֵ(�����)����*/
  this.send902202Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("60",new top.StringCtrl("").YuanToFen(top.pool.get("Amount")));//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902202"); 
	reqMsg.appendNode("Amount",  new top.StringCtrl("").YuanToFen(top.pool.get("Amount"))); //���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.cardreader.getField55()); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	if(top.pool.get("strBindPan") != null && top.pool.get("strBindPan") != ""){
		reqMsg.appendNode("strBindPan", top.pool.get("strBindPan")); //��ǿ����˺�		
	}else{
		reqMsg.appendNode("strBindPan", top.pool.get("strPan")); //���ÿ��ް��˺�
	}
	top.pool.set("isNeedReverse","1");
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902202Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902202Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ָ���˻���ֵ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//��������90�� = ��������+������+ԭ������ˮ��
	var strOrgTsns = "0020902202"+ top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    { 
		top.pool.set("isNeedReverse","");
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceScriptSuccessful");//IC�����׺�д������
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
		//���׽����ȷ�Ϸ������
		top.wins.showNewProcessingTip(top.langcur.oSendLoadUnknow);
		top.trans.send900002Async();
		top.MainFrame.onServiceFailed(top.langcur.oLoadFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}
  }  
  
  /*��ά���ͻ���Ϣ����*/
  this.send901101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901101"); 
	//�Ƿ��Ǵ�����
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strIDSexNum", top.pool.get("strAgentIDSexNum"));//�Ա�(��������)
		reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strAgentIDAddress")).replaceAll(",", " "));//סַ
		reqMsg.appendNode("strIDEnd", top.pool.get("strAgentIDEnd")); //���֤������
		reqMsg.appendNode("strIDCardNum", top.pool.get("strAgentIDCardNum")); //���֤��
		reqMsg.appendNode("strIDName", top.pool.get("strAgentIDName")); //����
		reqMsg.appendNode("strIDBorn", top.pool.get("strAgentIDBorn")); //��������		
	}else{
	    reqMsg.appendNode("strIDSexNum", top.pool.get("strIDSexNum"));//�Ա�(��������)
		reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//סַ
		reqMsg.appendNode("strIDEnd", top.pool.get("strIDEnd")); //���֤������
		reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��
		reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
		reqMsg.appendNode("strIDBorn", top.pool.get("strIDBorn")); //��������		
	}
	reqMsg.appendNode("strPhone", top.pool.get("strPhone"));//�ֻ���
	reqMsg.appendNode("strFamilyCall", top.pool.get("strHomeTel"));//��ͥ�绰
	var strAddress = top.pool.get("strFamilyAddr");
	if(strAddress != null && strAddress != "" && new top.StringCtrl("").getstrLength(strAddress) > 40) {
		strAddress = new top.StringCtrl("").cutstrringValaue(strAddress, 40);
	}
	reqMsg.appendNode("strFamilyAddr", new top.StringCtrl(strAddress).replaceAll(",", " "));//��ͥ��ַ
	reqMsg.appendNode("strJob", top.pool.get("strJob"));//ְҵ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901101Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901101Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ά���ͻ���Ϣ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    top.pool.set("customNo", top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateCustomInfoSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("ά���ͻ���Ϣʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*������˰ά���ͻ���Ϣ����*/
  this.send901102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901102"); 
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));//���֤����
	reqMsg.appendNode("adminSysId", top.pool.get("customNo")); //�ͻ���
	reqMsg.appendNode("strTaxFlag", top.pool.get("TaxFlag"));//˰�վ����ʶ
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901102Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901102Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����˰ά���ͻ���Ϣ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("isHaveCustomNum")){//�Ͽͻ�
    		 top.trans.sendImageFileAsync();
    	}else{//�¿ͻ�
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateTaxSuccessful");//IC�����׺�д������	
    	}
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�����˰ά���ͻ���Ϣʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
   /*��������*/
  this.send901104Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901104"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));   //�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //��������
	reqMsg.appendNode("strOpenCardType", top.pool.get("openCardType")); //57��
	reqMsg.appendNode("strCardType", top.pool.get("cardProduct")); //����Ʒ
	reqMsg.appendNode("strTransRandom", top.pool.get("strTransRandom"));//�����(71��)
	reqMsg.appendNode("strCostFee", top.pool.get("strCardPrice"));//������
	reqMsg.appendNode("strPindata", top.pool.get("PinBlock4"));//��ѯ����
	reqMsg.appendNode("strUsage", top.pool.get("strUse"));//������;
	reqMsg.appendNode("strOtherUsage", top.pool.get("strOtherUsage"));//������;
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901104Complete);
  }


   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901104Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����901104"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strOpenTsn", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.openCardSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCardDispenserFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*��ǿ������*/
  this.send901201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901201"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //��������
	reqMsg.appendNode("strCardActiveFlag", top.pool.get("cardActiveFlag")); //�����ʾ
	reqMsg.appendNode("strPindata", top.pool.get("PinBlock4")); //��ѯ����
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901201Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901201Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ǿ�����901201"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("cardActiveFlag") == "N") {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqActiveSuccess");//IC�����׺�д������
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.openCardSuccess");//IC�����׺�д������
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
  
  /*��ǿ�����ǰ��ѯ����*/
  this.send901210Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901210"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //��������
	reqMsg.appendNode("strCardActiveFlag", top.pool.get("cardActiveFlag")); //�����ʾ
	reqMsg.appendNode("strPindata", top.pool.get("PinBlock4")); //��ѯ����
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901210Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901210Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ǿ�����ǰ��ѯ901210"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("cardActiveFlag") == "N") {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqActiveSuccess");//IC�����׺�д������
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.openCardSuccess");//IC�����׺�д������
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
  
    /*��������ͻ���Ϣ��ѯ-���ÿ��˻���ѯ����*/
  this.send904503Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904503"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������	
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904503Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904503Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��˻���ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful_AccListQuery");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*��������ͻ���Ϣ��ѯ-���ÿ���Ƭ��ѯ����*/
  this.send904504Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904504");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904504Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904504Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ���Ƭ��ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryCustomSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*��������ͻ���Ϣ��ѯ-���ÿ���Ƭ��ѯ����*/
  this.sendCreditInfoAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904504");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("DestPan")); //�˺�

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onCreditInfoAsyncComplete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onCreditInfoAsyncComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ���Ƭ��ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQuerySuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*�������ת��-����ǽ�������*/
  this.send903101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("40",top.pool.get("Amount"));//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903101");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("strPassbookNo", top.pool.get("hostAccount")); //�˺�
	}
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	reqMsg.appendNode("strDestPan", top.pool.get("DestPan"));//ת�뿨��
	reqMsg.appendNode("strTransUse", top.pool.get("transUseSelect"));//�ʽ���;
	reqMsg.appendNode("strAcceptName", top.pool.get("StrPanNameToSign"));//�տ�������
	reqMsg.appendNode("strF616NM", top.pool.get("PayerCustName"));//����������
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903101Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync903101Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ת��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oTransferFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*ת���ۼƽ��׶�Ȳ�ѯ*/
  this.send903111Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903111");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //ת���˺�
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //ת���˺�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903111Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync903111Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ת��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onService903111Successful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oTransferFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*������������ֽ���-д�������������*/
  this.send902209Async = function(func)
  {
	onAsyncExchangeComplete = func;
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902209");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("Amount", new top.StringCtrl("").YuanToFen(top.pool.get("Amount"))); //���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strScriptRes",top.pool.get("strScriptRes")); //���ӽ�����Ϣ
	reqMsg.appendNode("strOrgTsns", top.pool.get("strOrgTsns")); //ԭ������ˮ��
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902209Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902209Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("д���������"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//д���ɹ�����ҳ��
	if(top.pool.get("strScriptRes")!= null && top.pool.get("strScriptRes") == "Y"){
		if(typeof(eval(onAsyncExchangeComplete))=="function"){//�ص�ԭ����Ҫ���صĺ�����ȥ
             eval(onAsyncExchangeComplete+"();"); 
        }
	}else{		
		 if(top.pool.get("isNeedReverse") == "1"){
			top.pool.set("isNeedReverse",""); 
			//д��ʧ�ܺ����������
			top.wins.showNewProcessingTip(top.langcur.oSendLoadFail);
			top.trans.send900002Async();	
		 }		
		 top.MainFrame.onServiceFailed("IC������ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);		 
	}	
  }
  
  /*���������������-����ѯ����*/
  this.send907301Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907301");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strGjjType", top.pool.get("strGjjType")); //���������� 
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907301Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync907301Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����������ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		//���׳ɹ���ȡ��������
		top.pool.set("strAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//�������˺�
		top.pool.set("strAmount",top.exchxmlasync.msgxmldomResp.getElementValue("F54"));//ʵ�����
		top.pool.set("strMonAmount",top.exchxmlasync.msgxmldomResp.getElementValue("F54_1"));//�½ɴ��
		top.pool.set("strOrgName",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//��λ����
		top.pool.set("strCustName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//�ͻ�����
		top.pool.set("strEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));//���ݽ�ֹ����
		
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���������������-��ϸ��ѯ����*/
  this.send907302Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907302");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strGjjType", top.pool.get("strGjjType")); //���������� 
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907302Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync907302Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��������ϸ��ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      //���׷��سɹ���ȡ��ϸ���ݣ�F59��
      top.pool.set("strDetail",top.exchxmlasync.msgxmldomResp.getElementValue("F59"));
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqDeFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������ɷѽ���-�û���Ų�ѯ����*/
  this.send907110Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907110");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strUserId", top.pool.get("UserNum"));    //�û����	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907110Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync907110Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�û���Ų�ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("UserName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/userName"));
    top.pool.set("UserId",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/userId"));
    top.pool.set("UserAddr",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/userAddr"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oFeeInqFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������ɷѽ���-�ɷ������ѯ����*/
  this.send907101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907101");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strUserNum", top.pool.get("UserNum")); //������ 
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strUserType",top.pool.get("strUserType")); //��������
	if(top.pool.get("strCompanyNum") != null && top.pool.get("strCompanyNum")!=""){
		reqMsg.appendNode("strCompanyNum",top.pool.get("strCompanyNum")); //��˾����	
	}	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907101Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync907101Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ɷ������ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oFeeInqFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������ɷѽ���-ˮ��ú�ɷ�����*/
  this.send907102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907102");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strUserType",top.pool.get("strUserType")); //��������
	reqMsg.appendNode("strUserNum", top.pool.get("UserNum")); //������ 
	reqMsg.appendNode("Amount",top.pool.get("strPayAmount")); //Ƿ�ѽ��
	reqMsg.appendNode("strCompanyNum",top.pool.get("strCompanyNum")); //��˾����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907102Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync907102Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ɷ�"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	var strOrgTsns = "0001907102"+ top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
	//���׽��
	top.pool.set("Amount",top.pool.get("strPayAmount"));
		
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else if(iRet == top.RESULT_FAILED)
    {
        if (typeof(top.MainFrame.onServiceFailed) == "function")
        {
          top.MainFrame.onServiceFailed(top.langcur.oPaymentFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
        }
    }else{
		//���׽����ȷ��
		top.wins.showNewProcessingTip(top.langcur.oSendPayFail);
		top.trans.send900002Async();
		top.MainFrame.onServiceFailed(top.langcur.oPaymentFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}
  }
  
    /*����������ɷѽ���-��ɷ�����*/
  this.send907111Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","907111");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strUserId", top.pool.get("UserId")); //������ 
	reqMsg.appendNode("Amount",new StringCtrl("").YuanToFen(top.pool.get("strFeeAmount")));//�ܽ��
	reqMsg.appendNode("strChargeFlag",top.pool.get("strChargeFlag")); //Ӧ�ձ�־
	reqMsg.appendNode("strPayerCustName",top.pool.get("UserName")); //�˻�����
	reqMsg.appendNode("strAmountMonth",top.pool.get("strAmountMonth")); //Ӧ������
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907102Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync907111Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����ɷ�"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	var strOrgTsns = top.exchxmlasync.msgxmldomResp.getElementValue("transSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
	//���׽��
	top.pool.set("Amount",top.pool.get("strFeeAmount"));
		
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else if(iRet == top.RESULT_FAILED)
    {
        if (typeof(top.MainFrame.onServiceFailed) == "function")
        {
          top.MainFrame.onServiceFailed(top.langcur.oPaymentFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
        }
    }else{
		//���׽����ȷ��
		top.wins.showNewProcessingTip(top.langcur.oSendPayFail);
		top.trans.send900002Async();
		top.MainFrame.onServiceFailed(top.langcur.oPaymentFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}
  }
    /*���������ǿ��޸���������*/
  this.send902503Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("70","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902503");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("PinBlock2", top.pool.get("PinBlock2")); //������
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	reqMsg.appendNode("strPwdFlag",top.pool.get("strPwdFlag"));//3-��ѯ����;2-��������
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺� ����ʹ��
	reqMsg.appendNode("strVoucherNo", top.pool.get("strVoucherNo")); //��չ���˺� ƾ֤����
	reqMsg.appendNode("strVoucherType", top.pool.get("strVoucherType")); //��չ���˺� ƾ֤����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //���֤��
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902503Complete);
	
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902503Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�޸�����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oPassModFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�����������ת��������*/
  this.send903401Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903401");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", (top.pool.get("Amount")*100).toFixed(0)); //���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strProductType","3504");//��Ʒ����
	reqMsg.appendNode("strProductSubType",top.pool.get("strProductSubType"));//��Ʒ����
	reqMsg.appendNode("strFloatingIntRate",top.pool.get("strFloatingIntRate"));//�������
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903401Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync903401Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ת����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oTransferFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
    /*�����������ת��������*/
  this.send903402Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903402");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strFixedPan",top.pool.get("strFixedPan"));//�����˻�
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //���
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903402Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync903402Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ת����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oTransferFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
 
  /*�����������(��ֵ���ɷѳ���)����*/
  this.send900002Async = function()
  {
		var exch = new ExchangeXmlWithHost();
		var reqMsg = new ColsMsgXmlText();
		reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Reverse");//�����߳�
		reqMsg.appendNode("strTransCode","900002");    //���ױ��룬��Ҫ�������ļ���Ӧ
		reqMsg.appendNode("Amount", top.pool.get("Amount")); //���
		reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
		reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺�  //�����۳�����
		reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
		//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
		reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
		reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
		reqMsg.appendNode("orgTsn", top.pool.get("strOrgTsns"));  //ԭ������ˮ��
		reqMsg.appendNode("strField57", top.pool.get("strField57"));
		reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
		var strJrn = new top.StringCtrl("���ͳ�������");
		top.journalPrinter.addJournal(strJrn);
		exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
  }
  
  /*����ӷ��������ص�XML����*/
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
    reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);    //�ն˱��
  	reqMsg.appendNode("strPan", top.pool.get("strPan"));    //����
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCheckCardTrackComplete);
  }

  /*
    ˽�к�������WEB�����������첽�������ʱ�Ļص�����
  */
  this.onAsyncCheckCardTrackComplete = function(iRet)
  {
	// ��¼�ն���ˮ
	var strJrn = new top.StringCtrl("����У��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
	      top.MainFrame.onServiceFailed("����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	   }
	}
  }
  
  //����ˮ״̬����
  this.sendCardPresentedAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
  	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CardPresented");
    reqMsg.appendNode("transLogId", top.pool.get("transLogId"));    //������ˮ
  	reqMsg.appendNode("termTxStatus", top.pool.get("termTransStatus"));    //�ն˽���״̬
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCardPresentedComplete);
  }
  
    /*
    ˽�к�������WEB�����������첽�������ʱ�Ļص�����
  */
  this.onAsyncCardPresentedComplete = function(iRet)
  {
	// ��¼�ն���ˮ
	var strJrn = new top.StringCtrl("����ˮ״̬����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);

	if (iRet == top.RESULT_SUCCESSFUL)
	{
	}
	else
	{
	}
  }

  /*��������������ÿ�����*/
  this.send904102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904102");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //���֤��
	reqMsg.appendNode("strCardCVV2", top.pool.get("cvcValue"));  //CVC��
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904102Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904102Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ�����  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 

  /*������������������루����ǣ�*/
  this.send902502Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902502");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //���֤��
	reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//סַ
	reqMsg.appendNode("strIDSex", top.pool.get("strIDSex"));//�Ա�
	reqMsg.appendNode("strIDEnd", top.pool.get("strIDEnd")); //���֤������
	reqMsg.appendNode("strMobileCall", top.pool.get("strPhone"));//�ֻ���
	reqMsg.appendNode("strIDBorn", top.pool.get("strIDBorn"));//��������
	reqMsg.appendNode("strVoucherType", top.pool.get("strVoucherType"));//ƾ֤����
	reqMsg.appendNode("strVoucherNo", top.pool.get("strVoucherNo"));//ƾ֤����
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strPwdFlag",top.pool.get("strPwdFlag"));//3-��ѯ����;2-��������
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //IC����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902502Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902502Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��������  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.pool.set("strPinBlock",top.pool.get("PinBlock2"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.reSetPWDSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*����������ͽ������루����ǣ�*/
  this.send902501Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902501");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902501Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902501Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�������� ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.unLockPWDSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  
  /*������������˻��б��ѯ*/
  this.send902106Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902106");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺� 
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902106Complete);
  }
  
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902106Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�˻��б��ѯ902106  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
		
  /*������������˻���Ϣ��ѯ*/
  this.send902105Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902105");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strSubPan", top.pool.get("strPan")); //�˺� 
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("DestPan",top.pool.get("DestPan"));//��չ���˺�
	reqMsg.appendNode("strSubAcctType", top.pool.get("strSubAcctType"));       //���˻�����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902105Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902105Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�˻���Ϣ��ѯ902105 ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("inqFristCard", "");
    	top.pool.set("F60_1",top.exchxmlasync.msgxmldomResp.getElementValue("F60_1"));//֤����
		top.pool.set("F61_6_NM",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//�ֿ�����
		top.pool.set("subAcctNo",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//���˻���
		top.pool.set("F54_ZHYE",top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));//�˻����
		//�������
		top.pool.set("strAccKYYE",top.exchxmlasync.msgxmldomResp.getElementValue("F54_KYYE"));
		top.pool.set("acctStatus",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctStatus"));//�˻�״̬
		top.pool.set("acctType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctType"));//�˻�����
		top.pool.set("termCurrentFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/termCurrentFlag"));//����/���ڱ�ʶ
		top.pool.set("acctKind",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctKind"));//�˻����
		top.pool.set("strDestHolderName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));
	    //ȡ�����˺�
	    top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onService902105Successful");//IC�����׺�д������
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


  /*��������������ÿ��Զ�����Լ����ѯ*/
  this.send904107Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904107");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strCurrency",top.pool.get("strCurrency")); //����
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904107Complete);
  }
  
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904107Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��Զ�����Լ����ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	//��ǩԼ
      	var bindPan = top.exchxmlasync.msgxmldomResp.getElementValue("F34");
      	var strModeOfRepayment = top.exchxmlasync.msgxmldomResp.getElementValue("F57");
      	if(null != bindPan && bindPan.length > 15)top.pool.set("bindPan",bindPan);
      	if(null != strModeOfRepayment && strModeOfRepayment.length > 0) top.pool.set("strModeOfRepayment",strModeOfRepayment);	
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
     else
    {
    	var respCode = top.exchxmlasync.strTermRetCode;
    	//δǩԼ respCode 009068  respDesc ���Կۻ����˺�
    	if ("009068"==respCode && typeof(top.MainFrame.onQueryUNRepay) == "function"){
      	top.MainFrame.onQueryUNRepay();
    	}else	if (typeof(top.MainFrame.onServiceFailed) == "function"){
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  
  /*����������Ͱ�֤���Ų�ѯ�ֿ��˿���*/
  this.send904502Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904502");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //֤����
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //����
	reqMsg.appendNode("certType", top.pool.get("certType"));  //֤������
	reqMsg.appendNode("PAGE-FLAG", top.pool.get("PAGE-FLAG"));  //��ҳ��ʶ
	
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904502Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904502Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��˻��б��ѯ904502  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSelectAcc");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
   /*��������������ÿ��Զ�����Լ������*/
  this.send904105Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904105");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("DestPan", top.pool.get("SuccPan"));  //���˻�
	reqMsg.appendNode("strCurrency",top.pool.get("strCurrency")); //����
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904105Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904105Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��Զ�����Լ������  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onReypaySuccessful");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
   /*��������������ÿ��Զ�����Լ��ȡ��*/
  this.send904106Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904106");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("DestPan", top.pool.get("DestPan"));  //����˻�
	reqMsg.appendNode("strCurrency",top.pool.get("strCurrency")); //����
	reqMsg.appendNode("strModeOfRepayment",top.pool.get("strModeOfRepayment"));
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904106Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904106Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��Զ�����Լ��ȡ��  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCancleSuccessful");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*��������������ÿ��Զ����㻹���ѯ*/
  this.send904208Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904208");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904208Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904208Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��Զ����㻹���ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	//��ǩԼ
      	var bindPan = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctNo");
      	if(null != bindPan && "" != bindPan){
			
			top.pool.set("bindPan",bindPan);	
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");
		}else{
				
			if (typeof(top.MainFrame.onQueryUNRepay904208) == "function"){
			
				top.MainFrame.onQueryUNRepay904208();
			}else if (typeof(top.MainFrame.onServiceFailed) == "function"){
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, "", "���Կۻ����˺�");
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
  
   /*��������������ÿ��Զ����㻹���Լ*/
  this.send904207Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904207");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904207Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904207Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��Զ����㻹���Լ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCancleSuccessful");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*��������������ÿ��Զ����㻹������*/
  this.send904206Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904206");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("DestPan", top.pool.get("SuccPan"));  //���˻�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strservcd", top.pool.get("servcdSelect"));  //���ʽ
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904206Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904206Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��Զ����㻹������  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onReypaySuccessful");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*������������˻��б��ѯ*/
  this.send902110Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902110");    //���ױ��룬��Ҫ�������ļ���Ӧ
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("productType", top.pool.get("strproductType"));  //��Ʒ����
	reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo"));  //ѭ����ѯ��ʶ
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902110Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902110Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�˻��б��ѯ902110  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));		
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.SelectSubCount");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���˻��б��ѯ*/
  this.send902125Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902125");    //���ױ��룬��Ҫ�������ļ���Ӧ
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902125Complete);
  }
	/*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902125Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�˻��б��ѯ902125  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.showView");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

 /*�������������ϸ��ѯ*/
  this.send902111Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902111");    //���ױ��룬��Ҫ�������ļ���Ӧ
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("DestPan", top.pool.get("DestPan"));  //���ŵ�
	reqMsg.appendNode("strStartDate", top.pool.get("BeginDate"));  //��ʼ����
	reqMsg.appendNode("strEndDate", top.pool.get("EndDate"));  //��������
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));  //����
	reqMsg.appendNode("strCashRemitFlag", top.pool.get("strCashRemitFlag"));  //�����ʶ
	
	if(top.pool.get("startRecordNo") != null && top.pool.get("startRecordNo").length > 0 ){
		reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo"));  //��ʼ��ѯ��¼��  �״�Ϊ�գ��������ͷ�����Ϣ	
	}else{
		reqMsg.appendNode("startRecordNo", "1");
	}
	reqMsg.appendNode("strF123", top.pool.get("strF123"));//�״�Ϊ�գ��������ͷ�����Ϣ	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902111Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902111Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ʷ��ϸ��ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));	
		top.pool.set("strF123",top.exchxmlasync.msgxmldomResp.getElementValue("F123"));	
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 

 /*�ۺ�ǩԼ��ѯ*/
  this.send901610Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901610");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901610Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901610Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ۺ�ǩԼ��ѯ901610  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strSignStatus", top.exchxmlasync.msgxmldomResp.getElementValue("F57"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSignSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�ۺ�ǩԼ��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 

 /*ATMת�˼��޶��ѯ*/
  this.send901703Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901703");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901703Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901703Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ATMת�˼��޶��ѯ901703  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	//�Ƿ�ǩԼ��־λ
    	var atmTransferFlag = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/atmTransferFlag");
    	top.pool.set("atmTransferFlag",atmTransferFlag);
    	//���޶�
    	var cashAmtLimit = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/cnyDateQuota");
		//�����޶�    
	    var transferLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/atmTransferQuota"); 
        if(null != cashAmtLimit && cashAmtLimit.length > 0){
      	    top.pool.set("cashAmtLimit",cashAmtLimit);
    	}
    	if(null != transferLimitAmt && transferLimitAmt.length > 0){
      	   top.pool.set("transferLimitAmt",transferLimitAmt);
    	}
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqTrfLmtSucceful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*ATMת�˼��޶�*/
  this.send901704Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901704");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strAtmTransferQuota", top.pool.get("strDayLimitAmount"));//atmת���޶�
	//�籣��ǩԼ  00000076 �籣��
	if(top.pool.get("productType") == "00000076"){
		reqMsg.appendNode("strAbroadCashDateQuota","10000");//����ȡ�����޶�
		reqMsg.appendNode("strSsdAtmCashDateQuota","10000");
	}else{
		reqMsg.appendNode("strAbroadCashDateQuota","20000");
		reqMsg.appendNode("strSsdAtmCashDateQuota","20000");
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901704Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901704Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ATMת�˼��޶�ǩԼ901704  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    top.pool.set("JJKQYTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onJJKQYComplete");//IC�����׺�д������
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
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
    	        top.MainFrame.onServiceFailed("ATMת��ǩԼʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
  /*С������ǩԼ*/
  this.send901707Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901707");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTrfLimitAmount", top.pool.get("transLimitAmt"));//����
	reqMsg.appendNode("strDayLimitAmount", top.pool.get("dayTransLimitAmt"));//����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901707Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901707Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("С������ǩԼ901707  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("XEMMTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onXEMMComplete");//IC�����׺�д������
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
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
    	        top.MainFrame.onServiceFailed("С������ǩԼʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
  /*�ֻ��ŵǼ�����*/
  this.send901712Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901712");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("inputPhone",top.pool.get("strPhone"));//�ֻ���
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901712Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901712Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ֻ��ŵǼ�����901712  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("DSFKJTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onDSFKJComplete");//IC�����׺�д������
    	}else {
		    new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
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
    	        top.MainFrame.onServiceFailed("�ֻ��ŵǼ�����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
  /*�޶�����ѯ*/
  this.send901806Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901806");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strFastPayType",top.pool.get("strPayType"));//��������
	reqMsg.appendNode("strType",top.pool.get("strType"));//֧����������
	reqMsg.appendNode("strBindAcctType",top.pool.get("acctKind"));//�˻�����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901806Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901806Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�޶�����ѯ901806  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("strPayType") == "008036-UPQ011"){
    		//�����޶�
        	var transLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/singleLimit");
    		//�����ۼ��޶�    
    	    var dayTransLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/dayLimit");
    	    //�����ۼ��޶�    
    	    var monthLimith = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/monthLimit");
		}else{
			//�����޶�
	    	var transLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/transLimitAmt");
	    	//�����ۼ��޶�     
		    var dayTransLimitAmt = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F59/dayTransLimitAmt");
		    //�����ۼ��޶�    
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
    	
	    new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqTrfLmtSucceful");//IC�����׺�д������
    }else{
    	//δǩԼ������Ϣά��ҳ��
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
	        top.MainFrame.onServiceFailed("�޶�����ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	    }
    }
  } 
  
  /*�޶�����޸�*/
  this.send901807Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901807");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender", "2");
	}else{
		reqMsg.appendNode("strGender", "1");	
	}
	reqMsg.appendNode("strType",top.pool.get("strType"));//֧����������
	reqMsg.appendNode("strSignType",top.pool.get("strFastPayType"));//��������
	if(top.pool.get("strFastPayType") == "008036-UPQ012"){ // �����޿����֧��
		reqMsg.appendNode("strSingleLimit", new top.StringCtrl("").YuanToFen(top.pool.get("strTransLimitAmt")));//����
		reqMsg.appendNode("strDayLimit", new top.StringCtrl("").YuanToFen(top.pool.get("strDayTransLimitAmt")));//����
		reqMsg.appendNode("strMonthLimit", new top.StringCtrl("").YuanToFen(top.pool.get("strMonthLimith")));//����
	}else{
		reqMsg.appendNode("strTrfLimitAmount", new top.StringCtrl("").YuanToFen(top.pool.get("strTransLimitAmt")));//����
		reqMsg.appendNode("strDayLimitAmount", new top.StringCtrl("").YuanToFen(top.pool.get("strDayTransLimitAmt")));//����
		reqMsg.appendNode("strMonthLimith", new top.StringCtrl("").YuanToFen(top.pool.get("strMonthLimith")));//����
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901807Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901807Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�޶�����޸�901807  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    top.pool.set("XEGLTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
		if (typeof(top.MainFrame.onServiceFailed) == "function")
	    {
	        top.MainFrame.onServiceFailed("�޶�����޸�ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	    }
    }
  } 
  
  /*��������רҵ��ע��*/
  this.send908201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908201");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock4")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
	reqMsg.appendNode("strBirthdayDt", top.pool.get("strIDBorn")); //����
	reqMsg.appendNode("strRegIdAddr", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " ")); //��ַ
	reqMsg.appendNode("strPostCode", "200000");  //�ʱ�
//	reqMsg.appendNode("strTel",top.pool.get("strPhone"));//�绰
	reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//�ֻ���
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender", "F");
	}else{
		reqMsg.appendNode("strGender", "M");	
	}
	reqMsg.appendNode("strVoucherType", top.pool.get("strUkeyType")); //ƾ֤����strVoucherNo
	reqMsg.appendNode("strVoucherNo", top.pool.get("UkeyNum")); //ƾ֤��
	reqMsg.appendNode("strUKeyNum", top.pool.get("LocalUkeyNum")); //Ukey���
	reqMsg.appendNode("strCostFee", top.pool.get("strUkeyPrice"));//������
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908201Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908201Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��������רҵ��ע��908201  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("strUkeyTsn", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    top.pool.set("WYZSBTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onWYZSBComplete");//IC�����׺�д������
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
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
    	        top.MainFrame.onServiceFailed("��������רҵ��ע��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
  /*�����������Ű�ע��*/
  this.send908202Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908202");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock4")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
	reqMsg.appendNode("strBirthdayDt", top.pool.get("strIDBorn")); //����
	reqMsg.appendNode("strRegIdAddr", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " ")); //��ַ
	reqMsg.appendNode("strPostCode", "200000");  //�ʱ�
//	reqMsg.appendNode("strTel",top.pool.get("strPhone"));//�绰
	reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//�ֻ���
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender", "F");
	}else{
		reqMsg.appendNode("strGender", "M");	
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908202Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908202Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����������Ű�ע��908202  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("WYZSBTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode","success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onWYZSBComplete");//IC�����׺�д������
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
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
    	        top.MainFrame.onServiceFailed("�����������Ű�ע��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  } 
  
 /********************��������ؽ���***************************/

  /*�����˲�*/
  this.send910201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","910201");    //���ױ��룬��Ҫ�������ļ���Ӧ
	
	//�Ƿ��Ǵ����������˲�
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strIDName", top.pool.get("strAgentIDName"));  //����
		reqMsg.appendNode("strIDCardNum", top.pool.get("strAgentIDCardNum"));  //���֤��
	}else{
		reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //����
		reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //���֤��
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910201Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910201Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����˲�  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//�ж����֤�Ƿ���
    	if(top.pool.get("isAgent") == "1") {
    		//������
    		if(top.pool.get("strAgentIDEnd") != "" && top.pool.get("strAgentIDEnd") != "����" && (parseInt(top.pool.get("strAgentIDEnd")) < parseInt(new top.DateTimeCtrl().getYYYYMMDD())))
        	{
        	    if (typeof(top.MainFrame.onServiceFailed) == "function")
        	    {
        	    	top.pool.set("isPersonal", "");
        	    	top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "�Բ������֤�ѵ��ڣ�");
        	    	return;
        	    }
        	}
    	}else {
    		if(top.pool.get("strIDEnd") != "" && top.pool.get("strIDEnd") != "����" && (parseInt(top.pool.get("strIDEnd")) < parseInt(new top.DateTimeCtrl().getYYYYMMDD())))
        	{
        	    if (typeof(top.MainFrame.onServiceFailed) == "function")
        	    {
        	    	top.pool.set("isPersonal", "");
        	    	top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "�Բ������֤�ѵ��ڣ�");
        	    	return;
        	    }
        	}
    	}
    	
    	top.pool.set("customNo",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
    	//���ֻ���
    	top.pool.set("mobileCall",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mobileCall"));
    	//��ͥ��ַ
    	top.pool.set("familyAddr",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/familyAddr"));
    	//��ͥ�绰
    	top.pool.set("familyCall",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/familyCall"));
    	
		if(top.pool.get("isAgent") == "1"){
			//�����������˲���Ƭ
			top.pool.set("strAgentIDOnLineImage",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//�����˲鷵�ص���Ƭ(base64�ַ���)
		}else{
			top.pool.set("strIDOnLineImage",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//�����˲鷵�ص���Ƭ(base64�ַ���)
		}		
    	//�Ƿ���Ҫ��֤��֤��һ
    	if(top.pool.get("isPersonal") == "1") {
    		top.pool.set("isPersonal", "");
    		if(top.pool.get("strIDCardNum") != "" && top.pool.get("strIDCardNum") != null && top.pool.get("strIDCardNum") == top.pool.get("strRespIDNo")) {
				new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onNetworkVirificationSuccessful");//IC�����׺�д������
    		}else {
				if(top.pool.get("IDCardAcceptFlag") != "" && top.pool.get("IDCardAcceptFlag") != null && top.pool.get("IDCardAcceptFlag") == "1"){
					if (typeof(top.MainFrame.onNetworkVirificationSuccessful) == "function")
						top.MainFrame.onNetworkVirificationSuccessful();
					else
						top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "���֤��֤�뻧����һ��");
				}else{
					if(top.pool.get("IDCardAcceptFlag") != "" && top.pool.get("IDCardAcceptFlag") != null && top.pool.get("IDCardAcceptFlag") == "2")
						top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "���֤��֤�뻧����һ��");//2018-1-16 ȡ��ʱ��֤��һ��ʾ�޸�
					else
						top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, "��ҵ���豾�˰���");
				}
			}
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onNetworkVirificationSuccessful");//IC�����׺�д������	
    	}

    }
    else
    {
    	top.pool.set("isPersonal", "");
	    if (typeof(top.MainFrame.onServiceFailed) == "function")
	    {
			/*  P102-ð�������˻�  P103-6�����޽����˻�  P104-��ϴǮ�˻� 
                P105-���к�����    P106-���к�����       P107-�永����˻�
                P108-��Ѷթƭ������
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


 /*����ǰ��ѯ�˻��б�*/
  this.send901110Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901110");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));//�ͻ���
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����(71��)
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901110Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901110Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ǰ��ѯ�˻��б�901110  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	top.pool.set("openCardFlag", top.exchxmlasync.msgxmldomResp.getElementValue("F57"));	
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqLinkCardSuccess");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���໧��һ�໧*/
  this.send902123Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902123");                         //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("customNo"));        //�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                //���໧����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));    //֤������
	reqMsg.appendNode("strTransRandom", top.pool.get("strTransRandom"));//�����(71��)
	reqMsg.appendNode("strCardNo", top.pool.get("strFristPan"));        //һ�໧����
	reqMsg.appendNode("strMobileNo", top.pool.get("strPhone"));         //�ֻ���
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902123Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902123Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���໧��һ�໧  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("cardRetCode", "success");
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onLinkFristCardSuccess");//IC�����׺�д������		
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
  
 /*���ÿ��˵�ͷ��ѯ*/
  this.send904506Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904506");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
    reqMsg.appendNode("strStartDate", top.pool.get("strDate")); //�˵�����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904506Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904506Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�˵�ͷ��ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//��С�����
      top.pool.set("strMiniPay",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/minPayAmt"));
      //����Ӧ����
      top.pool.set("strCurrentPay",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/periodAmt"));
	  //�˵���
	  top.pool.set("DueDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/billDay"));
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onBillTopSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���ÿ��ѳ��˵���ѯ*/
  this.send904508Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904508");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strStartDate", top.pool.get("strDate")); //��ѯ����

	if(top.pool.get("startRecordNo") != null && top.pool.get("startRecordNo").length > 0 ){
		reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo"));  //��ʼ��ѯ��¼��  �״�Ϊ�գ��������ͷ�����Ϣ	
	}else{
		reqMsg.appendNode("startRecordNo", "");
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904508Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904508Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��ѳ��˵���ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));			
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
 
     /*���ÿ��ѳ��˵���ѯ*/
  this.send904508SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904508");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strStartDate", top.pool.get("strDate")); //��ѯ����

	if(top.pool.get("startRecordNo") != null && top.pool.get("startRecordNo").length > 0 ){
		reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo"));  //��ʼ��ѯ��¼��  �״�Ϊ�գ��������ͷ�����Ϣ	
	}else{
		reqMsg.appendNode("startRecordNo", "");
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904508SecondComplete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904508SecondComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ÿ��ѳ��˵���ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));			
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���ÿ�δ���˵���ѯ*/
  this.send904507Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	top.exchxmlasync.onAsyncExchangeComplete ="again";
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904507");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo")); //��ҳ��ѯ���ͷ����ֶ�
	

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904507Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904507Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("δ���˵�  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));		
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*���ÿ�δ���˵���ѯ*/
  this.send904507SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","904507");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("startRecordNo", top.pool.get("startRecordNo")); //��ҳ��ѯ���ͷ����ֶ�
	

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync904507SecondComplete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync904507SecondComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("δ���˵�  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	//top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.getElementValue("startRecordNo"));
		top.pool.set("startRecordNo",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/startRecordNo"));		
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 


 /*���۲���*/
  this.send902301Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902301");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("CUACNO"));          //�����˺�
	reqMsg.appendNode("strTrack2", top.pool.get("TRACK2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902301Complete);
  }

  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902301Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���۲���  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
			top.MainFrame.onServiceFailed("���۲��ǲ�ѯʧ��", top.exchxmlasync.strTermRetCode, "�޲�������");
		}else{
			top.MainFrame.onServiceFailed("���۲��ǲ�ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
        
      }
    }
  } 

  /*�������˻���ѯ*/
   this.send902109Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902109");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));   //�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("DestPan", top.pool.get("hostAccount")); // ���˺�
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902109Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902109Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�������˻���ѯ902109  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {  
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryCurrentSubAccountSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*PAD��˽���*/
  this.send910301Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910301");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("idPhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("idPhotoUrl")))); //��
	reqMsg.appendNode("idPhotoBackUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("idPhotoBackUrl")))); //��
	reqMsg.appendNode("scenePhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("scenePhotoUrl"))));//�ֳ�
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strBranchNo", "00010");
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId"));
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strBranchName","ATM");
	reqMsg.appendNode("strSceneCheck","N");	
	reqMsg.appendNode("strCheckContent",top.pool.get("strCheckContent"));	
	reqMsg.appendNode("strExpireTime",top.iPadCheckTimeout);	
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//����
	//�Ƿ����
	if(top.pool.get("strAgentFlag") == "1"){
		reqMsg.appendNode("strAgentIDName",top.pool.get("strAgentIDName"));//������
		reqMsg.appendNode("strAgentFlag",top.pool.get("strAgentFlag"));
		reqMsg.appendNode("strAgentIdType","00");
	}else{
		reqMsg.appendNode("strAgentFlag","0");		
	}
	
	reqMsg.appendNode("strTransDateAndTime",new top.DateTimeCtrl(null).getYYYYMMDD()+ new top.DateTimeCtrl(null).getHHmmSS());
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��
	//�籣������ pad�������ǩ����Ƭ���籣��Ƭ
	if(top.pool.get("strbusinessCode") == "901123"){
		if(top.pool.get("strImageNum") == "0"){
			reqMsg.appendNode("selfSignPhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("signaturePhotoUrl")))); //����ǩ����
		}else if(top.pool.get("strImageNum") == "1"){
			reqMsg.appendNode("socialSecurityPhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("wechatPhotoUrl")))); //�籣����Ƭ
			reqMsg.appendNode("selfSignPhotoUrl", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("signaturePhotoUrl")))); //����ǩ����
		}
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910301Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910301Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("PAD��˽���  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strReqSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/checkSerialNo"));
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  //������˽����ѯ
	   isCheckLoadingMore = true;	   
	   top.trans.send910303Async();
    }
    else
    {
	  isCheckLoadingMore = false;
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("���ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*PAD��˽��ף�ǿ�棩*/
  this.send910306Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910306");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("idPhotoUrl", ""); //��
	reqMsg.appendNode("idPhotoBackUrl", ""); //��
	reqMsg.appendNode("scenePhotoUrl", "");//�ֳ�
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//�ͻ���
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
	//����Ǵ浥��ǿ�����
	if(top.pool.get("isDep0005Trans") =="1"){
		reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��
		reqMsg.appendNode("strIDName", top.pool.get("strIDName"));//����		
	}else{
		reqMsg.appendNode("strIDCardNum", top.pool.get("strRespIDNo")); //���֤��
		reqMsg.appendNode("strIDName", top.pool.get("strRespIDName"));//����
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910306Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910306Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("PAD��˽���(ǿ��)  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strReqSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/checkSerialNo"));
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  //������˽����ѯ
	   isCheckLoadingMore = true;	   
	   top.trans.send910303ExAsync();
    }
    else
    {
	  isCheckLoadingMore = false;
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onForceDepCheckFailed("Э��������ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*��˽����ѯ(ǿ��)*/
  this.send910303ExAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910303");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strReqSerialNo"));//ԭ�����ˮ��
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strOrgTsns",top.pool.get("strReqSerialNo"));//S�˲�ѯʹ��
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910303ExComplete);  
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910303ExComplete = function(iRet)
  {
   var strJrn = new top.StringCtrl("��˽����ѯ(ǿ��)  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		isCheckLoadingMore = false;	
		//���
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
				top.MainFrame.onForceDepCheckFailed("Э��������ʧ��", top.exchxmlasync.strTermRetCode, strTermRetDesc);
			}
		}		
    }
    else
    {
		isCheckLoadingMore = false;
		if (typeof(top.MainFrame.onForceDepCheckFailed) == "function")
		{
			top.MainFrame.onForceDepCheckFailed("Э��������ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }		  
  }
  
  /*��˽����ѯ*/
  this.send910303Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910303");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strReqSerialNo"));//ԭ�����ˮ��
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strOrgTsns",top.pool.get("strReqSerialNo"));//S�˲�ѯʹ��
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910303Complete);  
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910303Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("��˽����ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		isCheckLoadingMore = false;	
		//���
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
				top.MainFrame.onServiceFailed("���ʧ��", top.exchxmlasync.strTermRetCode, strTermRetDesc);
			}
		}		
    }
    else
    {
		isCheckLoadingMore = false;
		if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("���ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }		  
  }
  
  /*��˽���-ȡ�����֪ͨ*/
  this.send910302Async = function()
  {
	isCheckLoadingMore = false;
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910302");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strReqSerialNo"));//ԭ�����ˮ��
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strOrgTsns",top.pool.get("strReqSerialNo"));//S�˲�ѯʹ��
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910302Complete);  
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910302Complete = function(iRet)
  {
	 var strJrn = new top.StringCtrl("ȡ�����֪ͨ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (typeof(top.MainFrame.onServiceFailed) == "function")
	{
		top.MainFrame.onServiceFailed("PAD��˳�ʱ", "FFFF", "�Բ���,PAD��˳�ʱ");
	}		  
  }
  
  /*��Ȳ�ѯ*/
  this.send906101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906101");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName",top.pool.get("strRespIDName"));//֤������
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906101Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync906101Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Ȳ�ѯ906101  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.TakePic");//IC�����׺�д������		
    	}else if(top.pool.get("isCheck")=="Y" && top.pool.get("isNotice")=="Y"){
    		top.MainFrame.onServiceFailed("��Ȳ�ѯʧ��", top.exchxmlasync.strTermRetCode, "��ֱ������֤������ʵ��֤������ȥ�������");
    	}else if(top.pool.get("status")=="03" && top.pool.get("signPayFlag")=="1"){
    		top.MainFrame.onServiceFailed("��Ȳ�ѯʧ��", top.exchxmlasync.strTermRetCode, "��ֱ������֤������ʵ��֤������ȥ�������");
    	}else if(top.pool.get("status")=="02" && top.pool.get("signPayFlag")=="1"){
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.TakePic");
    	}else{
    		top.pool.set("focussDate", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/focussDate"));
    		top.pool.set("focuseDate", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/focuseDate"));
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqFxBalanceSuccess");//IC�����׺�д������	
    		}
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("��Ȳ�ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*��Ȳ�ѯ*/
  this.send906101SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906101");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName",top.pool.get("strRespIDName"));//֤������
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906101SecondComplete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync906101SecondComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Ȳ�ѯ906101  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	top.pool.set("customerName", top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));
    	top.pool.set("limitBalance", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/residualLimit"));
    	top.pool.set("usedBalance", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/usedLimit"));
    	top.pool.set("limitBalance2", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/residualLimit2"));
    	top.pool.set("usedBalance2", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/usedLimit2"));
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqFxBalanceSuccess");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("��Ȳ�ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*ǩ��ȷ����*/
  this.send906104Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906104");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName",top.pool.get("customerName"));//֤������
	reqMsg.appendNode("strCuststat",top.pool.get("strCuststat"));//״̬
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906104Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync906104Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ǩ��ȷ����906104  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onConfirmBookSuccess");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("ǩ��ȷ����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*���ʲ�ѯ*/
  this.send906201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906201");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("Amount"));    //���
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));          //����
	reqMsg.appendNode("strTateType", top.pool.get("strTateType"));          //����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906201Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync906201Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ʲ�ѯ906201  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.inqFxRateSuccess");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("���ʲ�ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /*��Ԫ���ʲ�ѯ(���ȽϿ��ö����)*/
  this.sendUsd906201Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906201");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", "100");    //���
	reqMsg.appendNode("strCurrency", "USD");          //����
	reqMsg.appendNode("strTateType", "02");          //����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncUsd906201Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncUsd906201Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ʲ�ѯ906201  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.inqUsdFxRateSuccess");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("���ʲ�ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /*��㹺��*/
  this.send906301Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906301");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));   //�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan"));            //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));      //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));      //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));  //��������
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));  //����
	reqMsg.appendNode("currency", top.pool.get("strCurrency"));  //������
	reqMsg.appendNode("Amount", top.pool.get("Amount"));            //���
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//����
	reqMsg.appendNode("strUsage", top.pool.get("strUsage"));        //�����ʽ�����
	//reqMsg.appendNode("strRemark", top.pool.get("remark"));
	reqMsg.appendNode("strUseDate", top.pool.get("strUseDate"));
	reqMsg.appendNode("strUsageDetail1", top.pool.get("strUsageDetail1"));
	reqMsg.appendNode("strUsageDetail2", top.pool.get("strUsageDetail2"));
	reqMsg.appendNode("strUsageDetail3", top.pool.get("strUsageDetail3"));
	reqMsg.appendNode("strUsageDetail4", top.pool.get("strUsageDetail4"));
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906301Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync906301Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��㹺��906301  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	top.pool.set("transAmt",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/transAmt"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("��㹺��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*�����*/
  this.send906302Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906302");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));   //�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan"));            //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));      //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));      //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));  //��������
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));  //����
	reqMsg.appendNode("currency", top.pool.get("strCurrency"));  //������
	reqMsg.appendNode("Amount", top.pool.get("Amount"));            //���
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//����
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	reqMsg.appendNode("strUsage", top.pool.get("strUsage"));        //�����ʽ�����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906302Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync906302Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����906302  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	top.pool.set("exchangeSettleAmt",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/exchangeSettleAmt"));
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*���Ҷ���Ϣ��ѯ*/
  this.send906401Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906401");    //���ױ��룬��Ҫ�������ļ���Ӧ
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906401Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync906401Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���Ҷ���Ϣ��ѯ906401  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCurrencyPairSuccess");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("���Ҷ���Ϣ��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*�������*/
  this.send906406Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "906406");                           //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));     //�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                   //���п���
	reqMsg.appendNode("strHostAccount", top.pool.get("hostAccount"));      //���˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));             //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));             //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));         //��������
	reqMsg.appendNode("strAuthWorker", top.pool.get("custManagerNo"));     //��Ȩ��Ա
	reqMsg.appendNode("strBuyAccount", top.pool.get("hostAccount"));       //�����˻�����
	reqMsg.appendNode("strBuyAccountKind", top.pool.get("BuyAccType"));    //�����˻�����
	reqMsg.appendNode("strBuyCode", top.pool.get("BuyCurr"));              //������ִ���
	reqMsg.appendNode("strBuyAmt", top.pool.get("fxBuyAmt"));              //������
	reqMsg.appendNode("strCyCode3", top.pool.get("strCyCode"));            //¼����Ҵ���
	reqMsg.appendNode("strOutSubAccountType", top.pool.get("SellAccType"));//ת�����˺����
	reqMsg.appendNode("strSellCardNo", top.pool.get("strPan"));            //ת������
	reqMsg.appendNode("strSellAccount", top.pool.get("hostAccount"));      //�����˻�
	reqMsg.appendNode("strSellAccountKind", top.pool.get("SellAccType"));  //�����˻�����
	reqMsg.appendNode("strSellAmt", top.pool.get("fxSellAmt"));            //�������
	reqMsg.appendNode("strSellCode", top.pool.get("SellCurr"));            //�������ִ���
	reqMsg.appendNode("strProxyFlag", "0");                                //�Ƿ�����ʶ
	reqMsg.appendNode("strCertificateTypeSrcb", "00");                     //֤������
	reqMsg.appendNode("strSubAcctType", top.pool.get("BuyAccType"));       //�����˻�����
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));        //֤������
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));              //����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync906406Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync906406Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�������906406  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
    	top.pool.set("buyAmt",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/buyAmt"));
    	top.pool.set("sellAmt",top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/sellAmt"));
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�������ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
   /*����ά���ͻ���Ϣ*/
  this.send901108Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901108Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901108Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ά���ͻ���Ϣ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateCustomInfoSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "�浥����ʧ��");
      }
    }
  }	
  
  
  /*Ԥ���ֻ��ŵǼǲ�ѯ*/
  this.send901710Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901710");    //���ױ��룬��Ҫ�������ļ���Ӧ
    reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901710Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901710Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("Ԥ���ֻ��Ų�ѯ901710"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      top.pool.set("phone",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mobile"));//�ֻ���
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
      }
    }
  }	
  
  /*Ԥ���ֻ��ŵǼ��޸�*/
  this.send901709Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901709");    //���ױ��룬��Ҫ�������ļ���Ӧ
    reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("inputPhone",top.pool.get("strPhone"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901709Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901709Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("Ԥ���ֻ����޸�901709"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("DSFKJTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onModifyServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
      }
    }
  }



/*����ǩԼ��ѯ �ͻ���*/
 this.send901608Async = function(){
    //���жϿ����� ��������ÿ� ֱ���˿�
    if(top.pool.get("strCardType") == "2"){
		top.MainFrame.onServiceFailed("��ѯʧ��", "","����뱾�н�ǿ���" );
    }else if(top.pool.get("strCardType") == "3"){
		top.MainFrame.onServiceFailed("��ѯʧ��", "","�������ע�������Ľ�ǿ���" );
    }else{
		new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	    var exch = new ExchangeXmlWithHost();
	    var reqMsg = new ColsMsgXmlText();
        reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
        reqMsg.appendNode("strTransCode", "901608");    //���ױ��룬��Ҫ�������ļ���Ӧ
	    reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
        reqMsg.appendNode("strSignType",top.pool.get("strSignType"));//
        top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901608Complete);
    }
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901608Complete = function(iRet){
    var strJrn = new top.StringCtrl("����ǩԼ��ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL){
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//��ѯ����
		top.pool.set("strIDCardNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/idNo"));//���֤��
      	top.pool.set("strIDName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/customerName"));//����
     	top.pool.set("mobile",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mobile"));//�ֻ���
 		top.pool.set("strTel",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/tel"));//�ֻ���     	
		top.pool.set("cardPassbookNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardPassbookNo"));//ǩԼ����
     	//��ʽ��
		top.pool.set("cardPassbookFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardPassbookFlag"));//ƾ֤����
		top.pool.set("versionType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/versionType"));//�����汾
		top.pool.set("voucherType",top.trans.convertType(top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/voucherType"),"Ukey"));//Ukey�汾
		
		top.pool.set("strSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/signContractSerialNo"));      
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryServiceSuccessful");//IC�����׺�д������
	 }
	 else{
		  var respCode = top.exchxmlasync.strTermRetCode;
		  //δǩԼ respCode 700011 
		  if ("700011"==respCode && typeof(top.MainFrame.onNoSignSuccessful) == "function"){
			  top.MainFrame.onNoSignSuccessful("��ѯʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "��δע�᱾�еĵ������У�");
		  } 
		  else if (typeof(top.MainFrame.onServiceFailed) == "function"){
	          top.MainFrame.onServiceFailed("��ѯʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
		  }
     }
  }
 
  /*����ǩԼ��ѯ ����*/
  this.send901608CardAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901608");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
    reqMsg.appendNode("strSignType",top.pool.get("strSignType"));//
    reqMsg.appendNode("strPan",top.pool.get("strPan"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901608CardComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901608CardComplete = function(iRet){
    var strJrn = new top.StringCtrl("����ǩԼ��ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL){
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//��ѯ����
		top.pool.set("strIDCardNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/idNo"));//���֤��
      	top.pool.set("strIDName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/customerName"));//����
     	top.pool.set("mobile",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mobile"));//�ֻ���
 		top.pool.set("strTel",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/tel"));//�ֻ���     	
		top.pool.set("cardPassbookNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardPassbookNo"));//ǩԼ����
     	//��ʽ��
		top.pool.set("cardPassbookFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardPassbookFlag"));//ƾ֤����
		top.pool.set("versionType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/versionType"));//�����汾
		top.pool.set("voucherType",top.trans.convertType(top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/voucherType"),"Ukey"));//Ukey�汾
		
		top.pool.set("strSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/signContractSerialNo"));      
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryServiceSuccessful");//IC�����׺�д������
    }else{
		  var respCode = top.exchxmlasync.strTermRetCode;
		  //δǩԼ respCode 700011 
		  if ("700011"==respCode && typeof(top.MainFrame.onNoSignSuccessful) == "function"){
			   top.MainFrame.onNoSignSuccessful("��ѯʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "�����˻���δ����ע�ᣡ");
		  } 
		  else if (typeof(top.MainFrame.onServiceFailed) == "function"){
	           top.MainFrame.onServiceFailed("��ѯʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
		  }
    }
  }

 /*�����ͻ��ֻ����޸�908207*/
  this.send908207Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908207");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//���֤����
    reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//
    reqMsg.appendNode("strTel",top.pool.get("strTel"));//
	reqMsg.appendNode("strSerialNo",top.pool.get("strSerialNo"));//ǩԼ��ˮ�� 
	reqMsg.appendNode("strRegIdAddr",new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//��ַ  	
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//����
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3")); //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strPostCode", "200000");  //�ʱ�
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908207Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908207Complete = function(iRet){
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����������Ϣ�޸�"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL){
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//��ѯ����
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
    } else{
        if (typeof(top.MainFrame.onServiceFailed) == "function"){
           top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "����������Ϣ�޸�ʧ��");
        }
    }
  }
 
  /*�������������˻���ϸ*/
  this.send908212Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908212");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
    reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//���֤
    reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908212Complete);
  }
  
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908212Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�������������˻���ϸ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

   if (iRet == top.RESULT_SUCCESSFUL)
    {
      //���׷��سɹ���ȡ��ϸ���ݣ�F59��
      top.pool.set("strDetail",top.exchxmlasync.msgxmldomResp.getElementValue("F59"));
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqDeFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�ֻ�����ǩԼ-ע��*/
  this.send908101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908101");    //���ױ��룬��Ҫ�������ļ���Ӧ
    reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strSignType",top.pool.get("strSignType"));
	reqMsg.appendNode("strPhone", top.pool.get("strPhone"));//�ֻ���
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//����
	reqMsg.appendNode("strEmail",top.pool.get("email"));//�ʼ�
	reqMsg.appendNode("familyCall",top.pool.get("strPhone"));//��ͥ�绰
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender", "F");
	}else{
		reqMsg.appendNode("strGender", "M");	
	}
	reqMsg.appendNode("strBirthdayDt",top.pool.get("birthDate"));//��������
	reqMsg.appendNode("strRegIdAddr",new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//��ַ
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //��������	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908101Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908101Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ֻ�����ע��908101"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("SJYHTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//��ѯ����
		if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode", "success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSJYHComplete");//IC�����׺�д������
		}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
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
    	        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  }		
  
  /*�ֻ����й����˻���ϸ*/
  this.send908106Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908106");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strIDCardNum",top.pool.get("IDNum"));//���֤
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908106Complete);
  }
  
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908106Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ֻ����й����˻���ϸ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

   if (iRet == top.RESULT_SUCCESSFUL)
    {
      //���׷��سɹ���ȡ��ϸ���ݣ�F59��
      top.pool.set("strDetail",top.exchxmlasync.msgxmldomResp.getElementValue("F59"));
	  var itemCount = top.exchxmlasync.msgxmldomResp.selectNodesCount("/TransMsg/dataList/F59/item");
	  if(parseInt(itemCount,10) < 1){
		top.MainFrame.onServiceFailed("��ѯʧ��", "", "�����˻��б��ѯΪ��");
	  }
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryListSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqDeFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*�ֻ������ֻ����޸�908104*/
  this.send908104Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "908104");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//���֤����
    reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//�ֻ���
//    reqMsg.appendNode("strTel",top.pool.get("strPhone"));//�绰
	reqMsg.appendNode("strSerialNo",top.pool.get("strSerialNo"));//ǩԼ��ˮ�� 
	reqMsg.appendNode("strRegIdAddr",new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//��ַ  	
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//����
	if("0" == top.pool.get("strIDSexNum")){
		reqMsg.appendNode("strGender","F")
	}else{
		reqMsg.appendNode("strGender","M");	
	}
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3")); //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strPostCode", "200000");  //�ʱ�
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908104Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908104Complete = function(iRet){
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ֻ�������Ϣ�޸�"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL){
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
		top.pool.set("strSignType",top.exchxmlasync.msgxmldomResp.getElementValue("F57"));//��ѯ����
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
    } else{
     if (typeof(top.MainFrame.onServiceFailed) == "function"){
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "�ֻ�������Ϣ�޸�ʧ��");
      }
    }
  }
  
  /*�ֻ�����ע��*/
  this.send908102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908102");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //ע������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺� ����ʹ��
	reqMsg.appendNode("strCardPassbookFlag", top.pool.get("cardPassbookFlag"));
	reqMsg.appendNode("strSerialNo",top.pool.get("strSerialNo"));//ǩԼ��ˮ�� 

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908102Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908102Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ֻ�����ע��������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�ֻ�����ע��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*�ֻ�������������*/
  this.send908108Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908108");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //��������	
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908108Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908108Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�������뷵����"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
	  top.pool.set("strRespIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//֤����
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.reSetPWDSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oMobileResetPWDFail, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*�ֻ���������/ɾ���˻�*/
  this.send908107Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908107");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������	
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strOperateType",top.pool.get("strOperateType"));//��������
	reqMsg.appendNode("strSignContractSerialNo",top.pool.get("strSerialNo"));//ǩԼ��ˮ��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908107Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908107Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ֻ���������/ɾ���˻�908107  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

  /*����ͨǩԼ*/
  this.send908304Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908304");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//����
	reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//�ֻ���
	reqMsg.appendNode("strSign",top.pool.get("strSign"));//�Ƿ���ǩԼ��־
	if(top.pool.get("strSign") == "1"){
		reqMsg.appendNode("strOperationType","0");	
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908304Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908304Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ͨǩԼ908304  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("DXTZTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if(top.pool.get("signFlag") == "allSign") {
    		top.pool.set("signFlag", "");
			top.pool.set("returnCode", "success");
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onDXTZComplete");//IC�����׺�д������
    	}else {
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
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
    	        top.MainFrame.onServiceFailed("����ͨǩԼʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    	    }
    	}
    }
  }
  
  /*����ͨά��*/
  this.send908305Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908305");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//����
	//reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	//reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	//reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strIDName",top.pool.get("strIDName"));//����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��	
	reqMsg.appendNode("strPhone",top.pool.get("strPhone"));//�ֻ���
	reqMsg.appendNode("strAcctType",top.pool.get("strAcctType"));//�������� 1�޸�
	reqMsg.appendNode("strOpenLimitAmount",top.pool.get("openLimitAmount"));//
	reqMsg.appendNode("strIsShowBalance",top.pool.get("isShowBalance"));//
	reqMsg.appendNode("strSignMobile",top.pool.get("signMobile"));//��ѯ�������
	reqMsg.appendNode("strMandatoryMobile",top.pool.get("mandatoryMobile"));//��ѯ�������
	
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908305Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908305Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ͨά��  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������;
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����ͨ��ѯ*/
  this.send908303Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908303");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan",top.pool.get("strPan"));//����
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908303Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908303Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ͨ��ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.pool.set("signMobile",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/signMobile"));//�޸Ľ���ʱ����
		top.pool.set("mandatoryMobile",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mandatoryMobile"));//�޸Ľ���ʱ����
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQueryServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������������*/
  this.send908214Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908214");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //��������
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908214Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908214Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("������������  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�������������˻�*/
  this.send908213Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908213");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //��������
	reqMsg.appendNode("strActiveFlag", top.pool.get("activeFlag")); //0:����  1:ɾ��
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908213Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908213Complete = function(iRet)
  {
    // ��¼�ն���ˮ
	var transName = top.pool.get("activeFlag")=="0"?"��������������:":"����ɾ��������:";
    var strJrn = new top.StringCtrl(transName + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*��������ע��*/
  this.send908203Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","908203");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //ע������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("str5F34",top.pool.get("str5F34"));//23��
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺� ����ʹ��
	reqMsg.appendNode("strCardPassbookFlag", top.pool.get("cardPassbookFlag"));
	reqMsg.appendNode("strSerialNo",top.pool.get("strSerialNo"));//ǩԼ��ˮ�� 

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908203Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908203Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ע��  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oEBankCancelFail, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*�忨����*/
  this.send901606Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901606");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺� ����ʹ��
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901606Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901606Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����"+"  "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
    	top.pool.set("strRespIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//�û���
    	top.pool.set("strRespIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//֤����
    	top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//���˺�
    	top.pool.set("mainSuppleCardFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mainSuppleCardFlag"));//������ʾ
    	top.pool.set("productType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));//����Ʒ����
    	top.pool.set("cardStatus",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardStatus"));//��״̬
	    top.pool.set("strPayerOpenBankNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchNo"));//�忨���ܺ�ȡ���ۿ�Ŀ���������ţ����ͺ���������������
	    top.pool.set("PayerCustName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//�忨���ܺ�ȡ���ۿ�Ļ��������ͺ����ڿ���ת��
    	var cardStatus = top.exchxmlasync.msgxmldomResp.selectSingleNodeValue("/TransMsg/dataList/F60/cardStatus");
		if(cardStatus.length > 4 && "1" != cardStatus.substr(4,1) ){
			if (typeof(top.MainFrame.onServiceFailed) == "function")
			{
				top.MainFrame.onServiceFailed("����ʧ��", "","��״̬�Ƿ�,����ϵ���þ���");
			}
		}
		else{
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onVerifyServiceSuccessful");//IC�����׺�д������
		}
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
		/*  P102-ð�������˻�  P103-6�����޽����˻�  P104-��ϴǮ�˻� */
		if("P102" == top.exchxmlasync.strTermRetCode || "P103" == top.exchxmlasync.strTermRetCode 
		   || "P104" == top.exchxmlasync.strTermRetCode || "P105" == top.exchxmlasync.strTermRetCode
		   || "P106" == top.exchxmlasync.strTermRetCode || "P107" == top.exchxmlasync.strTermRetCode
			||"P108" == top.exchxmlasync.strTermRetCode ){
			top.pool.set("isBlackList","true");	
			//����PAD
			top.trans.send910304BalckListAsync();
			
			top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.langcur.oCheckCardFailedTip);
		}else{
			top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
      }
    }
  }	
	
  /*�忨����*/
  this.send901606SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901606");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺� ����ʹ��
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901606SecondComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901606SecondComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�鿨����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
    	top.pool.set("strRespIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//�û���
    	top.pool.set("strRespIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//֤����
    	top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//���˺�
    	top.pool.set("mainSuppleCardFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mainSuppleCardFlag"));//������ʾ
    	top.pool.set("productType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));//����Ʒ����
    	top.pool.set("cardStatus",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardStatus"));//��״̬
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onVerifyServiceSuccessful");//IC�����׺�д������
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
				//����PAD
				top.trans.send910304BalckListAsync();
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.langcur.oCheckCardFailedTip);
			}else{
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
			}
		}
    }
  }
  
  /*�忨����-����-���� ��������ר�� 2018-03-09*/
  this.send901606SecondAsyncPassBookTrans = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901606");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("DestPan", top.pool.get("strPassBookNum")); //��չ���˺� ����ʹ��
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901606SecondCompletePassBookTrans);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901606SecondCompletePassBookTrans = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��������"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));//�ͻ���
    	top.pool.set("strRespIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//�û���
    	top.pool.set("strRespIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//֤����
    	top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));//���˺�
    	top.pool.set("mainSuppleCardFlag",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/mainSuppleCardFlag"));//������ʾ
    	top.pool.set("productType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));//����Ʒ����
    	top.pool.set("cardStatus",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cardStatus"));//��״̬
	    top.pool.set("strPayerOpenBankNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchNo"));//�忨���ܺ�ȡ���ۿ�Ŀ���������ţ����ͺ���������������
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onVerifyServiceSuccessfulPassBookTrans");//IC�����׺�д������
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
				//����PAD
				top.trans.send910304BalckListAsync();
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.langcur.oCheckCardFailedTip);
			}else{
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
			}
		}
    }
  }
	
  /*�����������֧����Ϣ��ѯ����*/
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
        top.MainFrame.error_Select.innerHTML = "֧����Ϣ��ѯʧ�ܣ�";
    }
  }  
  
  /*����ǩԼ��ѯ*/
  this.send907204Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "907204");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺�
	reqMsg.appendNode("strUserNum", top.pool.get("strUserNum")); //�û����
	reqMsg.appendNode("strCompanyNum", top.pool.get("strCompanyNum")); //��˾����
	reqMsg.appendNode("strUserType", top.pool.get("strUserType")); //��������
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));  //�ͻ���
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907204Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync907204Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ǩԼ��ѯ"+"  "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.MainFrame.onServiceFailed(top.langcur.oSignAuthFailed, top.exchxmlasync.strTermRetCode, top.langcur.oSignAuthOK);
    }
    else
    {
		//������ǩԼ��Ϣ
		if(top.exchxmlasync.strTermRetCode == "A000002")
		{
			new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onQuerySuccessful");//IC�����׺�д������
		}else{
			if (typeof(top.MainFrame.onServiceFailed) == "function")
			{
				top.MainFrame.onServiceFailed(top.langcur.oSignAuthFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
			}
		}
    }
  }	
  
  /*����ǩԼ*/
  this.send907205Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "907205");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺� 
	reqMsg.appendNode("strIDName",top.pool.get("strUserName"));//����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��	
	reqMsg.appendNode("strPhone", top.pool.get("strPhone")); //�ֻ���
	reqMsg.appendNode("strUserNum", top.pool.get("strUserNum")); //�û����
	reqMsg.appendNode("strCompanyNum", top.pool.get("strCompanyNum")); //��˾����
	reqMsg.appendNode("strUserType", top.pool.get("strUserType")); //��������
	reqMsg.appendNode("strDkaddr", top.pool.get("strUserAddress"));  //�ͻ���ַ
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));  //�ͻ���
	reqMsg.appendNode("strPostCode", "200000");  //�ʱ�
	reqMsg.appendNode("strDkpzzl", "37");  //ƾ֤����
	reqMsg.appendNode("strDkbac1", top.pool.get("strDkbac1"));//��������
	if(top.pool.get("strCompanyNum") == "DFYX"){
		reqMsg.appendNode("strIdentNo", top.pool.get("strIDCardNum"));//�������߿ͻ�֤������  
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907205Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync907205Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oSignAuthFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }	
  
  /*��Ѵ���ǩԼ*/
  this.send907208Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "907208");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺� 
	reqMsg.appendNode("strIDName",top.pool.get("strUserName"));//����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��	
	reqMsg.appendNode("strPhone", top.pool.get("strPhone")); //�ֻ���
	reqMsg.appendNode("strUserNum", top.pool.get("strUserNum")); //�û����
	reqMsg.appendNode("strCompanyNum", top.pool.get("strCompanyNum")); //��˾����
	reqMsg.appendNode("strUserType", top.pool.get("strUserType")); //��������
	reqMsg.appendNode("strAddress", top.pool.get("strUserAddress"));  //�ͻ���ַ
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));  //�ͻ���
	reqMsg.appendNode("strPostCode", "200000");  //�ʱ�
    if(top.pool.get("isPassBook")){
		reqMsg.appendNode("strVoucherType", "37");  //ƾ֤����
		reqMsg.appendNode("strCardPassbookFlag","03");
		reqMsg.appendNode("strPan", top.pool.get("DestPan")); 
	}else{
		reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	}
	//reqMsg.appendNode("strBarCode", top.pool.get("strDkbac1"));//��������
	if(top.pool.get("strCompanyNum") == "DFYX"){
		reqMsg.appendNode("strIdentNo", top.pool.get("strIDCardNum"));//�������߿ͻ�֤������  
	}
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync907208Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync907208Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Ѵ��۴���"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("isPassBook","");
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oSignAuthFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }	
  
  
  /*����������ͳ�����ϵ�˵Ǽǲ�֧����Ϣ��ѯ����*/
  this.sendGetBrunchRegister = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryBrunchRegister");
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("StrPanOut", top.pool.get("hostAccount"));
	}else{
		reqMsg.appendNode("StrPanOut", top.pool.get("strPan"));          //���п���
	}
	reqMsg.appendNode("StrPanInType", top.pool.get("StrPanInType")); //���п�������
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
	top.pool.set("BrunchRegisterList", "");
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		var BrunchRegisterList = new Array();
		var num = exch.msgxmldomResp.selectNodesCount("/TransMsg/BR/ITEM");
		//alert("�б�" + num);
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
        top.MainFrame.error_Select.innerHTML = "������ϵ����Ϣ��ѯʧ�ܣ���ѡ��ת�������Ϣ��";
    }
  }

  /*����������ͳ�����ϵ�˵Ǽǲ�֧����Ϣ��ѯ����-����ת��*/
  this.sendGetBrunchRegister903101 = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryBrunchRegister");
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("StrPanOut", top.pool.get("hostAccount"));
	}else{
		reqMsg.appendNode("StrPanOut", top.pool.get("strPan"));          //���п���
	}
	reqMsg.appendNode("StrPanInType", top.pool.get("StrPanInType")); //���п�������
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
		//�˺�����Ψһ
		var uniqueAccount = new top.StringCtrl("").reMoveData(BrunchRegisterList);
	   
		var BrunchRegisterListNew = new top.StringCtrl("").reMoveArrayData(BrunchRegisterList,uniqueAccount);
		
        top.pool.set("BrunchRegisterList", BrunchRegisterListNew);
		if (typeof(top.MainFrame.GetBrunchRegister903101Succ) == "function")
		top.MainFrame.GetBrunchRegister903101Succ();
    }
    else
    {
        top.MainFrame.error_Select.innerHTML = "������ϵ����Ϣ��ѯʧ�ܣ���ѡ����ת���˺ţ�";
    }
  }  
  
  /*����������ͳ�����ϵ�˵Ǽǲ�֧����Ϣ��ѯ����*/
  this.sendSetBrunchRegister = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	//alert(top.pool.get("strPan"));
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AddBrunchRegister");
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("StrPanOut", top.pool.get("hostAccount"));
	}else{
		reqMsg.appendNode("StrPanOut", top.pool.get("strPan"));          //���п���
	}
	reqMsg.appendNode("StrBankCode", top.pool.get("transferCon"));//�к�
	reqMsg.appendNode("StrBankName", top.pool.get("transferCN"));//������
	reqMsg.appendNode("StrPanIn", top.pool.get("DestPan"));//ת�뿨��
	reqMsg.appendNode("StrPanName", top.pool.get("StrPanName"));//ת�뻧��
	reqMsg.appendNode("StrPanInType", top.pool.get("StrPanInType"));//����-���б�־λ
	reqMsg.appendNode("StrRouteCode", top.pool.get("strRecvBankType"));//��·����
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
	//alert("���׽�� " + iRet);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		//alert("�ɹ�");
    }
    else
    {
		//alert("ʧ��");
    }
  }  
  
  /*ƾ֤�б��ѯ**/
  this.send902122Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902122");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));  //�ͻ���
	reqMsg.appendNode("strCertType", top.pool.get("strCertType"));  //ƾ֤����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902122Complete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902122Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ƾ֤�б��ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.SelectSubCount");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("ƾ֤�б��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /**************�浥����********************/
   /*��ά���ͻ���Ϣ����*/
  this.sendCDS901101Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901101"); 
	//�Ƿ��Ǵ�����
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strIDSexNum", top.pool.get("strAgentIDSexNum"));//�Ա�(��������)
		reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strAgentIDAddress")).replaceAll(",", " "));//סַ
		reqMsg.appendNode("strIDEnd", top.pool.get("strAgentIDEnd")); //���֤������
		reqMsg.appendNode("strIDCardNum", top.pool.get("strAgentIDCardNum")); //���֤��
		reqMsg.appendNode("strIDName", top.pool.get("strAgentIDName")); //����
		reqMsg.appendNode("strIDBorn", top.pool.get("strAgentIDBorn")); //��������		
	}else{
	    reqMsg.appendNode("strIDSexNum", top.pool.get("strIDSexNum"));//�Ա�(��������)
		reqMsg.appendNode("strIDAddress", new top.StringCtrl(top.pool.get("strIDAddress")).replaceAll(",", " "));//סַ
		reqMsg.appendNode("strIDEnd", top.pool.get("strIDEnd")); //���֤������
		reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���֤��
		reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����
		reqMsg.appendNode("strIDBorn", top.pool.get("strIDBorn")); //��������		
	}
	reqMsg.appendNode("strPhone", top.pool.get("strPhone"));//�ֻ���
	reqMsg.appendNode("strFamilyCall", top.pool.get("strHomeTel"));//��ͥ�绰
	reqMsg.appendNode("strFamilyAddr", new top.StringCtrl(top.pool.get("strFamilyAddr")).replaceAll(",", " "));//��ͥ��ַ
	reqMsg.appendNode("strJob", top.pool.get("strJob"));//ְҵ
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCDS901101Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncCDS901101Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����˿ͻ���Ϣ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    top.pool.set("customNo", top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateCustomInfoSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("ά���ͻ���Ϣʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  //�浥�����ж�ƾ֤���Ƿ��ڼӵ�������
  this.sendCheckCdsTrackAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
  	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CheckCDSTrack");
    reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);    //�ն˱��
  	reqMsg.appendNode("strOCRNum", top.pool.get("strCDCertNum"));    //�浥���Ŷ�ȡ��ƾ֤��
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCheckCdsTrackComplete);
  }

  /*
    ˽�к�������WEB�����������첽�������ʱ�Ļص�����
  */
  this.onAsyncCheckCdsTrackComplete = function(iRet)
  {
	// ��¼�ն���ˮ
	var strJrn = new top.StringCtrl("����У��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
	      top.MainFrame.onServiceFailed("�浥����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	   }
	}
  }
  
   /*�浥���ʲ�ѯ*/
  this.send905105Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905105");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	reqMsg.appendNode("strCustomerId",top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strProductType",top.pool.get("strProductType"));//��Ʒ����
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����(71��)
	reqMsg.appendNode("strRateUp",top.pool.get("strRateUp"));//�浥�ϸ�����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905105Complete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync905105Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ʲ�ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {  
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onRateSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*��������˻�*/
  this.send905102Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905102");    //���ױ��룬��Ҫ�������ļ���Ӧ
	//�����0Ԫ����
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //���
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	//�浥�����ͻ���
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strCustomerId",top.pool.get("strAgentCustomId"));
	}else{		
		reqMsg.appendNode("strCustomerId",top.pool.get("strCdsTransId"));
	}	
	reqMsg.appendNode("strTellerId","");//��Ȩ��Ա��
	reqMsg.appendNode("strDepositTerm",top.pool.get("strDepositTerm"));//����
	reqMsg.appendNode("strProdType",top.pool.get("CDtype"));//��Ʒ����
	reqMsg.appendNode("strProductSubType",top.trans.convertType(top.pool.get("CDtime"),""));//��Ʒ����
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
	reqMsg.appendNode("strProductType",top.pool.get("strProductType"));//��Ʒ����
	reqMsg.appendNode("strAuthIDCardNum",top.pool.get("strAuthIDCardNum"));//ί����
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//����
	reqMsg.appendNode("strFloatingIntRate1",top.pool.get("strFloatingIntRate1"));//��������
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905102Complete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync905102Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
		//��ȡ�������˺�
		top.pool.set("strCdsAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));
		//��������
		top.pool.set("strOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openDate"));
		//������
		top.pool.set("strEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));
		//������Ա
		top.pool.set("strOpenTellerId",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openTellerId"));
		//������
		top.pool.set("strBranchName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchName"));
		//��������
		top.pool.set("strCoreBankDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/coreBankDate"));
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������		
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSOpenFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }   
  /*����-���۲���ת�ڲ��� */
  this.send905103Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905103");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //���
	reqMsg.appendNode("strCustomerId",top.pool.get("strCdsCustomNo"));//�ͻ���	
	reqMsg.appendNode("strCurrency", "CNY");
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
	reqMsg.appendNode("strAccountOut",top.pool.get("DestPan"));//ת���˺�
	reqMsg.appendNode("strIDCardNum",top.pool.get("strCdsIDNo"));//�浥���������֤
	reqMsg.appendNode("strIDName",top.pool.get("strCdsIDName"));//�浥����������
	//�д�����
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strAgentIDCardNum",top.pool.get("strIDCardNum"));//�浥���������֤
		reqMsg.appendNode("strAgentIDName",top.pool.get("strIDName"));//�浥����������
	}	
	
	//��ƾ֤����
	reqMsg.appendNode("strOldVouchNo",top.pool.get("strOldVouchNo"));	
	//��ƾ֤����
	reqMsg.appendNode("strVoucherNo",top.pool.get("strVoucherNo"));
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); //�浥����  1:����  2������  3������  4������
	//�浥����
	reqMsg.appendNode("strAcctBalance",top.pool.get("strAcctBalance"));
	reqMsg.appendNode("strVoucherDealType",top.pool.get("strPayType")); //֧ȡ��ʽ
	
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905103Complete);   
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync905103Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���᷵����"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//ԭ������ˮ
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
	top.pool.set("strOrigstrTxSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
		top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
		top.pool.set("strCustomerId",top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
		//��Ϣ����
		//top.pool.set("strCdsOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/valueDate"));
		//��������
		top.pool.set("strOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openDate"));
		//��������
		top.pool.set("strCdsEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));
		//����
		top.pool.set("strDepositTerm",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productSubType"));
		//�浥����
		top.pool.set("strProductType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));
		//����
		top.pool.set("strCreditIntRate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditIntRate"));
		//�浥����
		top.pool.set("strCdsIDName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/customerName"));//֤����
		//�浥֤����
		top.pool.set("strCdsIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//֤����		
		//������Ա
		top.pool.set("strOpenTellerId",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openTellerId"));
		//������
		top.pool.set("strBranchName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchName"));
		//�˻����
		top.pool.set("strAcctBalance",top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));
		//�浥�˺�
		top.pool.set("strCoreAcctNo",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));
        //��Ѻ
		top.pool.set("strCipherValue",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cipherValue"));
		//��������
		top.pool.set("strCoreBankDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/coreBankDate"));
		//������+��������Ϣ
		top.pool.set("strDrawAmount",new top.StringCtrl("").YuanToFen(top.exchxmlasync.msgxmldomResp.getElementValue("F54_XZYE")));		
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceDrawFailed) == "function")
      {
        top.MainFrame.onServiceDrawFailed(top.langcur.oCDSDrawFail, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*�浥����ת�ڲ���*/
  this.send905104Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905104");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("strCDAmount")); //��ǰԭ�浥����
	reqMsg.appendNode("strCustomerId",top.pool.get("strCdsCustomNo"));//�浥�ͻ���	
	reqMsg.appendNode("strCurrency", "CNY");
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
	reqMsg.appendNode("strCDSNum", top.pool.get("strCDSNum"));//�浥�˺�
	reqMsg.appendNode("strIDCardNum",top.pool.get("strCdsIDNo"));//�浥���������֤
	reqMsg.appendNode("strIDName",top.pool.get("strCdsIDName"));//�浥����������
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//�д�����
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strAgentIDCardNum",top.pool.get("strIDCardNum"));//�浥���������֤
		reqMsg.appendNode("strAgentIDName",top.pool.get("strIDName"));//�浥����������
	}	
	reqMsg.appendNode("strDepositTerm",top.pool.get("strDepositTerm"));//����
	reqMsg.appendNode("strCDCertNum",top.pool.get("strCDCertNum"));//ƾ֤��
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); //�浥����  1:����  2������  3������  4������
	reqMsg.appendNode("strRate",top.pool.get("strCreditIntRate")); //����
	reqMsg.appendNode("strInterest",top.pool.get("strAfterTaxIntAmt")); //��Ϣ
	reqMsg.appendNode("strProductSubType",top.pool.get("strDepositTerm"));//����
	reqMsg.appendNode("strAcctBalance",top.pool.get("strAcctBalance")); //����
	reqMsg.appendNode("strCdsIDName",top.pool.get("strCdsIDName")); //�浥����
	reqMsg.appendNode("strVoucherDealType",top.pool.get("strPayType")); //֧ȡ��ʽ
	
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905104Complete);   
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync905104Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
	if (iRet == top.RESULT_SUCCESSFUL)
    {   
		//��������
		top.pool.set("strCoreBankDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/coreBankDate"));
        new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doCaptureCD");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onCancelServiceFailed) == "function")
      {
        top.MainFrame.onCancelServiceFailed(top.langcur.oAcceptCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*���ȡ�� */
  this.send910103Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910103");    //���ױ��룬��Ҫ�������ļ���Ӧ
	//ҵ����������֤�ͻ���
	if(top.pool.get("isAgent") == "1"){
		reqMsg.appendNode("strIDCardNum",top.pool.get("strAgentIDCardNum"));//֤������
		reqMsg.appendNode("strIDName", top.pool.get("strAgentIDName"));		
	}else{
		reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
		reqMsg.appendNode("strIDName", top.pool.get("strIDName"));		
	}
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));
	reqMsg.appendNode("strType", top.pool.get("strType"));//����
	reqMsg.appendNode("strCustomerId",top.pool.get("strCdsTransId"));//ҵ������˿ͻ���
	reqMsg.appendNode("strBusinessTypeId",top.pool.get("strBusinessTypeId"));//ҵ������ID	
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
	reqMsg.appendNode("strContent",reqMsg.encode64(reqMsg.utf16to8(top.pool.get("strContent"))));//��������
	reqMsg.appendNode("strCoreBankDate",top.pool.get("strCoreBankDate"));//��������
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910103Complete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910103Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ȡ�ŷ�����"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {  
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onContentSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }   
  
  /*ת�˵��ڲ���*/
  this.send905108Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905108");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("TransferAmount")); //ת���ڲ��˽��
	reqMsg.appendNode("strOutAcctNo", top.pool.get("strTransAccount")); //ת���˺�
	reqMsg.appendNode("strAcctPromptCode", "01"); 
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	reqMsg.appendNode("strCustomerId",top.pool.get("strCdsTransId"));//ҵ������˿ͻ���
	reqMsg.appendNode("strRespIDName",top.pool.get("strIDName"));//����
	reqMsg.appendNode("strRespIDNo",top.pool.get("strIDCardNum"));//���֤
	reqMsg.appendNode("strProductType",top.pool.get("strProductType"));//��Ʒ����
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905108Complete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync905108Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ת�ڲ��˷�����"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doEjectCardOrPass");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
   /*�ڲ���ת�˵���ǿ�*/
  this.send905106Async = function()
  {
    new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905106");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("surplusAmt")); //�ڲ������
	reqMsg.appendNode("strInAcctNo", top.pool.get("strInAcctNo")); //ת���ڲ����˺�
	reqMsg.appendNode("strCurrency", "CNY");
	//reqMsg.appendNode("strCustomerId", top.pool.get("strBatchId"));	
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905106Complete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync905106Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ȡ�ַ�����"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strAgentSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    
	if (iRet == top.RESULT_SUCCESSFUL)
    {   
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doTransferOutSucess");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onTransferOutFailed) == "function")
      {
        top.MainFrame.onTransferOutFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*�浥�ӿ�-��Ϣ����*/
  this.send905111Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905111");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCDSNum", top.pool.get("strCDSNum"));//�浥�˺�
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905111Complete); 	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync905111Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Ϣ����  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {  
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onRateSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*�浥��֤*/
  this.send905119Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905119");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("strCDAmount")); //�浥�������
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	reqMsg.appendNode("strCDSNum", top.pool.get("strCDSNum"));//�浥�˺�
	reqMsg.appendNode("strCDCertNum", top.pool.get("strCDCertNum"));//�浥ƾ֤��	
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strAuthPin", top.pool.get("strAuthPin")); //��Ѻ	
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
	reqMsg.appendNode("strQryOption",top.pool.get("strQryOption"));//�����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905119Complete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync905119Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�浥��֤������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//�浥�ͻ���
	top.pool.set("strCdsCustomNo", top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
	//֧ȡ��ʽ
	top.pool.set("strPayType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/withdrawMethod"));
	//��Ϣ
	top.pool.set("strAfterTaxIntAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/afterTaxIntAmt"));
	//��Ϣ����
	top.pool.set("strCdsOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/valueDate"));
	//��������
	top.pool.set("strCdsEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));
	//����
	top.pool.set("strDepositTerm",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productSubType"));
	//�浥����
	top.pool.set("strProductType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));
	//����
	top.pool.set("strCreditIntRate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditIntRate"));
	//�浥����
	top.pool.set("strCdsIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//֤����
	//�浥֤����
	top.pool.set("strCdsIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//֤����
	//�����ϼƣ���
	top.pool.set("strPrinIntAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/prinIntAmt"));
	//�浥�Ƿ���
	top.pool.set("strDeptexp",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/dept_exp"));
	//�浥����
	top.pool.set("strAcctBalance",top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.queryCDInfoSucess");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onQueryCDFailed) == "function")
      {
        top.MainFrame.onQueryCDFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /*���ܴ浥��֤*/
  this.sendNoPin905119Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905119");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("strCDAmount")); //�浥�������
	reqMsg.appendNode("strCurrency", top.pool.get("strCurrency"));
	reqMsg.appendNode("strCDSNum", top.pool.get("strCDSNum"));//�浥�˺�
	reqMsg.appendNode("strCDCertNum", top.pool.get("strCDCertNum"));//�浥ƾ֤��	
	reqMsg.appendNode("strAuthPin", top.pool.get("strAuthPin")); //��Ѻ	
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
	reqMsg.appendNode("strQryOption",top.pool.get("strQryOption"));//��ע
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncNoPin905119Complete); 
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncNoPin905119Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ܴ浥��֤������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine+
    " " +"֧ȡ��ʽ"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/withdrawMethod")+ top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
        //���֧ȡ��ʽ��ƾ����
    	var strWithdrawMethod = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/withdrawMethod");
    	//֧ȡ��ʽ
    	top.pool.set("strPayType",strWithdrawMethod);
    	if(strWithdrawMethod == "6"){
        	//�浥�ͻ���
        	top.pool.set("strCdsCustomNo", top.exchxmlasync.msgxmldomResp.getElementValue("F1"));
        	//��Ϣ
        	top.pool.set("strAfterTaxIntAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/afterTaxIntAmt"));
        	//��Ϣ����
        	top.pool.set("strCdsOpenDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/valueDate"));
        	//��������
        	top.pool.set("strCdsEndDate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/endDate"));
        	//����
        	top.pool.set("strDepositTerm",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productSubType"));
        	//�浥����
        	top.pool.set("strProductType",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/productType"));
        	//����
        	top.pool.set("strCreditIntRate",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditIntRate"));
        	//�浥����
        	top.pool.set("strCdsIDName",top.exchxmlasync.msgxmldomResp.getElementValue("F61_6_NM"));//֤����
        	//�浥֤����
        	top.pool.set("strCdsIDNo",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));//֤����
        	//�����ϼƣ���
        	top.pool.set("strPrinIntAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/prinIntAmt"));
        	//�浥�Ƿ���
        	top.pool.set("strDeptexp",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/dept_exp"));
        	//�浥����
        	top.pool.set("strAcctBalance",top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));	
        	//��������
        	top.pool.set("strOpenBranchNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/openBranchNo"));
    	}
		new top.CheckCard().icCheckAfterTrans("","top.MainFrame.queryCDInfoNoPinSucess");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onQueryCDFailed) == "function")
      {
        top.MainFrame.onQueryCDFailed(top.langcur.oCDSFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�㰴ťЭ��*/
  this.send910304ExAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strPriority","1");//���ȼ�
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910304ExComplete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910304ExComplete = function(iRet)
  {
    
  } 
  /*����Э��*/
  this.sendExchange910304Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strPriority","1");//���ȼ���
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncExchange910304Complete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncExchange910304Complete = function(iRet)
  {
    
  }
  /*����������PAD*/
  this.send910304BalckListAsync = function(businessName)
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	reqMsg.appendNode("strPriority","1");//���ȼ�
	if(businessName!=null){
		reqMsg.appendNode("strbusinessName",businessName);
	}else{
		reqMsg.appendNode("strbusinessName",top.langcur.oCheckCardSendPadTip);
	}
	
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910304BlackListComplete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910304BlackListComplete = function(iRet)
  {
    //ֻ���ͣ������κδ���
  }
  /*�浥����ʧ�ܣ����д��þ���*/
  this.send910304CDSFailedAsync = function()
  {
	 var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strPriority","1");//���ȼ�
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910304CDSFailedComplete);    
  }
    /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910304CDSFailedComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("PADЭ��������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//��ת���浥ʧ��ҳ��
	if (typeof(top.MainFrame.onShowTellCDSFailed) == "function"){
		top.MainFrame.onShowTellCDSFailed();
	}
  } 
  
  /*�浥����α�����й�ԱЭ��*/
  this.send910304Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910304");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strPriority","1");//���ȼ�
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910304Complete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910304Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strReqSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/assistSerialNo"));
	if (iRet == top.RESULT_SUCCESSFUL)
    {
	   //����Э�������ѯ
	   isCheckHelpingMore = true;	   
	   top.serviceCtrl.startFlowCtrlTimeout(top.trans.send910305Async, 5 * 1000);
    }
    else
    {
	  isCheckHelpingMore = false;
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("Э��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  /*Э�������ѯ*/
  this.send910305Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910305");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strReqSerialNo"));//ԭ�����ˮ��
	reqMsg.appendNode("strCustomNo", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strbusinessCode",top.pool.get("strbusinessCode"));
	reqMsg.appendNode("strbusinessName",top.pool.get("strbusinessName"));
	reqMsg.appendNode("strOrgTsns",top.pool.get("strReqSerialNo"));//S�˲�ѯʹ��
	reqMsg.appendNode("strExpireTime",top.iUserTimeout);
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910305Complete);  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910305Complete = function(iRet)
  {
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		isCheckHelpingMore = false;	
		//Э��
		var strCheckStatus =  top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/dealResult");
		if(strCheckStatus == "S"){
			if (typeof(top.MainFrame.onCheckHelpingSuccessful) == "function"){
				top.MainFrame.onCheckHelpingSuccessful();
			}
		}else{	
			if (typeof(top.MainFrame.onServiceFailed) == "function"){
				top.MainFrame.onServiceFailed("���þ���Э��ʧ��","FFFF","���þ���Э��ʧ��");
			}
		}		
    }
    else
    {
		//�Ƿ���ж��Э�������ѯ
		if(isCheckHelpingMore){
			top.serviceCtrl.startFlowCtrlTimeout(top.trans.send910305Async, 5 * 1000);
		}	
    }		  
  }
  
  /*�����˽���-�����������Ϣ�Ǽ�*/
  this.send901112Async = function(){
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901112");    //���ױ��룬��Ҫ�������ļ���Ӧ	
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���������֤
	reqMsg.appendNode("strIDName", top.pool.get("strIDName")); //����������		
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����	
	reqMsg.appendNode("strIdEndDate",top.pool.get("strIDEnd"));//֤��������
    reqMsg.appendNode("strIdIssureArea",top.pool.get("strIDGrantDept"));//֤���䷢��
	reqMsg.appendNode("strOption",top.pool.get("strOption"));//ѡ��
	reqMsg.appendNode("strPhone",top.pool.get("strAgentPhone"));//�����˵绰
	reqMsg.appendNode("strAgentTransCode",top.pool.get("strAgentTransCode"));//����������
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strAgentSerialNo"));//ԭ������ˮ��
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901112Complete);   
  }
     /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901112Complete = function(iRet)
  {
	 // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����������Ϣ�Ǽ�  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
       new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onUpdateAgentSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onUpdateAgentSuccessful) == "function"){
      	top.MainFrame.onUpdateAgentSuccessful();
    	}	
    }    
  }
  
  
  /*�浥��浥*/
  this.send905107Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "905107");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCdsAccount", top.pool.get("strCdsAccount")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //��������	
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //���	
	reqMsg.appendNode("strCDCertNum", top.pool.get("strCDCertNum"));//�浥ƾ֤��
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����	
	reqMsg.appendNode("strIssueReason","1");//ǩ��ԭ��1���´浥��	
		
	reqMsg.appendNode("strProductSubType",top.trans.convertType(top.pool.get("CDtime"),""));//��Ʒ����
	if(top.pool.get("isAgent") == "1"){
		//�����
		reqMsg.appendNode("strAuthName",top.pool.get("strAgentIDName"));
		reqMsg.appendNode("strAuthNum",top.pool.get("strAgentIDCardNum"));
		//������
		reqMsg.appendNode("strAgentName",top.pool.get("strIDName"));
		reqMsg.appendNode("strAgentNum",top.pool.get("strIDCardNum"));
		reqMsg.appendNode("isAgent","1");
		reqMsg.appendNode("strCustomerId",top.pool.get("strAgentCustomId"));//�浥�����ͻ���
	}else{
		//�����
		reqMsg.appendNode("strAuthName",top.pool.get("strIDName"));
		reqMsg.appendNode("strAuthNum",top.pool.get("strIDCardNum"));
		reqMsg.appendNode("strCustomerId",top.pool.get("strCdsTransId"));//�浥�����ͻ���
	}
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); //�浥����  1:����  2������  3������  4������
	reqMsg.appendNode("strRate",top.pool.get("strRate")); //����
	reqMsg.appendNode("strInterest",top.pool.get("strInterest")); //��Ϣ
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync905107Complete); 	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync905107Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�䵥������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("transLogId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
	top.pool.set("strOrigstrTxSerialNo", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {         
	  top.pool.set("strCipherValue",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cipherValue"));	
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.makeCdsSucess");//IC�����׺�д������
    }
    else
    {
	  //�䵥ʧ��
      if (typeof(top.MainFrame.makeCdsFailed) == "function")
      {
        top.MainFrame.makeCdsFailed(top.langcur.oCDSOpenFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  /*������������������루�浥��*/
  this.send902502CDSAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902502");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2")); //��������
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //���֤��
	reqMsg.appendNode("strVoucherType", "2001");//ƾ֤����
	reqMsg.appendNode("strVoucherNo",top.pool.get("strCDCertNum"));//ƾ֤��
	reqMsg.appendNode("DestPan",top.pool.get("strCDSNum"));//�浥�˺�

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902502CDSComplete);
  }
 /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902502CDSComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ý������뷵����"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  top.pool.set("strPinBlock",top.pool.get("PinBlock2"));
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.reSetPWDSuccess");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oResetCDPasswordFail, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 
  
  
  /*��˽���-��Աָ����Ȩ*/
  this.send910206Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910206");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strTellerum", top.pool.get("strTellerum")); //��Ա��
	reqMsg.appendNode("strFeatureData", reqMsg.encode64(reqMsg.utf16to8(top.pool.get("strFeatureData")))); //ָ������		
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910206Complete); 
	  
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910206Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Աָ����Ȩ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.checkFingerSucess");//IC�����׺�д������	
    }
    else
    {
      if(top.pool.get("isFingerMore") == "true"){
      	 if (typeof(top.MainFrame.onFingerCheckFailed) == "function")
	      {
	        top.MainFrame.onFingerCheckFailed("ָ����Ȩʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	      }	
      }else{
	      if (typeof(top.MainFrame.onServiceFailed) == "function")
	      {
	        top.MainFrame.onServiceFailed("ָ����Ȩʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	      }
      }
    }
  } 
  
  /*����������ʹ浥��Ϣ��ѯ��������*/
  this.sendDepositQueryAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "DepositQuery");    
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
    reqMsg.appendNode("strOldTransCode",top.pool.get("strOldTransCode"));//ԭ������
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncDepositQueryComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncDepositQueryComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�浥��Ϣ��ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  //�浥������Ϣ
	  top.pool.set("cdsTranslogInfoStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsTranslogInfoStr"));
	  //ת����Ϣ
	  top.pool.set("cdsTransQueryStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsTransQueryStr"));
	  //�ڲ��˴��
	  top.pool.set("cdsCashTransQueryStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsCashTransQueryStr"));	  
      if (typeof(top.MainFrame.depositQuerySucess) == "function")
      top.MainFrame.depositQuerySucess();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "�浥��Ϣ��ѯʧ��");
      }
    }
  }	
   /*��������������潻�׿�����������ת����Ϣ��ѯ��������*/
  this.sendRenewQueryAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "RenewQuery");    
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
    reqMsg.appendNode("strOldTransCode",top.pool.get("strOldTransCode"));//ԭ������
	reqMsg.appendNode("strCDSType",top.pool.get("strCDSType")); 
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncRenewQueryComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncRenewQueryComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("������Ϣ��ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  //���濪����Ϣ
	  top.pool.set("cdsOpenInfoStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsOpenInfoStr"));
	  //����������Ϣ
	  top.pool.set("cdsCanInfoStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsCanInfoStr"));	  
	  //����ת���ڲ�����Ϣ
	  top.pool.set("cdsTransStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsTransStr"));
	  //�����ڲ��˴��
	  top.pool.set("cdsCashTransStr",top.exchxmlasync.msgxmldomResp.getElementValue("cdsCashTransStr"));
      if (typeof(top.MainFrame.reNewQuerySucess) == "function")
      top.MainFrame.reNewQuerySucess();
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����ʧ��", top.TERMRETCODE_IMAGEFILE_FAILED, "�浥������Ϣ��ѯʧ��");
      }
    }
  }	
  
  /*��������ͻ���Ϣ��ѯ-����ת��ǰ��ѯ����*/
  this.send903110Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903110");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("DestPan")); //�˺�
	reqMsg.appendNode("strTransAmount", top.pool.get("strTransAmount")); //���׽��
	reqMsg.appendNode("strTransRandom", top.pool.get("strTransRandom")); //�����--ҵ�����κ�

    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903110Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync903110Complete= function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ת��ǰ��ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doConfirmFee");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBHFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  
   /*����������Ͳ�ѯ��������������*/
  this.send903211Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903211"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strTransAmount", top.pool.get("Amount")); //���
	reqMsg.appendNode("strPayeeAcctNo", top.pool.get("DestPan")); //�տλ�˺�
	reqMsg.appendNode("strTemporality", top.pool.get("radioValue")); //ʱЧ��
	reqMsg.appendNode("strRecvBankType", top.pool.get("strRecvBankType")); //�������к�����ϵͳ
	reqMsg.appendNode("strRecvBankNo", top.pool.get("transferCon")); //�������к�
	reqMsg.appendNode("strPayerOpenBankNo", top.pool.get("strPayerOpenBankNo")); //�����˿����к�
	/* alert("���--" + top.pool.get("Amount") 
				   + "�տλ�˺�--" + top.pool.get("DestPan") 
				   + "ʱЧ��--" + top.pool.get("radioValue") 
				   + "�������к�����ϵͳ--" + top.pool.get("strRecvBankType") 
				   + "�������к�--" + top.pool.get("transferCon") 
				   + "�����˿����к�--" + top.pool.get("strPayerOpenBankNo")); */
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903211Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync903211Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����������ѯ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
      new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.doConfirmFee");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oKHTransFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  } 

    /*�����������ת���������к�ת����Ų�ѯ����-����ת��*/
  this.sendGetBranchMapNo903211 = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryBranchMapNo");
	reqMsg.appendNode("strLocalRouteCode", top.pool.get("strPayerOpenBankNo")); //����ת��-����������к�
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
        
		//alert("�����--" + top.pool.get("BranchMapNoList"));
		top.trans.send903201Async();
    }
    else
    {
         if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed(top.langcur.oKHTransFailed, "", "����ת��ʧ��");
		}
    }  
  }
  
  /*����������Ϳ���ת������*/
  this.send903201Async = function()
  {
    new top.CheckCard().icCheckBeforeTrans("40",top.pool.get("Amount"));//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","903201"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("Amount", top.pool.get("Amount")); //���
	reqMsg.appendNode("strFee", top.pool.get("strFee")); //�˺�
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //���߱��
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //ת���˺�		
	if(top.pool.get("MedFlag") == "isPassbook"){
		reqMsg.appendNode("strPan", top.pool.get("hostAccount")); //�˺�
		reqMsg.appendNode("strPayerCustName", top.pool.get("strRespIDName")); //����������
	}else{
		reqMsg.appendNode("strPayerCustName", top.pool.get("PayerCustName")); //����������
		reqMsg.appendNode("strTransPan", top.pool.get("strPan")); //ת���˺�
	}
	reqMsg.appendNode("strDestPan", top.pool.get("DestPan")); //�տ����˺�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strCollectFeeMode", top.pool.get("strCollectFeeMode"));  //�ۿʽ
	reqMsg.appendNode("strPayChannelCode", top.pool.get("strRecvBankType")); //�Է����к�����ϵͳ-��·����
	reqMsg.appendNode("strPayeeBankNo", top.pool.get("transferCon")); //�տ����к�
	reqMsg.appendNode("strPayeeAcctName", top.pool.get("PayeeAcctName")); //�տ�������
	reqMsg.appendNode("strPayeeOpenBankNo", top.pool.get("transferpayeeOpenBankNo")); //�տ��˿����к�
	reqMsg.appendNode("strPayerOpenBankNo", top.pool.get("BranchMapNoList")); //�����˿����к�	
	reqMsg.appendNode("strTransUse", top.pool.get("transUseSelect"));//�ʽ���;
	reqMsg.appendNode("strOpenBankNo", top.pool.get("strPayerOpenBankNo")); //�����˿����к�
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync903201Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync903201Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ת�˽���"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oKHTransFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�����ֽ��������*/
  this.send902601Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902601"); 
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //����
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strIDName", top.pool.get("strRespIDName"));  //�û���
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����

	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902601Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902601Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����ֽ��������"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.unLockPWDSuccess");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oLoadFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*������ѯ-�˻���Ϣ��ѯ*/
  this.send902117Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","902117"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //����
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902117Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902117Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����ѯ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed(top.langcur.oInqBlFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�ɹ�ʧ����ѯ����*/
  this.send901118Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901118"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));      //�ͻ���	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //�ն˺�
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //���֤��
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901118Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901118Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ɹ�ʧ����ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqCardLossSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�ɹ�ʧ����ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�ɹ�ʧ�浥�۲�ѯ����*/
  this.send901119Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901119"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));     //�ͻ���	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //�ն˺�
	reqMsg.appendNode("strLossType", top.pool.get("strLossType"));    //�浥�۱�ʾ
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901119Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901119Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ɹ�ʧ�浥�۲�ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqVoucherLossSuccessful");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�ɹ�ʧ�浥�۲�ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�޿����ܲ�ѯ����*/
  this.send901612Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901612"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));              //����	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //�ն˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));    //��������
	reqMsg.appendNode("strLossDestPan", top.pool.get("strLossDestPan"));    //�浥���˺�
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901612Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901612Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�޿����ܲ�ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    top.pool.set("strBalance", top.exchxmlasync.msgxmldomResp.getElementValue("F54_ZHYE"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onVerifyServiceSuccessful");//IC�����׺�д������	
    }
    else
    {
		var respCode901612 = top.exchxmlasync.strTermRetCode;
		if (typeof(top.MainFrame.onServiceSecondFailedGH) == "function" && respCode901612 == "2055")
		{
			top.MainFrame.onServiceSecondFailedGH();
		}else if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("���ܲ�ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  
  /*����б��ѯ*/
  this.send901120Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901120"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo")); 
	reqMsg.appendNode("strUnLockType", top.pool.get("strUnLockType")); 
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901120Complete);
  }
    /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901120Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ƾ֤�б�"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);	
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.SelectSubCount");//IC�����׺�д������	
    }
    else
    {
		if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("����б��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  /*��ҿ�*/
  this.send902405Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902405"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));              //����	
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	reqMsg.appendNode("strSortFlag", top.pool.get("strSortFlag")); //��ʧ��־	
	if(top.pool.get("isCardLock") =="1"){
		reqMsg.appendNode("strUnlockFlag", "Y"); //������־
	}else{
		reqMsg.appendNode("strUnlockFlag","N"); //������־	
	}
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902405Complete);
  }
    /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902405Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);	
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCardServiceSuccessful");//IC�����׺�д������	
    }
    else
    {
		if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("�����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  
    /*��Ҵ浥/����*/
  this.send902406Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902406"); 
	reqMsg.appendNode("strDestPan", top.pool.get("DestPan"));     //���ʺ�	
	reqMsg.appendNode("strSortFlag", top.pool.get("strSortFlag")); //��ʧ��־
	reqMsg.appendNode("strLossVoucherType", top.pool.get("strLossCertType")); //�ؿ�����
	reqMsg.appendNode("strVoucherNo", top.pool.get("strVoucherNo")); //ƾ֤����		
	reqMsg.appendNode("strRegisterLossType", top.pool.get("strRegisterLossType"));	//��ʧ����
	reqMsg.appendNode("strRegisterLossDate", top.pool.get("strRegisterLossDate"));	//��ʧ����
	reqMsg.appendNode("strRegisterLossSerialNo", top.pool.get("strRegisterLossSerialNo"));	//��ʧ��ˮ��
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902405Complete);
  }
    /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902405Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);	
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCardServiceSuccessful");//IC�����׺�д������	
    }
    else
    {
		if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("�����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  /*�����������Ѳ�ѯ����*/
  this.send901117Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901117"); 
	reqMsg.appendNode("strPan", top.pool.get("strFeeNum"));            //����	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //�ն˺�
	reqMsg.appendNode("strAmtFeeFlag", top.pool.get("strAmtFeeFlag")); //��ѯ����
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901117Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901117Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����������Ѳ�ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    top.pool.set("strCostFee", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/costFee"));
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	//�����ѻص�
    	if(top.pool.get("isInqFee") == "1") {
    		top.pool.set("isInqFee", "");
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqFeeSuccessful");//IC�����׺�д������	
    	}
    	//�����ѻص�
    	else {
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onInqPriceSuccessful");//IC�����׺�д������	
    	}
    }
    else
    {
      top.pool.set("isInqFee", "");
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�����������Ѳ�ѯ", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  

  //�ж��ֻ����Ƿ�ǩԼ��
this.send908215Async = function()
{
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
  var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
  reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "908215"); 
	reqMsg.appendNode("strMobile", top.pool.get("strCheckPhone"));       //�ֻ���
	var strCheckTransTypeNum = top.pool.get("strCheckTransTypeNum");
	if(strCheckTransTypeNum == "1"){
		reqMsg.appendNode("strChannelFlag", "04"); //��������
	}else if(strCheckTransTypeNum == "2"){
		reqMsg.appendNode("strChannelFlag", "02"); //��������
	}else if(strCheckTransTypeNum == "3"){
		reqMsg.appendNode("strChannelFlag", "04"); //��������
	}
  top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908215Complete);
}

//��WEB�����������첽�������ʱ�Ļص�����
this.onAsync908215Complete = function(iRet)
{
  // ��¼�ն���ˮ
  var strJrn = new top.StringCtrl("ǩԼ�ֻ���908215"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
  "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
  top.journalPrinter.addJournal(strJrn);
	var channelFlagList = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F59/item");
  var strCheckTransTypeNum = top.pool.get("strCheckTransTypeNum");
  if (iRet == top.RESULT_SUCCESSFUL) {
		if(strCheckTransTypeNum == "1" && channelFlagList != null && channelFlagList != ""){
			top.pool.set("messageline","���ֻ�����ע���ֻ�����,����������");
		}else if(strCheckTransTypeNum == "2" && channelFlagList != null && channelFlagList != ""){
			top.pool.set("messageline","���ֻ�����ע����������,����������");
		}else if(strCheckTransTypeNum == "3" && channelFlagList != null && channelFlagList != ""){
			top.pool.set("havaContract",true);
			top.trans.send908215AgainAsync();
			return;
		}
  }else {
		var strJrn = "������"+top.exchxmlasync.strTermRetCode+";"+"��������"+top.exchxmlasync.strTermRetDesc;
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

  //�ж��ֻ����Ƿ�ǩԼ��
this.send908215AgainAsync = function()
{
  new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
  var exch = new ExchangeXmlWithHost();
  var reqMsg = new ColsMsgXmlText();
  reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
  reqMsg.appendNode("strTransCode", "908215"); 
  reqMsg.appendNode("strMobile", top.pool.get("strCheckPhone"));       //�ֻ���
  reqMsg.appendNode("strChannelFlag", "02"); //��������
	
  top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908215AgainComplete);
}

 //��WEB�����������첽�������ʱ�Ļص�����
this.onAsync908215AgainComplete = function(iRet)
{
  // ��¼�ն���ˮ
  var strJrn = new top.StringCtrl("ǩԼ�ֻ���908215"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
  "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
  top.journalPrinter.addJournal(strJrn);
  var channelFlagList = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F59/item");
  if (iRet == top.RESULT_SUCCESSFUL) {
		 if(channelFlagList != null && channelFlagList != ""){
			 if(top.pool.get("havaContract")){
				 top.pool.set("messageline","���ֻ��ż�ע���ֻ�������ע����������,����������");
			 }else{
				 top.pool.set("messageline","���ֻ�����ע����������,����������");
			 }
		}
  }else {
		var strJrn = "������"+top.exchxmlasync.strTermRetCode+";"+"��������"+top.exchxmlasync.strTermRetDesc;
		top.journalPrinter.addJournal(strJrn);
		var AnswerBackCode = top.exchxmlasync.msgxmldomResp.getElementValue("F39");
		if(AnswerBackCode == "M00427"){
			if(top.pool.get("havaContract")){
				top.pool.set("messageline","���ֻ�����ע���ֻ�����,����������");
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

  
  /*������֤�뽻������*/
  this.send908301Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "908301"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                   //����	
	reqMsg.appendNode("strPhoneNum", top.pool.get("strCheckPhone"));       //�ֻ���
	reqMsg.appendNode("strCheckTrans", top.pool.get("strCheckTransType")); //��������
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync908301Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync908301Complete = function(iRet)
  {
	top.pool.set("strMessageCode", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/verifyCode"));
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("������֤��908301"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine+
    "������֤��: " + top.pool.get("strMessageCode") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL) {
    	top.pool.set("messageFlag", "1");
    }else {
    	top.pool.set("messageFlag", "2");
    }
  }
  
  /*��ǿ���ʧ����*/
  this.send902401Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902401"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));     //�ͻ���	
	reqMsg.appendNode("strPan", top.pool.get("strPan"));              //����	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //�ն˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));    //��������
	reqMsg.appendNode("strAmtFee", top.pool.get("strAmtFee"));        //������
	reqMsg.appendNode("strTranFlag", top.pool.get("strFillFlag"));    //�Ƿ񲹿���ʾ
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //���֤��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));        //����
	reqMsg.appendNode("strRefNum", top.pool.get("refNum"));           //�ֻ���
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902401Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902401Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ǿ���ʧ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onReportLossSuccess");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("��ǿ���ʧʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�浥�۹�ʧ����*/
  this.send902402Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "902402"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));        //�ͻ���	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);    //�ն˺�
	reqMsg.appendNode("strDestPan", top.pool.get("strAcctNo"));          //���˺�
	reqMsg.appendNode("strStartNo", top.pool.get("strVoucherNo"));       //��ʼ����	
	reqMsg.appendNode("strVoucherType", top.pool.get("strVoucherType")); //ƾ֤����
	reqMsg.appendNode("strEndNum", top.pool.get("strVoucherNo"));        //��ֹ����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));     //���֤��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));           //����
	reqMsg.appendNode("strRefNum", top.pool.get("refNum"));              //�ֻ���
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync902402Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync902402Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�浥�۹�ʧ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onReportLossSuccess");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("��ʧ����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*��ǿ���������*/
  this.send901301Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901301"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));       //�ͻ���	
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                //����	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);   //�ն˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("PinBlock2"));        //��������
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));    //���֤��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));          //����
	reqMsg.appendNode("strReportType", top.pool.get("isPassword"));     //��ʧ����
	reqMsg.appendNode("strCardProduct", top.pool.get("strCardFlag"));   //������
	reqMsg.appendNode("strRetainCardNoFlag", top.pool.get("isKeeped")); //�Ƿ񱣺�
	reqMsg.appendNode("strOldCardNo", top.pool.get("strLossPan"));      //ԭ����
	reqMsg.appendNode("strCardType", top.pool.get("cardProduct"));      //����Ʒ
	if(top.pool.get("productType").indexOf("���Ͽ�") != -1){
		reqMsg.appendNode("strPostAddress", top.pool.get("postalAddress")); 
		reqMsg.appendNode("strPostCode", top.pool.get("postalCode")); 
		reqMsg.appendNode("strOrderStatus", "1"); 
		reqMsg.appendNode("strContractPhone", top.pool.get("telephone")); 
		reqMsg.appendNode("strCostFee", 0);      //������
	}else{
		reqMsg.appendNode("strCostFee", top.pool.get("strCardPrice"));      //������
	}
	reqMsg.appendNode("strPindata", top.pool.get("PinBlock4"));         //��ѯ����
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901301Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901301Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ǿ�����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    top.pool.set("strFillCardId", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    top.pool.set("strCardBranchName", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/branchName")); //�쿨����
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onFillCardSuccess");//IC�����׺�д������	
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onFillCardFailed("��ǿ�����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*�����������С��֧���޶��ѯ*/
  this.send901713Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901713"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strPan", top.pool.get("strPan"));  //����
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //���߱��
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strTerminalTsn", top.pool.get("strTerminalTsn"));	//ϵͳ���ٺ�
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strSingleBusinessNum", top.pool.get("strSingleBusinessNum"));	//ҵ�����κ�
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901713Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901713Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("С��֧���޶��޸Ľ���901713"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    	{
    	    //���׳ɹ���ȡ��������
        	top.pool.set("transLimitAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/dayTransLimitAmt"));//��������޶�
        	top.pool.set("dayTransLimitAmt",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/transLimitAmt"));//ÿ������޶�
        	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSignInfo");//IC�����׺�д������	
    	}
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("С��֧���޶��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�����������С�������޶��޸�*/
  this.send901708Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","901708"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("strCustomerId"));//�ͻ���
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //���߱��
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strPan", top.pool.get("strPan"));  //����
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strTrfLimitAmount", top.pool.get("transLimitAmt"));//��������޶�
	reqMsg.appendNode("strDayLimitAmount", top.pool.get("dayTransLimitAmt"));//���ս����ۼ��޶�
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901708Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901708Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("С�������޶��޸Ľ���"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("С���޶��޸�ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*��ǿ���������*/
  this.send901401Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901401"); 
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));       //�ͻ���	
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                //����	
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);   //�ն˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strExchangeOldPin"));        //�ɿ���������
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));    //���֤��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));          //����
	reqMsg.appendNode("strCardProduct", top.pool.get("strCardFlag"));   //������
	reqMsg.appendNode("strRetainCardNoFlag", top.pool.get("isKeeped")); //�Ƿ񱣺�
	reqMsg.appendNode("strOldCardNo", top.pool.get("strExchangeOldPan"));      //ԭ����
	reqMsg.appendNode("strCostFee", top.pool.get("strCardPrice"));      //������
	reqMsg.appendNode("strTranspwd", top.pool.get("PinBlock2"));      //�¿���������
	reqMsg.appendNode("strQuerypwd", top.pool.get("PinBlock4"));      //�¿���ѯ����
	reqMsg.appendNode("strOldCardSeqId", top.pool.get("strOldCardSeqId"));      //�ɿ������к�
	reqMsg.appendNode("strOldCardAmt", top.pool.get("strExchangeAmt"));      //�ɿ������ֽ����
	if(top.pool.get("strCardFlag") == "1"){
		top.pool.set("isNeedReverse","1");	
		top.pool.set("Amount",new top.StringCtrl("").formatStrAmount(top.pool.get("strExchangeAmt")));        //�������						
		reqMsg.appendNode("strCardType", top.pool.get("cardProduct")); //����Ʒ
	}
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901401Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901401Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ǿ�����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    //������ˮ��
    top.pool.set("exchangeCardSerialNo",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));    
    top.pool.set("strOpenTsn", top.exchxmlasync.msgxmldomResp.getElementValue("transLogId"));
    //��������90�� = ��������+������+ԭ������ˮ��
	var strOrgTsns = "0010901401"+ top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
	
    if (iRet == top.RESULT_SUCCESSFUL)
    {
       top.pool.set("isExchangeSucc","true");
       top.pool.set("isNeedReverse","");
	   new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onExchangeCardSuccess");//IC�����׺�д������	
    }
    else if(iRet == top.RESULT_FAILED)
    {
      if(top.pool.get("isNeedReverse") == "1" && top.pool.get("strCardFlag") == "1" 
    	  && top.pool.get("strOldCardICFlag") == "1"){
        	top.pool.set("isNeedReverse","");
        	top.pool.set("strOldCardICFlag","");
    		//���׽����ȷ�Ϸ������
    		top.wins.showNewProcessingTip(top.langcur.oProcessingTipDef);
    		top.trans.send900002Async();
      }
      if (typeof(top.MainFrame.onExchangeCardFailed) == "function")
      {
        top.MainFrame.onExchangeCardFailed("��ǿ�����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }else{
    	//Ԥ�ƿ����׽����ȷ��ʱ���г���
    	if(top.pool.get("isNeedReverse") == "1" && top.pool.get("strCardFlag") == "1"
    		&& top.pool.get("strOldCardICFlag") == "1"){
        	top.pool.set("isNeedReverse","");
        	top.pool.set("strOldCardICFlag","");
    		//���׽����ȷ�Ϸ������
    		top.wins.showNewProcessingTip(top.langcur.oProcessingTipDef);
    		top.trans.send900002Async();
    	}
		top.MainFrame.onExchangeCardFailed("��ǿ�����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}
  }
  
  //�籣�����칦��-����������Ϣ��ѯ
  this.send901122Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901122");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //�ն˺�
	reqMsg.appendNode("strBANK_NO", top.terminal.strOrgNum);
	reqMsg.appendNode("strCountyCode", top.pool.get("sendAddressArea"));  //��������
	reqMsg.appendNode("strOperType", "4");  //��ҳ����
	reqMsg.appendNode("strCurrPage", top.pool.get("CurrPage"));  //��ǰҳ��
	reqMsg.appendNode("strPageNum", "20");  //ÿҳ��¼��
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901122Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901122Complete = function(iRet)
  {
   // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�籣������Ϣ��ѯ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if (typeof(top.MainFrame.onSearchBrnoCodeSuccessful) == "function")
        {
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSearchBrnoCodeSuccessful");//IC�����׺�д������	
        }
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�籣�����ѯ����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  //�籣�����칦��-����������Ϣ��ѯ
  this.send901122SecondAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901122");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //�ն˺�
	reqMsg.appendNode("strBANK_NO", top.terminal.strOrgNum);
	reqMsg.appendNode("strCountyCode", top.pool.get("sendAddressArea"));  //��������
	reqMsg.appendNode("strOperType", "4");  //��ҳ����
	reqMsg.appendNode("strCurrPage", top.pool.get("CurrPage"));  //��ǰҳ��
	reqMsg.appendNode("strPageNum", "20");  //ÿҳ��¼��
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901122SecondComplete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901122SecondComplete = function(iRet)
  {
   // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�籣������Ϣ��ѯ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if (typeof(top.MainFrame.onSearchBrnoCodeSuccessful) == "function")
        {
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSearchBrnoCodeSuccessful");//IC�����׺�д������	
        }
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�籣�����ѯ����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  //�籣�����칦��-�����ĺ���
  this.send901121Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901121");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //�ն˺�
	reqMsg.appendNode("strIDCardType", top.pool.get("strIDCardNum"));  //֤������
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //����
	reqMsg.appendNode("strIDType", "01");  //֤������
	reqMsg.appendNode("strNationality", "CHN");  //����
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901121Complete);
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901121Complete = function(iRet)
  {
	// ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�籣���Ƿ�����콻��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("applyFlag", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/applyFlag")); //�������ʶ
    top.pool.set("imageFlag", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/imageFlag")); //�Ƿ�����Ƭ��ʶ
    top.pool.set("checkCode", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/checkCode")); //У��ͨ����
    if(top.pool.get("imageFlag") == "1"){
    	top.pool.set("strImageNum","0");
    }
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if (typeof(top.MainFrame.onCardMessageSuccessful) == "function")
        {
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onCardMessageSuccessful");//IC�����׺�д������	
        }
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�籣���Ƿ�����콻��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  //�籣�����칦��-��������
  this.send901123Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901123");
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum);  //�ն˺�
	reqMsg.appendNode("strApplyCounty", top.pool.get("sendAddressArea"));  //��������
	reqMsg.appendNode("strIDType", "01");  //֤������
	reqMsg.appendNode("strCheckCode", top.pool.get("checkCode"));  //У����֤��
	reqMsg.appendNode("strIDName", top.pool.get("strIDName"));  //����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum"));  //֤������
	reqMsg.appendNode("strBirthDay", top.pool.get("strIDBorn"));  //��������
	reqMsg.appendNode("strNationality", "CHN");  //����
	reqMsg.appendNode("strNation", top.pool.get("strIDNationChina"));  //����
	reqMsg.appendNode("strJob", top.pool.get("professional"));  //ְҵ
	reqMsg.appendNode("strStartDate", top.pool.get("strIDBegin"));  //֤����ʼ����
	reqMsg.appendNode("strRendDate", top.pool.get("strIDEnd"));  //֤����ֹ����
	reqMsg.appendNode("strMobilePhone", top.pool.get("phoneNumVal"));  //�ֻ�����
	reqMsg.appendNode("strTelPhone", top.pool.get("telePhoneNumVal")); 
	reqMsg.appendNode("strAddress", top.pool.get("sendAddress"));  //ͨѶ��ַ
	reqMsg.appendNode("strZipCode", top.pool.get("psotCodeVal"));  //ͨѶ��ַ�ʱ�
	reqMsg.appendNode("strDeliveryAddress", top.pool.get("sendAddress"));  //ָ��Ͷ�ݵ�ַ
	reqMsg.appendNode("strdeliveryZipCode", top.pool.get("psotCodeVal"));  //ָ��Ͷ�ݵ�ַ�ʱ�
	reqMsg.appendNode("strReselfBrnoCode", top.pool.get("countryMessageval"));  //��ѡ���������������
	 if(null != top.pool.get("strIDSex") && top.pool.get("strIDSex") == "��") {
		 reqMsg.appendNode("strSex", "1");  //�Ա�
	   }else if(null != top.pool.get("strIDSex") && top.pool.get("strIDSex") == "Ů") {
		   reqMsg.appendNode("strSex", "2");  //�Ա�
	   }else {
		   reqMsg.appendNode("strSex", "9");  //�Ա�
	   }
	if(top.pool.get("strImageNum") == "0"){
		reqMsg.appendNode("strImageSource", "1");  //��Ƭ��Դ
		reqMsg.appendNode("strImageName", "");
		reqMsg.appendNode("strImageFlag", "1");
	}else{
		reqMsg.appendNode("strImageSource", "3");  //��Ƭ��Դ
		reqMsg.appendNode("strImageFlag", "0");
		reqMsg.appendNode("strImageName", top.pool.get("fileName"));
	}
	reqMsg.appendNode("strBANK_NO", top.terminal.strOrgNum);
	
	top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901123Complete);
  }

   //��WEB�����������첽�������ʱ�Ļص�����
  this.onAsync901123Complete = function(iRet)
  {
   // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�籣�����콻��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	if (typeof(top.MainFrame.onCardMessageSuccessful) == "function")
        {
    		 
    		new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������	
        }
    }
    else
    {
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�籣�����콻��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

    /*΢��֤����Ϣ��ѯ*/
  this.send910209Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910209");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strBatchId",top.pool.get("strBatchId"));
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910209Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910209Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("΢��֤����Ϣ��ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
   
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if (typeof(top.MainFrame.onWeChatSuccessful) == "function"){
    		 var wechatPhotoUrl = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/wechatPhotoUrl");
    		 var fileName = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/fileName");
    		 top.pool.set("wechatPhotoUrl",wechatPhotoUrl);
    		 top.pool.set("fileName",fileName);
    		 new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onWeChatSuccessful");//IC�����׺�д������		
    	}
    }
    else
    {
      if (typeof(top.MainFrame.onSendPicSuccessful) == "function")
      {
    	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onSendPicSuccessful");//IC�����׺�д������		
      }
    }
  }
 
/*�ŶӲ�ѯ*/
  this.send912104Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "912104");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strDeviceType",top.terminal.getDeviceType());
	top.journalPrinter.addJournalWithTime("�����ŶӲ�ѯ����");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync912104Complete);  

  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync912104Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("�ŶӲ�ѯ����  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//�ɹ������кţ�ʧ�ܴ����޺�
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
   
  /*�к�*/
  this.send912109Async = function()
  {
	
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "912109");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strDeviceType",top.terminal.getDeviceType());
	reqMsg.appendNode("strCompleteBusNo",top.terminal.previousCallNumber);
	top.journalPrinter.addJournalWithTime("���ͽкŽ���");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync912109Complete);  

  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync912109Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("�кŽ���  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		  top.pool.set("verifyCodeNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/verificationCode"));//У����
		  top.terminal.currentCallNumber=top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/queueNo");//��ǰ�кź���
		  top.terminal.previousCallNumber=top.terminal.currentCallNumber;//Ϊ���˳��������˳��׼������
	      if (typeof(top.MainFrame.onUserCallingNumSuccessful) == "function")
	      {
	    	 top.MainFrame.onUserCallingNumSuccessful();
	      }
    }
    else
    {
		if (typeof(top.MainFrame.on912109Failed) == "function")
	    {
			top.MainFrame.on912109Failed();//�к��Ŷ�״̬��ѯ��	
	    }
    }		  
  }
  
   /*���Žк�*/
  this.send912108Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "912108");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strDeviceType",top.terminal.getDeviceType());
	reqMsg.appendNode("strCompleteBusNo",top.terminal.previousCallNumber);
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync912108Complete);  

  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����  ���ش���ͬ�к�912109 */
  this.onAsync912108Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("���ŽкŽ���  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	if (iRet == top.RESULT_SUCCESSFUL)
    {  	
		  top.pool.set("verifyCodeNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/verificationCode"));//У����
		  top.terminal.currentCallNumber=top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/queueNo");//��ǰ�кź���
		  top.terminal.previousCallNumber=top.terminal.currentCallNumber;//Ϊ���˳��������˳��׼������
	      if (typeof(top.MainFrame.onUserCallingNumSuccessful) == "function")
	      {
	    	 top.MainFrame.onUserCallingNumSuccessful();
	      }
    }
    else
    {
		if (typeof(top.MainFrame.on912109Failed) == "function")
	    {
			top.MainFrame.on912109Failed();//�к��Ŷ�״̬��ѯ��	
	    }
    }		  
  }
  
  
  /*�غ�����*/
  this.send912107Async = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "912107");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strDeviceType",top.terminal.getDeviceType());
	reqMsg.appendNode("strQueueNo",top.terminal.previousCallNumber);
	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync912107Complete);  
	//this.onAsync912107Complete(0);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync912107Complete = function(iRet)
  {
   var strJrn = new top.StringCtrl("�غ�����  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	//�غ����׷��غ󣬿����ڶ����غ�
	if (typeof(top.MainFrame.onRepeatCallSuccess) == "function")
	{
		top.MainFrame.onRepeatCallSuccess();//�к��Ŷ�״̬��ѯ��	
	}
  }
  
  
  
  /*����������Ϳ�/�ۻ��ڴ���*/
  this.send909005Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909005"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));  //����	
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //���
	reqMsg.appendNode("strAccount", top.pool.get("hostAccount"));  //���˺�
	reqMsg.appendNode("strIDCardNum",top.pool.get("strRespIDNo")); //֤������
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100Ԫ�������
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50Ԫ�������
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20Ԫ�������
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10Ԫ�������
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5Ԫ�������
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1Ԫ�������
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5�ǽ������
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1�ǽ������
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5�ֽ������
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1�ֽ������
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909005Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909005Complete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ڴ��909005 "+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strDepOrgTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onDepositFailed("��/�ۻ��ڴ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������Ϳ�/�ۻ��ڴ��ȷ�Ͻ���*/
  this.send909006Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909006"); 
	reqMsg.appendNode("strPan", top.pool.get("strPan"));  //����	
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //���
	reqMsg.appendNode("strAccount", top.pool.get("hostAccount"));  //���˺�
	reqMsg.appendNode("strIDCardNum",top.pool.get("strRespIDNo")); //֤������
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100Ԫ�������
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50Ԫ�������
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20Ԫ�������
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10Ԫ�������
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5Ԫ�������
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1Ԫ�������
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5�ǽ������
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1�ǽ������
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5�ֽ������
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1�ֽ������
	reqMsg.appendNode("strOrgTsn", top.pool.get("strDepOrgTsn"));  //ԭ������ˮ��
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909006Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909006Complete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��/�ۻ��ڴ��ȷ��909006 "+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("��/�ۻ��ڴ��ȷ�Ͻ���ʧ��", top.exchxmlasync.strTermRetCode, top.pool.get("strDepFailDesc"));
      }
    }
  }
  /*�Թ����ǰ��ѯ*/
  this.send909019Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909019");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPayeeAccount")); //�տ����˺�
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909019Complete);
  }  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909019Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�Թ����ǰ��ѯ909019  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
      //�տ�������
      top.pool.set("Payee_name",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acctName"));
	  new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onInqSecDepAmountSuccess");//IC�����׺�д������
    }
    else
    {
        if("P102" == top.exchxmlasync.strTermRetCode){
      	  top.MainFrame.onServiceFailed("�Թ����ǰ��ѯʧ��", top.exchxmlasync.strTermRetCode, "�����˻������쳣����ȥ�������");  
        }else{
      	  top.MainFrame.onServiceFailed("�Թ����ǰ��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);  
        }
    } 
  } 
  /*����������ͶԹ����ȷ�Ͻ���*/
  this.send909015Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909015"); 
	reqMsg.appendNode("strAccount", top.pool.get("strPayeeAccount"));  //�տ����˺�(F34)
	reqMsg.appendNode("strPayerName", top.pool.get("Pay_name"));  //���������
	reqMsg.appendNode("strPayerAcc", top.pool.get("Pay_number"));  //������˺�
	reqMsg.appendNode("strPayeeAcc", top.pool.get("strPayeeAccount"));  //�տ����˺�(F103)
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //���
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum")); //֤������
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100Ԫ�������
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50Ԫ�������
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20Ԫ�������
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10Ԫ�������
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5Ԫ�������
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1Ԫ�������
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5�ǽ������
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1�ǽ������
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5�ֽ������
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1�ֽ������
	reqMsg.appendNode("strOrgTsn", top.pool.get("strDepOrgTsn"));  //ԭ������ˮ��
	reqMsg.appendNode("CashType", top.pool.get("CashType"));  //�ֽ�ͳ�Ʒ�����2018-6-22�汾����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909015Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909015Complete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�Թ����ȷ��909015 "+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�Թ����ȷ�Ͻ���ʧ��", top.exchxmlasync.strTermRetCode, top.pool.get("strDepFailDesc"));
      }
    }
  }
  
  /*����������ͶԹ�����*/
  this.send909020Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909020"); 
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //���
	reqMsg.appendNode("strAccount", top.pool.get("strPayeeAccount"));  //�տ����˺�
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum")); //֤������
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100Ԫ�������
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50Ԫ�������
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20Ԫ�������
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10Ԫ�������
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5Ԫ�������
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1Ԫ�������
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5�ǽ������
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1�ǽ������
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5�ֽ������
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1�ֽ������
	reqMsg.appendNode("strPayerName", top.pool.get("Pay_name"));  //���������
	reqMsg.appendNode("strPayeeAcc", top.pool.get("strPayeeAccount"));  //�տ����˺�
	reqMsg.appendNode("strPayerAcc", top.pool.get("Pay_number"));  //������˺�
	reqMsg.appendNode("strUseWay", top.pool.get("UseWay"));  //��;
	reqMsg.appendNode("CashType", top.pool.get("CashType"));  //�ֽ�ͳ�Ʒ�����2018-6-22�汾����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909020Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909020Complete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�Թ����909020 "+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strDepOrgTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    	//���ԶԹ����ȷ�Ͻ��׽ӿ�
      	//top.MainFrame.onDepositFailed("�Թ����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onDepositFailed("�Թ����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*�����������ǿ��Ǽǲ�����*/
  this.send909007Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909007");
	reqMsg.appendNode("strDepY100", top.pool.get("str100ForDep"));  //100Ԫ�������
	reqMsg.appendNode("strDepY50", top.pool.get("str50ForDep"));  //50Ԫ�������
	reqMsg.appendNode("strDepY20", top.pool.get("str20ForDep"));  //20Ԫ�������
	reqMsg.appendNode("strDepY10", top.pool.get("str10ForDep"));  //10Ԫ�������
	reqMsg.appendNode("strDepY5", top.pool.get("str5ForDept"));  //5Ԫ�������
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1Ԫ�������
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5�ǽ������
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1�ǽ������
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5�ֽ������
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1�ֽ������
	reqMsg.appendNode("strGzNo", top.pool.get("strGzNo"));  //���ֺ�
	reqMsg.appendNode("strAuthtellerId", top.pool.get("strAuthtellerId"));  //��˹�Ա��
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909007Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909007Complete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ǿ��Ǽǲ�909007 "+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onForceDepositSuccessful");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onForceDepositFailed("ǿ��Ǽǲ�����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }

      /*�����������ȡ���*/
  this.send909002Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909002"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //���߱��
	reqMsg.appendNode("strPan", top.pool.get("strPan"));                //����	
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strDestPan", top.pool.get("hostAccount"));  //���˺�
	reqMsg.appendNode("strIDCardNum", top.pool.get("strRespIDNo")); //���֤�� 2018-1-15
	reqMsg.appendNode("strBindAcctType", top.pool.get("acctKind"));  //�˻�����
	reqMsg.appendNode("Amount", top.pool.get("AmountCheckFen"));  //���
	reqMsg.appendNode("strY100Num", top.pool.get("Y100Num"));  //100Ԫ�������
	reqMsg.appendNode("strY50Num", top.pool.get("Y50Num"));  //50Ԫ�������
	reqMsg.appendNode("strY20Num", top.pool.get("Y20Num"));  //20Ԫ�������
	reqMsg.appendNode("strY10Num", top.pool.get("Y10Num"));  //10Ԫ�������
	reqMsg.appendNode("strY5Num", top.pool.get("Y5Num"));  //5Ԫ�������
	reqMsg.appendNode("strY1Num", top.pool.get("Y1Num"));  //1Ԫ�������
	reqMsg.appendNode("strC50Num", top.pool.get("C50Num"));  //5�ǽ������
	reqMsg.appendNode("strC10Num", top.pool.get("C10Num"));  //1�ǽ������
	reqMsg.appendNode("strC5Num", top.pool.get("C5Num"));  //5�ֽ������
	reqMsg.appendNode("strC1Num", top.pool.get("C1Num"));  //1�ֽ������
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909002Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909002Complete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ֽ�ȡ��"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
	top.pool.set("strWithDrawTransJun",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
	var strOrgTsns = "0021909002"+ top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo");
	top.pool.set("strOrgTsns",strOrgTsns);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onDrawTransSucc");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�ֽ�ȡ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
 
    /*�忨����-���˻����� 2018-1-18*/ 
  this.send901612WithDrawVerifyAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901612"); 
	reqMsg.appendNode("strTerminalNum", top.terminal.strTerminalNum); //�ն˺�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock"));    //��������
	reqMsg.appendNode("strLossDestPan", top.pool.get("hostAccount"));    //�浥���˺�
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901612WithDrawComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901612WithDrawComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ȡ��ǰ���˻�����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    { 
		new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onWithDrawVerifyServiceSuccessful");//IC�����׺�д������	
	}
    else 
    {
		var respCode901612 = top.exchxmlasync.strTermRetCode;
		if (typeof(top.MainFrame.onWithDrawVerifyFailed) == "function" && respCode901612 == "2055")
		{
			top.MainFrame.onWithDrawVerifyFailed();
		}else if (typeof(top.MainFrame.onServiceFailed) == "function")
		{
			top.MainFrame.onServiceFailed("ȡ��ǰ���˻����ܲ�ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }

  /*�忨����-ȡ��������� 2018-1-19*/
  this.send901606WithDrawVerifyAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode", "901606");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strPan"));          //���п���
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));    //2�ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));    //3�ŵ�
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("str5F34", top.pool.get("str5F34")); //�����к�
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //IC����
	reqMsg.appendNode("DestPan", top.pool.get("DestPan")); //��չ���˺� ����ʹ��
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901606WithDrawSecondComplete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901606WithDrawSecondComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ȡ��ǰ����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onWithDrawVerifyServiceSuccessfulCard");//IC�����׺�д������
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
				//����PAD
				top.trans.send910304BalckListAsync();
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.langcur.oCheckCardFailedTip);
			}else{
				top.MainFrame.onServiceFailed(top.langcur.oValidateCardFailed, top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
			}
		}
    }
  }
  
    /*ȡ���������-ҳ��*/
  this.send900002WithDrawAsync = function()
  {
		var exch = new ExchangeXmlWithHost();
		var reqMsg = new ColsMsgXmlText();
		reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
		reqMsg.appendNode("strTransCode","900002");    //���ױ��룬��Ҫ�������ļ���Ӧ
		reqMsg.appendNode("Amount", top.pool.get("AmountCheckFen")); //���
		reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
		reqMsg.appendNode("DestPan", top.pool.get("hostAccount")); //��չ���˺�  //�����۳�����
		reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
		//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
		reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
		reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
		reqMsg.appendNode("orgTsn", top.pool.get("strOrgTsns"));  //ԭ������ˮ��
		reqMsg.appendNode("strField57", top.pool.get("strField57"));
		reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
		top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync900002WithDrawComplete);
  }
    /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync900002WithDrawComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("ȡ���������(ҳ��)"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    { 
		new top.CheckCard().icCheckAfterTrans("","top.MainFrame.rollBackSucc");//IC�����׺�д������	
	}
    else 
    {
		if (typeof(top.MainFrame.rollBackFail) == "function")
		{
			top.MainFrame.rollBackFail();
		}
    }
  }
  
  
    /*ȡ���������-S���߳�*/
  this.send900002WithDrawReverseAsync = function()
  {
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Reverse");//�����߳�
	reqMsg.appendNode("strTransCode","900002");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("AmountCheckFen")); //���
	reqMsg.appendNode("strPan", top.pool.get("strPan")); //�˺�
	reqMsg.appendNode("DestPan", top.pool.get("hostAccount")); //��չ���˺�  //�����۳�����
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	//reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("orgTsn", top.pool.get("strOrgTsns"));  //ԭ������ˮ��
	reqMsg.appendNode("strField57", top.pool.get("strField57"));
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
	top.journalPrinter.addCashJournalWithTime("ȡ���������-S���߳�",true);
	exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
  }	
		
    /*����������͵��� ����ʣ��ȡ�����ѯ*/
  this.send909001MaxDrawAsync = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909001"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); //���߱��
	reqMsg.appendNode("strPinBlock", top.pool.get("strPinBlock")); //��������
	reqMsg.appendNode("strField55", top.pool.get("strField55")); //55��
	reqMsg.appendNode("strTrack2", top.pool.get("strTrack2"));  //���ŵ�
	reqMsg.appendNode("strTrack3", top.pool.get("strTrack3"));  //���ŵ�
	reqMsg.appendNode("strDestPan", top.pool.get("hostAccount"));  //���˺�
	reqMsg.appendNode("strBindAcctType", top.pool.get("acctKind"));  //�˻�����
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909001MaxDrawComplete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909001MaxDrawComplete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����/����ʣ��ȡ�����ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  top.pool.set("totalAmountDay",new top.StringCtrl("").formatStrAmount(top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/amt_xzm")));//�����ۼƽ��׶�
	  top.pool.set("MaxDrawDay",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/debitDailyUsedLimit"));//����ʣ��ת�����
	  top.pool.set("MaxDrawYear",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/debitYearUsedLimit"));//����ʣ��ת�����
	  top.pool.set("Cash",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/Cash"));//����ȡ�����ƽ��
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.QuerryMaxDrawSuc");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("����/����ʣ��ȡ�����ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*ȡ��ɹ�-�����������Ϣ�Ǽ�*/
  this.send901112CashAsync = function(){
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901112");    //���ױ��룬��Ҫ�������ļ���Ӧ	
	reqMsg.appendNode("strIDCardNum", top.pool.get("DrawAgentIDNum")); //���������֤
	reqMsg.appendNode("strIDName", top.pool.get("DrawAgentName")); //����������
	reqMsg.appendNode("strPhone",top.pool.get("drawAgentTel"));//�����˵绰
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����	
	reqMsg.appendNode("strOption",top.pool.get("strOption"));//ѡ��
	reqMsg.appendNode("strIdEndDate",top.pool.get("strdrawAgentIDEnd"));//֤��������
    reqMsg.appendNode("strIdIssureArea",top.pool.get("strdrawAgentIDGrantDept"));//֤���䷢��
	reqMsg.appendNode("strAgentTransCode",top.pool.get("strAgentTransCode"));//����������
	reqMsg.appendNode("strReqSerialNo",top.pool.get("strWithDrawTransJun"));//ԭ������ˮ�� 2018-1-8 �����˵Ǽ�����ȡ����ˮ��
	top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901112CashComplete);   
  }
     /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901112CashComplete = function(iRet)
  {
	 // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�����������Ϣ�Ǽ�"+ top.pool.get("strAgentTransCode") +"  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {   	
       top.journalPrinter.addCashJournalWithTime("�����������Ϣ�Ǽǳɹ�",false);
    }
    else
    {
      top.journalPrinter.addCashJournalWithTime("�����������Ϣ�Ǽ�ʧ��",true);
    }    
  }
  
   /*�����������ȡ�����ˮ*/
  this.sendUpdateWithDrawTransLog = function()
  {
	var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "UpdateWithDrawTransLog");
	
	reqMsg.appendNode("strTermTSN", top.pool.get("strWithDrawTransJun"));          //ԭ�ն���ˮ��
	reqMsg.appendNode("strTermTransResult", top.pool.get("TermTransResult")); //�ն˽���״̬ 0δ���� 1���ͳ� 2����ʧ�� 3��ȷ��
	reqMsg.appendNode("strReverseentryResult", top.pool.get("ReverseentryResult")); //����״̬ 0������ 1�����ɹ� 2����ʧ�� 3��ȷ��
	var UpdateData = "ԭ�ն���ˮ��:" + top.pool.get("strWithDrawTransJun") + " �ն˽���״̬:" + top.pool.get("TermTransResult") + " ����״̬:" + top.pool.get("ReverseentryResult");
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);

    if (iRet == top.RESULT_SUCCESSFUL)
    {
		top.journalPrinter.addCashJournalWithTime("ȡ�����ˮ��¼�ɹ�" + UpdateData,false);
    }
    else
    {
        top.journalPrinter.addCashJournalWithTime("ȡ�����ˮ��¼ʧ��" + UpdateData,false);
    }
  }  
  
  
   /*���ǰ��ѯ*/
  this.send909004Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909004");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strPan", top.pool.get("strDepAccount")); //�˺�
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909004Complete);
  }  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909004Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("���ǰ��ѯ909004  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
      //�˻�����
      top.pool.set("bindAcctType", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/bindAcctType"));
      //�������ۼƿ����޶�
      top.pool.set("creditDailyUsedLimit", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditDailyUsedLimit"));
      //�������ۼƿ����޶�
      top.pool.set("creditYearUsedLimit", top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/creditYearUsedLimit"));
      //֤����
      top.pool.set("creditF60_1",top.exchxmlasync.msgxmldomResp.getElementValue("F61_1"));
      //������˺�
      top.pool.set("hostAccount",top.exchxmlasync.msgxmldomResp.getElementValue("F34"));
      new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onInqSecDepAmountSuccess");//IC�����׺�д������
    }
    else
    {
      top.MainFrame.onServiceFailed("���ǰ��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
    }
  } 
  
  /*�ڲ��˴���*/
  this.send909008Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909008");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("strCashAmount")); //�˺�
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strSummary",top.pool.get("strIDCardNum")+top.pool.get("strIDName"));//ժҪ
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909008Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909008Complete = function(iRet)
  {
	// ��¼�ն���ˮ
	var strJrn = new top.StringCtrl("�ֽ���909008  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
		//ʧ�ܾ���Ҫ���ʹ��ȷ��
		top.trans.send909009Async();
	}
  }
  /*�ڲ��˴��ȷ�Ͻ���*/
  this.send909009Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909009");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("strCashAmount")); //�˺�
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strOldOrgTsns",top.pool.get("strOrgTsns"));//ԭ�ֽ������ˮ
	reqMsg.appendNode("strSummary",top.pool.get("strIDCardNum")+top.pool.get("strIDName"));//ժҪ
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909009Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909009Complete = function(iRet)
  {
	// ��¼�ն���ˮ
	var strJrn = new top.StringCtrl("�ֽ���ȷ��909009  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
		top.MainFrame.onServiceFailed("�ֽ���ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}    
  }
  /*�ڲ���ȡ���*/
  this.send909010Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909010");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("strCashWithDraw")); 
	reqMsg.appendNode("strIDCardNum",top.pool.get("strIDCardNum"));//֤������
	reqMsg.appendNode("strTransRandom",top.pool.get("strTransRandom"));//�����
	reqMsg.appendNode("strSummary",top.pool.get("strIDCardNum")+top.pool.get("strIDName"));//ժҪ
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909010Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909010Complete = function(iRet)
  {
	// ��¼�ն���ˮ
	var strJrn = new top.StringCtrl("�ֽ�ȡ��909010  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
		top.MainFrame.onServiceFailed("�ֽ�ȡ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}    
  }
  /*����������������������ؽ���*/
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
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync930000Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("������������"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    var retMsg = top.exchxmlasync.getChildTextByTag("F60");
    var TrCode = "" + top.eleLock.GetNodeVal(retMsg,"Ex_TrCode");
    var RetCode = "" + top.eleLock.GetNodeVal(retMsg,"Ex_RetCode");
	top.journalPrinter.addJournalWithTime("������ϵͳ�����룺" + RetCode);
    if (iRet == top.RESULT_SUCCESSFUL)
    {
    	top.pool.set("strEleLockRetMsg",retMsg);
		if("4000" == TrCode){
    		//������Ϊ"4000"Ϊ����Ӧ����������
    		if (typeof(top.MainFrame.onAsync930000Complete) == "function"){
    			top.MainFrame.onAsync930000Complete();
    		}
    			
    	}else{
    		top.journalPrinter.addJournalWithTime("���յ���������Ӧ����ʼ�������ݵ�������");
        	var retStr = top.eleLock.WriteReport(retMsg);
            top.journalPrinter.addJournalWithTime("���н����" + retStr);
			if (typeof(top.MainFrame.onAsync930000Complete) == "function" && top.pool.get("OpenEleLockAllowed")){
				top.MainFrame.onAsync930000Complete();
    		}
    	}
    }else if(RetCode.length >0){
    	//����������ϵͳ�з���
    	top.pool.set("strEleLockRetMsg",retMsg);
		if("4000" == TrCode){
    		if (typeof(top.MainFrame.onAsync930000Complete) == "function"){
    			top.MainFrame.onAsync930000Complete();
			}
    	}else{
    		top.journalPrinter.addJournalWithTime("���յ���������Ӧ����ʼ�������ݵ�������");
        	var retStr = top.eleLock.WriteReport(retMsg);
            top.journalPrinter.addJournalWithTime("���н����" + retStr);
			if (typeof(top.MainFrame.onAsync930000Complete) == "function" && top.pool.get("OpenEleLockAllowed")){
				top.MainFrame.onAsync930000Complete();
    		}
    	}
    }else{		//����������ϵͳ�޷���
    	var strJrn = "����������������ʧ��" + ":" + top.exchxmlasync.strTermRetDesc + top.journalPrinter.strNewLine;
        top.journalPrinter.addJournal(strJrn);
        var strEleLock = top.pool.get("strEleLock");
        var TrCodeOrig = "" + top.eleLock.GetNodeVal(strEleLock,"Ex_TrCode");
        if("4000" == TrCodeOrig || top.pool.get("OpenEleLockAllowed")){
	        if (typeof(top.MainFrame.onServiceFailed) == "function")
	        {
	          top.MainFrame.onServiceFailed("������������������ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	        }
        }
    }
  }
  
  /*��ѯ�峮״̬*/
  this.sendCashSettleCycLogStatusAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "QueryAddCashStatus");
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    reqMsg.appendNode("strTransType",top.pool.get("strTransType"));
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCashSettleCycLogStatusComplete);
    //top.trans.onAsyncCashSettleCycLogStatusComplete(0);  //����
  }

  /*�忨״̬��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncCashSettleCycLogStatusComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��ѯ�峮״̬"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("��ѯ�峮״̬ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���˷��ͼӳ�����*/
  this.send909012Async = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "AddCash");
	reqMsg.appendNode("strTransCode","909012"); 
    reqMsg.appendNode("strTotalAmount", new top.StringCtrl("").YuanToFen(top.pool.get("strAddTotalAmount")));
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    var strJrn = new top.StringCtrl("���ͼӳ��������� "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909012Complete);
    //top.trans.onAsync909012Complete(0);	//����
  }
  
  /*�ӳ�������WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909012Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ӳ�����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("�ӳ�����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
   /*�������β���ѯ����*/
  this.send909013Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909013"); 
	reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum); 
	top.journalPrinter.addJournalWithTime("����β���ѯ���� send909013Async ");
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909013Complete);
  }

  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909013Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("β���ѯ"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("β���ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*���˷����峮����*/
  this.send909011Async = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "ClearCash");
	reqMsg.appendNode("strTransCode","909011"); 
    reqMsg.appendNode("strTotalAmount", new top.StringCtrl("").YuanToFen(top.pool.get("strAddTotalAmount")));
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    var strJrn = new top.StringCtrl("�����峮�������� "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909011Complete);
    //top.trans.onAsync909011Complete(0);	//����
  }
  
  /*�峮������WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909011Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�峮����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("�峮����ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }  
  /*���˷����ֽ����˽���*/
  this.sendCashFailedRecordAsync = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "CashFailedRecord");
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    var strJrn = new top.StringCtrl("�����ֽ����˽������� "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsyncCashFailedRecordComplete);
  }
  /*�ֽ����˽�����WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsyncCashFailedRecordComplete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ֽ����˽���"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("�ֽ����˽���ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  /*���˷��ͳ���䶯����*/
  this.send909014Async = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
	var BoxCheck = new CashBoxCheck();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
    reqMsg.appendNode("strTransCode","909014"); 
    reqMsg.appendNode("strTerminalNum",top.terminal.strTerminalNum);
    reqMsg.appendNode("strCashBoxData",BoxCheck.getCashBoxInfo());
    var strJrn = new top.StringCtrl("���ͳ���䶯�������� "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909014Complete);
  }
  /*����䶯������WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909014Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("����䶯����"+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
        top.MainFrame.onServiceFailed("�ֽ����˽���ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }*/
  }

   /*�����������ȡ��������½���*/
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
		top.journalPrinter.addCashJournalWithTime("ȡ��������¼�¼�ɹ�",false);
    }
    else
    {
        top.journalPrinter.addCashJournalWithTime("ȡ��������¼�¼ʧ��",false);
    }
  } 
  
  /*�ͻ���ϵ��Ϣ��ѯ*/
  this.send901129Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "901129");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strCustomerId", top.pool.get("customNo"));   //�ͻ���
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync901129Complete);
  }
  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync901129Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�ͻ���ϵ��Ϣ��ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if (iRet == top.RESULT_SUCCESSFUL)
    {   
    	if (typeof(top.MainFrame.on901129Successful) == "function"){
    		 new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.on901129Successful");//IC�����׺�д������		
    	}
    }
    else
    {
		if(typeof(top.MainFrame.onServiceFailed) == "function"){
			top.MainFrame.onServiceFailed("�ͻ���ϵ��Ϣ��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
  }
  
  /*��Ա��Ϣ��ѯ*/
  this.send910207Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910207");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strTellerum", top.pool.get("strTellerum")); //��Ա��
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910207Complete); 
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910207Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Ա��Ϣ��ѯ  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {     	
	  var strloginType = top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/loginType");
	  top.pool.set("strLoginType",strloginType);
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.TellerQuerySucess");//IC�����׺�д������	
    }
    else
    {
    	if (typeof(top.MainFrame.onTellerQueryFailed) == "function")
	    {
	        top.MainFrame.onTellerQueryFailed("��Ա��Ϣ��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	    }	
    }
  } 
  
  /*��Ա������֤*/
  this.send910208Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "910208");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strTellerum", top.pool.get("strTellerum")); //��Ա��
	reqMsg.appendNode("strTellerPwd", top.pool.get("strTellerPwd")); //��Ա����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync910208Complete); 
  }
   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync910208Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Ա������֤  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);

    if (iRet == top.RESULT_SUCCESSFUL)
    {     	
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.checkFingerSucess");//IC�����׺�д������	
    }
    else
    {
    	if (typeof(top.MainFrame.onTellerCheckFailed) == "function")
	    {
	        top.MainFrame.onTellerCheckFailed("��Ա������֤ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	    }	
    }
  } 
  /*����������͹�Ա�ֽ��ѯ����*/
  this.send909122Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909122"); 
	reqMsg.appendNode("Amount", top.pool.get("Amount")); 	
    top.exchxmlasync.doExchangeAsync(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909122Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909122Complete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Ա�ֽ��ѯ "+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onTelAmountQuerySuc");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onCashServiceFailed("��Ա�ֽ��ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*����������͹�Ա�ֽ����*/
  this.send909120Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode", "909120"); 
	reqMsg.appendNode("Amount", parseFloat(top.pool.get("strTotalAmount")) * 100);  //���
	reqMsg.appendNode("strDepY100", top.pool.get("str100DepCount"));  //100Ԫ�������
	reqMsg.appendNode("strDepY50", top.pool.get("str50DepCount"));  //50Ԫ�������
	reqMsg.appendNode("strDepY20", top.pool.get("str20DepCount"));  //20Ԫ�������
	reqMsg.appendNode("strDepY10", top.pool.get("str10DepCount"));  //10Ԫ�������
	reqMsg.appendNode("strDepY5", top.pool.get("str5DepCount"));  //5Ԫ�������
	reqMsg.appendNode("strDepY1", top.pool.get("str1DepCount"));  //1Ԫ�������
	reqMsg.appendNode("strDepC50", top.pool.get("strC50DepCount"));  //5�ǽ������
	reqMsg.appendNode("strDepC10", top.pool.get("strC10DepCount"));  //1�ǽ������
	reqMsg.appendNode("strDepC5", top.pool.get("strC5DepCount"));  //5�ֽ������
	reqMsg.appendNode("strDepC1", top.pool.get("strC1DepCount"));  //1�ֽ������
	
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909120Complete); 
  }

   /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909120Complete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("��Ա�ֽ��� "+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strDepOrgTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));
    
    if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans("","top.MainFrame.onServiceSuccessful");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onDepositFailed("��Ա�ֽ���ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }
  }
  
  /*��Ա�ֽ�ȡ���*/
  this.send909119Async = function()
  {
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909119");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("Amount", top.pool.get("TransAmount")); //ȡ����
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909119Complete);
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909119Complete = function(iRet)
  {
	// ��¼�ն���ˮ
	var strJrn = new top.StringCtrl("��Ա�ֽ�ȡ��909119  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
	"�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
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
			top.MainFrame.onCashServiceUnknow("��Աȡ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}else{
			top.MainFrame.onCashServiceFailed("��Աȡ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
	else
	{
		//�����쳣
		top.MainFrame.onCashServiceUnknow("��Աȡ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	}    
  }
  /*�Թ�ȡ����Ϣ��ѯ*/
  this.send909016Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909016");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strMobile", top.pool.get("strMobile")); //�ֻ���
	reqMsg.appendNode("strMessageCode", top.pool.get("strMessageCode")); //��֤��
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909016Complete);
  }  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909016Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�Թ�ȡ���ѯ909016  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    if(iRet == top.RESULT_SUCCESSFUL)
    { 
     //��˾����
      top.pool.set("WithDraw_CompName",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acct_name"));//F61_6_NM��Ź�˾����
     //ȡ��������
      top.pool.set("WithDraw_Name",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/trnspersion_name"));
	 //ȡ���˺�
      top.pool.set("WithDraw_Acc",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/acct_no"));
     //ȡ����
      top.pool.set("strCashWithDraw",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/trns_fee"));
     //ȡ��Ǽ�����
      top.pool.set("WithDraw_Date",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/record_date"));
     //�Ǽ������֤����
      top.pool.set("strRegCardNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/cred_code"));
     //ȡ��ǼǱ��
      top.pool.set("strDrawId",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/id"));
     //ȡ��ǼǵĻ�����
      top.pool.set("WithDraw_orgNum",top.exchxmlasync.msgxmldomResp.getElementValue("/TransMsg/dataList/F60/bank_no"));
      //ȡ��Ǽǻ������������Ա�
      if(top.pool.get("WithDraw_orgNum")!=null && top.pool.get("WithDraw_orgNum")!= "" && top.pool.get("WithDraw_orgNum")!=top.terminal.strOrgNum){
    	  top.MainFrame.onServiceFailed("�Թ�ȡ���ѯʧ��", top.exchxmlasync.strTermRetCode, "�Թ�ȡ��Ǽǻ����뱾������һ�£���ȥԭ�Ǽǻ�������ҵ��");  
      }
      if(typeof(top.MainFrame.ShowWithDrawInfo) == "function"){
		  top.MainFrame.ShowWithDrawInfo();
      }
    }else{
    	if(top.pool.get("checkCodeFlag") <2){//��֤�������������
    		top.MainFrame.onService909016Failed("�Թ�ȡ���ѯʧ��", top.exchxmlasync.strTermRetCode, "��������ֻ��Ż���֤��������ȷ�Ϻ���������");
    	}else{
    		top.MainFrame.onServiceFailed("�Թ�ȡ���ѯʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);  
    	} 
    }
  } 
  
  /*�Թ�ȡ���*/
  this.send909017Async = function()
  {
	new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
    var exch = new ExchangeXmlWithHost();
	var reqMsg = new ColsMsgXmlText();
	var CashWithDrawNum = top.pool.get("strCashWithDraw");
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	reqMsg.appendNode("strTransCode","909017");    //���ױ��룬��Ҫ�������ļ���Ӧ
	reqMsg.appendNode("strDrawId", top.pool.get("strDrawId")); //ȡ����
	reqMsg.appendNode("strIDCardNum", top.pool.get("strIDCardNum")); //���������֤
	reqMsg.appendNode("Amount", new top.StringCtrl("").YuanToFen(CashWithDrawNum));  //���
	reqMsg.appendNode("strDestPan",top.pool.get("WithDraw_Acc")); //ȡ���˻�
    top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909017Complete);
  }  
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909017Complete = function(iRet)
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�Թ�ȡ���909017  ������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    top.pool.set("strWithDrawTransJun",top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));//ԭ������ˮ
    top.pool.set("strDepOrgTsn", top.exchxmlasync.msgxmldomResp.getElementValue("strOrigstrTxSerialNo"));//ԭ������ˮ
    if(iRet == top.RESULT_SUCCESSFUL)
    { 
    	if (typeof(top.MainFrame.onDrawTransSucc) == "function"){
			top.MainFrame.onDrawTransSucc();
			}
    }
    else if(iRet == top.RESULT_FAILED)
    { 
		if(top.exchxmlasync.strTermRetCode == "0002"){// s->p
			top.MainFrame.drawOutOfServiceUnknow("�Թ�ȡ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}else{
			top.MainFrame.onServiceFailed("�Թ�ȡ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
		}
    }
	else
	{
		//�����쳣 c->s
		top.MainFrame.drawOutOfServiceUnknow("�Թ�ȡ��ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
	} 
  }
  /*�Թ�ȡ��ȷ�Ͻ���*/
  this.send909021Async = function(){
	  new top.CheckCard().icCheckBeforeTrans("","");//IC������ǰ��֤
	  var exch = new ExchangeXmlWithHost();
	  var reqMsg = new ColsMsgXmlText();
	  reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Trans");
	  reqMsg.appendNode("strTransCode","909021");    //���ױ��룬��Ҫ�������ļ���Ӧ
	  reqMsg.appendNode("strDrawId", top.pool.get("strDrawId")); //ȡ����
	  reqMsg.appendNode("strOrgTsn", top.pool.get("strDepOrgTsn"));  //ԭ������ˮ��
	  top.exchxmlasync.doExchangeAsyncWithMac(SERVICEPROCESSOR_URL, reqMsg, top.trans.onAsync909021Complete); 
  }
  /*��WEB�����������첽�������ʱ�Ļص�����*/
  this.onAsync909021Complete = function(iRet)
  { 
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("�Թ�ȡ��ȷ��909021 "+" "+"������"+":" + top.exchxmlasync.strTermRetCode).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine+
    "�ն���ˮ��"+ ":" + top.exchxmlasync.msgxmldomResp.getElementValue("F11") + " " +"������ˮ��"+":" + top.exchxmlasync.msgxmldomResp.getElementValue("F37") + top.journalPrinter.strNewLine;
    top.journalPrinter.addJournal(strJrn);
    
    /*if (iRet == top.RESULT_SUCCESSFUL)
    {
	  new top.CheckCard().icCheckAfterTrans(top.exchxmlasync.msgxmldomResp.getElementValue("F55"),"top.MainFrame.onDrawTransSucc");//IC�����׺�д������
    }
    else
    { 
      if (typeof(top.MainFrame.onServiceFailed) == "function")
      {
        top.MainFrame.onServiceFailed("�Թ�ȡ��ȷ�Ͻ���ʧ��", top.exchxmlasync.strTermRetCode, top.exchxmlasync.strTermRetDesc);
      }
    }*/
  }
  /*�������ֻ�����ת��*/
  this.convertType =function(transType,flag) 
  {
	  if(flag =="1"){
		switch(transType) {
			case "O" : return "����רҵ��";
			case "M" : return "֤��רҵ��";
			case "R" : return "����ע���";
			case "1" : return "��������֤���";
			case "2" : return "�����������Ű�";
			case "3" : return "�����������ż�֤���";
			default : return "����"
		}   
	  }else if(flag == "Ukey") {
		  switch(transType) {
			  case "5002" : return "������������";
			  case "5003" : return "��˾��������";
			  case "5004" : return "֧��������";
			  case "5005" : return "���������ŷ�";
			  case "5006" : return "����������̩";
			  case "5007" : return "��˾������̩";
			  case "5008" : return "���˷������";
			  case "5009" : return "��ҵ�������";
			  case "5010" : return "�����Ű�����";
			  case "5011" : return "��ҵ�Ű�����";
			  case "5012" : return "�����н��������";
			  case "5013" : return "��ҵ�н��������";
			  case "5014" : return "���˷����������";
			  case "5015" : return "��ҵ�����������";
			  default : return "����"
		  }
	  }else if(flag == "Card") {
		  switch(transType) {
			  case "000" : return "�������⿨(16λ)";
			  case "001" : return "�������⿨(16λ)";
			  case "002" : return "�������⿨";
			  case "003" : return "�����Ա����(16λ)(����)";
			  case "004" : return "�����Ա����(����)";
			  case "005" : return "�Ϻ������Ա����";
			  case "022" : return "��λ��Ȩ��";
			  case "030" : return "���⿨(16λ)";
			  case "031" : return "���⿨";
			  case "032" : return "���⿨(IC)";
			  case "060" : return "��ͨ��";
			  case "061" : return "��ͨ��(��)";
			  case "063" : return "��ͨ��(16λ)";
			  case "064" : return "�Ϻ������Ա����(IC)";
			  case "065" : return "��������������";
			  case "066" : return "�νݿ�";
			  case "067" : return "����׽�";
			  case "068" : return "������";
			  case "070" : return "��Ǯ��";
			  case "020" : return "����������";
			  case "071" : return "����һ��ͨ";
			  case "050" : return "԰����";
			  case "072" : return "��ͥ�˻�����";
			  case "073" : return "��ͥ�˻�����";
			  case "021" : return "��λ���㿨";
			  case "069" : return "΢��԰��������";
			  case "074" : return "�ɽ�������";
			  case "075" : return "���Ͽ�";
			  default : return "����"
		  }
	  }else if(flag == "Voucher") {
		  switch(transType) {
			  case "00" : return "�޴�ƾ֤";
			  case "03" : return "��;";
			  case "05" : return "δ��";
			  case "06" : return "ʹ��";
			  case "08" : return "��ʧȷ��";
			  case "09" : return "��ʧ";
			  case "091" : return "��ͷ��ʧ";
			  case "10" : return "������";
			  case "11" : return "����";
			  case "12" : return "����";
			  case "13" : return "�ⲿ����";
			  case "30" : return "��ʧ";
			  case "31" : return "�ڲ�����";
			  case "32" : return "Ȧ��";
			  case "33" : return "ֹ��";
			  case "50" : return "����";
			  case "55" : return "������";
			  case "60" : return "��������;";
			  default : return "����"
		  }
	  }else {
		switch(transType) {
			case "01" : return "��ǿ�";
			case "02" : return "���ǿ�";
			case "03" : return "����";
			case "04" : return "�˺�";
			case "������" : return "0126";
			case "������" : return "0131";
			case "һ��" : return "0136";
			case "����" : return "0141";
			case "����" : return "0146";
			case "����" : return "0151";
			default : return "����"
		}  
	  }	
  } 
  
  this.converCurrency = function(transType){
	  switch(transType) {
		case "CNY" : return "�����";
		case "USD" : return "��Ԫ";
		case "EUR" : return "ŷԪ";
		case "CAD" : return "��Ԫ";
		case "HKD" : return "��Ԫ";
		case "GBP" : return "Ӣ��";
		default : return transtype
	} 
  }
	
	
  /*��������ת��*/
  this.convertTransType =function(transType) 
  {
	switch(transType) {
		case "902503" : return "�޸�����";
		case "902601" : return "��ǿ������ֽ����";
		case "900002" : return "ָ���˻���ֵ����";
		case "901104" : return "��������";
		case "901201" : return "��ǿ�����";
		case "901112" : return "�����������Ϣ�Ǽ�";
		case "901610" : return "�ۺ�ǩԼ";
		case "901608" : return "��������ǩԼ��ѯ";
		case "901703" : return "ATMת�˼��޶��ѯ";
		case "901704" : return "ATMת�˼��޶�";
		case "901708" : return "С��֧���޶��޸�";
		case "901709" : return "Ԥ���ֻ��ŵǼ��޸�";
		case "901713" : return "С��֧���޶��ѯ";
		case "901807" : return "������֧��-�޶�����޸�";
		case "901806" : return "������֧��-�޶�����ѯ";
		case "902105" : return "�˻���Ϣ��ѯ";//
		case "902106" : return "�˻��б��ѯ����";
		case "902107" : return "��ѯ����";
		case "902117" : return "����ѯ";
		case "902109" : return "�������˻���ѯ";
		case "902110" : return "�������˻���ѯ";
		case "902111" : return "�˻���ʷ��ϸ��ѯ";
		case "902201" : return "�󶨲�ѯ";
		case "902202" : return "��ֵ";
		case "902209" : return "�����ֽ���-д���������";
		case "902502" : return "��������";
		case "902501" : return "��������";
		case "902301" : return "���۲��ǽ���";
		case "903101" : return "ת��-����ǻ�ת";
		case "903401" : return "����ת���ڽ���";
		case "903402" : return "����ת���ڽ���";
		case "904102" : return "���ÿ�����";
		case "904103" : return "��ǿ�ת��ǿ�����";
		case "904105" : return "�Զ�����Լ��";
		case "904106" : return "�Զ�����Լ��ȡ��";
		case "904107" : return "�Զ�����Լ����ѯ";
		case "904206" : return "�Զ����㻹������";
		case "904207" : return "�Զ����㻹���Լ";
		case "904208" : return "�Զ����㻹���ѯ";
		case "904501" : return "���ÿ��ͻ���Ϣ��ѯ";
		case "904502" : return "��֤���Ų�ѯ���ÿ���";
		case "904503" : return "���ÿ��˻���ѯ";
		case "904504" : return "���ÿ���Ƭ��ѯ";
		case "904506" : return "�˵�ͷ��ѯ����";
		case "904507" : return "δ���˵���ѯ����";
		case "904508" : return "�ѳ��˵���ѯ����";
		case "906104" : return "ǩ��ȷ����";
		case "906201" : return "�Ƽ۲�ѯ";
		case "906301" : return "��㹺��";
		case "906302" : return "�����";
		case "906406" : return "�������";
		case "907101" : return "�ɷ������ѯ";
		case "907102" : return "�ɷ�";
		case "907301" : return "����������ѯ";
		case "907302" : return "��������ϸ��ѯ-��ϸ��ѯ";
		case "908207" : return "���������޸�";
		case "910201" : return "�����˲�";
		case "910301" : return "PAD���";
		case "911101" : return "������װ��";
		case "911102" : return "������װ��";
		case "911201" : return "������Կ����";
		case "911202" : return "������Կ����";
		case "901710" : return "Ԥ���ֻ��Ų�ѯ";
		case "901606" : return "���ܽ���";
		case "907204" : return "����ǩԼ��ѯ";
		case "907205" : return "����ǩԼ����";
		case "908214" : return "����������������";
		case "908213" : return "�������������˻�";
		case "908203" : return "��������ע��";
		case "908108" : return "�ֻ�������������";
		case "908107" : return "�ֻ����������˻�";
		case "908102" : return "�ֻ�����ע��";
		case "908104" : return "�ֻ������޸�";
		case "908305" : return "����ͨά��";
		case "902122" : return "ƾ֤�б��ѯ";
		case "905102" : return "�浥����";
		case "905105" : return "���ʲ�ѯ";		
		case "905106" : return "�ڲ���ת��";
		case "905107" : return "�浥����";
		case "905108" : return "�ڲ���ת��";
		case "905111" : return "��Ϣ����";
		case "905119" : return "�浥��֤";
		case "910103" : return "�Ŷӽк�";		
		case "910206" : return "��Աָ����Ȩ";		
		case "910304" : return "���й�ԱЭ��";
		case "910305" : return "Э�������ѯ";
		case "911203" : return "�豸��Աǩ��";
		case "911204" : return "�豸��Աǩ��";	
		case "903201" : return "����ת��";			
		case "903101BH" : return "����ת��";
		case "902502CDT" :return "���ÿ���������";
		case "902502DBT" :return "��ǿ���������";
		case "902502CD"  :return "�浥��������";
		case "902502PBK" :return "������������";
		case "902503DBT" :return "���ÿ������޸�";
		case "902503CDT" :return "��ǿ������޸�";
		case "902503PBK" :return "���������޸�";
		case "908305DEL" :return "����ͨ�ر�";
		case "902405" :return "�����";
		case "902406" :return "�ؿս��";
		case "901120" :return "�ɽ���б��ѯ";
		case "901401" :return "��ǿ�����";
		case "909020" : return "�Թ����";
		case "909015" : return "�Թ����ȷ��";
		case "909019" : return "�Թ����ǰ��ѯ";
		case "901102" : return "���¾����˰";
		case "907208" :return "����ǩԼ����";
		default : return "����"
	}
  } 
	  /*����ת�˻�·����ת��*/
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
		case "CNY" : return "�����";
		case "USD" : return "��Ԫ";
		case "EUR" : return "ŷԪ";
		case "CAD" : return "��Ԫ";
		case "HKD" : return "��Ԫ";
		case "GBP" : return "Ӣ��";
		default : return transtype
	} 
  }
  
  this.converNumberToCurrency = function(transType){
	  switch(transType) {
		case "156" : return "�����";
		case "840" : return "��Ԫ";
		case "978" : return "ŷԪ";
		case "124" : return "��Ԫ";
		case "344" : return "��Ԫ";
		case "826" : return "Ӣ��";
		case "36" : return "��Ԫ";
		case "392" : return "��Ԫ";
		default : return transtype
	}
  }
  
  this.converSubAcctType = function(acctType){
		switch(acctType) {	
			case "CNY0" : return "������˻�";
			case "USD1" : return "��Ԫ����";
			case "USD2" : return "��Ԫ�㻧";
			case "EUR1" : return "ŷԪ����";
			case "EUR2" : return "ŷԪ�㻧";
			case "HKD1" : return "�۱ҳ���";
			case "HKD2" : return "�۱һ㻧";
			case "JPY1" : return "��Ԫ����";
			case "JPY2" : return "��Ԫ�㻧";
			case "AUD1" : return "�Ĵ�����Ԫ����";
			case "AUD2" : return "�Ĵ�����Ԫ�㻧";
			case "GBP1" : return "Ӣ������";
			case "GBP2" : return "Ӣ���㻧";
			case "SGD1" : return "�¼���Ԫ����";
			case "SGD2" : return "�¼���Ԫ�㻧";
			case "CAD1" : return "���ô�Ԫ����";
			case "CAD2" : return "���ô�Ԫ�㻧";
			default : return acctType
		}
  }
  
	/*���ÿ����ؿ�״̬ת��*/
  this.convertCreditCardState = function(state) 
  {
	switch(state) {
		case "A" : return "��Ƭδ����";
		case "B" : return "����ֹ����Ƭ";
		case "C" : return "�����йر��˻�";
		case "CC" : return "�����";
		case "D" : return "�����˻�";
		case "E" : return "����ͣ������Ա����Ƭ";
		case "F" : return "��թ";
		case "G" : return "��Ȩ���";
		case "H" : return "�������տ���ֹ��";
		case "I" : return "��������";
		case "K" : return "���񿨶�ʧ";
		case "L" : return "��Ƭ��ʧ";
		case "M" : return "�ʼ��˻�";
		case "N" : return "δ�յ���Ƭ";
		case "O" : return "�����ڶ�ͣ��";
		case "P" : return "�񵽵Ŀ�Ƭ��ʧ";
		case "PQ" : return "�ڲ�����ר��";
		case "Q" : return "�ֿ�������ر�";
		case "S" : return "����";
		case "T" : return "����";
		case "U" : return "˯�߿��ر�";
		case "V" : return "�¿�����ɿ�ʧЧ";
		case "X" : return "��������";
		case "Y" : return "�𻵽���";
		case "Z" : return "�ֿ�������";
		case "W" : return "�������ڵ��¶���";
		case "WQ" : return "�������ڵ��¶���";
		default : return "����"
	}
  }
}