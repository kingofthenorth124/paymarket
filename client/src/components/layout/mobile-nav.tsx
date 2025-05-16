import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CartItem } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Home, Search, ShoppingBag, User, Wallet, Coins } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const { data: cartItems } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });
  
  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  // Don't show mobile nav if not authenticated
  if (!user) return null;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-neutral-100 z-40">
      <div className="grid grid-cols-5 px-2 py-3">
        <Link 
          href="/" 
          className={`flex flex-col items-center ${location === "/" ? "text-secondary" : "text-neutral-300"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          href="/products" 
          className={`flex flex-col items-center ${location === "/products" ? "text-secondary" : "text-neutral-300"}`}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Products</span>
        </Link>
        
        <Link 
          href="/financial-services" 
          className={`flex flex-col items-center ${location.includes("/financial") ? "text-secondary" : "text-neutral-300"}`}
        >
          <Coins className="h-5 w-5" />
          <span className="text-xs mt-1">Finance</span>
        </Link>
        
        <Link 
          href="/wallet" 
          className={`flex flex-col items-center ${location === "/wallet" ? "text-secondary" : "text-neutral-300"}`}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-xs mt-1">Wallet</span>
        </Link>
        
        <Link 
          href="/cart" 
          className={`flex flex-col items-center relative ${location === "/cart" ? "text-secondary" : "text-neutral-300"}`}
        >
          <ShoppingBag className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
          <span className="text-xs mt-1">Cart</span>
        </Link>
      </div>
    </div>
  );
}
