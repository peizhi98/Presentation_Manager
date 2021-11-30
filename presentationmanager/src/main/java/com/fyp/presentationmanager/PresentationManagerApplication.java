package com.fyp.presentationmanager;

import com.fyp.presentationmanager.model.scheduleGeneticAlgo.GeneticAlgorithm;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.Population;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.Schedule;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.Presentation;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.ScheduleData;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Collections;


@SpringBootApplication
public class PresentationManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PresentationManagerApplication.class, args);
//        ScheduleData scheduleData = new ScheduleData();
//        GeneticAlgorithm geneticAlgorithm = new GeneticAlgorithm(scheduleData);
//        int populationSize=10;
//        Population population = new Population(populationSize, scheduleData).shuffleAndSortByFitness();
//        int generation = 0;
//        System.out.println("--------------------------------------------------------------------");
//        System.out.println("Generation: " + ++generation);
//        System.out.println("Fitness: " + population.getScheduleList().get(0).getFitness().ofFeasibility()
//                + " | Conflicts: " + population.getScheduleList().get(0).getNumberOfConflict());
//        System.out.println("");
//        for (int i = 0; i < population.getScheduleList().size(); i++) {
//            Schedule currentSchedule = population.getScheduleList().get(i);
//            System.out.println("Schedule " + i + ": fitness = " + currentSchedule.getFitness().ofFeasibility() + "conflicts = " + currentSchedule.getNumberOfConflict());
//            for (Presentation presentation : currentSchedule.getPresentationList()) {
//                System.out.println(presentation.getStartTime() + " to " + presentation.getEndTime());
//            }
//        }
//        while (population.getScheduleList().get(0).getFitness().ofFeasibility() != 1.0) {
//            population = geneticAlgorithm.evolve(population).shuffleAndSortByFitness();
//            System.out.println("--------------------------------------------------------------------");
//            System.out.println("Generation: " + ++generation);
//            System.out.println("Fitness: " + population.getScheduleList().get(0).getFitness().ofFeasibility()
//                    + " | Conflicts: " + population.getScheduleList().get(0).getNumberOfConflict());
//            System.out.println("");
//            for (int i = 0; i < population.getScheduleList().size(); i++) {
//                Schedule currentSchedule = population.getScheduleList().get(i);
//                System.out.println("Schedule " + i + ": fitness = " + currentSchedule.getFitness().ofFeasibility() + " | conflicts = " + currentSchedule.getNumberOfConflict());
//                currentSchedule.sortPresentation();
//                for (Presentation presentation : currentSchedule.getPresentationList()) {
//                    System.out.println(presentation.getStartTime() + " to " + presentation.getEndTime());
//                }
//            }
//        }
//        System.out.println("--------------------------------------------------------------------");
//        System.out.println("Generation: " + generation);
//        System.out.println("Fitness: " + population.getScheduleList().get(0).getFitness().ofFeasibility()
//                + " | Conflicts: " + population.getScheduleList().get(0).getNumberOfConflict());
//        System.out.println("");
//
//        Schedule currentSchedule = population.getScheduleList().get(0);
//        System.out.println("Schedule " + 0 + ": fitness = " + currentSchedule.getFitness().ofFeasibility() + "conflicts = " + currentSchedule.getNumberOfConflict());
//        for (Presentation presentation : currentSchedule.getPresentationList()) {
//            System.out.println(presentation.getStartTime() + " to " + presentation.getEndTime());
//        }
////        int populationSize = 6;
////        Population population = new Population(populationSize, scheduleData);
////        population.getScheduleList().get(0).testSetFitness(5);
////        population.getScheduleList().get(1).testSetFitness(1);
////        population.getScheduleList().get(2).testSetFitness(1);
////        population.getScheduleList().get(3).testSetFitness(1);
////        population.getScheduleList().get(4).testSetFitness(1);
////        population.getScheduleList().get(5).testSetFitness(1);
////        for (Schedule schedule : population.getScheduleList()) {
////            System.out.println(schedule.toString());
////        }
////        IntStream.range(0, 10).forEach(x -> {
////            System.out.println(population.getScheduleList().indexOf(geneticAlgorithm.selectPopulationBasedOnFitness(population)));
////        });
    }

}
