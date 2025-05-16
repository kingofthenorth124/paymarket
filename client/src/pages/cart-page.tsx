import { useQuery, useMutation } from "@tanstack/react-query";
import { CartItem, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export default function CartPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  
  const { data: cartItems, isLoading } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });
  
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  const getProduct = (productId: number) => {
    return products?.find(p => p.id === productId);
  };
  
  // Map category ID to category name
  const getCategoryName = (categoryId: number) => {
    const categoryNames = {
      1: "Electronics",
      2: "Fashion",
      3: "Home",
      4: "Health",
      5: "Gaming",
      6: "Payments",
      7: "Lending",
      8: "Insurance",
      9: "Blockchain"
    };
    return categoryNames[categoryId as keyof typeof categoryNames] || "Other";
  };
  
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/cart/${itemId}`, 
        { quantity }
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update quantity",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove item",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const checkoutMutation = useMutation({
    mutationFn: async (paymentData: { method: string; couponCode?: string }) => {
      const res = await apiRequest("POST", "/api/cart/checkout", paymentData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast({
          title: "Order Placed!",
          description: "Your order has been successfully placed.",
          variant: "default",
        });
        navigate("/");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const calculateSubtotal = () => {
    if (!cartItems || !products) return 0;
    return cartItems.reduce((sum, item) => {
      const product = getProduct(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };
  
  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 10 : 0;
  const discount = couponCode === "WELCOME" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;
  
  const handleCheckout = () => {
    checkoutMutation.mutate({
      method: paymentMethod,
      couponCode: couponCode || undefined,
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-16 w-full rounded-xl mb-4" />
            <Skeleton className="h-32 w-full rounded-xl mb-4" />
            <Skeleton className="h-32 w-full rounded-xl mb-4" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems && cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map(item => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    
                    return (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-neutral-100 rounded-md flex items-center justify-center overflow-hidden">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary/10 text-secondary">
                            <ShoppingBag size={24} />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{getCategoryName(product.categoryId)}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantityMutation.mutate({
                                  itemId: item.id,
                                  quantity: item.quantity - 1
                                });
                              }
                            }}
                            disabled={updateQuantityMutation.isPending || item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </Button>
                          
                          <span className="w-8 text-center">{item.quantity}</span>
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              updateQuantityMutation.mutate({
                                itemId: item.id,
                                quantity: item.quantity + 1
                              });
                            }}
                            disabled={updateQuantityMutation.isPending}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        
                        <div className="font-mono font-medium text-right w-24">
                          ${(product.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItemMutation.mutate(item.id)}
                          disabled={removeItemMutation.isPending}
                        >
                          <Trash2 size={18} className="text-muted-foreground" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono">${shipping.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span className="font-mono">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="font-mono">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4">
                    <div className="mb-2">
                      <Label htmlFor="coupon">Coupon Code</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Input 
                        id="coupon"
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)} 
                        placeholder="Enter coupon code"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          if (couponCode === "WELCOME") {
                            toast({
                              title: "Coupon Applied",
                              description: "10% discount has been applied to your order",
                              variant: "default",
                            });
                          } else if (couponCode) {
                            toast({
                              title: "Invalid Coupon",
                              description: "The coupon code is invalid or expired",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-secondary hover:bg-secondary/90">
                      Proceed to Checkout
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Complete Your Order</DialogTitle>
                      <DialogDescription>
                        Choose your preferred payment method.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className={`border rounded-lg p-4 text-center cursor-pointer ${
                            paymentMethod === 'paystack' ? 'border-secondary bg-secondary/5' : ''
                          }`}
                          onClick={() => setPaymentMethod('paystack')}
                        >
                          <div className="font-medium mb-2">Paystack</div>
                          <div className="text-sm text-muted-foreground">Credit/Debit Card</div>
                        </div>
                        
                        <div 
                          className={`border rounded-lg p-4 text-center cursor-pointer ${
                            paymentMethod === 'wallet' ? 'border-secondary bg-secondary/5' : ''
                          }`}
                          onClick={() => setPaymentMethod('wallet')}
                        >
                          <div className="font-medium mb-2">Wallet</div>
                          <div className="text-sm text-muted-foreground">Pay from your balance</div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="font-medium mb-2">Order Total</div>
                        <div className="text-2xl font-mono">${total.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        className="w-full bg-secondary hover:bg-secondary/90"
                        onClick={handleCheckout}
                        disabled={checkoutMutation.isPending}
                      >
                        {checkoutMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Confirm Payment'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Button className="bg-secondary hover:bg-secondary/90" onClick={() => navigate("/products")}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
