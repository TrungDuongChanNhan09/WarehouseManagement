package com.example.backend.service;

import com.example.backend.model.Report;
import com.example.backend.request.ReportRequest;

import java.util.List;
import java.util.Optional;

public interface ReportService {
    Report createReport(ReportRequest report);
    Report updateReport(String reportId, ReportRequest report) throws Exception;
    Optional<Report> getReportById(String reportId);
    List<Report> getAllReport();
    void deleteReport(String reportId);
    List<Report> getReportByUsername(String username);
}
