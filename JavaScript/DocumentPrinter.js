/*�浥��ӡ��*/
function DocumentPrinter()
{
	   var printFlag_mx =false;
	   /*�浥��ӡ����ģ���¼���Ӧ����*/
	   this.cdEvents = new top.EventHandling(top.YHAXDocumentPrinter);
	   /*��ӡ����*/
	   this.strContain="";
	   /*��ʱ�ļ�*/
	   this.strFile = "C:\\Cols\\Journal\\DocumentPrinter.txt";
	   var fileObj = new ActiveXObject("Scripting.FileSystemObject");   
	       
	   /*���ý������ӡ*/
	   this.set=function(str){
		   if(printFlag_mx)
		    {	
		       this.strContain = "";
		    }
	   		this.strContain+=str;
	   }

	   
	  /*��ӡ�浥���˸��ͻ�*/
	  this.print = function()
	  {
	    if (top.YHAXDocumentPrinter.StDeviceStatus != "HEALTHY")
	    {
	      if (typeof(top.MainFrame.onDeviceError_cd_Print) == "function"){
	        top.MainFrame.onDeviceError_cd_Print();
	        return;
		  }
	    }
	    /*�ж���ʱ�ļ��Ƿ����*/
	    try{
	    	exFil=fileObj.GetFile(this.strFile);
	    	exFil.Delete();
	    }catch(e){}
	    /*�ж���ʱ�ļ��Ƿ����*/
	    if(printFlag_mx)
	    {
		    fil   =   fileObj.createtextfile(this.strFile,true);
		  	fil.Write(this.strContain);
		  	fil.Close();
	    }else /*���δ������ʱ�ļ������ȴ�������ʱ�ļ�*/
	    {
		    this.strContain+= "";
		     //������ӡ����ʱ�ļ�
		    fil   =   fileObj.createtextfile(this.strFile,true);
		  	fil.Write(this.strContain);
		  	fil.Close();
		}
		this.strContain="";
	    top.documentprinter.cdEvents.clearAll();
	    top.documentprinter.cdEvents.appendEvent("PrintComplete", top.documentprinter.onPrintComplete);
		top.documentprinter.cdEvents.appendEvent("Timeout", top.documentprinter.onDeviceError_PrintFile);
        top.documentprinter.cdEvents.appendEvent("DeviceError", top.documentprinter.onDeviceError_PrintFile);
		top.documentprinter.cdEvents.appendEvent("FatalError", top.documentprinter.onDeviceError_PrintFile);
	    top.YHAXDocumentPrinter.PrintFile(this.strFile, -1, false);
	    printFlag_mx =false;
	  }
	 
	  /*��ӡ�浥ʱӲ�����ϵ��¼��ص�����*/
	  this.onDeviceError_PrintFile = function()
	  {
			top.journalPrinter.addJournalWithTime("�浥���Ŵ�ӡ �浥��ӡʧ�� CheckPrint Event DeviceError_PrintFile");   
	    top.documentprinter.cdEvents.clearAll();
	    if (typeof(top.MainFrame.onDeviceError_cd_Print) == "function")
	      top.MainFrame.onDeviceError_cd_Print();
	    else{}
	  }

	  /*��ӡ�浥��ɵ��¼��ص�����*/
	  this.onPrintComplete = function()
	  {
		// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥���Ŵ�ӡ �浥��ӡ�ɹ� CheckPrint Event PrintComplete");    
		top.documentprinter.cdEvents.clearAll();
        if (typeof(top.MainFrame.onPrintComplete_cd) == "function"){
	      top.MainFrame.onPrintComplete_cd();
		}
	  }
	  
	   /*�浥������*/
  this.controlMedia = function(MediaAction)
  {
	top.documentprinter.cdEvents.clearAll();
	top.documentprinter.cdEvents.appendEvent("ControlComplete", top.documentprinter.onControlComplete);
	top.documentprinter.cdEvents.appendEvent("MediaTaken", top.documentprinter.onMediaTaken_Media);
	top.documentprinter.cdEvents.appendEvent("DeviceError", top.documentprinter.onDeviceError);
	top.documentprinter.cdEvents.appendEvent("FatalError", top.documentprinter.onDeviceError);
    top.YHAXDocumentPrinter.ControlMedia(MediaAction,top.iUserTimeout*1000);
	// ����ָʾ��
    try{top.guidelights.setChequeUnitLight("MEDIUM");}catch(e){}
    top.journalPrinter.addJournalWithTime("�浥���Ŵ�ӡ ���� CheckPrint Event ControlMedia"+MediaAction); 
  } 
	   /*�浥���浥�Ѿ����ͻ�ȡ�ߵ��¼���Ӧ*/
  this.onMediaTaken_Media = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�浥���Ŵ�ӡ ���Ŵ浥ȡ�� CheckPrint Event MediaTaken_Media"); 
	 // ����ָʾ��
     try{top.guidelights.setCashOutLight("OFF");}catch(e){}	
    top.documentprinter.cdEvents.clearAll();
    if (typeof(top.MainFrame.onMediaTaken_Media) == "function")
      top.MainFrame.onMediaTaken_Media();
    else if (typeof(top.onMediaTaken_Media) == "function")
      top.onMediaTaken_Media();
  }  
	/*�浥���浥ControlMedia��ɵ��¼���Ӧ*/
  this.onControlComplete = function()
  {
    if (typeof(top.MainFrame.onControlComplete) == "function")
      top.MainFrame.onControlComplete();
  } 
 /*�浥��Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("�浥���Ŵ�ӡ �浥������ CheckPrint Event DeviceError");
    top.documentprinter.cdEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cd) == "function")
    {
      top.MainFrame.onDeviceError_cd();
    }else if (typeof(top.onDeviceError_cd) == "function")
    {
      top.onDeviceError_cd();
    }else{}
  };  
}
