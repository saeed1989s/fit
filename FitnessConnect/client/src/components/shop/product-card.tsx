import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card 
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-w-1 aspect-h-1 relative">
        {product.image ? (
          <img 
            className="object-cover w-full h-48" 
            src={product.image} 
            alt={product.name} 
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-destructive text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-sm mb-1 truncate">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">${(product.price / 100).toFixed(2)}</span>
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-primary hover:text-primary-dark"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
        {isHovered && product.inStock && (
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
