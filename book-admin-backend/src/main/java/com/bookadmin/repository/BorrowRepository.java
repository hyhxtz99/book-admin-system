package com.bookadmin.repository;

import com.bookadmin.entity.Book;
import com.bookadmin.entity.Borrow;
import com.bookadmin.entity.User;
import com.bookadmin.enums.BorrowStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    
    List<Borrow> findByUser(User user);
    
    List<Borrow> findByBook(Book book);
    
    List<Borrow> findByStatus(BorrowStatus status);
    
    @Query("SELECT b FROM Borrow b WHERE " +
           "(:bookName IS NULL OR b.book.name LIKE %:bookName%) AND " +
           "(:userName IS NULL OR b.user.name LIKE %:userName%) AND " +
           "(:author IS NULL OR b.book.author LIKE %:author%) AND " +
           "(:status IS NULL OR b.status = :status)")
    Page<Borrow> findByConditions(@Param("bookName") String bookName,
                                 @Param("userName") String userName,
                                 @Param("author") String author,
                                 @Param("status") BorrowStatus status,
                                 Pageable pageable);
}






