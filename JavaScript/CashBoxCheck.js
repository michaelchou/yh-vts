/*
 * �����ѯ��
 */
function CashBoxCheck()
{
	//��ȡ������Ϣ(����䶯����)
	this.getCashBoxInfo = function(){
		var cashBoxInfoArr = new Array();	//������Ϣ����
		if(typeof(top.YHAXCashDispenser) != "undefined"){
			var logicalunitsCDM = top.YHAXCashDispenser.LogicalUnits;
			for(var i=0; i<logicalunitsCDM.Count;i++){
				//ȡ���
				var logicalunitCDM = logicalunitsCDM.Item(i);
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitCDM.Number,						//���
						converStatus(logicalunitCDM.Status),		//״̬
						parseInt(logicalunitCDM.NoteValue) * 100,	//��ֵ���Է�Ϊ��λ
						logicalunitCDM.InitialCount,				//��ʼ����
						logicalunitCDM.CurrentCount,				//��ǰ����
						"0"				//ֽ�ҳ��䣬����Ϊ"0"
					);
			}
		}
		
		if(typeof(top.YHAXCashAcceptor) != "undefined"){
			var logicalunitsCIM = top.YHAXCashAcceptor.LogicalUnits;
			for(var j=0; j<logicalunitsCIM.Count;j++){
				var isExit = false;
				//����
				var logicalunitCIM = logicalunitsCIM.Item(j);
				for(var l=0;l<logicalunitsCDM.Count;l++){
					//�Ƚϴ�ȡ����Number���ظ������
					if(logicalunitCIM.Number == logicalunitsCDM.Item(l).Number){
						isExit = true;
						break;
					}
				}
				if(isExit){
					continue;
				}
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitCIM.Number,							//���
						converStatus(logicalunitCIM.Status),			//״̬
						parseInt(logicalunitCIM.Denomination) * 100,	//��ֵ���Է�Ϊ��λ
						logicalunitCIM.InitialCount,					//��ʼ����
						logicalunitCIM.CurrentCount,					//��ǰ����
						"0"			//ֽ�ҳ�������Ϊ0
					);
			}
		}
		
		if(typeof(top.YHAXCashDispenserFen) != "undefined"){
			var logicalunitsFen = top.YHAXCashDispenserFen.LogicalUnits;
			for(var k=0; k<logicalunitsFen.Count;k++){
				//Ӳ�ҳ���
				var logicalunitFen = logicalunitsFen.Item(k);
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitFen.Number,					//���
						converStatus(logicalunitFen.Status),	//״̬
						logicalunitFen.NoteValue,				//��ֵ���Է�Ϊ��λ
						logicalunitFen.InitialCount,			//��ʼ����
						logicalunitFen.CurrentCount,			//��ǰ����
						"1"			//Ӳ�ҳ�������Ϊ1
					);
			}
		}
		
		var len = cashBoxInfoArr.length;
		var msgData = "";
		var msgDatas = "";
		for(var i=0;i<len;i++){
			msgData = "";
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][0],"box_no");	//����Number
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][1],"status"); 	//����״̬
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][2],"denom"); 	//������ֵ
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][3],"cash_count0");//��ʼ����
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][4],"cash_count");//�������
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr(cashBoxInfoArr[i][5],"box_type"); 	//��������
			msgData += top.exchxmlasync.msgxmldomResp.SetNodeStr("","remark"); 						//��ע˵��
			msgDatas += top.exchxmlasync.msgxmldomResp.SetNodeStr(msgData,"item");
		}
		return msgDatas;
	}

	/*
	 * ���ã���ȡ������Ϣ
	 * ��������
	 * ���أ�������Ϣ�ַ�������������֮����','�ָ����������ʹ�á�|���ָ���
	 */
	this.getCashBoxInfoStr = function(){
		var cashBoxInfoArr = new Array();	//������Ϣ����
		if(typeof(top.YHAXCashDispenser) != "undefined"){
			var logicalunitsCDM = top.YHAXCashDispenser.LogicalUnits;
			for(var i=0; i<logicalunitsCDM.Count;i++){
				//ȡ���
				var logicalunitCDM = logicalunitsCDM.Item(i);
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitCDM.Id,							//ID
						logicalunitCDM.Number,						//���
						converType(logicalunitCDM.Type),			//����
						converStatus(logicalunitCDM.Status),		//״̬
						parseInt(logicalunitCDM.NoteValue),			//��ֵ���Է�Ϊ��λ
						logicalunitCDM.InitialCount,				//��ʼ����
						logicalunitCDM.CurrentCount,				//��ǰ����
						"0"				//ֽ�ҳ��䣬����Ϊ"0"
					);
			}
		}
		
		if(typeof(top.YHAXCashAcceptor) != "undefined"){
			var logicalunitsCIM = top.YHAXCashAcceptor.LogicalUnits;
			for(var j=0; j<logicalunitsCIM.Count;j++){
				var isExit = false;
				//����
				var logicalunitCIM = logicalunitsCIM.Item(j);
				for(var l=0;l<logicalunitsCDM.Count;l++){
					//�Ƚϴ�ȡ����Number���ظ������
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
						logicalunitCIM.Number,							//���
						converType(logicalunitCIM.Type),				//����
						converStatus(logicalunitCIM.Status),			//״̬
						parseInt(logicalunitCIM.Denomination),			//��ֵ
						logicalunitCIM.InitialCount,					//��ʼ����
						logicalunitCIM.CurrentCount,					//��ǰ����
						"0"			//ֽ�ҳ�������Ϊ0
					);
			}
		}
		
		if(typeof(top.YHAXCashDispenserFen) != "undefined"){
			var logicalunitsFen = top.YHAXCashDispenserFen.LogicalUnits;
			for(var k=0; k<logicalunitsFen.Count;k++){
				//Ӳ�ҳ���
				var logicalunitFen = logicalunitsFen.Item(k);
				cashBoxInfoArr[cashBoxInfoArr.length] = new Array(
						logicalunitFen.Id,						//ID
						logicalunitFen.Number,					//���
						converType(logicalunitFen.Type),		//����
						converStatus(logicalunitFen.Status),	//״̬
						logicalunitFen.NoteValue,				//��ֵ���Է�Ϊ��λ
						logicalunitFen.InitialCount,			//��ʼ����
						logicalunitFen.CurrentCount,			//��ǰ����
						"1"			//Ӳ�ҳ�������Ϊ1
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
		return retStr;		//���س�����Ϣ�ַ���
	}
	
	/*
	 * ��ȡ������Ϣ������䶯����־ʱ����
	 * ���أ��ַ���
	 * ��ʽ˵����ID_��ֵ+��λ:���� | ID_��ֵ+��λ:���� | ID_��ֵ+��λ:���� |������
	 */
	this.getCashBoxRecord = function(){
	   try{
		   var CashBoxInfoArr = new Array();
		   var CashBoxInfosArr = new Array();
		   var CashBoxInfoStr = new top.CashBoxCheck().getCashBoxInfoStr();		//��ȡ���س�����Ϣ 
		   var strTemp = "";
		   var strUnit = "";
			CashBoxInfosArr = CashBoxInfoStr.split('|');
			var len = CashBoxInfosArr.length;
			for(var i=0;i<len;i++){
				CashBoxInfoArr[i] = CashBoxInfosArr[i].split(',');
				if(CashBoxInfoArr[i][7] == "1"){
					strUnit = "��";
				}else if(CashBoxInfoArr[i][7] == "0"){
					strUnit = "Ԫ";
				}
				strTemp += CashBoxInfoArr[i][0] + "_" + CashBoxInfoArr[i][4] + strUnit + ":" + CashBoxInfoArr[i][6] + "|";
			}
			return strTemp;
	   }catch(e){
			top.journalPrinter.addJournalWithTime("getCashBoxRecord���������쳣  " + e);
			return "";
		}
	}
	/*
	 * ����״̬ת��
	 */
	function converStatus(uStatus){
		switch(uStatus) {
			case "HEALTHY" : return "0";	//����
			case "LOW" : return "1";		//����
			case "HIGH" : return "2";		//����
			case "FULL" : return "3";		//����
			case "EMPTY" :return "4";		//����
			case "MISSING" :return "5";		//ȱʧ
			case "UNKNOWN" :return "5";		//δ֪
			case "INOPERATIVE" :return "6";	//��Ч
			
		}
		return uStatus;
	}
	/*
	 * ��������ת��
	 */
	function converType(uType){
		switch(uType) {
			case "REJECTCASSETTE" : return "�ܳ���"; 
			case "BILLCASSETTE" : return "ȡ����";
			case "RETRACTCASSETTE" : return "������";
			case "COINCYLINDER" : return "Ӳ����";
			case "COINDISPENSER" : return "Ӳ����";
			case "RECYCLINGCASSETTE" :return "ѭ����";
			case "CASHIN" :return "�����";
			case "RECYCLER" :return "ѭ����";
			case "RETRACT" :return "������";
			case "REJECT" :return "�ܳ���";
			default : return "����"
		}
		return uType;
	}
}