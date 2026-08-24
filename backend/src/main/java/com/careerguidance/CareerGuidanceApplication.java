package com.careerguidance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Main Spring Boot Application Launcher for Student Career Guidance & Admission Platform.
 */
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.careerguidance.repository")
@EntityScan(basePackages = "com.careerguidance.entity")
public class CareerGuidanceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareerGuidanceApplication.class, args);
    }
}
