package com.fintech.digitalbanking.controller;

import com.fintech.digitalbanking.dto.AccountDto;
import com.fintech.digitalbanking.dto.CreateAccountRequest;
import com.fintech.digitalbanking.dto.UserInfoDto;
import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/accounts")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class UserAccountController {

    private final AccountService accountService;

    // ... (All other methods like createAccount, getMyAccounts, etc. are unchanged) ...
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


    @GetMapping("/me")
    public ResponseEntity<UserInfoDto> getMyDetails(Authentication authentication) {
        String username = authentication.getName();
        User user = accountService.getUserByUsername(username);
        List<Account> accounts = accountService.getAccountsByUserId(user.getId());

        List<AccountDto> accountDtos = accounts.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        // --- THIS IS THE FIX ---
        // This logic correctly formats roles, preventing "ROLE_ROLE_ADMIN"
        List<String> roleNames = user.getRoles().stream()
                .map(role -> {
                    String roleName = role.getName().toUpperCase();
                    return roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;
                })
                .collect(Collectors.toList());
        // --- END OF FIX ---

        UserInfoDto dto = UserInfoDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .enabled(user.isEnabled())
                .accounts(accountDtos)
                .selectedAccountId(user.getSelectedAccountId())
                .roles(roleNames) // Add roles to the response
                .build();

        return ResponseEntity.ok(dto);
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