import Image from "next/image";
import { Sidebar } from "@components/sidebar-nav";
import { ThemeProvider } from "@components/theme-provider";
import { ModeToggle } from "@components/toggle-mode";
import IdentitySwitcher from "@components/identities/identity-switcher";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="h-screen grid grid-rows-[auto_1fr]">
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

          <div className="grid grid-cols-[1fr_4fr] w-full h-full">
            <Sidebar />
            <div className="p-8">{children}</div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
