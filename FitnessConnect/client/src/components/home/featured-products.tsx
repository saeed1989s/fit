import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Product } from "@shared/schema";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl">Shop Fitness Essentials</h2>
        <Link href="/shop">
          <a className="text-primary hover:text-primary-dark font-medium flex items-center">
            View All Products
            <ChevronRight className="h-5 w-5 ml-1" />
          </a>
        </Link>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No products available yet</h3>
          <p className="text-muted-foreground">
            Our product catalog is being updated. Check back soon!
          </p>
        </div>
      )}
    </section>
  );
}
