package com.fyp.presentationmanager.util;

import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;

import java.util.*;

public class DateTimeUtil {
    public static boolean timeRangesOverlapped(Date start1, Date end1, Date start2, Date end2) {
        if (
//                timeRangesAreEqual(start1, end1, start2, end2)
                start1.compareTo(start2) == 0
                        || end1.compareTo(end2) == 0
                        || dateExclusivelyBetweenRange(start1, start2, end2)
                        || dateExclusivelyBetweenRange(end1, start2, end2)
                        || dateExclusivelyBetweenRange(start2, start1, end1)
                        || dateExclusivelyBetweenRange(end2, start1, end1))
            return true;
        return false;
    }

    public static boolean timeRangesContinuous(Date start1, Date end1, Date start2, Date end2) {
        if (start1.compareTo(end2) == 0 || start2.compareTo(end1) == 0)
            return true;
        return false;
    }

    public static boolean timeRangesAreEqual(Date start1, Date end1, Date start2, Date end2) {
        if (start1.compareTo(start2) == 0 && end1.compareTo(end2) == 0)
            return true;
        return false;
    }

    public static boolean timeRangesAfterNow(Date start, Date end) {
        Date now = new Date();
        if (end.after(now))
            return true;
        return false;
    }

    public static boolean timeRange1IsBetweenTimeRange2(Date start1, Date end1, Date start2, Date end2) {
        if (timeInclusivelyBetweenRange(start1, start2, end2) && timeInclusivelyBetweenRange(end1, start2, end2))
            return true;
        return false;
    }

    public static boolean timeInclusivelyBetweenRange(Date date, Date start, Date end) {
        if (dateExclusivelyBetweenRange(date, start, end)
                || date.compareTo(start) == 0
                || date.compareTo(end) == 0)
            return true;
        return false;
    }

    public static boolean dateExclusivelyBetweenRange(Date date, Date start, Date end) {
        if (date.after(start) && date.before(end))
            return true;
        return false;
    }

    public static long minutesToMillis(int minutes) {
        return (long) minutes * 60 * 1000;
    }

    public static long hoursToMillis(double hours) {
        return (long) hours * 60 * 60 * 1000;
    }

    public static boolean timeAfterIncl(Date time1, Date time2) {
        return time1.after(time2) || time1.compareTo(time2) == 0;
    }

    public static void mergeOverlappedOrContinuousTimeRange(List<TimeRange> slot) {
        Collections.sort(slot, new Comparator<TimeRange>() {
            @Override
            public int compare(TimeRange o1, TimeRange o2) {
                if (o1.getStartTime().compareTo(o2.getStartTime()) == 0) {
                    return 0;
                }
                return o1.getStartTime().after(o2.getStartTime()) ? 1 : -1;
            }
        });
        Iterator<TimeRange> itr = slot.iterator();
        TimeRange current = null;
        while (itr.hasNext()) {
            if (current == null) {
                current = itr.next();
            } else {
                TimeRange next = itr.next();
                if (DateTimeUtil.timeRangesOverlapped(
                        current.getStartTime(),
                        current.getEndTime(),
                        next.getStartTime(),
                        next.getEndTime())
                        || DateTimeUtil.timeRangesContinuous(
                        current.getStartTime(),
                        current.getEndTime(),
                        next.getStartTime(),
                        next.getEndTime()
                )) {
                    current.setEndTime(next.getEndTime());
                    itr.remove();
                } else {
                    current = next;
                }
            }

        }
    }
}
