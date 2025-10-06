module peer_purse_addr::peer_pulse {
    use std::signer;
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::simple_map::{Self, SimpleMap};
    use aptos_std::table::{Self, Table};
    use aptos_framework::account;
    use aptos_framework::resource_account;
    use std::debug::print;
    use std::string::utf8;

    // Error codes
    const E_ZERO_AMOUNT: u64 = 1;
    const E_ZERO_DURATION: u64 = 2;
    const E_INSUFFICIENT_LIQUIDITY: u64 = 3;
    const E_COLLATERAL_TOO_LOW: u64 = 4;
    const E_TRANSFER_FAILED: u64 = 5;
    const E_NOT_OWNER: u64 = 7;
    const E_INVALID_OWNER: u64 = 8;
    const E_INVALID_RATIO: u64 = 9;
    const E_LOAN_NOT_FOUND: u64 = 10;
    const E_LOAN_NOT_ELIGIBLE_FOR_LIQUIDATION: u64 = 11;
    const E_INSUFFICIENT_TRANSFERRED_VALUE: u64 = 12;
    const E_SHOULD_NOT_SEND_APT: u64 = 13;
    const E_PAYMENT_DOES_NOT_MATCH_AMOUNT: u64 = 14;
    const E_REPAYMENT_EXCEEDS_DEBT: u64 = 15;
    const E_NOT_SUPPORTED_TOKEN: u64 = 16;

    // Structs
    struct LendingPlatform has key {
        collateral: Table<address, SimpleMap<address, u64>>,
        debt: Table<address, SimpleMap<address, u64>>,
        liquidity_pool: Table<address, SimpleMap<address, u64>>,
        active_loans: Table<address, vector<Loan>>,
        min_collateral_ratio: u64,
        owner: address,
        resource_account: address,
    }

    struct Loan has store, drop, copy {
        lender: address,
        token: address,
        amount: u64,
    }

    struct SignerCapability has key {
        cap: account::SignerCapability,
    }

    struct EventHandles has key {
        loan_created_handle: event::EventHandle<LoanCreated>,
        loan_accepted_handle: event::EventHandle<LoanAccepted>,
        loan_repaid_handle: event::EventHandle<LoanRepaid>,
        collateral_released_handle: event::EventHandle<CollateralReleased>,
    }

    struct LoanCreated has drop, store, copy {
        lender: address,
        token: address,
        amount: u64,
    }

    struct LoanAccepted has drop, store, copy {
        borrower: address,
        lender: address,
        token: address,
        amount: u64,
        collateral_token: address,
        collateral_amount: u64,
    }

    struct LoanRepaid has drop, store, copy {
        borrower: address,
        lender: address,
        token: address,
        amount: u64,
    }

    struct CollateralReleased has drop, store, copy {
        borrower: address,
        collateral_token: address,
        amount: u64,
    }

    // Initialize the lending platform
    fun init_module(account: &signer) {
        let signer_addr = signer::address_of(account);
        let (resource_signer, cap) = account::create_resource_account(account, b"peer_pulse");
        let resource_addr = signer::address_of(&resource_signer);

        move_to(account, LendingPlatform {
            collateral: table::new(),
            debt: table::new(),
            liquidity_pool: table::new(),
            active_loans: table::new(),
            min_collateral_ratio: 15000, // 150%
            owner: signer_addr,
            resource_account: resource_addr,
        });
        move_to(account, EventHandles {
            loan_created_handle: account::new_event_handle<LoanCreated>(account),
            loan_accepted_handle: account::new_event_handle<LoanAccepted>(account),
            loan_repaid_handle: account::new_event_handle<LoanRepaid>(account),
            collateral_released_handle: account::new_event_handle<CollateralReleased>(account),
        });
        move_to(account, SignerCapability { cap });

        if (!coin::is_account_registered<AptosCoin>(resource_addr)) {
            coin::register<AptosCoin>(&resource_signer);
        };
        if (!coin::is_account_registered<AptosCoin>(signer_addr)) {
            coin::register<AptosCoin>(account);
        };
    }

    // Getters
    #[view]
    public fun get_owner(): address acquires LendingPlatform {
        borrow_global<LendingPlatform>(@peer_purse_addr).owner
    }

    #[view]
    public fun get_min_collateral_ratio(): u64 acquires LendingPlatform {
        borrow_global<LendingPlatform>(@peer_purse_addr).min_collateral_ratio
    }

    #[view]
    public fun get_liquidity(lender: address, token: address): u64 acquires LendingPlatform {
        let platform = borrow_global<LendingPlatform>(@peer_purse_addr);
        if (table::contains(&platform.liquidity_pool, lender)) {
            let token_map = table::borrow(&platform.liquidity_pool, lender);
            if (simple_map::contains_key(token_map, &token)) {
                *simple_map::borrow(token_map, &token)
            } else {
                0
            }
        } else {
            0
        }
    }

    #[view]
    public fun get_debt(borrower: address, token: address): u64 acquires LendingPlatform {
        let platform = borrow_global<LendingPlatform>(@peer_purse_addr);
        if (table::contains(&platform.debt, borrower)) {
            let token_map = table::borrow(&platform.debt, borrower);
            if (simple_map::contains_key(token_map, &token)) {
                *simple_map::borrow(token_map, &token)
            } else {
                0
            }
        } else {
            0
        }
    }

    #[view]
    public fun get_collateral(borrower: address, token: address): u64 acquires LendingPlatform {
        let platform = borrow_global<LendingPlatform>(@peer_purse_addr);
        if (table::contains(&platform.collateral, borrower)) {
            let token_map = table::borrow(&platform.collateral, borrower);
            if (simple_map::contains_key(token_map, &token)) {
                *simple_map::borrow(token_map, &token)
            } else {
                0
            }
        } else {
            0
        }
    }

    #[view]
    public fun get_active_loans(borrower: address): vector<Loan> acquires LendingPlatform {
        let platform = borrow_global<LendingPlatform>(@peer_purse_addr);
        *table::borrow_with_default(&platform.active_loans, borrower, &vector::empty())
    }

    // Create a loan
    public entry fun create_loan(
        account: &signer,
        token: address,
        amount: u64,
        duration: u64
    ) acquires LendingPlatform, EventHandles {
        let signer_addr = signer::address_of(account);
        assert!(amount != 0, E_ZERO_AMOUNT);
        assert!(duration != 0, E_ZERO_DURATION);

        let platform = borrow_global_mut<LendingPlatform>(@peer_purse_addr);
        let platform_addr = platform.resource_account;
        let token_map = if (table::contains(&platform.liquidity_pool, signer_addr)) {
            table::borrow_mut(&mut platform.liquidity_pool, signer_addr)
        } else {
            let new_map = simple_map::create<address, u64>();
            table::add(&mut platform.liquidity_pool, signer_addr, new_map);
            table::borrow_mut(&mut platform.liquidity_pool, signer_addr)
        };
        let current_liquidity = if (simple_map::contains_key(token_map, &token)) {
            *simple_map::borrow(token_map, &token)
        } else {
            0
        };
        simple_map::upsert(token_map, token, current_liquidity + amount);

        if (token == @aptos_framework) {
            let platform_balance_before = coin::balance<AptosCoin>(platform_addr);
            let coins = coin::withdraw<AptosCoin>(account, amount);
            coin::deposit(platform_addr, coins);
            let platform_balance_after = coin::balance<AptosCoin>(platform_addr);
            assert!(platform_balance_after >= platform_balance_before + amount, E_INSUFFICIENT_TRANSFERRED_VALUE);
        } else {
            abort E_NOT_SUPPORTED_TOKEN;
        };

        let event_handles = borrow_global_mut<EventHandles>(@peer_purse_addr);
        event::emit_event(&mut event_handles.loan_created_handle, LoanCreated {
            lender: signer_addr,
            token,
            amount,
        });
    }

    // Lock collateral
    public entry fun lock_collateral(
        account: &signer,
        collateral_token: address,
        collateral_amount: u64,
    ) acquires LendingPlatform {
        let borrower = signer::address_of(account);
        assert!(collateral_amount != 0, E_ZERO_AMOUNT);

        let platform = borrow_global_mut<LendingPlatform>(@peer_purse_addr);
        let platform_addr = platform.resource_account;
        let token_map = if (table::contains(&platform.collateral, borrower)) {
            table::borrow_mut(&mut platform.collateral, borrower)
        } else {
            let new_map = simple_map::create<address, u64>();
            table::add(&mut platform.collateral, borrower, new_map);
            table::borrow_mut(&mut platform.collateral, borrower)
        };
        let current_collateral = if (simple_map::contains_key(token_map, &collateral_token)) {
            *simple_map::borrow(token_map, &collateral_token)
        } else {
            0
        };
        simple_map::upsert(token_map, collateral_token, current_collateral + collateral_amount);

        if (collateral_token == @aptos_framework) {
            let platform_balance_before = coin::balance<AptosCoin>(platform_addr);
            let coins = coin::withdraw<AptosCoin>(account, collateral_amount);
            coin::deposit(platform_addr, coins);
            let platform_balance_after = coin::balance<AptosCoin>(platform_addr);
            assert!(platform_balance_after >= platform_balance_before + collateral_amount, E_INSUFFICIENT_TRANSFERRED_VALUE);
        } else {
            abort E_NOT_SUPPORTED_TOKEN;
        };
    }

    // Accept a loan
    public entry fun accept_loan(
        account: &signer,
        lender: address,
        token: address,
        amount: u64
    ) acquires LendingPlatform, EventHandles, SignerCapability {
        let borrower = signer::address_of(account);
        assert!(amount != 0, E_ZERO_AMOUNT);

        let platform = borrow_global_mut<LendingPlatform>(@peer_purse_addr);
        let platform_addr = platform.resource_account;
        let liquidity_map = if (table::contains(&platform.liquidity_pool, lender)) {
            table::borrow_mut(&mut platform.liquidity_pool, lender)
        } else {
            abort E_INSUFFICIENT_LIQUIDITY
        };
        let liquidity = if (simple_map::contains_key(liquidity_map, &token)) {
            *simple_map::borrow(liquidity_map, &token)
        } else {
            0
        };
        assert!(liquidity >= amount, E_INSUFFICIENT_LIQUIDITY);

        let collateral = if (table::contains(&platform.collateral, borrower)) {
            let token_map = table::borrow(&platform.collateral, borrower);
            if (simple_map::contains_key(token_map, &token)) {
                *simple_map::borrow(token_map, &token)
            } else {
                0
            }
        } else {
            0
        };
        let required_collateral = (amount * platform.min_collateral_ratio) / 10000;
        assert!(collateral >= required_collateral, E_COLLATERAL_TOO_LOW);

        simple_map::upsert(liquidity_map, token, liquidity - amount);

        let debt_map = if (table::contains(&platform.debt, borrower)) {
            table::borrow_mut(&mut platform.debt, borrower)
        } else {
            let new_map = simple_map::create<address, u64>();
            table::add(&mut platform.debt, borrower, new_map);
            table::borrow_mut(&mut platform.debt, borrower)
        };
        let current_debt = if (simple_map::contains_key(debt_map, &token)) {
            *simple_map::borrow(debt_map, &token)
        } else {
            0
        };
        simple_map::upsert(debt_map, token, current_debt + amount);

        let loans = table::borrow_mut_with_default(&mut platform.active_loans, borrower, vector::empty());
        vector::push_back(loans, Loan { lender, token, amount });

        if (token == @aptos_framework) {
            let cap = borrow_global<SignerCapability>(@peer_purse_addr);
            let platform_signer = account::create_signer_with_capability(&cap.cap);
            coin::transfer<AptosCoin>(&platform_signer, borrower, amount);
        } else {
            abort E_NOT_SUPPORTED_TOKEN;
        };

        let event_handles = borrow_global_mut<EventHandles>(@peer_purse_addr);
        event::emit_event(&mut event_handles.loan_accepted_handle, LoanAccepted {
            borrower,
            lender,
            token,
            amount,
            collateral_token: token,
            collateral_amount: collateral,
        });
    }

    // Repay a loan
    public entry fun pay_loan(
        account: &signer,
        token: address,
        lender: address,
        amount: u64
    ) acquires LendingPlatform, EventHandles, SignerCapability {
        let borrower = signer::address_of(account);
        let platform = borrow_global_mut<LendingPlatform>(@peer_purse_addr);
        let platform_addr = platform.resource_account;
        let debt_map = if (table::contains(&platform.debt, borrower)) {
            table::borrow_mut(&mut platform.debt, borrower)
        } else {
            abort E_LOAN_NOT_FOUND
        };
        let debt = if (simple_map::contains_key(debt_map, &token)) {
            *simple_map::borrow(debt_map, &token)
        } else {
            0
        };
        assert!(debt >= amount, E_REPAYMENT_EXCEEDS_DEBT);

        if (token == @aptos_framework) {
            coin::transfer<AptosCoin>(account, lender, amount);
        } else {
            abort E_NOT_SUPPORTED_TOKEN;
        };

        simple_map::upsert(debt_map, token, debt - amount);

        if (debt == amount) {
            let collateral_token = token;
            let collateral_map = if (table::contains(&platform.collateral, borrower)) {
                table::borrow_mut(&mut platform.collateral, borrower)
            } else {
                abort E_LOAN_NOT_FOUND
            };
            let collateral_amount = if (simple_map::contains_key(collateral_map, &collateral_token)) {
                *simple_map::borrow(collateral_map, &collateral_token)
            } else {
                0
            };

            if (collateral_token == @aptos_framework) {
                let cap = borrow_global<SignerCapability>(@peer_purse_addr);
                let platform_signer = account::create_signer_with_capability(&cap.cap);
                coin::transfer<AptosCoin>(&platform_signer, borrower, collateral_amount);
            } else {
                abort E_NOT_SUPPORTED_TOKEN;
            };

            simple_map::upsert(collateral_map, collateral_token, 0);

            let event_handles = borrow_global_mut<EventHandles>(@peer_purse_addr);
            event::emit_event(&mut event_handles.collateral_released_handle, CollateralReleased {
                borrower,
                collateral_token,
                amount: collateral_amount,
            });
        };

        let event_handles = borrow_global_mut<EventHandles>(@peer_purse_addr);
        event::emit_event(&mut event_handles.loan_repaid_handle, LoanRepaid {
            borrower,
            lender,
            token,
            amount,
        });
    }

    // Set minimum collateral ratio
    public entry fun update_min_collateral_ratio(
        account: &signer,
        new_ratio: u64
    ) acquires LendingPlatform {
        let platform = borrow_global_mut<LendingPlatform>(@peer_purse_addr);
        assert!(signer::address_of(account) == platform.owner, E_NOT_OWNER);
        assert!(new_ratio >= 10000, E_INVALID_RATIO);
        platform.min_collateral_ratio = new_ratio;
    }

    // Set new owner
    public entry fun set_owner(
        account: &signer,
        new_owner: address
    ) acquires LendingPlatform {
        let platform = borrow_global_mut<LendingPlatform>(@peer_purse_addr);
        assert!(signer::address_of(account) == platform.owner, E_NOT_OWNER);
        assert!(new_owner != @0x0, E_INVALID_OWNER);
        platform.owner = new_owner;
    }

    #[view]
    public fun calculate_required_collateral(amount: u64): u64 acquires LendingPlatform {
        let platform = borrow_global<LendingPlatform>(@peer_purse_addr);
        (amount * platform.min_collateral_ratio) / 10000
    }

    #[view]
    public fun is_undercollateralized(borrower: address, token: address): bool acquires LendingPlatform {
        let debt = get_debt(borrower, token);
        let collateral = get_collateral(borrower, token);
        let required = calculate_required_collateral(debt);
        collateral < required
    }

    // Liquidate a loan
    public entry fun liquidate(
        account: &signer,
        borrower: address,
        token: address
    ) acquires LendingPlatform, EventHandles, SignerCapability {
        let platform = borrow_global_mut<LendingPlatform>(@peer_purse_addr);
        let platform_addr = platform.resource_account;
        let debt = if (table::contains(&platform.debt, borrower)) {
            let token_map = table::borrow(&platform.debt, borrower);
            if (simple_map::contains_key(token_map, &token)) {
                *simple_map::borrow(token_map, &token)
            } else {
                0
            }
        } else {
            0
        };
        assert!(debt != 0, E_LOAN_NOT_FOUND);

        let collateral = if (table::contains(&platform.collateral, borrower)) {
            let token_map = table::borrow(&platform.collateral, borrower);
            if (simple_map::contains_key(token_map, &token)) {
                *simple_map::borrow(token_map, &token)
            } else {
                0
            }
        } else {
            0
        };
        let required = (debt * platform.min_collateral_ratio) / 10000;
        assert!(collateral < required, E_LOAN_NOT_ELIGIBLE_FOR_LIQUIDATION);

        let collateral_token = token;
        let collateral_amount = collateral;

        let debt_map = table::borrow_mut(&mut platform.debt, borrower);
        simple_map::upsert(debt_map, token, 0);

        let collateral_map = table::borrow_mut(&mut platform.collateral, borrower);
        simple_map::upsert(collateral_map, collateral_token, 0);

        let caller = signer::address_of(account);
        if (collateral_token == @aptos_framework) {
            let cap = borrow_global<SignerCapability>(@peer_purse_addr);
            let platform_signer = account::create_signer_with_capability(&cap.cap);
            coin::transfer<AptosCoin>(&platform_signer, caller, collateral_amount);
        } else {
            abort E_NOT_SUPPORTED_TOKEN;
        };

        let event_handles = borrow_global_mut<EventHandles>(@peer_purse_addr);
        event::emit_event(&mut event_handles.collateral_released_handle, CollateralReleased {
            borrower,
            collateral_token,
            amount: collateral_amount,
        });
    }

    // Tests
    #[test(aptos_framework = @0x1, account = @0x123)]
    fun test_init_module_success(aptos_framework: &signer, account: &signer) acquires LendingPlatform {
        let (burn_cap, mint_cap) = aptos_framework::aptos_coin::initialize_for_test(aptos_framework);
        let account_addr = signer::address_of(account);
        account::create_account_for_test(account_addr);
        coin::register<AptosCoin>(account);
        let starter_coins = coin::mint<AptosCoin>(1_000_000_000_000, &mint_cap);
        coin::deposit(account_addr, starter_coins);
        coin::destroy_mint_cap(mint_cap);
        coin::destroy_burn_cap(burn_cap);

        init_module(account);

        let platform = borrow_global<LendingPlatform>(account_addr);
        assert!(platform.owner == account_addr, 1000);
        assert!(platform.min_collateral_ratio == 15000, 1001);
        assert!(platform.resource_account != @0x0, 1002);
        assert!(exists<EventHandles>(account_addr), 1003);
        assert!(exists<SignerCapability>(account_addr), 1004);
        assert!(coin::is_account_registered<AptosCoin>(platform.resource_account), 1005);
        assert!(coin::is_account_registered<AptosCoin>(account_addr), 1006);
    }

    #[test(account = @peer_purse_addr, aptos_framework = @0x1)]
    fun test_create_loan_success(account: &signer, aptos_framework: &signer) acquires LendingPlatform, EventHandles {
        test_init_module_success(aptos_framework, account);

        let amount = 100000000; // 1 APT
        let duration = 86400; // 1 day
        create_loan(account, @0x1, amount, duration);

        let liquidity = get_liquidity(@peer_purse_addr, @0x1);
        assert!(liquidity == amount, 2000);

        let platform = borrow_global<LendingPlatform>(@peer_purse_addr);
        let platform_balance = coin::balance<AptosCoin>(platform.resource_account);
        assert!(platform_balance >= amount, 2001);

        // Event checks disabled due to test framework limitations
        // Workaround: Verify event handle existence
        let events = borrow_global<EventHandles>(@peer_purse_addr);
        assert!(event::counter(&events.loan_created_handle) == 1, 2002);
    }

    #[test(account = @peer_purse_addr, aptos_framework = @0x1)]
    #[expected_failure(abort_code = E_ZERO_AMOUNT)]
    fun test_create_loan_zero_amount(account: &signer, aptos_framework: &signer) acquires LendingPlatform, EventHandles {
        test_init_module_success(aptos_framework, account);
        create_loan(account, @0x1, 0, 100);
    }

    #[test(account = @peer_purse_addr, aptos_framework = @0x1)]
    #[expected_failure(abort_code = E_ZERO_DURATION)]
    fun test_create_loan_zero_duration(account: &signer, aptos_framework: &signer) acquires LendingPlatform, EventHandles {
        test_init_module_success(aptos_framework, account);
        create_loan(account, @0x1, 1000, 0);
    }

    #[test(account = @peer_purse_addr, aptos_framework = @0x1)]
    #[expected_failure(abort_code = E_NOT_SUPPORTED_TOKEN)]
    fun test_create_loan_unsupported_token(account: &signer, aptos_framework: &signer) acquires LendingPlatform, EventHandles {
        test_init_module_success(aptos_framework, account);
        create_loan(account, @0x2, 1000, 100);
    }

    // Additional tests omitted for brevity but should be updated similarly
}
