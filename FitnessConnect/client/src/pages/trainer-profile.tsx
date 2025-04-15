import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutCard } from "@/components/workouts/workout-card";
import { Rating } from "@/components/ui/rating";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2, MessageSquare, Star, Award, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User, TrainerProfile as TrainerProfileType, WorkoutPlan, NutritionPlan, Rating as RatingType } from "@shared/schema";

type TrainerWithProfile = User & { trainerProfile?: TrainerProfileType };

export default function TrainerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  // Fetch trainer data
  const { data: trainer, isLoading: isTrainerLoading } = useQuery<TrainerWithProfile>({
    queryKey: [`/api/trainers/${id}`],
  });

  // Fetch trainer's workout plans
  const { data: workoutPlans = [], isLoading: isWorkoutPlansLoading } = useQuery<WorkoutPlan[]>({
    queryKey: [`/api/trainers/${id}/workout-plans`],
    enabled: !!id,
  });

  // Fetch trainer's nutrition plans
  const { data: nutritionPlans = [], isLoading: isNutritionPlansLoading } = useQuery<NutritionPlan[]>({
    queryKey: [`/api/trainers/${id}/nutrition-plans`],
    enabled: !!id,
  });

  // Fetch trainer's ratings
  const { data: ratings = [], isLoading: isRatingsLoading } = useQuery<RatingType[]>({
    queryKey: [`/api/trainers/${id}/ratings`],
    enabled: !!id,
  });

  // Request connection mutation
  const requestConnectionMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to request a connection");
      if (user.role !== "athlete") throw new Error("Only athletes can request connections");
      
      const res = await apiRequest("POST", "/api/protected/connections", {
        trainerId: Number(id),
        status: "pending"
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Connection requested",
        description: "The trainer will be notified of your request.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to request connection",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to submit a rating");
      if (user.role !== "athlete") throw new Error("Only athletes can rate trainers");
      if (rating === 0) throw new Error("Please select a rating");
      
      const res = await apiRequest("POST", "/api/protected/ratings", {
        trainerId: Number(id),
        rating: rating,
        review: reviewText,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trainers/${id}/ratings`] });
      queryClient.invalidateQueries({ queryKey: [`/api/trainers/${id}`] });
      
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
      
      setReviewText("");
      setRating(0);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit rating",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Message trainer function
  const messageTrainer = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to message this trainer",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    // Navigate to messages with this trainer
    // This would typically go to a messaging interface
    toast({
      title: "Messaging coming soon",
      description: "This feature is under development",
    });
  };

  if (isTrainerLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Trainer Not Found</h1>
        <p className="mb-6">The trainer you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/trainers")}>Back to Trainers</Button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Trainer profile header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <div className="aspect-square relative overflow-hidden rounded-xl bg-muted">
            {trainer.profileImage ? (
              <img 
                src={trainer.profileImage} 
                alt={trainer.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="text-5xl font-bold text-primary/30">
                  {trainer.fullName.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{trainer.fullName}</h1>
          
          <div className="flex items-center mb-4">
            {trainer.trainerProfile?.rating ? (
              <div className="flex items-center">
                <Rating value={trainer.trainerProfile.rating} />
                <span className="ml-2 text-sm text-muted-foreground">
                  ({trainer.trainerProfile.ratingCount} reviews)
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No ratings yet</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {trainer.trainerProfile?.specialization && (
              <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                {trainer.trainerProfile.specialization}
              </span>
            )}
            {trainer.trainerProfile?.yearsOfExperience && (
              <span className="bg-secondary/10 text-secondary text-xs font-medium px-2.5 py-0.5 rounded-full">
                {trainer.trainerProfile.yearsOfExperience} years experience
              </span>
            )}
          </div>
          
          <p className="mb-6 text-muted-foreground">
            {trainer.bio || "This trainer hasn't added a bio yet."}
          </p>
          
          {trainer.trainerProfile?.certifications && (
            <div className="mb-6">
              <h3 className="font-medium mb-2 flex items-center">
                <Award className="h-4 w-4 mr-2" /> Certifications
              </h3>
              <p className="text-sm">{trainer.trainerProfile.certifications}</p>
            </div>
          )}
          
          {trainer.trainerProfile?.pricePerSession && trainer.trainerProfile.pricePerSession > 0 && (
            <div className="mb-6">
              <span className="font-bold text-lg text-primary">
                ${(trainer.trainerProfile.pricePerSession / 100).toFixed(2)}
              </span>
              <span className="text-muted-foreground"> per session</span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            {user && user.role === "athlete" && (
              <Button 
                onClick={() => requestConnectionMutation.mutate()}
                disabled={requestConnectionMutation.isPending}
              >
                {requestConnectionMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  "Request Training"
                )}
              </Button>
            )}
            
            <Button variant="outline" onClick={messageTrainer}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content tabs */}
      <Tabs defaultValue="plans" className="mt-8">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="plans">Plans & Programs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        {/* Plans tab */}
        <TabsContent value="plans">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Workout Plans</h2>
            {isWorkoutPlansLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : workoutPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workoutPlans.map((plan) => (
                  <WorkoutCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4">
                This trainer hasn't created any workout plans yet.
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Nutrition Plans</h2>
            {isNutritionPlansLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : nutritionPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nutritionPlans.map((plan) => (
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
              <p className="text-muted-foreground py-4">
                This trainer hasn't created any nutrition plans yet.
              </p>
            )}
          </div>
        </TabsContent>
        
        {/* Reviews tab */}
        <TabsContent value="reviews">
          <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
          
          {user && user.role === "athlete" && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">Leave a Review</h3>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="mr-2">Your Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${star <= rating ? "text-secondary fill-secondary" : "text-muted-foreground"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this trainer..."
                    className="mb-4"
                  />
                  <Button 
                    onClick={() => submitRatingMutation.mutate()}
                    disabled={submitRatingMutation.isPending || rating === 0}
                  >
                    {submitRatingMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isRatingsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : ratings.length > 0 ? (
            <div className="space-y-6">
              {ratings.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-primary">
                          A
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold">Athlete</h4>
                        <div className="flex">
                          <Rating value={review.rating} />
                        </div>
                      </div>
                      <div className="ml-auto text-sm text-muted-foreground">
                        {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {review.review && <p className="text-sm">{review.review}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">
              This trainer hasn't received any reviews yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
