package com.fintech.digitalbanking.controller;

import com.fintech.digitalbanking.dto.AccountDto;
import com.fintech.digitalbanking.dto.CreateAccountRequest;
import com.fintech.digitalbanking.dto.UpdateProfileRequest;
import com.fintech.digitalbanking.dto.UserInfoDto;
import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.exception.RoleNotFoundException;
import com.fintech.digitalbanking.repository.UserRepository;
import com.fintech.digitalbanking.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/accounts")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class UserAccountController {

    private final AccountService accountService;
    private final UserRepository userRepository;

    @GetMapping("/lookup/{username}")
    public ResponseEntity<Map<String, String>> lookupAccount(@PathVariable String username) {
        User user = accountService.getUserByUsername(username);

        Account targetAccount = null;

        // 1. Try selected account
        if (user.getSelectedAccountId() != null) {
            List<Account> accounts = accountService.getAccountsByUserId(user.getId());
            targetAccount = accounts.stream()
                    .filter(a -> a.getId().equals(user.getSelectedAccountId()))
                    .findFirst()
                    .orElse(null);
        }

        // 2. If not found, try first active account
        if (targetAccount == null) {
            List<Account> accounts = accountService.getAccountsByUserId(user.getId());
            targetAccount = accounts.stream()
                    .filter(Account::isActive)
                    .findFirst()
                    .orElseThrow(() -> new RoleNotFoundException("No active account found for user: " + username));
        }

        return ResponseEntity.ok(Map.of("accountNumber", targetAccount.getAccountNumber()));
    }

    @PostMapping
    public ResponseEntity<AccountDto> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        Account created = accountService.createAccount(request.getType());
        return ResponseEntity.ok(toDto(created));
    }

    @GetMapping
    public ResponseEntity<List<AccountDto>> getMyAccounts() {
        var accounts = accountService.getMyAccounts()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/balance/{accountId}")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable Long accountId) {
        return ResponseEntity.ok(accountService.getBalance(accountId));
    }

    @PostMapping("/deactivate/{accountId}")
    public ResponseEntity<String> deactivateAccount(@PathVariable Long accountId) {
        accountService.deactivateAccount(accountId);
        return ResponseEntity.ok("Account deactivated successfully");
    }

    @PostMapping("/activate/{accountId}")
    public ResponseEntity<String> activateAccount(@PathVariable Long accountId) {
        accountService.activateAccount(accountId);
        return ResponseEntity.ok("Account activated successfully");
    }

    @PostMapping("/select/{accountId}")
    public ResponseEntity<String> selectAccount(@PathVariable Long accountId) {
        accountService.selectAccount(accountId);
        return ResponseEntity.ok("Account selected successfully");
    }

    @GetMapping("/selected/balance")
    public ResponseEntity<BigDecimal> getSelectedBalance() {
        return ResponseEntity.ok(accountService.getSelectedAccountBalance());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserInfoDto> updateProfile(@RequestBody UpdateProfileRequest request) {
        User user = accountService.getCurrentUser();

        if (request.getFullName() != null)
            user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null)
            user.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddress() != null)
            user.setAddress(request.getAddress());

        userRepository.save(user);

        return ResponseEntity.ok(mapToUserInfoDto(user));
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoDto> getMyDetails(Authentication authentication) {
        String username = authentication.getName();
        User user = accountService.getUserByUsername(username);
        return ResponseEntity.ok(mapToUserInfoDto(user));
    }

    private UserInfoDto mapToUserInfoDto(User user) {
        List<Account> accounts = accountService.getAccountsByUserId(user.getId());
        List<AccountDto> accountDtos = accounts.stream().map(this::toDto).collect(Collectors.toList());

        List<String> roleNames = user.getRoles().stream()
                .map(role -> {
                    String roleName = role.getName().toUpperCase();
                    return roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;
                })
                .collect(Collectors.toList());

        return UserInfoDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .enabled(user.isEnabled())
                .accounts(accountDtos)
                .selectedAccountId(user.getSelectedAccountId())
                .roles(roleNames)
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .build();
    }

    private AccountDto toDto(Account a) {
        return AccountDto.builder()
                .id(a.getId())
                .accountNumber(a.getAccountNumber())
                .type(a.getAccountType().name())
                .balance(a.getBalance())
                .active(a.isActive())
                .build();
    }
}