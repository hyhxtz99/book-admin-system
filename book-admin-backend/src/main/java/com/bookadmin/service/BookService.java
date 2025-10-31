package com.bookadmin.service;

import com.bookadmin.dto.BookDTO;
import com.bookadmin.dto.PageResult;
import com.bookadmin.entity.Book;
import com.bookadmin.entity.Category;
import com.bookadmin.repository.BookRepository;
import com.bookadmin.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookService {
    
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    
    public PageResult<BookDTO> getBooks(String name, String author, String category, 
                                       Integer current, Integer pageSize, Boolean all) {
        if (Boolean.TRUE.equals(all)) {
            List<Book> books = bookRepository.findAll();
            List<BookDTO> bookDTOs = books.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return new PageResult<>(bookDTOs, (long) books.size(), current, pageSize, 1);
        }
        
        Pageable pageable = PageRequest.of(current - 1, pageSize);
        Page<Book> bookPage = bookRepository.findByConditions(name, author, category, pageable);
        
        List<BookDTO> bookDTOs = bookPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(
                bookDTOs,
                bookPage.getTotalElements(),
                current,
                pageSize,
                bookPage.getTotalPages()
        );
    }
    
    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return convertToDTO(book);
    }
    
    public BookDTO createBook(BookDTO bookDTO) {
        Book book = convertToEntity(bookDTO);
        Book savedBook = bookRepository.save(book);
        return convertToDTO(savedBook);
    }
    
    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        existingBook.setName(bookDTO.getName());
        existingBook.setAuthor(bookDTO.getAuthor());
        existingBook.setDescription(bookDTO.getDescription());
        existingBook.setPublishAt(bookDTO.getPublishAt());
        existingBook.setBookNo(bookDTO.getBookNo());
        existingBook.setCover(bookDTO.getCover());
        existingBook.setStock(bookDTO.getStock());
        
        if (bookDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(bookDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existingBook.setCategory(category);
        }
        
        Book savedBook = bookRepository.save(existingBook);
        return convertToDTO(savedBook);
    }
    
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
    
    private BookDTO convertToDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setName(book.getName());
        dto.setAuthor(book.getAuthor());
        dto.setDescription(book.getDescription());
        dto.setCreatedAt(book.getCreatedAt());
        dto.setPublishAt(book.getPublishAt());
        dto.setBookNo(book.getBookNo());
        dto.setCover(book.getCover());
        dto.setStock(book.getStock());
        if (book.getCategory() != null) {
            dto.setCategory(book.getCategory().getName());
            dto.setCategoryId(book.getCategory().getId());
        }
        return dto;
    }
    
    private Book convertToEntity(BookDTO dto) {
        Book book = new Book();
        book.setName(dto.getName());
        book.setAuthor(dto.getAuthor());
        book.setDescription(dto.getDescription());
        book.setPublishAt(dto.getPublishAt());
        book.setBookNo(dto.getBookNo());
        book.setCover(dto.getCover());
        book.setStock(dto.getStock());
        
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            book.setCategory(category);
        }
        
        return book;
    }
}






