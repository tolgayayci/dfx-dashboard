# Settings

The Settings page allows you to customize your DFX Dashboard environment and manage important DFX-related configurations, including automated shell completion setup and comprehensive cache management.

## Overview

<div class="image-border">

![Settings Overview](/features/settings/settings-overview.png)

</div>

The Settings page is organized into multiple tabs:
- **General**: DFX version selection and environment variables
- **Shell Completion**: Automated dfx command completion setup
- **Cache**: Manage DFX version cache and installations

### General Tab Features:
- Choose between **bundled DFX** and **system DFX**
- **Configure** various DFX **environment variables**

### Shell Completion Tab Features:
- **Set up shell completion** for dfx commands automatically
- **Cross-platform support** for bash, zsh, and fish

### Cache Tab Features:
- **Version Management**: Install and remove DFX versions
- **Cache Monitoring**: View installed versions and disk usage
- **Bulk Operations**: Clear entire cache or selective removal

## DFX Version Selection

At the top of the Settings page, you'll find an option to toggle between:
- **Use Bundled DFX**: Utilizes **dfx v0.25.0** that **comes packaged with the DFX Dashboard app**.
- **System**: Uses the DFX version installed on your system.

:::tip
The bundled DFX option allows you to use the Dashboard even if dfx is not installed on your system, which can be useful for quick setups or testing.
:::

:::info
The current **system dfx** version is displayed next to the toggle (e.g., "vdfx 0.25.0").
:::

## Shell Completion Setup

<div class="image-border">

![Shell Completion](/features/settings/shell-completion.png)

</div>

The Shell Completion section provides automated setup for dfx command completion in your terminal:

### Automatic Setup

The dashboard automatically detects your shell environment and provides:
- **Shell Detection**: Identifies your current shell (bash, zsh, fish)
- **Support Status**: Shows whether auto-setup is supported for your shell
- **One-Click Setup**: Automatically configures completion for supported shells

### Supported Shells

- **Bash**: Auto-configures completion in `~/.bashrc` or `~/.bash_profile`
- **Zsh**: Auto-configures completion in `~/.zshrc`
- **Fish**: Auto-configures completion in fish completion directory

### Manual Setup Instructions

For unsupported shells or manual configuration preference:
- **Copy-to-clipboard commands** for manual setup
- **Shell-specific instructions** with proper syntax
- **External documentation links** for advanced configuration

### Features

- **Duplicate Prevention**: Checks for existing completion setup before adding
- **Cross-Platform Support**: Works on macOS, Linux, and Windows (WSL)
- **Error Handling**: Provides clear feedback for setup issues
- **Verification**: Confirms successful completion setup

:::tip
Shell completion significantly improves your dfx command-line experience by providing tab completion for commands, options, and canister names.
:::

## Environment Variables

The Settings page allows you to view and update several important DFX environment variables:

1. `CANISTER_CANDID_PATH`: Path to the Candid description file for canisters listed as dependencies.
2. `CANISTER_ID`: Reference to canister identifiers for each canister in your project.
3. `DFX_CONFIG_ROOT`: Specifies a custom location for storing `.cache` and `.config` subdirectories.
4. `DFX_INSTALLATION_ROOT`: Sets a custom location for the `dfx` binary.
5. `DFX_VERSION`: Identifies a specific version of the SDK to install.
6. `DFX_MOC_PATH`: Specifies a custom version of the Motoko compiler.
7. `DFX_WARNING`: Disables specific DFX warnings.
8. `DFX_DISABLE_QUERY_VERIFICATION`: Disables verification of replica-signed queries when set.

To update any of these variables:
1. Click the **Update** button next to the variable you wish to modify.
2. Enter the new value in the prompt that appears.
3. Confirm the change.

:::warning
These changes affect your DFX environment. Ensure you understand the implications before making changes, as incorrect settings can impact your project's functionality.
:::

:::tip
When setting paths in environment variables like `CANISTER_CANDID_PATH` or `DFX_INSTALLATION_ROOT`, use absolute paths to avoid any ambiguity across different working directories.
:::

## Profile File Paths

When you update environment variables or set up shell completion through the DFX Dashboard, it attempts to add or modify these configurations in your shell profile files. The files checked depend on your operating system:

- **macOS and Linux**:
  - `~/.bashrc`
  - `~/.bash_profile` (macOS fallback)
  - `~/.zshrc`
  - `~/.profile`
  - Fish completion directory (`~/.config/fish/completions/`)
- **Windows**: Windows typically doesn't use profile files in the same way. Environment variables are usually set through the System Properties dialog.

:::info
The Dashboard will attempt to update the first existing file it finds in the order listed above, or create the appropriate file if none exist.
:::

## Best Practices

:::tip
Optimize your DFX environment configuration:

