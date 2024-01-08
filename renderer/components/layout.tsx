// Import necessary components and hooks
import * as React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { SideNav } from "@components/sidebar-nav";
import { ThemeProvider } from "@components/theme-provider";
import { ModeToggle } from "@components/toggle-mode";
import IdentitySwitcher from "@components/identities/identity-switcher";
import ProjectSwitcher from "./projects/project-switcher";
import { Toaster } from "@components/ui/toaster";
import { cn } from "@lib/utils";
import { TooltipProvider } from "@components/ui/tooltip";
import { Separator } from "@components/ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";

import {
  HomeIcon,
  DatabaseIcon,
  NetworkIcon,
  CircuitBoardIcon,
  SettingsIcon,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  // Set initial layout and collapsed state
  const defaultLayout = [15, 85];
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navCollapsedSize = 4;

  const handleCollapse = React.useCallback(() => {
    setIsCollapsed((prevState) => !prevState); // Toggle the collapsed state
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
      isCollapsed
    )}`;
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="h-screen flex flex-col">
        <header className="flex flex-row items-center space-x-2 py-4 w-full justify-between border-b px-4">
          <Image
            src="/images/icp-logo.svg"
            width={50}
            height={20}
            alt="icp_logo"
          />
          <div className="flex flex-row space-x-2">
            <IdentitySwitcher />
            <ModeToggle />
          </div>
        </header>
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes
              )}`;
            }}
            className="h-full items-stretch"
          >
            <ResizablePanel
              defaultSize={defaultLayout[0]}
              collapsedSize={navCollapsedSize}
              collapsible={true}
              minSize={10}
              maxSize={15}
              onCollapse={handleCollapse}
              className={cn(
                isCollapsed &&
                  "min-w-[50px] transition-all duration-300 ease-in-out"
              )}
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <SideNav
                    isCollapsed={isCollapsed}
                    links={[
                      {
                        title: "Home",
                        label: "",
                        href: "/home",
                        icon: HomeIcon,
                        variant: router.pathname.startsWith("/home")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "Projects",
                        label: "",
                        href: "/projects",
                        icon: DatabaseIcon,
                        variant: router.pathname.startsWith("/projects")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "Canisters",
                        label: "",
                        href: "/canisters",
                        icon: HomeIcon,
                        variant: router.pathname.startsWith("/canisters")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "Identities",
                        label: "",
                        href: "/identities",
                        icon: CircuitBoardIcon,
                        variant: router.pathname.startsWith("/identities")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "Network",
                        label: "",
                        href: "/network",
                        icon: NetworkIcon,
                        variant: router.pathname.startsWith("/network")
                          ? "default"
                          : "ghost",
                      },
                      {
                        title: "Settings",
                        label: "",
                        href: "/settings",
                        icon: SettingsIcon,
                        variant: router.pathname.startsWith("/settings")
                          ? "default"
                          : "ghost",
                      },
                    ]}
                  />
                  <Separator />
                </div>

                <div
                  className={cn(
                    "flex h-[52px] items-center justify-center mb-2",
                    isCollapsed ? "h-[52px]" : "px-2"
                  )}
                >
                  <ProjectSwitcher />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[1]} className="p-4">
              <main>{children}</main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
