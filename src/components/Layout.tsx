import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard, CreditCard, BarChart3, Settings, Search } from "lucide-react";
import { ROUTE_PATHS } from "@/lib/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { path: ROUTE_PATHS.DASHBOARD, label: "แดชบอร์ด", icon: LayoutDashboard },
  { path: ROUTE_PATHS.SUBSCRIPTIONS, label: "การสมัครสมาชิก", icon: CreditCard },
  { path: ROUTE_PATHS.ANALYTICS, label: "การวิเคราะห์", icon: BarChart3 },
  { path: ROUTE_PATHS.SETTINGS, label: "การตั้งค่า", icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-sidebar px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-2xl font-bold text-sidebar-primary">SubTracker</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all duration-200 ${
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">เปิดเมนู</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-16 shrink-0 items-center px-6">
                <h1 className="text-2xl font-bold text-primary">SubTracker</h1>
              </div>
              <nav className="flex flex-1 flex-col px-6 pb-4">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigationItems.map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all duration-200 ${
                                isActive
                                  ? "bg-accent text-accent-foreground shadow-sm"
                                  : "text-foreground hover:bg-accent/50 hover:text-accent-foreground"
                              }`
                            }
                          >
                            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                ค้นหา
              </label>
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                id="search-field"
                className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm"
                placeholder="ค้นหาการสมัครสมาชิก..."
                type="search"
                name="search"
              />
            </form>
          </div>
        </header>

        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
