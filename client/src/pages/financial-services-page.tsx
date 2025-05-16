import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, CreditCard, PiggyBank, ShieldCheck, Bitcoin, Coins } from "lucide-react";
import ProductCard from "@/components/product-card";

export default function FinancialServicesPage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Filter financial service categories (IDs 6-9)
  const financialCategories = categories?.filter(c => c.id >= 6) || [];
  
  // Get products for each category
  const getCategoryProducts = (categoryId: number) => {
    return products?.filter(product => product.categoryId === categoryId) || [];
  };
  
  // Get featured products across all financial categories
  const featuredFinancialProducts = products?.filter(
    product => product.categoryId >= 6 && product.featured
  ) || [];
  
  // Get icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('payment')) return <CreditCard className="h-6 w-6 text-accent" />;
    if (name.includes('lending')) return <PiggyBank className="h-6 w-6 text-accent" />;
    if (name.includes('insurance')) return <ShieldCheck className="h-6 w-6 text-accent" />;
    if (name.includes('blockchain')) return <Bitcoin className="h-6 w-6 text-accent" />;
    return <Coins className="h-6 w-6 text-accent" />;
  };
  
  // Get description based on category ID
  const getCategoryDescription = (id: number) => {
    switch(id) {
      case 6: return "Digital wallets, mobile payments, and payment gateways";
      case 7: return "P2P lending, credit services, and fintech lenders";
      case 8: return "Digital insurance services and products";
      case 9: return "Cryptocurrency, blockchain services, and NFTs";
      default: return "Financial technology solutions";
    }
  };
  
  if (categoriesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-1/2 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-6 md:p-12 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white p-4 rounded-full shadow-sm">
            <Coins className="h-10 w-10 text-accent" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Financial Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our comprehensive suite of financial products designed to help you manage, grow, and protect your money.
            </p>
          </div>
        </div>
      </div>
      
      {/* Service Categories */}
      <h2 className="text-2xl font-bold mb-6">Our Financial Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {financialCategories.map(category => (
          <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-secondary/10 p-3 rounded-full">
                  {getCategoryIcon(category.name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{getCategoryDescription(category.id)}</p>
                  <Link 
                    href={`/financial-service?category=${category.id}`}
                    className="text-secondary hover:text-secondary/80 font-medium flex items-center"
                  >
                    Browse Services <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Featured Products */}
      <h2 className="text-2xl font-bold mb-6">Featured Financial Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {featuredFinancialProducts.slice(0, 6).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {featuredFinancialProducts.length === 0 && (
          <Card className="col-span-full py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Coins className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No featured services available yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* CTA Section */}
      <div className="bg-accent/5 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need help choosing the right financial service?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Our team of financial experts is ready to help you find the perfect solution for your needs.
          Schedule a consultation or reach out to our customer service team.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-secondary hover:bg-secondary/90">Schedule Consultation</Button>
          <Button size="lg" variant="outline">Contact Support</Button>
        </div>
      </div>
    </div>
  );
}