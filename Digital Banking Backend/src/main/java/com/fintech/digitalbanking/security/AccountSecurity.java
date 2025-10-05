package com.fintech.digitalbanking.security;

import com.fintech.digitalbanking.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("accountSecurity")
@RequiredArgsConstructor
public class AccountSecurity {

    private final AccountRepository accountRepository;

    /** Called from PreAuthorize: returns true if authentication principal owns accountId */
    public boolean isOwner(Long accountId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) return false;
        return accountRepository.findById(accountId)
                .map(a -> a.getUser() != null && authentication.getName().equals(a.getUser().getUsername()))
                .orElse(false);
    }

    // Convenience overload for SpEL without auth injection (will use SecurityContext)
    public boolean isOwner(Long accountId) {
        return isOwner(accountId, org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication());
    }
}
