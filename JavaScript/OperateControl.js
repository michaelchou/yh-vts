/*
  用户输入管理器
  管理用户鼠标点击、按键等操作
 */
function OperateControl(doc)
{
  this.doc = doc;

  /*
    允许输入，包括按键与鼠标
    文档窗口提供回调函数:
      参见 this.enableKey
   */
  this.enableInput = function()
  {
    this.enableMouse();
    this.enableKey();
  }

  /*
    禁止输入，包括按键与鼠标
    参数：
        bResetInputRespFunc 是否将输入响应函数全部复位
   */
  this.disableInput = function(bResetInputRespFunc)
  {
    if (bResetInputRespFunc)
      this.resetInputRespFunc();
    this.disableMouse();
    this.disableKey();
  }

  /*
    允许鼠标输入
   */
  this.enableMouse = function()
  {
    // onclick允许由具体对象处理，文档不禁用它
    this.doc.onclick = top.FUNC_NA;
    // 双击总是被禁用
    this.doc.ondblclick = function (){this.parentWindow.event.returnValue = false;}
  }

  /*
    禁止鼠标输入
   */
  this.disableMouse = function()
  {
    this.doc.onclick = function (){this.parentWindow.event.returnValue = false;}
    this.doc.ondblclick = function (){this.parentWindow.event.returnValue = false;}
  }

  /*
    允许按键输入
    文档窗口提供回调函数:
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
    禁止按键输入
   */
  this.disableKey = function()
  {
    this.doc.onkeydown = function(){this.parentWindow.event.keyCode=0; this.parentWindow.event.returnValue=false;}
  }

  /*
    将输入响应函数全部复位
   */
  this.resetInputRespFunc = function()
  {
    // 将输入响应函数置为 top.FUNC_NA，即什么也不做
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

  // 构造时将输入响应函数全部复位
  this.resetInputRespFunc();
}
