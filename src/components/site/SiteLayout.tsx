import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-surface py-10 sm:py-14">
      <div className="container-page">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
        )}
      </div>
    </section>
  );
}
