import { Mail, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export function ContactFooter() {
  const whatsappNumber = "+50661500559";
  const email = "xmrtsolutions@gmail.com";
  const message = "Hi, I need support with my XMRT Charger";

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleEmail = () => {
    window.open(`mailto:${email}?subject=XMRT Charger Support&body=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="max-w-md mx-auto flex justify-center gap-4">
        <Button onClick={handleWhatsApp} variant="outline" className="flex-1">
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp Support
        </Button>
        <Button onClick={handleEmail} variant="outline" className="flex-1">
          <Mail className="mr-2 h-4 w-4" />
          Email Support
        </Button>
      </div>
    </footer>
  );
}