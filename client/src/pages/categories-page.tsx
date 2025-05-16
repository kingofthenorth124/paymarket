import { useQuery } from "@tanstack/react-query";
import { Category, Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import ProductCard from "@/components/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, ShoppingBag, CreditCard, PiggyBank, ShieldCheck, Bitcoin } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const [location, navigate] = useLocation();
  
  // Get tab from URL query parameter (financial or retail)
  const params = new URLSearchParams(location.split('?')[1]);
  const tabParam = params.get('tab');

  const getCategoryProducts = (categoryId: number) => {
    return products?.filter(product => product.categoryId === categoryId) || [];
  };

  // Separate categories into retail and financial
  const retailCategories = categories?.filter(c => c.id <= 5) || [];
  const financialCategories = categories?.filter(c => c.id >= 6) || [];
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    const url = value === 'retail' ? '/categories' : '/categories?tab=financial';
    navigate(url, { replace: true });
  };

  // Get category icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    switch(categoryName.toLowerCase()) {
      case 'payments':
        return <CreditCard className="h-6 w-6 text-accent" />;
      case 'lending':
        return <PiggyBank className="h-6 w-6 text-accent" />;
      case 'insurance':
        return <ShieldCheck className="h-6 w-6 text-accent" />;
      case 'blockchain':
        return <Bitcoin className="h-6 w-6 text-accent" />;
      default:
        return <Coins className="h-6 w-6 text-accent" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      
      {categoriesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue={tabParam === 'financial' ? 'financial' : 'retail'} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="retail" className="text-base py-3">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Retail Products
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-base py-3">
              <Coins className="mr-2 h-5 w-5" />
              Financial Services
            </TabsTrigger>
          </TabsList>
          
          {/* Retail Products Tab */}
          <TabsContent value="retail" className="space-y-12 mt-4">
            {retailCategories.map(category => (
              <div key={category.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <button 
                    onClick={() => navigate(`/products?category=${category.id}`)}
                    className="text-secondary hover:text-secondary/80 font-medium"
                  >
                    View All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {getCategoryProducts(category.id).slice(0, 4).map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                  
                  {getCategoryProducts(category.id).length === 0 && (
                    <Card className="col-span-full">
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No products in this category yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          
          {/* Financial Services Tab */}
          <TabsContent value="financial" className="mt-4">
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
                        <p className="text-muted-foreground mb-4">{category.description}</p>
                        <button 
                          onClick={() => navigate(`/financial-service?category=${category.id}`)}
                          className="text-secondary hover:text-secondary/80 font-medium flex items-center"
                        >
                          Browse Services
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6">Featured Financial Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {financialCategories.flatMap(category => 
                getCategoryProducts(category.id)
                  .filter(product => product.featured)
                  .slice(0, 2)
              ).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
