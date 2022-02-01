package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.PresentationBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PresentationRepo extends JpaRepository<PresentationBean, Integer> {
    List<PresentationBean> findPresentationBeansByScheduleId(Integer scheduleId);
    List<PresentationBean> findPresentationBeansBySupervisorIdOrderByIdDesc(Integer supervisorId);
    List<PresentationBean> findPresentationBeansByChairPersonIdOrderByIdDesc(Integer chairpersonId);
    List<PresentationBean> findPresentationBeansByScheduleIdNotAndEndTimeAfter(Integer supervisorId, Date time);
    List<PresentationBean> findPresentationBeansByEndTimeAfter(Date time);
}
