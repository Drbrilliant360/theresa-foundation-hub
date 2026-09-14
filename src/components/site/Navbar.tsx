import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/impact", label: "Impact" },
  { to: "/tshirts", label: "T-Shirts" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close the menu on navigation and lock background scroll while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:flex lg:justify-between lg:gap-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img
            src={logoAsset.url}
            alt="Mama Thereza Karungi Foundation logo"
            className="size-9 shrink-0 object-contain sm:size-10"
          />
          <span className="min-w-0 font-display text-sm font-semibold leading-tight sm:text-base lg:text-lg">
            <span className="sm:hidden">Karungi Foundation</span>
            <span className="hidden truncate sm:inline">Mama Thereza Karungi Foundation</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-primary font-semibold" }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/auth" search={{ mode: "register" }}>
                  Register
                </Link>
              </Button>
            </>
          )}
          <Button
            asChild
            size="sm"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Link to="/donate">Donate Now</Link>
          </Button>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <Button
            asChild
            size="sm"
            className="hidden bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:inline-flex"
          >
            <Link to="/donate">Donate</Link>
          </Button>
          <button
            type="button"
            className="grid size-10 shrink-0 place-items-center rounded-md text-foreground hover:bg-muted"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      </header>

      {/* Mobile slide-out */}
      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-40 overflow-hidden lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-foreground/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
          aria-hidden
        />
        <div
          className={`absolute right-0 top-0 h-full w-[82%] max-w-xs overflow-y-auto border-l border-border bg-background shadow-[var(--shadow-lift)] transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >

        <nav className="flex flex-col gap-1 p-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-muted text-primary font-semibold" }}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base text-foreground hover:bg-muted"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t border-border p-4">
          {user ? (
            <>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin" onClick={() => setOpen(false)}>
                    Admin
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link
                  to="/auth"
                  search={{ mode: "register" }}
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link>
              </Button>
            </>
          )}
          <Button
            asChild
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Link to="/donate" onClick={() => setOpen(false)}>
              Donate Now
            </Link>
          </Button>
        </div>
        </div>
      </div>
    </>
  );
}
