import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex min-h-screen bg-surface">
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

      <div className="flex-1">
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-background px-3 py-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "bg-primary/10 text-primary" }}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="p-4 lg:p-8">{children}</main>
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
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
