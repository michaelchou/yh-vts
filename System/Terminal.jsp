<%
 /**
  * 终端初始化主界面
 */
%>
<%@ page contentType="text/html; charset=GBK" %>
<%@ page language="java" import="java.util.List,com.yihuacomputer.cols.entity.*,com.yihuacomputer.cols.database.*"%>
<%
// 设置较大缓冲区,使服务器完成页面构造后再一次发送避免多次发送的网络异常。
response.setBufferSize(1024*64);
// 获取终端客户端IP地址
String strClientIP = request.getParameter("Client-IP");
if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
  strClientIP = request.getHeader("Proxy-Client-IP");
if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
  strClientIP = request.getHeader("WL-Proxy-Client-IP");
if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
  strClientIP = request.getHeader("x-forwarded-for");
if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
  strClientIP = request.getRemoteAddr();
 
//根据当前终端IP地址查询其详细信息
TerminalDB terminaldb = new TerminalDB();
Terminal terminal = terminaldb.getTerminalByNetAddr(strClientIP);

boolean isValidTerminal = false;     // 是否是合法终端标识
int id =-1;                          //终端id号
String strTerminalNum = "";          //终端编号
String strOrgNum = "";               //机构编号
String strTellerNum = "";            //柜员编号
int status = -1;                     //终端状态
String strTerminalStyle = "Default"; //终端风格
String strDevModelName = "";         //设备型号

