package com.fintech.digitalbanking.controller;

import com.fintech.digitalbanking.dto.RequestDto;
import com.fintech.digitalbanking.entity.RollbackRequest;
import com.fintech.digitalbanking.entity.Transaction; // <-- IMPORT
import com.fintech.digitalbanking.exception.RoleNotFoundException;
import com.fintech.digitalbanking.repository.RollbackRequestRepository;
import com.fintech.digitalbanking.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRequestController {

    private final RollbackRequestRepository requestRepository;
    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<RequestDto>> getPendingRequests() {
        List<RollbackRequest> requests = requestRepository.findByStatus(RollbackRequest.RequestStatus.PENDING);
        // --- UPDATED to use the new toDto helper ---
        return ResponseEntity.ok(
                requests.stream().map(this::toDto).collect(Collectors.toList())
        );
    }

    @PostMapping("/approve/{requestId}")
    public ResponseEntity<String> approveRequest(@PathVariable Long requestId) {
        RollbackRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RoleNotFoundException("Request not found"));

        // 1. Call your existing rollback service
        transactionService.rollbackTransaction(request.getTransaction().getId());

        // 2. Update the request status
        request.setStatus(RollbackRequest.RequestStatus.APPROVED);
        requestRepository.save(request);

        return ResponseEntity.ok("Request approved and transaction rolled back.");
    }

    @PostMapping("/reject/{requestId}")
    public ResponseEntity<String> rejectRequest(@PathVariable Long requestId) {
        RollbackRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RoleNotFoundException("Request not found"));

        request.setStatus(RollbackRequest.RequestStatus.REJECTED);
        requestRepository.save(request);

        return ResponseEntity.ok("Request rejected.");
    }

    // --- NEW HELPER METHOD TO BUILD THE RICH DTO ---
    private RequestDto toDto(RollbackRequest req) {
        Transaction tx = req.getTransaction(); // Get the associated transaction
        return RequestDto.builder()
                .id(req.getId())
                .transactionId(tx.getId())
                .username(req.getRequestingUser().getUsername())
                .reason(req.getReason())
                .status(req.getStatus())
                .createdAt(req.getCreatedAt())
                .transactionType(tx.getType())
                .transactionAmount(tx.getAmount())
                .transactionTimestamp(tx.getTimestamp())
                .sourceAccount(tx.getSourceAccount() != null ? tx.getSourceAccount().getAccountNumber() : "N/A")
                .targetAccount(tx.getTargetAccount() != null ? tx.getTargetAccount().getAccountNumber() : "N/A")
                .build();
    }
}