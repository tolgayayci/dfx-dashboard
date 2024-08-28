import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DFX Dashboard - Documentation",
  description: "DFX Dashboard GUI - Documentation Site",
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: false,
    logo: {
      light: "/icp-logo.svg",
      dark: "/icp-logo.svg",
    },
    nav: [
      { text: "Download DFX Dashboard", link: "/getting-started/installation" },
      { text: "Documentation", link: "/getting-started/quick-start" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Installation", link: "/getting-started/installation" },
          { text: "Quick Start", link: "/getting-started/quick-start" },
        ],
      },
      {
        text: "Core Features",
        items: [
          { text: "Projects", link: "/features/projects" },
          { text: "Canisters", link: "/features/canisters" },
          { text: "Identities", link: "/features/identities" },
          { text: "Cycles", link: "/features/cycles" },
          { text: "Network", link: "/features/network" },
          { text: "Logs", link: "/features/logs" },
          { text: "About", link: "/features/about" },
          { text: "Settings", link: "/features/settings" },
        ],
      },
      {
        text: "Guides",
        items: [
          {
            text: "How To Top Up Canister",
            link: "#",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/tolgayayci/dfx-dashboard" },
    ],
  },

  head: [
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-GGBTXG323V",
      },
    ],
    [
      "script",
      {},
      ` window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-GGBTXG323V');`,
    ],
  ],
});
