package com.example.backend.controller;

import com.example.backend.model.Report;
import com.example.backend.model.User;
import com.example.backend.request.ReportStatusRequest;
import com.example.backend.service.ReportService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/report")
public class AdminReportController {
    @Autowired
    private ReportService reportService;
    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<List<Report>> getAllReport(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(reportService.getAllReport(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Report> updateReportStatus(@RequestHeader("Authorization") String jwt, @PathVariable String id, @RequestBody ReportStatusRequest request) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(reportService.updateReportStatus(id, request), HttpStatus.OK);
    }
}
