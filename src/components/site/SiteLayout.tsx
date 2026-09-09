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
  background,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  background?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-surface py-10 sm:py-14">
      {background && (
        <>
          <img
            src={background}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </>
      )}
      <div className={`container-page relative ${background ? "text-primary-foreground" : ""}`}>
        {eyebrow && (
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              background ? "text-accent" : "text-secondary"
            }`}
          >
            {eyebrow}
          </span>
        )}
        <h1
          className={`mt-2 text-3xl font-bold sm:text-4xl ${
            background ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`mt-3 max-w-2xl text-sm sm:text-base ${
              background ? "text-primary-foreground/85" : "text-muted-foreground"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
