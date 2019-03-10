/*
 * 钞箱查询类
 */
function CashBoxCheck()
{
	//获取钞箱信息(钞箱变动调用)
	this.getCashBoxInfo = function(){
		var cashBoxInfoArr = new Array();	//钞箱信息数组
		if(typeof(top.YHAXCashDispenser) != "undefined"){
			var logicalunitsCDM = top.YHAXCashDispenser.LogicalUnits;
			for(var i=0; i<logicalunitsCDM.Count;i++){
				//取款钞箱
				var logicalunitCDM = logicalunitsCDM.Item(i);
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitCDM.Number,						//编号
						converStatus(logicalunitCDM.Status),		//状态
						parseInt(logicalunitCDM.NoteValue) * 100,	//面值，以分为单位
						logicalunitCDM.InitialCount,				//初始张数
						logicalunitCDM.CurrentCount,				//当前张数
						"0"				//纸币钞箱，类型为"0"
					);
			}
		}
		
		if(typeof(top.YHAXCashAcceptor) != "undefined"){
			var logicalunitsCIM = top.YHAXCashAcceptor.LogicalUnits;
			for(var j=0; j<logicalunitsCIM.Count;j++){
				var isExit = false;
				//存款钞箱
				var logicalunitCIM = logicalunitsCIM.Item(j);
				for(var l=0;l<logicalunitsCDM.Count;l++){
					//比较存取款钞箱的Number，重复则过滤
					if(logicalunitCIM.Number == logicalunitsCDM.Item(l).Number){
						isExit = true;
						break;
					}
				}
				if(isExit){
					continue;
				}
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitCIM.Number,							//编号
						converStatus(logicalunitCIM.Status),			//状态
						parseInt(logicalunitCIM.Denomination) * 100,	//面值，以分为单位
						logicalunitCIM.InitialCount,					//初始张数
						logicalunitCIM.CurrentCount,					//当前张数
						"0"			//纸币钞箱类型为0
					);
			}
		}
		
		if(typeof(top.YHAXCashDispenserFen) != "undefined"){
			var logicalunitsFen = top.YHAXCashDispenserFen.LogicalUnits;
			for(var k=0; k<logicalunitsFen.Count;k++){
				//硬币钞箱
				var logicalunitFen = logicalunitsFen.Item(k);
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitFen.Number,					//编号
						converStatus(logicalunitFen.Status),	//状态
						logicalunitFen.NoteValue,				//面值，以分为单位
						logicalunitFen.InitialCount,			//初始张数
						logicalunitFen.CurrentCount,			//当前张数
						"1"			//硬币钞箱类型为1
					);
			}
		}
		
		var len = cashBoxInfoArr.length;
		var msgData = "";
		var msgDatas = "";
		for(var i=0;i<len;i++){
			msgData = "";
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][0],"box_no");	//钞箱Number
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][1],"status"); 	//钞箱状态
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][2],"denom"); 	//钞箱面值
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][3],"cash_count0");//初始张数
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][4],"cash_count");//结存张数
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][5],"box_type"); 	//钞箱类型
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr("","remark"); 						//备注说明
			msgDatas += top.exchxmlasync.msgxmldomResp.SetNodeStr(msgData,"item");
		}
		return msgDatas;
	}

	/*
	 * 作用：获取钞箱信息
	 * 参数：无
	 * 返回：钞箱信息字符串（钞箱属性之间用','分隔，多个钞箱使用‘|’分隔）
	 */
	this.getCashBoxInfoStr = function(){
		var cashBoxInfoArr = new Array();	//钞箱信息数组
		if(typeof(top.YHAXCashDispenser) != "undefined"){
			var logicalunitsCDM = top.YHAXCashDispenser.LogicalUnits;
			for(var i=0; i<logicalunitsCDM.Count;i++){
				//取款钞箱
				var logicalunitCDM = logicalunitsCDM.Item(i);
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitCDM.Id,							//ID
						logicalunitCDM.Number,						//编号
						converType(logicalunitCDM.Type),			//类型
						converStatus(logicalunitCDM.Status),		//状态
						parseInt(logicalunitCDM.NoteValue),			//面值，以分为单位
						logicalunitCDM.InitialCount,				//初始张数
						logicalunitCDM.CurrentCount,				//当前张数
						"0"				//纸币钞箱，类型为"0"
					);
			}
		}
		
		if(typeof(top.YHAXCashAcceptor) != "undefined"){
			var logicalunitsCIM = top.YHAXCashAcceptor.LogicalUnits;
			for(var j=0; j<logicalunitsCIM.Count;j++){
				var isExit = false;
				//存款钞箱
				var logicalunitCIM = logicalunitsCIM.Item(j);
				for(var l=0;l<logicalunitsCDM.Count;l++){
					//比较存取款钞箱的Number，重复则过滤
					if(logicalunitCIM.Number == logicalunitsCDM.Item(l).Number){
						isExit = true;
						break;
					}
				}
				if(isExit){
					continue;
				}
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitCIM.Id,								//ID
						logicalunitCIM.Number,							//编号
						converType(logicalunitCIM.Type),				//类型
						converStatus(logicalunitCIM.Status),			//状态
						parseInt(logicalunitCIM.Denomination),			//面值
						logicalunitCIM.InitialCount,					//初始张数
						logicalunitCIM.CurrentCount,					//当前张数
						"0"			//纸币钞箱类型为0
					);
			}
		}
		
		if(typeof(top.YHAXCashDispenserFen) != "undefined"){
			var logicalunitsFen = top.YHAXCashDispenserFen.LogicalUnits;
			for(var k=0; k<logicalunitsFen.Count;k++){
				//硬币钞箱
				var logicalunitFen = logicalunitsFen.Item(k);
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitFen.Id,						//ID
						logicalunitFen.Number,					//编号
						converType(logicalunitFen.Type),		//类型
						converStatus(logicalunitFen.Status),	//状态
						logicalunitFen.NoteValue,				//面值，以分为单位
						logicalunitFen.InitialCount,			//初始张数
						logicalunitFen.CurrentCount,			//当前张数
						"1"			//硬币钞箱类型为1
					);
			}
		}
		var retStr = "";
		var len = cashBoxInfoArr.length;
		for(var i=0;i<len;i++){
			if(i != len-1)
				retStr += cashBoxInfoArr[i].join(",")+"|";
			else
				retStr += cashBoxInfoArr[i].join(",");
			
		}
		return retStr;		//返回钞箱信息字符串
	}
	
	/*
	 * 获取钞箱信息：钞箱变动记日志时调用
	 * 返回：字符串
	 * 格式说明：ID_面值+单位:张数 | ID_面值+单位:张数 | ID_面值+单位:张数 |···
	 */
	this.getCashBoxRecord = function(){
	   try{
		   var CashBoxInfoArr = new Array();
		   var CashBoxInfosArr = new Array();
		   var CashBoxInfoStr = new top.CashBoxCheck().getCashBoxInfoStr();		//获取本地钞箱信息 
		   var strTemp = "";
		   var strUnit = "";
			CashBoxInfosArr = CashBoxInfoStr.split('|');
			var len = CashBoxInfosArr.length;
			for(var i=0;i<len;i++){
				CashBoxInfoArr[i] = CashBoxInfosArr[i].split(',');
				if(CashBoxInfoArr[i][7] == "1"){
					strUnit = "分";
				}else if(CashBoxInfoArr[i][7] == "0"){
					strUnit = "元";
				}
				strTemp += CashBoxInfoArr[i][0] + "_" + CashBoxInfoArr[i][4] + strUnit + ":" + CashBoxInfoArr[i][6] + "|";
			}
			return strTemp;
	   }catch(e){
			top.journalPrinter.addJournalWithTime("getCashBoxRecord方法返回异常  " + e);
			return "";
		}
	}
	/*
	 * 钞箱状态转义
	 */
	function converStatus(uStatus){
		switch(uStatus) {
			case "HEALTHY" : return "0";	//正常
			case "LOW" : return "1";		//将空
			case "HIGH" : return "2";		//将满
			case "FULL" : return "3";		//钞满
			case "EMPTY" :return "4";		//钞空
			case "MISSING" :return "5";		//缺失
			case "UNKNOWN" :return "5";		//未知
			case "INOPERATIVE" :return "6";	//无效
			
		}
		return uStatus;
	}
	/*
	 * 钞箱类型转义
	 */
	function converType(uType){
		switch(uType) {
			case "REJECTCASSETTE" : return "拒钞箱"; 
			case "BILLCASSETTE" : return "取款箱";
			case "RETRACTCASSETTE" : return "回收箱";
			case "COINCYLINDER" : return "硬币箱";
			case "COINDISPENSER" : return "硬币箱";
			case "RECYCLINGCASSETTE" :return "循环箱";
			case "CASHIN" :return "存款箱";
			case "RECYCLER" :return "循环箱";
			case "RETRACT" :return "回收箱";
			case "REJECT" :return "拒钞箱";
			default : return "其他"
		}
		return uType;
	}
}