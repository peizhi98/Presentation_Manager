package com.fyp.presentationmanager.config.request;

import com.fyp.presentationmanager.enums.SystemRole;
import org.springframework.core.convert.converter.Converter;

public class StringToSystemRoleConvertor implements Converter<String, SystemRole> {
    @Override
    public SystemRole convert(String source) {
        try {
            return SystemRole.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
