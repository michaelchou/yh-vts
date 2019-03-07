CREATE  OR REPLACE PROCEDURE ITS.DAYPROCESS(OUT RetCode int)

BEGIN
	 --定义返回编号
          declare SQLCODE int default 0;
          declare SQLMESSAGE VARCHAR(50) default '00000';
	 --定义时间戳变量
	      declare DaySuccessTimestamp VARCHAR(50) ;
	 --声明出错处理
          DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
          begin
            set SQLMESSAGE='99999';
          end;
     --正文开始
       -- 第一步：日终统计
       --1、取上次日终统计成功交易笔数的timestamp
	    select strValue into DaySuccessTimestamp from Misc where strName='DaySuccessTimestamp';
            if (SQLCODE=100) then
	        insert into Misc(id,strName,strValue,strDesc,strOrgNum) values(99999998,'DaySuccessTimestamp','2017-07-22-00.00.00.000000','日终统计成功交易的时间戳','00001');
	      	set  DaySuccessTimestamp='2017-07-22-00.00.00.000000';    --
	    end if;
      -- 第二步：将流水或已清机交易数据移至历史库,且删除已迁移的数据
           --1.迁移卡清机批次表
           insert into CardSettleCycleLogHis select * from CardSettleCycleLog  where  iStatus=1;
           --2.卡交易流水表
           insert into CardTransLogHis select * from CardTransLog where iSettleCycleStatus=1;
           --3.迁移存单清机批次表
           insert into CDSSettleCycleLogHis select * from CDSSettleCycleLog  where  iStatus=1;
           --4.存单交易流水表
           insert into CDSTransLogHis select * from CDSTransLog where iSettleCycleStatus=1;
           --5.迁移UKEY清机批次表
           insert into UKeySettleCycleLogHis select * from UKeySettleCycleLog  where  iStatus=1;
           --6.UKEY交易流水表
           insert into UKeyTransLogHis select * from UKeyTransLog where iSettleCycleStatus=1;
           --7.其他交易流水表
           insert into OtherTransLogHis select * from OtherTransLog;
		   --8.迁移现金加钞尾箱表
		   insert into SettleCycleLogHis select * from SettleCycleLog where  isStatus=1;
		   --9.迁移取款流水表
		   insert into TransLogWithdrawalHis select * from TransLogWithdrawal where isettleCycleStatus=1;
		   --10.迁移存款流水表
		   insert into TransLogDepositHis select * from TransLogDeposit where isettleCycleStatus=1;
		   
           --清除表数据
	       delete from CardSettleCycleLog where iStatus=1;
	       delete from CardTransLog where iSettleCycleStatus=1;
	       delete from CDSSettleCycleLog where iStatus=1;
	       delete from CDSTransLog where iSettleCycleStatus=1;
	       delete from UKeySettleCycleLog where iStatus=1;
	       delete from UKeyTransLog where iSettleCycleStatus=1;
	       delete from OtherTransLog;
		   delete from SettleCycleLog where isStatus=1;
		   delete from TransLogWithdrawal where isettleCycleStatus=1;
		   delete from TransLogDeposit where isettleCycleStatus=1;
		   
           update Misc set strValue=TIMESTAMP_ISO(current date) where strName='DaySuccessTimestamp';
	   commit;
	   set RetCode=0;
END@
 
CREATE OR REPLACE PROCEDURE ITS.CLEARCASH(IN STRTERMNUMIN VARCHAR(16), OUT RETCODE INT)

BEGIN

    declare SQLCODE int default 0;
  --声明出错处理
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  begin
    set RETCODE=SQLCODE;    
    ROLLBACK ;
  end;  

 -- 第一步：1.更新终端加钞
  update settleCyclelog set  isStatus=1,dtEnd= current timestamp  where  isStatus=0   and  STRTERMINALNUM=STRTERMNUMIN;

	update TransLogWithdrawal set iSettleCycleStatus=1 where  iSettleCycleStatus=0 and STRTERMINALNUM=STRTERMNUMIN;  
	   
	update TransLogDeposit set iSettleCycleStatus=1 where iSettleCycleStatus=0  and  STRTERMINALNUM=STRTERMNUMIN;
      
   commit;
	
	set RETCODE=0;
END@