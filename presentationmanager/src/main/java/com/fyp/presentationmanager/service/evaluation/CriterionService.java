package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.entity.CriterionBean;
import com.fyp.presentationmanager.model.evaluation.CriterionModel;

import java.util.List;

public interface CriterionService {
    List<CriterionBean> addOrEditCriterionModelList(List<CriterionModel> criterionModelList, Integer id);

    void deleteCriterion(Integer id);

    void compareAndDeleteCriterion(List<CriterionBean> criterionBeans, List<CriterionModel> criterionModelList);
}
