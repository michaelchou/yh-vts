/*
  日期时间工具类
 */
function DateTimeCtrl(dt)
{
   // 构造函数中，若dt参数未设置或为null，则默认为是当前日期时间
   if (dt != null)
     this.dtVal = dt;
   else
     this.dtVal = new Date();

   /*
    获得日期字符串，格式为：YYYYMMDD
   */
   this.getYYYYMMDD = function()
   {
     var strYear = this.dtVal.getFullYear();
     var strMonth = this.dtVal.getMonth();
     var strDate = this.dtVal.getDate();
     return strYear + new StringCtrl(strMonth+1).prefixStr('0', 2) + new StringCtrl(strDate).prefixStr('0', 2);
   }
     /*
    获得日期字符串，格式为：YYYY-MM-DD
   */
   this.getYYYYMMDD2 = function()
   {
     var strYear = this.dtVal.getFullYear();
     var strMonth = this.dtVal.getMonth();
     var strDate = this.dtVal.getDate();
     return strYear +"-" + new StringCtrl(strMonth+1).prefixStr('0', 2) + "-" + new StringCtrl(strDate).prefixStr('0', 2);
   }
   /*
    获得日期字符串，格式为：YYYYMM
   */
   this.getYYYYMM = function()
   {
     var strYear = this.dtVal.getFullYear();
     var strMonth = this.dtVal.getMonth();
     return strYear + new StringCtrl(strMonth+1).prefixStr('0', 2);
   }

   /*
    获得某月一号的字符串，格式为：YYYYMM01
    */
   this.getYYYYMM01 = function()
   {
    var strYear = this.dtVal.getFullYear();
    var strMonth = this.dtVal.getMonth();
    var strDate = '01';
    return strYear + new StringCtrl(strMonth+1).prefixStr('0', 2) + new StringCtrl(strDate).prefixStr('0', 2);
   }
  
   /*
   获得某月一号的字符串，格式为：MM01
  */
  this.getYYYY01 = function()
  {
    var strYear = this.dtVal.getFullYear();
    var strMonth = '01';
    return  strYear+ new StringCtrl(strMonth).prefixStr('0', 2) ;
  }

  /*
    获得时间字符串，格式为：HHmmSS
   */
  this.getHHmmSS = function()
  {
    var strHours = this.dtVal.getHours();
    var strMinutes = this.dtVal.getMinutes();
    var strSeconds = this.dtVal.getSeconds();
    return new StringCtrl(strHours).prefixStr('0', 2) + new StringCtrl(strMinutes).prefixStr('0', 2) + new StringCtrl(strSeconds).prefixStr('0', 2);
  }

  /*
    获得时间字符串，格式为：HH:mm:SS
   */
  this.getHHmmSSWithSep = function()
  {
    var strHours = this.dtVal.getHours();
    var strMinutes = this.dtVal.getMinutes();
    var strSeconds = this.dtVal.getSeconds();
    return new StringCtrl(strHours).prefixStr('0', 2) + ':' + new StringCtrl(strMinutes).prefixStr('0', 2) + ':' + new StringCtrl(strSeconds).prefixStr('0', 2);
  }

  /*
    获得时间字符串，格式为：HH:mm:SS:Ms
   */
  this.getHHmmSSMsWithSep = function()
  {
    var strHours = this.dtVal.getHours();
    var strMinutes = this.dtVal.getMinutes();
    var strSeconds = this.dtVal.getSeconds();
	var strMilliSeconds = this.dtVal.getMilliseconds();
    return new StringCtrl(strHours).prefixStr('0', 2) + ':' + new StringCtrl(strMinutes).prefixStr('0', 2) + ':' + new StringCtrl(strSeconds).prefixStr('0', 2)+ ':' + new StringCtrl(strMilliSeconds).prefixStr('0', 3);
  }
  
  /*
    获得日期和时间字符串，格式为：YYYY/MM/DD HH:mm
   */
  this.getYYYYMMDDHHmmWithSep = function()
  {
    var strYear = this.dtVal.getFullYear();
    var strMonth = this.dtVal.getMonth();
    var strDate = this.dtVal.getDate();
    var strHours = this.dtVal.getHours();
    var strMinutes = this.dtVal.getMinutes();
    return strYear + "/" + new StringCtrl(strMonth+1).prefixStr('0', 2) + "/" + new StringCtrl(strDate).prefixStr('0', 2) + " " +
      new StringCtrl(strHours).prefixStr('0', 2) + ":" + new StringCtrl(strMinutes).prefixStr('0', 2);
  }

  /*
    获得日期和时间字符串，格式为：YYYY/MM/DD HH:mm:SS
   */
  this.getYYYYMMDDHHmmSSWithSep = function()
  {
    var strSeconds = this.dtVal.getSeconds();
    return this.getYYYYMMDDHHmmWithSep() + ":" + new StringCtrl(strSeconds).prefixStr('0', 2);
  }
  
  /*
    判断是否是有效的日期和时间字符串
   */
  this.isValidDateTimeStr = function(dtstr, format)
  {
    var reg = format;
    reg = reg.replace(/yyyy/, "[0-9]{4}");
    reg = reg.replace(/yy/, "[0-9]{2}");
    reg = reg.replace(/MM/, "((0[1-9])|1[0-2])");
    reg = reg.replace(/M/, "(([1-9])|1[0-2])");
    reg = reg.replace(/dd/, "((0[1-9])|([1-2][0-9])|30|31)");
    reg = reg.replace(/d/, "([1-9]|[1-2][0-9]|30|31))");
    reg = reg.replace(/HH/, "(([0-1][0-9])|20|21|22|23)");
    reg = reg.replace(/H/, "([0-9]|1[0-9]|20|21|22|23)");
    reg = reg.replace(/mm/, "([0-5][0-9])");
    reg = reg.replace(/m/, "([0-9]|([1-5][0-9]))");
    reg = reg.replace(/ss/, "([0-5][0-9])");
    reg = reg.replace(/s/, "([0-9]|([1-5][0-9]))");
    reg = new RegExp("^" + reg + "$");
    return reg.test(dtstr);
  }
  
	/*
		获取当前日期增加指定天数的日期
	*/
  this.addDays = function(days){
  	this.dtVal = new Date(this.dtVal.setDate(this.dtVal.getDate() + days));
		return this;
  }
	/*
		获取当前日期减少指定天数的日期
	*/
  this.cutDays = function(days){
  	this.dtVal = new Date(this.dtVal.setDate(this.dtVal.getDate() - days));
		return this;
  }
  
  /*
		获取当前日期增加指定月数的日期
	*/
  this.addMonths = function(months){
		this.dtVal = new Date(this.dtVal.setMonth(this.dtVal.getMonth() + months));
		return this;
  }

    /*
		获取当前日期减少指定月数的日期
	*/
  this.cutMonths = function(months){
		this.dtVal = new Date(this.dtVal.setMonth(this.dtVal.getMonth() - months));
		return this;
  }
  
	/*
		获取当前日期增加指定年数的日期
	*/
  this.addYears = function(months){
		this.dtVal = new Date(this.dtVal.setYear(this.dtVal.getFullYear() + months));
		return this;
  }
	/*
		获取当前日期减少指定年数的日期
	*/
  this.cutYears = function(months){
		this.dtVal = new Date(this.dtVal.setYear(this.dtVal.getFullYear() - months));
		return this;
  } 
 
  /*
  	获取增加指定日期后的日期。格式 1D 1M 1Y ;
  */
  this.addDate = function(dtFlag){
  	if(null == dtFlag || dtFlag.length < 2 ){
  		return this;	
  	}
	 	var number = parseInt(dtFlag.substr(0,dtFlag.length-1));
	  var flag = dtFlag.substr(dtFlag.length-1,dtFlag.length);
	  if("D"==flag){
			return this.addDays(number);
	  }else if("M" == flag){
			return this.addMonths(number);
	  }else if("Y"==flag){
			return this.addYears(number);
	  }
	  return this;
  }
  
    /*
  	获取增加指定日期后的日期。格式 1D 1M 1Y ;
  */
  this.cutDate = function(dtFlag){
  	if(null == dtFlag || dtFlag.length < 2 ){
  		return this;	
  	}
	 	var number = parseInt(dtFlag.substr(0,dtFlag.length-1));
	  var flag = dtFlag.substr(dtFlag.length-1,dtFlag.length);
	  if("D"==flag){
			return this.cutDays(number);
	  }else if("M" == flag){
			return this.cutMonths(number);
	  }else if("Y"==flag){
			return this.cutYears(number);
	  }
	  return this;
  }

}

