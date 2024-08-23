---
title: Canisters Overview
sidebar_label: Canisters
---

# Canisters
*Manage and interact with your Internet Computer canisters across all projects.*

The Canisters page in the DFX Dashboard provides a centralized interface for viewing and managing all your canisters across different projects.

## Overview
*Your canister command center.*

![Canisters Overview](/img/features/canisters/canisters-overview.png)

The Canisters page displays:
- A table listing all canisters from all your projects
- Search functionality to find specific canisters
- Options to perform various actions on each canister

---

## Canister List Table
*At-a-glance view of all your canisters.*

The table includes the following columns:
1. **Canister Name**: The name of the canister
2. **Type**: The canister type (e.g., Motoko, Assets)
3. **Project Name**: The project to which the canister belongs
4. **Action**: A "Canister Actions" button for each canister

You can adjust the number of rows displayed per page using the dropdown at the bottom left of the table.

---

## Searching Canisters
*Quickly find the canister you need.*

Use the "Search Between Canisters" field at the top of the page to filter canisters by name, type, or project.

---

## Canister Actions
*Interact with and manage individual canisters.*

Clicking the "Canister Actions" button for a specific canister opens a detailed view with several options:

![Canister Actions](/img/features/canisters/canister-actions.png)

1. **Top Up**: Add cycles to the canister
2. **Status**: View the current status of the canister
3. **Config**: See and edit the canister's configuration
4. **Remove**: Delete the canister (use with caution)

### Command Interface
*Visually create and execute canister commands.*

The command interface allows you to:
- Select a command (e.g., "dfx canister call")
- Choose from various options and flags
- Specify arguments for the command
- Execute the command directly from the dashboard

#### Command Options
- **--verbose**: Increase command output verbosity
- **--playground**: Use the Motoko playground
- **--quiet**: Decrease command output verbosity
- **--async**: Make the call asynchronous
- **--ic**: Use the IC mainnet
- **--query**: Perform a query call
- **--update**: Perform an update call
- **--always-assist**: Always use command assistance
- **--network**: Specify a network for the command

Click "Run Command" to execute the constructed command.

### Command Output
*View the results of your canister interactions.*

![Command Output](/img/features/canisters/command-output.png)

After running a command, a modal will display:
- The exact command that was executed
- The output or result of the command

This allows you to see the effect of your actions and troubleshoot if necessary.

### Canister Status
*Get detailed information about your canister's current state.*

![Canister Status](/img/features/canisters/canister-status.png)

The status modal shows:
- Whether the active identity is the controller
- Canister status (e.g., "Running")
- Controller information
- Memory and compute allocations
- Cycle balance and limits
- Other technical details like module hash and query statistics

This information is crucial for monitoring your canister's health and resource usage.

### Canister Configuration
*View and edit your canister's settings.*

![Canister Configuration](/img/features/canisters/canister-config.png)

The configuration modal displays:
- Canister name
- Dependencies
- Source files
- Canister type
- Workspace

You can edit this configuration by clicking the "Edit Canister Config" button.

---

## Best Practices
*Optimize your canister management workflow.*

- Regularly check the status of your canisters to ensure they have sufficient cycles.
- Use the search function to quickly locate canisters in large projects.
- Be cautious when using the remove function – ensure you have backups if needed.
- Utilize the command interface for quick actions without leaving the dashboard.

---

## Troubleshooting
*Common issues and their solutions.*

- If a canister is not responding, check its status and ensure it has enough cycles.
- For unexpected command results, review the command output carefully and adjust parameters as needed.
- If you can't find a canister, ensure you're looking in the correct project and that the canister hasn't been removed.

---