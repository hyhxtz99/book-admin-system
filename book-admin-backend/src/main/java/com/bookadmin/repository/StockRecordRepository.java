package com.bookadmin.repository;

import com.bookadmin.entity.StockRecord;
import com.bookadmin.entity.Book;
import com.bookadmin.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRecordRepository extends JpaRepository<StockRecord, Long> {
    
    List<StockRecord> findByBook(Book book);
    
    List<StockRecord> findByAdmin(User admin);
    
    @Query("SELECT sr FROM StockRecord sr WHERE " +
           "(:bookName IS NULL OR sr.book.name LIKE %:bookName%) AND " +
           "(:adminName IS NULL OR sr.admin.name LIKE %:adminName%)")
    Page<StockRecord> findByConditions(@Param("bookName") String bookName,
                                       @Param("adminName") String adminName,
                                       Pageable pageable);
}


