/*
  Xml�������ݲ���������
 */
function XmlManage()
{
  /*
    ��ȡ�ַ��������б�
    ������
        strFile       �����ļ�·����
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
    ��ȡ��ֵ����
    ������
        strFile       �����ļ�·����
        strNodePath   �������λ��
        iDef          �����쳣ʱ���ص�Ĭ��ֵ
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
    ��ȡ��������
    ������
        strFile       �����ļ�·����
        strNodePath   �������λ��
        bDef          �����쳣ʱ���ص�Ĭ��ֵ
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
    ��ȡ�ַ�������
    ������
        strFile       �����ļ�·����
        strNodePath   �������λ��
        strDef          �����쳣ʱ���ص�Ĭ��ֵ
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
    �����ַ�������
    ������
        strFile       �����ļ�·����
        strNodePath   �������λ��
        strVal        ����ֵ
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
    ���ò�������
    ������
        strFile       �����ļ�·����
        strNodePath   �������λ��
        bVal          ����ֵ
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
    �������Ͳ���
    ������
        strFile       �����ļ�·����
        strNodePath   �������λ��
        iVal          ����ֵ
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
    �������Ͳ���ֵ
    ������
        strFile       �����ļ�·����
        strNodePath   �������λ��
        iIncrease     ����Ҫ���ӵ���ֵ
    ���أ�
        ���Ӻ�Ĳ���ֵ
   */
  this.increaseXmlParamInt = function(strFile, strNodePath, iIncrease)
  {
    var iVal = this.getXmlParamInt(strFile, strNodePath, 0);
    iVal += iIncrease;
    this.setXmlParamInt(strFile, strNodePath, iVal);
    return iVal;
  }
}
  