import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";
import { Loader2 } from "lucide-react";
import { NutritionPlan } from "@shared/schema";

export default function NutritionPlans() {
  const [searchQuery, setSearchQuery] = useState("");
  const [goalFilter, setGoalFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  const { data: nutritionPlans = [], isLoading } = useQuery<NutritionPlan[]>({
    queryKey: ["/api/nutrition-plans"],
  });

  // Filter nutrition plans based on search, goal, and duration
  const filteredNutritionPlans = nutritionPlans.filter((plan) => {
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGoal = 
      goalFilter === "all" || 
      plan.goal === goalFilter;
    
    const matchesDuration = 
      durationFilter === "all" || 
      (durationFilter === "short" && plan.duration <= 4) ||
      (durationFilter === "medium" && plan.duration > 4 && plan.duration <= 8) ||
      (durationFilter === "long" && plan.duration > 8);
    
    return matchesSearch && matchesGoal && matchesDuration;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Nutrition Plans</h1>
        <p className="text-muted-foreground mb-6">
          Discover nutrition plans designed by professional trainers to complement your fitness journey.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search nutrition plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={goalFilter} onValueChange={setGoalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Goals</SelectItem>
                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
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
      ) : filteredNutritionPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNutritionPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                {plan.image ? (
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="text-xl font-bold text-primary/30">Nutrition Plan</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
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
                <h3 className="font-bold text-lg mb-2">{plan.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1 text-primary" />
                    <span>{plan.duration} weeks</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-primary" />
                    <span>Goal: {plan.goal.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${(plan.price / 100).toFixed(2)}</span>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No nutrition plans found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </main>
  );
}
