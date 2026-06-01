import ProductCard from "./ProductCard";
import FadeIn from "./FadeIn";
import type { IProduct } from "@/types";

interface ProductGridProps {
  products: IProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gallery-gray text-sm">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {products.map((product, i) => (
        <FadeIn key={product.id} delay={i * 80}>
          <ProductCard product={product} />
        </FadeIn>
      ))}
    </div>
  );
}
