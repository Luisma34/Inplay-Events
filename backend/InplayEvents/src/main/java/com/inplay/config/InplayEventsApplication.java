package com.inplay.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages=("com.inplay"))
public class InplayEventsApplication {

	public static void main(String[] args) {
		SpringApplication.run(InplayEventsApplication.class, args);
	}

}
