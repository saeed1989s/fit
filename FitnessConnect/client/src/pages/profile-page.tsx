import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User, TrainerProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
});

const trainerProfileSchema = z.object({
  specialization: z.string().min(2, "Specialization must be at least 2 characters"),
  yearsOfExperience: z.coerce.number().min(0, "Years must be a positive number"),
  certifications: z.string().optional(),
  pricePerSession: z.coerce.number().min(0, "Price must be a positive number"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type TrainerProfileFormValues = z.infer<typeof trainerProfileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profileImage: user?.profileImage || "",
    },
  });

  const trainerProfileForm = useForm<TrainerProfileFormValues>({
    resolver: zodResolver(trainerProfileSchema),
    defaultValues: {
      specialization: "",
      yearsOfExperience: 0,
      certifications: "",
      pricePerSession: 0,
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", "/api/protected/profile", data);
      return await res.json();
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update trainer profile mutation
  const updateTrainerProfileMutation = useMutation({
    mutationFn: async (data: TrainerProfileFormValues) => {
      const res = await apiRequest("PUT", `/api/protected/trainer-profile/${user!.id}`, {
        ...data,
        // Convert price to cents for storage
        pricePerSession: data.pricePerSession * 100,
      });
      return await res.json();
    },
    onSuccess: (updatedProfile: TrainerProfile) => {
      toast({
        title: "Trainer profile updated",
        description: "Your trainer profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(data);
  }

  function onTrainerProfileSubmit(data: TrainerProfileFormValues) {
    updateTrainerProfileMutation.mutate(data);
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and settings
        </p>
      </div>

      <Tabs defaultValue="personal" className="mb-8">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          {user.role === "trainer" && (
            <TabsTrigger value="trainer">Trainer Profile</TabsTrigger>
          )}
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/your-image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself" 
                            className="min-h-32" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trainer Profile Tab */}
        {user.role === "trainer" && (
          <TabsContent value="trainer">
            <Card>
              <CardHeader>
                <CardTitle>Trainer Profile</CardTitle>
                <CardDescription>
                  Update your professional trainer information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...trainerProfileForm}>
                  <form onSubmit={trainerProfileForm.handleSubmit(onTrainerProfileSubmit)} className="space-y-6">
                    <FormField
                      control={trainerProfileForm.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Weight Loss, Strength Training, Yoga" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trainerProfileForm.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trainerProfileForm.control}
                      name="certifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certifications</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List your fitness certifications" 
                              className="min-h-32" 
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trainerProfileForm.control}
                      name="pricePerSession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Per Session ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={updateTrainerProfileMutation.isPending}
                    >
                      {updateTrainerProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </main>
  );
}
