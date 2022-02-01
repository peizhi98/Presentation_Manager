package com.fyp.presentationmanager.model.evaluation;

import com.fyp.presentationmanager.entity.CriterionBean;
import com.fyp.presentationmanager.entity.EvaluationFormBean;
import com.fyp.presentationmanager.enums.EvaluationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EvaluationFormModel {
    private Integer id;
    private Integer scheduleId;
    private EvaluationType evaluationType;
    private Integer maxGap;
    private Integer rubricUrl;
    private List<CriterionModel> criterionModels;

    public static EvaluationFormModel build(EvaluationFormBean evaluationFormBean) {
        EvaluationFormModel evaluationFormModel = new EvaluationFormModel();
        if (evaluationFormBean != null) {
            evaluationFormModel.setId(evaluationFormBean.getId());
            evaluationFormModel.setEvaluationType(evaluationFormBean.getEvaluationType());
            evaluationFormModel.setScheduleId(evaluationFormBean.getScheduleId());
            evaluationFormModel.setMaxGap(evaluationFormBean.getMaxGap());
            evaluationFormModel.setRubricUrl(evaluationFormBean.getRubricUrl());
            List<CriterionModel> criterionModels = new ArrayList<>();
            if (evaluationFormBean.getCriterionBeans() != null) {
                for (CriterionBean criterionBean : evaluationFormBean.getCriterionBeans()) {
                    criterionModels.add(CriterionModel.build(criterionBean));
                }
            }
            evaluationFormModel.setCriterionModels(criterionModels);
        }
        return evaluationFormModel;
    }

    public static EvaluationFormModel buildConfirmationFormFromEvaluationForm(EvaluationFormBean confirmationForm, EvaluationFormBean evaluationFormBean) {
        EvaluationFormModel confirmationFormModel = new EvaluationFormModel();
        if (evaluationFormBean != null && confirmationForm != null) {
            confirmationFormModel.setId(confirmationForm.getId());
            confirmationFormModel.setEvaluationType(confirmationForm.getEvaluationType());
            confirmationFormModel.setScheduleId(confirmationForm.getScheduleId());
            confirmationFormModel.setMaxGap(confirmationForm.getMaxGap());
            confirmationFormModel.setRubricUrl(confirmationForm.getRubricUrl());
            List<CriterionModel> criterionModels = new ArrayList<>();
            if (evaluationFormBean.getCriterionBeans() != null) {
                for (CriterionBean criterionBean : evaluationFormBean.getCriterionBeans()) {
                    criterionModels.add(CriterionModel.build(criterionBean));
                }
            }
            confirmationFormModel.setCriterionModels(criterionModels);
        }
        return confirmationFormModel;
    }
}
