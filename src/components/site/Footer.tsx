import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground p-1">
              <img src={logoAsset.url} alt="Mama Thereza Karungi Foundation logo" className="size-full object-contain" />
            </span>
            <span className="font-display text-lg font-semibold">Mama Thereza Karungi Foundation</span>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Empowering communities across Tanzania through education, healthcare and
            sustainable development since 2012.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide opacity-90">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/campaigns">Campaigns</Link></li>
            <li><Link to="/impact">Our impact</Link></li>
            <li><Link to="/tshirts">T-Shirts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide opacity-90">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm opacity-80">
            <li className="flex gap-2"><MapPin className="size-4 shrink-0" /> Igabiro–Bunyagongo, Nshamba, Muleba District, Kagera, Tanzania</li>
            <li className="flex gap-2"><Phone className="size-4 shrink-0" /> +255 759 815 234</li>
            <li className="flex gap-2"><Mail className="size-4 shrink-0" /> hello@theresafoundation.org</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide opacity-90">Newsletter</h4>
          <p className="mt-4 text-sm opacity-80">Stories of impact, straight to your inbox.</p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thanks for subscribing!");
              (e.currentTarget as HTMLFormElement).reset();
            }}
          >
            <Input
              type="email"
              required
              placeholder="you@email.com"
              className="border-primary-foreground/25 bg-primary-foreground/10 placeholder:text-primary-foreground/50"
            />
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Join
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container-page py-5 text-xs opacity-70">
          © {new Date().getFullYear()} Theresa Foundation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
