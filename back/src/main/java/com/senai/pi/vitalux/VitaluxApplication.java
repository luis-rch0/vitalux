package com.senai.pi.vitalux;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VitaluxApplication {

	public static void main(String[] args) {
		SpringApplication.run(VitaluxApplication.class, args);

		System.out.println("Hello, World! A aplicação Vitalux está rodando.");
	}

}
