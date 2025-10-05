package com.fintech.digitalbanking.service;

import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.entity.AccountType;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.exception.CustomAccessDeniedException;
import com.fintech.digitalbanking.exception.RoleNotFoundException;
import com.fintech.digitalbanking.repository.AccountRepository;
import com.fintech.digitalbanking.repository.UserRepository;
import com.fintech.digitalbanking.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    private void validateAccountOwnership(Long accountId) {
        if (securityUtil.isAdmin()) return;

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RoleNotFoundException("Account not found with ID: " + accountId));

        if (!account.getUser().getUsername().equals(securityUtil.getCurrentUsername())) {
            throw new CustomAccessDeniedException("Access denied - account does not belong to current user");
        }
    }

    @Transactional
    public Account createAccount(AccountType type) {
        User user = securityUtil.getCurrentUserEntity();
        Account account = Account.builder()
                .accountNumber(generateAccountNumber())
                .accountType(type)
                .balance(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .active(true)
                .user(user)
                .build();
        Account saved = accountRepository.save(account);

        if (user.getSelectedAccountId() == null) {
            user.setSelectedAccountId(saved.getId());
            userRepository.save(user);
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Account> getMyAccounts() {
        User user = securityUtil.getCurrentUserEntity();
        return accountRepository.findByUser(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<Account> getAccountsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RoleNotFoundException("User not found with ID: " + userId));
        return accountRepository.findByUser(user);
    }

    @Transactional(readOnly = true)
    public BigDecimal getBalance(Long accountId) {
        validateAccountOwnership(accountId);
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RoleNotFoundException("Account not found with ID: " + accountId));
        return account.getBalance();
    }

    @Transactional
    public void deactivateAccount(Long accountId) {
        validateAccountOwnership(accountId);
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RoleNotFoundException("Account not found with ID: " + accountId));

        if (!account.isActive()) return;

        account.setActive(false);
        accountRepository.save(account);
    }

    @Transactional
    public void activateAccount(Long accountId) {
        validateAccountOwnership(accountId);
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RoleNotFoundException("Account not found with ID: " + accountId));

        if (account.isActive()) return;

        account.setActive(true);
        accountRepository.save(account);
    }

    @Transactional
    public void selectAccount(Long accountId) {
        validateAccountOwnership(accountId);
        User user = securityUtil.getCurrentUserEntity();
        user.setSelectedAccountId(accountId);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public BigDecimal getSelectedAccountBalance() {
        User user = securityUtil.getCurrentUserEntity();
        if (user.getSelectedAccountId() == null) {
            throw new CustomAccessDeniedException("No account selected. Please create or select an account.");
        }

        Account account = accountRepository.findById(user.getSelectedAccountId())
                .orElseThrow(() -> new RoleNotFoundException("Selected account not found"));
        return account.getBalance();
    }

    private String generateAccountNumber() {
        return "ACC" + System.currentTimeMillis() +
                UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RoleNotFoundException("User not found: " + username));
    }
}