/*
  JSON字符串工具类
*/
function JSONCtrl()
{
	this.jsonStr="{}";
	//往json里面增加数据
	this.setJson = function(strName,strValue)
    {
	   var jsonObj = JSON.parse(this.jsonStr);
       jsonObj[strName] = strValue;
	   this.jsonStr = unescape((JSON.stringify(jsonObj)).replace(/\\/g, "%"));
    }
    
	this.getJson = function(strString)
    {
	   var jsonObj = JSON.parse(strString);
       return jsonObj;
    }
}
/*
  字符串工具类

 */
function StringCtrl(val)
{
  // 保存构造函数中的值到属性变量中
  this.strVal = val.toString();

  /*
    后置字符,使字符串达到指定的长度
    参数：
      ch        后置字符
      totallen  需要达到的长度
    返回：
      处理后的字符串
   */
  this.suffixStr = function(ch, totallen)
  {
    for (var i=this.strVal.length; i<totallen; i++)
      this.strVal = this.strVal + ch;
    return this.strVal;
  }

  /*
    前置字符,使字符串达到指定的长度
    参数：
      ch        前置字符
      totallen  需要达到的长度
    返回：
      处理后的字符串
   */
  this.prefixStr = function(ch, totallen)
  {
    for (var i=this.strVal.length; i<totallen; i++)
      this.strVal = ch + this.strVal;
    return this.strVal;
  }
  
  
  //字符串，前面补的字符，总长度
  this.formatStr=function(ch,totalLen){//前面加空格,一个空格占1位
	 var tempLen=this.strVal.length;
	 var tempStr=this.strVal;
	 var validFlg=false;    
     var lenString=0;
	for(var i=0;i<tempLen;i++){//得到字符串的长度
		var tempChar=tempStr.substring(0,1);

		var patrn=/^[0-9]{1,1}$/;    
		if(patrn.exec(tempChar)!=null){
			lenString=lenString+1;
			validFlg=true;
		}
			        
		patrn=/^[a-zA-Z]{1,1}$/;
		if(!validFlg&&patrn.exec(tempChar)!=null){
			    //alert("字母验证");
			lenString=lenString+1;
			validFlg=true;
		}
			
		if(tempChar=="."||tempChar=="-"||tempChar=="+"||tempChar=="*"){
			lenString=lenString+1;
			validFlg=true;
		}
			        
		if(!validFlg){
			 // alert("汉字验证");    
			 lenString=lenString+2;	
		}
		tempStr=tempStr.substring(1);
		validFlg=false;
	}
	var bLen=0;
	if(totalLen>=lenString){
		bLen=totalLen-lenString;
	}
	for (var i=0; i<bLen; i++)
      	this.strVal = ch + this.strVal;
    return this.strVal;
  }
	
	
	//字符串，后面补的字符，总长度
	this.formatStrRight=function(ch,totalLen){//后面加空格,一个空格占1位
	    var tempLen=this.strVal.length;
	    var tempStr=this.strVal;
	  	var validFlg=false;    
		var lenString=0;
		for(var i=0;i<tempLen;i++){//得到字符串的长度
			var tempChar=tempStr.substring(0,1);

			var patrn=/^[0-9]{1,1}$/;    
			if(patrn.exec(tempChar)!=null){
				lenString=lenString+1;
				validFlg=true;
			}
			        
			patrn=/^[a-zA-Z]{1,1}$/;
			if(!validFlg&&patrn.exec(tempChar)!=null){
			    //alert("字母验证");
				lenString=lenString+1;
				validFlg=true;
			}
			
			if(tempChar=="."||tempChar=="-"||tempChar=="+"||tempChar=="*"){
				lenString=lenString+1;
				validFlg=true;
			}
			        
			if(!validFlg){
			    // alert("汉字验证");    
			     lenString=lenString+2;	
			}
			tempStr=tempStr.substring(1);
			validFlg=false;
		}
		var bLen=0;
		if(totalLen>=lenString){
			bLen=totalLen-lenString;
		}

		for (var i=0; i<bLen; i++)
      		this.strVal = this.strVal+ ch;
        return this.strVal;
	}

  /*
    首尾置字符,使字符串达到指定的长度
    参数：
      ch        首尾置的字符
      totallen  需要达到的长度
    返回：
      处理后的字符串
   */
  this.preandsufStr = function(ch, totallen)
  {
    for (var i=this.strVal.length; i<totallen; i+=2)
      this.strVal = ch + this.strVal + ch;
    return this.strVal;
  }

  /*
    去除字符串前后的空格
    返回：
      处理后的字符串
   */
  this.trim = function()
  {
    var re = new RegExp("(^\\s*)|(\\s*$)", "g");
    this.strVal = this.strVal.replace(re, "");
    return this.strVal;
  }
  
  /*
    去除字符串所有的空格
    返回：处理后的字符串
   */
  this.removeAllSpace = function()
  {
     return this.strVal.replace(/\s+/g, "");
  }
  
   /*
    把元转换为分
    返回：处理后的字符串
   */
   this.YuanToFen = function(num)
   {
  	 num = Math.abs(num).toFixed(2);  //将num取绝对值并四舍五入取2位小数
  	 var str = (num * 100).toFixed(0).toString();  //将num乘100并转换成字符串形式
	 return str;  
   }
  
  /*
    将字符串格式化到指定的小数点位数
   */
   this.formatNumber = function(nAfterDot)        //nAfterDot小数位数
   {
       var strVal, resultStr,nTen;
	   if(this.strVal=="" || this.strVal=="NaN"){
			this.strVal = "0";
	   }
       strVal = parseFloat(this.strVal+"");
       strVal = strVal+"";
	   strLen = strVal.length;
       dotPos = strVal.indexOf(".",0);
       if (dotPos == -1){
         	resultStr = strVal+".";
            for (i=0;i<nAfterDot;i++){
         	   resultStr = resultStr+"0";
         	}
        	return resultStr;
	   }
	   else{
           if ((strLen - dotPos - 1) >= nAfterDot){
			    nAfter = dotPos + nAfterDot + 1;
 			    nTen =1;
			    for(j=0;j<nAfterDot;j++){
			        nTen = nTen*10;
			    }
			    resultStr = Math.round(parseFloat(strVal)*nTen)/nTen;
			    return resultStr;
		    }
		    else{
		        resultStr = strVal;
	            for (i=0;i<(nAfterDot - strLen + dotPos + 1);i++){
			        resultStr = resultStr+"0";
		        }
		        return resultStr;
		    }
	    }
    } 

  /*
    去除字符串前的空格
    返回：
      处理后的字符串
   */
  this.trimLeft = function()
  {
    var re = new RegExp("(^\\s*)", "g");
    this.strVal = this.strVal.replace(re, "");
    return this.strVal;
  }

  /*
    去除字符串后的空格
    返回：
      处理后的字符串
   */
  this.trimRight = function()
  {
    var re = new RegExp("(\\s*$)", "g");
    this.strVal = this.strVal.replace(re, "");
    return this.strVal;
  }
  
  //全角转换为半角函数   
  this.ToCDB = function()   
  {   
      var tmp = "";   
      for(var i=0;i<this.strVal.length;i++)   
      {   
        if(this.strVal.charCodeAt(i)>65248&&this.strVal.charCodeAt(i)<65375)   
        {   
           tmp += String.fromCharCode(this.strVal.charCodeAt(i)-65248);   
        }   
        else   
        {   
           tmp += String.fromCharCode(this.strVal.charCodeAt(i));   
        }   
      }   
      return tmp   
  }
  
   /*
    判断字符串中是否包含中文
   */
  this.trimChinese = function()
  {
    var re = new RegExp("[\\u4E00-\\u9FFF]+","g");
    return re.test(this.strVal);
  }

  /*
    判断字符串是否都是数字
   */
  this.isAllDigit = function()
  {
	var re = new RegExp("^[0-9]*[1-9][0-9]*$", "g");
    return  re.test(this.strVal);
  }

  /*
    判断字符串是否都是数字
   */
  this.isAllDigit2 = function()
  {
    var re = new RegExp("^[0-9]*[0-9][0-9]*$", "g");
    return  re.test(this.strVal);
  }
  /*
    判断字符串是否是有效的浮点数
   */
  this.isValidFloat = function()
  {
    var re = new RegExp("^\\d+(\\.\\d+)?$", "g");
    return  re.test(this.strVal);
  }

  /*
    判断字符串是否是有效的金额
   */
  this.isValidAmount = function()
  {
    var re = new RegExp("^\\d+(\\.([0-9]|([0-9][0-9])))?$", "g");
    return  re.test(this.strVal);
  }
  
  //判断字符串是否是数字或字母
  this.isDigitOrLetter = function()
  {
    var re = new RegExp("^[A-Za-z0-9]+$", "g");
    return  re.test(this.strVal);
  }
  
  //判断输入的字符是否为英文字母    
  this.isLetter = function()    
  {        
     if(/^[a-zA-Z]/.test(this.strVal)) {
       return true;
     }else{
       return false;
     }    
  }  
  //判断手机号是否是1开头且都是数字
  this.checkPhone = function()
  {
	  if(/^1\d{10}$/.test(this.strVal)){
		  return true;
	  }else{
		  return false;  
	  }
  }
  //去除重复数据
  this.reMoveData =  function(data){
		var res =[];
	    var json ={};
		for(var i=0;i<data.length;i++){	  
		  if(!json[data[i][0]]){
			res.push(data[i][0]);
			json[data[i][0]] =1;
		  }
		}
	   return res;
	}
  //过滤二维数组中的重组数据
  this.reMoveArrayData = function(strArray,uniqueAccount){
	  var strNewArray =new Array();
	  for(var i=0;i<strArray.length;i++){
		for(var j=0;j<uniqueAccount.length;j++){
		  if(uniqueAccount[j] == strArray[i][0]){
		    if(strNewArray !=null && strNewArray.length>0){
				for(var k=0;k<strNewArray.length;k++){
					if(strNewArray[k][0] != strArray[i][0]){
						strNewArray[j]= new Array(strArray[i][0],strArray[i][1]);
					}
				}
			}else{
				strNewArray[j]= new Array(strArray[i][0],strArray[i][1]);
			}
		  }
		}
	  } 
	 return strNewArray; 
  }
  
  
  /*
    替换字符串中的旧子字串为新子字串
    返回：
      处理后的字符串
   */
  this.replaceAll = function(strOld, strNew)
  {
    while (this.strVal.indexOf(strOld) != -1 )
      this.strVal = this.strVal.replace(strOld, strNew);
    return this.strVal;
  }
  
  // 字节数组类型转换为十六进制字符串
  this.byteArr2HexStr = function(byteArr)
  {
    var strHex = "";
    try{byteArr = byteArr.toArray();}catch(e){}
    for (var i=0; i<byteArr.length; i++)
      strHex += new top.StringCtrl(byteArr[i].toString(16)).prefixStr('0', 2);
    return strHex.toUpperCase();
  }
  
  // 字符串数组类型转换为十六进制字符串
  this.strArr2HexStr = function(strArr)
  {
    var strHex = "";
    for (var i=0; i<strArr.length; i++)
      strHex += new top.StringCtrl(strArr.charCodeAt(i).toString(16)).prefixStr('0', 2);
    return strHex.toUpperCase();
  }
  
  // 十六进制字符串转换为字节数组类型
  this.hexStr2ByteArr = function(strHex)
  {
    var byteArr = new Array();
    for (var i=0; i<strHex.length/2; i++)
    {
      byteArr[i] = parseInt(strHex.substr(i*2, 2), 16);
    }
    return byteArr;
  }

   /**
   * 字符串转换为布尔型
   * 参数1:str   字符串
   * 参数2:bDef  转换失败后的缺省值
   * 返回:布尔型值
   */
  this.str2Bool =  function(strVal, bDef)
  {
    if (strVal == null)
      return bDef;

    var str = strVal.toString().toLowerCase();
    if ("1" == str || "true" == str || "yes" == str)
      return true;
    else if ("0" == str || "false" == str || "no" == str)
      return false;

    return bDef;
  }
  
  /*
    重载jscript对象的toString函数
   */
  this.toString = function()
  {
    return this.strVal;
  } 
  
  /*
     把大写金额转换成小写金额
  */
  this.aNumber = function(num) 
  { 
      var numArray = new Array(); 
	  var str="亿,万,圆,$";
	  str =str.split(",");
      for ( var i = 0; i < str.length; i++) { 
		  var re = eval("/" + (numArray[i - 1] ? str[i-1] : "") + "(.*)" + str[i] + "/"); 
          if (num.match(re)) { 
              numArray[i] = num.match(re)[1].replace(/^拾/, "壹拾"); 
              numArray[i] = numArray[i].replace(/[零壹贰叁肆伍陆柒捌玖]/g, function($1) { 
                  return "零壹贰叁肆伍陆柒捌玖".indexOf($1); 
              }); 
              numArray[i] = numArray[i].replace(/[分角拾佰仟]/g, function($1) { 
                  return "*" + Math.pow(10, "分角 拾佰仟 ".indexOf($1) - 2) + "+" 
              }).replace(/^\*|\+$/g, "").replace(/整/, "0"); 
			  if(numArray[i] == ""){
			     numArray[i] = "(0)*" + Math.ceil(Math.pow(10, (2 - i) * 4));
			  }else{
			     numArray[i] = "(" + numArray[i] + ")*" + Math.ceil(Math.pow(10, (2 - i) * 4)); 
			  }
          } else{
              numArray[i] = 0; 
		  }
      }
      return eval(numArray.join("+")); 
   }  
 // 数字转换成大写金额函数
 this.chgAmout2Up = function(numberValue) {
	var numberValue=new String(Math.round(numberValue*100)); // 数字金额
	var chineseValue=""; // 转换后的汉字金额
	var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
	var String2 = "万仟佰拾亿仟佰拾万仟佰拾圆角分"; // 对应单位
	var len=numberValue.length; // numberValue 的字符串长度
	var Ch1; // 数字的汉语读法
	var Ch2; // 数字位的汉字读法
	var nZero=0; // 用来计算连续的零值的个数
	var String3; // 指定位置的数值
	if(len>15){
		return "";
	}
	if (numberValue==0){
		chineseValue = "圆整";
		return chineseValue;
	}

	String2 = String2.substr(String2.length-len, len); // 取出对应位数的STRING2的值
	for(var i=0; i<len; i++){
		String3 = parseInt(numberValue.substr(i, 1),10); // 取出需转换的某一位的值
		if ( i != (len - 3) && i != (len - 7) && i != (len - 11) && i !=(len - 15) ){
			if ( String3 == 0 ){
				Ch1 = "";
				Ch2 = "";
		nZero = nZero + 1;
	}else if ( String3 != 0 && nZero != 0 ){
		Ch1 = "零" + String1.substr(String3, 1);
		Ch2 = String2.substr(i, 1);
		nZero = 0;
		}
		else{
		Ch1 = String1.substr(String3, 1);
		Ch2 = String2.substr(i, 1);
		nZero = 0;
		}
	}
	else{ // 该位是万亿，亿，万，元位等关键位
	if( String3 != 0 && nZero != 0 ){
	Ch1 = "零" + String1.substr(String3, 1);
	Ch2 = String2.substr(i, 1);
	nZero = 0;
	}
	else if ( String3 != 0 && nZero == 0 ){
	Ch1 = String1.substr(String3, 1);
	Ch2 = String2.substr(i, 1);
	nZero = 0;
	}
	else if( String3 == 0 && nZero >= 3 ){
	Ch1 = "";
	Ch2 = "";
	nZero = nZero + 1;
	}
	else{
	Ch1 = "";
	Ch2 = String2.substr(i, 1);
	nZero = nZero + 1;
	}
	if( i == (len - 11) || i == (len - 3)){ // 如果该位是亿位或元位，则必须写上
	Ch2 = String2.substr(i, 1);
	}
	}
	chineseValue = chineseValue + Ch1 + Ch2;
	}
	if ( String3 == 0 ){ // 最后一位（分）为0时，加上“整”
	chineseValue = chineseValue + "整";
	}
	return chineseValue;
}
   
  /**
    把分转换成元
  */
  this.formatStrAmount = function(strAmount) {
	var amount = parseFloat(strAmount) / 100.00
	if(amount.toString().indexOf(".") == -1)
		amount = amount + ".00";
	return amount;
  }
  
  /*
    生成8位的随机数
  */
  this.getRandom = function() 
  {
     var max = 99999999;
     var min = 00000001;
     return Math.floor(Math.random()*(max-min+1)+min);   
  }
  
  /*
    转换日期格式
  */
  this.formatStrToData = function(strDateTime) {
	if(strDateTime && strDateTime.length > 11) {
		return strDateTime.substring(0, 2) + "-" + strDateTime.substring(2, 4) + "-" + strDateTime.substring(4, 6) + " "+ 
				strDateTime.substring(6, 8)+ ":" + strDateTime.substring(8, 10) + ":" + strDateTime.substring(10, 12);
	}
  }
  
      /*
    转换日期格式：2017/03/01
  */
  this.formatStrToDataNew = function(strDateTime) {
	if(strDateTime && strDateTime.length > 7) {
		return strDateTime.substring(0, 4) + "/" + strDateTime.substring(4, 6) + "/" + strDateTime.substring(6, 8);
	}
  }
  
  this.formatStrToDataCDS = function(strDateTime) {
	if(strDateTime && strDateTime.length > 7) {
		return strDateTime.substring(0, 4) + "-" + strDateTime.substring(4, 6) + "-" + strDateTime.substring(6, 8);
	}
  } 
  /*
  手输身份证校验
  */
   this.checkIdcard2 = function(strIdCardNum) {
	var idcard = strIdCardNum.toString();
	var Errors = new Array(
		"true",
		"身份证号码位数不对!",
		"身份证号码出生日期超出范围或含有非法字符!",
		"身份证号码校验错误!",
		"身份证地区非法!"
	);
	var area = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
				21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
				33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
				41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",
				46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",
				54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
				65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
	} 
	var idcard,Y,JYM;
	var S,M;
	var idcard_array = new Array();
	idcard_array = idcard.split("");
	//地区检验
	if(area[parseInt(idcard.substr(0,2))]==null) 
	{
		return Errors[4] ; 
	}
	//身份号码位数及格式检验
	switch(idcard.length){
	case 15:
		if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || 
			((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 ))
		{
			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
		} else {
			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
		}
		if(ereg.test(idcard)) return true;
		else {
			return Errors[2]; 
		} 
		break;
	case 18:
		//18位身份号码检测
		//出生日期的合法性检查 
		//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
		//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
		if ( parseInt(idcard.substr(6,4)) % 4 == 0 || 
			(parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 ))
		{
			//闰年出生日期的合法性正则表达式
			ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
		} else
		{
			//平年出生日期的合法性正则表达式
			ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
		}
		if(ereg.test(idcard)){
			//计算校验位
			S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
				+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
				+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
				+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
				+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
				+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
				+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
				+ parseInt(idcard_array[7]) * 1 
				+ parseInt(idcard_array[8]) * 6
				+ parseInt(idcard_array[9]) * 3 ;
			Y = S % 11;
			M = "F";
			JYM = "10X98765432";
			M = JYM.substr(Y,1);//判断校验位
			if(M == idcard_array[17]) return true; //检测ID的校验位
			else{
				return Errors[3];
			}
		}else {
			return Errors[2]; 
		}
		break;
	default:
		return Errors[1] ; 
		break;
	}
  }
  //去除数组中重复的数据
  this.unique = function(arr){
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
  }
  
  //判断字符串中指定字符出现的次数
  this.countInstances = function(mainStr, subStr)
  {
	var count = 0;
	var offset = 0;
	do
	{
		offset = mainStr.indexOf(subStr, offset);
		if(offset != -1)
		{
			count++;
			offset += subStr.length;
		}
	}while(offset != -1)
	return count;
  }
  
  //获取客户流水号:8位终端编号 + 8位终端流水号
  this.getBusinessNo = function()
  {
	  var strBusinessNo = "" + new Date().getTime();
	  if(strBusinessNo.length > 8){
		 strBusinessNo = strBusinessNo.substr((strBusinessNo.length)-8, strBusinessNo.length); 
	  }
	  else{
		 strBusinessNo = "00000000";
	  }
	  return top.terminal.strTerminalNum + "" + strBusinessNo;
  }
  
  //判断字符串的长度
  this.getstrLength = function(str)
  {
      var realLength = 0, len = str.length, charCode = -1;
      for (var i = 0; i < len; i++) {
          charCode = str.charCodeAt(i);
          if (charCode >= 0 && charCode <= 128) realLength += 1;
          else realLength += 2;
      }
      return realLength;
  }
  
  //对字符串进行截取指定长度
  this.cutstrringValaue = function(str, len)
  {
      var str_length = 0;
      var str_len = 0;
      var str_cut = new String();
      str_len = str.length;
      for (var i = str_len; i > 0; i--) {
          a = str.charAt(i);
          str_length++;
          if (escape(a).length > 4) {
              //中文字符的长度经编码之后大于4  
              str_length++;
          }
          str_cut = a.concat(str_cut);
          if (str_length >= len) {
              str_cut = str_cut.concat("");
              return str_cut;
          }
      }
      //如果给定字符串小于指定长度，则返回源字符串；  
      if (str_length < len) {
          return str;
      }
  }
  
    /**
  *自动补位方法
  *参数1：strOld 需要补位的字符串
  *参数2：type   补位方式 left左补 right右补
  *参数3：strSpe 用来补位的特殊字符
  *参数4：strLen 补完后字符串的长度
  */
  this.AddSpeStrToSpeLen = function(strOld,type,strSpe,strLen)
  {
	top.journalPrinter.addJournalWithTime("冠字号文件自动补位" + strOld);
	strOld = strOld.toString();
	strSpe = strSpe.toString();
	var strOldLen = 0;
	for(var i = 0;i<strOld.length;i++){
		if(strOld.charCodeAt(i) > 255){
			strOldLen += 2;		//中文或中文符号，则长度+2
		}else{
			strOldLen++;
		}
	} 
	var AddLen = strLen - strOldLen;//需要补的长度
	if(strOld.length < strLen){
	for(var i=0;i<AddLen;i++){
		if(type == "left")
			strOld = strSpe + strOld;
		else if(type == "right")
			strOld = strOld + strSpe;
		else
			strOld = strOld + strSpe;
	}
	}
	top.journalPrinter.addJournalWithTime("冠字号文件自动补位" + strOld);
	return strOld;
  }
  
}
  
