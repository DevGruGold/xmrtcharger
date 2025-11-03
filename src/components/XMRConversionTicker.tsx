import { Card } from '@/components/ui/card';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { Bitcoin, Zap, TrendingUp } from 'lucide-react';
import { useMiningStatus } from '@/hooks/useMiningStatus';

interface XMRConversionTickerProps {
  deviceId: string | null;
  sessionId: string | null;
}

const AnimatedNumber = ({ value, decimals = 2, prefix = '', suffix = '' }: { 
  value: number; 
  decimals?: number; 
  prefix?: string; 
  suffix?: string;
}) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (latest) => 
    `${prefix}${latest.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

export const XMRConversionTicker = ({ deviceId, sessionId }: XMRConversionTickerProps) => {
  const { miningStats, isLoading } = useMiningStatus({ deviceId, sessionId });

  if (!miningStats.isActive || isLoading) {
    return null;
  }

  const conversionRate = 1000;

  return (
    <Card className="p-4 border-[hsl(var(--xmr-orange))] bg-gradient-to-br from-card to-[hsl(var(--xmr-orange))]/5">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bitcoin className="h-4 w-4 text-[hsl(var(--xmr-orange))]" />
          <span className="text-foreground">XMR Mining → XMRT Conversion (Live)</span>
        </div>

        {/* Main Equation */}
        <div className="flex items-center justify-center gap-3 py-2">
          {/* XMR Mined */}
          <div className="text-center">
            <motion.div 
              className="text-2xl font-bold text-[hsl(var(--xmr-orange))]"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AnimatedNumber value={miningStats.xmrMined} decimals={8} suffix=" XMR" />
            </motion.div>
            <div className="text-xs text-muted-foreground mt-0.5">Mined</div>
          </div>

          {/* Multiplication */}
          <div className="text-2xl font-bold text-muted-foreground px-2">×</div>

          {/* Conversion Rate */}
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {conversionRate}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Rate</div>
          </div>

          {/* Equals */}
          <div className="text-2xl font-bold text-muted-foreground px-2">=</div>

          {/* XMRT Earned */}
          <div className="text-center">
            <motion.div 
              className="text-2xl font-bold text-primary"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <AnimatedNumber value={miningStats.xmrtFromMining} decimals={4} suffix=" XMRT" />
            </motion.div>
            <div className="text-xs text-muted-foreground mt-0.5">Bonus</div>
          </div>
        </div>

        {/* Mining Stats */}
        <div className="flex items-center justify-between text-xs border-t border-border pt-2">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-[hsl(var(--xmr-orange))]" />
            <span className="text-muted-foreground">Hashrate:</span>
            <span className="font-medium text-foreground">
              <AnimatedNumber value={miningStats.hashrate / 1000} decimals={1} suffix=" KH/s" />
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">Shares:</span>
            <span className="font-medium text-foreground">
              <AnimatedNumber value={miningStats.shares} decimals={0} />
            </span>
          </div>

          <div className="text-muted-foreground">
            Worker: <span className="font-mono text-foreground">{miningStats.workerId}</span>
          </div>
        </div>

        {/* Info Text */}
        <div className="text-xs text-center text-muted-foreground pt-1">
          Mining bonus: <span className="text-primary font-medium">+50%</span> XMRT while charging
        </div>
      </div>
    </Card>
  );
};
