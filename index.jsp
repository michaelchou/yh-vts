<%@ page contentType="text/html;charset=GBK"%>
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312"/>
<title></title>
 <SCRIPT language="JavaScript"> 
 var mac = "";
 function MacInfo(){
       var locator =new ActiveXObject ("WbemScripting.SWbemLocator");
       var service = locator.ConnectServer(".");
       var properties = service.ExecQuery("Select * from Win32_NetworkAdapterConfiguration Where IPEnabled =True");
	   var i = 0;
       var e =new Enumerator (properties);
       {
		   
             var p = e.item();
            mac = p.MACAddress;
			mac = mac.replace(/:/g,'-');
           
       }
 }
 MacInfo();
 top.location="start.jsp?strClientMAC=" + mac ; 
 </SCRIPT>
<body>
 
</body>
</html>