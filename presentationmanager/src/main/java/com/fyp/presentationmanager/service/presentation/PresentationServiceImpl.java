package com.fyp.presentationmanager.service.presentation;

import com.fyp.presentationmanager.entity.PresentationBean;
import com.fyp.presentationmanager.entity.PresentationPanelBean;
import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.presentation.PresentationScheduleModel;
import com.fyp.presentationmanager.model.role.PanelModel;
import com.fyp.presentationmanager.repo.PanelRepo;
import com.fyp.presentationmanager.repo.PresentationRepo;
import com.fyp.presentationmanager.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class PresentationServiceImpl implements PresentationService {
    @Autowired
    private PresentationRepo presentationRepo;
    @Autowired
    private PanelRepo panelRepo;
    @Autowired
    private UserService userService;

    @Override
    public List<PresentationModel> addPresentationList(List<PresentationModel> presentationModelList) {
        List<PresentationBean> presentationBeans = new ArrayList<>();
        for (PresentationModel presentationModel : presentationModelList) {
            UserBean sv =
                    this.userService.getUserOrCreateWithEmptyPwIfNotExist(presentationModel.getSupervisorModel().getEmail());
            PresentationBean presentationBean = new PresentationBean(presentationModel);
            presentationBean.setSupervisorId(sv.getId());
            this.presentationRepo.save(presentationBean);

            if (presentationModel.getPanelModels() != null) {
                for (PanelModel panelModel : presentationModel.getPanelModels()) {
                    if (panelModel.getEmail() != null) {
                        PresentationPanelBean presentationPanelBean = new PresentationPanelBean();
                        UserBean panel
                                = this.userService.getUserOrCreateWithEmptyPwIfNotExist(panelModel.getEmail());
                        presentationPanelBean.setPanelId(panel.getId());
                        presentationPanelBean.setPresentationId(presentationBean.getId());
                        this.panelRepo.save(presentationPanelBean);
                    }
                }
            }
            presentationBeans.add(presentationBean);
        }

        return presentationModelList;
    }

    @Override
    public PresentationModel getPresentation(Integer id) {
        PresentationBean presentationBean = this.presentationRepo.getById(id);
        PresentationModel presentationModel = PresentationModel.build(presentationBean);
        return presentationModel;
    }

    @Override
    public List<PresentationModel> getPresentationList(Integer scheduleId) {
        List<PresentationBean> presentationBeans = this.presentationRepo.findPresentationBeansByScheduleId(scheduleId);
        List<PresentationModel> presentationModelList = new ArrayList<>();
        if (presentationBeans != null) {
            for (PresentationBean presentationBean : presentationBeans) {
                PresentationModel presentationModel = PresentationModel.build(presentationBean);
                presentationModelList.add(presentationModel);
            }
        }
        return presentationModelList;
    }

    @Override
    public List<PresentationScheduleModel> schedulePresentations(List<PresentationScheduleModel> presentationScheduleModels) {
        if (presentationScheduleModels != null) {
            for (PresentationScheduleModel presentationModel : presentationScheduleModels) {
                PresentationBean presentationBean = this.presentationRepo.getById(presentationModel.getId());
                if (presentationBean != null) {
                    presentationBean.setStartTime(presentationModel.getStartTime());
                    presentationBean.setEndTime(presentationModel.getEndTime());
                }

            }
        }
        return presentationScheduleModels;
    }
}
