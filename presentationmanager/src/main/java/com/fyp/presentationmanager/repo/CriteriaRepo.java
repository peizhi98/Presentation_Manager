package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.CriteriaBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CriteriaRepo extends JpaRepository<CriteriaBean, Integer> {
}
