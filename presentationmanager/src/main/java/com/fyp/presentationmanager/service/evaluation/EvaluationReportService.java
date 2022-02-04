package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.evaluation.CriterionEvaluationReportModel;
import com.fyp.presentationmanager.model.evaluation.FypEvaluationOverviewModel;
import com.fyp.presentationmanager.model.evaluation.MasterEvaluationOverviewModel;

import java.util.List;

public interface EvaluationReportService {
    FypEvaluationOverviewModel getFypEvaluationOverviewOfSchedule(Integer scheduleId);
    MasterEvaluationOverviewModel getMasterEvaluationOverviewOfSchedule(Integer scheduleId);
    List<CriterionEvaluationReportModel> getCriterionEvaluationReport(EvaluationType evaluationType, Integer presentationId);
}
