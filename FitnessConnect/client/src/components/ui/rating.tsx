import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function Rating({ value, max = 5, size = "md" }: RatingProps) {
  // Ensure value is between 0 and max
  const rating = Math.max(0, Math.min(value, max));
  
  // Get size class based on the size prop
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];

  return (
    <div className="flex">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        return (
          <Star
            key={i}
            className={`${sizeClass} ${
              starValue <= rating
                ? "text-secondary fill-secondary"
                : "text-muted-foreground"
            }`}
          />
        );
      })}
    </div>
  );
}
