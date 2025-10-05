package com.fintech.digitalbanking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLookupRequest {
    @NotBlank(message = "Username is required")
    private String username;
}
