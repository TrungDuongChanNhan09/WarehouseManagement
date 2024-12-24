package com.example.backend.serviceImpl;

import com.example.backend.model.Report;
import com.example.backend.repository.ReportRepository;
import com.example.backend.request.ReportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Service
public class ReportService implements com.example.backend.service.ReportService {
    @Autowired
    private ReportRepository reportRepository;
    @Override
    public Report createReport(ReportRequest report) {
        Report newReport = new Report();
        LocalDate currentDate = LocalDate.now();
        if(report.getCreatedAt() == null)
            newReport.setCreatedAt(currentDate);
        else if (report.getCreatedAt().compareTo(currentDate) > 0) {
            throw new IllegalArgumentException("Ngày nhập không được lớn hơn ngày hiện tại.");
        }
        newReport.setReportPriority(report.getReportPriority());
        newReport.setTitle(report.getTitle());
        newReport.setCreatedAt(report.getCreatedAt());
        newReport.setDescription(report.getDescription());
        newReport.setUserName(report.getUserName());
        return reportRepository.save(newReport);
    }

    @Override
    public Report updateReport(String reportId, ReportRequest report) throws Exception {
        Report newReport = reportRepository.findById(reportId).orElse(null);
        if(newReport == null){
            throw new Exception("Report is not found");
        }

        LocalDate currentDate = LocalDate.now();
        if(report.getUpdatedAt() == null)
            newReport.setUpdatedAt(currentDate);
        else if (report.getUpdatedAt().compareTo(currentDate) > 0) {
            throw new IllegalArgumentException("Ngày nhập không được lớn hơn ngày hiện tại.");
        }
        newReport.setReportPriority(report.getReportPriority());
        newReport.setTitle(report.getTitle());
        newReport.setUpdatedAt(report.getUpdatedAt());
        newReport.setDescription(report.getDescription());
        newReport.setUserName(report.getUserName());
        return reportRepository.save(newReport);
    }

    @Override
    public Optional<Report> getReportById(String reportId) {
        return reportRepository.findById(reportId);
    }

    @Override
    public List<Report> getAllReport() {
        return reportRepository.findAll();
    }

    @Override
    public void deleteReport(String reportId) {
        reportRepository.deleteById(reportId);
    }

    @Override
    public List<Report> getReportByUsername(String username) {
        return reportRepository.findByuserName(username);
    }
}
