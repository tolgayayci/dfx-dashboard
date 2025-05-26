# Canisters

The Canisters page in the DFX Dashboard provides a centralized interface for viewing and managing all your canisters across different projects, including both user canisters and Network Nervous System (NNS) canisters. This powerful tool allows you to interact with and monitor your Internet Computer canisters efficiently with full dfx 0.25.0 compatibility.

## Overview

<div class="image-border">

![Canisters Overview](/features/canisters/canisters-overview.png)

</div>

The Canisters page displays:
- A unified table listing all user and NNS canisters from all your projects
- Advanced filtering options to find specific canisters by type, network, or search terms
- Visual indicators to distinguish between user and NNS canisters
- Options to perform various actions on each canister

## Canister Types

The dashboard now supports two types of canisters:

### User Canisters
- Canisters deployed by you in your projects
- Displayed with standard project information
- Full management capabilities available

### NNS Canisters
- Network Nervous System canisters (governance, ledger, etc.)
- Displayed with special NNS badges and indicators
- Read-only access with query capabilities
- Available on both local and IC networks

## Advanced Filtering

The enhanced filtering system allows you to efficiently manage large numbers of canisters:

### Filter by Type
- **All Canisters**: Show both user and NNS canisters
- **User Canisters**: Show only your deployed canisters
- **NNS Canisters**: Show only Network Nervous System canisters

### Filter by Network
- **Local**: Canisters on your local dfx network
- **IC**: Canisters on the Internet Computer mainnet
- **Custom**: Canisters on custom networks you've configured

### Search Functionality
Use the search field to filter canisters by:
- Canister name
- Canister ID
- Project name
- Network name

## Canister List Table

The table includes the following columns:
1. **Canister Name**: The name of the canister with type indicators
2. **Type**: Visual badges showing "User" or "NNS" canister types
3. **Network**: The network where the canister is deployed
4. **Project Name**: The project to which the canister belongs (for user canisters)
5. **Action**: A "Canister Actions" button for each canister

You can adjust the number of rows displayed per page using the dropdown at the bottom left of the table.

:::tip
Use the table's sorting functionality to organize canisters by name, type, network, or project for easier management, especially when dealing with a large number of canisters across multiple networks.
:::

## Canister Detail Pages

Clicking on any canister opens a comprehensive detail page with multiple tabs:

### Overview Tab
- Basic canister information
- Controller details
- Network and project information
- Quick action buttons

### Methods Tab (User Canisters)
- Available canister methods
- Method calling interface
- Input/output parameter handling

### NNS Query Tab (NNS Canisters)
- Specialized interface for NNS canister interactions
- Pre-configured method signatures
- Query-only operations for safety

### Metadata Tab
- Comprehensive metadata display using `dfx canister metadata`
- Controller information
- Module hash and settings
- Canister configuration details
- Memory and cycle information

## Canister Actions

Clicking the "Canister Actions" button for a specific canister opens a detailed view with several options:

<div class="image-border">

![Canister Actions](/features/canisters/canister-actions.png)

</div>

### Available Actions:
1. **Top Up**: Add cycles to the canister
2. **Status**: View the current status of the canister
3. **Metadata**: View comprehensive canister metadata
4. **Config**: See and edit the canister's configuration (user canisters only)
5. **Remove**: Delete the canister (user canisters only, use with caution)

:::warning
Exercise extreme caution when using the "Remove" action. Deleting a canister is irreversible and will permanently remove all associated data and code. Always ensure you have backups before proceeding with removal.
:::

### Command Interface (dfx 0.25.0 Compatible)

The command interface provides a powerful way to interact with your canisters directly from the dashboard using the latest dfx 0.25.0 commands. It allows you to:

- Select from updated dfx 0.25.0 commands
- Choose from command-specific options and flags
- Specify arguments for the command
- Execute the command directly from the dashboard

#### Available Main Commands (Updated for dfx 0.25.0):

- `dfx canister call`
- `dfx canister create`
- `dfx canister delete`
- `dfx canister deposit-cycles`
- `dfx canister id`
- `dfx canister info`
- `dfx canister install`
- `dfx canister metadata`
- `dfx canister request-status`
- `dfx canister send`
- `dfx canister sign`
- `dfx canister start`
- `dfx canister status`
- `dfx canister stop`
- `dfx canister uninstall-code`
- `dfx canister update-settings`
- `dfx canister logs`
- `dfx canister url`

