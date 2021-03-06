package com.yihuacomputer.cols.common.util;

import org.hibernate.HibernateException;
import org.hibernate.Interceptor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

/**
 * Hibernate业务逻辑操纵
 * 深圳怡化电脑股份有限公司
 * 2016-10-24
 */
public class HibernateUtil
{
    private static Configuration configuration;
    private static SessionFactory sessionFactory;
    private static ThreadLocal threadSession = new ThreadLocal();
    private static ThreadLocal threadTransaction = new ThreadLocal();
    private static ThreadLocal threadInterceptor = new ThreadLocal();

    //根据默认的Hibernate配置文件(hibernate.cfg.xml) 创建SessionFactory
    static
    {
        try
        {
            configuration = new Configuration().configure();
            sessionFactory = configuration.buildSessionFactory();
        }
        catch (Exception e)
        {
            // 记录日志流水
        	e.printStackTrace();

        }
    }

    /**
     * 返回上面创建的SessionFactory
     */
    public static SessionFactory getSessionFactory()
    {
        return sessionFactory;
    }

    /**
     * 返回根据默认的配置文件(Hibernate.cfg.xml)读取出来的配置信息
     */
    public static Configuration getConfiguration()
    {
        return configuration;
    }

    /**
     * 根据上面的Configturation重新创建一个SessionFactory对象
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
      // 记录日志流水
      if (strException.length() > 0){

      }
    }

    /**
     * 根据用户提供的Configuration重新创建一个SessionFactory对象
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
      // 记录日志流水
      if (strException.length() > 0){

      }
    }

    /**
     * 接收当前线程里面的Session对象,如果当前线程里面不存在,则创建一个Session对象
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
            // 记录日志流水
        	e.printStackTrace();

        }
        return s;
    }

    /**
     * 关闭当前线程里的Session对象
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
            // 记录日志流水
        	e.printStackTrace();

        }
    }

    /**
     * 启动新的数据库事务
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
            // 记录日志流水
        	e.printStackTrace();

        }
    }

    /**
     * 提交数据库事务
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
            // 记录日志流水
        	e.printStackTrace();
            rollbackTransaction();
        }
    }

    /**
     * 提交数据库事务,事件的回滚
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
            // 记录日志流水
        	e.printStackTrace();

        }
        finally
        {
            closeSession();
        }
    }

    /**
     * 打开数据库连接
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
            // 记录日志流水
        	e.printStackTrace();

        }
    }

    /**
     * 关闭数据库连接
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
            // 记录日志流水
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
     * 清除二级缓存中某个类的所有对象
     * 参数1：需要清空的实体类
     * 返回值:true=成功 false=不成功
    */
    public static boolean evictSessionFactory(String strTargetClass)
    {
        boolean bRet = false;
        try
        {
            // 清除缓存中该类的所有对象
            sessionFactory.evictEntity(strTargetClass);
            bRet = true;
        }
        catch (HibernateException e)
        {
            // 记录日志流水
        	e.printStackTrace();

        }
        return bRet;
    }

    /**
     * 清除查询缓存
     * 参数1：需要清空的查询缓存区域
     * 返回值:true=成功 false=不成功
    */
    public static boolean evictSessionFactoryQueries(String strTargetQueries)
    {
        boolean bRet = false;
        try
        {
            // 清除查询缓存
            sessionFactory.evictQueries(strTargetQueries);
            bRet = true;
        }
        catch (HibernateException e)
        {
            // 记录日志流水
        	e.printStackTrace();
        }
        return bRet;
    }
}
