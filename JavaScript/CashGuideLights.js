/*
  �ֽ𸨹�ָʾ����
SetCustomLight
�����û��Զ����״̬
����ԭ�ͣ�
SHORT SetCustomLight(BSTR CustomLightName, BSTR FlashRate);
CustomLightName   �Զ��������
FlashRate          ��˸Ƶ�ʣ���Ϊ"OFF", "SLOW", "MEDIUM", "QUICK", "CONTINUOUS"
 */
function CashGuideLights() {
	//�����ڵ�&�ܳ��ڵ�
	this.setCashDispenLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(2, state);
		} catch (e) {
		}
	}
	//�����ڵ�
	this.setCashAcceptorLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(8, state);
		} catch (e) {
		}
	}
	//Ӳ�ҳ��ڵ�
	this.setCoinDispenserLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(3, state);
		} catch (e) {
		}
	}
	//Ӳ���ڲ�������
	this.setCoinAcceptorLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(11, state);
		} catch (e) {
		}
	}
	//����ָʾ��
	this.setENVDepositoryLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(6, state);
		} catch (e) {
		}
	}
}
