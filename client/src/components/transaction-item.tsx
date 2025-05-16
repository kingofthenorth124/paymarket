import { Transaction } from "@shared/schema";
import { ArrowDownToLine, ArrowUpToLine, CreditCard, ShoppingBag, RefreshCw } from "lucide-react";

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  // Format date
  const formattedDate = new Date(transaction.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Determine transaction type icon and class
  const getTransactionTypeDetails = (type: string) => {
    switch (type) {
      case 'deposit':
        return {
          icon: <ArrowDownToLine />,
          bgColor: 'bg-success/10',
          iconColor: 'text-success',
          amountPrefix: '+',
          amountColor: 'text-success'
        };
      case 'withdraw':
        return {
          icon: <ArrowUpToLine />,
          bgColor: 'bg-warning/10',
          iconColor: 'text-warning',
          amountPrefix: '-',
          amountColor: 'text-warning'
        };
      case 'purchase':
        return {
          icon: <ShoppingBag />,
          bgColor: 'bg-primary/10',
          iconColor: 'text-primary',
          amountPrefix: '-',
          amountColor: 'text-warning'
        };
      case 'refund':
        return {
          icon: <RefreshCw />,
          bgColor: 'bg-accent/10',
          iconColor: 'text-accent',
          amountPrefix: '+',
          amountColor: 'text-success'
        };
      default:
        return {
          icon: <CreditCard />,
          bgColor: 'bg-accent/10',
          iconColor: 'text-accent',
          amountPrefix: '',
          amountColor: 'text-accent'
        };
    }
  };

  // Get transaction details
  const transactionType = getTransactionTypeDetails(transaction.type);

  // Format transaction description
  const getTransactionTitle = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Wallet Deposit';
      case 'withdraw':
        return 'Wallet Withdrawal';
      case 'purchase':
        return 'Product Purchase';
      case 'refund':
        return 'Refund';
      default:
        return 'Transaction';
    }
  };

  const title = transaction.description || getTransactionTitle(transaction.type);

  return (
    <div className="border-b border-neutral-100 p-4 hover:bg-neutral-100/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${transactionType.bgColor} w-10 h-10 rounded-full flex items-center justify-center mr-4`}>
            <div className={transactionType.iconColor}>
              {transactionType.icon}
            </div>
          </div>
          <div>
            <div className="font-inter font-medium text-primary">{title}</div>
            <div className="text-sm text-neutral-300">{formattedDate}</div>
          </div>
        </div>
        <div className={`font-mono font-medium ${transactionType.amountColor}`}>
          {transactionType.amountPrefix}${transaction.amount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
