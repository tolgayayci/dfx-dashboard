# Canisters

The Canisters page in the DFX Dashboard provides a centralized interface for viewing and managing all your canisters across different projects. This powerful tool allows you to interact with and monitor your Internet Computer canisters efficiently.

## Overview

<div class="image-border">

![Canisters Overview](/features/canisters/canisters-overview.png)

</div>

The Canisters page displays:
- A table listing all canisters from all your projects
- Search functionality to find specific canisters
- Options to perform various actions on each canister

## Canister List Table

The table includes the following columns:
1. **Canister Name**: The name of the canister
2. **Type**: The canister type (e.g., Motoko, Assets)
3. **Project Name**: The project to which the canister belongs
4. **Action**: A "Canister Actions" button for each canister

You can adjust the number of rows displayed per page using the dropdown at the bottom left of the table.

:::tip
Use the table's sorting functionality to organize canisters by name, type, or project for easier management, especially when dealing with a large number of canisters.
:::

## Searching Canisters

Use the "Search Between Canisters" field at the top of the page to filter canisters by name, type, or project.

:::tip
When searching for a specific canister, try using partial names or project names if you're unsure of the exact spelling. The search function will match partial strings as well.
:::

## Canister Actions

Clicking the "Canister Actions" button for a specific canister opens a detailed view with several options:

<div class="image-border">

![Canister Actions](/features/canisters/canister-actions.png)

</div>

1. **Top Up**: Add cycles to the canister
2. **Status**: View the current status of the canister
3. **Config**: See and edit the canister's configuration
4. **Remove**: Delete the canister (use with caution)

:::warning
Exercise extreme caution when using the "Remove" action. Deleting a canister is irreversible and will permanently remove all associated data and code. Always ensure you have backups before proceeding with removal.
:::

### Command Interface

The command interface provides a powerful way to interact with your canisters directly from the dashboard. It allows you to:

- Select a main command
- Choose from command-specific options and flags
- Specify arguments for the command
- Execute the command directly from the dashboard

#### Available Main Commands:

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

When you select a main command, the interface will update to show only the relevant options and flags for that specific command. For example:

- If you select `dfx canister call`, you might see options like:
  - `--query`: Perform a query call
  - `--update`: Perform an update call
  - `--async`: Make the call asynchronous

- If you choose `dfx canister create`, the options might include:
  - `--all`: Create canisters for all declarations in the dfx.json file
  - `--specified-id`: Specify a canister ID to create

- For `dfx canister status`, you might see:
  - `--all`: Show status for all canisters
  - `--controller`: Show only the controller(s) of the canister

The interface dynamically adjusts to provide only the relevant options for each command, simplifying the process of constructing complex canister interactions.

#### Common Options

Some options are available for multiple commands:

- `--network`: Specify a network for the command (e.g., local, ic)
- `--verbose`: Increase command output verbosity
- `--quiet`: Decrease command output verbosity
- `--help`: Display help information for the specific command

Click **"Run Command"** to execute the constructed command.

:::tip
Take time to explore different commands and their options. This can help you discover powerful ways to manage and interact with your canisters that you might not have known about before.
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

- Regularly check the status of your canisters to ensure they have sufficient cycles.
- Use descriptive naming conventions for your canisters to easily identify their purpose.
- Implement a systematic backup strategy for critical canister data and configurations.
- Utilize the command interface for quick actions, but always verify the results.
- Keep your local dfx version in sync with the one used by your canisters to avoid compatibility issues.
:::

## Troubleshooting

:::warning
Watch out for these common issues:

- If a canister is not responding, check its status and ensure it has enough cycles.
- For unexpected command results, review the command output carefully and adjust parameters as needed.
- If you can't find a canister, ensure you're looking in the correct project and that the canister hasn't been removed.
- When encountering errors, check the DFX Dashboard logs and canister logs for more detailed information.
- If you're experiencing persistent issues with a canister, consider redeploying it as a last resort, but be aware this will reset its state.
:::

## Additional Resources

- [Internet Computer Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/build/cdks/)
- [DFX Canister Management Commands](https://internetcomputer.org/docs/current/references/cli-reference/dfx-canister/)
- [Understanding Cycles and Computation in the Internet Computer](https://internetcomputer.org/docs/current/concepts/computation-and-storage-costs/)

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