package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.EvaluationBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepo extends JpaRepository<EvaluationBean, Integer> {
    EvaluationBean getEvaluationBeanByEvaluationFormIdAndPresentationIdAndEvaluatorId
            (Integer evaluationFormId, Integer presentationId,Integer evaluatorId);
    List<EvaluationBean> getEvaluationBeansByEvaluationFormIdAndPresentationId
            (Integer evaluationFormId, Integer presentationId);
    List<EvaluationBean> getEvaluationBeansByEvaluationFormId
            (Integer evaluationFormId);
    EvaluationBean getEvaluationBeanByEvaluationFormIdAndPresentationId
            (Integer evaluationFormId, Integer presentationId);
}
