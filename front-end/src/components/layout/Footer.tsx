'use client';

import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
      <footer className="bg-[#FF6B35] text-white mt-20">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Tastepedia</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Your go-to platform for delicious recipes, fresh ingredients, and a vibrant community of food lovers.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="hover:text-white/70 transition-colors" title="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-white/70 transition-colors" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-white/70 transition-colors" title="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Browse Recipes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Ingredients Shop
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    AI Chef
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-white/70" />
                  <div>
                    <p className="text-white/80">
                      123 Culinary Street<br />
                      Ho Chi Minh City, Vietnam 70000
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className="w-5 h-5 flex-shrink-0 text-white/70" />
                  <a href="tel:+84912345678" className="text-white/80 hover:text-white transition-colors">
                    +84 (912) 345-678
                  </a>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className="w-5 h-5 flex-shrink-0 text-white/70" />
                  <a href="mailto:hello@tastepedia.com" className="text-white/80 hover:text-white transition-colors">
                    hello@tastepedia.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-white/70">
              <p>&copy; 2024 Tastepedia. All rights reserved.</p>
              <p className="mt-4 md:mt-0">Made with ❤️ for food lovers worldwide</p>
            </div>
          </div>
        </div>
      </footer>
  );
}
