# Identities

The Identities page is a crucial component of the DFX Dashboard, allowing you to **create, import,** and **manage** the digital identities used for interacting with the Internet Computer network. It now includes comprehensive **ledger functionality** for ICP operations and account management.

## Overview

<div class="image-border">

![Identities Overview](/features/identities/identities-overview.png)

</div>

The Identities page is organized into two main tabs:
- **Identities**: Manage your digital identities
- **Ledger**: Handle ICP operations and account management

### Identities Tab Features:
- **Viewing** all your identities
- **Creating** new identities
- **Importing** existing identities
- **Managing** individual identities
- **Selecting** active identities

### Ledger Tab Features:
- **Account Management**: View balances and convert principals
- **ICP Operations**: Transfer ICP, create canisters, top-up operations
- **Transaction History**: View and track ICP transactions

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

## Ledger Tab

<div class="image-border">

![Ledger Tab Overview](/features/identities/ledger-overview.png)

</div>

The Ledger tab provides comprehensive ICP (Internet Computer Protocol) token management functionality. It's organized into three sub-tabs:

### Account Management

<div class="image-border">

![Account Management](/features/identities/account-management.png)

</div>

Manage your current identity's ICP account:

#### Current Identity Account
- **Principal Display**: Shows your current identity's principal ID
- **Account ID**: Displays the corresponding account identifier
- **ICP Balance**: Real-time balance checking with refresh capability
- **Copy Functions**: One-click copying of principal and account ID

#### Principal to Account ID Converter
- **Conversion Tool**: Convert any principal to its account identifier
- **Validation**: Ensures valid principal format
- **Copy Result**: Easy copying of converted account IDs

### ICP Operations

<div class="image-border">

![ICP Operations](/features/identities/icp-operations.png)

</div>

Perform various ICP-related operations:

#### Transfer ICP
1. **Recipient**: Enter destination account ID or principal
2. **Amount**: Specify ICP amount to transfer
3. **Network**: Select local or Internet Computer network
4. **Execute**: Send the transfer with confirmation

#### Create Canister from ICP
1. **Amount**: Specify ICP amount to convert to cycles
2. **Network**: Choose target network
3. **Create**: Deploy new canister funded with converted cycles

#### Top Up Canister
1. **Canister ID**: Enter the canister to top up
2. **Amount**: Specify ICP amount for conversion
3. **Network**: Select appropriate network
4. **Top Up**: Add cycles to the specified canister

#### Fabricate Cycles (Local Development)
1. **Amount**: Specify cycles to fabricate
2. **Local Only**: Available only on local networks
3. **Generate**: Create cycles for development testing

### Transaction History

<div class="image-border">

![Transaction History](/features/identities/transaction-history.png)

</div>

Track and monitor your ICP transactions:

#### Features
- **Real-time Updates**: Fetches latest transaction data
- **Transaction Details**: Shows type, amount, fees, and status
- **Block Heights**: Links to blockchain records
- **Search and Filter**: Find specific transactions
- **Export Options**: Download transaction history

#### Transaction Information
- **Transaction Hash**: Unique identifier for each transaction
- **Type**: Transfer, canister creation, top-up, etc.
- **Amount**: ICP amount involved
- **Fees**: Network fees paid
- **Status**: Completed, pending, or failed
- **Timestamp**: When the transaction occurred

## Ledger Best Practices

:::tip
Optimize your ICP management:

- **Balance Monitoring**: Regularly check your ICP balance
- **Network Selection**: Ensure you're using the correct network
- **Address Verification**: Always verify recipient addresses
- **Transaction Fees**: Account for network fees in transfers
- **Local Testing**: Use local network for development
- **Backup Records**: Keep records of important transactions
- **Security**: Never share your private keys or seed phrases
:::

## Ledger Troubleshooting

:::warning
Common ledger issues and solutions:

- **Balance not showing**: Ensure you're connected to the correct network
- **Transfer failures**: Check recipient address and available balance
- **Local network errors**: ICP Ledger may not be installed locally
- **Network connectivity**: Verify internet connection for IC operations
- **Insufficient funds**: Ensure adequate balance for operations and fees
- **Transaction delays**: IC transactions may take time to confirm
- **Invalid addresses**: Verify account IDs and principal formats
:::

## Additional Resources

- [Understanding Digital Identity on the Internet Computer](https://internetcomputer.org/docs/current/tokenomics/identity-auth/)
- [Security Best Practices for Identity Management](https://internetcomputer.org/docs/current/developer-docs/security/general-security-best-practices)
- [Internet Identity Specification](https://internetcomputer.org/docs/current/references/ii-spec/)
- [ICP Ledger Documentation](https://internetcomputer.org/docs/current/developer-docs/integrations/ledger/)
- [DFX Ledger Commands](https://internetcomputer.org/docs/current/references/cli-reference/dfx-ledger)
- [Cycle Management Guide](https://internetcomputer.org/docs/current/developer-docs/setup/cycles/)

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