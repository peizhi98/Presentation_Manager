package com.fyp.presentationmanager.entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "criteria")
public class CriteriaBean implements Serializable {
    public static final String ID = "id";
    public static final String EVALUATION_FORM_ID = "evaluation_form_id";
    public static final String NAME = "name";
    public static final String WEIGHTAGE = "weightage";
    public static final String SCALE = "scale";
    public static final String CRITERIA_ORDER = "criteria_order";
    private static final long serialVersionUID = 2143776248759271452L;

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = EVALUATION_FORM_ID, nullable = false)
    private Integer evaluationFormId;

    @Column(name = NAME)
    private String name;

    @Column(name = WEIGHTAGE)
    private Integer weightage;

    @Column(name = SCALE)
    private Integer scale;

    @Column(name = CRITERIA_ORDER)
    private Integer criteriaOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = EVALUATION_FORM_ID, referencedColumnName = EvaluationFormBean.ID, insertable = false, updatable = false)
    private EvaluationFormBean evaluationFormBean;

    public CriteriaBean() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getEvaluationFormId() {
        return evaluationFormId;
    }

    public void setEvaluationFormId(Integer evaluationFormId) {
        this.evaluationFormId = evaluationFormId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getWeightage() {
        return weightage;
    }

    public void setWeightage(Integer weightage) {
        this.weightage = weightage;
    }

    public Integer getScale() {
        return scale;
    }

    public void setScale(Integer scale) {
        this.scale = scale;
    }

    public Integer getCriteriaOrder() {
        return criteriaOrder;
    }

    public void setCriteriaOrder(Integer criteriaOrder) {
        this.criteriaOrder = criteriaOrder;
    }

    public EvaluationFormBean getEvaluationFormBean() {
        return evaluationFormBean;
    }

    public void setEvaluationFormBean(EvaluationFormBean evaluationFormBean) {
        this.evaluationFormBean = evaluationFormBean;
    }
}
