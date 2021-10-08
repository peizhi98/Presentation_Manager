package com.fyp.presentationmanager.util;

import java.util.Date;

public class DateTimeUtil {
    public static boolean timeRangesOverlapped(Date start1, Date end1, Date start2, Date end2) {
        if (timeRangesAreEqual(start1, end1, start2, end2)
                || dateExclusivelyBetweenRange(start1, start2, end2)
                || dateExclusivelyBetweenRange(end1, start2, end2))
            return true;
        return false;
    }

    public static boolean timeRangesAreEqual(Date start1, Date end1, Date start2, Date end2) {
        if (start1.compareTo(start2) == 0 && end1.compareTo(end2) == 0)
            return true;
        return false;
    }

    public static boolean timeRangeIsBetweenTimeRange(Date start1, Date end1, Date start2, Date end2) {
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

}
