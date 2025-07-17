// src/components/products/HorizontalProductCarousel.tsx
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductListItem, ProductListItemProps } from "./ProductListItem";

interface HorizontalProductCarouselProps {
  products: ProductListItemProps["product"][];
}

export function HorizontalProductCarousel({ products }: HorizontalProductCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Quantidade de scroll
      
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
      
      // Verificar a posição após um pequeno delay
      setTimeout(checkScrollPosition, 300);
    }
  };

  React.useEffect(() => {
    checkScrollPosition();
    
    const currentRef = scrollRef.current;
    currentRef?.addEventListener("scroll", checkScrollPosition);
    
    return () => {
      currentRef?.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-56">
            <ProductListItem product={product} />
          </div>
        ))}
      </div>
      
      {showLeftArrow && (
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {showRightArrow && (
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
