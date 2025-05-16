import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CartItem } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X, 
  Coins, 
  CreditCard, 
  PiggyBank, 
  ShieldCheck, 
  Bitcoin 
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: cartItems } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Wallet", href: "/wallet" },
  ];
  
  const financialServices = [
    { 
      label: "Payments", 
      href: "/financial-service?category=6",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      description: "Digital wallets, mobile payments, and payment gateways"
    },
    { 
      label: "Lending", 
      href: "/financial-service?category=7",
      icon: <PiggyBank className="h-4 w-4 mr-2" />,
      description: "P2P lending, credit services, and fintech lenders"
    },
    { 
      label: "Insurance", 
      href: "/financial-service?category=8",
      icon: <ShieldCheck className="h-4 w-4 mr-2" />,
      description: "Digital insurance services and products"
    },
    { 
      label: "Blockchain", 
      href: "/financial-service?category=9",
      icon: <Bitcoin className="h-4 w-4 mr-2" />,
      description: "Cryptocurrency, blockchain services, and NFTs"
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-accent text-white p-2 rounded-md">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <span className="font-inter font-bold text-xl text-primary">PayMarket</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Regular Nav Links */}
                {navLinks.map(link => (
                  <NavigationMenuItem key={link.href}>
                    <Link 
                      href={link.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location === link.href ? "text-secondary font-medium" : "text-primary font-medium"
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
                
                {/* Financial Services Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-medium">
                    <Coins className="mr-2 h-4 w-4" />
                    Financial Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {financialServices.map((service) => (
                        <li key={service.label}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={service.href}
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none hover:bg-accent/10 focus:shadow-md"
                            >
                              <div className="flex items-center mb-2 text-accent">
                                {service.icon}
                                <span className="text-sm font-medium">{service.label}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {service.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="md:col-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/categories?tab=financial"
                            className="w-full bg-gradient-to-b from-secondary/10 to-secondary/5 p-4 rounded-md flex items-center justify-center space-x-2 text-secondary font-medium hover:from-secondary/20 hover:to-secondary/10 transition-colors"
                          >
                            View All Financial Services
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Menu & Cart */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/cart" 
                  className="relative text-neutral-600 hover:text-secondary transition-colors"
                >
                  <ShoppingBag className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </Link>
                
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/profile">
                    <Avatar className="h-8 w-8 bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer">
                      <AvatarFallback className="text-secondary font-medium text-sm">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => logoutMutation.mutate()}
                    className="text-neutral-500 hover:text-secondary"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Mobile Menu Toggle */}
                <button 
                  className="md:hidden text-neutral-600 hover:text-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}