/*
  Xml配置数据操作工具类
 */
function XmlManage()
{
  /*
    获取字符串参数列表
    参数：
        strFile       配置文件路径名
   */
  this.getXmlParamList = function(strFile,strNode,strChildNode)
  {
    if (strFile == null)
      return "";

    try
    {
    var param = top.YHAXCommonCtrl.GetListFromXmlFile(strFile,strNode,strChildNode);
    if (param.length == 0)
      param = "";
    return param;
  }
    catch(e)
    {
      return "";
    }
  }
  /*
    获取数值参数
    参数：
        strFile       配置文件路径名
        strNodePath   配置项的位置
        iDef          出现异常时返回的默认值
   */
  this.getXmlParamInt = function(strFile, strNodePath, iDef)
  {
    if (strFile == null || strNodePath == null)
      return iDef;

    try
    {
    var param = top.YHAXCommonCtrl.GetParamFromXmlFile(strFile, strNodePath);
    var iVal = parseInt(param, 10);
    if (isNaN(iVal))
      iVal = iDef;
    return iVal;
  }
    catch(e)
    {
      return iDef;
    }
  }

  /*
    获取布尔参数
    参数：
        strFile       配置文件路径名
        strNodePath   配置项的位置
        bDef          出现异常时返回的默认值
   */
  this.getXmlParamBool = function(strFile, strNodePath, bDef)
  {
    if (strFile == null || strNodePath == null)
      return bDef;

    try
    {
    var param = top.YHAXCommonCtrl.GetParamFromXmlFile(strFile, strNodePath);
    return new top.tool.str2Bool(param, bDef);
  }
    catch(e)
    {
      return bDef;
    }
  }

  /*
    获取字符串参数
    参数：
        strFile       配置文件路径名
        strNodePath   配置项的位置
        strDef          出现异常时返回的默认值
   */
  this.getXmlParamStr = function(strFile, strNodePath, strDef)
  {
    if (strFile == null || strNodePath == null)
      return strDef;

    try
    {
    var param = top.YHAXCommonCtrl.GetParamFromXmlFile(strFile, strNodePath);
    if (param.length == 0)
      param = strDef;
    return param;
  }
    catch(e)
    {
      return strDef;
    }
  }

  /*
    设置字符串参数
    参数：
        strFile       配置文件路径名
        strNodePath   配置项的位置
        strVal        参数值
   */
  this.setXmlParamStr = function(strFile, strNodePath, strVal)
  {
    if (strFile == null || strNodePath == null){
		return 1;
	}
    try
    {
        top.YHAXCommonCtrl.SetParamToXmlFile(strFile, strNodePath, strVal);
	    return 0;
    }
    catch(e)
    {
		return 1;
    }
  }

  /*
    设置布尔参数
    参数：
        strFile       配置文件路径名
        strNodePath   配置项的位置
        bVal          参数值
   */
  this.setXmlParamBool = function(strFile, strNodePath, bVal)
  {
    if (strFile == null || strNodePath == null)
      return;

    try
    {
      var param = (bVal ? "true" : "false");
      top.YHAXCommonCtrl.SetParamToXmlFile(strFile, strNodePath, param);
    }
    catch(e)
    {
    }
  }

  /*
    设置整型参数
    参数：
        strFile       配置文件路径名
        strNodePath   配置项的位置
        iVal          参数值
   */
  this.setXmlParamInt = function(strFile, strNodePath, iVal)
  {
    if (strFile == null || strNodePath == null)
      return;

    try
    {
       var param = iVal + "";
       top.YHAXCommonCtrl.SetParamToXmlFile(strFile, strNodePath, param);
    }
    catch(e)
    {
    }
  }

  /*
    增加整型参数值
    参数：
        strFile       配置文件路径名
        strNodePath   配置项的位置
        iIncrease     参数要增加的数值
    返回：
        增加后的参数值
   */
  this.increaseXmlParamInt = function(strFile, strNodePath, iIncrease)
  {
    var iVal = this.getXmlParamInt(strFile, strNodePath, 0);
    iVal += iIncrease;
    this.setXmlParamInt(strFile, strNodePath, iVal);
    return iVal;
  }
}
  