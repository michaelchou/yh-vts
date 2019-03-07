/*
  密码锁操作类
 */
function EleLock()
{
	/*
	 数据下行处理（控件-->锁具）
	 参数：给锁具下行的数据（返回报文F60域）
	 返回 ： true-成功    false-失败
	 */
	this.WriteReport = function(downData){
		downData = downData.substring(downData.indexOf("<",0),downData.length);
		var xmlLen = downData.length;
		xmlLen = new top.StringCtrl("" + xmlLen).prefixStr(' ',10);
		downData = xmlLen + downData;	//在XML报文前加上10位长度
		var result = false;
		if (typeof(SGP1506KM3000D) != "undefined"){
			try{
				result=SGP1506KM3000D.WriteReport(downData);//数据下行接口
			}catch(e){
				top.journalPrinter.addJournalWithTime("数据下行时错误：" + e);
			}
		}
		return result;
	}
	
	/*
	 数据上行处理(锁具-->控件)
	 参数：锁具上送的报文
	 返回：空
	 */
	this.MessageReceived = function(upData){
		var trCode = "";			//密码锁交易码
		var trCodeDesc = "";		//交易码描述
		var lockStatus = "";		//锁具状态
		
	    top.pool.set("strEleLock",upData);
		top.pool.set("EleLockSign","T");	//有数据上送，锁具状态为存在
		trCode = this.GetNodeVal(upData,"Ex_TrCode");	//获取交易码
		trCodeDesc = this.convertTranCode(trCode);
		lockStatus = this.GetNodeVal(upData,"Ex_LockStatus");	//获取锁具状态
	
		top.journalPrinter.addJournalWithTime("接收到密码锁上送" + trCodeDesc + "交易  交易码：" + trCode);
		//截取锁具状态第9-10位  "00"-正常   "01"-震动
		if(lockStatus != "" && lockStatus != null){
			if(lockStatus.substring(8,10) == "01"){
				top.journalPrinter.addJournalWithTime("密码锁发生震动");
				setTimeout(this.getEleLockStatus,10*60*1000);
			}
		}
		//alert(lockStatus);
		//主动查询锁具状态，不往服务器发
		if(trCode != "" && trCode != null && trCode == "2011"){
			top.serviceCtrl.sendEleLockStatus(lockStatus);		//发送锁状态到监控
			return;
		}
		//非维护状态或不在开锁界面不响应电子密码锁上送的数据
		if (top.pool.get("customStatus") == "1" && top.pool.get("OpenEleLockAllowed")){
			top.wins.showProcessingTip("正在处理,请稍候...");
			top.trans.send930000Async();	//电子密码锁请求交易
			
			if(lockStatus != "" && lockStatus != null)
				top.serviceCtrl.sendEleLockStatus(lockStatus);		//发送锁状态到监控
		}else if(trCode == "1005" || trCode == "2008"){
			//闭锁码交易可不限制在管理员
			top.trans.send930000Async();	//电子密码锁请求交易
			if(lockStatus != "" && lockStatus != null)
				top.serviceCtrl.sendEleLockStatus(lockStatus);		//发送锁状态到监控
		}else if(top.pool.get("customStatus") == "1" && trCode != "1004" && trCode != "2007"){
			//除获取开锁码的交易，其他交易不在指定界面允许发送交易
			top.trans.send930000Async();	//电子密码锁请求交易
			if(lockStatus != "" && lockStatus != null)
				top.serviceCtrl.sendEleLockStatus(lockStatus);		//发送锁状态到监控
		}else{
			top.journalPrinter.addJournalWithTime("非维护状态或不在开锁界面，忽略密码锁上送数据");
			return;
		}
		
	}
	
	/*
	 根据指定节点获取相应的值
	 参数：
	 	XmlStr	密码锁上送到控件的数据
	 	NodeName	节点名称
	 返回：
	 	节点值
	 */
	this.GetNodeVal = function(XmlStr,NodeName){
		if(XmlStr.length < 1){
			return "";
		}
		var NodeVal = "";	//节点值
		var StartNode = "<" + NodeName + ">" ;	//开始节点
		var EndNode = "</" + NodeName + ">";	//结束节点
		var StartPos = XmlStr.indexOf(StartNode,0) + StartNode.length;	//开始位置
		var EndPos = XmlStr.indexOf(EndNode,StartPos);	//结束位置
		NodeVal = XmlStr.substring(StartPos,EndPos);	//截取节点值
		if(StartPos < StartNode.length){
		//开始节点不存在，则返回空
			NodeVal = "";
		}else if(EndPos < 0){
		//结束节点不存在，则返回空
			NodeVal = "";
		}
		return NodeVal;	
		
	}
	
	/*
	 根据指定节点名称及节点值组XML字符串
	 参数：
	 	NodeVal		节点值
	 	NodeName	节点名称
	 返回：
	 	XML字符串
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
	
	/*
	 查询密码锁状态
	 */
	this.getEleLockStatus = function(){
		try{
			var xmlMsg = top.eleLock.SetNodeStr(new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS(),"Ex_TrTime")
			           + top.eleLock.SetNodeStr(new top.DateTimeCtrl().getHHmmSS().substr(0,4),"Ex_SeqNo")
			           + top.eleLock.SetNodeStr("V100R0000","Ex_Version")
			           + top.eleLock.SetNodeStr("2011","Ex_TrCode")
			           + top.eleLock.SetNodeStr(new top.StringCtrl("0").prefixStr('0',16),"Ex_LockId");
			var result = top.eleLock.WriteReport(xmlMsg);
			top.journalPrinter.addJournalWithTime("电子密码锁状态查询结果:" + result);
			//设置锁存在状态未知
			top.pool.set("EleLockSign","F");
			if(!result){
				//发送锁具状态到监控
				top.serviceCtrl.sendEleLockStatus(new top.StringCtrl("0").prefixStr('0',16));
			}
		}catch(e){
			top.journalPrinter.addJournalWithTime("查询电子密码锁状态时错误:" + e);
			//发送锁具状态到监控
			top.serviceCtrl.sendEleLockStatus(new top.StringCtrl("0").prefixStr('0',16));
		}
	}
	
	/*
	 * 把字符串转换成base64字符串
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
	
	/*
	 密码锁请求交易码转义
	 参数：密码锁交易码
	 返回：转义字符
	 */
	this.convertTranCode = function(TranCode){
		TranCode ="" + TranCode
		switch(TranCode) {
			case "1001" : return "PDA请求WMK";
			case "1002" : return "PDA请求TMK";
			case "1003" : return "PDA请求AMK";
			case "1004" : return "PDA登录并获取开锁码";
			case "1005" : return "PDA上传闭锁码";
			case "1006" : return "PDA请求激活";
			case "1007" : return "PDA上传锁具激活信息";
			case "2001" : return "请求WMK";
			case "2002" : return "请求TMK";
			case "2003" : return "请求AMK";
			case "2004" : return "请求DMK";
			case "2005" : return "请求激活及配置数据";
			case "2006" : return "上传激活信息";
			case "2007" : return "登录并获取开锁码";
			case "2008" : return "上传闭锁码";
			case "2009" : return "上报锁状态";
			case "2010" : return "服务器端查询锁具操作记录";
			case "2011" : return "查询锁具状态";
			case "4000" : return "在线应急获取开锁码";
			default : return "其他"
		}
	}
	
	/*
	 密码锁系统返回码转义
	 参数：密码锁系统返回码
	 返回：转义字符
	 */
	this.convertRetCode = function(RetCode){
		RetCode ="" + RetCode
		switch(RetCode) {
			case "2100" : return "请求密码主机时返回错误";
			case "2101" : return "无锁具信息";
			case "2102" : return "锁具被删除或已停用";
			case "2103" : return "获取系统配置错误";
			case "2104" : return "获取锁具所属机构信息错误";
			case "2105" : return "个人码错误（校验失败）";
			case "2106" : return "随机数错误（校验失败）";
			case "2107" : return "闭锁码错误（校验失败）";
			case "3000" : return "用户A指纹验证失败";
			case "3001" : return "用户B指纹验证失败";
			case "3002" : return "用户A不存在";
			case "3003" : return "用户B不存在";
			case "3004" : return "用户A密码校验失败";
			case "3005" : return "用户B密码校验失败";
			case "3006" : return "用户A无加钞权限";
			case "3007" : return "用户B无加钞权限";
			case "3008" : return "两名加钞员非同一机构";
			case "3013" : return "用户A未设置电话号码";
			case "3014" : return "用户B未设置电话号码";
			case "3053" : return "短信发送失败";
			case "4000" : return "当前无有效任务";
			case "4001" : return "当前用户未分配加钞任务";
			case "4002" : return "加钞用户不能操作其他机构的锁具";
			case "4003" : return "任务中未选择加钞员A";
			case "4004" : return "任务中未选择加钞员B";
			case "9901" : return "密码主机无应答";
			case "9998" : return "不支持的交易码";
			case "9999" : return "系统异常";
			default : return ""
		}
	}
}