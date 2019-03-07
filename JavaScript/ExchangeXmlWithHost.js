// XMLЭ�鱨�ĸ��ڵ�����
var YH_COLSTRANS_XMLROOT = "TransMsg";

/*
  atmc��ϢXML�ı���ʽ�����࣬һ������������
 */
function ColsMsgXmlText()
{
  this.strbufMsg = "";
  this.arrNodeNames = new Array();
  
  /*
    Encode�ַ����������ַ����еı�����ʹ��ת���ַ����滻
    ������val ��ҪEncode���ַ���
    ���أ�ת������ַ���
  */
  this.encodeXml = function(val)
  {
    var strtmp = val.toString();
    strtmp = new top.StringCtrl(strtmp).replaceAll("&", "&amp;");
    strtmp = new top.StringCtrl(strtmp).replaceAll("'", "&apos;");
    strtmp = new top.StringCtrl(strtmp).replaceAll("\"", "&quot;");
    strtmp = new top.StringCtrl(strtmp).replaceAll("<", "&lt;");
    strtmp = new top.StringCtrl(strtmp).replaceAll(">", "&gt;");
    return strtmp;
  }
  
  /*
    Decode�ַ����������ַ����еı�����ʹ��ת���ַ����滻
    ������val ��ҪDecode���ַ���
    ���أ�ת������ַ���
  */
  this.decodeXml = function(val)
  {
    var strtmp = val.toString();
    
    strtmp = new top.StringCtrl(strtmp).replaceAll("&amp;", "&");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&apos;", "'");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&quot;", "\"");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&lt;", "<");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&gt;", ">");
    return strtmp;
  }
/*
    Decode�ַ����������ַ����еı�����ʹ��ת���ַ����滻
    ������val ��ҪDecode���ַ���
    ���أ�ת������ַ���
	ע:&����ת����xml�޷�����������ȥ��&��ת�塣Ϊ��֤��Ӱ���������ã������÷�����
  */
  this.decodeXml2 = function(val)
  {
    var strtmp = val.toString();
    
    strtmp = new top.StringCtrl(strtmp).replaceAll("&apos;", "'");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&quot;", "\"");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&lt;", "<");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&gt;", ">");
    return strtmp;
  }

  this.appendNode = function(strName, strVal)
  {
	var str = "<" + strName + ">";
	if(this.strbufMsg.indexOf(str) == -1){//������ڸýڵ㣬����Ҫ�����ͬ���Ľڵ�,�����ڣ��������ڵ�
	   this.startNode(strName);
	   this.strbufMsg += this.encodeXml(strVal);
       this.endNode(strName);
	}else{//���ڵĻ���ֱ���޸ĸýڵ��ֵ�������һ��Ϊ׼
	   var strStrart = this.strbufMsg.substring(0,this.strbufMsg.indexOf("<"+strName+">"));
	   var strEnd = this.strbufMsg.substring((parseInt(this.strbufMsg.indexOf("</"+strName+">"),10) + parseInt(("</"+strName+">").length,10)),this.strbufMsg.length);
	   this.strbufMsg = strStrart+"<"+strName+">"+this.encodeXml(strVal)+"</"+strName+">"+strEnd;
	}
  }
  
  this.appendNodeNotEncodeXml = function(strName, strVal)
  {
  	this.startNode(strName);
	this.strbufMsg += strVal;
    this.endNode(strName);
  }

  this.startNode = function(strName)
  {
    this.arrNodeNames[this.arrNodeNames.length] = strName;
    this.strbufMsg += "<" + strName + ">";
  }

  this.endNode = function(strName)
  {
    this.strbufMsg += "</" + strName + ">";
  }

  /*
    �����Լ��϶��������һ���ֵ
    ������
      props   Properties���Լ��϶���
      ...     �ɱ������Ҫ��ӵĸ���������
  */
  this.appendNodeFromProps = function(props)
  {
    for (var i=1; i<arguments.length; i++)
    {
      var valtmp = props.get(arguments[i]);
      if (valtmp != null && valtmp.toString().length > 0)
        this.appendNode(arguments[i], valtmp);
    }
  }

  this.isNodeIn = function(strName)
  {
    for (var i=0; i<this.arrNodeNames.length; i++)
    {
      if (this.arrNodeNames[i] == strName)
        return true;
    }
    return false;
  }
  

  /*
    �ڱ���β������Mac��ֵ�ֶΣ�ͨ���÷���ֻ���ڱ��Ĺ������ʱ���MacУ��ֵ
  */
  this.appendMac = function(strMac)
  {
    this.appendElement("Mac", strMac);
  }

  /*
    ת����Ϣ���Ķ������ַ���
  */
  this.toString = function()
  {
    return "<" + YH_COLSTRANS_XMLROOT + ">" + this.strbufMsg + "</" + YH_COLSTRANS_XMLROOT + ">";
  } 
  
  /*
    ���ַ���ת����base64�ַ���
  */
  this.encode64 = function(str) 
  {
	  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 
      var output = "";  
      var chr1, chr2, chr3 = "";  
      var enc1, enc2, enc3, enc4 = "";  
      var i = 0;  
      do {  
            chr1 = str.charCodeAt(i++);  
            chr2 = str.charCodeAt(i++);  
            chr3 = str.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
               enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
               enc4 = 64;  
            }  
            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);  
            chr1 = chr2 = chr3 = "";  
            enc1 = enc2 = enc3 = enc4 = "";  
       } while (i < str.length);  
       return output; 
  }
  
  //��Base64�����ַ���ת����Ansi������ַ���
  this.decode64 = function(str) 
  {
	   var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 
       var output = "";
       var chr1, chr2, chr3 = "";
       var enc1, enc2, enc3, enc4 = "";
       var i = 0;
       if (str.length % 4 != 0) {
          return "";
       }
       var base64test = /[^A-Za-z0-9/+///=]/g;
       if (base64test.exec(str)) {
           return "";
       }
       do {
          enc1 = keyStr.indexOf(str.charAt(i++));
          enc2 = keyStr.indexOf(str.charAt(i++));
          enc3 = keyStr.indexOf(str.charAt(i++));
          enc4 = keyStr.indexOf(str.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 != 64) {
              output += String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output += String.fromCharCode(chr3);
          }
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
       } while (i < str.length);
       return output;
  }
  
  this.utf16to8 = function(str) 
  {  
      var out, i, len, c;  
      out = "";  
      len = str.length;  
      for(i = 0; i < len; i++) {  
         c = str.charCodeAt(i);  
         if ((c >= 0x0001) && (c <= 0x007F)) {  
            out += str.charAt(i);  
         } else if (c > 0x07FF) {  
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));  
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));  
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));  
         } else {  
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));  
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));  
         }  
      }  
      return out;  
  }
   
  this.utf8to16 = function(str) 
  {
     var out, i, len, c;
     var char2, char3;
     out = "";
     len = str.length;
     i = 0;
     while(i < len) {
        c = str.charCodeAt(i++);
        switch(c >> 4) {
			case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			   out += str.charAt(i-1);
			   break;
			case 12: case 13:
			   char2 = str.charCodeAt(i++);
			   out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			   break;
			case 14:
			   char2 = str.charCodeAt(i++);
			   char3 = str.charCodeAt(i++);
			   out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
			   break;
         }
      }
      return out;
  }   
}