/*单个事件实体（方法名，执行函数名）*/
function SingleEvent(eventName, func)
{
  this.EvtName = eventName;
  this.Func = func;
}

/*XSF控件事件处理类*/
function EventHandling(XSFCtrl)
{
  this.Events = new Array();
  this.ActiveXObj = XSFCtrl;

  /*增加事件响应*/
  this.appendEvent = function(eventName, func)
  {
    this.ActiveXObj.attachEvent(eventName, func);
    this.clear(eventName);
    for (var i=0; i<this.Events.length; i++)
    {
      if (this.Events[i].EvtName == eventName)
      {
        this.Events[i].Func = func;
        return;
      }
    }
    this.Events[this.Events.length] = new SingleEvent(eventName, func);
  }

  /*移除事件响应*/
  this.clear = function(eventName)
  {
    for (var i=0; i<this.Events.length; i++)
    {
      if (this.Events[i].EvtName == eventName && this.Events[i].Func != null)
      {
        this.ActiveXObj.detachEvent(this.Events[i].EvtName, this.Events[i].Func);
        this.Events[i].Func = null;
      }
    }
  }

  /*清空所有事件*/
  this.clearAll = function()
  {
    for (var i=0; i<this.Events.length; i++)
    {
      if (this.Events[i].Func != null)
      {
        this.ActiveXObj.detachEvent(this.Events[i].EvtName, this.Events[i].Func);
        this.Events[i].Func = null;
      }
    }
    this.Events.length = 0;
  }
}

