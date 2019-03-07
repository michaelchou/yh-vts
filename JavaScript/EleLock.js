/*
  ������������
 */
function EleLock()
{
	/*
	 �������д����ؼ�-->���ߣ�
	 ���������������е����ݣ����ر���F60��
	 ���� �� true-�ɹ�    false-ʧ��
	 */
	this.WriteReport = function(downData){
		downData = downData.substring(downData.indexOf("<",0),downData.length);
		var xmlLen = downData.length;
		xmlLen = new top.StringCtrl("" + xmlLen).prefixStr(' ',10);
		downData = xmlLen + downData;	//��XML����ǰ����10λ����
		var result = false;
		if (typeof(SGP1506KM3000D) != "undefined"){
			try{
				result=SGP1506KM3000D.WriteReport(downData);//�������нӿ�
			}catch(e){
				top.journalPrinter.addJournalWithTime("��������ʱ����" + e);
			}
		}
		return result;
	}
	
	/*
	 �������д���(����-->�ؼ�)
	 �������������͵ı���
	 ���أ���
	 */
	this.MessageReceived = function(upData){
		var trCode = "";			//������������
		var trCodeDesc = "";		//����������
		var lockStatus = "";		//����״̬
		
	    top.pool.set("strEleLock",upData);
		top.pool.set("EleLockSign","T");	//���������ͣ�����״̬Ϊ����
		trCode = this.GetNodeVal(upData,"Ex_TrCode");	//��ȡ������
		trCodeDesc = this.convertTranCode(trCode);
		lockStatus = this.GetNodeVal(upData,"Ex_LockStatus");	//��ȡ����״̬
	
		top.journalPrinter.addJournalWithTime("���յ�����������" + trCodeDesc + "����  �����룺" + trCode);
		//��ȡ����״̬��9-10λ  "00"-����   "01"-��
		if(lockStatus != "" && lockStatus != null){
			if(lockStatus.substring(8,10) == "01"){
				top.journalPrinter.addJournalWithTime("������������");
				setTimeout(this.getEleLockStatus,10*60*1000);
			}
		}
		//alert(lockStatus);
		//������ѯ����״̬��������������
		if(trCode != "" && trCode != null && trCode == "2011"){
			top.serviceCtrl.sendEleLockStatus(lockStatus);		//������״̬�����
			return;
		}
		//��ά��״̬���ڿ������治��Ӧ�������������͵�����
		if (top.pool.get("customStatus") == "1" && top.pool.get("OpenEleLockAllowed")){
			top.wins.showProcessingTip("���ڴ���,���Ժ�...");
			top.trans.send930000Async();	//����������������
			
			if(lockStatus != "" && lockStatus != null)
				top.serviceCtrl.sendEleLockStatus(lockStatus);		//������״̬�����
		}else if(trCode == "1005" || trCode == "2008"){
			//�����뽻�׿ɲ������ڹ���Ա
			top.trans.send930000Async();	//����������������
			if(lockStatus != "" && lockStatus != null)
				top.serviceCtrl.sendEleLockStatus(lockStatus);		//������״̬�����
		}else if(top.pool.get("customStatus") == "1" && trCode != "1004" && trCode != "2007"){
			//����ȡ������Ľ��ף��������ײ���ָ�����������ͽ���
			top.trans.send930000Async();	//����������������
			if(lockStatus != "" && lockStatus != null)
				top.serviceCtrl.sendEleLockStatus(lockStatus);		//������״̬�����
		}else{
			top.journalPrinter.addJournalWithTime("��ά��״̬���ڿ������棬������������������");
			return;
		}
		
	}
	
	/*
	 ����ָ���ڵ��ȡ��Ӧ��ֵ
	 ������
	 	XmlStr	���������͵��ؼ�������
	 	NodeName	�ڵ�����
	 ���أ�
	 	�ڵ�ֵ
	 */
	this.GetNodeVal = function(XmlStr,NodeName){
		if(XmlStr.length < 1){
			return "";
		}
		var NodeVal = "";	//�ڵ�ֵ
		var StartNode = "<" + NodeName + ">" ;	//��ʼ�ڵ�
		var EndNode = "</" + NodeName + ">";	//�����ڵ�
		var StartPos = XmlStr.indexOf(StartNode,0) + StartNode.length;	//��ʼλ��
		var EndPos = XmlStr.indexOf(EndNode,StartPos);	//����λ��
		NodeVal = XmlStr.substring(StartPos,EndPos);	//��ȡ�ڵ�ֵ
		if(StartPos < StartNode.length){
		//��ʼ�ڵ㲻���ڣ��򷵻ؿ�
			NodeVal = "";
		}else if(EndPos < 0){
		//�����ڵ㲻���ڣ��򷵻ؿ�
			NodeVal = "";
		}
		return NodeVal;	
		
	}
	
	/*
	 ����ָ���ڵ����Ƽ��ڵ�ֵ��XML�ַ���
	 ������
	 	NodeVal		�ڵ�ֵ
	 	NodeName	�ڵ�����
	 ���أ�
	 	XML�ַ���
	 */
	this.SetNodeStr = function(NodeVal,NodeName){
		if(NodeName == null || NodeName == ""){
			return "";
		}
		var retMsg = "";
		var StartNode = "<" + NodeName + ">" ;	//��ʼ�ڵ�
		var EndNode = "</" + NodeName + ">";	//�����ڵ�
		NodeVal = StartNode + NodeVal + EndNode;
		return NodeVal;	
	}
	
	/*
	 ��ѯ������״̬
	 */
	this.getEleLockStatus = function(){
		try{
			var xmlMsg = top.eleLock.SetNodeStr(new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS(),"Ex_TrTime")
			           + top.eleLock.SetNodeStr(new top.DateTimeCtrl().getHHmmSS().substr(0,4),"Ex_SeqNo")
			           + top.eleLock.SetNodeStr("V100R0000","Ex_Version")
			           + top.eleLock.SetNodeStr("2011","Ex_TrCode")
			           + top.eleLock.SetNodeStr(new top.StringCtrl("0").prefixStr('0',16),"Ex_LockId");
			var result = top.eleLock.WriteReport(xmlMsg);
			top.journalPrinter.addJournalWithTime("����������״̬��ѯ���:" + result);
			//����������״̬δ֪
			top.pool.set("EleLockSign","F");
			if(!result){
				//��������״̬�����
				top.serviceCtrl.sendEleLockStatus(new top.StringCtrl("0").prefixStr('0',16));
			}
		}catch(e){
			top.journalPrinter.addJournalWithTime("��ѯ����������״̬ʱ����:" + e);
			//��������״̬�����
			top.serviceCtrl.sendEleLockStatus(new top.StringCtrl("0").prefixStr('0',16));
		}
	}
	
	/*
	 * ���ַ���ת����base64�ַ���
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
	 ��������������ת��
	 ������������������
	 ���أ�ת���ַ�
	 */
	this.convertTranCode = function(TranCode){
		TranCode ="" + TranCode
		switch(TranCode) {
			case "1001" : return "PDA����WMK";
			case "1002" : return "PDA����TMK";
			case "1003" : return "PDA����AMK";
			case "1004" : return "PDA��¼����ȡ������";
			case "1005" : return "PDA�ϴ�������";
			case "1006" : return "PDA���󼤻�";
			case "1007" : return "PDA�ϴ����߼�����Ϣ";
			case "2001" : return "����WMK";
			case "2002" : return "����TMK";
			case "2003" : return "����AMK";
			case "2004" : return "����DMK";
			case "2005" : return "���󼤻��������";
			case "2006" : return "�ϴ�������Ϣ";
			case "2007" : return "��¼����ȡ������";
			case "2008" : return "�ϴ�������";
			case "2009" : return "�ϱ���״̬";
			case "2010" : return "�������˲�ѯ���߲�����¼";
			case "2011" : return "��ѯ����״̬";
			case "4000" : return "����Ӧ����ȡ������";
			default : return "����"
		}
	}
	
	/*
	 ������ϵͳ������ת��
	 ������������ϵͳ������
	 ���أ�ת���ַ�
	 */
	this.convertRetCode = function(RetCode){
		RetCode ="" + RetCode
		switch(RetCode) {
			case "2100" : return "������������ʱ���ش���";
			case "2101" : return "��������Ϣ";
			case "2102" : return "���߱�ɾ������ͣ��";
			case "2103" : return "��ȡϵͳ���ô���";
			case "2104" : return "��ȡ��������������Ϣ����";
			case "2105" : return "���������У��ʧ�ܣ�";
			case "2106" : return "���������У��ʧ�ܣ�";
			case "2107" : return "���������У��ʧ�ܣ�";
			case "3000" : return "�û�Aָ����֤ʧ��";
			case "3001" : return "�û�Bָ����֤ʧ��";
			case "3002" : return "�û�A������";
			case "3003" : return "�û�B������";
			case "3004" : return "�û�A����У��ʧ��";
			case "3005" : return "�û�B����У��ʧ��";
			case "3006" : return "�û�A�޼ӳ�Ȩ��";
			case "3007" : return "�û�B�޼ӳ�Ȩ��";
			case "3008" : return "�����ӳ�Ա��ͬһ����";
			case "3013" : return "�û�Aδ���õ绰����";
			case "3014" : return "�û�Bδ���õ绰����";
			case "3053" : return "���ŷ���ʧ��";
			case "4000" : return "��ǰ����Ч����";
			case "4001" : return "��ǰ�û�δ����ӳ�����";
			case "4002" : return "�ӳ��û����ܲ�����������������";
			case "4003" : return "������δѡ��ӳ�ԱA";
			case "4004" : return "������δѡ��ӳ�ԱB";
			case "9901" : return "����������Ӧ��";
			case "9998" : return "��֧�ֵĽ�����";
			case "9999" : return "ϵͳ�쳣";
			default : return ""
		}
	}
}