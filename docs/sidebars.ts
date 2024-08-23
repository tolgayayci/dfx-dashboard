import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "category",
      label: "Getting Started",
      items: ["getting-started/installation", "getting-started/quick-start"],
    },
    {
      type: "category",
      label: "Features",
      items: [
        {
          type: "doc",
          id: "features/projects",
          label: "Projects",
        },
        {
          type: "doc",
          id: "features/canisters",
          label: "Canister",
        },
        {
          type: "doc",
          id: "features/identities",
          label: "Identities",
        },
        {
          type: "doc",
          id: "features/cycles",
          label: "Cycles",
        },
        {
          type: "doc",
          id: "features/network",
          label: "Network",
        },
        {
          type: "doc",
          id: "features/logs",
          label: "Logs",
        },
        {
          type: "doc",
          id: "features/about",
          label: "Projects",
        },
        {
          type: "doc",
          id: "features/settings",
          label: "Settings",
        },
      ],
    },
  ],
};

export default sidebars;