if (terminal != null)
{
    isValidTerminal = true;
	id = terminal.getId();
    strTerminalNum = terminal.getStrTerminalNum();
	strOrgNum = terminal.getStrOrgNum();
	strTellerNum = terminal.getStrTellerNum();
    status = terminal.getStatus();
	strTerminalStyle = terminal.getStrTerminalStyle();
	DevModelDB devModelDb = new DevModelDB();
	DevModel devModel = devModelDb.getDevModelByIdNoCache(terminal.getDevModel());
	strDevModelName = devModel.getStrDevModelName();
	if (strTerminalStyle == null || strTerminalStyle.trim().length() == 0){
		strTerminalStyle = "Default";
	}
}
//去取银行信息
List bankList =  new BankDB().getBankList();
//取省份信息
List provinceList =  new ProvinceDB().getProvinceList();
//取城市信息
List cityList =  new CityDB().getCityList();
//获取终端支持模块列表
String strObjsHtml = "";
if (isValidTerminal)
{
  //按终端编号取出改设备支持的模块
  List modulelist = new TerminalModuleDB().getModuleList(terminal.getId(),terminal.getDevModel());
  for (int i=0; modulelist!=null && i<modulelist.size(); i++)
  {
    Module module = (Module)modulelist.get(i);
	System.out.println("设备启用的模块:"+module.getStrModuleName());
    String strObjHtml ="<OBJECT WIDTH=0 HEIGHT=0 " + "ID='" + module.getStrModuleName() + "' " + "CLASSID='CLSID:" + module.getStrModuleClsid() + "'>" +"</OBJECT>";
    strObjsHtml = strObjsHtml + strObjHtml + "\n";
  }
  if(strObjsHtml.indexOf("YHAXJournalPrint")< 0){
	  //非现金机器没有流水打印机，使用虚拟的，无需配置流水打印机
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXJournalPrint' " + "CLASSID='CLSID:E09DB6EE-2044-4852-B902-07A04D79DA90'></OBJECT>"+ "\n";
  }
  //公共主件
  if(strObjsHtml.indexOf("YHAXCommonCtrl")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXCommonCtrl' " + "CLASSID='CLSID:0232DBFE-F2D4-467C-BAAA-F4F46690306C'></OBJECT>"+ "\n";
  }
  //公共主件,手写电子签名控件
  if(strObjsHtml.indexOf("YHAXHandWriter")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXHandWriter' " + "CLASSID='CLSID:BB4FCD33-750A-405A-9FEE-55447EFBDB49'></OBJECT>"+ "\n";
  }
  //存单扫描
  if(strObjsHtml.indexOf("YHAXDocumentScanner") >= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXDocumentScanner2' " + "CLASSID='CLSID:2B883199-12DB-437C-B5F8-D5B426E96F17'></OBJECT>"+ "\n";
  }
  //读UKEY信息
  if(strObjsHtml.indexOf("YHAXUkeyDispenser") >= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXUkeyReader' " + "CLASSID='CLSID:B5969A07-1FA0-443F-989E-78639EB7BBF1'></OBJECT>"+ "\n";
  }
  //电子密码签名
  if(strObjsHtml.indexOf("YHAXSigCameras") >= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXSigEncryptor' " + "CLASSID='CLSID:5617250B-C20B-4DCD-8601-C60B7F139FFD'></OBJECT>"+ "\n";
  }
  //密钥分发器
  if(strObjsHtml.indexOf("YHAXKDMLoadKey")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXKDMLoadKey' " + "CLASSID='CLSID:224B573F-6F52-4C31-A15C-B40379A38559'></OBJECT>"+ "\n";
  }
  if(strObjsHtml.indexOf("penConnector")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='penConnector' " + "CLASSID='CLSID:B094BC3B-70A1-4862-9592-F36C37C5FCC4'></OBJECT>"+ "\n";
  }
  //取款硬币模块
  if(strObjsHtml.indexOf("YHAXCashDispenser")>= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXCashDispenserFen' " + "CLASSID='CLSID:C842A9AC-9948-4B16-B56C-FA77FA93387E'></OBJECT>"+ "\n";
  }
  //电子密码锁
  if(strObjsHtml.indexOf("SGP1506KM3000D")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='SGP1506KM3000D' " + "CLASSID='CLSID:DF8BDE76-7BB2-4546-BF43-44AE96EE90FE'></OBJECT>"+ "\n";
  }
  //现金辅柜SIU
  if(strObjsHtml.indexOf("YHAXGuideLights")>= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXCashGuideLights' " + "CLASSID='CLSID:BF11FF75-9C28-4334-B660-01BE7501D7AB'></OBJECT>"+ "\n";
  }
  //刷折模块
  if(strObjsHtml.indexOf("YHAXPassbookReader")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXPassbookReader' " + "CLASSID='CLSID:B5969A07-1FA0-443F-989E-78639EB7BBF1'></OBJECT>"+ "\n";
  }
}
%>
<html>
<head>
<meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=gb2312" />
<meta http-equiv="Expires" CONTENT="0">
<meta http-equiv="Cache-Control" CONTENT="no-cache">
<meta http-equiv="Pragma" CONTENT="no-cache">
<meta http-equiv="X-UA-Compatible" content="IE=8"/>
<title>怡化自助跨平台系统</title>
<LINK REL=stylesheet HREF="../Terminal/Style/<%=strTerminalStyle%>/Style.css" type="text/css" />
<script type="text/javascript">
var cancelCardflag=false;//读卡器关闭标识

function setInfoTipContent(tiphtml)
{
  document.all.InfoTipContent.innerHTML = tiphtml;
}

// 出现脚本错什么都不做的函数
function fnErrorTrapNA(sMsg,sUrl,sLine)
{
  return true;
}

// 顶层窗口出现脚本错
function fnErrorTrapTop(sMsg,sUrl,sLine)
{
  // 这时什么也做不了，只能显示一个提示，再重现加载应用
  top.setInfoTipContent("应用首页出现脚本错误：<br/>" + sUrl + "错误信息:" + sMsg + "行数:" + sLine);
  setTimeout(function(){top.location.reload(true);}, 5*60*1000);
  return true;
}

// 非顶层窗口出现脚本错
function fnErrorTrap(sMsg,sUrl,sLine)
{
  var err = "JSErr:" + sMsg + top.journalPrinter.strNewLine + sUrl + " " + sLine;
  try{onServerErr_Def("", err);}catch(e){}
  return true;
}

