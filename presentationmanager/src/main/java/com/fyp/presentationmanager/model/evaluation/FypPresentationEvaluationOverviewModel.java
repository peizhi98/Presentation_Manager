package com.fyp.presentationmanager.model.evaluation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FypPresentationEvaluationOverviewModel {
    private Integer presentationId;
    private String studentName;
    private String title;
    private String matrix;
    private Integer numberOfPanels;
    private Integer numberOfPanelsEvaluated;
    private BigDecimal highestEvaluationGivenByPanel;
    private BigDecimal lowestEvaluationGivenByPanel;
    private BigDecimal maxDifferenceInEvaluation;
    private BigDecimal reportScore;
    private BigDecimal presentationScore;
    private BigDecimal total;
    private BigDecimal totalInPercent;

    public void calculateTotal(Integer totalWeightage) {
        if (reportScore != null && presentationScore != null&&totalWeightage!=null) {
//            total = new BigDecimal(0);
//            if (reportScore != null) {
//                total = new BigDecimal(total.add(reportScore).toString());
//            }
//            if (presentationScore != null) {
//                total = new BigDecimal(total.add(presentationScore).toString());
//            }
            total = new BigDecimal(reportScore.add(presentationScore).toString());
            BigDecimal totalWeightageBigDecimal=new BigDecimal(totalWeightage.toString());
            BigDecimal totalMarksOverWeightage = new BigDecimal(total.divide(totalWeightageBigDecimal, 4, RoundingMode.HALF_UP).toString());
            totalInPercent = new BigDecimal(totalMarksOverWeightage.multiply(new BigDecimal("100")).toString());
        }
    }
}
