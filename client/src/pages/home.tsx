import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import CartSidebar from "@/components/cart-sidebar";
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import logoPath from "@assets/logo_1755949907989-DcJzKOES_1758813345828.png";
import { useState } from "react";
import type { Product } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter(product => 
    selectedCategory === "all" || product.category === selectedCategory
  ) || [];

  const categories = [
    { key: "all", label: "All Products" },
    { key: "cotton", label: "Cotton" },
    { key: "silk", label: "Silk" },
    { key: "linen", label: "Linen" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-secondary to-accent">
        {/* Traditional patterns background */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><circle cx="30" cy="30" r="2" fill="%23D2691E"/></svg>')`,
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center">
            <div className="logo-container mx-auto mb-6">
              <img 
                src={logoPath} 
                alt="SHAAD-n-SHIFA Logo" 
                className="h-20 w-auto mx-auto"
                data-testid="hero-logo"
              />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4" data-testid="hero-title">
              SHAAD-n-SHIFA
            </h1>
            <p className="font-serif text-xl md:text-2xl text-accent-foreground mb-2" data-testid="hero-subtitle">
              Loom To Legacy
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="hero-description">
              Discover the finest collection of traditional kurtas, crafted with premium fabrics and time-honored techniques for the modern connoisseur.
            </p>
            <Button 
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-explore-collection"
            >
              Explore Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Product Collection Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-collection-title">
              Our Collection
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-collection-description">
              Each piece is carefully crafted with premium fabrics and traditional techniques, ensuring comfort and elegance for every occasion.
            </p>
            <div className="w-16 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "secondary"}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
                onClick={() => setSelectedCategory(category.key)}
                data-testid={`filter-${category.key}`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="product-grid">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden border border-border">
                  <Skeleton className="w-full h-64" />
                  <div className="p-4">
                    <Skeleton className="h-6 mb-2" />
                    <Skeleton className="h-4 mb-3" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="text-heritage-title">
              Our Heritage
            </h2>
            <p className="text-muted-foreground text-lg mb-8" data-testid="text-heritage-description">
              At SHAAD-n-SHIFA, we bridge the gap between traditional craftsmanship and contemporary style. Our "Loom To Legacy" philosophy represents our commitment to preserving the art of traditional kurta making while adapting to modern sensibilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-foreground mb-2" data-testid="text-handcrafted-title">Handcrafted Quality</h3>
                <p className="text-muted-foreground" data-testid="text-handcrafted-description">Each piece is carefully crafted with attention to traditional techniques and modern comfort.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-foreground mb-2" data-testid="text-premium-title">Premium Fabrics</h3>
                <p className="text-muted-foreground" data-testid="text-premium-description">We source the finest cotton, silk, and linen to ensure comfort and durability.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-foreground mb-2" data-testid="text-timeless-title">Timeless Design</h3>
                <p className="text-muted-foreground" data-testid="text-timeless-description">Classic designs that honor tradition while embracing contemporary aesthetics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="text-contact-title">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-8" data-testid="text-contact-description">
              Have questions about our collection or need assistance with your order? We're here to help!
            </p>
            
            <div className="bg-card p-8 rounded-lg border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <svg className="w-8 h-8 text-primary mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <h3 className="font-medium text-foreground mb-2" data-testid="text-call-title">Call Us</h3>
                  <p className="text-muted-foreground" data-testid="text-phone-number">+234 814 748 5879</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 text-primary mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-medium text-foreground mb-2" data-testid="text-whatsapp-title">WhatsApp</h3>
                  <Button
                    variant="link"
                    className="text-primary hover:underline p-0"
                    data-testid="button-whatsapp-message"
                  >
                    Message us directly
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  data-testid="button-order-whatsapp"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Order via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WhatsAppFloat />
    </div>
  );
}
