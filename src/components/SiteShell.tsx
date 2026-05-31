import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "@tanstack/react-router";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { SpotlightCursor } from "./SpotlightCursor";

export function SiteShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <>
      <SpotlightCursor />
      <SiteHeader />
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="pt-28"
      >
        {children}
      </motion.main>
      <SiteFooter />
    </>
  );
}
