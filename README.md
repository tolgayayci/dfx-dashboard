# DFINITY DFX GUI

DFINITY DFX GUI is a cross platform, electron based application designed to streamline the use of the DFINITY's Internet Computer `dfx` CLI. It offers a user-friendly interface for managing canisters, identities, and DFINITY projects with ease.
  
---

## Installation

To use this application, you must have dfx installed on your operating system. 

> This application is compatible with latest dfx 0.15.1, please make sure you have installed this version or older of dfx!

- To install dfx, you’ll first need to open up your computer terminal, then run:
```DFX_VERSION=0.15.1 sh -ci "$(curl -fsSL https://smartcontracts.org/install.sh)"```

- To verify that dfx properly installed, run:
```dfx --version```

Now that you have dfx installed, you can install the DFINITY DFX GUI application by following the instructions below.

###  macOS (Apple Silicon | Intel)

1. Download the latest release for macOS 
   1. [Apple Silicon](#)
   2. [Intel](#)
2. Open the downloaded file and drag the application to your Applications folder.
3. Open the application from your Applications folder.

### 🐧 Linux

1. Download the latest release for Linux from [this link](#).
2. Extract the downloaded file and click on the application.

### 💻 Windows (Not Fully Supported)

DFX **is not natively supported on Windows** yet. However, you can still use the DFINITY DFX GUI application by following the instructions below.

1. Install WSL 2 by following the instructions [on developer docs](https://internetcomputer.org/docs/current/developer-docs/setup/install/).
2. Once you have WSL installed, you can install dfx by running: 
   ```DFX_VERSION=0.15.1 sh -ci "$(curl -fsSL https://smartcontracts.org/install.sh)"```

---

## Key Features
- **Project Management**
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
- **Network Configurations**
  - Switch between networks
  - Add new networks
  - Delete networks
- **Network Management**
  - Manage Dfx settings

---

## Usage

[Provide a brief guide or steps on how to use the application, its features, and any tips for users.]

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

DFINITY DFX GUI is released under the **MIT**. See ([LICENSE](https://github.com/tolgayayci/dfinity-dfx-gui/blob/main/LICENSE)) for more details.
