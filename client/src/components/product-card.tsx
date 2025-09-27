import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.imageUrl || '',
      quantity: 1,
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const formatPrice = (price: string) => {
    return `₦${parseFloat(price).toLocaleString()}`;
  };

  return (
    <div 
      className="product-card bg-card rounded-lg overflow-hidden border border-border"
      data-testid={`card-product-${product.id}`}
    >
      <img 
        src={product.imageUrl || '/placeholder-product.jpg'} 
        alt={product.name}
        className="w-full h-64 object-cover"
        data-testid={`img-product-${product.id}`}
      />
      <div className="p-4">
        <h3 
          className="font-medium text-foreground mb-2"
          data-testid={`text-product-name-${product.id}`}
        >
          {product.name}
        </h3>
        <p 
          className="text-sm text-muted-foreground mb-3"
          data-testid={`text-product-description-${product.id}`}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span 
            className="text-xl font-bold text-primary"
            data-testid={`text-price-${product.id}`}
          >
            {formatPrice(product.price)}
          </span>
          <Button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isAdding 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            onClick={handleAddToCart}
            disabled={isAdding}
            data-testid={`button-add-cart-${product.id}`}
          >
            {isAdding ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Added!
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
