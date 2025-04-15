import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function CTASection() {
  let user = null;
  
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth provider not available yet");
  }

  return (
    <section className="mb-12 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-8 md:w-2/3">
          <h2 className="font-heading font-bold text-3xl mb-4">Ready to Transform Your Fitness Journey?</h2>
          <p className="mb-6 text-primary-light">Join FitConnect today and get matched with the perfect trainer for your goals.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            {!user ? (
              <>
                <Button 
                  asChild 
                  size="lg"
                  className="bg-white text-primary hover:bg-neutral-lightest font-bold"
                >
                  <Link href="/auth">Sign Up Now</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border border-white text-white hover:bg-white hover:text-primary font-bold"
                >
                  <Link href="/trainers">Learn More</Link>
                </Button>
              </>
            ) : (
              <Button 
                asChild 
                size="lg"
                className="bg-white text-primary hover:bg-neutral-lightest font-bold"
              >
                <Link href="/trainers">Find Your Trainer</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="md:w-1/3 bg-primary-dark hidden md:block relative">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <path fill="#FFFFFF" d="M55.2,-57.6C67.6,-45.2,71.3,-22.6,69.2,-2.1C67.1,18.3,59.3,36.6,46.9,45.5C34.6,54.5,17.3,54,-0.6,54.7C-18.5,55.3,-37,57,-47.1,48.2C-57.2,39.4,-58.9,20.2,-56.1,3.8C-53.3,-12.7,-46,-25.3,-36,-38.4C-26,-51.4,-13,-65,3.3,-68.3C19.6,-71.6,39.2,-64.6,55.2,-57.6Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
