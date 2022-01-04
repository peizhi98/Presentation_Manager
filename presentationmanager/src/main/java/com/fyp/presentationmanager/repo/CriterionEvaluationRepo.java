package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.CriterionEvaluationBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CriterionEvaluationRepo extends JpaRepository<CriterionEvaluationBean, Integer> {
}
