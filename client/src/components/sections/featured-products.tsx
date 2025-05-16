import { Link } from "wouter";
import { Product } from "@shared/schema";
import ProductCard from "@/components/product-card";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Get up to 4 featured products
  const featuredProducts = products
    .filter(product => product.featured)
    .slice(0, 4);
  
  // If there are fewer than 4 featured products, add some regular products
  const displayProducts = featuredProducts.length < 4
    ? [...featuredProducts, ...products.filter(p => !p.featured).slice(0, 4 - featuredProducts.length)]
    : featuredProducts;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-primary">Featured Products</h2>
          <Link href="/products" className="text-secondary hover:text-secondary/80 font-inter font-medium flex items-center">
            View All 
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="ml-2" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
