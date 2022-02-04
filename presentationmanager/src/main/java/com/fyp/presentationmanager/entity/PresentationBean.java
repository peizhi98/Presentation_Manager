package com.fyp.presentationmanager.entity;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.enums.PresentationMode;
import com.fyp.presentationmanager.model.presentation.PresentationModel;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "presentation")
public class PresentationBean implements Serializable {
    public static final String ID = "id";
    public static final String SCHEDULE_ID = "schedule_id";
    public static final String SUPERVISOR_ID = "supervisor_id";
    public static final String CHAIRPERSON_ID = "chairperson_id";
    public static final String STUDENT_MATRIX_NO = "student_matrix_no";
    public static final String STUDENT_NAME = "student_name";
    public static final String STUDENT_EMAIL = "student_email";
    public static final String TITLE = "title";
    public static final String MARK = "mark";
    public static final String RESULT_STATUS = "result_status";
    public static final String START_TIME = "start_time";
    public static final String END_TIME = "end_time";
    public static final String CALENDAR_START_TIME = "calendar_start_time";
    public static final String CALENDAR_END_TIME = "calendar_end_time";
    public static final String ROOM_ID = "room_id";
    public static final String MODE = "mode";
    public static final String CALENDAR_ID = "calendar_id";
    public static final String CALENDAR_HTML_LINK = "html_link";
    public static final String LAST_SYNC = "last_sync";
    public static final String GOOGLE_MEET_LINK = "google_meet_link";
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

    @Column(name = STUDENT_MATRIX_NO, nullable = true)
    private String studentMatrixNo;

    @Column(name = STUDENT_NAME, nullable = false)
    private String studentName;

    @Column(name = STUDENT_EMAIL, nullable = false)
    private String studentEmail;

    @Column(name = TITLE)
    private String title;

    @Column(name = START_TIME)
    private Date startTime;

    @Column(name = END_TIME)
    private Date endTime;

    @Column(name = CALENDAR_START_TIME)
    private Date calendarStartTime;

    @Column(name = CALENDAR_END_TIME)
    private Date calendarEndTime;

    @Column(name = ROOM_ID)
    private Integer roomId;

    @Enumerated(EnumType.STRING)
    @Column(name = MODE)
    private PresentationMode mode;

    @Column(name = CALENDAR_ID)
    private String calendarId;

    @Column(name = CALENDAR_HTML_LINK)
    private String calendarHtmlLink;

    @Column(name = LAST_SYNC)
    private Date lastSync;

