/*
  摄像头操作类
 */
function Cameras()
{	
  // 摄像头虚模块事件响应对象
  this.camerasEvents = new top.EventHandling(top.YHAXCameras);
  var hid = top.YHAXCommonCtrl.GetHWNDId("JColsShellApp");//获取主窗口的句柄
  //------------------------- 摄像头执行的方法 -------------------------//   
	
  /*打开摄像头*/
  this.display = function(cameraName,action)
  {
	top.journalPrinter.addJournalWithTime("创建摄像头 Cameras command display" + "(" + cameraName + "," + action + ")");
    top.cameras.camerasEvents.clearAll();
    top.cameras.camerasEvents.appendEvent("PreviewComplete", top.cameras.onPreviewComplete);
    top.cameras.camerasEvents.appendEvent("PreviewWindowDestroy", top.cameras.onPreviewWindowDestroy);
    top.cameras.camerasEvents.appendEvent("PreviewWindowPause", top.cameras.onPreviewWindowPause);
	top.cameras.camerasEvents.appendEvent("PreviewWindowResume", top.cameras.onPreviewWindowResume);
    top.cameras.camerasEvents.appendEvent("DeviceError", top.cameras.onDeviceError);
	top.cameras.camerasEvents.appendEvent("FatalError", top.cameras.onDeviceError);
    top.cameras.camerasEvents.appendEvent("PreviewFaild", top.cameras.onPreviewFaild);
	//CameraName：指定使用的摄像头名，取值如下：Person--人脸摄像头 Extra--电子签名摄像头 其他值--电子签名摄像头
	//Action：指定预览动作 Create--创建 Pause--暂停 Resume--恢复 Destroy--销毁
    top.YHAXCameras.Display(cameraName,action,500,353,130,354,hid,"A4");
	
  }
  
  /*拍照*/
  this.takePictureEx = function(cameraName)//CameraName：指定使用的摄像头名，取值如下：Person--人脸摄像头 ESig--电子签名摄像头 其他值--电子签名摄像头
  {
	top.journalPrinter.addJournalWithTime("拍照 Cameras command takePictureEx");
    top.cameras.camerasEvents.clearAll();
    top.cameras.camerasEvents.appendEvent("PictureTaked", top.cameras.onPictureTaked);
    top.cameras.camerasEvents.appendEvent("PicSaveUrlInvalid", top.cameras.onPicSaveUrlInvalid);
    top.cameras.camerasEvents.appendEvent("DeviceError", top.cameras.onDeviceError);
	top.cameras.camerasEvents.appendEvent("FatalError", top.cameras.onDeviceError);
    top.YHAXCameras.TakePictureEx(cameraName,"",top.COLS_CAMERAS_FILEPATH,"A4");
	
  } 
  
  /*拍照完成的事件响应*/
  this.onPictureTaked = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("拍照完成 Cameras Event onPictureTaked");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onPictureTaked) == "function")
	{
      top.MainFrame.onPictureTaked();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onPictureTaked) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onPictureTaked();
	}
  }
  
  /*无效路劲的事件响应*/
  this.onPicSaveUrlInvalid = function()
  {
    // 记录终端流水
	top.journalPrinter.addJournalWithTime("拍照完成(无效路劲) Cameras Event onPicSaveUrlInvalid");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onPicSaveUrlInvalid) == "function")
	{
      top.MainFrame.onPicSaveUrlInvalid();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onPicSaveUrlInvalid) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onPicSaveUrlInvalid();
	}
  }
 
  /*摄像头预览成功的事件响应*/
  this.onPreviewComplete = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("摄像头预览成功 Cameras Event onPreviewComplete");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewComplete) == "function")
	{
        top.MainFrame.onPreviewComplete();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onPreviewComplete) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onPreviewComplete();
	}
  } 
 
  /*摄像头预览窗体销毁的事件响应*/
  this.onPreviewWindowDestroy = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("摄像头预览窗体销毁 Cameras Event onPreviewWindowDestroy");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowDestroy) == "function")
      top.MainFrame.onPreviewWindowDestroy();
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowDestroy) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowDestroy();
	}
  } 
  
  /*摄像头预览窗体暂停的事件响应*/
  this.onPreviewWindowPause = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("摄像头预览窗体暂停 Cameras Event onPreviewWindowPause");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowPause) == "function")
      top.MainFrame.onPreviewWindowPause();
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowPause) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowPause();
	}
  }
  
  /*摄像头预览窗体恢复的事件响应*/
  this.onPreviewWindowResume = function()
  {
    // 记录终端流水
    top.journalPrinter.addJournalWithTime("摄像头预览窗体恢复 Cameras Event onPreviewWindowResume");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowResume) == "function")
	{
      top.MainFrame.onPreviewWindowResume();
	}
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowResume) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowResume();
	}
  }
  
  /*摄像头硬件故障的事件响应*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("摄像头硬件故障 Cameras Event onDeviceError");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_cameras) == "function")
    {
      top.MainFrame.onDeviceError_cameras();
    }
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onDeviceError_cameras) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onDeviceError_cameras();
	}
  };

  /*摄像头预览窗体失败的事件响应*/
  this.onPreviewFaild = function()
  {
    top.journalPrinter.addJournalWithTime("摄像头预览窗体失败 Cameras Event onPreviewFaild");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewFaild) == "function")
    {
      top.MainFrame.onPreviewFaild();
    }
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onPreviewFaild) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onPreviewFaild();
	}
  };
}