/*
  atmc��ϢXML DOM��ʽ�����࣬һ�����ڻ�Ӧ����
 */
function ColsMsgXmlDom(doc)
{
  this.docXmlDom = doc;
  this.docXmlDom.setProperty("SelectionLanguage", "XPath");
  
  /*
    Decode�ַ����������ַ����е�ת���ַ����滻Ϊ������
    ������
      val ��ҪDecode���ַ���
    ���أ�
      ת������ַ���
  */
  this.decodeXml = function(val)
  {
    var strtmp = val.toString();
    
    strtmp = new top.StringCtrl(strtmp).replaceAll("&amp;", "&");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&apos;", "'");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&quot;", "\"");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&lt;", "<");
    strtmp = new top.StringCtrl(strtmp).replaceAll("&gt;", ">");
    return strtmp;
  }

  this.getElementValue = function(strName)
  {
    if (strName.length == 0)
      return "";
    if (strName.charAt(0) != '/')
      strName = "/" + YH_COLSTRANS_XMLROOT + "/" + strName;
    var node = this.docXmlDom.selectSingleNode(strName);
    if (node == null)
      return "";

    return this.decodeXml(node.text);
  }
  /*
   * ���ݽ��·�������ĳ������Ӧ��ֵ��
   */
  this.selectSingleNodeValue = function(xpath)
  {
      var retval = "";
      if (xpath.length == 0)
      	return retval;
      var value = this.docXmlDom.selectSingleNode(xpath);
      if (value) retval = this.decodeXml(value.text);
      return retval;
  }
  
    /*
   * ȡ����ͬ����������
   */
  
  this.selectNodesCount = function(xpath)
  {
  	return this.docXmlDom.selectNodes(xpath).length;
  }
  
  /*
   * ���ݱ�ǩ���ͱ�ǩ��������½ڵ㣻
   * ������
   * 		NodeVal		�ڵ�ֵ
   * 		NodeName	�ڵ�����
   * ���أ�������ǩ���ͱ�ǩ���ݵ��ַ���
   */
  
  this.SetNodeStr = function(NodeVal,NodeName){
		if(NodeName == null || NodeName == ""){
			return "";
		}
		var retMsg = "";
		var StartNode = "<" + NodeName + ">" ;	//��ʼ�ڵ�
		var EndNode = "</" + NodeName + ">";	//�����ڵ�
		NodeVal = StartNode + NodeVal + EndNode;
		return NodeVal;	
	}

}

