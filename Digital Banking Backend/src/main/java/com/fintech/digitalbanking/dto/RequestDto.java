package com.fintech.digitalbanking.dto;

import com.fintech.digitalbanking.entity.RollbackRequest;
import com.fintech.digitalbanking.entity.TransactionType; // <-- IMPORT
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal; // <-- IMPORT
import java.time.LocalDateTime;

@Data
@Builder
public class RequestDto {
    private Long id;
    private Long transactionId;
    private String username;
    private String reason;
    private RollbackRequest.RequestStatus status;
    private LocalDateTime createdAt;

    // --- NEW FIELDS TO SHOW MORE DETAILS ---
    private TransactionType transactionType;
    private BigDecimal transactionAmount;
    private String sourceAccount;
    private String targetAccount;
    private LocalDateTime transactionTimestamp;
}