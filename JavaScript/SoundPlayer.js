/*
  ������������

 */
function SoundPlayer()
{
  // ����ָ��url�ı�����
  this.playback = function(url)
  {
    top.oBGSound.src = ".."+url;
  }

  // ֹͣ����
  this.stop = function()
  {
    top.oBGSound.src = "";
  }

  // ������ȡ����ʾ��
  this.TakeCardMusic = function()
  {
    this.playback("/Sound/TakeCardTip.mp3");
  }
  
  //������忨��ʾ��
  this.InsertCardMusic=function()
  {
  	this.playback("/Sound/InsertCardTip.mp3");
  }
}
