package com.fyp.presentationmanager.service.presentation;

import com.fyp.presentationmanager.entity.PresentationBean;
import com.fyp.presentationmanager.entity.PresentationPanelBean;
import com.fyp.presentationmanager.entity.ScheduleBean;
import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.enums.PresentationMode;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.presentation.AutoSchedulingModel;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.presentation.PresentationScheduleModel;
import com.fyp.presentationmanager.model.role.PanelModel;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.GeneticAlgorithm;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.Population;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.Schedule;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.Presentation;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.ScheduleData;
import com.fyp.presentationmanager.repo.PanelRepo;
import com.fyp.presentationmanager.repo.PresentationRepo;
import com.fyp.presentationmanager.repo.ScheduleRepo;
import com.fyp.presentationmanager.service.auth.AuthService;
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
    private ScheduleRepo scheduleRepo;
    @Autowired
    private PanelRepo panelRepo;
    @Autowired
    private UserService userService;
    @Autowired
    private AuthService authService;

    @Override
    public List<PresentationModel> addPresentationList(List<PresentationModel> presentationModelList) {
        List<PresentationBean> presentationBeans = new ArrayList<>();
        for (PresentationModel presentationModel : presentationModelList) {
            UserBean sv =
                    this.userService.getUserByEmail(presentationModel.getSupervisorModel().getEmail());
            PresentationBean presentationBean = new PresentationBean(presentationModel);
            presentationBean.setSupervisorId(sv.getId());
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
    public List<PresentationModel> getPresentationListAsPanel() {
        CustomUserDetails authUser = this.authService.getAuthUserDetails();
        List<PresentationPanelBean> presentationPanelBeans = this.panelRepo.findPresentationPanelBeansByPanelId(authUser.getId());
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
        List<PresentationBean> presentationBeans = this.presentationRepo.findPresentationBeansBySupervisorId(authUser.getId());
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
    public List<PresentationModel> autoScheduling(AutoSchedulingModel autoSchedulingModel) {
        ScheduleBean scheduleBean = this.scheduleRepo.getById(autoSchedulingModel.getScheduleId());
        List<PresentationBean> presentationBeans = scheduleBean.getPresentationBeans();
        List<Presentation> presentationsToSchedule = new ArrayList<>();
        List<Presentation> presentationsNotToSchedule = new ArrayList<>();//to-do: handle this!!!!!
        if (presentationBeans != null) {
            for (PresentationBean presentationBean : presentationBeans) {
                if (presentationBean.containIn(autoSchedulingModel.getPresentationToScheduleOnline())) {
                    Presentation presentation
                            = Presentation.build(presentationBean, PresentationMode.ONLINE, autoSchedulingModel.getTimeRangesToSchedule());
                    presentationsToSchedule.add(presentation);
                } else if (presentationBean.containIn(autoSchedulingModel.getPresentationToSchedulePhysical())) {
                    Presentation presentation
                            = Presentation.build(presentationBean, PresentationMode.PHYSICAL, autoSchedulingModel.getTimeRangesToSchedule());
                    presentationsToSchedule.add(presentation);
                }
            }
            this.geneticAlgorithmScheduling(presentationsToSchedule, autoSchedulingModel);
        }
        return null;
    }

    private List<Presentation> geneticAlgorithmScheduling(List<Presentation> presentationsToSchedule, AutoSchedulingModel autoSchedulingModel) {
        ScheduleData scheduleData =
                new ScheduleData(
                        autoSchedulingModel.getTimeRangesToSchedule(),
                        presentationsToSchedule,
                        autoSchedulingModel.getPresentationDuration());
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
                System.out.println(presentation.getStartTime() + " to " + presentation.getEndTime());
            }
        }
        while (population.getScheduleList().get(0).getFitness().ofFeasibility() != 1.0) {
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
                    System.out.println(presentation.getStartTime() + " to " + presentation.getEndTime());
                }
            }
        }
        System.out.println("--------------------------------------------------------------------");
        System.out.println("Generation: " + generation);
        System.out.println("Fitness: " + population.getScheduleList().get(0).getFitness().ofFeasibility()
                + " | Conflicts: " + population.getScheduleList().get(0).getNumberOfConflict());
        System.out.println("");

        Schedule currentSchedule = population.getScheduleList().get(0);
        System.out.println("Schedule " + 0 + ": fitness = " + currentSchedule.getFitness().ofFeasibility() + "conflicts = " + currentSchedule.getNumberOfConflict());
        for (Presentation presentation : currentSchedule.getPresentationList()) {
            System.out.println(presentation.getStartTime() + " to " + presentation.getEndTime());
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
}
