 /*
   *终端信息类
 */
function Terminal()
{
  /*终端ID*/	
  this.id = -1;
  /*终端编号*/
  this.strTerminalNum = "";
  /*机构号*/
  this.strOrgNum = "";
  /*柜员号*/
  this.strTellerNum="";
  /*终端状态*/
  this.status = -1;
  /*终端风格*/
  this.strTerminalStyle = "";
  /*是否强制打凭条*/
  this.bPrintReceipt = true;
  /*转账行信息*/	
  this.bankList = new Array();
  /*省份信息*/	
  this.provinceList = new Array();
  /*城市信息*/	
  this.cityList = new Array();
  
  this.devType = 12;
  
  /*true 为智能柜员机  false为移动智能柜员机*/
  this.isSmartTeller = true; 
  
  //签到柜员号
  this.signTellerNum = "";
  //设备型号
  this.strDevModelName = "";
  //发送交易标识
  this.sendPost = true;
  //当前叫号号码 默认为空
  this.currentCallNumber = "";
  //上笔叫号号码 默认为空
  this.previousCallNumber = "";
  //叫号开关 true:开  false:关
  this.QueueNumberFlag = true;
  
  //获取设备类型 用于叫号  CASH:现金智柜 NOMA:非现智柜
  this.getDeviceType = function(){
	  if(this.strDevModelName.indexOf("_") > -1){
		  return "CASH";
	  }else{
		  return "NOMA";
	  }
  }
  
  //滑动退出标识，用于叫号
  this.swipquit = "";
  //滑动退出标识,关闭读卡器标识，用于叫号
  this.swipquitcard = "";
  
}
  