#### Dynamic Command Options

When you select a main command, the interface will update to show only the relevant options and flags for that specific command, updated for dfx 0.25.0 compatibility. For example:

- If you select `dfx canister call`, you might see options like:
  - `--query`: Perform a query call
  - `--update`: Perform an update call
  - `--async`: Make the call asynchronous

- If you choose `dfx canister create`, the options might include:
  - `--all`: Create canisters for all declarations in the dfx.json file
  - `--specified-id`: Specify a canister ID to create

- For `dfx canister metadata`, you can specify:
  - Metadata type (candid:service, candid:args, etc.)
  - Network selection
  - Output format options

The interface dynamically adjusts to provide only the relevant options for each command, simplifying the process of constructing complex canister interactions.

#### Common Options

Some options are available for multiple commands:

- `--network`: Specify a network for the command (e.g., local, ic)
- `--verbose`: Increase command output verbosity
- `--quiet`: Decrease command output verbosity
- `--help`: Display help information for the specific command

Click **"Run Command"** to execute the constructed command.

:::tip
Take time to explore different commands and their options. The updated dfx 0.25.0 interface provides enhanced functionality for managing and interacting with your canisters.
:::

:::warning
Be cautious when using commands that modify canister state or configuration, especially in production environments. Always double-check your command construction before execution.
:::

### Command Output

<div class="image-border">

![Command Output](/features/canisters/command-output.png)

</div>

After running a command, a modal will display:
- The exact command that was executed
- The output or result of the command
- Error messages if the command failed

This allows you to see the effect of your actions and troubleshoot if necessary.

### Canister Status

<div class="image-border">

![Canister Status](/features/canisters/canister-status.png)

</div>

The status modal shows:
- Whether the active identity is the controller
- Canister status (e.g., "Running")
- Controller information
- Memory and compute allocations
- Cycle balance and limits
- Other technical details like module hash and query statistics

:::tip
Regularly check your canister's cycle balance and memory usage. Set up alerts or reminders to top up cycles before they run too low, ensuring uninterrupted operation of your canisters.
:::

### Canister Configuration

<div class="image-border">

![Canister Configuration](/features/canisters/canister-config.png)

</div>

The configuration modal displays:
- Canister name
- Dependencies
- Source files
- Canister type
- Workspace

You can edit this configuration by clicking the "Edit Canister Config" button.

:::warning
Modifying canister configurations can have significant impacts on your project. Always double-check your changes and consider testing in a development environment before applying changes to production canisters.
:::

## Best Practices

:::tip
Optimize your canister management workflow with these tips:

- Use the filtering options to quickly find specific canisters in large deployments.
- Regularly check the status of your canisters to ensure they have sufficient cycles.
- Use descriptive naming conventions for your canisters to easily identify their purpose.
- Leverage the NNS canister integration to monitor network-level operations.
- Implement a systematic backup strategy for critical canister data and configurations.
- Utilize the command interface for quick actions, but always verify the results.
- Keep your local dfx version at 0.25.0 or newer for full compatibility.
- Use the metadata tab to understand canister configurations and dependencies.
:::

## Troubleshooting

:::warning
Watch out for these common issues:

- If a canister is not responding, check its status and ensure it has enough cycles.
- For unexpected command results, review the command output carefully and adjust parameters as needed.
- If you can't find a canister, use the filtering options to narrow down your search.
- When encountering errors with NNS canisters, ensure you're using query operations only.
- If you're experiencing persistent issues with a canister, check the metadata tab for configuration problems.
- Ensure you're using dfx 0.25.0 or newer for full feature compatibility.
- If filtering isn't working as expected, try clearing search terms and resetting filters.
:::

## Additional Resources

- [Internet Computer Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/build/cdks/)
- [DFX Canister Management Commands](https://internetcomputer.org/docs/current/references/cli-reference/dfx-canister/)
- [Understanding Cycles and Computation in the Internet Computer](https://internetcomputer.org/docs/current/concepts/computation-and-storage-costs/)
- [Network Nervous System (NNS) Documentation](https://internetcomputer.org/docs/current/concepts/governance/network-nervous-system-nns/)

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