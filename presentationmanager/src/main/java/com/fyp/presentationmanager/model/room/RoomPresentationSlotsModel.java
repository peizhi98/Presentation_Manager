package com.fyp.presentationmanager.model.room;

import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomPresentationSlotsModel {
    private Integer id;
    private String name;
    private List<TimeRange> slots;
}
