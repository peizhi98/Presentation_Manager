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
                    this.criterionEvaluationRepo.save(criterionEvaluationBean);
                }
                criterionEvaluationBean.setComment(criterionEvaluationModel.getComment());
                criterionEvaluationBean.setRating(criterionEvaluationModel.getRating());
            }
        }
        return evaluationModel;
    }

    @Override
    public EvaluationModel getAuthUserEvaluation(EvaluationType evaluationType, Integer presentationId) {
        EvaluationModel evaluationModel;
        if (evaluationType.equals(EvaluationType.CONFIRMATION)) {
            PresentationBean presentationBean = this.presentationRepo.getById(presentationId);
            EvaluationFormBean masterEvaluationForm = this.evaluationFormRepo.getEvaluationFormBeanByEvaluationTypeAndScheduleId(EvaluationType.PANEL, presentationBean.getScheduleId());
            EvaluationFormBean confirmationForm = this.evaluationFormRepo.getEvaluationFormBeanByEvaluationTypeAndScheduleId(EvaluationType.CONFIRMATION, presentationBean.getScheduleId());
            if (masterEvaluationForm == null) {
                throw new RuntimeException("Panel Evaluation Form does not exist.");
            }
            if (confirmationForm == null) {
                throw new RuntimeException("Confirmation Evaluation Form does not exist.");
            }
            EvaluationBean confirmationEvaluation = this.evaluationRepo.getEvaluationBeanByEvaluationFormIdAndPresentationId(confirmationForm.getId(), presentationBean.getId());
            if (confirmationEvaluation != null) {
                throw new RuntimeException("The presentation result is already finalized. Edit is not allowed.");
            }
            List<EvaluationBean> panelEvaluationBeans = this.evaluationRepo.getEvaluationBeansByEvaluationFormIdAndPresentationId(masterEvaluationForm.getId(), presentationId);
            Integer numberOfPanels = 0;
            if (presentationBean.getPanelBeans() != null) {
                numberOfPanels = presentationBean.getPanelBeans().size();
            }
            if (numberOfPanels == 0) {
                throw new RuntimeException("No panels assigned.");
            }
            evaluationModel = new EvaluationModel();
            // if all panel evaluated
            if (presentationBean.getPanelBeans().size() == panelEvaluationBeans.size()) {
                List<CriterionEvaluationModel> criterionEvaluationModelList = new ArrayList<>();
                evaluationModel.setEvaluationFormId(confirmationForm.getId());
                evaluationModel.setPresentationId(presentationId);
                evaluationModel.setCriterionEvaluationModelList(criterionEvaluationModelList);
                if (masterEvaluationForm.getCriterionBeans() == null) {
                    throw new RuntimeException("Evaluation Criteria does not exist.");
                }
                Double overallMarkFromEveryPanels = 0.0;
                for (CriterionBean c : masterEvaluationForm.getCriterionBeans()) {
                    Double criterionMarkFromEveryPanel = 0.0;
                    for (EvaluationBean e : panelEvaluationBeans) {
                        Integer scaleSelected = c.findEvaluationFrom(e.getCriterionEvaluationBeans()).getRating();
                        Double mark = (scaleSelected * c.getWeightage()) / 6.0;
                        criterionMarkFromEveryPanel += mark;
                    }
                    overallMarkFromEveryPanels += criterionMarkFromEveryPanel;
                    Double average = criterionMarkFromEveryPanel / numberOfPanels;
                    Double avgInPercentage = (average * 100) / c.getWeightage();

                    CriterionEvaluationModel ce = CriterionEvaluationModel.buildByCriterion(c);
                    ce.setRating(getGrade(avgInPercentage));
                    criterionEvaluationModelList.add(ce);
                }
                Double averageTotal = overallMarkFromEveryPanels / numberOfPanels;
                Double avgTotalInPercentage = (averageTotal * 100) / masterEvaluationForm.calculateWeightage();
                evaluationModel.setRating(getGrade(avgTotalInPercentage));
            } else {
                throw new RuntimeException("No complete evaluation from all panels");
            }


        } else {
            UserModel authUser = this.authService.getAuthUserModel();
            PresentationBean presentationBean = this.presentationRepo.getById(presentationId);
            if (evaluationType.equals(EvaluationType.PANEL) && presentationBean.isConfirmed()) {
                throw new RuntimeException("Confirmation Form has been submitted. Editing evaluation is not allowed.");
            }
            EvaluationFormBean evaluationFormBean = this.evaluationFormRepo.getEvaluationFormBeanByEvaluationTypeAndScheduleId(evaluationType, presentationBean.getScheduleId());
            EvaluationBean evaluationBean = this.evaluationRepo.getEvaluationBeanByEvaluationFormIdAndPresentationIdAndEvaluatorId(evaluationFormBean.getId(), presentationId, authUser.getId());
            List<CriterionEvaluationModel> criterionEvaluationModelList = new ArrayList<>();
            if (evaluationBean != null) {
                evaluationModel = EvaluationModel.build(evaluationBean, criterionEvaluationModelList);
                evaluationModel.setRubricUrl(evaluationFormBean.getRubricUrl());
            } else {
                evaluationModel = new EvaluationModel();
                evaluationModel.setEvaluationFormId(evaluationFormBean.getId());
                evaluationModel.setPresentationId(presentationId);
                evaluationModel.setRubricUrl(evaluationFormBean.getRubricUrl());
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

        }
        return evaluationModel;
    }

    @Override
    public List<EvaluationModel> geEvaluationOfType(EvaluationType evaluationType, Integer presentationId) {
        PresentationBean presentationBean = this.presentationRepo.getById(presentationId);
        List<EvaluationBean> evaluationBeansOfAllType = presentationBean.getEvaluationBeans();
        List<EvaluationBean> evaluationBeanOfType = new ArrayList<>();
        if (evaluationBeansOfAllType != null) {
            for (EvaluationBean e : evaluationBeansOfAllType) {
                if (e.getEvaluationFormBean().getEvaluationType().equals(evaluationType)) {
                    evaluationBeanOfType.add(e);
                }
            }
        }
        List<EvaluationModel> evaluationModels = new ArrayList<>();
        for (EvaluationBean evaluationBean : evaluationBeanOfType) {
            EvaluationModel evaluationModel;
            EvaluationFormBean evaluationFormBean = evaluationBean.getEvaluationFormBean();
            List<CriterionEvaluationModel> criterionEvaluationModelList = new ArrayList<>();
            if (evaluationBean != null) {
                evaluationModel = EvaluationModel.build(evaluationBean, criterionEvaluationModelList);
            } else {
                evaluationModel = new EvaluationModel();
                evaluationModel.setEvaluationFormId(evaluationBean.getEvaluationFormId());
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
            evaluationModels.add(evaluationModel);
        }

        return evaluationModels;
    }

    private Integer getGrade(Double mark) {
        if (mark != null) {
            if (mark < 65) {
                return 0;
            } else if (mark < 75) {
                return 1;
            } else {
                return 2;
            }
        }
        return 0;
    }
}
