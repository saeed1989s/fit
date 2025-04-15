import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { WorkoutCard } from "@/components/workouts/workout-card";
import { WorkoutPlan } from "@shared/schema";

interface WorkoutPlansProps {
  workoutPlans: WorkoutPlan[];
}

export default function WorkoutPlans({ workoutPlans }: WorkoutPlansProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl">Popular Workout Plans</h2>
        <Link href="/workout-plans">
          <a className="text-primary hover:text-primary-dark font-medium flex items-center">
            Browse All Plans
            <ChevronRight className="h-5 w-5 ml-1" />
          </a>
        </Link>
      </div>
      
      {workoutPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans.map((plan) => (
            <WorkoutCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No workout plans available yet</h3>
          <p className="text-muted-foreground mb-4">
            Check back soon as our trainers create workout plans, or register as a trainer to create your own!
          </p>
          <Link href="/trainers">
            <a className="inline-flex items-center justify-center font-medium text-primary hover:underline">
              Browse Trainers
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Link>
        </div>
      )}
    </section>
  );
}
