package com.fyp.presentationmanager.entity;

import com.fyp.presentationmanager.enums.EvaluationType;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Entity
@Table(name = "evaluation_form")
public class EvaluationFormBean implements Serializable {
    public static final String ID = "id";
    public static final String SCHEDULE_ID = "schedule_id";
    public static final String EVALUATION_TYPE = "evaluation_type";
    public static final String MAX_GAP = "max_gap";
    public static final String RUBRIC_URL = "rubric_url";
    private static final long serialVersionUID = 2210958029122976461L;

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = SCHEDULE_ID, nullable = false)
    private Integer scheduleId;

    @Enumerated(EnumType.STRING)
    @Column(name = EVALUATION_TYPE)
    private EvaluationType evaluationType;

    @Column(name = RUBRIC_URL)
    private String rubricUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = SCHEDULE_ID, referencedColumnName = ScheduleBean.ID, insertable = false, updatable = false)
    private ScheduleBean scheduleBean;

    @OneToMany(mappedBy = "evaluationFormBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CriterionBean> criterionBeans;

    @OneToMany(mappedBy = "evaluationFormBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<EvaluationBean> evaluationBeans;

    public EvaluationFormBean() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public EvaluationType getEvaluationType() {
        return evaluationType;
    }

    public void setEvaluationType(EvaluationType evaluationType) {
        this.evaluationType = evaluationType;
    }

    public String getRubricUrl() {
        return rubricUrl;
    }

    public void setRubricUrl(String rubricUrl) {
        this.rubricUrl = rubricUrl;
    }

    public ScheduleBean getScheduleBean() {
        return scheduleBean;
    }

    public void setScheduleBean(ScheduleBean scheduleBean) {
        this.scheduleBean = scheduleBean;
    }

    public List<EvaluationBean> getEvaluationBeans() {
        return evaluationBeans;
    }

    public void setEvaluationBeans(List<EvaluationBean> evaluationBeans) {
        this.evaluationBeans = evaluationBeans;
    }

    public List<CriterionBean> getCriterionBeans() {
        Collections.sort(this.criterionBeans, new Comparator<CriterionBean>() {
            @Override
            public int compare(CriterionBean o1, CriterionBean o2) {
                if (o1.getPosition() == o2.getPosition()) {
                    return 0;
                }
                return o1.getPosition() > o2.getPosition() ? 1 : -1;
            }
        });
        return criterionBeans;
    }

    public Integer calculateWeightage() {
        Integer total = 0;
        if (this.criterionBeans != null) {
            for (CriterionBean criterionBean : this.criterionBeans) {
                total += criterionBean.getWeightage();
            }
        }
        return total;
    }

    public void setCriterionBeans(List<CriterionBean> criterionBeans) {
        this.criterionBeans = criterionBeans;
    }
}