/*
  Html工具类
  参数：doc     文档对象
 */
function HtmlUtil(doc)
{
  this.doc = doc;

  /*
    设置对象的HTML内容
    参数：
        id      对象的id号
        strhtml HTML内容
   */
  this.setObjInnerHtml = function(id, strhtml)
  {
    strhtml = strhtml.toString();
    var coll = this.doc.all.item(id);
    if (coll != null)
    {
      if (coll.length != null)
      {
        for (i=0; i<coll.length; i++)
          if (typeof(coll.item(i).innerHTML) != "undefined")
            coll.item(i).innerHTML = strhtml;
      }
      else
      {
        if (typeof(coll.innerHTML) != "undefined")
          coll.innerHTML = strhtml;
      }
    }
  }

  /*
    设置文档中所有对象的当前语言HTML内容
   */
  this.initDocObjLangHtml = function()
  {
    for (var i=0; i<this.doc.all.length; i++)
    {
      if (this.doc.all(i).id != null && this.doc.all(i).id.length > 0 && typeof(this.doc.all(i).innerHTML) != "undefined")
      {
        var langhtml = top.langcur[this.doc.all(i).id];
        if (langhtml != null)
          this.doc.all(i).innerHTML = langhtml;
      }
    }
    // 根据卡是否在读卡器中的情况，设置“退出”的HTML内容
    //if (this.doc.all.item("oQuit") != null)
   // {
     // if (top.cardreader.isCardPresent())
       // this.setObjInnerHtml("oQuit", top.langcur.oEjectCard);
      //else
       // this.setObjInnerHtml("oQuit", top.langcur.oQuit);
    //}
  }
}

