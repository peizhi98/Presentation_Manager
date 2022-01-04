package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.EvaluationBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluationRepo extends JpaRepository<EvaluationBean, Integer> {
    EvaluationBean getEvaluationBeanByEvaluationFormIdAndPresentationIdAndEvaluatorId
            (Integer evaluationFormId, Integer presentationId,Integer evaluatorId);
}
