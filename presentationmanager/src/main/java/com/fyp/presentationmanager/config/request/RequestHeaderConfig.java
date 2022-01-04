package com.fyp.presentationmanager.config.request;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class RequestHeaderConfig implements WebMvcConfigurer {
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH");
//    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToPresentationTypeConvertor());
        registry.addConverter(new StringToScheduleTypeConvertor());
        registry.addConverter(new StringToEvaluationTypeConvertor());
        registry.addConverter(new StringToSystemRoleConvertor());
    }
}
