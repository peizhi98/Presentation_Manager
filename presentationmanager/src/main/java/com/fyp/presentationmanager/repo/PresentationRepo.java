package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.PresentationBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresentationRepo extends JpaRepository<PresentationBean, Integer> {
    List<PresentationBean> findPresentationBeansByScheduleId(Integer scheduleId);
    List<PresentationBean> findPresentationBeansBySupervisorId(Integer supervisorId);
}
