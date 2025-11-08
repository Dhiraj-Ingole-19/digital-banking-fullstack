package com.fintech.digitalbanking.repository;

import com.fintech.digitalbanking.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * --- THIS IS THE FIX ---
     * This is a manual query that finds all transactions where the user's
     * account IDs are in either the source OR target column.
     * This correctly finds Deposits, Withdrawals, and Transfers.
     */
    @Query("SELECT t FROM Transaction t WHERE t.sourceAccount.id IN :accountIds OR t.targetAccount.id IN :accountIds")
    List<Transaction> findAllByAccountIds(@Param("accountIds") List<Long> accountIds);

}