export const commands = [
  {
    label: "call",
    value: "call",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
      {
        name: "METHOD_NAME",
        placeholder: "Enter method name",
        optional: false,
      },
      { name: "ARGUMENT", placeholder: "Enter argument", optional: true },
    ],
    options: [
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--type",
        placeholder: "idl",
        type: "argument",
        description: "Specifies the data type for the argument",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information",
      },
      {
        name: "--argument-file",
        placeholder: "path/to/file",
        type: "argument",
        description: "Read argument from file",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--async",
        type: "flag",
        description: "Specifies not to wait for the result",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Use the IC network",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--query",
        type: "flag",
        description: "Sends a query request to a canister",
      },
      {
        name: "--update",
        type: "flag",
        description: "Sends an update request to a canister",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--random",
        placeholder: "Config for random argument",
        type: "argument",
        description: "Specify config for random argument",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
      {
        name: "--output",
        placeholder: "idl",
        type: "argument",
        description: "Specifies the format for displaying the return result",
      },
      {
        name: "--with-cycles",
        placeholder: "Amount of cycles",
        type: "argument",
        description: "Specifies the amount of cycles to send on the call",
      },
      {
        name: "--candid",
        placeholder: "path/to/file.did",
        type: "argument",
        description: "Provide .did file to decode the response",
      },
      {
        name: "--always-assist",
        type: "flag",
        description:
          "Always use Candid assist when argument types are all optional",
      },
    ],
  },
  {
    label: "create",
    value: "create",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name",
        optional: false,
      },
    ],
    options: [
      {
        name: "--all",
        type: "flag",
        description: "Creates all canisters configured in dfx.json",
      },
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--with-cycles",
        placeholder: "Amount of cycles",
        type: "argument",
        description: "Specifies the initial cycle balance to deposit",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--specified-id",
        placeholder: "Principal",
        type: "argument",
        description: "Attempts to create the canister with this Canister ID",
      },
      {
        name: "--controller",
        placeholder: "Identity name or principal",
        type: "argument",
        description: "Specifies the new controller",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--compute-allocation",
        placeholder: "0-100",
        type: "argument",
        description: "Specifies the canister's compute allocation",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--memory-allocation",
        placeholder: "0-12 GiB",
        type: "argument",
        description: "Specifies how much memory the canister is allowed to use",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
      {
        name: "--no-wallet",
        type: "flag",
        description: "Performs the call with the user Identity as the Sender",
      },
      {
        name: "--from-subaccount",
        placeholder: "Subaccount",
        type: "argument",
        description: "Subaccount of the selected identity to spend cycles from",
      },
      {
        name: "--subnet-type",
        placeholder: "Subnet type",
        type: "argument",
        description: "Specify the optional subnet type to create canisters on",
      },
      {
        name: "--subnet",
        placeholder: "Subnet",
        type: "argument",
        description: "Specify a specific subnet on which to create canisters",
      },
      {
        name: "--next-to",
        placeholder: "Canister ID",
        type: "argument",
        description: "Create canisters on the same subnet as this canister",
      },
    ],
  },
  {
    label: "delete",
    value: "delete",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--all",
        type: "flag",
        description: "Deletes all the canisters configured in dfx.json",
      },
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--no-withdrawal",
        type: "flag",
        description: "Do not withdrawal cycles, just delete the canister",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--withdraw-cycles-to-canister",
        placeholder: "Canister/Wallet ID",
        type: "argument",
        description:
          "Withdraw cycles to the specified canister/wallet before deleting",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--withdraw-cycles-to-dank",
        type: "flag",
        description: "Withdraw cycles to dank with the current principal",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--withdraw-cycles-to-dank-principal",
        placeholder: "Principal ID",
        type: "argument",
        description: "Withdraw cycles to dank with the given principal",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
      {
        name: "--yes",
        type: "flag",
        description: "Auto-confirm deletion for a non-stopped canister",
      },
      {
        name: "--initial-margin",
        placeholder: "Amount",
        type: "argument",
        description:
          "Leave this many cycles in the canister when withdrawing cycles",
      },
      {
        name: "--to-subaccount",
        placeholder: "Subaccount",
        type: "argument",
        description: "Subaccount of the selected identity to deposit cycles to",
      },
    ],
  },
  {
    label: "deposit-cycles",
    value: "deposit-cycles",
    args: [
      {
        name: "CYCLES",
        placeholder: "Enter amount of cycles",
        optional: false,
      },
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--all",
        type: "flag",
        description:
          "Deposit cycles to all the canisters configured in dfx.json",
      },
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
      {
        name: "--from-subaccount",
        placeholder: "Subaccount",
        type: "argument",
        description: "Use cycles from this subaccount",
      },
      {
        name: "--created-at-time",
        placeholder: "Nanoseconds",
        type: "argument",
        description:
          "Transaction timestamp for controlling transaction deduplication",
      },
    ],
  },
  {
    label: "id",
    value: "id",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name",
        optional: false,
      },
    ],
    options: [
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "info",
    value: "info",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "install",
    value: "install",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
      {
        name: "OUTPUT_ENV_FILE",
        placeholder: "Enter output environment file path",
        optional: true,
      },
    ],
    options: [
      {
        name: "--all",
        type: "flag",
        description:
          "Deploys all canisters configured in the project dfx.json files",
      },
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--async-call",
        type: "flag",
        description: "Specifies not to wait for the result of the call",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--mode",
        placeholder: "install",
        type: "argument",
        description: "Specifies the type of deployment",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--upgrade-unchanged",
        type: "flag",
        description: "Upgrade the canister even if the .wasm did not change",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--argument",
        placeholder: "Argument value",
        type: "argument",
        description: "Specifies the argument to pass to the method",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--argument-type",
        placeholder: "idl",
        type: "argument",
        description: "Specifies the data type for the argument",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
      {
        name: "--wasm",
        placeholder: "path/to/wasm",
        type: "argument",
        description: "Specifies a particular WASM file to install",
      },
      {
        name: "--yes",
        type: "flag",
        description: "Skips yes/no checks by answering 'yes'",
      },
      {
        name: "--no-asset-upgrade",
        type: "flag",
        description: "Skips upgrading the asset canister",
      },
      {
        name: "--argument-file",
        placeholder: "path/to/file",
        type: "argument",
        description: "Specifies the file from which to read the argument",
      },
      {
        name: "--always-assist",
        type: "flag",
        description:
          "Always use Candid assist when the argument types are all optional",
      },
    ],
  },
  {
    label: "metadata",
    value: "metadata",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter the canister name",
        optional: false,
      },
      {
        name: "METADATA_NAME",
        placeholder: "Enter the metadata name to retrieve",
        optional: false,
      },
    ],
    options: [
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "request-status",
    value: "request-status",
    args: [
      {
        name: "REQUEST_ID",
        placeholder:
          "Enter the request identifier (hexadecimal starting with 0x)",
        optional: false,
      },
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--output",
        placeholder: "idl",
        type: "argument",
        description:
          "Specifies the format for displaying the method's return result",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "send",
    value: "send",
    args: [
      {
        name: "FILE_NAME",
        placeholder: "Enter the file name of the message",
        optional: false,
      },
    ],
    options: [
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--status",
        type: "flag",
        description: "Send the signed request-status call in the message",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "sign",
    value: "sign",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter the canister name/id",
        optional: false,
      },
      {
        name: "METHOD_NAME",
        placeholder: "Enter the method name",
        optional: false,
      },
      { name: "ARGUMENT", placeholder: "Enter the argument", optional: true },
    ],
    options: [
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--type",
        placeholder: "idl",
        type: "argument",
        description: "Specifies the data type for the argument",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--argument-file",
        placeholder: "path/to/argument_file",
        type: "argument",
        description: "Specifies the file from which to read the argument",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--query",
        type: "flag",
        description: "Sends a query request to a canister",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--update",
        type: "flag",
        description: "Sends an update request to a canister",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--random",
        placeholder: "Config for random argument",
        type: "argument",
        description: "Specifies the config for generating random argument",
      },
      {
        name: "--expire-after",
        placeholder: "300s",
        type: "argument",
        description: "Specifies how long the message will be valid",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
      {
        name: "--file",
        placeholder: "message.json",
        type: "argument",
        description: "Specifies the output file name",
      },
      {
        name: "--always-assist",
        type: "flag",
        description:
          "Always use Candid assist when the argument types are all optional",
      },
    ],
  },
  {
    label: "start",
    value: "start",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--all",
        type: "flag",
        description:
          "Starts all of the canisters configured in the dfx.json file",
      },
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "status",
    value: "status",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--all",
        type: "flag",
        description:
          "Returns status information for all the canisters configured in the dfx.json file",
      },
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "stop",
    value: "stop",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--all",
        type: "flag",
        description:
          "Stops all of the canisters configured in the dfx.json file",
      },
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "uninstall-code",
    value: "uninstall-code",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--all",
        type: "flag",
        description:
          "Uninstalls all of the canisters configured in the dfx.json file",
      },
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "update-settings",
    value: "update-settings",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--all",
        type: "flag",
        description:
          "Updates the settings of all canisters configured in the dfx.json file",
      },
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--set-controller",
        placeholder: "Principal ID",
        type: "argument",
        description: "Specifies the new controller",
      },
      {
        name: "--add-controller",
        placeholder: "Principal ID",
        type: "argument",
        description: "Add a principal to the list of controllers",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--remove-controller",
        placeholder: "Principal ID",
        type: "argument",
        description: "Removes a principal from the list of controllers",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--compute-allocation",
        placeholder: "0-100",
        type: "argument",
        description: "Specifies the canister's compute allocation",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--memory-allocation",
        placeholder: "0-12 GiB",
        type: "argument",
        description: "Specifies how much memory the canister is allowed to use",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
      {
        name: "--freezing-threshold",
        placeholder: "Seconds",
        type: "argument",
        description: "Sets the freezing_threshold in seconds",
      },
      {
        name: "--reserved-cycles-limit",
        placeholder: "Cycles",
        type: "argument",
        description:
          "Sets the upper limit of the canister's reserved cycles balance",
      },
      {
        name: "--confirm-very-long-freezing-threshold",
        type: "flag",
        description: "Confirms freezing thresholds above ~1.5 years",
      },
      {
        name: "--yes",
        type: "flag",
        description: "Skips yes/no checks by answering 'yes'",
      },
      {
        name: "--wasm-memory-limit",
        placeholder: "Bytes",
        type: "argument",
        description:
          "Sets a soft limit on the Wasm memory usage of the canister",
      },
      {
        name: "--log-visibility",
        placeholder: "controllers|public",
        type: "argument",
        description: "Specifies who is allowed to read the canister's logs",
      },
    ],
  },
  {
    label: "logs",
    value: "logs",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
  {
    label: "url",
    value: "url",
    args: [
      {
        name: "CANISTER_NAME",
        placeholder: "Enter canister name/id",
        optional: false,
      },
    ],
    options: [
      {
        name: "--network",
        placeholder: "http://localhost:12345/",
        type: "argument",
        description: "Override the compute network",
      },
      {
        name: "--verbose",
        type: "flag",
        description: "Displays detailed information about operations",
      },
      {
        name: "--playground",
        type: "flag",
        description: "Use short-lived canisters on the real IC network",
      },
      {
        name: "--quiet",
        type: "flag",
        description: "Suppresses informational messages",
      },
      {
        name: "--ic",
        type: "flag",
        description: "Shorthand for --network=ic",
      },
      {
        name: "--log",
        placeholder: "stderr",
        type: "argument",
        description: "Specify the logging mode",
      },
      {
        name: "--logfile",
        placeholder: "path/to/logfile",
        type: "argument",
        description: "Specify the file to log to",
      },
      {
        name: "--wallet",
        placeholder: "Wallet canister id",
        type: "argument",
        description: "Specify a wallet canister id",
      },
      {
        name: "--identity",
        placeholder: "Identity name",
        type: "argument",
        description: "Specify the user identity",
      },
      {
        name: "--provisional-create-canister-effective-canister-id",
        placeholder: "Principal",
        type: "argument",
        description: "Effective canister id for provisional creation",
      },
    ],
  },
];
