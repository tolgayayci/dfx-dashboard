# Identities

The Identities page is a crucial component of the DFX Dashboard, allowing you to **create, import,** and **manage** the digital identities used for interacting with the Internet Computer network.

## Overview

<div class="image-border">

![Identities Overview](/features/identities/identities-overview.png)

</div>

The Identities page displays a list of all your digital identities. Each identity is represented by a card showing its name and type. Main features of this page include:

- **Viewing** all your identities
- **Creating** new identities
- **Importing** existing identities
- **Managing** individual identities
- **Selecting** active identities

:::tip
Keep your list of identities organized by using clear, descriptive names. This will help you quickly identify the right identity for each task or project.
:::

## Creating a New Identity

To create a new identity:

1. Click the **"Create New Identity"** button in the top right corner.
2. In the modal that appears, select the **"New Identity"** tab.

<div class="image-border">

![Create New Identity](/features/identities/create-new-identity.png)

</div>

3. Fill in the identity details:
   - **Identity Name**: Enter a name for your new identity
   - **Options**: Additional settings (if available)
4. Click **"Create"** to generate your new identity.

:::info
Identities you create are global and not confined to a specific project context.
:::

:::warning
Always safeguard the private keys associated with your identities. Never share them or store them in unsecured locations.
:::

## Importing an Existing Identity

To import an existing identity:

1. Click the **"Create New Identity"** button.
2. Select the **"Import Existing"** tab in the modal.

<div class="image-border">

![Import Existing Identity](/features/identities/import-existing-identity.png)

</div>

3. Enter the identity details:
   - **Identity Name**: Provide a name for the imported identity
   - **PEM File**: Choose the PEM file containing your identity's key information
4. Click **"Import"** to add the identity to DFX Dashboard.

:::tip
Before importing, ensure your PEM file is stored in a secure location on your device. After successful import, consider moving the file to an encrypted or offline storage for added security.
:::

## Internet Identity Login

The DFX Dashboard supports logging in with Internet Identity:

1. Click the **"Create New Identity"** button.
2. Select the **"Internet Identity"** tab in the modal.

<div class="image-border">

![Internet Identity Login](/features/identities/internet-identity-login.png)

</div>

3. Click **"Login"** to authenticate using your Internet Identity.

:::info
This will open a new browser window for the login process, after which you'll be redirected back to the dashboard and your identity will be created.
:::

:::tip
Internet Identity provides an additional layer of security. Consider using it for critical operations or when working with sensitive projects.
:::

## Managing Identities

Each identity card on the main Identities page has several actions available:

1. **Select**: Set an identity as the active one for your current session.
2. **Edit**: Modify the identity's details.
3. **Delete**: Remove the identity from the dashboard (shown as a trash can icon).

To rename an identity:

1. Click the **"Edit"** button on the identity card.
2. In the modal that appears, enter the new name for your identity.

<div class="image-border">

![Rename Identity](/features/identities/rename-identity.png)

</div>

3. Click **"Rename"** to save the changes.

:::warning
Be cautious when deleting identities. This action is irreversible and may affect your ability to interact with specific canisters or projects associated with that identity.
:::

## Identity List Features

- **Search**: Use the search bar to filter identities by name.
- **Identity Count**: The top of the page displays the total number of identities you have.
- **Active Identity**: The currently active identity is displayed in the top right corner of the dashboard.

:::tip
Regularly review your list of identities and remove any that are no longer needed. This helps maintain a clean and manageable identity workspace.
:::

## Best Practices

:::tip
Optimize your identity management with these tips:

- Use descriptive names for your identities to easily distinguish between them.
- Regularly backup your identity information, especially for important or frequently used identities.
- Keep your active identity updated based on your current task or project context.
- Use different identities for development and production environments to enhance security.
- Periodically rotate your identities for long-running projects to minimize the impact of potential key compromises.
:::

## Troubleshooting

:::warning
Watch out for these common issues:

- If you're unable to import an identity, ensure the PEM file is valid and contains the correct key information.
- For issues with Internet Identity login, try clearing your browser cache and restarting the DFX Dashboard.
- If an identity isn't appearing after creation, refresh the Identities page or restart the dashboard.
- If you encounter unexpected behavior with a specific identity, try creating a new one and see if the issue persists.
- Always keep your DFX Dashboard and dfx CLI tool updated to avoid compatibility issues with identity management.
:::

## Additional Resources

- [Understanding Digital Identity on the Internet Computer](https://internetcomputer.org/docs/current/tokenomics/identity-auth/)
- [Security Best Practices for Identity Management](https://internetcomputer.org/docs/current/developer-docs/security/general-security-best-practices)
- [Internet Identity Specification](https://internetcomputer.org/docs/current/references/ii-spec/)

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