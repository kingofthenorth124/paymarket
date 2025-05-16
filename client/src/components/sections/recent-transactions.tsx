import { Link } from "wouter";
import { Transaction } from "@shared/schema";
import TransactionItem from "@/components/transaction-item";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Get the most recent 4 transactions
  const recentTransactions = transactions.slice(0, 4);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-inter font-bold text-2xl md:text-3xl text-primary mb-8">Recent Transactions</h2>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          )}
          
          <div className="p-4 bg-background/50">
            <Link href="/wallet" className="text-secondary hover:text-secondary/80 font-inter font-medium flex items-center justify-center">
              View All Transactions 
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="ml-2" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
