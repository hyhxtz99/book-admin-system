package com.bookadmin.controller;

import com.bookadmin.dto.PageResult;
import com.bookadmin.dto.StockRecordDTO;
import com.bookadmin.service.StockRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StockRecordController {
    
    private final StockRecordService stockRecordService;
    
    @GetMapping
    public ResponseEntity<PageResult<StockRecordDTO>> getStockRecords(
            @RequestParam(required = false) String bookName,
            @RequestParam(required = false) String adminName,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        
        PageResult<StockRecordDTO> result = stockRecordService.getStockRecords(bookName, adminName, current, pageSize);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StockRecordDTO> getStockRecordById(@PathVariable Long id) {
        StockRecordDTO stockRecord = stockRecordService.getStockRecordById(id);
        return ResponseEntity.ok(stockRecord);
    }
    
    @PostMapping
    public ResponseEntity<StockRecordDTO> createStockRecord(@RequestBody StockRecordDTO stockRecordDTO) {
        StockRecordDTO createdStockRecord = stockRecordService.createStockRecord(stockRecordDTO);
        return ResponseEntity.ok(createdStockRecord);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStockRecord(@PathVariable Long id) {
        stockRecordService.deleteStockRecord(id);
        return ResponseEntity.ok().build();
    }
}



