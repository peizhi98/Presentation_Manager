package com.fyp.presentationmanager.service;

import com.fyp.presentationmanager.entity.CriteriaBean;
import com.fyp.presentationmanager.entity.EvaluationFormBean;
import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.CriteriaModel;
import com.fyp.presentationmanager.model.EvaluationFormModel;
import com.fyp.presentationmanager.repo.EvaluationFormRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class EvaluationFormServiceImpl implements EvaluationFormService {
    @Autowired
    private EvaluationFormRepo evaluationFormRepo;
    @Autowired
    private CriteriaService criteriaService;

    @Override
    public EvaluationFormModel addOrEditEvaluationForm(EvaluationFormModel evaluationFormModel) {
        EvaluationFormBean evaluationFormBean = new EvaluationFormBean();
        if (evaluationFormModel.getId() != null) {
            evaluationFormBean = evaluationFormRepo.getById(evaluationFormModel.getId());
            this.criteriaService.compareAndDeleteCriteria(evaluationFormBean.getCriteriaBeans(), evaluationFormModel.getCriteriaModels());
        }
        evaluationFormBean.setEvaluationType(evaluationFormModel.getEvaluationType());
        evaluationFormBean.setScheduleId(evaluationFormModel.getScheduleId());
        evaluationFormBean.setMaxGap(evaluationFormModel.getMaxGap());
        evaluationFormBean.setRubricUrl(evaluationFormModel.getScheduleId());
        evaluationFormRepo.save(evaluationFormBean);
        if (evaluationFormModel.getCriteriaModels() != null) {
            criteriaService
                    .addOrEditCriteriaModelList(evaluationFormModel.getCriteriaModels(), evaluationFormBean.getId());
        }


        return evaluationFormModel;
    }

    @Override
    public EvaluationFormModel getEvaluationForm(Integer scheduleId, EvaluationType evaluationType) {
        EvaluationFormBean evaluationFormBean = this.evaluationFormRepo.getEvaluationFormBeanByScheduleIdAndEvaluationType(scheduleId, evaluationType);
        EvaluationFormModel evaluationFormModel = new EvaluationFormModel();
        if (evaluationFormBean != null) {
            evaluationFormModel.setId(evaluationFormBean.getId());
            evaluationFormModel.setEvaluationType(evaluationFormBean.getEvaluationType());
            evaluationFormModel.setScheduleId(evaluationFormBean.getScheduleId());
            evaluationFormModel.setMaxGap(evaluationFormBean.getMaxGap());
            evaluationFormModel.setRubricUrl(evaluationFormBean.getRubricUrl());
            List<CriteriaModel> criteriaModels = new ArrayList<>();
            if (evaluationFormBean.getCriteriaBeans() != null) {
                for (CriteriaBean criteriaBean : evaluationFormBean.getCriteriaBeans()) {
                    CriteriaModel criteriaModel = new CriteriaModel();
                    criteriaModel.setId(criteriaBean.getId());
                    criteriaModel.setCriteriaOrder(criteriaBean.getCriteriaOrder());
                    criteriaModel.setName(criteriaBean.getName());
                    criteriaModel.setScale(criteriaBean.getScale());
                    criteriaModel.setWeightage(criteriaBean.getWeightage());
                    criteriaModels.add(criteriaModel);
                }
            }
            evaluationFormModel.setCriteriaModels(criteriaModels);
        }
        return evaluationFormModel;
    }
}
