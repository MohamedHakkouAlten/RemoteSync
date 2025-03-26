package com.alten.remotesync.application.report.service;

import com.alten.remotesync.domain.report.repository.ReportDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReportServiceImp implements ReportService {
    private final ReportDomainRepository reportDomainRepository;
}
