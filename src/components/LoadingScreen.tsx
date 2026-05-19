import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[var(--background)]"
        >
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
          >
            <div className="absolute -inset-12 rounded-full bg-[var(--royal)] opacity-40 blur-3xl animate-glow-pulse" />
            <div className="relative h-28 w-28 rounded-2xl bg-[var(--royal)] led-glow-blue grid place-items-center">
              <div className="absolute inset-[3px] rounded-[14px] bg-gradient-to-br from-[var(--navy)] to-black grid place-items-center">
                <span className="font-display text-3xl font-bold text-gradient-gold text-glow-gold animate-flicker">RM</span>
              </div>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
              className="mt-6 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
            />
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Illuminating
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
