/*ƾ����ӡ��*/
function ReceiptPrinter()
{
	   var printFlag_mx =false;
	   /*ƾ����ӡ����ģ���¼���Ӧ����*/
	   this.RptEvents = new top.EventHandling(top.YHAXReceiptPrint);
	   /*���з�*/
	   this.strNewLine = "\r\n";
	   /*ƾ��ͷ����*/
	   this.strContainHead= "         �Ϻ�ũ�����пͻ�֪ͨ�� "+this.strNewLine+this.strNewLine;
	   /*ƾ������*/
	   this.strContain = "";
	   /*ƾ��β����*/
	   this.strContainFoot= " 24Сʱ�ͷ�����:021-962999 4006962999"+this.strNewLine+" �Ϻ�ũ��������վ:WWW.SRCB.COM"; 
	   /*��ʱ�ļ�*/
	   this.strFile = "C:\\Cols\\Journal\\ReceiptPrinter.txt";
	   var fileObj = new ActiveXObject("Scripting.FileSystemObject");   
	   
	   //�ͻ�ȡƾ���ĳ�ʱ����
	   this.BeTakenTimeOut = 120;      
	   /*���ý������ӡ*/
	   this.set=function(str){
		   if(printFlag_mx)
		    {	
		       this.strContain = "";
		    }
	   		this.strContain+=str+this.strNewLine;
	   }
	   
	   /*ƾ��ģ��*/
       this.printTemplate = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).formatStrRight(" ",19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+TransCode+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + this.strNewLine;
	      //ƾ��β������
	      this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*ƾ��ģ��*/
       this.printTemplate2 = function()
	   {
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).formatStrRight(" ",20);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  panNum = new top.StringCtrl(panNum).suffixStr(' ',19);
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+TransCode+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ���� "
						   + this.strNewLine
			               + " *" + IDName.substring(1)
						   + this.strNewLine
			         		+ this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*ƾ��ģ��*/
       this.printTemplate4 = function()
	   {
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������               ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("transName")+"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine						  
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ���׽��       "
			               + this.strNewLine
			               + " " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*�к�ƾ��ģ��*/
       this.printTemplate5 = function()
	   {
		   //�浥�˺�
		  var panNum = top.pool.get("strCdsAccount");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //�����
		  var IDName = "";
		  //������
		  var AgentIDName = "";
		  var AgentIDCardNum = "";
		  var type = "";
		  if(top.pool.get("isAgent") == "1"){
			  IDName = new top.StringCtrl(top.pool.get("strAgentIDName")).suffixStr('',8);
			  AgentIDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr('',8);
			  AgentIDName = "*"+AgentIDName.substring(1);
			  type ="���֤";
			  AgentIDCardNum = top.pool.get("strIDCardNum");
			  AgentIDCardNum = AgentIDCardNum.substr(0, AgentIDCardNum.length-5) + "****" + AgentIDCardNum.charAt(AgentIDCardNum.length-1);	
		  }else{
			  IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr('',8);			  
		  }
		  var strAmount = new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"));
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  		  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("strTransName")+"    "+"       "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + " ��������           "
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum 
						   + this.strNewLine
						   + " �����˺�                 ����"
						   + this.strNewLine
	                       + " "+ panNum + "       " +  " *" + IDName.substring(1)
	                       + this.strNewLine
						   + this.strNewLine
						   + " ����������"
						   + this.strNewLine
	                       + " "+AgentIDName
						   + this.strNewLine
	                       + this.strNewLine
						   + " ֤������"
						   + this.strNewLine
	                       + " "+ type
	                       + this.strNewLine
						   + this.strNewLine
						   + " ������֤����"
						   + this.strNewLine
	                       + " "+AgentIDCardNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ���׽��              �ŶӺ�"
			               + this.strNewLine
			               + " "+new top.StringCtrl(strAmount).suffixStr(' ',22) + top.pool.get("strQueueNo")
			               + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   	/*�浥����ƾ��ģ��*/
       this.printTemplate6 = function()
	   { 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������             ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("strTransName")+"             "+top.pool.get("strOrigstrTxSerialNo")+"  "
	                       + this.strNewLine
						   + " ��������          "
						   + this.strNewLine
	                       + "  "+top.terminal.strOrgNum + "              " 
						   + this.strNewLine
						   + this.strNewLine
						   + " �浥����     �浥����   ֧ȡ��ʽ"
						   + this.strNewLine
						   + " ������ȡ"+"     "+new top.StringCtrl(top.pool.get("CDtime")).suffixStr(' ',8)+top.pool.get("draw")
						   + this.strNewLine
						   + this.strNewLine
			               + " �������       "
			               + this.strNewLine
			               + " " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
			               + this.strNewLine
						   + this.strNewLine
						   + " ����"
			               + this.strNewLine
						   + " *" + top.pool.get("strAuthName").substring(1)
			               + this.strNewLine;
						   + this.strNewLine;
						   + this.strNewLine
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*ƾ��ģ��*/
       this.printTemplate7 = function()
	   {
		  var TransCode = new top.StringCtrl(top.pool.get("TransCode")).suffixStr(' ',10);
		  var panName = new top.StringCtrl(top.pool.get("strName")).suffixStr(' ',8);
		  var DestName = new top.StringCtrl(top.pool.get("strDestName")).suffixStr(' ',8);
		  var TransAmount = new top.StringCtrl(top.pool.get("Amount")).suffixStr(' ',12);
		  
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  var DestpanNum = new top.StringCtrl(top.pool.get("DestPan")).suffixStr(' ',19);
          if (DestpanNum != null && DestpanNum != "" && DestpanNum.length > 5){
              DestpanNum = DestpanNum.substr(0, DestpanNum.length-5) + "****" + DestpanNum.charAt(DestpanNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +"     "+top.pool.get("TransNum")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ת���˺�            ת���˺�"
						   + this.strNewLine
	                       + " "+ panNum + " " + DestpanNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " ת������            ת�뻧��"
						   + this.strNewLine
	                       + " "+top.pool.get("strName") + "                " + top.pool.get("strDestName")
	                       + this.strNewLine
						   + this.strNewLine
			               + " ���׽��       "
			               + this.strNewLine
			               + " "+ TransAmount
			               + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   	   /*ƾ��ģ��*/
       this.printTemplate8 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  panNum = new top.StringCtrl(panNum).suffixStr(' ',19);
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("strTransCode")+" "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ����"
						   + this.strNewLine
			               + " *" + IDName.substring(1)
						   + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*����ƾ��ģ��*/
       this.printTemplate9 = function()
	   {
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',8);
		  //������ĳ�������
		  for (var i=TransCode.length*2; i<17; i++)
				TransCode = TransCode + " ";
            var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr('',19);
  
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 

		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������		
          if(top.pool.get("strTransCode") !=null && top.pool.get("strTransCode") == "908207"){//���������޸�
			     this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +"    "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ǩԼ�ֻ���        ��ϵ�绰"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone") +"       "+top.pool.get("strTel")
						   + this.strNewLine
			               + this.strNewLine;  
		  }	
          else{		  
		         this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ǩԼ�ֻ���"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone")
						   + this.strNewLine
			               + this.strNewLine;
		   }
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   	   /*����ƾ��ģ��*/
       this.printTemplate10 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strName")).suffixStr('',8);
		  //ǩԼ����
		 //  var panNum = new top.StringCtrl(top.pool.get("cardPassbookNo")).suffixStr('',19);
      	    var panNum = new top.StringCtrl(top.pool.get("firstCardNo")).suffixStr('',19);
    
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 		  
		  //��������
		  var panNum2 = new top.StringCtrl(top.pool.get("secondStrPan")).suffixStr('',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.trans.convertTransType(top.pool.get("strTransCode"))+"    "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ��������"
						   + this.strNewLine
			               + " "+ panNum2 
						   + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*����ƾ��ģ��*/
       this.printTemplate11 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strName")).suffixStr('',8);
		  //ǩԼ����
		 // var panNum = new top.StringCtrl(top.pool.get("cardPassbookNo")).suffixStr('',19);
          var panNum = new top.StringCtrl(top.pool.get("firstCardNo")).suffixStr('',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
			//ɾ������
		  var panNum2 = new top.StringCtrl(top.pool.get("secondCardNo")).suffixStr('',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                      // + " "+top.trans.convertTransType(top.pool.get("strTransCode"))+"           "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + " "+"��������ɾ���˻� "+"  "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ɾ������"
						   + this.strNewLine
			               + "  " + panNum2 
						   + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }

	   /*ƾ��ģ��*/
       this.printTemplate12 = function()
	   {
		  var strName = new top.StringCtrl(top.pool.get("strName")).suffixStr(' ',8);
		  var TransAmount = new top.StringCtrl(top.pool.get("Amount")).suffixStr(' ',12);
		  var productType = top.cardreader.convertTransType(top.pool.get("productSubType"));

		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("TransCode")+"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ����                ����"
						   + this.strNewLine
	                       + " "+ panNum + " " + strName
	                       + this.strNewLine
						   + this.strNewLine
						   + " ���               ����"
						   + this.strNewLine
	                       + " "+TransAmount + "        " + productType
	                       + this.strNewLine
						   + this.strNewLine
			               + " ����               ������"
			               + this.strNewLine
			               + " "+ top.pool.get("intRate").substring(1)+"%" + "            " + top.pool.get("endDate")
			               + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   	   /*ƾ��ģ��-��ǿ���������*/
       this.printTemplate13 = function()
	   {
			var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr('',19);
		  
			var printFlag = top.pool.get("printFlag");
			if("Passbook" == printFlag || "CDS" == printFlag){
				panNum = new top.StringCtrl(top.pool.get("DestPan")).suffixStr('',19);
			}
			if (panNum != null && panNum != "" && panNum.length > 5){
				panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
			}
			top.pool.set("printFlag","");
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine 
	                       + " "+new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',13)+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           " + top.pool.get("ChPWDType") + "��"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum;
						   
			//���֤����
			var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr('',8);
			//���֤��
			//var IDNo   = new top.StringCtrl(top.pool.get("strIDCardNum")).suffixStr('',18);
			if(IDName != null && IDName.length > 0){
				//������ĳ�������
				for (var i=IDName.length*2; i<20; i++){
					IDName = IDName + " ";
				}
				//IDNo = IDNo.substr(0,8) + "********" + IDNo.substr(16);
				this.strContain	+= this.strNewLine
							   + this.strNewLine
							   + " ����     " 
							   + this.strNewLine
							   + " *" + IDName.substring(1);
							      
			}
			
	       //ƾ��β������
	       this.strContain 	+= this.strNewLine
							+ this.strNewLine
							+" "+top.exchxmlasync.strTermRetDesc
							+ this.strNewLine
							+ this.strContainFoot;
	   }
		
	   /*����ƾ��ע��*/
       this.printTemplate14 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8); 		  
		  //��������
		  var panNum2 = new top.StringCtrl(top.pool.get("strPan")).suffixStr('',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.trans.convertTransType(top.pool.get("strTransCode"))+"       "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           "
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum 
						   + this.strNewLine
			               + this.strNewLine
						   + " ���� "
						   + this.strNewLine
			               + " *" + IDName.substring(1)
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*�ֻ���������ģ��*/
       this.printTemplate15 = function()
	   {
		  //ǩԼ����
      	  var panNum = new top.StringCtrl(top.pool.get("strfirstPan")).suffixStr(' ',19);
    
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 		  
		  //��������
		  var panNum2 = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.trans.convertTransType(top.pool.get("strTransCode"))+"    "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           ǩԼ����"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ��������"
						   + this.strNewLine
			               + " "+panNum2 
						   + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	  /*�ֻ�����ɾ��ƾ��ģ��*/
       this.printTemplate16 = function()
	   {
		  //ǩԼ����
          var panNum = new top.StringCtrl(top.pool.get("strSignPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ɾ������
		  var panNum2 = new top.StringCtrl(top.pool.get("strDelePan")).suffixStr(' ',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ top.pool.get("strTransCode") +"   "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           ǩԼ����"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ɾ������"
						   + this.strNewLine
			               + " "+panNum2 
						   + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
		
	   /*��ӡ�̿�ģ��ƾ�����˸��ͻ�*/
       this.printCapturedTemplate = function()
	   {
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           " 
		                   + this.strNewLine
	                       + " �̿�"
	                       + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + this.strNewLine;
	      //ƾ��β������
	      this.strContain +=" �̿�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*����-����ת��ƾ��ģ��*/
       this.printTemplate17 = function()
	   {
		    var panNum = top.pool.get("strPan");
		    var panNum19 = "";
		    var destPanNum19 ="";
			if (panNum.length > 5){
			   //panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
			   panNum19 = new top.StringCtrl(panNum).suffixStr(' ',19);
			}
			var destPanNum=top.pool.get("DestPan");
			if (destPanNum.length > 5){
			   //destPanNum = destPanNum.substr(0, destPanNum.length-5) + "****" + destPanNum.charAt(destPanNum.length-1);
			   destPanNum19 = new top.StringCtrl(destPanNum).suffixStr(' ',19);
			}
			var PayerCustName = top.pool.get("PayerCustName");
			var StrPanNameToSign = top.pool.get("PayeeAcctName");
			if(top.pool.get("MedFlag") == "isPassbook"){
				top.pool.set("MedFlag","");
				//ת������
				PayerCustName = top.pool.get("strRespIDName");
				StrPanNameToSign = top.pool.get("PayeeAcctName");
				panNum19 = top.pool.get("hostAccount");
			}
			if(PayerCustName.length > 0){
				PayerCustName = "*" + PayerCustName.substring(1);	
			}
			if(StrPanNameToSign.length > 0){
				StrPanNameToSign = "*" + StrPanNameToSign.substring(1);
			}
			if(StrPanNameToSign.length > 20){
				StrPanNameToSign = StrPanNameToSign.substring(0,20) + this.strNewLine + " " + StrPanNameToSign.substring(20,30);
			}
			var TransAmount = new top.StringCtrl(top.pool.get("TransAmount")).suffixStr(' ',12);
			var strFeeYuan = "";
			
			if(top.pool.get("radioValue") != "" && top.pool.get("radioValue") != null && top.pool.get("radioValue") == "Z0"){
			    top.pool.set("TransType","��ͨ");
			}
			if(top.pool.get("radioValue") != "" && top.pool.get("radioValue") != null && top.pool.get("radioValue") == "Z1"){
				top.pool.set("TransType","ʵʱ");
			}
			var IsFee = "";
			if(top.pool.get("strTransCode") == "903201"){
				IsFee = "������"
				strFeeYuan = top.pool.get("strFeeYuan");
			}else{
				IsFee = "";
				strFeeYuan = "";
			}
			var TransType = top.pool.get("TransType");
			
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
						 
		  //ƾ����������			  
		  this.strContain += " �������              ������ˮ" 
		                   + this.strNewLine
	                       + " "+new top.StringCtrl(top.pool.get("strTfrName")).suffixStr(' ',15)+"   "+top.pool.get("TransCodeWater")+"  "
	                       + this.strNewLine
						   + " ת���˺�"
						   + this.strNewLine
	                       + " "+ destPanNum19
						   + this.strNewLine
						   + " ת�뻧��"
						   + this.strNewLine
						   + " "+ StrPanNameToSign
						   + this.strNewLine
						   + " ת���˺�"
						   + this.strNewLine
	                       + " "+ panNum19
						   + this.strNewLine
						   + " ת������"
						   + this.strNewLine
	                       + " "+ PayerCustName
						   + this.strNewLine
						   + " ���׽��     "+IsFee + "    ת�˷�ʽ"
						   + this.strNewLine
	                       + " "+ TransAmount + " " + strFeeYuan + "      "+ TransType
						   + this.strNewLine
						   + " ��; "
						   + this.strNewLine
	                       + " "+ top.pool.get("transUseSelect")
	                       + this.strNewLine
						   + this.strNewLine;
						   
	      //ƾ��β������
	      this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
						  
	   }
	   
	   /*����ƾ��ģ��-����ͨά��*/
       this.printTemplate18 = function()
	   {
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',8);
		  //������ĳ�������
		  for (var i=TransCode.length*2; i<17; i++)
				TransCode = TransCode + " ";
		 // var IDName = new top.StringCtrl(top.pool.get("strName")).suffixStr('',8);
		  //ǩԼ����
		 // var panNum = new top.StringCtrl(top.pool.get("cardPassbookNo")).suffixStr('',19);
            var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr('',19);
  
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 

		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ǩԼ�ֻ���"+"          "+"�����"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone")+"         " + top.pool.get("openLimitAmount")
						   + this.strNewLine
						   + this.strNewLine
						   + " �Ƿ���ʾ���"
						   + this.strNewLine
						   + " " + (top.pool.get("isShowBalance")=="1"?"��":"��")
						   + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*���ƾ��*/
       this.printTemplate19 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',15)+""+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   +" ����               �ɽ�����"
						   +this.strNewLine
						   +" *"+IDName.substring(1)+"          "+top.pool.get("takeDownExchRate")
						   +this.strNewLine
						   + " �������           ������"
						   + this.strNewLine
	                       + " "+top.pool.get("strCurrency") +"  " + "               " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
	                       
						   + this.strNewLine
						   + " ��������           �������"
						   + this.strNewLine
	                       + " CNY  "+ "               " + top.pool.get("transAmt")
	                       
						   + this.strNewLine
						   ;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*���ƾ��*/
       this.printTemplate20 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',15)+""+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   +" ����               �ɽ�����"
						   +this.strNewLine
						   +" *"+IDName.substring(1)+"          "+top.pool.get("takeDownExchRate")
						   +this.strNewLine
						   + " �������           ������"
						   + this.strNewLine
	                       + " CNY  " + "               " + top.pool.get("exchangeSettleAmt")
	                    
						   + this.strNewLine
						   + " ��������           �������"
						   + this.strNewLine
	                       + " "+top.pool.get("strCurrency") +"  "+ "               " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
	                       
						   + this.strNewLine
						   ;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*�������ƾ��*/
       this.printTemplate21 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',15)+""+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   +" ����               �ɽ�����"
						   +this.strNewLine
						   +" *"+IDName.substring(1)+"          "+top.pool.get("exchRate")
						   +this.strNewLine
						   + " �������           ������"
						   + this.strNewLine
	                       + " "+top.pool.get("BuyCurr") +"  "+ "               " + top.pool.get("buyAmt")
	                       
						   + this.strNewLine
						   + " ��������           �������"
						   + this.strNewLine
	                       + " "+top.pool.get("SellCurr") +"  "+ "               " + top.pool.get("sellAmt")
	                       
						   + this.strNewLine
						   ;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*ATMת��ģ��*/
       this.printTemplate22 = function()
	   {
    	  var TransCode = new top.StringCtrl("ATMת��").suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +"  "+top.pool.get("JJKQYTsn")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " ÿ���ۼ�ת���޶�"
						   + this.strNewLine
	                       + " 50000.00"
	                       + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("JJKQYRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*�ƶ��ն�ATMת��ģ��*/
       this.printTemplate22MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  �Ϻ�ũ�����пͻ�֪ͨ�� "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24Сʱ�ͷ�����:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"�Ϻ�ũ��������վ:"+this.strNewLine+" WWW.SRCB.COM"; 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " �����ն˺�"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����       ��������" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ������ˮ"
						   + this.strNewLine
	                       + " "+top.pool.get("JJKQYTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " �����˺�"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " ÿ���ۼ�ת���޶�"
						   + this.strNewLine
	                       + " 50000.00"
	                       + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("JJKQYRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*С������ģ��*/
       this.printTemplate23 = function()
	   {
    	  var TransCode = new top.StringCtrl("С������֧��").suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����             ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.pool.get("XEMMTsn")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������             �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "                " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " ���������޶�         �����ۼ��޶�"
						   + this.strNewLine
	                       + " 300.00" +"               "+"1000.00"+"  "
	                       + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("XEMMRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*�ƶ��ն�С������ģ��*/
       this.printTemplate23MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  �Ϻ�ũ�����пͻ�֪ͨ�� "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24Сʱ�ͷ�����:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"�Ϻ�ũ��������վ:"+this.strNewLine+" WWW.SRCB.COM"; 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " �����ն˺�"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����          ��������" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ������ˮ"
						   + this.strNewLine
	                       + " "+top.pool.get("XEMMTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " �����˺�"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " ���������޶�"
						   + this.strNewLine
	                       + " 300.00" + "  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " �����ۼ��޶�"
						   + this.strNewLine
	                       + " 1000.00"+"  "
	                       + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("XEMMRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
       /*���������֧��ģ��*/
       this.printTemplate24 = function()
	   {
    	  var TransCode = new top.StringCtrl("���������֧��").suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����               ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +" "+top.pool.get("DSFKJTsn")+"  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " �ֻ���" 
		                   + this.strNewLine
	                       + " "+ top.pool.get("strPhone")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("DSFKJRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*�ƶ��ն˵��������֧��ģ��*/
       this.printTemplate24MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',11);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  this.strContainHead= "  �Ϻ�ũ�����пͻ�֪ͨ�� "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24Сʱ�ͷ�����:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"�Ϻ�ũ��������վ:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " �����ն˺�"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����          ��������" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ������ˮ"
						   + this.strNewLine
	                       + " "+top.pool.get("DSFKJTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " �����˺�"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " �ֻ���" 
		                   + this.strNewLine
	                       + " "+ top.pool.get("strPhone")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("DSFKJRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*����֪ͨģ��*/
       this.printTemplate25 = function()
	   {
    	  var TransCode = new top.StringCtrl("����ͨ").suffixStr(' ',15);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.pool.get("DXTZTsn") + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " �ֻ���             �Ƿ���ʾ���"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone") + "        ��"
						   + this.strNewLine
						   + this.strNewLine
						   + " �����"
						   + this.strNewLine
			               + " 0.00"
						   + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("DXTZRet") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*�ƶ��ն˶���֪ͨģ��*/
       this.printTemplate25MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',14);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  �Ϻ�ũ�����пͻ�֪ͨ�� "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24Сʱ�ͷ�����:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"�Ϻ�ũ��������վ:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " �����ն˺�"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����         ��������"
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ������ˮ"
						   + this.strNewLine
	                       + " "+top.pool.get("DXTZTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " �����˺�"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " �ֻ���         �Ƿ���ʾ���"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone") + "    ��"
						   + this.strNewLine
						   + this.strNewLine
						   + " �����"
						   + this.strNewLine
			               + " 0.00"
						   + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("DXTZRet") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*�ֻ�����ģ��*/
       this.printTemplate26 = function()
	   {
    	  var TransCode = new top.StringCtrl("�ֻ�����").suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����              ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +"   "+top.pool.get("SJYHTsn")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " �ֻ���"
						   + this.strNewLine
	                       + " "+top.pool.get("strPhone")
	                       + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("SJYHRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*�ƶ��ն��ֻ�����ģ��*/
       this.printTemplate26MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',14);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  �Ϻ�ũ�����пͻ�֪ͨ�� "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24Сʱ�ͷ�����:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"�Ϻ�ũ��������վ:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " �����ն˺�"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����          ��������" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ������ˮ"
						   + this.strNewLine
	                       + " "+top.pool.get("SJYHTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " �����˺�"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " �ֻ���"
						   + this.strNewLine
	                       + " "+top.pool.get("strPhone")
	                       + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("SJYHRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
       /*��������ģ��*/
       this.printTemplate27 = function()
	   {
    	  var TransCode = new top.StringCtrl("��������").suffixStr(' ',15);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  
		  if(top.pool.get("LocalUkeyNum") != "" && top.pool.get("LocalUkeyNum") != null) {
			//ƾ����������			  
			  this.strContain += " ǩԼ����              ������ˮ" 
			                   + this.strNewLine
		                       + " "+ TransCode +"   "+top.pool.get("WYZSBTsn")+"  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " ��������           �����˺�"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "              " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				         	   + " �ֻ���              �汾"
							   + this.strNewLine
				               + " " + top.pool.get("strPhone") + "         " + top.pool.get("strVersion")
							   + this.strNewLine
							   + this.strNewLine
				         	   + " ������"
							   + this.strNewLine
				               + " " + top.pool.get("strUkeyPrice") + "Ԫ"
							   + this.strNewLine
							   + this.strNewLine;
		  }else {
			//ƾ����������			  
			  this.strContain += " ǩԼ����              ������ˮ" 
			                   + this.strNewLine
		                       + " "+ TransCode +"   "+top.pool.get("WYZSBTsn")+"  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " ��������           �����˺�"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "              " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				         	   + " �ֻ���              �汾"
							   + this.strNewLine
				               + " " + top.pool.get("strPhone") + "         " + top.pool.get("strVersion")
							   + this.strNewLine
							   + this.strNewLine;
		  }
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("WYZSBRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*�ƶ��ն˸�������ģ��*/
       this.printTemplate27MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',13);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  �Ϻ�ũ�����пͻ�֪ͨ�� "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24Сʱ�ͷ�����:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"�Ϻ�ũ��������վ:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " �����ն˺�"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
		  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����          ��������" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ������ˮ"
						   + this.strNewLine
	                       + " "+top.pool.get("WYZSBTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " �����˺�"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
				           + " �ֻ���         �汾"
						   + this.strNewLine
				           + " " + top.pool.get("strPhone") + "    " + top.pool.get("strVersion")
						   + this.strNewLine
						   + this.strNewLine;
		  
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("WYZSBRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
       /*����ģ��*/
       this.printTemplate28 = function()
	   {
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+TransCode+"  "+top.pool.get("strOpenCardTsn")+"  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ����Ʒ             ������"
			               + this.strNewLine
			               + " " + top.pool.get("cardName") + "             " + top.pool.get("strCardPrice") + "Ԫ"
			               + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.pool.get("strOpenCardDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*������ģ��*/
       this.printTemplate29 = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " "+new top.StringCtrl("�������").suffixStr(' ',8)+"       ������ˮ" 
		                   + this.strNewLine
	                       + " "+TransCode+"    "+top.pool.get("strCardActiveTsn")+"  "
	                       + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + this.strNewLine;
	      //ƾ��β������
	      this.strContain += " "+top.pool.get("strCardActiveDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
/*�ƶ��ն˿�����ģ��*/
       this.printTemplate29MV = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  this.strContainHead= "  �Ϻ�ũ�����пͻ�֪ͨ�� "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24Сʱ�ͷ�����:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"�Ϻ�ũ��������վ:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " �����ն˺�"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����          ��������" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ������ˮ"
						   + this.strNewLine
	                       + " "+top.pool.get("strCardActiveTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " �����˺�"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
	      //ƾ��β������
	      this.strContain += " "+top.pool.get("strCardActiveDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
	/*��ӡ�̴浥ģ��ƾ�����˸��ͻ�*/
       this.printTemplate30 = function()
	   {
		  var IDName =  new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = top.pool.get("strCDSNum");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           " 
		                   + this.strNewLine
	                       + " �̴浥"
	                       + this.strNewLine
						   + " ��������           �浥�˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   +" ����"
						   +this.strNewLine
						   +" *"+IDName.substring(1)
						   + this.strNewLine
						   + this.strNewLine;
	      //ƾ��β������
	      this.strContain +=" �̴浥"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*��ӡ�浥����ģ��ƾ�����˸��ͻ�*/
       this.printTemplate31 = function()
	   {
		  var panNum = top.pool.get("strCDSNum");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  var IDName = "";
		   if(top.pool.get("isAgent") == "1"){		   
			   IDName = new top.StringCtrl(top.pool.get("strAgentIDName")).suffixStr(' ',8);
		   }else{
			   IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		   }
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("transName")+"           "+top.pool.get("strOrigstrTxSerialNo")
	                       + this.strNewLine
						   + " ��������    "
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum
	                       + this.strNewLine
						   +" �浥�˺�                 ����"
						   +this.strNewLine
						   +" "+new top.StringCtrl(panNum).suffixStr(' ',25) +" *" + IDName.substring(1)
						   + this.strNewLine
						   +" �浥ƾ֤��"
						   +this.strNewLine
						   +" "+top.pool.get("strCDCertNum")
						   + this.strNewLine
						   + this.strNewLine;
	      //ƾ��β������
	      this.strContain +=" "+top.pool.get("strErroInfo")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	 /*�����к�ƾ��ģ��*/
       this.printTemplate32 = function()
	   {
		  //������
		  var AgentIDName = "";
		  var AgentIDCardNum = "";
		  var type = "���֤";
		  AgentIDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr('',8);
		  AgentIDName = "*"+AgentIDName.substring(1);
		  AgentIDCardNum = top.pool.get("strIDCardNum");
		  AgentIDCardNum = AgentIDCardNum.substr(0, AgentIDCardNum.length-5) + "****" + AgentIDCardNum.charAt(AgentIDCardNum.length-1);	
		  
		  var strAmount =  new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"));
		  strAmount = new top.StringCtrl(strAmount).suffixStr(' ',22);	  
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  		  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("strTransName")+"    "+"       "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + " ��������           "
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum 
	                       + this.strNewLine
						   + this.strNewLine
						   + " ����"
						   + this.strNewLine
	                       + " "+AgentIDName
						   + this.strNewLine
	                       + this.strNewLine
						   + " ֤������"
						   + this.strNewLine
	                       + " "+ type
	                       + this.strNewLine
						   + this.strNewLine
						   + " ֤����"
						   + this.strNewLine
	                       + " "+AgentIDCardNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ���׽��              �ŶӺ�"
			               + this.strNewLine
			               + " "+ strAmount + top.pool.get("strQueueNo")
			               + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }  
	   /*ƾ��ģ��*/
       this.printTemplate33 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������               ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("transName")+"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   +" ����"
						   +this.strNewLine
						   +" *"+IDName.substring(1)
						   + this.strNewLine
			               + " ���׽��       "
			               + this.strNewLine
			               + " " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*ƾ��ģ��*/
       this.printTemplate34 = function()
	   {
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).formatStrRight(" ",21);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  
		  var panNum = top.pool.get("strPan");
		  if(panNum == null || panNum.length < 1){
			  panNum = top.pool.get("strPassBookNum");
		  }
          if (panNum != null && panNum != "" && panNum.length > 5){
			  panNum = new top.StringCtrl(panNum).suffixStr(' ',19);
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������             ������ˮ" 
		                   + this.strNewLine
	                       + " "+TransCode+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������             �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "                " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " " + new top.StringCtrl("���۹�˾").formatStrRight(" ",21) +"���� "
						   + this.strNewLine
			               + " " + new top.StringCtrl(top.pool.get("strCompanCNName")).formatStrRight(" ",21) + "*" + IDName.substring(1)
						   + this.strNewLine
			         		+ this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*��ֵƾ��ģ��*/
       this.printTemplate35 = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.pool.get("transName")).formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������            ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������            �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ���׽��       "
			               + this.strNewLine
			               + " " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " ���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*���ƾ��ģ��*/
       this.printTemplate36 = function()
	   {		  
		  var panNum = top.pool.get("strTransAcc");
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  
		  var TransCode = new top.StringCtrl(top.pool.get("transName")).formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������            ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������            �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ����       "
			               + this.strNewLine
			               + " " +" *"+IDName.substring(1)
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " " +top.pool.get("strUnlockDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*����ʧƾ��ģ��*/
       this.printTemplate37 = function()
	   {		  
		  var panNum = top.pool.get("strLossPan");
		  var IDName = top.pool.get("strIDName");
		  for (var i=IDName.length*2; i<20; i++){
			IDName = IDName + " ";
		  }
		  
		  var TransCode = new top.StringCtrl("��ǿ���ʧ").formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������            ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������            ��ʧ����"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ����                ������"
			               + this.strNewLine
			               + "  *" + IDName.substring(1)+ top.pool.get("strAmtFee") + "Ԫ"
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " ���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*���ƿ���ʧ����ƾ��ģ��*/
       this.printTemplate38 = function()
	   {		  
		  var panNum = top.pool.get("strLossPan");
		  var IDName = top.pool.get("strIDName");
		  for (var i=IDName.length*2; i<20; i++){
			IDName = IDName + " ";
		  }
		  var cardType = "";
		  var cardPrice;
		  if(top.pool.get("productType") == "�Ϻ������Ա���񿨣�IC��") {
			  cardType ="���Ῠ";
			  cardPrice = new top.StringCtrl(top.pool.get("strCardPrice") + "Ԫ").suffixStr(' ',8);
		  }else if(top.pool.get("productType").indexOf("���Ͽ�") != -1){
			  cardType ="���Ͽ�";
			  cardPrice =new top.StringCtrl("0Ԫ").suffixStr(' ',8);
		  }
		  var TransCode = new top.StringCtrl("��ǿ���ʧ����").formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  
		  if(top.pool.get("strFillDesc") == "�����ɹ�") {
			  //ƾ����������			  
			  this.strContain += " �������            ������ˮ" 
			                   + this.strNewLine
		                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " ��������            ��ʧ����"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "               " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				               + " ����                ������"
				               + this.strNewLine
				               + "  *" + IDName.substring(1) + top.pool.get("strAmtFee") + "Ԫ"
				               + this.strNewLine
				               + this.strNewLine
				               + " ������              �쿨����"
				               + this.strNewLine
				               + " " + cardPrice + "           " + top.pool.get("strCardBranchName")
				               + this.strNewLine
				               + this.strNewLine
				               + " ���ƿ�����"
				               + this.strNewLine
				               + " "+ cardType
				               + this.strNewLine
				               + this.strNewLine
				               + this.strNewLine;
		  }else {
			  //ƾ����������			  
			  this.strContain += " �������            ������ˮ" 
			                   + this.strNewLine
		                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " ��������            ��ʧ����"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "               " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				               + " ����                ������"
				               + this.strNewLine
				               + "  *" + IDName.substring(1) + top.pool.get("strAmtFee") + "Ԫ"
				               + this.strNewLine
				               + this.strNewLine
				               + this.strNewLine;
		  }
		  
	       //ƾ��β������
	       this.strContain += " " +top.pool.get("strCardLossDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }	
       /*Ԥ�ƿ���ʧ����ƾ��ģ��*/
       this.printTemplate39 = function()
	   {		  
		  var panNum = top.pool.get("strLossPan");
		  var IDName = top.pool.get("strIDName");
		  var panNumNew = top.pool.get("strPan");
		  for (var i=IDName.length*2; i<20; i++){
			IDName = IDName + " ";
		  }
		  var TransCode = new top.StringCtrl("��ǿ���ʧ����").formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
          if (panNumNew != null && panNumNew != "" && panNumNew.length > 5){
        	  panNumNew = panNumNew.substr(0, panNumNew.length-5) + "****" + panNumNew.charAt(panNumNew.length-1);
	      }
          var cardPrice = new top.StringCtrl(top.pool.get("strCardPrice") + "Ԫ").suffixStr(' ',8);
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		
		  if(top.pool.get("strFillDesc") == "�����ɹ�") {
			  //ƾ����������			  
			  this.strContain += " �������            ������ˮ" 
			                   + this.strNewLine
		                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " ��������            ��ʧ����"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "               " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				               + " ����                ������"
				               + this.strNewLine
				               + "  *" + IDName.substring(1) + top.pool.get("strAmtFee") + "Ԫ"
				               + this.strNewLine
				               + this.strNewLine
				               + " ������              �¿�����"
				               + this.strNewLine
				               + " " + cardPrice + "           " + panNumNew
				               + this.strNewLine
				               + this.strNewLine
				               + " Ԥ�ƿ�����"
				               + this.strNewLine
				               + " " + top.pool.get("cardName")
				               + this.strNewLine
				               + this.strNewLine
				               + this.strNewLine;
		  }else {
			  //ƾ����������			  
			  this.strContain += " �������            ������ˮ" 
			                   + this.strNewLine
		                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " ��������            ��ʧ����"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "               " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				               + " ����                ������"
				               + this.strNewLine
				               + "  *" + IDName.substring(1) + top.pool.get("strAmtFee") + "Ԫ"
				               + this.strNewLine
				               + this.strNewLine
				               + this.strNewLine;
		  }
		  
	       //ƾ��β������
	       this.strContain += " " +top.pool.get("strCardLossDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*�浥�۹�ʧƾ��ģ��*/
       this.printTemplate40 = function()
	   {		  
		  var panNum = top.pool.get("strAcctNo");
		  var IDName = top.pool.get("strIDName");
		  for (var i=IDName.length*2; i<20; i++){
			IDName = IDName + " ";
		  }
		  
		  var TransCode = new top.StringCtrl(top.pool.get("strTransName")).formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������            ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.pool.get("ReportLossSerialNo")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������            �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " ����                ƾ֤��"
			               + this.strNewLine
			               + "  *" + IDName.substring(1) + top.pool.get("strVoucherNo")
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " ���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*ATMת��ģ�� --����ǩԼ*/
       this.printTemplate41 = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����             ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +top.pool.get("JJKQYTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " ÿ���ۼ�ת���޶�"
						   + this.strNewLine
	                       + " "+top.pool.get("strDayLimitAmount")
	                       + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " ���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
      // �ɷ�ƾ��ģ��
       this.printTemplate42 = function()
	   {
		  var transName = new top.StringCtrl(top.pool.get("transName")).formatStrRight(" ",21);
		  var PayAmount = new top.StringCtrl(top.pool.get("strPayAmount")/100).formatNumber(2);
		  
		  var panNum = top.pool.get("strPan");
		  if(panNum == null || panNum.length < 1){
			  panNum = top.pool.get("strPassBookNum");
		  }
          if (panNum != null && panNum != "" && panNum.length > 5){
			  panNum = new top.StringCtrl(panNum).suffixStr(' ',19);
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������		  
		  this.strContain += " �������             ������ˮ" 
		                   + this.strNewLine
	                       + " "+transName+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������             �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "                " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " " + new top.StringCtrl("���۹�˾").formatStrRight(" ",21) +""
						   + this.strNewLine
			               + " " + top.pool.get("strCompany")
						   + this.strNewLine
						   + this.strNewLine
						   + " �û����   "
						   + this.strNewLine
						   + " " + top.pool.get("UserNum")
						   + this.strNewLine
						   + this.strNewLine
						   + " " + "�ɷѽ�� "
			         	   + this.strNewLine
			         	   + " " + PayAmount
			         	   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
	   /*�Զ�����Լ��ƾ��ģ��*/
       this.printTemplate44 = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).formatStrRight(" ",22);
		  if(top.pool.get("servcdSelect") == "C3" && top.pool.get("strTransCode") == "904206"){
			  TransCode = new top.StringCtrl("�Զ����㻹��ȡ��").formatStrRight(" ",22);
		  }
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  var panNumSub = top.pool.get("SuccPan");
		  if (panNumSub != null && panNumSub != "" && panNumSub.length > 5){
              panNumSub = panNumSub.substr(0, panNumSub.length-5) + "****" + panNumSub.charAt(panNumSub.length-1);
			  panNumSub = new top.StringCtrl(panNumSub).formatStrRight(" ",22);
	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������              ������ˮ" 
		                   + this.strNewLine
	                       + " "+TransCode+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + " ��������              ���ÿ���"
						   + this.strNewLine
	                       + " "+new top.StringCtrl(top.terminal.strOrgNum).formatStrRight(" ",22) + panNum
	                       + this.strNewLine
						   + " ���ڿ���              �ͻ���"
						   + this.strNewLine
						   + " "+ panNumSub + "*" + top.pool.get("strRespIDName").substring(1)
						   + this.strNewLine
						   + " ���ʽ"
						   + this.strNewLine
						   + " "+ top.pool.get("ReypayType")
						   + this.strNewLine
						   + this.strNewLine;
	      //ƾ��β������
	      this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*ƾ��ģ��-����ת����*/
       this.printTemplate45 = function()
	   {
		  var strName = new top.StringCtrl(top.pool.get("strName")).suffixStr(' ',8);
		  var TransAmount = new top.StringCtrl(top.pool.get("Amount")).suffixStr(' ',12);
		  var productType = top.pool.get("strDqTime");

		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������              ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("TransCode")+"        "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ����                  ����"
						   + this.strNewLine
	                       + " "+ panNum + "   " + strName
	                       + this.strNewLine
						   + this.strNewLine
						   + " ���                  ����"
						   + this.strNewLine
	                       + " "+TransAmount + "          " + productType
	                       + this.strNewLine
						   + this.strNewLine
			               + " ���� "
			               + this.strNewLine
			               + " "+ top.pool.get("IntRate") + "%"
			               + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*ƾ��ģ��-����ת����*/
       this.printTemplate46 = function()
	   {
		  var strName = new top.StringCtrl(top.pool.get("strName")).suffixStr(' ',8);
		  var TransAmount = new top.StringCtrl(top.pool.get("Amount")).suffixStr(' ',12);
		  var productType = top.pool.get("productSubType");

		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������              ������ˮ" 
		                   + this.strNewLine
	                       + " "+top.pool.get("TransCode")+"        "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ����                  ����"
						   + this.strNewLine
	                       + " "+ panNum + "   " + strName
	                       + this.strNewLine
						   + this.strNewLine
						   + " ���                  ����"
						   + this.strNewLine
	                       + " "+TransAmount + "          " + productType
	                       + this.strNewLine
						   + this.strNewLine
			               + " ���� "
			               + this.strNewLine
			               + " "+ top.pool.get("intRate")
			               + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
       /*���������֧��-�ֻ���ά��ģ��*/
       this.printTemplate47 = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',14);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode+top.pool.get("DSFKJTsn")
	                       + this.strNewLine
	                       + " " +"�ֻ���ά��"
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " �ֻ��� "
						   + this.strNewLine
			               + " "+top.pool.get("strPhone")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+"���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*С�������޶�ģ��*/
       this.printTemplate48 = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
		  var transLimitAmt = new top.StringCtrl(top.pool.get("transLimitAmt")).suffixStr(' ',6);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����             ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.pool.get("XEMMTsn")+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������             �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "                " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " ���������޶�         �����ۼ��޶�"
						   + this.strNewLine
						   + " "+transLimitAmt +"               "+top.pool.get("dayTransLimitAmt")
	                       + this.strNewLine
						   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+"���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
  	    /*��ǿ�����ƾ��ģ��*/
       this.printTemplate49 = function()
	   {		  
		  var panNum = top.pool.get("strExchangePan");
		  var TransCode = new top.StringCtrl("��ǿ�����").formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
          var newpanNum = top.pool.get("strPan")
          if (newpanNum != null && newpanNum != "" && newpanNum.length > 5){
        	  newpanNum = newpanNum.substr(0, newpanNum.length-5) + "****" + newpanNum.charAt(newpanNum.length-1);
	      }
          var cardPrice = new top.StringCtrl(top.pool.get("strCardPrice") + "Ԫ").suffixStr(' ',8);
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  if(top.pool.get("isUnionCard") == "1") {
			  //���ƿ�ƾ����������			  
			  this.strContain +=" �������            ������ˮ" 
				              + this.strNewLine
				              + " "+ TransCode + top.pool.get("exchangeCardSerialNo") 
			                  + this.strNewLine
							  + this.strNewLine
							  + " ��������            �쿨����"
							  + this.strNewLine
		                      + " "+top.terminal.strOrgNum + "               " + top.pool.get("strCardBranchName")
			                  + this.strNewLine
							  + this.strNewLine
					          + " �ɿ�����"
					          + this.strNewLine
					          + " " + panNum
					          + this.strNewLine
					          + this.strNewLine
					          + " ������"
					          + this.strNewLine
					          + " " + cardPrice
					          + this.strNewLine;
			  				  + this.strNewLine; 
		  }else{
			  //Ԥ�ƿ�ƾ����������			  
			  this.strContain +=" �������            ������ˮ" 
				              + this.strNewLine
				              + " "+ TransCode + top.pool.get("exchangeCardSerialNo") 
			                  + this.strNewLine
							  + this.strNewLine
							  + " ��������            �쿨����"
							  + this.strNewLine
		                      + " "+top.terminal.strOrgNum + "               " + top.pool.get("strCardBranchName")
			                  + this.strNewLine
							  + this.strNewLine
					          + " �ɿ�����"
					          + this.strNewLine
					          + " " + panNum
					          + this.strNewLine
					          + this.strNewLine
					          + " �¿�����"
					          + this.strNewLine
					          + " "+ newpanNum
					          + this.strNewLine
					          + this.strNewLine
					          + " ������"
					          + this.strNewLine
					          + " " + cardPrice
					          + this.strNewLine;
			  				  + this.strNewLine;  
			  
		  }
		  
	       //ƾ��β������
	       this.strContain += " " +top.pool.get("strExchangeCardDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*���������֧��-�޶����ģ��*/
       this.printTemplate50 = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
		  var strDayTransLimitAmt = new top.StringCtrl(top.pool.get("strDayTransLimitAmt")).suffixStr(' ',10);
		  var strTransLimitAmt = new top.StringCtrl(top.pool.get("strTransLimitAmt")).suffixStr(' ',10);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ǩԼ����           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ TransCode +top.pool.get("XEGLTsn")
	                       + this.strNewLine
	                       + " "+ "�޶����"
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ��������           �����˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " �����ۼ�֧���޶�       �����ۼ�֧���޶�" 
		                   + this.strNewLine
	                       + " "+ strDayTransLimitAmt +"             "+top.pool.get("strMonthLimith")
	                       + this.strNewLine
						   + this.strNewLine
			               + " ����֧���޶�           ֧������"
						   + this.strNewLine
			               + " "+strTransLimitAmt +"             "+top.pool.get("strPayTypeName")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+"���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       //�籣������
       this.printTemplate51 = function()
	   {
    	   var phoneNumVal = top.pool.get("phoneNumVal");
    	   if (phoneNumVal != null && phoneNumVal != ""){
    		   phoneNumVal = phoneNumVal.substr(0,3) + "****" + phoneNumVal.substr(phoneNumVal.length-4,phoneNumVal.length-1);
 	      } 
    	   var strIDCardNum = top.pool.get("strIDCardNum");
    	   if (strIDCardNum != null && strIDCardNum != ""){
    		   strIDCardNum = strIDCardNum.substr(0,6) + "********" + strIDCardNum.substr(strIDCardNum.length-4,strIDCardNum.length-1);
 	      } 
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " ��������                ������ˮ" 
		                   + this.strNewLine
	                       + " "+ "�籣������" +"              "+ top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
				           + " ����                    �ֻ�����"
				           + this.strNewLine
				           + " *" + top.pool.get("strIDName").substring(1) + "                   " +phoneNumVal
				           + this.strNewLine
				           + " ֤������"
						   + this.strNewLine
				           + " "+strIDCardNum
						   + this.strNewLine
				    	   + " ָ��Ͷ�ݵ�ַ"
						   + this.strNewLine
				           + " "+top.pool.get("sendAddress")
				           + this.strNewLine
				    	   + " ��ѡ������������"
						   + this.strNewLine
				           + " "+top.pool.get("countryMessageText")
		  				   + this.strNewLine
		  				   + this.strNewLine;
					
	       //ƾ��β������
	       this.strContain += " "+"���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
 //�籣������
       this.printTemplate51MV = function()
	   {
    	   var phoneNumVal = top.pool.get("phoneNumVal");
    	   if (phoneNumVal != null && phoneNumVal != ""){
    		   phoneNumVal = phoneNumVal.substr(0,3) + "****" + phoneNumVal.substr(phoneNumVal.length-4,phoneNumVal.length-1);
 	      } 
    	   var strIDCardNum = top.pool.get("strIDCardNum");
    	   if (strIDCardNum != null && strIDCardNum != ""){
    		   strIDCardNum = strIDCardNum.substr(0,6) + "********" + strIDCardNum.substr(strIDCardNum.length-4,strIDCardNum.length-1);
 	      } 
    	  this.strContainHead= "  �Ϻ�ũ�����пͻ�֪ͨ�� "+this.strNewLine+this.strNewLine;
 		  this.strContainFoot= " 24Сʱ�ͷ�����:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+" �Ϻ�ũ��������վ:"+this.strNewLine+" WWW.SRCB.COM";
           
 		  //ƾ��̧ͷ����
 		  this.strContain = this.strContainHead
 	                      + this.strNewLine
                          + " ��������       ʱ��" 
 				          + this.strNewLine
 	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
 	                      + this.strNewLine
 						  + this.strNewLine
 						  + " �����ն˺�"
 						  + this.strNewLine
 						  + " "+top.terminal.strTerminalNum
 						  + this.strNewLine
 				          + this.strNewLine;
 				
 		  //ƾ����������			  
		  this.strContain += " ��������           ����" 
		                   + this.strNewLine
	                       + " "+ "�籣������" +"        "+" *" + top.pool.get("strIDName").substring(1)
	                       + this.strNewLine
	                       + " ������ˮ"
	                       + this.strNewLine
	                       + " "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
				           + this.strNewLine
				           + " �ֻ�����"
				           + this.strNewLine
				           + " "+phoneNumVal
				           + this.strNewLine
				           + " ֤������"
						   + this.strNewLine
				           + " "+strIDCardNum
						   + this.strNewLine
				    	   + " ָ��Ͷ�ݵ�ַ"
						   + this.strNewLine
				           + " "+top.pool.get("sendAddress")
				           + this.strNewLine
				    	   + " ��ѡ������������"
						   + this.strNewLine
				           + " "+top.pool.get("countryMessageText")
		  				   + this.strNewLine
		  				   + this.strNewLine;
					
	       //ƾ��β������
	       this.strContain += " "+"���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   	   
	   /*ȡ��ƾ��ģ��*/
       this.printTemplateWithDrawSucc = function()
	   {
    	  var WithDrawType = new top.StringCtrl("ȡ���").suffixStr(' ',15);
		  var panNum = top.pool.get("DrawPan");
		  var strWithDrawAmount = new top.StringCtrl(new top.StringCtrl(top.pool.get("AmountCheck")).formatNumber(2)).suffixStr(' ',19);// 2018-1-10 ����ʽ����С�������λ
		  var MultiWithDrawAmount = new top.StringCtrl(new top.StringCtrl(top.pool.get("MultiWithDrawAmount")).formatNumber(2)).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //2018-1-12 ����ʣ���ѳ�����ж� ���׳ɹ�����ʾ
		  var DrawAmtInfoNewLine = this.strNewLine + this.strNewLine;
		  var WithDrawAmtInfoTitle = " ʣ��δ�������     ����ɳ������" + this.strNewLine;
		  var strWithDrawAmtInfoTitle = MultiWithDrawAmount + new top.StringCtrl(top.pool.get("strWithDrawSuccAmount")).formatNumber(2);
		  if(top.pool.get("DrawTransResult") == "���׳ɹ�"){
			  WithDrawAmtInfoTitle = "";
			  strWithDrawAmtInfoTitle = ""
			  DrawAmtInfoNewLine = "";
		  }
		  
		  var AgentName = "";
		  var strAgentName = "";
		  if(top.pool.get("IDCardAcceptFlag") == "2"){
			  AgentName = "����������";
			  strAgentName = "*" + top.pool.get("DrawAgentName").substring(1) + this.strNewLine + this.strNewLine;// 2018-1-8 ��������������
		  }
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ WithDrawType + top.pool.get("strWithDrawTransJun")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           ����/�˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " ȡ����           ����" 
		                   + this.strNewLine
	                       + " "+ strWithDrawAmount + "*" + top.pool.get("strRespIDName").substring(1)
						   + DrawAmtInfoNewLine
			               + WithDrawAmtInfoTitle
			               + " "+ strWithDrawAmtInfoTitle
						   + this.strNewLine
			         	   + this.strNewLine
						   + " "+ AgentName
						   + this.strNewLine
						   + " "+ strAgentName;//2018-1-17 �޸Ĵ������޷���ʾbug �����������з�
	       //ƾ��β������
	       this.strContain += " "+ top.pool.get("DrawTransResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*β��ȡ��ƾ��ģ��*/
       this.printTemplateTellerWithDrawSucc = function()
	   {
			var WithDrawType = new top.StringCtrl("��Աȡ��").suffixStr(' ',19);
			//�����ܽ��
			var strWithDrawAmount = new top.StringCtrl("").formatStrAmount(top.pool.get("TransAmount")) + " Ԫ";
			//100Ԫ�ѳ����
			var strDrawSuccHunAmount = new top.StringCtrl(parseInt(top.pool.get("strDrawSuccHunCount")) + " ��").suffixStr(' ',15);
			//100Ԫδ�����
			var strMultiDrawHunAmount = parseInt(top.pool.get("strMultiDrawHunCount"));
			//10Ԫ�ѳ����
			var strDrawSuccTenAmount = new top.StringCtrl(parseInt(top.pool.get("strDrawSuccTenCount")) + " ��").suffixStr(' ',13);
			//10Ԫδ�����
			var strMultiDrawTenAmount = parseInt(top.pool.get("strMultiDrawTenCount"));
			
			
			//ƾ��̧ͷ����
			this.strContain = this.strContainHead
				+ this.strNewLine
				+ " ��������       ʱ��       �����ն˺�" 
				+ this.strNewLine
				+ " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
				+ this.strNewLine
				+ this.strNewLine;
				
			//ƾ����������			  
			this.strContain += " �������               ������ˮ" 
				+ this.strNewLine
				+ " "+ WithDrawType + top.pool.get("strWithDrawTransJun")
				+ this.strNewLine
				+ this.strNewLine
				+ " ��������               ���׽��"
				+ this.strNewLine
				+ " "+ top.terminal.strOrgNum +"                  " + strWithDrawAmount
				+ this.strNewLine
				+ this.strNewLine
				+ " 100Ԫ�ѳ�������        100Ԫδ��������"
				+ this.strNewLine
				+ " "+ strDrawSuccHunAmount + "       " + strMultiDrawHunAmount + " ��"
				+ this.strNewLine
				+ this.strNewLine
				+ " 10Ԫ�ѳ�������         10Ԫδ��������"
				+ this.strNewLine
				+ " "+ strDrawSuccTenAmount + "         " + strMultiDrawTenAmount + " ��"
				+ this.strNewLine
				+ this.strNewLine
			
			//ƾ��β������
			this.strContain += " "+ top.pool.get("DrawTransResult") 
				+ this.strNewLine
				+ this.strContainFoot;
	   }
	   
       
       /*���ƾ��ģ��*/
       this.printTemplateDepositSucc = function()
	   {
    	  var DepositType = new top.StringCtrl("���ڴ��").suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strDepAccount")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  var strDepositName = "";
		  if(top.pool.get("isDepAgentFlag") == "2") {
			  strDepositName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',18);
		  }else {
			  strDepositName = new top.StringCtrl(top.pool.get("strRespIDName")).suffixStr(' ',18);
		  }
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " " + DepositType + top.pool.get("strDepOrgTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           ����/�˺�"
						   + this.strNewLine
	                       + " " + top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " ����������         �Ѵ����ܽ��" 
		                   + this.strNewLine
	                       + " *" + strDepositName.substring(1) + top.pool.get("strTotalAmount") + ".00"
	                       + this.strNewLine
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+ top.pool.get("strDepositResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       this.printTemplateTelDepSucc = function(){
     	  var DepositType = new top.StringCtrl("��Ա�ֽ���").suffixStr(' ',13);
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " " + DepositType + top.pool.get("strDepOrgTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������"
						   + this.strNewLine
	                       + " " + top.terminal.strOrgNum
						   + this.strNewLine
						   + this.strNewLine
						   + " �Ѵ����ܽ��" 
		                   + this.strNewLine
	                       + " " +top.pool.get("strTotalAmount") + ".00"
	                       + this.strNewLine
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+ top.pool.get("strDepositResult") 
						   + this.strNewLine
						   + this.strContainFoot;    	   
       }
       this.printTemplatePupositSucc = function()
	   {
    	  var PupositType = new top.StringCtrl("�Թ����").suffixStr(' ',15);
		  var PayeePanNum = top.pool.get("strPayeeAccount");//�տ����˺�
		  var PayerPanNum = top.pool.get("Pay_number");//������˺�
		  var strPayee_name =top.pool.get("Payee_name");//�տ�������
          var strPay_name =top.pool.get("Pay_name");//���������
          var Per_pid = top.pool.get("strIDCardNum");//���֤����
		  var Per_name =  top.pool.get("strIDName");//����
		  if(Per_pid != null && Per_pid != "" && Per_pid.length >= 18){
			  Per_pid = Per_pid.substr(0, 8) + "****" + Per_pid.substr(14);
		  }
          if (PayeePanNum != null && PayeePanNum != "" && PayeePanNum.length > 5){
        	  PayeePanNum = PayeePanNum.substr(0, PayeePanNum.length-5) + "****" + PayeePanNum.charAt(PayeePanNum.length-1);
	      } 
          if (PayerPanNum != null && PayerPanNum != "" && PayerPanNum.length > 5){
        	  PayerPanNum = PayerPanNum.substr(0, PayerPanNum.length-5) + "****" + PayerPanNum.charAt(PayerPanNum.length-1);
	      }
          if (strPayee_name!=null && strPayee_name !="" && strPayee_name.length > 6){
        	  strPayee_name = strPayee_name.substr(0, 3) + "****" + strPayee_name.substr(strPayee_name.length-3,strPayee_name.length);
          }else{
        	  strPayee_name = " *" + strPayee_name.substring(1);
          }
          if (strPay_name!=null && strPay_name !="" && strPay_name.length > 6){
        	  strPay_name = strPay_name.substr(0, 3) + "****" + strPay_name.substr(strPay_name.length-3,strPay_name.length);
          }else{
        	  strPay_name = " *" + strPay_name.substring(1);
          }
		//ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " " + PupositType + top.pool.get("strDepOrgTsn")
	                       + this.strNewLine
	                       + this.strNewLine
						   + " ��������           �Ѵ����ܽ��"
						   + this.strNewLine
	                       + " " + top.terminal.strOrgNum + "              " + top.pool.get("strTotalAmount") + ".00"
						   + this.strNewLine
						   + this.strNewLine
						   + " ���֤��           ������"  
						   + this.strNewLine 
						   +" "+ Per_pid + "   " +Per_name
						   + this.strNewLine
		                   + this.strNewLine
						   + " �տ�������" 
		                   + this.strNewLine
		                   + " "+ strPayee_name
		                   + this.strNewLine
		                   + this.strNewLine
		                   + " �տ����˺� " 
						   + this.strNewLine
						   + " " + PayeePanNum
						   + this.strNewLine
						   + this.strNewLine
						   + " ���������" 
		                   + this.strNewLine
	                       + " "+strPay_name
	                       + this.strNewLine
	                       + this.strNewLine
	                       + " ������˺�" 
						   + this.strNewLine
						   + " " + PayerPanNum
						   + this.strNewLine
						   + this.strNewLine
						   + " ��;"
						   + this.strNewLine
						   + " " + top.pool.get("UseWay")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+ top.pool.get("strPupositResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*�ڲ���ȡ��ƾ��ģ��*/
       this.printTemplateCashDrawSucc = function()
	   {
    	  var WithDrawType = new top.StringCtrl(top.pool.get("strCashTransName")).suffixStr(' ',12);
		  var strDrawName = "";
		  strDrawName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',19);
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������            ������ˮ" 
		                   + this.strNewLine
	                       + " "+ WithDrawType + top.pool.get("strCashDrawOrgTsns")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������            ����"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + "*" + strDrawName.substring(1)
						   + this.strNewLine
						   + this.strNewLine
						   + " ȡ����          " 
		                   + this.strNewLine
	                       + " "+ new top.StringCtrl("").formatStrAmount(top.pool.get("strCashWithDraw"))
	                       + this.strNewLine
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " ���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*�ڲ���ȡ���쳣ƾ��ģ��*/
       this.printTemplateCashDrawErro = function()
	   {
    	   var MultiDrawAmount = new top.StringCtrl("").formatStrAmount(top.pool.get("MultiDrawAmount"));
    	   MultiDrawAmount = new top.StringCtrl(MultiDrawAmount).suffixStr(' ',19);
    	  var WithDrawType = new top.StringCtrl(top.pool.get("strCashTransName")).suffixStr(' ',12);
		  var strDrawName = "";
		  strDrawName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',19);
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������            ������ˮ" 
		                   + this.strNewLine
	                       + " "+ WithDrawType + top.pool.get("strCashDrawOrgTsns")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������            ����"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + "*" + strDrawName.substring(1)
						   + this.strNewLine
						   + this.strNewLine
						   + " ȡ����          " 
		                   + this.strNewLine
	                       + " "+ new top.StringCtrl("").formatStrAmount(top.pool.get("strCashWithDraw"))
	                       + this.strNewLine
						   + this.strNewLine
			               + " ʣ��δ�������     ����ɳ������"
						   + this.strNewLine
			               + " "+ MultiDrawAmount + new top.StringCtrl("").formatStrAmount(top.pool.get("strDrawSuccAmount"))
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+ top.pool.get("strDrawResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*�ڲ��˴��ƾ��ģ��*/
       this.printTemplateCashDepSucc = function()
	   {
    	  var strDepType = new top.StringCtrl(top.pool.get("strCashTransName")).suffixStr(' ',12);
		  var strDepName = "";
		  strDepName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',19);
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������            ������ˮ" 
		                   + this.strNewLine
	                       + " "+ strDepType + top.pool.get("strCashDepOrgTsns")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������            ����"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + "*" + strDepName.substring(1)
						   + this.strNewLine
						   + this.strNewLine
						   + " �����          " 
		                   + this.strNewLine
	                       + " "+ new top.StringCtrl("").formatStrAmount(top.pool.get("strCashAmount"))
	                       + this.strNewLine
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " ���׳ɹ�"
						   + this.strNewLine
						   + this.strContainFoot;
	   }      
       /*�ڲ��˴���쳣ƾ��ģ��*/
       this.printTemplateCashDepErro = function()
	   {
    	   var strDepType = new top.StringCtrl(top.pool.get("strCashTransName")).suffixStr(' ',12);
 		  var strDepName = "";
 		  strDepName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',19);
 		  //ƾ��̧ͷ����
 		  this.strContain = this.strContainHead
 	                      + this.strNewLine
                           + " ��������       ʱ��       �����ն˺�" 
 				          + this.strNewLine
 	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
 	                      + this.strNewLine
 				          + this.strNewLine;
 		  //ƾ����������			  
 		  this.strContain += " �������            ������ˮ" 
 		                   + this.strNewLine
 	                       + " "+ strDepType + top.pool.get("strCashDepOrgTsns")
 	                       + this.strNewLine
 						   + this.strNewLine
 						   + " ��������            ����������"
 						   + this.strNewLine
 	                       + " "+top.terminal.strOrgNum + "               " + "*" + strDepName.substring(1)
 						   + this.strNewLine
 						   + this.strNewLine
 						   + " �Ѵ����ܽ��          " 
 		                   + this.strNewLine
 	                       + " "+ top.pool.get("strCashTotalAmount") + ".00"
 	                       + this.strNewLine
 						   + this.strNewLine
 			         	   + this.strNewLine;
 	       //ƾ��β������
 	       this.strContain += " "+ top.pool.get("strCashDepResult") 
 						   + this.strNewLine
 						   + this.strContainFoot;
	   }
       
       /*�ۺ�ǩԼ����ģ��*/
       this.printTemplate52 = function(){
    	  var strSignArr = top.pool.get("multipleSign");
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
 	      if (panNum != null && panNum != "" && panNum.length > 5){
 	              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
 	 	    } 			   				  
 		  //ƾ��̧ͷ����
 		  this.strContain = this.strContainHead
 	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
 				          + this.strNewLine              
 				          + this.strNewLine
 	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
 	                      + this.strNewLine
 				          + this.strNewLine
 				          + " ��������           �����˺�"
						  + this.strNewLine
	                      + " "+top.terminal.strOrgNum + "              " + panNum
             			  + this.strNewLine
             			  + this.strNewLine;		  
 		 if(strSignArr[0] == "1"){
 			 var TransCode = new top.StringCtrl("ATMת��").suffixStr(' ',15);
              this.strContain += " ǩԼ����           ������ˮ" 
  				 			  + this.strNewLine
  				 			  + " "+ TransCode +"  " + top.pool.get("JJKQYTsn") + "  "
                  			  + this.strNewLine
                  			  + this.strNewLine
                  			  + " ÿ���ۼ�ת���޶�"
                  			  + this.strNewLine
                  			  + " 50000.00"
                  			  + this.strNewLine
                  			  + this.strNewLine
                  			  + " ���׽��"
                 			  + this.strNewLine;
 			 //ƾ��β������
 			 this.strContain += " "+top.pool.get("JJKQYRet")
 			 				  + this.strNewLine
 			 				  + this.strNewLine;
 		 }
 		 
 		 if(strSignArr[1] == "1"){
 			  var TransCode = new top.StringCtrl("С������֧��").suffixStr(' ',15);
 			  //ƾ����������	
 			   this.strContain += " ǩԼ����             ������ˮ" 
 	 				 		   + this.strNewLine
 	 				 		   + " "+ TransCode + top.pool.get("XEMMTsn") + "  "
 		                       + this.strNewLine
 							   + this.strNewLine
 							   + " ���������޶�         �����ۼ��޶�"
 							   + this.strNewLine
 		                       + " 300.00" +"               "+"1000.00"+"  "
 		                       + this.strNewLine
 							   + this.strNewLine
 							   + " ���׽��"
                 			   + this.strNewLine;
 		       //ƾ��β������
 		       this.strContain += " "+top.pool.get("XEMMRet")
 							   + this.strNewLine
 							   + this.strNewLine;
 		 }		  		  
 		if(strSignArr[2] == "1"){
 			  var TransCode = new top.StringCtrl("���������֧��").suffixStr(' ',15);
 			  //ƾ����������			  
 			   this.strContain += " ǩԼ����              ������ˮ" 
 	 				 		   + this.strNewLine
 	 				 		   + " "+ TransCode + top.pool.get("DSFKJTsn") + "  "
 		                       + this.strNewLine
 		                       + this.strNewLine
 							   + " �ֻ���" 
 			                   + this.strNewLine
 		                       + " "+ top.pool.get("strPhone")
 							   + this.strNewLine
 				         	   + this.strNewLine
 				         	   + " ���׽��"
                			   + this.strNewLine;
 		       //ƾ��β������
 		       this.strContain += " "+top.pool.get("DSFKJRet")
 							   + this.strNewLine
 							   + this.strNewLine;
		 }		
 		if(strSignArr[3] == "1"){
 			  var TransCode = new top.StringCtrl("����ͨ").suffixStr(' ',15);
 			  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
 			  //ƾ����������			  
 			 this.strContain += " ǩԼ����           ������ˮ" 
 				 			   + this.strNewLine
 				 			   + " "+ TransCode +" " + top.pool.get("DXTZTsn") + "  "
 		                       + this.strNewLine
 		                       + this.strNewLine
 							   + " �ֻ���             �Ƿ���ʾ���"
 							   + this.strNewLine
 				               + " " + top.pool.get("strPhone") + "        ��"
 							   + this.strNewLine
 							   + this.strNewLine
 							   + " �����"
 							   + this.strNewLine
 				               + " 0.00"
 							   + this.strNewLine
 							   + this.strNewLine
 							   + " ���׽��"
                 			   + this.strNewLine;
 		       //ƾ��β������
 		       this.strContain += " "+top.pool.get("DXTZRet") 
 							   + this.strNewLine
 							   + this.strNewLine;
		 }		
 		if(strSignArr[4] == "1"){
 			  var TransCode = new top.StringCtrl("�ֻ�����").suffixStr(' ',15);
 			  //ƾ����������			  
 			   this.strContain += " ǩԼ����           ������ˮ" 
 	 				 		   + this.strNewLine
 	 				 		   + " "+ TransCode + top.pool.get("SJYHTsn") + "  "
 		                       + this.strNewLine
 							   + this.strNewLine
 							   + " �ֻ���"
 							   + this.strNewLine
 		                       + " "+top.pool.get("strPhone")
 		                       + this.strNewLine
 							   + this.strNewLine
 							   + " ���׽��"
                 			   + this.strNewLine;
 		       //ƾ��β������
 		       this.strContain += " "+top.pool.get("SJYHRet")
 							   + this.strNewLine
 							   + this.strNewLine;
		 }	
 		if(strSignArr[5] == "1"){
 			  var TransCode = new top.StringCtrl("��������").suffixStr(' ',15);
 			  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
 
 			  if(top.pool.get("LocalUkeyNum") != "" && top.pool.get("LocalUkeyNum") != null) {
 				//ƾ����������			  
	               this.strContain += " ǩԼ����           ������ˮ" 
	   				 			   + this.strNewLine
	   				 			   + " "+ TransCode + top.pool.get("WYZSBTsn") + "  "
 			                       + this.strNewLine
 								   + this.strNewLine
 					         	   + " �ֻ���              �汾"
 								   + this.strNewLine
 					               + " " + top.pool.get("strPhone") + "         " + top.pool.get("strVersion")
 								   + this.strNewLine
 								   + this.strNewLine
 					         	   + " ������"
 								   + this.strNewLine
 					               + " " + top.pool.get("strUkeyPrice") + "Ԫ"
 								   + this.strNewLine
 								   + this.strNewLine
 								   + " ���׽��"
 	                 			   + this.strNewLine;
 			  }else {
 				//ƾ����������			  
 				 this.strContain += " ǩԼ����           ������ˮ" 
 					 			   + this.strNewLine
 					 			   + " "+ TransCode + top.pool.get("WYZSBTsn") + "  "
 			                       + this.strNewLine
 								   + this.strNewLine
 					         	   + " �ֻ���              �汾"
 								   + this.strNewLine
 					               + " " + top.pool.get("strPhone") + "         " + top.pool.get("strVersion")
 								   + this.strNewLine
 								   + this.strNewLine
 								   + " ���׽��"
 	                 			   + this.strNewLine;
 			  }
 		       //ƾ��β������
 		       this.strContain += " "+top.pool.get("WYZSBRet")
 							   + this.strNewLine
 							   + this.strNewLine;
		 }
 		 //ƾ��β������
		 this.strContain += this.strContainFoot;
       }
       
       /*����������ѯģ��*/
       this.printTemplate53 = function()
	   {
    	  var strDepType = new top.StringCtrl(top.pool.get("strDepType")).suffixStr(' ',15);
          
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
 		  this.strContain += " �������            ������ˮ" 
 		                   + this.strNewLine
 	                       + " "+ strDepType + top.pool.get("strDepOrgTsns")
 	                       + this.strNewLine
 						   + this.strNewLine
 						   + " ��������  "
 						   + this.strNewLine
 	                       + " "+top.terminal.strOrgNum
 						   + this.strNewLine
 						   + this.strNewLine
 						   + " ��λ���ƣ�" + top.pool.get("strOrgName") 
 		                   + this.strNewLine
 	                       + " �������˺ţ�"+ top.pool.get("strAccount")
 	                       + this.strNewLine
 	                       + " ְ��������"+ top.pool.get("strCustName")
 						   + this.strNewLine
 						   + " �˻���"+ top.pool.get("amount")
 						   + this.strNewLine
 						   + " �½ɴ�"+ top.pool.get("monAmount")
 						   + this.strNewLine
 						   + " ���ݽ�ֹ���ڣ�"+ top.pool.get("endDate")
 						   + this.strNewLine
 			         	   + this.strNewLine;
 	       //ƾ��β������
 	       this.strContain += " "+"���׳ɹ�" 
 						   + this.strNewLine
 						   + this.strContainFoot;
	   }
       
       /*�Թ�ȡ��ƾ��ģ��*/
       this.printTemplateWithCompDrawSucc = function()
	   {
    	  var WithDrawType = new top.StringCtrl("�Թ�ȡ��").suffixStr(' ',15);
		  var panNum = top.pool.get("WithDraw_Acc");//ȡ���˺�
		  //ȡ����
		  var strWithDrawAmount = new top.StringCtrl(new top.StringCtrl(top.pool.get("strCashWithDraw")).formatNumber(2)).suffixStr(' ',19);// 2018-1-10 ����ʽ����С�������λ
		  //ʣ��δ��
		  var MultiWithDrawAmountFen = new top.StringCtrl("").formatStrAmount(top.pool.get("MultiDrawAmount"));
		  var MultiWithDrawAmount = new top.StringCtrl(new top.StringCtrl(MultiWithDrawAmountFen).formatNumber(2)).suffixStr(' ',19);
		  var CompName = top.pool.get("WithDraw_CompName");//��˾����
		  if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  if (CompName!=null && CompName !="" && CompName.length > 6){
			  CompName = CompName.substr(0, 3) + "****" + CompName.substr(CompName.length-3,CompName.length);
          }else{
        	  CompName = " *" + CompName.substring(1);
          }
		  // ���׳ɹ�����ʾ
		  var DrawCompAmtInfoNewLine = this.strNewLine + this.strNewLine;
		  var WithDrawCompAmtInfoTitle = " ʣ��δ�������     ����ɳ������" + this.strNewLine;
		  //�ѳ����
		  var WithDrawSuccAmount =new top.StringCtrl("").formatStrAmount(top.pool.get("strDrawSuccAmount"));
		  var strWithDrawCompAmtInfoTitle = MultiWithDrawAmount + WithDrawSuccAmount;
		  if(top.pool.get("DrawTransResult") == "���׳ɹ�"){
			  WithDrawCompAmtInfoTitle = "";
			  strWithDrawCompAmtInfoTitle = ""
			  DrawCompAmtInfoNewLine = "";
		  }
		  //ƾ��̧ͷ����
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " ��������       ʱ��       �����ն˺�" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //ƾ����������			  
		  this.strContain += " �������           ������ˮ" 
		                   + this.strNewLine
	                       + " "+ WithDrawType + top.pool.get("strWithDrawTransJun")
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��������           �˺�"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " ȡ����           ȡ��������" 
		                   + this.strNewLine
	                       + " "+ strWithDrawAmount + "*" + top.pool.get("strIDName").substring(1)
	                       + this.strNewLine
						   + this.strNewLine
						   + " ��˾���� "
						   + this.strNewLine
	                       + " "+ CompName
						   + DrawCompAmtInfoNewLine
			               + WithDrawCompAmtInfoTitle
			               + " "+ strWithDrawCompAmtInfoTitle
						   + this.strNewLine
			         	   + this.strNewLine;
	       //ƾ��β������
	       this.strContain += " "+ top.pool.get("DrawTransResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
	   /*��ӡƾ�����˸��ͻ�*/
	   this.printAndEject = function()
	   {
	      if (top.YHAXReceiptPrint.StDeviceStatus != "HEALTHY")
	      {
	         if (typeof(top.MainFrame.onDeviceError_rpt_Print) == "function"){
	           top.MainFrame.onDeviceError_rpt_Print();
	           return;
		     }
	      }
	      /*�ж���ʱ�ļ��Ƿ����*/
	      try{
	    	  exFil=fileObj.GetFile(this.strFile);
	    	  exFil.Delete();
	      }catch(e){}
		  //�жϴ�ӡ����ƾ��ģ��
		  var printType = top.pool.get("printType");
		  if(printType != null && printType !="" && printType == "1")//ģ��1ƾ��
		  {
		     top.receiptprinter.printTemplate();
		  }
		  else if(printType != null && printType !="" && printType == "2")//ģ��2ƾ��
		  {
		     top.receiptprinter.printTemplate2();
		  }
		  else if(printType != null && printType !="" && printType == "3")//�̿�ƾ��
		  {
		     top.receiptprinter.printCapturedTemplate();
		  }
		  else if(printType != null && printType !="" && printType == "4")//ģ��ƾ�����
		  {
		     top.receiptprinter.printTemplate4();
		  }
		  else if(printType != null && printType !="" && printType == "5")//�к�ƾ��
		  {
		     top.receiptprinter.printTemplate5();
		  }else if(printType != null && printType !="" && printType == "6")//�浥����ƾ��
		  {
		     top.receiptprinter.printTemplate6();
		  }else if(printType != null && printType !="" && printType == "7")//ת��ƾ��
		  {
		     top.receiptprinter.printTemplate7();
		  }else if(printType != null && printType !="" && printType == "8")//��ʾ��������ƾ��
		  {
		     top.receiptprinter.printTemplate8();
		  }else if(printType != null && printType !="" && printType == "9")//�����޸�ע��ƾ��
		  {
		     top.receiptprinter.printTemplate9();
		  }	else if(printType != null && printType !="" && printType == "10")//��������ƾ��
		  {
		     top.receiptprinter.printTemplate10();
		  }	else if(printType != null && printType !="" && printType == "11")//����ɾ��ƾ��
		  {
		     top.receiptprinter.printTemplate11();
		  }else if(printType != null && printType !="" && printType == "12")//����ɾ��ƾ��
		  {
		     top.receiptprinter.printTemplate12();
		  }else if(printType != null && printType !="" && printType == "13")//����ɾ��ƾ��
		  {
		     top.receiptprinter.printTemplate13();
		  }else if(printType != null && printType !="" && printType == "14")//����ע��ƾ��
		  {
		     top.receiptprinter.printTemplate14();
		  }
		  else if(printType != null && printType !="" && printType == "15")//�ֻ���������ƾ��
		  {
		     top.receiptprinter.printTemplate15();
		  }
		  else if(printType != null && printType !="" && printType == "16")//�ֻ�����ɾ��ƾ��
		  {
		     top.receiptprinter.printTemplate16();
		  }	
		  else if(printType != null && printType !="" && printType == "17")//����ת��ƾ��
		  {
		     top.receiptprinter.printTemplate17();
		  }	
		  else if(printType != null && printType !="" && printType == "18")//����ת��ƾ��
		  {
		     top.receiptprinter.printTemplate18();
		  }
		  else if(printType != null && printType !="" && printType == "19")//���ƾ��
		  {
		     top.receiptprinter.printTemplate19();
		  }else if(printType != null && printType !="" && printType == "20")//���ƾ��
		  {
		     top.receiptprinter.printTemplate20();
		  }else if(printType != null && printType !="" && printType == "21")//�������ƾ��
		  {
		     top.receiptprinter.printTemplate21();
		  }else if(printType != null && printType !="" && printType == "22")//ATMת��ƾ��
		  {
			 top.receiptprinter.printTemplate22();
		  }else if(printType != null && printType !="" && printType == "22MV")//ATMת��ƾ��
		  {
			 top.receiptprinter.printTemplate22MV();
		  }else if(printType != null && printType !="" && printType == "23")//С������ƾ��
		  {
			 top.receiptprinter.printTemplate23();
		  }else if(printType != null && printType !="" && printType == "23MV")//С������ƾ��
		  {
			 top.receiptprinter.printTemplate23MV();
		  }else if(printType != null && printType !="" && printType == "24")//���������ƾ��
		  {
			 top.receiptprinter.printTemplate24();
		  }else if(printType != null && printType !="" && printType == "24MV")//���������ƾ��
		  {
			 top.receiptprinter.printTemplate24MV();
		  }else if(printType != null && printType !="" && printType == "25")//����ͨƾ��
		  {
			 top.receiptprinter.printTemplate25();
		  }else if(printType != null && printType !="" && printType == "25MV")//����ͨƾ��
		  {
			 top.receiptprinter.printTemplate25MV();
		  }else if(printType != null && printType !="" && printType == "26")//�ֻ�����ƾ��
		  {
			 top.receiptprinter.printTemplate26();
		  }else if(printType != null && printType !="" && printType == "26MV")//�ֻ�����ƾ��
		  {
			 top.receiptprinter.printTemplate26MV();
		  }else if(printType != null && printType !="" && printType == "27")//��������ƾ��
		  {
			 top.receiptprinter.printTemplate27();
		  }else if(printType != null && printType !="" && printType == "27MV")//��������ƾ��
		  {
			 top.receiptprinter.printTemplate27MV();
		  }else if(printType != null && printType !="" && printType == "28")//����ƾ��
		  {
			 top.receiptprinter.printTemplate28();
		  }else if(printType != null && printType !="" && printType == "29")//������ƾ��
		  {
			 top.receiptprinter.printTemplate29();
		  }else if(printType != null && printType !="" && printType == "29MV")//�ƶ��ն˿�����ƾ��
		  {
			 top.receiptprinter.printTemplate29MV();
		  }else if(printType != null && printType !="" && printType == "30")//�̴浥ƾ��
		  {
			 top.receiptprinter.printTemplate30();
		  }else if(printType != null && printType !="" && printType == "31")//�浥����ƾ��
		  {
			 top.receiptprinter.printTemplate31();
		  }else if(printType != null && printType !="" && printType == "32")//�浥����ƾ��
		  {
			 top.receiptprinter.printTemplate32();
		  }else if(printType != null && printType !="" && printType == "33")//�浥����/����ת��ƾ��
		  {
			 top.receiptprinter.printTemplate33();
		  }else if(printType != null && printType !="" && printType == "34")//����ǩԼ  �������۹�˾
		  {
			 top.receiptprinter.printTemplate34();
		  }else if(printType != null && printType !="" && printType == "35")//�����ֽ��ֵƾ��
		  {
			 top.receiptprinter.printTemplate35();
		  }else if(printType != null && printType !="" && printType == "36")//���ƾ��
		  {
			 top.receiptprinter.printTemplate36();
		  }else if(printType != null && printType !="" && printType == "37")//����ʧƾ��
		  {
			 top.receiptprinter.printTemplate37();
		  }else if(printType != null && printType !="" && printType == "38")//���ƿ���ʧ����ƾ��
		  {
			 top.receiptprinter.printTemplate38();
		  }else if(printType != null && printType !="" && printType == "39")//Ԥ�ƿ���ʧ����ƾ��
		  {
			 top.receiptprinter.printTemplate39();
		  }else if(printType != null && printType !="" && printType == "40")//ƾ֤��ʧƾ��
		  {
			 top.receiptprinter.printTemplate40();
		  }else if(printType != null && printType !="" && printType == "41")//ATMת�� --����ǩԼ
		  {
			 top.receiptprinter.printTemplate41();
		  }else if(printType != null && printType !="" && printType == "42")//�ɷ�ƾ��ģ��*/
		  {
			 top.receiptprinter.printTemplate42();
		  }else if(printType != null && printType !="" && printType == "44")//ATMת�� --����ǩԼ
		  {
			 top.receiptprinter.printTemplate44();
		  }else if(printType != null && printType !="" && printType == "45")//��ת��
		  {
			 top.receiptprinter.printTemplate45();
		  }else if(printType != null && printType !="" && printType == "46")//��ת��
		  {
			 top.receiptprinter.printTemplate46();
		  }else if(printType != null && printType !="" && printType == "47")//���������֧��-�ֻ���ά��
		  {
			 top.receiptprinter.printTemplate47();
		  }else if(printType != null && printType !="" && printType == "48")//С�������޶�
		  {
			 top.receiptprinter.printTemplate48();
		  }else if(printType != null && printType !="" && printType == "49")//����
		  {
			 top.receiptprinter.printTemplate49();
		  }else if(printType != null && printType !="" && printType == "50")//���������֧��-�޶����
		  {
			 top.receiptprinter.printTemplate50();
		  }else if(printType != null && printType !="" && printType == "51")//�籣������
		  {
			 top.receiptprinter.printTemplate51();
		  }else if(printType != null && printType !="" && printType == "52"){ //�ۺ�ǩԼ
			  top.receiptprinter.printTemplate52();
		  }else if(printType != null && printType !="" && printType == "51MV")//�籣������
		  {
				 top.receiptprinter.printTemplate51MV();
		  }else if(printType != null && printType !="" && printType == "WithDrawSucc")//�ֽ�ȡ��
		  {
			 top.receiptprinter.printTemplateWithDrawSucc();
		  }else if(printType != null && printType !="" && printType == "TellerWithDrawSucc")//��Ա�ֽ�ȡ��
		  {
			 top.receiptprinter.printTemplateTellerWithDrawSucc();
		  }else if(printType != null && printType !="" && printType == "DepositSucc")//���
		  {
			 top.receiptprinter.printTemplateDepositSucc();
		  }else if(printType != null && printType !="" && printType == "PupositSucc")//�Թ����
		  {
				 top.receiptprinter.printTemplatePupositSucc();
		  }else if(printType != null && printType !="" && printType == "CashDrawSucc")//�ڲ���ȡ��
		  {
			 top.receiptprinter.printTemplateCashDrawSucc();
		  }else if(printType != null && printType !="" && printType == "CashDrawErro")//�ڲ���ȡ���쳣
		  {
			top.receiptprinter.printTemplateCashDrawErro();
		  }else if(printType != null && printType !="" && printType == "CashDepSucc")//�ڲ��˴��
		  {
			top.receiptprinter.printTemplateCashDepSucc();
		  }else if(printType != null && printType !="" && printType == "CashDepErro")//�ڲ��˴���쳣
		  {
			top.receiptprinter.printTemplateCashDepErro();
		  }else if(printType != null && printType !="" && printType == "53")//����������ѯ
		  {
			  top.receiptprinter.printTemplate53();
		  }else if(printType != null && printType !="" && printType == "TelDepositSucc")//��Ա�ֽ���
		  {
			  top.receiptprinter.printTemplateTelDepSucc();
		  }else if(printType != null && printType !="" && printType == "WithCompDrawSucc"){//�Թ�ȡ��
			  top.receiptprinter.printTemplateWithCompDrawSucc();
		  }
		  
	      /*�ж���ʱ�ļ��Ƿ����*/
	      if(printFlag_mx)
	      {
		      fil   =   fileObj.createtextfile(this.strFile,true);
		  	  fil.Write(this.strContain);
		  	  fil.Close();
	      }else /*���δ������ʱ�ļ������ȴ�������ʱ�ļ�*/
	      {
		      //������ӡ����ʱ�ļ�
		      fil   =   fileObj.createtextfile(this.strFile,true);
		  	  fil.Write(this.strContain);
		  	  fil.Close();
		  }
	      top.receiptprinter.RptEvents.clearAll();
	      top.receiptprinter.RptEvents.appendEvent("PrintComplete", top.receiptprinter.onPrintComplete);
		  top.receiptprinter.RptEvents.appendEvent("Timeout", top.receiptprinter.onDeviceError_PrintFile);
          top.receiptprinter.RptEvents.appendEvent("DeviceError", top.receiptprinter.onDeviceError_PrintFile);
		  top.receiptprinter.RptEvents.appendEvent("FatalError", top.receiptprinter.onDeviceError_PrintFile);
	      top.YHAXReceiptPrint.PrintFile(this.strFile, -1, true);
	      printFlag_mx =false;
	      this.strContain = "";
	  }
	 
	  /*��ӡƾ��ʱӲ�����ϵ��¼��ص�����*/
	  this.onDeviceError_PrintFile = function()
	  {
		// ��¼�ն���ˮ
        top.journalPrinter.addJournal("ƾ����ӡ������ ReceiptPrinter Event onDeviceError_PrintFile ");    
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onDeviceError_rpt_Print) == "function")
	      top.MainFrame.onDeviceError_rpt_Print();
	    else{}
	  }

	  /*��ӡƾ����ɵ��¼��ص�����*/
	  this.onPrintComplete = function()
	  {
		// ��¼�ն���ˮ
        top.journalPrinter.addJournalWithTime("ƾ����ӡ����ӡ��� ReceiptPrinter Event onPrintComplete ");      
		top.receiptprinter.RptEvents.clearAll();
        top.receiptprinter.RptEvents.appendEvent("PrintEjected", top.receiptprinter.onPrintEjected);
        top.receiptprinter.RptEvents.appendEvent("PrintTaken", top.receiptprinter.onPrintTaken);
        top.receiptprinter.RptEvents.appendEvent("Timeout", top.receiptprinter.onTimeout_Eject);
        top.receiptprinter.RptEvents.appendEvent("DeviceError", top.receiptprinter.onDeviceError_Eject);
		top.receiptprinter.RptEvents.appendEvent("FatalError", top.receiptprinter.onDeviceError_Eject);
		top.YHAXReceiptPrint.Eject(top.receiptprinter.BeTakenTimeOut*1000);
	  }

	  /*ƾ���Ѿ����ͳ����ͻ����¼��ص�����*/
	  this.onPrintEjected = function()
	  {
		// ��¼�ն���ˮ
        top.journalPrinter.addJournalWithTime("ƾ���˳� ReceiptPrinter Event onPrintEjected");   
		// ����ָʾ��
        try{top.guidelights.setReceiptPrinterLight("QUICK");}catch(e){}
	
	  	top.soundPlayer.playback("/Sound/TakeReceipt.mp3");
		
	    if (typeof(top.MainFrame.onReceiptEjected) == "function")
	      top.MainFrame.onReceiptEjected();
	    else{}
	  }

	  /*ƾ���Ѿ����ͻ�ȡ�ߵ��¼��ص�����*/
	  this.onPrintTaken = function()
	  { 
		// ��¼�ն���ˮ
        top.journalPrinter.addJournalWithTime("ƾ����ȡ�� ReceiptPrinter Event onPrintTaken "); 	  
		// ����ָʾ��
        try{top.guidelights.setReceiptPrinterLight("OFF");}catch(e){}
	
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onReceiptTaken) == "function")
	      top.MainFrame.onReceiptTaken();
	    else{}
	  } 
	  
	  /*ƾ����ʱδ���ͻ�ȡ�ߵ��¼��ص�����*/
    this.onTimeout_Eject = function()
	{
		// ��¼�ն���ˮ
        top.journalPrinter.addJournalWithTime("ƾ���˳���ʱ ReceiptPrinter Event onTimeout_Eject "); 
		// ����ָʾ��
		try{top.guidelights.setReceiptPrinterLight("OFF");}catch(e){}

		if (top.YHAXReceiptPrint.CpCanCapture)
		{
		  top.receiptprinter.RptEvents.clearAll();
		  top.receiptprinter.RptEvents.appendEvent("PrintCaptured", top.receiptprinter.onPrintCaptured);
		  top.receiptprinter.RptEvents.appendEvent("PrintTaken", top.receiptprinter.onPrintTaken);
		  top.receiptprinter.RptEvents.appendEvent("DeviceError", top.receiptprinter.onDeviceError_Capture);
		  top.receiptprinter.RptEvents.appendEvent("FatalError", top.receiptprinter.onDeviceError_Capture);
		  top.YHAXReceiptPrint.Capture();
		}
		else
		{
		  // ���ܼ��ƾ���Ƿ����ߣ����տͻ��Ѿ�ȡ��ƾ������
		  top.receiptprinter.RptEvents.clearAll();
		  if (typeof(top.MainFrame.onReceiptTaken) == "function")
			top.MainFrame.onReceiptTaken();
		}
    }

	  /*�ͳ�ƾ��ʱӲ�����ϵ��¼��ص�����*/
	  this.onDeviceError_Eject = function()
	  {
		// ��¼�ն���ˮ
        top.journalPrinter.addJournalWithTime("ƾ���˳����� ReceiptPrinter Event onDeviceError_Eject"); 
		// ����ָʾ��
        try{top.guidelights.setReceiptPrinterLight("OFF");}catch(e){}
	
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onDeviceError_rpt_Eject) == "function")
	      top.MainFrame.onDeviceError_rpt_Eject();
	    else{}
	  }  
	  
	  /*ƾ���Ѿ���������¼��ص�����*/
	  this.onPrintCaptured = function()
	  {
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onReceiptCaptured) == "function")
	      top.MainFrame.onReceiptCaptured();
	    else{}
	  }
	  /*����ƾ����Ӳ�����ϵ��¼��ص�����*/
	  this.onDeviceError_Capture = function()
	  {
		// ��¼�ն���ˮ
        top.journalPrinter.addJournalWithTime("��ƾ������ ReceiptPrinter Event onDeviceError_Capture ");
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onCaptureReceiptFailed) == "function")
	      top.MainFrame.onCaptureReceiptFailed();
	    else{}
	  }
	  
		/***ƾ����ӡ��ģ��״̬�ж�***/
	  this.ReceiptPrinterStatus = function()
	  {
		 if(top.YHAXReceiptPrint.StDeviceStatus != "HEALTHY" || top.YHAXReceiptPrint.StPaperStatus == "JAMMED" || top.YHAXReceiptPrint.StPaperStatus == "OUT")
		 {
			 return "false";
		 }else{
			 return "true";
		 }	   
	  }
	
}
