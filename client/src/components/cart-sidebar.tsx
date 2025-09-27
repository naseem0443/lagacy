import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { openWhatsApp } from "@/lib/whatsapp";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, totalAmount, totalItems } = useCart();

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add some items first.');
      return;
    }
    openWhatsApp(cart, totalAmount);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          data-testid="cart-overlay"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`cart-sidebar fixed top-0 right-0 h-full w-96 bg-card border-l border-border z-50 p-6 ${
          isOpen ? 'open' : ''
        }`}
        data-testid="cart-sidebar"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-foreground text-lg" data-testid="text-cart-title">
            Shopping Cart
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-close-cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        
        <div className="space-y-4 mb-6 overflow-y-auto max-h-[calc(100vh-200px)]" data-testid="cart-items">
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="text-empty-cart">
              Your cart is empty
            </p>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center space-x-3 p-3 border border-border rounded-lg"
                data-testid={`cart-item-${item.id}`}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded"
                  data-testid={`img-cart-item-${item.id}`}
                />
                <div className="flex-1">
                  <h4 
                    className="font-medium text-foreground text-sm"
                    data-testid={`text-cart-item-name-${item.id}`}
                  >
                    {item.name}
                  </h4>
                  <p 
                    className="text-muted-foreground text-sm"
                    data-testid={`text-cart-item-price-${item.id}`}
                  >
                    ₦{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      data-testid={`button-decrease-${item.id}`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </Button>
                    <span 
                      className="text-sm font-medium min-w-[20px] text-center"
                      data-testid={`text-quantity-${item.id}`}
                    >
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      data-testid={`button-increase-${item.id}`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="text-destructive hover:text-destructive/80 h-6 w-6 p-0"
                  data-testid={`button-remove-${item.id}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-foreground" data-testid="text-total-label">
                Total:
              </span>
              <span 
                className="font-bold text-primary text-lg"
                data-testid="text-cart-total"
              >
                ₦{totalAmount.toLocaleString()}
              </span>
            </div>
            <Button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              data-testid="button-whatsapp-order"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              Order via WhatsApp
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
