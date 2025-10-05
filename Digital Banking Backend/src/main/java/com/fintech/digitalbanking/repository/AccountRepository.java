package com.fintech.digitalbanking.repository;

import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.accountNumber = :accountNumber")
    Optional<Account> findByAccountNumberForUpdate(@Param("accountNumber") String accountNumber);

    Optional<Account> findByAccountNumber(String accountNumber);

    Optional<Account> findFirstByUserOrderByCreatedAtAsc(User user);

    // ----- ADDED: find accounts by user (used by AccountService & TransactionService)
    List<Account> findByUser(User user);
}
