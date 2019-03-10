/*
  现金辅柜指示灯类
SetCustomLight
设置用户自定义灯状态
方法原型：
SHORT SetCustomLight(BSTR CustomLightName, BSTR FlashRate);
CustomLightName   自定义灯名称
FlashRate          闪烁频率，分为"OFF", "SLOW", "MEDIUM", "QUICK", "CONTINUOUS"
 */
function CashGuideLights() {
	//出钞口灯&拒钞口灯
	this.setCashDispenLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(2, state);
		} catch (e) {
		}
	}
	//进钞口灯
	this.setCashAcceptorLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(8, state);
		} catch (e) {
		}
	}
	//硬币出口灯
	this.setCoinDispenserLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(3, state);
		} catch (e) {
		}
	}
	//硬币内侧照明灯
	this.setCoinAcceptorLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(11, state);
		} catch (e) {
		}
	}
	//交易指示灯
	this.setENVDepositoryLight = function(state) {
		try {
			if (typeof (YHAXCashGuideLights) != "undefined")
				top.YHAXCashGuideLights.SetCustomLight(6, state);
		} catch (e) {
		}
	}
}
