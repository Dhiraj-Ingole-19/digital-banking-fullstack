package com.fintech.digitalbanking.controller;

import com.fintech.digitalbanking.dto.AccountDto;
import com.fintech.digitalbanking.dto.UserInfoDto;
import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.repository.UserRepository;
import com.fintech.digitalbanking.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAccountController {

    private final AccountService accountService;
    private final UserRepository userRepository;

    @GetMapping("/users/count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok(userRepository.count());
    }

    @GetMapping("/accounts/{userId}")
    public ResponseEntity<List<AccountDto>> getAccountsByUserId(@PathVariable Long userId) {
        List<Account> accounts = accountService.getAccountsByUserId(userId);
        List<AccountDto> dtos = accounts.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/users/by-username/{username}")
    public ResponseEntity<UserInfoDto> getUserDetailsByUsername(@PathVariable String username) {
        User user = accountService.getUserByUsername(username);
        List<Account> accounts = accountService.getAccountsByUserId(user.getId());
        List<AccountDto> accountDtos = accounts.stream().map(this::toDto).collect(Collectors.toList());

        UserInfoDto dto = UserInfoDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .enabled(user.isEnabled())
                .accounts(accountDtos)
                .build();

        return ResponseEntity.ok(dto);
    }

    private AccountDto toDto(Account a) {
        return AccountDto.builder()
                .id(a.getId())
                .type(a.getAccountType().name())
                .balance(a.getBalance())
                .active(a.isActive())
                .accountNumber(a.getAccountNumber())
                .userId(a.getUser() != null ? a.getUser().getId() : null)
                .build();
    }
}