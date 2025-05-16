import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              Shop & Manage Your <span className="text-secondary">Finance</span> In One Place
            </h1>
            <p className="font-sf text-lg mb-8 text-neutral-100">
              Buy, sell products and manage your transactions with our integrated payment solutions.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                <>
                  <Button 
                    className="bg-secondary hover:bg-secondary/90 text-white font-inter font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out"
                    asChild
                  >
                    <Link href="/products">
                      Browse Products
                    </Link>
                  </Button>
                  <Button 
                    className="bg-transparent border border-white hover:bg-white/10 text-white font-inter font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out"
                    asChild
                  >
                    <Link href="/wallet">
                      Manage Wallet
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="bg-secondary hover:bg-secondary/90 text-white font-inter font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out"
                    asChild
                  >
                    <Link href="/auth">
                      Get Started
                    </Link>
                  </Button>
                  <Button 
                    className="bg-transparent border border-white hover:bg-white/10 text-white font-inter font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out"
                    asChild
                  >
                    <Link href="/products">
                      Learn More
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <div className="flex items-center justify-center">
                <div className="w-full h-64 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-32 h-32 text-secondary"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                    <circle cx="9" cy="3" r="1" />
                    <circle cx="15" cy="3" r="1" />
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 12v2.5" />
                    <path d="M12 9.5v.5" />
                    <path d="M14.5 11h.5" />
                    <path d="M9 11h.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
