package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.entity.*;
import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.evaluation.*;
import com.fyp.presentationmanager.repo.EvaluationFormRepo;
import com.fyp.presentationmanager.repo.EvaluationRepo;
import com.fyp.presentationmanager.repo.PresentationRepo;
import com.fyp.presentationmanager.repo.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class EvaluationReportServiceImpl implements EvaluationReportService {
    @Autowired
    private ScheduleRepo scheduleRepo;
    @Autowired
    private EvaluationRepo evaluationRepo;
    @Autowired
    private PresentationRepo presentationRepo;
    @Autowired
    private EvaluationFormRepo evaluationFormRepo;

    @Override
    public FypEvaluationOverviewModel getFypEvaluationOverviewOfSchedule(Integer scheduleId) {
        FypEvaluationOverviewModel fypEvaluationOverviewModel = new FypEvaluationOverviewModel();
        List<FypPresentationEvaluationOverviewModel> pEvaluationOverviewModels = new ArrayList<>();
        fypEvaluationOverviewModel.setFypPresentationEvaluationOverviewModels(pEvaluationOverviewModels);
        ScheduleBean scheduleBean = this.scheduleRepo.getById(scheduleId);
        if (scheduleBean != null && scheduleBean.getPresentationBeans() != null) {
            EvaluationFormBean reportForm = scheduleBean.getEvaluationFormBeanOf(EvaluationType.REPORT);
            EvaluationFormBean presentationForm = scheduleBean.getEvaluationFormBeanOf(EvaluationType.PRESENTATION);
            if (reportForm != null) {
                fypEvaluationOverviewModel.setReportWeightage(reportForm.calculateWeightage());
            }
            if (presentationForm != null) {
                fypEvaluationOverviewModel.setPresentationWeightage(presentationForm.calculateWeightage());
            }
            fypEvaluationOverviewModel.calculateTotalWeightage();
            List<PresentationBean> presentationBeans = scheduleBean.getPresentationBeans();
            for (PresentationBean presentationBean : presentationBeans) {
                FypPresentationEvaluationOverviewModel pEvaluationOverview = new FypPresentationEvaluationOverviewModel();
                pEvaluationOverviewModels.add(pEvaluationOverview);
                pEvaluationOverview.setPresentationId(presentationBean.getId());
                pEvaluationOverview.setMatrix(presentationBean.getStudentMatrixNo());
                pEvaluationOverview.setStudentName(presentationBean.getStudentName());
                pEvaluationOverview.setTitle(presentationBean.getTitle());
                Integer numberOfPanels = presentationBean.getPanelBeans().size();
                pEvaluationOverview.setNumberOfPanels(numberOfPanels);
                if (reportForm != null) {
                    EvaluationBean reportEvaluationBean
                            = this.evaluationRepo
                            .getEvaluationBeanByEvaluationFormIdAndPresentationId(reportForm.getId(), presentationBean.getId());
                    pEvaluationOverview.setReportScore(calculateReportScore(reportEvaluationBean));
                }
                if (presentationForm != null) {
                    List<EvaluationBean> presentationEvaluationBeans
                            = this.evaluationRepo
                            .getEvaluationBeansByEvaluationFormIdAndPresentationId(presentationForm.getId(), presentationBean.getId());
                    // calculate difference
                    BigDecimal highest = null;
                    BigDecimal lowest = null;
                    if (presentationEvaluationBeans != null && presentationEvaluationBeans.size() != 0) {
                        Integer numberOfPanelsEvaluated = presentationEvaluationBeans.size();
                        pEvaluationOverview.setNumberOfPanelsEvaluated(numberOfPanelsEvaluated);
                        BigDecimal totalOfPanels = new BigDecimal(0);
                        for (EvaluationBean presentationEvaluation : presentationEvaluationBeans) {
                            BigDecimal total = new BigDecimal(0);
                            if (presentationEvaluation.getCriterionEvaluationBeans() != null) {
                                for (CriterionEvaluationBean criterionEvaluationBean : presentationEvaluation.getCriterionEvaluationBeans()) {
                                    BigDecimal criterionRating
                                            = new BigDecimal(criterionEvaluationBean.getRating()).divide(new BigDecimal(5),4,RoundingMode.HALF_UP).multiply(new BigDecimal(criterionEvaluationBean.getCriterionBean().getWeightage()));
                                    total = new BigDecimal(total.add(criterionRating).toString());
                                }
                                totalOfPanels = new BigDecimal(totalOfPanels.add(total).toString());
                                if (highest == null || lowest == null) {
                                    highest = total;
                                    lowest = total;
                                } else if (total.compareTo(highest) > 0) {
                                    highest = total;
                                } else {
                                    lowest = total;
                                }
                            }

                        }
                        pEvaluationOverview.setHighestEvaluationGivenByPanel(highest);
                        pEvaluationOverview.setLowestEvaluationGivenByPanel(lowest);
                        if (highest != null && lowest != null) {
                            pEvaluationOverview.setMaxDifferenceInEvaluation(highest.subtract(lowest));
                        }
                        if (numberOfPanels == numberOfPanelsEvaluated) {
                            pEvaluationOverview.setPresentationScore(totalOfPanels.divide(new BigDecimal(numberOfPanels),4,RoundingMode.HALF_UP));
                        }
                    }
                }
                pEvaluationOverview.calculateTotal(fypEvaluationOverviewModel.getTotal());
            }
        }
        return fypEvaluationOverviewModel;
    }

    @Override
    public MasterEvaluationOverviewModel getMasterEvaluationOverviewOfSchedule(Integer scheduleId) {
        MasterEvaluationOverviewModel masterEvaluationOverviewModel = new MasterEvaluationOverviewModel();
        List<MasterPresentationEvaluationOverviewModel> pEvaluationOverviewModels = new ArrayList<>();
        masterEvaluationOverviewModel.setMasterPresentationEvaluationOverviewModels(pEvaluationOverviewModels);
        ScheduleBean scheduleBean = this.scheduleRepo.getById(scheduleId);
        Integer scale = 6;
        if (scheduleBean != null && scheduleBean.getPresentationBeans() != null) {
            EvaluationFormBean confirmationForm = scheduleBean.getEvaluationFormBeanOf(EvaluationType.CONFIRMATION);
            EvaluationFormBean panelForm = scheduleBean.getEvaluationFormBeanOf(EvaluationType.PANEL);
//            if (confirmationForm != null) {
//                masterEvaluationOverviewModel.setReportWeightage(confirmationForm.calculateWeightage());
//            }
            if (panelForm != null) {
                masterEvaluationOverviewModel.setPanelEvaluationWeightage(panelForm.calculateWeightage());
            }
            masterEvaluationOverviewModel.calculateTotalWeightage();
            List<PresentationBean> presentationBeans = scheduleBean.getPresentationBeans();
            for (PresentationBean presentationBean : presentationBeans) {
                MasterPresentationEvaluationOverviewModel pEvaluationOverview = new MasterPresentationEvaluationOverviewModel();
                pEvaluationOverviewModels.add(pEvaluationOverview);
                pEvaluationOverview.setPresentationId(presentationBean.getId());
                pEvaluationOverview.setMatrix(presentationBean.getStudentMatrixNo());
                pEvaluationOverview.setStudentName(presentationBean.getStudentName());
                pEvaluationOverview.setTitle(presentationBean.getTitle());
                Integer numberOfPanels = presentationBean.getPanelBeans().size();
                pEvaluationOverview.setNumberOfPanels(numberOfPanels);
                if (confirmationForm != null) {
                    EvaluationBean confirmationEvaluationBean
                            = this.evaluationRepo
                            .getEvaluationBeanByEvaluationFormIdAndPresentationId(confirmationForm.getId(), presentationBean.getId());
                    if (confirmationEvaluationBean != null) {
                        pEvaluationOverview.setConfirmationResult(confirmationEvaluationBean.getRating());
                    }
                }
                if (panelForm != null) {
                    List<EvaluationBean> presentationEvaluationBeans
                            = this.evaluationRepo
                            .getEvaluationBeansByEvaluationFormIdAndPresentationId(panelForm.getId(), presentationBean.getId());
                    // calculate difference
                    BigDecimal highest = null;
                    BigDecimal lowest = null;
                    if (presentationEvaluationBeans != null && presentationEvaluationBeans.size() != 0) {
                        Integer numberOfPanelsEvaluated = presentationEvaluationBeans.size();
                        pEvaluationOverview.setNumberOfPanelsEvaluated(numberOfPanelsEvaluated);
                        BigDecimal totalOfPanels = new BigDecimal(0);
                        for (EvaluationBean presentationEvaluation : presentationEvaluationBeans) {
                            BigDecimal total = new BigDecimal(0);
                            if (presentationEvaluation.getCriterionEvaluationBeans() != null) {
                                for (CriterionEvaluationBean criterionEvaluationBean : presentationEvaluation.getCriterionEvaluationBeans()) {
                                    BigDecimal criterionRating
                                            = new BigDecimal(criterionEvaluationBean.getRating()).divide(new BigDecimal(scale),4,RoundingMode.HALF_UP).multiply(new BigDecimal(criterionEvaluationBean.getCriterionBean().getWeightage()));
                                    total = new BigDecimal(total.add(criterionRating).toString());
                                }
                                totalOfPanels = new BigDecimal(totalOfPanels.add(total).toString());
                                if (highest == null || lowest == null) {
                                    highest = total;
                                    lowest = total;
                                } else if (total.compareTo(highest) > 0) {
                                    highest = total;
                                } else {
                                    lowest = total;
                                }
                            }

                        }
                        pEvaluationOverview.setHighestEvaluationGivenByPanel(highest);
                        pEvaluationOverview.setLowestEvaluationGivenByPanel(lowest);
                        if (highest != null && lowest != null) {
                            pEvaluationOverview.setMaxDifferenceInEvaluation(highest.subtract(lowest));
                        }
                        if (numberOfPanels == numberOfPanelsEvaluated) {
                            pEvaluationOverview.setAvgPanelEvaluationScore(totalOfPanels.divide(new BigDecimal(numberOfPanels),4,RoundingMode.HALF_UP));
                        }
                    }
                }
                pEvaluationOverview.calculateTotal(masterEvaluationOverviewModel.getTotal());
            }
        }
        return masterEvaluationOverviewModel;
    }

    @Override
    public List<CriterionEvaluationReportModel> getCriterionEvaluationReport(EvaluationType evaluationType, Integer presentationId) {
        PresentationBean presentationBean = this.presentationRepo.getById(presentationId);
        if (presentationBean == null) {
            throw new RuntimeException("Presentation with id: " + presentationId + " does not exist.");
        }
        EvaluationFormBean evaluationFormBean;
        if (evaluationType.equals(EvaluationType.CONFIRMATION)) {
//            EvaluationFormBean confirmationForm = this.evaluationFormRepo.getEvaluationFormBeanByEvaluationTypeAndScheduleId(EvaluationType.CONFIRMATION, presentationBean.getScheduleId());
//            if (confirmationForm == null) {
//                throw new RuntimeException("Form does not exist.");
//            }
            evaluationFormBean = this.evaluationFormRepo.getEvaluationFormBeanByEvaluationTypeAndScheduleId(EvaluationType.PANEL, presentationBean.getScheduleId());
        } else {
            evaluationFormBean = this.evaluationFormRepo.getEvaluationFormBeanByEvaluationTypeAndScheduleId(evaluationType, presentationBean.getScheduleId());
        }
        if (evaluationFormBean == null) {
            throw new RuntimeException("Form does not exist.");
        }
        List<CriterionBean> criterionBeans = evaluationFormBean.getCriterionBeans();
        if (criterionBeans == null) {
            throw new RuntimeException("No criterion exist in evaluationForm.");
        }
        List<EvaluationBean> evaluationBeansOfAllType = presentationBean.getEvaluationBeans();
        List<EvaluationBean> evaluationBeanOfType = new ArrayList<>();
        if (evaluationBeansOfAllType != null) {
            for (EvaluationBean e : evaluationBeansOfAllType) {
                if (e.getEvaluationFormBean().getEvaluationType().equals(evaluationType)) {
                    evaluationBeanOfType.add(e);
                }
            }
        }
        if (evaluationBeanOfType.size() == 0) {
            throw new RuntimeException("No evaluator has submitted this evaluation form.");
        }

        List<CriterionEvaluationReportModel> criterionEvaluationReportModels = new ArrayList<>();
        for (CriterionBean criterionBean : criterionBeans) {
            CriterionEvaluationReportModel criterionEvaluationReportModel = new CriterionEvaluationReportModel();
            criterionEvaluationReportModel.setCriterionId(criterionBean.getId());
            criterionEvaluationReportModel.setEvaluationFormId(evaluationFormBean.getId());
            criterionEvaluationReportModel.setName(criterionBean.getName());
            criterionEvaluationReportModel.setWeightage(criterionBean.getWeightage());
            criterionEvaluationReportModel.setPosition(criterionBean.getPosition());
            List<EvaluatorCriterionEvaluationModel> evaluatorCriterionEvaluationModels = new ArrayList<>();
            criterionEvaluationReportModel.setEvaluatorCriterionEvaluationModels(evaluatorCriterionEvaluationModels);
            criterionEvaluationReportModels.add(criterionEvaluationReportModel);

            // append criteria evaluation
            for (EvaluationBean e : evaluationBeanOfType) {
                CriterionEvaluationBean evaluationOfThisCriterion = criterionBean.findEvaluationFrom(e.getCriterionEvaluationBeans());
                EvaluatorCriterionEvaluationModel ece = new EvaluatorCriterionEvaluationModel();
                ece.setEvaluatorId(e.getEvaluatorId());
                ece.setEvaluatorName(e.getEvaluator().getName());
                if (evaluationOfThisCriterion != null) {
                    ece.setRating(evaluationOfThisCriterion.getRating());
                    ece.setComment(evaluationOfThisCriterion.getComment());
                    if (evaluationType.equals(EvaluationType.CONFIRMATION) || evaluationType.equals(EvaluationType.REPORT)) {
                        ece.setScore(BigDecimal.valueOf(evaluationOfThisCriterion.getRating()));
                    } else {
                        Integer scale = 1;
                        if (evaluationType.equals(EvaluationType.PANEL)) {
                            scale = 6;
                        } else if (evaluationType.equals(EvaluationType.PRESENTATION)) {
                            scale = 5;
                        }
                        BigDecimal fractionScore = new BigDecimal(new BigDecimal(evaluationOfThisCriterion.getRating())
                                .divide(new BigDecimal(scale), 4, RoundingMode.HALF_UP).toString());
                        BigDecimal score = new BigDecimal(String.valueOf(fractionScore.multiply(new BigDecimal(evaluationOfThisCriterion.getCriterionBean().getWeightage()))));
                        ece.setScore(score);
                    }
                }
                evaluatorCriterionEvaluationModels.add(ece);
            }
        }
        // append overall result
        CriterionEvaluationReportModel overallEvaluationReportModel = new CriterionEvaluationReportModel();
        overallEvaluationReportModel.setEvaluationFormId(evaluationFormBean.getId());
        overallEvaluationReportModel.setName("Overall");
        overallEvaluationReportModel.setWeightage(evaluationFormBean.calculateWeightage());
        List<EvaluatorCriterionEvaluationModel> evaluatorOverallEvaluationModels = new ArrayList<>();
        overallEvaluationReportModel.setEvaluatorCriterionEvaluationModels(evaluatorOverallEvaluationModels);
        criterionEvaluationReportModels.add(overallEvaluationReportModel);


        for (EvaluationBean e : evaluationBeanOfType) {
            EvaluatorCriterionEvaluationModel ece = new EvaluatorCriterionEvaluationModel();
            ece.setEvaluatorId(e.getEvaluatorId());
            ece.setEvaluatorName(e.getEvaluator().getName());
            ece.setRating(e.getRating());
            ece.setComment(e.getComment());
            evaluatorOverallEvaluationModels.add(ece);
            if (evaluationType.equals(EvaluationType.CONFIRMATION)) {
                ece.setScore(BigDecimal.valueOf(e.getRating()));
            } else if (evaluationType.equals(EvaluationType.PRESENTATION)) {
                ece.setScore(e.calculateTotalScore(5));
            } else if (evaluationType.equals(EvaluationType.PANEL)) {
                ece.setScore(e.calculateTotalScore(6));
            } else {
                ece.setScore(e.calculateTotalScore());
            }
        }


        return criterionEvaluationReportModels;
    }

//    private EvaluationBean findEvaluationWithCriterionAndEvaluator(List<CriterionEvaluationBean> criterionEvaluationBeans, UserBean evaluator, CriterionBean criterionBean) {
//        if (criterionEvaluationBeans != null) {
//            for (CriterionEvaluationBean ce:criterionEvaluationBeans){}
//        }
//    }

    private BigDecimal calculateReportScore(EvaluationBean reportEvaluation) {
        if (reportEvaluation != null) {
            BigDecimal total = new BigDecimal(0);
            if (reportEvaluation.getCriterionEvaluationBeans() != null) {
                for (CriterionEvaluationBean criterionEvaluationBean : reportEvaluation.getCriterionEvaluationBeans()) {
                    total = new BigDecimal(total.add(new BigDecimal(criterionEvaluationBean.getRating())).toString());
                }
            }
            return total;
        }
        return null;
    }

    private BigDecimal calculatePresentationScore(List<EvaluationBean> presentationEvaluationBeans) {
        if (presentationEvaluationBeans != null && presentationEvaluationBeans.size() != 0) {
            BigDecimal total = new BigDecimal(0);
            for (EvaluationBean presentationEvaluation : presentationEvaluationBeans) {
                if (presentationEvaluation.getCriterionEvaluationBeans() != null) {
                    for (CriterionEvaluationBean criterionEvaluationBean : presentationEvaluation.getCriterionEvaluationBeans()) {
                        BigDecimal criterionRating
                                = new BigDecimal(criterionEvaluationBean.getRating()).divide(new BigDecimal(5),4,RoundingMode.HALF_UP).multiply(new BigDecimal(criterionEvaluationBean.getCriterionBean().getWeightage()));
                        total = new BigDecimal(total.add(criterionRating).toString());
                    }
                }

            }
            return total.divide(new BigDecimal(presentationEvaluationBeans.size()),4,RoundingMode.HALF_UP);
        }
        return null;
    }

    private BigDecimal calculateMaxDiffInEv(List<EvaluationBean> presentationEvaluationBeans) {
        BigDecimal highest = null;
        BigDecimal lowest = null;

        if (presentationEvaluationBeans != null && presentationEvaluationBeans.size() != 0) {
            for (EvaluationBean presentationEvaluation : presentationEvaluationBeans) {
                BigDecimal total = new BigDecimal(0);
                if (presentationEvaluation.getCriterionEvaluationBeans() != null) {
                    for (CriterionEvaluationBean criterionEvaluationBean : presentationEvaluation.getCriterionEvaluationBeans()) {
                        BigDecimal criterionRating
                                = new BigDecimal(criterionEvaluationBean.getRating()).divide(new BigDecimal(5),4,RoundingMode.HALF_UP).multiply(new BigDecimal(criterionEvaluationBean.getCriterionBean().getWeightage()));
                        total = new BigDecimal(total.add(criterionRating).toString());
                    }
                    if (highest == null || lowest == null) {
                        highest = total;
                        lowest = total;
                    } else if (total.compareTo(highest) > 0) {
                        highest = total;
                    } else {
                        lowest = total;
                    }
                }

            }
            return highest.subtract(lowest);
        }
        return null;
    }
}
