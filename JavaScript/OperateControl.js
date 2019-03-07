/*
  �û����������
  �����û�������������Ȳ���
 */
function OperateControl(doc)
{
  this.doc = doc;

  /*
    �������룬�������������
    �ĵ������ṩ�ص�����:
      �μ� this.enableKey
   */
  this.enableInput = function()
  {
    this.enableMouse();
    this.enableKey();
  }

  /*
    ��ֹ���룬�������������
    ������
        bResetInputRespFunc �Ƿ�������Ӧ����ȫ����λ
   */
  this.disableInput = function(bResetInputRespFunc)
  {
    if (bResetInputRespFunc)
      this.resetInputRespFunc();
    this.disableMouse();
    this.disableKey();
  }

  /*
    �����������
   */
  this.enableMouse = function()
  {
    // onclick�����ɾ���������ĵ���������
    this.doc.onclick = top.FUNC_NA;
    // ˫�����Ǳ�����
    this.doc.ondblclick = function (){this.parentWindow.event.returnValue = false;}
  }

  /*
    ��ֹ�������
   */
  this.disableMouse = function()
  {
    this.doc.onclick = function (){this.parentWindow.event.returnValue = false;}
    this.doc.ondblclick = function (){this.parentWindow.event.returnValue = false;}
  }

  /*
    ����������
    �ĵ������ṩ�ص�����:
      onKey_F1();
      onKey_F2();
      onKey_F3();
      onKey_F4();
      onKey_F5();
      onKey_F6();
      onKey_F7();
      onKey_F8();
      onKey_Enter();
      onKey_Cancel();
      onKey_0();
      onKey_1();
      onKey_2();
      onKey_3();
      onKey_4();
      onKey_5();
      onKey_6();
      onKey_7();
      onKey_8();
      onKey_9();
   */
  this.enableKey = function()
  {
    this.doc.onkeydown = function()
    {
      switch(this.parentWindow.event.keyCode)
      {
        case Key_F1:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_F1();
          break;
        case Key_F2:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_F2();
          break;
        case Key_F3:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_F3();
          break;
        case Key_F4:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_F4();
          break;
        case Key_F5:
        case Key_F9:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_F5();
          break;
        case Key_F6:
        case Key_F10:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_F6();
          break;
        case Key_F7:
        case Key_F11:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_F7();
          break;
        case Key_F8:
        case Key_F12:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_F8();
          break;
        case Key_Enter:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_Enter();
          break;
        case Key_Cancel:
        case Key_Esc:
          this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          this.parentWindow.onKey_Cancel();
          break;
        case Key_0:
        case Key_NUM0:
          this.parentWindow.onKey_0();
          break;
        case Key_1:
        case Key_NUM1:
          this.parentWindow.onKey_1();
          break;
        case Key_2:
        case Key_NUM2:
          this.parentWindow.onKey_2();
          break;
        case Key_3:
        case Key_NUM3:
          this.parentWindow.onKey_3();
          break;
        case Key_4:
        case Key_NUM4:
          this.parentWindow.onKey_4();
          break;
        case Key_5:
        case Key_NUM5:
          this.parentWindow.onKey_5();
          break;
        case Key_6:
        case Key_NUM6:
          this.parentWindow.onKey_6();
          break;
        case Key_7:
        case Key_NUM7:
          this.parentWindow.onKey_7();
          break;
        case Key_8:
        case Key_NUM8:
          this.parentWindow.onKey_8();
          break;
        case Key_9:
        case Key_NUM9:
          this.parentWindow.onKey_9();
          break;
        case Key_Bksp:
          if ( !this.parentWindow.event.srcElement.type ||
            (this.parentWindow.event.srcElement.type.toLowerCase() != "text" &&
            this.parentWindow.event.srcElement.type.toLowerCase() != "password") )
          {
            this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
          }
          break;
        case Key_Clear:
          if ( this.parentWindow.event.srcElement.type &&
            (this.parentWindow.event.srcElement.type.toLowerCase() == "text" ||
            this.parentWindow.event.srcElement.type.toLowerCase() == "password") )
          {
            this.parentWindow.event.keyCode = 0; this.parentWindow.event.returnValue = false;
            this.parentWindow.event.srcElement.value = "";
          }
          break;
      }
    }
  }

  /*
    ��ֹ��������
   */
  this.disableKey = function()
  {
    this.doc.onkeydown = function(){this.parentWindow.event.keyCode=0; this.parentWindow.event.returnValue=false;}
  }

  /*
    ��������Ӧ����ȫ����λ
   */
  this.resetInputRespFunc = function()
  {
    // ��������Ӧ������Ϊ top.FUNC_NA����ʲôҲ����
    this.doc.parentWindow.onKey_F1 = top.FUNC_NA;
    this.doc.parentWindow.onKey_F2 = top.FUNC_NA;
    this.doc.parentWindow.onKey_F3 = top.FUNC_NA;
    this.doc.parentWindow.onKey_F4 = top.FUNC_NA;
    this.doc.parentWindow.onKey_F5 = top.FUNC_NA;
    this.doc.parentWindow.onKey_F6 = top.FUNC_NA;
    this.doc.parentWindow.onKey_F7 = top.FUNC_NA;
    this.doc.parentWindow.onKey_F8 = top.FUNC_NA;
    this.doc.parentWindow.onKey_Enter = top.FUNC_NA;
    this.doc.parentWindow.onKey_Cancel = top.FUNC_NA;
    this.doc.parentWindow.onKey_0 = top.FUNC_NA;
    this.doc.parentWindow.onKey_1 = top.FUNC_NA;
    this.doc.parentWindow.onKey_2 = top.FUNC_NA;
    this.doc.parentWindow.onKey_3 = top.FUNC_NA;
    this.doc.parentWindow.onKey_4 = top.FUNC_NA;
    this.doc.parentWindow.onKey_5 = top.FUNC_NA;
    this.doc.parentWindow.onKey_6 = top.FUNC_NA;
    this.doc.parentWindow.onKey_7 = top.FUNC_NA;
    this.doc.parentWindow.onKey_8 = top.FUNC_NA;
    this.doc.parentWindow.onKey_9 = top.FUNC_NA;
  }

  // ����ʱ��������Ӧ����ȫ����λ
  this.resetInputRespFunc();
}
