package com.fyp.presentationmanager.service;

import com.fyp.presentationmanager.entity.CriterionBean;
import com.fyp.presentationmanager.model.evaluation.CriterionModel;
import com.fyp.presentationmanager.repo.CriterionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class CriterionServiceImpl implements CriterionService {
    @Autowired
    private CriterionRepo criterionRepo;

    @Override
    public List<CriterionBean> addOrEditCriterionModelList(List<CriterionModel> criterionModelList, Integer id) {
        List<CriterionBean> criterionBeans = new ArrayList<>();
        if (criterionModelList != null) {
            int currentIndex = 1;
            for (CriterionModel criterionModel : criterionModelList) {
                CriterionBean criterionBean;
                if (criterionModel.getId() != null) {
                    criterionBean = criterionRepo.getById(criterionModel.getId());
                } else {
                    criterionBean = new CriterionBean();
                    criterionBean.setEvaluationFormId(id);
                }
                criterionBean.setPosition(currentIndex++);
                criterionBean.setName(criterionModel.getName());
                criterionBean.setWeightage(criterionModel.getWeightage());
                criterionBean.setScale(criterionModel.getScale());
                criterionBeans.add(criterionBean);
            }
        }
        criterionRepo.saveAll(criterionBeans);
        return criterionBeans;
    }

    @Override
    public void deleteCriterion(Integer id) {
        this.criterionRepo.deleteById(id);
    }

    @Override
    public void compareAndDeleteCriterion(List<CriterionBean> criterionBeans, List<CriterionModel> criterionModelList) {
        if (criterionBeans != null) {
            List<CriterionBean> criterionBeansCopy = new ArrayList<>(criterionBeans);
            for (CriterionBean criterionBean : criterionBeansCopy) {
                if (!findCriterionBeanFromModelList(criterionBean, criterionModelList)) {
                    criterionBeans.remove(criterionBeans.indexOf(criterionBean));
                    this.deleteCriterion(criterionBean.getId());
                }
            }
        }

    }

    private boolean findCriterionBeanFromModelList(CriterionBean criterionBean, List<CriterionModel> criterionModelList) {
        if (criterionModelList != null) {
            for (CriterionModel criterionModel : criterionModelList) {
                if (criterionBean.getId() == criterionModel.getId())
                    return true;
            }
        }
        return false;
    }
}
