import { useQuery, useMutation } from "@tanstack/react-query";
import { Wallet, Transaction } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TransactionItem from "@/components/transaction-item";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownToLine, ArrowUpToLine, Copy, CreditCard, Wallet as WalletIcon } from "lucide-react";

const depositSchema = z.object({
  amount: z.coerce.number().min(10, "Minimum deposit is $10").max(10000, "Maximum deposit is $10,000"),
});

const withdrawSchema = z.object({
  amount: z.coerce.number().min(10, "Minimum withdrawal is $10"),
  address: z.string().min(1, "Blockchain address is required"),
});

export default function WalletPage() {
  const { toast } = useToast();
  
  const { data: wallet, isLoading: walletLoading } = useQuery<Wallet>({
    queryKey: ["/api/wallet"],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const depositForm = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 100,
    },
  });

  const withdrawForm = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 50,
      address: "",
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (data: z.infer<typeof depositSchema>) => {
      const res = await apiRequest("POST", "/api/wallet/deposit", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Deposit Successful",
        description: `$${depositForm.getValues().amount} has been added to your wallet.`,
        variant: "success",
      });
      depositForm.reset({ amount: 100 });
    },
    onError: (error: Error) => {
      toast({
        title: "Deposit Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (data: z.infer<typeof withdrawSchema>) => {
      const res = await apiRequest("POST", "/api/wallet/withdraw", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal request has been submitted.`,
        variant: "success",
      });
      withdrawForm.reset({ amount: 50, address: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDepositSubmit = (values: z.infer<typeof depositSchema>) => {
    depositMutation.mutate(values);
  };

  const onWithdrawSubmit = (values: z.infer<typeof withdrawSchema>) => {
    withdrawMutation.mutate(values);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wallet</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {walletLoading ? (
            <Skeleton className="h-72 w-full rounded-xl" />
          ) : (
            <Card className="bg-gradient-to-br from-accent to-accent/80 text-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Digital Wallet</CardTitle>
                  <WalletIcon size={24} />
                </div>
                <CardDescription className="text-white/80">
                  Manage your funds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-sm text-white/80 mb-1">Total Balance</div>
                  <div className="font-mono font-medium text-3xl">${wallet?.balance.toFixed(2)}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm text-white/80 mb-1">Income</div>
                    <div className="font-mono font-medium text-success text-xl">+${wallet?.totalIncome.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm text-white/80 mb-1">Expenses</div>
                    <div className="font-mono font-medium text-warning text-xl">-${wallet?.totalExpenses.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="text-sm text-white/80 mb-1">Wallet Address</div>
                    <div className="font-mono text-sm truncate max-w-[150px]">{wallet?.address}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white" 
                    onClick={() => {
                      navigator.clipboard.writeText(wallet?.address || "");
                      toast({
                        title: "Address Copied",
                        variant: "default",
                      });
                    }}
                  >
                    <Copy size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Fund Management</CardTitle>
              <CardDescription>
                Deposit funds or withdraw to your blockchain wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="deposit">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="deposit">Deposit</TabsTrigger>
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                </TabsList>
                
                <TabsContent value="deposit" className="mt-4">
                  <Form {...depositForm}>
                    <form onSubmit={depositForm.handleSubmit(onDepositSubmit)} className="space-y-4">
                      <FormField
                        control={depositForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (USD)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                <Input type="number" className="pl-7" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-secondary hover:bg-secondary/90"
                        disabled={depositMutation.isPending}
                      >
                        <ArrowDownToLine className="mr-2 h-4 w-4" />
                        {depositMutation.isPending ? "Processing..." : "Deposit Funds"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="withdraw" className="mt-4">
                  <Form {...withdrawForm}>
                    <form onSubmit={withdrawForm.handleSubmit(onWithdrawSubmit)} className="space-y-4">
                      <FormField
                        control={withdrawForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (USD)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                <Input type="number" className="pl-7" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={withdrawForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blockchain Address</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter blockchain address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={withdrawMutation.isPending || (wallet?.balance || 0) < withdrawForm.getValues().amount}
                      >
                        <ArrowUpToLine className="mr-2 h-4 w-4" />
                        {withdrawMutation.isPending ? "Processing..." : "Withdraw Funds"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Transaction History</CardTitle>
                <Button variant="outline" size="sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
              </div>
              <CardDescription>
                Your recent financial activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="divide-y">
                  {transactions.map(transaction => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground">Your transaction history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
