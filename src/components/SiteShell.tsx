import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { SpotlightCursor } from "./SpotlightCursor";
import { WhatsAppFloating } from "./WhatsAppFloating";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SpotlightCursor />
      <WhatsAppFloating />
      <SiteHeader />
      <main className="pt-28 animate-fadein">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

