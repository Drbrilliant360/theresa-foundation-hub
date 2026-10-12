import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Megaphone,
  HandCoins,
  Shirt,
  Package,
  Users,
  MessageSquare,
  FileText,
  LogOut,
  Home,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { signOut } from "@/hooks/useAuth";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/campaigns", label: "Campaigns", icon: Megaphone, exact: false },
  { to: "/admin/donations", label: "Donations", icon: HandCoins, exact: false },
  { to: "/admin/tshirts", label: "T-Shirts", icon: Shirt, exact: false },
  { to: "/admin/orders", label: "Orders", icon: Package, exact: false },
  { to: "/admin/users", label: "Users", icon: Users, exact: false },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare, exact: false },
  { to: "/admin/content", label: "Content", icon: FileText, exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const currentPage = nav.find((item) => item.exact ? pathname === item.to : pathname.startsWith(item.to));

  return (
    <div className="admin-workspace flex min-h-dvh min-w-0 bg-surface">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background p-4 lg:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="size-4" />
          </span>
          <span className="font-display font-semibold">Admin Panel</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "bg-primary/10 text-primary font-medium" }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 flex flex-col gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <Home className="mr-2 size-4" /> View site
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await signOut();
              navigate({ to: "/auth", replace: true });
            }}
          >
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background px-4 py-2 lg:hidden">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Admin Panel</p>
            <p className="truncate font-display font-semibold">{currentPage?.label ?? "Overview"}</p>
          </div>
          <Button variant="outline" size="icon" className="size-11 shrink-0" aria-label="Open admin menu" onClick={() => setMenuOpen(true)}>
            <Menu />
          </Button>
        </header>
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle>Admin Panel</DialogTitle></DialogHeader>
            <nav aria-label="Admin navigation" className="grid grid-cols-2 gap-2">
              {nav.map((item) => (
                <Link key={item.to} to={item.to} activeOptions={{ exact: item.exact }} activeProps={{ className: "bg-primary/10 text-primary font-semibold" }} onClick={() => setMenuOpen(false)} className="flex min-h-12 min-w-0 items-center gap-2 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-muted">
                  <item.icon className="size-4 shrink-0" /><span className="truncate">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Button asChild variant="outline" className="min-h-11"><Link to="/" onClick={() => setMenuOpen(false)}><Home />View site</Link></Button>
              <Button variant="ghost" className="min-h-11" onClick={async () => { await signOut(); setMenuOpen(false); navigate({ to: "/auth", replace: true }); }}><LogOut />Sign out</Button>
            </div>
          </DialogContent>
        </Dialog>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0 [&>button]:w-full sm:[&>button]:w-auto">{action}</div>}
    </div>
  );
}
