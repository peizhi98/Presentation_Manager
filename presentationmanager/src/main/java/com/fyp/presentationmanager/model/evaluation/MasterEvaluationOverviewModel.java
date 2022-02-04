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
public class MasterEvaluationOverviewModel {
    private Integer panelEvaluationWeightage;
    private Integer total;
    List<MasterPresentationEvaluationOverviewModel> masterPresentationEvaluationOverviewModels;

    public void calculateTotalWeightage() {
        this.total = this.panelEvaluationWeightage;
    }
}
