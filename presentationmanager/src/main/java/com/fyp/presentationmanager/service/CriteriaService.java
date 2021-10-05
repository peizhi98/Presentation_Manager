package com.fyp.presentationmanager.service;

import com.fyp.presentationmanager.entity.CriteriaBean;
import com.fyp.presentationmanager.model.CriteriaModel;

import java.util.List;

public interface CriteriaService {
    List<CriteriaBean> addOrEditCriteriaModelList(List<CriteriaModel> criteriaModelList, Integer id);

    void deleteCriteria(Integer id);

    void compareAndDeleteCriteria(List<CriteriaBean> criteriaBeans, List<CriteriaModel> criteriaModelList);
}
