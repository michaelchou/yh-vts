package com.yihuacomputer.cols.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

/**
 * 加密  3Des算法实现
 *1: A---使用3Des解密B----得到C
 *2:pinblock 采用银联标准生成  pin^accNo
 *3：使用C加密pinblock得到最终的密码
 *
 */
public class KeyBox {

	public String strMasterKeyDefault ="0123456789ABCDEF0123456789ABCDEF";
	public String strPinKeyDefault ="67B6475122505BFF56CC09E7CFDC4CEF";
    public String HTMK="";
    public String HPIN="";

	public KeyBox() throws Exception {
		load();
	}

	/**
	 * 从文件中加载密钥值
	 * @throws Exception
	 */
	private void load() throws Exception {
		File file = makeFile();
		FileInputStream in;
		try {
			in = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			return;
		}
		Properties p = new Properties();
		try {
			p.load(in);
			in.close();
		} catch (IOException e) {
			throw new Exception("File[" + file + "] read error");
		}
		String key = p.getProperty("master", null);
		if(key == null || key.equals("")){
			save();
		}
		else{
			HTMK = key;
		}
		key = p.getProperty("pin", null);
		if(key == null || key.equals("")){
			save();
		}else{
		    HPIN = key;
		}
	}

	/**
	 * 保存密钥值
	 * @throws Exception
	 */
	private void save() throws Exception {
		File file = makeFile();
		FileOutputStream out;
		try {
			out = new FileOutputStream(file);
		} catch (FileNotFoundException e1) {
			throw new Exception("File[" + file + "] Not Found");
		}
		Properties p = new Properties();
		if (strMasterKeyDefault != null) {
			//保存到文件之前先对数据进行加密
			p.setProperty("master", strMasterKeyDefault);
			HTMK = strMasterKeyDefault;
		}
		if (strPinKeyDefault != null) {
			p.setProperty("pin",  strPinKeyDefault);
			HPIN = strPinKeyDefault;
		}
		try {
			p.store(out, "keybox");
			out.close();
		} catch (IOException e) {
			throw new Exception("File[" + file + "] write error");
		}
	}

