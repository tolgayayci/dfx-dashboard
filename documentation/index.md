---
layout: home

hero:
  name: "DFX Dashboard"
  text: "Streamline Your Internet Computer Development"
  tagline: Manage projects, canisters, cycles, and NNS interactions with our professional GUI for dfx 0.25.0
  image:
    src: /features/canisters/canister-actions.png
    alt: DFX Dashboard Interface
  actions:
    - theme: brand
      text: Quick Start
      link: /getting-started/quick-start
    - theme: alt
      text: Installation Guide
      link: /getting-started/installation

features:
  - icon: 🏗️
    title: Unified Project Management
    details: Create, import, and manage all your Internet Computer projects from a single intuitive interface with dfx 0.25.0 support.
  - icon: 🚀
    title: Advanced Canister Control
    details: Deploy, monitor, and interact with both user and NNS canisters using our professional GUI with advanced filtering and metadata display.
  - icon: 🌐
    title: NNS Integration
    details: Query and interact with Network Nervous System canisters directly from the dashboard with dedicated method calling interfaces.
  - icon: 🔑
    title: Simplified Identity Management
    details: Easily create, import, and switch between multiple identities for secure and efficient development workflows.
  - icon: 💰
    title: Professional Cycle Management
    details: Complete cycles workflow with balance checking, transfers, approvals, ICP conversion, and faucet operations in a modern tabbed interface.
  - icon: ⚙️
    title: Smart Shell Completion
    details: Auto-configure dfx shell completion with one-click setup for bash, zsh, and fish shells, or use manual instructions.
  - icon: 🌐
    title: Visual Network Configuration
    details: Configure and manage your dfx networks with a clear, visual interface for local, IC, and custom network management.
  - icon: 📊
    title: Comprehensive Logging
    details: Track your development history with detailed logs of all dashboard operations for easy troubleshooting and debugging.
---

<style>
:root {
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

.VPHero .text {
  font-size: clamp(24px, 5vw, 48px) !important;
  line-height: 1.2 !important;
  margin-top: 15px !important;
  margin-bottom: 5px !important;
}

.VPHero .name {
  font-size: clamp(36px, 6vw, 64px) !important;
}

.VPHero .tagline {
  font-size: clamp(16px, 3vw, 20px) !important;
}

.VPHero .image-bg {
  opacity: 0.8;
  transition: opacity 1s ease;
}

.VPHero .image-container {
  transform: scale(1.2);
  transition: transform 0.4s ease;
}

.VPHero .image-container img {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  max-width: 80%;
  height: auto;
}

@media (max-width: 960px) {
  .VPHero .image-container {
    transform: scale(1);
  }
  
  .VPHero:hover .image-container {
    transform: scale(1.1);
  }
}

.VPHero:hover .image-bg {
  opacity: 0.2;
}

.VPHero:hover .image-container {
  transform: scale(1.25);
}
</style>