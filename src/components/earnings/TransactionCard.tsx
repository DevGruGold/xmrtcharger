import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EarningsTransaction } from '@/hooks/useEarningsData';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionCardProps {
  transaction: EarningsTransaction;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getTypeColor = (type: string) => {
    if (type.includes('combined')) return 'bg-primary/10 text-primary';
    if (type.includes('time')) return 'bg-battery-high/10 text-battery-high';
    return 'bg-secondary text-secondary-foreground';
  };

  const metadata = transaction.metadata || {};
  const xmrContribution = metadata.xmr_contribution;

  return (
    <Card className="corporate-shadow hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl font-bold text-primary">
                +{transaction.amount.toFixed(4)} XMRT
              </div>
              <Badge className={getTypeColor(transaction.transaction_type)}>
                {transaction.transaction_type.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(transaction.created_at), 'MMM d, yyyy \'at\' h:mm a')}
              {metadata.elapsed_seconds && (
                <span className="ml-2">• Session {formatDuration(metadata.elapsed_seconds)}</span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4 border-t">
          {/* Base Calculation */}
          {metadata.base_amount !== undefined && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">📊 Base Calculation</h4>
              <div className="text-sm text-muted-foreground space-y-1 pl-4">
                {metadata.elapsed_seconds && (
                  <div>Elapsed time: {metadata.elapsed_seconds} seconds ({formatDuration(metadata.elapsed_seconds)})</div>
                )}
                <div>Base rate: 1.0 XMRT per 60 seconds</div>
                <div className="font-medium text-foreground">Base amount: {metadata.base_amount.toFixed(4)} XMRT</div>
              </div>
            </div>
          )}

          {/* Multipliers */}
          {transaction.multiplier && transaction.multiplier > 1 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">⚡ Multipliers Applied</h4>
              <div className="text-sm text-muted-foreground space-y-1 pl-4">
                {metadata.is_charging && <div>✓ Charging bonus: +20%</div>}
                {metadata.max_mode_enabled && <div>✓ MAX mode: +30%</div>}
                {metadata.device_count && metadata.device_count > 1 && (
                  <div>✓ Multi-device: +{((metadata.device_count - 1) * 10)}%</div>
                )}
                <div className="font-medium text-foreground">
                  Total multiplier: {transaction.multiplier.toFixed(2)}x
                </div>
              </div>
            </div>
          )}

          {/* Bonuses */}
          {metadata.bonuses && metadata.bonuses.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">🎁 Bonuses Breakdown</h4>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                {metadata.bonuses.map((bonus, idx) => (
                  <li key={idx}>• {bonus}</li>
                ))}
              </ul>
            </div>
          )}

          {/* XMR Mining Contribution */}
          {xmrContribution && (
            <div>
              <h4 className="text-sm font-semibold mb-2">⛏️ Mining Contribution</h4>
              <div className="text-sm text-muted-foreground space-y-1 pl-4">
                <div>XMR mined: {xmrContribution.xmr_mined.toFixed(8)} XMR</div>
                <div>Conversion rate: {xmrContribution.conversion_rate.toFixed(0)} XMRT per XMR</div>
                <div className="font-medium text-foreground">
                  XMRT from mining: +{xmrContribution.xmrt_from_xmr.toFixed(4)} XMRT
                </div>
                <div>Worker ID: {xmrContribution.worker_id}</div>
              </div>
            </div>
          )}

          {/* Device & Session Info */}
          <div>
            <h4 className="text-sm font-semibold mb-2">📱 Device & Session Info</h4>
            <div className="text-sm text-muted-foreground space-y-1 pl-4">
              {metadata.battery_level !== undefined && (
                <div>Battery level: {metadata.battery_level}%</div>
              )}
              {metadata.device_count && (
                <div>Active devices: {metadata.device_count}</div>
              )}
              {transaction.session_id && (
                <div className="flex items-center gap-2">
                  <span>Session: {transaction.session_id.slice(0, 8)}...{transaction.session_id.slice(-8)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleCopy(transaction.session_id!, 'session')}
                  >
                    {copiedField === 'session' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}
              {transaction.device_id && (
                <div className="flex items-center gap-2">
                  <span>Device: {transaction.device_id.slice(0, 8)}...{transaction.device_id.slice(-8)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleCopy(transaction.device_id!, 'device')}
                  >
                    {copiedField === 'device' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Reason */}
          {transaction.reason && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground italic">{transaction.reason}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
