package com.alten.remotesync.adapter.exception;

import com.alten.remotesync.adapter.exception.assignedRotation.AssignedRotationNotFoundException;
import com.alten.remotesync.adapter.exception.project.ProjectNotFoundException;
import com.alten.remotesync.adapter.exception.report.ReportNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> userNotFoundException(UserNotFoundException e) {
        Map<String, Object> response = ResponseWrapper.error(e.getMessage(), HttpStatus.NOT_FOUND);
        // ADDING LOGS HERE FOR THE DATABASE !
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<?> projectNotFoundException(ProjectNotFoundException e) {
        Map<String, Object> response = ResponseWrapper.error(e.getMessage(), HttpStatus.NOT_FOUND);
        // ADDING LOGS HERE FOR THE DATABASE !
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AssignedRotationNotFoundException.class)
    public ResponseEntity<?> assignedRotationNotFoundException(AssignedRotationNotFoundException e) {
        Map<String, Object> response = ResponseWrapper.error(e.getMessage(), HttpStatus.NOT_FOUND);
        // ADDING LOGS HERE FOR THE DATABASE !
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ReportNotFoundException.class)
    public ResponseEntity<?> reportNotFoundException(ReportNotFoundException e) {
        Map<String, Object> response = ResponseWrapper.error(e.getMessage(), HttpStatus.NOT_FOUND);
        // ADDING LOGS HERE FOR THE DATABASE !
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }














    // VALIDATION API RESPONSE
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String triggeredBy = (authentication != null) ? authentication.getName() : "Unknown";

        Map<String, Object> response = ResponseWrapper.validationError(fieldErrors, HttpStatus.BAD_REQUEST, triggeredBy);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
