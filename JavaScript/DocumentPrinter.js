/*存单打印类*/
function DocumentPrinter()
{
	   var printFlag_mx =false;
	   /*存单打印机虚模块事件响应对象*/
	   this.cdEvents = new top.EventHandling(top.YHAXDocumentPrinter);
	   /*打印内容*/
	   this.strContain="";
	   /*临时文件*/
	   this.strFile = "C:\\Cols\\Journal\\DocumentPrinter.txt";
	   var fileObj = new ActiveXObject("Scripting.FileSystemObject");   
	       
	   /*设置结果集打印*/
	   this.set=function(str){
		   if(printFlag_mx)
		    {	
		       this.strContain = "";
		    }
	   		this.strContain+=str;
	   }

	   
	  /*打印存单并退给客户*/
	  this.print = function()
	  {
	    if (top.YHAXDocumentPrinter.StDeviceStatus != "HEALTHY")
	    {
	      if (typeof(top.MainFrame.onDeviceError_cd_Print) == "function"){
	        top.MainFrame.onDeviceError_cd_Print();
	        return;
		  }
	    }
	    /*判断临时文件是否存在*/
	    try{
	    	exFil=fileObj.GetFile(this.strFile);
	    	exFil.Delete();
	    }catch(e){}
	    /*判断临时文件是否存在*/
	    if(printFlag_mx)
	    {
		    fil   =   fileObj.createtextfile(this.strFile,true);
		  	fil.Write(this.strContain);
		  	fil.Close();
	    }else /*如果未创建临时文件，则先创建该临时文件*/
	    {
		    this.strContain+= "";
		     //创建打印的临时文件
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
	 
	  /*打印存单时硬件故障的事件回调函数*/
	  this.onDeviceError_PrintFile = function()
	  {
			top.journalPrinter.addJournalWithTime("存单发放打印 存单打印失败 CheckPrint Event DeviceError_PrintFile");   
	    top.documentprinter.cdEvents.clearAll();
	    if (typeof(top.MainFrame.onDeviceError_cd_Print) == "function")
	      top.MainFrame.onDeviceError_cd_Print();
	    else{}
	  }

	  /*打印存单完成的事件回调函数*/
	  this.onPrintComplete = function()
	  {
		// 记录终端流水
    top.journalPrinter.addJournalWithTime("存单发放打印 存单打印成功 CheckPrint Event PrintComplete");    
		top.documentprinter.cdEvents.clearAll();
        if (typeof(top.MainFrame.onPrintComplete_cd) == "function"){
	      top.MainFrame.onPrintComplete_cd();
		}
	  }
	  
	   /*存单机控制*/
  this.controlMedia = function(MediaAction)
  {
	top.documentprinter.cdEvents.clearAll();
	top.documentprinter.cdEvents.appendEvent("ControlComplete", top.documentprinter.onControlComplete);
	top.documentprinter.cdEvents.appendEvent("MediaTaken", top.documentprinter.onMediaTaken_Media);
	top.documentprinter.cdEvents.appendEvent("DeviceError", top.documentprinter.onDeviceError);
	top.documentprinter.cdEvents.appendEvent("FatalError", top.documentprinter.onDeviceError);
    top.YHAXDocumentPrinter.ControlMedia(MediaAction,top.iUserTimeout*1000);
	// 控制指示灯
    try{top.guidelights.setChequeUnitLight("MEDIUM");}catch(e){}
    top.journalPrinter.addJournalWithTime("存单发放打印 控制 CheckPrint Event ControlMedia"+MediaAction); 
  } 
	   /*存单机存单已经被客户取走的事件响应*/
  this.onMediaTaken_Media = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("存单发放打印 发放存单取走 CheckPrint Event MediaTaken_Media"); 
	 // 控制指示灯
     try{top.guidelights.setCashOutLight("OFF");}catch(e){}	
    top.documentprinter.cdEvents.clearAll();
    if (typeof(top.MainFrame.onMediaTaken_Media) == "function")
      top.MainFrame.onMediaTaken_Media();
    else if (typeof(top.onMediaTaken_Media) == "function")
      top.onMediaTaken_Media();
  }  
	/*存单机存单ControlMedia完成的事件响应*/
  this.onControlComplete = function()
  {
    if (typeof(top.MainFrame.onControlComplete) == "function")
      top.MainFrame.onControlComplete();
  } 
 /*存单机硬件故障的事件响应*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("存单发放打印 存单机故障 CheckPrint Event DeviceError");
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