//关闭所有
function closeAll()
{
	top.inputmethod.Close();//隐藏虚拟键盘
	//关闭签名面板
	try {
			top.sigCameras.display("Extra","Destroy");//关闭电子签名面板
			top.sigCameras.sigCamerasEvents.clearAll();
		} 
		catch (e){}
    //关闭摄像头
	try {
			top.cameras.display("Person","Destroy");
			top.cameras.camerasEvents.clearAll();
		} 
		catch (e){}
	
}
// 设置脚本错误的处理函数
window.onerror = fnErrorTrapTop;


// 空函数，即什么都不做的函数
function FUNC_NA(){}

// 发现服务器错误或异常（页面切换时等）的缺省处理
function showTakeCardTip4Err()
{
  closeAll();
  top.serviceCtrl.navigate2("about:blank");
  top.wins.showInfoTip("对不起，本机通讯中断，暂停服务！<br/>请您取走卡...<br/><br/>Sorry, communication error!<br/>Please take your card...");
  top.serviceCtrl.startFlowCtrlTimeout(function(){top.serviceCtrl.CommErrAfter2Idle();}, 30*1000);
}

// 发现服务器错误或异常（页面切换时等）的缺省处理
function onServerErr_Def(frmname, err)
{
  // 记录终端流水
  var strJrn = new top.StringCtrl("Exception "+new top.DateTimeCtrl().getHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) +
  top.journalPrinter.strNewLine + err + top.journalPrinter.strNewLine;
  top.journalPrinter.addJournal(strJrn);

  if (top.cardreader.isCardPresent())
  {
    onDeviceError_Idc = onCardCaptured = onCardTaken = function()
    {
	  closeAll();
	  top.serviceCtrl.navigate2("about:blank");
      top.wins.showInfoTip("对不起，本机通讯中断，暂停服务！<br/><br/>Sorry, communication error!");
      top.serviceCtrl.startFlowCtrlTimeout(function(){top.serviceCtrl.CommErrAfter2Idle();}, 60*1000);
    }
    top.cardreader.eject();
    top.serviceCtrl.startFlowCtrlTimeout(top.showTakeCardTip4Err, 1*1000);
  }
  else
  {
	closeAll();
    // 强行中止原来的页面
    top.serviceCtrl.navigate2("about:blank");
    top.cardreader.cancelAccept();
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.serviceCtrl.setSvcStatus(top.TTSTATUS_COMMERR); top.serviceCtrl.CommErrAfter2Idle();}, 10*1000);
    top.wins.showInfoTip("对不起，本机通讯中断，暂停服务！<br/><br/>Sorry, communication error!");
  }
}
</script>
<script type="text/javascript" src="../JavaScript/Resource.js"></script>
<script type="text/javascript" src="../JavaScript/Windows.js"></script>
<script type="text/javascript" src="../JavaScript/XmlHelper.js"></script>
<script type="text/javascript" src="../JavaScript/ExchangeXmlWithHost.js"></script>
<script type="text/javascript" src="../JavaScript/MultiRecordView.js"></script>
<script type="text/javascript" src="../JavaScript/ServiceControl.js"></script>
<script type="text/javascript" src="../JavaScript/OperateControl.js"></script>
<script type="text/javascript" src="../JavaScript/DataPool.js"></script>
<script type="text/javascript" src="../JavaScript/SoundPlayer.js"></script>
<script type="text/javascript" src="../JavaScript/Terminal.js"></script>
<script type="text/javascript" src="../JavaScript/JournalPrinter.js"></script>
<script type="text/javascript" src="../JavaScript/ReceiptPrinter.js"></script>
<script type="text/javascript" src="../JavaScript/PassbookPrinter.js"></script>
<script type="text/javascript" src="../JavaScript/PassbookReader.js"></script>
<script type="text/javascript" src="../JavaScript/XmlManage.js"></script>
<script type="text/javascript" src="../JavaScript/ToolControl.js"></script>
<script type="text/javascript" src="../JavaScript/FinalDef.js"></script>
<script type="text/javascript" src="../JavaScript/CardReader.js"></script>
<script type="text/javascript" src="../JavaScript/PinPad.js"></script>
<script type="text/javascript" src="../JavaScript/IDCardReader.js"></script>
<script type="text/javascript" src="../JavaScript/CardDispenser.js"></script>
<script type="text/javascript" src="../JavaScript/BarcodeReader.js"></script>
<script type="text/javascript" src="../JavaScript/FingerScanner.js"></script>
<script type="text/javascript" src="../JavaScript/GuideLights.js"></script>
<script type="text/javascript" src="../JavaScript/ServiceMenu.js"></script>
<script type="text/javascript" src="../JavaScript/Trans.js"></script>
<script type="text/javascript" src="../JavaScript/DocumentScanner.js"></script>
<script type="text/javascript" src="../JavaScript/DocumentScanner2.js"></script>
<script type="text/javascript" src="../JavaScript/DocumentPrinter.js"></script>
<script type="text/javascript" src="../JavaScript/UkeyDispenser.js"></script>
<script type="text/javascript" src="../JavaScript/UkeyReader.js"></script>
<script type="text/javascript" src="../JavaScript/Cameras.js"></script>
<script type="text/javascript" src="../JavaScript/SigCameras.js"></script>
<script type="text/javascript" src="../JavaScript/SigEncryptor.js"></script>
<script type="text/javascript" src="../JavaScript/KDMLoadKey.js"></script>
<script type="text/javascript" src="../JavaScript/DocumentA4Printer.js"></script>
<script type="text/javascript" src="../JavaScript/MyChooseCard.js"></script>
<script type="text/javascript" src="../JavaScript/InputMethod.js"></script>
<script type="text/javascript" src="../JavaScript/Withdraw.js"></script>
<script type="text/javascript" src="../JavaScript/Deposit.js"></script>
<script type="text/javascript" src="../JavaScript/EleLock.js"></script>
<script type="text/javascript" src="../JavaScript/CashBoxCheck.js"></script>
<script type="text/javascript" src="../JavaScript/CashGuideLights.js"></script>
<script type="text/javascript">
var threadFlag = false;//线程是否启动标识符
var isValidTerminal = <%=isValidTerminal%>;
var id = <%=id%>;
var strTerminalNum = "<%=strTerminalNum%>";
var strOrgNum = "<%=strOrgNum%>";
var strTellerNum="<%=strTellerNum%>";
var status = "<%=status%>";
var strTerminalStyle = "<%=strTerminalStyle%>";
var bankList = new Array();//银行信息
var provinceList = new Array();//省份信息
var cityList = new Array();//城市信息
var strDevModelName = "<%=strDevModelName%>"; //设备型号
//分解银行信息
<%
int bankCount=0;
for (int i=0; bankList!=null && i<bankList.size(); i++)
{
	Bank bank = (Bank)bankList.get(i);
	%>
    bankList[<%=bankCount%>] = new Array("<%= bank.getStrBankCode()%>","<%= bank.getStrBankName()%>");
    <%
    bankCount = bankCount + 1;
}
%>

