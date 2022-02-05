package com.fyp.presentationmanager.service.presentation;

import com.fyp.presentationmanager.entity.*;
import com.fyp.presentationmanager.enums.PresentationMode;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.presentation.AutoSchedulingModel;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.presentation.PresentationScheduleModel;
import com.fyp.presentationmanager.model.presentation.SchedulerModel;
import com.fyp.presentationmanager.model.role.PanelModel;
import com.fyp.presentationmanager.model.room.RoomPresentationSlotsModel;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.GeneticAlgorithm;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.Population;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.Schedule;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.Presentation;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.Room;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.ScheduleData;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
import com.fyp.presentationmanager.repo.PanelRepo;
import com.fyp.presentationmanager.repo.PresentationPanelRepo;
import com.fyp.presentationmanager.repo.PresentationRepo;
import com.fyp.presentationmanager.repo.ScheduleRepo;
import com.fyp.presentationmanager.service.auth.AuthService;
import com.fyp.presentationmanager.service.google.GoogleAPIService;
import com.fyp.presentationmanager.service.user.UserService;
import com.fyp.presentationmanager.util.DateTimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
@Transactional
public class PresentationServiceImpl implements PresentationService {
    @Autowired
    private PresentationRepo presentationRepo;
    @Autowired
    private PresentationPanelRepo presentationPanelRepo;
    @Autowired
    private ScheduleRepo scheduleRepo;
    @Autowired
    private PanelRepo panelRepo;
    @Autowired
    private UserService userService;
    @Autowired
    private AuthService authService;
    @Autowired
    private GoogleAPIService googleAPIService;

