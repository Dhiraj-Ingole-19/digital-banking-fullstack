package com.fintech.digitalbanking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountActionRequest {
    @NotNull(message = "Account ID is required")
    private Long accountId;
}
