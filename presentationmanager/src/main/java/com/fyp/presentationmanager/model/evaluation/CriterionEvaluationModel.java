package com.fyp.presentationmanager.model.evaluation;

import com.fyp.presentationmanager.entity.CriterionBean;
import com.fyp.presentationmanager.entity.CriterionEvaluationBean;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CriterionEvaluationModel {
    private Integer id;
    private Integer evaluationId;
    private CriterionModel criterionModel;
    private String comment;
    private Integer rating;

    public static CriterionEvaluationModel build(CriterionEvaluationBean criterionEvaluationBean) {
        CriterionEvaluationModel criterionEvaluationModel = new CriterionEvaluationModel();
        if (criterionEvaluationBean != null) {
            criterionEvaluationModel.setId(criterionEvaluationBean.getId());
            criterionEvaluationModel.setRating(criterionEvaluationBean.getRating());
            criterionEvaluationModel.setComment(criterionEvaluationBean.getComment());
            criterionEvaluationModel.setEvaluationId(criterionEvaluationBean.getEvaluationId());
            criterionEvaluationModel.setCriterionModel(CriterionModel.build(criterionEvaluationBean.getCriterionBean()));
        }
        return criterionEvaluationModel;
    }

    public static CriterionEvaluationModel buildByCriterion(CriterionBean criterionBean) {
        CriterionEvaluationModel criterionEvaluationModel = new CriterionEvaluationModel();
        if (criterionBean != null) {
            criterionEvaluationModel.setCriterionModel(CriterionModel.build(criterionBean));
        }
        return criterionEvaluationModel;
    }
}
