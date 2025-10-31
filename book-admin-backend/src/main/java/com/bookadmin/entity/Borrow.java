package com.bookadmin.entity;

import com.bookadmin.enums.BorrowStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "borrows")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Borrow {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowStatus status;
    
    @Column(name = "borrow_date")
    private LocalDateTime borrowDate;
    
    @Column(name = "return_date")
    private LocalDateTime returnDate;
    
    @PrePersist
    protected void onCreate() {
        borrowDate = LocalDateTime.now();
    }
}

