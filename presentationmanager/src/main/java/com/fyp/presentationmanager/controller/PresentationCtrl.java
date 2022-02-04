package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.presentation.AutoSchedulingModel;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.presentation.PresentationScheduleModel;
import com.fyp.presentationmanager.model.presentation.SchedulerModel;
import com.fyp.presentationmanager.service.presentation.PresentationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/presentation")
public class PresentationCtrl {
    @Autowired
    private PresentationService presentationService;

    @PostMapping(value = "/add-presentation-list")
    private ResponseModel<List<PresentationModel>> addPresentationList(@RequestBody List<PresentationModel> presentationModelList) {
        ResponseModel<List<PresentationModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.addPresentationList(presentationModelList));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @PostMapping(value = "/edit-presentation")
    private ResponseModel<PresentationModel> editPresentation(@RequestBody PresentationModel presentationModel) {
        ResponseModel<PresentationModel> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.editPresentation(presentationModel));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @GetMapping(value = "/get-presentation")
    private ResponseModel<PresentationModel> getPresentation(@RequestParam Integer id) {
        ResponseModel<PresentationModel> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getPresentation(id));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @GetMapping(value = "/get-presentations")
    private ResponseModel<List<PresentationModel>> getPresentations(@RequestParam Integer scheduleId) {
        ResponseModel<List<PresentationModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getPresentationList(scheduleId));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @GetMapping(value = "/get-scheduler")
    private ResponseModel<SchedulerModel> getScheduler(@RequestParam Integer scheduleId) {
        ResponseModel<SchedulerModel> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getScheduler(scheduleId));
//            responseModel.success(presentationService.getPresentationListWithCommonAvailability(scheduleId));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @GetMapping(value = "/get-presentations-after-now")
    private ResponseModel<List<PresentationModel>> getAllPresentationAfterNow() {
        ResponseModel<List<PresentationModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getAllPresentationAfterNow());
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @GetMapping(value = "/get-presentations-panel")
    private ResponseModel<List<PresentationModel>> getPresentationsAsPanel() {
        ResponseModel<List<PresentationModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getPresentationListAsPanel());
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }

    @GetMapping(value = "/get-presentations-supervisor")
    private ResponseModel<List<PresentationModel>> getPresentationsAsSupervisor() {
        ResponseModel<List<PresentationModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getPresentationListAsSupervisor());
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }

    @GetMapping(value = "/get-presentations-chairperson")
    private ResponseModel<List<PresentationModel>> getPresentationsAsChairperson() {
        ResponseModel<List<PresentationModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getPresentationListAsChairperson());
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }

    @PostMapping(value = "/schedule-presentations")
    private ResponseModel<List<PresentationScheduleModel>> schedulePresentations(@RequestBody List<PresentationScheduleModel> presentationModelList) {
        ResponseModel<List<PresentationScheduleModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.schedulePresentations(presentationModelList));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }

    @PostMapping(value = "/auto-schedule")
    private ResponseModel<SchedulerModel> autoSchedule(@RequestBody AutoSchedulingModel autoSchedulingModel) {
        ResponseModel<SchedulerModel> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getAutoSchedulingResultScheduler(autoSchedulingModel));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }


    @GetMapping(value = "sync-google-calendar-all")
    public ResponseModel<List<PresentationModel>> syncAllPresentationWithGoogleCalendar(@RequestParam Integer scheduleId) {
        ResponseModel<List<PresentationModel>> response = new ResponseModel<>();
        try {
            response.success(this.presentationService.syncAllPresentationWithGoogleCalendar(scheduleId));
        } catch (Exception e) {
            e.printStackTrace();
            response.failed();
        }
        return response;
    }

    @GetMapping(value = "sync-google-calendar")
    public ResponseModel<PresentationModel> syncPresentationWithGoogleCalendar(@RequestParam Integer presentationId) {
        ResponseModel<PresentationModel> response = new ResponseModel<>();
        try {
            response.success(this.presentationService.syncPresentationWithGoogleCalendar(presentationId));
        } catch (Exception e) {
            e.printStackTrace();
            response.failed();
        }

        return response;
    }

    @DeleteMapping(value = "delete")
    public ResponseModel<Boolean> deletePresentation(@RequestParam Integer presentationId) {
        ResponseModel<Boolean> response = new ResponseModel<>();
        try {
            response.success(presentationService.deletePresentation(presentationId));
        } catch (Exception e) {
            e.printStackTrace();
            response.failed();
        }
        return response;
    }
}
