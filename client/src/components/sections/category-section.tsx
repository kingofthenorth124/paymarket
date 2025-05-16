import { Link } from "wouter";
import { Category } from "@shared/schema";
import { Gamepad, Gift, Heart, Home, Laptop, ShoppingBag } from "lucide-react";

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  // Icons to display for each category (matched by name in lowercase)
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    
    if (name.includes('electronics')) return <Laptop className="text-secondary text-xl" />;
    if (name.includes('fashion')) return <ShoppingBag className="text-accent text-xl" />;
    if (name.includes('home')) return <Home className="text-warning text-xl" />;
    if (name.includes('health')) return <Heart className="text-success text-xl" />;
    if (name.includes('gaming')) return <Gamepad className="text-primary text-xl" />;
    
    // Default icon for other categories
    return <Gift className="text-secondary text-xl" />;
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-inter font-bold text-2xl md:text-3xl text-primary mb-8">Shop by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.id}`}
              className="bg-neutral-100 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-neutral-200 transition-colors duration-200 text-center"
            >
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                {getCategoryIcon(category.name)}
              </div>
              <span className="font-inter font-medium text-primary">{category.name}</span>
            </Link>
          ))}
          
          {/* If there are fewer than 6 categories, add a "More" button */}
          {categories.length < 6 && (
            <Link 
              href="/categories"
              className="bg-neutral-100 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-neutral-200 transition-colors duration-200 text-center"
            >
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="text-secondary text-xl" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </div>
              <span className="font-inter font-medium text-primary">More</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
