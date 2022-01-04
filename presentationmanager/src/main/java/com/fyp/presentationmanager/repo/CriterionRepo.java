package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.CriterionBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CriterionRepo extends JpaRepository<CriterionBean, Integer> {
}
