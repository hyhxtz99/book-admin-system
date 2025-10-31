package com.bookadmin.service;

import com.bookadmin.dto.BookDTO;
import com.bookadmin.dto.PageResult;
import com.bookadmin.dto.StockRecordDTO;
import com.bookadmin.dto.UserDTO;
import com.bookadmin.entity.Book;
import com.bookadmin.entity.StockRecord;
import com.bookadmin.entity.User;
import com.bookadmin.repository.BookRepository;
import com.bookadmin.repository.StockRecordRepository;
import com.bookadmin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StockRecordService {
    
    private final StockRecordRepository stockRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    
    public PageResult<StockRecordDTO> getStockRecords(String bookName, String adminName, 
                                                     Integer current, Integer pageSize) {
        Pageable pageable = PageRequest.of(current - 1, pageSize);
        Page<StockRecord> stockRecordPage = stockRecordRepository.findByConditions(bookName, adminName, pageable);
        
        List<StockRecordDTO> stockRecordDTOs = stockRecordPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(
                stockRecordDTOs,
                stockRecordPage.getTotalElements(),
                current,
                pageSize,
                stockRecordPage.getTotalPages()
        );
    }
    
    public StockRecordDTO getStockRecordById(Long id) {
        StockRecord stockRecord = stockRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock record not found"));
        return convertToDTO(stockRecord);
    }
    
    public StockRecordDTO createStockRecord(StockRecordDTO stockRecordDTO) {
        Book book = bookRepository.findById(stockRecordDTO.getBook().getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        User admin = userRepository.findById(stockRecordDTO.getAdmin().getId())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        // 检查管理员权限
        if (!"admin".equals(admin.getRole().toString())) {
            throw new RuntimeException("Only admin can create stock records");
        }
        
        StockRecord stockRecord = new StockRecord();
        stockRecord.setBook(book);
        stockRecord.setAdmin(admin);
        stockRecord.setStockQuantity(stockRecordDTO.getStockQuantity());
        stockRecord.setSignatureImage(stockRecordDTO.getSignatureImage());
        stockRecord.setRemarks(stockRecordDTO.getRemarks());
        
        // 更新图书库存
        book.setStock(book.getStock() + stockRecordDTO.getStockQuantity());
        bookRepository.save(book);
        
        StockRecord savedStockRecord = stockRecordRepository.save(stockRecord);
        return convertToDTO(savedStockRecord);
    }
    
    public void deleteStockRecord(Long id) {
        StockRecord stockRecord = stockRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock record not found"));
        
        // 恢复图书库存
        Book book = stockRecord.getBook();
        book.setStock(book.getStock() - stockRecord.getStockQuantity());
        bookRepository.save(book);
        
        stockRecordRepository.deleteById(id);
    }
    
    private StockRecordDTO convertToDTO(StockRecord stockRecord) {
        StockRecordDTO dto = new StockRecordDTO();
        dto.setId(stockRecord.getId());
        dto.setStockQuantity(stockRecord.getStockQuantity());
        dto.setSignatureImage(stockRecord.getSignatureImage());
        dto.setRemarks(stockRecord.getRemarks());
        dto.setCreatedAt(stockRecord.getCreatedAt());
        
        // 转换Book
        Book book = stockRecord.getBook();
        BookDTO bookDTO = new BookDTO();
        bookDTO.setId(book.getId());
        bookDTO.setName(book.getName());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setDescription(book.getDescription());
        bookDTO.setCreatedAt(book.getCreatedAt());
        bookDTO.setPublishAt(book.getPublishAt());
        bookDTO.setBookNo(book.getBookNo());
        bookDTO.setCover(book.getCover());
        bookDTO.setStock(book.getStock());
        if (book.getCategory() != null) {
            bookDTO.setCategory(book.getCategory().getName());
            bookDTO.setCategoryId(book.getCategory().getId());
        }
        dto.setBook(bookDTO);
        
        // 转换Admin
        User admin = stockRecord.getAdmin();
        UserDTO adminDTO = new UserDTO();
        adminDTO.setId(admin.getId());
        adminDTO.setName(admin.getName());
        adminDTO.setNickName(admin.getNickName());
        adminDTO.setRole(admin.getRole());
        adminDTO.setStatus(admin.getStatus());
        adminDTO.setSex(admin.getSex());
        adminDTO.setCreatedAt(admin.getCreatedAt());
        dto.setAdmin(adminDTO);
        
        return dto;
    }
}