/*
  操作系统和浏览器等信息类
 */
function SysInfo()
{
  // 浏览器版本信息，包括操作系统信息
  this.strBrowserVer = window.navigator.appVersion.toString();

  // 得到操作系统版本，如"Windows XP"、"Windows NT"等
  this.getOSVer = function()
  {
    if (this.strBrowserVer.indexOf("Windows NT 5.1") != -1)
	return "Windows XP";
    else if (this.strBrowserVer.indexOf("Windows NT 5.0") != -1)
	return "Windows 2000";
    else if (this.strBrowserVer.indexOf("Windows NT 4") != -1)
	return "Windows NT";
    else if (this.strBrowserVer.indexOf("Windows 98") != -1)
	return "Windows 98";
    else if (this.strBrowserVer.indexOf("Windows Me") != -1)
	return "Windows Me";
    else if (this.strBrowserVer.indexOf("Windows 95") != -1)
	return "Windows 95";
    else
	return "Unknown";
  }

  // 是否是Windows NT 操作系统
  this.isWinNT = function()
  {
    return (this.strBrowserVer.indexOf("Windows NT 4") != -1);
  }
}

/*基本信息处理类*/
function Idle()
{
  this.idleExch;
  this.miscArr;
  /*获取基本信息*/
  this.sendIdle = function()
  {
    var exch = new ExchangeXmlWithHost();
    var reqMsg = new ColsMsgXmlText();
    reqMsg.appendNode(XMLNODENAME_PROCESSORNAME, "Idle");
    var iRet = exch.doExchange(SERVICEPROCESSOR_URL, reqMsg);
    this.idleExch = exch;
 
    if(iRet== top.RESULT_SUCCESSFUL){
    	var listMiscStr="";
    	var miscArr0= new Array();
     	 listMiscStr=exch.msgxmldomResp.getElementValue("listMisc");
   	   	 miscArr0=listMiscStr.split('|');
   	   	// alert(miscArr0);
   	   	 this.miscArr=new Array();
       for (var i=0;i<miscArr0.length-1;i++){
    	   this.miscArr[i]=new Array();
    	   this.miscArr[i]=miscArr0[i].split(',');
    	 //  alert( this.miscArr[i]);
     }
    }
    return iRet;
  }  
}

