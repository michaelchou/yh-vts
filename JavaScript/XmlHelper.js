
/*
  ����XMLDOM����
  ���أ�
    XMLDOM����ʧ��ʱ����null
*/
function createXMLDOM()
{
	var arrSignatures = new Array
	(
		"MSXML2.DOMDocument.5.0", 
		"MSXML2.DOMDocument.4.0", 
		"MSXML2.DOMDocument.3.0", 
		"MSXML2.DOMDocument", 
		"Microsoft.XmlDom"
	);
  for (var i=0; i < arrSignatures.length; i++)
  {
    try
    {
			return new ActiveXObject(arrSignatures[i]);
    }
    catch (oError)
    {
      // ignore
    }
  }
  return null;
  // throw new Error("XMLDom object could be created.");
}

var XMLDOMEMPTY = createXMLDOM();

/*
  ����XMLHTTP����
  ���أ�
    XMLHTTP����ʧ��ʱ����null
*/
function createXMLHttp()
{
   if (typeof (ActiveXObject) != "undefined") 
  {
		var IEXMLHttpVersion = new Array
		(
			"MSXML2.XMLHttp.4.0",
			"MSXML2.XMLHttp.3.0",
			"MSXML2.XMLHttp",
			"Microsoft.XMLHttp"
		);
    for(var i= 0 ;i < IEXMLHttpVersion.length; i++)
    {
      try
      {
        //alert(IEXMLHttpVersion.length+" |"+i+"| "+IEXMLHttpVersion[i]);
        var oXmlHttp = new ActiveXObject(IEXMLHttpVersion[i]);
        return oXmlHttp;
      }
      catch(e)
      {
        // Do nothing
        //alert("nothing");
      }
    }
  }
  else if (typeof (XMLHttpRequest) != "undefined") 
  {
    var oXmlHttp = new XMLHttpRequest();
    return oXmlHttp;
  }
  return null;
  // throw new Error("XMLHttp object could be created.");
}

/*
  ����xml�ļ�
*/
function SaveXML(content)
{
	try
    {
	   var fso = new ActiveXObject("scripting.FileSystemObject");
       var path = "C:\\Cols\\Flow\\";
       if (!fso.FolderExists(path)){   // ����ǰ·�������ڣ��򴴽���·����
          fso.CreateFolder(path);
       }
       path +=  "flow.xml";   // �����ĵ���·����
       var tf = fso.CreateTextFile(path, true);   // �������ļ���
       tf.WriteLine(content);
       tf.Close();
	   return true;
	}
	catch(e)
    {
	   return false;
	}
}

 /*
  *���ַ���ת��dom����
 */
function str2Dom(str){ 
    if(document.all){ 
����    var xmlDom=new ActiveXObject("Microsoft.XMLDOM");
����    xmlDom.loadXML(str); 
����    return xmlDom; 
����} 
    else{
����  return new DOMParser().parseFromString(str, "text/xml"); 
    }
��}

function dom2Str(xmlData) { 
    var xmlString;
    //IE
    if (window.ActiveXObject){
       xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
       xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
} 



