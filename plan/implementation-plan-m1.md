# Implementation Plan - Milestone 1

## Overview
Update existing pages with NNS canister support, filtering, and dfx 0.25.0 compatibility.

## 1. Update Canisters Page

### Add NNS Canister Support
**Files to modify:**
- `renderer/components/canisters/Canisters.tsx`
- `renderer/components/canisters/columns.tsx`
- `main/background.ts`

**Tasks:**
- [x] Add IPC handler `canister:list-nns` to fetch NNS canisters
- [x] Extend CanisterData interface with `type: 'user' | 'nns'` field
- [x] Update canister listing to include both user and NNS canisters
- [x] Add visual indicators to distinguish NNS vs user canisters

### Implement Filtering
**Files to modify:**
- `renderer/components/canisters/data-table.tsx`
- `renderer/components/canisters/Canisters.tsx`

**Tasks:**
- [x] Add filter dropdown: All, User Canisters, NNS Canisters
- [x] Add search input for canister names/IDs
- [x] Add network filter: Local, IC, Custom
- [x] Implement table sorting by name, type, network

## 2. Update Canister Detail Page

### Create NNS Query Tab
**New files:**
- `renderer/components/canisters/canister/nns-query-tab.tsx`
- `renderer/components/canisters/canister/did-method-interface.tsx`

**Files to modify:**
- `renderer/pages/canisters/[id]/index.tsx`
- `main/background.ts`

**Tasks:**
- [ ] Add IPC handler `canister:parse-did` for .did file parsing
- [ ] Create tab component with Overview, Methods, NNS Query, Metadata tabs
- [ ] Build method interface generator from .did files
- [ ] Add method calling interface for NNS canisters

### Add DFX Metadata Interface
**Tasks:**
- [ ] Add IPC handler `canister:get-metadata` using `dfx canister metadata`
- [ ] Create metadata display component showing controllers, module hash, settings
- [ ] Add metadata tab to canister detail page

### Update Commands for dfx 0.25.0
**Files to modify:**
- `main/helpers/dfx-helper.ts`
- All canister components

**Tasks:**
- [ ] Audit all dfx commands for 0.25.0 compatibility
- [ ] Update command flags and options
- [ ] Update error handling for new command outputs
- [ ] Test all existing canister operations

## 3. Update Cycles Page

### Add New Cycle Operations
**New files:**
- `renderer/components/cycles/approve-cycles.tsx`
- `renderer/components/cycles/balance-check.tsx`
- `renderer/components/cycles/faucet-coupon.tsx`

**Files to modify:**
- `renderer/components/cycles/Cycles.tsx`
- `main/background.ts`

**Tasks:**
- [ ] Add IPC handler `cycles:approve` for cycle approvals
- [ ] Add IPC handler `cycles:balance` for balance checking
- [ ] Add IPC handler `cycles:redeem-coupon` for faucet coupons
- [ ] Create UI components for each operation
- [ ] Integrate new components into main Cycles page

## 4. Update Settings Page

### Implement DFX Completion Auto-activation
**Files to modify:**
- `renderer/components/settings/Settings.tsx`
- `main/background.ts`

**Tasks:**
- [ ] Add IPC handler `settings:detect-shell` to detect user shell
- [ ] Add IPC handler `settings:setup-completion` to configure dfx completion
- [ ] Create UI toggle for enabling/disabling completion
- [ ] Add manual setup instructions display

### Update Bundled DFX Version
**Files to modify:**
- `resources/mac/dfx-extracted/dfx`
- `resources/linux/dfx-extracted/dfx`
- `main/helpers/dfx-helper.ts`

**Tasks:**
- [ ] Replace bundled dfx binary with version 0.25.0
- [ ] Update version detection logic in dfx-helper.ts
- [ ] Test all existing functionality with new version
- [ ] Update version display in settings

## Technical Requirements

### IPC Handlers to Add
```typescript
// NNS Canisters
ipcMain.handle("canister:list-nns", async (event, network) => {});
ipcMain.handle("canister:parse-did", async (event, canisterId, network) => {});
ipcMain.handle("canister:get-metadata", async (event, canisterId, network) => {});

// Cycles
ipcMain.handle("cycles:approve", async (event, amount, spender) => {});
ipcMain.handle("cycles:balance", async (event, canisterId) => {});
ipcMain.handle("cycles:redeem-coupon", async (event, couponCode) => {});

// Settings
ipcMain.handle("settings:detect-shell", async () => {});
ipcMain.handle("settings:setup-completion", async (event, enable) => {});
```

### Data Structures
```typescript
interface CanisterData {
  name: string;
  canister_id: string;
  type: 'user' | 'nns';
  network: 'local' | 'ic' | 'custom';
  status: string;
  cycles?: string;
  controllers?: string[];
}
```

### UI Components
- Use shadcn/ui components (Tabs, Button, Input, Select, etc.)
- Implement loading states for all async operations
- Add error handling with toast notifications
- Follow existing design patterns

## Success Criteria
- [ ] NNS canisters visible in canister table
- [ ] Filtering works for all canister types
- [ ] NNS query tab functional with method calling
- [ ] Metadata tab shows dfx canister information
- [ ] New cycle operations work correctly
- [ ] dfx completion can be auto-configured
- [ ] All functionality works with dfx 0.25.0 