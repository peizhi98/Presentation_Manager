package com.fyp.presentationmanager.service;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.EvaluationFormModel;

public interface EvaluationFormService {
    EvaluationFormModel addOrEditEvaluationForm(EvaluationFormModel evaluationFormModel);
    EvaluationFormModel getEvaluationForm(Integer scheduleId, EvaluationType evaluationType);
}