    @Column(name = GOOGLE_MEET_LINK)
    private String googleMeetLink;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = SCHEDULE_ID, referencedColumnName = ScheduleBean.ID, insertable = false, updatable = false)
    private ScheduleBean scheduleBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = ROOM_ID, referencedColumnName = RoomBean.ID, insertable = false, updatable = false)
    private RoomBean roomBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = SUPERVISOR_ID, referencedColumnName = UserBean.ID, insertable = false, updatable = false)
    private UserBean supervisorBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = CHAIRPERSON_ID, referencedColumnName = UserBean.ID, insertable = false, updatable = false)
    private UserBean chairPersonBean;

    @OneToMany(mappedBy = "presentationBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PresentationPanelBean> presentationPanelBeans;

    @OneToMany(mappedBy = "presentationBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<EvaluationBean> evaluationBeans;

    public PresentationBean() {
    }

    public PresentationBean(PresentationModel presentationModel) {
        this.scheduleId = presentationModel.getScheduleId();
        this.studentMatrixNo = presentationModel.getStudentMatrixNo();
        this.studentEmail = presentationModel.getStudentEmail();
        this.studentName = presentationModel.getStudentName();
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

    public Date getCalendarStartTime() {
        return calendarStartTime;
    }

    public void setCalendarStartTime(Date calendarStartTime) {
        this.calendarStartTime = calendarStartTime;
    }

    public Date getCalendarEndTime() {
        return calendarEndTime;
    }

    public void setCalendarEndTime(Date calendarEndTime) {
        this.calendarEndTime = calendarEndTime;
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

    public List<PresentationPanelBean> getPresentationPanelBeans() {
        return presentationPanelBeans;
    }

    public List<UserBean> getPanelBeans() {
        List<UserBean> panels = new ArrayList<>();
        if (this.presentationPanelBeans != null) {
            for (PresentationPanelBean presentationPanelBean : this.presentationPanelBeans) {
                panels.add(presentationPanelBean.getPanelBean());
            }
        }
        return panels;
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

    public void setPresentationPanelBeans(List<PresentationPanelBean> presentationPanelBeans) {
        this.presentationPanelBeans = presentationPanelBeans;
    }

    public UserBean getChairPersonBean() {
        return chairPersonBean;
    }

    public void setChairPersonBean(UserBean chairPersonBean) {
        this.chairPersonBean = chairPersonBean;
    }

    public RoomBean getRoomBean() {
        return roomBean;
    }

    public void setRoomBean(RoomBean roomBean) {
        this.roomBean = roomBean;
    }

    public UserBean getSupervisorBean() {
        return supervisorBean;
    }

    public void setSupervisorBean(UserBean supervisorBean) {
        this.supervisorBean = supervisorBean;
    }

    public String getStudentMatrixNo() {
        return studentMatrixNo;
    }

    public void setStudentMatrixNo(String studentMatrixNo) {
        this.studentMatrixNo = studentMatrixNo;
    }

    public String getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(String calendarId) {
        this.calendarId = calendarId;
    }

    public Date getLastSync() {
        return lastSync;
    }

    public void setLastSync(Date lastSync) {
        this.lastSync = lastSync;
    }

    public String getGoogleMeetLink() {
        return googleMeetLink;
    }

    public void setGoogleMeetLink(String googleMeetLink) {
        this.googleMeetLink = googleMeetLink;
    }

    public String getCalendarHtmlLink() {
        return calendarHtmlLink;
    }

    public void setCalendarHtmlLink(String calendarHtmlLink) {
        this.calendarHtmlLink = calendarHtmlLink;
    }


    public List<EvaluationBean> getEvaluationBeans() {
        return evaluationBeans;
    }

    public void setEvaluationBeans(List<EvaluationBean> evaluationBeans) {
        this.evaluationBeans = evaluationBeans;
    }

    public boolean isSupervisorId(Integer userId) {
        if (supervisorId.equals(userId)) {
            return true;
        }
        return false;
    }

    public boolean isChairpersonId(Integer userId) {
        if (chairPersonId.equals(userId)) {
            return true;
        }
        return false;
    }

    public boolean isPanelId(Integer userId) {
        if (getPanelBeans() != null) {
            for (UserBean panel : getPanelBeans()) {
                if (panel.getId().equals(userId)) {
                    return true;
                }
            }
        }
        return false;
    }

    public boolean containIn(List<PresentationModel> presentationModels) {
        if (presentationModels != null) {
            for (PresentationModel presentationModel : presentationModels) {
                if (presentationModel.getId().equals(this.id)) {
                    return true;
                }
            }
        }
        return false;
    }

    public boolean isConfirmed() {
        if (this.getEvaluationBeans() != null) {
            for (EvaluationBean e : this.getEvaluationBeans()) {
                if (e.getEvaluationFormBean().getEvaluationType().equals(EvaluationType.CONFIRMATION)) {
                    return true;
                }
            }
        }
        return false;
    }

    public boolean hasPanelWithUsername(String email) {
        if (this.getPresentationPanelBeans() != null) {
            for (PresentationPanelBean pp : this.getPresentationPanelBeans()) {
                if (pp.getPanelBean().getEmail().equals(email)) {
                    return true;
                }
            }
        }
        return false;
    }
}
