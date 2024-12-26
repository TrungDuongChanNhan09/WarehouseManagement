package com.example.backend.controller;

import com.example.backend.model.Export;
import com.example.backend.model.User;
import com.example.backend.repository.ExportRepository;
import com.example.backend.request.ExportRequest;
import com.example.backend.request.ExportStateRequest;
import com.example.backend.service.ExportService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/export")
public class AdminExportController {
    @Autowired
    private ExportService exportService;

    @Autowired
    private UserService userService;

    @PostMapping("")
    public ResponseEntity<Export> createExport(@RequestHeader("Authorization") String jwt, @RequestBody ExportRequest export) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(exportService.createExport(export), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Export> updateExport(@RequestHeader("Authorization") String jwt, @RequestBody ExportRequest export, @PathVariable String id) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(exportService.updateExport(id, export), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExport(@RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        exportService.deleteExport(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/updateExportStatus/{id}")
    public ResponseEntity<Export> updateExportStatus(@RequestHeader("Authorization") String jwt, @RequestBody ExportStateRequest stateRequest, @PathVariable String id) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(exportService.updateExportStatus(id, stateRequest.getExportState()), HttpStatus.OK);
    }

    @GetMapping("/getExportByDayRange")
    public ResponseEntity<List<Export>> getExportByDateRange(@RequestHeader("Authorization") String jwt, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(exportService.getExportByDateRange(startDate, endDate), HttpStatus.OK);
    }
}
