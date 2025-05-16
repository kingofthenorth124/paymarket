import { Globe, Lock, Wallet } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-primary mb-4">Why Choose PayMarket</h2>
          <p className="font-sf text-neutral-300 max-w-2xl mx-auto">
            Combining e-commerce with fintech solutions for a seamless shopping and financial management experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background p-6 rounded-xl">
            <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-secondary text-xl" />
            </div>
            <h3 className="font-inter font-semibold text-lg mb-2">Secure Payments</h3>
            <p className="font-sf text-neutral-300">
              Multiple payment options with end-to-end encryption and blockchain integration.
            </p>
          </div>
          
          <div className="bg-background p-6 rounded-xl">
            <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Wallet className="text-accent text-xl" />
            </div>
            <h3 className="font-inter font-semibold text-lg mb-2">Digital Wallet</h3>
            <p className="font-sf text-neutral-300">
              Manage your funds, track expenses, and transfer money with ease.
            </p>
          </div>
          
          <div className="bg-background p-6 rounded-xl">
            <div className="bg-warning/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Globe className="text-warning text-xl" />
            </div>
            <h3 className="font-inter font-semibold text-lg mb-2">Global Marketplace</h3>
            <p className="font-sf text-neutral-300">
              Shop products from around the world with international shipping options.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
