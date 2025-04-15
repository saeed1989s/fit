import { Users, ClipboardCheck, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="mb-12 bg-muted rounded-xl p-8">
      <h2 className="font-heading font-bold text-2xl mb-8 text-center">How FitConnect Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary bg-opacity-10 rounded-full p-4 mb-4">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <h3 className="font-heading font-bold text-lg mb-2">1. Find Your Trainer</h3>
          <p className="text-muted-foreground">
            Browse through our qualified trainers and find the perfect match for your fitness goals.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary bg-opacity-10 rounded-full p-4 mb-4">
            <ClipboardCheck className="h-10 w-10 text-primary" />
          </div>
          <h3 className="font-heading font-bold text-lg mb-2">2. Get Personalized Plans</h3>
          <p className="text-muted-foreground">
            Receive custom workout and nutrition plans designed specifically for your needs and goals.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary bg-opacity-10 rounded-full p-4 mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
          <h3 className="font-heading font-bold text-lg mb-2">3. Track Your Progress</h3>
          <p className="text-muted-foreground">
            Monitor your fitness journey and stay connected with your trainer for adjustments and support.
          </p>
        </div>
      </div>
    </section>
  );
}
