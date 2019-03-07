
/*
  日期选择工具类

 */
function DateSelector(selYear, selMonth) { 

	this.selYear = selYear; 
	this.selMonth = selMonth; 
	this.selYear.Group = this; 
	this.selMonth.Group = this; 
	// 给年份、月份下拉菜单添加处理onchange事件的函数 
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

	if (arguments.length == 4) // 如果传入参数个数为4，最后一个参数必须为Date对象 
		this.InitSelector(arguments[3].getFullYear(), arguments[3].getMonth() + 1, arguments[3].getDate()); 
	else // 默认使用当前日期 
	{ 
		var dt = new Date(); 
		this.InitSelector(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()); 
	} 
	} 
	// 增加一个最大年份的属性 
	DateSelector.prototype.MinYear = (new Date()).getFullYear() - 6; 
	// 增加一个最大年份的属性 
	DateSelector.prototype.MaxYear = (new Date()).getFullYear(); 


	// 初始化年份 
	DateSelector.prototype.InitYearSelect = function () { 
	// 循环添加OPION元素到年份select对象中 
		for (var i = this.MaxYear; i >= this.MinYear; i--) { 
			// 新建一个OPTION对象 
			var op = window.document.createElement("OPTION"); 
			// 设置OPTION对象的值 
			op.value = i; 
			// 设置OPTION对象的内容 
			op.innerHTML = i; 
			// 添加到年份select对象 
			this.selYear.appendChild(op); 
			} 
	} 
	// 初始化月份 
	DateSelector.prototype.InitMonthSelect = function () { 
	// 循环添加OPION元素到月份select对象中 
		for (var i = 1; i < 13; i++) { 
		// 新建一个OPTION对象 
		var op = window.document.createElement("OPTION"); 
		// 设置OPTION对象的值 
		op.value = i; 
		// 设置OPTION对象的内容 
		op.innerHTML = i; 
		// 添加到月份select对象 
		this.selMonth.appendChild(op); 
		} 
} 

DateSelector.Onchange = function (e) { 
	var selector = window.document.all != null ? e.srcElement : e.target; 
	selector.Group.InitDaySelect(); 
} 
	// 根据参数初始化下拉菜单选项 
	DateSelector.prototype.InitSelector = function (year, month, day) { 

		this.selYear.options.length = 0; 
		this.selMonth.options.length = 0; 
		// 初始化年、月 
		this.InitYearSelect(); 
		this.InitMonthSelect(); 
		// 设置年、月初始值 
		this.selYear.selectedIndex = this.MaxYear - year; 
		this.selMonth.selectedIndex = month - 1; 
	} 