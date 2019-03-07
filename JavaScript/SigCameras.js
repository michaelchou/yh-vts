/*
  电子密码签名操作类
 */
function SigCameras()
{	
  // 电子密码签名虚模块事件响应对象
  this.sigCamerasEvents = new top.EventHandling(top.YHAXSigCameras);
  var hid = top.YHAXCommonCtrl.GetHWNDId("JColsShellApp");//获取主窗口的句柄
  //------------------------- 电子密码签名执行的方法 -------------------------//   
	
  /*打开电子密码签名*/
  this.display = function(cameraName,action)
  {
	top.journalPrinter.addJournalWithTime("打开电子密码签名 SigCameras command display" + "(" + cameraName + "," + action + ")");
    top.sigCameras.sigCamerasEvents.clearAll();
    top.sigCameras.sigCamerasEvents.appendEvent("PreviewComplete", top.sigCameras.onPreviewComplete);
    top.sigCameras.sigCamerasEvents.appendEvent("PreviewWindowDestroy", top.sigCameras.onPreviewWindowDestroy);
    top.sigCameras.sigCamerasEvents.appendEvent("PreviewWindowPause", top.sigCameras.onPreviewWindowPause);
	top.sigCameras.sigCamerasEvents.appendEvent("PreviewWindowResume", top.sigCameras.onPreviewWindowResume);
    top.sigCameras.sigCamerasEvents.appendEvent("DeviceError", top.sigCameras.onDeviceError);
	top.sigCameras.sigCamerasEvents.appendEvent("FatalError", top.sigCameras.onDeviceError);
    top.sigCameras.sigCamerasEvents.appendEvent("PreviewFaild", top.sigCameras.onPreviewFaild);
	top.sigCameras.sigCamerasEvents.appendEvent("SignError", top.sigCameras.onSignError);
	//CameraName：指定使用的电子密码签名名，取值如下：Person--人脸电子密码签名 Extra--电子签名电子密码签名 其他值--电子签名电子密码签名
	//Action：指定预览动作 Create--创建 Pause--暂停 Resume--恢复 Destroy--销毁
    top.YHAXSigCameras.Display(cameraName,action,800,350,285,550,hid,"A4");
	
  }
 
  /*电子密码签名预览成功的事件响应*/
  this.onPreviewComplete = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("电子密码签名预览成功 SigCameras Event onPreviewComplete");
    top.sigCameras.sigCamerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewComplete) == "function")
	{
        top.MainFrame.onPreviewComplete();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onPreviewComplete) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onPreviewComplete();
	}
  } 
 
  /*电子密码签名预览窗体销毁的事件响应*/
  this.onPreviewWindowDestroy = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("电子密码签名预览窗体销毁 SigCameras Event onPreviewWindowDestroy");
    top.sigCameras.sigCamerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowDestroy) == "function")
      top.MainFrame.onPreviewWindowDestroy();
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onPreviewWindowDestroy) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onPreviewWindowDestroy();
	}
  } 
  
    /*电子密码签名未落笔的事件响应*/
  this.onSignError = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("电子密码签名未落笔 SigCameras Event onSignError");
    top.sigCameras.sigCamerasEvents.clearAll();
    if (typeof(top.MainFrame.onSignError) == "function")
	{
        top.MainFrame.onSignError();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onSignError) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onSignError();
	}
  } 
  
  /*电子密码签名预览窗体暂停的事件响应*/
  this.onPreviewWindowPause = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("电子密码签名预览窗体暂停 SigCameras Event onPreviewWindowPause");
    top.sigCameras.sigCamerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowPause) == "function")
      top.MainFrame.onPreviewWindowPause();
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onPreviewWindowPause) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onPreviewWindowPause();
	}
  }
  
  /*电子密码签名预览窗体恢复的事件响应*/
  this.onPreviewWindowResume = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("电子密码签名预览窗体恢复 SigCameras Event onPreviewWindowResume");
    top.sigCameras.sigCamerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowResume) == "function")
	{
      top.MainFrame.onPreviewWindowResume();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onPreviewWindowResume) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onPreviewWindowResume();
	}
  }
  
  /*电子密码签名硬件故障的事件响应*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("电子密码签名硬件故障 SigCameras Event onDeviceErroronDeviceError");
    top.sigCameras.sigCamerasEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cameras) == "function")
    {
      top.MainFrame.onDeviceError_cameras();
    }
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onDeviceError_cameras) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onDeviceError_cameras();
	}
  };

  /*电子密码签名预览窗体失败的事件响应*/
  this.onPreviewFaild = function()
  {
    top.journalPrinter.addJournalWithTime("电子密码签名预览窗体失败 SigCameras Event onPreviewFaild");
    top.sigCameras.sigCamerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewFaild) == "function")
    {
      top.MainFrame.onPreviewFaild();
    }
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onPreviewFaild) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onPreviewFaild();
	}
  };
}
