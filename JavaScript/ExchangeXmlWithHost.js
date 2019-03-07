// XML协议报文根节点名称
var YH_COLSTRANS_XMLROOT = "TransMsg";

/*
  atmc消息XML文本方式报文类，一般用于请求构造
 */
function ColsMsgXmlText()
{
  this.strbufMsg = "";
  this.arrNodeNames = new Array();
  
  /*
    Encode字符串，即将字符串中的保留字使用转义字符串替换
    参数：val 需要Encode的字符串
    返回：转换后的字符串
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
    Decode字符串，即将字符串中的保留字使用转义字符串替换
    参数：val 需要Decode的字符串
    返回：转换后的字符串
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
    Decode字符串，即将字符串中的保留字使用转义字符串替换
    参数：val 需要Decode的字符串
    返回：转换后的字符串
	注:&符号转换后，xml无法解析，所以去掉&的转义。为保证不影响其他调用，新增该方法。
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
	if(this.strbufMsg.indexOf(str) == -1){//如果存在该节点，则不需要再添加同样的节点,不存在，则添加其节点
	   this.startNode(strName);
	   this.strbufMsg += this.encodeXml(strVal);
       this.endNode(strName);
	}else{//存在的话，直接修改该节点的值，以最后一次为准
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
    从属性集合对象中添加一组键值
    参数：
      props   Properties属性集合对象
      ...     可变参数，要添加的各个属性名
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
    在报文尾部增加Mac键值字段，通常该方法只用于报文构造完成时添加Mac校验值
  */
  this.appendMac = function(strMac)
  {
    this.appendElement("Mac", strMac);
  }

  /*
    转换消息报文对象至字符串
  */
  this.toString = function()
  {
    return "<" + YH_COLSTRANS_XMLROOT + ">" + this.strbufMsg + "</" + YH_COLSTRANS_XMLROOT + ">";
  } 
  
  /*
    把字符串转换成base64字符串
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
  
  //将Base64编码字符串转换成Ansi编码的字符串
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
  atmc消息XML DOM方式报文类，一般用于回应解析
 */
function ColsMsgXmlDom(doc)
{
  this.docXmlDom = doc;
  this.docXmlDom.setProperty("SelectionLanguage", "XPath");
  
  /*
    Decode字符串，即将字符串中的转义字符串替换为保留字
    参数：
      val 需要Decode的字符串
    返回：
      转换后的字符串
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
   * 根据结点路径，获得某个其相应的值；
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
   * 取得相同结点的数量；
   */
  
  this.selectNodesCount = function(xpath)
  {
  	return this.docXmlDom.selectNodes(xpath).length;
  }
  
  /*
   * 根据标签名和标签内容组成新节点；
   * 参数：
   * 		NodeVal		节点值
   * 		NodeName	节点名称
   * 返回：包含标签名和标签内容的字符串
   */
  
  this.SetNodeStr = function(NodeVal,NodeName){
		if(NodeName == null || NodeName == ""){
			return "";
		}
		var retMsg = "";
		var StartNode = "<" + NodeName + ">" ;	//开始节点
		var EndNode = "</" + NodeName + ">";	//结束节点
		NodeVal = StartNode + NodeVal + EndNode;
		return NodeVal;	
	}

}

/*
  与主机进行交互的类
 */
function ExchangeXmlWithHost()
{
  // XMLHTTP控件对象
  this.xmlhttpObj;
  // 请求的目标URL
  this.strUrl = "";
  // 请求的TransMsgReq对象
  this.msgxmltextReq = null;
  // 与服务器异步交互完成时的回调函数
  this.onAsyncExchangeComplete = null;

  // 终端返回码
  this.strTermRetCode = "";
  // 终端返回描述中文
  this.strTermRetDesc = "";
  // 终端返回描述英文
  this.strTermRetDescEn = "";
  // 服务器返回的TransMsgXmlDom对象
  this.msgxmldomResp = new ColsMsgXmlDom(XMLDOMEMPTY);
  /*与服务器进行交互*/
  this.doExchange = function(url, mxtreq)
  {
    // 为防止NT操作系统的机器在连接时等待过长时间，先测试线路
    if (!this.IsServerOnLine())
      return top.RESULT_FAILED;
    // 在请求报文中增加通用请求节点
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
    测试服务器线路是否正常
    参数：
      url   请求的URL
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
    私有函数:处理与服务器进行交互的结果
    返回：
      交互结果值，包括下面几种：
        RESULT_SUCCESSFUL
        RESULT_FAILED
        RESULT_UNCERTAIN
   */
  this.processResult = function()
  {
    // HTTP通讯成功
    if (this.isStatusSuccessful())
    {
      var source = createXMLDOM(); 
      source.async = false;
	  //注:&符号转换后，xml无法解析，所以去掉&的转义。为保证不影响其他调用，新增该方法。
      source.loadXML(new ColsMsgXmlText().decodeXml2(Trim(this.xmlhttpObj.responseText)));
  	  addTransExceptionContent(source.xml)
      this.msgxmldomResp = new ColsMsgXmlDom(source);
      this.strTermRetCode = this.msgxmldomResp.getElementValue("TermRetCode");
      this.strTermRetDesc = this.msgxmldomResp.getElementValue("TermRetDesc");
      this.strTermRetDescEn = this.msgxmldomResp.getElementValue("TermRetDescEn");

      // 根据服务器返回的终端返回码，进一步决定交互结果的返回值
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
    // HTTP通讯失败
    else if (this.isStatusFailed())
    {
      // 记录终端流水
      var strJrn = new top.DateTimeCtrl().getHHmmSSWithSep() + " " + "HTTP Failed: " + this.xmlhttpObj.status + top.journalPrinter.strNewLine;
      top.journalPrinter.addJournal(strJrn);

      this.msgxmldomResp = new ColsMsgXmlDom(XMLDOMEMPTY);
      this.strTermRetCode = top.TERMRETCODE_COMMERR;
      this.strTermRetDesc = top.langdef.TERMRETDESC_COMMERR;
      this.strTermRetDescEn = top.langen.TERMRETDESC_COMMERR;
      iRet = RESULT_FAILED;
    }
    // HTTP通讯不确定
    else
    {
      // 记录终端流水
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


  /*与服务器进行交互，使用异步方式。*/
  this.doExchangeAsync = function(url, mxtreq, func)
  {
    // 在请求报文中增加通用请求节点
	this.onAppendTransReqNode(mxtreq);
    this.msgxmltextReq = mxtreq;
    this.strUrl = url;
    this.onAsyncExchangeComplete = func;
    
    exchxmlasync.xmlhttpObj = createXMLHttp();		//防止通讯异常时，xmlhttpObj对象保存上次返回值
    // 为防止NT操作系统的机器在连接时等待过长时间，先测试线路
    if (!this.IsServerOnLine())
    {
    	this.onAsyncExchangeComplete(top.RESULT_FAILED);
    	return;
    }
    //exchxmlasync.xmlhttpObj = createXMLHttp();

    try
    {
	  top.terminal.sendPost=true;//设置发送标志位
	  
      exchxmlasync.xmlhttpObj.Open("POST", exchxmlasync.strUrl, true);

      exchxmlasync.xmlhttpObj.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");

      exchxmlasync.xmlhttpObj.onreadystatechange = exchxmlasync.HandleStateChange;

      exchxmlasync.xmlhttpObj.send(exchxmlasync.msgxmltextReq.toString());

    } catch(e){}
  }

  /*与服务器进行交互，使用异步方式(Mac)。*/
  this.doExchangeAsyncWithMac = function(url, mxtreq, func)
  {
    // 在请求报文中增加通用请求节点
    this.onAppendTransReqNode(mxtreq);
    this.msgxmltextReq = mxtreq;
    this.strUrl = url;
    this.onAsyncExchangeComplete = func;
    // 为防止NT操作系统的机器在连接时等待过长时间，先测试线路
    if (!this.IsServerOnLine())
    {
      this.onAsyncExchangeComplete(top.RESULT_FAILED);
      return;
    }
    // 计算MAC的数据包括完整请求报文除去<Mac>ABCDEF</Mac>,并去掉中文，不然MAc校验不过
	//先把全角转换为半角
	var strData2ValidateMac = new top.StringCtrl(this.msgxmltextReq.toString()).ToCDB();
	//去掉字符串中的中文节点	
	var xmlDoc = str2Dom(strData2ValidateMac);
	var root = xmlDoc.documentElement;
	for(i=0;i<root.childNodes.length;i++)
	{
		if(root.childNodes.item(i).childNodes.item(0) != null)
		{
	        var str = root.childNodes.item(i).childNodes.item(0).text;
	        if(new top.StringCtrl(str).trimChinese()){
				//把中文字符的节点全部替换成srcb
		        root.childNodes.item(i).childNodes.item(0).text = "srcb";
	        }
	   }
	   else
	   {
		   //把空节点全部替换成srcb，是因为服务器端的空节点的写法和js不一致导致MAC校验不过
		   root.childNodes[i].text = "srcb";
	   }
	}
    strData2ValidateMac = new top.StringCtrl(dom2Str(xmlDoc)).removeAllSpace();
	// 将数据转换为16进制字符串，使用YHAXCommonCtrl计算MD5
    strData2ValidateMac = new top.StringCtrl("").strArr2HexStr(strData2ValidateMac);
    try{strData2ValidateMac = top.YHAXCommonCtrl.GetMd5(strData2ValidateMac).substr(0, 16);}catch(e){}
    // 对MD5值进行DES_ECB计算
    var bytearr = new top.StringCtrl("").hexStr2ByteArr(strData2ValidateMac);
	if(top.pool.get("strEncrypType") == "SM4"){//国密
	    top.pinpad.encryptECB(bytearr, "SM4MACKey", 0x0, exchxmlasync.onMacEncryptComplete);
	}else{
		top.pinpad.encryptECB(bytearr, "MACKey", 0x0, exchxmlasync.onMacEncryptComplete);
	}
  }
    /*
    私有函数:MAC计算完成时的回调处理函数
    参数：
      mac   MAC值
   */
  this.onMacEncryptComplete = function(mac)
  {
    var strMac = mac;
    try{strMac = strMac.substr(0, 16);}catch(e){}
    exchxmlasync.msgxmltextReq.appendNode("Mac", strMac);
    exchxmlasync.xmlhttpObj = createXMLHttp();
    try
    {
	  top.terminal.sendPost=true;//设置发送标志位
      exchxmlasync.xmlhttpObj.Open("POST", exchxmlasync.strUrl, true);
      exchxmlasync.xmlhttpObj.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
      exchxmlasync.xmlhttpObj.onreadystatechange = exchxmlasync.HandleStateChange;
      exchxmlasync.xmlhttpObj.send(exchxmlasync.msgxmltextReq.toString());
    } catch(e){}
  }

  /*
    私有函数：处理回应状态发生变化的事件
  */
  this.HandleStateChange = function()
  {	
    // 判断状态，防止多次调用
    if (exchxmlasync.xmlhttpObj.readyState == 4 && exchxmlasync.onAsyncExchangeComplete != null)
    {
	  if(top.terminal.sendPost){
		  top.terminal.sendPost=false;//设置已发送标志位
		  var fOldonAsyncExchangeComplete = exchxmlasync.onAsyncExchangeComplete;
		  var iRet = exchxmlasync.processResult(exchxmlasync.xmlhttpObj);
		  exchxmlasync.onAsyncExchangeComplete(iRet);  
		  // 重新赋值响应函数为空，条件是响应函数没有变化，即没有重新发起异步通讯动作
		  if (fOldonAsyncExchangeComplete == exchxmlasync.onAsyncExchangeComplete)
			exchxmlasync.onAsyncExchangeComplete = null;
	  }else{
		  top.journalPrinter.addJournalWithTime("一次发送，多次返回，不响应");
		  
	  }
	  
      
    }
  }


 /*
  私有函数：在请求交易报文中增加通用请求节点
  参数：
    mxtreq   请求的TransMsgXmlText消息报文对象
 */
this.onAppendTransReqNode = function(mxtreq)
{
      //终端号
	  if(!mxtreq.isNodeIn("strTerminalNum")){
         mxtreq.appendNode("strTerminalNum", top.terminal.strTerminalNum);
	  }
      //分行号
	  if(!mxtreq.isNodeIn("strOrgNum")){
         mxtreq.appendNode("strOrgNum", top.terminal.strOrgNum);
	  }
      //终端日期
	  if(!mxtreq.isNodeIn("strTerminalDate")){
         mxtreq.appendNode("strTerminalDate", new top.DateTimeCtrl(null).getYYYYMMDD().substring(4));
	  }
      //终端时间
	  if(!mxtreq.isNodeIn("strTerminalTime")){
         mxtreq.appendNode("strTerminalTime", new top.DateTimeCtrl(null).getHHmmSS());
	  }
	  //加密方式
	  if(!mxtreq.isNodeIn("strEncrypType")){
         mxtreq.appendNode("strEncrypType", top.pool.get("strEncrypType"));
	  }
	  //卡类型
	  if(mxtreq.isNodeIn("strPan") && top.pool.get("strPan") !=null && top.pool.get("strPan") != ""){//如果卡号存在
		  if(!mxtreq.isNodeIn("strCardType")){
			 mxtreq.appendNode("strCardType", top.pool.get("strCardType"));
		  }
	  }
	  //上传至影像平台的批次号
	  if(!mxtreq.isNodeIn("strBatchId")){
         mxtreq.appendNode("strBatchId", top.pool.get("strBatchId"));
	  }
	  // 判断节点中是否存在交易编码
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
	  
	  //增加22域以及23域
	  if(top.pool.get("strICFlag") == "1"){//IC卡
		 //解挂交易中挂失卡验卡验密不需要55域
		 if(top.pool.get("isNeedF55") == "1" && top.pool.get("isLockTrans")=="1" && top.pool.get("isCardLock")=="1"){			 
			mxtreq.appendNode("strICFlag","012"); 
		 }else{
			 if(top.pool.get("strPinBlock") == null || top.pool.get("strPinBlock") == ""){//无密
				 mxtreq.appendNode("strICFlag","052");
			 }else{//有密
				 mxtreq.appendNode("strICFlag","051"); 
			 }
			 mxtreq.appendNode("strField55", top.pool.get("strField55"));
			 mxtreq.appendNode("str5F34", top.pool.get("str5F34"));
		 }
	  }
	  else{
		 if(top.pool.get("strPinBlock") == null || top.pool.get("strPinBlock") == ""){//无密
		     mxtreq.appendNode("strICFlag","022");
		 }else{//有密
			 mxtreq.appendNode("strICFlag","021"); 
		 }
	  }
	  
	  //增加客户流水号
	  if(!mxtreq.isNodeIn("strSingleBusinessNum")){
         mxtreq.appendNode("strSingleBusinessNum", top.pool.get("strSingleBusinessNum"));
	  }
}
  /*
    结果状态是否成功
  */
  this.isStatusSuccessful = function()
  {
    return (
      this.xmlhttpObj.status == 200 ||
      this.xmlhttpObj.status == 201 ||
      this.xmlhttpObj.status == 304);
  }

  /*
    结果状态是否失败
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

// 实例化异步通讯对象
var exchxmlasync = new ExchangeXmlWithHost();

/***********************debug************************/
//向文件写相关信息，清机时打印在凭条上。
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
