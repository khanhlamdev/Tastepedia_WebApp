import { MapPin, Mail, Phone, Facebook, Instagram, Youtube, Send, ChefHat, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('Thank you for subscribing!');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Company Info (CRUCIAL) */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#ff8a5c] rounded-xl flex items-center justify-center shadow-md">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#FF6B35]">
                Tastepedia
              </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Your ultimate culinary companion. Discover recipes, order ingredients, and join a vibrant food community.
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Contact Us</h4>
              
              {/* Address */}
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-700 font-medium">Address:</p>
                  <p className="text-gray-600">
                    123 Culinary Avenue,<br />
                    Ho Chi Minh City, Vietnam
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium">Email:</p>
                  <a
                    href="mailto:contact@tastepedia.com"
                    className="text-gray-600 hover:text-[#FF6B35] transition-colors"
                  >
                    contact@tastepedia.com
                  </a>
                </div>
              </div>

              {/* Hotline */}
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium">Hotline:</p>
                  <a
                    href="tel:+84909123456"
                    className="text-gray-600 hover:text-[#FF6B35] transition-colors font-semibold"
                  >
                    +84 909 123 456
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="text-gray-600 hover:text-[#FF6B35] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('careers')}
                  className="text-gray-600 hover:text-[#FF6B35] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('partner')}
                  className="text-gray-600 hover:text-[#FF6B35] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Partner with Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('faq')}
                  className="text-gray-600 hover:text-[#FF6B35] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('blog')}
                  className="text-gray-600 hover:text-[#FF6B35] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavClick('terms')}
                  className="text-gray-600 hover:text-[#FF6B35] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('privacy')}
                  className="text-gray-600 hover:text-[#FF6B35] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('cookies')}
                  className="text-gray-600 hover:text-[#FF6B35] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('refund')}
                  className="text-gray-600 hover:text-[#FF6B35] transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Newsletter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Stay Connected</h4>
            
            {/* Social Media */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Follow us on social media</p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com/tastepedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://instagram.com/tastepedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://youtube.com/tastepedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-2 text-sm">Newsletter</h5>
              <p className="text-sm text-gray-600 mb-3">
                Get weekly recipes and cooking tips!
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 h-10 rounded-full bg-white border-gray-200 focus:border-[#FF6B35]"
                  required
                />
                <Button
                  type="submit"
                  className="bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full px-4 h-10 shadow-md hover:shadow-lg transition-all"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright */}
      <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © {currentYear} <span className="font-semibold text-[#FF6B35]">Tastepedia</span>. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <button
                onClick={() => handleNavClick('sitemap')}
                className="hover:text-[#FF6B35] transition-colors"
              >
                Sitemap
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => handleNavClick('accessibility')}
                className="hover:text-[#FF6B35] transition-colors"
              >
                Accessibility
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
