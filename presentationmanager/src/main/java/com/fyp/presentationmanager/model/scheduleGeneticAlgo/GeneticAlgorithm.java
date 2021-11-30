package com.fyp.presentationmanager.model.scheduleGeneticAlgo;

import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.ScheduleData;

import java.util.List;
import java.util.stream.IntStream;


//
public class GeneticAlgorithm {
    public final int populationSize = 10;
    public final double mutationRate = 0.1;
    public final double crossoverRate = 0.9;
    public final int tournamentSelectionSize = 2;
    public final int eliteNumber = 1;
    private ScheduleData scheduleData;

    public GeneticAlgorithm(ScheduleData scheduleData) {
        this.scheduleData = scheduleData;
    }

    public Population evolve(Population population) {
        return mutatePopulation(crossOverPopulation(population));
    }

    public Population crossOverPopulation(Population prevGenPopulation) {
        Population crossoverPopulation = new Population(prevGenPopulation.getScheduleList().size(), scheduleData);
//        Elitism Selection
        IntStream.range(0, eliteNumber).forEach(x -> {
            crossoverPopulation.getScheduleList().set(x, prevGenPopulation.getScheduleList().get(x));
        });
        IntStream.range(eliteNumber, prevGenPopulation.getScheduleList().size()).forEach(x -> {
            if (crossoverRate > Math.random()) {
//                average xx-k generation
//                Schedule schedule1 = selectTournamentPopulation(prevGenPopulation).shuffleAndSortByFitness().getScheduleList().get(0);
//                Schedule schedule2 = selectTournamentPopulation(prevGenPopulation).shuffleAndSortByFitness().getScheduleList().get(0);
//                average less than 10k generation
                Schedule schedule1 = selectPopulationBasedOnFitness(prevGenPopulation);
                Schedule schedule2 = selectPopulationBasedOnFitness(prevGenPopulation);
                crossoverPopulation.getScheduleList().set(x, crossOverSchedule(schedule1, schedule2));
            } else {
                crossoverPopulation.getScheduleList().set(x, prevGenPopulation.getScheduleList().get(x));
            }
        });
        return crossoverPopulation;
    }

    public Schedule crossOverSchedule(Schedule schedule1, Schedule schedule2) {
        return uniformCrossover(schedule1, schedule2);
    }

    private Schedule uniformCrossover(Schedule schedule1, Schedule schedule2) {
        Schedule crossoverSchedule = new Schedule(scheduleData);
        int crossoverScheduleSize = crossoverSchedule.getPresentationList().size();
        IntStream.range(0, crossoverScheduleSize).forEach(x -> {
            if (Math.random() > 0.5) {
                crossoverSchedule.getPresentationList().set(x, schedule1.getPresentationList().get(x));
            } else {
                crossoverSchedule.getPresentationList().set(x, schedule2.getPresentationList().get(x));
            }
        });
        return crossoverSchedule;
    }

    private Schedule onePointCrossover(Schedule schedule1, Schedule schedule2) {
        Schedule crossoverSchedule = new Schedule(scheduleData);
        int crossoverScheduleSize = crossoverSchedule.getPresentationList().size();
        int randomMiddlePoint = 1;
        IntStream.range(0, randomMiddlePoint).forEach(x -> {
            crossoverSchedule.getPresentationList().set(x, schedule1.getPresentationList().get(x));
        });
        IntStream.range(randomMiddlePoint, crossoverScheduleSize).forEach(x -> {
            crossoverSchedule.getPresentationList().set(x, schedule2.getPresentationList().get(x));
        });
        return crossoverSchedule;
    }

    public Population mutatePopulation(Population population) {
        Population mutatePopulation = new Population(population.getScheduleList().size(), this.scheduleData);
        List<Schedule> schedules = mutatePopulation.getScheduleList();
        IntStream.range(0, eliteNumber).forEach(x -> {
            schedules.set(x, population.getScheduleList().get(x));
        });
        IntStream.range(eliteNumber, population.getScheduleList().size()).forEach(x -> {
            schedules.set(x, mutateSchedule(population.getScheduleList().get(x)));
        });
        return mutatePopulation;
    }

    public Schedule mutateSchedule(Schedule mutateSchedule) {
        Schedule schedule = new Schedule(this.scheduleData).init();
        IntStream.range(0, mutateSchedule.getPresentationList().size()).forEach(x -> {
            if (mutationRate > Math.random()) {
                mutateSchedule.getPresentationList().set(x, schedule.getPresentationList().get(x));
            }
        });

        return mutateSchedule;
    }

    public Population selectTournamentPopulation(Population population) {
        Population tournamentPopulation = new Population(tournamentSelectionSize, scheduleData);
//        IntStream.range(0, tournamentSelectionSize).forEach(x -> {
//            tournamentPopulation.getScheduleList().set(x, population.getScheduleList().get((int) (Math.random() * population.getScheduleList().size())));
//        });
        IntStream.range(0, tournamentSelectionSize).forEach(x -> {
            tournamentPopulation.getScheduleList().set(x, this.selectPopulationBasedOnFitness(population));
        });
        return tournamentPopulation;
    }

    public Schedule selectPopulationBasedOnFitness(Population population) {
        double sumOfPopulationFitness = 0;
        for (Schedule schedule : population.getScheduleList()) {
            sumOfPopulationFitness += schedule.getFitness().ofFeasibility();
        }
        int index;
        double randomProb = Math.random();
        for (index = 0; index < population.getScheduleList().size(); index++) {
            randomProb = randomProb - (population.getScheduleList().get(index).getFitness().ofFeasibility() / sumOfPopulationFitness);
            if (randomProb < 0) {
                break;
            }
        }
        return population.getScheduleList().get(index);
    }
}
