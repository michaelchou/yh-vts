package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.BranchMap;
import com.yihuacomputer.cols.entity.BrunchRegister;
import com.yihuacomputer.cols.service.FlushCache;

/**
 *����ת��ת�����кű�����
 * �����������Թɷ����޹�˾
 * 2017-07-13
 */

public class BranchMapDB {

	public Logger logErr = Logger.getLogger("Error");
	public static final int MAXRS_PERBTACH = 20000;//ÿ�β������ݿ������

	/**
	 * ɾ������
	 */
	public boolean delete() {
		boolean ret = false;
	    String sql = "delete from BranchMap";
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
	    	logErr.error("ɾ������ת��ת�����кű���Ϣʧ��:"+err.getMessage());
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
		String sql="insert into BranchMap(strLocalRouteCode,strLocalBankCode) values (?,?)";
	    try {
	    	pst = dbm.prepareStatement(sql);
	        if (list !=null && list.size() > 0)
	        {
	          for (int i = 0; i < list.size(); i++)
	          {
	        	  pst.setString(1, ((BranchMap)(list.get(i))).getStrLocalRouteCode());
	  	          pst.setString(2, ((BranchMap)(list.get(i))).getStrLocalBankCode());
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
	    	logErr.error("���������ת��ת�����кű���Ϣʧ��:"+err.getMessage());
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
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=BranchMap&strKey=&strValue=");
	    return bRet;
	}

	/**
	   * ȡ��ת�����кŶ�Ӧ�����������</p>
	   * list List  ת����������Ϣ
	 * @param bean
	*/

	public List<?> getBranchMapNoList(BranchMap bean)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from BranchMap where strLocalRouteCode=:strLocalRouteCode order by strLocalRouteCode asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      //System.out.println(">>>>>>>>>>>>>>>��ѯ��" + bean.getStrLocalRouteCode());
	      query.setString("strLocalRouteCode", bean.getStrLocalRouteCode());

	      //���ò�ѯ����
	      query.setCacheable(true);
	      query.setCacheRegion("BranchMapQueries");

	      list = query.list();

	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      e.printStackTrace();
	    	// ��¼��־��ˮ
		  logErr.error("ȡ�����������ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }

	    return list;
	}

	/**
	 * ˢ�»���
	 */
	public boolean FlushSession() {
		// ��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("BranchMapQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.gump.entity.BranchMap");
	}
}
