package com.fintech.digitalbanking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WithdrawRequest {
    @NotNull
    private Long accountId;

    @NotNull
    @Positive
    private BigDecimal amount;
}
