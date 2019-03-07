
/*
  ����ѡ�񹤾���

 */
function DateSelector(selYear, selMonth) { 

	this.selYear = selYear; 
	this.selMonth = selMonth; 
	this.selYear.Group = this; 
	this.selMonth.Group = this; 
	// ����ݡ��·������˵���Ӵ���onchange�¼��ĺ��� 
	/* if (window.document.all != null) // IE 
	{ 
		this.selYear.attachEvent("onchange", DateSelector.Onchange); 
		this.selMonth.attachEvent("onchange", DateSelector.Onchange); 
	} 
	else // Firefox 
	{ 
		this.selYear.addEventListener("change", DateSelector.Onchange, false); 
		this.selMonth.addEventListener("change", DateSelector.Onchange, false); 
	}  */

	if (arguments.length == 4) // ��������������Ϊ4�����һ����������ΪDate���� 
		this.InitSelector(arguments[3].getFullYear(), arguments[3].getMonth() + 1, arguments[3].getDate()); 
	else // Ĭ��ʹ�õ�ǰ���� 
	{ 
		var dt = new Date(); 
		this.InitSelector(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()); 
	} 
	} 
	// ����һ�������ݵ����� 
	DateSelector.prototype.MinYear = (new Date()).getFullYear() - 6; 
	// ����һ�������ݵ����� 
	DateSelector.prototype.MaxYear = (new Date()).getFullYear(); 


	// ��ʼ����� 
	DateSelector.prototype.InitYearSelect = function () { 
	// ѭ�����OPIONԪ�ص����select������ 
		for (var i = this.MaxYear; i >= this.MinYear; i--) { 
			// �½�һ��OPTION���� 
			var op = window.document.createElement("OPTION"); 
			// ����OPTION�����ֵ 
			op.value = i; 
			// ����OPTION��������� 
			op.innerHTML = i; 
			// ��ӵ����select���� 
			this.selYear.appendChild(op); 
			} 
	} 
	// ��ʼ���·� 
	DateSelector.prototype.InitMonthSelect = function () { 
	// ѭ�����OPIONԪ�ص��·�select������ 
		for (var i = 1; i < 13; i++) { 
		// �½�һ��OPTION���� 
		var op = window.document.createElement("OPTION"); 
		// ����OPTION�����ֵ 
		op.value = i; 
		// ����OPTION��������� 
		op.innerHTML = i; 
		// ��ӵ��·�select���� 
		this.selMonth.appendChild(op); 
		} 
} 

DateSelector.Onchange = function (e) { 
	var selector = window.document.all != null ? e.srcElement : e.target; 
	selector.Group.InitDaySelect(); 
} 
	// ���ݲ�����ʼ�������˵�ѡ�� 
	DateSelector.prototype.InitSelector = function (year, month, day) { 

		this.selYear.options.length = 0; 
		this.selMonth.options.length = 0; 
		// ��ʼ���ꡢ�� 
		this.InitYearSelect(); 
		this.InitMonthSelect(); 
		// �����ꡢ�³�ʼֵ 
		this.selYear.selectedIndex = this.MaxYear - year; 
		this.selMonth.selectedIndex = month - 1; 
	} 