package com.yihuacomputer.cols.crypto;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Md5摘要算法
 */
public class Md5
{
  private static String ALGORITHM_NAME = "Md5";

  /**
   * <p>获取信息数据的Md5摘要</p>
   * @param info 信息数据
   * @return byte[] 信息数据的Md5摘要，8字节，失败返回 null
   */
  public static byte[] getDigest(byte[] info)
  {
    byte[] byteArrRet = null;
    try
    {
      MessageDigest algorithm = MessageDigest.getInstance(ALGORITHM_NAME);
      byte[] byteArrTemp = algorithm.digest(info);
      // 返回8个就够了
      byteArrRet = new byte[8];
      System.arraycopy(byteArrTemp, 0, byteArrRet, 0, 8);
    }
    catch (NoSuchAlgorithmException e)
    {
    }
    return byteArrRet;
  }
}
