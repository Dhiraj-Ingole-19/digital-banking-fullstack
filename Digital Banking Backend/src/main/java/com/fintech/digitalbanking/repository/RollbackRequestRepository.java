package com.fintech.digitalbanking.repository;

import com.fintech.digitalbanking.entity.RollbackRequest;
import com.fintech.digitalbanking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RollbackRequestRepository extends JpaRepository<RollbackRequest, Long> {

    List<RollbackRequest> findByStatus(RollbackRequest.RequestStatus status);

    List<RollbackRequest> findByRequestingUserOrderByCreatedAtDesc(User user);
}