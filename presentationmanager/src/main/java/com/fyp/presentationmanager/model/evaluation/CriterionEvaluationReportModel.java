package com.fyp.presentationmanager.model.evaluation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CriterionEvaluationReportModel {
    private Integer criterionId;
    private Integer evaluationFormId;
    private String name;
    private Integer weightage;
    private Integer scale;
    private Integer position;
    private List<EvaluatorCriterionEvaluationModel> evaluatorCriterionEvaluationModels;
}
