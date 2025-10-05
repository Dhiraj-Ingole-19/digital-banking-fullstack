package com.fintech.digitalbanking.controller;

import com.fintech.digitalbanking.dto.DepositRequest;
import com.fintech.digitalbanking.dto.TransferRequest;
import com.fintech.digitalbanking.dto.TransactionDto;
import com.fintech.digitalbanking.dto.WithdrawRequest;
import com.fintech.digitalbanking.entity.Transaction;
import com.fintech.digitalbanking.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/transactions")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class UserTransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<TransactionDto> deposit(@Valid @RequestBody DepositRequest request) {
        Transaction tx = transactionService.deposit(request.getAccountId(), request.getAmount());
        return ResponseEntity.ok(toDto(tx));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionDto> withdraw(@Valid @RequestBody WithdrawRequest request) {
        Transaction tx = transactionService.withdraw(request.getAccountId(), request.getAmount());
        return ResponseEntity.ok(toDto(tx));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionDto> transfer(@Valid @RequestBody TransferRequest request) {
        Transaction tx = transactionService.transfer(
                request.getSourceAccountId(),
                request.getTargetAccountId(),
                request.getAmount()
        );
        return ResponseEntity.ok(toDto(tx));
    }

    @GetMapping("/my-history")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<TransactionDto>> getMyTransactions() {
        var txs = transactionService.getMyTransactions().stream()
                .map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(txs);
    }

    private TransactionDto toDto(Transaction tx) {
        return TransactionDto.builder()
                .id(tx.getId())
                .amount(tx.getAmount())
                .type(tx.getType() != null ? tx.getType().name() : null)
                .timestamp(tx.getTimestamp())
                .sourceAccountId(tx.getSourceAccount() != null ? tx.getSourceAccount().getId() : null)
                .targetAccountId(tx.getTargetAccount() != null ? tx.getTargetAccount().getId() : null)
                .build();
    }
}
