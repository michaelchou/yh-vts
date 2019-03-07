/*凭条打印类*/
function ReceiptPrinter()
{
	   var printFlag_mx =false;
	   /*凭条打印机虚模块事件响应对象*/
	   this.RptEvents = new top.EventHandling(top.YHAXReceiptPrint);
	   /*换行符*/
	   this.strNewLine = "\r\n";
	   /*凭条头内容*/
	   this.strContainHead= "         上海农商银行客户通知单 "+this.strNewLine+this.strNewLine;
	   /*凭条内容*/
	   this.strContain = "";
	   /*凭条尾内容*/
	   this.strContainFoot= " 24小时客服热线:021-962999 4006962999"+this.strNewLine+" 上海农商银行网站:WWW.SRCB.COM"; 
	   /*临时文件*/
	   this.strFile = "C:\\Cols\\Journal\\ReceiptPrinter.txt";
	   var fileObj = new ActiveXObject("Scripting.FileSystemObject");   
	   
	   //客户取凭条的超时秒数
	   this.BeTakenTimeOut = 120;      
	   /*设置结果集打印*/
	   this.set=function(str){
		   if(printFlag_mx)
		    {	
		       this.strContain = "";
		    }
	   		this.strContain+=str+this.strNewLine;
	   }
	   
	   /*凭条模板*/
       this.printTemplate = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).formatStrRight(" ",19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+TransCode+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + this.strNewLine;
	      //凭条尾部内容
	      this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*凭条模板*/
       this.printTemplate2 = function()
	   {
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).formatStrRight(" ",20);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  panNum = new top.StringCtrl(panNum).suffixStr(' ',19);
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+TransCode+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 姓名 "
						   + this.strNewLine
			               + " *" + IDName.substring(1)
						   + this.strNewLine
			         		+ this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*凭条模板*/
       this.printTemplate4 = function()
	   {
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别               交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("transName")+"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine						  
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 交易金额       "
			               + this.strNewLine
			               + " " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*叫号凭条模板*/
       this.printTemplate5 = function()
	   {
		   //存单账号
		  var panNum = top.pool.get("strCdsAccount");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //存款人
		  var IDName = "";
		  //代理人
		  var AgentIDName = "";
		  var AgentIDCardNum = "";
		  var type = "";
		  if(top.pool.get("isAgent") == "1"){
			  IDName = new top.StringCtrl(top.pool.get("strAgentIDName")).suffixStr('',8);
			  AgentIDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr('',8);
			  AgentIDName = "*"+AgentIDName.substring(1);
			  type ="身份证";
			  AgentIDCardNum = top.pool.get("strIDCardNum");
			  AgentIDCardNum = AgentIDCardNum.substr(0, AgentIDCardNum.length-5) + "****" + AgentIDCardNum.charAt(AgentIDCardNum.length-1);	
		  }else{
			  IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr('',8);			  
		  }
		  var strAmount = new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"));
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  		  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("strTransName")+"    "+"       "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + " 机构代码           "
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum 
						   + this.strNewLine
						   + " 定期账号                 户名"
						   + this.strNewLine
	                       + " "+ panNum + "       " +  " *" + IDName.substring(1)
	                       + this.strNewLine
						   + this.strNewLine
						   + " 代理人名称"
						   + this.strNewLine
	                       + " "+AgentIDName
						   + this.strNewLine
	                       + this.strNewLine
						   + " 证件类型"
						   + this.strNewLine
	                       + " "+ type
	                       + this.strNewLine
						   + this.strNewLine
						   + " 代理人证件号"
						   + this.strNewLine
	                       + " "+AgentIDCardNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 交易金额              排队号"
			               + this.strNewLine
			               + " "+new top.StringCtrl(strAmount).suffixStr(' ',22) + top.pool.get("strQueueNo")
			               + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   	/*存单开户凭条模板*/
       this.printTemplate6 = function()
	   { 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别             交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("strTransName")+"             "+top.pool.get("strOrigstrTxSerialNo")+"  "
	                       + this.strNewLine
						   + " 机构代码          "
						   + this.strNewLine
	                       + "  "+top.terminal.strOrgNum + "              " 
						   + this.strNewLine
						   + this.strNewLine
						   + " 存单类型     存单存期   支取方式"
						   + this.strNewLine
						   + " 整存整取"+"     "+new top.StringCtrl(top.pool.get("CDtime")).suffixStr(' ',8)+top.pool.get("draw")
						   + this.strNewLine
						   + this.strNewLine
			               + " 开户金额       "
			               + this.strNewLine
			               + " " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
			               + this.strNewLine
						   + this.strNewLine
						   + " 姓名"
			               + this.strNewLine
						   + " *" + top.pool.get("strAuthName").substring(1)
			               + this.strNewLine;
						   + this.strNewLine;
						   + this.strNewLine
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*凭条模板*/
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
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +"     "+top.pool.get("TransNum")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 转出账号            转入账号"
						   + this.strNewLine
	                       + " "+ panNum + " " + DestpanNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " 转出户名            转入户名"
						   + this.strNewLine
	                       + " "+top.pool.get("strName") + "                " + top.pool.get("strDestName")
	                       + this.strNewLine
						   + this.strNewLine
			               + " 交易金额       "
			               + this.strNewLine
			               + " "+ TransAmount
			               + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   	   /*凭条模板*/
       this.printTemplate8 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  panNum = new top.StringCtrl(panNum).suffixStr(' ',19);
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("strTransCode")+" "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 姓名"
						   + this.strNewLine
			               + " *" + IDName.substring(1)
						   + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*网银凭条模板*/
       this.printTemplate9 = function()
	   {
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',8);
		  //解决中文长度问题
		  for (var i=TransCode.length*2; i<17; i++)
				TransCode = TransCode + " ";
            var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr('',19);
  
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 

		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容		
          if(top.pool.get("strTransCode") !=null && top.pool.get("strTransCode") == "908207"){//个人网银修改
			     this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +"    "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 签约手机号        联系电话"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone") +"       "+top.pool.get("strTel")
						   + this.strNewLine
			               + this.strNewLine;  
		  }	
          else{		  
		         this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 签约手机号"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone")
						   + this.strNewLine
			               + this.strNewLine;
		   }
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   	   /*网银凭条模板*/
       this.printTemplate10 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strName")).suffixStr('',8);
		  //签约卡号
		 //  var panNum = new top.StringCtrl(top.pool.get("cardPassbookNo")).suffixStr('',19);
      	    var panNum = new top.StringCtrl(top.pool.get("firstCardNo")).suffixStr('',19);
    
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 		  
		  //新增卡号
		  var panNum2 = new top.StringCtrl(top.pool.get("secondStrPan")).suffixStr('',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+top.trans.convertTransType(top.pool.get("strTransCode"))+"    "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 新增卡号"
						   + this.strNewLine
			               + " "+ panNum2 
						   + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*网银凭条模板*/
       this.printTemplate11 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strName")).suffixStr('',8);
		  //签约卡号
		 // var panNum = new top.StringCtrl(top.pool.get("cardPassbookNo")).suffixStr('',19);
          var panNum = new top.StringCtrl(top.pool.get("firstCardNo")).suffixStr('',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
			//删除卡号
		  var panNum2 = new top.StringCtrl(top.pool.get("secondCardNo")).suffixStr('',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                      // + " "+top.trans.convertTransType(top.pool.get("strTransCode"))+"           "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + " "+"个人网银删除账户 "+"  "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 删除卡号"
						   + this.strNewLine
			               + "  " + panNum2 
						   + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }

	   /*凭条模板*/
       this.printTemplate12 = function()
	   {
		  var strName = new top.StringCtrl(top.pool.get("strName")).suffixStr(' ',8);
		  var TransAmount = new top.StringCtrl(top.pool.get("Amount")).suffixStr(' ',12);
		  var productType = top.cardreader.convertTransType(top.pool.get("productSubType"));

		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("TransCode")+"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 卡号                户名"
						   + this.strNewLine
	                       + " "+ panNum + " " + strName
	                       + this.strNewLine
						   + this.strNewLine
						   + " 金额               存期"
						   + this.strNewLine
	                       + " "+TransAmount + "        " + productType
	                       + this.strNewLine
						   + this.strNewLine
			               + " 利率               到期日"
			               + this.strNewLine
			               + " "+ top.pool.get("intRate").substring(1)+"%" + "            " + top.pool.get("endDate")
			               + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   	   /*凭条模板-借记卡密码重置*/
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
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine 
	                       + " "+new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',13)+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           " + top.pool.get("ChPWDType") + "号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum;
						   
			//身份证姓名
			var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr('',8);
			//身份证号
			//var IDNo   = new top.StringCtrl(top.pool.get("strIDCardNum")).suffixStr('',18);
			if(IDName != null && IDName.length > 0){
				//解决中文长度问题
				for (var i=IDName.length*2; i<20; i++){
					IDName = IDName + " ";
				}
				//IDNo = IDNo.substr(0,8) + "********" + IDNo.substr(16);
				this.strContain	+= this.strNewLine
							   + this.strNewLine
							   + " 户名     " 
							   + this.strNewLine
							   + " *" + IDName.substring(1);
							      
			}
			
	       //凭条尾部内容
	       this.strContain 	+= this.strNewLine
							+ this.strNewLine
							+" "+top.exchxmlasync.strTermRetDesc
							+ this.strNewLine
							+ this.strContainFoot;
	   }
		
	   /*网银凭条注销*/
       this.printTemplate14 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8); 		  
		  //新增卡号
		  var panNum2 = new top.StringCtrl(top.pool.get("strPan")).suffixStr('',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+top.trans.convertTransType(top.pool.get("strTransCode"))+"       "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           "
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum 
						   + this.strNewLine
			               + this.strNewLine
						   + " 户名 "
						   + this.strNewLine
			               + " *" + IDName.substring(1)
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*手机银行新增模板*/
       this.printTemplate15 = function()
	   {
		  //签约卡号
      	  var panNum = new top.StringCtrl(top.pool.get("strfirstPan")).suffixStr(' ',19);
    
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 		  
		  //新增卡号
		  var panNum2 = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+top.trans.convertTransType(top.pool.get("strTransCode"))+"    "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           签约卡号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 新增卡号"
						   + this.strNewLine
			               + " "+panNum2 
						   + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	  /*手机银行删除凭条模板*/
       this.printTemplate16 = function()
	   {
		  //签约卡号
          var panNum = new top.StringCtrl(top.pool.get("strSignPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //删除卡号
		  var panNum2 = new top.StringCtrl(top.pool.get("strDelePan")).suffixStr(' ',19);
          if (panNum2 != null && panNum2 != "" && panNum2.length > 5){
              panNum2 = panNum2.substr(0, panNum2.length-5) + "****" + panNum2.charAt(panNum2.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+ top.pool.get("strTransCode") +"   "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           签约卡号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 删除卡号"
						   + this.strNewLine
			               + " "+panNum2 
						   + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
		
	   /*打印吞卡模板凭条并退给客户*/
       this.printCapturedTemplate = function()
	   {
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           " 
		                   + this.strNewLine
	                       + " 吞卡"
	                       + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + this.strNewLine;
	      //凭条尾部内容
	      this.strContain +=" 吞卡"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*跨行-本行转账凭条模板*/
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
				//转出户名
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
			    top.pool.set("TransType","普通");
			}
			if(top.pool.get("radioValue") != "" && top.pool.get("radioValue") != null && top.pool.get("radioValue") == "Z1"){
				top.pool.set("TransType","实时");
			}
			var IsFee = "";
			if(top.pool.get("strTransCode") == "903201"){
				IsFee = "手续费"
				strFeeYuan = top.pool.get("strFeeYuan");
			}else{
				IsFee = "";
				strFeeYuan = "";
			}
			var TransType = top.pool.get("TransType");
			
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
						 
		  //凭条正文内容			  
		  this.strContain += " 交易类别              交易流水" 
		                   + this.strNewLine
	                       + " "+new top.StringCtrl(top.pool.get("strTfrName")).suffixStr(' ',15)+"   "+top.pool.get("TransCodeWater")+"  "
	                       + this.strNewLine
						   + " 转入账号"
						   + this.strNewLine
	                       + " "+ destPanNum19
						   + this.strNewLine
						   + " 转入户名"
						   + this.strNewLine
						   + " "+ StrPanNameToSign
						   + this.strNewLine
						   + " 转出账号"
						   + this.strNewLine
	                       + " "+ panNum19
						   + this.strNewLine
						   + " 转出户名"
						   + this.strNewLine
	                       + " "+ PayerCustName
						   + this.strNewLine
						   + " 交易金额     "+IsFee + "    转账方式"
						   + this.strNewLine
	                       + " "+ TransAmount + " " + strFeeYuan + "      "+ TransType
						   + this.strNewLine
						   + " 用途 "
						   + this.strNewLine
	                       + " "+ top.pool.get("transUseSelect")
	                       + this.strNewLine
						   + this.strNewLine;
						   
	      //凭条尾部内容
	      this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
						  
	   }
	   
	   /*网银凭条模板-短信通维护*/
       this.printTemplate18 = function()
	   {
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',8);
		  //解决中文长度问题
		  for (var i=TransCode.length*2; i<17; i++)
				TransCode = TransCode + " ";
		 // var IDName = new top.StringCtrl(top.pool.get("strName")).suffixStr('',8);
		  //签约卡号
		 // var panNum = new top.StringCtrl(top.pool.get("cardPassbookNo")).suffixStr('',19);
            var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr('',19);
  
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 

		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 签约手机号"+"          "+"起点金额"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone")+"         " + top.pool.get("openLimitAmount")
						   + this.strNewLine
						   + this.strNewLine
						   + " 是否显示余额"
						   + this.strNewLine
						   + " " + (top.pool.get("isShowBalance")=="1"?"是":"否")
						   + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*外汇凭条*/
       this.printTemplate19 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',15)+""+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   +" 姓名               成交汇率"
						   +this.strNewLine
						   +" *"+IDName.substring(1)+"          "+top.pool.get("takeDownExchRate")
						   +this.strNewLine
						   + " 买入币种           买入金额"
						   + this.strNewLine
	                       + " "+top.pool.get("strCurrency") +"  " + "               " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
	                       
						   + this.strNewLine
						   + " 卖出币种           卖出金额"
						   + this.strNewLine
	                       + " CNY  "+ "               " + top.pool.get("transAmt")
	                       
						   + this.strNewLine
						   ;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*结汇凭条*/
       this.printTemplate20 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',15)+""+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   +" 姓名               成交汇率"
						   +this.strNewLine
						   +" *"+IDName.substring(1)+"          "+top.pool.get("takeDownExchRate")
						   +this.strNewLine
						   + " 买入币种           买入金额"
						   + this.strNewLine
	                       + " CNY  " + "               " + top.pool.get("exchangeSettleAmt")
	                    
						   + this.strNewLine
						   + " 卖出币种           卖出金额"
						   + this.strNewLine
	                       + " "+top.pool.get("strCurrency") +"  "+ "               " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
	                       
						   + this.strNewLine
						   ;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*外汇买卖凭条*/
       this.printTemplate21 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).suffixStr(' ',15)+""+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   +" 姓名               成交汇率"
						   +this.strNewLine
						   +" *"+IDName.substring(1)+"          "+top.pool.get("exchRate")
						   +this.strNewLine
						   + " 买入币种           买入金额"
						   + this.strNewLine
	                       + " "+top.pool.get("BuyCurr") +"  "+ "               " + top.pool.get("buyAmt")
	                       
						   + this.strNewLine
						   + " 卖出币种           卖出金额"
						   + this.strNewLine
	                       + " "+top.pool.get("SellCurr") +"  "+ "               " + top.pool.get("sellAmt")
	                       
						   + this.strNewLine
						   ;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*ATM转账模板*/
       this.printTemplate22 = function()
	   {
    	  var TransCode = new top.StringCtrl("ATM转账").suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能           交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +"  "+top.pool.get("JJKQYTsn")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " 每日累计转出限额"
						   + this.strNewLine
	                       + " 50000.00"
	                       + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("JJKQYRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*移动终端ATM转账模板*/
       this.printTemplate22MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  上海农商银行客户通知单 "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24小时客服热线:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"上海农商银行网站:"+this.strNewLine+" WWW.SRCB.COM"; 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " 机器终端号"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能       机构代码" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 交易流水"
						   + this.strNewLine
	                       + " "+top.pool.get("JJKQYTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 银行账号"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 每日累计转出限额"
						   + this.strNewLine
	                       + " 50000.00"
	                       + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("JJKQYRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*小额免密模板*/
       this.printTemplate23 = function()
	   {
    	  var TransCode = new top.StringCtrl("小额免密支付").suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能             交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.pool.get("XEMMTsn")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码             银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "                " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " 单笔免密限额         单日累计限额"
						   + this.strNewLine
	                       + " 300.00" +"               "+"1000.00"+"  "
	                       + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("XEMMRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*移动终端小额免密模板*/
       this.printTemplate23MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  上海农商银行客户通知单 "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24小时客服热线:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"上海农商银行网站:"+this.strNewLine+" WWW.SRCB.COM"; 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " 机器终端号"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能          机构代码" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 交易流水"
						   + this.strNewLine
	                       + " "+top.pool.get("XEMMTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 银行账号"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 单笔免密限额"
						   + this.strNewLine
	                       + " 300.00" + "  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 单日累计限额"
						   + this.strNewLine
	                       + " 1000.00"+"  "
	                       + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("XEMMRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
       /*第三方快捷支付模板*/
       this.printTemplate24 = function()
	   {
    	  var TransCode = new top.StringCtrl("第三方快捷支付").suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能               交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +" "+top.pool.get("DSFKJTsn")+"  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " 手机号" 
		                   + this.strNewLine
	                       + " "+ top.pool.get("strPhone")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("DSFKJRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*移动终端第三方快捷支付模板*/
       this.printTemplate24MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',11);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  this.strContainHead= "  上海农商银行客户通知单 "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24小时客服热线:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"上海农商银行网站:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " 机器终端号"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能          机构代码" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 交易流水"
						   + this.strNewLine
	                       + " "+top.pool.get("DSFKJTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 银行账号"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 手机号" 
		                   + this.strNewLine
	                       + " "+ top.pool.get("strPhone")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("DSFKJRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*短信通知模板*/
       this.printTemplate25 = function()
	   {
    	  var TransCode = new top.StringCtrl("短信通").suffixStr(' ',15);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能           交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.pool.get("DXTZTsn") + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " 手机号             是否显示余额"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone") + "        是"
						   + this.strNewLine
						   + this.strNewLine
						   + " 起点金额"
						   + this.strNewLine
			               + " 0.00"
						   + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("DXTZRet") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*移动终端短信通知模板*/
       this.printTemplate25MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',14);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  上海农商银行客户通知单 "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24小时客服热线:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"上海农商银行网站:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " 机器终端号"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能         机构代码"
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 交易流水"
						   + this.strNewLine
	                       + " "+top.pool.get("DXTZTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 银行账号"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 手机号         是否显示余额"
						   + this.strNewLine
			               + " " + top.pool.get("strPhone") + "    是"
						   + this.strNewLine
						   + this.strNewLine
						   + " 起点金额"
						   + this.strNewLine
			               + " 0.00"
						   + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("DXTZRet") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*手机银行模板*/
       this.printTemplate26 = function()
	   {
    	  var TransCode = new top.StringCtrl("手机银行").suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能              交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +"   "+top.pool.get("SJYHTsn")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " 手机号"
						   + this.strNewLine
	                       + " "+top.pool.get("strPhone")
	                       + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("SJYHRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*移动终端手机银行模板*/
       this.printTemplate26MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',14);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  上海农商银行客户通知单 "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24小时客服热线:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"上海农商银行网站:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " 机器终端号"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能          机构代码" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 交易流水"
						   + this.strNewLine
	                       + " "+top.pool.get("SJYHTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 银行账号"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 手机号"
						   + this.strNewLine
	                       + " "+top.pool.get("strPhone")
	                       + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("SJYHRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
       /*个人网银模板*/
       this.printTemplate27 = function()
	   {
    	  var TransCode = new top.StringCtrl("个人网银").suffixStr(' ',15);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  
		  if(top.pool.get("LocalUkeyNum") != "" && top.pool.get("LocalUkeyNum") != null) {
			//凭条正文内容			  
			  this.strContain += " 签约功能              交易流水" 
			                   + this.strNewLine
		                       + " "+ TransCode +"   "+top.pool.get("WYZSBTsn")+"  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " 机构代码           银行账号"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "              " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				         	   + " 手机号              版本"
							   + this.strNewLine
				               + " " + top.pool.get("strPhone") + "         " + top.pool.get("strVersion")
							   + this.strNewLine
							   + this.strNewLine
				         	   + " 工本费"
							   + this.strNewLine
				               + " " + top.pool.get("strUkeyPrice") + "元"
							   + this.strNewLine
							   + this.strNewLine;
		  }else {
			//凭条正文内容			  
			  this.strContain += " 签约功能              交易流水" 
			                   + this.strNewLine
		                       + " "+ TransCode +"   "+top.pool.get("WYZSBTsn")+"  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " 机构代码           银行账号"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "              " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				         	   + " 手机号              版本"
							   + this.strNewLine
				               + " " + top.pool.get("strPhone") + "         " + top.pool.get("strVersion")
							   + this.strNewLine
							   + this.strNewLine;
		  }
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("WYZSBRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*移动终端个人网银模板*/
       this.printTemplate27MV = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',13);
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  this.strContainHead= "  上海农商银行客户通知单 "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24小时客服热线:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"上海农商银行网站:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " 机器终端号"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
		  
		  //凭条正文内容			  
		  this.strContain += " 签约功能          机构代码" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 交易流水"
						   + this.strNewLine
	                       + " "+top.pool.get("WYZSBTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 银行账号"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
				           + " 手机号         版本"
						   + this.strNewLine
				           + " " + top.pool.get("strPhone") + "    " + top.pool.get("strVersion")
						   + this.strNewLine
						   + this.strNewLine;
		  
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("WYZSBRet")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
       /*开卡模板*/
       this.printTemplate28 = function()
	   {
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+TransCode+"  "+top.pool.get("strOpenCardTsn")+"  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 卡产品             工本费"
			               + this.strNewLine
			               + " " + top.pool.get("cardName") + "             " + top.pool.get("strCardPrice") + "元"
			               + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.pool.get("strOpenCardDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*卡激活模板*/
       this.printTemplate29 = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " "+new top.StringCtrl("交易类别").suffixStr(' ',8)+"       交易流水" 
		                   + this.strNewLine
	                       + " "+TransCode+"    "+top.pool.get("strCardActiveTsn")+"  "
	                       + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + this.strNewLine;
	      //凭条尾部内容
	      this.strContain += " "+top.pool.get("strCardActiveDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
/*移动终端卡激活模板*/
       this.printTemplate29MV = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  this.strContainHead= "  上海农商银行客户通知单 "+this.strNewLine+this.strNewLine;
		  this.strContainFoot= " 24小时客服热线:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+"上海农商银行网站:"+this.strNewLine+" WWW.SRCB.COM";
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
	                      + this.strNewLine
						  + this.strNewLine
						  + " 机器终端号"
						  + this.strNewLine
						  + " "+top.terminal.strTerminalNum
						  + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能          机构代码" 
		                   + this.strNewLine
	                       + " "+ TransCode +" " + top.terminal.strOrgNum + "  "
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 交易流水"
						   + this.strNewLine
	                       + " "+top.pool.get("strCardActiveTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 银行账号"
						   + this.strNewLine
						   + " "+panNum
						   + this.strNewLine
						   + this.strNewLine
	      //凭条尾部内容
	      this.strContain += " "+top.pool.get("strCardActiveDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
	/*打印吞存单模板凭条并退给客户*/
       this.printTemplate30 = function()
	   {
		  var IDName =  new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = top.pool.get("strCDSNum");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           " 
		                   + this.strNewLine
	                       + " 吞存单"
	                       + this.strNewLine
						   + " 机构代码           存单账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   +" 姓名"
						   +this.strNewLine
						   +" *"+IDName.substring(1)
						   + this.strNewLine
						   + this.strNewLine;
	      //凭条尾部内容
	      this.strContain +=" 吞存单"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*打印存单故障模板凭条并退给客户*/
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
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("transName")+"           "+top.pool.get("strOrigstrTxSerialNo")
	                       + this.strNewLine
						   + " 机构代码    "
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum
	                       + this.strNewLine
						   +" 存单账号                 户名"
						   +this.strNewLine
						   +" "+new top.StringCtrl(panNum).suffixStr(' ',25) +" *" + IDName.substring(1)
						   + this.strNewLine
						   +" 存单凭证号"
						   +this.strNewLine
						   +" "+top.pool.get("strCDCertNum")
						   + this.strNewLine
						   + this.strNewLine;
	      //凭条尾部内容
	      this.strContain +=" "+top.pool.get("strErroInfo")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	 /*销户叫号凭条模板*/
       this.printTemplate32 = function()
	   {
		  //代理人
		  var AgentIDName = "";
		  var AgentIDCardNum = "";
		  var type = "身份证";
		  AgentIDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr('',8);
		  AgentIDName = "*"+AgentIDName.substring(1);
		  AgentIDCardNum = top.pool.get("strIDCardNum");
		  AgentIDCardNum = AgentIDCardNum.substr(0, AgentIDCardNum.length-5) + "****" + AgentIDCardNum.charAt(AgentIDCardNum.length-1);	
		  
		  var strAmount =  new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"));
		  strAmount = new top.StringCtrl(strAmount).suffixStr(' ',22);	  
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  		  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("strTransName")+"    "+"       "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + " 机构代码           "
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum 
	                       + this.strNewLine
						   + this.strNewLine
						   + " 姓名"
						   + this.strNewLine
	                       + " "+AgentIDName
						   + this.strNewLine
	                       + this.strNewLine
						   + " 证件类型"
						   + this.strNewLine
	                       + " "+ type
	                       + this.strNewLine
						   + this.strNewLine
						   + " 证件号"
						   + this.strNewLine
	                       + " "+AgentIDCardNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 交易金额              排队号"
			               + this.strNewLine
			               + " "+ strAmount + top.pool.get("strQueueNo")
			               + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }  
	   /*凭条模板*/
       this.printTemplate33 = function()
	   {
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  var panNum = top.pool.get("strPan");
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别               交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("transName")+"     "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   +" 姓名"
						   +this.strNewLine
						   +" *"+IDName.substring(1)
						   + this.strNewLine
			               + " 交易金额       "
			               + this.strNewLine
			               + " " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*凭条模板*/
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
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别             交易流水" 
		                   + this.strNewLine
	                       + " "+TransCode+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码             银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "                " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " " + new top.StringCtrl("代扣公司").formatStrRight(" ",21) +"姓名 "
						   + this.strNewLine
			               + " " + new top.StringCtrl(top.pool.get("strCompanCNName")).formatStrRight(" ",21) + "*" + IDName.substring(1)
						   + this.strNewLine
			         		+ this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*充值凭条模板*/
       this.printTemplate35 = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.pool.get("transName")).formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别            交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码            银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 交易金额       "
			               + this.strNewLine
			               + " " + new top.StringCtrl("").formatStrAmount(top.pool.get("Amount"))
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " 交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*解挂凭条模板*/
       this.printTemplate36 = function()
	   {		  
		  var panNum = top.pool.get("strTransAcc");
		  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
		  
		  var TransCode = new top.StringCtrl(top.pool.get("transName")).formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别            交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码            银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 户名       "
			               + this.strNewLine
			               + " " +" *"+IDName.substring(1)
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " " +top.pool.get("strUnlockDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*卡挂失凭条模板*/
       this.printTemplate37 = function()
	   {		  
		  var panNum = top.pool.get("strLossPan");
		  var IDName = top.pool.get("strIDName");
		  for (var i=IDName.length*2; i<20; i++){
			IDName = IDName + " ";
		  }
		  
		  var TransCode = new top.StringCtrl("借记卡挂失").formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别            交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码            挂失卡号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 户名                手续费"
			               + this.strNewLine
			               + "  *" + IDName.substring(1)+ top.pool.get("strAmtFee") + "元"
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " 交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*定制卡挂失补卡凭条模板*/
       this.printTemplate38 = function()
	   {		  
		  var panNum = top.pool.get("strLossPan");
		  var IDName = top.pool.get("strIDName");
		  for (var i=IDName.length*2; i<20; i++){
			IDName = IDName + " ";
		  }
		  var cardType = "";
		  var cardPrice;
		  if(top.pool.get("productType") == "上海工会会员服务卡（IC）") {
			  cardType ="工会卡";
			  cardPrice = new top.StringCtrl(top.pool.get("strCardPrice") + "元").suffixStr(' ',8);
		  }else if(top.pool.get("productType").indexOf("敬老卡") != -1){
			  cardType ="敬老卡";
			  cardPrice =new top.StringCtrl("0元").suffixStr(' ',8);
		  }
		  var TransCode = new top.StringCtrl("借记卡挂失补卡").formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  
		  if(top.pool.get("strFillDesc") == "补卡成功") {
			  //凭条正文内容			  
			  this.strContain += " 交易类别            交易流水" 
			                   + this.strNewLine
		                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " 机构代码            挂失卡号"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "               " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				               + " 户名                手续费"
				               + this.strNewLine
				               + "  *" + IDName.substring(1) + top.pool.get("strAmtFee") + "元"
				               + this.strNewLine
				               + this.strNewLine
				               + " 工本费              领卡机构"
				               + this.strNewLine
				               + " " + cardPrice + "           " + top.pool.get("strCardBranchName")
				               + this.strNewLine
				               + this.strNewLine
				               + " 定制卡类型"
				               + this.strNewLine
				               + " "+ cardType
				               + this.strNewLine
				               + this.strNewLine
				               + this.strNewLine;
		  }else {
			  //凭条正文内容			  
			  this.strContain += " 交易类别            交易流水" 
			                   + this.strNewLine
		                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " 机构代码            挂失卡号"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "               " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				               + " 户名                手续费"
				               + this.strNewLine
				               + "  *" + IDName.substring(1) + top.pool.get("strAmtFee") + "元"
				               + this.strNewLine
				               + this.strNewLine
				               + this.strNewLine;
		  }
		  
	       //凭条尾部内容
	       this.strContain += " " +top.pool.get("strCardLossDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }	
       /*预制卡挂失补卡凭条模板*/
       this.printTemplate39 = function()
	   {		  
		  var panNum = top.pool.get("strLossPan");
		  var IDName = top.pool.get("strIDName");
		  var panNumNew = top.pool.get("strPan");
		  for (var i=IDName.length*2; i<20; i++){
			IDName = IDName + " ";
		  }
		  var TransCode = new top.StringCtrl("借记卡挂失补卡").formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
          if (panNumNew != null && panNumNew != "" && panNumNew.length > 5){
        	  panNumNew = panNumNew.substr(0, panNumNew.length-5) + "****" + panNumNew.charAt(panNumNew.length-1);
	      }
          var cardPrice = new top.StringCtrl(top.pool.get("strCardPrice") + "元").suffixStr(' ',8);
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		
		  if(top.pool.get("strFillDesc") == "补卡成功") {
			  //凭条正文内容			  
			  this.strContain += " 交易类别            交易流水" 
			                   + this.strNewLine
		                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " 机构代码            挂失卡号"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "               " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				               + " 户名                手续费"
				               + this.strNewLine
				               + "  *" + IDName.substring(1) + top.pool.get("strAmtFee") + "元"
				               + this.strNewLine
				               + this.strNewLine
				               + " 工本费              新卡卡号"
				               + this.strNewLine
				               + " " + cardPrice + "           " + panNumNew
				               + this.strNewLine
				               + this.strNewLine
				               + " 预制卡类型"
				               + this.strNewLine
				               + " " + top.pool.get("cardName")
				               + this.strNewLine
				               + this.strNewLine
				               + this.strNewLine;
		  }else {
			  //凭条正文内容			  
			  this.strContain += " 交易类别            交易流水" 
			                   + this.strNewLine
		                       + " "+ TransCode + top.pool.get("ReportLossSerialNo") + "  "
		                       + this.strNewLine
							   + this.strNewLine
							   + " 机构代码            挂失卡号"
							   + this.strNewLine
		                       + " "+top.terminal.strOrgNum + "               " + panNum
		                       + this.strNewLine
							   + this.strNewLine
				               + " 户名                手续费"
				               + this.strNewLine
				               + "  *" + IDName.substring(1) + top.pool.get("strAmtFee") + "元"
				               + this.strNewLine
				               + this.strNewLine
				               + this.strNewLine;
		  }
		  
	       //凭条尾部内容
	       this.strContain += " " +top.pool.get("strCardLossDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*存单折挂失凭条模板*/
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
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别            交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.pool.get("ReportLossSerialNo")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码            所属账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 户名                凭证号"
			               + this.strNewLine
			               + "  *" + IDName.substring(1) + top.pool.get("strVoucherNo")
			               + this.strNewLine
			               + this.strNewLine
			               + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " 交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*ATM转账模板 --单独签约*/
       this.printTemplate41 = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能             交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +top.pool.get("JJKQYTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " 每日累计转出限额"
						   + this.strNewLine
	                       + " "+top.pool.get("strDayLimitAmount")
	                       + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " 交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
      // 缴费凭条模版
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
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容		  
		  this.strContain += " 交易类别             交易流水" 
		                   + this.strNewLine
	                       + " "+transName+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码             银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "                " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " " + new top.StringCtrl("代扣公司").formatStrRight(" ",21) +""
						   + this.strNewLine
			               + " " + top.pool.get("strCompany")
						   + this.strNewLine
						   + this.strNewLine
						   + " 用户编号   "
						   + this.strNewLine
						   + " " + top.pool.get("UserNum")
						   + this.strNewLine
						   + this.strNewLine
						   + " " + "缴费金额 "
			         	   + this.strNewLine
			         	   + " " + PayAmount
			         	   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
	   /*自动还款约定凭条模板*/
       this.printTemplate44 = function()
	   {
		  var panNum = top.pool.get("strPan");
		  var TransCode = new top.StringCtrl(top.trans.convertTransType(top.pool.get("strTransCode"))).formatStrRight(" ",22);
		  if(top.pool.get("servcdSelect") == "C3" && top.pool.get("strTransCode") == "904206"){
			  TransCode = new top.StringCtrl("自动购汇还款取消").formatStrRight(" ",22);
		  }
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  var panNumSub = top.pool.get("SuccPan");
		  if (panNumSub != null && panNumSub != "" && panNumSub.length > 5){
              panNumSub = panNumSub.substr(0, panNumSub.length-5) + "****" + panNumSub.charAt(panNumSub.length-1);
			  panNumSub = new top.StringCtrl(panNumSub).formatStrRight(" ",22);
	      } 
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别              交易流水" 
		                   + this.strNewLine
	                       + " "+TransCode+top.exchxmlasync.msgxmldomResp.getElementValue("F11")+"  "
	                       + this.strNewLine
						   + " 机构代码              信用卡号"
						   + this.strNewLine
	                       + " "+new top.StringCtrl(top.terminal.strOrgNum).formatStrRight(" ",22) + panNum
	                       + this.strNewLine
						   + " 活期卡号              客户名"
						   + this.strNewLine
						   + " "+ panNumSub + "*" + top.pool.get("strRespIDName").substring(1)
						   + this.strNewLine
						   + " 还款方式"
						   + this.strNewLine
						   + " "+ top.pool.get("ReypayType")
						   + this.strNewLine
						   + this.strNewLine;
	      //凭条尾部内容
	      this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*凭条模板-活期转定期*/
       this.printTemplate45 = function()
	   {
		  var strName = new top.StringCtrl(top.pool.get("strName")).suffixStr(' ',8);
		  var TransAmount = new top.StringCtrl(top.pool.get("Amount")).suffixStr(' ',12);
		  var productType = top.pool.get("strDqTime");

		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别              交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("TransCode")+"        "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 卡号                  户名"
						   + this.strNewLine
	                       + " "+ panNum + "   " + strName
	                       + this.strNewLine
						   + this.strNewLine
						   + " 金额                  存期"
						   + this.strNewLine
	                       + " "+TransAmount + "          " + productType
	                       + this.strNewLine
						   + this.strNewLine
			               + " 利率 "
			               + this.strNewLine
			               + " "+ top.pool.get("IntRate") + "%"
			               + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   /*凭条模板-定期转活期*/
       this.printTemplate46 = function()
	   {
		  var strName = new top.StringCtrl(top.pool.get("strName")).suffixStr(' ',8);
		  var TransAmount = new top.StringCtrl(top.pool.get("Amount")).suffixStr(' ',12);
		  var productType = top.pool.get("productSubType");

		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别              交易流水" 
		                   + this.strNewLine
	                       + " "+top.pool.get("TransCode")+"        "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 卡号                  户名"
						   + this.strNewLine
	                       + " "+ panNum + "   " + strName
	                       + this.strNewLine
						   + this.strNewLine
						   + " 金额                  存期"
						   + this.strNewLine
	                       + " "+TransAmount + "          " + productType
	                       + this.strNewLine
						   + this.strNewLine
			               + " 利率 "
			               + this.strNewLine
			               + " "+ top.pool.get("intRate")
			               + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+top.exchxmlasync.strTermRetDesc
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
       /*第三方快捷支付-手机号维护模板*/
       this.printTemplate47 = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',14);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能           交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode+top.pool.get("DSFKJTsn")
	                       + this.strNewLine
	                       + " " +"手机号维护"
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
			               + " 手机号 "
						   + this.strNewLine
			               + " "+top.pool.get("strPhone")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+"交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*小额免密限额模版*/
       this.printTemplate48 = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',15);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
		  var transLimitAmt = new top.StringCtrl(top.pool.get("transLimitAmt")).suffixStr(' ',6);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能             交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode + top.pool.get("XEMMTsn")+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码             银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "                " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " 单笔免密限额         单日累计限额"
						   + this.strNewLine
						   + " "+transLimitAmt +"               "+top.pool.get("dayTransLimitAmt")
	                       + this.strNewLine
						   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+"交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
  	    /*借记卡换卡凭条模板*/
       this.printTemplate49 = function()
	   {		  
		  var panNum = top.pool.get("strExchangePan");
		  var TransCode = new top.StringCtrl("借记卡换卡").formatStrRight(" ",20);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
          var newpanNum = top.pool.get("strPan")
          if (newpanNum != null && newpanNum != "" && newpanNum.length > 5){
        	  newpanNum = newpanNum.substr(0, newpanNum.length-5) + "****" + newpanNum.charAt(newpanNum.length-1);
	      }
          var cardPrice = new top.StringCtrl(top.pool.get("strCardPrice") + "元").suffixStr(' ',8);
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
		  if(top.pool.get("isUnionCard") == "1") {
			  //定制卡凭条正文内容			  
			  this.strContain +=" 交易类别            交易流水" 
				              + this.strNewLine
				              + " "+ TransCode + top.pool.get("exchangeCardSerialNo") 
			                  + this.strNewLine
							  + this.strNewLine
							  + " 机构代码            领卡机构"
							  + this.strNewLine
		                      + " "+top.terminal.strOrgNum + "               " + top.pool.get("strCardBranchName")
			                  + this.strNewLine
							  + this.strNewLine
					          + " 旧卡卡号"
					          + this.strNewLine
					          + " " + panNum
					          + this.strNewLine
					          + this.strNewLine
					          + " 工本费"
					          + this.strNewLine
					          + " " + cardPrice
					          + this.strNewLine;
			  				  + this.strNewLine; 
		  }else{
			  //预制卡凭条正文内容			  
			  this.strContain +=" 交易类别            交易流水" 
				              + this.strNewLine
				              + " "+ TransCode + top.pool.get("exchangeCardSerialNo") 
			                  + this.strNewLine
							  + this.strNewLine
							  + " 机构代码            领卡机构"
							  + this.strNewLine
		                      + " "+top.terminal.strOrgNum + "               " + top.pool.get("strCardBranchName")
			                  + this.strNewLine
							  + this.strNewLine
					          + " 旧卡卡号"
					          + this.strNewLine
					          + " " + panNum
					          + this.strNewLine
					          + this.strNewLine
					          + " 新卡卡号"
					          + this.strNewLine
					          + " "+ newpanNum
					          + this.strNewLine
					          + this.strNewLine
					          + " 工本费"
					          + this.strNewLine
					          + " " + cardPrice
					          + this.strNewLine;
			  				  + this.strNewLine;  
			  
		  }
		  
	       //凭条尾部内容
	       this.strContain += " " +top.pool.get("strExchangeCardDesc")
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*第三方快捷支付-限额管理模板*/
       this.printTemplate50 = function()
	   {
    	  var TransCode = new top.StringCtrl(top.pool.get("transName")).suffixStr(' ',12);
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
		  var strDayTransLimitAmt = new top.StringCtrl(top.pool.get("strDayTransLimitAmt")).suffixStr(' ',10);
		  var strTransLimitAmt = new top.StringCtrl(top.pool.get("strTransLimitAmt")).suffixStr(' ',10);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 签约功能           交易流水" 
		                   + this.strNewLine
	                       + " "+ TransCode +top.pool.get("XEGLTsn")
	                       + this.strNewLine
	                       + " "+ "限额管理"
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 机构代码           银行账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
	                       + this.strNewLine
						   + this.strNewLine
						   + " 单日累计支付限额       单月累计支付限额" 
		                   + this.strNewLine
	                       + " "+ strDayTransLimitAmt +"             "+top.pool.get("strMonthLimith")
	                       + this.strNewLine
						   + this.strNewLine
			               + " 单笔支付限额           支付类型"
						   + this.strNewLine
			               + " "+strTransLimitAmt +"             "+top.pool.get("strPayTypeName")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+"交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       //社保卡申领
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
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                             
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类型                交易流水" 
		                   + this.strNewLine
	                       + " "+ "社保卡申领" +"              "+ top.exchxmlasync.msgxmldomResp.getElementValue("F11")
	                       + this.strNewLine
				           + " 姓名                    手机号码"
				           + this.strNewLine
				           + " *" + top.pool.get("strIDName").substring(1) + "                   " +phoneNumVal
				           + this.strNewLine
				           + " 证件号码"
						   + this.strNewLine
				           + " "+strIDCardNum
						   + this.strNewLine
				    	   + " 指定投递地址"
						   + this.strNewLine
				           + " "+top.pool.get("sendAddress")
				           + this.strNewLine
				    	   + " 备选自领社区网点"
						   + this.strNewLine
				           + " "+top.pool.get("countryMessageText")
		  				   + this.strNewLine
		  				   + this.strNewLine;
					
	       //凭条尾部内容
	       this.strContain += " "+"交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
 //社保卡申领
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
    	  this.strContainHead= "  上海农商银行客户通知单 "+this.strNewLine+this.strNewLine;
 		  this.strContainFoot= " 24小时客服热线:"+this.strNewLine+" 021-962999 4006962999"+this.strNewLine+" 上海农商银行网站:"+this.strNewLine+" WWW.SRCB.COM";
           
 		  //凭条抬头内容
 		  this.strContain = this.strContainHead
 	                      + this.strNewLine
                          + " 交易日期       时间" 
 				          + this.strNewLine
 	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()
 	                      + this.strNewLine
 						  + this.strNewLine
 						  + " 机器终端号"
 						  + this.strNewLine
 						  + " "+top.terminal.strTerminalNum
 						  + this.strNewLine
 				          + this.strNewLine;
 				
 		  //凭条正文内容			  
		  this.strContain += " 交易类型           姓名" 
		                   + this.strNewLine
	                       + " "+ "社保卡申领" +"        "+" *" + top.pool.get("strIDName").substring(1)
	                       + this.strNewLine
	                       + " 交易流水"
	                       + this.strNewLine
	                       + " "+top.exchxmlasync.msgxmldomResp.getElementValue("F11")
				           + this.strNewLine
				           + " 手机号码"
				           + this.strNewLine
				           + " "+phoneNumVal
				           + this.strNewLine
				           + " 证件号码"
						   + this.strNewLine
				           + " "+strIDCardNum
						   + this.strNewLine
				    	   + " 指定投递地址"
						   + this.strNewLine
				           + " "+top.pool.get("sendAddress")
				           + this.strNewLine
				    	   + " 备选自领社区网点"
						   + this.strNewLine
				           + " "+top.pool.get("countryMessageText")
		  				   + this.strNewLine
		  				   + this.strNewLine;
					
	       //凭条尾部内容
	       this.strContain += " "+"交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   	   
	   /*取款凭条模板*/
       this.printTemplateWithDrawSucc = function()
	   {
    	  var WithDrawType = new top.StringCtrl("取款交易").suffixStr(' ',15);
		  var panNum = top.pool.get("DrawPan");
		  var strWithDrawAmount = new top.StringCtrl(new top.StringCtrl(top.pool.get("AmountCheck")).formatNumber(2)).suffixStr(' ',19);// 2018-1-10 金额格式化到小数点后两位
		  var MultiWithDrawAmount = new top.StringCtrl(new top.StringCtrl(top.pool.get("MultiWithDrawAmount")).formatNumber(2)).suffixStr(' ',19);
          if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      } 
		  //2018-1-12 增加剩余已出金额判断 交易成功后不显示
		  var DrawAmtInfoNewLine = this.strNewLine + this.strNewLine;
		  var WithDrawAmtInfoTitle = " 剩余未出钞金额     已完成出钞金额" + this.strNewLine;
		  var strWithDrawAmtInfoTitle = MultiWithDrawAmount + new top.StringCtrl(top.pool.get("strWithDrawSuccAmount")).formatNumber(2);
		  if(top.pool.get("DrawTransResult") == "交易成功"){
			  WithDrawAmtInfoTitle = "";
			  strWithDrawAmtInfoTitle = ""
			  DrawAmtInfoNewLine = "";
		  }
		  
		  var AgentName = "";
		  var strAgentName = "";
		  if(top.pool.get("IDCardAcceptFlag") == "2"){
			  AgentName = "代理人姓名";
			  strAgentName = "*" + top.pool.get("DrawAgentName").substring(1) + this.strNewLine + this.strNewLine;// 2018-1-8 办理人姓名隐藏
		  }
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+ WithDrawType + top.pool.get("strWithDrawTransJun")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           卡号/账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 取款金额           户名" 
		                   + this.strNewLine
	                       + " "+ strWithDrawAmount + "*" + top.pool.get("strRespIDName").substring(1)
						   + DrawAmtInfoNewLine
			               + WithDrawAmtInfoTitle
			               + " "+ strWithDrawAmtInfoTitle
						   + this.strNewLine
			         	   + this.strNewLine
						   + " "+ AgentName
						   + this.strNewLine
						   + " "+ strAgentName;//2018-1-17 修改代理人无法显示bug 增加两个换行符
	       //凭条尾部内容
	       this.strContain += " "+ top.pool.get("DrawTransResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
	   
	   /*尾箱取款凭条模板*/
       this.printTemplateTellerWithDrawSucc = function()
	   {
			var WithDrawType = new top.StringCtrl("柜员取款").suffixStr(' ',19);
			//交易总金额
			var strWithDrawAmount = new top.StringCtrl("").formatStrAmount(top.pool.get("TransAmount")) + " 元";
			//100元已出金额
			var strDrawSuccHunAmount = new top.StringCtrl(parseInt(top.pool.get("strDrawSuccHunCount")) + " 张").suffixStr(' ',15);
			//100元未出金额
			var strMultiDrawHunAmount = parseInt(top.pool.get("strMultiDrawHunCount"));
			//10元已出金额
			var strDrawSuccTenAmount = new top.StringCtrl(parseInt(top.pool.get("strDrawSuccTenCount")) + " 张").suffixStr(' ',13);
			//10元未出金额
			var strMultiDrawTenAmount = parseInt(top.pool.get("strMultiDrawTenCount"));
			
			
			//凭条抬头内容
			this.strContain = this.strContainHead
				+ this.strNewLine
				+ " 交易日期       时间       机器终端号" 
				+ this.strNewLine
				+ " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
				+ this.strNewLine
				+ this.strNewLine;
				
			//凭条正文内容			  
			this.strContain += " 交易类别               交易流水" 
				+ this.strNewLine
				+ " "+ WithDrawType + top.pool.get("strWithDrawTransJun")
				+ this.strNewLine
				+ this.strNewLine
				+ " 机构代码               交易金额"
				+ this.strNewLine
				+ " "+ top.terminal.strOrgNum +"                  " + strWithDrawAmount
				+ this.strNewLine
				+ this.strNewLine
				+ " 100元已出钞张数        100元未出钞张数"
				+ this.strNewLine
				+ " "+ strDrawSuccHunAmount + "       " + strMultiDrawHunAmount + " 张"
				+ this.strNewLine
				+ this.strNewLine
				+ " 10元已出钞张数         10元未出钞张数"
				+ this.strNewLine
				+ " "+ strDrawSuccTenAmount + "         " + strMultiDrawTenAmount + " 张"
				+ this.strNewLine
				+ this.strNewLine
			
			//凭条尾部内容
			this.strContain += " "+ top.pool.get("DrawTransResult") 
				+ this.strNewLine
				+ this.strContainFoot;
	   }
	   
       
       /*存款凭条模板*/
       this.printTemplateDepositSucc = function()
	   {
    	  var DepositType = new top.StringCtrl("活期存款").suffixStr(' ',15);
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
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " " + DepositType + top.pool.get("strDepOrgTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           卡号/账号"
						   + this.strNewLine
	                       + " " + top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 办理人姓名         已存入总金额" 
		                   + this.strNewLine
	                       + " *" + strDepositName.substring(1) + top.pool.get("strTotalAmount") + ".00"
	                       + this.strNewLine
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+ top.pool.get("strDepositResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       this.printTemplateTelDepSucc = function(){
     	  var DepositType = new top.StringCtrl("柜员现金存款").suffixStr(' ',13);
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " " + DepositType + top.pool.get("strDepOrgTsn")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码"
						   + this.strNewLine
	                       + " " + top.terminal.strOrgNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 已存入总金额" 
		                   + this.strNewLine
	                       + " " +top.pool.get("strTotalAmount") + ".00"
	                       + this.strNewLine
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+ top.pool.get("strDepositResult") 
						   + this.strNewLine
						   + this.strContainFoot;    	   
       }
       this.printTemplatePupositSucc = function()
	   {
    	  var PupositType = new top.StringCtrl("对公存款").suffixStr(' ',15);
		  var PayeePanNum = top.pool.get("strPayeeAccount");//收款人账号
		  var PayerPanNum = top.pool.get("Pay_number");//解款人账号
		  var strPayee_name =top.pool.get("Payee_name");//收款人姓名
          var strPay_name =top.pool.get("Pay_name");//解款人姓名
          var Per_pid = top.pool.get("strIDCardNum");//身份证号码
		  var Per_name =  top.pool.get("strIDName");//姓名
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
		//凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " " + PupositType + top.pool.get("strDepOrgTsn")
	                       + this.strNewLine
	                       + this.strNewLine
						   + " 机构代码           已存入总金额"
						   + this.strNewLine
	                       + " " + top.terminal.strOrgNum + "              " + top.pool.get("strTotalAmount") + ".00"
						   + this.strNewLine
						   + this.strNewLine
						   + " 身份证号           办理人"  
						   + this.strNewLine 
						   +" "+ Per_pid + "   " +Per_name
						   + this.strNewLine
		                   + this.strNewLine
						   + " 收款人姓名" 
		                   + this.strNewLine
		                   + " "+ strPayee_name
		                   + this.strNewLine
		                   + this.strNewLine
		                   + " 收款人账号 " 
						   + this.strNewLine
						   + " " + PayeePanNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 解款人姓名" 
		                   + this.strNewLine
	                       + " "+strPay_name
	                       + this.strNewLine
	                       + this.strNewLine
	                       + " 解款人账号" 
						   + this.strNewLine
						   + " " + PayerPanNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 用途"
						   + this.strNewLine
						   + " " + top.pool.get("UseWay")
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+ top.pool.get("strPupositResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
       /*内部账取款凭条模板*/
       this.printTemplateCashDrawSucc = function()
	   {
    	  var WithDrawType = new top.StringCtrl(top.pool.get("strCashTransName")).suffixStr(' ',12);
		  var strDrawName = "";
		  strDrawName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',19);
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别            交易流水" 
		                   + this.strNewLine
	                       + " "+ WithDrawType + top.pool.get("strCashDrawOrgTsns")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码            姓名"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + "*" + strDrawName.substring(1)
						   + this.strNewLine
						   + this.strNewLine
						   + " 取款金额          " 
		                   + this.strNewLine
	                       + " "+ new top.StringCtrl("").formatStrAmount(top.pool.get("strCashWithDraw"))
	                       + this.strNewLine
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " 交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*内部账取款异常凭条模板*/
       this.printTemplateCashDrawErro = function()
	   {
    	   var MultiDrawAmount = new top.StringCtrl("").formatStrAmount(top.pool.get("MultiDrawAmount"));
    	   MultiDrawAmount = new top.StringCtrl(MultiDrawAmount).suffixStr(' ',19);
    	  var WithDrawType = new top.StringCtrl(top.pool.get("strCashTransName")).suffixStr(' ',12);
		  var strDrawName = "";
		  strDrawName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',19);
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别            交易流水" 
		                   + this.strNewLine
	                       + " "+ WithDrawType + top.pool.get("strCashDrawOrgTsns")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码            姓名"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + "*" + strDrawName.substring(1)
						   + this.strNewLine
						   + this.strNewLine
						   + " 取款金额          " 
		                   + this.strNewLine
	                       + " "+ new top.StringCtrl("").formatStrAmount(top.pool.get("strCashWithDraw"))
	                       + this.strNewLine
						   + this.strNewLine
			               + " 剩余未出钞金额     已完成出钞金额"
						   + this.strNewLine
			               + " "+ MultiDrawAmount + new top.StringCtrl("").formatStrAmount(top.pool.get("strDrawSuccAmount"))
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+ top.pool.get("strDrawResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       /*内部账存款凭条模板*/
       this.printTemplateCashDepSucc = function()
	   {
    	  var strDepType = new top.StringCtrl(top.pool.get("strCashTransName")).suffixStr(' ',12);
		  var strDepName = "";
		  strDepName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',19);
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别            交易流水" 
		                   + this.strNewLine
	                       + " "+ strDepType + top.pool.get("strCashDepOrgTsns")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码            姓名"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "               " + "*" + strDepName.substring(1)
						   + this.strNewLine
						   + this.strNewLine
						   + " 存款金额          " 
		                   + this.strNewLine
	                       + " "+ new top.StringCtrl("").formatStrAmount(top.pool.get("strCashAmount"))
	                       + this.strNewLine
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " 交易成功"
						   + this.strNewLine
						   + this.strContainFoot;
	   }      
       /*内部账存款异常凭条模板*/
       this.printTemplateCashDepErro = function()
	   {
    	   var strDepType = new top.StringCtrl(top.pool.get("strCashTransName")).suffixStr(' ',12);
 		  var strDepName = "";
 		  strDepName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',19);
 		  //凭条抬头内容
 		  this.strContain = this.strContainHead
 	                      + this.strNewLine
                           + " 交易日期       时间       机器终端号" 
 				          + this.strNewLine
 	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
 	                      + this.strNewLine
 				          + this.strNewLine;
 		  //凭条正文内容			  
 		  this.strContain += " 交易类别            交易流水" 
 		                   + this.strNewLine
 	                       + " "+ strDepType + top.pool.get("strCashDepOrgTsns")
 	                       + this.strNewLine
 						   + this.strNewLine
 						   + " 机构代码            办理人姓名"
 						   + this.strNewLine
 	                       + " "+top.terminal.strOrgNum + "               " + "*" + strDepName.substring(1)
 						   + this.strNewLine
 						   + this.strNewLine
 						   + " 已存入总金额          " 
 		                   + this.strNewLine
 	                       + " "+ top.pool.get("strCashTotalAmount") + ".00"
 	                       + this.strNewLine
 						   + this.strNewLine
 			         	   + this.strNewLine;
 	       //凭条尾部内容
 	       this.strContain += " "+ top.pool.get("strCashDepResult") 
 						   + this.strNewLine
 						   + this.strContainFoot;
	   }
       
       /*综合签约整合模板*/
       this.printTemplate52 = function(){
    	  var strSignArr = top.pool.get("multipleSign");
		  var panNum = new top.StringCtrl(top.pool.get("strPan")).suffixStr(' ',19);
 	      if (panNum != null && panNum != "" && panNum.length > 5){
 	              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
 	 	    } 			   				  
 		  //凭条抬头内容
 		  this.strContain = this.strContainHead
 	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
 				          + this.strNewLine              
 				          + this.strNewLine
 	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
 	                      + this.strNewLine
 				          + this.strNewLine
 				          + " 机构代码           银行账号"
						  + this.strNewLine
	                      + " "+top.terminal.strOrgNum + "              " + panNum
             			  + this.strNewLine
             			  + this.strNewLine;		  
 		 if(strSignArr[0] == "1"){
 			 var TransCode = new top.StringCtrl("ATM转账").suffixStr(' ',15);
              this.strContain += " 签约功能           交易流水" 
  				 			  + this.strNewLine
  				 			  + " "+ TransCode +"  " + top.pool.get("JJKQYTsn") + "  "
                  			  + this.strNewLine
                  			  + this.strNewLine
                  			  + " 每日累计转出限额"
                  			  + this.strNewLine
                  			  + " 50000.00"
                  			  + this.strNewLine
                  			  + this.strNewLine
                  			  + " 交易结果"
                 			  + this.strNewLine;
 			 //凭条尾部内容
 			 this.strContain += " "+top.pool.get("JJKQYRet")
 			 				  + this.strNewLine
 			 				  + this.strNewLine;
 		 }
 		 
 		 if(strSignArr[1] == "1"){
 			  var TransCode = new top.StringCtrl("小额免密支付").suffixStr(' ',15);
 			  //凭条正文内容	
 			   this.strContain += " 签约功能             交易流水" 
 	 				 		   + this.strNewLine
 	 				 		   + " "+ TransCode + top.pool.get("XEMMTsn") + "  "
 		                       + this.strNewLine
 							   + this.strNewLine
 							   + " 单笔免密限额         单日累计限额"
 							   + this.strNewLine
 		                       + " 300.00" +"               "+"1000.00"+"  "
 		                       + this.strNewLine
 							   + this.strNewLine
 							   + " 交易结果"
                 			   + this.strNewLine;
 		       //凭条尾部内容
 		       this.strContain += " "+top.pool.get("XEMMRet")
 							   + this.strNewLine
 							   + this.strNewLine;
 		 }		  		  
 		if(strSignArr[2] == "1"){
 			  var TransCode = new top.StringCtrl("第三方快捷支付").suffixStr(' ',15);
 			  //凭条正文内容			  
 			   this.strContain += " 签约功能              交易流水" 
 	 				 		   + this.strNewLine
 	 				 		   + " "+ TransCode + top.pool.get("DSFKJTsn") + "  "
 		                       + this.strNewLine
 		                       + this.strNewLine
 							   + " 手机号" 
 			                   + this.strNewLine
 		                       + " "+ top.pool.get("strPhone")
 							   + this.strNewLine
 				         	   + this.strNewLine
 				         	   + " 交易结果"
                			   + this.strNewLine;
 		       //凭条尾部内容
 		       this.strContain += " "+top.pool.get("DSFKJRet")
 							   + this.strNewLine
 							   + this.strNewLine;
		 }		
 		if(strSignArr[3] == "1"){
 			  var TransCode = new top.StringCtrl("短信通").suffixStr(' ',15);
 			  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
 			  //凭条正文内容			  
 			 this.strContain += " 签约功能           交易流水" 
 				 			   + this.strNewLine
 				 			   + " "+ TransCode +" " + top.pool.get("DXTZTsn") + "  "
 		                       + this.strNewLine
 		                       + this.strNewLine
 							   + " 手机号             是否显示余额"
 							   + this.strNewLine
 				               + " " + top.pool.get("strPhone") + "        是"
 							   + this.strNewLine
 							   + this.strNewLine
 							   + " 起点金额"
 							   + this.strNewLine
 				               + " 0.00"
 							   + this.strNewLine
 							   + this.strNewLine
 							   + " 交易结果"
                 			   + this.strNewLine;
 		       //凭条尾部内容
 		       this.strContain += " "+top.pool.get("DXTZRet") 
 							   + this.strNewLine
 							   + this.strNewLine;
		 }		
 		if(strSignArr[4] == "1"){
 			  var TransCode = new top.StringCtrl("手机银行").suffixStr(' ',15);
 			  //凭条正文内容			  
 			   this.strContain += " 签约功能           交易流水" 
 	 				 		   + this.strNewLine
 	 				 		   + " "+ TransCode + top.pool.get("SJYHTsn") + "  "
 		                       + this.strNewLine
 							   + this.strNewLine
 							   + " 手机号"
 							   + this.strNewLine
 		                       + " "+top.pool.get("strPhone")
 		                       + this.strNewLine
 							   + this.strNewLine
 							   + " 交易结果"
                 			   + this.strNewLine;
 		       //凭条尾部内容
 		       this.strContain += " "+top.pool.get("SJYHRet")
 							   + this.strNewLine
 							   + this.strNewLine;
		 }	
 		if(strSignArr[5] == "1"){
 			  var TransCode = new top.StringCtrl("个人网银").suffixStr(' ',15);
 			  var IDName = new top.StringCtrl(top.pool.get("strIDName")).suffixStr(' ',8);
 
 			  if(top.pool.get("LocalUkeyNum") != "" && top.pool.get("LocalUkeyNum") != null) {
 				//凭条正文内容			  
	               this.strContain += " 签约功能           交易流水" 
	   				 			   + this.strNewLine
	   				 			   + " "+ TransCode + top.pool.get("WYZSBTsn") + "  "
 			                       + this.strNewLine
 								   + this.strNewLine
 					         	   + " 手机号              版本"
 								   + this.strNewLine
 					               + " " + top.pool.get("strPhone") + "         " + top.pool.get("strVersion")
 								   + this.strNewLine
 								   + this.strNewLine
 					         	   + " 工本费"
 								   + this.strNewLine
 					               + " " + top.pool.get("strUkeyPrice") + "元"
 								   + this.strNewLine
 								   + this.strNewLine
 								   + " 交易结果"
 	                 			   + this.strNewLine;
 			  }else {
 				//凭条正文内容			  
 				 this.strContain += " 签约功能           交易流水" 
 					 			   + this.strNewLine
 					 			   + " "+ TransCode + top.pool.get("WYZSBTsn") + "  "
 			                       + this.strNewLine
 								   + this.strNewLine
 					         	   + " 手机号              版本"
 								   + this.strNewLine
 					               + " " + top.pool.get("strPhone") + "         " + top.pool.get("strVersion")
 								   + this.strNewLine
 								   + this.strNewLine
 								   + " 交易结果"
 	                 			   + this.strNewLine;
 			  }
 		       //凭条尾部内容
 		       this.strContain += " "+top.pool.get("WYZSBRet")
 							   + this.strNewLine
 							   + this.strNewLine;
		 }
 		 //凭条尾部内容
		 this.strContain += this.strContainFoot;
       }
       
       /*公积金余额查询模板*/
       this.printTemplate53 = function()
	   {
    	  var strDepType = new top.StringCtrl(top.pool.get("strDepType")).suffixStr(' ',15);
          
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
 		  this.strContain += " 交易类别            交易流水" 
 		                   + this.strNewLine
 	                       + " "+ strDepType + top.pool.get("strDepOrgTsns")
 	                       + this.strNewLine
 						   + this.strNewLine
 						   + " 机构代码  "
 						   + this.strNewLine
 	                       + " "+top.terminal.strOrgNum
 						   + this.strNewLine
 						   + this.strNewLine
 						   + " 单位名称：" + top.pool.get("strOrgName") 
 		                   + this.strNewLine
 	                       + " 公积金账号："+ top.pool.get("strAccount")
 	                       + this.strNewLine
 	                       + " 职工姓名："+ top.pool.get("strCustName")
 						   + this.strNewLine
 						   + " 账户余额："+ top.pool.get("amount")
 						   + this.strNewLine
 						   + " 月缴存额："+ top.pool.get("monAmount")
 						   + this.strNewLine
 						   + " 数据截止日期："+ top.pool.get("endDate")
 						   + this.strNewLine
 			         	   + this.strNewLine;
 	       //凭条尾部内容
 	       this.strContain += " "+"交易成功" 
 						   + this.strNewLine
 						   + this.strContainFoot;
	   }
       
       /*对公取款凭条模板*/
       this.printTemplateWithCompDrawSucc = function()
	   {
    	  var WithDrawType = new top.StringCtrl("对公取款").suffixStr(' ',15);
		  var panNum = top.pool.get("WithDraw_Acc");//取款账号
		  //取款金额
		  var strWithDrawAmount = new top.StringCtrl(new top.StringCtrl(top.pool.get("strCashWithDraw")).formatNumber(2)).suffixStr(' ',19);// 2018-1-10 金额格式化到小数点后两位
		  //剩余未出
		  var MultiWithDrawAmountFen = new top.StringCtrl("").formatStrAmount(top.pool.get("MultiDrawAmount"));
		  var MultiWithDrawAmount = new top.StringCtrl(new top.StringCtrl(MultiWithDrawAmountFen).formatNumber(2)).suffixStr(' ',19);
		  var CompName = top.pool.get("WithDraw_CompName");//公司名称
		  if (panNum != null && panNum != "" && panNum.length > 5){
              panNum = panNum.substr(0, panNum.length-5) + "****" + panNum.charAt(panNum.length-1);
	      }
		  if (CompName!=null && CompName !="" && CompName.length > 6){
			  CompName = CompName.substr(0, 3) + "****" + CompName.substr(CompName.length-3,CompName.length);
          }else{
        	  CompName = " *" + CompName.substring(1);
          }
		  // 交易成功后不显示
		  var DrawCompAmtInfoNewLine = this.strNewLine + this.strNewLine;
		  var WithDrawCompAmtInfoTitle = " 剩余未出钞金额     已完成出钞金额" + this.strNewLine;
		  //已出金额
		  var WithDrawSuccAmount =new top.StringCtrl("").formatStrAmount(top.pool.get("strDrawSuccAmount"));
		  var strWithDrawCompAmtInfoTitle = MultiWithDrawAmount + WithDrawSuccAmount;
		  if(top.pool.get("DrawTransResult") == "交易成功"){
			  WithDrawCompAmtInfoTitle = "";
			  strWithDrawCompAmtInfoTitle = ""
			  DrawCompAmtInfoNewLine = "";
		  }
		  //凭条抬头内容
		  this.strContain = this.strContainHead
	                      + this.strNewLine
                          + " 交易日期       时间       机器终端号" 
				          + this.strNewLine
	                      + " "+new top.DateTimeCtrl().getYYYYMMDD2()+"     "+new top.DateTimeCtrl().getHHmmSSWithSep()+"   "+top.terminal.strTerminalNum
	                      + this.strNewLine
				          + this.strNewLine;
						  
		  //凭条正文内容			  
		  this.strContain += " 交易类别           交易流水" 
		                   + this.strNewLine
	                       + " "+ WithDrawType + top.pool.get("strWithDrawTransJun")
	                       + this.strNewLine
						   + this.strNewLine
						   + " 机构代码           账号"
						   + this.strNewLine
	                       + " "+top.terminal.strOrgNum + "              " + panNum
						   + this.strNewLine
						   + this.strNewLine
						   + " 取款金额           取款人姓名" 
		                   + this.strNewLine
	                       + " "+ strWithDrawAmount + "*" + top.pool.get("strIDName").substring(1)
	                       + this.strNewLine
						   + this.strNewLine
						   + " 公司名称 "
						   + this.strNewLine
	                       + " "+ CompName
						   + DrawCompAmtInfoNewLine
			               + WithDrawCompAmtInfoTitle
			               + " "+ strWithDrawCompAmtInfoTitle
						   + this.strNewLine
			         	   + this.strNewLine;
	       //凭条尾部内容
	       this.strContain += " "+ top.pool.get("DrawTransResult") 
						   + this.strNewLine
						   + this.strContainFoot;
	   }
       
	   /*打印凭条并退给客户*/
	   this.printAndEject = function()
	   {
	      if (top.YHAXReceiptPrint.StDeviceStatus != "HEALTHY")
	      {
	         if (typeof(top.MainFrame.onDeviceError_rpt_Print) == "function"){
	           top.MainFrame.onDeviceError_rpt_Print();
	           return;
		     }
	      }
	      /*判断临时文件是否存在*/
	      try{
	    	  exFil=fileObj.GetFile(this.strFile);
	    	  exFil.Delete();
	      }catch(e){}
		  //判断打印那种凭条模板
		  var printType = top.pool.get("printType");
		  if(printType != null && printType !="" && printType == "1")//模板1凭条
		  {
		     top.receiptprinter.printTemplate();
		  }
		  else if(printType != null && printType !="" && printType == "2")//模板2凭条
		  {
		     top.receiptprinter.printTemplate2();
		  }
		  else if(printType != null && printType !="" && printType == "3")//吞卡凭条
		  {
		     top.receiptprinter.printCapturedTemplate();
		  }
		  else if(printType != null && printType !="" && printType == "4")//模板凭条金额
		  {
		     top.receiptprinter.printTemplate4();
		  }
		  else if(printType != null && printType !="" && printType == "5")//叫号凭条
		  {
		     top.receiptprinter.printTemplate5();
		  }else if(printType != null && printType !="" && printType == "6")//存单开户凭条
		  {
		     top.receiptprinter.printTemplate6();
		  }else if(printType != null && printType !="" && printType == "7")//转账凭条
		  {
		     top.receiptprinter.printTemplate7();
		  }else if(printType != null && printType !="" && printType == "8")//显示卡号姓名凭条
		  {
		     top.receiptprinter.printTemplate8();
		  }else if(printType != null && printType !="" && printType == "9")//网银修改注销凭条
		  {
		     top.receiptprinter.printTemplate9();
		  }	else if(printType != null && printType !="" && printType == "10")//网银新增凭条
		  {
		     top.receiptprinter.printTemplate10();
		  }	else if(printType != null && printType !="" && printType == "11")//网银删除凭条
		  {
		     top.receiptprinter.printTemplate11();
		  }else if(printType != null && printType !="" && printType == "12")//网银删除凭条
		  {
		     top.receiptprinter.printTemplate12();
		  }else if(printType != null && printType !="" && printType == "13")//网银删除凭条
		  {
		     top.receiptprinter.printTemplate13();
		  }else if(printType != null && printType !="" && printType == "14")//网银注销凭条
		  {
		     top.receiptprinter.printTemplate14();
		  }
		  else if(printType != null && printType !="" && printType == "15")//手机银行新增凭条
		  {
		     top.receiptprinter.printTemplate15();
		  }
		  else if(printType != null && printType !="" && printType == "16")//手机银行删除凭条
		  {
		     top.receiptprinter.printTemplate16();
		  }	
		  else if(printType != null && printType !="" && printType == "17")//跨行转账凭条
		  {
		     top.receiptprinter.printTemplate17();
		  }	
		  else if(printType != null && printType !="" && printType == "18")//跨行转账凭条
		  {
		     top.receiptprinter.printTemplate18();
		  }
		  else if(printType != null && printType !="" && printType == "19")//外汇凭条
		  {
		     top.receiptprinter.printTemplate19();
		  }else if(printType != null && printType !="" && printType == "20")//结汇凭条
		  {
		     top.receiptprinter.printTemplate20();
		  }else if(printType != null && printType !="" && printType == "21")//外汇买卖凭条
		  {
		     top.receiptprinter.printTemplate21();
		  }else if(printType != null && printType !="" && printType == "22")//ATM转账凭条
		  {
			 top.receiptprinter.printTemplate22();
		  }else if(printType != null && printType !="" && printType == "22MV")//ATM转账凭条
		  {
			 top.receiptprinter.printTemplate22MV();
		  }else if(printType != null && printType !="" && printType == "23")//小额免密凭条
		  {
			 top.receiptprinter.printTemplate23();
		  }else if(printType != null && printType !="" && printType == "23MV")//小额免密凭条
		  {
			 top.receiptprinter.printTemplate23MV();
		  }else if(printType != null && printType !="" && printType == "24")//第三方快捷凭条
		  {
			 top.receiptprinter.printTemplate24();
		  }else if(printType != null && printType !="" && printType == "24MV")//第三方快捷凭条
		  {
			 top.receiptprinter.printTemplate24MV();
		  }else if(printType != null && printType !="" && printType == "25")//短信通凭条
		  {
			 top.receiptprinter.printTemplate25();
		  }else if(printType != null && printType !="" && printType == "25MV")//短信通凭条
		  {
			 top.receiptprinter.printTemplate25MV();
		  }else if(printType != null && printType !="" && printType == "26")//手机银行凭条
		  {
			 top.receiptprinter.printTemplate26();
		  }else if(printType != null && printType !="" && printType == "26MV")//手机银行凭条
		  {
			 top.receiptprinter.printTemplate26MV();
		  }else if(printType != null && printType !="" && printType == "27")//个人网银凭条
		  {
			 top.receiptprinter.printTemplate27();
		  }else if(printType != null && printType !="" && printType == "27MV")//个人网银凭条
		  {
			 top.receiptprinter.printTemplate27MV();
		  }else if(printType != null && printType !="" && printType == "28")//开卡凭条
		  {
			 top.receiptprinter.printTemplate28();
		  }else if(printType != null && printType !="" && printType == "29")//卡激活凭条
		  {
			 top.receiptprinter.printTemplate29();
		  }else if(printType != null && printType !="" && printType == "29MV")//移动终端卡激活凭条
		  {
			 top.receiptprinter.printTemplate29MV();
		  }else if(printType != null && printType !="" && printType == "30")//吞存单凭条
		  {
			 top.receiptprinter.printTemplate30();
		  }else if(printType != null && printType !="" && printType == "31")//存单故障凭条
		  {
			 top.receiptprinter.printTemplate31();
		  }else if(printType != null && printType !="" && printType == "32")//存单销户凭条
		  {
			 top.receiptprinter.printTemplate32();
		  }else if(printType != null && printType !="" && printType == "33")//存单销户/部提转账凭条
		  {
			 top.receiptprinter.printTemplate33();
		  }else if(printType != null && printType !="" && printType == "34")//代扣签约  新增代扣公司
		  {
			 top.receiptprinter.printTemplate34();
		  }else if(printType != null && printType !="" && printType == "35")//电子现金充值凭条
		  {
			 top.receiptprinter.printTemplate35();
		  }else if(printType != null && printType !="" && printType == "36")//解挂凭条
		  {
			 top.receiptprinter.printTemplate36();
		  }else if(printType != null && printType !="" && printType == "37")//卡挂失凭条
		  {
			 top.receiptprinter.printTemplate37();
		  }else if(printType != null && printType !="" && printType == "38")//定制卡挂失补卡凭条
		  {
			 top.receiptprinter.printTemplate38();
		  }else if(printType != null && printType !="" && printType == "39")//预制卡挂失补卡凭条
		  {
			 top.receiptprinter.printTemplate39();
		  }else if(printType != null && printType !="" && printType == "40")//凭证挂失凭条
		  {
			 top.receiptprinter.printTemplate40();
		  }else if(printType != null && printType !="" && printType == "41")//ATM转账 --单独签约
		  {
			 top.receiptprinter.printTemplate41();
		  }else if(printType != null && printType !="" && printType == "42")//缴费凭条模版*/
		  {
			 top.receiptprinter.printTemplate42();
		  }else if(printType != null && printType !="" && printType == "44")//ATM转账 --单独签约
		  {
			 top.receiptprinter.printTemplate44();
		  }else if(printType != null && printType !="" && printType == "45")//活转定
		  {
			 top.receiptprinter.printTemplate45();
		  }else if(printType != null && printType !="" && printType == "46")//定转活
		  {
			 top.receiptprinter.printTemplate46();
		  }else if(printType != null && printType !="" && printType == "47")//第三方快捷支付-手机号维护
		  {
			 top.receiptprinter.printTemplate47();
		  }else if(printType != null && printType !="" && printType == "48")//小额免密限额
		  {
			 top.receiptprinter.printTemplate48();
		  }else if(printType != null && printType !="" && printType == "49")//换卡
		  {
			 top.receiptprinter.printTemplate49();
		  }else if(printType != null && printType !="" && printType == "50")//第三方快捷支付-限额管理
		  {
			 top.receiptprinter.printTemplate50();
		  }else if(printType != null && printType !="" && printType == "51")//社保卡申领
		  {
			 top.receiptprinter.printTemplate51();
		  }else if(printType != null && printType !="" && printType == "52"){ //综合签约
			  top.receiptprinter.printTemplate52();
		  }else if(printType != null && printType !="" && printType == "51MV")//社保卡申领
		  {
				 top.receiptprinter.printTemplate51MV();
		  }else if(printType != null && printType !="" && printType == "WithDrawSucc")//现金取款
		  {
			 top.receiptprinter.printTemplateWithDrawSucc();
		  }else if(printType != null && printType !="" && printType == "TellerWithDrawSucc")//柜员现金取款
		  {
			 top.receiptprinter.printTemplateTellerWithDrawSucc();
		  }else if(printType != null && printType !="" && printType == "DepositSucc")//存款
		  {
			 top.receiptprinter.printTemplateDepositSucc();
		  }else if(printType != null && printType !="" && printType == "PupositSucc")//对公存款
		  {
				 top.receiptprinter.printTemplatePupositSucc();
		  }else if(printType != null && printType !="" && printType == "CashDrawSucc")//内部账取现
		  {
			 top.receiptprinter.printTemplateCashDrawSucc();
		  }else if(printType != null && printType !="" && printType == "CashDrawErro")//内部账取现异常
		  {
			top.receiptprinter.printTemplateCashDrawErro();
		  }else if(printType != null && printType !="" && printType == "CashDepSucc")//内部账存款
		  {
			top.receiptprinter.printTemplateCashDepSucc();
		  }else if(printType != null && printType !="" && printType == "CashDepErro")//内部账存款异常
		  {
			top.receiptprinter.printTemplateCashDepErro();
		  }else if(printType != null && printType !="" && printType == "53")//公积金余额查询
		  {
			  top.receiptprinter.printTemplate53();
		  }else if(printType != null && printType !="" && printType == "TelDepositSucc")//柜员现金存款
		  {
			  top.receiptprinter.printTemplateTelDepSucc();
		  }else if(printType != null && printType !="" && printType == "WithCompDrawSucc"){//对公取款
			  top.receiptprinter.printTemplateWithCompDrawSucc();
		  }
		  
	      /*判断临时文件是否存在*/
	      if(printFlag_mx)
	      {
		      fil   =   fileObj.createtextfile(this.strFile,true);
		  	  fil.Write(this.strContain);
		  	  fil.Close();
	      }else /*如果未创建临时文件，则先创建该临时文件*/
	      {
		      //创建打印的临时文件
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
	 
	  /*打印凭条时硬件故障的事件回调函数*/
	  this.onDeviceError_PrintFile = function()
	  {
		// 记录终端流水
        top.journalPrinter.addJournal("凭条打印机故障 ReceiptPrinter Event onDeviceError_PrintFile ");    
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onDeviceError_rpt_Print) == "function")
	      top.MainFrame.onDeviceError_rpt_Print();
	    else{}
	  }

	  /*打印凭条完成的事件回调函数*/
	  this.onPrintComplete = function()
	  {
		// 记录终端流水
        top.journalPrinter.addJournalWithTime("凭条打印机打印完成 ReceiptPrinter Event onPrintComplete ");      
		top.receiptprinter.RptEvents.clearAll();
        top.receiptprinter.RptEvents.appendEvent("PrintEjected", top.receiptprinter.onPrintEjected);
        top.receiptprinter.RptEvents.appendEvent("PrintTaken", top.receiptprinter.onPrintTaken);
        top.receiptprinter.RptEvents.appendEvent("Timeout", top.receiptprinter.onTimeout_Eject);
        top.receiptprinter.RptEvents.appendEvent("DeviceError", top.receiptprinter.onDeviceError_Eject);
		top.receiptprinter.RptEvents.appendEvent("FatalError", top.receiptprinter.onDeviceError_Eject);
		top.YHAXReceiptPrint.Eject(top.receiptprinter.BeTakenTimeOut*1000);
	  }

	  /*凭条已经被送出给客户的事件回调函数*/
	  this.onPrintEjected = function()
	  {
		// 记录终端流水
        top.journalPrinter.addJournalWithTime("凭条退出 ReceiptPrinter Event onPrintEjected");   
		// 控制指示灯
        try{top.guidelights.setReceiptPrinterLight("QUICK");}catch(e){}
	
	  	top.soundPlayer.playback("/Sound/TakeReceipt.mp3");
		
	    if (typeof(top.MainFrame.onReceiptEjected) == "function")
	      top.MainFrame.onReceiptEjected();
	    else{}
	  }

	  /*凭条已经被客户取走的事件回调函数*/
	  this.onPrintTaken = function()
	  { 
		// 记录终端流水
        top.journalPrinter.addJournalWithTime("凭条被取走 ReceiptPrinter Event onPrintTaken "); 	  
		// 控制指示灯
        try{top.guidelights.setReceiptPrinterLight("OFF");}catch(e){}
	
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onReceiptTaken) == "function")
	      top.MainFrame.onReceiptTaken();
	    else{}
	  } 
	  
	  /*凭条超时未被客户取走的事件回调函数*/
    this.onTimeout_Eject = function()
	{
		// 记录终端流水
        top.journalPrinter.addJournalWithTime("凭条退出超时 ReceiptPrinter Event onTimeout_Eject "); 
		// 控制指示灯
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
		  // 不能检测凭条是否拿走，则按照客户已经取走凭条处理
		  top.receiptprinter.RptEvents.clearAll();
		  if (typeof(top.MainFrame.onReceiptTaken) == "function")
			top.MainFrame.onReceiptTaken();
		}
    }

	  /*送出凭条时硬件故障的事件回调函数*/
	  this.onDeviceError_Eject = function()
	  {
		// 记录终端流水
        top.journalPrinter.addJournalWithTime("凭条退出故障 ReceiptPrinter Event onDeviceError_Eject"); 
		// 控制指示灯
        try{top.guidelights.setReceiptPrinterLight("OFF");}catch(e){}
	
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onDeviceError_rpt_Eject) == "function")
	      top.MainFrame.onDeviceError_rpt_Eject();
	    else{}
	  }  
	  
	  /*凭条已经被吞入的事件回调函数*/
	  this.onPrintCaptured = function()
	  {
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onReceiptCaptured) == "function")
	      top.MainFrame.onReceiptCaptured();
	    else{}
	  }
	  /*吞入凭条是硬件故障的事件回调函数*/
	  this.onDeviceError_Capture = function()
	  {
		// 记录终端流水
        top.journalPrinter.addJournalWithTime("吞凭条故障 ReceiptPrinter Event onDeviceError_Capture ");
	    top.receiptprinter.RptEvents.clearAll();
	    if (typeof(top.MainFrame.onCaptureReceiptFailed) == "function")
	      top.MainFrame.onCaptureReceiptFailed();
	    else{}
	  }
	  
		/***凭条打印机模块状态判断***/
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
