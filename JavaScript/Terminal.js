 /*
   *�ն���Ϣ��
 */
function Terminal()
{
  /*�ն�ID*/	
  this.id = -1;
  /*�ն˱��*/
  this.strTerminalNum = "";
  /*������*/
  this.strOrgNum = "";
  /*��Ա��*/
  this.strTellerNum="";
  /*�ն�״̬*/
  this.status = -1;
  /*�ն˷��*/
  this.strTerminalStyle = "";
  /*�Ƿ�ǿ�ƴ�ƾ��*/
  this.bPrintReceipt = true;
  /*ת������Ϣ*/	
  this.bankList = new Array();
  /*ʡ����Ϣ*/	
  this.provinceList = new Array();
  /*������Ϣ*/	
  this.cityList = new Array();
  
  this.devType = 12;
  
  /*true Ϊ���ܹ�Ա��  falseΪ�ƶ����ܹ�Ա��*/
  this.isSmartTeller = true; 
  
  //ǩ����Ա��
  this.signTellerNum = "";
  //�豸�ͺ�
  this.strDevModelName = "";
  //���ͽ��ױ�ʶ
  this.sendPost = true;
  //��ǰ�кź��� Ĭ��Ϊ��
  this.currentCallNumber = "";
  //�ϱʽкź��� Ĭ��Ϊ��
  this.previousCallNumber = "";
  //�кſ��� true:��  false:��
  this.QueueNumberFlag = true;
  
  //��ȡ�豸���� ���ڽк�  CASH:�ֽ��ǹ� NOMA:�����ǹ�
  this.getDeviceType = function(){
	  if(this.strDevModelName.indexOf("_") > -1){
		  return "CASH";
	  }else{
		  return "NOMA";
	  }
  }
  
  //�����˳���ʶ�����ڽк�
  this.swipquit = "";
  //�����˳���ʶ,�رն�������ʶ�����ڽк�
  this.swipquitcard = "";
  
}
  