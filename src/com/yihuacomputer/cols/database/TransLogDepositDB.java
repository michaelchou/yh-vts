package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.TerminalModule;
import com.yihuacomputer.cols.entity.TransLogDeposit;
import com.yihuacomputer.cols.entity.UKeyTransLog;

public class TransLogDepositDB {
	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ��ȡ��������  ��������״̬��Ϊ0�����׳ɹ�  �ļ�¼
	 * @return
	 */
	public List<?> getGZrecord(String terminalId){
		 List<?> list = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TransLogDeposit  where strTerminalNum=:terminalId and iHostTransStatus!=0 and iSettleCycleStatus=0 "
					+ "and strTransCode in ('909005','909008','909020','909120')";
			Query query = session.createQuery(hql);
			query.setString("terminalId", terminalId);
			list = query.list();
		}
		catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("��ȡ���˴����ˮ����  ʧ��:"+e.getMessage());
		} finally {
			HibernateUtil.closeSession();
		}
		return list;
	}

	/**
	 * ���Ӵ�����ˮ��־
	 * @param transLogDeposit
	 * @return
	 */
	public boolean sava(TransLogDeposit transLogDeposit){
		boolean bRet = false;
		try
		{
		  Session session = HibernateUtil.getSession();
		  HibernateUtil.beginTransaction();
		  session.save(transLogDeposit);
		  HibernateUtil.commitTransaction();
		  bRet = true;
		}
		catch (Exception e)
		{
		  // ��¼��־��ˮ
		  logErr.error("���������ˮ��¼ʧ��:"+e.getMessage());
		  HibernateUtil.rollbackTransaction();
		}
		finally
		{
		  HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ���´��׼�¼
	 * @param transLogDeposit
	 * @return
	 */
	public boolean update(TransLogDeposit transLogDeposit){
		boolean bRet = false;
		try {
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(transLogDeposit);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("���´��׼�¼ʧ��:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}
	/**
	 * ��ѯԭ���׼�¼
	 * @param transLogDeposit
	 * @return
	 */
	public TransLogDeposit getOldTransLog(String strOldOrgTsns,String strTransCode){
		TransLogDeposit strTransLogDeposit = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TransLogDeposit where strTermSerialNo=:strTermSerialNo and strtransCode=:strtransCode";
			Query query = session.createQuery(hql);
			query.setString("strTermSerialNo", strOldOrgTsns);
			query.setString("strtransCode", strTransCode);

			List strTransLogList = query.list();
			if (strTransLogList != null && !strTransLogList.isEmpty() && strTransLogList.size() > 0)
				strTransLogDeposit = (TransLogDeposit) strTransLogList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("��ȡԭ�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return strTransLogDeposit;
	}
	/**
	 * ����ԭ���׼�¼
	 * @param transLogDeposit
	 * @return
	 */
	public boolean updateOldDepositTrans(TransLogDeposit transLogDeposit){
		boolean bRet = update(transLogDeposit);
		 logErr.error("����ˮ����ԭ�����Ϣ:"+bRet);
		return bRet;
	}
	/**
     * ����������ͽ������ȡ����ת���ڲ�����Ϣ</p>
     * strSingleBusinessNum String ���κ�
     * hostTxStatus	int	��������״̬
     * termTxStatus	int	�ն˽���״̬
     * strSuccessful                �Ƿ�ɹ�true/false
     * list List  ����浥������Ϣ
	*/
	public List<?> getTransOutList(String strTransRandom,String strTransCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from TransLogDeposit where strSingleBusinessNum=:strSingleBusinessNum and ihostTransStatus=0 "
	      		+ "and strtransCode=:strtransCode" ;
	      Query query = session.createQuery(hql);
	      query.setString("strSingleBusinessNum", strTransRandom);
	      query.setString("strtransCode", strTransCode);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("��ѯ�ڲ��˴����Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
}
