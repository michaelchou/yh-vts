package com.yihuacomputer.cols.entity;

/**
 * ����������
 * �����������Թɷ����޹�˾
 * 2017-01-17
 */
public class CardUnitStatus
{
    private int id;                 //���
    private String strTerminalNum;  //�ն˱��
    private int cuNum;              //�������к�
    private String strCuType;       //��������
    private int initialCount;       //�����ʼ����
    private int curCount;           //��ǰ����
    private String strCuStatus;     //��ǰ״̬
    private String strCardType;     //������
    private String strCardTrackStart;//��ʼ����
    private String strCardTrackEnd;//��������
    private int cardSuccCount;     //�����ɹ�����
    private int cardCaptureCount;  //�����ɹ��̿�����
    private int cardDestroyCount;  //��������
    private int cardUnknown;       //״̬δ֪�̿�����
    private int cardTakenCount;//�����ͳɹ������ǿͻ�δȡ�ߣ����ܻ�Ա��������

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
	public String getStrCardType() {
		return strCardType;
	}
	public void setStrCardType(String strCardType) {
		this.strCardType = strCardType;
	}
	public String getStrCardTrackStart() {
		return strCardTrackStart;
	}
	public void setStrCardTrackStart(String strCardTrackStart) {
		this.strCardTrackStart = strCardTrackStart;
	}
	public String getStrCardTrackEnd() {
		return strCardTrackEnd;
	}
	public void setStrCardTrackEnd(String strCardTrackEnd) {
		this.strCardTrackEnd = strCardTrackEnd;
	}
	public int getCardSuccCount() {
		return cardSuccCount;
	}
	public void setCardSuccCount(int cardSuccCount) {
		this.cardSuccCount = cardSuccCount;
	}
	public int getCardCaptureCount() {
		return cardCaptureCount;
	}
	public void setCardCaptureCount(int cardCaptureCount) {
		this.cardCaptureCount = cardCaptureCount;
	}
	public int getCardDestroyCount() {
		return cardDestroyCount;
	}
	public void setCardDestroyCount(int cardDestroyCount) {
		this.cardDestroyCount = cardDestroyCount;
	}
	public int getCardUnknown() {
		return cardUnknown;
	}
	public void setCardUnknown(int cardUnknown) {
		this.cardUnknown = cardUnknown;
	}
	public int getCardTakenCount() {
		return cardTakenCount;
	}
	public void setCardTakenCount(int cardTakenCount) {
		this.cardTakenCount = cardTakenCount;
	}
}
