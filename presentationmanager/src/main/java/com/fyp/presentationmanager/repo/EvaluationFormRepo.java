package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.EvaluationFormBean;
import com.fyp.presentationmanager.enums.EvaluationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluationFormRepo extends JpaRepository<EvaluationFormBean, Integer> {
    EvaluationFormBean getEvaluationFormBeanByScheduleIdAndEvaluationType(Integer scheduleId, EvaluationType evaluationType);
}
