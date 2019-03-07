/*
  指示灯控制器
 */
function GuideLights()
{ 
  //设置读卡器灯
  this.setCardReaderLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetCardReaderLight(state);
    } catch(e){}
  }

  //设置凭条打印机灯
  this.setReceiptPrinterLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetReceiptPrinterLight(state);
    } catch(e){}
  }
  
  //设置密码键盘灯
  this.setPinPadLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetPinPadLight(state);
    } catch(e){}
  }
  
  //设置身份证灯
  this.setEnvelopeDispenserLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetEnvelopeDispenserLight(state);
    } catch(e){}
  }
  
  //设置UKey灯
  this.setCoinDispenserLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetCoinDispenserLight(state);
    } catch(e){}
  }
  
  //设置广告灯(迎宾灯)
  this.setNCICLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetCustomLight("NCICREADER",state);
    } catch(e){}
  }
  
  //存单受理灯
  this.setCashOutLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetCustomLight("CARDDISPENSER",state);
    } catch(e){}
  }
  
  //存单开户灯
  this.setChequeUnitLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetChequeUnitLight(state);
    } catch(e){}
  }
  
  //设置存折补登灯
  this.setPassBookLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetCustomLight("PASSBOOKPRINTER",state);
    } catch(e){}
  }
  
  //设置指纹仪灯
  this.setFingerLight = function(state)
  {
    try
    {
      if (typeof(YHAXGuideLights) != "undefined")
        top.YHAXGuideLights.SetCustomLight("FINGERPRINT",state);
    } catch(e){}
  }
  
}
