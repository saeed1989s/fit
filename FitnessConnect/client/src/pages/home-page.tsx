import HeroSection from "@/components/home/hero-section";
import FeaturedTrainers from "@/components/home/featured-trainers";
import WorkoutPlans from "@/components/home/workout-plans";
import HowItWorks from "@/components/home/how-it-works";
import FeaturedProducts from "@/components/home/featured-products";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  // Fetch trainers for featured trainers section
  const { data: trainers = [] } = useQuery({
    queryKey: ["/api/trainers"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch workout plans for featured workout plans section
  const { data: workoutPlans = [] } = useQuery({
    queryKey: ["/api/workout-plans"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch products for featured products section
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <HeroSection />
      <FeaturedTrainers trainers={trainers.slice(0, 3)} />
      <WorkoutPlans workoutPlans={workoutPlans.slice(0, 3)} />
      <HowItWorks />
      <FeaturedProducts products={products.slice(0, 4)} />
      <Testimonials />
      <CTASection />
    </main>
  );
}
