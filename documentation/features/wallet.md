# Wallet

The Wallet page provides comprehensive management of your Internet Computer wallet, including controller management, address book functionality, custodian operations, and cycle transfers. This page centralizes all wallet-related operations in a professional tabbed interface.

## Overview

<div class="image-border">

![Wallet Overview](/features/wallet/wallet-overview.png)

</div>

The Wallet page is organized into six main tabs:
- **Controllers**: Manage wallet controllers
- **Address Book**: Store and manage addresses locally
- **Custodians**: Authorize and manage custodians
- **Cycle Transfers**: Send cycles between canisters
- **Wallet Settings**: Configure wallet name and upgrade
- **Faucet**: Redeem faucet coupons for cycles

:::tip
The wallet functionality requires an active wallet canister. Ensure you have a wallet set up before using these features.
:::

## Controllers Tab

<div class="image-border">

![Controllers Management](/features/wallet/controllers-tab.png)

</div>

Controllers have administrative access to your wallet canister. This tab allows you to:

### View Controllers
- **List all current controllers** of your wallet
- **Display controller principals** with copy-to-clipboard functionality
- **Show controller count** and status

### Add Controllers
1. Click **"Add Controller"** button
2. Enter the **principal ID** of the new controller
3. Select the **network** (local or IC)
4. Click **"Add"** to authorize the new controller

### Remove Controllers
1. Find the controller you want to remove
2. Click the **trash icon** next to their principal
3. Confirm the removal in the dialog
4. The controller will be removed from your wallet

:::warning
Be very careful when managing controllers. Removing all controllers can make your wallet inaccessible. Always ensure you maintain at least one controller.
:::

## Address Book Tab

<div class="image-border">

![Address Book](/features/wallet/address-book-tab.png)

</div>

The Address Book provides local storage for frequently used addresses and principals:

### Features
- **Local Storage**: Addresses are stored locally in the app
- **DFX Integration**: Also displays addresses from `dfx wallet addresses`
- **Search and Filter**: Find addresses quickly
- **Import/Export**: Manage your address collection

### Add New Address
1. Click **"Add Address"** button
2. Fill in the form:
   - **Label**: Descriptive name for the address
   - **Address**: Principal ID or account identifier
   - **Type**: Select "Principal" or "Account"
   - **Notes**: Optional description
3. Click **"Save"** to store the address

### Manage Addresses
- **Edit**: Click the edit icon to modify address details
- **Delete**: Remove addresses you no longer need
- **Copy**: One-click copying of addresses to clipboard
- **Search**: Filter addresses by label or address

:::tip
Use descriptive labels for your addresses to make them easy to find. Consider organizing by project or purpose (e.g., "Main Canister", "Test Account", "Production Wallet").
:::

## Custodians Tab

<div class="image-border">

![Custodians Management](/features/wallet/custodians-tab.png)

</div>

Custodians can perform operations on behalf of your wallet but have more limited permissions than controllers:

### View Custodians
- **List authorized custodians** with their principals
- **Show authorization status** and permissions
- **Display custodian count**

### Authorize Custodians
1. Click **"Authorize Custodian"** button
2. Enter the **principal ID** to authorize
3. Select the **network**
4. Click **"Authorize"** to grant custodian permissions

### Deauthorize Custodians
1. Find the custodian to remove
2. Click **"Deauthorize"** button
3. Confirm the action
4. The custodian will lose wallet permissions

:::info
Custodians can send cycles and perform basic wallet operations but cannot add/remove controllers or other custodians.
:::

## Cycle Transfers Tab

<div class="image-border">

![Cycle Transfers](/features/wallet/cycle-transfers-tab.png)

</div>

Send cycles from your wallet to canisters or other wallets:

### Wallet Balance
- **Current balance** displayed prominently
- **Refresh button** to update balance
- **Balance in cycles** with proper formatting

### Send Cycles
1. **Destination**: Enter the canister ID or principal
2. **Amount**: Specify cycles to send (with unit selector)
3. **Network**: Choose local or IC network
4. **Memo**: Optional transaction note
5. Click **"Send Cycles"** to execute the transfer

