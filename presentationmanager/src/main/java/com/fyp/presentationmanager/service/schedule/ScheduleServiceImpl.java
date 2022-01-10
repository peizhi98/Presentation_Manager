package com.fyp.presentationmanager.service.schedule;

import com.fyp.presentationmanager.entity.ScheduleBean;
import com.fyp.presentationmanager.model.ScheduleModel;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.role.CoordinatorModel;
import com.fyp.presentationmanager.repo.ScheduleRepo;
import com.fyp.presentationmanager.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class ScheduleServiceImpl implements ScheduleService {
    @Autowired
    private ScheduleRepo scheduleRepo;
    @Autowired
    private AuthService authService;

    @Override
    public ScheduleModel addOrEditSchedule(ScheduleModel scheduleModel) {

        ScheduleBean scheduleBean;
        if (scheduleModel.getId() != null) {
            this.scheduleRepo.getById(scheduleModel.getId());
        } else {
            CustomUserDetails customUserDetails = authService.getAuthUserDetails();
            scheduleBean = new ScheduleBean(scheduleModel);
            scheduleBean.setCoordinatorId(customUserDetails.getId());
            scheduleRepo.save(scheduleBean);
            scheduleModel.setId(scheduleBean.getId());
        }


        return scheduleModel;
    }

    @Override
    public List<ScheduleModel> findSchedulesByUser() {
        CustomUserDetails customUserDetails = authService.getAuthUserDetails();
        List<ScheduleModel> scheduleModelList = new ArrayList<>();
        List<ScheduleBean> scheduleBeanList = this.scheduleRepo.findScheduleBeansByCoordinatorId(customUserDetails.getId());
        if (scheduleBeanList != null) {
            for (ScheduleBean scheduleBean : scheduleBeanList) {
                scheduleModelList.add(new ScheduleModel(scheduleBean));
            }
        }
        return scheduleModelList;
    }

    @Override
    public ScheduleModel getSchedule(Integer id) {
        ScheduleBean scheduleBean = this.scheduleRepo.getById(id);
        ScheduleModel scheduleModel = new ScheduleModel();
        if (scheduleBean != null) {
            scheduleModel.setId(scheduleBean.getId());
            scheduleModel.setYear(scheduleBean.getYear());
            scheduleModel.setSem(scheduleBean.getSem());
            scheduleModel.setDuration(scheduleBean.getDuration());
            scheduleModel.setCreateDate(scheduleBean.getCreateDate());
            scheduleModel.setTitle(scheduleBean.getTitle());
            CoordinatorModel coordinatorModel = CoordinatorModel.build(scheduleBean.getCoordinator());
            scheduleModel.setCoordinator(coordinatorModel);
//            if (scheduleBean.getPresentationBeans() != null) {
//                List<PresentationModel> presentationModelList = new ArrayList<>();
//                for (PresentationBean presentationBean : scheduleBean.getPresentationBeans()) {
//                    PresentationModel presentationModel = PresentationModel.build(presentationBean);
//                    presentationModelList.add(presentationModel);
//                }
//                scheduleModel.setPresentationModels(presentationModelList);
//            }

        }
        return scheduleModel;
    }

}