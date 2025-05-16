import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, Twitter, Wallet } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-secondary text-2xl mr-1">
                <Wallet className="h-6 w-6" />
              </span>
              <span className="font-inter font-bold text-xl">PayMarket</span>
            </div>
            <p className="font-sf text-neutral-100/80 mb-4">
              Your all-in-one e-commerce and fintech platform. Buy, sell, and manage your finances in one place.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-inter font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-100/80 hover:text-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-neutral-100/80 hover:text-secondary">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-neutral-100/80 hover:text-secondary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="text-neutral-100/80 hover:text-secondary">
                  Wallet
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-inter font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-100/80 hover:text-secondary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-inter font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="text-secondary mr-3">📍</div>
                <span className="text-neutral-100/80">123 Commerce Street, Tech City, TC 10101</span>
              </li>
              <li className="flex items-center">
                <div className="text-secondary mr-3">📞</div>
                <span className="text-neutral-100/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <div className="text-secondary mr-3">✉️</div>
                <span className="text-neutral-100/80">support@paymarket.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-100/80 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PayMarket. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-xs">Visa</div>
            <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-xs">MC</div>
            <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-xs">PayPal</div>
            <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-xs">₿</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