	/**
	 * 生成保存密钥值的文件keybox.ini
	 *
	 * @return
	 */
	private File makeFile() {
		String keyboxPath = pathIni();
		File pathFile = new File(keyboxPath);
		if (!pathFile.exists()) {
			pathFile.mkdirs();
		}

		File file = new File(keyboxPath, "keybox.ini");
		try {
			if (!file.exists()) {
				file.createNewFile();
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
		return file;
	}

	/**
	   * 获取交易配置文件
	   * @return
	*/
	public String pathIni()
	{
	  	 String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
	  	 String classpath= File.separator + path+"Test";
		 StringBuffer filePath = new StringBuffer(64);
	     filePath.append(classpath);
	     path = filePath.toString();
	     path = path + File.separator;
	     return path;
	}

    /**
     * 3DES加密
     * @param password 明文
     * @param secretKey 密钥
     * @return 16进制形式的字符串
     * @throws Exception
     */
    public static String encrypt(byte[] password,byte[] secretKey) throws Exception {

        SecretKeySpec key = new SecretKeySpec(secretKey, "DESede");
        Cipher cipher = Cipher.getInstance("DESede/ECB/NoPadding"); // TripleDES/ECB/NoPadding
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] cipherText = cipher.doFinal(password);
        return byte2HexStr(cipherText);

    }

    /**
     * 3DES解密
     * @param password 密文
     * @return byte[]形式的明文
     * @throws Exception
     */
    public static byte[] decrypt(String password,byte[] keyBytes) throws Exception {

        byte[] input = hexStr2Bytes(password);
        SecretKeySpec key = new SecretKeySpec(keyBytes, "DESede");
        Cipher cipher = Cipher.getInstance("DESede/ECB/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, key);
        return  cipher.doFinal(input);

    }
    /**
     *  十六进制转成二进制
     * @param src
     * @return
     */
    public static byte[] hexStr2Bytes(String src) {
        int m = 0, n = 0;
        int l = src.length() / 2;
        byte[] ret = new byte[l];
        for (int i = 0; i < l; i++) {
            m = i * 2 + 1;
            n = m + 1;
            ret[i] = uniteBytes(src.substring(i * 2, m), src.substring(m, n));
        }
        return ret;
    }

    private static byte uniteBytes(String src0, String src1) {
        byte b0 = Byte.decode("0x" + src0).byteValue();
        b0 = (byte) (b0 << 4);
        byte b1 = Byte.decode("0x" + src1).byteValue();
        byte ret = (byte) (b0 | b1);
        return ret;
    }

    /**
     *
     * 十六进制字符串转换成byte[]
     * @param hexStr 待转换的字符串
     * @param length  hexStr必须达到的长度
     * @param isLeft 左边补还是右边补
     * @param hexStr 填充的字符
     */
    public static byte[] hexStr2Str(String hexStr) {

        // 因为3DES是对称加密算法，key是24位，当只有16位时，后8位取key的前8位
        StringBuffer sb=new StringBuffer(hexStr);
        sb.append(hexStr.substring(0,16));//字符串是16位， 就是8位byte
        hexStr=sb.toString();

        // 转换的过程
        String str = "0123456789ABCDEF";
        char[] hexs = hexStr.toCharArray();
        byte[] bytes = new byte[hexStr.length() / 2];
        int n;
        for (int i = 0; i < bytes.length; i++) {
            n = str.indexOf(hexs[2 * i]) * 16;
            n += str.indexOf(hexs[2 * i + 1]);
            bytes[i] = (byte) (n & 0xff);
        }
       return bytes;
    }

    /**
     * bytes转换成十六进制字符串
     */
    public static String byte2HexStr(byte[] b) {
        String hs = "";
        String stmp = "";
        for (int n = 0; n < b.length; n++) {
            stmp = (Integer.toHexString(b[n] & 0XFF));
            if (stmp.length() == 1)
                hs = hs + "0" + stmp;
            else hs = hs + stmp;
        }
        return hs.toUpperCase();
    }

    private static byte uniteBytes(byte src0, byte src1) {
         byte _b0 = Byte.decode("0x" + new String(new byte[] { src0 })).byteValue();
         _b0 = (byte) (_b0 << 4);
         byte _b1 = Byte.decode("0x" + new String(new byte[] { src1 })).byteValue();
         byte ret = (byte) (_b0 ^ _b1);
         return ret;
     }

    /**
     *  对pin进行加密
     * @param pin
     * @return
     */
    private static byte[] getHPin(String pin) {

         byte arrPin[] = pin.getBytes();
         byte encode[] = new byte[8];
         encode[0] = (byte) 0x06;
         encode[1] = (byte) uniteBytes(arrPin[0], arrPin[1]);
         encode[2] = (byte) uniteBytes(arrPin[2], arrPin[3]);
         encode[3] = (byte) uniteBytes(arrPin[4], arrPin[5]);
         encode[4] = (byte) 0xFF;
         encode[5] = (byte) 0xFF;
         encode[6] = (byte) 0xFF;
         encode[7] = (byte) 0xFF;
         return encode;
     }
    /**
     * PIN加密的主帐号
     * @param accno
     * @return
     */
    private static byte[] getHAccno(String accno) {
         int len = accno.length();
         byte arrTemp[] = accno.substring(len < 13 ? 0 : len - 13, len - 1).getBytes();
         byte arrAccno[] = new byte[12];
         for (int i = 0; i < 12; i++) {
           arrAccno[i] = (i <= arrTemp.length ? arrTemp[i] : (byte) 0x00);
         }
         byte encode[] = new byte[8];
         encode[0] = (byte) 0x00;
         encode[1] = (byte) 0x00;
         encode[2] = (byte) uniteBytes(arrAccno[0], arrAccno[1]);
         encode[3] = (byte) uniteBytes(arrAccno[2], arrAccno[3]);
         encode[4] = (byte) uniteBytes(arrAccno[4], arrAccno[5]);
         encode[5] = (byte) uniteBytes(arrAccno[6], arrAccno[7]);
         encode[6] = (byte) uniteBytes(arrAccno[8], arrAccno[9]);
         encode[7] = (byte) uniteBytes(arrAccno[10], arrAccno[11]);
         return encode;
     }

    /**
     * PIN BLOCK （PIN按位异或主帐号PAN）
     * @param pin 密码
     * @param accno 账号
    * */
     public static byte[] process(String pin, String accno) {
         byte arrPin[] = getHPin(pin);
         byte arrAccno[] = getHAccno(accno);
         byte arrRet[] = new byte[8];
         //PIN BLOCK 格式等于 PIN 按位异或 主帐号;
         for (int i = 0; i < 8; i++) {
           arrRet[i] = (byte) (arrPin[i] ^ arrAccno[i]);
         }
         return arrRet;
     }

     /**
      * 初始化密钥
      */
     public byte[]  initSecretKey() throws Exception{
         byte[] init= hexStr2Str(HTMK); //将字符串转成16进制的byte[]数组
         return decrypt(HPIN,init); //用 HTMK解密HPIN
     }

     /**
      * 对账号和密码进行加密，生成加密后的密码
      * @param accNo  账号或者卡号
      * @param passwd 密码
      * @return
      * @throws Exception
      */
     public String generatePasswd(String accNo,String passwd) throws Exception{
        byte[] secretKeyBytes=initSecretKey(); //得到密钥
        byte[] pinblock = process(passwd,accNo);
        // 因为3DES是对称加密算法，key是24位，当只有16位时，后8位取key的前8位
        byte[] temp = new byte[24];
        System.arraycopy(secretKeyBytes, 0, temp, 0, secretKeyBytes.length);
        System.arraycopy(secretKeyBytes, 0, temp, secretKeyBytes.length, 8);
        return encrypt(pinblock,temp);

     }

     public static void main(String[] args) throws Exception {
    	 KeyBox KeyBox = new KeyBox();
         try {
            System.out.println(KeyBox.generatePasswd("6224980000003859562","888888"));
         } catch (Exception e) {
            e.printStackTrace();
         }
     }
}