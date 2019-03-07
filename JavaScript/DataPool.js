/*
  数据池类
 */
function DataPool()
{
  this.pool = new Object();

  /*
    设置属性值，保存到集合中
    参数：
      key     属性键名
      value   属性值
   */
  this.set = function(key, value)
  {
    this.pool[key] = value;
  }

  /*
    获取属性值
    参数：
      key     属性键名
    返回：
      属性值
   */
  this.get = function(key)
  {
    if (this.pool[key] != null)
      return this.pool[key];
    else
      return "";
  }

  /*
    清空所有属性值
   */
  this.clearAll = function()
  {
    this.pool = new Object();
  }
}
  