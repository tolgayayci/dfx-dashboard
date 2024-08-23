---
title: Logs Overview
sidebar_label: Logs
---

# Logs
*Track and manage your DFX command history.*

The Logs page provides a comprehensive view of your DFX Dashboard command history, allowing you to **review**, **re-execute**, and **analyze** past commands run within the DFX Dashboard.

## Overview
*Your command history at a glance.*

![Logs Overview](/img/features/logs/logs-overview.png)

The Logs page displays:
- A table of executed dfx commands
- Options to **view command outputs**, **re-execute commands**, and **copy command** text
- **Filtering** and **search capabilities**

**Note**: Only **commands run through the DFX Dashboard are recorded here**, not those executed in your terminal.

---

## Command History Table
*Detailed view of your past DFX commands.*

The command history table includes the following columns:

1. **Date**: The date when the command was executed.
2. **Time**: The specific time of command execution.
3. **Type**: The category of the command (e.g., CANISTER).
4. **Command**: The actual dfx command that was run.
5. **Action**: Buttons to interact with the command (**view output, re-execute, copy**).

---

## Interacting with Commands
*Review, re-run, and utilize past commands.*

For each command in the history, you have three action options:

1. **View Command Output** (ⓘ icon):
   - Click to open a modal showing the command's output.
   - The modal displays the command, its execution path, and the resulting output.

   ![Command Output](/img/features/logs/command-output.png)

2. **Re-execute Command** (▶ icon):
   - Click to run the command again within the DFX Dashboard.
   - Useful for repeating actions or comparing results.

3. **Copy Command** (📋 icon):
   - Click to copy the command text to your clipboard.
   - A confirmation message "Copied to Clipboard" will appear briefly.

   ![Copy Confirmation](/img/features/logs/copy-confirmation.png)

---

## Filtering and Searching
*Find specific commands quickly.*

The Logs page offers several ways to locate particular commands:

1. **Search Bar**: 
   - Use the "Search Between Commands" field to find specific command text.

2. **Date and Time Sorting**:
   - Click on the Date or Time column headers to sort commands chronologically.

3. **Type Filter**:
   - Use the dropdown (defaulted to "All") to filter commands by their type.

4. **Pagination**:
   - Navigate through multiple pages of command history using the pagination controls at the bottom.

5. **Rows per Page**:
   - Adjust the number of commands displayed per page using the dropdown at the bottom left.

---

## Best Practices
*Optimize your use of the Logs feature.*

- Use the **re-execute feature** to **quickly repeat common tasks**.
- Utilize the **copy feature** when you** need to run a command with modifications in your terminal**.
- Use the **search and filter options** to quickly **find specific commands in a large history**.

---

## Troubleshooting
*Common issues and their solutions.*

- If a **command's output is unexpected**, **try re-executing it** to see if the issue persists.
- If you **can't find a command** you remember running, **ensure** it was **executed through the DFX Dashboard** and **not directly in your terminal**.

---