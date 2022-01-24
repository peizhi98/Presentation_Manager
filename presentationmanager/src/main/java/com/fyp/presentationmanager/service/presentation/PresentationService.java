package com.fyp.presentationmanager.service.presentation;

import com.fyp.presentationmanager.model.presentation.AutoSchedulingModel;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.presentation.PresentationScheduleModel;

import java.util.List;

public interface PresentationService {
    List<PresentationModel> addPresentationList(List<PresentationModel> scheduleModelList);

    PresentationModel getPresentation(Integer id);

    List<PresentationModel> getPresentationList(Integer scheduleId);

    List<PresentationModel> getPresentationListWithCommonAvailability(Integer scheduleId);

    List<PresentationModel> getPresentationListAsPanel();

    List<PresentationModel> getPresentationListAsSupervisor();

    List<PresentationScheduleModel> schedulePresentations(List<PresentationScheduleModel> presentationScheduleModels);

    List<PresentationModel> autoScheduling(AutoSchedulingModel autoSchedulingModel);

    List<PresentationModel> syncAllPresentationWithGoogleCalendar(Integer scheduleId);

    PresentationModel syncPresentationWithGoogleCalendar(Integer presentationId);
}
