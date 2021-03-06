package com.fyp.presentationmanager.entity;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.enums.ScheduleType;
import com.fyp.presentationmanager.model.ScheduleModel;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "schedule")
public class ScheduleBean implements Serializable {
    public static final String ID = "id";
    public static final String COORDINATOR_ID = "coordinator_id";
    public static final String YEAR = "year";
    public static final String SEM = "sem";
    public static final String TITLE = "title";
    public static final String SCHEDULE_TYPE = "schedule_type";
    public static final String PRESENTATION_TYPE = "presentation_type";
    public static final String DATE_FROM = "date_from";
    public static final String DATE_TO = "date_to";
    public static final String TIME_FROM = "time_from";
    public static final String TIME_TO = "time_to";
    public static final String CREATE_DATE = "create_date";
    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = COORDINATOR_ID, nullable = false)
    private Integer coordinatorId;

    @Column(name = TITLE, nullable = false)
    private String title;

    @Column(name = YEAR)
    private Integer year;

    @Column(name = SEM)
    private Integer sem;

    @Enumerated(EnumType.STRING)
    @Column(name = SCHEDULE_TYPE)
    private ScheduleType scheduleType;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = CREATE_DATE)
    private Date createDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = COORDINATOR_ID, referencedColumnName = UserBean.ID, insertable = false, updatable = false)
    private UserBean coordinator;

    @OneToMany(mappedBy = "scheduleBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PresentationBean> presentationBeans;

    @OneToMany(mappedBy = "scheduleBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<EvaluationFormBean> evaluationFormBeans;

    public ScheduleBean() {
    }

    public ScheduleBean(ScheduleModel scheduleModel) {
        this.year = scheduleModel.getYear();
        this.sem = scheduleModel.getSem();
        this.title = scheduleModel.getTitle();
        this.scheduleType = scheduleModel.getScheduleType();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCoordinatorId() {
        return coordinatorId;
    }

    public void setCoordinatorId(Integer coordinatorId) {
        this.coordinatorId = coordinatorId;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getSem() {
        return sem;
    }

    public void setSem(Integer sem) {
        this.sem = sem;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String course) {
        this.title = course;
    }

    public ScheduleType getScheduleType() {
        return scheduleType;
    }

    public void setScheduleType(ScheduleType scheduleType) {
        this.scheduleType = scheduleType;
    }

    public Date getCreateDate() {
        return createDate;
    }


    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public UserBean getCoordinator() {
        return coordinator;
    }

    public void setCoordinator(UserBean coordinator) {
        this.coordinator = coordinator;
    }


    public List<PresentationBean> getPresentationBeans() {
        return presentationBeans;
    }

    public void setPresentationBeans(List<PresentationBean> presentationBeans) {
        this.presentationBeans = presentationBeans;
    }

    public List<EvaluationFormBean> getEvaluationFormBeans() {
        return evaluationFormBeans;
    }

    public void setEvaluationFormBeans(List<EvaluationFormBean> evaluationFormBeans) {
        this.evaluationFormBeans = evaluationFormBeans;
    }

    public EvaluationFormBean getEvaluationFormBeanOf(EvaluationType evaluationType) {
        if (this.evaluationFormBeans != null) {
            for (EvaluationFormBean evaluationFormBean : this.evaluationFormBeans) {
                if (evaluationFormBean.getEvaluationType().equals(evaluationType)) {
                    return evaluationFormBean;
                }
            }
        }
        return null;
    }
}
