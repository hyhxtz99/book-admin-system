package com.bookadmin.repository;

import com.bookadmin.entity.Book;
import com.bookadmin.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    Optional<Book> findByBookNo(String bookNo);
    
    List<Book> findByNameContaining(String name);
    
    List<Book> findByAuthorContaining(String author);
    
    List<Book> findByCategory(Category category);
    
    @Query("SELECT b FROM Book b WHERE " +
           "(:name IS NULL OR b.name LIKE %:name%) AND " +
           "(:author IS NULL OR b.author LIKE %:author%) AND " +
           "(:category IS NULL OR b.category.name LIKE %:category%)")
    Page<Book> findByConditions(@Param("name") String name,
                               @Param("author") String author,
                               @Param("category") String category,
                               Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE b.stock > 0")
    List<Book> findAvailableBooks();
}






