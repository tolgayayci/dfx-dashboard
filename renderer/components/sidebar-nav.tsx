import Link from "next/link";
import {
  HomeIcon,
  CubeIcon,
  PersonIcon,
  GlobeIcon,
  ActivityLogIcon,
  MagnifyingGlassIcon,
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
    title: "Canisters",
    href: "/canisters",
    icon: <CubeIcon />,
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
    title: "Logs",
    href: "/logs",
    icon: <ActivityLogIcon />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <MagnifyingGlassIcon />,
  },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 border-r border-gray">
        <div className="px-3">
          <div className="space-y-1 pt-4">
            {sidebarNavItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <div className="mr-4 h-4 w-4">{item.icon}</div>
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <ProjectSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
