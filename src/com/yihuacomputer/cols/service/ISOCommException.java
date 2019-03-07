package com.yihuacomputer.cols.service;


public class ISOCommException extends Exception {
	private static final long serialVersionUID = -6118684355968844853L;
	public final static int TYPE_CONNECT_TIMEOUT = 1;
    public final static int TYPE_CONNECT_FAILED = 2;
    public final static int TYPE_SEND_TIMEOUT = 3;
    public final static int TYPE_SEND_FAILED = 4;
    public final static int TYPE_RECEIVE_TIMEOUT = 5;
    public final static int TYPE_RECEIVE_FAILED = 6;
    public int iType;

  public ISOCommException(int type)
  {
    super("通讯超时异常");
    iType = type;
  }

}
