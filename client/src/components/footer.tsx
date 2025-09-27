import { Link } from "wouter";
import logoPath from "@assets/logo_1755949907989-DcJzKOES_1758813345828.png";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="logo-container mb-4">
              <img 
                src={logoPath} 
                alt="SHAAD-n-SHIFA Logo" 
                className="h-12 w-auto filter invert"
                data-testid="footer-logo"
              />
            </div>
            <p className="text-background/80 mb-4" data-testid="text-footer-description">
              Traditional fashion crafted with love for the modern connoisseur. 
              From loom to legacy, preserving heritage through timeless designs.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-background mb-4" data-testid="text-quick-links">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-background/80 hover:text-background transition-colors" data-testid="link-footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-background/80 hover:text-background transition-colors" data-testid="link-footer-products">
                  Products
                </Link>
              </li>
              <li>
                <a href="/#about" className="text-background/80 hover:text-background transition-colors" data-testid="link-footer-about">
                  About
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-background/80 hover:text-background transition-colors" data-testid="link-footer-contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-medium text-background mb-4" data-testid="text-contact-info">Contact</h3>
            <ul className="space-y-2">
              <li className="text-background/80" data-testid="text-footer-phone">
                <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +234 814 748 5879
              </li>
              <li className="text-background/80" data-testid="text-footer-whatsapp">
                <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                </svg>
                WhatsApp Orders
              </li>
              <li className="text-background/80" data-testid="text-footer-email">
                <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                info@shaadnshifa.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/80" data-testid="text-copyright">
            2024 SHAAD-n-SHIFA Loom To Legacy. All rights reserved. | Crafted with ❤️ for traditional fashion lovers.
          </p>
          <p className="text-background/60 mt-2" data-testid="text-attribution">
            Designed and managed by hirenaseem.tech
          </p>
        </div>
      </div>
    </footer>
  );
}
