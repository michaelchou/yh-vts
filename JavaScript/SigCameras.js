/*
  ��������ǩ��������
 */
function SigCameras()
{	
  // ��������ǩ����ģ���¼���Ӧ����
  this.sigCamerasEvents = new top.EventHandling(top.YHAXSigCameras);
  var hid = top.YHAXCommonCtrl.GetHWNDId("JColsShellApp");//��ȡ�����ڵľ��
  //------------------------- ��������ǩ��ִ�еķ��� -------------------------//   
	
  /*�򿪵�������ǩ��*/
  this.display = function(cameraName,action)
  {
	top.journalPrinter.addJournalWithTime("�򿪵�������ǩ�� SigCameras command display" + "(" + cameraName + "," + action + ")");
    top.sigCameras.sigCamerasEvents.clearAll();
    top.sigCameras.sigCamerasEvents.appendEvent("PreviewComplete", top.sigCameras.onPreviewComplete);
    top.sigCameras.sigCamerasEvents.appendEvent("PreviewWindowDestroy", top.sigCameras.onPreviewWindowDestroy);
    top.sigCameras.sigCamerasEvents.appendEvent("PreviewWindowPause", top.sigCameras.onPreviewWindowPause);
	top.sigCameras.sigCamerasEvents.appendEvent("PreviewWindowResume", top.sigCameras.onPreviewWindowResume);
    top.sigCameras.sigCamerasEvents.appendEvent("DeviceError", top.sigCameras.onDeviceError);
	top.sigCameras.sigCamerasEvents.appendEvent("FatalError", top.sigCameras.onDeviceError);
    top.sigCameras.sigCamerasEvents.appendEvent("PreviewFaild", top.sigCameras.onPreviewFaild);
	top.sigCameras.sigCamerasEvents.appendEvent("SignError", top.sigCameras.onSignError);
	//CameraName��ָ��ʹ�õĵ�������ǩ������ȡֵ���£�Person--������������ǩ�� Extra--����ǩ����������ǩ�� ����ֵ--����ǩ����������ǩ��
	//Action��ָ��Ԥ������ Create--���� Pause--��ͣ Resume--�ָ� Destroy--����
    top.YHAXSigCameras.Display(cameraName,action,800,350,285,550,hid,"A4");
	
  }
 
  /*��������ǩ��Ԥ���ɹ����¼���Ӧ*/
  this.onPreviewComplete = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��������ǩ��Ԥ���ɹ� SigCameras Event onPreviewComplete");
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
 
  /*��������ǩ��Ԥ���������ٵ��¼���Ӧ*/
  this.onPreviewWindowDestroy = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("��������ǩ��Ԥ���������� SigCameras Event onPreviewWindowDestroy");
    top.sigCameras.sigCamerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowDestroy) == "function")
      top.MainFrame.onPreviewWindowDestroy();
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onPreviewWindowDestroy) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onPreviewWindowDestroy();
	}
  } 
  
    /*��������ǩ��δ��ʵ��¼���Ӧ*/
  this.onSignError = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��������ǩ��δ��� SigCameras Event onSignError");
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
  
  /*��������ǩ��Ԥ��������ͣ���¼���Ӧ*/
  this.onPreviewWindowPause = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��������ǩ��Ԥ��������ͣ SigCameras Event onPreviewWindowPause");
    top.sigCameras.sigCamerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowPause) == "function")
      top.MainFrame.onPreviewWindowPause();
	else if (typeof(top.MainFrame.window.frames["ifreamSign"].onPreviewWindowPause) == "function")
	{
		top.MainFrame.window.frames["ifreamSign"].onPreviewWindowPause();
	}
  }
  
  /*��������ǩ��Ԥ������ָ����¼���Ӧ*/
  this.onPreviewWindowResume = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��������ǩ��Ԥ������ָ� SigCameras Event onPreviewWindowResume");
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
  
  /*��������ǩ��Ӳ�����ϵ��¼���Ӧ*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("��������ǩ��Ӳ������ SigCameras Event onDeviceErroronDeviceError");
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

  /*��������ǩ��Ԥ������ʧ�ܵ��¼���Ӧ*/
  this.onPreviewFaild = function()
  {
    top.journalPrinter.addJournalWithTime("��������ǩ��Ԥ������ʧ�� SigCameras Event onPreviewFaild");
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
