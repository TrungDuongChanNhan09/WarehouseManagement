package com.example.backend.controller;

import com.example.backend.model.Export;
import com.example.backend.request.ExportStateRequest;
import com.example.backend.service.ExportService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/export")
public class ExportController {
    @Autowired
    private UserService userService;
    @Autowired
    private ExportService exportService;

    @GetMapping("")
    public ResponseEntity<List<Export>> getAllExport(@RequestHeader("Authorization") String jwt){
        return new ResponseEntity<>(exportService.getAllExport(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Export> getExport(@RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception {
        return new ResponseEntity<>(exportService.getExportById(id), HttpStatus.OK);
    }

    @GetMapping("/getByOrderState")
    public ResponseEntity<List<Export>> getExportByState(@RequestHeader("Authorization") String jwt, ExportStateRequest exportStateRequest){
        return new ResponseEntity<>(exportService.getExportByState(exportStateRequest.getExportState()), HttpStatus.OK);
    }
}
