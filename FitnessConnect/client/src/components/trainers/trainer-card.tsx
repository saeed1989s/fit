import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { User, TrainerProfile } from "@shared/schema";

interface TrainerCardProps {
  trainer: User & { trainerProfile?: TrainerProfile };
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="relative pb-48">
        <img 
          className="absolute inset-0 h-full w-full object-cover" 
          src={trainer.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.fullName)}&background=3D5AFE&color=fff`} 
          alt={`Trainer ${trainer.fullName}`} 
        />
        {trainer.trainerProfile?.rating ? (
          <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
            {trainer.trainerProfile.rating} ★
          </span>
        ) : null}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-bold text-lg">{trainer.fullName}</h3>
          {trainer.trainerProfile?.specialization && (
            <span className="bg-primary-light bg-opacity-20 text-primary text-xs font-medium px-2 py-1 rounded-full">
              {trainer.trainerProfile.specialization}
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {trainer.bio || `Professional trainer specializing in ${trainer.trainerProfile?.specialization || 'fitness training'}.`}
        </p>
        <div className="flex items-center justify-between">
          {trainer.trainerProfile?.pricePerSession ? (
            <span className="text-accent-dark font-medium">
              ${(trainer.trainerProfile.pricePerSession / 100).toFixed(2)}/session
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">Contact for pricing</span>
          )}
          <Button asChild>
            <Link href={`/trainers/${trainer.id}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
