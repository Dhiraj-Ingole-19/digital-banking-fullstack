package com.fintech.digitalbanking.controller;

import com.fintech.digitalbanking.dto.DepositRequest;
import com.fintech.digitalbanking.dto.TransactionDto;
import com.fintech.digitalbanking.dto.TransferRequest;
import com.fintech.digitalbanking.dto.WithdrawRequest;
import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.entity.Transaction;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.repository.AccountRepository;
import com.fintech.digitalbanking.repository.UserRepository;
import com.fintech.digitalbanking.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/transactions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTransactionController {

    private final TransactionService transactionService;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @GetMapping("/all")
    public ResponseEntity<List<TransactionDto>> getAll() {
        var txs = transactionService.getTransactionHistory(null);
        var dtos = txs.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionDto>> getByUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Account a = accountRepository.findFirstByUserOrderByCreatedAtAsc(user)
                .orElseThrow(() -> new IllegalArgumentException("User has no accounts"));
        var txs = transactionService.getTransactionHistory(a.getId());
        return ResponseEntity.ok(txs.stream().map(this::toDto).collect(Collectors.toList()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionDto> adminDeposit(@Valid @RequestBody DepositRequest request) {
        var tx = transactionService.deposit(request.getAccountId(), request.getAmount());
        return ResponseEntity.ok(toDto(tx));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionDto> adminWithdraw(@Valid @RequestBody WithdrawRequest request) {
        var tx = transactionService.withdraw(request.getAccountId(), request.getAmount());
        return ResponseEntity.ok(toDto(tx));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionDto> adminTransfer(@Valid @RequestBody TransferRequest request) {

        // --- THIS IS THE FIX ---
        // Changed to use the new method from the TransferRequest DTO
        var tx = transactionService.transfer(
                request.getSourceAccountId(),
                request.getTargetAccountNumber(), // <-- This line is now correct
                request.getAmount()
        );
        return ResponseEntity.ok(toDto(tx));
    }

    @PostMapping("/rollback/{transactionId}")
    public ResponseEntity<TransactionDto> rollbackTransaction(@PathVariable Long transactionId) {
        Transaction tx = transactionService.rollbackTransaction(transactionId);
        return ResponseEntity.ok(toDto(tx));
    }

    // In: AdminTransactionController.java

    private TransactionDto toDto(Transaction t) {
        return TransactionDto.builder()
                .id(t.getId())
                .type(t.getType() != null ? t.getType().name() : null)
                .amount(t.getAmount())
                .timestamp(t.getTimestamp())
                .sourceAccountId(t.getSourceAccount() != null ? t.getSourceAccount().getId() : null)
                .targetAccountId(t.getTargetAccount() != null ? t.getTargetAccount().getId() : null)
                .reversed(t.isReversed()) // <-- ADD THIS LINE
                .build();
    }
}