/**
 * 参数类Misc
 * 
 */
function Misc()
{
	 this.miscArr=new Array();
	 //根据参数名取参数值，仅支持单个
	 this.getValueByName = function(name,defaultValue){
		 this.miscArr=top.idle.miscArr;
		 for(var i=0;i<this.miscArr.length;i++){
			 if(this.miscArr[i][0]==name){
				 return this.miscArr[i][1];
			 }
		 }
		 return defaultValue;
	 }
	//根据参数名取参数描述，仅支持单个
	 this.getDescByName = function(name){
		 this.miscArr=top.idle.miscArr;
		 for(var i=0;i<this.miscArr.length;i++){
			 if(this.miscArr[i][0]==name){
				 return this.miscArr[i][2];
			 }
		 }
		 return "";
	 }
	//根据参数名取参数值，列表参数
	 this.getValuesByName = function(name,defaultValue){
		 this.miscArr=top.idle.miscArr;
		 values=new Array();
		 var j=0;
		 for(var i=0;i<this.miscArr.length;i++){
			 if(this.miscArr[i][0]==name){
				 values[j++]=this.miscArr[i][1];
				 }
		 }
		 return values;
	 }
	 
	//根据参数名取参数描述，列表参数
	 this.getDescsByName = function(name){
		 this.miscArr=top.idle.miscArr;
		 descs=new Array();
		 var j=0;
		 for(var i=0;i<this.miscArr.length;i++){
			 if(this.miscArr[i][0]==name){
				 descs[j++]=this.miscArr[i][2];
				 }
		 }
		 return descs;
	 }
	 
	//列表参数根据参数名、值取单个参数描述
	 this.getDescByNameAndValue = function(name,value,defaultDesc){
		 this.miscArr=top.idle.miscArr;
		 for(var i=0;i<this.miscArr.length;i++){
			 if(this.miscArr[i][0]==name && this.miscArr[i][1]==value ){
				   return (this.miscArr[i][2]);
				 }
		 }
		 return defaultDesc;
	 }
}
/*
  广告流程信息类
 */
