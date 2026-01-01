import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const WHATSAPP_NUMBER = "50661500559";
const EMAIL_ADDRESS = "xmrtsolutions@gmail.com";

export const CheckoutButtons = () => {
  const { items, totalPrice, clearCart } = useCart();

  const generateOrderId = () => {
    return `XMRT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  const formatOrderDetails = (orderId: string) => {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let itemsList = items.map(item => 
      `- ${item.name} x ${item.quantity} @ $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    return {
      orderId,
      date,
      itemsList,
      total: totalPrice.toFixed(2)
    };
  };

  const handleEmailCheckout = () => {
    const orderId = generateOrderId();
    const { date, itemsList, total } = formatOrderDetails(orderId);

    const subject = encodeURIComponent(`XMRT Charger Order - ${orderId}`);
    const body = encodeURIComponent(`=== XMRT CHARGER ORDER ===

Order ID: ${orderId}
Date: ${date}

ITEMS:
${itemsList}

TOTAL: $${total}

---
SHIPPING INFO:
(Please fill in your shipping address)

Name: 
Address:
City:
State/Province:
ZIP/Postal Code:
Country:
Phone:

---
Payment will be arranged after order confirmation.

Thank you for your order!`);

    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
  };

  const handleWhatsAppCheckout = () => {
    const orderId = generateOrderId();
    const { date, itemsList, total } = formatOrderDetails(orderId);

    const message = encodeURIComponent(`*XMRT CHARGER ORDER*

Order ID: ${orderId}
Date: ${date}

*ITEMS:*
${itemsList}

*TOTAL: $${total}*

---
Please reply with your shipping details:
- Name
- Address
- City, State, ZIP
- Country
- Phone`);

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleEmailCheckout}
        variant="outline"
        className="w-full gap-2"
        size="lg"
      >
        <Mail className="h-4 w-4" />
        Checkout via Email
      </Button>
      
      <Button
        onClick={handleWhatsAppCheckout}
        className="w-full gap-2 bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] text-white"
        size="lg"
      >
        <MessageCircle className="h-4 w-4" />
        Checkout via WhatsApp
      </Button>
    </div>
  );
};
