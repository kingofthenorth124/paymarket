import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { useLocation } from "wouter";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, PiggyBank, ShieldCheck, Bitcoin, ArrowRight, ArrowLeft, HelpCircle, Lightbulb, BarChart3, Landmark, DollarSign } from "lucide-react";

export default function FinancialServicePage() {
  const [location] = useLocation();
  
  // Get service type from URL query parameter
  const params = new URLSearchParams(location.split('?')[1]);
  const categoryId = Number(params.get('category') || "0");
  
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Find the current category
  const currentCategory = categories?.find(c => c.id === categoryId);
  const categoryProducts = products?.filter(p => p.categoryId === categoryId) || [];
  const featuredProducts = categoryProducts.filter(p => p.featured);
  
  // Get icon based on category ID
  const getCategoryIcon = (id: number) => {
    switch(id) {
      case 6: return <CreditCard className="h-8 w-8 text-accent" />;
      case 7: return <PiggyBank className="h-8 w-8 text-accent" />;
      case 8: return <ShieldCheck className="h-8 w-8 text-accent" />;
      case 9: return <Bitcoin className="h-8 w-8 text-accent" />;
      default: return <DollarSign className="h-8 w-8 text-accent" />;
    }
  };
  
  // Get details about each financial service category
  const getServiceDetails = (id: number) => {
    switch(id) {
      case 6: return {
        title: "Payment Solutions",
        subtitle: "Seamless Digital Payment Processing",
        benefits: [
          "Secure mobile and digital wallet transactions",
          "Credit card processing with low fees",
          "Real-time payment tracking and notifications",
          "International payment support with competitive exchange rates"
        ],
        features: [
          { icon: <Landmark className="h-5 w-5" />, title: "Payment Gateway Integration", description: "Connect with leading payment providers including Paystack, Stripe, and more" },
          { icon: <BarChart3 className="h-5 w-5" />, title: "Analytics Dashboard", description: "Track transaction performance and customer payment habits" },
          { icon: <Lightbulb className="h-5 w-5" />, title: "Smart Billing", description: "Automated invoice generation and payment reminders" }
        ]
      };
      case 7: return {
        title: "Lending & Credit Solutions",
        subtitle: "Flexible Financing Options for Every Need",
        benefits: [
          "Competitive interest rates with transparent terms",
          "Quick approval process for eligible borrowers",
          "No hidden fees or early repayment penalties",
          "Personalized credit options based on financial history"
        ],
        features: [
          { icon: <PiggyBank className="h-5 w-5" />, title: "Peer-to-Peer Lending", description: "Connect directly with investors for better rates and terms" },
          { icon: <Lightbulb className="h-5 w-5" />, title: "Smart Credit Scoring", description: "Advanced algorithms for fair and accurate creditworthiness assessment" },
          { icon: <BarChart3 className="h-5 w-5" />, title: "Repayment Flexibility", description: "Customize your payment schedule to match your cash flow" }
        ]
      };
      case 8: return {
        title: "Insurance Services",
        subtitle: "Comprehensive Coverage for Peace of Mind",
        benefits: [
          "Tailored insurance solutions for individual needs",
          "Quick and hassle-free claims processing",
          "Bundle different policies for premium discounts",
          "24/7 customer support for emergencies"
        ],
        features: [
          { icon: <ShieldCheck className="h-5 w-5" />, title: "Digital-First Coverage", description: "Protect your digital assets, devices, and online transactions" },
          { icon: <Lightbulb className="h-5 w-5" />, title: "Smart Premiums", description: "Prices that adjust based on your actual usage and risk profile" },
          { icon: <BarChart3 className="h-5 w-5" />, title: "Coverage Analytics", description: "Visualize your protection and identify potential gaps" }
        ]
      };
      case 9: return {
        title: "Blockchain & Cryptocurrency",
        subtitle: "Secure Digital Asset Management",
        benefits: [
          "Simplified cryptocurrency investing for beginners",
          "Enterprise blockchain solutions for businesses",
          "Secure wallet management with multi-factor authentication",
          "Low-fee cryptocurrency transactions"
        ],
        features: [
          { icon: <Bitcoin className="h-5 w-5" />, title: "Crypto Portfolio", description: "Manage multiple digital assets in one secure platform" },
          { icon: <Lightbulb className="h-5 w-5" />, title: "Smart Contracts", description: "Automate agreements and transactions with blockchain technology" },
          { icon: <BarChart3 className="h-5 w-5" />, title: "Market Analytics", description: "Track cryptocurrency performance with advanced charting tools" }
        ]
      };
      default: return {
        title: "Financial Services",
        subtitle: "Modern Solutions for Your Financial Needs",
        benefits: [
          "Comprehensive financial tools and services",
          "Secure and reliable transaction processing",
          "Competitive rates and transparent pricing",
          "24/7 customer support"
        ],
        features: [
          { icon: <Lightbulb className="h-5 w-5" />, title: "Innovative Solutions", description: "Cutting-edge financial technology for modern needs" },
          { icon: <ShieldCheck className="h-5 w-5" />, title: "Secure Processing", description: "Enterprise-grade security for all your transactions" },
          { icon: <BarChart3 className="h-5 w-5" />, title: "Performance Tracking", description: "Monitor your financial activities with detailed analytics" }
        ]
      };
    }
  };
  
  const serviceDetails = getServiceDetails(categoryId);
  
  if (categoriesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-60 w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentCategory || categoryId < 6) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>Invalid Service Category</AlertTitle>
          <AlertDescription>
            The financial service category you requested doesn't exist. Please select a valid category.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => window.location.href = '/financial-services'}>
            View All Financial Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="flex items-center gap-1 text-secondary"
          onClick={() => window.location.href = '/financial-services'}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Financial Services
        </Button>
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-6 md:p-12 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="bg-white p-4 rounded-full shadow-sm">
            {getCategoryIcon(categoryId)}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{serviceDetails.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{serviceDetails.subtitle}</p>
            <Badge variant="secondary" className="text-xs font-normal">
              {categoryProducts.length} service{categoryProducts.length !== 1 ? 's' : ''} available
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Key Benefits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Key Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceDetails.benefits.map((benefit, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-2">
                  <div className="bg-secondary/10 p-1 rounded-full mt-0.5">
                    <ArrowRight className="h-4 w-4 text-secondary" />
                  </div>
                  <p>{benefit}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceDetails.features.map((feature, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-accent/10 p-2 rounded-full">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Featured Services</h2>
          <p className="text-muted-foreground mb-6">Our most popular {currentCategory.name.toLowerCase()} solutions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
      
      {/* All Services */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All {currentCategory.name} Services</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {categoryProducts.length === 0 && (
            <Card className="col-span-full py-12">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No services available in this category yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-accent/5 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to explore our {currentCategory.name.toLowerCase()} solutions?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Discover how our {currentCategory.name.toLowerCase()} services can transform your financial experience with 
          cutting-edge technology and user-friendly solutions.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-secondary hover:bg-secondary/90">Get Started</Button>
          <Button size="lg" variant="outline">Contact Sales</Button>
        </div>
      </div>
    </div>
  );
}