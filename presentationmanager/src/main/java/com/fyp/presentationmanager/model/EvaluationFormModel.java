package com.fyp.presentationmanager.model;

import com.fyp.presentationmanager.enums.EvaluationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EvaluationFormModel {
    private Integer id;
    private Integer scheduleId;
    private EvaluationType evaluationType;
    private Integer maxGap;
    private Integer rubricUrl;
    private List<CriteriaModel> criteriaModels;
}
