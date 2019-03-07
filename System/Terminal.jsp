<%
 /**
  * �ն˳�ʼ��������
 */
%>
<%@ page contentType="text/html; charset=GBK" %>
<%@ page language="java" import="java.util.List,com.yihuacomputer.cols.entity.*,com.yihuacomputer.cols.database.*"%>
<%
// ���ýϴ󻺳���,ʹ���������ҳ�湹�����һ�η��ͱ����η��͵������쳣��
response.setBufferSize(1024*64);
// ��ȡ�ն˿ͻ���IP��ַ
String strClientIP = request.getParameter("Client-IP");
if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
  strClientIP = request.getHeader("Proxy-Client-IP");
if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
  strClientIP = request.getHeader("WL-Proxy-Client-IP");
if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
  strClientIP = request.getHeader("x-forwarded-for");
if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
  strClientIP = request.getRemoteAddr();
 
//���ݵ�ǰ�ն�IP��ַ��ѯ����ϸ��Ϣ
TerminalDB terminaldb = new TerminalDB();
Terminal terminal = terminaldb.getTerminalByNetAddr(strClientIP);

boolean isValidTerminal = false;     // �Ƿ��ǺϷ��ն˱�ʶ
int id =-1;                          //�ն�id��
String strTerminalNum = "";          //�ն˱��
String strOrgNum = "";               //�������
String strTellerNum = "";            //��Ա���
int status = -1;                     //�ն�״̬
String strTerminalStyle = "Default"; //�ն˷��
String strDevModelName = "";         //�豸�ͺ�

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
//ȥȡ������Ϣ
List bankList =  new BankDB().getBankList();
//ȡʡ����Ϣ
List provinceList =  new ProvinceDB().getProvinceList();
//ȡ������Ϣ
List cityList =  new CityDB().getCityList();
//��ȡ�ն�֧��ģ���б�
String strObjsHtml = "";
if (isValidTerminal)
{
  //���ն˱��ȡ�����豸֧�ֵ�ģ��
  List modulelist = new TerminalModuleDB().getModuleList(terminal.getId(),terminal.getDevModel());
  for (int i=0; modulelist!=null && i<modulelist.size(); i++)
  {
    Module module = (Module)modulelist.get(i);
	System.out.println("�豸���õ�ģ��:"+module.getStrModuleName());
    String strObjHtml ="<OBJECT WIDTH=0 HEIGHT=0 " + "ID='" + module.getStrModuleName() + "' " + "CLASSID='CLSID:" + module.getStrModuleClsid() + "'>" +"</OBJECT>";
    strObjsHtml = strObjsHtml + strObjHtml + "\n";
  }
  if(strObjsHtml.indexOf("YHAXJournalPrint")< 0){
	  //���ֽ����û����ˮ��ӡ����ʹ������ģ�����������ˮ��ӡ��
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXJournalPrint' " + "CLASSID='CLSID:E09DB6EE-2044-4852-B902-07A04D79DA90'></OBJECT>"+ "\n";
  }
  //��������
  if(strObjsHtml.indexOf("YHAXCommonCtrl")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXCommonCtrl' " + "CLASSID='CLSID:0232DBFE-F2D4-467C-BAAA-F4F46690306C'></OBJECT>"+ "\n";
  }
  //��������,��д����ǩ���ؼ�
  if(strObjsHtml.indexOf("YHAXHandWriter")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXHandWriter' " + "CLASSID='CLSID:BB4FCD33-750A-405A-9FEE-55447EFBDB49'></OBJECT>"+ "\n";
  }
  //�浥ɨ��
  if(strObjsHtml.indexOf("YHAXDocumentScanner") >= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXDocumentScanner2' " + "CLASSID='CLSID:2B883199-12DB-437C-B5F8-D5B426E96F17'></OBJECT>"+ "\n";
  }
  //��UKEY��Ϣ
  if(strObjsHtml.indexOf("YHAXUkeyDispenser") >= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXUkeyReader' " + "CLASSID='CLSID:B5969A07-1FA0-443F-989E-78639EB7BBF1'></OBJECT>"+ "\n";
  }
  //��������ǩ��
  if(strObjsHtml.indexOf("YHAXSigCameras") >= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXSigEncryptor' " + "CLASSID='CLSID:5617250B-C20B-4DCD-8601-C60B7F139FFD'></OBJECT>"+ "\n";
  }
  //��Կ�ַ���
  if(strObjsHtml.indexOf("YHAXKDMLoadKey")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXKDMLoadKey' " + "CLASSID='CLSID:224B573F-6F52-4C31-A15C-B40379A38559'></OBJECT>"+ "\n";
  }
  if(strObjsHtml.indexOf("penConnector")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='penConnector' " + "CLASSID='CLSID:B094BC3B-70A1-4862-9592-F36C37C5FCC4'></OBJECT>"+ "\n";
  }
  //ȡ��Ӳ��ģ��
  if(strObjsHtml.indexOf("YHAXCashDispenser")>= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXCashDispenserFen' " + "CLASSID='CLSID:C842A9AC-9948-4B16-B56C-FA77FA93387E'></OBJECT>"+ "\n";
  }
  //����������
  if(strObjsHtml.indexOf("SGP1506KM3000D")< 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='SGP1506KM3000D' " + "CLASSID='CLSID:DF8BDE76-7BB2-4546-BF43-44AE96EE90FE'></OBJECT>"+ "\n";
  }
  //�ֽ𸨹�SIU
  if(strObjsHtml.indexOf("YHAXGuideLights")>= 0){
	  strObjsHtml=strObjsHtml+"<OBJECT WIDTH=0 HEIGHT=0 " + "ID='YHAXCashGuideLights' " + "CLASSID='CLSID:BF11FF75-9C28-4334-B660-01BE7501D7AB'></OBJECT>"+ "\n";
  }
  //ˢ��ģ��
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
<title>����������ƽ̨ϵͳ</title>
<LINK REL=stylesheet HREF="../Terminal/Style/<%=strTerminalStyle%>/Style.css" type="text/css" />
<script type="text/javascript">
var cancelCardflag=false;//�������رձ�ʶ

function setInfoTipContent(tiphtml)
{
  document.all.InfoTipContent.innerHTML = tiphtml;
}

// ���ֽű���ʲô�������ĺ���
function fnErrorTrapNA(sMsg,sUrl,sLine)
{
  return true;
}

// ���㴰�ڳ��ֽű���
function fnErrorTrapTop(sMsg,sUrl,sLine)
{
  // ��ʱʲôҲ�����ˣ�ֻ����ʾһ����ʾ�������ּ���Ӧ��
  top.setInfoTipContent("Ӧ����ҳ���ֽű�����<br/>" + sUrl + "������Ϣ:" + sMsg + "����:" + sLine);
  setTimeout(function(){top.location.reload(true);}, 5*60*1000);
  return true;
}

// �Ƕ��㴰�ڳ��ֽű���
function fnErrorTrap(sMsg,sUrl,sLine)
{
  var err = "JSErr:" + sMsg + top.journalPrinter.strNewLine + sUrl + " " + sLine;
  try{onServerErr_Def("", err);}catch(e){}
  return true;
}

//�ر�����
function closeAll()
{
	top.inputmethod.Close();//�����������
	//�ر�ǩ�����
	try {
			top.sigCameras.display("Extra","Destroy");//�رյ���ǩ�����
			top.sigCameras.sigCamerasEvents.clearAll();
		} 
		catch (e){}
    //�ر�����ͷ
	try {
			top.cameras.display("Person","Destroy");
			top.cameras.camerasEvents.clearAll();
		} 
		catch (e){}
	
}
// ���ýű�����Ĵ�����
window.onerror = fnErrorTrapTop;


// �պ�������ʲô�������ĺ���
function FUNC_NA(){}

// ���ַ�����������쳣��ҳ���л�ʱ�ȣ���ȱʡ����
function showTakeCardTip4Err()
{
  closeAll();
  top.serviceCtrl.navigate2("about:blank");
  top.wins.showInfoTip("�Բ��𣬱���ͨѶ�жϣ���ͣ����<br/>����ȡ�߿�...<br/><br/>Sorry, communication error!<br/>Please take your card...");
  top.serviceCtrl.startFlowCtrlTimeout(function(){top.serviceCtrl.CommErrAfter2Idle();}, 30*1000);
}

// ���ַ�����������쳣��ҳ���л�ʱ�ȣ���ȱʡ����
function onServerErr_Def(frmname, err)
{
  // ��¼�ն���ˮ
  var strJrn = new top.StringCtrl("Exception "+new top.DateTimeCtrl().getHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) +
  top.journalPrinter.strNewLine + err + top.journalPrinter.strNewLine;
  top.journalPrinter.addJournal(strJrn);

  if (top.cardreader.isCardPresent())
  {
    onDeviceError_Idc = onCardCaptured = onCardTaken = function()
    {
	  closeAll();
	  top.serviceCtrl.navigate2("about:blank");
      top.wins.showInfoTip("�Բ��𣬱���ͨѶ�жϣ���ͣ����<br/><br/>Sorry, communication error!");
      top.serviceCtrl.startFlowCtrlTimeout(function(){top.serviceCtrl.CommErrAfter2Idle();}, 60*1000);
    }
    top.cardreader.eject();
    top.serviceCtrl.startFlowCtrlTimeout(top.showTakeCardTip4Err, 1*1000);
  }
  else
  {
	closeAll();
    // ǿ����ֹԭ����ҳ��
    top.serviceCtrl.navigate2("about:blank");
    top.cardreader.cancelAccept();
    top.serviceCtrl.startFlowCtrlTimeout(function(){top.serviceCtrl.setSvcStatus(top.TTSTATUS_COMMERR); top.serviceCtrl.CommErrAfter2Idle();}, 10*1000);
    top.wins.showInfoTip("�Բ��𣬱���ͨѶ�жϣ���ͣ����<br/><br/>Sorry, communication error!");
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
var threadFlag = false;//�߳��Ƿ�������ʶ��
var isValidTerminal = <%=isValidTerminal%>;
var id = <%=id%>;
var strTerminalNum = "<%=strTerminalNum%>";
var strOrgNum = "<%=strOrgNum%>";
var strTellerNum="<%=strTellerNum%>";
var status = "<%=status%>";
var strTerminalStyle = "<%=strTerminalStyle%>";
var bankList = new Array();//������Ϣ
var provinceList = new Array();//ʡ����Ϣ
var cityList = new Array();//������Ϣ
var strDevModelName = "<%=strDevModelName%>"; //�豸�ͺ�
//�ֽ�������Ϣ
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

//�ֽ�ʡ����Ϣ
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

//�ֽ������Ϣ
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

<%/*��ֹ��������*/%>
document.onkeydown = function(){try{window.event.keyCode=0; window.event.returnValue=false;}catch(e){}}
document.ondblclick = function (){window.event.returnValue = false;}
document.onclick = function (){window.event.returnValue = false;}

// ��Ӧ�ĵ�״̬�仯�¼�
document.onreadystatechange = function()
{
  if (document.readyState == "complete")
  {
    // �ĵ�״̬Ϊ��ɣ���ʼִ����Ӧ����
    onDocumentCompleted();
  }
}

// �ĵ�״̬Ϊ��ɺ�Ĵ���������ҳ��Ӧ�õĴ�����ڣ�
function onDocumentCompleted()
{
  // �������
  try{window.external.SetCursorOn(false);}catch(e){}
  
  // ���汳��ͼƬ������Ƶ�����ʷ�����
  try{document.execCommand("BackgroundImageCache", false, true);}catch(e){}
  
  wins = new Windows();
  //��ʼ����־��ӡ
  journalPrinter = new JournalPrinter();
  if (!isValidTerminal)
  {
    wins.showErrInfoTip("�ն˳�ʼ��ʧ�ܣ���Ч�նˣ���");
    setTimeout(function(){top.location.reload(true);}, 5*60*1000);
    return;
  }
  //���ն�֧�ֵ�ģ��
  if (typeof(YHAXUkeyDispenser) != "undefined")
  {
	 YHAXUkeyDispenser.OpenConnection();
	 YHAXUkeyReader.ServiceName ="UkeyReader";
	 YHAXUkeyReader.OpenConnection();
  }
  if (typeof(YHAXCardReader) == "undefined")
  {
	 wins.showErrInfoTip("�ն˳�ʼ��ʧ�ܣ��ն������ö���������");
     setTimeout(function(){top.location.reload(true);}, 5*60*1000);
     return;
  } 
  else{
	 YHAXCardReader.ServiceName ="CardReader";
	 YHAXCardReader.OpenConnection();
  }  
  if (typeof(YHAXPinPad) == "undefined")
  {
    wins.showErrInfoTip("�ն˳�ʼ��ʧ�ܣ��ն�������������̣���");
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
	 YHAXDocumentPrinter.ServiceName = "CheckPrinter";//�޸Ĵ浥��ӡ�߼���
	 YHAXDocumentPrinter.OpenConnection();
  }
  if (typeof(YHAXDocumentScanner) != "undefined")
  {
	 YHAXDocumentScanner.ServiceName = "CheckPrinter2";//�޸Ĵ浥�����߼���
	 YHAXDocumentScanner.OpenConnection();
	 YHAXDocumentScanner2.ServiceName = "CheckScanner";//�޸Ĵ浥�����߼���
	 YHAXDocumentScanner2.OpenConnection();
  }
  if (typeof(YHAXCameras) != "undefined")//��������ͷ
  {
	 YHAXCameras.ServiceName = "Camera";//�޸ĵ�������ͷ�߼���
	 YHAXCameras.OpenConnection();
  }
  if (typeof(YHAXSigCameras) != "undefined")//��������ǩ��
  {
	 YHAXSigCameras.ServiceName = "SigCamera";//�޸ĵ�������ǩ���߼���
	 YHAXSigCameras.OpenConnection();
	 YHAXSigEncryptor.ServiceName = "SigEncryptor";//�޸ĵ�������ǩ���߼���(�������)
	 YHAXSigEncryptor.OpenConnection();
  }
  if (typeof(YHAXDocumentA4Printer) != "undefined")
  {
	 YHAXDocumentA4Printer.ServiceName = "A4Printer";//�޸�A4�߼��� 
	 YHAXDocumentA4Printer.OpenConnection();
  }
  //�ֽ�
  if(typeof(YHAXCashDispenser) != "undefined")
  {
	 YHAXCashDispenser.ServiceName="CashDispenser"; 
	 YHAXCashDispenser.OpenConnection();
	 YHAXCashDispenserFen.ServiceName = "CoinDispenser";//Ӳ���߼���
	 YHAXCashDispenserFen.OpenConnection();
  }
  if(typeof(YHAXCashAcceptor) != "undefined")
  {
	 YHAXCashAcceptor.ServiceName="CashAcceptor"; 
	 YHAXCashAcceptor.OpenConnection();
  }

  top.journalPrinter.addJournalWithTime("�������������ͣ�" + typeof(SGP1506KM3000D));
  top.journalPrinter.addJournalWithTime("����������״̬��" + document.getElementById("SGP1506KM3000D").readyState);
  if (typeof(SGP1506KM3000D) != "undefined")//����������
  {
	 try{
		 SGP1506KM3000D.SetUsedType(true);//��ʼ�������������ؼ�
	 }catch(e){
		 top.journalPrinter.addJournalWithTime("SGP1506KM3000D.SetUsedType(true) error info:" + e );
	 }
  }
  if (typeof(YHAXCashGuideLights) != "undefined")//�ֽ��SIU
  {
	 YHAXCashGuideLights.ServiceName="SIUCash"; 
	 YHAXCashGuideLights.OpenConnection();
  } 
  //������Socket������Ϣ�߳�
  if(!threadFlag){
    threadFlag = true;
    //�򿪽��ռ�ؿͻ����߳�
    YHAXCommonCtrl.ReceiveBufferedData();
  }
  // ��ȡ״̬�����ڸ�ģ��ĵ�һ�γ�ʼ�� ����տ���
  setTimeout(function(){try{YHAXPinPad.StDeviceStatus;}catch(e){}}, 1*1000);
  setTimeout(function(){try{YHAXCardReader.StDeviceStatus;}catch(e){}}, 3*1000);
  setTimeout(function(){try{YHAXCardReader.ResetBinCountSync;}catch(e){}}, 8*1000);
  setTimeout(startSvc, 10*1000);
}

// ��ʼ����
function startSvc()
{
  // һ������ʼ��
  sysinfo = new SysInfo();
  serviceCtrl = new ServiceControl(); //js���̿�����
  langdef = new LanguageDef();
  langen = new LanguageEn();
  langcur = langdef;
  pool = new DataPool();              //js���ݳ���
  soundPlayer = new SoundPlayer();    //�������ֲ�������
  menu = new ServiceMenu();           //����˵�������
  choCard = new MyChooseCard();       //ѡ�����ʹ�����
  eleLock=new EleLock();			  //������������
  // �ն���Ϣ
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
  try{if(typeof(YHAXGuideLights) != "undefined"){guidelights.setPinPadLight("OFF");}}catch(e){} //������̵�
  try{if(typeof(YHAXGuideLights) != "undefined"){guidelights.setNCICLight("CONTINUOUS");}}catch(e){} //ӭ����
  //�ֽ𸨹�رյ�
  try{if(typeof(YHAXCashGuideLights) != "undefined"){cashguidelights.setENVDepositoryLight("OFF");}}catch(e){} //ӭ����
  //�ն�ģ�����
  if (typeof(YHAXUkeyDispenser) != "undefined")
  { 
    ukeydispenser = new UkeyDispenser();
	ukeyReader = new UkeyReader();
  }
  if (typeof(YHAXCardReader) != "undefined")
  {
     cardreader = new CardReader();
  }
  //��ش�ӡ
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
  if (typeof(YHAXCameras) != "undefined")//��������ͷ
  {
    cameras = new Cameras();
  }
  if (typeof(YHAXSigCameras) != "undefined")//��������ǩ��
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
	var strJrn = new top.StringCtrl("����δ��װ�������뷨 "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
  }
  if (typeof(SGP1506KM3000D) != "undefined")
  {
	 setTimeout(top.eleLock.getEleLockStatus,10*60*1000);//10���Ӻ��ѯ����������״̬
  }
  inputmethod = new InputMethod();
  // �����뽻����ض���
  idle = new Idle();
  misc = new Misc();
  trans = new Trans();//���״�����
  top.pinpad.userEntry();//����������
  resetCardReader();
}

/*
  ��λ������
 */
function resetCardReader()
{
  onResetComplete_Idc = onDeviceError_Idc = function()
  {
    // ��¼�ն���ˮ
    var strJrn = new top.StringCtrl("Ӧ�����ڼ��� "+new top.DateTimeCtrl().getYYYYMMDDHHmmSSWithSep()).preandsufStr('=', top.journalPrinter.TITLEWIDTH) +
    top.journalPrinter.strNewLine + "TELLER:" + top.terminal.strTellerNum + " TERMINAL:"+top.terminal.strTerminalNum + top.journalPrinter.strNewLine;
	top.journalPrinter.addJournal(strJrn);
    // �����������
    setTimeout(function(){top.serviceCtrl.navigate2Idle();}, 500);
    // ��ҳ���ٴ���ű��쳣����ֹ�����Ӵ��ڵ��쳣�����ٴε���
    window.onerror = fnErrorTrapNA;
 }
  cardreader.reset();
}
</script>
<script type="text/javascript" for="SGP1506KM3000D" event="MessageReceived(report)">
	//�����������������͵�����
	top.eleLock.MessageReceived(report);//�������ݴ���
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
      <span class="Tip_Title" ID="InfoTipContent">�ն����ڳ�ʼ��,���Ժ�......</span><br/><br/>
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

<!-- ���ͽ���ʱ����ҳ�� -->
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