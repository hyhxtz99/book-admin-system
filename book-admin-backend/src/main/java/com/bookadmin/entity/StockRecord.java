package com.bookadmin.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;
    
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity; // 入库数量
    
    @Column(name = "signature_image", columnDefinition = "TEXT")
    private String signatureImage; // 手写签名图片Base64或URL
    
    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks; // 备注
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}