    @Override
    public List<PresentationModel> addPresentationList(List<PresentationModel> presentationModelList) {
        List<PresentationBean> presentationBeans = new ArrayList<>();
        for (PresentationModel presentationModel : presentationModelList) {
            UserBean sv =
                    this.userService.getUserByEmail(presentationModel.getSupervisorModel().getEmail());
            UserBean chairperson =
                    this.userService.getUserByEmail(presentationModel.getChairperson().getEmail());
            PresentationBean presentationBean = new PresentationBean(presentationModel);
            presentationBean.setSupervisorId(sv.getId());
            if (chairperson != null) {
                presentationBean.setChairPersonId(chairperson.getId());
            }
            this.presentationRepo.save(presentationBean);

            if (presentationModel.getPanelModels() != null) {
                for (PanelModel panelModel : presentationModel.getPanelModels()) {
                    if (panelModel.getEmail() != null) {
                        PresentationPanelBean presentationPanelBean = new PresentationPanelBean();
                        UserBean panel
                                = this.userService.getUserByEmail(panelModel.getEmail());
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
    public PresentationModel editPresentation(PresentationModel presentationModel) {
        PresentationBean presentationBean = this.presentationRepo.getById(presentationModel.getId());
        if (presentationBean == null) {
            throw new RuntimeException("Presentation editing does not exist.");
        }
        presentationBean.setTitle(presentationModel.getTitle());
        presentationBean.setStudentName(presentationModel.getStudentName());
        presentationBean.setStudentEmail(presentationModel.getStudentEmail());
        presentationBean.setStudentMatrixNo(presentationModel.getStudentMatrixNo());
        UserBean sv =
                this.userService.getUserByEmail(presentationModel.getSupervisorModel().getEmail());
        UserBean chairperson =
                this.userService.getUserByEmail(presentationModel.getChairperson().getEmail());
        presentationBean.setSupervisorId(sv.getId());
        if (sv != null) {
            presentationBean.setSupervisorId(sv.getId());
        }
        if (chairperson != null) {
            presentationBean.setChairPersonId(chairperson.getId());
        }


        List<PresentationPanelBean> existingPresentationPanelBeans = presentationBean.getPresentationPanelBeans();
        List<PanelModel> updatedPanelList = presentationModel.getPanelModels();
        if (updatedPanelList != null) {
            if (existingPresentationPanelBeans != null) {
                compareAndDeleteFromExisting(existingPresentationPanelBeans, updatedPanelList);
            }
            for (PanelModel pModel : updatedPanelList) {
                if (pModel.getEmail() != null && !presentationBean.hasPanelWithUsername(pModel.getEmail())) {
                    PresentationPanelBean presentationPanelBean = new PresentationPanelBean();
                    UserBean panel
                            = this.userService.getUserByEmail(pModel.getEmail());
                    presentationPanelBean.setPanelId(panel.getId());
                    presentationPanelBean.setPresentationId(presentationBean.getId());
                    this.panelRepo.save(presentationPanelBean);
                }
            }
        }
        return presentationModel;
    }

    private void compareAndDeleteFromExisting(List<PresentationPanelBean> presentationPanelBeans, List<PanelModel> panelModelList) {
        if (presentationPanelBeans != null) {
            List<PresentationPanelBean> presentationPanelsCopy = new ArrayList<>(presentationPanelBeans);
            for (PresentationPanelBean pp : presentationPanelsCopy) {
                if (!findBeanFromModelsByUsername(pp, panelModelList)) {
                    presentationPanelBeans.remove(presentationPanelBeans.indexOf(pp));
                    this.presentationPanelRepo.deleteById(pp.getId());
                }
            }
        }

    }

    private boolean findBeanFromModelsByUsername(PresentationPanelBean presentationPanelBean, List<PanelModel> panelModelList) {
        if (panelModelList != null) {
            for (PanelModel p : panelModelList) {
                if (presentationPanelBean.getPanelBean().getEmail() == p.getEmail())
                    return true;
            }
        }
        return false;
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
    public SchedulerModel getScheduler(Integer scheduleId) {
        List<PresentationBean> presentationBeans =
                this.presentationRepo.findPresentationBeansByScheduleIdNotAndEndTimeAfter(scheduleId, new Date());
        List<PresentationModel> otherPresentations = new ArrayList<>();
        if (presentationBeans != null) {
            for (PresentationBean p : presentationBeans) {
                otherPresentations.add(PresentationModel.build(p));
            }
        }
        List<PresentationModel> presentationToSchedule = getPresentationListWithCommonAvailability(scheduleId);
        return new SchedulerModel(presentationToSchedule, otherPresentations);
    }

    @Override
    public List<PresentationModel> getAllPresentationAfterNow() {
        List<PresentationBean> presentationBeans =
                this.presentationRepo.findPresentationBeansByEndTimeAfter(new Date());
        List<PresentationModel> occupiedPresentationSlots = new ArrayList<>();
        if (presentationBeans != null) {
            for (PresentationBean p : presentationBeans) {
                occupiedPresentationSlots.add(PresentationModel.build(p));
            }
        }
        return occupiedPresentationSlots;
    }

    @Override
    public List<PresentationModel> getPresentationListWithCommonAvailability(Integer scheduleId) {
        List<PresentationBean> presentationBeans = this.presentationRepo.findPresentationBeansByScheduleId(scheduleId);
        List<PresentationModel> presentationModelList = new ArrayList<>();
        if (presentationBeans != null) {
            for (PresentationBean presentationBean : presentationBeans) {
                PresentationModel presentationModel = this.getPresentationModelWithCommonAvailability(presentationBean);
                presentationModelList.add(presentationModel);
            }
        }
        return presentationModelList;
    }

    private PresentationModel getPresentationModelWithCommonAvailability(PresentationBean presentationBean) {
        PresentationModel presentationModel = PresentationModel.build(presentationBean);
        List<TimeRange> commonAvailabilityList = calculatePanelCommonAvailability(presentationBean);
        presentationModel.setCommonAvailabilityList(commonAvailabilityList);
        return presentationModel;
    }

    private List<TimeRange> calculatePanelCommonAvailability(PresentationBean presentationBean) {
        List<TimeRange> commonAvailabilityList = new ArrayList<>();
        if (presentationBean.getPanelBeans() != null && presentationBean.getPanelBeans().size() > 0) {
            List<UserBean> panelsOrChairperson = presentationBean.getPanelBeans();
            // add chairperson
            if (presentationBean.getChairPersonBean() != null) {
                panelsOrChairperson.add(presentationBean.getChairPersonBean());
            }
            List<List<TimeRange>> availabilityListGroupByPanel = new ArrayList<>();
            for (UserBean panel : panelsOrChairperson) {
                List<TimeRange> availabilityList = new ArrayList<>();
                if (panel.getAvailabilityBeans() != null && panel.getAvailabilityBeans().size() > 0) {
                    for (AvailabilityBean availability : panel.getAvailabilityBeans()) {
                        if (DateTimeUtil.timeRangesAfterNow(availability.getStartTime(), availability.getEndTime())) {
                            availabilityList.add(availability.toTimeRange());
                        }
                    }
                    availabilityListGroupByPanel.add(availabilityList);
                } else {
                    return new ArrayList<>();
                }
            }
            if (availabilityListGroupByPanel.size() == 0) {
                return new ArrayList<>();
            } else if (availabilityListGroupByPanel.size() == 1) {
                return availabilityListGroupByPanel.get(0);
            } else {
                commonAvailabilityList = availabilityListGroupByPanel.get(0);
                for (int i = 1; i < availabilityListGroupByPanel.size(); i++) {
                    commonAvailabilityList = getOverlappedTimeRange(commonAvailabilityList, availabilityListGroupByPanel.get(i));
                }
            }
        }
        return commonAvailabilityList;
    }

    private List<TimeRange> getOverlappedTimeRange(List<TimeRange> timeRanges1, List<TimeRange> timeRanges2) {
        List<TimeRange> overlappedTimeRanges = new ArrayList<>();
        if (timeRanges1 != null && timeRanges1.size() > 0 && timeRanges2 != null && timeRanges2.size() > 0) {
            for (TimeRange tr1 : timeRanges1) {
                for (TimeRange tr2 : timeRanges2) {
                    if (DateTimeUtil
                            .timeRangesOverlapped(
                                    tr1.getStartTime(),
                                    tr1.getEndTime(),
                                    tr2.getStartTime(),
                                    tr2.getEndTime())) {
                        TimeRange overlappedTr = new TimeRange();
                        if (tr1.getStartTime().after(tr2.getStartTime())) {
                            overlappedTr.setStartTime(tr1.getStartTime());
                        } else {
                            overlappedTr.setStartTime(tr2.getStartTime());
                        }
                        if (tr1.getEndTime().before(tr2.getEndTime())) {
                            overlappedTr.setEndTime(tr1.getEndTime());
                        } else {
                            overlappedTr.setEndTime(tr2.getEndTime());
                        }
                        overlappedTimeRanges.add(overlappedTr);
                    }
                }
            }
        }
        return overlappedTimeRanges;
    }

    @Override
    public List<PresentationModel> getPresentationListAsPanel() {
        CustomUserDetails authUser = this.authService.getAuthUserDetails();
        List<PresentationPanelBean> presentationPanelBeans = this.panelRepo.findPresentationPanelBeansByPanelIdOrderByIdDesc(authUser.getId());
        List<PresentationModel> presentationModelList = new ArrayList<>();
        if (presentationPanelBeans != null) {
            for (PresentationPanelBean presentationPanelBean : presentationPanelBeans) {
                PresentationModel presentationModel = PresentationModel.build(presentationPanelBean.getPresentationBean());
                presentationModelList.add(presentationModel);
            }
        }
        return presentationModelList;
    }

    @Override
    public List<PresentationModel> getPresentationListAsSupervisor() {
        CustomUserDetails authUser = this.authService.getAuthUserDetails();
        List<PresentationBean> presentationBeans = this.presentationRepo.findPresentationBeansBySupervisorIdOrderByIdDesc(authUser.getId());
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
    public List<PresentationModel> getPresentationListAsChairperson() {
        CustomUserDetails authUser = this.authService.getAuthUserDetails();
        List<PresentationBean> presentationBeans = this.presentationRepo.findPresentationBeansByChairPersonIdOrderByIdDesc(authUser.getId());
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
                    presentationBean.setRoomId(presentationModel.getRoomId());
                }

            }
        }
        return presentationScheduleModels;
    }

    @Override
    public SchedulerModel getAutoSchedulingResultScheduler(AutoSchedulingModel autoSchedulingModel) {
        List<PresentationModel> occupiedPresentationSlots = this.getAllPresentationAfterNow();
        List<PresentationModel> autoScheduledModel = this.autoScheduling(autoSchedulingModel);
        SchedulerModel schedulerModel = new SchedulerModel();
        schedulerModel.setUnAvailableTime(occupiedPresentationSlots);
        schedulerModel.setPresentationToSchedule(autoScheduledModel);
        return schedulerModel;
    }

    @Override
    public List<PresentationModel> autoScheduling(AutoSchedulingModel autoSchedulingModel) {
        ScheduleBean scheduleBean = this.scheduleRepo.getById(autoSchedulingModel.getScheduleId());
        List<PresentationBean> presentationBeans = scheduleBean.getPresentationBeans();
        List<Presentation> presentationsToSchedule = new ArrayList<>();
        List<Presentation> presentationsNotToSchedule = new ArrayList<>();//to-do: handle this!!!!!
        //merge online slot
        if (autoSchedulingModel.getOnlinePresentationSlotsModel() != null
                && autoSchedulingModel.getOnlinePresentationSlotsModel().getSlots() != null) {
            List<TimeRange> slot = autoSchedulingModel.getOnlinePresentationSlotsModel().getSlots();
            DateTimeUtil.mergeOverlappedOrContinuousTimeRange(slot);
        } else {
            if (autoSchedulingModel.getPresentationsToScheduleOnline() != null
                    && autoSchedulingModel.getPresentationsToScheduleOnline().size() > 0) {
                throw new RuntimeException("Online presentation slot not provided.");
            }
        }
        //merge physical slot
        List<TimeRange> combinedRoomsSlot = new ArrayList<>();
        if (autoSchedulingModel.getRoomPresentationSlotsModels() != null) {
            List<RoomPresentationSlotsModel> roomsSlots = autoSchedulingModel.getRoomPresentationSlotsModels();
            for (RoomPresentationSlotsModel roomSlots : roomsSlots) {
                if (roomSlots.getSlots() != null) {
                    List<TimeRange> slots = roomSlots.getSlots();
                    DateTimeUtil.mergeOverlappedOrContinuousTimeRange(slots);
                    combinedRoomsSlot.addAll(slots);
                }
            }

        } else {
            if (autoSchedulingModel.getPresentationsToSchedulePhysical() != null
                    && autoSchedulingModel.getPresentationsToSchedulePhysical().size() > 0) {
                throw new RuntimeException("Physical room presentation slot not provided.");
            }
        }
        if (combinedRoomsSlot.size() == 0) {
            if (autoSchedulingModel.getPresentationsToSchedulePhysical() != null
                    && autoSchedulingModel.getPresentationsToSchedulePhysical().size() > 0) {
                throw new RuntimeException("Physical room presentation slot not provided.");
            }
        }
        if (presentationBeans != null) {
            for (PresentationBean presentationBean : presentationBeans) {
                if (presentationBean.containIn(autoSchedulingModel.getPresentationsToScheduleOnline())) {
                    Presentation presentation
                            = Presentation.build(presentationBean, PresentationMode.ONLINE);
                    presentationsToSchedule.add(presentation);
                } else if (presentationBean.containIn(autoSchedulingModel.getPresentationsToSchedulePhysical())) {
                    Presentation presentation
                            = Presentation.build(presentationBean, PresentationMode.PHYSICAL);
                    presentationsToSchedule.add(presentation);
                }
            }
            List<Presentation> autoScheduledPresentation = this.geneticAlgorithmScheduling(presentationsToSchedule, autoSchedulingModel);
            List<PresentationModel> scheduledPresentationModels = new ArrayList<>();
            if (autoScheduledPresentation != null) {
                for (Presentation p : autoScheduledPresentation) {
                    PresentationBean presentationBean = this.presentationRepo.getById(p.getId());
                    PresentationModel scheduledPresentationModel = this.getPresentationModelWithCommonAvailability(presentationBean);
                    scheduledPresentationModel.setStartTime(p.getStartTime());
                    scheduledPresentationModel.setEndTime(p.getEndTime());
                    scheduledPresentationModel.setRoomId(p.getRoom().getId());
                    scheduledPresentationModel.setRoomName(p.getRoom().getName());
                    scheduledPresentationModels.add(scheduledPresentationModel);
                }
            }
            return scheduledPresentationModels;
        }
        return null;
    }

    private List<Presentation> geneticAlgorithmScheduling(List<Presentation> presentationsToSchedule, AutoSchedulingModel autoSchedulingModel) {
        //build physical room and init slot with duration, throw error if not enough slot
        List<TimeRange> combinedMeetingSLot = new ArrayList<>();
        List<Room> rooms = new ArrayList<>();
        if (autoSchedulingModel.getRoomPresentationSlotsModels() != null) {
            for (RoomPresentationSlotsModel room : autoSchedulingModel.getRoomPresentationSlotsModels()) {
                Room gaRoom = Room.buildAndInitMeetingSlots(room, autoSchedulingModel.getPresentationDuration());
                if (gaRoom.getMeetingSlots().size() > 0) {
                    rooms.add(gaRoom);
                    combinedMeetingSLot.addAll(gaRoom.getMeetingSlots());
                }
            }
        }
        if (combinedMeetingSLot.size() < autoSchedulingModel.getPresentationsToSchedulePhysical().size()) {
            throw new RuntimeException("Not enough physical presentation slot provided.");
        }

        //build online room and init slot with duration
        Room room = Room.buildAndInitMeetingSlots(autoSchedulingModel.getOnlinePresentationSlotsModel(), autoSchedulingModel.getPresentationDuration());
        if (room.getMeetingSlots().size() < autoSchedulingModel.getPresentationsToScheduleOnline().size()) {
            throw new RuntimeException("Not enough online presentation slot provided.");
        }
        ScheduleData scheduleData =
                new ScheduleData(
                        rooms,
                        presentationsToSchedule,
                        room);
        GeneticAlgorithm geneticAlgorithm = new GeneticAlgorithm(scheduleData);
        int populationSize = 10;
        Population population = new Population(populationSize, scheduleData).shuffleAndSortByFitness();
        int generation = 0;
        System.out.println("--------------------------------------------------------------------");
        System.out.println("Generation: " + ++generation);
        System.out.println("Fitness: " + population.getScheduleList().get(0).getFitness().ofFeasibility()
                + " | Conflicts: " + population.getScheduleList().get(0).getNumberOfConflict());
        System.out.println("");
        for (int i = 0; i < population.getScheduleList().size(); i++) {
            Schedule currentSchedule = population.getScheduleList().get(i);
            System.out.println("Schedule " + i + ": fitness = " + currentSchedule.getFitness().ofFeasibility() + "conflicts = " + currentSchedule.getNumberOfConflict());
            for (Presentation presentation : currentSchedule.getPresentationList()) {
                System.out.println(presentation.getStartTime() + " to " + presentation.getEndTime() + " room: " + presentation.getRoom().getName());
            }
        }
        int unableToEvolveCounter = 0;
        double previousFitness = 0;
        // stop when unable to generate for many time or feasible generated
        while (population.getScheduleList().get(0).getFitness().ofFeasibility() != 1.0
                && unableToEvolveCounter < 1000) {
            population = geneticAlgorithm.evolve(population).shuffleAndSortByFitness();
            System.out.println("--------------------------------------------------------------------");
            System.out.println("Generation: " + ++generation);
            System.out.println("Fitness: " + population.getScheduleList().get(0).getFitness().ofFeasibility()
                    + " | Conflicts: " + population.getScheduleList().get(0).getNumberOfConflict());
            System.out.println("");
            for (int i = 0; i < population.getScheduleList().size(); i++) {
                Schedule currentSchedule = population.getScheduleList().get(i);
                System.out.println("Schedule " + i + ": fitness = " + currentSchedule.getFitness().ofFeasibility() + " | conflicts = " + currentSchedule.getNumberOfConflict());
                currentSchedule.sortPresentation();
                for (Presentation presentation : currentSchedule.getPresentationList()) {
                    System.out.println(presentation.getStartTime() + " to " + presentation.getEndTime() + " room: " + presentation.getRoom().getName());
                }
            }
            double currentFitness = population.getScheduleList().get(0).getFitness().ofFeasibility();
            if (currentFitness > previousFitness) {
                unableToEvolveCounter = 0;
            } else {
                unableToEvolveCounter++;
            }
            previousFitness = currentFitness;
        }
        System.out.println("--------------------------------------------------------------------");
        System.out.println("Generation: " + generation);
        System.out.println("Fitness: " + population.getScheduleList().get(0).getFitness().ofFeasibility()
                + " | Conflicts: " + population.getScheduleList().get(0).getNumberOfConflict());
        System.out.println("");

        Schedule currentSchedule = population.getScheduleList().get(0);
        System.out.println("Schedule " + 0 + ": fitness = " + currentSchedule.getFitness().ofFeasibility() + "conflicts = " + currentSchedule.getNumberOfConflict());
        for (Presentation presentation : currentSchedule.getPresentationList()) {
            System.out.println(presentation.getStartTime() + " to " + presentation.getEndTime() + " room: " + presentation.getRoom().getName());
        }
        return currentSchedule.getPresentationList();
//        int populationSize = 6;
//        Population population = new Population(populationSize, scheduleData);
//        population.getScheduleList().get(0).testSetFitness(5);
//        population.getScheduleList().get(1).testSetFitness(1);
//        population.getScheduleList().get(2).testSetFitness(1);
//        population.getScheduleList().get(3).testSetFitness(1);
//        population.getScheduleList().get(4).testSetFitness(1);
//        population.getScheduleList().get(5).testSetFitness(1);
//        for (Schedule schedule : population.getScheduleList()) {
//            System.out.println(schedule.toString());
//        }
//        IntStream.range(0, 10).forEach(x -> {
//            System.out.println(population.getScheduleList().indexOf(geneticAlgorithm.selectPopulationBasedOnFitness(population)));
//        });
    }

    @Override
    public List<PresentationModel> syncAllPresentationWithGoogleCalendar(Integer scheduleId) {
        ScheduleBean scheduleBean = this.scheduleRepo.getById(scheduleId);
        List<PresentationModel> presentationModels = new ArrayList<>();
        if (scheduleBean != null) {
            String scheduleTitle = scheduleBean.getTitle();
            List<PresentationBean> presentationBeans = scheduleBean.getPresentationBeans();
            Date now = new Date();
            if (presentationBeans != null) {
                for (PresentationBean presentationBean : presentationBeans) {
                    if (presentationBean.getStartTime() != null && presentationBean.getEndTime() != null) {
                        PresentationModel presentationModel = PresentationModel.build(presentationBean);
                        presentationModels.add(presentationModel);
                        try {
                            presentationModel = this.googleAPIService.addOrUpdateGoogleCalendarEvent(presentationModel, scheduleTitle);
                            presentationBean.setCalendarId(presentationModel.getCalendarId());
                            presentationBean.setLastSync(now);
                            presentationBean.setCalendarHtmlLink(presentationModel.getCalendarHtmlLink());
                            presentationBean.setGoogleMeetLink(presentationModel.getGoogleMeetLink());
                            presentationBean.setCalendarStartTime(presentationModel.getStartTime());
                            presentationBean.setCalendarEndTime(presentationModel.getEndTime());
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }


                }

            }
        }
        return presentationModels;
    }

    @Override
    public PresentationModel syncPresentationWithGoogleCalendar(Integer presentationId) {
        PresentationBean presentationBean = this.presentationRepo.getById(presentationId);
        PresentationModel presentationModel = null;
        if (presentationBean.getStartTime() != null && presentationBean.getEndTime() != null) {
            presentationModel = PresentationModel.build(presentationBean);
            try {
                presentationModel = this.googleAPIService.addOrUpdateGoogleCalendarEvent(presentationModel, presentationBean.getScheduleBean().getTitle());
                presentationBean.setCalendarId(presentationModel.getCalendarId());
                presentationBean.setLastSync(new Date());
                presentationBean.setCalendarHtmlLink(presentationModel.getCalendarHtmlLink());
                presentationBean.setGoogleMeetLink(presentationModel.getGoogleMeetLink());
                presentationBean.setCalendarStartTime(presentationModel.getStartTime());
                presentationBean.setCalendarEndTime(presentationModel.getEndTime());
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        return presentationModel;
    }

    @Override
    public Boolean deletePresentation(Integer id) {
        try {
            this.presentationRepo.deleteById(id);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
