# Projects

The Projects page is your central hub for managing Internet Computer projects within the DFX Dashboard. This powerful interface allows you to **view, create, import,** and **manage** your projects efficiently.

## Overview

<div class="image-border">

![Projects Overview](/features/projects/projects-overview.png)

</div>

The Projects page displays a list of all your projects, each represented by a card showing its name and location. Key features include:

- **Viewing** all your projects at a glance
- **Creating** new projects with customizable templates
- **Importing** existing projects seamlessly
- **Managing** individual projects with detailed controls
- **Opening projects** directly in your preferred **code editor**

## Creating a New Project

To create a new project:

1. Click the **"Create New Project"** button in the top right corner.
2. In the modal that appears, select the **"New Project"** tab.

<div class="image-border">

![Create New Project](/features/projects/create-new-project.png)

</div>

3. Fill in the project details:
   - **Project Name**: Enter a unique name for your project
   - **Project Path**: Choose where to save your project on your local machine
   - **Frontend Type**: Select your preferred frontend framework (e.g., React, Vue, Svelte)
   - **Canister Type**: Choose the backend canister type (e.g., Motoko, Rust)
4. Click **"Create"** to set up your new project.

:::tip
When creating a new project, use a descriptive name that reflects its purpose or main functionality. This will make it easier to identify and manage your projects as your portfolio grows.
:::

## Importing an Existing Project

To import an existing dfx project:

1. Click the **"Create New Project"** button.
2. Select the **"Import Existing"** tab in the modal.

<div class="image-border">

![Import Existing Project](/features/projects/import-existing-project.png)

</div>

3. Enter the project details:
   - **Project Name**: Provide a name for the imported project
   - **Project Path**: Select the directory of your existing project
4. Click **"Import"** to add the project to DFX Dashboard.

:::tip
Before importing, ensure your existing project's structure is compatible with the current version of dfx to avoid potential issues during the import process.
:::

## Managing Projects

Take control of your projects with our powerful management tools.

Each project card on the main Projects page has two primary actions:

1. **Open With**: Launch your project in your preferred code editor.

<div class="image-border">

![Open With Editor](/features/projects/open-with-editor.png)

</div>

   - Click **"Open With"** to see a list of installed code editors on your system.
   - Select your preferred editor to open the project.

2. **Manage**: Access detailed project information and controls.

<div class="image-border">

![Project Details](/features/projects/project-details.png)

</div>

   - View information about the project's **canisters**.
   - Inspect and edit the **`dfx.json`** file for the project.
   - Perform various actions on individual canisters, such as building, deploying, or stopping.

:::warning
Be cautious when editing the `dfx.json` file directly. Incorrect modifications can lead to project configuration issues.
:::

## Project List Features

Navigate and organize your projects effortlessly with these built-in features:

- **Search**: Use the search bar to quickly filter projects by name.
- **Project Count**: The top of the page displays the total number of projects for easy reference.
- **Pagination**: For larger project collections, use the pagination controls at the bottom of the list to navigate between pages.

## Best Practices

:::tip
Optimize your workflow with these project management tips:

- Regularly update your projects to ensure compatibility with the latest Internet Computer SDK.
- Use descriptive names for your projects to easily identify them in the dashboard.
- Organize your projects into logical folders to maintain a clean workspace.
- Backup your projects regularly, especially before making major changes.
- Utilize version control systems like Git to track changes and collaborate effectively.
:::

## Troubleshooting

:::warning
Encountering issues? Here are some quick solutions for common project problems:

- If a project fails to import, ensure the project directory contains a valid `dfx.json` file.
- For issues opening a project in an editor, verify that the editor is properly installed on your system.
- If project actions are unresponsive, try reloading the DFX Dashboard from the top menu by clicking the reload button.
- Check the DFX Dashboard logs for any error messages or warnings that might indicate the root cause of an issue.
- When updating dfx, make sure to update your project's dependencies and configurations accordingly to maintain compatibility.
:::

## Additional Resources

- [DFX Command Line Reference](/dfx-reference)
- [Internet Computer Developer Documentation](https://internetcomputer.org/docs/current/developer-docs/)
- [DFX Dashboard GitHub Repository](https://github.com/dfinity/dfx-dashboard)

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