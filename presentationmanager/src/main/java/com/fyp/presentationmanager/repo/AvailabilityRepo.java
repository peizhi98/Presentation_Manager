package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.AvailabilityBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepo extends JpaRepository<AvailabilityBean, Integer> {
    List<AvailabilityBean> findAvailabilityBeansByUserId(Integer userId);
}
