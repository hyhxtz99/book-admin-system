package com.bookadmin.service;

import com.bookadmin.dto.PageResult;
import com.bookadmin.dto.UserDTO;
import com.bookadmin.entity.User;
import com.bookadmin.enums.UserStatus;
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
public class UserService {
    
    private final UserRepository userRepository;
    
    public PageResult<UserDTO> getUsers(String name, UserStatus status, 
                                       Integer current, Integer pageSize, Boolean all) {
        if (Boolean.TRUE.equals(all)) {
            List<User> users = userRepository.findAll();
            List<UserDTO> userDTOs = users.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return new PageResult<>(userDTOs, (long) users.size(), current, pageSize, 1);
        }
        
        Pageable pageable = PageRequest.of(current - 1, pageSize);
        Page<User> userPage = userRepository.findByConditions(name, status, pageable);
        
        List<UserDTO> userDTOs = userPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(
                userDTOs,
                userPage.getTotalElements(),
                current,
                pageSize,
                userPage.getTotalPages()
        );
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }
    
    public UserDTO createUser(UserDTO userDTO) {
        User user = convertToEntity(userDTO);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        existingUser.setName(userDTO.getName());
        existingUser.setNickName(userDTO.getNickName());
        existingUser.setRole(userDTO.getRole());
        existingUser.setStatus(userDTO.getStatus());
        existingUser.setSex(userDTO.getSex());
        
        User savedUser = userRepository.save(existingUser);
        return convertToDTO(savedUser);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setNickName(user.getNickName());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setSex(user.getSex());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
    
    private User convertToEntity(UserDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setNickName(dto.getNickName());
        user.setRole(dto.getRole());
        user.setStatus(dto.getStatus());
        user.setSex(dto.getSex());
        return user;
    }
}








