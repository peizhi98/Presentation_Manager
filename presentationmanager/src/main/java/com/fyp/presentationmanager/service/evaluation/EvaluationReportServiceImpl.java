package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.entity.*;
import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.evaluation.FypEvaluationOverviewModel;
import com.fyp.presentationmanager.model.evaluation.FypPresentationEvaluationOverviewModel;
import com.fyp.presentationmanager.repo.EvaluationRepo;
import com.fyp.presentationmanager.repo.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class EvaluationReportServiceImpl implements EvaluationReportService {
    @Autowired
    private ScheduleRepo scheduleRepo;
    @Autowired
    private EvaluationRepo evaluationRepo;

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
                pEvaluationOverview.setStudentName(presentationBean.getStudentName());
                pEvaluationOverview.setTitle(presentationBean.getTitle());
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
                    pEvaluationOverview.setPresentationScore(calculatePresentationScore(presentationEvaluationBeans));
                }
                pEvaluationOverview.calculateTotal();
            }
        }
        return fypEvaluationOverviewModel;
    }

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
                                = new BigDecimal(criterionEvaluationBean.getRating()).divide(new BigDecimal(5)).multiply(new BigDecimal(criterionEvaluationBean.getCriterionBean().getWeightage()));
                        total = new BigDecimal(total.add(criterionRating).toString());
                    }
                }

            }
            return total.divide(new BigDecimal(presentationEvaluationBeans.size()));
        }
        return null;
    }
}
