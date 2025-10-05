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
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    private void requireActive(Account account) {
        if (account == null) throw new RoleNotFoundException("Account not found");
        if (!account.isActive()) throw new CustomAccessDeniedException("Account is inactive");
    }

    private void validateOwnershipOrAdmin(Account account) {
        if (securityUtil.isAdmin()) return;
        User user = securityUtil.getCurrentUserEntity();
        if (!account.getUser().getId().equals(user.getId())) {
            throw new CustomAccessDeniedException("Access denied - account does not belong to user");
        }
    }

    @Transactional(readOnly = true)
    public List<Transaction> getMyTransactions() {
        User currentUser = securityUtil.getCurrentUserEntity();
        List<Account> myAccounts = accountRepository.findByUser(currentUser);

        if (myAccounts.isEmpty()) {
            return List.of();
        }

        List<Long> accountIds = myAccounts.stream()
                .map(Account::getId)
                .toList();

        return transactionRepository.findBySourceAccount_IdInOrTargetAccount_IdIn(accountIds, accountIds);
    }

    @Transactional
    public Transaction deposit(Long accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RoleNotFoundException("Account not found: " + accountId));
        requireActive(account);
        validateOwnershipOrAdmin(account);

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        Transaction tx = Transaction.builder()
                .sourceAccount(account)
                .type(TransactionType.DEPOSIT)
                .amount(amount)
                .build();
        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction withdraw(Long accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RoleNotFoundException("Account not found: " + accountId));
        requireActive(account);
        validateOwnershipOrAdmin(account);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient balance");
        }
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        Transaction tx = Transaction.builder()
                .sourceAccount(account)
                .type(TransactionType.WITHDRAW)
                .amount(amount)
                .build();
        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction transfer(Long sourceAccountId, Long targetAccountId, BigDecimal amount) {
        Account source = accountRepository.findById(sourceAccountId)
                .orElseThrow(() -> new RoleNotFoundException("Source account not found: " + sourceAccountId));
        Account target = accountRepository.findById(targetAccountId)
                .orElseThrow(() -> new RoleNotFoundException("Target account not found: " + targetAccountId));
        requireActive(source);
        requireActive(target);
        validateOwnershipOrAdmin(source);

        if (source.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient balance");
        }
        source.setBalance(source.getBalance().subtract(amount));
        target.setBalance(target.getBalance().add(amount));
        accountRepository.save(source);
        accountRepository.save(target);

        Transaction tx = Transaction.builder()
                .sourceAccount(source)
                .targetAccount(target)
                .type(TransactionType.TRANSFER)
                .amount(amount)
                .build();
        return transactionRepository.save(tx);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<Transaction> getTransactionHistory(Long accountId) {
        if (accountId == null) {
            return transactionRepository.findAll();
        }
        return transactionRepository.findBySourceAccount_IdOrTargetAccount_Id(accountId, accountId);
    }

    @Transactional
    public Transaction rollbackTransaction(Long transactionId) {
        Transaction orig = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RoleNotFoundException("Transaction not found: " + transactionId));

        if (orig.isReversed()) {
            throw new CustomAccessDeniedException("Transaction already reversed");
        }

        Transaction reversal;
        switch (orig.getType()) {
            case DEPOSIT:
                reversal = withdraw(orig.getSourceAccount().getId(), orig.getAmount());
                break;
            case WITHDRAW:
                reversal = deposit(orig.getSourceAccount().getId(), orig.getAmount());
                break;
            case TRANSFER:
                if (orig.getTargetAccount() == null || orig.getSourceAccount() == null) {
                    throw new RoleNotFoundException("Malformed transfer transaction");
                }
                reversal = transfer(
                        orig.getTargetAccount().getId(),
                        orig.getSourceAccount().getId(),
                        orig.getAmount()
                );
                break;
            default:
                throw new RoleNotFoundException("Unsupported transaction type for rollback: " + orig.getType());
        }

        orig.setReversed(true);
        orig.setRelatedTransactionId(reversal.getId());
        transactionRepository.save(orig);

        reversal.setRelatedTransactionId(orig.getId());
        transactionRepository.save(reversal);

        return reversal;
    }
}
