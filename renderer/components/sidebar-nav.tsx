import Link from "next/link";
import { useRouter } from "next/router";
import {
  HomeIcon,
  CubeIcon,
  PersonIcon,
  GlobeIcon,
  ActivityLogIcon,
  MagnifyingGlassIcon,
  GitHubLogoIcon,
  CodeIcon,
} from "@radix-ui/react-icons";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import ProjectSwitcher from "@components/projects/project-switcher";

const sidebarNavItems = [
  {
    title: "Home",
    href: "/home",
    icon: <HomeIcon />,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: <CodeIcon />,
  },
  {
    title: "Identities",
    href: "/identities",
    icon: <PersonIcon />,
  },
  {
    title: "Network",
    href: "/network",
    icon: <GlobeIcon />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <MagnifyingGlassIcon />,
  },
  {
    title: "Canisters",
    href: "/canisters",
    icon: <CubeIcon />,
  },
  {
    title: "Dfx ",
    href: "/dfx",
    icon: <ActivityLogIcon />,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex flex-col justify-between h-full border-r border-gray",
        className
      )}
    >
      <div className="space-y-4">
        <div className="px-3">
          <div className="space-y-1 pt-4">
            {sidebarNavItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <Button
                  key={item.href}
                  variant={
                    router.pathname === item.href ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                >
                  <div className="mr-4 h-4 w-4">{item.icon}</div>
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="pl-3 pr-2 mb-4">
        <ProjectSwitcher />
        <div>
          <p className="text-xs text-center mt-3">DFX CLI GUI v0.1</p>
        </div>
      </div>
    </div>
  );
}