//分解省份信息
<%
int provinceCount=0;
for (int i=0; provinceList!=null && i<provinceList.size(); i++)
{
	Province province = (Province)provinceList.get(i);
	%>
    provinceList[<%=provinceCount%>] = new Array("<%= province.getStrProvinceCode()%>","<%= province.getStrProvinceName()%>");
    <%
    provinceCount = provinceCount + 1;
}
%>

//分解城市信息
<%
int cityCount=0;
for (int i=0; cityList!=null && i<cityList.size(); i++)
{
	City city = (City)cityList.get(i);
	%>
    cityList[<%=cityCount%>] = new Array("<%= city.getStrCityCode()%>","<%= city.getStrCityName()%>","<%= city.getStrProvinceCode()%>");
    <%
    cityCount = cityCount + 1;
}
%>

<%/*禁止所有输入*/%>
document.onkeydown = function(){try{window.event.keyCode=0; window.event.returnValue=false;}catch(e){}}
document.ondblclick = function (){window.event.returnValue = false;}
document.onclick = function (){window.event.returnValue = false;}

// 响应文档状态变化事件
document.onreadystatechange = function()
{
  if (document.readyState == "complete")
  {
    // 文档状态为完成，开始执行相应处理
    onDocumentCompleted();
  }
}

// 文档状态为完成后的处理函数（该页面应用的处理入口）
function onDocumentCompleted()
{
  // 隐藏鼠标
  try{window.external.SetCursorOn(false);}catch(e){}
  
  // 缓存背景图片，避免频繁访问服务器
  try{document.execCommand("BackgroundImageCache", false, true);}catch(e){}
  
  wins = new Windows();
  //初始化日志打印
  journalPrinter = new JournalPrinter();
  if (!isValidTerminal)
  {
    wins.showErrInfoTip("终端初始化失败（无效终端）！");
    setTimeout(function(){top.location.reload(true);}, 5*60*1000);
    return;
  }
  //打开终端支持的模块
  if (typeof(YHAXUkeyDispenser) != "undefined")
  {
	 YHAXUkeyDispenser.OpenConnection();
	 YHAXUkeyReader.ServiceName ="UkeyReader";
	 YHAXUkeyReader.OpenConnection();
  }
  if (typeof(YHAXCardReader) == "undefined")
  {
	 wins.showErrInfoTip("终端初始化失败（终端无配置读卡器）！");
     setTimeout(function(){top.location.reload(true);}, 5*60*1000);
     return;
  } 
  else{
	 YHAXCardReader.ServiceName ="CardReader";
	 YHAXCardReader.OpenConnection();
  }  
  if (typeof(YHAXPinPad) == "undefined")
  {
    wins.showErrInfoTip("终端初始化失败（终端无配置密码键盘）！");
    setTimeout(function(){top.location.reload(true);}, 5*60*1000);
    return;
  }
  else{
	YHAXPinPad.OpenConnection();
  }
  if (typeof(YHAXPassbook) != "undefined")
  {
	 YHAXPassbook.ServiceName ="PassBook";
	 YHAXPassbook.OpenConnection();
  }
  if (typeof(YHAXPassbookReader) != "undefined")
  {
	 YHAXPassbookReader.ServiceName ="PassBookReader";
	 YHAXPassbookReader.OpenConnection();
  }
  if (typeof(YHAXOperatorPane) != "undefined")
  {
	 YHAXOperatorPane.OpenConnection();
  }
  if (typeof(YHAXIDCardReader) != "undefined")
  {
	 YHAXIDCardReader.OpenConnection();
  }
  if (typeof(YHAXGuideLights) != "undefined")
  {
	 YHAXGuideLights.OpenConnection();
  }
  if (typeof(YHAXFingerScanner) != "undefined")
  {
	 YHAXFingerScanner.OpenConnection();
  }
  if (typeof(YHAXReceiptPrint) != "undefined")
  {
	 YHAXReceiptPrint.OpenConnection();
  }
  if (typeof(YHAXBarcodeReader) != "undefined")
  {
	 YHAXBarcodeReader.OpenConnection();
  }
  if (typeof(YHAXCardDispenser) != "undefined")
  {
	 YHAXCardDispenser.OpenConnection();
  }
  if (typeof(YHAXDocumentPrinter) != "undefined")
  {
	 YHAXDocumentPrinter.ServiceName = "CheckPrinter";//修改存单打印逻辑名
	 YHAXDocumentPrinter.OpenConnection();
  }
  if (typeof(YHAXDocumentScanner) != "undefined")
  {
	 YHAXDocumentScanner.ServiceName = "CheckPrinter2";//修改存单开户逻辑名
	 YHAXDocumentScanner.OpenConnection();
	 YHAXDocumentScanner2.ServiceName = "CheckScanner";//修改存单受理逻辑名
	 YHAXDocumentScanner2.OpenConnection();
  }
  if (typeof(YHAXCameras) != "undefined")//电子摄像头
  {
	 YHAXCameras.ServiceName = "Camera";//修改电子摄像头逻辑名
	 YHAXCameras.OpenConnection();
  }
  if (typeof(YHAXSigCameras) != "undefined")//电子密码签名
  {
	 YHAXSigCameras.ServiceName = "SigCamera";//修改电子密码签名逻辑名
	 YHAXSigCameras.OpenConnection();
	 YHAXSigEncryptor.ServiceName = "SigEncryptor";//修改电子密码签名逻辑名(密码键盘)
	 YHAXSigEncryptor.OpenConnection();
  }
  if (typeof(YHAXDocumentA4Printer) != "undefined")
  {
	 YHAXDocumentA4Printer.ServiceName = "A4Printer";//修改A4逻辑名 
	 YHAXDocumentA4Printer.OpenConnection();
  }
  //现金
  if(typeof(YHAXCashDispenser) != "undefined")
  {
	 YHAXCashDispenser.ServiceName="CashDispenser"; 
	 YHAXCashDispenser.OpenConnection();
	 YHAXCashDispenserFen.ServiceName = "CoinDispenser";//硬币逻辑名
	 YHAXCashDispenserFen.OpenConnection();
  }
  if(typeof(YHAXCashAcceptor) != "undefined")
  {
	 YHAXCashAcceptor.ServiceName="CashAcceptor"; 
	 YHAXCashAcceptor.OpenConnection();
  }

  top.journalPrinter.addJournalWithTime("电子密码锁类型：" + typeof(SGP1506KM3000D));
  top.journalPrinter.addJournalWithTime("电子密码锁状态：" + document.getElementById("SGP1506KM3000D").readyState);
  if (typeof(SGP1506KM3000D) != "undefined")//电子密码锁
  {
	 try{
		 SGP1506KM3000D.SetUsedType(true);//初始化电子密码锁控件
	 }catch(e){
		 top.journalPrinter.addJournalWithTime("SGP1506KM3000D.SetUsedType(true) error info:" + e );
	 }
  }
  if (typeof(YHAXCashGuideLights) != "undefined")//现金的SIU
  {
	 YHAXCashGuideLights.ServiceName="SIUCash"; 
	 YHAXCashGuideLights.OpenConnection();
  } 
  //先启动Socket接收消息线程
  if(!threadFlag){
    threadFlag = true;
    //打开接收监控客户端线程
    YHAXCommonCtrl.ReceiveBufferedData();
  }
  // 获取状态，用于各模块的第一次初始化 清除收卡数
  setTimeout(function(){try{YHAXPinPad.StDeviceStatus;}catch(e){}}, 1*1000);
  setTimeout(function(){try{YHAXCardReader.StDeviceStatus;}catch(e){}}, 3*1000);
  setTimeout(function(){try{YHAXCardReader.ResetBinCountSync;}catch(e){}}, 8*1000);
  setTimeout(startSvc, 10*1000);
}

