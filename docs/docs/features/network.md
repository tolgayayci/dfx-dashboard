---
title: Network Configuration
sidebar_label: Network
---

# Network Configuration
*Manage and customize your DFX networks directly from the Dashboard.*

The Network page in the DFX Dashboard allows you to view and edit the global `networks.json` file, which defines the networks available for your DFX projects.

## Overview
*Your central hub for network configuration.*

![Network Configuration Overview](/img/features/network/network-overview.png)

The Network page displays:
- The contents of your global `networks.json` file
- An editor for modifying network configurations

---

## Understanding `networks.json`
*The foundation of your DFX network setup.*

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

This file is automatically managed by the DFX Dashboard, eliminating the need for manual file editing.

---

## Editing Network Configurations
*Customize your networks directly in the Dashboard.*

To modify your network configurations:

1. Navigate to the Network page in the DFX Dashboard.
2. You'll see the current contents of your `networks.json` file in the editor.
3. Make your desired changes directly in the editor.
4. The changes are automatically saved.

**Important**: Ensure your JSON is valid before making changes. Invalid JSON can cause issues with DFX functionality.

---

## Defining Custom Networks
*Tailor your development environment to your needs.*

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

3. Your changes are automatically saved in the Dashboard.

These custom networks will now be available for selection when deploying projects through the DFX Dashboard.

---

## Network Configuration Options
*Understand the key components of your network setup.*

- `bind`: Specifies the IP address and port the network binds to (e.g., "127.0.0.1:4943").
- `type`: Defines the network type (e.g., "ephemeral" for temporary local networks).
- `replica`: Contains subnet configuration details.
  - `subnet_type`: Specifies the type of subnet (e.g., "application" for standard applications).

---

## Best Practices
*Optimize your network configuration workflow.*

- Use descriptive names for your custom networks to easily identify their purpose within the Dashboard.
- Regularly review and clean up unused network configurations to keep your setup streamlined.
- When working on multiple projects, consider using different ports for each to avoid conflicts.
- Utilize the Dashboard's automatic saving feature to ensure your changes are always up to date.

---

## Troubleshooting
*Common issues and their solutions.*

- If changes to the network configuration don't seem to take effect, try refreshing the DFX Dashboard or restarting the application.
- Ensure there are no port conflicts when defining multiple networks in your configuration.
- If you encounter errors related to network configuration, double-check the JSON syntax in the editor.
- For issues deploying to a custom network, verify that the network name in your project settings matches exactly with the one in your configuration.

---