- **Enable shell completion** for improved command-line productivity
- Regularly check your DFX version to ensure compatibility with your projects (0.25.0+ recommended)
- Keep a record of any custom paths or configurations you set
- Ensure all team members use consistent environment settings for collaborative projects
- Use version control for your project's dfx.json file to maintain consistency across different development environments
- Regularly review and clean up unused or outdated environment variables to prevent conflicts
- Test shell completion setup in a new terminal session to verify it's working correctly
:::

## Troubleshooting

:::warning
Watch out for these common issues:

- **Changes don't take effect**: Try restarting your terminal or the DFX Dashboard
- **Shell completion not working**: Open a new terminal session or run `source ~/.bashrc` (or appropriate profile file)
- **Canister operation issues**: Verify that `CANISTER_ID` and `CANISTER_CANDID_PATH` are set correctly
- **Version compatibility problems**: Ensure dfx version is 0.25.0+ for full feature support
- **Environment variables not recognized**: Check the appropriate profile file to ensure changes were saved correctly
- **Shell detection issues**: Manually verify your shell with `echo $SHELL` command
- **Permission errors during setup**: Ensure you have write permissions to your home directory and profile files
- **Windows WSL issues**: Ensure you're running the dashboard within the WSL environment for proper shell detection
:::

## Cache Management Tab

<div class="image-border">

![Cache Management](/features/settings/cache-management.png)

</div>

The Cache tab provides comprehensive management of your DFX version cache, allowing you to install, remove, and monitor different DFX versions.

### Cache Overview

<div class="image-border">

![Cache Overview](/features/settings/cache-overview.png)

</div>

View important cache information:
- **Cache Location**: Shows the path where DFX versions are stored
- **Total Cache Size**: Displays disk space used by all cached versions
- **Active Version**: Indicates which DFX version is currently in use
- **Available Versions**: Lists all installed DFX versions

### Version Management

<div class="image-border">

![Version Management](/features/settings/version-management.png)

</div>

Manage your DFX version installations:

#### Install New Versions
1. **Version Input**: Enter the DFX version to install (e.g., "0.25.0")
2. **Validation**: Ensures version format is correct
3. **Install Button**: Downloads and installs the specified version
4. **Progress Tracking**: Shows installation progress and status

#### Remove Versions
1. **Version List**: View all installed versions in a table
2. **Delete Action**: Click the trash icon to remove a version
3. **Confirmation**: Confirm deletion to prevent accidental removal
4. **Space Recovery**: Frees up disk space after removal

#### Version Information
Each version entry displays:
- **Version Number**: The DFX version identifier
- **Installation Date**: When the version was installed
- **File Size**: Disk space used by this version
- **Status**: Active, available, or installing
- **Actions**: Install or delete buttons

### Cache Operations

<div class="image-border">

![Cache Operations](/features/settings/cache-operations.png)

</div>

Perform bulk cache operations:

#### Clear All Cache
1. **Clear Cache Button**: Removes all cached DFX versions
2. **Confirmation Dialog**: Prevents accidental deletion
3. **Space Recovery**: Frees up all cache disk space
4. **Fresh Start**: Useful for troubleshooting or cleanup

#### Refresh Cache
1. **Refresh Button**: Updates the cache information
2. **Rescan**: Detects newly installed or removed versions
3. **Status Update**: Updates version statuses and sizes

### Cache Best Practices

:::tip
Optimize your DFX cache management:

- **Regular Cleanup**: Remove unused versions to save disk space
- **Version Strategy**: Keep only the versions you actively use
- **Backup Important Versions**: Keep stable versions for production work
- **Monitor Disk Usage**: Check cache size regularly
- **Update Regularly**: Install latest versions for new features
- **Test Before Cleanup**: Ensure projects work with remaining versions
:::

### Cache Troubleshooting

:::warning
Common cache issues and solutions:

- **Installation Failures**: Check internet connection and disk space
- **Permission Errors**: Ensure write access to cache directory
- **Corrupted Versions**: Delete and reinstall problematic versions
- **Disk Space Issues**: Clear unused versions to free space
- **Version Not Found**: Verify version number format and availability
- **Cache Location Issues**: Check if cache directory is accessible
- **Network Problems**: Verify internet connection for downloads
:::

## Additional Resources

- [DFX Configuration Documentation](https://internetcomputer.org/docs/current/references/dfx-json-reference/)
- [Environment Variables in DFX](https://internetcomputer.org/docs/current/references/environment-variables)
- [DFX Shell Completion Documentation](https://internetcomputer.org/docs/current/references/cli-reference/dfx-completion/)
- [Troubleshooting DFX Issues](https://internetcomputer.org/docs/current/developer-docs/setup/troubleshoot)
- [DFX Version Management](https://internetcomputer.org/docs/current/developer-docs/setup/manage-dfx-versions)
- [DFX Cache Management](https://internetcomputer.org/docs/current/developer-docs/setup/manage-dfx-versions#managing-dfx-cache)

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