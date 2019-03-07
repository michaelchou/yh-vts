package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.RouteBank;
import com.yihuacomputer.cols.service.FlushCache;

/**
 * ת�˻�·�б�����
 * �����������Թɷ����޹�˾
 * 2017-05-25
 */

public class RouteBankDB {

	public Logger logErr = Logger.getLogger("Error");
	public static final int MAXRS_PERBTACH = 20000;//ÿ�β������ݿ������
	/**
	   * ȡ�����е�ת�˻�·������</p>
	   * list List  ������Ϣ
	*/
	public List<?> getRouteBankList(RouteBank bean)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from RouteBank where strBankTypeCode=:strBankCode and strCCPCCode=:strCCPCCode order by strBankName asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strBankCode", bean.getStrBankTypeCode());
	      query.setString("strCCPCCode", bean.getStrCCPCCode());
	      //���ò�ѯ����
	      query.setCacheable(true);
	      query.setCacheRegion("RouteBankQueries");

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("ȡת�˻�·���б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}


	/**
	 * ɾ������
	 */
	public boolean delete() {
		boolean ret = false;
	    String sql = "delete from RouteBank";
	    Session session = HibernateUtil.getSession();
	    Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    try
	    {
	       PreparedStatement pre = dbm.prepareStatement(sql);
	       pre.execute();
	       HibernateUtil.commitTransaction();
	       ret = true;
	    }
	    catch (SQLException err)
	    {
	    	logErr.error("ɾ��ת�˻�·��Ϣʧ��:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        ret = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return ret;
	}

	/**
	 *  ���������
	*/
	public boolean insert(List<?> list) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
		String sql="insert into RouteBank(strRouteCode,strBankCode,strBankName,strBankType,strBankTypeCode,strSettleBankCode,strCCPCCode,strSizeMark) values (?,?,?,?,?,?,?,?)";
	    try {
	    	pst = dbm.prepareStatement(sql);
	        if (list !=null && list.size() > 0)
	        {
	          for (int i = 0; i < list.size(); i++)
	          {
	        	  pst.setString(1, ((RouteBank)(list.get(i))).getStrRouteCode());
	  	          pst.setString(2, ((RouteBank)(list.get(i))).getStrBankCode());
	  	          pst.setString(3, ((RouteBank)(list.get(i))).getStrBankName());
	  	          pst.setString(4, ((RouteBank)(list.get(i))).getStrBankType());
	  	          pst.setString(5, ((RouteBank)(list.get(i))).getStrBankTypeCode());
	  	          pst.setString(6, ((RouteBank)(list.get(i))).getStrSettleBankCode());
	  	          pst.setString(7, ((RouteBank)(list.get(i))).getStrCCPCCode());
	  	          pst.setString(8, ((RouteBank)(list.get(i))).getStrSizeMark());
	  	          pst.addBatch();
	        	  if (i > 0 && i % MAXRS_PERBTACH == 0)
	       		  {
	        		  pst.executeBatch();
	        		  HibernateUtil.commitTransaction();
	       	      }
	          }
	        }
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }catch(SQLException err) {
	    	logErr.error("������ת�˻�·��Ϣʧ��:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        bRet = false;
	    }finally {
	    	try{
				if(pst!=null){
					pst.close();
			    }
			}catch(Exception e){
			}
	    	HibernateUtil.closeSession();
	    }
	    //��Ϊϵͳ�����ڼ�Ⱥ�����У�����������ʱ������ʧЧ���ڵ�Ļ��棬����֪ͨ�����ڵ�
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=RouteBank&strKey=&strValue=");
	    return bRet;
	}

	/**
	 * ˢ�»���
	 */
	public boolean FlushSession() {
		// ��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("RouteBankQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.gump.entity.RouteBank");
	}
}
