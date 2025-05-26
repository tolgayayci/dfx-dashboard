> :warning: **This application in still beta!** When using application be aware of something unexpected may be occur. **Use at your own risk**, don't try important things like very important identities and so on!

# DFX Dashboard

DFX Dashboard is a cross platform, electron based application designed to streamline the use of the DFINITY's Internet Computer `dfx` CLI. It offers a user-friendly interface for managing canisters, identities, and DFINITY projects with ease.
  
---

## Installation

To use this application, you must have dfx installed on your operating system. 

> This application is compatible with latest dfx 0.25.0, please make sure you have installed this version or newer of dfx!

- To install dfx, you'll first need to open up your computer terminal, then run:
```DFX_VERSION=0.25.0 sh -ci "$(curl -fsSL https://smartcontracts.org/install.sh)"```

- To verify that dfx properly installed, run:
```dfx --version```

Now that you have dfx installed, you can install the DFX Dashboard application by following the instructions below.

###  macOS (Apple Silicon | Intel)

1. Download the latest release for macOS 
   1. [Apple Silicon](https://github.com/tolgayayci/dfinity-dfx-gui/releases/download/v0.1.0/dfinity-dfx-0.1.0-arm64.dmg)
   2. [Intel](https://github.com/tolgayayci/dfinity-dfx-gui/releases/download/v0.1.0/dfinity-dfx-0.1.0-universal.dmg)
2. Open the downloaded file and drag the application to Applications folder.

### 🐧 Linux

1. Download the latest release for Linux 
   1. [App Image](https://github.com/tolgayayci/dfinity-dfx-gui/releases/download/v0.1.0/dfinity-dfx-0.1.0.AppImage)
   2. [Snap](https://github.com/tolgayayci/dfinity-dfx-gui/releases/download/v0.1.0/dfinity-dfx-gui_0.1.0_amd64.snap)

2. Follow the general instructions to install the application on your Linux distribution.
   1. [App Image](https://docs.appimage.org/introduction/quickstart.html#ref-quickstart)
   2. [Snap](https://snapcraft.io/docs/installing-snapd)

### 💻 Windows (Not Fully Supported)

DFX **is not natively supported on Windows** yet. However, you can still use the DFX Dashboard application by following the instructions below.

1. Install WSL 2 by following the instructions [on developer docs](https://internetcomputer.org/docs/current/developer-docs/setup/install/).
2. Once you have WSL installed, you can install dfx by running: 
   ```DFX_VERSION=0.15.1 sh -ci "$(curl -fsSL https://smartcontracts.org/install.sh)"```
3. Follow the instructions for Linux to install the DFX Dashboard application.
---

## Key Features

**Project Management:** This feature allows users to efficiently manage their projects. It includes capabilities to create new projects, import existing ones from other sources, and delete projects that are no longer needed. 

**Identity Management:** This component focuses on managing user identities. Users can create new identities, import existing ones, delete unnecessary identities, and seamlessly switch between different identities. 

**Canister Interactions:** This feature is centered around interactions with canisters. Users can create and delete canisters, manage their settings, and interact with them using a variety of commands, arguments, and flags through a user-friendly interface.

**Network Management:** Network management is facilitated through the ability to edit the global networks.json file. This feature enables users to customize and configure network settings to meet the specific needs of their projects.

**Environment Variables:** This aspect of the system allows users to edit existing environment variables. 

> **P.S:** Review the [latest release notes](https://github.com/tolgayayci/dfinity-dfx-gui/releases/tag/v0.1.0) for more information about the features and capabilities of the DFINITY DFX GUI application.

<!-- - **Project Management**
  - Create new projects
  - Import existing projects
  - Delete projects
- **Identity Management**
  - Create new identities
  - Import existing identities
  - Delete identities
  - Switch between identities
- **Canister Interactions**
  - Create new canisters
  - Delete canisters
  - Manage canister settings
  - Manage canister cycles
  - Manage canister logs
  - Manage canister assets
- **Network Management**
  - Manage Dfx settings
- **Environment Variables**
  - Manage environment variables -->

---

## Contributing

Contributions are welcomed! If you have feature requests, bug notifications or want to contribute some code, please follow the instructions below.
-  **Feature Requests:** Use the [feature requests issue](https://github.com/tolgayayci/dfinity-dfx-gui/issues/new?assignees=tolgayayci&labels=feature-request&projects=&template=feature-request.md&title=%5BFEAT%5D) template.
-  **Bug Reports:** Use the [bug reports issue](https://github.com/tolgayayci/dfinity-dfx-gui/issues/new?assignees=tolgayayci&labels=bug&projects=&template=bug-report.md&title=%5BBUG%5D) template. 
-  **Code Contributions**
   -  Fork this repository
   -  Create a new branch
   -  Make your changes
   -  Commit your changes
   -  Push to the branch that you opened
   -  Create a new pull request with some details about your changes
  
## License

DFX Dashboard is released under the **MIT**. See ([LICENSE](https://github.com/tolgayayci/dfinity-dfx-gui/blob/main/LICENSE)) for more details.
