/*
  ������¼��ʾ��
  ����ʾ���ĸ���ClassName��Ϊ�����ã��Ա��ڸ�����Ҫ������
 */
function MultiRecordView()
{
  // ������˽�б���
  // ��ǰҳ
  this.iCurPage = 0;
  // �ڵ�ǰҳ��ѡ��ļ�¼λ��
  this.iCurSelInPage = 0;

  // ����Ĳ�����������������ã�������ʾ�ķ�ʽ������
  // ÿҳ��ʾ�ļ�¼�����У���
  this.iRowsPerPage = 5;
  // ��ͷHTML����
  this.oTHead = null;
  // ����HTML����
  this.oTBody = null;
  // ���·���ҳ����ʾHTML����
  this.oTablePageTip = null;
    // ѡ����ҳHTML����
  this.oMFirstPage = null;
  // ѡ��βҳHTML����
  this.oMEndPage = null;
  // ѡ����һҳHTML����
  this.oMNextPage = null;
  // ѡ����һҳHTML����
  this.oMPrevPage = null;
  // ѡ����һ��HTML����
  this.oMSelNext = null;
  // ��¼�����������
  // ��һ����ά���飬��ڶ�άΪÿ����¼���ֶ��ַ���ֵ
  // �ֶθ���Ϊ����ͷ�����ֶ�������+1�����һ���ֶ�Ϊ������¼��ֵ����
  this.strRecordArr = null;
  // ��ͷHTML���ݼ����������
  this.strHeadingArr = null;
  //������뷽ʽ
  this.strAlignArr=null;

  // ���и�Ԫ�ط������ƶ��塣ʹ�øö���ʱ�����Ըı���ЩĬ��ֵ����ʵ���Զ���ı����
  this.strClassName_Table_Head              = "Table_Head";
  this.strClassName_Table_Record            = "Table_Record";
  this.strClassName_Table_Record2           = "Table_Record2";
  this.strClassName_Table_RecordSelected    = "Table_RecordSelected";

    /*
    ���û�ѡ����ҳʱ��ʾ
    ע��
      �ú�����ʵ����show�����ж�̬����ʵ��
   */
  this.onFirstPage = top.FUNC_NA;

  /*
    ���û�ѡ��βҳʱ��ʾ
    ע��
      �ú�����ʵ����show�����ж�̬����ʵ��
   */
  this.onEndPage = top.FUNC_NA;

  /*
    ���û�ѡ����һҳʱ��ʾ
    ע��
      �ú�����ʵ����show�����ж�̬����ʵ��
   */
  this.onNextPage = top.FUNC_NA;

  /*
    ���û�ѡ����һҳʱ��ʾ
    ע��
      �ú�����ʵ����show�����ж�̬����ʵ��
   */
  this.onPrevPage = top.FUNC_NA;

  /*
    ���û�ѡ����һ��ʱ��ʾ
    ע��
      �ú�����ʵ����show�����ж�̬����ʵ��
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
    �õ���ǰѡ��ļ�¼��Ӧֵ������¼�����г���ʾ����֮������һ���ֶε�ֵ
   */
  this.getCurSel = function()
  {
    var iSel = this.iRowsPerPage*this.iCurPage+this.iCurSelInPage;
    return this.strRecordArr[iSel][this.strHeadingArr.length];
  }
 /*
    �õ���ǰѡ��ļ�¼���
   */
  this.getCurSelNumber = function()
  {
    var iSel = this.iRowsPerPage*this.iCurPage+this.iCurSelInPage;
    return iSel;
  }
  /*
    ��ʾ
   */
  this.show = function()
  {
    // ����Ӧ��ҳ�Ȳ���
    this.onPrevPage = this.onNextPage = this.onSelNext = top.FUNC_NA;

    // ��յ�ǰ��ʾ������
    while (this.oTHead.rows.length > 0)
     this.oTHead.deleteRow(0);
    while (this.oTBody.rows.length > 0)
     this.oTBody.deleteRow(0);

    // �����ͷ
    var oRow = this.oTHead.insertRow();
    oRow.className = this.strClassName_Table_Head;

    for (var j=0; j<this.strHeadingArr.length; j++)
    {
      oCell = oRow.insertCell();
      oCell.innerHTML = this.strHeadingArr[j];
      oCell.align = "center";
    }

    // ���뵱ǰҳ����
    for (var i=0; i<this.iRowsPerPage; i++)
    {
      oRow = this.oTBody.insertRow();
      //���ñ�񱳾�
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
	  //���Ӷ�ĳ�е�ѡ���¼�
	  if(typeof(oRow.onclick) == "object"){
		  oRow.onclick=function (){
			  selectRow(this,rowCount);
		  }
	  }
    }
	//ѡ���������
    function selectRow(obj,count)
    {
    	var selectCurRow = obj.rowIndex;//��ȡ��ǰ���к�
	   var strRowData = new Array();
	   for(var i=0; i<count; i++ ){
	 	  strRowData.push(obj.childNodes[i].innerText);
	   }

	   //����ѡ���е���ʾ���
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
	   var strtmp = strRowData.toString();//������תΪ�ַ���
	   strtmp = strtmp.replace(/\./g,"").replace(/\,/g,"").replace(/(^\s*)|(\s*$)/g,"");//��".",","�Լ��ո�ȫ���޳�
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
    // �����ж���ʾҳ����ʾ
    if (this.oTablePageTip != null && this.iRowsPerPage < this.strRecordArr.length)
    {
      this.oTablePageTip.innerHTML = "(" +
        (this.iRowsPerPage*this.iCurPage+1) + "-" +
        (this.iRowsPerPage*(this.iCurPage+1) > this.strRecordArr.length ? this.strRecordArr.length : this.iRowsPerPage*(this.iCurPage+1)) + "/" +
        this.strRecordArr.length + ")";
	}

  // �����жϾ����Ƿ���ʾ����Ӧѡ����ҳ
    if (this.iCurPage > 0)
    {
      this.oMFirstPage.style.visibility = "";
      this.onFirstPage = this.onFirstPage_;
    }
    else
    {
      this.oMFirstPage.style.visibility = "hidden";
    }
    
    // �����жϾ����Ƿ���ʾ����Ӧѡ��βҳ
    if (this.iRowsPerPage*(this.iCurPage+1) < this.strRecordArr.length)
    {
      this.oMEndPage.style.visibility = "";
      this.onEndPage = this.onEndPage_;
    }
    else
    {
      this.oMEndPage.style.visibility = "hidden";
    }

    // �����жϾ����Ƿ���ʾ����Ӧѡ����һҳ
    if (this.iCurPage > 0)
    {
      this.oMPrevPage.style.visibility = "";
      this.onPrevPage = this.onPrevPage_;
    }
    else
    {
      this.oMPrevPage.style.visibility = "hidden";
    }

    // �����жϾ����Ƿ���ʾ����Ӧѡ����һҳ
    if (this.iRowsPerPage*(this.iCurPage+1) < this.strRecordArr.length)
    {
      this.oMNextPage.style.visibility = "";
      this.onNextPage = this.onNextPage_;
    }
    else
    {
      this.oMNextPage.style.visibility = "hidden";
    }

    // �����жϾ����Ƿ���ʾ����Ӧѡ����һ��
    if (this.oMSelNext != null)
    {
      this.iCurSelInPage = -1;
      this.onSelNext = this.onSelNext_;
      this.onSelNext();
    }
  }
   
  this.showMX = function()
  {
    // ����Ӧ��ҳ�Ȳ���
    this.onPrevPage = this.onNextPage = this.onSelNext = top.FUNC_NA;

    // ��յ�ǰ��ʾ������
    while (this.oTHead.rows.length > 0)
     this.oTHead.deleteRow(0);
    while (this.oTBody.rows.length > 0)
     this.oTBody.deleteRow(0);

    // �����ͷ
    var oRow = this.oTHead.insertRow();
    oRow.className = this.strClassName_Table_Head;

    for (var j=0; j<this.strHeadingArr.length; j++)
    {
      oCell = oRow.insertCell();
      oCell.innerHTML = this.strHeadingArr[j];
      oCell.align = "center";
    }
    
    // ���뵱ǰҳ����
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
	  //���Ӷ�ĳ�е�ѡ���¼�
	  if(typeof(oRow.onclick) == "object"){
		  oRow.onclick=function (){
			  if (typeof(top.MainFrame.SelectCurrentRow) == "function"){
				  var selectCurRow = this.rowIndex;//��ȡ��ǰ���к� 
				  top.MainFrame.SelectCurrentRow(selectCurRow -1);
		       }
		  }
	  }
    }

    // �����ж���ʾҳ����ʾ
    if (this.oTablePageTip != null && this.iRowsPerPage < this.strRecordArr.length)
    {
      this.oTablePageTip.innerHTML = "(" +
        (this.iRowsPerPage*this.iCurPage+1) + "-" +
        (this.iRowsPerPage*(this.iCurPage+1) > this.strRecordArr.length ? this.strRecordArr.length : this.iRowsPerPage*(this.iCurPage+1)) + "/" +
        this.strRecordArr.length + ")";
    }

    // �����жϾ����Ƿ���ʾ����Ӧѡ����һҳ
    if (this.iCurPage > 0)
    {
      this.oMPrevPage.style.visibility = "";
      this.onPrevPage = this.onPrevPage_;
    }
    else
    {
      this.oMPrevPage.style.visibility = "hidden";
    }

    // �����жϾ����Ƿ���ʾ����Ӧѡ����һҳ
    if (this.iRowsPerPage*(this.iCurPage+1) < this.strRecordArr.length)
    {
      this.oMNextPage.style.visibility = "";
      this.onNextPage = this.onNextPage_;
    }
    else
    {
      this.oMNextPage.style.visibility = "hidden";
    }

    // �����жϾ����Ƿ���ʾ����Ӧѡ����һ��
    if (this.oMSelNext != null)
    {
      this.iCurSelInPage = -1;
      this.onSelNext = this.onSelNext_;
      this.onSelNext();
    }
  }
  /*
    ˽�к��������û�ѡ����һҳʱ��ʾ
   */
  this.onNextPage_ = function()
  {
    this.iCurPage++;
    this.show();
  }

  /*
    ˽�к��������û�ѡ����һҳʱ��ʾ
   */
  this.onPrevPage_ = function()
  {
    this.iCurPage--;
    this.show();
  }
  
    /*
    ˽�к��������û�ѡ����ҳʱ��ʾ
   */
  this.onFirstPage_ = function()
  {
    this.iCurPage=0;
    this.show();
  }

  /*
    ˽�к��������û�ѡ��βҳʱ��ʾ
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
    ˽�к��������û�ѡ����һ��ʱ��ʾ
   */
  this.onSelNext_ = function()
  {
    // ���ӵ�ǰҳ��ѡ��ļ�¼λ��
    if (this.iRowsPerPage*this.iCurPage+this.iCurSelInPage+1 < this.strRecordArr.length && this.iCurSelInPage+1 < this.iRowsPerPage)
      this.iCurSelInPage++;
    else
      this.iCurSelInPage = 0;
    // �����Ƿ�ѡ�У����ò�ͬ��¼����ʾ���
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
    // �����жϾ����Ƿ���ʾѡ����һ��
    if (this.strRecordArr.length%this.iRowsPerPage == 1 &&
      this.iCurSelInPage+this.iRowsPerPage*this.iCurPage+1 == this.strRecordArr.length)
      this.oMSelNext.style.visibility = "hidden";
    else
      this.oMSelNext.style.visibility = "";
  }
  
	  /*
	   * ���û������ǰ��ʱ��ʾ
	 */
	this.onSelRowStyle = function()
	{
	  // �����Ƿ�ѡ�У����ò�ͬ��¼����ʾ���
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
	  // �����жϾ����Ƿ���ʾѡ����һ��
	  if (this.strRecordArr.length%this.iRowsPerPage == 1 &&
	    this.iCurSelInPage+this.iRowsPerPage*this.iCurPage+1 == this.strRecordArr.length)
	    this.oMSelNext.style.visibility = "hidden";
	  else
	    this.oMSelNext.style.visibility = "";
	}
}
