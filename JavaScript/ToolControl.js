/*
  ����ʱ�乤����
 */
function DateTimeCtrl(dt)
{
   // ���캯���У���dt����δ���û�Ϊnull����Ĭ��Ϊ�ǵ�ǰ����ʱ��
   if (dt != null)
     this.dtVal = dt;
   else
     this.dtVal = new Date();

   /*
    ��������ַ�������ʽΪ��YYYYMMDD
   */
   this.getYYYYMMDD = function()
   {
     var strYear = this.dtVal.getFullYear();
     var strMonth = this.dtVal.getMonth();
     var strDate = this.dtVal.getDate();
     return strYear + new StringCtrl(strMonth+1).prefixStr('0', 2) + new StringCtrl(strDate).prefixStr('0', 2);
   }
     /*
    ��������ַ�������ʽΪ��YYYY-MM-DD
   */
   this.getYYYYMMDD2 = function()
   {
     var strYear = this.dtVal.getFullYear();
     var strMonth = this.dtVal.getMonth();
     var strDate = this.dtVal.getDate();
     return strYear +"-" + new StringCtrl(strMonth+1).prefixStr('0', 2) + "-" + new StringCtrl(strDate).prefixStr('0', 2);
   }
   /*
    ��������ַ�������ʽΪ��YYYYMM
   */
   this.getYYYYMM = function()
   {
     var strYear = this.dtVal.getFullYear();
     var strMonth = this.dtVal.getMonth();
     return strYear + new StringCtrl(strMonth+1).prefixStr('0', 2);
   }

   /*
    ���ĳ��һ�ŵ��ַ�������ʽΪ��YYYYMM01
    */
   this.getYYYYMM01 = function()
   {
    var strYear = this.dtVal.getFullYear();
    var strMonth = this.dtVal.getMonth();
    var strDate = '01';
    return strYear + new StringCtrl(strMonth+1).prefixStr('0', 2) + new StringCtrl(strDate).prefixStr('0', 2);
   }
  
   /*
   ���ĳ��һ�ŵ��ַ�������ʽΪ��MM01
  */
  this.getYYYY01 = function()
  {
    var strYear = this.dtVal.getFullYear();
    var strMonth = '01';
    return  strYear+ new StringCtrl(strMonth).prefixStr('0', 2) ;
  }

  /*
    ���ʱ���ַ�������ʽΪ��HHmmSS
   */
  this.getHHmmSS = function()
  {
    var strHours = this.dtVal.getHours();
    var strMinutes = this.dtVal.getMinutes();
    var strSeconds = this.dtVal.getSeconds();
    return new StringCtrl(strHours).prefixStr('0', 2) + new StringCtrl(strMinutes).prefixStr('0', 2) + new StringCtrl(strSeconds).prefixStr('0', 2);
  }

  /*
    ���ʱ���ַ�������ʽΪ��HH:mm:SS
   */
  this.getHHmmSSWithSep = function()
  {
    var strHours = this.dtVal.getHours();
    var strMinutes = this.dtVal.getMinutes();
    var strSeconds = this.dtVal.getSeconds();
    return new StringCtrl(strHours).prefixStr('0', 2) + ':' + new StringCtrl(strMinutes).prefixStr('0', 2) + ':' + new StringCtrl(strSeconds).prefixStr('0', 2);
  }

  /*
    ���ʱ���ַ�������ʽΪ��HH:mm:SS:Ms
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
    ������ں�ʱ���ַ�������ʽΪ��YYYY/MM/DD HH:mm
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
    ������ں�ʱ���ַ�������ʽΪ��YYYY/MM/DD HH:mm:SS
   */
  this.getYYYYMMDDHHmmSSWithSep = function()
  {
    var strSeconds = this.dtVal.getSeconds();
    return this.getYYYYMMDDHHmmWithSep() + ":" + new StringCtrl(strSeconds).prefixStr('0', 2);
  }
  
  /*
    �ж��Ƿ�����Ч�����ں�ʱ���ַ���
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
		��ȡ��ǰ��������ָ������������
	*/
  this.addDays = function(days){
  	this.dtVal = new Date(this.dtVal.setDate(this.dtVal.getDate() + days));
		return this;
  }
	/*
		��ȡ��ǰ���ڼ���ָ������������
	*/
  this.cutDays = function(days){
  	this.dtVal = new Date(this.dtVal.setDate(this.dtVal.getDate() - days));
		return this;
  }
  
  /*
		��ȡ��ǰ��������ָ������������
	*/
  this.addMonths = function(months){
		this.dtVal = new Date(this.dtVal.setMonth(this.dtVal.getMonth() + months));
		return this;
  }

    /*
		��ȡ��ǰ���ڼ���ָ������������
	*/
  this.cutMonths = function(months){
		this.dtVal = new Date(this.dtVal.setMonth(this.dtVal.getMonth() - months));
		return this;
  }
  
	/*
		��ȡ��ǰ��������ָ������������
	*/
  this.addYears = function(months){
		this.dtVal = new Date(this.dtVal.setYear(this.dtVal.getFullYear() + months));
		return this;
  }
	/*
		��ȡ��ǰ���ڼ���ָ������������
	*/
  this.cutYears = function(months){
		this.dtVal = new Date(this.dtVal.setYear(this.dtVal.getFullYear() - months));
		return this;
  } 
 
  /*
  	��ȡ����ָ�����ں�����ڡ���ʽ 1D 1M 1Y ;
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
  	��ȡ����ָ�����ں�����ڡ���ʽ 1D 1M 1Y ;
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
  JSON�ַ���������
*/
function JSONCtrl()
{
	this.jsonStr="{}";
	//��json������������
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
  �ַ���������

 */
function StringCtrl(val)
{
  // ���湹�캯���е�ֵ�����Ա�����
  this.strVal = val.toString();

  /*
    �����ַ�,ʹ�ַ����ﵽָ���ĳ���
    ������
      ch        �����ַ�
      totallen  ��Ҫ�ﵽ�ĳ���
    ���أ�
      �������ַ���
   */
  this.suffixStr = function(ch, totallen)
  {
    for (var i=this.strVal.length; i<totallen; i++)
      this.strVal = this.strVal + ch;
    return this.strVal;
  }

  /*
    ǰ���ַ�,ʹ�ַ����ﵽָ���ĳ���
    ������
      ch        ǰ���ַ�
      totallen  ��Ҫ�ﵽ�ĳ���
    ���أ�
      �������ַ���
   */
  this.prefixStr = function(ch, totallen)
  {
    for (var i=this.strVal.length; i<totallen; i++)
      this.strVal = ch + this.strVal;
    return this.strVal;
  }
  
  
  //�ַ�����ǰ�油���ַ����ܳ���
  this.formatStr=function(ch,totalLen){//ǰ��ӿո�,һ���ո�ռ1λ
	 var tempLen=this.strVal.length;
	 var tempStr=this.strVal;
	 var validFlg=false;    
     var lenString=0;
	for(var i=0;i<tempLen;i++){//�õ��ַ����ĳ���
		var tempChar=tempStr.substring(0,1);

		var patrn=/^[0-9]{1,1}$/;    
		if(patrn.exec(tempChar)!=null){
			lenString=lenString+1;
			validFlg=true;
		}
			        
		patrn=/^[a-zA-Z]{1,1}$/;
		if(!validFlg&&patrn.exec(tempChar)!=null){
			    //alert("��ĸ��֤");
			lenString=lenString+1;
			validFlg=true;
		}
			
		if(tempChar=="."||tempChar=="-"||tempChar=="+"||tempChar=="*"){
			lenString=lenString+1;
			validFlg=true;
		}
			        
		if(!validFlg){
			 // alert("������֤");    
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
	
	
	//�ַ��������油���ַ����ܳ���
	this.formatStrRight=function(ch,totalLen){//����ӿո�,һ���ո�ռ1λ
	    var tempLen=this.strVal.length;
	    var tempStr=this.strVal;
	  	var validFlg=false;    
		var lenString=0;
		for(var i=0;i<tempLen;i++){//�õ��ַ����ĳ���
			var tempChar=tempStr.substring(0,1);

			var patrn=/^[0-9]{1,1}$/;    
			if(patrn.exec(tempChar)!=null){
				lenString=lenString+1;
				validFlg=true;
			}
			        
			patrn=/^[a-zA-Z]{1,1}$/;
			if(!validFlg&&patrn.exec(tempChar)!=null){
			    //alert("��ĸ��֤");
				lenString=lenString+1;
				validFlg=true;
			}
			
			if(tempChar=="."||tempChar=="-"||tempChar=="+"||tempChar=="*"){
				lenString=lenString+1;
				validFlg=true;
			}
			        
			if(!validFlg){
			    // alert("������֤");    
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
    ��β���ַ�,ʹ�ַ����ﵽָ���ĳ���
    ������
      ch        ��β�õ��ַ�
      totallen  ��Ҫ�ﵽ�ĳ���
    ���أ�
      �������ַ���
   */
  this.preandsufStr = function(ch, totallen)
  {
    for (var i=this.strVal.length; i<totallen; i+=2)
      this.strVal = ch + this.strVal + ch;
    return this.strVal;
  }

  /*
    ȥ���ַ���ǰ��Ŀո�
    ���أ�
      �������ַ���
   */
  this.trim = function()
  {
    var re = new RegExp("(^\\s*)|(\\s*$)", "g");
    this.strVal = this.strVal.replace(re, "");
    return this.strVal;
  }
  
  /*
    ȥ���ַ������еĿո�
    ���أ��������ַ���
   */
  this.removeAllSpace = function()
  {
     return this.strVal.replace(/\s+/g, "");
  }
  
   /*
    ��Ԫת��Ϊ��
    ���أ��������ַ���
   */
   this.YuanToFen = function(num)
   {
  	 num = Math.abs(num).toFixed(2);  //��numȡ����ֵ����������ȡ2λС��
  	 var str = (num * 100).toFixed(0).toString();  //��num��100��ת�����ַ�����ʽ
	 return str;  
   }
  
  /*
    ���ַ�����ʽ����ָ����С����λ��
   */
   this.formatNumber = function(nAfterDot)        //nAfterDotС��λ��
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
    ȥ���ַ���ǰ�Ŀո�
    ���أ�
      �������ַ���
   */
  this.trimLeft = function()
  {
    var re = new RegExp("(^\\s*)", "g");
    this.strVal = this.strVal.replace(re, "");
    return this.strVal;
  }

  /*
    ȥ���ַ�����Ŀո�
    ���أ�
      �������ַ���
   */
  this.trimRight = function()
  {
    var re = new RegExp("(\\s*$)", "g");
    this.strVal = this.strVal.replace(re, "");
    return this.strVal;
  }
  
  //ȫ��ת��Ϊ��Ǻ���   
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
    �ж��ַ������Ƿ��������
   */
  this.trimChinese = function()
  {
    var re = new RegExp("[\\u4E00-\\u9FFF]+","g");
    return re.test(this.strVal);
  }

  /*
    �ж��ַ����Ƿ�������
   */
  this.isAllDigit = function()
  {
	var re = new RegExp("^[0-9]*[1-9][0-9]*$", "g");
    return  re.test(this.strVal);
  }

  /*
    �ж��ַ����Ƿ�������
   */
  this.isAllDigit2 = function()
  {
    var re = new RegExp("^[0-9]*[0-9][0-9]*$", "g");
    return  re.test(this.strVal);
  }
  /*
    �ж��ַ����Ƿ�����Ч�ĸ�����
   */
  this.isValidFloat = function()
  {
    var re = new RegExp("^\\d+(\\.\\d+)?$", "g");
    return  re.test(this.strVal);
  }

  /*
    �ж��ַ����Ƿ�����Ч�Ľ��
   */
  this.isValidAmount = function()
  {
    var re = new RegExp("^\\d+(\\.([0-9]|([0-9][0-9])))?$", "g");
    return  re.test(this.strVal);
  }
  
  //�ж��ַ����Ƿ������ֻ���ĸ
  this.isDigitOrLetter = function()
  {
    var re = new RegExp("^[A-Za-z0-9]+$", "g");
    return  re.test(this.strVal);
  }
  
  //�ж�������ַ��Ƿ�ΪӢ����ĸ    
  this.isLetter = function()    
  {        
     if(/^[a-zA-Z]/.test(this.strVal)) {
       return true;
     }else{
       return false;
     }    
  }  
  //�ж��ֻ����Ƿ���1��ͷ�Ҷ�������
  this.checkPhone = function()
  {
	  if(/^1\d{10}$/.test(this.strVal)){
		  return true;
	  }else{
		  return false;  
	  }
  }
  //ȥ���ظ�����
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
  //���˶�ά�����е���������
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
    �滻�ַ����еľ����ִ�Ϊ�����ִ�
    ���أ�
      �������ַ���
   */
  this.replaceAll = function(strOld, strNew)
  {
    while (this.strVal.indexOf(strOld) != -1 )
      this.strVal = this.strVal.replace(strOld, strNew);
    return this.strVal;
  }
  
  // �ֽ���������ת��Ϊʮ�������ַ���
  this.byteArr2HexStr = function(byteArr)
  {
    var strHex = "";
    try{byteArr = byteArr.toArray();}catch(e){}
    for (var i=0; i<byteArr.length; i++)
      strHex += new top.StringCtrl(byteArr[i].toString(16)).prefixStr('0', 2);
    return strHex.toUpperCase();
  }
  
  // �ַ�����������ת��Ϊʮ�������ַ���
  this.strArr2HexStr = function(strArr)
  {
    var strHex = "";
    for (var i=0; i<strArr.length; i++)
      strHex += new top.StringCtrl(strArr.charCodeAt(i).toString(16)).prefixStr('0', 2);
    return strHex.toUpperCase();
  }
  
  // ʮ�������ַ���ת��Ϊ�ֽ���������
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
   * �ַ���ת��Ϊ������
   * ����1:str   �ַ���
   * ����2:bDef  ת��ʧ�ܺ��ȱʡֵ
   * ����:������ֵ
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
    ����jscript�����toString����
   */
  this.toString = function()
  {
    return this.strVal;
  } 
  
  /*
     �Ѵ�д���ת����Сд���
  */
  this.aNumber = function(num) 
  { 
      var numArray = new Array(); 
	  var str="��,��,Բ,$";
	  str =str.split(",");
      for ( var i = 0; i < str.length; i++) { 
		  var re = eval("/" + (numArray[i - 1] ? str[i-1] : "") + "(.*)" + str[i] + "/"); 
          if (num.match(re)) { 
              numArray[i] = num.match(re)[1].replace(/^ʰ/, "Ҽʰ"); 
              numArray[i] = numArray[i].replace(/[��Ҽ��������½��ƾ�]/g, function($1) { 
                  return "��Ҽ��������½��ƾ�".indexOf($1); 
              }); 
              numArray[i] = numArray[i].replace(/[�ֽ�ʰ��Ǫ]/g, function($1) { 
                  return "*" + Math.pow(10, "�ֽ� ʰ��Ǫ ".indexOf($1) - 2) + "+" 
              }).replace(/^\*|\+$/g, "").replace(/��/, "0"); 
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
 // ����ת���ɴ�д����
 this.chgAmout2Up = function(numberValue) {
	var numberValue=new String(Math.round(numberValue*100)); // ���ֽ��
	var chineseValue=""; // ת����ĺ��ֽ��
	var String1 = "��Ҽ��������½��ƾ�"; // ��������
	var String2 = "��Ǫ��ʰ��Ǫ��ʰ��Ǫ��ʰԲ�Ƿ�"; // ��Ӧ��λ
	var len=numberValue.length; // numberValue ���ַ�������
	var Ch1; // ���ֵĺ������
	var Ch2; // ����λ�ĺ��ֶ���
	var nZero=0; // ����������������ֵ�ĸ���
	var String3; // ָ��λ�õ���ֵ
	if(len>15){
		return "";
	}
	if (numberValue==0){
		chineseValue = "Բ��";
		return chineseValue;
	}

	String2 = String2.substr(String2.length-len, len); // ȡ����Ӧλ����STRING2��ֵ
	for(var i=0; i<len; i++){
		String3 = parseInt(numberValue.substr(i, 1),10); // ȡ����ת����ĳһλ��ֵ
		if ( i != (len - 3) && i != (len - 7) && i != (len - 11) && i !=(len - 15) ){
			if ( String3 == 0 ){
				Ch1 = "";
				Ch2 = "";
		nZero = nZero + 1;
	}else if ( String3 != 0 && nZero != 0 ){
		Ch1 = "��" + String1.substr(String3, 1);
		Ch2 = String2.substr(i, 1);
		nZero = 0;
		}
		else{
		Ch1 = String1.substr(String3, 1);
		Ch2 = String2.substr(i, 1);
		nZero = 0;
		}
	}
	else{ // ��λ�����ڣ��ڣ���Ԫλ�ȹؼ�λ
	if( String3 != 0 && nZero != 0 ){
	Ch1 = "��" + String1.substr(String3, 1);
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
	if( i == (len - 11) || i == (len - 3)){ // �����λ����λ��Ԫλ�������д��
	Ch2 = String2.substr(i, 1);
	}
	}
	chineseValue = chineseValue + Ch1 + Ch2;
	}
	if ( String3 == 0 ){ // ���һλ���֣�Ϊ0ʱ�����ϡ�����
	chineseValue = chineseValue + "��";
	}
	return chineseValue;
}
   
  /**
    �ѷ�ת����Ԫ
  */
  this.formatStrAmount = function(strAmount) {
	var amount = parseFloat(strAmount) / 100.00
	if(amount.toString().indexOf(".") == -1)
		amount = amount + ".00";
	return amount;
  }
  
  /*
    ����8λ�������
  */
  this.getRandom = function() 
  {
     var max = 99999999;
     var min = 00000001;
     return Math.floor(Math.random()*(max-min+1)+min);   
  }
  
  /*
    ת�����ڸ�ʽ
  */
  this.formatStrToData = function(strDateTime) {
	if(strDateTime && strDateTime.length > 11) {
		return strDateTime.substring(0, 2) + "-" + strDateTime.substring(2, 4) + "-" + strDateTime.substring(4, 6) + " "+ 
				strDateTime.substring(6, 8)+ ":" + strDateTime.substring(8, 10) + ":" + strDateTime.substring(10, 12);
	}
  }
  
      /*
    ת�����ڸ�ʽ��2017/03/01
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
  �������֤У��
  */
   this.checkIdcard2 = function(strIdCardNum) {
	var idcard = strIdCardNum.toString();
	var Errors = new Array(
		"true",
		"���֤����λ������!",
		"���֤����������ڳ�����Χ���зǷ��ַ�!",
		"���֤����У�����!",
		"���֤�����Ƿ�!"
	);
	var area = {11:"����",12:"���",13:"�ӱ�",14:"ɽ��",15:"���ɹ�",
				21:"����",22:"����",23:"������",31:"�Ϻ�",32:"����",
				33:"�㽭",34:"����",35:"����",36:"����",37:"ɽ��",
				41:"����",42:"����",43:"����",44:"�㶫",45:"����",
				46:"����",50:"����",51:"�Ĵ�",52:"����",53:"����",
				54:"����",61:"����",62:"����",63:"�ຣ",64:"����",
				65:"�½�",71:"̨��",81:"���",82:"����",91:"����"
	} 
	var idcard,Y,JYM;
	var S,M;
	var idcard_array = new Array();
	idcard_array = idcard.split("");
	//��������
	if(area[parseInt(idcard.substr(0,2))]==null) 
	{
		return Errors[4] ; 
	}
	//��ݺ���λ������ʽ����
	switch(idcard.length){
	case 15:
		if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || 
			((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 ))
		{
			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//���Գ������ڵĺϷ���
		} else {
			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//���Գ������ڵĺϷ���
		}
		if(ereg.test(idcard)) return true;
		else {
			return Errors[2]; 
		} 
		break;
	case 18:
		//18λ��ݺ�����
		//�������ڵĺϷ��Լ�� 
		//��������:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
		//ƽ������:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
		if ( parseInt(idcard.substr(6,4)) % 4 == 0 || 
			(parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 ))
		{
			//����������ڵĺϷ���������ʽ
			ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
		} else
		{
			//ƽ��������ڵĺϷ���������ʽ
			ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
		}
		if(ereg.test(idcard)){
			//����У��λ
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
			M = JYM.substr(Y,1);//�ж�У��λ
			if(M == idcard_array[17]) return true; //���ID��У��λ
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
  //ȥ���������ظ�������
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
  
  //�ж��ַ�����ָ���ַ����ֵĴ���
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
  
  //��ȡ�ͻ���ˮ��:8λ�ն˱�� + 8λ�ն���ˮ��
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
  
  //�ж��ַ����ĳ���
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
  
  //���ַ������н�ȡָ������
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
              //�����ַ��ĳ��Ⱦ�����֮�����4  
              str_length++;
          }
          str_cut = a.concat(str_cut);
          if (str_length >= len) {
              str_cut = str_cut.concat("");
              return str_cut;
          }
      }
      //��������ַ���С��ָ�����ȣ��򷵻�Դ�ַ�����  
      if (str_length < len) {
          return str;
      }
  }
  
    /**
  *�Զ���λ����
  *����1��strOld ��Ҫ��λ���ַ���
  *����2��type   ��λ��ʽ left�� right�Ҳ�
  *����3��strSpe ������λ�������ַ�
  *����4��strLen ������ַ����ĳ���
  */
  this.AddSpeStrToSpeLen = function(strOld,type,strSpe,strLen)
  {
	top.journalPrinter.addJournalWithTime("���ֺ��ļ��Զ���λ" + strOld);
	strOld = strOld.toString();
	strSpe = strSpe.toString();
	var strOldLen = 0;
	for(var i = 0;i<strOld.length;i++){
		if(strOld.charCodeAt(i) > 255){
			strOldLen += 2;		//���Ļ����ķ��ţ��򳤶�+2
		}else{
			strOldLen++;
		}
	} 
	var AddLen = strLen - strOldLen;//��Ҫ���ĳ���
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
	top.journalPrinter.addJournalWithTime("���ֺ��ļ��Զ���λ" + strOld);
	return strOld;
  }
  
}
  
/*�����¼�ʵ�壨��������ִ�к�������*/
function SingleEvent(eventName, func)
{
  this.EvtName = eventName;
  this.Func = func;
}

/*XSF�ؼ��¼�������*/
function EventHandling(XSFCtrl)
{
  this.Events = new Array();
  this.ActiveXObj = XSFCtrl;

  /*�����¼���Ӧ*/
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

  /*�Ƴ��¼���Ӧ*/
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

  /*��������¼�*/
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
  Html������
  ������doc     �ĵ�����
 */
function HtmlUtil(doc)
{
  this.doc = doc;

  /*
    ���ö����HTML����
    ������
        id      �����id��
        strhtml HTML����
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
    �����ĵ������ж���ĵ�ǰ����HTML����
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
    // ���ݿ��Ƿ��ڶ������е���������á��˳�����HTML����
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
  ����ϵͳ�����������Ϣ��
 */
function SysInfo()
{
  // ������汾��Ϣ����������ϵͳ��Ϣ
  this.strBrowserVer = window.navigator.appVersion.toString();

  // �õ�����ϵͳ�汾����"Windows XP"��"Windows NT"��
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

  // �Ƿ���Windows NT ����ϵͳ
  this.isWinNT = function()
  {
    return (this.strBrowserVer.indexOf("Windows NT 4") != -1);
  }
}

/*������Ϣ������*/
function Idle()
{
  this.idleExch;
  this.miscArr;
  /*��ȡ������Ϣ*/
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
 * ������Misc
 * 
 */
function Misc()
{
	 this.miscArr=new Array();
	 //���ݲ�����ȡ����ֵ����֧�ֵ���
	 this.getValueByName = function(name,defaultValue){
		 this.miscArr=top.idle.miscArr;
		 for(var i=0;i<this.miscArr.length;i++){
			 if(this.miscArr[i][0]==name){
				 return this.miscArr[i][1];
			 }
		 }
		 return defaultValue;
	 }
	//���ݲ�����ȡ������������֧�ֵ���
	 this.getDescByName = function(name){
		 this.miscArr=top.idle.miscArr;
		 for(var i=0;i<this.miscArr.length;i++){
			 if(this.miscArr[i][0]==name){
				 return this.miscArr[i][2];
			 }
		 }
		 return "";
	 }
	//���ݲ�����ȡ����ֵ���б����
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
	 
	//���ݲ�����ȡ�����������б����
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
	 
	//�б�������ݲ�������ֵȡ������������
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
  ���������Ϣ��
 */
function Ad()
{
  // �Ƿ���ʾ����ʶ��
  this.bLoadIdleAd = false;
  this.imgArrExch=new Array();

  // ���ع��
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
  �ļ�������
*/
function FileControl()
{
   // ������ˮѹ��
  this.zip = function()
  {
	  var fso = new ActiveXObject("Scripting.FileSystemObject"); 
      var f = fso.GetFolder(top.TERM_JOURNAL_PATH);  
      var fk = new Enumerator(f.SubFolders);  
      for (; !fk.atEnd(); fk.moveNext()) { 
         var strZipFilePath = fk.item();	  
	     var strFilePath = fk.item().Name;//��ѹ�����ļ����� 
		 var strCurData = new top.DateTimeCtrl().getYYYYMMDD();
		 if(new top.StringCtrl(strFilePath).isAllDigit() && parseInt(strCurData) > parseInt(strFilePath)){
			 var ret =top.YHAXCommonCtrl.Compress(strZipFilePath);//filePathѹ�����ļ���·��
			 if(ret){
				// ɾ���ļ���
                fso.DeleteFolder(strZipFilePath, false);
			 }
		 }
      } 
  }
  
  // �ļ�ѹ����ת����Base64�ַ���
  this.fileCompress = function(filePath)
  {
	  var ret =top.YHAXCommonCtrl.Compress(filePath);//filePathѹ�����ļ���·��
	  if(ret){
		  var result =top.YHAXCommonCtrl.GetBase64Str(filePath + ".7z")
		  //��ȡ�ɹ���ɾ��ѹ�����ļ�
		  top.YHAXCommonCtrl.DeleteFile(filePath + ".7z");
		  return result;
	  }else{
		  return "";
	  }
  }
  
  /**�ļ����� 
   *����1��strSourcePath Ϊ�ļ���ŵ��ļ��� �磺C:\\
   *����2��strDesPath    Ϊ�ļ����Ƶ��ļ��� �磺D:\\ZNGY__Photos
   *����3��strFileName   �����Ƶ��ļ�       �磺barcode.gif
   */
  this.fileCopy = function(strSourcePath,strDesPath,strFileName)
  {
	  var ret =top.YHAXCommonCtrl.FileCopyTo(strSourcePath,strDesPath,strFileName);
	  return ret;
  }
  
  /**
  *ɾ���ļ���
  */
  this.deleteFile = function(strFolder)
  {
	  top.journalPrinter.addJournalWithTime(strFolder + "�ļ��п�ʼɾ�� "); 
	  var objFSO = new ActiveXObject("Scripting.FileSystemObject");
	  // ����ļ����Ƿ����
      if (objFSO.FolderExists(strFolder)){
         //alert("�ļ���: " + strFolder + "����");
         // ɾ���ļ���
         objFSO.DeleteFolder(strFolder, false);
         //alert("ɾ���ļ���: " + strFolder + "�ɹ�");
		 top.journalPrinter.addJournalWithTime(strFolder + "�ļ���ɾ���ɹ� "); 
      }else{
		  top.journalPrinter.addJournalWithTime( strFolder + "�ļ��в����ڣ�");
	  }
  }
  
  /**
  *�����ļ���
  */
  this.createFile = function(strFolder)
  {
	  var objFSO = new ActiveXObject("Scripting.FileSystemObject");
	  // ����ļ����Ƿ����
      if (objFSO.FolderExists(strFolder)){
      }
	  else{
		  // �������ļ���
          objFSO.CreateFolder(strFolder);
	  }
  }
   
	/**
	 *���ֺ�FSN�ļ���������
	*/
	this.createFSNFile = function() {
		top.journalPrinter.addJournalWithTime("���ֺ��ϴ�������ʼ������Ϊ" + top.pool.get("strFSNFlag"));
		if(top.pool.get("strFSNFlag") == "CWD") {//���˻���ȡ��
			//�ļ�������������ˮ+ʱ��������ʱ����YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strWithDrawTransJun") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "DEP"){//���˻��ڴ��
			//�ļ����������κ�+ʱ��������ʱ����YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strBatchId") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "DEC"){//�Թ����
			//�ļ����������κ�+ʱ��������ʱ����YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strBatchId") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "DWD"){//�Թ�ȡ��
			//�ļ����������κ�+ʱ��������ʱ����YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strWithDrawTransJun") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "CashDraw"){//�ֽ�֧ȡ
			//�ļ����������κ�+ʱ��������ʱ����YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strCashDrawOrgTsns") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else if(top.pool.get("strFSNFlag") == "CashAccept"){//�浥�ֽ���
			//�ļ����������κ�+ʱ��������ʱ����YYYYMMDDhhmmss
			top.pool.set("FSNFileTXTName", top.pool.get("strTransRandom") + new top.DateTimeCtrl().getYYYYMMDD() + new top.DateTimeCtrl().getHHmmSS());
		}else {
			top.journalPrinter.addJournalWithTime("���ֺ��ϴ������쳣");
			return;
		}
		
		var FSNCopyPath = "D:\\ITSFSNUpLoad\\" + top.pool.get("FSNFileTXTName");
		new top.FileControl().createFile("D:\\ITSFSNUpLoad");
		new top.FileControl().createFile(FSNCopyPath);
		var ret = new top.FileControl().fileCopy("D:\\FSN", FSNCopyPath, "TEMP.FSN");//����FSN�ļ�
		if (!ret) {
			top.journalPrinter.addJournalWithTime("���ֺ�FSN�ļ�����ʧ��" + FSNCopyPath);
			new top.FileControl().deleteFile("D:\\FSN");//2018-1-9 ���ֺŸ���ʧ�ܺ� ɾ��ԭfsn�ļ�
		}else {
			top.journalPrinter.addJournalWithTime("���ֺ�FSN�ļ����Ƴɹ� " + FSNCopyPath);
			new top.FileControl().deleteFile("D:\\FSN");//2018-1-9 ���ֺŸ��Ƴɹ��� ɾ��ԭfsn�ļ�

			top.journalPrinter.addJournalWithTime("���ֺ�" + top.pool.get("FSNFileTXTName") + ".txt�ļ����ݿ�ʼ��װ ");
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
			if(top.pool.get("strFSNFlag") == "CWD") {//����ȡ��
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strWithDrawTransJun"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("DrawPan"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strRespIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DrawDispenseAmount")).formatNumber(2); //ת��ΪԪ
			}else if(top.pool.get("strFSNFlag") == "DEP"){//���˴��
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strBatchId"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strDepAccount"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strRespIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DepositAcceptorAmount")).formatNumber(2); //ת��ΪԪ
			}else if(top.pool.get("strFSNFlag") == "DEC"){//�Թ����
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strBatchId"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strPayeeAccount"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DepositAcceptorAmount")).formatNumber(2); //ת��ΪԪ
			}else if(top.pool.get("strFSNFlag") == "DWD"){//�Թ�ȡ��
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strWithDrawTransJun"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("WithDraw_Acc"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DrawDispenseAmount")).formatNumber(2); //ת��ΪԪ
			}else if(top.pool.get("strFSNFlag") == "CashDraw"){
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strCashDrawOrgTsns"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDCardNum"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("DrawDispenseAmount")).formatNumber(2); //ת��ΪԪ
			}else if(top.pool.get("strFSNFlag") == "CashAccept"){
				FSNtransJournal = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strTransRandom"), "right", " ", "18");
				FSNstrDrawPan = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDCardNum"), "right", " ", "32");
				FSNRespIDName = new top.StringCtrl("").AddSpeStrToSpeLen(top.pool.get("strIDName"), "right", " ", "80");
				FSNstrAmount = new top.StringCtrl(top.pool.get("strCashAcceptorAmount")).formatNumber(2); //ת��ΪԪ
			}
			FSNstrAmount = new top.StringCtrl("").AddSpeStrToSpeLen(FSNstrAmount, "left", "0", "16");
            FSNRespIDName = "                                                                                ";//���ֺŻ���Ĭ���Ϳ� ��ATMһ�� 2018-1-20
			
			var FSNDataPack = "GHI305" //6  ���ı�� 
					+ "1" //1  ���ı��� 
					+ FSNmessPackageTime //14 ���ʱ�� ������ʱ����YYYYMMDDhhmmss 
					+ FSNtransSerNum //6  ����˳��� ��̨һ����Ψһ HHmmSS 
					+ "00" //2  Ԥ����ʶ �̶�00
					+ FSNtermVendor //4  ���߳���
					+ "04" //2  �������� 
					+ FSNtermVersion //8  �����ͺ� ������_
					+ FSNterminalNum //13 ���߱�� ������_
					+ FSNorgNum //6  �豸������ �����Ҳಹ���ֽڿո�
					+ FSNsignTellerNum //7  ��Ա�� �����Ҳಹ���ֽڿո�
					+ "03" //2  ҵ������
					+ "0" //1  ��ֱ�־
					+ "00000001" //8  ҵ����ˮ���� ������ಹ�ַ���0��������ֵΪN1�������豸ҵ�����ʱΪ��00000001��
					+ "0" //1  �������� 0:���룻1:������2:�һ���9:����
					+ FSNtransJournal //18 ҵ����ˮ �����Ҳ���ֽڿո�
					+ FSNstrDrawPan //32 ����/�˺� �����Ҳಹ���ֽڿո�
					+ FSNRespIDName //80 �˻����� �����Ҳಹ���ֽڿո�
					+ FSNmessPackageTime //14 ����ʱ�� 
					+ FSNstrAmount //16 ���׽�� ��ԪΪ��λ��������ಹ�ַ���0�� 
					+ "00000000"; //8  �������� �����豸Ϊ������00000000��

			top.journalPrinter.addJournalWithTime("���ֺ�" + top.pool.get("FSNFileTXTName") + ".txt�ļ���ʼ���� ");
			var objFSOFSN;
			try {
				objFSOFSN = new ActiveXObject("Scripting.FileSystemObject");
			}catch (e) {
				top.journalPrinter.addJournalWithTime("��ǰ�������֧��ActiveXObject");
				return;
			}
			try {
				var FSNFileTXT = objFSOFSN.createtextfile(FSNCopyPath + "\\" + top.pool.get("FSNFileTXTName") + ".txt", 1, false);//������¼FSN�ļ�����txt�ļ� FSNFileTXTName:FSN�ļ��� true�������½�
				top.journalPrinter.addJournalWithTime("���ֺ�" + top.pool.get("FSNFileTXTName") + ".txt�ļ������ɹ� ");
			}catch (e) {
				top.journalPrinter.addJournalWithTime("���ֺ�" + top.pool.get("FSNFileTXTName") + ".txt�ļ�����ʧ�ܣ� " + e);
				return;
			}

			top.journalPrinter.addJournalWithTime("���ֺ��ļ����ݿ�ʼд��");
			try {
				FSNFileTXT.write(FSNDataPack);
				FSNFileTXT.Close();
				top.journalPrinter.addJournalWithTime("���ֺ�д��������");
			}catch (e) {
				FSNFileTXT.Close();
				top.journalPrinter.addJournalWithTime("���ֺ��ļ�����д��ʧ��:" + e);
				return;
			}
		}
	}
}
  