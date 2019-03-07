/*
  ��ά��ɨ����
 */
function BarcodeReader()
{ 
  // ��ά����ģ���¼���Ӧ����
  this.BarcodeEvents = new top.EventHandling(top.YHAXBarcodeReader);
  
  /*�����û����������룬������ɨ��֮���ȡ����������*/
  this.readBarcode = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�����û����������� BarcodeReader Commond readBarcode");
    top.barcodeReader.BarcodeEvents.clearAll();
    top.barcodeReader.BarcodeEvents.appendEvent("ReadBarcodeComplete", top.barcodeReader.onBarcodeReadComplete);
    top.barcodeReader.BarcodeEvents.appendEvent("ReadCancelled", top.barcodeReader.onReadCancelled);
    top.barcodeReader.BarcodeEvents.appendEvent("MediaInserted", top.barcodeReader.onMediaInserted);
	top.barcodeReader.BarcodeEvents.appendEvent("MediaRemoved", top.barcodeReader.onMediaRemoved);
    top.barcodeReader.BarcodeEvents.appendEvent("Timeout", top.barcodeReader.onTimeout);
    top.barcodeReader.BarcodeEvents.appendEvent("DeviceError", top.barcodeReader.onDeviceError);
	top.barcodeReader.BarcodeEvents.appendEvent("FatalError", top.barcodeReader.onDeviceError);
    top.YHAXBarcodeReader.ReadBarcode("", 120*1000);
  }

  /*���������ص�����*/
  this.onMediaInserted = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�������ѷ��� BarcodeReader Event onMediaInserted");
    if (typeof(top.MainFrame.onMediaInserted) == "function")
      top.MainFrame.onMediaInserted();
  }
  
  /*��ȡ��������Ϣ��ɻص�����*/
  this.onBarcodeReadComplete = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��ȡ��������Ϣ��� BarcodeReader Event onBarcodeReadComplete");
	top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onBarcodeReadComplete) == "function"){   
      top.MainFrame.onBarcodeReadComplete();
    }
  }

  /*���������߻ص�����*/
  this.onMediaRemoved = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�����뱻ȡ�� BarcodeReader Event onMediaRemoved");
    top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onMediaRemoved) == "function")
      top.MainFrame.onMediaRemoved();
  }

  /*������֤��ʱ*/
  this.onTimeout = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("�������ȡ��ʱ BarcodeReader Event onTimeout");
  	top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onTimeout) == "function")
      top.MainFrame.onTimeout();
  }

  /*Ӳ�����ϻص�����*/
  this.onDeviceError = function()
  {
    // ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("��������������� BarcodeReader Event onDeviceError");
    top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onDeviceError_Barcode) == "function")
      top.MainFrame.onDeviceError_Barcode();
    else if (typeof(top.onDeviceError_Barcode) == "function")
      top.onDeviceError_Barcode();
  }

  /*ȡ���������������֤*/
  this.cancelRead = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ȡ��������������� BarcodeReader Commond cancelRead");
    top.barcodeReader.BarcodeEvents.appendEvent("ReadCancelled", top.barcodeReader.onReadCancelled);
	top.barcodeReader.BarcodeEvents.appendEvent("DeviceError", top.barcodeReader.onDeviceError);
	top.barcodeReader.BarcodeEvents.appendEvent("FatalError", top.barcodeReader.onDeviceError);
    top.YHAXBarcodeReader.CancelRead();
  }

  /*ȡ���������������ص�����*/
  this.onReadCancelled = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("ȡ��������������� BarcodeReader Event onReadCancelled");
    top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onReadCancelled) == "function")
      top.MainFrame.onReadCancelled();
  } 

  /*ģ�鸴λ��*/
  this.reset = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("������ģ�鸴λ BarcodeReader Commond reset");
    top.barcodeReader.BarcodeEvents.clearAll();
    top.barcodeReader.BarcodeEvents.appendEvent("ResetComplete", top.barcodeReader.onResetComplete);
	top.barcodeReader.BarcodeEvents.appendEvent("DeviceError", top.barcodeReader.onDeviceError);
	top.barcodeReader.BarcodeEvents.appendEvent("FatalError", top.barcodeReader.onDeviceError);
    top.YHAXBarcodeReader.Reset();
  }

  /*��λ��ɻص�����*/
  this.onResetComplete = function()
  {
	// ��¼�ն���ˮ
    top.journalPrinter.addJournalWithTime("������ģ�鸴λ��� BarcodeReader Event onResetComplete");
    top.barcodeReader.BarcodeEvents.clearAll();
    if (typeof(top.MainFrame.onResetComplete) == "function")
      top.MainFrame.onResetComplete();
  }
}
