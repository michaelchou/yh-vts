package com.yihuacomputer.cols.service;

import java.awt.Image;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.awt.image.MemoryImageSource;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.params.CoreConnectionPNames;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.w3c.dom.NodeList;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class HostTest {

   public static String chineseFormat(String str)
   {
		  String reg = "[\u4e00-\u9fa5\uFF10-\uFF19]";
		  Pattern pat = Pattern.compile(reg);
		  Matcher mat=pat.matcher(str);
		  String repickStr = mat.replaceAll("");
		  return repickStr;
   }
// ȫ��ת��ǵ� ת������

    public static final String full2HalfChange(String QJstr)
            throws UnsupportedEncodingException {

        StringBuffer outStrBuf = new StringBuffer("");

        String Tstr = "";

        byte[] b = null;

        for (int i = 0; i < QJstr.length(); i++) {

            Tstr = QJstr.substring(i, i + 1);

            // ȫ�ǿո�ת���ɰ�ǿո�

            if (Tstr.equals("��")) {

                outStrBuf.append(" ");

                continue;

            }

            b = Tstr.getBytes("unicode");

            // �õ� unicode �ֽ�����

            if (b[2] == -1) {

                // ��ʾȫ�ǣ�

                b[3] = (byte) (b[3] + 32);

                b[2] = 0;

                outStrBuf.append(new String(b, "unicode"));

            } else {

                outStrBuf.append(Tstr);

            }

        } // end for.

        return outStrBuf.toString();

    }


   /**
    * ȫ��ת���
    * @param input String.
    * @return ����ַ���
    */
   public static String ToDBC(String input) {
            char c[] = input.toCharArray();
            for (int i = 0; i < c.length; i++) {
            	System.out.println("111111111111:"+c[i]+"111111");
              if (c[i] == '\u3000') {
            	  System.out.println("2222222222");
                c[i] = ' ';
              }
              else if (c[i] > '\uFF00' && c[i] < '\uFF5F') {
            	  System.out.println("33333333333");
                c[i] = (char) (c[i] - 65248);

              }
            }
            String returnString = new String(c);
            return returnString;
   }

   /**
   * �Ƿ��������<br>
   * ���ݺ��ֱ��뷶Χ�����ж�<br>
   * CJKͳһ���֣����������ĵģ���������������'���������ȷ��ţ�<br>
   *
   * @param str
   * @return
   */
   public static boolean hasChineseByReg(String str) {
      if (str == null) {
         return false;
      }
      Pattern pattern = Pattern.compile("[\\u4E00-\\u9FBF]+");
      return pattern.matcher(str).find();
   }


	public static void main(String[] args) throws Exception {
		String mxtreq ="<its>"
				+"<langType>CN</langType>"
		        +"<familyAddr>����ʡ�����й�ɽ���ڴ�ɻ���61��</familyAddr>"
		        +"<wordAddr/>"
				+"</its>";
		org.jdom.Document doc = XmlHelper.parseStr2Dom(mxtreq);
		org.jdom.Element rootElement = doc.getRootElement();
		List<org.jdom.Element> list = rootElement.getChildren();
		for (org.jdom.Element el : list) {
           String strValue = el.getText();
           if(hasChineseByReg(strValue)){
        	   rootElement.getChild(el.getName()).setText("srcb");
           }
           if(strValue ==null || strValue.equals(""))
           {
        	   rootElement.getChild(el.getName()).setText("srcb");
           }
		}
		System.out.println(XmlHelper.transformDom2Str(doc, "gb2312").replace("<?xml version=\"1.0\" encoding=\"gb2312\"?>", "").replaceAll("(\r\n|\r|\n|\n\r)", "").replace(" ", "").trim());

		//String strLogPath = "C:\\was\\profiles\\itsapp01\\logs";
		//String strCurDay = new DateCtrl().getTransDateToView();
		//zip(new File(strLogPath), strLogPath + "\\"+strCurDay +".zip" );
		//test2();
		//System.out.println(">>>>>>>>>>>>>>>>:"+fromFenToYuan("1.01"));
//	   String  xmlStr ="<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
//						+"<TransMsg>"
//						+"<strOrigstrTxSerialNo>0405180542916769</strOrigstrTxSerialNo>"
//						 +"<ServerDataTime>2017/06/21 19:01:56</ServerDataTime>"
//						 +"<TermRetCode>0000</TermRetCode>"
//						 +"<TermRetDesc>���׳ɹ�</TermRetDesc>"
//						 +"<TermRetDescEn>Succeed</TermRetDescEn>"
//						 +"<F39_INFO>���׳ɹ�</F39_INFO>"
//						 +"<F11>0405180542916769</F11>"
//						 +"<dataList>&lt;F60&gt;&lt;checkSerialNo&gt;31315040518052030110400448&lt;/checkSerialNo&gt;&lt;idType&gt;00&lt;/idType&gt;&lt;checkStatus&gt;W&lt;/checkStatus&gt;&lt;/F60&gt;</dataList>"
//						 +"<F0>0023</F0>"
//						 +"<F39>0000</F39>"
//						 +"<F3>910301</F3>"
//						 +"<F4>0</F4>"
//						+"</TransMsg>";
//	   org.jdom.Document document = XmlHelper.parseStr2Dom(xmlStr);
//	   System.out.println(MsgXmlDom.getElementValue(XmlHelper.parseStr2Dom(MsgXmlDom.getElementValue(document, "/TransMsg/dataList")),"/F60/checkSerialNo"));
	   //System.out.println(XmlHelper.getSingleNodeValue(document, "its/F60/checkSerialNo", ""));
	}


	public static void zip(File inputFile, String zipFileName) {
		  try {
		   //�����ļ��������out,��ʾ:ע������֧��
		   FileOutputStream out = new FileOutputStream(
		     new String(zipFileName.getBytes("UTF-8")));
		   //���ļ�ݔ��ZIP�����������
		   ZipOutputStream zOut = new ZipOutputStream(out);
		   System.out.println("ѹ��-->��ʼ");

		   zip(zOut, inputFile, "");

		   System.out.println("ѹ��-->����");
		   zOut.close();

		  } catch (Exception e) {
		   e.printStackTrace();
		  }

		 }
	public static void zip(ZipOutputStream zOut, File file, String base) {
		  try {

		   // ����ļ������Ŀ¼
		   if (file.isDirectory()) {
		    //��ȡĿ¼�µ��ļ�
		    File[] listFiles = file.listFiles();
		    // ����ZIP��Ŀ
		    zOut.putNextEntry(new ZipEntry(base + "/"));
		    System.out.println("Ŀ¼��:"+file.getName()+"|����ZIP��Ŀ:"+base+"/");

		    base =( base.length() == 0 ? "" : base + "/" );

		    // ����Ŀ¼���ļ�
		    for (int i = 0; i < listFiles.length; i++) {
		    	if((listFiles[i].getName() != null && !listFiles[i].getName().equals("")) && (listFiles[i].getName().equals("debug.log") || listFiles[i].getName().equals("error.log") || listFiles[i].getName().equals("info.log"))){
		           // �ݹ���뱾����
		           zip(zOut, listFiles[i], base + listFiles[i].getName());
		           deleteFile("C:\\was\\profiles\\itsapp01\\logs"+"\\"+base + listFiles[i].getName());
		    	}
		    }
		   }
		   // ����ļ�������ļ�
		   else {
		    if (base == "") {
		       base = file.getName();
		    }
		    // �����ļ����
		    zOut.putNextEntry(new ZipEntry(base));
		    System.out.println("�ļ���:"+file.getName()+"|����ZIP��Ŀ:"+base);

		    // ��ʼѹ��
		    // ���ļ�������,д��ZIP ����
		    writeFile(zOut,file);
		   }

		  } catch (Exception e) {
		   e.printStackTrace();
		  }

		 }
	public static void writeFile(ZipOutputStream zOut,File file) throws IOException{
		System.out.println("��ʼѹ��"+file.getName());
		  FileInputStream in = new FileInputStream(file);
		  int len;
		  while ((len = in.read()) != -1)
		   zOut.write(len);
		  System.out.println("ѹ������"+file.getName());
		  in.close();
		 }

	public static boolean deleteFile(String fileName) {
        File file = new File(fileName);
        // ����ļ�·������Ӧ���ļ����ڣ�������һ���ļ�����ֱ��ɾ��
        if (file.exists() && file.isFile()) {
            if (file.delete()) {
                System.out.println("ɾ�������ļ�" + fileName + "�ɹ���");
                return true;
            } else {
                System.out.println("ɾ�������ļ�" + fileName + "ʧ�ܣ�");
                return false;
            }
        } else {
            System.out.println("ɾ�������ļ�ʧ�ܣ�" + fileName + "�����ڣ�");
            return false;
        }
    }

	public static void test3(){
		List list1 = new ArrayList();
        List list2 = new ArrayList();
        //��list1��ֵ
        list1.add("1");
        list1.add("2");
        list1.add("3");
        list1.add("4");
        //��list2��ֵ
        list2.add("8");
        list2.add("7");
        list2.add("6");
        list2.add("5");
        //�������
        list2.removeAll(list1);
        list2.addAll(list1);

        for(int i = 0; i < list2.size(); i++) {
            System.out.println(list2.get(i));
        }


	}

	public static void test2(){
		String f0 = "";
		String f3 = "";
		String strRequestMsg = "";
//�ֻ��Ų�ѯ
//		f0 = "0018"; f3 = "901710";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>    <its>     <F52>DCC3F551A6DFA8F8</F52>     <F41>04020191</F41>     <F53>06</F53>     <F55>9F26009F10009F37046307C5CF9F3600950580000000009A0317060382027C009F1A0201569F3303E040609F1E0800000000000000008408A0000003330101019F410800000000000000009F27009C01009F02060000000000005F2A0201569F03060000000000009F34030000009F3501149F080200309F09020020DF3100</F55>     <F11>0402019156846451</F11>     <F12>102726</F12>     <F23>021</F23>     <F13>20170603</F13>     <F24>1</F24>     <F35>6231626031009210547=36122201920F</F35>     <F25>02</F25>     <F36 />     <F0>0018</F0>     <F15>20170603</F15>     <F1>001043314250</F1>     <F2>6231626031009210547</F2>     <F3>901710</F3>     <F999>false</F999>    </its>   ";

		//����ǩԼ��ѯ
//		f0 = "0018"; f3 = "901608";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>     <its>     <F0>0018</F0>     <F1>001043314250</F1>      <F3>901608</F3>      <F11>0402019156846451</F11>      <F12>102726</F12>      <F13>20170603</F13>      <F41>04020191</F41>      <F57>PMBAS</F57>      <F999>false</F999>     </its>    ";

		//�ֻ�����ע��
//		f0 = "0015"; f3 = "908108";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>          <its>          <F0>0015</F0>          <F1>000074123357</F1>           <F3>908108</F3>           <F11>0402019156846451</F11>           <F12>102726</F12>           <F13>20170603</F13>           <F41>04020191</F41>           <F53>06</F53>           <F52>264D19732C66B228</F52>           <F61_1>310224190001010011</F61_1>           <F999>false</F999>          </its>         ";

		//�ֻ�����ע��
//		f0 = "0015"; f3 = "908108";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>          <its>          <F0>0015</F0>          <F1>000074123357</F1>           <F3>908108</F3>           <F11>0402019156846451</F11>           <F12>102726</F12>           <F13>20170603</F13>           <F41>04020191</F41>           <F53>06</F53>           <F52>264D19732C66B228</F52>           <F61_1>310224190001010011</F61_1>           <F999>false</F999>          </its>         ";

//		f0 = "0012"; f3 = "908101";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its> 	<F0>0012</F0> 	<F1>001043314737</F1> 	<F2>6231626031009209549</F2> 	<F3>908101</F3> 	<F11>0402019156846451</F11> 	<F12>102726</F12> 	<F13>20170604</F13> 	<F41>04020191</F41> 	<F53>06</F53> 	<F52>CAB3CFB4FB19DA55</F52> 	<F61_1>612725196001045365</F61_1> 	<F61_6_NM>����</F61_6_NM> 	<email>2342424242@qq.com</email> 	<mobileCall>18512341234</mobileCall> 	<familyCall></familyCall> 	<genderTpCd>M</genderTpCd> 	<birthdayDt>19000101</birthdayDt> 	<regIdAddr>20000101</regIdAddr> 	<F999>false</F999> </its> ";

//		f0 = "0012"; f3 = "908101";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>  <F60>   <email />   <mobileCall>18599999999</mobileCall>   <familyCall />   <genderTpCd>F</genderTpCd>   <birthdayDt />   <regIdAddr>�Ϻ�ũ��</regIdAddr>  </F60>  <F41>0402013B</F41>  <F52>20791D1073100C99</F52>  <F53 />  <F11>0402013B18911968</F11>  <F61_6_NM>����</F61_6_NM>  <F12>223511</F12>  <F13>20170609</F13>  <F0>0012</F0>  <F1>001043314737</F1>  <F2>6231626031009209549</F2>  <F3>908101</F3>  <F999>false</F999>  <F61_1>612725196001045365</F61_1> </its>";

		//�ֻ������޸�
//		f0 = "0013"; f3 = "908104";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>  <F60>   <regIdAddr>�Ϻ�ũ��</regIdAddr>   <mobileCall>18599999999</mobileCall>   <gender>F</gender>  </F60>  <F41>0402013B</F41>  <F52>06CDB83D8E92A8FD</F52>  <F53>06</53>  <F11>0402013B26747250</F11>  <F61_6_NM>����</F61_6_NM>  <F12>132546</F12>  <F13>20170606</F13>  <F0>0013</F0>  <F1>001043314737</F1>  <F2>6231626031009209549</F2>  <F3>908104</F3>  <F999>false</F999>  <F61_1>612725196001045365</F61_1> </its> ";

//		f0 = "0012"; f3 = "908401";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>  <F60>   <mobile>18555555555</mobile>   <transTel>18555555555</transTel>   <address>�Ϻ�ũ��</address>   <gender>1</gender>  </F60>  <F41>0402013B</F41>  <F52>DA5CBF60A5B8FB1C</F52>  <F53>06</F53>  <F61_6_NM />  <F11>0402013B35646889</F11>  <F12>194046</F12>  <F13>20170607</F13>  <F35>6231626031009209515=36122201277</F35>  <F36>996231626031009209515=1561560000000007079003000000034343427010===000000000000745000</F36>  <F0>0012</F0>  <F1>001043314715</F1>  <F2>6231626031009209515</F2>  <F3>908401</F3>  <F999>false</F999>  <F61_1 /> </its>";

//		f0 = "0012"; f3 = "908202";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>  <its>  	<F60>  		<birthDate>19741227</birthDate>  		<address>�Ϻ�ũ��</address>  		<postCode>210102</postCode>  		<tel>18566666666</tel>  		<mobile>18566666666</mobile>  		<gender>0</gender>  	</F60>  	<F41>04051801</F41>  	<F52>97A21625E24EBA04</F52>  	<F53>06</F53>  	<F11>0405180149032031</F11>  	<F12>231130</F12>  	<F13>20170612</F13>  	<F0>0012</F0>  	<F61_6_NM>��÷��</F61_6_NM>  	<F61_1>512922197412273349</F61_1>  	<F1>001043314715</F1>  	<F2>6231626031009209515</F2>  	<F3>908202</F3>  	<F999>false</F999>  </its>  ";

//		f0 = "0012"; f3 = "908202";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>  <its>   <F60>    <birthDate>19911008</birthDate>    <address>�½�������</address>    <postCode>833005</postCode>    <tel>18512354322</tel>    <mobile>18512354322</mobile>    <gender>0</gender>   </F60>   <F41>04051801</F41>   <F52>1C5EB12357F9E708</F52>   <F53>06</F53>   <F11>0405180126689449</F11>   <F61_6_NM>�Ծ���</F61_6_NM>   <F12>031129</F12>   <F13>20170618</F13>   <F0>0012</F0>   <F1>001043348597</F1>   <F2>6231626031009210141</F2>   <F3>908202</F3>   <F999>true</F999>   <F61_1>411627199110083312</F61_1>  </its>";

//		f0 = "0029"; f3 = "911107";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its> 	<F41>0402013B</F41> 	<F11>0402013B06887511</F11> 	<F12>191447</F12> 	<F13>20170609</F13> 	<F0>0029</F0> 	<F3>911107</F3> 	<voucherType>5014</voucherType> 	<voucherStartNo>61000002</voucherStartNo> 	<count>1</count> 	<voucherEndNo>61000002</voucherEndNo> 	<F999>false</F999> </its> ";

		//��ukey
//		f0 = "0029"; f3 = "911101";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>  <its>  	<F41>04051801</F41>  	<F11>0405180116888520</F11>  	<F12>151447</F12>  	<F13>20170614</F13>  	<F0>0029</F0>  	<F3>911101</F3>  	<F59>  		<item>  			<voucherType>5014</voucherType>  			<startNo>61000006</startNo>  			<number>1</number>  			<endNum>61000006</endNum>  		</item>  	</F59>  	<F999>false</F999>  </its>  ";

//		f0 = "0029"; f3 = "911101";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>  <its>  	<F41>04051801</F41>  	<F11>0405180106987523</F11>  	<F12>171447</F12>  	<F13>20170613</F13>  	<F0>0029</F0>  	<F3>911101</F3>  	<F59>  		<item>  			<voucherType>2001</voucherType>  			<startNo>14133301</startNo>  			<number>2</number>  			<endNum>14133302</endNum>  		</item>  	</F59>  	<F999>false</F999>  </its>  ";

//		f0 = "0012"; f3 = "908201";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>  <its>  	<F60>  		<birthDate>19741227</birthDate>  		<address>�Ϻ�ũ��</address>  		<postCode>210102</postCode>  		<tel>18566666666</tel>  		<mobile>18566666666</mobile>  		<gender>0</gender>  		<voucherType>5014</voucherType>  		<voucherNo>61000006</voucherNo>  	</F60>  	<F41>04051801</F41>  	<F52>97A21625E24EBA04</F52>  	<F53>06</F53>  	<F11>0405180159032160</F11>  	<F12>231130</F12>  	<F13>20170612</F13>  	<F0>0012</F0>  	<F61_6_NM>��÷��</F61_6_NM>  	<F61_1>512922197412273349</F61_1>  	<F1>001043314715</F1>  	<F2>6231626031009209515</F2>  	<F3>908201</F3>  	<F999>false</F999>  </its> ";

//		f0 = "0030"; f3 = "906406";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>  <F60>   <buyCode>HKD</buyCode>   <buyAmt>600</buyAmt>   <buyCardName />   <drawType>06</drawType>   <drawPass>AF6BDF0CB7EC56DE</drawPass>   <sellAmt>100</sellAmt>   <sellCode>USD</sellCode>   <authWorker>899</authWorker>   <channel />   <prevScale />   <bandId2 />   <buyAccount>79931010007429862</buyAccount>   <buyAccountKind>0</buyAccountKind>   <buyCardBankbookFlag>1</buyCardBankbookFlag>   <cyCode3>USD</cyCode3>   <custType>0</custType>   <transType />   <inProdType>3502</inProdType>   <inProdSubType>404</inProdSubType>   <outSubAccountType>USD2</outSubAccountType>   <sellCardBankbookFlag>0</sellCardBankbookFlag>   <sellCardNo>6216881031002238058</sellCardNo>   <sellCardName>����׿</sellCardName>   <sellAccount>79931010007429862</sellAccount>   <sellAccountKind>1</sellAccountKind>   <proxyFlag>0</proxyFlag>   <referencePrice>100</referencePrice>   <costPrice>100</costPrice>   <certificateTypeSrcb />   <frontEndSerialNo />   <tradeDate />   <tradeTime />   <voucherType>0</voucherType>   <voucher>6216881031002238058</voucher>   <worker />   <tradeDate />  </F60>  <F22 />  <F23 />  <F25>02</F25>  <F999>true</F999>  <F35 />  <F36 />  <F0>0030</F0>  <F1>001043314250</F1>  <F2>6216881031002238058</F2>  <F3>906406</F3>  <F41>0402013B</F41>  <F49 />  <F52>AF6BDF0CB7EC56DE</F52>  <F53>06</F53>  <F61_6_NM>����׿</F61_6_NM>  <F55 />  <F11>0402013B72307738</F11>  <F12>124507</F12>  <F13>20340906</F13>  <F61_1>352727196707074052</F61_1> </its>";

//		f0 = "0012"; f3 = "908102";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>   <F52>4CF1426D0B298620</F52>   <F41>04051802</F41>   <F53>06</F53>   <F61_6_NM>����</F61_6_NM>   <F11>0405180234196122</F11>   <F22>051</F22>   <F12>051636</F12>   <F23>001</F23>   <F13>20170618</F13>   <F35 />   <F25>02</F25>   <F36 />   <F0>0012</F0>   <F1>001043314737</F1>   <F2>6231626031009209549</F2>   <F3>908102</F3>   <F999>true</F999>   <F61_1>612725196001045365</F61_1>  </its>";

		//ȫ��
//		f0 = "0002"; f3 = "900002";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>  <F52 />  <F41>04051803</F41>  <F53>06</F53>  <F32>14012900</F32>  <F55 />  <F11>0405180332171345</F11>  <F22 />  <F33>14012900</F33>  <F34>79931010007750387</F34>  <F12>121611</F12>  <F23 />  <F57>00100910888            0004CNY0031</F57>  <F35 />  <F13>20170620</F13>  <F36 />  <F25>02</F25>  <F0>0002</F0>  <F15>20170620</F15>  <F49>156</F49>  <F2 />  <F3>900002</F3>  <F4 />  <F999>true</F999>  <F90>00049023010405180332143462</F90> </its>";

		//���ǳ���
		f0 = "0002"; f3 = "900002";
		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>   <its>    <F41>04051801</F41>    <F11>0405180161275445</F11>    <F34>79931010007769321</F34>    <F12>100755</F12>    <F57>0119980001             0004CNY011</F57>    <F13>20170714</F13>    <F25>02</F25>    <F0>0002</F0>    <F49>156</F49>    <F3>900002</F3>    <F999>true</F999>    <F90>00049023010405180196206554</F90>   </its>  ";

//		f0 = "0002"; f3 = "900002";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>  <F52 />  <F41>04051803</F41>  <F53>06</F53>  <F32>14012900</F32>  <F55 />  <F11>0405180332171345</F11>  <F22 />  <F33>14012900</F33>  <F34>79931010007750387</F34>  <F12>121611</F12>  <F23 />  <F57>00100910888            0004CNY0031</F57>  <F35 />  <F13>20170620</F13>  <F36 />  <F25>02</F25>  <F0>0002</F0>  <F15>20170620</F15>  <F49>156</F49>  <F2 />  <F3>900002</F3>  <F4 />  <F999>true</F999>  <F90>00049023010405180332143462</F90> </its>";

		//�Ӵ浥
//		f0 = "0029"; f3 = "911101";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>      <its>      	<F41>04051801</F41>      	<F11>0405180126888522</F11>      	<F12>101447</F12>      	<F13>20170622</F13>      	<F0>0029</F0>      	<F3>911101</F3>      	<F59>      		<item>      			<voucherType>2001</voucherType>      			<startNo>14133316</startNo>      			<number>2</number>      			<endNum>14133317</endNum>      		</item>      	</F59>      	<F999>false</F999>      </its>      ";

//��浥
//		f0 = "0029"; f3 = "911102";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>        <its>        	<F41>04051801</F41>        	<F11>0405180126888533</F11>        	<F12>101447</F12>        	<F13>20170622</F13>        	<F0>0029</F0>        	<F3>911102</F3>        	<F59>        		<item>        			<voucherType>2001</voucherType>        			<startNo>14133301</startNo>        			<number>2</number>        			<endNum>14133302</endNum>        		</item>        	</F59>        	<F999>false</F999>        </its>        ";

		//�忨
//		f0 = "0029"; f3 = "911102";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>              <its>              	<F41>04020191</F41>              	<F11>0402019126888531</F11>              	<F12>101447</F12>              	<F13>20170622</F13>              	<F0>0029</F0>              	<F3>911102</F3>              	<F59>              		<item>              			<voucherType>4001</voucherType>              			<startNo>623162603100920979</startNo>              			<number>7</number>              			<endNum>623162603100920985</endNum>              		</item>              	</F59>              	<F999>false</F999>              </its>              ";

//		f0 = "0009"; f3 = "902111";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>  <F60>   <startDate>20340101</startDate>   <endDate>20350613</endDate>   <startRecordNo>2</startRecordNo>  </F60>  <F52>99EE806DE6C8F654</F52>  <F41>04051802</F41>  <F53>06</F53>  <F55>9F26009F10009F37048CC5ADC99F3600950580000000009A0317062982027C009F1A0201569F3303E040609F1E0800000000000000008408A0000003330101019F410800000000000000009F27009C01009F02060000000000005F2A0201569F03060000000000009F34030000009F3501149F080200309F09020020DF3100</F55>  <F11>0405180213126644</F11>  <F22>051</F22>  <F12>192526</F12>  <F23 />  <F34>79931010007431882</F34>  <F13>20160628</F13>  <F35>6231626031009209523=36122201384F</F35>  <F25>02</F25>  <F36 />  <F0>0009</F0>  <F49 />  <F123>3F0F11</F123>  <F2>6231626031009209523</F2>  <F3>902111</F3>  <F999>false</F999> </its>";

//		f0 = "0014"; f3 = "901606";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its> 	<F41>04051802</F41> 	<F32>14012900</F32> 	<F55 /> 	<F11>0405180287329580</F11> 	<F22 /> 	<F33>14012900</F33> 	<F12>172209</F12> 	<F23 /> 	<F34>79931010007759540</F34> 	<F13>20170702</F13> 	<F35 /> 	<F36>0320000000000000000000=15615600000000=7993101000775954000000=2201000000000000222555570009=0=00000000000000</F36> 	<F25>02</F25> 	<F0>0014</F0> 	<F2 /> 	<F3>901606</F3> 	<F999>false</F999> </its> ";

//		f0 = "0002"; f3 = "900002";
//		strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>  <F52 />  <F41>04051802</F41>  <F53 />  <F32>14012900</F32>  <F55 />  <F11>0405180299012471</F11>  <F22 />  <F33>14012900</F33>  <F34>79931010007759540</F34>  <F12>002332</F12>  <F23 />  <F57>00322255557            0004CNY0003</F57>  <F35 />  <F13>20170704</F13>  <F36 />  <F25>02</F25>  <F0>0002</F0>  <F15>20170704</F15>  <F49>156</F49>  <F2 />  <F3>900002</F3>  <F4>0.00</F4>  <F999>true</F999>  <F90>00049023010405180298810743</F90> </its>";

		pack2(strRequestMsg,f0,f3);

	}

public static void test1() throws UnsupportedEncodingException{
//		String strHtml = "PFRBQkxFIGhlaWdodD0iMjAlIiBjZWxsU3BhY2luZz0wIGNlbGxQYWRkaW5nPTAgd2lkdGg9Ijc1JSIgYWxpZ249Y2VudGVyIGJnQ29sb3I9I2ZmZmZmZiBib3JkZXI9MD4NCjxUQk9EWT4NCjxUUj4NCjxURCBoZWlnaHQ9MjA+PC9URD48L1RSPg0KPFRSPg0KPFREIHdpZHRoPSIzJSI+PC9URD4NCjxURCB3aWR0aD0iNjglIj4NCjxGSUVMRFNFVD48TEVHRU5EPjxTUEFOIGlkPW9Vc2VyVGlwMT7kuKrkurrkv6Hmga88L1NQQU4+PC9MRUdFTkQ+DQo8VEFCTEU+DQo8VEJPRFk+DQo8VFI+DQo8VEQ+Jm5ic3A7Jm5ic3A7PFNQQU4gaWQ9b1RleHROYW1lPuWnk+WQjTo8L1NQQU4+Jm5ic3A7Jm5ic3A7PFNQQU4gaWQ9dGV4dF9uYW1lMT7lrZnli4c8L1NQQU4+PC9URD4NCjxURD4mbmJzcDsmbmJzcDs8U1BBTiBpZD1vVGV4dEV0aD7msJHml486PC9TUEFOPiZuYnNwOyZuYnNwOzxTUEFOIGlkPXRleHRfZXRobmljMT7msYnml488L1NQQU4+PC9URD48L1RSPg0KPFRSPg0KPFREIGNvbFNwYW49ND4mbmJzcDsmbmJzcDs8U1BBTiBpZD1vVGV4dFBpZD7ouqvku73or4Hlj7c6PC9TUEFOPiZuYnNwOyZuYnNwOzxTUEFOIGlkPXRleHRfcGlkMT4zMjAxMjQxOTk0MDUwNjA4MTM8L1NQQU4+PC9URD48L1RSPg0KPFRSPg0KPFREIGNvbFNwYW49ND4mbmJzcDsmbmJzcDs8U1BBTiBpZD1vVGV4dEFkZHI+5Zyw5Z2AOjwvU1BBTj4mbmJzcDsmbmJzcDs8U1BBTiBpZD10ZXh0X2FkZHJlc3MxPuWNl+S6rOW4guaxn+WugeWMuuS4nOWxseihl+mBk+mHkeeulOi3rzLlj7c05bmiMTA05a6kPC9TUEFOPjwvVEQ+PC9UUj48L1RCT0RZPjwvVEFCTEU+PC9GSUVMRFNFVD4gPC9URD4NCjxURCB3aWR0aD0iMyUiPjwvVEQ+PC9UUj4NCjxUUj4NCjxURCBoZWlnaHQ9MjA+PC9URD48L1RSPg0KPFRSPg0KPFREIHdpZHRoPSIzJSI+PC9URD4NCjxURCB3aWR0aD0iNjglIj4NCjxGSUVMRFNFVD48TEVHRU5EPjxTUEFOIGlkPW9Vc2VyVGlwMj7kuqTmmJPkv6Hmga88L1NQQU4+PC9MRUdFTkQ+DQo8VEFCTEU+DQo8VEJPRFk+DQo8VFI+DQo8VEQgY29sU3Bhbj00PiZuYnNwOyZuYnNwOzxTUEFOIGlkPW9UZXh0U3RyUGFuPuWNoeWPtzo8L1NQQU4+Jm5ic3A7Jm5ic3A7PFNQQU4gaWQ9dGV4dF9zdHJQYW4+PC9TUEFOPjwvVEQ+PC9UUj4NCjxUUj4NCjxURD4mbmJzcDsmbmJzcDs8U1BBTiBpZD1vVGV4dE9uZUxpbWl0PuWNleeslOmZkOminTo8L1NQQU4+Jm5ic3A7Jm5ic3A7PFNQQU4gaWQ9dGV4dF90aW1lcz4zMDDlhYM8L1NQQU4+PC9URD4NCjxURD4mbmJzcDsmbmJzcDs8U1BBTiBpZD1vVGV4dERheUxpbWl0Puavj+aXpemZkOminTo8L1NQQU4+Jm5ic3A7Jm5ic3A7PFNQQU4gaWQ9dGV4dF9kYXk+MTAwMOWFgzwvU1BBTj48L1REPg0KPFREPiZuYnNwOyZuYnNwOzxTUEFOIGlkPW9UZXh0Q3Vycnk+5biB56eNOjwvU1BBTj4mbmJzcDsmbmJzcDs8U1BBTiBpZD10ZXh0X0JaPuS6uuawkeW4gTwvU1BBTj48L1REPjwvVFI+DQo8VFI+DQo8VEQ+Jm5ic3A7Jm5ic3A7PFNQQU4gaWQ9b1RleHREYXRlPuS6pOaYk+aXpeacnzo8L1NQQU4+Jm5ic3A7Jm5ic3A7PFNQQU4gaWQ9dGV4dF9kYXRlPjIwMTctMDYtMDY8L1NQQU4+PC9URD4NCjxURD4mbmJzcDsmbmJzcDs8U1BBTiBpZD1vVGV4dFRpbWU+5Lqk5piT5pe26Ze0OjwvU1BBTj4mbmJzcDsmbmJzcDs8U1BBTiBpZD10ZXh0X3RpbWU+MTY6MTc6MjI8L1NQQU4+PC9URD4NCjxURD4mbmJzcDsmbmJzcDs8U1BBTiBpZD1vVGV4dEpvdXI+5Lqk5piT5rWB5rC0OjwvU1BBTj4mbmJzcDsmbmJzcDs8U1BBTiBpZD10ZXh0X2pvdXI+MDA4NTIxMjM8L1NQQU4+PC9URD4NCjxURD4mbmJzcDsmbmJzcDs8U1BBTiBpZD1vVGV4dFRlcm0+5Lqk5piT57uI56uvOjwvU1BBTj4mbmJzcDsmbmJzcDs8U1BBTiBpZD10ZXh0X3Rlcm0+MDQwMjA0MEE8L1NQQU4+PC9URD48L1RSPjwvVEJPRFk+PC9UQUJMRT48L0ZJRUxEU0VUPiA8L1REPg0KPFREIHdpZHRoPSIzJSI+PC9URD48L1RSPg0KPFRSPg0KPFREIGhlaWdodD0yMD48L1REPjwvVFI+PC9UQk9EWT48L1RBQkxFPg==";
//		Base64 base64 = new Base64();
//		String aa = new String(base64.decode(strHtml),"UTF-8");
//		System.out.println(aa);
//		String str = "32012119810717291X";
//		String strBase64 = new Base64().encode(str.getBytes());
//		System.out.println("strBase64:"+strBase64);
//
//		 byte[] base64 = new Base64().decode(strBase64);
//		 str = new String(base64);
//		 System.out.println(str);
//		String xmlStr ="<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
//                 +"<ROOT>"
//                      +"<IMAGES FILE_PART=\"ID_PART\" NOW_VERSION=\"1\">"
//	                  +"<IMAGE LAST_MOD_USER=\"null\" LAST_MOD_TIME=\"20170426\" USEFLAG=\"1\" BUSI_FILE_SCANUSER=\"null\" IS_INDEXTYPE=\"0\" CUS_ID=\"000001574681\" IMG_ID_NOTE=\"null\" FILE_FORMAT=\"jpg\" OPEN_IDENT_IND=\"0\" ISSUED_DEP=\"�Ͼ��й����ֽ����־�\" URL=\"http://10.20.146.164:9081/SunDM/servlet/getImage?FILE_SIZE=8980&amp;OBJ_NAME=jpg&amp;PATH=10.20.146.164:9080/icmrm/ICMResourceManager/41-3BBDAD0E-CC67-8F71-DC14-A46C7C98AA0C.jpg&lt;&lt;WH&gt;&gt;order=retrieve&lt;&lt;YH&gt;&gt;item-id=A1001001A17D26C21625D78454&lt;&lt;YH&gt;&gt;version=1&lt;&lt;YH&gt;&gt;collection=NasCollection&lt;&lt;YH&gt;&gt;libname=icmnlsdb&lt;&lt;YH&gt;&gt;update-date=2017-04-26+14%3A16%3A25.001846&lt;&lt;YH&gt;&gt;token=A4E6.KEEcK_6_Cu4j6VqcKQk;&lt;&lt;YH&gt;&gt;content-length=0\" ID_TP_CD=\"SFZ\" VER=\"null\" MODF=\"0\" FILE_SIZE=\"8980\" FILE_NO=\"41-3BBDAD0E-CC67-8F71-DC14-A46C7C98AA0C\" BUSI_FILE_TYPE=\"null\" PART_NAME=\"ID_PART\" BUSI_FILE_PAGENUM=\"1\" S_VERSION=\"1\" SERIAL_NO=\"16543500\" REF_NO=\"320124199405060813\" DATE=\"20170426\"/>"
//	                  +"<IMAGE LAST_MOD_USER=\"null\" LAST_MOD_TIME=\"20170426\" USEFLAG=\"1\" BUSI_FILE_SCANUSER=\"null\" IS_INDEXTYPE=\"0\" CUS_ID=\"000001574681\" IMG_ID_NOTE=\"null\" FILE_FORMAT=\"bmp\" OPEN_IDENT_IND=\"0\" ISSUED_DEP=\"�Ͼ��й����ֽ����־�\" URL=\"http://10.20.146.164:9081/SunDM/servlet/getImage?FILE_SIZE=1923318&amp;OBJ_NAME=bmp&amp;PATH=10.20.146.164:9080/icmrm/ICMResourceManager/41-D7B02301-1000-5204-5BF6-71BFA4F4E30C.bmp&lt;&lt;WH&gt;&gt;order=retrieve&lt;&lt;YH&gt;&gt;item-id=A1001001A17D26C21625D78739&lt;&lt;YH&gt;&gt;version=1&lt;&lt;YH&gt;&gt;collection=NasCollection&lt;&lt;YH&gt;&gt;libname=icmnlsdb&lt;&lt;YH&gt;&gt;update-date=2017-04-26+14%3A16%3A26.001038&lt;&lt;YH&gt;&gt;token=A4E6.KEEcK_6_41OtVoGYTYI;&lt;&lt;YH&gt;&gt;content-length=0\" ID_TP_CD=\"SFZ\" VER=\"null\" MODF=\"0\" FILE_SIZE=\"1923318\" FILE_NO=\"41-D7B02301-1000-5204-5BF6-71BFA4F4E30C\" BUSI_FILE_TYPE=\"null\" PART_NAME=\"ID_PART\" BUSI_FILE_PAGENUM=\"1\" S_VERSION=\"1\" SERIAL_NO=\"16543500\" REF_NO=\"320124199405060813\" DATE=\"20170426\"/>"
//	                  +"<IMAGE LAST_MOD_USER=\"null\" LAST_MOD_TIME=\"20170426\" USEFLAG=\"1\" BUSI_FILE_SCANUSER=\"null\" IS_INDEXTYPE=\"0\" CUS_ID=\"000001574681\" IMG_ID_NOTE=\"null\" FILE_FORMAT=\"bmp\" OPEN_IDENT_IND=\"0\" ISSUED_DEP=\"�Ͼ��й����ֽ����־�\" URL=\"http://10.20.146.164:9081/SunDM/servlet/getImage?FILE_SIZE=1907126&amp;OBJ_NAME=bmp&amp;PATH=10.20.146.164:9080/icmrm/ICMResourceManager/41-61A8A73F-9AE3-4021-A556-59E2B290137A.bmp&lt;&lt;WH&gt;&gt;order=retrieve&lt;&lt;YH&gt;&gt;item-id=A1001001A17D26C21625D78938&lt;&lt;YH&gt;&gt;version=1&lt;&lt;YH&gt;&gt;collection=NasCollection&lt;&lt;YH&gt;&gt;libname=icmnlsdb&lt;&lt;YH&gt;&gt;update-date=2017-04-26+14%3A16%3A26.001447&lt;&lt;YH&gt;&gt;token=A4E6.KEEcK_6_eTyi1fJUTN_;&lt;&lt;YH&gt;&gt;content-length=0\" ID_TP_CD=\"SFZ\" VER=\"null\" MODF=\"0\" FILE_SIZE=\"1907126\" FILE_NO=\"41-61A8A73F-9AE3-4021-A556-59E2B290137A\" BUSI_FILE_TYPE=\"null\" PART_NAME=\"ID_PART\" BUSI_FILE_PAGENUM=\"1\" S_VERSION=\"1\" SERIAL_NO=\"16543500\" REF_NO=\"320124199405060813\" DATE=\"20170426\"/>"
//	                  +"</IMAGES>"
//	             +"</ROOT>";
//		Document document = DocumentHelper.parseText(xmlStr);
//		getDocDateList(document);

//		String srcfile = "E:\\project\\ATMC_yihua\\cols_bs\\Image\\0402019190528984\\Front.bmp";
//		String dstFile = "E:\\project\\ATMC_yihua\\cols_bs\\Image\\0402019190528984\\Front.jpg";
//		bmpTojpg(srcfile,dstFile);
//
//		srcfile = "E:\\project\\ATMC_yihua\\cols_bs\\Image\\0402019190528984\\back.bmp";
//		dstFile = "E:\\project\\ATMC_yihua\\cols_bs\\Image\\0402019190528984\\back.jpg";
//		bmpTojpg(srcfile,dstFile);
//
//
//
//		HtmlImageGenerator imageGenerator = new HtmlImageGenerator();
//		imageGenerator.loadUrl("http://127.0.0.1:7001/Service/1.html");
//		imageGenerator.setSize(new Dimension(900, 800));
//		imageGenerator.saveAsImage("c:\\test.png");

		/**
		String htmlstr ="<table bgcolor=\"#FFFFFF\" border=\"1\" width=\"1000\" height=\"800\" id=\"tab\" name=\"tab\" border=\"0px\">"
				    +"<tr height=\"30\">"
                        +"<td colspan=\"4\" align=\"center\"><font size=\"30\">�Ϻ�ũ�����и��˵�������ǩԼҵ��������</font></td>"
                    +"</tr>"
                    +"<tr height=\"30\">"
                         +"<td colspan=\"4\"></td>"
                    +"</tr>"
                    +"<tr height=\"30\">"
                         +"<td colspan=\"4\"></td>"
                    +"</tr>"
                    +"<tr height=\"30\">"
                         +"<td colspan=\"4\" aligh=\"left\">�������:YJ20170604101160160F006</td>"
                    +"</tr>"
                    +"<tr height=\"30\">"
                         +"<td colspan=\"4\" aligh=\"left\">�ͻ�������Ϣ:</td>"
                    +"</tr>"
				    +"<tr>"
		                +"<td>����:</td>"
                        +"<td>����</td>"
                        +"<td>�����Ա:</td>"
                        +"<td>160F</td>"
                    +"</tr>"
                    +"<tr>"
                        +"<td>�Ա�:</td>"
                        +"<td>��</td>"
                        +"<td>��˹�Ա:</td>"
                        +"<td>10we45</td>"
                    +"</tr>"
                    +"<tr>"
	                    +"<td>����:</td>"
	                    +"<td>��</td>"
	                    +"<td>���״���:</td>"
	                    +"<td>1006</td>"
                    +"</tr>"
                    +"<tr>"
	                    +"<td>��ˮ��:</td>"
	                    +"<td>20161218101160160160F0049</td>"
	                    +"<td>֤������:</td>"
	                    +"<td>���֤</td>"
                    +"</tr>"
                    +"<tr>"
	                    +"<td>֤������:</td>"
	                    +"<td>32012119725248010X</td>"
	                    +"<td>������:</td>"
	                    +"<td>101160</td>"
                    +"</tr>"
                    +"<tr>"
	                    +"<td>��Ч����:</td>"
	                    +"<td>20270615</td>"
	                    +"<td>�ն˺�:</td>"
	                    +"<td>04020191</td>"
                    +"</tr>"
                    +"<tr>"
	                    +"<td>ǩ֤����:</td>"
	                    +"<td>�Ͼ��н����������־�</td>"
	                    +"<td>��������:</td>"
	                    +"<td>20170605</td>"
                    +"</tr>"
	                +"<tr>"
	                    +"<td>��ϵ�绰:</td>"
	                    +"<td>13307896324</td>"
	                    +"<td>����ʱ��:</td>"
	                    +"<td>11:45</td>"
                    +"</tr>"
	                +"<tr>"
	                    +"<td>��ϵ��ַ:</td>"
	                    +"<td>�Ͼ��а����Ŵ��50��-���������з���Ӫ����A��9¥</td>"
	                    +"<td>ָ�Ʊ��:</td>"
	                    +"<td></td>"
                    +"</tr>"
                    +"<tr height=\"30\">"
                         +"<td colspan=\"4\"></td>"
                    +"</tr>"
                    +"<tr height=\"30\">"
                         +"<td colspan=\"4\"><hr></td>"
                    +"</tr>"
                    +"<tr height=\"30\">"
                         +"<td colspan=\"4\" aligh=\"left\">ҵ������:</td>"
                    +"</tr>"
				    +"<tr>"
		                 +"<td>ȫ����:</td>"
	                     +"<td>�ѿ�ͨ</td>"
	                     +"<td>��ȫ��֤�ֻ���:</td>"
	                     +"<td>13307896324</td>"
	               +"</tr>"
                   +"<tr>"
	                     +"<td>��������ҵ��:</td>"
	                     +"<td>����    K��</td>"
	                     +"<td></td>"
	                     +"<td></td>"
                   +"</tr>"
                   +"<tr>"
	                     +"<td>��������ҵ��:</td>"
	                     +"<td>����    ���</td>"
	                     +"<td>ǩԼ�ֻ�����:</td>"
	                     +"<td>13307896324</td>"
                   +"</tr>"
                   +"<tr>"
	                     +"<td>��������ҵ��:</td>"
	                     +"<td>�ѿ�ͨ</td>"
	                     +"<td></td>"
	                     +"<td></td>"
                   +"</tr>"
                   +"<tr>"
	                     +"<td>������Ϣ����ҵ��:</td>"
	                     +"<td>δ��ͨ</td>"
	                     +"<td>�����ֻ�����:</td>"
	                     +"<td></td>"
                   +"</tr>"
                   +"<tr>"
	                     +"<td>�绰����ҵ��:</td>"
	                     +"<td>�¿�ͨ   ���(�°�)</td>"
	                     +"<td></td>"
	                     +"<td></td>"
                   +"</tr>"
                   +"<tr>"
	                     +"<td>����ת��ǩԼҵ��:</td>"
	                     +"<td>�¿�ͨ   ÿ�����ת���޶�50000Ԫ</td>"
	                     +"<td></td>"
	                     +"<td></td>"
                  +"</tr>"
                  +"<tr>"
		                 +"<td>ȫ�����޶�ҵ��:</td>"
		                 +"<td>�ѿ�ͨ</td>"
		                 +"<td></td>"
		                 +"<td></td>"
                  +"</tr>"
                  +"<tr>"
	                    +"<td>���������޶�ҵ��:</td>"
	                    +"<td>�¿�ͨ</td>"
	                    +"<td></td>"
	                    +"<td></td>"
                  +"</tr>"
                  +"<tr>"
	                    +"<td>pos�޶�ҵ��:</td>"
	                    +"<td>�¿�ͨ</td>"
	                    +"<td></td>"
	                    +"<td></td>"
                  +"</tr>"
                  +"<tr>"
	                    +"<td>��ȫ��֤���߹�����:</td>"
	                    +"<td>K��:0Ԫ&nbsp;&nbsp;&nbsp;&nbsp;K��:0Ԫ&nbsp;&nbsp;&nbsp;&nbsp;���:0Ԫ</td>"
	                    +"<td></td>"
	                    +"<td></td>"
                  +"</tr>"
                  +"<tr height=\"30\">"
                        +"<td colspan=\"4\"></td>"
                  +"</tr>"
                  +"<tr height=\"30\">"
                       +"<td colspan=\"4\"><hr></td>"
                  +"</tr>"
                  +"<tr>"
	                   +"<td colspan=\"2\">���֤��ӡ������:</td>"
	                   +"<td colspan=\"2\">���֤��ӡ������:</td>"
                  +"</tr>"
                  +"<tr>"
                       +"<td colspan=\"2\"><img src='http://127.0.0.1:7001/File/0402019133360973/Front.jpg' width=\"420\" height=\"330\"/></td>"
                       +"<td colspan=\"2\"><img src='http://127.0.0.1:7001/File/0402019133360973/back.jpg' width=\"420\" height=\"330\"/></td>"
                  +"</tr>"
                  +"<tr>"
                       +"<td colspan=\"2\">�����˲���Ƭ:</td>"
                       +"<td colspan=\"2\">�ֳ������Ƭ:</td>"
                  +"</tr>"
                  +"<tr>"
                       +"<td colspan=\"2\"><img src=\"http://127.0.0.1:7001/File/0402019133360973/Card.jpg\" width=\"102\" height=\"126\"/></td>"
                       +"<td colspan=\"2\"><img src=\"http://127.0.0.1:7001/File/0402019133360973/Card.jpg\" width=\"420\" height=\"330\"/></td>"
                  +"</tr>"
                  +"<tr>"
                       +"<td colspan=\"4\">�˲���:������ݺ���������һ�£��Ҵ�����Ƭ��</td>"
                  +"</tr>"
                  +"<tr height=\"30\">"
                       +"<td colspan=\"4\"><hr></td>"
                  +"</tr>"
                  +"<tr>"
	                   +"<td colspan=\"4\">�ͻ���ŵ:</td>"
                  +"</tr>"
                  +"<tr>"
                      +"<td colspan=\"4\">    ���˱�֤���ṩ�ĸ���������Ϣ��ʵ����Ч��������ϸ�˽����ҵ���³̣�ҵ��Э��</td>"
                  +"</tr>"
                  +"<tr>"
                      +"<td></td>"
                      +"<td align=\"right\" colspan=\"2\"><font size=\"6\"><strong>�ͻ���дǩ��:</strong></font><img src='http://127.0.0.1:7001/File/0402019133360973/Signature.jpg' width=\"120\" height=\"38\"/></td>"
                      +"<td><font size=\"6\"><strong>����:</font>"+new Date().toLocaleString().substring(0, 8)+"</td>"
                 +"</tr>"
                +"</table>";
		HtmlImageGenerator imageGenerator = new HtmlImageGenerator();
		imageGenerator.loadHtml(htmlstr);
		imageGenerator.getBufferedImage();
		imageGenerator.saveAsImage("c:\\test.png");

        */
		String aa = "http://10.20.146.164:9081/SunDM/servlet/getImage?FILE_SIZE=568034&amp;OBJ_NAME=jpg&amp;PATH=10.20.146.164:9080/icmrm/ICMResourceManager/41-32912887-DA18-20A1-1135-DA5077BA4460.jpg&lt;&lt;WH&gt;&gt;order=retrieve&lt;&lt;YH&gt;&gt;item-id=A1001001A17F07B70728I25954&lt;&lt;YH&gt;&gt;version=1&lt;&lt;YH&gt;&gt;collection=NasCollection&lt;&lt;YH&gt;&gt;libname=icmnlsdb&lt;&lt;YH&gt;&gt;update-date=2017-06-07+09%3A07%3A29.001369&lt;&lt;YH&gt;&gt;token=A4E6.KHdazE6_vMTobfsIIKY;&lt;&lt;YH&gt;&gt;content-length=0";
		//String aa ="http://10.20.146.164:9081/SunDM/servlet/getImage?FILE_SIZE=1332383&amp;OBJ_NAME=bmp&amp;PATH=10.20.146.164:9080/icmrm/ICMResourceManager/41-36EF062E-548C-05EB-84C3-BBCC6A07A17D.bmp&lt;&lt;WH&gt;&gt;order=retrieve&lt;&lt;YH&gt;&gt;item-id=A1001001A17E23B64829E58520&lt;&lt;YH&gt;&gt;version=1&lt;&lt;YH&gt;&gt;collection=NasCollection&lt;&lt;YH&gt;&gt;libname=icmnlsdb&lt;&lt;YH&gt;&gt;update-date=2017-05-23+08%3A48%3A30.000334&lt;&lt;YH&gt;&gt;token=A4E6.KGOONU6_8Nzbe3xbTX6;&lt;&lt;YH&gt;&gt;content-length=0";
		//String aa = "http://10.20.146.164:9081/SunDM/servlet/getImage?FILE_SIZE=1332383&amp;OBJ_NAME=bmp&amp;PATH=10.20.146.164:9080/icmrm/ICMResourceManager/41-778EBA6C-B11A-6575-B42D-E0EB448776FF.bmp&lt;&lt;WH&gt;&gt;order=retrieve&lt;&lt;YH&gt;&gt;item-id=A1001001A17E23B64829E58791&lt;&lt;YH&gt;&gt;version=1&lt;&lt;YH&gt;&gt;collection=NasCollection&lt;&lt;YH&gt;&gt;libname=icmnlsdb&lt;&lt;YH&gt;&gt;update-date=2017-05-23+08%3A48%3A30.000743&lt;&lt;YH&gt;&gt;token=A4E6.KGOONU6_HKPSbWxGqV_;&lt;&lt;YH&gt;&gt;content-length=0";
		//String aa = "http://10.20.146.164:9081/SunDM/servlet/getImage?FILE_SIZE=1332383&amp;OBJ_NAME=jpg&amp;PATH=10.20.146.164:9080/icmrm/ICMResourceManager/41-3B6E7196-B686-9125-315C-204E033EFA98.jpg&lt;&lt;WH&gt;&gt;order=retrieve&lt;&lt;YH&gt;&gt;item-id=A1001001A17E24B10207G79169&lt;&lt;YH&gt;&gt;version=1&lt;&lt;YH&gt;&gt;collection=NasCollection&lt;&lt;YH&gt;&gt;libname=icmnlsdb&lt;&lt;YH&gt;&gt;update-date=2017-05-24+03%3A02%3A08.000586&lt;&lt;YH&gt;&gt;token=A4E6.KGSOhU6_bLVk3bkmEuc;&lt;&lt;YH&gt;&gt;content-length=0";
		String a = new MsgXmlDom().decodeXml(aa);
		System.out.println(a);
//		String fileName = "C:\\InterVerify.ini";
//        List cardList = getCardTypes(fileName);
//		String strPathXML = pathXML();
//		SAXBuilder sb=new SAXBuilder();
//		File xmlFile = new File(strPathXML);
//		if (xmlFile.exists()) {
//			try {
//				Document document=sb.build(xmlFile);
//				String strMacValue =  new XmlHelper().getSingleNodeValue(document,"/MappingRule/Mac/field","");
//			    System.out.println(strMacValue);
//			}
//			catch (JDOMException e1) {
//				System.out.println("�������������ļ�����:"+e1);
//			}
//		}
//		String str= "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
//				+"<its>"
//					+"<F11>0402019193002718</F11>"
//					+"<F12>221642</F12>"
//					+"<F0>0016</F0>"
//					+"<F3>911201</F3>"
//					+"<F53 />"
//					+"<F41>04020191</F41>"
//					+"<F13>20170413</F13>"
//				+"</its>";
//		org.jdom.Document priDoc = XmlHelper.parseStr2Dom(str);
//		Iterator<Map.Entry<String, String>> entries = priDoc.entrySet().iterator();
//		System.out.println(XmlHelper.getSingleNodeValue(priDoc, "its/F0", ""));
//		unpack();
//		String strData2ValidateMac="";
//		String aa = "F1=1111&F2=22222&F3=22222&Mac=22222";
//		int iMacIndex = aa.lastIndexOf("Mac");
//		System.out.println("*********:"+iMacIndex);
//		try {
//			strData2ValidateMac = aa.substring(0,iMacIndex + 4);
//		} catch (Exception e) {
//		}
//		System.out.println("*********:"+strData2ValidateMac);
//		String strXmlRequestData="<b>aaaaa</b><a>aaaaa</a><Mac>aaaa</Mac>";
//		  String strData2ValidateMac = strXmlRequestData.substring(0, strXmlRequestData.indexOf("<Mac>"));
//			strData2ValidateMac +=strXmlRequestData.substring(strXmlRequestData.indexOf("</Mac>")+6);
//		  System.out.println(strData2ValidateMac);
//		String filePath =  pathXML();
//		String requestMsg = organizeInfo(filePath,"request");
//		String str = "<node>adfa��sgas��164765��ԭ��</node><node>ad��fasga����s164��765</node>";
//
//	     String reg = "[\u4e00-\u9fa5]";
//
//	     Pattern pat = Pattern.compile(reg);
//
//	     Matcher mat=pat.matcher(str);
//
//	     String repickStr = mat.replaceAll("");
//
//	     System.out.println("ȥ���ĺ�:"+repickStr);
//		 new ZipUtil().extractile("C:\\Users\\Administrator\\Desktop\\51\\0402019133360973.7z","D:\\0402019133360973");
//	     String strFilePath = "C:\\Front.bmp";
//	     System.out.println(strFilePath.substring(strFilePath.lastIndexOf('\\')+1, strFilePath.lastIndexOf('.')));

	}

	public static void unpack(){
         String aa ="<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        		 +"<its>"
        		 	+"<F60>"
        		 	+"<seqNo>0001</seqNo>"
        		 	+"<productType>3501</productType>"
        		 	+"</F60>"
        		 	+"<F49>CNY</F49>"
        		 	+"<F43>CHNSHCNQSHRCC</F43>"
        		 	+"<F42>14012900</F42>"
        		 	+"<F41>04020191</F41>"
        		 	+"<F11>0402019164150306</F11>"
        		 	+"<F12>030912</F12>"
        		 	+"<F100>14012900</F100>"
        		 	+"<F18>6011</F18>"
        		 	+"<F7>20170408030912</F7>"
        		 	+"<F15>20170408</F15>"
        		 	+"<F13>20170408</F13>"
        		 	+"<F0>0009</F0>"
        		 	+"<F4>0</F4>"
        		 	+"<F3>902110</F3>"
        		 	+"<F59>"
        		 		+"<item>"
        		 			+"<seqNo1>00</seqNo1>"
        		 			+"<seqNo2 />"
        		 			+"<acctNo>79931010007429862</acctNo>"
        		 			+"<depositTerm>000</depositTerm>"
        		 			+"<seqNo>02</seqNo>"
        		 			+"<volumeNo>000</volumeNo>"
        		 			+"<basePeriod />"
        		 			+"<acctBalance>+1013.250</acctBalance>"
        		 			+"<endDate />"
        		 			+"<openDate>29042034</openDate>"
        		 			+"<productSubType>0204</productSubType>"
        		 			+"<intRate>+9.0000</intRate>"
        		 			+"<productType>3502</productType>"
        		 		+"</item>"
        		 		+"<item>"
    		 				+"<seqNo1>01</seqNo1>"
    		 				+"<seqNo2 />"
    		 				+"<acctNo>79931010007429862</acctNo>"
    		 				+"<depositTerm>000</depositTerm>"
    		 				+"<seqNo>02</seqNo>"
    		 				+"<volumeNo>000</volumeNo>"
    		 				+"<basePeriod />"
    		 				+"<acctBalance>+1013.250</acctBalance>"
    		 				+"<endDate />"
    		 				+"<openDate>29042034</openDate>"
    		 				+"<productSubType>0204</productSubType>"
    		 				+"<intRate>+9.0000</intRate>"
    		 				+"<productType>3502</productType>"
    		 		+"</item>"
        		 	+"</F59>"
        		 	+"<F2>6231626031009210547</F2>"
        		 	+"<F53>06</F53>"
        		 	+"<F52>A5FB745AF5DA8A00</F52>"
        		 	+"<F39_INFO>ͬ�⽻��</F39_INFO>"
        		 	+"<F25>02</F25>"
        		 	+"<F24>300</F24>"
        		 	+"<F23>021</F23>"
        		 	+"<F22>021</F22>"
        		 	+"<F36 />"
        		 	+"<F35>6231626031009210547=36122201920F</F35>"
        		 	+"<F37>0100190443</F37>"
        		 	+"<F39>0000</F39>"
        		 	+"<F32>14012900</F32>"
        		 	+"<F34>79931010007429862</F34>"
        		 	+"<F33>14012900</F33>"
        		 +"</its>";
         org.jdom.Document recDoc = XmlHelper.parseStr2Dom(aa);
         analyzeRequest(recDoc);
	}

	//���
	public static void pack2(String strRequestMsg,String f0, String f3){
		String strPathXML = pathXML();
//		String strRequestMsg = organizeInfo(strPathXML,"request");//��װ������
    	HttpClient httpClient = new DefaultHttpClient();
		httpClient.getParams().setIntParameter(CoreConnectionPNames.SO_TIMEOUT, 20000);
		httpClient.getParams().setIntParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 20000);
//			String httpUrl = "http://10.20.43.63:5080/ITS?f0=0027&f3=902107";
		String httpUrl = "http://10.20.156.51:5080/ITS?f0="+ f0 +"&f3=" + f3;

		HttpPost httpPost = new HttpPost(httpUrl);
		try {
			// �������������,���뷽ʽΪutf-8
			StringEntity entity = new StringEntity(strRequestMsg, "UTF-8");
			// ��������ͷ��Ϣ
			Header header = new BasicHeader("Content-Type","application/xml;charset=UTF-8");
			entity.setContentType(header);
			httpPost.setEntity(entity);
			// ��������
			HttpResponse response = httpClient.execute(httpPost);
			StatusLine statusLine = response.getStatusLine();
			if(statusLine.getStatusCode() == 200){
				System.out.println("send msg success:"+httpUrl + "\r\n");
				HttpEntity receiveEntity = response.getEntity();//�õ�entity
				if (entity != null) {
					 InputStream inputStream = receiveEntity.getContent();//�õ��ӷ������˷��ص�������
		             long length = receiveEntity.getContentLength();
					 if(length<=0) return;
					 int len = (int)length;
					 byte[] receiveDate = new byte[len];
					 int readCount = 0;
					 //�����·�ʽ��inputStreamΪb��ֵ
					 while (readCount < len) {
					    readCount += inputStream.read(receiveDate, readCount, len - readCount);
					 }
					 String s = new String(receiveDate, "UTF-8");
					 org.jdom.Document recDoc = XmlHelper.parseStr2Dom(s);
					 String  strRecDate= XmlHelper.transformDom2Str(recDoc, "UTF-8");
					 System.out.println("��Ӧ����:"+"\r\n"+strRecDate);
				}
			}else{
				System.out.println("send msg fail:"+"["+statusLine.getStatusCode()+"]"+httpUrl+ strRequestMsg + "\r\n");
			}

		} catch (Exception e) {
			System.out.println("send msg fail"+httpUrl+ strRequestMsg + " ������Ϣ:"+e.getMessage()+"\r\n");
		} finally {
			httpClient.getConnectionManager().shutdown();
		}
	}

	//���
	public static void pack(){
		String strPathXML = pathXML();
		String strRequestMsg = organizeInfo(strPathXML,"request");//��װ������
//		String strRequestMsg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <its>  <F60>   <mobileCall />   <birthdayDt />  </F60>  <F52>4EC61FB0EEE5D789</F52>  <F41>04020191</F41>  <F53>06</F53>  <F61_6_NM>����׿</F61_6_NM>  <F55>9F26009F10009F37049C55F24C9F3600950580000000009A0317053182027C009F1A0201569F3303E040609F1E0800000000000000008408A0000003330101019F410800000000000000009F27009C01009F02060000000000005F2A0201569F03060000000000009F34030000009F3501149F080200309F09020020DF3100</F55>  <F11>0402019118982081</F11>  <F22>021</F22>  <F12>162301</F12>  <F23>001</F23>  <F13>20170531</F13>  <F35>6231626031009210547=36122201920F</F35>  <F25>02</F25>  <F36 />  <F48>2</F48>  <F0>0015</F0>  <F15>20170531</F15>  <F2>6231626031009210547</F2>  <F3>902502</F3>  <F999>false</F999>  <F61_1>352727196707074052</F61_1> </its>";
    	HttpClient httpClient = new DefaultHttpClient();
		httpClient.getParams().setIntParameter(CoreConnectionPNames.SO_TIMEOUT, 20000);
		httpClient.getParams().setIntParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 20000);
