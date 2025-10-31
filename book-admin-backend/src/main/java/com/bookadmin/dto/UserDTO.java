package com.bookadmin.dto;

import com.bookadmin.enums.UserRole;
import com.bookadmin.enums.UserSex;
import com.bookadmin.enums.UserStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String nickName;
    private UserRole role;
    private UserStatus status;
    private UserSex sex;
    private LocalDateTime createdAt;
}






