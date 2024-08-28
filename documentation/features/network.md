# Network Configuration

The Network page in the DFX Dashboard allows you to view and edit the global `networks.json` file, which defines the networks available for your DFX projects.

## Overview

<div class="image-border">

![Network Configuration Overview](/features/network/network-overview.png)

</div>

The Network page displays:
- The contents of your global `networks.json` file
- An editor for modifying network configurations

:::tip
Familiarize yourself with the structure of the `networks.json` file. Understanding this configuration will help you manage your DFX networks more effectively.
:::

## Understanding `networks.json`

The `networks.json` file is a crucial configuration file that defines the networks available for your DFX projects. By default, it includes a configuration for the local network:

```json
{
    "local": {
        "bind": "127.0.0.1:4943",
        "type": "ephemeral",
        "replica": {
            "subnet_type": "application"
        }
    }
}
```

:::info
This file is automatically managed by the DFX Dashboard, eliminating the need for manual file editing.
:::

## Editing Network Configurations

To modify your network configurations:

1. Navigate to the Network page in the DFX Dashboard.
2. You'll see the current contents of your `networks.json` file in the editor.
3. Make your desired changes directly in the editor.
4. The changes are automatically saved.

:::warning
Ensure your JSON is valid before making changes. Invalid JSON can cause issues with DFX functionality.
:::

## Defining Custom Networks

Custom networks allow you to deploy different projects to different local networks, supporting various development workflows. Here's how to define them:

1. In the `networks.json` editor on the Network page, add a new network configuration:

   ```json
   {
     "network_1": {
       "bind": "localhost:4943",
       "replica": {
         "subnet_type": "application"
       }
     },
     "network_2": {
       "bind": "127.0.0.1:4944",
       "replica": {
         "subnet_type": "application"
       }
     }
   }
   ```

2. Each network should have a unique name (e.g., "network_1", "network_2") and can be configured with different binding addresses and ports.

:::tip
Use descriptive names for your custom networks to easily identify their purpose within the Dashboard.
:::

## Network Configuration Options

Key components of your network setup include:

- `bind`: Specifies the IP address and port the network binds to (e.g., "127.0.0.1:4943").
- `type`: Defines the network type (e.g., "ephemeral" for temporary local networks).
- `replica`: Contains subnet configuration details.
  - `subnet_type`: Specifies the type of subnet (e.g., "application" for standard applications).

:::tip
When working on multiple projects, consider using different ports for each to avoid conflicts.
:::

## Best Practices

:::tip
Optimize your network configuration workflow:

- Regularly review and clean up unused network configurations to keep your setup streamlined.
- Utilize the Dashboard's automatic saving feature to ensure your changes are always up to date.
- Document the purpose of each custom network in your project documentation for better team collaboration.
- Test your custom network configurations thoroughly before using them in production environments.
:::

## Troubleshooting

:::warning
Watch out for these common issues:

- If changes to the network configuration don't seem to take effect, try refreshing the DFX Dashboard or restarting the application.
- Ensure there are no port conflicts when defining multiple networks in your configuration.
- If you encounter errors related to network configuration, double-check the JSON syntax in the editor.
- For issues deploying to a custom network, verify that the network name in your project settings matches exactly with the one in your configuration.
:::

## Additional Resources

- [Understanding DFX Network Configuration](https://internetcomputer.org/docs/current/developer-docs/deploy/networks)
- [Advanced Network Configuration Options](https://internetcomputer.org/docs/current/references/ic-interface-spec/#http-interface)
- [Best Practices for Network Management in DFX Projects](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-mainnet)
- [Troubleshooting Network Issues in DFX](https://internetcomputer.org/docs/current/developer-docs/deploy/troubleshoot-get-help)

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