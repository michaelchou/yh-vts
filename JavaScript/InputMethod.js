/*
  输入法控制类
  汉王<OBJECT ID="PenConnector"  CLASSID="clsid:B094BC3B-70A1-4862-9592-F36C37C5FCC4" HEIGHT="600" WIDTH="400">
  YH<object id="HandWrite" classid=clsid:BB4FCD33-750A-405A-9FEE-55447EFBDB49>
</object>
*/
function InputMethod()
{
//输入法使用标记true使用汉王，False使用YH
  this.UseFlag = false;
  /*
  x 横坐标
  y 纵坐标
  type是mode
  */
  this.ShowYH = function(type,screen,x,y)
  {
	  try{top.YHAXHandWriter.Show(type,screen,x,y);}catch(e){}
  }
  
  /*
  参数类型为字符串，包括位置、尺寸、透明度和输入法模式，用分号分隔。
	字符串格式为 left,top;width,height;transparency;mode
	位置：分别为 x ,y,  用逗号分隔
	尺寸：分别为 w,h,  用逗号分隔
	透明度：transparency  0~ 255，0为完全透明，255为不透明.使用默认255
	模式：mode
  */
  this.ShowHW = function(x,y,w,h,mode)
  {  
	  var str =x+","+y+";"+w+","+h+";"+"255;"+mode;
	  try{top.penConnector.SendMessage(str.toString());}catch(e){}
  }
  
  this.CloseYH = function()
  {
	  try{top.YHAXHandWriter.Hide();}catch(e){}
  }
  
  this.ClsoeHW = function()
  {
	  try{top.penConnector.SendMessage("close");}catch(e){}
  }
    
 //数字等输入
 this.ShowDigit = function(x,y)
 {
	if (top.inputmethod.UseFlag)
	{
		top.inputmethod.ShowHW(x,y,"600","400","11");	
	}else{
		top.inputmethod.ShowYH(1,1,x,y);		
	}
 }
 
 //手写输入
 this.ShowWrite = function(x,y)
 {
	if (top.inputmethod.UseFlag)
	{
		top.inputmethod.ShowHW(x,y,"600","400","0");		
	}else{
		top.inputmethod.ShowYH(2,1,x,y); 		
	}
 }
 
 //全键盘中英文输入
 this.ShowFullEnglish = function(x,y)
 {	 
	 if (top.inputmethod.UseFlag)
	{
		top.inputmethod.ShowHW(x,y,"740","300","5");	
	}else{
		top.inputmethod.ShowYH(3,1,x,y);		
	}
 }
  //关闭输入法
 this.Close = function()
 {
	if (top.inputmethod.UseFlag)
	{
		top.inputmethod.ClsoeHW();		
	}else{
		top.inputmethod.CloseYH(); 		
	}
 }
}