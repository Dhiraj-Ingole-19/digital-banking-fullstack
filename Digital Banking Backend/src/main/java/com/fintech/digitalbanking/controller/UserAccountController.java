package com.fintech.digitalbanking.controller;

import com.fintech.digitalbanking.dto.AccountDto;
import com.fintech.digitalbanking.dto.CreateAccountRequest;
import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // CHANGED: The path now matches the Postman collection and standard REST conventions.
    @GetMapping("/balance/{accountId}")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable Long accountId) {
        return ResponseEntity.ok(accountService.getBalance(accountId));
    }

    // CHANGED: This now uses a PathVariable for a more RESTful design.
    @PostMapping("/deactivate/{accountId}")
    public ResponseEntity<String> deactivateAccount(@PathVariable Long accountId) {
        accountService.deactivateAccount(accountId);
        return ResponseEntity.ok("Account deactivated successfully");
    }

    // CHANGED: This now uses a PathVariable for a more RESTful design.
    @PostMapping("/activate/{accountId}")
    public ResponseEntity<String> activateAccount(@PathVariable Long accountId) {
        accountService.activateAccount(accountId);
        return ResponseEntity.ok("Account activated successfully");
    }

    // CHANGED: Method is now POST and uses a PathVariable to identify the account.
    @PostMapping("/select/{accountId}")
    public ResponseEntity<String> selectAccount(@PathVariable Long accountId) {
        accountService.selectAccount(accountId);
        return ResponseEntity.ok("Account selected successfully");
    }

    @GetMapping("/selected/balance")
    public ResponseEntity<BigDecimal> getSelectedBalance() {
        return ResponseEntity.ok(accountService.getSelectedAccountBalance());
    }

    private AccountDto toDto(Account a) {
        return AccountDto.builder()
                .id(a.getId())
                .accountNumber(a.getAccountNumber()) // Added for more complete DTO
                .type(a.getAccountType().name())
                .balance(a.getBalance())
                .active(a.isActive())
                .build();
    }
}