import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { WorkoutCard } from "@/components/workouts/workout-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { WorkoutPlan } from "@shared/schema";

export default function WorkoutPlans() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  const { data: workoutPlans = [], isLoading } = useQuery<WorkoutPlan[]>({
    queryKey: ["/api/workout-plans"],
  });

  // Filter workout plans based on search, level, and duration
  const filteredWorkoutPlans = workoutPlans.filter((plan) => {
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = 
      levelFilter === "all" || 
      plan.level === levelFilter;
    
    const matchesDuration = 
      durationFilter === "all" || 
      (durationFilter === "short" && plan.duration <= 4) ||
      (durationFilter === "medium" && plan.duration > 4 && plan.duration <= 8) ||
      (durationFilter === "long" && plan.duration > 8);
    
    return matchesSearch && matchesLevel && matchesDuration;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Workout Plans</h1>
        <p className="text-muted-foreground mb-6">
          Discover workout plans designed by professional trainers to help you reach your fitness goals.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search workout plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="short">Short (up to 4 weeks)</SelectItem>
                <SelectItem value="medium">Medium (5-8 weeks)</SelectItem>
                <SelectItem value="long">Long (over 8 weeks)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredWorkoutPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkoutPlans.map((plan) => (
            <WorkoutCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No workout plans found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </main>
  );
}
