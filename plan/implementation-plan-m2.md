# Implementation Plan - Milestone 2

## Overview
Add new Wallet page, Cache management in Settings, and Ledger functionality in Identity page.

## 1. New Wallet Page

### Create Page Structure
**New files:**
- `renderer/pages/wallet.tsx`
- `renderer/components/wallet/Wallet.tsx`
- `renderer/components/wallet/controller-management.tsx`
- `renderer/components/wallet/address-book.tsx`
- `renderer/components/wallet/custodian-management.tsx`
- `renderer/components/wallet/cycle-transfers.tsx`
- `renderer/components/wallet/wallet-settings.tsx`

**Files to modify:**
- `renderer/components/layout.tsx` (add wallet to navigation)

### Controller Management
**Tasks:**
- [ ] Add IPC handler `wallet:list-controllers` to get canister controllers
- [ ] Add IPC handler `wallet:add-controller` to add controllers
- [ ] Add IPC handler `wallet:remove-controller` to remove controllers
- [ ] Create UI for viewing and managing controllers
- [ ] Add controller validation and error handling

### Address Book Management
**Tasks:**
- [ ] Add IPC handler `wallet:save-address` to store addresses
- [ ] Add IPC handler `wallet:get-addresses` to retrieve addresses
- [ ] Add IPC handler `wallet:delete-address` to remove addresses
- [ ] Create UI for adding, editing, deleting addresses
- [ ] Store addresses in Electron Store

### Custodian Management
**Tasks:**
- [ ] Add IPC handler `wallet:authorize-custodian` for authorization
- [ ] Add IPC handler `wallet:deauthorize-custodian` for deauthorization
- [ ] Add IPC handler `wallet:list-custodians` to get custodians
- [ ] Create UI for custodian operations
- [ ] Add custodian status display

### Wallet Balance & Operations
**Tasks:**
- [ ] Add IPC handler `wallet:get-balance` for wallet balance
- [ ] Add IPC handler `wallet:transfer-cycles` for cycle transfers
- [ ] Add IPC handler `wallet:rename-wallet` for wallet naming
- [ ] Add IPC handler `wallet:upgrade-wallet` for wallet upgrades
- [ ] Create balance display and transfer interface

## 2. Cache Tab in Settings Page

### Create Version Manager Interface
**New files:**
- `renderer/components/settings/cache-management.tsx`
- `renderer/components/settings/version-list.tsx`
- `renderer/components/settings/version-installer.tsx`

**Files to modify:**
- `renderer/components/settings/Settings.tsx`

### Cache Operations
**Tasks:**
- [ ] Add IPC handler `cache:list-versions` to list installed dfx versions
- [ ] Add IPC handler `cache:delete-version` to delete specific versions
- [ ] Add IPC handler `cache:install-version` to install versions
- [ ] Add IPC handler `cache:get-cache-path` to show cache location
- [ ] Create UI for version management with install/delete actions

### Version Management UI
**Tasks:**
- [ ] Create version list component with install/delete buttons
- [ ] Add version installer with progress tracking
- [ ] Add cache path display and clear cache option
- [ ] Implement version switching interface

## 3. Ledger Tab in Identity Page

### Create Ledger Interface
**New files:**
- `renderer/components/identities/ledger-tab.tsx`
- `renderer/components/identities/account-management.tsx`
- `renderer/components/identities/icp-operations.tsx`
- `renderer/components/identities/transaction-history.tsx`

**Files to modify:**
- `renderer/components/identities/Identities.tsx`

### Account Management
**Tasks:**
- [ ] Add IPC handler `ledger:get-account-id` for account ID generation
- [ ] Add IPC handler `ledger:get-balance` for ICP balance checking
- [ ] Create account ID display component
- [ ] Add balance checking interface

### ICP Operations
**Tasks:**
- [ ] Add IPC handler `ledger:create-canister` for canister creation from ICP
- [ ] Add IPC handler `ledger:transfer-icp` for ICP transfers
- [ ] Add IPC handler `ledger:topup-canister` for canister top-up
- [ ] Create transfer interface with amount input and recipient selection
- [ ] Add canister creation from ICP interface

### Cycle Operations
**Tasks:**
- [ ] Add IPC handler `ledger:fabricate-cycles` for local cycle fabrication
- [ ] Create cycle fabrication interface for local development
- [ ] Add cycle conversion calculator

### Transaction Management
**Tasks:**
- [ ] Add IPC handler `ledger:get-transactions` for transaction history
- [ ] Add IPC handler `ledger:setup-notifications` for transaction notifications
- [ ] Create transaction history display
- [ ] Add notification management interface

## Technical Requirements

### IPC Handlers to Add
```typescript
// Wallet
ipcMain.handle("wallet:list-controllers", async (event, canisterId) => {});
ipcMain.handle("wallet:add-controller", async (event, canisterId, controllerId) => {});
ipcMain.handle("wallet:remove-controller", async (event, canisterId, controllerId) => {});
ipcMain.handle("wallet:save-address", async (event, address, label) => {});
ipcMain.handle("wallet:get-addresses", async () => {});
ipcMain.handle("wallet:delete-address", async (event, addressId) => {});
ipcMain.handle("wallet:authorize-custodian", async (event, custodianId) => {});
ipcMain.handle("wallet:deauthorize-custodian", async (event, custodianId) => {});
ipcMain.handle("wallet:get-balance", async (event, walletId) => {});
ipcMain.handle("wallet:transfer-cycles", async (event, from, to, amount) => {});

// Cache
ipcMain.handle("cache:list-versions", async () => {});
ipcMain.handle("cache:delete-version", async (event, version) => {});
ipcMain.handle("cache:install-version", async (event, version) => {});
ipcMain.handle("cache:get-cache-path", async () => {});

// Ledger
ipcMain.handle("ledger:get-account-id", async (event, identity) => {});
ipcMain.handle("ledger:get-balance", async (event, accountId) => {});
ipcMain.handle("ledger:create-canister", async (event, amount) => {});
ipcMain.handle("ledger:transfer-icp", async (event, to, amount) => {});
ipcMain.handle("ledger:topup-canister", async (event, canisterId, amount) => {});
ipcMain.handle("ledger:fabricate-cycles", async (event, amount) => {});
```

### Data Structures
```typescript
interface AddressBookEntry {
  id: string;
  label: string;
  address: string;
  type: 'principal' | 'account';
}

interface WalletInfo {
  id: string;
  name: string;
  balance: string;
  controllers: string[];
  custodians: string[];
}

interface CacheVersion {
  version: string;
  path: string;
  size: string;
  installed: Date;
}
```

### Navigation Update
```typescript
// Add to layout.tsx navigation
{
  title: "Wallet",
  label: "",
  href: "/wallet",
  icon: WalletIcon,
  variant: router.pathname.startsWith("/wallet") ? "default" : "ghost",
}
```

### UI Components
- Use shadcn/ui components (Tabs, Table, Dialog, Form, etc.)
- Implement form validation with react-hook-form and zod
- Add loading states and error handling
- Follow existing design patterns

## Success Criteria
- [ ] Wallet page accessible from navigation
- [ ] Controller management functional
- [ ] Address book stores and retrieves addresses
- [ ] Custodian operations work correctly
- [ ] Cycle transfers between canisters functional
- [ ] Cache management shows installed versions
- [ ] Version install/delete operations work
- [ ] Ledger tab shows account information
- [ ] ICP operations functional
- [ ] Transaction history displays correctly 