package com.yihuacomputer.cols.crypto;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Md5ժҪ�㷨
 */
public class Md5
{
  private static String ALGORITHM_NAME = "Md5";

  /**
   * <p>��ȡ��Ϣ���ݵ�Md5ժҪ</p>
   * @param info ��Ϣ����
   * @return byte[] ��Ϣ���ݵ�Md5ժҪ��8�ֽڣ�ʧ�ܷ��� null
   */
  public static byte[] getDigest(byte[] info)
  {
    byte[] byteArrRet = null;
    try
    {
      MessageDigest algorithm = MessageDigest.getInstance(ALGORITHM_NAME);
      byte[] byteArrTemp = algorithm.digest(info);
      // ����8���͹���
      byteArrRet = new byte[8];
      System.arraycopy(byteArrTemp, 0, byteArrRet, 0, 8);
    }
    catch (NoSuchAlgorithmException e)
    {
    }
    return byteArrRet;
  }
}
