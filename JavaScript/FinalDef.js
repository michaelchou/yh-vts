/*
   ������������
*/

// ��ؿͻ���״̬����
var AGENT_CONF_RESTART       = "MBQ0000";//ϵͳ��������
var AGENT_CONF_PAUSE         = "LCQ0000";//��ͣ��������
var AGENT_CONF_START         = "LOQ0000";//������������
var AGENT_CONF_SHUTDOWN      = "MSO0000";//�رջ�������
var AGENT_CONF_LINK          = "MSL0000";//��չ��������
var AGENT_CONF_CONNECT       = "MIQ0000";//������������

// ��ط���״̬
var TTSTATUS_INVALID            = "K";   //��Կʧ��
var TTSTATUS_OK                 = "O";   //����
var TTSTATUS_INSERVICE          = "T";   //����
var TTSTATUS_PAUSEBYDEV         = "D";   //�豸����
var TTSTATUS_PAUSEBYMGR         = "C";   //��ͣ(���)
var TTSTATUS_INMAINTENANCE      = "S";   //ά��
var TTSTATUS_COMMERR            = "P";   //ͨѶ�ж�
var TTSTATUS_RESTART            = "R";   //��������
var TTSTATUS_SHUTDOWN           = "G";   //�رջ���
var TTSTATUS_EXIT               = "A";   //�ر�Ӧ��                

// �ն˷���״̬
var SVCSTATUS_OK                      = 0;//����
var SVCSTATUS_PAUSEBYDEV              = 1;//�ܻ�Ա��ͣ����
var SVCSTATUS_PAUSEBYMGR              = 2;//����Ա��ͣ����(���)

//�ն˽���״̬
var STATUS_NOACT                      = 0;//δ����
var STATUS_PRESENT                    = 1;//����(UKey���浥)�ɹ�
var STATUS_DISPFAILED                 = 2;//����(UKey���浥)ʧ��
var STATUS_CAPTURE                    = 3;//�̿�(UKey���浥)
var STATUS_UNCER                      = 4;//�����ȷ��

// �쳣����
// һ�㽻���̿�
var EXPCODE_RETRACTCARD               = "Exp01001";
// �����̿�
var EXPCODE_CARDDISPENSER             = "Exp01002";
// ��UKey
var EXPCODE_UKEYDISPENSER             = "Exp01003";
// �̴浥
var EXPCODE_CDSDISPENSER             = "Exp01004";

/*�ն�Ӧ�������ļ�·��*/
var COLS_CONF_XMLPATH                 = "C:\\Cols\\Config\\Cols.xml";
var COLS_USER_XMLPATH                 = "C:\\Cols\\Config\\User.xml";
var COLS_FLOW_XMLPATH                 = "C:\\Cols\\Flow\\flow.xml";
var COLS_FLOW_NODE                    = "TransMsg/flow";
var COLS_FLOW_START                   = "/start/id";
var COLS_FLOW_PAGENAME                = "/PageName";
var COLS_FLOW_RETURNVALUE             = "/ReturnValue";
/*������ˮ�ļ����·��*/
var TERM_JOURNAL_PATH                 = "C:\\Cols\\Journal";
/*����ļ����·��*/
var TERM_AD_ADPATH                    = "C:\\yihua\\fish\\Ad";
/*��ˮ��ӡ���Ļ��з��趨*/
var COLS_JOURNALPRINTER_LINEFEED      = "Cols/Controls/JournalPrinter/LineFeed";
/*AgentClientIP���λ��*/
var COLS_DEVICE_AGENTCLIENTIP         = "Cols/AgentClient/Ip";
/*AgentClient�˿ڴ��λ��*/
var COLS_DEVICE_AGENTCLIENTPORT       = "Cols/AgentClient/Port";
/*��ǰ����״̬���λ��*/
var COLS_SERVICESTATUS_CURRENTSTATUS  = "Cols/ServiceStatus/CurrentStatus";
/*��ǰԶ������״̬���λ��*/
var COLS_CMDSVCTYPE_CURRENTSTATUS     = "Cols/CmdSvcType/CurrentStatus";
/*��ǰԶ��������λ��*/
var COLS_CMDSVCTYPE_CMD               = "Cols/CmdSvcType/Cmd";
/*COLS��ǰ�汾���λ��*/
var COLS_COLSVERSION_CURRENTVERSION   = "Cols/ColsVersion/currentVersion";
/*COLS���°汾���λ��*/
var COLS_COLSVERSION_LATESTVERSION    = "Cols/ColsVersion/latestVersion";
/*COLS�汾���±�ʶ���λ��*/
var COLS_COLSVERSION_UPDATEFLAG       = "Cols/ColsVersion/updateFlag";
/*Agent��ǰ�汾���λ��*/
var COLS_AGENTVERSION_CURRENTVERSION   = "Cols/AgentVersion/currentVersion";
/*Agent���°汾���λ��*/
var COLS_AGENTVERSION_LATESTVERSION    = "Cols/AgentVersion/latestVersion";
/*Agent�汾���±�ʶ���λ��*/
var COLS_AGENTVERSION_UPDATEFLAG       = "Cols/AgentVersion/updateFlag";
/*�кſ��ش��λ��*/
var COLS_SWITCH_QUEUENUMBER            = "Cols/Switch/QueueNumber"

/*�ܻ�Ա��Ϣ�趨*/
var COLS_USER_USERNAME                = "Cols/User/UserName";
var COLS_USER_PASSWORD                = "Cols/User/Password";
/*��ά���ļ��洢·��*/
var COLS_QRCODE_FILEPATH              = "C:\\Cols\\Pic";
/*���֤��Ϣ�洢·��*/
var COLS_IDPHOTOS_FILEPATH            = "D:\\ID_Photos";
/*��������ǩ�����·��*/
var COLS_SIGCAMERAS_FILEPATH          = "C:\\";
/*��Ҫ�ϴ���Ӱ��ƽ̨���ļ����·��*/
var COLS_ZNGYPHOTOS_FILEPATH          = "D:\\ZNGY_Photos";
/*��������ͷ���·��*/
var COLS_CAMERAS_FILEPATH             = "C:\\cameras.jpg";
/*��������ǩ���ļ�����*/
var COLS_SIGCAMERAS_FILENAME          = "Signature.jpg";
/*ָ��ͼƬ����·��*/
var COLS_FINGERSCANNER_FILEPATH         = "C:\\Finger.bmp";
/*ָ��ͼƬ����*/
var COLS_FINGERSCANNER_FILENAME          = "Finger.bmp";
/*��������ǩ���켣�ļ�����*/
var COLS_SIGCAMERAS_DAT_FILENAME          = "Signature.sdat";
/*��������ǩ���켣�ļ����ݴ��·��*/
var COLS_SIGNATURE_TEMP_FILEPATH          = "D:\\SignatureTemp";
//��������
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
		case "1" : return "����";
		case "0" : return "����";
		  default : return "����"
	}
  } 
 
 