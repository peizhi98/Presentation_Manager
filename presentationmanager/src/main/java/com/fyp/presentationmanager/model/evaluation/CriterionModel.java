package com.fyp.presentationmanager.model.evaluation;

import com.fyp.presentationmanager.entity.CriterionBean;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CriterionModel {
    private Integer id;
    private Integer evaluationFormId;
    private String name;
    private Integer weightage;
    private Integer scale;
    private Integer position;

    public static CriterionModel build(CriterionBean criterionBean) {
        CriterionModel criterionModel = new CriterionModel();
        if (criterionBean != null) {
            criterionModel.setId(criterionBean.getId());
            criterionModel.setPosition(criterionBean.getPosition());
            criterionModel.setName(criterionBean.getName());
            criterionModel.setScale(criterionBean.getScale());
            criterionModel.setWeightage(criterionBean.getWeightage());
        }
        return criterionModel;
    }
}
