package com.fyp.presentationmanager.service.schedule;

import com.fyp.presentationmanager.entity.EvaluationFormBean;
import com.fyp.presentationmanager.entity.ScheduleBean;
import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.enums.ScheduleType;
import com.fyp.presentationmanager.model.ScheduleModel;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.role.CoordinatorModel;
import com.fyp.presentationmanager.repo.EvaluationFormRepo;
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
    @Autowired
    private EvaluationFormRepo evaluationFormRepo;

    @Override
    public ScheduleModel addOrEditSchedule(ScheduleModel scheduleModel) {

        ScheduleBean scheduleBean;
        if (scheduleModel.getId() != null) {
            scheduleBean = this.scheduleRepo.getById(scheduleModel.getId());
            if (scheduleBean != null) {
                scheduleBean.setSem(scheduleModel.getSem());
                scheduleBean.setYear(scheduleModel.getYear());
                scheduleBean.setTitle(scheduleModel.getTitle());
            }
        } else {
            CustomUserDetails customUserDetails = authService.getAuthUserDetails();
            scheduleBean = new ScheduleBean(scheduleModel);
            scheduleBean.setCoordinatorId(customUserDetails.getId());
            scheduleRepo.save(scheduleBean);
            if (scheduleModel.getScheduleType().equals(ScheduleType.MASTER_DISSERTATION)) {
                EvaluationFormBean confirmationForm = new EvaluationFormBean();
                confirmationForm.setScheduleId(scheduleBean.getId());
                confirmationForm.setEvaluationType(EvaluationType.CONFIRMATION);
                this.evaluationFormRepo.save(confirmationForm);
            }
            scheduleModel.setId(scheduleBean.getId());
        }


        return scheduleModel;
    }

    @Override
    public List<ScheduleModel> findSchedulesByUser() {
        CustomUserDetails customUserDetails = authService.getAuthUserDetails();
        List<ScheduleModel> scheduleModelList = new ArrayList<>();
        List<ScheduleBean> scheduleBeanList = this.scheduleRepo.findScheduleBeansByCoordinatorIdOrderByIdDesc(customUserDetails.getId());
        if (scheduleBeanList != null) {
            for (ScheduleBean scheduleBean : scheduleBeanList) {
                scheduleModelList.add(new ScheduleModel(scheduleBean));
            }
        }
        return scheduleModelList;
    }

    @Override
    public List<ScheduleModel> findMasterSchedules() {
        List<ScheduleModel> scheduleModelList = new ArrayList<>();
        List<ScheduleBean> scheduleBeanList = this.scheduleRepo.findScheduleBeansByScheduleTypeOrderByIdDesc(ScheduleType.MASTER_DISSERTATION);
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
            scheduleModel.setCreateDate(scheduleBean.getCreateDate());
            scheduleModel.setScheduleType(scheduleBean.getScheduleType());
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

    @Override
    public Boolean deleteSchedule(Integer id) {
        try {
            this.scheduleRepo.deleteById(id);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }

}
