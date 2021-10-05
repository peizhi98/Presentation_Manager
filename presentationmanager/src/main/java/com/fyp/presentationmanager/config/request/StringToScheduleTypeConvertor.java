package com.fyp.presentationmanager.config.request;

import com.fyp.presentationmanager.enums.ScheduleType;
import org.springframework.core.convert.converter.Converter;

public class StringToScheduleTypeConvertor implements Converter<String, ScheduleType> {
    @Override
    public ScheduleType convert(String source) {
        try {
            return ScheduleType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
