CREATE  OR REPLACE PROCEDURE ITS.DAYPROCESS(OUT RetCode int)

BEGIN
	 --���巵�ر��
          declare SQLCODE int default 0;
          declare SQLMESSAGE VARCHAR(50) default '00000';
	 --����ʱ�������
	      declare DaySuccessTimestamp VARCHAR(50) ;
	 --����������
          DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
          begin
            set SQLMESSAGE='99999';
          end;
     --���Ŀ�ʼ
       -- ��һ��������ͳ��
       --1��ȡ�ϴ�����ͳ�Ƴɹ����ױ�����timestamp
	    select strValue into DaySuccessTimestamp from Misc where strName='DaySuccessTimestamp';
            if (SQLCODE=100) then
	        insert into Misc(id,strName,strValue,strDesc,strOrgNum) values(99999998,'DaySuccessTimestamp','2017-07-22-00.00.00.000000','����ͳ�Ƴɹ����׵�ʱ���','00001');
	      	set  DaySuccessTimestamp='2017-07-22-00.00.00.000000';    --
	    end if;
      -- �ڶ���������ˮ���������������������ʷ��,��ɾ����Ǩ�Ƶ�����
           --1.Ǩ�ƿ�������α�
           insert into CardSettleCycleLogHis select * from CardSettleCycleLog  where  iStatus=1;
           --2.��������ˮ��
           insert into CardTransLogHis select * from CardTransLog where iSettleCycleStatus=1;
           --3.Ǩ�ƴ浥������α�
           insert into CDSSettleCycleLogHis select * from CDSSettleCycleLog  where  iStatus=1;
           --4.�浥������ˮ��
           insert into CDSTransLogHis select * from CDSTransLog where iSettleCycleStatus=1;
           --5.Ǩ��UKEY������α�
           insert into UKeySettleCycleLogHis select * from UKeySettleCycleLog  where  iStatus=1;
           --6.UKEY������ˮ��
           insert into UKeyTransLogHis select * from UKeyTransLog where iSettleCycleStatus=1;
           --7.����������ˮ��
           insert into OtherTransLogHis select * from OtherTransLog;
		   --8.Ǩ���ֽ�ӳ�β���
		   insert into SettleCycleLogHis select * from SettleCycleLog where  isStatus=1;
		   --9.Ǩ��ȡ����ˮ��
		   insert into TransLogWithdrawalHis select * from TransLogWithdrawal where isettleCycleStatus=1;
		   --10.Ǩ�ƴ����ˮ��
		   insert into TransLogDepositHis select * from TransLogDeposit where isettleCycleStatus=1;
		   
           --���������
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
  --����������
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  begin
    set RETCODE=SQLCODE;    
    ROLLBACK ;
  end;  

 -- ��һ����1.�����ն˼ӳ�
  update settleCyclelog set  isStatus=1,dtEnd= current timestamp  where  isStatus=0   and  STRTERMINALNUM=STRTERMNUMIN;

	update TransLogWithdrawal set iSettleCycleStatus=1 where  iSettleCycleStatus=0 and STRTERMINALNUM=STRTERMNUMIN;  
	   
	update TransLogDeposit set iSettleCycleStatus=1 where iSettleCycleStatus=0  and  STRTERMINALNUM=STRTERMNUMIN;
      
   commit;
	
	set RETCODE=0;
END@