import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Zap, Cable, Cpu, Wifi } from "lucide-react";
import { Product, useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

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
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
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
        
        <div className="text-center">
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
