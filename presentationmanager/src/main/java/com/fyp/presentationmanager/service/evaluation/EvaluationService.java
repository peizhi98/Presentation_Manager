package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.evaluation.EvaluationModel;

import java.util.List;

public interface EvaluationService {
    EvaluationModel evaluate(EvaluationModel evaluationModel);
    EvaluationModel getAuthUserEvaluation(EvaluationType evaluationType, Integer presentationId);
    List<EvaluationModel> geEvaluationOfType(EvaluationType evaluationType, Integer presentationId);
}
