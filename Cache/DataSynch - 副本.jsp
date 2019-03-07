<%@ page contentType="text/xml; charset=UTF-8" %>
<%@ page language="java" import="java.io.*,javax.servlet.ServletInputStream,java.util.*"%>
<%@ page import="net.sf.json.*" %>
<%@ page import="java.util.Iterator" %>
<%
   response.setBufferSize(1024*32);
   OutputStream os = response.getOutputStream();
   //接受管控台发送的数据
   BufferedReader br = new BufferedReader(new InputStreamReader((ServletInputStream)request.getInputStream(), "UTF-8"));
   String line = null;
   StringBuilder sb = new StringBuilder();
   while((line = br.readLine())!=null){
      sb.append(line);
   }
   JSONObject jsonObj = JSONObject.fromObject(sb.toString());         
   Iterator it = jsonObj.keys();  
   List<String> keyListstr = new ArrayList<String>();  
   while(it.hasNext()){  
         String key = (String)it.next();
		 String value = jsonObj.getString(key);
		 System.out.println("key:"+key);
		 if(key.equals("changes") || key.equals("removes")){//增加、修改、删除的数据
			 System.out.println("增加或修改的数据:"+value);
			 JSONArray jsonArray = jsonObj.getJSONArray(key);
			 for (int i = 0; i < jsonArray.size(); i++) {
				 JSONObject dataObject = jsonArray.getJSONObject(i);
				 System.out.println("id:"+dataObject.getInt("id"));
				 System.out.println("orgNum:"+dataObject.getString("orgNum"));
				 //Iterator iterator = dataObject.keys();
				 //while (iterator.hasNext()){
                 //  String json_key = (String)iterator.next();
				 //	 System.out.println("json_key:"+json_key);
				 //	 String json_value = dataObject.getString(json_key);
				 //	 System.out.println("json_value:"+json_value);
				 //}
			 }
		 }else{//表名
			 System.out.println("表名:"+value);
		 }
   }
   String msg = "{'success':true,'errors':''}";
   os.write(msg.getBytes("UTF-8"));
%>
