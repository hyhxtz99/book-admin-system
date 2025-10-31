package com.bookadmin.repository;

import com.bookadmin.entity.User;
import com.bookadmin.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByName(String name);
    
    List<User> findByNameContaining(String name);
    
    List<User> findByStatus(UserStatus status);
    
    @Query("SELECT u FROM User u WHERE " +
           "(:name IS NULL OR u.name LIKE %:name%) AND " +
           "(:status IS NULL OR u.status = :status)")
    Page<User> findByConditions(@Param("name") String name, 
                                @Param("status") UserStatus status, 
                                Pageable pageable);
}






