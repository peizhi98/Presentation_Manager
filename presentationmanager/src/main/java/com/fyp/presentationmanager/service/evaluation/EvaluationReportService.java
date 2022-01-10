package com.fyp.presentationmanager.service.evaluation;

import com.fyp.presentationmanager.model.evaluation.FypEvaluationOverviewModel;

public interface EvaluationReportService {
    FypEvaluationOverviewModel getFypEvaluationOverviewOfSchedule(Integer scheduleId);
}