/*
  ���������н�������
 */
function ExchangeXmlWithHost()
{
  // XMLHTTP�ؼ�����
  this.xmlhttpObj;
  // �����Ŀ��URL
  this.strUrl = "";
  // �����TransMsgReq����
  this.msgxmltextReq = null;
  // ��������첽�������ʱ�Ļص�����
  this.onAsyncExchangeComplete = null;

  // �ն˷�����
  this.strTermRetCode = "";
  // �ն˷�����������
  this.strTermRetDesc = "";
  // �ն˷�������Ӣ��
  this.strTermRetDescEn = "";
  // ���������ص�TransMsgXmlDom����
  this.msgxmldomResp = new ColsMsgXmlDom(XMLDOMEMPTY);
  /*����������н���*/
  this.doExchange = function(url, mxtreq)
  {
    // Ϊ��ֹNT����ϵͳ�Ļ���������ʱ�ȴ�����ʱ�䣬�Ȳ�����·
    if (!this.IsServerOnLine())
      return top.RESULT_FAILED;
    // ��������������ͨ������ڵ�
    this.onAppendTransReqNode(mxtreq);
    this.msgxmltextReq = mxtreq;
    this.strUrl = url;
    this.xmlhttpObj = createXMLHttp();
    try
    {
      this.xmlhttpObj.Open("POST", url, false);
      this.xmlhttpObj.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
      this.xmlhttpObj.send(this.msgxmltextReq.toString());
    } catch(e){}
    var iRet = this.processResult(this.xmlhttpObj);
    return iRet;
  }
  
  
  /*
    ���Է�������·�Ƿ�����
    ������
      url   �����URL
  */
  this.IsServerOnLine = function()
  {
    if (top.serviceCtrl.strServerIP.toString().length <= 0)
      return true;
    if (!top.YHAXCommonCtrl.CanConnectToServer(top.serviceCtrl.strServerIP, top.serviceCtrl.iServerPort))
    {
      this.msgxmldomResp = new ColsMsgXmlDom(XMLDOMEMPTY);
      this.strTermRetCode = top.TERMRETCODE_COMMERR;
      this.strTermRetDesc = top.langdef.TERMRETDESC_COMMERR;
      this.strTermRetDescEn = top.langen.TERMRETDESC_COMMERR;
      return false;
    }
    return true;
  }
  
  function   Trim(s)   {return   s.replace(/(^\s*)|(\s*$)/g,"");}   
  function   Ltrim(s){return   s.replace(/(^\s*)/g,   "");}   
  function   Rtrim(s){return   s.replace(/(\s*$)/g,   "");}   
  

  /*
    ˽�к���:��������������н����Ľ��
    ���أ�
      �������ֵ���������漸�֣�
        RESULT_SUCCESSFUL
        RESULT_FAILED
        RESULT_UNCERTAIN
   */
  this.processResult = function()
  {
    // HTTPͨѶ�ɹ�
    if (this.isStatusSuccessful())
    {
      var source = createXMLDOM(); 
      source.async = false;
	  //ע:&����ת����xml�޷�����������ȥ��&��ת�塣Ϊ��֤��Ӱ���������ã������÷�����
      source.loadXML(new ColsMsgXmlText().decodeXml2(Trim(this.xmlhttpObj.responseText)));
  	  addTransExceptionContent(source.xml)
      this.msgxmldomResp = new ColsMsgXmlDom(source);
      this.strTermRetCode = this.msgxmldomResp.getElementValue("TermRetCode");
      this.strTermRetDesc = this.msgxmldomResp.getElementValue("TermRetDesc");
      this.strTermRetDescEn = this.msgxmldomResp.getElementValue("TermRetDescEn");

      // ���ݷ��������ص��ն˷����룬��һ��������������ķ���ֵ
      if (this.strTermRetCode == null && this.strTermRetCode.length == 0)
      {
        this.msgxmldomResp = new ColsMsgXmlDom(XMLDOMEMPTY);
        this.strTermRetCode = TERMRETCODE_COMMUNC;
        this.strTermRetDesc = top.langdef.TERMRETDESC_COMMUNC;
        this.strTermRetDescEn = top.langen.TERMRETDESC_COMMUNC;
        iRet = RESULT_UNCERTAIN;
        return iRet;
      }

      if (this.strTermRetCode == top.TERMRETCODE_SUCCEED)
        iRet = RESULT_SUCCESSFUL;
      else if (this.strTermRetCode == top.TERMRETCODE_COMMUNC)
        iRet = RESULT_UNCERTAIN;
      else
        iRet = RESULT_FAILED;
    }
    // HTTPͨѶʧ��
    else if (this.isStatusFailed())
    {
      // ��¼�ն���ˮ
      var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "HTTP Failed: " + this.xmlhttpObj.status + top.journalPrinter.strNewLine;
      top.journalPrinter.addJournal(strJrn);

      this.msgxmldomResp = new ColsMsgXmlDom(XMLDOMEMPTY);
      this.strTermRetCode = top.TERMRETCODE_COMMERR;
      this.strTermRetDesc = top.langdef.TERMRETDESC_COMMERR;
      this.strTermRetDescEn = top.langen.TERMRETDESC_COMMERR;
      iRet = RESULT_FAILED;
    }
    // HTTPͨѶ��ȷ��
    else
    {
      // ��¼�ն���ˮ
      var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "HTTP Exception: " + this.xmlhttpObj.status + top.journalPrinter.strNewLine;
      top.journalPrinter.addJournal(strJrn);

      this.msgxmldomResp = new ColsMsgXmlDom(XMLDOMEMPTY);
      this.strTermRetCode = TERMRETCODE_COMMUNC;
      this.strTermRetDesc = top.langdef.TERMRETDESC_COMMUNC;
      this.strTermRetDescEn = top.langen.TERMRETDESC_COMMUNC;
      iRet = RESULT_UNCERTAIN;
    }
    return iRet;
  }


  /*����������н�����ʹ���첽��ʽ��*/
  this.doExchangeAsync = function(url, mxtreq, func)
  {
    // ��������������ͨ������ڵ�
	this.onAppendTransReqNode(mxtreq);
    this.msgxmltextReq = mxtreq;
    this.strUrl = url;
    this.onAsyncExchangeComplete = func;
    
    exchxmlasync.xmlhttpObj = createXMLHttp();		//��ֹͨѶ�쳣ʱ��xmlhttpObj���󱣴��ϴη���ֵ
    // Ϊ��ֹNT����ϵͳ�Ļ���������ʱ�ȴ�����ʱ�䣬�Ȳ�����·
    if (!this.IsServerOnLine())
    {
    	this.onAsyncExchangeComplete(top.RESULT_FAILED);
    	return;
    }
    //exchxmlasync.xmlhttpObj = createXMLHttp();

    try
    {
	  top.terminal.sendPost=true;//���÷��ͱ�־λ
	  
      exchxmlasync.xmlhttpObj.Open("POST", exchxmlasync.strUrl, true);

      exchxmlasync.xmlhttpObj.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");

      exchxmlasync.xmlhttpObj.onreadystatechange = exchxmlasync.HandleStateChange;

      exchxmlasync.xmlhttpObj.send(exchxmlasync.msgxmltextReq.toString());

    } catch(e){}
  }

  /*����������н�����ʹ���첽��ʽ(Mac)��*/
  this.doExchangeAsyncWithMac = function(url, mxtreq, func)
  {
    // ��������������ͨ������ڵ�
    this.onAppendTransReqNode(mxtreq);
    this.msgxmltextReq = mxtreq;
    this.strUrl = url;
    this.onAsyncExchangeComplete = func;
    // Ϊ��ֹNT����ϵͳ�Ļ���������ʱ�ȴ�����ʱ�䣬�Ȳ�����·
    if (!this.IsServerOnLine())
    {
      this.onAsyncExchangeComplete(top.RESULT_FAILED);
      return;
    }
    // ����MAC�����ݰ������������ĳ�ȥ<Mac>ABCDEF</Mac>,��ȥ�����ģ���ȻMAcУ�鲻��
	//�Ȱ�ȫ��ת��Ϊ���
	var strData2ValidateMac = new top.StringCtrl(this.msgxmltextReq.toString()).ToCDB();
	//ȥ���ַ����е����Ľڵ�	
	var xmlDoc = str2Dom(strData2ValidateMac);
	var root = xmlDoc.documentElement;
	for(i=0;i<root.childNodes.length;i++)
	{
		if(root.childNodes.item(i).childNodes.item(0) != null)
		{
	        var str = root.childNodes.item(i).childNodes.item(0).text;
	        if(new top.StringCtrl(str).trimChinese()){
				//�������ַ��Ľڵ�ȫ���滻��srcb
		        root.childNodes.item(i).childNodes.item(0).text = "srcb";
	        }
	   }
	   else
	   {
		   //�ѿսڵ�ȫ���滻��srcb������Ϊ�������˵Ŀսڵ��д����js��һ�µ���MACУ�鲻��
		   root.childNodes[i].text = "srcb";
	   }
	}
    strData2ValidateMac = new top.StringCtrl(dom2Str(xmlDoc)).removeAllSpace();
	// ������ת��Ϊ16�����ַ�����ʹ��YHAXCommonCtrl����MD5
    strData2ValidateMac = new top.StringCtrl("").strArr2HexStr(strData2ValidateMac);
    try{strData2ValidateMac = top.YHAXCommonCtrl.GetMd5(strData2ValidateMac).substr(0, 16);}catch(e){}
    // ��MD5ֵ����DES_ECB����
    var bytearr = new top.StringCtrl("").hexStr2ByteArr(strData2ValidateMac);
	if(top.pool.get("strEncrypType") == "SM4"){//����
	    top.pinpad.encryptECB(bytearr, "SM4MACKey", 0x0, exchxmlasync.onMacEncryptComplete);
	}else{
		top.pinpad.encryptECB(bytearr, "MACKey", 0x0, exchxmlasync.onMacEncryptComplete);
	}
  }
    /*
    ˽�к���:MAC�������ʱ�Ļص�������
    ������
      mac   MACֵ
   */
  this.onMacEncryptComplete = function(mac)
  {
    var strMac = mac;
    try{strMac = strMac.substr(0, 16);}catch(e){}
    exchxmlasync.msgxmltextReq.appendNode("Mac", strMac);
    exchxmlasync.xmlhttpObj = createXMLHttp();
    try
    {
	  top.terminal.sendPost=true;//���÷��ͱ�־λ
      exchxmlasync.xmlhttpObj.Open("POST", exchxmlasync.strUrl, true);
      exchxmlasync.xmlhttpObj.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
      exchxmlasync.xmlhttpObj.onreadystatechange = exchxmlasync.HandleStateChange;
      exchxmlasync.xmlhttpObj.send(exchxmlasync.msgxmltextReq.toString());
    } catch(e){}
  }

  /*
    ˽�к����������Ӧ״̬�����仯���¼�
  */
  this.HandleStateChange = function()
  {	
    // �ж�״̬����ֹ��ε���
    if (exchxmlasync.xmlhttpObj.readyState == 4 && exchxmlasync.onAsyncExchangeComplete != null)
    {
	  if(top.terminal.sendPost){
		  top.terminal.sendPost=false;//�����ѷ��ͱ�־λ
		  var fOldonAsyncExchangeComplete = exchxmlasync.onAsyncExchangeComplete;
		  var iRet = exchxmlasync.processResult(exchxmlasync.xmlhttpObj);
		  exchxmlasync.onAsyncExchangeComplete(iRet);  
		  // ���¸�ֵ��Ӧ����Ϊ�գ���������Ӧ����û�б仯����û�����·����첽ͨѶ����
		  if (fOldonAsyncExchangeComplete == exchxmlasync.onAsyncExchangeComplete)
			exchxmlasync.onAsyncExchangeComplete = null;
	  }else{
		  top.journalPrinter.addJournalWithTime("һ�η��ͣ���η��أ�����Ӧ");
		  
	  }
	  
      
    }
  }


 /*
  ˽�к������������ױ���������ͨ������ڵ�
  ������
    mxtreq   �����TransMsgXmlText��Ϣ���Ķ���
 */
this.onAppendTransReqNode = function(mxtreq)
{
      //�ն˺�
	  if(!mxtreq.isNodeIn("strTerminalNum")){
         mxtreq.appendNode("strTerminalNum", top.terminal.strTerminalNum);
	  }
      //���к�
	  if(!mxtreq.isNodeIn("strOrgNum")){
         mxtreq.appendNode("strOrgNum", top.terminal.strOrgNum);
	  }
      //�ն�����
	  if(!mxtreq.isNodeIn("strTerminalDate")){
         mxtreq.appendNode("strTerminalDate", new top.DateTimeCtrl(null).getYYYYMMDD().substring(4));
	  }
      //�ն�ʱ��
	  if(!mxtreq.isNodeIn("strTerminalTime")){
         mxtreq.appendNode("strTerminalTime", new top.DateTimeCtrl(null).getHHmmSS());
	  }
	  //���ܷ�ʽ
	  if(!mxtreq.isNodeIn("strEncrypType")){
         mxtreq.appendNode("strEncrypType", top.pool.get("strEncrypType"));
	  }
	  //������
	  if(mxtreq.isNodeIn("strPan") && top.pool.get("strPan") !=null && top.pool.get("strPan") != ""){//������Ŵ���
		  if(!mxtreq.isNodeIn("strCardType")){
			 mxtreq.appendNode("strCardType", top.pool.get("strCardType"));
		  }
	  }
	  //�ϴ���Ӱ��ƽ̨�����κ�
	  if(!mxtreq.isNodeIn("strBatchId")){
         mxtreq.appendNode("strBatchId", top.pool.get("strBatchId"));
	  }
	  // �жϽڵ����Ƿ���ڽ��ױ���
      if (mxtreq.isNodeIn("strTransCode"))
	  {
		var domXml = str2Dom(mxtreq);
		var strTransCode = domXml.getElementsByTagName("strTransCode").item(0).text;
		top.pool.set("strTransCode", strTransCode);
		var strProcessorName = domXml.getElementsByTagName("ProcessorName").item(0).text;
		top.pool.set("strProcessorName", strProcessorName);
	  }
	  else{
		top.pool.set("strTransCode", "");
		top.pool.set("strProcessorName", "");
	  }
	  
	  //����22���Լ�23��
	  if(top.pool.get("strICFlag") == "1"){//IC��
		 //��ҽ����й�ʧ���鿨���ܲ���Ҫ55��
		 if(top.pool.get("isNeedF55") == "1" && top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){			 
			mxtreq.appendNode("strICFlag","012"); 
		 }else{
			 if(top.pool.get("strPinBlock") == null || top.pool.get("strPinBlock") == ""){//����
				 mxtreq.appendNode("strICFlag","052");
			 }else{//����
				 mxtreq.appendNode("strICFlag","051"); 
			 }
			 mxtreq.appendNode("strField55", top.pool.get("strField55"));
			 mxtreq.appendNode("str5F34", top.pool.get("str5F34"));
		 }
	  }
	  else{
		 if(top.pool.get("strPinBlock") == null || top.pool.get("strPinBlock") == ""){//����
		     mxtreq.appendNode("strICFlag","022");
		 }else{//����
			 mxtreq.appendNode("strICFlag","021"); 
		 }
	  }
	  
	  //���ӿͻ���ˮ��
	  if(!mxtreq.isNodeIn("strSingleBusinessNum")){
         mxtreq.appendNode("strSingleBusinessNum", top.pool.get("strSingleBusinessNum"));
	  }
}
  /*
    ���״̬�Ƿ�ɹ�
  */
  this.isStatusSuccessful = function()
  {
    return (
      this.xmlhttpObj.status == 200 ||
      this.xmlhttpObj.status == 201 ||
      this.xmlhttpObj.status == 304);
  }

  /*
    ���״̬�Ƿ�ʧ��
  */
  this.isStatusFailed = function()
  {
    return (
      this.xmlhttpObj.status == 12007 ||
      this.xmlhttpObj.status == 403 ||
      this.xmlhttpObj.status == 400 ||
      this.xmlhttpObj.status == 404 );
  }
  
  
  this.getChildTextByTag = function(tagName){
	  try{
		  if("" == this.xmlhttpObj.responseText || null == this.xmlhttpObj.responseText)
			  return "";
		  var responseText = new ColsMsgXmlText().decodeXml(this.xmlhttpObj.responseText);
		  var start = responseText.indexOf("<"+ tagName+">");
		  var end = responseText.indexOf("</"+ tagName+">");
		  if(start > -1 && (end > start)){
			  return responseText.substring(start+tagName.length+2,end);
		  }
	  }catch(e){
		  top.journalPrinter.addJournalWithTime("getChildTextByTag " + e);
		  return "";
	  }
	  
	return "";
  }
}

// ʵ�����첽ͨѶ����
var exchxmlasync = new ExchangeXmlWithHost();

/***********************debug************************/
//���ļ�д�����Ϣ�����ʱ��ӡ��ƾ���ϡ�
function addTransExceptionContent(text)
{
	try{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var ff = fso.OpenTextFile("C:\\temp.txt",2,true);
		ff.WriteLine(text);
		ff.Close();
		
	}catch(e)
	{
	}
}
