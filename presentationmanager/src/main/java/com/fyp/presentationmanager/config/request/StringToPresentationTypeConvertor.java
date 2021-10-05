package com.fyp.presentationmanager.config.request;

import com.fyp.presentationmanager.enums.PresentationType;
import org.springframework.core.convert.converter.Converter;

public class StringToPresentationTypeConvertor implements Converter<String, PresentationType> {
    @Override
    public PresentationType convert(String source) {
        try {

            return PresentationType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
