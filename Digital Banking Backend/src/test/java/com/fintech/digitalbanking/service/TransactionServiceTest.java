package com.fintech.digitalbanking.service;

import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.entity.Transaction;
import com.fintech.digitalbanking.entity.TransactionType;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.exception.CustomAccessDeniedException;
import com.fintech.digitalbanking.exception.InsufficientFundsException;
import com.fintech.digitalbanking.exception.RoleNotFoundException;
import com.fintech.digitalbanking.repository.AccountRepository;
import com.fintech.digitalbanking.repository.TransactionRepository;
import com.fintech.digitalbanking.repository.UserRepository;
import com.fintech.digitalbanking.util.SecurityUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityUtil securityUtil;

    @InjectMocks
    private TransactionService transactionService;

    private User testUser;
    private Account sourceAccount;
    private Account targetAccount;

    @BeforeEach
    void setUp() {
        // Setup common test data that runs before each test
        testUser = User.builder().id(1L).username("testuser").build();
        sourceAccount = Account.builder()
                .id(1L)
                .user(testUser)
                .balance(new BigDecimal("1000.00"))
                .active(true)
                .build();
        targetAccount = Account.builder()
                .id(2L)
                .user(new User()) // Different user
                .balance(new BigDecimal("500.00"))
                .active(true)
                .build();
    }

    // --- DEPOSIT TESTS ---
    @Test
    void deposit_shouldSucceed_whenAccountExists() {
        // Arrange
        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(securityUtil.isAdmin()).thenReturn(true); // Simulate admin to bypass ownership check
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        transactionService.deposit(1L, new BigDecimal("200.00"));

        // Assert
        assertEquals(new BigDecimal("1200.00"), sourceAccount.getBalance());
        verify(accountRepository, times(1)).save(sourceAccount);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    void deposit_shouldThrowException_whenAccountNotFound() {
        // Arrange
        when(accountRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RoleNotFoundException.class, () -> {
            transactionService.deposit(99L, new BigDecimal("100.00"));
        });
    }

    // --- WITHDRAW TESTS ---
    @Test
    void withdraw_shouldSucceed_whenFundsAreSufficient() {
        // Arrange
        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        transactionService.withdraw(1L, new BigDecimal("300.00"));

        // Assert
        assertEquals(new BigDecimal("700.00"), sourceAccount.getBalance());
        verify(accountRepository, times(1)).save(sourceAccount);
    }

    @Test
    void withdraw_shouldThrowException_whenFundsAreInsufficient() {
        // Arrange
        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);

        // Act & Assert
        assertThrows(InsufficientFundsException.class, () -> {
            transactionService.withdraw(1L, new BigDecimal("2000.00"));
        });
        verify(accountRepository, never()).save(any());
    }

    @Test
    void withdraw_shouldThrowException_whenAccountIsInactive() {
        // Arrange
        sourceAccount.setActive(false);
        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));

        // Act & Assert
        assertThrows(CustomAccessDeniedException.class, () -> {
            transactionService.withdraw(1L, new BigDecimal("100.00"));
        });
    }

    // --- TRANSFER TESTS ---
    @Test
    void transfer_shouldSucceed_forValidTransfer() {
        // Arrange
        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(targetAccount));
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);

        // Act
        transactionService.transfer(1L, 2L, new BigDecimal("500.00"));

        // Assert
        assertEquals(new BigDecimal("500.00"), sourceAccount.getBalance());
        assertEquals(new BigDecimal("1000.00"), targetAccount.getBalance());
        verify(accountRepository, times(1)).save(sourceAccount);
        verify(accountRepository, times(1)).save(targetAccount);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    void transfer_shouldThrowException_whenSourceAccountNotFound() {
        // Arrange
        when(accountRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RoleNotFoundException.class, () -> {
            transactionService.transfer(99L, 2L, new BigDecimal("100.00"));
        });
    }

    // --- ROLLBACK TESTS ---
    @Test
    void rollbackTransaction_shouldReverseDeposit() {
        // Arrange
        Transaction depositTx = Transaction.builder()
                .id(10L)
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("200.00"))
                .sourceAccount(sourceAccount)
                .reversed(false)
                .build();

        when(transactionRepository.findById(10L)).thenReturn(Optional.of(depositTx));
        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        transactionService.rollbackTransaction(10L);

        // Assert
        assertEquals(new BigDecimal("800.00"), sourceAccount.getBalance()); // 1000 - 200
        assertTrue(depositTx.isReversed());
        verify(transactionRepository, times(3)).save(any(Transaction.class)); // Original tx, reversal tx, and original again with link
    }

    @Test
    void rollbackTransaction_shouldThrowException_ifAlreadyReversed() {
        // Arrange
        Transaction tx = Transaction.builder().id(10L).reversed(true).build();
        when(transactionRepository.findById(10L)).thenReturn(Optional.of(tx));

        // Act & Assert
        assertThrows(CustomAccessDeniedException.class, () -> {
            transactionService.rollbackTransaction(10L);
        });
    }
}