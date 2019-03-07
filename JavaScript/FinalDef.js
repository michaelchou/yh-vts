/*
   基本常量定义
*/

// 监控客户端状态报文
var AGENT_CONF_RESTART       = "MBQ0000";//系统重起命令
var AGENT_CONF_PAUSE         = "LCQ0000";//暂停服务命令
var AGENT_CONF_START         = "LOQ0000";//开启服务命令
var AGENT_CONF_SHUTDOWN      = "MSO0000";//关闭机器命令
var AGENT_CONF_LINK          = "MSL0000";//扩展链接命令
var AGENT_CONF_CONNECT       = "MIQ0000";//心跳连接命令

// 监控服务状态
var TTSTATUS_INVALID            = "K";   //密钥失序
var TTSTATUS_OK                 = "O";   //正常
var TTSTATUS_INSERVICE          = "T";   //服务
var TTSTATUS_PAUSEBYDEV         = "D";   //设备故障
var TTSTATUS_PAUSEBYMGR         = "C";   //暂停(监控)
var TTSTATUS_INMAINTENANCE      = "S";   //维护
var TTSTATUS_COMMERR            = "P";   //通讯中断
var TTSTATUS_RESTART            = "R";   //重启机器
var TTSTATUS_SHUTDOWN           = "G";   //关闭机器
var TTSTATUS_EXIT               = "A";   //关闭应用                

// 终端服务状态
var SVCSTATUS_OK                      = 0;//正常
var SVCSTATUS_PAUSEBYDEV              = 1;//管机员暂停服务
var SVCSTATUS_PAUSEBYMGR              = 2;//管理员暂停服务(监控)

//终端交易状态
var STATUS_NOACT                      = 0;//未动作
var STATUS_PRESENT                    = 1;//发卡(UKey、存单)成功
var STATUS_DISPFAILED                 = 2;//发卡(UKey、存单)失败
var STATUS_CAPTURE                    = 3;//吞卡(UKey、存单)
var STATUS_UNCER                      = 4;//结果不确定

// 异常代码
// 一般交易吞卡
var EXPCODE_RETRACTCARD               = "Exp01001";
// 发卡吞卡
var EXPCODE_CARDDISPENSER             = "Exp01002";
// 吞UKey
var EXPCODE_UKEYDISPENSER             = "Exp01003";
// 吞存单
var EXPCODE_CDSDISPENSER             = "Exp01004";

/*终端应用配置文件路径*/
var COLS_CONF_XMLPATH                 = "C:\\Cols\\Config\\Cols.xml";
var COLS_USER_XMLPATH                 = "C:\\Cols\\Config\\User.xml";
var COLS_FLOW_XMLPATH                 = "C:\\Cols\\Flow\\flow.xml";
var COLS_FLOW_NODE                    = "TransMsg/flow";
var COLS_FLOW_START                   = "/start/id";
var COLS_FLOW_PAGENAME                = "/PageName";
var COLS_FLOW_RETURNVALUE             = "/ReturnValue";
/*电子流水文件存放路径*/
var TERM_JOURNAL_PATH                 = "C:\\Cols\\Journal";
/*广告文件存放路径*/
var TERM_AD_ADPATH                    = "C:\\yihua\\fish\\Ad";
/*流水打印机的换行符设定*/
var COLS_JOURNALPRINTER_LINEFEED      = "Cols/Controls/JournalPrinter/LineFeed";
/*AgentClientIP存放位置*/
var COLS_DEVICE_AGENTCLIENTIP         = "Cols/AgentClient/Ip";
/*AgentClient端口存放位置*/
var COLS_DEVICE_AGENTCLIENTPORT       = "Cols/AgentClient/Port";
/*当前服务状态存放位置*/
var COLS_SERVICESTATUS_CURRENTSTATUS  = "Cols/ServiceStatus/CurrentStatus";
/*当前远程命令状态存放位置*/
var COLS_CMDSVCTYPE_CURRENTSTATUS     = "Cols/CmdSvcType/CurrentStatus";
/*当前远程命令存放位置*/
var COLS_CMDSVCTYPE_CMD               = "Cols/CmdSvcType/Cmd";
/*COLS当前版本存放位置*/
var COLS_COLSVERSION_CURRENTVERSION   = "Cols/ColsVersion/currentVersion";
/*COLS最新版本存放位置*/
var COLS_COLSVERSION_LATESTVERSION    = "Cols/ColsVersion/latestVersion";
/*COLS版本更新标识存放位置*/
var COLS_COLSVERSION_UPDATEFLAG       = "Cols/ColsVersion/updateFlag";
/*Agent当前版本存放位置*/
var COLS_AGENTVERSION_CURRENTVERSION   = "Cols/AgentVersion/currentVersion";
/*Agent最新版本存放位置*/
var COLS_AGENTVERSION_LATESTVERSION    = "Cols/AgentVersion/latestVersion";
/*Agent版本更新标识存放位置*/
var COLS_AGENTVERSION_UPDATEFLAG       = "Cols/AgentVersion/updateFlag";
/*叫号开关存放位置*/
var COLS_SWITCH_QUEUENUMBER            = "Cols/Switch/QueueNumber"

