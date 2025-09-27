interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const PHONE_NUMBER = '2348147485879';

export function openWhatsApp(cart: CartItem[], totalAmount: number) {
  let message = 'Hello! I would like to place an order:\n\n';
  
  cart.forEach(item => {
    message += `${item.name} - Qty: ${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}\n`;
  });
  
  message += `\nTotal: ₦${totalAmount.toLocaleString()}\n\nPlease let me know the next steps.`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

export function openWhatsAppInquiry() {
  const message = 'Hello! I am interested in your SHAAD-n-SHIFA kurta collection. Could you please provide more information about your products and services?';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}
