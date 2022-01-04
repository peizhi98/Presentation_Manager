package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.entity.CriterionBean;
import com.fyp.presentationmanager.entity.EvaluationFormBean;
import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.evaluation.CriterionModel;
import com.fyp.presentationmanager.model.evaluation.EvaluationFormModel;
import com.fyp.presentationmanager.repo.EvaluationFormRepo;
import com.fyp.presentationmanager.service.CriterionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Component
@Transactional
public class EvaluationFormServiceImpl implements EvaluationFormService {
    @Autowired
    private EvaluationFormRepo evaluationFormRepo;
    @Autowired
    private CriterionService criterionService;

    @Override
    public EvaluationFormModel addOrEditEvaluationForm(EvaluationFormModel evaluationFormModel) {
        EvaluationFormBean evaluationFormBean = new EvaluationFormBean();
        if (evaluationFormModel.getId() != null) {
            evaluationFormBean = evaluationFormRepo.getById(evaluationFormModel.getId());
            this.criterionService.compareAndDeleteCriterion(evaluationFormBean.getCriterionBeans(), evaluationFormModel.getCriterionModels());
        }
        evaluationFormBean.setEvaluationType(evaluationFormModel.getEvaluationType());
        evaluationFormBean.setScheduleId(evaluationFormModel.getScheduleId());
        evaluationFormBean.setMaxGap(evaluationFormModel.getMaxGap());
        evaluationFormBean.setRubricUrl(evaluationFormModel.getScheduleId());
        evaluationFormRepo.save(evaluationFormBean);
        if (evaluationFormModel.getCriterionModels() != null) {
            criterionService
                    .addOrEditCriterionModelList(evaluationFormModel.getCriterionModels(), evaluationFormBean.getId());
        }


        return evaluationFormModel;
    }

    @Override
    public EvaluationFormModel getEvaluationForm(Integer scheduleId, EvaluationType evaluationType) {
        EvaluationFormBean evaluationFormBean = this.evaluationFormRepo.getEvaluationFormBeanByScheduleIdAndEvaluationType(scheduleId, evaluationType);
        return EvaluationFormModel.build(evaluationFormBean);
    }

    @Override
    public EvaluationFormModel getEvaluationForm(Integer id) {
        EvaluationFormBean evaluationFormBean = this.evaluationFormRepo.getById(id);
        return EvaluationFormModel.build(evaluationFormBean);
    }
}