function Ad()
{
  // 是否显示广告标识符
  this.bLoadIdleAd = false;
  this.imgArrExch=new Array();

  // 加载广告
  this.loadAd = function()
  {
    var imgArr=new Array();
	try{
		var arr=top.YHAXCommonCtrl.GetAdFileName(top.TERM_AD_ADPATH); 
        if(arr !=null && arr.length > 3){
	      for(var i=0;i<arr.length;i++){
			  if(arr.split("|")[i] !=null && arr.split("|")[i] !="" && arr.split("|")[i] !="undefined"){
				  imgArr[i] = arr.split("|")[i];
			  }
	      }
		  this.imgArrExch = imgArr;
	      this.bLoadIdleAd = true;
        }else{
		  this.bLoadIdleAd = false;	
		}		
	}catch(e){
		 this.bLoadIdleAd = false;
	}
  }
}

/*
  文件操作类
*/
function FileControl()
{
   // 电子流水压缩
  this.zip = function()
  {
	  var fso = new ActiveXObject("Scripting.FileSystemObject"); 
      var f = fso.GetFolder(top.TERM_JOURNAL_PATH);  
      var fk = new Enumerator(f.SubFolders);  
      for (; !fk.atEnd(); fk.moveNext()) { 
         var strZipFilePath = fk.item();	  
	     var strFilePath = fk.item().Name;//待压缩的文件名称 
		 var strCurData = new top.DateTimeCtrl().getYYYYMMDD();
		 if(new top.StringCtrl(strFilePath).isAllDigit() && parseInt(strCurData) > parseInt(strFilePath)){
			 var ret =top.YHAXCommonCtrl.Compress(strZipFilePath);//filePath压缩的文件夹路劲
			 if(ret){
				// 删除文件夹
                fso.DeleteFolder(strZipFilePath, false);
			 }
		 }
      } 
  }
  
  // 文件压缩并转换成Base64字符串
  this.fileCompress = function(filePath)
  {
	  var ret =top.YHAXCommonCtrl.Compress(filePath);//filePath压缩的文件夹路劲
	  if(ret){
		  var result =top.YHAXCommonCtrl.GetBase64Str(filePath + ".7z")
		  //读取成功，删除压缩的文件
		  top.YHAXCommonCtrl.DeleteFile(filePath + ".7z");
		  return result;
	  }else{
		  return "";
	  }
  }
  
  /**文件复制 
   *参数1：strSourcePath 为文件存放的文件夹 如：C:\\
   *参数2：strDesPath    为文件复制的文件夹 如：D:\\ZNGY__Photos
   *参数3：strFileName   待复制的文件       如：barcode.gif
   */
  this.fileCopy = function(strSourcePath,strDesPath,strFileName)
  {
	  var ret =top.YHAXCommonCtrl.FileCopyTo(strSourcePath,strDesPath,strFileName);
	  return ret;
  }
  
  /**
  *删除文件夹
  */
  this.deleteFile = function(strFolder)
  {
	  top.journalPrinter.addJournalWithTime(strFolder + "文件夹开始删除 "); 
	  var objFSO = new ActiveXObject("Scripting.FileSystemObject");
	  // 检查文件夹是否存在
      if (objFSO.FolderExists(strFolder)){
         //alert("文件夹: " + strFolder + "存在");
         // 删除文件夹
         objFSO.DeleteFolder(strFolder, false);
         //alert("删除文件夹: " + strFolder + "成功");
		 top.journalPrinter.addJournalWithTime(strFolder + "文件夹删除成功 "); 
      }else{
		  top.journalPrinter.addJournalWithTime( strFolder + "文件夹不存在！");
	  }
  }
  
  /**
  *创建文件夹
  */
  this.createFile = function(strFolder)
  {
	  var objFSO = new ActiveXObject("Scripting.FileSystemObject");
	  // 检查文件夹是否存在
      if (objFSO.FolderExists(strFolder)){
      }
	  else{
		  // 创建新文件夹
          objFSO.CreateFolder(strFolder);
	  }
  }
   
	/**
	 *冠字号FSN文件操作方法
	*/
	this.createFSNFile = function() {
		top.journalPrinter.addJournalWithTime("冠字号上传操作开始，类型为" + top.pool.get("strFSNFlag"));
		if(top.pool.get("strFSNFlag") == "CWD") {//个人活期取款
			//文件夹名：交易流水+时间年月日时分秒YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strWithDrawTransJun") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "DEP"){//个人活期存款
			//文件夹名：批次号+时间年月日时分秒YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strBatchId") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "DEC"){//对公存款
			//文件夹名：批次号+时间年月日时分秒YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strBatchId") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "DWD"){//对公取款
			//文件夹名：批次号+时间年月日时分秒YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strWithDrawTransJun") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "CashDraw"){//现金支取
			//文件夹名：批次号+时间年月日时分秒YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strCashDrawOrgTsns") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "CashAccept"){//存单现金存款
			//文件夹名：批次号+时间年月日时分秒YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strTransRandom") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else {
			top.journalPrinter.addJournalWithTime("冠字号上传类型异常");
			return;
		}
		
		var FSNCopyPath = "D:\\ITSFSNUpLoad\\" + top.pool.get("FSNFileTXTName");
		new top.FileControl().createFile("D:\\ITSFSNUpLoad");
		new top.FileControl().createFile(FSNCopyPath);
		var ret = new top.FileControl().fileCopy("D:\\FSN", FSNCopyPath, "TEMP.FSN");//复制FSN文件
		if (!ret) {
			top.journalPrinter.addJournalWithTime("冠字号FSN文件复制失败" + FSNCopyPath);
			new top.FileControl().deleteFile("D:\\FSN");//2018-1-9 冠字号复制失败后 删除原fsn文件
		}else {
			top.journalPrinter.addJournalWithTime("冠字号FSN文件复制成功 " + FSNCopyPath);
			new top.FileControl().deleteFile("D:\\FSN");//2018-1-9 冠字号复制成功后 删除原fsn文件

			top.journalPrinter.addJournalWithTime("冠字号" + top.pool.get("FSNFileTXTName") + ".txt文件内容开始组装 ");
			var FSNmessPackageTime = new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS();
			var FSNtransSerNum = new top.DateTimeCtrl().getHHmmSS();
			var devManu = "SZYH";
			if('G'==top.terminal.strDevModelName.substring(0,1)){
				devManu = "GWI";
			}else if('N'==top.terminal.strDevModelName.substring(0,1)){
				devManu = "SNBC";
			}
			var FSNtermVendor = new top.StringCtrl("").AddSpeStrToSpeLen(devManu, "left", "_", "4");
			var FSNtermVersion = new top.StringCtrl("").AddSpeStrToSpeLen(top.terminal.strDevModelName, "left", "_", "8");
			
			var FSNterminalNum = new top.StringCtrl("").AddSpeStrToSpeLen(top.terminal.strTerminalNum, "left", "_", "13");
			var FSNorgNum = new top.StringCtrl("").AddSpeStrToSpeLen(top.terminal.strOrgNum, "right", " ", "6");
			if (top.terminal.signTellerNum != "" && top.terminal.signTellerNum != null && top.terminal.signTellerNum != undefined) {
				var FSNsignTellerNum = new top.StringCtrl("").AddSpeStrToSpeLen(top.terminal.signTellerNum, "right", " ", "7");
			} else {
				var FSNsignTellerNum = new top.StringCtrl("").AddSpeStrToSpeLen("0000000", "right", " ", "7");
			}
			var FSNtransJournal = "";
			var FSNstrDrawPan = "";
			var FSNRespIDName = "";
			var FSNstrAmount = "";
			if(top.pool.get("strFSNFlag") == "CWD") {//个人取款
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strWithDrawTransJun"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("DrawPan"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strRespIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DrawDispenseAmount")).formatNumber(2); //转换为元
			}else if(top.pool.get("strFSNFlag") == "DEP"){//个人存款
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strBatchId"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strDepAccount"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strRespIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DepositAcceptorAmount")).formatNumber(2); //转换为元
			}else if(top.pool.get("strFSNFlag") == "DEC"){//对公存款
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strBatchId"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strPayeeAccount"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DepositAcceptorAmount")).formatNumber(2); //转换为元
			}else if(top.pool.get("strFSNFlag") == "DWD"){//对公取款
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strWithDrawTransJun"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("WithDraw_Acc"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DrawDispenseAmount")).formatNumber(2); //转换为元
			}else if(top.pool.get("strFSNFlag") == "CashDraw"){
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strCashDrawOrgTsns"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDCardNum"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DrawDispenseAmount")).formatNumber(2); //转换为元
			}else if(top.pool.get("strFSNFlag") == "CashAccept"){
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strTransRandom"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDCardNum"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("strCashAcceptorAmount")).formatNumber(2); //转换为元
			}
			FSNstrAmount = new top.StringCtrl("").AddSpeStrToSpeLen(FSNstrAmount, "left", "0", "16");
            FSNRespIDName = "                                                                                ";//冠字号户名默认送空 与ATM一致 2018-1-20
			
			var FSNDataPack = "GHI305" //6  报文编号 
					+ "1" //1  中文编码 
					+ FSNmessPackageTime //14 组包时间 年月日时分秒YYYYMMDDhhmmss 
					+ FSNtransSerNum //6  本机顺序号 单台一天内唯一 HHmmSS 
					+ "00" //2  预留标识 固定00
					+ FSNtermVendor //4  机具厂商
					+ "04" //2  机具类型 
					+ FSNtermVersion //8  机具型号 不足左补_
					+ FSNterminalNum //13 机具编号 不足左补_
					+ FSNorgNum //6  设备机构号 不足右侧补单字节空格
					+ FSNsignTellerNum //7  柜员号 不足右侧补单字节空格
					+ "03" //2  业务类型
					+ "0" //1  清分标志
					+ "00000001" //8  业务流水个数 不足左侧补字符‘0’，假设值为N1，自助设备业务关联时为“00000001”
					+ "0" //1  交易类型 0:收入；1:付出；2:兑换；9:其它
					+ FSNtransJournal //18 业务流水 不足右侧填单字节空格
					+ FSNstrDrawPan //32 卡号/账号 不足右侧补单字节空格
					+ FSNRespIDName //80 账户名称 不足右侧补单字节空格
					+ FSNmessPackageTime //14 交易时间 
					+ FSNstrAmount //16 交易金额 以元为单位，不足左侧补字符‘0’ 
					+ "00000000"; //8  捆钞数量 自助设备为常数“00000000”

			top.journalPrinter.addJournalWithTime("冠字号" + top.pool.get("FSNFileTXTName") + ".txt文件开始创建 ");
			var objFSOFSN;
			try {
				objFSOFSN = new ActiveXObject("Scripting.FileSystemObject");
			}catch (e) {
				top.journalPrinter.addJournalWithTime("当前浏览器不支持ActiveXObject");
				return;
			}
			try {
				var FSNFileTXT = objFSOFSN.createtextfile(FSNCopyPath + "\\" + top.pool.get("FSNFileTXTName") + ".txt", 1, false);//创建记录FSN文件报文txt文件 FSNFileTXTName:FSN文件名 true：允许新建
				top.journalPrinter.addJournalWithTime("冠字号" + top.pool.get("FSNFileTXTName") + ".txt文件创建成功 ");
			}catch (e) {
				top.journalPrinter.addJournalWithTime("冠字号" + top.pool.get("FSNFileTXTName") + ".txt文件创建失败： " + e);
				return;
			}

			top.journalPrinter.addJournalWithTime("冠字号文件内容开始写入");
			try {
				FSNFileTXT.write(FSNDataPack);
				FSNFileTXT.Close();
				top.journalPrinter.addJournalWithTime("冠字号写入操作完成");
			}catch (e) {
				FSNFileTXT.Close();
				top.journalPrinter.addJournalWithTime("冠字号文件内容写入失败:" + e);
				return;
			}
		}
	}
}
  