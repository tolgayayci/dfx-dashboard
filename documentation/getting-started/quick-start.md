# Quick Start Guide

Welcome to the DFX Dashboard, your all-in-one tool for managing Internet Computer projects with full dfx 0.25.0 compatibility. This guide will walk you through the essential features to help you start developing quickly and efficiently with our latest v0.3.0 enhancements.

## Installation

Before diving into the features, ensure you have the DFX Dashboard installed on your system. For detailed installation instructions, please refer to our [Installation Guide](/getting-started/installation).

:::tip
Make sure you have DFX Dashboard v0.3.0 or later installed to access all features including wallet management, ledger operations, cache management, NNS canister support, advanced filtering, and shell completion.
:::

## Dashboard Overview

Upon launching the DFX Dashboard, you'll see a sidebar with the following main sections:

- [Projects](/features/projects) - Unified project management
- [Canisters](/features/canisters) - User and NNS canister management with advanced filtering
- [Identities & Ledger](/features/identities) - Identity management with integrated ICP operations
- [Wallet](/features/wallet) - Comprehensive wallet management with controllers and custodians
- [Cycles](/features/cycles) - Professional cycle operations with tabbed interface
- [Network](/features/network) - Network configuration management
- [Logs](/features/logs) - Command history and execution logs
- [Settings & Cache](/features/settings) - Environment configuration, shell completion, and cache management
- [About](/features/about) - Version information and resources

The top right corner shows your active identity and provides options for refreshing, closing, and adjusting display settings.

:::tip
Take a moment to familiarize yourself with the layout. The sidebar is your main navigation tool for accessing different features of the Dashboard.
:::

## 1. Setting Up Your Environment

### Configuring Settings, Shell Completion, and Cache Management

1. Navigate to the [Settings & Cache](/features/settings) page.
2. **General Tab**: Choose between bundled DFX (v0.25.0) and system DFX.
3. **Shell Completion Tab**: Set up shell completion for enhanced command-line productivity:
   - The dashboard automatically detects your shell (bash, zsh, fish)
   - Use one-click setup for supported shells
   - Copy manual setup commands for unsupported shells
4. **Cache Tab**: Manage your DFX version installations:
   - View all installed DFX versions
   - Install new versions or remove unused ones
   - Monitor cache size and clear when needed
5. Configure important environment variables like `CANISTER_CANDID_PATH` and `DFX_VERSION`.

:::tip
Enable shell completion to get tab completion for dfx commands, options, and canister names in your terminal.
:::

:::warning
Ensure you understand the implications of changing environment variables, as they can affect your project's functionality.
:::

## 2. Managing Projects

1. Go to the [Projects](/features/projects) page.
2. Click **Create New Project** to start a new Internet Computer project.
3. Fill in the project details:
   - Project name
   - Project path
   - Frontend type (e.g., React, Vue)
   - Canister type (e.g., Motoko, Rust)
4. Use the **Open With** button to launch your project in your preferred code editor.

:::tip
Use descriptive names for your projects to easily identify them in the dashboard and leverage the enhanced filtering capabilities.
:::

## 3. Working with Canisters (Enhanced with NNS Support)

1. Navigate to the [Canisters](/features/canisters) page to view all canisters across your projects.
2. **Use advanced filtering** to manage large numbers of canisters:
   - Filter by type: All, User, or NNS canisters
   - Filter by network: Local, IC, or custom networks
   - Search by name, ID, or project
3. **Explore NNS canisters** for network-level operations:
   - View governance, ledger, and other system canisters
   - Use specialized NNS query interfaces
   - Access read-only operations for safety
4. Use the **Canister Actions** button to:
   - View comprehensive metadata
   - Check canister status
   - Top up with cycles
   - Access method calling interfaces
5. Utilize the command interface for advanced canister operations with dfx 0.25.0 compatibility.

:::tip
Use the filtering options to quickly find specific canisters in large deployments, and explore NNS canisters to understand network-level operations.
:::

:::warning
Be cautious when performing actions like stopping or deleting canisters, as these can affect your application's functionality. NNS canisters are read-only for safety.
:::

