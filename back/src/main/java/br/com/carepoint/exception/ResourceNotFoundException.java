package br.com.carepoint.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String resource) {
        super(HttpStatus.NOT_FOUND, resource + " não encontrado.");
    }
}
