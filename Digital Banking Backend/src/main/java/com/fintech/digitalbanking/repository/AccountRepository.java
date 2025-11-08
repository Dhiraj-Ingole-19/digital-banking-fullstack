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

    // --- THIS METHOD IS NEW ---
    // We need this to lock the source account during a transfer
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdForUpdate(@Param("id") Long id);

    Optional<Account> findByAccountNumber(String accountNumber);

    Optional<Account> findFirstByUserOrderByCreatedAtAsc(User user);

    List<Account> findByUser(User user);
}