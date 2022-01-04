package com.fyp.presentationmanager.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

import static com.fyp.presentationmanager.entity.EvaluationBean.*;

@Entity
@Table(
        name = "evaluation",
        uniqueConstraints = @UniqueConstraint(columnNames = {EVALUATION_FORM_ID, PRESENTATION_ID, EVALUATOR_ID}))
public class EvaluationBean implements Serializable {
    public static final String ID = "id";
    public static final String EVALUATION_FORM_ID = "evaluation_form_id";
    public static final String PRESENTATION_ID = "presentation_id";
    public static final String EVALUATOR_ID = "evaluator_id";
    public static final String COMMENT = "comment";
    public static final String RATING = "rating";
    private static final long serialVersionUID = -6958866707994146201L;

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = EVALUATION_FORM_ID, nullable = false)
    private Integer evaluationFormId;

    @Column(name = PRESENTATION_ID, nullable = false)
    private Integer presentationId;

    @Column(name = EVALUATOR_ID, nullable = false)
    private Integer evaluatorId;

    @Column(name = COMMENT)
    private String comment;

    @Column(name = RATING)
    private Integer rating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = EVALUATION_FORM_ID, referencedColumnName = EvaluationFormBean.ID, insertable = false, updatable = false)
    private EvaluationFormBean evaluationFormBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = PRESENTATION_ID, referencedColumnName = PresentationBean.ID, insertable = false, updatable = false)
    private PresentationBean presentationBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = EVALUATOR_ID, referencedColumnName = UserBean.ID, insertable = false, updatable = false)
    private UserBean evaluator;

    @OneToMany(mappedBy = "evaluationBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CriterionEvaluationBean> criterionEvaluationBeans;

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

    public Integer getPresentationId() {
        return presentationId;
    }

    public void setPresentationId(Integer presentationId) {
        this.presentationId = presentationId;
    }

    public Integer getEvaluatorId() {
        return evaluatorId;
    }

    public void setEvaluatorId(Integer evaluatorId) {
        this.evaluatorId = evaluatorId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public EvaluationFormBean getEvaluationFormBean() {
        return evaluationFormBean;
    }

    public void setEvaluationFormBean(EvaluationFormBean evaluationFormBean) {
        this.evaluationFormBean = evaluationFormBean;
    }

    public PresentationBean getPresentationBean() {
        return presentationBean;
    }

    public void setPresentationBean(PresentationBean presentationBean) {
        this.presentationBean = presentationBean;
    }

    public UserBean getEvaluator() {
        return evaluator;
    }

    public void setEvaluator(UserBean evaluator) {
        this.evaluator = evaluator;
    }

    public List<CriterionEvaluationBean> getCriterionEvaluationBeans() {
        return criterionEvaluationBeans;
    }

    public void setCriterionEvaluationBeans(List<CriterionEvaluationBean> criterionEvaluationBeans) {
        this.criterionEvaluationBeans = criterionEvaluationBeans;
    }
}
