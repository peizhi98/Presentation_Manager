package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.evaluation.EvaluationModel;

public interface EvaluationService {
    EvaluationModel evaluate(EvaluationModel evaluationModel);
    EvaluationModel getAuthUserEvaluation(EvaluationType evaluationType, Integer presentationId);
}
