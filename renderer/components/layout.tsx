import { Sidebar } from "@components/sidebar-nav";
import { ThemeProvider } from "@components/theme-provider";
import { ModeToggle } from "@components/toggle-mode";
import TeamSwitcher from "@components/team-switcher";

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
        <div className="hidden space-y-2 md:block">
          <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0">
            <div className="grid lg:grid-cols-5 w-full">
              <div className="col-span-5">
                <header className="flex flex-row space-x-2 py-4 w-full justify-end border-b px-4">
                  {" "}
                  <TeamSwitcher />
                  <ModeToggle />
                </header>
              </div>
              <div className="col-span-1 h-full">
                <Sidebar />
              </div>
              <div className="col-span-4 h-full">{children}</div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
