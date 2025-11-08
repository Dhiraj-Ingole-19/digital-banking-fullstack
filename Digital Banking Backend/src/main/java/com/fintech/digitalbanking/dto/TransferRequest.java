// src/main/java/com/fintech/digitalbanking/dto/TransferRequest.java

package com.fintech.digitalbanking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {
    @NotNull
    private Long sourceAccountId;

    @NotNull
    @NotBlank(message = "Target account number is required")
    private String targetAccountNumber; // This is the new field name

    @NotNull
    @Positive
    private BigDecimal amount;
}