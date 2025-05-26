# Cycles

The Cycles page is a comprehensive component of the DFX Dashboard, providing a professional interface for managing cycles on the Internet Computer. Built with dfx 0.25.0 compatibility, it offers all essential cycle operations in an organized, tabbed interface for optimal developer experience.

## Overview

The redesigned Cycles page features a modern tabbed interface with three main sections:
- **Balance & Approvals**: Check cycle balances and manage cycle approvals
- **Transfers & Top-ups**: Transfer cycles between accounts and top up canisters
- **Convert & Faucet**: Convert ICP to cycles and redeem faucet coupons

## Interface Design

The page features:
- **Fixed header** with current balance display and refresh functionality
- **Tabbed navigation** with colored icons for easy identification
- **Scrollable content areas** for each tab section
- **Professional form layouts** with comprehensive error handling
- **Toast notifications** for operation feedback

## Balance & Approvals Tab

### Checking Cycle Balance

<div class="image-border">

![Cycles Balance](/features/cycles/cycles-balance.png)

</div>

The balance section allows you to:
- **Check current balance** for any principal or subaccount
- **Specify network** (local, IC, or custom networks)
- **Use precise balance** option for exact cycle counts
- **View balance in TC** (trillion cycles) format

**Available Options:**
- `--network`: Specify which network to query
- `--precise`: Get exact cycle count instead of human-readable format

### Managing Cycle Approvals

The approval section enables you to:
- **Approve cycle spending** for other principals
- **Set spending limits** with specific amounts
- **Add memos** for transaction tracking
- **Set expiration dates** for approvals

**Available Options:**
- `--spender`: Principal authorized to spend cycles
- `--amount`: Maximum cycles that can be spent
- `--memo`: Optional memo for the approval
- `--expires-at`: Expiration timestamp for the approval

:::tip
Use cycle approvals to enable automated systems or other principals to spend cycles on your behalf within defined limits.
:::

## Transfers & Top-ups Tab

### Transferring Cycles

<div class="image-border">

![Transfer Cycles](/features/cycles/transfer-cycles.png)

</div>

The transfer functionality allows you to:
- **Transfer cycles** to any principal
- **Specify source subaccount** for the transfer
- **Set destination subaccount** if needed
- **Add transaction memos** for record keeping

**Available Options:**
- `--to`: Destination principal for the cycles
- `--amount`: Number of cycles to transfer
- `--from-subaccount`: Source subaccount (optional)
- `--to-subaccount`: Destination subaccount (optional)
- `--memo`: Optional memo for the transfer

### Topping Up Canisters

<div class="image-border">

![Top Up Canister](/features/cycles/top-up-canister.png)

</div>

The canister top-up feature enables you to:
- **Top up any canister** with cycles
- **Specify source subaccount** for funding
- **Enter canister ID** manually or select from projects
- **Set precise amounts** for top-ups

**Available Options:**
- `--canister`: Target canister ID for top-up
- `--amount`: Number of cycles to add
- `--from-subaccount`: Source subaccount for the cycles

:::warning
Double-check canister IDs before topping up, as cycle transfers cannot be reversed. Sending cycles to an incorrect canister will result in permanent loss.
:::

## Convert & Faucet Tab

### Converting ICP to Cycles

<div class="image-border">

![Convert ICP](/features/cycles/convert-icp.png)

</div>

The ICP conversion feature allows you to:
- **Convert ICP to cycles** at current exchange rates
- **Specify source subaccount** for ICP
- **Add transaction memos** for tracking
- **Monitor conversion rates** before proceeding

**Available Options:**
- `--amount`: Amount of ICP to convert
- `--from-subaccount`: Source subaccount containing ICP
- `--memo`: Optional memo for the conversion

### Redeeming Faucet Coupons

The faucet redemption feature enables you to:
- **Redeem faucet coupons** for free cycles
- **Enter coupon codes** from official sources
- **Receive cycles** directly to your account
- **Track redemption history**

**Available Options:**
- `--coupon`: Faucet coupon code to redeem

:::tip
Faucet coupons are typically available for development and testing purposes. Check official DFINITY channels for available coupons.
:::

## Advanced Features

### Network Selection
All operations support network selection:
- **Local**: Your local dfx development network
- **IC**: Internet Computer mainnet
- **Custom**: Any custom networks you've configured

### Subaccount Support
Most operations support subaccount specification:
- **Source subaccounts**: Specify where cycles/ICP come from
- **Destination subaccounts**: Specify where cycles should go
- **Account isolation**: Keep different purposes separated

### Error Handling
Comprehensive error handling includes:
- **Network connectivity** error detection
- **Insufficient balance** warnings
- **Invalid principal** validation
- **Transaction failure** recovery guidance

## Best Practices

:::tip
Optimize your cycle management with these professional practices:

- **Monitor balances regularly**: Use the balance checker to track cycle consumption patterns
- **Set up approvals strategically**: Use cycle approvals for automated systems with appropriate limits
- **Plan conversions in advance**: Convert ICP to cycles before critical operations to avoid delays
- **Use subaccounts for organization**: Separate cycles for different projects or purposes
- **Keep transaction records**: Use memos to track the purpose of transfers and conversions
- **Test on local networks**: Verify operations on local networks before using mainnet
- **Monitor exchange rates**: Check ICP-to-cycles rates before large conversions
- **Set up monitoring**: Track canister cycle consumption to predict top-up needs
:::

## Troubleshooting

:::warning
Common issues and solutions:

- **Balance not updating**: Click the refresh button or check network connectivity
- **Failed conversions**: Ensure sufficient ICP balance and verify network status
- **Transfer failures**: Double-check recipient principals and available cycle balance
- **Canister top-up issues**: Verify canister ID correctness and cycle availability
- **Approval problems**: Check spender principal format and expiration settings
- **Network errors**: Verify dfx network configuration and connectivity
- **Subaccount issues**: Ensure subaccount format is correct (32-byte hex)
- **Faucet redemption failures**: Verify coupon code validity and redemption limits
:::

## dfx 0.25.0 Compatibility

This interface is fully compatible with dfx 0.25.0 and includes:
- **Updated command syntax** for all cycle operations
- **Enhanced error messages** with detailed feedback
- **Improved network handling** for multiple network types
- **Better subaccount support** across all operations
- **Optimized performance** for faster operation execution

## Additional Resources

- [DFX Cycles Commands Reference](https://internetcomputer.org/docs/current/references/cli-reference/dfx-cycles/)
- [Understanding Cycles on the Internet Computer](https://internetcomputer.org/docs/current/concepts/tokens-cycles)
- [ICP to Cycles Conversion Guide](https://internetcomputer.org/docs/current/developer-docs/build/project-setup/cycles)
- [Cycle Wallet and Management](https://internetcomputer.org/docs/current/developer-docs/build/project-setup/manage-cycles)
- [Cycles Economy Whitepaper](https://internetcomputer.org/whitepaper.pdf)

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