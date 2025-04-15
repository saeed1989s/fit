import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function HeroSection() {
  let user = null;
  
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth provider not available yet");
  }

  return (
    <section className="bg-primary text-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row">
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Connect with Elite Fitness Trainers
          </h1>
          <p className="text-primary-light mb-6">
            Get personalized workout plans, nutrition advice, and direct coaching from certified fitness professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild 
              size="lg"
              className="bg-secondary hover:bg-secondary-dark text-white font-bold"
            >
              <Link href="/trainers">Find a Trainer</Link>
            </Button>
            
            {!user && (
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="bg-white text-primary hover:bg-primary-light hover:text-white font-bold"
              >
                <Link href="/auth?tab=register&role=trainer">Register as Trainer</Link>
              </Button>
            )}
            
            {user && user.role === "trainer" && (
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="bg-white text-primary hover:bg-primary-light hover:text-white font-bold"
              >
                <Link href="/profile?tab=trainer">Manage Trainer Profile</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <img 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Trainer coaching athlete" 
          />
        </div>
      </div>
    </section>
  );
}
