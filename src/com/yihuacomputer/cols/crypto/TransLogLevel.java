package com.yihuacomputer.cols.crypto;

public enum TransLogLevel {
	DEBUG("DEBUG",3),

	INFO("INFO",2),

	ERROR("ERROR",1),

	NONE("NONE",0);

	private TransLogLevel(String name, int level){
		this.name = name;
		this.level = level;
	}

	public String getName() {
		return name;
	}

	public int getLevel() {
		return level;
	}

	private String name;

	private int level;
}
