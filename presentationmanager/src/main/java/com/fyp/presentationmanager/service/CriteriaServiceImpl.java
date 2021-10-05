package com.fyp.presentationmanager.service;

import com.fyp.presentationmanager.entity.CriteriaBean;
import com.fyp.presentationmanager.model.CriteriaModel;
import com.fyp.presentationmanager.repo.CriteriaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class CriteriaServiceImpl implements CriteriaService {
    @Autowired
    private CriteriaRepo criteriaRepo;

    @Override
    public List<CriteriaBean> addOrEditCriteriaModelList(List<CriteriaModel> criteriaModelList, Integer id) {
        List<CriteriaBean> criteriaBeans = new ArrayList<>();
        if (criteriaModelList != null) {
            int currentIndex = 1;
            for (CriteriaModel criteriaModel : criteriaModelList) {
                CriteriaBean criteriaBean = new CriteriaBean();
                if (criteriaModel.getId() != null) {
                    criteriaBean = criteriaRepo.getById(criteriaModel.getId());
                }
                criteriaBean.setEvaluationFormId(id);
                criteriaBean.setCriteriaOrder(currentIndex++);
                criteriaBean.setName(criteriaModel.getName());
                criteriaBean.setWeightage(criteriaModel.getWeightage());
                criteriaBean.setScale(criteriaModel.getScale());
                criteriaBeans.add(criteriaBean);
            }
        }


        criteriaRepo.saveAll(criteriaBeans);
        return criteriaBeans;
    }

    @Override
    public void deleteCriteria(Integer id) {
        this.criteriaRepo.deleteById(id);
    }

    @Override
    public void compareAndDeleteCriteria(List<CriteriaBean> criteriaBeans, List<CriteriaModel> criteriaModelList) {
        if (criteriaBeans != null) {
            List<CriteriaBean> criteriaBeansCopy = new ArrayList<>(criteriaBeans);
            for (CriteriaBean criteriaBean : criteriaBeansCopy) {
                if (!findCriteriaBeanFromModelList(criteriaBean, criteriaModelList)) {
                    criteriaBeans.remove(criteriaBeans.indexOf(criteriaBean));
                    this.deleteCriteria(criteriaBean.getId());
                }
            }
        }

    }

    private boolean findCriteriaBeanFromModelList(CriteriaBean criteriaBean, List<CriteriaModel> criteriaModelList) {
        if (criteriaModelList != null) {
            for (CriteriaModel criteriaModel : criteriaModelList) {
                if (criteriaBean.getId() == criteriaModel.getId())
                    return true;
            }
        }
        return false;
    }
}
