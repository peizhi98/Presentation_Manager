package com.fyp.presentationmanager.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CriteriaModel {
    private Integer id;
    private Integer evaluationFormId;
    private String name;
    private Integer weightage;
    private Integer scale;
    private Integer criteriaOrder;
}