## 4. Managing Identities and ICP Operations

1. Visit the [Identities & Ledger](/features/identities) page.
2. **Identities Tab**: Manage your digital identities:
   - Click **Create New Identity** to add a new identity
   - Choose between creating a new identity, importing an existing one, or using Internet Identity
   - Use the **Select** button to set an active identity for your operations
3. **Ledger Tab**: Handle ICP operations with three sub-tabs:
   - **Account Management**: View balances and convert principals to account IDs
   - **ICP Operations**: Transfer ICP, create canisters, top-up operations, and fabricate cycles
   - **Transaction History**: Monitor and track all your ICP transactions

:::tip
Use different identities for development and production environments to enhance security. The integrated ledger functionality allows you to manage ICP directly from the identity page.
:::

## 5. Comprehensive Wallet Management

1. Navigate to the [Wallet](/features/wallet) page for complete wallet operations:

### Controllers Tab
- **View and manage wallet controllers** with administrative access
- **Add new controllers** by entering principal IDs
- **Remove controllers** with confirmation dialogs

### Address Book Tab
- **Store frequently used addresses** locally in the app
- **Add, edit, and delete addresses** with descriptive labels
- **View DFX wallet addresses** alongside your local collection

### Custodians Tab
- **Authorize and deauthorize custodians** for limited wallet operations
- **View custodian permissions** and status
- **Manage custodian access** for collaborative workflows

### Cycle Transfers Tab
- **Send cycles** from your wallet to canisters or other wallets
- **Monitor wallet balance** with refresh functionality
- **Use amount validation** and unit conversion

### Wallet Settings Tab
- **Configure wallet name** and display settings
- **Upgrade wallet canister** to latest versions
- **View wallet information** and network status

### Faucet Tab
- **Redeem faucet coupons** for development cycles
- **Support for different networks** and coupon validation

:::tip
Use the address book to organize frequently used addresses, and maintain multiple controllers for wallet redundancy and security.
:::

:::warning
Be very careful when managing controllers and custodians. Always verify addresses before transfers and maintain secure backups of wallet credentials.
:::

## 6. Professional Cycle Management

1. On the [Cycles](/features/cycles) page, explore the new tabbed interface:

### Balance & Approvals Tab
- **Check cycle balances** for any principal or subaccount
- **Set up cycle approvals** for automated systems
- **Specify networks** and use precise balance options

### Transfers & Top-ups Tab
- **Transfer cycles** between accounts with subaccount support
- **Top up canisters** with precise amounts
- **Use memos** for transaction tracking

### Convert & Faucet Tab
- **Convert ICP to cycles** with subaccount support
- **Redeem faucet coupons** for development cycles
- **Monitor conversion rates** before proceeding

:::tip
Use subaccounts to organize cycles for different projects or purposes, and leverage cycle approvals for automated systems.
:::

:::warning
Always double-check recipient addresses and amounts when transferring cycles, as these transactions cannot be reversed.
:::

## 7. Configuring Networks

1. Access the [Network](/features/network) page to view and edit your `networks.json` configuration.
2. Modify the JSON directly in the editor to add or change network settings.
3. Define custom networks for different development stages or environments.

:::tip
Use descriptive names for custom networks to easily identify their purpose within the Dashboard and leverage network filtering in the canisters page.
:::

## 8. Reviewing Logs

1. Check the [Logs](/features/logs) page for a history of commands executed in the Dashboard.
2. Use the action buttons to:
   - View command outputs
   - Re-execute commands
   - Copy command text

:::tip
Utilize the search and filter options to quickly find specific commands in your history, especially useful with the new dfx 0.25.0 command syntax.
:::

## 9. Checking Dashboard Information

1. Visit the [About](/features/about) page for version information on:
   - DFX Dashboard
   - DFX (now supporting 0.25.0)
   - DFXVM
2. Use the provided links to:
   - Make feature requests
   - Report bugs
   - Review release notes

## Best Practices for Getting Started

:::tip
Optimize your DFX Dashboard experience with v0.3.0 features:

- **Enable shell completion** in Settings for improved command-line productivity
- **Use cache management** to efficiently manage DFX versions and save disk space
- Start by creating a small test project to familiarize yourself with the enhanced workflow
- **Explore NNS canisters** to understand Internet Computer network operations
- **Use advanced filtering** in the canisters page to manage large deployments efficiently
- **Leverage the professional cycles interface** with subaccounts and approvals for better organization
- **Utilize wallet management** for comprehensive controller and custodian administration
- **Explore ledger functionality** for ICP operations directly from the identity page
- **Organize addresses** in the wallet address book for quick access
- Regularly check for updates to the DFX Dashboard and related tools (ensure dfx 0.25.0+)
- Use the enhanced Cycles page to monitor and manage your resources with precision
- Leverage the Logs page to track and repeat common operations
- **Test filtering and search** capabilities to find canisters quickly
- **Monitor cache usage** and clean up unused DFX versions regularly
- Regularly review and update your network configurations
- Backup important project data, wallet credentials, and configurations regularly
- Explore each section of the Dashboard to discover new v0.3.0 features
:::

## Troubleshooting Common Issues

:::warning
Watch out for these common pitfalls:

- **dfx version compatibility**: Ensure you're using dfx 0.25.0+ for full feature support
- **Shell completion not working**: Open a new terminal session after setup
- **Cache installation failures**: Check internet connection and disk space before installing versions
- **Wallet controller issues**: Be very careful when managing controllers to avoid losing access
- **ICP transfer errors**: Always verify recipient addresses and ensure sufficient balance
- **NNS canister errors**: Ensure you're using query operations only for NNS canisters
- **Filtering issues**: Try clearing search terms and resetting filters if results seem incorrect
- **Address book corruption**: Regularly backup your local address book data
- If commands fail, check your active identity and ensure it has the necessary permissions
- For network-related issues, verify your internet connection and firewall settings
- If canisters aren't deploying, check your cycle balance and network configuration
- **Subaccount format errors**: Ensure subaccounts are properly formatted (32-byte hex)
- **Ledger network mismatch**: Ensure you're using the correct network for ICP operations
- For unexpected behavior, try refreshing the Dashboard or restarting the application
- Always keep your DFX and DFXVM versions up to date to avoid compatibility issues
:::

## New in v0.3.0

🎉 **Latest enhancements include:**

- **Comprehensive Wallet Management**: Full wallet operations with controllers, custodians, and address book
- **Integrated Ledger Functionality**: ICP operations directly from the identity page
- **Smart Cache Management**: DFX version installation, removal, and monitoring
- **Enhanced Identity Management**: Tabbed interface with ledger integration
- **Advanced Address Book**: Local storage with DFX wallet integration
- **Transaction History**: Real-time ICP transaction monitoring and tracking
- **Faucet Coupon Support**: Development cycle redemption functionality
- **Controller & Custodian Management**: Secure wallet access administration
- **ICP Operations Suite**: Transfer, canister creation, and top-up operations
- **Cache Optimization**: Disk space monitoring and cleanup tools

## Additional Resources

- [DFINITY Developer Documentation](https://internetcomputer.org/docs/current/developer-docs/)
- [Internet Computer Forum](https://forum.dfinity.org/)
- [DFX CLI Reference](https://internetcomputer.org/docs/current/references/cli-reference/)
- [DFX Cycles Commands](https://internetcomputer.org/docs/current/references/cli-reference/dfx-cycles/)
- [NNS Documentation](https://internetcomputer.org/docs/current/concepts/governance/network-nervous-system-nns/)
- [Candid Documentation](https://internetcomputer.org/docs/current/developer-docs/build/candid/candid-concepts)

Remember, the DFX Dashboard v0.3.0 is designed to streamline your Internet Computer development workflow with professional-grade features. Don't hesitate to explore each section in depth as you become more comfortable with the tool, especially the new wallet management, ledger operations, and cache management features.

For more detailed information on each feature, click the links provided in the guide.

<style>
.vp-doc h2 {
    border-top: 1px solid #eaecef;
    padding-top: 24px;
    margin-top: 24px;
}
</style>