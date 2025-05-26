# Quick Start Guide

Welcome to the DFX Dashboard, your all-in-one tool for managing Internet Computer projects with full dfx 0.25.0 compatibility. This guide will walk you through the essential features to help you start developing quickly and efficiently with our latest Milestone 1 enhancements.

## Installation

Before diving into the features, ensure you have the DFX Dashboard installed on your system. For detailed installation instructions, please refer to our [Installation Guide](/getting-started/installation).

:::tip
Make sure you have the latest version of the DFX Dashboard installed to access all features including NNS canister support, advanced filtering, and shell completion.
:::

## Dashboard Overview

Upon launching the DFX Dashboard, you'll see a sidebar with the following main sections:

- [Projects](/features/projects) - Unified project management
- [Canisters](/features/canisters) - User and NNS canister management with advanced filtering
- [Identities](/features/identities) - Identity management and switching
- [Cycles](/features/cycles) - Professional cycle operations with tabbed interface
- [Network](/features/network) - Network configuration management
- [Logs](/features/logs) - Command history and execution logs
- [Settings](/features/settings) - Environment configuration and shell completion setup
- [About](/features/about) - Version information and resources

The top right corner shows your active identity and provides options for refreshing, closing, and adjusting display settings.

:::tip
Take a moment to familiarize yourself with the layout. The sidebar is your main navigation tool for accessing different features of the Dashboard.
:::

## 1. Setting Up Your Environment

### Configuring Settings and Shell Completion

1. Navigate to the [Settings](/features/settings) page.
2. Choose between bundled DFX (v0.25.0) and system DFX.
3. **Set up shell completion** for enhanced command-line productivity:
   - The dashboard automatically detects your shell (bash, zsh, fish)
   - Use one-click setup for supported shells
   - Copy manual setup commands for unsupported shells
4. Configure important environment variables like `CANISTER_CANDID_PATH` and `DFX_VERSION`.

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

## 4. Managing Identities

1. Visit the [Identities](/features/identities) page.
2. Click **Create New Identity** to add a new identity.
3. Choose between creating a new identity, importing an existing one, or using Internet Identity.
4. Use the **Select** button to set an active identity for your operations.

:::tip
Use different identities for development and production environments to enhance security, especially when working with both user and NNS canisters.
:::

## 5. Professional Cycle Management

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

## 6. Configuring Networks

1. Access the [Network](/features/network) page to view and edit your `networks.json` configuration.
2. Modify the JSON directly in the editor to add or change network settings.
3. Define custom networks for different development stages or environments.

:::tip
Use descriptive names for custom networks to easily identify their purpose within the Dashboard and leverage network filtering in the canisters page.
:::

## 7. Reviewing Logs

1. Check the [Logs](/features/logs) page for a history of commands executed in the Dashboard.
2. Use the action buttons to:
   - View command outputs
   - Re-execute commands
   - Copy command text

:::tip
Utilize the search and filter options to quickly find specific commands in your history, especially useful with the new dfx 0.25.0 command syntax.
:::

## 8. Checking Dashboard Information

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
Optimize your DFX Dashboard experience with Milestone 1 features:

- **Enable shell completion** in Settings for improved command-line productivity
- Start by creating a small test project to familiarize yourself with the enhanced workflow
- **Explore NNS canisters** to understand Internet Computer network operations
- **Use advanced filtering** in the canisters page to manage large deployments efficiently
- **Leverage the professional cycles interface** with subaccounts and approvals for better organization
- Regularly check for updates to the DFX Dashboard and related tools (ensure dfx 0.25.0+)
- Use the enhanced Cycles page to monitor and manage your resources with precision
- Leverage the Logs page to track and repeat common operations
- **Test filtering and search** capabilities to find canisters quickly
- Regularly review and update your network configurations
- Backup important project data and configurations regularly
- Explore each section of the Dashboard to discover new Milestone 1 features
:::

## Troubleshooting Common Issues

:::warning
Watch out for these common pitfalls:

- **dfx version compatibility**: Ensure you're using dfx 0.25.0+ for full feature support
- **Shell completion not working**: Open a new terminal session after setup
- **NNS canister errors**: Ensure you're using query operations only for NNS canisters
- **Filtering issues**: Try clearing search terms and resetting filters if results seem incorrect
- If commands fail, check your active identity and ensure it has the necessary permissions
- For network-related issues, verify your internet connection and firewall settings
- If canisters aren't deploying, check your cycle balance and network configuration
- **Subaccount format errors**: Ensure subaccounts are properly formatted (32-byte hex)
- For unexpected behavior, try refreshing the Dashboard or restarting the application
- Always keep your DFX and DFXVM versions up to date to avoid compatibility issues
:::

## New in Milestone 1

🎉 **Latest enhancements include:**

- **NNS Canister Integration**: Query and interact with Network Nervous System canisters
- **Advanced Filtering**: Filter canisters by type, network, and search terms
- **Professional Cycles Interface**: Tabbed interface with all 6 dfx cycle operations
- **Shell Completion Setup**: One-click dfx command completion configuration
- **dfx 0.25.0 Compatibility**: Full support for the latest dfx features
- **Enhanced Metadata Display**: Comprehensive canister information and configuration
- **Improved Error Handling**: Better feedback and recovery guidance

## Additional Resources

- [DFINITY Developer Documentation](https://internetcomputer.org/docs/current/developer-docs/)
- [Internet Computer Forum](https://forum.dfinity.org/)
- [DFX CLI Reference](https://internetcomputer.org/docs/current/references/cli-reference/)
- [DFX Cycles Commands](https://internetcomputer.org/docs/current/references/cli-reference/dfx-cycles/)
- [NNS Documentation](https://internetcomputer.org/docs/current/concepts/governance/network-nervous-system-nns/)
- [Candid Documentation](https://internetcomputer.org/docs/current/developer-docs/build/candid/candid-concepts)

Remember, the DFX Dashboard is designed to streamline your Internet Computer development workflow with professional-grade features. Don't hesitate to explore each section in depth as you become more comfortable with the tool, especially the new enhancements.

For more detailed information on each feature, click the links provided in the guide.

<style>
.vp-doc h2 {
    border-top: 1px solid #eaecef;
    padding-top: 24px;
    margin-top: 24px;
}
</style>