/*管机员信息设定*/
var COLS_USER_USERNAME                = "Cols/User/UserName";
var COLS_USER_PASSWORD                = "Cols/User/Password";
/*二维码文件存储路劲*/
var COLS_QRCODE_FILEPATH              = "C:\\Cols\\Pic";
/*身份证信息存储路劲*/
var COLS_IDPHOTOS_FILEPATH            = "D:\\ID_Photos";
/*电子密码签名存放路径*/
var COLS_SIGCAMERAS_FILEPATH          = "C:\\";
/*需要上传至影像平台的文件存放路径*/
var COLS_ZNGYPHOTOS_FILEPATH          = "D:\\ZNGY_Photos";
/*电子摄像头存放路径*/
var COLS_CAMERAS_FILEPATH             = "C:\\cameras.jpg";
/*电子密码签名文件名称*/
var COLS_SIGCAMERAS_FILENAME          = "Signature.jpg";
/*指纹图片名称路径*/
var COLS_FINGERSCANNER_FILEPATH         = "C:\\Finger.bmp";
/*指纹图片名称*/
var COLS_FINGERSCANNER_FILENAME          = "Finger.bmp";
/*电子密码签名轨迹文件名称*/
var COLS_SIGCAMERAS_DAT_FILENAME          = "Signature.sdat";
/*电子密码签名轨迹文件备份存放路径*/
var COLS_SIGNATURE_TEMP_FILEPATH          = "D:\\SignatureTemp";
//常量定义
var NODE_USER        =    "User";
var NODE_CHILD_USER  =    "UserInfo";
 
 IDCReadFailure = {
	IDC_READ_SHUTTER_FAILURE : 1,
	IDC_READ_MEDIA_JAM : 4,
	IDC_READ_HARDWARE_ERROR : 101,
	IDC_READ_DEVICE_LOCKED : 102,
	IDC_READ_COMMAND_NOT_SUPPORTED	: 103,
	IDC_READ_CANCELLED : 104
};

 IDCEjectFailure = {
	IDC_EJECT_MEDIA_JAM : 4,
	IDC_EJECT_SHUTTER_FAILURE : 1,
	IDC_EJECT_NO_MEDIA : 5,
	IDC_EJECT_MEDIA_RETAINED : 9,
	IDC_EJECT_COMMAND_NOT_SUPPORTED	: 103,
	IDC_EJECT_CANCELLED : 104,
	IDC_EJECT_HARDWARE_ERROR : 101,
	IDC_EJECT_DEVICE_LOCKED : 102,
	IDC_EJECT_TIMEOUT : 100
};
 
 
  ExchangeToCN904503 = function(transType) 
  {
	switch(transType) {
		case "1" : return "主卡";
		case "0" : return "副卡";
		  default : return "其他"
	}
  } 
 
 