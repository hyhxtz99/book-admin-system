package com.bookadmin.service;

import com.bookadmin.dto.BookDTO;
import com.bookadmin.dto.BorrowDTO;
import com.bookadmin.dto.PageResult;
import com.bookadmin.dto.UserDTO;
import com.bookadmin.entity.Book;
import com.bookadmin.entity.Borrow;
import com.bookadmin.entity.User;
import com.bookadmin.enums.BorrowStatus;
import com.bookadmin.repository.BookRepository;
import com.bookadmin.repository.BorrowRepository;
import com.bookadmin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BorrowService {
    
    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    
    public PageResult<BorrowDTO> getBorrows(String bookName, String userName, String author, 
                                           BorrowStatus status, Integer current, Integer pageSize) {
        Pageable pageable = PageRequest.of(current - 1, pageSize);
        Page<Borrow> borrowPage = borrowRepository.findByConditions(bookName, userName, author, status, pageable);
        
        List<BorrowDTO> borrowDTOs = borrowPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(
                borrowDTOs,
                borrowPage.getTotalElements(),
                current,
                pageSize,
                borrowPage.getTotalPages()
        );
    }
    
    public BorrowDTO getBorrowById(Long id) {
        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow not found"));
        return convertToDTO(borrow);
    }
    
    public BorrowDTO createBorrow(BorrowDTO borrowDTO) {
        Book book = bookRepository.findById(borrowDTO.getBook().getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        User user = userRepository.findById(borrowDTO.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (book.getStock() <= 0) {
            throw new RuntimeException("Book is out of stock");
        }
        
        Borrow borrow = new Borrow();
        borrow.setBook(book);
        borrow.setUser(user);
        borrow.setStatus(BorrowStatus.ON);
        
        // 减少库存
        book.setStock(book.getStock() - 1);
        bookRepository.save(book);
        
        Borrow savedBorrow = borrowRepository.save(borrow);
        return convertToDTO(savedBorrow);
    }
    
    public BorrowDTO returnBook(Long id) {
        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow not found"));
        
        if (borrow.getStatus() == BorrowStatus.OFF) {
            throw new RuntimeException("Book has already been returned");
        }
        
        borrow.setStatus(BorrowStatus.OFF);
        borrow.setReturnDate(LocalDateTime.now());
        
        // 增加库存
        Book book = borrow.getBook();
        book.setStock(book.getStock() + 1);
        bookRepository.save(book);
        
        Borrow savedBorrow = borrowRepository.save(borrow);
        return convertToDTO(savedBorrow);
    }
    
    public void deleteBorrow(Long id) {
        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow not found"));
        
        // 如果借阅状态是ON，需要恢复库存
        if (borrow.getStatus() == BorrowStatus.ON) {
            Book book = borrow.getBook();
            book.setStock(book.getStock() + 1);
            bookRepository.save(book);
        }
        
        borrowRepository.deleteById(id);
    }
    
    private BorrowDTO convertToDTO(Borrow borrow) {
        BorrowDTO dto = new BorrowDTO();
        dto.setId(borrow.getId());
        dto.setStatus(borrow.getStatus());
        dto.setBorrowDate(borrow.getBorrowDate());
        dto.setReturnDate(borrow.getReturnDate());
        
        // 转换Book
        Book book = borrow.getBook();
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
        
        // 转换User
        User user = borrow.getUser();
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setNickName(user.getNickName());
        userDTO.setRole(user.getRole());
        userDTO.setStatus(user.getStatus());
        userDTO.setSex(user.getSex());
        userDTO.setCreatedAt(user.getCreatedAt());
        dto.setUser(userDTO);
        
        return dto;
    }
}






