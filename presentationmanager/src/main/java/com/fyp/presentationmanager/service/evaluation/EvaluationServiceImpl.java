package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.entity.*;
import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.evaluation.CriterionEvaluationModel;
import com.fyp.presentationmanager.model.evaluation.EvaluationModel;
import com.fyp.presentationmanager.model.user.UserModel;
import com.fyp.presentationmanager.repo.CriterionEvaluationRepo;
import com.fyp.presentationmanager.repo.EvaluationFormRepo;
import com.fyp.presentationmanager.repo.EvaluationRepo;
import com.fyp.presentationmanager.repo.PresentationRepo;
import com.fyp.presentationmanager.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class EvaluationServiceImpl implements EvaluationService {
    @Autowired
    private EvaluationRepo evaluationRepo;
    @Autowired
    private AuthService authService;
    @Autowired
    private EvaluationFormRepo evaluationFormRepo;
    @Autowired
    private PresentationRepo presentationRepo;
    @Autowired
    private CriterionEvaluationRepo criterionEvaluationRepo;

    @Override
    public EvaluationModel evaluate(EvaluationModel evaluationModel) {
        EvaluationBean evaluationBean = new EvaluationBean();
        List<CriterionEvaluationBean> criterionEvaluationBeans = new ArrayList<>();
        CustomUserDetails authUserDetails = this.authService.getAuthUserDetails();
        if (evaluationModel.getCriterionEvaluationModelList() != null) {
            if (evaluationModel.getId() != null) {
                evaluationBean = this.evaluationRepo.getById(evaluationModel.getId());
            } else {
                evaluationBean.setEvaluationFormId(evaluationModel.getEvaluationFormId());
                evaluationBean.setEvaluatorId(authUserDetails.getId());
                evaluationBean.setPresentationId(evaluationModel.getPresentationId());
                this.evaluationRepo.save(evaluationBean);
                evaluationBean.setCriterionEvaluationBeans(criterionEvaluationBeans);
            }
            evaluationBean.setComment(evaluationModel.getComment());
            evaluationBean.setRating(evaluationModel.getRating());
            for (CriterionEvaluationModel criterionEvaluationModel :
                    evaluationModel.getCriterionEvaluationModelList()) {
                CriterionEvaluationBean criterionEvaluationBean;
                if (criterionEvaluationModel.getId() != null) {
                    criterionEvaluationBean = this.criterionEvaluationRepo.getById(criterionEvaluationModel.getId());
                } else {
                    criterionEvaluationBean = new CriterionEvaluationBean();
                    criterionEvaluationBeans.add(criterionEvaluationBean);
                    criterionEvaluationBean.setEvaluationId(evaluationBean.getId());
                    criterionEvaluationBean.setCriterionId(criterionEvaluationModel.getCriterionModel().getId());
                }
                criterionEvaluationBean.setComment(criterionEvaluationModel.getComment());
                criterionEvaluationBean.setRating(criterionEvaluationModel.getRating());
            }
        }
        return evaluationModel;
    }

    @Override
    public EvaluationModel getAuthUserEvaluation(EvaluationType evaluationType, Integer presentationId) {
        UserModel authUser = this.authService.getAuthUserModel();
        PresentationBean presentationBean = this.presentationRepo.getById(presentationId);
        EvaluationFormBean evaluationFormBean = this.evaluationFormRepo.getEvaluationFormBeanByEvaluationTypeAndScheduleId(evaluationType, presentationBean.getScheduleId());
        EvaluationBean evaluationBean = this.evaluationRepo.getEvaluationBeanByEvaluationFormIdAndPresentationIdAndEvaluatorId(evaluationFormBean.getId(), presentationId, authUser.getId());
        List<CriterionEvaluationModel> criterionEvaluationModelList = new ArrayList<>();
        EvaluationModel evaluationModel;
        if (evaluationBean != null) {
            evaluationModel = EvaluationModel.build(evaluationBean, criterionEvaluationModelList);
        } else {
            evaluationModel = new EvaluationModel();
            evaluationModel.setEvaluationFormId(evaluationFormBean.getId());
            evaluationModel.setPresentationId(presentationId);
            evaluationModel.setCriterionEvaluationModelList(criterionEvaluationModelList);
        }

        //get evaluation based on current form
        if (evaluationFormBean.getCriterionBeans() != null) {
            List<CriterionEvaluationBean> existingEvaluationList = new ArrayList<>();
            if (evaluationBean != null && evaluationBean.getCriterionEvaluationBeans() != null) {
                existingEvaluationList = evaluationBean.getCriterionEvaluationBeans();
            }
            for (CriterionBean criterionBean : evaluationFormBean.getCriterionBeans()) {
                CriterionEvaluationBean criterionEvaluationBean = criterionBean.findEvaluationFrom(existingEvaluationList);
                CriterionEvaluationModel criterionEvaluationModel;
                if (criterionEvaluationBean == null) {
                    criterionEvaluationModel = CriterionEvaluationModel.buildByCriterion(criterionBean);
                } else {
                    criterionEvaluationModel = CriterionEvaluationModel.build(criterionEvaluationBean);
                }
                criterionEvaluationModelList.add(criterionEvaluationModel);
            }
        }
        return evaluationModel;
    }
}
