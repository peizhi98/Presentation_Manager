package com.fyp.presentationmanager.model.evaluation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EvaluatorCriterionEvaluationModel {
    private String comment;
    private Integer rating;
    private Integer weightageOfCriterion;
    private BigDecimal score;
    private String evaluatorName;
    private Integer evaluatorId;
}
