# Installing DFX Dashboard

This guide will walk you through installing DFX Dashboard and its prerequisite, `dfx`.

## Installing `dfx` via `dfxvm`

Before installing DFX Dashboard, you need to install `dfx`, which is part of the Internet Computer SDK.

:::info
`dfx` is natively supported on Linux or macOS 12.* Monterey or later. For Windows users, you can run `dfx` using Windows Subsystem for Linux (WSL 2), although not all features may be supported.
:::

To install `dfx`, we'll use `dfxvm`, a tool for managing different versions of `dfx`.

1. Open your terminal.
2. Run the following command to download and install the latest version of `dfxvm`:

```sh
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

:::tip
If you're using a machine with Apple silicon, you'll need to have Rosetta installed. You can install Rosetta by running `softwareupdate --install-rosetta` in your terminal.
:::

3. After installation, you can verify the installation by running:

```sh
dfx --version
```

## System Requirements for DFX Dashboard

Before installing DFX Dashboard, ensure your system meets these requirements:

- **Operating System:** 
  - macOS 10.15+
  - Ubuntu 20.04+
- **dfx:** v0.21.0 or newer (installed in the previous step)
- **Node.js:** v14.0.0 or newer

## Installing DFX Dashboard

### 🍎 macOS (Apple Silicon | Intel)

1. Download the latest release for macOS:
   - [Apple Silicon](https://github.com/tolgayayci/dfx-dashboard/releases)
   - [Intel](https://github.com/tolgayayci/dfx-dashboard/releases)
2. Open the downloaded file.
3. Drag the DFX Dashboard icon to the Applications directory.

### 🐧 Linux

1. Download the latest release for Linux:
   - [App Image](https://github.com/tolgayayci/dfx-dashboard/releases)
   - [Snap](https://github.com/tolgayayci/dfx-dashboard/releases)
2. Follow the general instructions to install the application on your Linux distribution:
   - [App Image Installation Guide](https://docs.appimage.org/introduction/quickstart.html#ref-quickstart)
   - [Snap Installation Guide](https://snapcraft.io/docs/installing-snapd)

## Using Bundled `dfx` in DFX Dashboard

While it's recommended to install `dfx` separately as described above, DFX Dashboard also provides a bundled version of `dfx`.

:::tip
If you prefer not to install `dfx` separately or need to use a specific version, you can use the bundled `dfx` version in DFX Dashboard.
:::

To use the bundled version:

1. **Open** DFX Dashboard.
2. **Navigate** to the **Settings page**.
3. Look for the option to **toggle between** system `dfx` and bundled `dfx`.
4. **Select** "Use Bundled DFX".

## Verifying the Installation

After installation, follow these steps to verify that DFX Dashboard is correctly installed:

1. Open **DFX Dashboard** from your applications menu.
2. **Navigate** to the **"About"** section in the sidebar.
3. **Check the version number** displayed to ensure it matches the version you downloaded.

## Additional Resources

- [DFX Documentation](https://internetcomputer.org/docs/current/references/cli-reference/dfx-parent)
- [Internet Computer Developer Documentation](https://internetcomputer.org/docs/current/developer-docs/)

For support, visit [community forum](https://forum.dfinity.org/) or [GitHub issues page](https://github.com/tolgayayci/dfx-dashboard/issues).

<style>
.vp-doc h2 {
    border-top: 1px solid #eaecef;
    padding-top: 24px;
    margin-top: 24px;
}
</style>