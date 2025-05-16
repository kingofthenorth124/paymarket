import HeroSection from "@/components/sections/hero-section";
import CategorySection from "@/components/sections/category-section";
import FeaturedProducts from "@/components/sections/featured-products";
import FeaturesSection from "@/components/sections/features-section";
import WalletOverview from "@/components/sections/wallet-overview";
import RecentTransactions from "@/components/sections/recent-transactions";
import NewsletterSection from "@/components/sections/newsletter-section";
import { useQuery } from "@tanstack/react-query";
import { Category, Product, Transaction } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  return (
    <>
      <HeroSection />
      
      {categoriesLoading ? (
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-36 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <CategorySection categories={categories || []} />
      )}
      
      {productsLoading ? (
        <div className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <FeaturedProducts products={products || []} />
      )}
      
      <FeaturesSection />
      
      <WalletOverview />
      
      {transactionsLoading ? (
        <div className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <RecentTransactions transactions={transactions || []} />
      )}
      
      <NewsletterSection />
    </>
  );
}
