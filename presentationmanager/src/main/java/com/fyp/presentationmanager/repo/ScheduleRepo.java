package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.ScheduleBean;
import com.fyp.presentationmanager.enums.ScheduleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepo extends JpaRepository<ScheduleBean, Integer> {
    List<ScheduleBean> findScheduleBeansByCoordinatorId(Integer id);

    List<ScheduleBean> findScheduleBeansByCoordinatorIdOrderByIdDesc(Integer id);
    List<ScheduleBean> findScheduleBeansByScheduleTypeOrderByIdDesc(ScheduleType scheduleType);
}
