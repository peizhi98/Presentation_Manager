package com.fyp.presentationmanager.model.evaluation;

import com.fyp.presentationmanager.entity.EvaluationBean;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EvaluationModel {
    private Integer id;
    private Integer evaluationFormId;
    private Integer presentationId;
    private Integer evaluatorId;
    private String comment;
    private Integer rating;
    private String rubricUrl;
    private List<CriterionEvaluationModel> criterionEvaluationModelList;

    public static EvaluationModel build(EvaluationBean evaluationBean, List<CriterionEvaluationModel> criterionEvaluationModelList) {
        EvaluationModel evaluationModel = new EvaluationModel();
        if (evaluationBean != null) {
            evaluationModel.setId(evaluationBean.getId());
            evaluationModel.setComment(evaluationBean.getComment());
            evaluationModel.setEvaluationFormId(evaluationBean.getEvaluationFormId());
            evaluationModel.setPresentationId(evaluationBean.getPresentationId());
            evaluationModel.setEvaluatorId(evaluationBean.getEvaluatorId());
            evaluationModel.setCriterionEvaluationModelList(criterionEvaluationModelList);
        }
        return evaluationModel;
    }
}
