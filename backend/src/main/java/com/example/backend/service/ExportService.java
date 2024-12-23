package com.example.backend.service;

import com.example.backend.model.EXPORT_STATE;
import com.example.backend.model.Export;
import com.example.backend.request.ExportRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ExportService {
    Export createExport(ExportRequest export);
    Export updateExport(String exportId, ExportRequest export) throws Exception;
    void deleteExport(String exportId);
    Export getExportById(String exportId) throws Exception;
    List<Export> getAllExport();
    List<Export> getExportByState(EXPORT_STATE exportState);
    Export updateExportStatus(String id, EXPORT_STATE exportState) throws Exception;
}
