import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TokenEarnedAnimationProps {
  amount: number;
  isVisible: boolean;
  onComplete?: () => void;
}

export const TokenEarnedAnimation = ({ 
  amount, 
  isVisible, 
  onComplete 
}: TokenEarnedAnimationProps) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: -100, scale: 1 }}
          exit={{ opacity: 0, y: -200, scale: 0.5 }}
          transition={{ 
            duration: 2,
            ease: [0.25, 0.1, 0.25, 1] 
          }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 blur-2xl opacity-60 bg-gradient-to-r from-primary via-secondary to-accent animate-pulse" />
            
            {/* Main text */}
            <div className="relative bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-6xl font-bold tracking-tight">
              +{amount.toFixed(2)} XMRT
            </div>
            
            {/* Sparkle effects */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-4 -right-4 text-4xl"
            >
              ✨
            </motion.div>
            
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.3
              }}
              className="absolute -bottom-4 -left-4 text-3xl"
            >
              💎
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
