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
public class FypPresentationEvaluationOverviewModel {
    private Integer presentationId;
    private String studentName;
    private String title;
    private BigDecimal reportScore;
    private BigDecimal presentationScore;
    private BigDecimal total;

    public void calculateTotal() {
        if (reportScore != null || presentationScore != null) {
            total = new BigDecimal(0);
            if (reportScore != null) {
                total = new BigDecimal(total.add(reportScore).toString());
            }
            if (presentationScore != null) {
                total = new BigDecimal(total.add(presentationScore).toString());
            }

        }
    }
}
