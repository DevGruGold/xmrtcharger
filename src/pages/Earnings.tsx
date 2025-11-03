import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEarningsData } from '@/hooks/useEarningsData';
import { EarningsSummary } from '@/components/earnings/EarningsSummary';
import { TransactionCard } from '@/components/earnings/TransactionCard';
import { EarningsChart } from '@/components/earnings/EarningsChart';
import { FilterControls } from '@/components/earnings/FilterControls';

const Earnings = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d'>('all');
  const { transactions, summary, isLoading } = useEarningsData(dateRange);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">XMRT Earnings History</h1>
          <p className="text-muted-foreground">
            Complete breakdown of your rewards, bonuses, and mining contributions
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading your earnings...</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No earnings yet</p>
            <p className="text-sm text-muted-foreground">
              Start charging your device to earn XMRT tokens!
            </p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <EarningsSummary summary={summary} />

            {/* Charts */}
            <EarningsChart transactions={transactions} />

            {/* Filter Controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Transaction History</h2>
              <FilterControls
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                transactions={transactions}
              />
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Earnings;
