package com.bookadmin.controller;

import com.bookadmin.dto.BookDTO;
import com.bookadmin.dto.PageResult;
import com.bookadmin.dto.StockRecordDTO;
import com.bookadmin.service.BookService;
import com.bookadmin.service.StockRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookController {
    
    private final BookService bookService;
    private final StockRecordService stockRecordService;
    
    @GetMapping
    public ResponseEntity<PageResult<BookDTO>> getBooks(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Boolean all) {
        
        PageResult<BookDTO> result = bookService.getBooks(name, author, category, current, pageSize, all);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        BookDTO book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }
    
    @PostMapping
    public ResponseEntity<BookDTO> createBook(@RequestBody BookDTO bookDTO) {
        BookDTO createdBook = bookService.createBook(bookDTO);
        return ResponseEntity.ok(createdBook);
    }
    
    @PostMapping("/{id}/stock")
    public ResponseEntity<StockRecordDTO> addStock(@PathVariable Long id, @RequestBody StockRecordDTO stockRecordDTO) {
        // 设置图书ID
        stockRecordDTO.getBook().setId(id);
        StockRecordDTO createdStockRecord = stockRecordService.createStockRecord(stockRecordDTO);
        return ResponseEntity.ok(createdStockRecord);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id, @RequestBody BookDTO bookDTO) {
        BookDTO updatedBook = bookService.updateBook(id, bookDTO);
        return ResponseEntity.ok(updatedBook);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }
}






