/*
  ���ݳ���
 */
function DataPool()
{
  this.pool = new Object();

  /*
    ��������ֵ�����浽������
    ������
      key     ���Լ���
      value   ����ֵ
   */
  this.set = function(key, value)
  {
    this.pool[key] = value;
  }

  /*
    ��ȡ����ֵ
    ������
      key     ���Լ���
    ���أ�
      ����ֵ
   */
  this.get = function(key)
  {
    if (this.pool[key] != null)
      return this.pool[key];
    else
      return "";
  }

  /*
    �����������ֵ
   */
  this.clearAll = function()
  {
    this.pool = new Object();
  }
}
  