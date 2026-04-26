import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) setTimeout(() => setVisible(true), 2000);
  }, []);

  const accept = () => { localStorage.setItem('cookies-accepted', 'true'); setVisible(false); };
  const decline = () => { localStorage.setItem('cookies-accepted', 'false'); setVisible(false); };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border p-4 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">We use cookies to improve your experience on our site.</p>
            <div className="flex gap-2">
              <Button variant="cta" size="sm" onClick={accept}>Accept</Button>
              <Button variant="outline" size="sm" onClick={decline}>Decline</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
