package com.fyp.presentationmanager.config.request;

import com.fyp.presentationmanager.enums.PresentationMode;
import org.springframework.core.convert.converter.Converter;

public class StringToPresentationTypeConvertor implements Converter<String, PresentationMode> {
    @Override
    public PresentationMode convert(String source) {
        try {

            return PresentationMode.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
