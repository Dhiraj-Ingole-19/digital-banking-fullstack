package com.fintech.digitalbanking.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AccountDto {
    private Long id;
    private String type;
    private BigDecimal balance;
    private boolean active;
    private String accountNumber;
    private Long userId;
}
