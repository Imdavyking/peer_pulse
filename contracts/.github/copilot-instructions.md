# Copilot Instructions for Peer Pulse Move Project

## Project Overview

- This is a Move smart contract project for a lending platform, located in `sources/peer_pulse.move`.
- The main module is `peer_pulse`, which manages lending, collateral, debt, liquidity pools, and events.
- The architecture centers around the `LendingPlatform` struct, with tables for collateral, debt, liquidity, and active loans.
- Event handling is implemented via the `EventHandles` struct and Move's event system.

## Key Files & Structure

- `sources/peer_pulse.move`: Main contract logic and entry points.
- `build/peer_pulse/`: Compiled bytecode, source maps, and dependencies.
- `scripts/`: (If present) for deployment or interaction scripts.
- `tests/`: (If present) for Move unit tests.

## Developer Workflows

- **Build:** `aptos move compile`
- **Test:** `aptos move test`
- **Deploy:** `aptos move deploy`
- **Fund Account:** Use `aptos account fund-with-faucet --account <address> --amount <amount>`
- All commands are run from the project root.

## Patterns & Conventions

- Storage is managed using `Table<address, Table<address, u64>>` for multi-token support.
- Events are emitted for loan creation, acceptance, repayment, and collateral release.
- Error codes are defined as constants at the top of the module for clarity.
- Entry functions use `public entry fun ...` and require explicit checks/asserts for safety.
- Use `@aptos_framework` as the token address for native APT transactions.
- Collateral and debt logic is tightly coupled to the `LendingPlatform` struct.
- All state-changing functions acquire `LendingPlatform` and/or `EventHandles` resources.

## Integration & Dependencies

- Relies on Aptos Framework modules: `coin`, `event`, `account`, and `aptos_coin`.
- Uses `aptos_std::table` for storage abstraction.
- External token support is stubbed; only APT is fully integrated.

## Examples

- To initialize the platform:
  ```move
  fun init_module(account: &signer) { ... }
  ```
- To create a loan:
  ```move
  public entry fun create_loan(account: &signer, platform_addr: address, token: address, amount: u64, duration: u64, coins: coin::Coin<AptosCoin)) acquires LendingPlatform, EventHandles { ... }
  ```

## Tips for AI Agents

- Always check for resource acquisition (`acquires`) and error codes when adding new entry points.
- Follow the table-based storage pattern for new features.
- Reference `peer_pulse.move` for canonical event and error handling.
- Use the provided CLI commands for all build/test/deploy operations.

---

If any section is unclear or missing, please provide feedback for further refinement.
