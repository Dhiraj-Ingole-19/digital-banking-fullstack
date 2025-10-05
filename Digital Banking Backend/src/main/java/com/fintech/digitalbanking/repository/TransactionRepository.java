package com.fintech.digitalbanking.repository;

import com.fintech.digitalbanking.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Find all transactions where the given account is either source or target
    List<Transaction> findBySourceAccount_IdOrTargetAccount_Id(Long sourceId, Long targetId);

    List<Transaction> findBySourceAccount_IdInOrTargetAccount_IdIn(List<Long> accountIds, List<Long> accountIds1);
}
