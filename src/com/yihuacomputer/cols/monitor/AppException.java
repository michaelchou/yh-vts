package com.yihuacomputer.cols.monitor;

public class AppException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	private String message;
	private Throwable e;

	public AppException(String message) {
		this.message = message;
	}

	public AppException(String message, Throwable e) {
		this.message = message;
		this.e = e;
	}

	@Override
	public String getMessage() {
		return this.message;
	}

	public Throwable getThrowable() {
		return e;
	}

}
