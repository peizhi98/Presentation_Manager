package com.fyp.presentationmanager.entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "criterion_evaluation")
public class CriterionEvaluationBean implements Serializable {
    public static final String ID = "id";
    public static final String EVALUATION_ID = "evaluation_id";
    public static final String CRITERION_ID = "criterion_id";
    public static final String COMMENT = "comment";
    public static final String RATING = "rating";
    private static final long serialVersionUID = 7961050258798206861L;

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = EVALUATION_ID, nullable = false)
    private Integer evaluationId;

    @Column(name = CRITERION_ID, nullable = false)
    private Integer criterionId;

    @Column(name = COMMENT)
    private String comment;

    @Column(name = RATING)
    private Integer rating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = EVALUATION_ID, referencedColumnName = EvaluationFormBean.ID, insertable = false, updatable = false)
    private EvaluationBean evaluationBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = CRITERION_ID, referencedColumnName = CriterionBean.ID, insertable = false, updatable = false)
    private CriterionBean criterionBean;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getEvaluationId() {
        return evaluationId;
    }

    public void setEvaluationId(Integer evaluationId) {
        this.evaluationId = evaluationId;
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

    public Integer getCriterionId() {
        return criterionId;
    }

    public void setCriterionId(Integer criterionId) {
        this.criterionId = criterionId;
    }

    public EvaluationBean getEvaluationBean() {
        return evaluationBean;
    }

    public void setEvaluationBean(EvaluationBean evaluationBean) {
        this.evaluationBean = evaluationBean;
    }

    public CriterionBean getCriterionBean() {
        return criterionBean;
    }

    public void setCriterionBean(CriterionBean criterionBean) {
        this.criterionBean = criterionBean;
    }
}
