package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.evaluation.EvaluationFormModel;

public interface EvaluationFormService {
    EvaluationFormModel addOrEditEvaluationForm(EvaluationFormModel evaluationFormModel);
    EvaluationFormModel getEvaluationForm(Integer scheduleId, EvaluationType evaluationType);
    EvaluationFormModel getEvaluationForm(Integer id);
}
