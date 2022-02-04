package com.fyp.presentationmanager.service.presentation;

import com.fyp.presentationmanager.model.presentation.AutoSchedulingModel;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.presentation.PresentationScheduleModel;
import com.fyp.presentationmanager.model.presentation.SchedulerModel;

import java.util.List;

public interface PresentationService {
    List<PresentationModel> addPresentationList(List<PresentationModel> scheduleModelList);

    PresentationModel editPresentation(PresentationModel presentationModel);

    PresentationModel getPresentation(Integer id);

    List<PresentationModel> getPresentationList(Integer scheduleId);

    SchedulerModel getScheduler(Integer scheduleId);

    List<PresentationModel> getAllPresentationAfterNow();

    List<PresentationModel> getPresentationListWithCommonAvailability(Integer scheduleId);

    List<PresentationModel> getPresentationListAsPanel();

    List<PresentationModel> getPresentationListAsSupervisor();

    List<PresentationModel> getPresentationListAsChairperson();

    List<PresentationScheduleModel> schedulePresentations(List<PresentationScheduleModel> presentationScheduleModels);

    SchedulerModel getAutoSchedulingResultScheduler(AutoSchedulingModel autoSchedulingModel);

    List<PresentationModel> autoScheduling(AutoSchedulingModel autoSchedulingModel);

    List<PresentationModel> syncAllPresentationWithGoogleCalendar(Integer scheduleId);

    PresentationModel syncPresentationWithGoogleCalendar(Integer presentationId);

    Boolean deletePresentation(Integer id);
}
