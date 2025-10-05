# Peer Pulse – Lending Protocol on Aptos

`peer_pulse` is a decentralized lending platform module built on the **Aptos Move framework**.
It enables users to supply liquidity, borrow assets with collateral, repay loans, and liquidate undercollateralized positions.

---

## ⚡ Features

- **Liquidity Provision** – Lenders can create loan offers by supplying AptosCoin.
- **Borrowing with Collateral** – Borrowers lock collateral to accept loans.
- **Loan Lifecycle Management** – Events emitted for loan creation, acceptance, repayment, and collateral release.
- **Collateralization Ratio** – Enforced via a minimum ratio (default 150%).
- **Liquidation** – Allows liquidation of undercollateralized borrowers.
- **Admin Controls** – Owner can update collateral ratio and transfer ownership.

---

## 📂 Module: `peer_purse_addr::peer_pulse`

### Key Structs

- **`LendingPlatform`** – Stores liquidity, debt, collateral, active loans, platform owner, and settings.
- **`Loan`** – Represents a loan entry (lender, token, amount).
- **`EventHandles`** – Manages all emitted loan/collateral events.
- **`SignerCapability`** – Stores resource account capability for platform transfers.

---

## 🚀 Functions

### Initialization

- `init_module(account: &signer)` – Deploys the platform with a resource account and registers AptosCoin.

### Getters (View Functions)

- `get_owner()` – Returns the platform owner.
- `get_min_collateral_ratio()` – Returns current min collateral ratio.
- `get_liquidity(lender, token)` – Checks lender’s liquidity.
- `get_debt(borrower, token)` – Checks borrower’s debt.
- `get_collateral(borrower, token)` – Checks borrower’s collateral.
- `get_active_loans(borrower)` – Returns borrower’s active loans.
- `calculate_required_collateral(amount)` – Computes required collateral for a loan.
- `is_undercollateralized(borrower, token)` – Checks if a borrower is liquidatable.

### Actions

- `register_aptos_coin(account)` – Registers AptosCoin for a user.
- `create_loan(account, token, amount, duration)` – Lender supplies liquidity.
- `lock_collateral(account, collateral_token, collateral_amount)` – Borrower locks collateral.
- `accept_loan(account, lender, token, amount)` – Borrower accepts a loan.
- `pay_loan(account, token, lender, amount)` – Borrower repays a loan.
- `liquidate(account, borrower, token)` – Liquidates an undercollateralized loan.

### Admin Functions

- `update_min_collateral_ratio(account, new_ratio)` – Updates collateral ratio.
- `set_owner(account, new_owner)` – Transfers ownership.

---

## ⚠️ Error Codes

- `E_ZERO_AMOUNT (1)` – Amount cannot be zero
- `E_ZERO_DURATION (2)` – Duration cannot be zero
- `E_INSUFFICIENT_LIQUIDITY (3)` – Lender liquidity too low
- `E_COLLATERAL_TOO_LOW (4)` – Borrower’s collateral insufficient
- `E_TRANSFER_FAILED (5)` – Coin transfer failed
- `E_NOT_OWNER (7)` – Caller not platform owner
- `E_INVALID_OWNER (8)` – New owner invalid
- `E_INVALID_RATIO (9)` – Collateral ratio invalid
- `E_LOAN_NOT_FOUND (10)` – Loan not found
- `E_LOAN_NOT_ELIGIBLE_FOR_LIQUIDATION (11)` – Loan cannot be liquidated
- `E_INSUFFICIENT_TRANSFERRED_VALUE (12)` – Transfer did not match expected amount
- `E_SHOULD_NOT_SEND_APT (13)` – Unexpected APT transfer
- `E_PAYMENT_DOES_NOT_MATCH_AMOUNT (14)` – Payment mismatch
- `E_REPAYMENT_EXCEEDS_DEBT (15)` – Repayment exceeds outstanding debt
- `E_NOT_SUPPORTED_TOKEN (16)` – Only AptosCoin is supported

---

## 🛠️ Development & Deployment

### 1. Fund Account from Faucet

```bash
aptos account fund-with-faucet \
  --account d9a0133b75e87fb012f4a419d12f12951628dab2c97d78b104b9e8ae7b2f2aac \
  --amount 100000000
```
### 1. Create Account

```bash
aptos init --profile davyking --network devnet 
```

### 2. Run Unit Tests

```bash
aptos move test
```

### 3. Compile the Module

```bash
aptos move compile
```

### 4. Deploy the Module

```bash
aptos move deploy
```

---

## 📜 License

This project is licensed under the MIT License.