// 开始服务
function startSvc()
{
  // 一般对象初始化
  sysinfo = new SysInfo();
  serviceCtrl = new ServiceControl(); //js流程控制类
  langdef = new LanguageDef();
  langen = new LanguageEn();
  langcur = langdef;
  pool = new DataPool();              //js数据池类
  soundPlayer = new SoundPlayer();    //背景音乐播放器类
  menu = new ServiceMenu();           //服务菜单处理类
  choCard = new MyChooseCard();       //选择卡类型处理类
  eleLock=new EleLock();			  //密码锁处理类
  // 终端信息
  terminal = new Terminal();
  terminal.id = id;
  terminal.strTerminalNum = strTerminalNum;
  terminal.strOrgNum = strOrgNum;
  terminal.strTellerNum=strTellerNum;
  terminal.status=status;
  terminal.strTerminalStyle=strTerminalStyle;
  terminal.bankList = bankList;
  terminal.provinceList = provinceList;
  terminal.cityList = cityList;
  terminal.strDevModelName = strDevModelName;
  pinpad = new Pinpad();
  
  terminal.QueueNumberFlag = new top.XmlManage().getXmlParamStr(top.COLS_CONF_XMLPATH, top.COLS_SWITCH_QUEUENUMBER , "1");

  try{guidelights = new GuideLights();}catch(e){}
  try{cashguidelights = new CashGuideLights();}catch(e){}
  try{if(typeof(YHAXGuideLights) != "undefined"){guidelights.setPinPadLight("OFF");}}catch(e){} //密码键盘灯
  try{if(typeof(YHAXGuideLights) != "undefined"){guidelights.setNCICLight("CONTINUOUS");}}catch(e){} //迎宾灯
  //现金辅柜关闭灯
  try{if(typeof(YHAXCashGuideLights) != "undefined"){cashguidelights.setENVDepositoryLight("OFF");}}catch(e){} //迎宾灯
  //终端模块控制
  if (typeof(YHAXUkeyDispenser) != "undefined")
  { 
    ukeydispenser = new UkeyDispenser();
	ukeyReader = new UkeyReader();
  }
  if (typeof(YHAXCardReader) != "undefined")
  {
     cardreader = new CardReader();
  }
  //相关打印
  if (typeof(YHAXReceiptPrint) != "undefined")
  {
    receiptprinter = new ReceiptPrinter();
    top.YHAXReceiptPrint.StDeviceStatus;
  }
  if (typeof(YHAXPassbook) != "undefined")
  {
    passbookprinter = new PassbookPrinter();
    top.YHAXPassbook.StDeviceStatus;
	top.YHAXPassbook.StMediaStatus;
  }
  
  if (typeof(YHAXPassbookReader) != "undefined")
  {
    passbookreader = new PassbookReader();
    top.YHAXPassbookReader.StDeviceStatus;
	top.YHAXPassbookReader.StMediaStatus;
  }
  if (typeof(YHAXIDCardReader) != "undefined")
  {
    idCardReader = new IDCardReader();
  }
  if (typeof(YHAXFingerScanner) != "undefined")
  {
    fingerScanner = new FingerScanner();
  }
  if (typeof(YHAXBarcodeReader) != "undefined")
  {
    barcodeReader = new BarcodeReader();
  }
  if (typeof(YHAXCardDispenser) != "undefined")
  {
    carddispenser = new CardDispenser();
  }
  if (typeof(YHAXDocumentPrinter) != "undefined")
  {
    documentprinter = new DocumentPrinter();
  }
  if (typeof(YHAXDocumentScanner) != "undefined")
  {
    documentscanner = new DocumentScanner();
	documentscanner2 = new DocumentScanner2();
  }
  if (typeof(YHAXCameras) != "undefined")//电子摄像头
  {
    cameras = new Cameras();
  }
  if (typeof(YHAXSigCameras) != "undefined")//电子密码签名
  {
    sigCameras = new SigCameras();
	sigEncryptor = new SigEncryptor();
  }
  if (typeof(YHAXDocumentA4Printer) != "undefined")
  {
    documentA4Printer = new DocumentA4Printer();
  }
  if (typeof(YHAXKDMLoadKey) != "undefined")
  {
    kdmLoadKey = new KDMLoadKey();
  }  
  if (typeof(YHAXCashDispenser) != "undefined")
  {
    withdraw = new Withdraw();
  }
  if (typeof(YHAXCashAcceptor) != "undefined")
  {
    deposit = new Deposit();
  }  
  if (typeof(penConnector) == "undefined")
  {
	var strJrn = new top.StringCtrl("机具未安装汉王输入法 "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
  }
  if (typeof(SGP1506KM3000D) != "undefined")
  {
	 setTimeout(top.eleLock.getEleLockStatus,10*60*1000);//10分钟后查询电子密码锁状态
  }
  inputmethod = new InputMethod();
  // 服务与交易相关对象
  idle = new Idle();
  misc = new Misc();
  trans = new Trans();//交易处理类
  top.pinpad.userEntry();//打开明文输入
  resetCardReader();
}

/*
  复位读卡器
 */
function resetCardReader()
{
  onResetComplete_Idc = onDeviceError_Idc = function()
  {
    // 记录终端流水
    var strJrn = new top.StringCtrl("应用正在加载 "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) +
    top.journalPrinter.strNewLine + "TELLER:" + top.terminal.strTellerNum + " TERMINAL:"+top.terminal.strTerminalNum + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
    // 跳至服务空闲
    setTimeout(function(){top.serviceCtrl.navigate2Idle();}, 500);
    // 首页不再处理脚本异常，防止后续子窗口的异常导致再次调用
    window.onerror = fnErrorTrapNA;
 }
  cardreader.reset();
}
</script>
<script type="text/javascript" for="SGP1506KM3000D" event="MessageReceived(report)">
	//监听电子密码锁上送的数据
	top.eleLock.MessageReceived(report);//上行数据处理
</script>
</head>

<body background="../Terminal/Style/<%=strTerminalStyle%>/Img/Bg_Main_Menu3.jpg" style="background-repeat:no-repeat; background-position:%0" bottommargin=0 leftmargin=0 rightmargin=0 topmargin=0  scroll="no" oncontextmenu="return false" ondragstart="return false" onselectstart ="return false" onselect="document.selection.empty()" oncopy="document.selection.empty()" onbeforecopy="return false" onmouseup="document.selection.empty()">
<span  id="message" class="messageMain"><p></p></span>
<div id="Module">
<%
  out.println(strObjsHtml);
%>
</div>

<div id="oLInfoTip" class="FULLSCR">
  <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
    <tr><td align="center">
	  <br/>
      <span class="Tip_Title" ID="InfoTipContent">终端正在初始化,请稍候......</span><br/><br/>
    </td></tr>
  </table>
</div>

<div id="oLProcessingTip" class="FULLSCR" style="visibility:hidden;">
  <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <br/><br/>
	  <br/>
      <span class="Tip_Title" id="ProcessingTipContent"></span><br/><br/><br/>
      <br/>
      <span class="Error_Title" style="visibility:hidden;" id="oInpProcessTick"></span>
    </td></tr>
  </table>
</div>

<!-- 发送交易时过渡页面 -->
<div id="oLNewProcessingTip" class="FULLSCR2" style="visibility:hidden;">
  <span class="Tip_Tick" id="oInpNewProcessTick"></span>
  <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <br/><br/>
	  <img alt="" src="../Terminal/Style/<%=strTerminalStyle%>/Img/LOGO.gif" width="130" height="130"/>
	  <br/>
      <span class="Tip_Title" id="ProcessingTipNewContent"></span><br/><br/><br/>
    </td></tr>
  </table>
</div>

<BGSOUND id="oBGSound" />

<iframe id="MainFrame" name="MainFrame" src="about:blank" frameborder="0" marginheight=0 marginwidth=0 style="position:absolute; width:100%; height:100%; z-index:2; left: 0px; top: 0px;visibility:hidden;" scrolling="no" allowTransparency="true"/>
<iframe id="ProcessingAdFrame" name="ProcessingAdFrame" src="about:blank" frameborder="0" marginheight=0 marginwidth=0 style="position:absolute; width:100%; height:100%; z-index:2; left: 0px; top: 0px;visibility:hidden" scrolling="no" allowTransparency="true"/>

</body>
</html>