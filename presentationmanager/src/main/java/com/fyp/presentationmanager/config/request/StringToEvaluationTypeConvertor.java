package com.fyp.presentationmanager.config.request;

import com.fyp.presentationmanager.enums.EvaluationType;
import org.springframework.core.convert.converter.Converter;

public class StringToEvaluationTypeConvertor implements Converter<String, EvaluationType> {
    @Override
    public EvaluationType convert(String source) {
        try {
            return EvaluationType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
