package com.yihuacomputer.cols.entity;

/**
 * UKey������
 * �����������Թɷ����޹�˾
 * 2017-05-03
 */
public class UKeyUnitStatus
{
    private int id;                 //���
    private String strTerminalNum;  //�ն˱��
    private int cuNum;              //UKey�����к�
    private String strCuType;       //UKey������
    private int initialCount;       //UKey���ʼ����
    private int curCount;           //��ǰ����
    private String strCuStatus;     //��ǰ״̬
    private String strUKeyType;     //UKey����
    private String strUKeyTrackStart;//��ʼUKey��
    private String strUKeyTrackEnd;//����UKey��
    private int uKeySuccCount;     //��UKey�ɹ�����
    private int uKeyCaptureCount;  //��UKey�ɹ��̿�����
    private int uKeyDestroyCount;  //��UKey����
    private int uKeyUnknown;       //״̬δ֪��UKey����
    private int uKeyTakenCount;//UKey���ͳɹ������ǿͻ�δȡ�ߣ����ܻ�Ա��������
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
	public String getStrUKeyType() {
		return strUKeyType;
	}
	public void setStrUKeyType(String strUKeyType) {
		this.strUKeyType = strUKeyType;
	}
	public String getStrUKeyTrackStart() {
		return strUKeyTrackStart;
	}
	public void setStrUKeyTrackStart(String strUKeyTrackStart) {
		this.strUKeyTrackStart = strUKeyTrackStart;
	}
	public String getStrUKeyTrackEnd() {
		return strUKeyTrackEnd;
	}
	public void setStrUKeyTrackEnd(String strUKeyTrackEnd) {
		this.strUKeyTrackEnd = strUKeyTrackEnd;
	}
	public int getuKeySuccCount() {
		return uKeySuccCount;
	}
	public void setuKeySuccCount(int uKeySuccCount) {
		this.uKeySuccCount = uKeySuccCount;
	}
	public int getuKeyCaptureCount() {
		return uKeyCaptureCount;
	}
	public void setuKeyCaptureCount(int uKeyCaptureCount) {
		this.uKeyCaptureCount = uKeyCaptureCount;
	}
	public int getuKeyDestroyCount() {
		return uKeyDestroyCount;
	}
	public void setuKeyDestroyCount(int uKeyDestroyCount) {
		this.uKeyDestroyCount = uKeyDestroyCount;
	}
	public int getuKeyUnknown() {
		return uKeyUnknown;
	}
	public void setuKeyUnknown(int uKeyUnknown) {
		this.uKeyUnknown = uKeyUnknown;
	}
	public int getuKeyTakenCount() {
		return uKeyTakenCount;
	}
	public void setuKeyTakenCount(int uKeyTakenCount) {
		this.uKeyTakenCount = uKeyTakenCount;
	}
}
