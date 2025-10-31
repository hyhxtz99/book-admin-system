package com.bookadmin.controller;

import com.bookadmin.dto.BorrowDTO;
import com.bookadmin.dto.PageResult;
import com.bookadmin.enums.BorrowStatus;
import com.bookadmin.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/borrows")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BorrowController {
    
    private final BorrowService borrowService;
    
    @GetMapping
    public ResponseEntity<PageResult<BorrowDTO>> getBorrows(
            @RequestParam(required = false) String book,
            @RequestParam(required = false) String user,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) BorrowStatus status,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        
        PageResult<BorrowDTO> result = borrowService.getBorrows(book, user, author, status, current, pageSize);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BorrowDTO> getBorrowById(@PathVariable Long id) {
        BorrowDTO borrow = borrowService.getBorrowById(id);
        return ResponseEntity.ok(borrow);
    }
    
    @PostMapping
    public ResponseEntity<BorrowDTO> createBorrow(@RequestBody BorrowDTO borrowDTO) {
        BorrowDTO createdBorrow = borrowService.createBorrow(borrowDTO);
        return ResponseEntity.ok(createdBorrow);
    }
    
    @PostMapping("/{id}")
    public ResponseEntity<BorrowDTO> updateBorrow(@PathVariable Long id, @RequestBody BorrowDTO borrowDTO) {
        // 这里可以根据需要实现更新逻辑
        return ResponseEntity.ok(borrowDTO);
    }
    
    @PutMapping("/back/{id}")
    public ResponseEntity<BorrowDTO> returnBook(@PathVariable Long id) {
        BorrowDTO returnedBorrow = borrowService.returnBook(id);
        return ResponseEntity.ok(returnedBorrow);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrow(@PathVariable Long id) {
        borrowService.deleteBorrow(id);
        return ResponseEntity.ok().build();
    }
}