//		String httpUrl = "http://10.20.43.63:5080/ITS?f0=0027&f3=902107";
		String httpUrl = "http://10.20.156.51:5080/ITS?f0=0015&f3=902502";

		HttpPost httpPost = new HttpPost(httpUrl);
		try {
			// �������������,���뷽ʽΪutf-8
			StringEntity entity = new StringEntity(strRequestMsg, "UTF-8");
			// ��������ͷ��Ϣ
			Header header = new BasicHeader("Content-Type","application/xml;charset=UTF-8");
			entity.setContentType(header);
			httpPost.setEntity(entity);
			// ��������
			HttpResponse response = httpClient.execute(httpPost);
			StatusLine statusLine = response.getStatusLine();
			if(statusLine.getStatusCode() == 200){
				System.out.println("send msg success:"+httpUrl + "\r\n");
				HttpEntity receiveEntity = response.getEntity();//�õ�entity
				if (entity != null) {
					 InputStream inputStream = receiveEntity.getContent();//�õ��ӷ������˷��ص�������
		             long length = receiveEntity.getContentLength();
					 if(length<=0) return;
					 int len = (int)length;
					 byte[] receiveDate = new byte[len];
					 int readCount = 0;
					 //�����·�ʽ��inputStreamΪb��ֵ
					 while (readCount < len) {
					    readCount += inputStream.read(receiveDate, readCount, len - readCount);
					 }
					 String s = new String(receiveDate, "UTF-8");
					 org.jdom.Document recDoc = XmlHelper.parseStr2Dom(s);
					 String  strRecDate= XmlHelper.transformDom2Str(recDoc, "UTF-8");
					 System.out.println("��Ӧ����:"+"\r\n"+strRecDate);
				}
			}else{
				System.out.println("send msg fail:"+"["+statusLine.getStatusCode()+"]"+httpUrl+ strRequestMsg + "\r\n");
			}

		} catch (Exception e) {
			System.out.println("send msg fail"+httpUrl+ strRequestMsg + " ������Ϣ:"+e.getMessage()+"\r\n");
		} finally {
			httpClient.getConnectionManager().shutdown();
		}
	}
	//��ȡ���������ļ�
    public static String pathXML(){
    	String path = "E:\\project\\ATMC_yihua\\cols_bs\\";//��ȡ����·��
    	String classpath=path+"xml";
		StringBuffer filePath = new StringBuffer(64);
        filePath.append(classpath);
        filePath.append(File.separator);
        filePath.append("TransXml");
        filePath.append(File.separator);
        filePath.append("Platform");
        filePath.append(File.separator);
        path = filePath.toString();
        path = path+"911101.xml";
        return path;
    }

    //��װ������
	@SuppressWarnings("unchecked")
	public static String organizeInfo(String filePath,String transType)
	{
    	System.out.println("===========��װ�����Ŀ�ʼ===========");
    	RequestMessage requestMessage =  new RequestMessage();
    	Map<String, String> priMap = new HashMap<String, String>();
		SAXReader saxread = new SAXReader();
		File xmlFile = new File(filePath);
		if (xmlFile.exists()) {
			try {
				org.dom4j.Document document = saxread.read(xmlFile);
				List<Element> list = document.selectNodes("/MappingRule/"+transType+"/field"); //�ҵ�λ��RouteRule�µ�role�ڵ�
				for (int i = 0; i < list.size(); i++) {
					String strName="";//Ψһ��ʶ
					String strValue="";//ֵ
					org.dom4j.Element element=list.get(i);
					strName=((org.dom4j.Element) element.selectSingleNode("id")).getTextTrim(); //Ψһ��ʶ
					String strSource=((org.dom4j.Element) element.selectSingleNode("strSource")).getTextTrim(); //ȡֵ��ʽ
	                if(strSource != null && strSource.equals("$"))//��ƽ̨��ȡ
	                {
	                	String strDestKey=((org.dom4j.Element) element.selectSingleNode("strDestKey")).getTextTrim(); //ƽ̨ȡֵ�ֶ�����
	                }
	                else if (strSource != null && strSource.equals("$$"))//ȡĬ��ֵ
	                {
	                	strValue=((org.dom4j.Element) element.selectSingleNode("strDefaultValue")).getTextTrim(); //Ĭ��ֵ
	                }
	                priMap.put(strName, strValue);
	                if(strName.equals("voucherType,startNo,number,endNum")){
	                	priMap.put(strName, "1,0000001,50,0000100|2,0000101,50,0000110|2,0000101,50,0000110|");
	                }
				}
		        try {
		        	requestMessage.appendContentPrimary(priMap);
		        	System.out.println("������:"+"\r\n"+requestMessage.getRequestText());
		        } catch (Exception e) {
		        	System.out.println("��װ�����ĳ���:"+e);
		        }
			} catch (DocumentException e1) {
				System.out.println("�������������ļ�����:"+e1);
			}
		}
		System.out.println("===========��װ�����Ľ���==========="+"\r\n");
		return requestMessage.getRequestText();
	}
    //�ֽ⽻��������Ϣ
    /**
     * @param domReq
     */
    @SuppressWarnings("unchecked")
	public static void analyzeRequest(org.jdom.Document domReq){
    	String strChildNodeValue = "";//�ӽڵ��ֵ
    	strChildNodeValue = "";
    	Map <String,String> map = new HashMap<String, String>();
    	org.jdom.Element root = domReq.getRootElement();
    	List<?> list=root.getChildren();//�������еĽڵ�Ԫ��
        for(int i=0;i<list.size();i++)
        {
        	org.jdom.Element element=(org.jdom.Element)list.get(i);//���˱������е�disk�ڵ�
        	String key=element.getName();
        	String value=element.getText();
        	org.jdom.Element elementChild = root.getChild(key);
        	List<org.jdom.Element> children = elementChild.getChildren();
        	if(children !=null && children.size() > 0){
    			String  strRecDate= XmlHelper.transformDom2Str(domReq, "UTF-8");
    			int iFiledStart = strRecDate.lastIndexOf("<"+key+">");
    			int iFiledEnd = strRecDate.lastIndexOf("</"+key+">");
    			strChildNodeValue = strChildNodeValue + strRecDate.substring(iFiledStart, iFiledEnd+("</"+key+">").length());
        	}else{
        		map.put(key, value);
        	}
        }
    	System.out.println(">>>>>>>>>>>>>>>:"+strChildNodeValue);
    }
    //��ȡ������
	public static List<String> getCardTypes(String fileName) throws Exception{
		String strCardType ="";//��������
		String strCardTrack ="";//��bin��ʶ
		File file = new File(fileName);
		BufferedReader br = new BufferedReader(new FileReader(file));//����һ��BufferedReader������ȡ�ļ�
		List<String> list = new ArrayList<String>();//���ڴ�Ŷ�ȡ����������ֵ
		String s = null;
		while((s = br.readLine())!=null){//ʹ��readLine������һ�ζ�һ��
			if(s.indexOf("CardType") != -1){
				strCardType = s.split("=")[1];  //�ָ��ַ���ȡ=���ұߵ�ֵ
			}
			if(s.indexOf("VerifyStrVal") != -1){  //�ж����ڶ�ȡ����һ���Ƿ����VerifyStrVal����
				String VerifyStrVal = s.split("=")[1];  //�ָ��ַ���ȡ=���ұߵ�ֵ
				//list.add(VerifyStrVal.replace(" ","")); //ȥ���ո�
				System.out.println("�����ͣ�"+strCardType+"    ��BIN:"+VerifyStrVal.replace(" ",""));
			}
		}
		br.close();
		return list;
	}

	//����XML�ļ�
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static List getDocDateList(Document document)
	{
		List<Element> list = document.selectNodes("/ROOT/IMAGES/IMAGE"); //�ҵ�λ��RouteRule�µ�role�ڵ�
		for (int i = 0; i < list.size(); i++) {
			Element element=list.get(i);
			List<Attribute> listAttr=element.attributes();//��ǰ�ڵ���������Ե�list
			for(Attribute attr:listAttr){//������ǰ�ڵ����������
				 String name=attr.getName();//��������
				 String value=attr.getValue();//���Ե�ֵ
				 System.out.println("�������ƣ�"+name+"����ֵ��"+value);
			}
		}
		return null;
	}

	public static void bmpTojpg(String file,String dstFile)
	    {
	        try
	        {
	            FileInputStream in = new FileInputStream(file);
	            Image TheImage = read(in);
	            int wideth = TheImage.getWidth(null);
	            int height = TheImage.getHeight(null);
	            BufferedImage tag = new BufferedImage(wideth, height, BufferedImage.TYPE_INT_RGB);
	            tag.getGraphics().drawImage(TheImage, 0, 0, wideth, height, null);
	            FileOutputStream out = new FileOutputStream(dstFile);
	            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
	            encoder.encode(tag);
	            out.close();
	        }
	        catch (Exception e)
	        {
	            System.out.println(e);
	        }
	    }
	public static int constructInt(byte[] in, int offset)
	    {
	        int ret = ((int) in[offset + 3] & 0xff);
	        ret = (ret << 8) | ((int) in[offset + 2] & 0xff);
	        ret = (ret << 8) | ((int) in[offset + 1] & 0xff);
	        ret = (ret << 8) | ((int) in[offset + 0] & 0xff);
	        return (ret);
	    }
	    public static int constructInt3(byte[] in, int offset)
	    {
	        int ret = 0xff;
	        ret = (ret << 8) | ((int) in[offset + 2] & 0xff);
	        ret = (ret << 8) | ((int) in[offset + 1] & 0xff);
	        ret = (ret << 8) | ((int) in[offset + 0] & 0xff);
	        return (ret);
	    }
	    public static long constructLong(byte[] in, int offset)
	    {
	        long ret = ((long) in[offset + 7] & 0xff);
	        ret |= (ret << 8) | ((long) in[offset + 6] & 0xff);
	        ret |= (ret << 8) | ((long) in[offset + 5] & 0xff);
	        ret |= (ret << 8) | ((long) in[offset + 4] & 0xff);
	        ret |= (ret << 8) | ((long) in[offset + 3] & 0xff);
	        ret |= (ret << 8) | ((long) in[offset + 2] & 0xff);
	        ret |= (ret << 8) | ((long) in[offset + 1] & 0xff);
	        ret |= (ret << 8) | ((long) in[offset + 0] & 0xff);
	        return (ret);
	    }
	    public static double constructDouble(byte[] in, int offset)
	    {
	        long ret = constructLong(in, offset);
	        return (Double.longBitsToDouble(ret));
	    }
	    public static short constructShort(byte[] in, int offset)
	    {
	        short ret = (short) ((short) in[offset + 1] & 0xff);
	        ret = (short) ((ret << 8) | (short) ((short) in[offset + 0] & 0xff));
	        return (ret);
	    }

	static class BitmapHeader
	    {
	        public int iSize, ibiSize, iWidth, iHeight, iPlanes, iBitcount, iCompression, iSizeimage, iXpm, iYpm, iClrused, iClrimp;
	        // ��ȡbmp�ļ�ͷ��Ϣ
	        public void read(FileInputStream fs) throws IOException
	        {
	            final int bflen = 14;
	            byte bf[] = new byte[bflen];
	            fs.read(bf, 0, bflen);
	            final int bilen = 40;
	            byte bi[] = new byte[bilen];
	            fs.read(bi, 0, bilen);
	            iSize = constructInt(bf, 2);
	            ibiSize = constructInt(bi, 2);
	            iWidth = constructInt(bi, 4);
	            iHeight = constructInt(bi, 8);
	            iPlanes = constructShort(bi, 12);
	            iBitcount = constructShort(bi, 14);
	            iCompression = constructInt(bi, 16);
	            iSizeimage = constructInt(bi, 20);
	            iXpm = constructInt(bi, 24);
	            iYpm = constructInt(bi, 28);
	            iClrused = constructInt(bi, 32);
	            iClrimp = constructInt(bi, 36);
	       }
	    }

	public static Image read(FileInputStream fs)
	    {
	        try
	        {
	            BitmapHeader bh = new BitmapHeader();
	            bh.read(fs);
	            if (bh.iBitcount == 24)
	            {
	                return (readImage24(fs, bh));
	            }
	            if (bh.iBitcount == 32)
	            {
	                return (readImage32(fs, bh));
	            }
	            fs.close();
	        }
	        catch (IOException e)
	        {
	            System.out.println(e);
	        }
	        return (null);
	    }
	//24λ
	    protected static Image readImage24(FileInputStream fs, BitmapHeader bh) throws IOException
	    {
	        Image image;
	        if (bh.iSizeimage == 0)
	        {
	            bh.iSizeimage = ((((bh.iWidth * bh.iBitcount) + 31) & ~31) >> 3);
	            bh.iSizeimage *= bh.iHeight;
	        }
	        int npad = (bh.iSizeimage / bh.iHeight) - bh.iWidth * 3;
	        int ndata[] = new int[bh.iHeight * bh.iWidth];
	        byte brgb[] = new byte[(bh.iWidth + npad) * 3 * bh.iHeight];
	        fs.read(brgb, 0, (bh.iWidth + npad) * 3 * bh.iHeight);
	        int nindex = 0;
	        for (int j = 0; j < bh.iHeight; j++)
	        {
	            for (int i = 0; i < bh.iWidth; i++)
	            {
	                ndata[bh.iWidth * (bh.iHeight - j - 1) + i] = constructInt3(brgb, nindex);
	                nindex += 3;
	            }
	            nindex += npad;
	        }
	        image = Toolkit.getDefaultToolkit().createImage(
	                new MemoryImageSource(bh.iWidth, bh.iHeight, ndata, 0, bh.iWidth));
	        fs.close();
	        return (image);
	    }
	    //32λ
	    protected static Image readImage32(FileInputStream fs, BitmapHeader bh) throws IOException
	    {
	        Image image;
	        int ndata[] = new int[bh.iHeight * bh.iWidth];
	        byte brgb[] = new byte[bh.iWidth * 4 * bh.iHeight];
	        fs.read(brgb, 0, bh.iWidth * 4 * bh.iHeight);
	        int nindex = 0;
	        for (int j = 0; j < bh.iHeight; j++)
	        {
	            for (int i = 0; i < bh.iWidth; i++)
	            {
	                ndata[bh.iWidth * (bh.iHeight - j - 1) + i] = constructInt3(brgb, nindex);
	                nindex += 4;
	            }
	        }
	        image = Toolkit.getDefaultToolkit().createImage(
	                new MemoryImageSource(bh.iWidth, bh.iHeight, ndata, 0, bh.iWidth));
	        fs.close();
	        return (image);
    }

	    /**
	     * ��ת��ΪԪ.
	     *
	     * @param fen
	     *            ��
	     * @return Ԫ
	    */
	    public static String fromFenToYuan(String fen) {
	  	  if(fen.indexOf(".") != -1){
	           return fen;
		  }
	            String yuan = "";
	            final int MULTIPLIER = 100;
	            fen = String.valueOf(Integer.parseInt(fen));
	            Pattern pattern = Pattern.compile("^[1-9][0-9]*{1}");
	            Matcher matcher = pattern.matcher(fen);
	            if (matcher.matches()) {
	                yuan = new BigDecimal(fen).divide(new BigDecimal(MULTIPLIER)).setScale(2).toString();
	            } else {
	                System.out.println("������ʽ����ȷ!");
	            }
	            return yuan;
	    }

}