import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import CartSidebar from "@/components/cart-sidebar";
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { Product } from "@shared/schema";

export default function Products() {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(category || "all");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: selectedCategory === "all" ? ["/api/products"] : [`/api/products/category/${selectedCategory}`],
  });

  const categories = [
    { key: "all", label: "All Products" },
    { key: "cotton", label: "Cotton" },
    { key: "silk", label: "Silk" },
    { key: "linen", label: "Linen" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      
      {/* Products Header */}
      <section className="py-16 bg-gradient-to-r from-secondary to-accent">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-products-title">
              Our Collection
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-products-description">
              Discover our complete range of traditional kurtas, crafted with premium fabrics and authentic designs.
            </p>
          </div>
        </div>
      </section>

      {/* Product Collection Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat.key}
                variant={selectedCategory === cat.key ? "default" : "secondary"}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
                onClick={() => setSelectedCategory(cat.key)}
                data-testid={`filter-${cat.key}`}
              >
                {cat.label}
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
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg" data-testid="text-no-products">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WhatsAppFloat />
    </div>
  );
}
