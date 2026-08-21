import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, X } from "lucide-react";
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


  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Heart className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold">Theresa Foundation</span>
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
          <Button asChild size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link to="/donate">Donate Now</Link>
          </Button>
        </div>


        <button
          className="lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Button asChild variant="outline">
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="outline">
                      <Link to="/admin" onClick={() => setOpen(false)}>
                        Admin
                      </Link>
                    </Button>
                  )}
                </>
              ) : (
                <Button asChild variant="outline">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Login / Register
                  </Link>
                </Button>
              )}
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to="/donate" onClick={() => setOpen(false)}>
                  Donate Now
                </Link>
              </Button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
