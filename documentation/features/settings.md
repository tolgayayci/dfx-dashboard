# Settings

The Settings page allows you to customize your DFX Dashboard environment and manage important DFX-related configurations.

## Overview

<div class="image-border">

![Settings Overview](/features/settings/settings-overview.png)

</div>

The Settings page provides options to:
- Choose between **bundled DFX** and **system DFX**
- **Configure** various DFX **environment variables**

## DFX Version Selection

At the top of the Settings page, you'll find an option to toggle between:
- **Use Bundled DFX**: Utilizes **dfx v0.22.0** that **comes packaged with the DFX Dashboard app**.
- **System**: Uses the DFX version installed on your system.

:::tip
The bundled DFX option allows you to use the Dashboard even if dfx is not installed on your system, which can be useful for quick setups or testing.
:::

:::info
The current **system dfx** version is displayed next to the toggle (e.g., "vdfx 0.21.0").
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

When you update environment variables through the DFX Dashboard, it attempts to add or modify these variables in your shell profile files. The files checked depend on your operating system:

- **macOS and Linux**:
  - `~/.bashrc`
  - `~/.bash_profile`
  - `~/.zshrc`
  - `~/.profile`
- **Windows**: Windows typically doesn't use profile files in the same way. Environment variables are usually set through the System Properties dialog.

:::info
The Dashboard will attempt to update the first existing file it finds in the order listed above.
:::

## Best Practices

:::tip
Optimize your DFX environment configuration:

- Regularly check your DFX version to ensure compatibility with your projects.
- Keep a record of any custom paths or configurations you set.
- Ensure all team members use consistent environment settings for collaborative projects.
- Use version control for your project's dfx.json file to maintain consistency across different development environments.
- Regularly review and clean up unused or outdated environment variables to prevent conflicts.
:::

## Troubleshooting

:::warning
Watch out for these common issues:

- If changes don't take effect immediately, try restarting your terminal or the DFX Dashboard.
- For issues with specific canister operations, verify that `CANISTER_ID` and `CANISTER_CANDID_PATH` are set correctly.
- If you encounter unexpected behavior after changing `DFX_VERSION`, ensure it's compatible with your project requirements.
- If environment variables are not being recognized, check the appropriate profile file to ensure the changes were saved correctly.
- For Windows users, ensure environment variables are properly set in the System Properties if they're not taking effect.
:::

## Additional Resources

- [DFX Configuration Documentation](https://internetcomputer.org/docs/current/references/dfx-json-reference/)
- [Environment Variables in DFX](https://internetcomputer.org/docs/current/references/environment-variables)
- [Troubleshooting DFX Issues](https://internetcomputer.org/docs/current/developer-docs/setup/troubleshoot)
- [DFX Version Management](https://internetcomputer.org/docs/current/developer-docs/setup/manage-dfx-versions)

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