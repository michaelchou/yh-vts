package com.yihuacomputer.cols.common.util;

import org.hibernate.HibernateException;
import org.hibernate.Interceptor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

/**
 * Hibernateҵ���߼�����
 * �����������Թɷ����޹�˾
 * 2016-10-24
 */
public class HibernateUtil
{
    private static Configuration configuration;
    private static SessionFactory sessionFactory;
    private static ThreadLocal threadSession = new ThreadLocal();
    private static ThreadLocal threadTransaction = new ThreadLocal();
    private static ThreadLocal threadInterceptor = new ThreadLocal();

    //����Ĭ�ϵ�Hibernate�����ļ�(hibernate.cfg.xml) ����SessionFactory
    static
    {
        try
        {
            configuration = new Configuration().configure();
            sessionFactory = configuration.buildSessionFactory();
        }
        catch (Exception e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();

        }
    }

    /**
     * �������洴����SessionFactory
     */
    public static SessionFactory getSessionFactory()
    {
        return sessionFactory;
    }

    /**
     * ���ظ���Ĭ�ϵ������ļ�(Hibernate.cfg.xml)��ȡ������������Ϣ
     */
    public static Configuration getConfiguration()
    {
        return configuration;
    }

    /**
     * ���������Configturation���´���һ��SessionFactory����
     */
    public static void rebuildSessionFactory()
    {
      String strException = "";
      synchronized (sessionFactory)
      {
        try
        {
          sessionFactory = getConfiguration().buildSessionFactory();
        }
        catch (Exception e)
        {
          strException += e;
        }
      }
      // ��¼��־��ˮ
      if (strException.length() > 0){

      }
    }

    /**
     * �����û��ṩ��Configuration���´���һ��SessionFactory����
     */
    public static void rebuildSessionFactory(Configuration cfg)
    {
      String strException = "";
      synchronized (sessionFactory)
      {
        try
        {
          configuration = cfg;
          sessionFactory = cfg.buildSessionFactory();
        }
        catch (Exception e)
        {
          strException += e;
        }
      }
      // ��¼��־��ˮ
      if (strException.length() > 0){

      }
    }

    /**
     * ���յ�ǰ�߳������Session����,�����ǰ�߳����治����,�򴴽�һ��Session����
     */
    public static Session getSession()
    {
        Session s = null;
        try
        {
            s = (Session) threadSession.get();
            if (null == s)
            {
                if (getInterceptor() != null)
                {
                    s = getSessionFactory().openSession(getInterceptor());
                }
                else
                {
                    s = getSessionFactory().openSession();
                }
                threadSession.set(s);
            }
        }
        catch (HibernateException e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();

        }
        return s;
    }

    /**
     * �رյ�ǰ�߳����Session����
     */
    public static void closeSession()
    {
        try
        {
            Session s = (Session) threadSession.get();
            if (s != null && s.isOpen())
            {
                threadSession.set(null);
                s.close();
            }
        }
        catch (HibernateException e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();

        }
    }

    /**
     * �����µ����ݿ�����
     */
    public static void beginTransaction()
    {
        Transaction tx = (Transaction) threadTransaction.get();
        try
        {
            if (null == tx)
            {
                tx = getSession().beginTransaction();
                threadTransaction.set(tx);
            }
        }
        catch (HibernateException e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();

        }
    }

    /**
     * �ύ���ݿ�����
     */
    public static void commitTransaction()
    {
        Transaction tx = (Transaction) threadTransaction.get();
        try
        {
            if (tx != null && !tx.wasCommitted() && !tx.wasRolledBack())
            {
                tx.commit();
            }
            threadTransaction.set(null);
        }
        catch (HibernateException e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();
            rollbackTransaction();
        }
    }

    /**
     * �ύ���ݿ�����,�¼��Ļع�
     */
    public static void rollbackTransaction()
    {
        Transaction tx = (Transaction) threadTransaction.get();
        try
        {
            threadTransaction.set(null);
            if (tx != null && !tx.wasCommitted() && !tx.wasRolledBack())
            {
                tx.rollback();
            }
        }
        catch (HibernateException e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();

        }
        finally
        {
            closeSession();
        }
    }

    /**
     * �����ݿ�����
    */

    public static void reconnect(Session session)
    {
        try
        {
            session.reconnect();
            threadSession.set(session);
        }
        catch (HibernateException e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();

        }
    }

    /**
     * �ر����ݿ�����
    */
    public static Session disconnectSession()
    {
        Session session = getSession();
        try
        {
            threadSession.set(null);
            if (session.isConnected() && session.isOpen())
                session.disconnect();
        }
        catch (HibernateException e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();

        }
        return session;
    }

    private static Interceptor getInterceptor()
    {
        Interceptor interceptor = (Interceptor) threadInterceptor.get();
        return interceptor;
    }

    public static void registerInterceptor(Interceptor interceptor)
    {
        threadInterceptor.set(interceptor);
    }

    /**
     * �������������ĳ��������ж���
     * ����1����Ҫ��յ�ʵ����
     * ����ֵ:true=�ɹ� false=���ɹ�
    */
    public static boolean evictSessionFactory(String strTargetClass)
    {
        boolean bRet = false;
        try
        {
            // ��������и�������ж���
            sessionFactory.evictEntity(strTargetClass);
            bRet = true;
        }
        catch (HibernateException e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();

        }
        return bRet;
    }

    /**
     * �����ѯ����
     * ����1����Ҫ��յĲ�ѯ��������
     * ����ֵ:true=�ɹ� false=���ɹ�
    */
    public static boolean evictSessionFactoryQueries(String strTargetQueries)
    {
        boolean bRet = false;
        try
        {
            // �����ѯ����
            sessionFactory.evictQueries(strTargetQueries);
            bRet = true;
        }
        catch (HibernateException e)
        {
            // ��¼��־��ˮ
        	e.printStackTrace();
        }
        return bRet;
    }
}
