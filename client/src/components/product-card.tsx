import { Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [, navigate] = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState("m");
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();

  const addToCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", "/api/cart", {
        productId,
        quantity: 1
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (options?: { color?: string; size?: string; qty?: number }) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add items to your cart",
        variant: "default",
      });
      navigate("/auth");
      return;
    }

    // In a real application, we would send these options to the backend
    const color = options?.color || selectedColor;
    const size = options?.size || selectedSize;
    const qty = options?.qty || 1;
    
    console.log(`Adding to cart: ${product.name}, Color: ${color}, Size: ${size}, Quantity: ${qty}`);
    
    addToCartMutation.mutate(product.id);
    
    toast({
      title: "Options selected",
      description: `Color: ${color}, Size: ${size}, Quantity: ${qty}`,
      variant: "default",
    });
  };

  const toggleFavorite = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save favorites",
        variant: "default",
      });
      navigate("/auth");
      return;
    }

    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? `${product.name} has been removed from your favorites.` : `${product.name} has been added to your favorites.`,
      variant: "default",
    });
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

  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 card-hover">
      <div className="relative">
        {/* Product Image */}
        <div className="w-full h-48 bg-neutral-100 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-secondary/10 text-secondary">
            <ShoppingCart size={24} />
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full p-2 text-neutral-300 hover:text-accent transition-colors"
            onClick={toggleFavorite}
          >
            <Heart className={isFavorite ? "fill-accent text-accent" : ""} size={18} />
          </Button>
        </div>
        {product.featured && (
          <div className="absolute top-3 left-3 bg-accent text-white text-xs py-1 px-2 rounded-lg">
            Featured
          </div>
        )}
        {product.stock !== null && product.stock < 10 && (
          <div className="absolute top-3 left-3 bg-warning text-white text-xs py-1 px-2 rounded-lg">
            Limited Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-accent font-medium mb-1">{getCategoryName(product.categoryId)}</div>
        <h3 className="font-inter font-semibold text-primary">{product.name}</h3>
        <div className="flex items-center mt-2 mb-3">
          <div className="flex text-warning text-sm">
            {'★★★★☆'}
          </div>
          <span className="text-neutral-300 text-xs ml-2">(42)</span>
        </div>
        <div className="mb-3">
          <div className="text-sm mb-1">Available Colors:</div>
          <div className="flex space-x-2">
            <div 
              className={`w-6 h-6 rounded-full bg-black cursor-pointer border hover:ring-1 hover:ring-primary ${selectedColor === 'black' ? 'ring-2 ring-primary' : 'border-neutral-200'}`} 
              title="Black"
              onClick={() => setSelectedColor('black')}
            ></div>
            <div 
              className={`w-6 h-6 rounded-full bg-white cursor-pointer border hover:ring-1 hover:ring-primary ${selectedColor === 'white' ? 'ring-2 ring-primary' : 'border-neutral-200'}`} 
              title="White"
              onClick={() => setSelectedColor('white')}
            ></div>
            <div 
              className={`w-6 h-6 rounded-full bg-blue-500 cursor-pointer border hover:ring-1 hover:ring-primary ${selectedColor === 'blue' ? 'ring-2 ring-primary' : 'border-neutral-200'}`} 
              title="Blue"
              onClick={() => setSelectedColor('blue')}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="font-mono font-medium text-primary text-lg">${product.price.toFixed(2)}</div>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="p-2 rounded-lg">
                  <Eye size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{product.name}</DialogTitle>
                  <DialogDescription>
                    {product.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Select Color</h4>
                    <div className="flex space-x-3">
                      <div 
                        className={`w-8 h-8 rounded-full bg-black cursor-pointer border hover:ring-1 hover:ring-primary ${selectedColor === 'black' ? 'ring-2 ring-primary' : 'border-neutral-200'}`} 
                        onClick={() => setSelectedColor('black')}
                      ></div>
                      <div 
                        className={`w-8 h-8 rounded-full bg-white cursor-pointer border hover:ring-1 hover:ring-primary ${selectedColor === 'white' ? 'ring-2 ring-primary' : 'border-neutral-200'}`} 
                        onClick={() => setSelectedColor('white')}
                      ></div>
                      <div 
                        className={`w-8 h-8 rounded-full bg-blue-500 cursor-pointer border hover:ring-1 hover:ring-primary ${selectedColor === 'blue' ? 'ring-2 ring-primary' : 'border-neutral-200'}`} 
                        onClick={() => setSelectedColor('blue')}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Select Size</h4>
                    <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex space-x-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="s" id="s" />
                        <Label htmlFor="s">S</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="m" id="m" />
                        <Label htmlFor="m">M</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="l" id="l" />
                        <Label htmlFor="l">L</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="xl" id="xl" />
                        <Label htmlFor="xl">XL</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Quantity</h4>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >-</Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setQuantity(quantity + 1)}
                      >+</Button>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <h4 className="text-sm font-medium mb-1">Specifications:</h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Category: {getCategoryName(product.categoryId)}</li>
                      <li>Stock: {product.stock} units</li>
                      <li>Rating: 4.5/5 (42 reviews)</li>
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary/90" 
                    onClick={() => {
                      handleAddToCart({
                        color: selectedColor,
                        size: selectedSize,
                        qty: quantity
                      });
                    }}
                  >
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button
              className="bg-secondary text-white p-2 rounded-lg hover:bg-opacity-90 transition-colors"
              size="icon"
              onClick={() => {
                handleAddToCart({ color: selectedColor, size: selectedSize });
              }}
              disabled={addToCartMutation.isPending}
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
