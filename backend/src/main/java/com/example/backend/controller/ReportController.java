package com.example.backend.controller;

import com.example.backend.model.Report;
import com.example.backend.model.User;
import com.example.backend.repository.ReportRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.ReportRequest;
import com.example.backend.serviceImpl.ReportService;
import com.example.backend.serviceImpl.UserService;
import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    @Autowired
    private ReportService reportService;
    @Autowired
    private UserService userService;

    @PostMapping()
    public ResponseEntity<Report> createReport(@RequestHeader("Authorization") String jwt, @RequestBody ReportRequest report) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        report.setUserName(user.getUserName());
        return new ResponseEntity<>(reportService.createReport(report), HttpStatus.CREATED);
    }

    @PutMapping("/updateReport/{id}")
    public ResponseEntity<Report> updateReport(@RequestHeader("Authorization") String jwt, @RequestBody ReportRequest report, @PathVariable String id) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(reportService.updateReport(id, report), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Report>> getReportById(@RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(reportService.getReportById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        reportService.deleteReport(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping()
    public ResponseEntity<List<Report>> getReportByUserName(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(reportService.getReportByUsername(user.getUserName()), HttpStatus.OK);
    }
}
