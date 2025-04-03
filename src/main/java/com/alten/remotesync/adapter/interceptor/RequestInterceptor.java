package com.alten.remotesync.adapter.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.lang.NonNull;

// THIS INTERCEPTOR IS IMPLEMENTED FOR LOGS PROBABLY (95%)
@Component
public class RequestInterceptor implements HandlerInterceptor {

    // Called before the controller method is executed
    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
        System.out.println("1 - preHandle() : Before sending request to the Controller");
        System.out.println("Method Type: " + request.getMethod());
        System.out.println("Request URL: " + request.getRequestURI());

        return true;
    }

    // Called after the controller method has been executed
    @Override
    public void postHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler,
                           org.springframework.web.servlet.ModelAndView modelAndView) throws Exception {
        System.out.println("2 - postHandle() : After the Controller method execution but before rendering the response to the user");
        System.out.println("Response Status: " + response.getStatus());
    }

    // Called after the complete request response has been processed
    @Override
    public void afterCompletion(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler, Exception ex) throws Exception {
        System.out.println("3 - afterCompletion() : After the complete request-response cycle");
        if (ex != null) {
            System.out.println("Exception occurred: " + ex.getMessage());
        }
        System.out.println("Request URL: " + request.getRequestURI() + " - Status: " + response.getStatus());
    }
}
