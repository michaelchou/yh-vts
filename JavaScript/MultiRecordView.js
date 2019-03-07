/*
  多条记录显示类
  将表示风格的各个ClassName改为可设置，以便于根据需要调整。
 */
function MultiRecordView()
{
  // 下面是私有变量
  // 当前页
  this.iCurPage = 0;
  // 在当前页中选择的记录位置
  this.iCurSelInPage = 0;

  // 下面的参数根据情况进行设置，决定显示的方式和内容
  // 每页显示的记录条（行）数
  this.iRowsPerPage = 5;
  // 表头HTML对象
  this.oTHead = null;
  // 表体HTML对象
  this.oTBody = null;
  // 表下方的页数提示HTML对象
  this.oTablePageTip = null;
    // 选择首页HTML对象
  this.oMFirstPage = null;
  // 选择尾页HTML对象
  this.oMEndPage = null;
  // 选择下一页HTML对象
  this.oMNextPage = null;
  // 选择上一页HTML对象
  this.oMPrevPage = null;
  // 选择下一个HTML对象
  this.oMSelNext = null;
  // 记录集合数组对象
  // 是一个二维数组，其第二维为每条记录的字段字符串值
  // 字段个数为：表头数组字段数（或+1，最后一个字段为该条记录的值）。
  this.strRecordArr = null;
  // 表头HTML内容集合数组对象
  this.strHeadingArr = null;
  //定义对齐方式
  this.strAlignArr=null;

  // 表中各元素风格的名称定义。使用该对象时，可以改变这些默认值，以实现自定义的表格风格。
  this.strClassName_Table_Head              = "Table_Head";
  this.strClassName_Table_Record            = "Table_Record";
  this.strClassName_Table_Record2           = "Table_Record2";
  this.strClassName_Table_RecordSelected    = "Table_RecordSelected";

    /*
    当用户选择首页时显示
    注：
      该函数的实现在show函数中动态更改实现
   */
  this.onFirstPage = top.FUNC_NA;

  /*
    当用户选择尾页时显示
    注：
      该函数的实现在show函数中动态更改实现
   */
  this.onEndPage = top.FUNC_NA;

  /*
    当用户选择下一页时显示
    注：
      该函数的实现在show函数中动态更改实现
   */
  this.onNextPage = top.FUNC_NA;

  /*
    当用户选择上一页时显示
    注：
      该函数的实现在show函数中动态更改实现
   */
  this.onPrevPage = top.FUNC_NA;

  /*
    当用户选择下一个时显示
    注：
      该函数的实现在show函数中动态更改实现
   */
  this.onSelNext = top.FUNC_NA;

  
  this.setHeadType = function(){
  this.strClassName_Table_Head  = "Table_HeadInfo";
  return  this.strClassName_Table_Head;
  }
  this.setRecordType = function(){
  this.strClassName_Table_Record = "Table_RecordInfo";  
  return this.strClassName_Table_Record;  
  }
  
  /*
    得到当前选择的记录对应值，即记录数组中除显示内容之外的最后一个字段的值
   */
  this.getCurSel = function()
  {
    var iSel = this.iRowsPerPage*this.iCurPage+this.iCurSelInPage;
    return this.strRecordArr[iSel][this.strHeadingArr.length];
  }
 /*
    得到当前选择的记录编号
   */
  this.getCurSelNumber = function()
  {
    var iSel = this.iRowsPerPage*this.iCurPage+this.iCurSelInPage;
    return iSel;
  }
  /*
    显示
   */
  this.show = function()
  {
    // 不响应翻页等操作
    this.onPrevPage = this.onNextPage = this.onSelNext = top.FUNC_NA;

    // 清空当前显示的内容
    while (this.oTHead.rows.length > 0)
     this.oTHead.deleteRow(0);
    while (this.oTBody.rows.length > 0)
     this.oTBody.deleteRow(0);

    // 插入表头
    var oRow = this.oTHead.insertRow();
    oRow.className = this.strClassName_Table_Head;

    for (var j=0; j<this.strHeadingArr.length; j++)
    {
      oCell = oRow.insertCell();
      oCell.innerHTML = this.strHeadingArr[j];
      oCell.align = "center";
    }

    // 插入当前页内容
    for (var i=0; i<this.iRowsPerPage; i++)
    {
      oRow = this.oTBody.insertRow();
      //设置表格背景
		if ((i+1)%2 == 0)
	    {
		   this.oTBody.rows[i].className = this.strClassName_Table_Record2; 
	    }
        else{
           this.oTBody.rows[i].className = this.strClassName_Table_Record;
	    }
	 
	  //oRow.className = this.strClassName_Table_Record;
	  
	  
      for (var j=0; j<this.strHeadingArr.length; j++)
      {
        oCell = oRow.insertCell();
        if (this.iRowsPerPage*this.iCurPage+i < this.strRecordArr.length){
          oCell.innerHTML = this.strRecordArr[this.iRowsPerPage*this.iCurPage+i][j];
          if(this.strAlignArr!=null&&this.strAlignArr.length==this.strHeadingArr.length){
        	  oCell.align=this.strAlignArr[j];
          }else{
        	  oCell.align="center";
          }
        }else{
          oCell.innerHTML = "&nbsp;";
        }
      }
	  var rowCount = this.strHeadingArr.length;
	  //增加对某行的选择事件
	  if(typeof(oRow.onclick) == "object"){
		  oRow.onclick=function (){
			  selectRow(this,rowCount);
		  }
	  }
    }
	//选择的行数据
    function selectRow(obj,count)
    {
    	var selectCurRow = obj.rowIndex;//获取当前的行号
	   var strRowData = new Array();
	   for(var i=0; i<count; i++ ){
	 	  strRowData.push(obj.childNodes[i].innerText);
	   }

	   //设置选中行的显示风格
	   for (var j=0; j<this.iRowsPerPage; j++)
       {
		  if (j == selectCurRow)
	      {
		     this.oTBody.rows[j].className = this.strClassName_Table_RecordSelected; 
	      }
          else{
         //    this.oTBody.rows[j].className = this.strClassName_Table_Record;
     		if ((j+1)%2 == 0)
    	    {
    		   this.oTBody.rows[j].className = this.strClassName_Table_Record2; 
    	    }
            else{
               this.oTBody.rows[j].className = this.strClassName_Table_Record;
    	    }
	      }
	   }
	   var strtmp = strRowData.toString();//把数组转为字符串
	   strtmp = strtmp.replace(/\./g,"").replace(/\,/g,"").replace(/(^\s*)|(\s*$)/g,"");//把".",","以及空格全部剔除
	   if(strtmp == null || strtmp ==""){
		    return;
	   }
	   if (typeof(top.MainFrame.onServiceSuccessful_AccDetialInfoQuery) == "function"){
           top.MainFrame.onServiceSuccessful_AccDetialInfoQuery(strRowData);
	   }
	   if (typeof(top.MainFrame.confirmTransInfo) == "function"){
           top.MainFrame.confirmTransInfo(strRowData);
	   }
	   if (typeof(top.MainFrame.infoComfin) == "function"){ 
		   top.MainFrame.infoComfin(strRowData);
	   }
	   if (typeof(top.MainFrame.choosePerInformation) == "function"){
	 	   top.MainFrame.choosePerInformation(strRowData);
       }
	   if (typeof(top.MainFrame.SelectCurrentRow) == "function"){
	 	   top.MainFrame.SelectCurrentRow(selectCurRow -1);
       }
    }
    // 根据判断显示页数提示
    if (this.oTablePageTip != null && this.iRowsPerPage < this.strRecordArr.length)
    {
      this.oTablePageTip.innerHTML = "(" +
        (this.iRowsPerPage*this.iCurPage+1) + "-" +
        (this.iRowsPerPage*(this.iCurPage+1) > this.strRecordArr.length ? this.strRecordArr.length : this.iRowsPerPage*(this.iCurPage+1)) + "/" +
        this.strRecordArr.length + ")";
	}

  // 根据判断决定是否显示和响应选择首页
    if (this.iCurPage > 0)
    {
      this.oMFirstPage.style.visibility = "";
      this.onFirstPage = this.onFirstPage_;
    }
    else
    {
      this.oMFirstPage.style.visibility = "hidden";
    }
    
    // 根据判断决定是否显示和响应选择尾页
    if (this.iRowsPerPage*(this.iCurPage+1) < this.strRecordArr.length)
    {
      this.oMEndPage.style.visibility = "";
      this.onEndPage = this.onEndPage_;
    }
    else
    {
      this.oMEndPage.style.visibility = "hidden";
    }

    // 根据判断决定是否显示和响应选择上一页
    if (this.iCurPage > 0)
    {
      this.oMPrevPage.style.visibility = "";
      this.onPrevPage = this.onPrevPage_;
    }
    else
    {
      this.oMPrevPage.style.visibility = "hidden";
    }

    // 根据判断决定是否显示和响应选择下一页
    if (this.iRowsPerPage*(this.iCurPage+1) < this.strRecordArr.length)
    {
      this.oMNextPage.style.visibility = "";
      this.onNextPage = this.onNextPage_;
    }
    else
    {
      this.oMNextPage.style.visibility = "hidden";
    }

    // 根据判断决定是否显示和响应选择下一个
    if (this.oMSelNext != null)
    {
      this.iCurSelInPage = -1;
      this.onSelNext = this.onSelNext_;
      this.onSelNext();
    }
  }
   
  this.showMX = function()
  {
    // 不响应翻页等操作
    this.onPrevPage = this.onNextPage = this.onSelNext = top.FUNC_NA;

    // 清空当前显示的内容
    while (this.oTHead.rows.length > 0)
     this.oTHead.deleteRow(0);
    while (this.oTBody.rows.length > 0)
     this.oTBody.deleteRow(0);

    // 插入表头
    var oRow = this.oTHead.insertRow();
    oRow.className = this.strClassName_Table_Head;

    for (var j=0; j<this.strHeadingArr.length; j++)
    {
      oCell = oRow.insertCell();
      oCell.innerHTML = this.strHeadingArr[j];
      oCell.align = "center";
    }
    
    // 插入当前页内容
    for (var i=0; i<this.iRowsPerPage; i++)
    {
      oRow = this.oTBody.insertRow();
    //  oRow.className = this.strClassName_Table_Record;
     
    	if ((i+1)%2 == 0)
    	{
    		oRow.className = this.strClassName_Table_Record2; 
  	    } else
  	    {
        	 oRow.className = this.strClassName_Table_Record;
  	    }
      
      for (var j=0; j<this.strHeadingArr.length; j++)
      {
        oCell = oRow.insertCell();
        if (this.iRowsPerPage*this.iCurPage+i < this.strRecordArr.length){
          oCell.innerHTML = this.strRecordArr[this.iRowsPerPage*this.iCurPage+i][j];
          if(this.strAlignArr!=null&&this.strAlignArr.length==this.strHeadingArr.length){
        	  oCell.align=this.strAlignArr[j];
          }else{
        	  oCell.align="left";
          }
        }else{
          oCell.innerHTML = "&nbsp;";
        }
      }
      var rowCount = this.strHeadingArr.length;
	  //增加对某行的选择事件
	  if(typeof(oRow.onclick) == "object"){
		  oRow.onclick=function (){
			  if (typeof(top.MainFrame.SelectCurrentRow) == "function"){
				  var selectCurRow = this.rowIndex;//获取当前的行号 
				  top.MainFrame.SelectCurrentRow(selectCurRow -1);
		       }
		  }
	  }
    }

    // 根据判断显示页数提示
    if (this.oTablePageTip != null && this.iRowsPerPage < this.strRecordArr.length)
    {
      this.oTablePageTip.innerHTML = "(" +
        (this.iRowsPerPage*this.iCurPage+1) + "-" +
        (this.iRowsPerPage*(this.iCurPage+1) > this.strRecordArr.length ? this.strRecordArr.length : this.iRowsPerPage*(this.iCurPage+1)) + "/" +
        this.strRecordArr.length + ")";
    }

    // 根据判断决定是否显示和响应选择上一页
    if (this.iCurPage > 0)
    {
      this.oMPrevPage.style.visibility = "";
      this.onPrevPage = this.onPrevPage_;
    }
    else
    {
      this.oMPrevPage.style.visibility = "hidden";
    }

    // 根据判断决定是否显示和响应选择下一页
    if (this.iRowsPerPage*(this.iCurPage+1) < this.strRecordArr.length)
    {
      this.oMNextPage.style.visibility = "";
      this.onNextPage = this.onNextPage_;
    }
    else
    {
      this.oMNextPage.style.visibility = "hidden";
    }

    // 根据判断决定是否显示和响应选择下一个
    if (this.oMSelNext != null)
    {
      this.iCurSelInPage = -1;
      this.onSelNext = this.onSelNext_;
      this.onSelNext();
    }
  }
  /*
    私有函数：当用户选择下一页时显示
   */
  this.onNextPage_ = function()
  {
    this.iCurPage++;
    this.show();
  }

  /*
    私有函数：当用户选择上一页时显示
   */
  this.onPrevPage_ = function()
  {
    this.iCurPage--;
    this.show();
  }
  
    /*
    私有函数：当用户选择首页时显示
   */
  this.onFirstPage_ = function()
  {
    this.iCurPage=0;
    this.show();
  }

  /*
    私有函数：当用户选择尾页时显示
   */
  this.onEndPage_ = function()
  {  
	  if((this.strRecordArr.length%this.iRowsPerPage)==0)
	  this.iCurPage = this.strRecordArr.length/this.iRowsPerPage-1;
	  else
      this.iCurPage = this.strRecordArr.length/this.iRowsPerPage;
      this.iCurPage = parseInt(this.iCurPage+"");
    this.show();
  }

  /*
    私有函数：当用户选择下一个时显示
   */
  this.onSelNext_ = function()
  {
    // 增加当前页中选择的记录位置
    if (this.iRowsPerPage*this.iCurPage+this.iCurSelInPage+1 < this.strRecordArr.length && this.iCurSelInPage+1 < this.iRowsPerPage)
      this.iCurSelInPage++;
    else
      this.iCurSelInPage = 0;
    // 根据是否选中，设置不同记录的显示风格
    for (var i=0; i+this.iRowsPerPage*this.iCurPage<this.strRecordArr.length && i<this.iRowsPerPage; i++)
    {
    	if (i == this.iCurSelInPage)
        this.oTBody.rows[i].className = this.strClassName_Table_RecordSelected;
      else
      //  this.oTBody.rows[i].className = this.strClassName_Table_Record;
  		if ((i+1)%2 == 0)
	    {
		   this.oTBody.rows[i].className = this.strClassName_Table_Record2; 
	    }
        else{
           this.oTBody.rows[i].className = this.strClassName_Table_Record;
	    }
    }
    // 根据判断决定是否显示选择下一个
    if (this.strRecordArr.length%this.iRowsPerPage == 1 &&
      this.iCurSelInPage+this.iRowsPerPage*this.iCurPage+1 == this.strRecordArr.length)
      this.oMSelNext.style.visibility = "hidden";
    else
      this.oMSelNext.style.visibility = "";
  }
  
	  /*
	   * 挡用户点击当前行时显示
	 */
	this.onSelRowStyle = function()
	{
	  // 根据是否选中，设置不同记录的显示风格
	  for (var i=0; i+this.iRowsPerPage*this.iCurPage<this.strRecordArr.length && i<this.iRowsPerPage; i++)
	  {
	  	if (i == this.iCurSelInPage)
	      this.oTBody.rows[i].className = this.strClassName_Table_RecordSelected;
	    else
	    //  this.oTBody.rows[i].className = this.strClassName_Table_Record;
			if ((i+1)%2 == 0)
		    {
			   this.oTBody.rows[i].className = this.strClassName_Table_Record2; 
		    }
	      else{
	         this.oTBody.rows[i].className = this.strClassName_Table_Record;
		    }
	  }
	  // 根据判断决定是否显示选择下一个
	  if (this.strRecordArr.length%this.iRowsPerPage == 1 &&
	    this.iCurSelInPage+this.iRowsPerPage*this.iCurPage+1 == this.strRecordArr.length)
	    this.oMSelNext.style.visibility = "hidden";
	  else
	    this.oMSelNext.style.visibility = "";
	}
}
