package com.fintech.digitalbanking.dto;

import java.util.List;

public record UserDto(
        Long id,
        String username,
        boolean enabled,
        List<String> roles // Optional: List of role names
) {}
