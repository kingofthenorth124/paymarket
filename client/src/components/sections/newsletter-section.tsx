import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "You have successfully subscribed to our newsletter",
        variant: "success",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between bg-primary/5 rounded-xl p-6 md:p-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="font-inter font-bold text-xl md:text-2xl text-primary mb-2">
              Stay Updated with Our Newsletter
            </h2>
            <p className="font-sf text-neutral-300 mb-4">
              Get the latest updates on new products, features, and promotions.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
              <Input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-auto mb-3 sm:mb-0 sm:mr-2" 
              />
              <Button 
                type="submit" 
                className="bg-secondary hover:bg-secondary/90 text-white font-inter font-medium px-6 py-3 rounded-lg transition duration-150 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
          
          <div className="md:w-5/12 flex justify-center md:justify-end">
            <div className="flex items-center">
              <div className="mr-6">
                <h3 className="font-inter font-semibold text-lg text-primary mb-2">Download Our App</h3>
                <p className="font-sf text-neutral-300 text-sm mb-3">
                  Available on iOS and Android
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="bg-primary text-white px-3 py-2 rounded-lg flex items-center text-sm hover:bg-opacity-90">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 mr-2"
                    >
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                      <path d="M12 8v8"></path>
                      <path d="M8 12h8"></path>
                    </svg>
                    <div>
                      <div className="text-xs">Download on the</div>
                      <div className="font-medium">App Store</div>
                    </div>
                  </a>
                  <a href="#" className="bg-primary text-white px-3 py-2 rounded-lg flex items-center text-sm hover:bg-opacity-90">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 mr-2"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <div>
                      <div className="text-xs">Get it on</div>
                      <div className="font-medium">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
