package com.yihuacomputer.cols.entity;

/**
 * �浥������
 * �����������Թɷ����޹�˾
 * 2017-05-03
 */
public class CDSUnitStatus
{
    private int id;                 //���
    private String strTerminalNum;  //�ն˱��
    private int cuNum;              //�浥�����к�
    private String strCuType;       //�浥������
    private int initialCount;       //�浥���ʼ����
    private int curCount;           //��ǰ����
    private String strCuStatus;     //��ǰ״̬
    private String strCdsTrackStart;//��ʼ�浥��
    private String strCdsTrackEnd;//�����浥��
    private int cdsSuccCount;     //���浥�ɹ�����
    private int cdsCaptureCount;  //���浥�ɹ��̴浥����
    private int cdsDestroyCount;  //���浥����
    private int cdsUnknown;       //״̬δ֪�̴浥����
    private int cdsTakenCount;//�浥���ͳɹ������ǿͻ�δȡ�ߣ����ܻ�Ա��������

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public String getStrTerminalNum() {
		return strTerminalNum;
	}
	public void setStrTerminalNum(String strTerminalNum) {
		this.strTerminalNum = strTerminalNum;
	}
	public int getCuNum() {
		return cuNum;
	}
	public void setCuNum(int cuNum) {
		this.cuNum = cuNum;
	}
	public String getStrCuType() {
		return strCuType;
	}
	public void setStrCuType(String strCuType) {
		this.strCuType = strCuType;
	}
	public int getInitialCount() {
		return initialCount;
	}
	public void setInitialCount(int initialCount) {
		this.initialCount = initialCount;
	}
	public int getCurCount() {
		return curCount;
	}
	public void setCurCount(int curCount) {
		this.curCount = curCount;
	}
	public String getStrCuStatus() {
		return strCuStatus;
	}
	public void setStrCuStatus(String strCuStatus) {
		this.strCuStatus = strCuStatus;
	}
	public String getStrCdsTrackStart() {
		return strCdsTrackStart;
	}
	public void setStrCdsTrackStart(String strCdsTrackStart) {
		this.strCdsTrackStart = strCdsTrackStart;
	}
	public String getStrCdsTrackEnd() {
		return strCdsTrackEnd;
	}
	public void setStrCdsTrackEnd(String strCdsTrackEnd) {
		this.strCdsTrackEnd = strCdsTrackEnd;
	}
	public int getCdsSuccCount() {
		return cdsSuccCount;
	}
	public void setCdsSuccCount(int cdsSuccCount) {
		this.cdsSuccCount = cdsSuccCount;
	}
	public int getCdsCaptureCount() {
		return cdsCaptureCount;
	}
	public void setCdsCaptureCount(int cdsCaptureCount) {
		this.cdsCaptureCount = cdsCaptureCount;
	}
	public int getCdsDestroyCount() {
		return cdsDestroyCount;
	}
	public void setCdsDestroyCount(int cdsDestroyCount) {
		this.cdsDestroyCount = cdsDestroyCount;
	}
	public int getCdsUnknown() {
		return cdsUnknown;
	}
	public void setCdsUnknown(int cdsUnknown) {
		this.cdsUnknown = cdsUnknown;
	}
	public int getCdsTakenCount() {
		return cdsTakenCount;
	}
	public void setCdsTakenCount(int cdsTakenCount) {
		this.cdsTakenCount = cdsTakenCount;
	}
}
