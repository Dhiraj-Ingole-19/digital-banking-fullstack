package com.fintech.digitalbanking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateRollbackRequestDto {

    @NotBlank(message = "A reason is required.")
    @Size(min = 10, max = 500, message = "Reason must be between 10 and 500 characters.")
    private String reason;
}