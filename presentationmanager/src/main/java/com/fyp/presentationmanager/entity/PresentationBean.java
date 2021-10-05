package com.fyp.presentationmanager.entity;

import com.fyp.presentationmanager.model.PresentationModel;

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
    public static final String VENUE_ID = "venue_id";
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

    @Column(name = VENUE_ID)
    private Date venueId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = SCHEDULE_ID, referencedColumnName = ScheduleBean.ID, insertable = false, updatable = false)
    private ScheduleBean scheduleBean;

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

    public Date getVenueId() {
        return venueId;
    }

    public void setVenueId(Date venueId) {
        this.venueId = venueId;
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

    public UserBean getSupervisorBean() {
        return supervisorBean;
    }

    public void setSupervisorBean(UserBean supervisorBean) {
        this.supervisorBean = supervisorBean;
    }
}
