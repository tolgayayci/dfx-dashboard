---
title: Identities - Overview
sidebar_label: Identities
---

# Identities
*Manage and control your digital identities for the Internet Computer.*

The Identities page is a crucial component of the DFX Dashboard, allowing you to **create, import,** and **manage** the digital identities used for interacting with the Internet Computer network.

## Overview
*Your central hub for identity management.*

![Identities Overview](/img/features/identities/identities-overview.png)

The Identities page displays a list of all your digital identities. Each identity is represented by a card showing its name and type. Main features of this page include:

- **Viewing** all your identities
- **Creating** new identities
- **Importing** existing identities
- **Managing** individual identities
- **Selecting** active identities

---

## Creating a New Identity
*Establish a new digital presence on the Internet Computer.*

To create a new identity:

1. Click the **"Create New Identity"** button in the top right corner.
2. In the modal that appears, select the **"New Identity"** tab.

![Create New Identity](/img/features/identities/create-new-identity.png)

3. Fill in the identity details:
   - **Identity Name**: Enter a name for your new identity
   - **Options**: Additional settings (if available)
4. Click **"Create"** to generate your new identity.

**Note**: Identities you create are global and not confined to a specific project context.

---

## Importing an Existing Identity
*Bring your pre-existing identities into the DFX Dashboard.*

To import an existing identity:

1. Click the **"Create New Identity"** button.
2. Select the **"Import Existing"** tab in the modal.

![Import Existing Identity](/img/features/identities/import-existing-identity.png)

3. Enter the identity details:
   - **Identity Name**: Provide a name for the imported identity
   - **PEM File**: Choose the PEM file containing your identity's key information
4. Click **"Import"** to add the identity to DFX Dashboard.

---

## Internet Identity Login
*Use Internet Identity for seamless authentication.*

The DFX Dashboard supports logging in with Internet Identity:

1. Click the **"Create New Identity"** button.
2. Select the **"Internet Identity"** tab in the modal.

![Internet Identity Login](/img/features/identities/internet-identity-login.png)

3. Click **"Login"** to authenticate using your Internet Identity. **This will open a new browser window** for the **login process**, after which **you'll be redirected back to the dashboard** and your identity will be created.

---

## Managing Identities
*Control and modify your existing identities.*

Each identity card on the main Identities page has several actions available:

1. **Select**: Set an identity as the active one for your current session.
2. **Edit**: Modify the identity's details.
3. **Delete**: Remove the identity from the dashboard (shown as a trash can icon).

To rename an identity:

1. Click the **"Edit"** button on the identity card.
2. In the modal that appears, enter the new name for your identity.

![Rename Identity](/img/features/identities/rename-identity.png)

3. Click **"Rename"** to save the changes.

---

## Identity List Features
*Navigate and organize your identities with ease.*

- **Search**: Use the search bar to filter identities by name.
- **Identity Count**: The top of the page displays the total number of identities you have.
- **Active Identity**: The currently active identity is displayed in the top right corner of the dashboard.

---

## Best Practices
*Optimize your identity management with these tips.*

- Use **descriptive names** for your identities to easily distinguish between them.
- **Regularly backup** your identity information, especially for important or frequently used identities.
- Keep your **active identity** updated based on your current task or project context.
- Be cautious when **deleting identities**, as this action may affect your ability to interact with specific canisters or projects.

---

## Troubleshooting
*Quick solutions for common identity issues.*

- If you're unable to import an identity, ensure the **PEM file is valid** and contains the correct key information.
- For issues with Internet Identity login, try **clearing your browser cache** and restarting the DFX Dashboard.
- If an identity isn't appearing after creation, **refresh the Identities page** or restart the dashboard.

---