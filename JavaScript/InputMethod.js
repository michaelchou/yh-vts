/*
  ���뷨������
  ����<OBJECT ID="PenConnector"  CLASSID="clsid:B094BC3B-70A1-4862-9592-F36C37C5FCC4" HEIGHT="600" WIDTH="400">
  YH<object id="HandWrite" classid=clsid:BB4FCD33-750A-405A-9FEE-55447EFBDB49>
</object>
*/
function InputMethod()
{
//���뷨ʹ�ñ��trueʹ�ú�����Falseʹ��YH
  this.UseFlag = false;
  /*
  x ������
  y ������
  type��mode
  */
  this.ShowYH = function(type,screen,x,y)
  {
	  try{top.YHAXHandWriter.Show(type,screen,x,y);}catch(e){}
  }
  
  /*
  ��������Ϊ�ַ���������λ�á��ߴ硢͸���Ⱥ����뷨ģʽ���÷ֺŷָ���
	�ַ�����ʽΪ left,top;width,height;transparency;mode
	λ�ã��ֱ�Ϊ x ,y,  �ö��ŷָ�
	�ߴ磺�ֱ�Ϊ w,h,  �ö��ŷָ�
	͸���ȣ�transparency  0~ 255��0Ϊ��ȫ͸����255Ϊ��͸��.ʹ��Ĭ��255
	ģʽ��mode
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
    
 //���ֵ�����
 this.ShowDigit = function(x,y)
 {
	if (top.inputmethod.UseFlag)
	{
		top.inputmethod.ShowHW(x,y,"600","400","11");	
	}else{
		top.inputmethod.ShowYH(1,1,x,y);		
	}
 }
 
 //��д����
 this.ShowWrite = function(x,y)
 {
	if (top.inputmethod.UseFlag)
	{
		top.inputmethod.ShowHW(x,y,"600","400","0");		
	}else{
		top.inputmethod.ShowYH(2,1,x,y); 		
	}
 }
 
 //ȫ������Ӣ������
 this.ShowFullEnglish = function(x,y)
 {	 
	 if (top.inputmethod.UseFlag)
	{
		top.inputmethod.ShowHW(x,y,"740","300","5");	
	}else{
		top.inputmethod.ShowYH(3,1,x,y);		
	}
 }
  //�ر����뷨
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