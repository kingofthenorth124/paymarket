import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductsPage from "@/pages/products-page";
import CategoriesPage from "@/pages/categories-page";
import FinancialServicePage from "@/pages/financial-service-page";
import FinancialServicesPage from "@/pages/financial-services-page";
import WalletPage from "@/pages/wallet-page";
import CartPage from "@/pages/cart-page";
import ProfilePage from "@/pages/profile-page";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/products" component={ProductsPage} />
      <ProtectedRoute path="/categories" component={CategoriesPage} />
      <ProtectedRoute path="/financial-services" component={FinancialServicesPage} />
      <ProtectedRoute path="/financial-service" component={FinancialServicePage} />
      <ProtectedRoute path="/wallet" component={WalletPage} />
      <ProtectedRoute path="/cart" component={CartPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { toast } = useToast();

  useEffect(() => {
    // Listen for payment callback events
    const handlePaymentCallback = (event: MessageEvent) => {
      if (event.data.type === 'PAYMENT_SUCCESS') {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
          variant: "default",
        });
      } else if (event.data.type === 'PAYMENT_ERROR') {
        toast({
          title: "Payment Failed",
          description: event.data.message || "There was an error processing your payment.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('message', handlePaymentCallback);
    return () => window.removeEventListener('message', handlePaymentCallback);
  }, [toast]);

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </TooltipProvider>
  );
}

export default App;
