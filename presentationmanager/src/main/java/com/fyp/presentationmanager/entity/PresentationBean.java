package com.fyp.presentationmanager.entity;

import com.fyp.presentationmanager.enums.PresentationMode;
import com.fyp.presentationmanager.model.presentation.PresentationModel;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "presentation")
public class PresentationBean implements Serializable {
    public static final String ID = "id";
    public static final String SCHEDULE_ID = "schedule_id";
    public static final String SUPERVISOR_ID = "supervisor_id";
    public static final String CHAIRPERSON_ID = "chairperson_id";
    public static final String STUDENT_NAME = "student_name";
    public static final String STUDENT_EMAIL = "student_email";
    public static final String TITLE = "title";
    public static final String MARK = "mark";
    public static final String RESULT_STATUS = "result_status";
    public static final String START_TIME = "start_time";
    public static final String END_TIME = "end_time";
    public static final String ROOM_ID = "room_id";
    public static final String VENUE = "venue";
    public static final String MODE = "mode";
    private static final long serialVersionUID = -5901102986374700267L;

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = SUPERVISOR_ID, nullable = false)
    private Integer supervisorId;

    @Column(name = CHAIRPERSON_ID)
    private Integer chairPersonId;

    @Column(name = SCHEDULE_ID, nullable = false)
    private Integer scheduleId;

    @Column(name = STUDENT_NAME, nullable = false)
    private String studentName;

    @Column(name = STUDENT_EMAIL, nullable = false)
    private String studentEmail;

    @Column(name = TITLE)
    private String title;

    @Column(name = MARK)
    private Integer mark;

    @Column(name = RESULT_STATUS)
    private Integer resultStatus;

    @Column(name = START_TIME)
    private Date startTime;

    @Column(name = END_TIME)
    private Date endTime;

    @Column(name = ROOM_ID)
    private Integer roomId;

    @Column(name = VENUE)
    private String venue;

    @Enumerated(EnumType.STRING)
    @Column(name = MODE)
    private PresentationMode mode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = SCHEDULE_ID, referencedColumnName = ScheduleBean.ID, insertable = false, updatable = false)
    private ScheduleBean scheduleBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = ROOM_ID, referencedColumnName = PresentationRoomBean.ID, insertable = false, updatable = false)
    private PresentationRoomBean presentationRoomBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = SUPERVISOR_ID, referencedColumnName = UserBean.ID, insertable = false, updatable = false)
    private UserBean supervisorBean;

    @OneToMany(mappedBy = "presentationBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PresentationPanelBean> presentationPanelBeans;

    public PresentationBean() {
    }

    public PresentationBean(PresentationModel presentationModel) {
        this.scheduleId = presentationModel.getScheduleId();
        this.studentEmail = presentationModel.getStudentEmail();
        this.studentName=presentationModel.getStudentName();
        this.title = presentationModel.getTitle();

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSupervisorId() {
        return supervisorId;
    }

    public void setSupervisorId(Integer supervisorId) {
        this.supervisorId = supervisorId;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getMark() {
        return mark;
    }

    public void setMark(Integer mark) {
        this.mark = mark;
    }

    public Integer getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(Integer resultStatus) {
        this.resultStatus = resultStatus;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer venueId) {
        this.roomId = venueId;
    }

    public PresentationMode getMode() {
        return mode;
    }

    public void setMode(PresentationMode mode) {
        this.mode = mode;
    }

    public ScheduleBean getScheduleBean() {
        return scheduleBean;
    }

    public void setScheduleBean(ScheduleBean scheduleBean) {
        this.scheduleBean = scheduleBean;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentSiswaMail) {
        this.studentEmail = studentSiswaMail;
    }

    public Integer getChairPersonId() {
        return chairPersonId;
    }

    public void setChairPersonId(Integer chairPersonId) {
        this.chairPersonId = chairPersonId;
    }

    public List<PresentationPanelBean> getPanelBeans() {
        return presentationPanelBeans;
    }

    public void setPanelBeans(List<PresentationPanelBean> presentationPanelBeans) {
        this.presentationPanelBeans = presentationPanelBeans;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public List<PresentationPanelBean> getPresentationPanelBeans() {
        return presentationPanelBeans;
    }

    public void setPresentationPanelBeans(List<PresentationPanelBean> presentationPanelBeans) {
        this.presentationPanelBeans = presentationPanelBeans;
    }

    public PresentationRoomBean getPresentationRoomBean() {
        return presentationRoomBean;
    }

    public void setPresentationRoomBean(PresentationRoomBean presentationRoomBean) {
        this.presentationRoomBean = presentationRoomBean;
    }

    public UserBean getSupervisorBean() {
        return supervisorBean;
    }

    public void setSupervisorBean(UserBean supervisorBean) {
        this.supervisorBean = supervisorBean;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }
}
