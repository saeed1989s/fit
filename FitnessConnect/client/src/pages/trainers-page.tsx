import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrainerCard } from "@/components/trainers/trainer-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, TrainerProfile } from "@shared/schema";
import { Loader2 } from "lucide-react";

type TrainerWithProfile = User & { trainerProfile?: TrainerProfile };

export default function TrainersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");

  const { data: trainers = [], isLoading } = useQuery<TrainerWithProfile[]>({
    queryKey: ["/api/trainers"],
  });

  // Filter trainers based on search and specialization
  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch = 
      trainer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trainer.bio && trainer.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (trainer.trainerProfile?.specialization && 
        trainer.trainerProfile.specialization.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialization = 
      specializationFilter === "all" || 
      (trainer.trainerProfile?.specialization && 
        trainer.trainerProfile.specialization.toLowerCase() === specializationFilter.toLowerCase());
    
    return matchesSearch && matchesSpecialization;
  });

  // Get unique specializations for the filter
  const specializations = trainers
    .map(trainer => trainer.trainerProfile?.specialization)
    .filter((spec): spec is string => !!spec)
    .filter((spec, index, self) => self.indexOf(spec) === index);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Perfect Trainer</h1>
        <p className="text-muted-foreground mb-6">
          Browse through our qualified trainers and find the perfect match for your fitness goals.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <Input
              placeholder="Search by name, specialty, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/3">
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec.toLowerCase()}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredTrainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No trainers found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </main>
  );
}
