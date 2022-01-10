package com.fyp.presentationmanager.model.evaluation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FypEvaluationOverviewModel {
    private Integer reportWeightage;
    private Integer presentationWeightage;
    private Integer total;
    List<FypPresentationEvaluationOverviewModel> fypPresentationEvaluationOverviewModels;

    public void calculateTotalWeightage() {
        if (reportWeightage != null || presentationWeightage != null) {
            total = 0;
            if (reportWeightage != null) {
                total += reportWeightage;
            }
            if (presentationWeightage != null) {
                total += presentationWeightage;
            }
            this.total = total;
        }

    }
}
