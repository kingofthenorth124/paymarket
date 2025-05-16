import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Wallet } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function WalletOverview() {
  const { user } = useAuth();
  
  const { data: wallet, isLoading } = useQuery<Wallet>({
    queryKey: ["/api/wallet"],
    enabled: !!user,
  });

  return (
    <section className="py-12 bg-gradient-to-r from-accent to-accent/90 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="font-inter font-bold text-2xl md:text-3xl mb-4">
              Manage Your Finances in One Place
            </h2>
            <p className="font-sf text-lg mb-6 opacity-90">
              Our integrated digital wallet helps you track transactions, manage payments, and store funds securely.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                <>
                  <Button 
                    className="bg-white text-accent hover:bg-opacity-90 font-inter font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out"
                    asChild
                  >
                    <Link href="/wallet">
                      View Wallet
                    </Link>
                  </Button>
                  <Button 
                    className="bg-transparent border border-white hover:bg-white/10 text-white font-inter font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out"
                    asChild
                  >
                    <Link href="/products">
                      Shop Now
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="bg-white text-accent hover:bg-opacity-90 font-inter font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out"
                    asChild
                  >
                    <Link href="/auth">
                      Get Started
                    </Link>
                  </Button>
                  <Button 
                    className="bg-transparent border border-white hover:bg-white/10 text-white font-inter font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out"
                    asChild
                  >
                    <Link href="/products">
                      Learn More
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="md:w-5/12">
            {user ? (
              isLoading ? (
                <Skeleton className="bg-white/20 h-72 w-full rounded-xl" />
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-lg text-primary">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-inter font-semibold text-lg">Wallet Balance</h3>
                    <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm text-neutral-300 mb-1">Total Balance</div>
                    <div className="font-mono font-medium text-3xl">${wallet?.balance.toFixed(2)}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-background p-4 rounded-lg">
                      <div className="text-sm text-neutral-300 mb-1">Income</div>
                      <div className="font-mono font-medium text-success text-xl">+${wallet?.totalIncome.toFixed(2)}</div>
                    </div>
                    <div className="bg-background p-4 rounded-lg">
                      <div className="text-sm text-neutral-300 mb-1">Expenses</div>
                      <div className="font-mono font-medium text-warning text-xl">-${wallet?.totalExpenses.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-secondary text-white py-3 rounded-lg font-inter font-medium hover:bg-opacity-90 transition duration-150 ease-in-out"
                    asChild
                  >
                    <Link href="/wallet">
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              )
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-lg text-primary">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-inter font-semibold text-lg">Wallet Preview</h3>
                  <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                    Demo
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-neutral-300 mb-1">Features</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="text-success mr-2" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Track balance and expenses</span>
                    </li>
                    <li className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="text-success mr-2" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Secure payment processing</span>
                    </li>
                    <li className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="text-success mr-2" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Blockchain integration</span>
                    </li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-secondary text-white py-3 rounded-lg font-inter font-medium hover:bg-opacity-90 transition duration-150 ease-in-out"
                  asChild
                >
                  <Link href="/auth">
                    Sign Up to Access
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