### Features
- **Amount Validation**: Ensures sufficient balance
- **Unit Conversion**: Support for different cycle units (T, G, M, K)
- **Transaction History**: View recent transfers
- **Error Handling**: Clear feedback for failed operations

:::tip
Always verify the destination address before sending cycles. Transactions cannot be reversed once confirmed.
:::

## Wallet Settings Tab

<div class="image-border">

![Wallet Settings](/features/wallet/wallet-settings-tab.png)

</div>

Configure your wallet name and perform maintenance operations:

### Wallet Information
- **Current wallet name** display
- **Wallet principal** with copy functionality
- **Network status** indicator

### Rename Wallet
1. Click **"Set Name"** button
2. Enter the **new wallet name**
3. Click **"Update"** to save changes
4. The new name will be applied to your wallet

### Upgrade Wallet
- **Check for updates** to wallet canister code
- **One-click upgrade** to latest wallet version
- **Upgrade status** and progress tracking

:::warning
Wallet upgrades should be performed carefully. Ensure you have backups of important data before upgrading.
:::

## Faucet Tab

<div class="image-border">

![Faucet Coupon](/features/wallet/faucet-tab.png)

</div>

Redeem faucet coupons to receive free cycles for development:

### Coupon Redemption
1. **Enter coupon code** in the input field
2. **Select network** (typically local for development)
3. Click **"Redeem Coupon"** to claim cycles
4. **Success confirmation** with cycle amount received

### Features
- **Coupon validation** before submission
- **Network selection** for redemption
- **Balance update** after successful redemption
- **Error handling** for invalid or expired coupons

:::info
Faucet coupons are typically used for development and testing. They provide free cycles to help you get started with Internet Computer development.
:::

## Network Support

All wallet operations support multiple networks:

- **Local Network**: For development and testing
- **Internet Computer**: For production operations
- **Custom Networks**: As configured in your dfx.json

The network selector is available in each tab where applicable.

## Best Practices

:::tip
Optimize your wallet management:

- **Regular Backups**: Keep secure backups of your wallet information
- **Controller Management**: Maintain multiple controllers for redundancy
- **Address Organization**: Use clear, descriptive labels in your address book
- **Cycle Monitoring**: Regularly check your wallet balance
- **Security**: Never share controller or custodian credentials
- **Testing**: Use local network for development and testing
- **Documentation**: Keep records of important transactions and configurations
:::

## Troubleshooting

:::warning
Common wallet issues and solutions:

- **Wallet not found**: Ensure you have a wallet canister deployed
- **Insufficient cycles**: Check your wallet balance before operations
- **Network errors**: Verify network connectivity and configuration
- **Permission denied**: Ensure you have appropriate controller/custodian permissions
- **Invalid addresses**: Verify principal IDs and account identifiers
- **Upgrade failures**: Check network status and try again
- **Coupon redemption fails**: Verify coupon code and network selection
- **Balance not updating**: Use the refresh button or restart the application
:::

## Security Considerations

:::warning
Important security practices:

- **Controller Access**: Only add trusted principals as controllers
- **Custodian Permissions**: Regularly review and audit custodian access
- **Address Verification**: Always double-check addresses before transfers
- **Network Selection**: Ensure you're using the correct network for operations
- **Backup Strategy**: Maintain secure backups of wallet credentials
- **Regular Audits**: Periodically review controllers and custodians
- **Secure Storage**: Store sensitive information in encrypted locations
:::

## Additional Resources

- [Internet Computer Wallet Documentation](https://internetcomputer.org/docs/current/developer-docs/setup/cycles/cycles-wallet)
- [Cycle Management Guide](https://internetcomputer.org/docs/current/developer-docs/setup/cycles/)
- [DFX Wallet Commands](https://internetcomputer.org/docs/current/references/cli-reference/dfx-wallet)
- [Security Best Practices](https://internetcomputer.org/docs/current/developer-docs/security/)

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.vp-doc h2 {
    border-top: 1px solid #eaecef;
    padding-top: 24px;
    margin-top: 24px;
}
</style> 