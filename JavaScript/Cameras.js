/*
  ����ͷ������
 */
function Cameras()
{	
  // ����ͷ��ģ���¼���Ӧ����
  this.camerasEvents = new top.EventHandling(top.YHAXCameras);
  var hid = top.YHAXCommonCtrl.GetHWNDId("JColsShellApp");//��ȡ�����ڵľ��
  //------------------------- ����ͷִ�еķ��� -------------------------//   
	
  /*������ͷ*/
  this.display = function(cameraName,action)
  {
	top.journalPrinter.addJournalWithTime("��������ͷ Cameras command display" + "(" + cameraName + "," + action + ")");
    top.cameras.camerasEvents.clearAll();
    top.cameras.camerasEvents.appendEvent("PreviewComplete", top.cameras.onPreviewComplete);
    top.cameras.camerasEvents.appendEvent("PreviewWindowDestroy", top.cameras.onPreviewWindowDestroy);
    top.cameras.camerasEvents.appendEvent("PreviewWindowPause", top.cameras.onPreviewWindowPause);
	top.cameras.camerasEvents.appendEvent("PreviewWindowResume", top.cameras.onPreviewWindowResume);
    top.cameras.camerasEvents.appendEvent("DeviceError", top.cameras.onDeviceError);
	top.cameras.camerasEvents.appendEvent("FatalError", top.cameras.onDeviceError);
    top.cameras.camerasEvents.appendEvent("PreviewFaild", top.cameras.onPreviewFaild);
	//CameraName��ָ��ʹ�õ�����ͷ����ȡֵ���£�Person--��������ͷ Extra--����ǩ������ͷ ����ֵ--����ǩ������ͷ
	//Action��ָ��Ԥ������ Create--���� Pause--��ͣ Resume--�ָ� Destroy--����
    top.YHAXCameras.Display(cameraName,action,500,353,130,354,hid,"A4");
	
  }
  
  /*����*/
  this.takePictureEx = function(cameraName)//CameraName��ָ��ʹ�õ�����ͷ����ȡֵ���£�Person--��������ͷ ESig--����ǩ������ͷ ����ֵ--����ǩ������ͷ
  {
	top.journalPrinter.addJournalWithTime("���� Cameras command takePictureEx");
    top.cameras.camerasEvents.clearAll();
    top.cameras.camerasEvents.appendEvent("PictureTaked", top.cameras.onPictureTaked);
    top.cameras.camerasEvents.appendEvent("PicSaveUrlInvalid", top.cameras.onPicSaveUrlInvalid);
    top.cameras.camerasEvents.appendEvent("DeviceError", top.cameras.onDeviceError);
	top.cameras.camerasEvents.appendEvent("FatalError", top.cameras.onDeviceError);
    top.YHAXCameras.TakePictureEx(cameraName,"",top.COLS_CAMERAS_FILEPATH,"A4");
	
  } 
  
  /*������ɵ��¼���Ӧ*/
  this.onPictureTaked = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("������� Cameras Event onPictureTaked");
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
  
  /*��Ч·�����¼���Ӧ*/
  this.onPicSaveUrlInvalid = function()
  {
    // ��¼�ն���ˮ
	top.journalPrinter.addJournalWithTime("�������(��Ч·��) Cameras Event onPicSaveUrlInvalid");
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
 
  /*����ͷԤ���ɹ����¼���Ӧ*/
  this.onPreviewComplete = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("����ͷԤ���ɹ� Cameras Event onPreviewComplete");
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
 
  /*����ͷԤ���������ٵ��¼���Ӧ*/
  this.onPreviewWindowDestroy = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("����ͷԤ���������� Cameras Event onPreviewWindowDestroy");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowDestroy) == "function")
      top.MainFrame.onPreviewWindowDestroy();
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowDestroy) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowDestroy();
	}
  } 
  
  /*����ͷԤ��������ͣ���¼���Ӧ*/
  this.onPreviewWindowPause = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("����ͷԤ��������ͣ Cameras Event onPreviewWindowPause");
    top.cameras.camerasEvents.clearAll();
    if (typeof(top.MainFrame.onPreviewWindowPause) == "function")
      top.MainFrame.onPreviewWindowPause();
	else if (typeof(top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowPause) == "function")
	{
		top.MainFrame.window.frames["ifreamPhoto"].onPreviewWindowPause();
	}
  }
  
  /*����ͷԤ������ָ����¼���Ӧ*/
  this.onPreviewWindowResume = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("����ͷԤ������ָ� Cameras Event onPreviewWindowResume");
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
  
  /*����ͷӲ�����ϵ��¼���Ӧ*/
  this.onDeviceError = function()
  {
    top.journalPrinter.addJournalWithTime("����ͷӲ������ Cameras Event onDeviceError");
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

  /*����ͷԤ������ʧ�ܵ��¼���Ӧ*/
  this.onPreviewFaild = function()
  {
    top.journalPrinter.addJournalWithTime("����ͷԤ������ʧ�� Cameras Event onPreviewFaild");
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
