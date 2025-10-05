package com.fintech.digitalbanking.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionDto {
    private Long id;
    private String type; // DEPOSIT / WITHDRAW / TRANSFER
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private Long sourceAccountId;
    private Long targetAccountId;
}
