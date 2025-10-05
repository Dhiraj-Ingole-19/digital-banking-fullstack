package com.fintech.digitalbanking.dto;

import com.fintech.digitalbanking.entity.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAccountRequest {
    @NotNull(message = "Account type is required")
    private AccountType type;
}
