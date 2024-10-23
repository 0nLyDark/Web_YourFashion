package com.dangphuoctai.backend_yourFashion.exceptions;

import java.util.List;

public class ResourceNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    String resourceName;
    String field;
    String fieldName;
    Long fieldId;
    List<Long> fieldList;

    public ResourceNotFoundException() {

    }

    public ResourceNotFoundException(String resourceName, String field, String fieldName) {
        super("%s not found with %s: %s".formatted(resourceName, field, fieldName));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldName = fieldName;

    }

    public ResourceNotFoundException(String resourceName, String field, Long fieldId) {
        super("%s not found with %s: %d".formatted(resourceName, field, fieldId));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldId = fieldId;
    }

    public ResourceNotFoundException(String resourceName, String field, List<Long> fieldList) {
        super("%s not found with %s: %d".formatted(resourceName, field, fieldList));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldList = fieldList;
    }
}
