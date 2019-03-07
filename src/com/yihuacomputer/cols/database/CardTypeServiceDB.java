package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CardTypeService;
import com.yihuacomputer.cols.service.FlushCache;


/**
 * �����Ͷ�Ӧ�ķ��������
 * �����������Թɷ����޹�˾
 * 2017-04-18
 */
public class CardTypeServiceDB
{
  public Logger logErr = Logger.getLogger("Error");
  public CardTypeServiceDB()
  {
  }

  /**
   * <p>���ݿ�����ȡ����Ӧ�ķ���</p>
   * @param strCardType  ������
   */
  @SuppressWarnings("rawtypes")
  public List getCardTypeServiceList(String strCardType)
  {
    List CardTypeService = new ArrayList();
    try
    {
      Session session = HibernateUtil.getSession();
      String hql ="select distinct serviceMenuId from CardTypeService where strCardType=:strCardType";
      Query query = session.createQuery(hql);
      query.setString("strCardType", strCardType);
      //���ò�ѯ����
      query.setCacheable(true);
      query.setCacheRegion("CardTypeServiceQueries");

      CardTypeService = query.list();
      //δ�ҵ�
      if (CardTypeService==null||CardTypeService.isEmpty())
        CardTypeService = null;
    }
    catch (Exception e)
    {
      // ��¼��־��ˮ
      logErr.error("���ݿ�����ȡ����Ӧ�ķ���ʧ��:"+e);
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return CardTypeService;
  }

  /**
	* ���ݲ˵�Idɾ�������Ͷ�Ӧ�����в˵���Ϣ
	* �������˵�Id
	* ������  true=�ɹ�  false=ʧ��
  */
  public boolean  delete(int serviceMenuId)
  {
	  boolean bRet = false;
      String sql = "delete from CardTypeService where iServiceMenuId=?";
      Session session = HibernateUtil.getSession();
      Connection dbm = session.connection();
      PreparedStatement pre =null;
      try
      {
	      pre = dbm.prepareStatement(sql);
	      pre.setInt(1, serviceMenuId);
	      HibernateUtil.beginTransaction();
	      pre.execute();
	      HibernateUtil.commitTransaction();
	      bRet = true;
      }
      catch (SQLException err)
      {
    	  err.printStackTrace();
          // ��¼��־��ˮ
          logErr.error("���ݲ˵�Idɾ�������Ͷ�Ӧ�����в˵���Ϣʧ��:"+err);
          HibernateUtil.rollbackTransaction();
          bRet = false;
      }
      finally
      {
    	  try{
    		  if(pre!=null){
    			  pre.close();
    	       }
    	  }catch(Exception e){
          }
    	HibernateUtil.closeSession();
      }
      if (bRet != true){
	      return false;
      }
      //��Ϊϵͳ�����ڼ�Ⱥ�����У�����������ʱ������ʧЧ���ڵ�Ļ��棬����֪ͨ�����ڵ�
      new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=CardTypeService&strKey=&strValue=");
      return true;
  }
  /**
   * ��¼�����Ͷ�Ӧ�ķ���˵���Ϣ
   * ����1����ˮ����
   * ������  true=�ɹ�  false=ʧ��
   */
  public boolean save(CardTypeService entity)
  {
	  boolean bRet = false;
	  PreparedStatement pst =null;
	  Session session = HibernateUtil.getSession();
	  Connection dbm = session.connection();
	  HibernateUtil.beginTransaction();
	  String sql = "insert into CardTypeService(id,strCardType,iServiceMenuId) values (?,?,?)";
      try
      {
          pst = dbm.prepareStatement(sql);
          pst.setInt(1, entity.getId());
          pst.setString(2, entity.getStrCardType());
          pst.setString(3, String.valueOf(entity.getServiceMenuId()));
          pst.addBatch();
          pst.executeBatch();
          HibernateUtil.commitTransaction();
          bRet = true;
      }
      catch (SQLException e)
      {
	      // ��¼��־��ˮ
	      logErr.error("���뿨���Ͷ�Ӧ�ķ�����Ϣʧ��:"+e);
          HibernateUtil.rollbackTransaction();
          bRet = false;
      }
      finally
      {
    	try{
			if(pst!=null){
				pst.close();
		    }
		}catch(Exception e){
		}
    	HibernateUtil.closeSession();
      }
       if (bRet != true){
		      return false;
	   }
	   //��Ϊϵͳ�����ڼ�Ⱥ�����У�����������ʱ������ʧЧ���ڵ�Ļ��棬����֪ͨ�����ڵ�
	   new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=CardTypeService&strKey=&strValue=");
	   return true;
    }
}
