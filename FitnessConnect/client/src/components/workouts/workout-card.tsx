import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Zap } from "lucide-react";
import { WorkoutPlan } from "@shared/schema";

interface WorkoutCardProps {
  plan: WorkoutPlan;
}

export function WorkoutCard({ plan }: WorkoutCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="relative pb-48">
        {plan.image ? (
          <img 
            className="absolute inset-0 h-full w-full object-cover" 
            src={plan.image} 
            alt={plan.title} 
          />
        ) : (
          <div className="absolute inset-0 h-full w-full bg-primary-light bg-opacity-20 flex items-center justify-center">
            <span className="text-primary font-bold">Workout Plan</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center">
            {plan.trainer && (
              <>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
                  <span className="text-sm font-bold text-white">
                    {plan.trainer.fullName.charAt(0)}
                  </span>
                </div>
                <span className="text-white text-sm font-medium">By {plan.trainer.fullName}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-heading font-bold text-lg mb-2">{plan.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{plan.description}</p>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <div className="flex items-center mr-4">
            <Calendar className="h-5 w-5 mr-1 text-primary" />
            <span>{plan.duration} weeks</span>
          </div>
          <div className="flex items-center">
            <Zap className="h-5 w-5 mr-1 text-primary" />
            <span>{plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${(plan.price / 100).toFixed(2)}</span>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/workout-plans/${plan.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
