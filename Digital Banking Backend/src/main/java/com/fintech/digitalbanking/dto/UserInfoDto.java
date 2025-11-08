package com.fintech.digitalbanking.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserInfoDto {
    private Long id;
    private String username;
    private boolean enabled;
    private List<AccountDto> accounts;
    private Long selectedAccountId;

    // --- THIS IS THE FIX ---
    // This line was missing from the file you pasted
    private List<String> roles;
}