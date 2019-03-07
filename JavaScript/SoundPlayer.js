/*
  背景声播放器

 */
function SoundPlayer()
{
  // 播放指定url的背景声
  this.playback = function(url)
  {
    top.oBGSound.src = ".."+url;
  }

  // 停止播放
  this.stop = function()
  {
    top.oBGSound.src = "";
  }

  // 播放请取卡提示音
  this.TakeCardMusic = function()
  {
    this.playback("/Sound/TakeCardTip.mp3");
  }
  
  //播放请插卡提示音
  this.InsertCardMusic=function()
  {
  	this.playback("/Sound/InsertCardTip.mp3");
  }
}
