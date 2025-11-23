package com.fintech.digitalbanking.controller;

import com.fintech.digitalbanking.dto.CreateRollbackRequestDto;
import com.fintech.digitalbanking.dto.RequestDto;
import com.fintech.digitalbanking.entity.RollbackRequest;
import com.fintech.digitalbanking.entity.Transaction;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.exception.RoleNotFoundException;
import com.fintech.digitalbanking.repository.RollbackRequestRepository;
import com.fintech.digitalbanking.repository.TransactionRepository;
import com.fintech.digitalbanking.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserRequestController {

    private final TransactionRepository transactionRepository;
    private final RollbackRequestRepository requestRepository;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<List<RequestDto>> getMyRequests() {
        User user = securityUtil.getCurrentUserEntity();
        List<RollbackRequest> requests = requestRepository.findByRequestingUserOrderByCreatedAtDesc(user);
        // Convert to DTO to avoid recursion/serialization errors
        return ResponseEntity.ok(requests.stream().map(this::toDto).collect(Collectors.toList()));
    }

    @PostMapping("/rollback/{transactionId}")
    public ResponseEntity<String> requestRollback(
            @PathVariable Long transactionId,
            @Valid @RequestBody CreateRollbackRequestDto requestDto) {

        User user = securityUtil.getCurrentUserEntity();
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RoleNotFoundException("Transaction not found"));

        // Basic validation
        if (!transaction.getSourceAccount().getUser().getId().equals(user.getId()) &&
                !transaction.getTargetAccount().getUser().getId().equals(user.getId())) {
            throw new RoleNotFoundException("You can only report your own transactions.");
        }

        RollbackRequest newRequest = RollbackRequest.builder()
                .requestingUser(user)
                .transaction(transaction)
                .reason(requestDto.getReason())
                .status(RollbackRequest.RequestStatus.PENDING)
                .build();

        requestRepository.save(newRequest);

        return ResponseEntity.ok("Rollback request submitted successfully.");
    }

    // Helper method
    private RequestDto toDto(RollbackRequest req) {
        return RequestDto.builder()
                .id(req.getId())
                .transactionId(req.getTransaction().getId())
                .username(req.getRequestingUser().getUsername())
                .reason(req.getReason())
                .status(req.getStatus())
                .createdAt(req.getCreatedAt())
                .transactionType(req.getTransaction().getType())
                .transactionAmount(req.getTransaction().getAmount())
                .build();
    }
}