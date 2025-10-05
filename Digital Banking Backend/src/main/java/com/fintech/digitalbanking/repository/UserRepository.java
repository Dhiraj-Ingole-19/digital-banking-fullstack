package com.fintech.digitalbanking.repository;

import com.fintech.digitalbanking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    // Partial text search for username (case-insensitive)
    List<User> findByUsernameContainingIgnoreCase(String username);
}
