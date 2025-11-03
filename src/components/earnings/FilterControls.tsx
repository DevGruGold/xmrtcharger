import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { EarningsTransaction } from '@/hooks/useEarningsData';

interface FilterControlsProps {
  dateRange: 'all' | '7d' | '30d';
  onDateRangeChange: (range: 'all' | '7d' | '30d') => void;
  transactions: EarningsTransaction[];
}

export const FilterControls = ({ dateRange, onDateRangeChange, transactions }: FilterControlsProps) => {
  const exportToCSV = () => {
    const headers = ['Date', 'Amount', 'Type', 'Base Amount', 'Multiplier', 'Battery Level', 'Elapsed Time', 'Session ID'];
    const rows = transactions.map(tx => [
      new Date(tx.created_at).toISOString(),
      tx.amount.toFixed(4),
      tx.transaction_type,
      tx.metadata?.base_amount?.toFixed(4) || '0',
      tx.multiplier?.toFixed(2) || '1',
      tx.metadata?.battery_level || 'N/A',
      tx.metadata?.elapsed_seconds || '0',
      tx.session_id || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xmrt-earnings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-2">
        <Button
          variant={dateRange === '7d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onDateRangeChange('7d')}
        >
          Last 7 Days
        </Button>
        <Button
          variant={dateRange === '30d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onDateRangeChange('30d')}
        >
          Last 30 Days
        </Button>
        <Button
          variant={dateRange === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onDateRangeChange('all')}
        >
          All Time
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={exportToCSV}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};
