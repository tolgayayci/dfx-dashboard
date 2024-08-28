---
layout: home

hero:
  name: "DFX Dashboard"
  text: "Streamline Your Internet Computer Development"
  tagline: Manage projects, canisters, and cycles with ease using our intuitive GUI
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
    details: Create, import, and manage all your Internet Computer projects from a single intuitive interface.
  - icon: 🚀
    title: Effortless Canister Control
    details: Deploy, monitor, and interact with your canisters using a user-friendly GUI, no command line required.
  - icon: 🔑
    title: Simplified Identity Management
    details: Easily create, import, and switch between multiple identities for secure and efficient development.
  - icon: 💰
    title: Integrated Cycle Management
    details: Monitor cycle balances, convert ICP to cycles, and top up canisters directly from the dashboard.
  - icon: 🌐
    title: Visual Network Configuration
    details: Configure and manage your dfx networks with a clear, visual interface for easy customization.
  - icon: 📊
    title: Comprehensive Logging
    details: Track your development history with detailed logs of all dashboard operations for easy troubleshooting.
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