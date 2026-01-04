import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Zap, Cable, Cpu, Wifi, ExternalLink } from "lucide-react";
import { Product, useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const getProductIcon = (productId: string) => {
  switch (productId) {
    case 'xmrt-charger':
      return <Cpu className="h-12 w-12 text-primary" />;
    case 'cable-12ft':
      return <Cable className="h-12 w-12 text-primary" />;
    default:
      return <Zap className="h-12 w-12 text-primary" />;
  }
};

const getFeatureIcon = (feature: string) => {
  if (feature.includes('Charging') || feature.includes('Power')) return <Zap className="h-3 w-3" />;
  if (feature.includes('Wi-Fi') || feature.includes('LoRa')) return <Wifi className="h-3 w-3" />;
  if (feature.includes('Mining') || feature.includes('AI')) return <Cpu className="h-3 w-3" />;
  return <Zap className="h-3 w-3" />;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, totalItems } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    
    toast.success(
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex flex-col">
          <span className="font-semibold">{product.name} added!</span>
          <span className="text-sm text-muted-foreground">
            {totalItems + 1} item{totalItems + 1 !== 1 ? 's' : ''} in cart
          </span>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-1 shrink-0"
          onClick={() => {
            const cartButton = document.querySelector('[data-cart-trigger]') as HTMLButtonElement;
            cartButton?.click();
          }}
        >
          View Cart
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>,
      {
        duration: 4000,
        position: 'bottom-right',
      }
    );
    
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <Card className="h-full flex flex-col bg-card border-border hover:border-primary/50 transition-all duration-300 corporate-shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-4 rounded-full bg-secondary/50">
          {getProductIcon(product.id)}
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          {product.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {product.features.map((feature, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs flex items-center gap-1"
            >
              {getFeatureIcon(feature)}
              {feature}
            </Badge>
          ))}
        </div>
        
        <div className="text-center space-y-2">
          {product.originalPrice && (
            <div className="space-y-1">
              <Badge variant="destructive" className="text-xs font-bold">
                50% OFF PRE-RELEASE
              </Badge>
              <p className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            </div>
          )}
          <p className="text-3xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">USD</p>
        </div>

        <Button 
          onClick={handleAddToCart}
          className="w-full gap-2"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};
